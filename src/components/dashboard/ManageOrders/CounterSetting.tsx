import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Select,
  SelectItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { toast } from "react-hot-toast";
import { FiEdit, FiTrash } from "react-icons/fi";
import useGetAllEmploys from "@/hooks/GetDataHook/useGetAllEmploys";

interface Counter {
  _id?: string;
  counterNumber: string;
  counterName: string;
  status: "Active" | "Inactive";
  assignedTo: string;
}

const CounterSetting = () => {
  const [counters, setCounters] = useState<Counter[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCounter, setSelectedCounter] = useState<Counter | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Counter>({
    counterNumber: "",
    counterName: "",
    status: "Active",
    assignedTo: "",
  });

  const { employees } = useGetAllEmploys({
    setLoading,
  });

  useEffect(() => {
    fetchCounters();
  }, []);

  useEffect(() => {
    if (selectedCounter) {
      setFormData(selectedCounter);
    } else {
      setFormData({
        counterNumber: "",
        counterName: "",
        status: "Active",
        assignedTo: "",
      });
    }
  }, [selectedCounter]);

  const fetchCounters = async () => {
    try {
      const response = await window.ipcRenderer.invoke("get-all-counters");
      if (response.success) {
        setCounters(response.data);
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch counters");
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (!formData.counterNumber || !formData.counterName) {
        toast.error("Please fill in all required fields");
        return;
      }

      console.log(formData, "formData");

      const response = await window.ipcRenderer.invoke(
        selectedCounter ? "update-counter" : "create-counter",
        {
          id: selectedCounter?._id,
          data: formData,
        }
      );

      if (response.success) {
        toast.success(response.message);
        setIsModalOpen(false);
        setSelectedCounter(null);
        fetchCounters();
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to save counter");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await window.ipcRenderer.invoke("delete-counter", {
        id,
      });
      if (response.success) {
        toast.success(response.message);
        fetchCounters();
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete counter");
    }
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex justify-between">
          <h2 className="text-xl font-bold">Counter Management</h2>
          <Button
            color="primary"
            onPress={() => {
              setSelectedCounter(null);
              setIsModalOpen(true);
            }}
          >
            Add Counter
          </Button>
        </CardHeader>
        <CardBody>
          <Table aria-label="Counter management table">
            <TableHeader>
              <TableColumn>Counter Number</TableColumn>
              <TableColumn>Counter Name</TableColumn>
              <TableColumn>Status</TableColumn>
              <TableColumn>Assigned To</TableColumn>
              <TableColumn align="center">Actions</TableColumn>
            </TableHeader>
            <TableBody>
              {counters.map((counter) => (
                <TableRow key={counter._id}>
                  <TableCell>{counter.counterNumber}</TableCell>
                  <TableCell>{counter.counterName}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        counter.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {counter.status}
                    </span>
                  </TableCell>
                  <TableCell>{counter.assignedTo}</TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button
                        isIconOnly
                        color="warning"
                        size="sm"
                        onPress={() => {
                          setSelectedCounter(counter);
                          setIsModalOpen(true);
                        }}
                      >
                        <FiEdit />
                      </Button>
                      <Button
                        isIconOnly
                        color="danger"
                        size="sm"
                        onPress={() => handleDelete(counter._id!)}
                      >
                        <FiTrash />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {selectedCounter ? "Edit Counter" : "Add Counter"}
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Input
                    label="Counter Number"
                    placeholder="Enter counter number"
                    value={formData.counterNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        counterNumber: e.target.value,
                      })
                    }
                  />
                  <Input
                    label="Counter Name"
                    placeholder="Enter counter name"
                    value={formData.counterName}
                    onChange={(e) =>
                      setFormData({ ...formData, counterName: e.target.value })
                    }
                  />
                  <Select
                    label="Status"
                    selectedKeys={[formData.status]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as "Active" | "Inactive",
                      })
                    }
                  >
                    <SelectItem key="Active" value="Active">
                      Active
                    </SelectItem>
                    <SelectItem key="Inactive" value="Inactive">
                      Inactive
                    </SelectItem>
                  </Select>
                  {/* <Input
                    label="Assigned To"
                    placeholder="Enter assignee name"
                    value={formData.assignedTo}
                    onChange={(e) =>
                      setFormData({ ...formData, assignedTo: e.target.value })
                    }
                  /> */}
                  <Select
                    label="Assigned To"
                    defaultSelectedKeys={[formData.assignedTo]}
                    value={formData.assignedTo}
                    onChange={(e) => {
                      const employee = employees.find(
                        (item) => item._id === e.target.value
                      );
                      setFormData({
                        ...formData,
                        assignedTo: employee?.firstName,
                        assigned_member_id: e.target.value,
                      });
                    }}
                  >
                    {employees.map((item) => (
                      <SelectItem key={item._id} value={item._id}>
                        {item.firstName}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={handleSubmit}
                  isLoading={loading}
                >
                  {selectedCounter ? "Update" : "Create"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CounterSetting;

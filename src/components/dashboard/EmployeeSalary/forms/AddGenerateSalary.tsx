import { useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { toast } from "react-hot-toast";
import useGetAllEmploys from "@/hooks/GetDataHook/useGetAllEmploys";
import { fadeTopToBottom } from "@/utils/motion/fade-to-to-bottom";

interface Props {
  setIsShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  isShowModal: boolean;
  setIsRender: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AddGenerateSalary({
  setIsShowModal,
  isShowModal,
  setIsRender,
}: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    employee_id: "",
    startDate: "",
    endDate: "",
  });

  const { employees } = useGetAllEmploys({
    search: "",
    page: 1,
    limit: 100,
    isRender: false,
  });

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (!formData.employee_id || !formData.startDate || !formData.endDate) {
        toast.error("All fields are required");
        return;
      }

      const response = await window.ipcRenderer.invoke(
        "create-generate-salary",
        {
          data: {
            ...formData,
            generatedBy: "Joses Fernando",
          },
        }
      );

      if (response.success) {
        toast.success(response.message);
        handleReset();
        setIsRender((prev) => !prev);
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to generate salary");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      employee_id: "",
      startDate: "",
      endDate: "",
    });
    setIsShowModal(false);
  };

  return (
    <Modal
      isOpen={isShowModal}
      onOpenChange={setIsShowModal}
      placement="top"
      size="2xl"
      motionProps={fadeTopToBottom()}
    >
      <ModalContent>
        <ModalHeader>Generate Salary</ModalHeader>
        <ModalBody>
          <Select
            label="Employee"
            placeholder="Select employee"
            value={formData.employee_id}
            onChange={(e) =>
              setFormData({ ...formData, employee_id: e.target.value })
            }
          >
            {employees.map((employee: any) => (
              <SelectItem key={employee._id} value={employee._id}>
                {employee.firstName}
              </SelectItem>
            ))}
          </Select>

          <Input
            type="date"
            label="Start Date"
            placeholder="Start Date"
            value={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
          />

          <Input
            type="date"
            label="End Date"
            placeholder="End Date"
            value={formData.endDate}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
          />
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={handleReset}>
            Reset
          </Button>
          <Button color="primary" onPress={handleSubmit} isLoading={loading}>
            Generate
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

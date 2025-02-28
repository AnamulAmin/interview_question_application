import { useState, useEffect } from "react";
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
  Card,
  CardBody,
} from "@nextui-org/react";
import { toast } from "react-hot-toast";
import useGetAllEmploys from "@/hooks/GetDataHook/useGetAllEmploys";
import { fadeTopToBottom } from "@/utils/motion/fade-to-to-bottom";

interface Props {
  setIsShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  isShowModal: boolean;
  setIsRender: React.Dispatch<React.SetStateAction<boolean>>;
  data: any;
}

export default function EditGenerateSalary({
  setIsShowModal,
  isShowModal,
  setIsRender,
  data,
}: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    employee_id: "",
    startDate: "",
    endDate: "",
    medical: 0,
    houseRent: 0,
    new: 0,
    etcss: 0,
    yty: 0,
    monthly: 0,
    providentFund: 0,
    bima: 0,
    tax: 0,
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
        "update-generate-salary",
        {
          data: {
            ...formData,
            generatedBy: "Joses Fernando", // This should come from auth context
          },
          id: data._id,
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
      toast.error(error.message || "Failed to update generated salary");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      employee_id: "",
      startDate: "",
      endDate: "",
      medical: 0,
      houseRent: 0,
      new: 0,
      etcss: 0,
      yty: 0,
      monthly: 0,
      providentFund: 0,
      bima: 0,
      tax: 0,
    });
    setIsShowModal(false);
  };

  useEffect(() => {
    if (isShowModal && data) {
      setFormData({
        employee_id: data.employee_id || "",
        startDate: data.startDate
          ? new Date(data.startDate).toISOString().split("T")[0]
          : "",
        endDate: data.endDate
          ? new Date(data.endDate).toISOString().split("T")[0]
          : "",
        medical: data.medical || 0,
        houseRent: data.houseRent || 0,
        new: data.new || 0,
        etcss: data.etcss || 0,
        yty: data.yty || 0,
        monthly: data.monthly || 0,
        providentFund: data.providentFund || 0,
        bima: data.bima || 0,
        tax: data.tax || 0,
      });
    }
  }, [isShowModal, data]);

  // Calculate totals
  const totalAdditions =
    formData.medical +
    formData.houseRent +
    formData.new +
    formData.etcss +
    formData.yty +
    formData.monthly;

  const totalDeductions = formData.providentFund + formData.bima + formData.tax;

  const netSalary = totalAdditions - totalDeductions;

  return (
    <Modal
      isOpen={isShowModal}
      onOpenChange={setIsShowModal}
      placement="top"
      size="3xl"
      motionProps={fadeTopToBottom()}
    >
      <ModalContent className="min-w-[90%]">
        <ModalHeader>Edit Generated Salary</ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-4">
              <Select
                label="Employee"
                placeholder="Select employee"
                value={formData.employee_id}
                onChange={(e) =>
                  setFormData({ ...formData, employee_id: e.target.value })
                }
                defaultSelectedKeys={[data?.employee_id]}
                variant="bordered"
              >
                {employees.map((employee: any) => (
                  <SelectItem key={employee._id} value={employee._id}>
                    {employee.firstName}
                  </SelectItem>
                ))}
              </Select>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="date"
                  label="Start Date"
                  placeholder="Start Date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  color="primary"
                />

                <Input
                  type="date"
                  label="End Date"
                  placeholder="End Date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  color="secondary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card variant="bordered" color={"secondary"}>
                  <CardBody>
                    <h3 className="text-lg font-semibold mb-4">Additions</h3>
                    <div className="space-y-4">
                      {[
                        { key: "medical", label: "Medical" },
                        { key: "houseRent", label: "House Rent" },
                        { key: "new", label: "New" },
                        { key: "etcss", label: "ETCSS" },
                        { key: "yty", label: "YTY" },
                        { key: "monthly", label: "Monthly" },
                      ].map(({ key, label }) => (
                        <Input
                          key={key}
                          type="number"
                          label={label}
                          value={formData[
                            key as keyof typeof formData
                          ].toString()}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              [key]: parseFloat(e.target.value) || 0,
                            })
                          }
                          variant="bordered"
                        />
                      ))}
                    </div>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody>
                    <h3 className="text-lg font-semibold mb-4">Deductions</h3>
                    <div className="space-y-4">
                      {[
                        { key: "providentFund", label: "Provident Fund" },
                        { key: "bima", label: "Bima" },
                        { key: "tax", label: "Tax" },
                      ].map(({ key, label }) => (
                        <Input
                          key={key}
                          type="number"
                          label={label}
                          value={formData[
                            key as keyof typeof formData
                          ].toString()}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              [key]: parseFloat(e.target.value) || 0,
                            })
                          }
                          variant="bordered"
                        />
                      ))}
                    </div>
                  </CardBody>
                </Card>
              </div>

              <Card>
                <CardBody>
                  <div className="space-y-2">
                    <p className="text-lg">
                      Total Additions:{" "}
                      <span className="font-semibold">{totalAdditions}</span>
                    </p>
                    <p className="text-lg">
                      Total Deductions:{" "}
                      <span className="font-semibold">{totalDeductions}</span>
                    </p>
                    <p className="text-xl">
                      Net Salary:{" "}
                      <span className="font-semibold text-primary">
                        {netSalary}
                      </span>
                    </p>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={handleReset}>
            Reset
          </Button>
          <Button color="primary" onPress={handleSubmit} isLoading={loading}>
            Update
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

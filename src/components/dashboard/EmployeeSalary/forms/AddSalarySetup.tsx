import { useState, useMemo } from "react";
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
import useGetAllSalaryType from "@/hooks/GetDataHook/useGetAllSalaryType";

interface Props {
  setIsShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  isShowModal: boolean;
  setIsRender: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AddSalarySetup({
  setIsShowModal,
  isShowModal,
  setIsRender,
}: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<any>({
    employee_id: "",
    medical: 0,
    houseRent: 0,
    new: 0,
    etcss: 0,
    yty: 0,
    monthly: 0,
    providentFund: 0,
    bima: 0,
    tax: 0,
    salaryType: "",
    employeeName: "",
  });

  const { salaryTypes } = useGetAllSalaryType({});

  const { employees } = useGetAllEmploys({
    search: "",
    page: 1,
    limit: 100,
    isRender: false,
  });

  const totalAdditions = useMemo(() => {
    return (
      formData.medical +
      formData.houseRent +
      formData.new +
      formData.etcss +
      formData.yty +
      formData.monthly
    );
  }, [formData]);

  const totalDeductions = useMemo(() => {
    return formData.providentFund + formData.bima + formData.tax;
  }, [formData]);

  const netSalary = useMemo(() => {
    return totalAdditions - totalDeductions;
  }, [totalAdditions, totalDeductions]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (!formData.employee_id) {
        toast.error("Employee is required");
        return;
      }

      formData.totalAdditions = totalAdditions;
      formData.totalDeductions = totalDeductions;
      formData.netSalary = netSalary;
      console.log(formData, "formData");

      const response = await window.ipcRenderer.invoke("create-salary-setup", {
        data: formData,
      });

      if (response.success) {
        toast.success(response.message);
        handleReset();
        setIsRender((prev) => !prev);
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create salary setup");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      employee_id: "",
      medical: 0,
      houseRent: 0,
      month: 0,
      new: 0,
      etcss: 0,
      yty: 0,
      monthly: 0,
      providentFund: 0,
      bima: 0,
      tax: 0,
      salaryType: "",
      employeeName: "",
    });
    setIsShowModal(false);
  };

  return (
    <Modal
      isOpen={isShowModal}
      onOpenChange={setIsShowModal}
      placement="top"
      size="4xl"
      motionProps={fadeTopToBottom()}
    >
      <ModalContent>
        <ModalHeader>Add Salary Setup</ModalHeader>
        <ModalBody>
          <Select
            label="Employee Name"
            value={formData.employee_id}
            onChange={(e) => {
              console.log(e.target.value, "e.target.value");

              const employee = employees.find(
                (employee) => employee?._id === e.target.value
              );
              console.log(employee, "employee");

              setFormData({
                ...formData,
                employee_id: e.target.value,
                employeeName: employee?.firstName,
              });
            }}
          >
            {employees.map((employee) => (
              <SelectItem key={employee?._id} value={employee?._id}>
                {employee?.firstName}
              </SelectItem>
            ))}
          </Select>
          <Select
            label="Employee Name"
            value={formData.salaryType}
            onChange={(e) => {
              console.log(e.target.value, "e.target.value");

              setFormData({ ...formData, salaryType: e.target.value });
            }}
            color="secondary"
          >
            {salaryTypes.map((salaryType) => (
              <SelectItem
                key={salaryType?.salaryType}
                value={salaryType?.salaryType}
              >
                {salaryType?.salaryType}
              </SelectItem>
            ))}
          </Select>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Additions</h3>
              {Object.entries({
                medical: "Medical",
                houseRent: "House Rent",
                new: "New",
                etcss: "Etcss",
                yty: "YTY",
                monthly: "Monthly",
              }).map(([key, label]) => (
                <Input
                  key={key}
                  type="number"
                  label={`${label} (%)`}
                  value={formData[key].toString()}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [key]: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="mb-4"
                />
              ))}
            </div>
            <div>
              <h3 className="font-semibold">Deductions</h3>
              {Object.entries({
                providentFund: "Provident Fund",
                bima: "Bima",
                tax: "Tax",
              }).map(([key, label]) => (
                <Input
                  key={key}
                  type="number"
                  label={`${label} (%)`}
                  value={formData[key].toString()}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [key]: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="mb-4"
                />
              ))}
            </div>
          </div>

          <div className="mt-4">
            <p className="font-semibold">
              Total Additions: {totalAdditions.toFixed(2)}%
            </p>
            <p className="font-semibold">
              Total Deductions: {totalDeductions.toFixed(2)}%
            </p>
            <p className="font-semibold">Net Salary: {netSalary.toFixed(2)}%</p>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={handleReset}>
            Reset
          </Button>
          <Button color="primary" onPress={handleSubmit} isLoading={loading}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

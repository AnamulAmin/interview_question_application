import { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { toast } from "react-hot-toast";
import useGetAllEmploys from "@/hooks/GetDataHook/useGetAllEmploys";

interface EditGrantLoanProps {
  isShowModal: boolean;
  setIsShowModal: (value: boolean) => void;
  setIsRender: (value: boolean) => void;
  data: any;
}

export default function EditGrantLoan({
  isShowModal,
  setIsShowModal,
  setIsRender,
  data,
}: EditGrantLoanProps): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    employeeName: "",
    employee_id: "",
    permittedBy: "",
    permitter_id: "",
    loanDetails: "",
    approveDate: "",
    repaymentFrom: "",
    amount: "",
    interestPercentage: "",
    installmentPeriod: "",
    repaymentTotal: "",
    installment: "",
    status: "Granted",
  });

  const { employees } = useGetAllEmploys({
    setLoading,
  });

  useEffect(() => {
    if (data) {
      setFormData({
        employeeName: data.employeeName || "",
        permittedBy: data.permittedBy || "",
        employee_id: data.employee_id || "",
        permitter_id: data.permitter_id || "",
        loanDetails: data.loanDetails || "",
        approveDate: data.approveDate || "",
        repaymentFrom: data.repaymentFrom || "",
        amount: data.amount?.toString() || "",
        interestPercentage: data.interestPercentage?.toString() || "",
        installmentPeriod: data.installmentPeriod?.toString() || "",
        repaymentTotal: data.repaymentTotal?.toString() || "",
        installment: data.installment?.toString() || "",
        status: data.status || "Granted",
      });
    }
  }, [data]);

  const handleSubmit = async () => {
    console.log(formData, "formData");
    try {
      setLoading(true);
      const response = await window.ipcRenderer.invoke("update-loan", {
        id: data._id,
        ...formData,
      });

      if (response.success) {
        toast.success(response.message);
        setIsShowModal(false);
        setIsRender((prev) => !prev);
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update loan");
    } finally {
      setLoading(false);
    }
  };

  const calculateRepaymentTotal = () => {
    const amount = parseFloat(formData.amount) || 0;
    const interestPercentage = parseFloat(formData.interestPercentage) || 0;
    const interest = (amount * interestPercentage) / 100;
    const total = amount + interest;
    setFormData((prev) => ({
      ...prev,
      repaymentTotal: total.toString(),
      installment: (
        total / (parseInt(formData.installmentPeriod) || 1)
      ).toFixed(2),
    }));
  };

  return (
    <Modal
      isOpen={isShowModal}
      onOpenChange={setIsShowModal}
      placement="top-center"
      size="2xl"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Edit Loan</ModalHeader>
            <ModalBody>
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Employee Name"
                  placeholder="Select employee"
                  value={formData.employeeName}
                  onChange={(e) => {
                    const selectedEmployee = employees.find(
                      (employee) => employee._id === e.target.value
                    );
                    console.log("selectedEmployee", selectedEmployee);

                    setFormData((prev: any) => ({
                      ...prev,
                      employee_id: e.target.value,
                      employeeName: selectedEmployee?.firstName,
                    }));
                  }}
                  isRequired
                >
                  {employees.map((employee) => (
                    <SelectItem key={employee._id} value={employee.firstName}>
                      {employee.firstName}
                    </SelectItem>
                  ))}
                </Select>

                <Select
                  label="Permitted By"
                  placeholder="Select who permitted"
                  value={formData.permittedBy}
                  onChange={(e: any) => {
                    const selectedEmployee = employees.find(
                      (employee) => employee._id === e.target.value
                    );

                    setFormData((prev: any) => ({
                      ...prev,
                      permitter_id: e.target.value,
                      permittedBy: selectedEmployee?.firstName,
                    }));
                  }}
                  isRequired
                >
                  {employees.map((employee) => (
                    <SelectItem key={employee._id} value={employee.firstName}>
                      {employee.firstName}
                    </SelectItem>
                  ))}
                </Select>

                <Textarea
                  label="Loan Details"
                  placeholder="Enter loan details"
                  value={formData.loanDetails}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      loanDetails: e.target.value,
                    }))
                  }
                  className="col-span-2"
                />

                <Input
                  type="date"
                  label="Approve Date"
                  placeholder="Select approve date"
                  value={formData.approveDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      approveDate: e.target.value,
                    }))
                  }
                  isRequired
                />

                <Input
                  type="date"
                  label="Repayment From"
                  placeholder="Select repayment start date"
                  value={formData.repaymentFrom}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      repaymentFrom: e.target.value,
                    }))
                  }
                  isRequired
                />

                <Input
                  type="number"
                  label="Amount"
                  placeholder="Enter amount"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      amount: e.target.value,
                    }))
                  }
                  onBlur={calculateRepaymentTotal}
                  isRequired
                />

                <Input
                  type="number"
                  label="Interest Percentage"
                  placeholder="Enter interest percentage"
                  value={formData.interestPercentage}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      interestPercentage: e.target.value,
                    }))
                  }
                  onBlur={calculateRepaymentTotal}
                  isRequired
                />

                <Input
                  type="number"
                  label="Installment Period (Months)"
                  placeholder="Enter installment period"
                  value={formData.installmentPeriod}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      installmentPeriod: e.target.value,
                    }))
                  }
                  onBlur={calculateRepaymentTotal}
                  isRequired
                />

                <Input
                  type="number"
                  label="Repayment Total"
                  value={formData.repaymentTotal}
                  isReadOnly
                />

                <Input
                  type="number"
                  label="Installment Amount"
                  value={formData.installment}
                  isReadOnly
                />

                <Select
                  label="Status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                  isRequired
                >
                  <SelectItem key="granted" value="Granted">
                    Granted
                  </SelectItem>
                  <SelectItem key="pending" value="Pending">
                    Pending
                  </SelectItem>
                  <SelectItem key="rejected" value="Rejected">
                    Rejected
                  </SelectItem>
                </Select>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Close
              </Button>
              <Button
                color="primary"
                onPress={handleSubmit}
                isLoading={loading}
              >
                Update
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

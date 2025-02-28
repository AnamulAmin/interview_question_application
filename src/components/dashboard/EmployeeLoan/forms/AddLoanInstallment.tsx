import { useState } from "react";
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
} from "@nextui-org/react";
import { toast } from "react-hot-toast";
import useGetAllLoans from "@/hooks/GetDataHook/useGetAllLoans";

interface AddLoanInstallmentProps {
  isShowModal: boolean;
  setIsShowModal: (value: boolean) => void;
  setIsRender: (value: boolean) => void;
}

export default function AddLoanInstallment({
  isShowModal,
  setIsShowModal,
  setIsRender,
}: AddLoanInstallmentProps): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>({
    loan_id: "",
    employee_id: "",
    installmentAmount: "",
    payment: "",
    date: "",
    receiver: "",
    installNo: "",
    notes: "",
    status: "Pending",
    employeeName: "",
    loanNo: "",
  });

  const { loans } = useGetAllLoans({
    search: "",
    page: 1,
    limit: 100,
    isRender: false,
  });

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await window.ipcRenderer.invoke(
        "create-loan-installment",
        {
          ...formData,
        }
      );

      if (response.success) {
        toast.success(response.message);
        setIsShowModal(false);
        setIsRender((prev) => !prev);
        setFormData({
          loan_id: "",
          employee_id: "",
          installmentAmount: "",
          payment: "",
          date: "",
          receiver: "",
          installNo: "",
          notes: "",
          status: "Pending",
          employeeName: "",
          loanNo: "",
        });
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create loan installment");
    } finally {
      setLoading(false);
    }
  };

  const handleLoanSelect = (loanId: string) => {
    const selectedLoan = loans.find((loan) => loan._id === loanId);
    if (selectedLoan) {
      setFormData((prev: any) => ({
        ...prev,
        loan_id: loanId,
        employee_id: selectedLoan.employee_id,
        installmentAmount: selectedLoan.installment,
        employeeName: selectedLoan.employeeName,
        loanNo: selectedLoan.loanNo,
      }));
    }
  };

  return (
    <Modal
      isOpen={isShowModal}
      onOpenChange={(open) => setIsShowModal(open)}
      placement="top-center"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Add Loan Installment
            </ModalHeader>
            <ModalBody>
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Loan"
                  placeholder="Select loan"
                  value={formData.loan_id}
                  onChange={(e) => handleLoanSelect(e.target.value)}
                  isRequired
                >
                  {loans.map((loan) => (
                    <SelectItem key={loan._id} value={loan._id}>
                      {loan.loanNo}
                    </SelectItem>
                  ))}
                </Select>

                <Input
                  type="number"
                  label="Installment Amount"
                  placeholder="Enter installment amount"
                  value={formData.installmentAmount}
                  onChange={(e) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      installmentAmount: e.target.value,
                    }))
                  }
                  isRequired
                />

                <Input
                  type="number"
                  label="Payment"
                  placeholder="Enter payment amount"
                  value={formData.payment}
                  onChange={(e) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      payment: e.target.value,
                    }))
                  }
                  isRequired
                />

                <Input
                  type="date"
                  label="Date"
                  placeholder="Select date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      date: e.target.value,
                    }))
                  }
                  isRequired
                />

                <Input
                  label="Receiver"
                  placeholder="Enter receiver name"
                  value={formData.receiver}
                  onChange={(e) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      receiver: e.target.value,
                    }))
                  }
                  isRequired
                />

                <Input
                  type="number"
                  label="Install No"
                  placeholder="Enter installment number"
                  value={formData.installNo}
                  onChange={(e) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      installNo: e.target.value,
                    }))
                  }
                  isRequired
                />

                <Input
                  label="Notes"
                  placeholder="Enter notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                />

                <Select
                  label="Status"
                  placeholder="Select status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                  isRequired
                >
                  <SelectItem key="Paid" value="Paid">
                    Paid
                  </SelectItem>
                  <SelectItem key="Pending" value="Pending">
                    Pending
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
                Add
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

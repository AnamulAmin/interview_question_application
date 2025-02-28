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
import { fadeTopToBottom } from "@/utils/motion/fade-to-to-bottom";
import useGetAllBanks from "@/hooks/GetDataHook/useGetAllBanks";

interface AddBankTransactionProps {
  isShowModal: boolean;
  setIsShowModal: (value: boolean) => void;
  setIsRender: (value: boolean) => void;
}

export default function AddBankTransaction({
  isShowModal,
  setIsShowModal,
  setIsRender,
}: AddBankTransactionProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    accountType: "Debit",
    bankId: "",
    transactionId: "",
    amount: "",
    description: "",
  });

  const { banks } = useGetAllBanks({ limit: "100" });

  const handleSubmit = async () => {
    try {
      if (
        !formData.date ||
        !formData.accountType ||
        !formData.bankId ||
        !formData.transactionId ||
        !formData.amount ||
        !formData.description
      ) {
        toast.error("Please fill all required fields");
        return;
      }

      const response = await window.ipcRenderer.invoke("create-bank-transaction", {
        data: {
          ...formData,
          amount: parseFloat(formData.amount),
        },
      });

      if (response.success) {
        toast.success(response.message);
        setIsShowModal(false);
        setIsRender((prev) => !prev);
        setFormData({
          date: new Date().toISOString().split("T")[0],
          accountType: "Debit",
          bankId: "",
          transactionId: "",
          amount: "",
          description: "",
        });
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <Modal
      isOpen={isShowModal}
      onOpenChange={setIsShowModal}
      motionProps={fadeTopToBottom}
      placement="top-center"
      size="2xl"
    >
      <ModalContent>
        <ModalHeader>Add New Transaction</ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="date"
              label="Date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              isRequired
            />

            <Select
              label="Account Type"
              value={formData.accountType}
              onChange={(e) =>
                setFormData({ ...formData, accountType: e.target.value })
              }
              isRequired
            >
              <SelectItem key="Debit" value="Debit">
                Debit
              </SelectItem>
              <SelectItem key="Credit" value="Credit">
                Credit
              </SelectItem>
            </Select>

            <Select
              label="Bank"
              value={formData.bankId}
              onChange={(e) =>
                setFormData({ ...formData, bankId: e.target.value })
              }
              isRequired
            >
              {banks?.map((bank: any) => (
                <SelectItem key={bank._id} value={bank._id}>
                  {bank.bankName}
                </SelectItem>
              ))}
            </Select>

            <Input
              label="Transaction ID"
              value={formData.transactionId}
              onChange={(e) =>
                setFormData({ ...formData, transactionId: e.target.value })
              }
              isRequired
            />

            <Input
              type="number"
              label="Amount"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              isRequired
            />

            <Input
              label="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              isRequired
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            variant="light"
            onPress={() => setIsShowModal(false)}
          >
            Cancel
          </Button>
          <Button color="primary" onPress={handleSubmit}>
            Add Transaction
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

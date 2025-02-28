import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { toast } from "react-hot-toast";
import { fadeTopToBottom } from "@/utils/motion/fade-to-to-bottom";

interface AddBankProps {
  isShowModal: boolean;
  setIsShowModal: (value: boolean) => void;
  setIsRender: (value: boolean) => void;
}

export default function AddBank({
  isShowModal,
  setIsShowModal,
  setIsRender,
}: AddBankProps) {
  const [formData, setFormData] = useState({
    bankName: "",
    accountName: "",
    accountNumber: "",
    branch: "",
    balance: "",
    signaturePicture: "",
  });

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (
        !formData.bankName ||
        !formData.accountName ||
        !formData.accountNumber ||
        !formData.branch ||
        !formData.signaturePicture
      ) {
        toast.error("Please fill in all required fields");
        return;
      }

      console.log(formData, "formData");

      const response = await window.ipcRenderer.invoke("create-bank", {
        data: {
          ...formData,
          balance: parseFloat(formData.balance) || 0,
        },
      });

      if (response.success) {
        toast.success(response.message);
        setIsShowModal(false);
        setIsRender((prev) => !prev);
        setFormData({
          bankName: "",
          accountName: "",
          accountNumber: "",
          branch: "",
          balance: "",
          signaturePicture: "",
        });
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create bank");
    }
  };

  return (
    <Modal
      isOpen={isShowModal}
      onOpenChange={setIsShowModal}
      size="2xl"
      motionProps={fadeTopToBottom()}
    >
      <ModalContent>
        <ModalHeader>Add New Bank</ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="text"
              label="Bank Name"
              placeholder="Bank Name"
              value={formData.bankName}
              onChange={(e) =>
                setFormData({ ...formData, bankName: e.target.value })
              }
              variant="bordered"
              isRequired
            />

            <Input
              type="text"
              label="A/C Name"
              placeholder="A/C Name"
              value={formData.accountName}
              onChange={(e) =>
                setFormData({ ...formData, accountName: e.target.value })
              }
              variant="bordered"
              isRequired
            />

            <Input
              type="text"
              label="A/C Number"
              placeholder="A/C Number"
              value={formData.accountNumber}
              onChange={(e) =>
                setFormData({ ...formData, accountNumber: e.target.value })
              }
              variant="bordered"
              isRequired
            />

            <Input
              type="text"
              label="Branch"
              placeholder="Branch"
              value={formData.branch}
              onChange={(e) =>
                setFormData({ ...formData, branch: e.target.value })
              }
              variant="bordered"
              isRequired
            />

            <Input
              type="number"
              label="Balance"
              placeholder="Balance"
              value={formData.balance}
              onChange={(e) =>
                setFormData({ ...formData, balance: e.target.value })
              }
              variant="bordered"
            />

            <Input
              type="file"
              label="Signature Picture"
              placeholder="Choose File"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setFormData({
                      ...formData,
                      signaturePicture: reader.result as string,
                    });
                  };
                  reader.readAsDataURL(file);
                }
              }}
              variant="bordered"
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
            Add Bank
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

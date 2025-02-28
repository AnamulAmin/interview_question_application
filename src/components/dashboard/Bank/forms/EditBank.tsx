import { useEffect, useState } from "react";
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

interface EditBankProps {
  isShowModal: boolean;
  setIsShowModal: (value: boolean) => void;
  data: any;
  setIsRender: (value: boolean) => void;
}

export default function EditBank({
  isShowModal,
  setIsShowModal,
  data,
  setIsRender,
}: EditBankProps) {
  const [formData, setFormData] = useState({
    bankName: "",
    accountName: "",
    accountNumber: "",
    branch: "",
    balance: "",
    signaturePicture: "",
  });

  useEffect(() => {
    if (data) {
      setFormData({
        bankName: data.bankName || "",
        accountName: data.accountName || "",
        accountNumber: data.accountNumber || "",
        branch: data.branch || "",
        balance: data.balance?.toString() || "",
        signaturePicture: data.signaturePicture || "",
      });
    }
  }, [data]);

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

      const response = await window.ipcRenderer.invoke("update-bank", {
        data: {
          ...formData,
          balance: parseFloat(formData.balance) || 0,
        },
        id: data._id,
      });

      if (response.success) {
        toast.success(response.message);
        setIsShowModal(false);
        setIsRender((prev) => !prev);
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update bank");
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
        <ModalHeader>Edit Bank</ModalHeader>
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

            <div className="space-y-2">
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
              />
              {formData.signaturePicture && (
                <img
                  src={formData.signaturePicture}
                  alt="Signature"
                  className="w-20 h-10 object-contain"
                />
              )}
            </div>
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
            Update Bank
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

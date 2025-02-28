import { useState } from "react";
import { Input } from "@nextui-org/input";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { fadeTopToBottom } from "@/utils/motion/fade-to-to-bottom";
import { toast } from "react-hot-toast";

interface Props {
  setIsShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  isShowModal: boolean | undefined;
}

export default function AddCardTerminal({
  setIsShowModal,
  isShowModal,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    card_terminal_name: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.card_terminal_name.trim()) {
      newErrors.card_terminal_name = "Card terminal name is required";
    }
    return newErrors;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      const response = await window.ipcRenderer.invoke("create-card-terminal", {
        data: formData,
      });

      if (response.success) {
        toast.success(response.message);
        handleReset();
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create card terminal");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({ card_terminal_name: "" });
    setErrors({});
    setIsShowModal(false);
    setLoading(false);
  };

  return (
    <Modal
      isOpen={isShowModal}
      onOpenChange={setIsShowModal}
      motionProps={fadeTopToBottom()}
    >
      <ModalContent>
        <ModalHeader>Add Card Terminal</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <Input
              label="Card Terminal Name"
              value={formData.card_terminal_name}
              onChange={(e) =>
                setFormData({ ...formData, card_terminal_name: e.target.value })
              }
              errorMessage={errors.card_terminal_name}
              isInvalid={!!errors.card_terminal_name}
              isRequired
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={handleReset}>
            Cancel
          </Button>
          <Button color="primary" onPress={handleSubmit} isLoading={loading}>
            Add Terminal
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

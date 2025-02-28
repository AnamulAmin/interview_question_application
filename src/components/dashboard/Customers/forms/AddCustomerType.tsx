import { useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Input,
} from "@nextui-org/react";
import Swal from "sweetalert2";

interface Props {
  setIsShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  isShowModal: boolean | undefined;
}

export default function AddCustomerType({
  setIsShowModal,
  isShowModal,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type_name: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.type_name.trim()) {
      newErrors.type_name = "Type name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await window.ipcRenderer.invoke("create-customer-type", {
        data: formData,
      });

      if (response.success) {
        Swal.fire({
          title: "Success!",
          text: response.message,
          icon: "success",
          confirmButtonText: "Ok",
        });
        handleClose();
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      Swal.fire({
        title: "Error!",
        text: error.message || "Something went wrong",
        icon: "error",
        confirmButtonText: "Ok",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ type_name: "" });
    setErrors({});
    setIsShowModal(false);
  };

  return (
    <Modal
      isOpen={isShowModal}
      onOpenChange={setIsShowModal}
      placement="top-center"
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          },
        },
      }}
    >
      <ModalContent>
        <ModalHeader>Add Customer Type</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <Input
              label="Type name"
              value={formData.type_name}
              onChange={(e) =>
                setFormData({ ...formData, type_name: e.target.value })
              }
              isRequired
              errorMessage={errors.type_name}
              isInvalid={!!errors.type_name}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={handleClose}>
            Close
          </Button>
          <Button color="primary" onPress={handleSubmit} isLoading={loading}>
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

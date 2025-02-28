import { useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Input,
  Textarea,
} from "@nextui-org/react";
import Swal from "sweetalert2";

interface Props {
  setIsShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  isShowModal: boolean | undefined;
}

export default function AddCustomer({ setIsShowModal, isShowModal }: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    customer_name: "",
    email: "",
    mobile: "",
    password: "",
    address: "",
    favorite_address: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const requiredFields = ["customer_name", "email", "mobile"];

    requiredFields.forEach((field) => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field] = `${field.replace("_", " ")} is required`;
      }
    });

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Mobile validation
    if (formData.mobile && !/^\d{10,}$/.test(formData.mobile)) {
      newErrors.mobile = "Please enter a valid mobile number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await window.ipcRenderer.invoke("create-customer", {
        data: formData,
      });

      if (response.success) {
        Swal.fire({
          title: "Success!",
          text: "Customer added successfully",
          icon: "success",
        });
        handleClose();
      } else {
        throw new Error(response.message || "Failed to add customer");
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.message || "Something went wrong",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      customer_name: "",
      email: "",
      mobile: "",
      password: "",
      address: "",
      favorite_address: "",
    });
    setErrors({});
    setIsShowModal(false);
  };

  return (
    <Modal
      isOpen={isShowModal}
      onOpenChange={setIsShowModal}
      motionProps={{
        initial: { y: "-100%" },
        animate: { y: 0 },
        exit: { y: "100%" },
        transition: { duration: 0.3, ease: "easeInOut" },
      }}
    >
      <ModalContent>
        <ModalHeader>Add Customer</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <Input
              label="Customer name"
              value={formData.customer_name}
              onChange={(e) =>
                setFormData({ ...formData, customer_name: e.target.value })
              }
              isRequired
              errorMessage={errors.customer_name}
              isInvalid={!!errors.customer_name}
            />

            <Input
              label="Email Address"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              isRequired
              errorMessage={errors.email}
              isInvalid={!!errors.email}
            />

            <Input
              label="Mobile"
              value={formData.mobile}
              onChange={(e) =>
                setFormData({ ...formData, mobile: e.target.value })
              }
              isRequired
              errorMessage={errors.mobile}
              isInvalid={!!errors.mobile}
            />

            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />

            <Textarea
              label="Address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />

            <Textarea
              label="Favourite Address"
              value={formData.favorite_address}
              onChange={(e) =>
                setFormData({ ...formData, favorite_address: e.target.value })
              }
            />

            <div className="flex justify-end gap-2 mt-4">
              <Button color="danger" variant="light" onPress={handleClose}>
                Close
              </Button>
              <Button
                color="success"
                onPress={handleSubmit}
                isLoading={loading}
              >
                Submit
              </Button>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

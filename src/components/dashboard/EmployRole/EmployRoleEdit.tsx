import React, { useState, FormEvent, useEffect } from "react";
import Swal from "sweetalert2";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { fadeTopToBottom } from "@/utils/motion/fade-to-to-bottom";

interface EditInventoryTrackingFormProps {
  isShowModal: boolean;
  data: any;
  setIsShowModal: (value: boolean) => void;
}

const EmployRoleEdit: React.FC<EditInventoryTrackingFormProps> = ({
  isShowModal,
  data,
  setIsShowModal,
}) => {
  const [loading, setLoading] = useState<any>(false);

  const [formData, setFormData] = useState<any>({
    role: "",
  });

  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const validateForm = (): Record<string, string | undefined> => {
    const newErrors: Record<string, string | undefined> = {};
    const requiredFields = ["role"];
    requiredFields.forEach((field) => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field] = `${field} is required.`;
      }
    });
    return newErrors;
  };

  const handleInputChange = (key: string, value: any) => {
    console.log(key, value);
    setFormData((prev: any) => ({
      ...prev,
      [key]: value,
    }));
    if (errors[key]) {
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        [key]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      Swal.fire({
        title: "Error!",
        text: "Please fix the validation errors.",
        icon: "error",
        confirmButtonText: "Ok",
      });
      setLoading(false);
      return;
    }

    const receiveData = await window.ipcRenderer.invoke("update-stuff-role", {
      data: formData,
    });

    if (receiveData.success) {
      Swal.fire({
        title: "Success!",
        text: receiveData.message,
        icon: "success",
        confirmButtonText: "Ok",
      });
      handleReset();
    } else {
      Swal.fire({
        title: "Error!",
        text: receiveData.message,
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  const handleReset = () => {
    setFormData(data || {});
    setErrors({});
    setIsShowModal(false);
    setLoading(false);
  };

  useEffect(() => {
    if (isShowModal) {
      setFormData(data || {});
    }
  }, [isShowModal, data]);

  return (
    <Modal
      isOpen={isShowModal}
      placement="top"
      onOpenChange={(isOpen) => setIsShowModal(isOpen)}
      motionProps={fadeTopToBottom()}
    >
      <ModalContent className="min-w-[80vw]">
        <ModalHeader>Edit Employ Role</ModalHeader>
        <ModalBody>
          <div className="w-full p-6 pt-0">
            <h1 className="text-3xl font-semibold mb-6">Edit Form</h1>
            <form onSubmit={handleSubmit} className="w-full">
              {[
                {
                  label: "Role",
                  key: "role",
                  placeholder: "Role",
                  type: "text",
                },
              ].map(({ label, key, placeholder, type = "text" }) => (
                <div key={key} className="mb-4">
                  <label className="block text-gray-700 font-semibold">
                    {label}
                  </label>
                  <Input
                    type={type}
                    value={formData[key as keyof typeof formData] as string}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    placeholder={placeholder}
                  />
                  {errors[key] && (
                    <p className="text-red-500 text-sm">{errors[key]}</p>
                  )}
                </div>
              ))}
            </form>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onPress={handleSubmit} isLoading={loading} color="primary">
            Submit
          </Button>
          <Button onPress={handleReset} color="danger">
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EmployRoleEdit;

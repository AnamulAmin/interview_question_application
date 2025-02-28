import { useState, FormEvent } from "react";
import { Input, Textarea } from "@nextui-org/input";
import Swal from "sweetalert2";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { fadeTopToBottom } from "@/utils/motion/fade-to-to-bottom";

type ErrorType = {
  [key: string]: string | undefined;
};

interface Props {
  setIsShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  isShowModal: boolean | undefined;
}

export default function CreateInventoryCategoryForm({
  setIsShowModal,
  isShowModal,
}: Props) {
  const [loading, setLoading] = useState<any>(false);

  // Form states
  const [formData, setFormData] = useState<any>({
    name: "",
    slug: "",
    description: "",
  });

  const [errors, setErrors] = useState<ErrorType>({});

  const validateForm = (): Record<string, string | undefined> => {
    const newErrors: Record<string, string | undefined> = {};
    const requiredFields = ["name", "slug", "description"];
    requiredFields.forEach((field) => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field] = `${field} is required.`;
      }
    });
    return newErrors;
  };

  const handleInputChange = (key: string, value: any | boolean) => {
    if (key === "name") {
      setFormData((prev: any) => ({
        ...prev,
        slug: value.replaceAll(" ", "_"),
      }));
    }

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
      setLoading(false);
      return;
    }

    const receiveData = await window.ipcRenderer.invoke(
      "create-inventory-category",
      {
        data: formData,
      }
    );

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

    setLoading(false);
  };

  const handleReset = () => {
    setFormData({});
    setErrors({});
    setIsShowModal(false);
    setLoading(false);
  };

  return (
    <Modal
      isOpen={isShowModal}
      placement="top"
      onOpenChange={setIsShowModal}
      motionProps={fadeTopToBottom()}
    >
      <ModalContent className="min-w-[80vw]">
        <ModalHeader>Edit Menu Item</ModalHeader>
        <ModalBody>
          <div className="w-full p-6 pt-0">
            <h1 className="text-3xl font-semibold mb-6">Menu Create Form</h1>
            <form
              onSubmit={handleSubmit}
              className="w-full grid grid-cols-2 gap-4"
            >
              {[
                {
                  label: "Name",
                  key: "name",
                  placeholder: "Enter Name",
                  type: "text",
                },
                {
                  label: "Slug",
                  key: "slug",
                  placeholder: "Enter Slug",
                  type: "text",
                },
                {
                  label: "Description",
                  key: "description",
                  placeholder: "Description",
                  type: "textarea",
                },
              ].map(({ label, key, placeholder, type = "text" }) => {
                if (type === "textarea") {
                  return (
                    <div key={key} className="mb-4 col-span-full">
                      <label className="block text-gray-700 font-semibold">
                        {label}
                      </label>
                      <Textarea
                        value={formData[key as keyof typeof formData] as string}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        placeholder={placeholder}
                      />
                      {errors[key] && (
                        <p className="text-red-500 text-sm">{errors[key]}</p>
                      )}
                    </div>
                  );
                }
                return (
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
                );
              })}
            </form>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onPress={handleSubmit} isLoading={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
          <Button onPress={handleReset} variant="light">
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

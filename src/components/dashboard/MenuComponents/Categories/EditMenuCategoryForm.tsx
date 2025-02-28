import { useState, FormEvent, useEffect } from "react";
import Swal from "sweetalert2";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@nextui-org/react";
import UploadImageInput from "@/shared/UploadImageInput";
import { fadeTopToBottom } from "@/utils/motion/fade-to-to-bottom";

const EditMenuCategoryForm: any = ({
  isShowModal,
  data,
  setIsShowModal,
}: any) => {
  const [loading, setLoading] = useState<any>(false);
  const [image, setImage] = useState<any>("");

  const [formData, setFormData] = useState<any>({
    name: "",
    slug: "",
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

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

  const handleInputChange = (key: string, value: any) => {
    if (key === "name") {
      setFormData((prev: any) => ({
        ...prev,
        slug: value.replaceAll(" ", "_"),
      }));
    }
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

    if (image !== "") {
      formData.image = image;
    }

    const receiveData = await window.ipcRenderer.invoke(
      "update-menu-category",
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
      setImage(data?.image || "");
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
        <ModalHeader>Edit menu Item</ModalHeader>
        <ModalBody>
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
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">
                Upload Image
              </label>
              <UploadImageInput imageString={image} setImageString={setImage} />
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button onPress={handleSubmit} isLoading={loading}>
            Submit
          </Button>
          <Button onPress={handleReset} variant="light">
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditMenuCategoryForm;

import { useState, FormEvent } from "react";
import { Input } from "@nextui-org/input";
import { Switch } from "@nextui-org/switch";
import Swal from "sweetalert2";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import UploadImageInput from "@/shared/UploadImageInput";
import { fadeTopToBottom } from "@/utils/motion/fade-to-to-bottom";

type ErrorType = {
  [key: string]: string | undefined;
};

interface Props {
  setIsShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  isShowModal: boolean | undefined;
}

export default function AddFloor({ setIsShowModal, isShowModal }: Props) {
  const [loading, setLoading] = useState<any>(false);
  const [image, setImage] = useState<any>(null);

  // Form states
  const [formData, setFormData] = useState<any>({
    floorName: "",
    isAvailable: false,
  });

  const [errors, setErrors] = useState<ErrorType>({});

  const validateForm = (): Record<string, string | undefined> => {
    const newErrors: Record<string, string | undefined> = {};
    const requiredFields = ["floorName"];
    requiredFields.forEach((field) => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field] = `${field} is required.`;
      }
    });
    return newErrors;
  };

  const handleInputChange = (key: string, value: string | boolean) => {
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

  const handleSubmit = async () => {
    setLoading(true);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }
    formData.image = image;

    const receiveData = await window.ipcRenderer.invoke("create-floor", {
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

    setLoading(false);
  };

  const handleReset = () => {
    setFormData({
      tableNumber: 0,
      seatingCapacity: 0,
      isAvailable: false,
    });
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
        <ModalHeader>Create Floor</ModalHeader>
        <ModalBody>
          <div className="w-full p-6 pt-0">
            <form
              onSubmit={handleSubmit}
              className="w-full grid grid-cols-2 gap-4"
            >
              {[
                {
                  label: "Floor Name",
                  key: "floorName",
                  placeholder: "Floor Name",
                  type: "text",
                },
              ].map(({ label, key, placeholder, type = "text" }) => (
                <div key={key} className="mb-4">
                  <label className="block text-gray-700 font-semibold">
                    {label}
                  </label>
                  <Input
                    type={type}
                    value={
                      typeof formData[key as keyof typeof formData] === "number"
                        ? formData[key as keyof typeof formData].toString() // convert numbers to string
                        : formData[key as keyof typeof formData]
                    } // leave boolean as it is
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    placeholder={placeholder}
                  />
                  {errors[key] && (
                    <p className="text-red-500 text-sm">{errors[key]}</p>
                  )}
                </div>
              ))}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold">
                  Is Available
                </label>

                <Switch
                  isSelected={formData.isAvailable}
                  defaultSelected={formData.isAvailable}
                  onValueChange={(value) =>
                    handleInputChange("isAvailable", value)
                  }
                />
                {errors.isAvailable && (
                  <p className="text-red-500 text-sm">{errors.isAvailable}</p>
                )}
              </div>
              <div className="mb-4 col-span-full">
                <label className="block text-gray-700 font-semibold">
                  Upload Image
                </label>
                <UploadImageInput
                  imageString={image}
                  setImageString={setImage}
                />
              </div>
            </form>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onPress={handleSubmit} isLoading={loading} color={"success"}>
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

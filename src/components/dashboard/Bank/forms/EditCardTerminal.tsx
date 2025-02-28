import { useState, useEffect } from "react";
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

const EditCardTerminal: any = ({ isShowModal, data, setIsShowModal }: any) => {
  const [loading, setLoading] = useState<any>(false);
  const [image, setImage] = useState<any>("");
  const [formData, setFormData] = useState<any>({
    card_terminal_name: "",
  });

  const [errors, setErrors] = useState<any>({});

  const validateForm = (): any => {
    const newErrors: any = {};
    const requiredFields = ["floorName"];
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

  const handleSubmit = async () => {
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

    if (image) {
      formData.image = image;
    }

    const receiveData = await window.ipcRenderer.invoke("update-floor", {
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
    setImage("");
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
        <ModalHeader>Edit Cart Terminal</ModalHeader>
        <ModalBody>
          <div className="w-full p-6 pt-0">
            <form
              onSubmit={handleSubmit}
              className="w-full grid grid-cols-1 gap-4"
            >
              {[
                {
                  label: "Card Terminal Name",
                  key: "card_terminal_name",
                  placeholder: "Card Terminal Name",
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
            </form>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onPress={handleSubmit} isLoading={loading} color={"success"}>
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

export default EditCardTerminal;

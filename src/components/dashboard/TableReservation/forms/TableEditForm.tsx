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
  Select,
  SelectItem,
  Switch,
} from "@nextui-org/react";
import useGetAllFloors from "@/hooks/GetDataHook/useGetAllFloors";
import UploadImageInput from "@/shared/UploadImageInput";
import { fadeTopToBottom } from "@/utils/motion/fade-to-to-bottom";

const TableEditForm: any = ({ isShowModal, data, setIsShowModal }: any) => {
  const [loading, setLoading] = useState<any>(false);
  const floors = useGetAllFloors({});
  const [image, setImage] = useState<any>("");

  // Form states
  const [formData, setFormData] = useState<any>({
    table_name: "",
    seating_capacity: 0,
    floor: "",
    isAvailable: false,
  });

  const [errors, setErrors] = useState<any>({});

  const validateForm = (): any => {
    const newErrors: any = {};
    const requiredFields = ["table_name", "seating_capacity", "floor"];
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

    const receiveData = await window.ipcRenderer.invoke("update-table", {
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
        <ModalHeader>Edit Inventory Item</ModalHeader>
        <ModalBody>
          <div className="w-full p-6 pt-0">
            <h1 className="text-3xl font-semibold mb-6">Edit Form</h1>
            <form
              onSubmit={handleSubmit}
              className="w-full grid grid-cols-2 gap-4"
            >
              {[
                {
                  label: "Table Name",
                  key: "table_name",
                  placeholder: "Table Name",
                  type: "text",
                },
                {
                  label: "Floor",
                  key: "floor",
                  placeholder: "Floor",
                  type: "select",
                  options: floors,
                },
                {
                  label: "Seating Capacity",
                  key: "seating_capacity",
                  placeholder: "Seating Capacity",
                  type: "text",
                },
              ].map(
                ({
                  label,
                  key,
                  placeholder,
                  type = "text",
                  options = [],
                }: any) => {
                  if (type === "select") {
                    console.log(options, "options");
                    return (
                      <div key={key} className="mb-4">
                        <label className="block text-gray-700 font-semibold">
                          {label}
                        </label>
                        <Select
                          value={
                            formData[key as keyof typeof formData] as string
                          }
                          selectedKeys={[
                            formData[key as keyof typeof formData],
                          ]}
                          onSelectionChange={(e: any) =>
                            handleInputChange(key, e.currentKey)
                          }
                          placeholder={placeholder}
                        >
                          {options.map((option: any) => (
                            <SelectItem key={option?._id || option}>
                              {option.floorName || option}
                            </SelectItem>
                          ))}
                        </Select>
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
                }
              )}

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
          <Button onPress={handleSubmit} isLoading={loading} color="success">
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

export default TableEditForm;

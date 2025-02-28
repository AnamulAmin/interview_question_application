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
  Select,
  SelectItem,
} from "@nextui-org/react";
import useGetAllRestockFrequency from "../../../hooks/GetDataHook/useGetAllRestockFrequency";
import useGetAllMeasurement from "../../../hooks/GetDataHook/useGetAllMeasurement";
import UploadImageInput from "../../../shared/UploadImageInput";
import { fadeTopToBottom } from "@/utils/motion/fade-to-to-bottom";

const EditInventoryTrackingForm: React.FC<any> = ({
  isShowModal,
  data,
  setIsShowModal,
}) => {
  const [loading, setLoading] = useState<any>(false);
  const [units, setUnits] = useState<any>([]);
  const [image, setImage] = useState<any>("");

  const [formData, setFormData] = useState<any>({
    ingredientName: "",
    currentStock: 0,
    unitCategory: "",
    unitType: "",
    minThreshold: 5,
    restockFrequency: "",
    lastRestocked: "",
    expiryDate: "",
    totalWasted: 0,
    cost_per_unit: 0,
    total_cost: 0,
    storage_location: "",
    category: "",
    subcategory: "",
  });

  const RestockFrequency = useGetAllRestockFrequency({});
  const Measurement = useGetAllMeasurement({});

  console.log(RestockFrequency, "RestockFrequency");

  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const validateForm = (): Record<string, string | undefined> => {
    const newErrors: Record<string, string | undefined> = {};
    const requiredFields = [
      "name",
      "currentStock",
      "unitType",
      "cost_per_unit",
      "total_cost",
    ];
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
    // e.preventDefault();
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
      "update-inventory-item",
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
    setImage("");
  };

  useEffect(() => {
    if (isShowModal) {
      setFormData(data || {});
      setImage(data?.image || "");
    }
  }, [isShowModal, data]);

  useEffect(() => {
    const unitItems: any = Measurement.find(
      (item: any) => item.label == formData.unitCategory
    );

    console.log(unitItems, "unitItems");

    setUnits(unitItems?.units);
  }, [Measurement, formData?.unitCategory, isShowModal]);

  return (
    <Modal
      isOpen={isShowModal}
      placement="top"
      onOpenChange={(isOpen) => setIsShowModal(isOpen)}
      className="z-[9999]"
      motionProps={fadeTopToBottom()}
    >
      <ModalContent className="min-w-[80vw]">
        <ModalHeader>Edit Inventory Item</ModalHeader>
        <ModalBody>
          <div className="w-full p-6 pt-0 relative z-[99999]">
            <h1 className="text-3xl font-semibold mb-6">Menu Create Form</h1>
            <form
              onSubmit={handleSubmit}
              className="w-full grid grid-cols-2 gap-4"
            >
              {[
                {
                  label: " Name",
                  key: "name",
                  placeholder: "Ingredient Name",
                  type: "text",
                },
                {
                  label: "Current Stock",
                  key: "currentStock",
                  placeholder: "Current Stock",
                  type: "number",
                },
                {
                  label: "Unit Category",
                  key: "unitCategory",
                  placeholder: "Unit Category",
                  type: "select",
                  options: Measurement,
                },
                {
                  label: "Unit",
                  key: "unitType",
                  placeholder: "Unit Type",
                  type: "select",
                  options: units,
                },
                {
                  label: "Min Threshold",
                  key: "minThreshold",
                  placeholder: "Min Threshold",
                  type: "number",
                },
                {
                  label: "Restock Frequency",
                  key: "restockFrequency",
                  placeholder: "Restock Frequency",
                  type: "select",
                  options: RestockFrequency,
                },
                {
                  label: "Last Restocked",
                  key: "lastRestocked",
                  placeholder: "Last Restocked",
                  type: "date",
                },
                {
                  label: "Expiry Date",
                  key: "expiryDate",
                  placeholder: "Expiry Date",
                  type: "date",
                },
                {
                  label: "Cost per unit",
                  key: "cost_per_unit",
                  placeholder: "Cost per unit",
                  type: "number",
                },
                {
                  label: "Total cost",
                  key: "total_cost",
                  placeholder: "Total cost",
                  type: "number",
                },
                {
                  label: "Storage location",
                  key: "storage_location",
                  placeholder: "Storage location",
                  type: "text",
                },
              ].map(
                ({ label, key, placeholder, type = "text", options = [] }) => {
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
                          defaultSelectedKeys={[
                            formData[key as keyof typeof formData] as string,
                          ]}
                          onSelectionChange={(e) =>
                            handleInputChange(key, e.currentKey)
                          }
                          placeholder={placeholder}
                        >
                          {options.map((option: any) => (
                            <SelectItem
                              key={option?.id || option?.label || option}
                            >
                              {option.label || option}
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
              <UploadImageInput imageString={image} setImageString={setImage} />
            </form>
          </div>
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

export default EditInventoryTrackingForm;

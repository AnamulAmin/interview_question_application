import { useState, FormEvent, useEffect } from "react";
import { Select, SelectItem } from "@nextui-org/select";
import { Input } from "@nextui-org/input";
import Swal from "sweetalert2";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import useGetAllRestockFrequency from "../../../hooks/GetDataHook/useGetAllRestockFrequency";
import useGetAllMeasurement from "../../../hooks/GetDataHook/useGetAllMeasurement";
import useGetAllInventorySubcategory from "../../../hooks/GetDataHook/useGetAllInventorySubcategory";
import useGetAllInventoryCategory from "../../../hooks/GetDataHook/useGetAllInventoryCategory";
import UploadImageInput from "../../../shared/UploadImageInput";
import { fadeTopToBottom } from "@/utils/motion/fade-to-to-bottom";

interface Props {
  setIsShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  isShowModal: boolean | undefined;
}

export default function CreateInventoryTrackingForm({
  setIsShowModal,
  isShowModal,
}: Props) {
  const [loading, setLoading] = useState<any>(false);
  const [units, setUnits] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any>([]);
  const [currency, setCurrency] = useState<any>({});
  const [image, setImage] = useState<any>("");

  // Form states
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
  const inventoryCategories = useGetAllInventoryCategory({});
  const inventorySubcategories = useGetAllInventorySubcategory({});

  console.log(RestockFrequency, "RestockFrequency");

  const [errors, setErrors] = useState<any>({});

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
    formData.image = image;

    const receiveData = await window.ipcRenderer.invoke(
      "create-inventory-item",
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

  useEffect(() => {
    const unitItems: any = Measurement.find(
      (item: any) => item.label == formData.unitCategory
    );

    if (unitItems) {
      setUnits(unitItems?.units);
    }

    const specificSubcategories = inventorySubcategories.filter((item: any) => {
      console.log(
        item.category,
        "item.category",
        formData.category,
        "formData.category",
        item?.category == formData.category
      );

      return item?.category == formData.category;
    });

    console.log(unitItems, "unitItems");

    console.log(specificSubcategories, "specificSubcategories");

    if (specificSubcategories) {
      setSubcategories(specificSubcategories || []);
    }
  }, [Measurement, isShowModal, formData.unitCategory]);

  // console.log(
  //   subcategories,
  //   "subcategories",
  //   inventoryCategories,
  //   "categories",
  //   "inventorySubcategories",
  //   inventorySubcategories
  // );

  useEffect(() => {
    const specificSubcategories = inventorySubcategories.filter((item: any) => {
      console.log(
        item.category,
        "item.category",
        formData.category,
        "formData.category",
        item?.category == formData.category
      );

      return item?.category == formData.category;
    });

    if (specificSubcategories) {
      setSubcategories(specificSubcategories || []);
    }
  }, [formData.category, isShowModal, inventorySubcategories]);

  useEffect(() => {
    if (formData.currentStock && formData.cost_per_unit) {
      setFormData((prev: any) => ({
        ...prev,
        total_cost: formData.currentStock * formData.cost_per_unit,
      }));
    }

    const storedCurrency = localStorage.getItem("currency");
    if (storedCurrency) {
      const parseData = JSON.parse(storedCurrency);
      setCurrency(parseData);
    }
  }, [formData.category, formData.currentStock, formData.cost_per_unit]);

  return (
    <Modal
      isOpen={isShowModal}
      placement="top"
      onOpenChange={setIsShowModal}
      motionProps={fadeTopToBottom()}
    >
      <ModalContent className="min-w-[80vw] z-[999]">
        <ModalHeader>Create Inventory</ModalHeader>
        <ModalBody>
          <form
            onSubmit={handleSubmit}
            className="w-full grid grid-cols-2 gap-4 relative z-[99999]"
          >
            {[
              {
                label: " Name",
                key: "name",
                placeholder: "Ingredient Name",
                type: "text",
              },
              {
                label: "Slug",
                key: "slug",
                placeholder: "Slug",
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
                label: "Inventory Category",
                key: "category",
                placeholder: "Enter Category",
                type: "select",
                options: inventoryCategories,
              },
              {
                label: "Inventory Subcategory",
                key: "subcategory",
                placeholder: "Enter Subcategory",
                type: "select",
                options: subcategories,
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
                currency: currency.symbol,
              },
              {
                label: "Total cost",
                key: "total_cost",
                placeholder: "Total cost",
                type: "number",
                currency: currency.symbol,
              },
              {
                label: "Storage location",
                key: "storage_location",
                placeholder: "Storage location",
                type: "text",
              },
            ].map(
              ({
                label,
                key,
                placeholder,
                type = "text",
                options = [],
                currency,
              }) => {
                if (type === "select") {
                  console.log(options, "options");
                  return (
                    <div key={key} className="mb-4">
                      <label className="block text-gray-700 font-semibold">
                        {label}
                      </label>
                      <Select
                        value={formData[key as keyof typeof formData] as string}
                        onSelectionChange={(e) =>
                          handleInputChange(key, e.currentKey)
                        }
                        placeholder={placeholder}
                      >
                        {options.map((option: any) => (
                          <SelectItem
                            key={
                              option?.id ||
                              option?.label ||
                              option?.name ||
                              option
                            }
                          >
                            {option?.label || option?.name || option}
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
                  <div key={key} className="mb-4 relative">
                    <label className="block text-gray-700 font-semibold">
                      {label}
                    </label>

                    <span className="absolute -right-1 top-1/2 z-10 mr-2 text-gray-500">
                      {currency}
                    </span>
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

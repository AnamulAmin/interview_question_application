import { useState, FormEvent, useEffect } from "react";
import { Select, SelectItem } from "@nextui-org/select";
import { Input } from "@nextui-org/input";
import Swal from "sweetalert2";
import {
  Button,
  menu,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import useGetAllRestockFrequency from "../../../../hooks/GetDataHook/useGetAllRestockFrequency";
import useGetAllMeasurement from "../../../../hooks/GetDataHook/useGetAllMeasurement";
// import useGetAllInventoryCategory from "../../../../hooks/GetDataHook/useGetAllInventoryCategory";
import useGetAllInventorySubcategory from "../../../../hooks/GetDataHook/useGetAllInventorySubcategory";
import { fadeTopToBottom } from "@/utils/motion/fade-to-to-bottom";

export default function AddInventoryToTheItem({
  setIsShowModal,
  isShowModal,
  inventoryData,
  menuItemData,
}: any) {
  const [loading, setLoading] = useState<any>(false);
  const [units, setUnits] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any>([]);
  const [currency, setCurrency] = useState<any>({});

  // Form states
  const [formData, setFormData] = useState<any>({
    unitCategory: "",
    unitType: "",
    usagePerItem: 0,
  });

  console.log(inventoryData, "inventoryData", menuItemData, "menuItemData");

  const RestockFrequency = useGetAllRestockFrequency({});
  const Measurement = useGetAllMeasurement({});
  // const inventoryCategories = useGetAllInventoryCategory({});
  const inventorySubcategories = useGetAllInventorySubcategory({});

  console.log(RestockFrequency, "RestockFrequency");

  const [errors, setErrors] = useState<any>({});

  const validateForm = (): Record<string, string | undefined> => {
    const newErrors: Record<string, string | undefined> = {};
    const requiredFields = ["unitCategory", "unitType", "usagePerItem"];
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

    try {
      const inventorySubmitData: any = inventoryData?.menuItems
        ? [
            // eslint-disable-next-line no-unsafe-optional-chaining
            ...inventoryData?.menuItems,
            {
              menuItemId: menuItemData?._id,
              menuItem_revision: menuItemData?._rev,
              menuItemName: menuItemData?.name,
              menuItemImage: menuItemData?.image,
            },
          ]
        : [
            {
              menuItemId: menuItemData?._id,
              menuItem_revision: menuItemData?._rev,
              menuItemName: menuItemData?.name,
              menuItemImage: menuItemData?.image,
            },
          ];

      const menuItemSubmitData = menuItemData?.inventories
        ? [
            // eslint-disable-next-line no-unsafe-optional-chaining
            ...menuItemData?.inventories,
            {
              ...formData,
              inventoryItemId: inventoryData?._id,
              inventoryItem_revision: inventoryData?._rev,
              inventoryItemName: inventoryData?.name,
              inventoryItemImage: inventoryData?.image,
            },
          ]
        : [
            {
              ...formData,
              inventoryItemId: inventoryData?._id,
              inventoryItem_revision: inventoryData?._rev,
              inventoryItemName: inventoryData?.name,
              inventoryItemImage: inventoryData?.image,
            },
          ];

      const uniqueInventoryArray = inventorySubmitData.filter(
        (item: any, index: number, self: any) =>
          index === self.findIndex((t: any) => t.menuItemId === item.menuItemId)
      );

      const uniqueMenuArray = menuItemSubmitData.filter(
        (item: any, index: number, self: any) =>
          index ===
          self.findIndex((t: any) => t.inventoryItemId === item.inventoryItemId)
      );

      console.log(
        uniqueMenuArray,
        "menuItemSubmitData",
        uniqueInventoryArray,
        "inventorySubmitData"
      );

      console.log(
        inventorySubmitData.filter(
          (item: any, index: number, self: any) =>
            index ===
            self.findIndex((t: any) => t.menuItemId === item.menuItemId)
        ),
        "inventorySubmitData"
      );

      const receiveInventoryData = await window.ipcRenderer.invoke(
        "update-inventory-item",
        {
          data: {
            menuItems: uniqueInventoryArray,
            _id: inventoryData?._id,
          },
        }
      );

      // console.log(
      //   menuItemSubmitData.filter(
      //     (item: any, index: number, self: any) =>
      //       index ===
      //       self.findIndex(
      //         (t: any) => t.inventoryItemId === item.inventoryItemId
      //       )
      //   ),
      //   "FILTER ITEMS"
      // );

      const receiveMenuData = await window.ipcRenderer.invoke("update-menu", {
        data: {
          inventories: uniqueMenuArray,
          _id: menuItemData?._id,
          _rev: menuItemData?._rev,
        },
      });

      console.log(
        receiveInventoryData,
        "receiveInventoryData",
        receiveMenuData,
        "receiveMenuData"
      );

      if (receiveInventoryData.success && receiveMenuData.success) {
        Swal.fire({
          title: "Success!",
          text: receiveInventoryData.message,
          icon: "success",
          confirmButtonText: "Ok",
        });
        handleReset();
      } else {
        Swal.fire({
          title: "Error!",
          text: receiveInventoryData.message,
          icon: "error",
          confirmButtonText: "Ok",
        });
      }

      setLoading(false);
    } catch (error: any) {
      console.error("Error updating inventory item:", error);
      Swal.fire({
        title: "Error!",
        text: error.message,
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  const handleReset = () => {
    setFormData({});
    setErrors({});
    setIsShowModal(false);
    setLoading(false);
  };

  useEffect(() => {
    const unitItems: any = Measurement.find(
      (item: any) => item.label == inventoryData?.unitCategory
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

    setFormData((prev: any) => {
      prev.unitCategory = inventoryData?.unitCategory;
      return prev;
    });
  }, [Measurement, isShowModal, inventoryData]);

  console.log(
    subcategories,
    "subcategories",
    "categories",
    "inventorySubcategories",
    inventorySubcategories,
    currency
  );

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
      placement="center"
      onOpenChange={setIsShowModal}
      motionProps={fadeTopToBottom()}
    >
      <ModalContent className="min-w-[80vw]">
        <ModalHeader>Create Inventory</ModalHeader>
        <ModalBody>
          <form
            onSubmit={handleSubmit}
            className="w-full grid grid-cols-2 gap-4"
          >
            {[
              {
                label: "Unit Category",
                key: "unitCategory",
                placeholder: "Unit Category",
                type: "select",
                options: Measurement,
                isDisabled: true,
              },
              {
                label: "Unit",
                key: "unitType",
                placeholder: "Unit Type",
                type: "select",
                options: units,
              },
              {
                label: "Usage Per Item",
                key: "usagePerItem",
                placeholder: "Usage Per Item",
                type: "number",
              },
            ].map(
              ({
                label,
                key,
                placeholder,
                type = "text",
                options = [],
                currency,
                isDisabled = false,
              }: any) => {
                if (type === "select") {
                  console.log(options, "options");
                  return (
                    <div key={key} className="mb-4">
                      <label className="block text-gray-700 font-semibold">
                        {label}
                      </label>
                      <Select
                        value={formData[key as keyof typeof formData] as string}
                        selectedKeys={[formData[key as keyof typeof formData]]}
                        onSelectionChange={(e: any) =>
                          handleInputChange(key, e.currentKey)
                        }
                        placeholder={placeholder}
                        isDisabled={isDisabled}
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

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
  Textarea,
} from "@nextui-org/react";
import UploadImageInput from "../../../shared/UploadImageInput";
import useGetAllMenuCategory from "../../../hooks/GetDataHook/useGetAllMenuCategory";
import useGetAllMenuSubcategory from "../../../hooks/GetDataHook/useGetAllMenuSubcategory";
import { fadeTopToBottom } from "@/utils/motion/fade-to-to-bottom";

const MenuEditForm: any = ({ isShowModal, data, setIsShowModal }: any) => {
  // Initialize NeDB database

  const [loading, setLoading] = useState<any>(false);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [image, setImage] = useState<File | string | null>("");

  const [preparationTime, setPreparationTime] = useState<any>(0);
  const [errors, setErrors] = useState<any>({});

  const [subcategories, setSubcategories] = useState<any[]>([]);

  const [subcategory, setSubcategory] = useState<string>("");

  const menuCategories = useGetAllMenuCategory({});
  const menuSubcategories = useGetAllMenuSubcategory({});

  useEffect(() => {
    const filterItems = menuSubcategories.filter(
      (item: any) => item?.category == category
    );

    console.log(filterItems, "filterItems");

    setSubcategories(filterItems);
  }, [menuSubcategories, category]);

  const validateForm = (): any => {
    const newErrors: any = {};
    if (!name) newErrors.name = "Name is required.";
    if (!description) newErrors.description = "Description is required.";
    if (!price || isNaN(Number(price)))
      newErrors.price = "Valid price is required.";
    if (!category) newErrors.category = "Category is required.";
    if (!subcategory) newErrors.subcategory = "Subcategory is required.";

    if (!preparationTime || preparationTime <= 0)
      newErrors.preparationTime = "Preparation time must be a positive number.";

    return newErrors;
  };

  const handleReset = () => {
    setName("");
    setDescription("");
    setPrice("");
    setCategory("");
    setIsAvailable(false);
    setImage(null);

    setErrors({});

    setPreparationTime(0);

    setIsShowModal(false);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Swal.fire({
      //   title: "Error!",
      //   text: "Please fix the validation errors.",
      //   icon: "error",
      //   confirmButtonText: "Ok",
      // });
      setLoading(false);
      return;
    }

    // Prepare menu item data

    const newMenuItem = {
      name,
      price,
      category,
      description,
      isAvailable,
      image,
      subcategory,
      preparationTime,
      _id: data._id,
      _rev: data._rev,
    };

    interface createMenuResponse {
      success: boolean;
      message: string;
    }

    try {
      const receiveData: createMenuResponse = await window.ipcRenderer.invoke(
        "update-menu",
        { data: newMenuItem }
      );

      console.log(newMenuItem, "newMenuItem", receiveData, "receiveData");

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
        setLoading(false);
      }

      setLoading(false);
    } catch (error) {
      console.log(error, "error");
    }
  };

  useEffect(() => {
    setName(data?.name || "");
    setDescription(data?.description || "");
    setPrice(data?.price || "");
    setCategory(data?.category || "");
    setSubcategory(data?.subcategory);
    setIsAvailable(data?.isAvailable || false);
    setImage(data?.image || null);

    setPreparationTime(data?.preparationTime || 0);

    console.log(data, "data in modal");
  }, [isShowModal, data]);

  return (
    <Modal
      isOpen={isShowModal}
      placement={"top"}
      onOpenChange={setIsShowModal}
      motionProps={fadeTopToBottom()}
    >
      <ModalContent className="min-w-[80vw]">
        <></>
        <ModalHeader className="flex flex-col gap-1">
          Food Edit Form
        </ModalHeader>
        <ModalBody>
          <div className="min-w-[80vw] p-6 pt-0">
            <form
              onSubmit={handleSubmit}
              className="w-full grid grid-cols-2 gap-4"
            >
              {/* Name */}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold">
                  Name
                </label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e: any) => setName(e.target.value)}
                  className="border rounded-xl"
                  placeholder="Menu Item Name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>

              {/* Price */}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold">
                  Price
                </label>
                <Input
                  type="text"
                  value={price}
                  onChange={(e: any) => setPrice(e.target.value)}
                  className="border rounded-xl"
                  placeholder="Menu Item Price"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm">{errors.price}</p>
                )}
              </div>

              {/* Menu Type */}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold">
                  Category
                </label>
                <Select
                  value={category}
                  defaultSelectedKeys={[category]}
                  onSelectionChange={(e: any) => setCategory(e.currentKey)}
                  placeholder="Select One"
                >
                  {menuCategories.map((item: any) => (
                    <SelectItem key={item.name}>{item.name}</SelectItem>
                  ))}
                </Select>
                {errors.category && (
                  <p className="text-red-500 text-sm">{errors.category}</p>
                )}
              </div>

              {/* Menu Type */}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold">
                  Subcategory
                </label>
                <Select
                  value={subcategory}
                  defaultSelectedKeys={[subcategory]}
                  onSelectionChange={(e: any) => setSubcategory(e.currentKey)}
                  placeholder="Select One"
                >
                  {subcategories.map((item: any) => (
                    <SelectItem key={item.name}>{item.name}</SelectItem>
                  ))}
                </Select>
                {errors.subcategory && (
                  <p className="text-red-500 text-sm">{errors.subcategory}</p>
                )}
              </div>

              {/* Preparation Time */}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold">
                  Preparation Time (minutes)
                </label>
                <Input
                  type="number"
                  placeholder="Preparation Time"
                  value={preparationTime}
                  onChange={(e: any) =>
                    setPreparationTime(Number(e.target.value))
                  }
                />
                {errors.preparationTime && (
                  <p className="text-red-500 text-sm">
                    {errors.preparationTime}
                  </p>
                )}
              </div>

              <div className="mb-4 flex items-center gap-8">
                {/* Is Available */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold">
                    Is Available
                  </label>

                  <Switch
                    isSelected={isAvailable}
                    onChange={(e: any) => setIsAvailable(e.target.value)}
                  />
                  {errors.isAvailable && (
                    <p className="text-red-500 text-sm">{errors.isAvailable}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold">
                  Description
                </label>
                <Textarea
                  type="text"
                  value={description}
                  onChange={(e: any) => setDescription(e.target.value)}
                  className="border rounded-xl"
                  placeholder="Menu Item Description"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm">{errors.description}</p>
                )}
              </div>

              {/* Image */}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold">
                  Upload Image
                </label>
                <UploadImageInput
                  imageString={image}
                  setImageString={setImage}
                />
              </div>

              {/* Submit Button */}
            </form>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={handleReset}>
            Close
          </Button>
          <Button color="primary" onPress={handleSubmit}>
            {loading ? "Updating..." : "Update Menu "}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MenuEditForm;

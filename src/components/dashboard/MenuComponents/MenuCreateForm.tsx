import { useState, FormEvent, useEffect } from "react";
import { Select, SelectItem } from "@nextui-org/select";
import { Input, Textarea } from "@nextui-org/input";
import { Switch } from "@nextui-org/switch";
import Swal from "sweetalert2";
import UploadImageInput from "../../../shared/UploadImageInput";
import useGetAllMenuCategory from "../../../hooks/GetDataHook/useGetAllMenuCategory";
import useGetAllMenuSubcategory from "../../../hooks/GetDataHook/useGetAllMenuSubcategory";

export default function MenuCreateForm() {
  const [loading, setLoading] = useState<any>(false);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [subcategory, setSubcategory] = useState<string>("");
  const [isAvailable, setIsAvailable] = useState<any>(true);
  const [image, setImage] = useState<File | string | null>("");

  const [preparationTime, setPreparationTime] = useState<any>(0);
  const [errors, setErrors] = useState<any>({});
  const [subcategories, setSubcategories] = useState<any[]>([]);

  const menuCategories = useGetAllMenuCategory({});
  const menuSubcategories = useGetAllMenuSubcategory({});

  const validateForm = (): any => {
    const newErrors: any = {};
    if (!name.trim()) newErrors.name = "Name is required.";
    if (!description.trim()) newErrors.description = "Description is required.";
    if (!price.trim() || isNaN(Number(price)))
      newErrors.price = "Valid price is required.";
    if (!category.trim()) newErrors.category = "Category is required.";
    if (!subcategory.trim()) newErrors.category = "Category is required.";

    // if (!isAvailable) newErrors.isAvailable = "Availability selection is required.";

    if (!preparationTime || preparationTime <= 0)
      newErrors.preparationTime = "Preparation time must be a positive number.";
    return newErrors;
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
      subcategory,
      description,
      isAvailable,
      image,
      preparationTime,
    };

    interface createMenuResponse {
      success: boolean;
      message: string;
    }

    const receiveData: createMenuResponse = await window.ipcRenderer.invoke(
      "create-menu",
      { data: newMenuItem }
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
      setLoading(false);
    }

    setLoading(false);

    setLoading(false);
  };

  const handleReset = () => {
    setName("");
    setDescription("");
    setPrice("");
    setIsAvailable(true);
    setImage(null);
    setErrors({});
  };

  useEffect(() => {
    const filterItems = menuSubcategories.filter((item: any) => {
      console.log(
        item?.category == category,
        "item?.category == category",
        item.category,
        category
      );

      return item?.category == category;
    });

    console.log(filterItems, "filterItems", category, menuSubcategories);

    setSubcategories(filterItems);
  }, [menuSubcategories, category]);

  return (
    <div className="w-full max-w-[1000px] mx-auto py-10 rounded-lg px-[50px] mt-10 bg-white">
      <h1 className="text-3xl font-semibold mb-6">Menu Create Form</h1>
      <form onSubmit={handleSubmit} className="w-full grid grid-cols-2 gap-4">
        {/* Name */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">Name</label>
          <Input
            type="text"
            value={name}
            onChange={(e: any) => setName(e.target.value)}
            className="border rounded-xl"
            placeholder="Menu Item Name"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* Price */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">Price</label>
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
          <label className="block text-gray-700 font-semibold">Category</label>
          <Select
            value={category}
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
            onChange={(e: any) => setPreparationTime(Number(e.target.value))}
          />
          {errors.preparationTime && (
            <p className="text-red-500 text-sm">{errors.preparationTime}</p>
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
          <UploadImageInput imageString={image} setImageString={setImage} />
        </div>

        {/* Submit Button */}
      </form>
      <div className="mt-6 flex justify-end">
        <button
          disabled={false}
          // disabled={loading}
          type="submit"
          className="bg-blue-500 text-white py-2 px-6 rounded-xl hover:bg-blue-600 disabled:opacity-50"
          onClick={handleSubmit}
        >
          {loading ? "Creating..." : "Create Menu"}
        </button>
      </div>
    </div>
  );
}

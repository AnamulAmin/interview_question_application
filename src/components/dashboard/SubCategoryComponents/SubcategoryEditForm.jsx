import EditFormImage from "../../../shared/ImageComponents/EditFormImage";
import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud } from "react-icons/fi";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hook/useAxiosSecure";

export default function SubcategoryEditForm({
  subcategoryId,
  setIsShowModal,
  isShowModal,
}) {
  const axiosSecure = useAxiosSecure();

  const [category, setCategory] = useState < any > "";
  const [subcategoryName, setSubcategoryName] = useState < any > "";
  const [subcategoryIcon, setSubcategoryIcon] = useState < any > null;
  const [subcategoryIconPreview, setSubcategoryIconPreview] =
    useState < any > "";
  const [subcategoryImage, setSubcategoryImage] = useState < any > null;
  const [subcategoryImagePreview, setSubcategoryImagePreview] =
    useState < any > "";
  const [categories, setCategories] = useState < any > [];
  const [slug, setSlug] = useState < any > "";

  const [errors, setErrors] = useState < any > {};

  // Fetch category data when component mounts
  useEffect(() => {
    async function fetchCategoryData() {
      try {
        const res = await axiosSecure.get(`/subcategories/${subcategoryId}`);
        const category = res?.data?.data;

        setCategory(category.category);
        setSubcategoryName(category.subcategoryName);
        setSlug(category.slug);

        setSubcategoryIconPreview(category.subcategoryIcon);
        setSubcategoryImagePreview(category.subcategoryImage);
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
    }

    if (subcategoryId) {
      fetchCategoryData();
    }

    if (!isShowModal) {
      handleCloseModal();
    }
  }, [subcategoryId, axiosSecure, isShowModal]);

  // Fetch all categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosSecure.get("/categories");
        if (res.status === 200 || res.status === 201) {
          setCategories(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [axiosSecure]);

  // Handle custom validation
  const validateForm = () => {
    const errors = {};
    if (!category) errors.category = "Category is required";
    if (!subcategoryName)
      errors.subcategoryName = "Subcategory name is required";
    if (!slug) errors.slug = "Slug is required";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onDropIcon = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const previewUrl = URL.createObjectURL(file);

    setSubcategoryIconPreview(previewUrl);
    setSubcategoryIcon(acceptedFiles[0]);
  };

  const onDropImage = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const previewUrl = URL.createObjectURL(file);

    setSubcategoryImagePreview(previewUrl);
    setSubcategoryImage(acceptedFiles[0]);
  };

  const handleSubcategoryNameInput = (input) => {
    const sanitizedInput = input.replace(/[^a-zA-Z0-9]/g, "_");
    setSlug(sanitizedInput);
    setSubcategoryName(input);
  };

  const handleSlug = (input) => {
    const sanitizedInput = input.replace(/[^a-zA-Z0-9]/g, "_");
    setSlug(sanitizedInput);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("category", category);
    formData.append("subcategoryName", subcategoryName);
    if (subcategoryIcon) formData.append("subcategoryIcon", subcategoryIcon);
    if (subcategoryImage) formData.append("subcategoryImage", subcategoryImage);
    formData.append("slug", slug);

    try {
      const res = await axiosSecure.put(
        `/subcategories/${subcategoryId}`,
        formData
      );

      if (res.status === 200 || res.status === 201) {
        handleCloseModal();
        Swal.fire({
          title: "Success!",
          text: "Subcategory updated successfully",
          icon: "success",
          confirmButtonText: "Ok",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error!",
        text: "Something went wrong!",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  const { getRootProps: getIconRootProps, getInputProps: getIconInputProps } =
    useDropzone({
      onDrop: onDropIcon,
      accept: "image/*",
      multiple: false,
    });

  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps } =
    useDropzone({
      onDrop: onDropImage,
      accept: "image/*",
      multiple: false,
    });

  const handleCloseModal = () => {
    setIsShowModal(false);
    setCategory("");
    setSubcategoryName("");
    setSubcategoryIcon(null);
    setSubcategoryImage(null);
    setSubcategoryIconPreview("");
    setSubcategoryImagePreview("");
    setErrors({});
  };

  return (
    <div className="w-[80%] bg-gray-100 p-10">
      <div className="max-w-4xl mx-auto bg-white p-8 shadow-md rounded-md">
        <h1 className="text-2xl font-bold mb-5">Edit Subcategory</h1>
        <form onSubmit={handleSubmit}>
          {/* Select Category */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Select Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Category</option>
              {categories?.map((category, index) => (
                <option key={index} value={category?.slug}>
                  {category.categoryName}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category}</p>
            )}
          </div>

          {/* Subcategory Name */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Subcategory Name *
            </label>
            <input
              type="text"
              value={subcategoryName}
              onChange={(e) => handleSubcategoryNameInput(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Subcategory Title"
            />
            {errors.subcategoryName && (
              <p className="text-red-500 text-sm">{errors.subcategoryName}</p>
            )}
          </div>

          {/* Slug */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Slug *</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => handleSlug(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Slug"
            />
            {errors.slug && (
              <p className="text-red-500 text-sm">{errors.slug}</p>
            )}
          </div>

          {/* Subcategory Icon */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Subcategory Icon
            </label>
            <div
              {...getIconRootProps()}
              className="w-full p-4 border-dashed min-h-[200px] flex flex-col items-center justify-center border-2 border-gray-300 rounded-md text-center cursor-pointer"
            >
              <input {...getIconInputProps()} />
              {subcategoryIcon || subcategoryIconPreview ? (
                <EditFormImage
                  imageObject={subcategoryIcon}
                  imagePreview={subcategoryIconPreview}
                />
              ) : (
                <>
                  <FiUploadCloud size={60} />
                  <p className="text-xl">Drag and drop a file here or click</p>
                </>
              )}
            </div>
          </div>

          {/* Subcategory Image */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Subcategory Image
            </label>
            <div
              {...getImageRootProps()}
              className="w-full p-4 border-dashed min-h-[200px] flex flex-col items-center justify-center border-2 border-gray-300 rounded-md text-center cursor-pointer"
            >
              <input {...getImageInputProps()} />
              {subcategoryImage || subcategoryImagePreview ? (
                <EditFormImage
                  imageObject={subcategoryImage}
                  imagePreview={subcategoryImagePreview}
                />
              ) : (
                <>
                  <FiUploadCloud size={60} />
                  <p className="text-xl">Drag and drop a file here or click</p>
                </>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Update Subcategory
          </button>
        </form>
      </div>
    </div>
  );
}

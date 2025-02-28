import { useState, useEffect, useCallback } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";

import CellImage from "../../../shared/ImageComponents/CellImage";
import toast from "react-hot-toast";
import Modal from "../../../shared/Modal/Modal";
import SubcategoryEditForm from "./SubcategoryEditForm";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hook/useAxiosSecure";

export default function SubcategoryList() {
  const [currentPage, setCurrentPage] = useState < any > 0;
  const itemsPerPage = 10;
  const [subcategories, setSubCategories] = useState < any > [];
  const [sortConfig, setSortConfig] =
    useState < any > { key: "id", direction: "asc" };
  const axiosSecure = useAxiosSecure();
  const [isDeleted, setIsDeleted] = useState < any > false;
  const [isEdited, setIsEdited] = useState < any > false;
  const [subcategoryId, setSubCategoryId] = useState < any > "";

  const sortedsubCategories = useCallback(() => {
    const sortedData = [...subcategories];
    sortedData.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
    return sortedData;
  }, [subcategories, sortConfig]);

  const paginatedData = useCallback(() => {
    const offset = currentPage * itemsPerPage;
    return sortedsubCategories().slice(offset, offset + itemsPerPage);
  }, [currentPage, itemsPerPage, sortedsubCategories]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleEdit = (id) => {
    setSubCategoryId(id);
    setIsEdited(true);

    console.log(`Edit category with ID: ${id}`);
  };

  const handleDelete = async (id) => {
    try {
      Swal.fire({
        title: "Are you sure you want to delete this member?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const res = await axiosSecure.delete(`/subcategories/${id}`);
            console.log(res, "res");
            if (res.status === 200 || res.status === 201) {
              setIsDeleted((prev: any) => !prev);

              toast.success("Category deleted successfully!");
            }
          } catch (error) {
            console.log(error, "error");
            toast.error("Error deleting user!");
          }
        }
      });
    } catch (error) {
      console.log(error, "error");
      toast.error("Error deleting category!");
    }
    console.log(`Delete category with ID: ${id}`);
  };

  useEffect(() => {
    const fetchsubCategories = async () => {
      try {
        const res = await axiosSecure.get("/subcategories");
        console.log(res, "res", res?.data?.data);
        if (res.status === 200 || res.status === 201) {
          setSubCategories(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
        throw new Error("Failed to fetch subcategories");
      }
    };

    fetchsubCategories();
  }, [axiosSecure, isDeleted, isEdited]);

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-6xl mx-auto bg-white p-8 shadow-md rounded-md">
        <h1 className="text-2xl font-bold mb-5">Category List</h1>
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th
                className="border p-2 text-left cursor-pointer"
                onClick={() => handleSort("id")}
              >
                SL{" "}
                {sortConfig.key === "id" &&
                  (sortConfig.direction === "asc" ? "🔼" : "🔽")}
              </th>
              <th
                className="border p-2 text-left cursor-pointer"
                onClick={() => handleSort("subcategoryName")}
              >
                Name{" "}
                {sortConfig.key === "subcategoryName" &&
                  (sortConfig.direction === "asc" ? "🔼" : "🔽")}
              </th>
              <th className="border p-2 text-left">Icon</th>
              <th className="border p-2 text-left">Banner Image</th>
              <th
                className="border p-2 text-left cursor-pointer"
                onClick={() => handleSort("slug")}
              >
                Slug{" "}
                {sortConfig.key === "slug" &&
                  (sortConfig.direction === "asc" ? "🔼" : "🔽")}
              </th>
              <th
                className="border p-2 text-left cursor-pointer"
                onClick={() => handleSort("featureCategory")}
              >
                Featured{" "}
                {sortConfig.key === "featureCategory" &&
                  (sortConfig.direction === "asc" ? "🔼" : "🔽")}
              </th>
              <th className="border p-2 text-left">Show On Navbar</th>
              <th className="border p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData()?.length > 0 &&
              paginatedData().map((category, index) => (
                <tr key={category.id} className="border-b">
                  <td className="border p-2">
                    {index + 1 + currentPage * itemsPerPage}
                  </td>
                  <td className="border p-2">{category.subcategoryName}</td>
                  <td className="border p-2">
                    <CellImage
                      width={400}
                      height={400}
                      src={category.subcategoryIcon}
                      alt="icon"
                    />
                  </td>
                  <td className="border p-2">
                    <CellImage
                      width={400}
                      height={400}
                      src={category.subcategoryImage}
                      alt="banner"
                    />
                  </td>
                  <td className="border p-2">{category.slug}</td>
                  <td className="border p-2">
                    {category.featureCategory === "Yes" ? (
                      <span className="bg-green-500 text-white px-2 py-1 rounded-md">
                        Featured
                      </span>
                    ) : (
                      <span>No</span>
                    )}
                  </td>
                  <td className="border p-2">
                    {category.showOnNavbar ? "Yes" : "No"}
                  </td>
                  <td className="border p-2">
                    <div className="flex space-x-2">
                      <button
                        className="text-yellow-500 hover:text-yellow-700"
                        onClick={() => handleEdit(category._id)}
                      >
                        <FiEdit />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(category._id)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="mt-5 flex justify-center space-x-2">
          {Array.from({
            length: Math.ceil(subcategories.length / itemsPerPage),
          }).map((_, pageIndex) => (
            <button
              key={pageIndex}
              onClick={() => handlePageClick(pageIndex)}
              className={`px-3 py-1 border rounded-md ${
                currentPage === pageIndex
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              {pageIndex + 1}
            </button>
          ))}
        </div>
      </div>
      <Modal isShowModal={isEdited} setIsShowModal={setIsEdited}>
        <SubcategoryEditForm
          subcategoryId={subcategoryId}
          setIsShowModal={setIsEdited}
          isShowModal={isEdited}
        />
      </Modal>
    </div>
  );
}

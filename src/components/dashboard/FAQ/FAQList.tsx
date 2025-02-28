import { useState, useEffect, useCallback } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Modal from "../../../shared/Modal/Modal";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../Hook/useAxiosSecure";
import CreateFAQForm from "./Forms/CreateFAQForm";
import EditFAQForm from "./Forms/EditFAQForm";
import useGetAllFaq from "../../../Hook/GetDataHook/useGetAllFaq";

const FAQList = () => {
  // State management

  const [loading, setLoading] = useState < any > false;
  const [isEdited, setIsEdited] = useState < any > false;
  const [isDeleted, setIsDeleted] = useState < any > false;
  const [isShowModal, setIsShowModal] = useState < any > false;
  const [currentPage, setCurrentPage] = useState < any > 0;
  const [targetId, setTargetId] = useState < any > "";
  const itemsPerPage = 10;

  const axiosSecure = useAxiosSecure();

  // Sort configuration
  const [sortConfig, setSortConfig] =
    useState < any > { key: "id", direction: "asc" };

  // Fetch product brands with custom hook
  const content = useGetAllFaq({
    isEdited,
    isDeleted,
    setLoading,
    isShowModal,
  });

  // Paginated data
  const paginatedData = useCallback(() => {
    const offset = currentPage * itemsPerPage;
    return content.slice(offset, offset + itemsPerPage);
  }, [currentPage, itemsPerPage, content]);

  // Sorting handler
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Sorted data based on configuration
  const sortedCategories = useCallback(() => {
    const sortedData = [...content];
    sortedData.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key])
        return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key])
        return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sortedData;
  }, [content, sortConfig]);

  const handleEdit = (id) => {
    setTargetId(id);
    setIsEdited(true);

    console.log(`Edit brand with ID: ${id}`);
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
            const res = await axiosSecure.delete(`/faq/${id}`);
            console.log(res, "res");
            if (res.status === 200 || res.status === 201) {
              setIsDeleted((prev: any) => !prev);

              toast.success("Brand deleted successfully!");
            }
          } catch (error) {
            console.log(error, "error");
            toast.error("Error deleting user!");
          }
        }
      });
    } catch (error) {
      console.log(error, "error");
      toast.error("Error deleting brand!");
    }
    console.log(`Delete brand with ID: ${id}`);
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Faq List</h1>
          <div>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
              onClick={() => setIsShowModal(true)}
            >
              Add New Faq
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Rearrange Brand
            </button>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500">
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
                    onClick={() => handleSort("question")}
                  >
                    Question
                    {sortConfig.key === "question" &&
                      (sortConfig.direction === "asc" ? "🔼" : "🔽")}
                  </th>
                  <th
                    className="border p-2 text-left cursor-pointer"
                    onClick={() => handleSort("answer")}
                  >
                    Answer
                    {sortConfig.key === "answer" &&
                      (sortConfig.direction === "asc" ? "🔼" : "🔽")}
                  </th>

                  <th className="border p-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData()?.length > 0 &&
                  paginatedData().map((item: any, index: number) => (
                    <tr key={item._id} className="border-b">
                      <td className="border p-2">
                        {index + 1 + currentPage * itemsPerPage}
                      </td>
                      <td className="border p-2">{item.question} </td>
                      <td className="border p-2">{item.answer}</td>
                      <td className="border p-2">
                        <div className="flex space-x-2">
                          <button
                            className="text-yellow-500 hover:text-yellow-700"
                            onClick={() => handleEdit(item._id)}
                          >
                            <FiEdit />
                          </button>
                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDelete(item._id)}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for Adding/Editing Brand */}
      <Modal isShowModal={isShowModal} setIsShowModal={setIsShowModal} >
        <CreateFAQForm
          isShowModal={isShowModal}
          setIsShowModal={setIsShowModal}
        />
      </Modal>

      <Modal isShowModal={isEdited} setIsShowModal={setIsEdited}>
        <EditFAQForm
          isShowModal={isEdited}
          setIsShowModal={setIsEdited}
          targetId={targetId}
        />
      </Modal>
    </>
  );
};

export default FAQList;

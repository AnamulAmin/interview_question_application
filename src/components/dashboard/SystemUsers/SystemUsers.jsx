// pages/system-users.js
import { useState } from "react";
import BgBlurModal from "../../../shared/Modal/BgBlurModal";
import SystemUserRegistration from "../MemberRegistration/SystemUserRegistration";
import useGetAllSystemUsers from "../../../Hook/GetDataHook/useGetAllSystemUsers";
import EditSystemUser from "../MemberRegistration/EditSystemUser/EditSystemUser";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hook/useAxiosSecure";

export default function SystemUsers() {
  const [isModalOpen, setIsModalOpen] = useState < any > false;
  const [targetId, setTargetId] = useState < any > null;
  const [isEditShowModel, setIsEditShowModel] = useState < any > false;
  const [isDeleted, setIsDeleted] = useState < any > false;

  const axiosSecure = useAxiosSecure();

  const handleEdit = (id) => {
    setTargetId(id);
    setIsEditShowModel(true);
  };

  const systemUsers = useGetAllSystemUsers({
    isDeleted,
    isEdited: isEditShowModel,
  });

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
            const res = await axiosSecure.delete(`/users/system-user/${id}`);
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
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">System Users List</h1>
      <div className="flex justify-between mb-4">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          + Add New User
        </button>
      </div>

      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">SL</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Phone</th>
            <th className="p-2 border">Address</th>
            <th className="p-2 border">User Type</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {systemUsers?.length > 0 &&
            systemUsers.map((user, index) => (
              <tr key={user.id} className="border-b">
                <td className="p-2 border">{index + 1}</td>
                <td className="p-2 border">{user.username}</td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border">{user.contact_no}</td>
                <td className="p-2 border">{user.address}</td>
                <td className="p-2 border">{user.role}</td>
                <td className="p-2 border space-x-3">
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
                    onClick={() => handleEdit(user._id)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-green-700 hover:bg-yellow-600 text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <BgBlurModal
        isShowModal={isEditShowModel}
        setIsShowModal={setIsEditShowModel}
      >
        <EditSystemUser
          isShow={isEditShowModel}
          setIsShow={setIsEditShowModel}
          targetId={targetId}
        />
      </BgBlurModal>
      <BgBlurModal isShowModal={isModalOpen} setIsShowModal={setIsModalOpen}>
        <SystemUserRegistration
          isShow={isModalOpen}
          setIsShow={setIsModalOpen}
        />
      </BgBlurModal>
    </div>
  );
}

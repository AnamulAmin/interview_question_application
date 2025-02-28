// pages/system-users.js
import { useState } from "react";
import BgBlurModal from "../../../shared/Modal/BgBlurModal";
import SystemUserRegistration from "../MemberRegistration/SystemUserRegistration";
import useGetAllSystemUsers from "../../../Hook/GetDataHook/useGetAllSystemUsers";
import EditSystemUser from "../MemberRegistration/EditSystemUser/EditSystemUser";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hook/useAxiosSecure";
import EditButton from "../../../components library/EditButton";
import DeleteButton from "../../../components library/DeleteButton";

export default function SystemUsers() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetId, setTargetId] = useState(null);
  const [isEditShowModel, setIsEditShowModel] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

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
        title: "Are you sure you want to delete this?",
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
              setIsDeleted((prev) => !prev);

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
      toast.error("Error deleting Item!");
    }
    console.log(`Delete brand with ID: ${id}`);
  };

  return (
    <div className="p-6 pt-0">
      <div className="flex items-center justify-between  mb-9">
        <h1 className="text-3xl font-semibold">System Users List</h1>
        <div className="flex justify-between">
          <button
            className="customSaveButton"
            onClick={() => setIsModalOpen(true)}
          >
            + Add New User
          </button>
        </div>
      </div>

      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-100 text-center">
            <td className="p-2 border">SL</td>
            <td className="p-2 border">Name</td>
            <td className="p-2 border">Email</td>
            <td className="p-2 border">Phone</td>
            <td className="p-2 border">Address</td>
            <td className="p-2 border">User Type</td>
            <td className="p-2 border">Action</td>
          </tr>
        </thead>
        <tbody>
          {systemUsers?.length > 0 &&
            systemUsers.map((user, index) => (
              <tr key={user.id} className="border-b text-center">
                <td className="p-2 border">{index + 1}</td>
                <td className="p-2 border">{user.username}</td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border">{user.contact_no}</td>
                <td className="p-2 border">{user.address}</td>
                <td className="p-2 border">{user.role}</td>
                <td className="p-2 py-3 border space-x-3">
                  <EditButton onClick={() => handleEdit(user._id)} />
                  <DeleteButton onClick={() => handleDelete(user._id)} />
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

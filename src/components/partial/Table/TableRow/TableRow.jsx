import { useContext, useState } from "react";
import { FiEdit3 } from "react-icons/fi";
import { CiCreditCard2 } from "react-icons/ci";
import { Link } from "react-router-dom";
import moment from "moment";
import InvoiceRow from "./InvoiceRow/InvoiceRow";
import { LuPencilLine } from "react-icons/lu";
import { MdOutlineManageAccounts } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { FiEdit } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import useAxiosSecure from "../../../../../useAxiosSecure";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { TbMessageDots } from "react-icons/tb";
import { GoDotFill } from "react-icons/go";
import { MdDone } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import SMSModal from "../../SendSMS/SMSModal";
import { AuthContext } from "../../../../providers/AuthProvider";
import { VscArrowDown } from "react-icons/vsc";
import { SlOptionsVertical } from "react-icons/sl";
import { PiArrowBendDownRightFill } from "react-icons/pi";
import { CiStickyNote } from "react-icons/ci";
import { FaFacebookF, FaLock } from "react-icons/fa";
import GenerateCredentials from "../../../../../GenerateCredentials";

function TableRow({
  data,
  setIsShowEditMember,
  setIsShowNote,
  setUserId,
  isShowManagePackageBtn = false,
  setIsShowAddPackage,
  isAddPackageBtn = false,
  invoiceData,
  setIsDeleteMember,
  setIsDeleteInvoice,
  isSMSModalOpen = false,
  setSMSModalOpen = false,
  contactNumber = "",
  setContactNumber = "",
  userId = "",
  setIsShowPrint,
  setPrintData,
  setPrintType,
  printData,
  handleGetPrintData,
  setTargetId,
  setNoteData,
}) {
  const axiosSecure = useAxiosSecure();
  const { resetPasswordWithEmail, branch, user } = useContext(AuthContext);
  const [loading, setLoading] = useState < any > false;

  const ExpireStatus = ({ expiredate }) => {
    if (!expiredate) return null;
    const expireDateObj = new Date(expiredate);
    const today = new Date();
    const timeDifference = expireDateObj - today;
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    if (daysDifference > 0) {
      return (
        <div>
          {daysDifference === 0 ? (
            <span>Expires today</span>
          ) : (
            <div className="min-w-max">
              <p className="text-green-500 font-semibold">Active</p>
              <span className="text-sm">
                Expires in {daysDifference}{" "}
                {daysDifference === 1 ? "day" : "days"}
              </span>
            </div>
          )}
        </div>
      );
    } else {
      const daysAgo = Math.abs(daysDifference);
      return (
        <div className="min-w-max">
          <p className="text-red-500 font-semibold">Inactive</p>
          <span className="text-sm">
            {" "}
            Expired {daysAgo} {daysAgo === 1 ? "day" : "days"} ago
          </span>
        </div>
      );
    }
  };

  const handleMemberDelete = async (id) => {
    // Check if the user has an admin role
    if (user.role !== "admin") {
      Swal.fire({
        title: "Access Denied",
        text: "You do not have permission to delete this member.",
        icon: "warning",
      });
      return;
    }

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
            const res = await axiosSecure.delete(
              `/users/delete/${id}?branch=${branch}`
            );

            // Check the response status to show the appropriate message
            if (res.status === 200) {
              Swal.fire({
                title: "Deleted!",
                text: "User and login data deleted successfully.",
                icon: "success",
              });
              setIsDeleteMember((prev: any) => !prev);
            } else if (res.status === 201) {
              Swal.fire({
                title: "Deleted with some issues!",
                text: "User deleted, but login data was not available.",
                icon: "info",
              });
              setIsDeleteMember((prev: any) => !prev);
            } else if (res.status === 404) {
              Swal.fire({
                title: "Not Found!",
                text: "User data not found.",
                icon: "error",
              });
            } else {
              Swal.fire({
                title: "Error!",
                text: res.data.message || "Failed to delete the member.",
                icon: "error",
              });
            }
          } catch (error) {
            Swal.fire({
              title: "Error!",
              text: "There was an error deleting the member.",
              icon: "error",
            });
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire({
            title: "Cancelled",
            text: "The member was not deleted.",
            icon: "info",
          });
        }
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to delete the member.",
        icon: "error",
      });
    }
  };

  return (
    <>
      {isShowManagePackageBtn && (
        <>
          <tr className="border-b bg-white">
            <td className="w-full lg:w-auto">
              <div className="relative">
                <div className="relative md:w-20 w-12 h-12 md:h-20">
                  <img
                    className="h-full rounded-full w-full object-cover object-center bg-white"
                    src={
                      data?.photourl
                        ? data.photourl
                        : "https://multigympremium.com/uploads/nophoto.png"
                    }
                    alt={`Photo of ${data?.full_name || "Unknown"}`}
                  />
                  <div className="absolute right-1 top-1">
                    {new Date() >= new Date(data?.expiredate) ? (
                      <></>
                    ) : (
                      <div className="text-white rounded-full max-w-min text-xl p-[9px] bg-green-500 shadow"></div>
                    )}
                  </div>
                </div>
                <div
                  onClick={() => {
                    setIsShowNote(true);
                    setTargetId(data._id);
                    setNoteData(data?.notes || "");
                  }}
                  className="flex absolute -right-1 bottom-0  bg-white  cursor-pointer transition-all duration-700  gap-1 max-w-min px-1 -ml-2 py-1 rounded-lg text-black"
                >
                  <div className="flex rounded-md items-center">
                    <span className="flex items-center gap-2 cursor-pointer">
                      <LuPencilLine className="text-lg" />
                    </span>
                  </div>
                </div>
              </div>
            </td>

            <td className="text-left space-y-1">
              <h5 className="font-bold text-base text-gray-600">
                {data?.member_id}
              </h5>
              <h5 className="text-sm text-gray-600 font-normal flex items-center gap-1">
                <CiCreditCard2 className="text-base" />
                {data?.card_no}
              </h5>
            </td>
            <td className="text-left">
              <h3 className="text-xs md:text-base font-semibold">
                {data?.full_name}
              </h3>
              {data.gender} ({data?.blood_group})
            </td>

            <td className="font-normal md:text-base text-xs">
              <h5>{data?.contact_no}</h5>
            </td>

            <td className="font-normal md:text-base text-xs">
              <h5>{data?.email}</h5>
              {data.email && <GenerateCredentials email={data.email} />}
            </td>

            <td className="md:text-base text-xs">
              <ExpireStatus expiredate={data?.expiredate} />
            </td>

            <td className="text-center text-xs min-w-max">
              <div>{data?.admission_date}</div>
              <div className="flex justify-center my-1 text-base">
                <VscArrowDown />
              </div>
              <div>{data?.expiredate}</div>
            </td>

            <td className="flex pt-8 flex-row-reverse justify-end text-left items-center">
              <Link
                to={data?.email ? `/dashboard/add_package/${data._id}` : "#"}
                className="p-1 pl-0 text-gray-600 hover:text-blue-500 text-center rounded-lg"
                onClick={(e) => {
                  if (!data?.email) {
                    e.preventDefault();
                    Swal.fire({
                      title: "No Email Found!",
                      text: "This member's email is not added. Please add an email first.",
                      icon: "warning",
                      confirmButtonText: "OK",
                      confirmButtonColor: "#f27474",
                      background: "#fff",
                      customClass: {
                        popup: "animated fadeInDown",
                      },
                    });
                  }
                }}
              >
                <MdOutlineManageAccounts className="text-2xl rounded-lg transition duration-300" />
              </Link>
              <button
                onClick={() => handleMemberDelete(data._id)}
                className="pr-1"
              >
                <AiOutlineDelete className="text-2xl text-gray-600 transition duration-300 hover:text-red-500" />
              </button>
              <button
                onClick={() => {
                  setSMSModalOpen(true);
                  setContactNumber(data?.contact_no);
                }}
                className="pr-1"
              >
                <TbMessageDots className="text-2xl text-gray-600 transition duration-300 hover:text-yellow-500" />
              </button>
              <button
                className="cursor-pointer text-2xl text-gray-600 hover:text-blue-500 pr-1 rounded-lg transition duration-300"
                onClick={() => {
                  setIsShowEditMember(true);
                  setUserId(data._id);
                }}
              >
                <FiEdit3 />
              </button>
            </td>
          </tr>

          {data.notes && (
            <tr>
              <td colSpan="8">
                <div className="flex items-center">
                  <CiStickyNote className="text-xl text-gray-500"></CiStickyNote>
                  <p>Note: {data?.notes}</p>
                </div>
              </td>
            </tr>
          )}
        </>
      )}

      {isAddPackageBtn && (
        <div>
          <div className="grid grid-cols-5 gap-6 p-6 shadow-xl rounded-lg bg-gradient-to-r from-blue-50 to-indigo-100 relative overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl">
            {/* Decorative Background Shape */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-full opacity-20"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-bl from-indigo-500 to-purple-600 rounded-full opacity-20"></div>

            {/* Display Locker status if available */}
            {data?.Locker_id ? (
              <div className="absolute top-0 left-0 mt-2 ml-2 flex items-center space-x-1 bg-gray-700 text-white rounded-full px-2 py-1 text-xs font-bold shadow-md">
                <FaLock className="text-white" /> {/* Locker Icon */}
                <span>Locker Yes</span>
              </div>
            ) : null}

            {/* Left side: Avatar with status */}
            <div className="col-span-1 relative flex justify-center">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-gray-200 shadow-lg">
                <img
                  src={data?.photourl || "https://via.placeholder.com/150"}
                  alt={`Photo of ${data?.full_name || "Unknown"}`}
                  className="w-full h-full object-cover"
                />
              </div>
              {new Date() >= new Date(data?.expiredate) ? (
                <div className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-4 py-1 text-xs font-bold shadow-md">
                  Expired
                </div>
              ) : (
                <div className="absolute top-1 right-1 bg-green-500 text-white rounded-full px-4 py-1 text-xs font-bold shadow-md">
                  Active
                </div>
              )}
            </div>

            {/* Middle section: User details */}
            <div className="col-span-3 flex flex-col justify-center space-y-2">
              <h2 className="text-2xl font-bold text-indigo-800">
                {data?.full_name || "N/A"}
              </h2>
              <p className="text-gray-600 font-medium">
                🆔 Member ID: {data?.member_id || "N/A"}
              </p>
              <p className="text-gray-600 font-medium">
                📞 Mobile: {data?.contact_no || "N/A"}
              </p>
              <p className="text-gray-600 font-medium">
                📧 Email: {data?.email || "N/A"}
              </p>
              <p className="text-gray-600 font-medium">
                🗓️ Admission Date:{" "}
                {data?.admission_date
                  ? new Date(data.admission_date).toLocaleDateString()
                  : "N/A"}
              </p>
              <p className="text-gray-600 font-medium">
                ⌛ Expire Date:{" "}
                {data?.expiredate
                  ? new Date(data.expiredate).toLocaleDateString()
                  : "N/A"}{" "}
                {data?.expiredate && new Date(data.expiredate) > new Date()
                  ? `(Expires in ${Math.floor(
                      (new Date(data.expiredate) - new Date()) /
                        (1000 * 60 * 60 * 24)
                    )} days)`
                  : data?.expiredate
                  ? `(Expired ${Math.floor(
                      (new Date() - new Date(data.expiredate)) /
                        (1000 * 60 * 60 * 24)
                    )} days ago)`
                  : ""}
              </p>
            </div>

            {/* Right section: Add Package button */}
            <div className="col-span-1 flex justify-center items-center">
              <button
                className="btn btn-primary btn-wide shadow-md hover:bg-indigo-600 transition-all duration-300"
                onClick={() => {
                  if (!data?.email) {
                    Swal.fire({
                      title: "No Email Found!",
                      text: "This member's email is not added. Please add an email first.",
                      icon: "warning",
                      confirmButtonText: "OK",
                      confirmButtonColor: "#f27474",
                      background: "#fff",
                      customClass: {
                        popup: "animated fadeInDown",
                      },
                    });
                  } else {
                    setIsShowAddPackage(true);
                    setUserId(data._id);
                  }
                }}
              >
                <IoMdAdd className="mr-2" size={20} />
                Add Package
              </button>
            </div>
          </div>
          <InvoiceRow
            invoiceData={invoiceData}
            data={data}
            setIsShowNote={setIsShowNote}
            setIsDeleteInvoice={setIsDeleteInvoice}
            setIsDeleteMember={setIsDeleteMember}
            userId={userId}
            setIsShowPrint={setIsShowPrint}
            setPrintData={setPrintData}
            setPrintType={setPrintType}
            printData={printData}
            handleGetPrintData={handleGetPrintData}
          />
        </div>
      )}
    </>
  );
}

export default TableRow;

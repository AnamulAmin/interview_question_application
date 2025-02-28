import moment from "moment";
import { useContext } from "react";
import toast from "react-hot-toast";

import { FaRegEdit } from "react-icons/fa";

import Swal from "sweetalert2";
import { AuthContext, useAuth } from "../../../../../providers/AuthProvider";
import {
  AiOutlinePrinter,
  AiOutlineFile,
  AiOutlineDelete,
} from "react-icons/ai";
import useAxiosSecure from "../../../../Hook/useAxiosSecure";

function InvoiceRow({
  invoiceData,
  data,
  setIsShowNote,
  setIsDeleteInvoice,
  setIsDeleteMember,
  userId = "",
  setIsShowPrint = () => {},
  setPrintData = () => {},
  setPrintType = () => {},
  printData = () => {},
  handleGetPrintData = () => {},
}) {
  const axiosSecure = useAxiosSecure();
  const { branch, user } = useContext(AuthContext);
  console.log(user);

  const handleInvoiceDelete = async (id, data, user) => {
    try {
      const createdDate = moment(data.createdAt).format("YYYY-MM-DD");
      const todayDate = moment().format("YYYY-MM-DD");

      const canDelete =
        (user.email === data.login_email && createdDate === todayDate) ||
        user.role === "admin";

      if (!canDelete) {
        Swal.fire({
          icon: "error",
          title: "Permission Denied",
          text: "You do not have permission to delete this item.",
        });
        return;
      }

      Swal.fire({
        title: "Do you want to Delete the item?",
        showCancelButton: true,
        confirmButtonText: "Delete",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const res = await axiosSecure.delete(
            `/invoice/delete/${id}?branch=${data.branch}`
          );
          toast.success("Invoice Deleted Successfully");
          setIsDeleteMember((prev: any) => !prev);
          setIsDeleteInvoice((prev: any) => !prev);
        } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info");
        }
      });
    } catch (error) {
      toast.error("Invoice Delete Failed");
      console.error("Error", error);
    }
  };

  const handlePrint = async (id, printType) => {
    try {
      const res = await axiosSecure.get(
        `/invoice/get-id/${id}?branch=${branch}`
      );
      if (res.status === 200) {
        setPrintType(printType);
        setIsShowPrint(true);
        setPrintData(res.data);
      } else {
        Swal.fire({
          title: "Error!",
          text: res.data.message || "Failed to get Data.",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to get Data.",
        icon: "error",
      });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `Created On: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  const isActive = (date) => {
    const today = new Date().getTime();
    const endDate = new Date(date).getTime();
    return today > endDate ? "Expired" : "Active";
  };

  return (
    <div className="flex flex-col items-center">
      {invoiceData.length > 0 ? (
        invoiceData.map((item: any, index: number) => (
          <tr
            role="row"
            key={item._id}
            className="relative bg-gradient-to-r p-3 from-gray-50 via-white to-gray-50 shadow-xl border border-gray-200 rounded-lg mb-4 transition transform hover:scale-105"
          >
            <div className="absolute top-2 right-2 flex space-x-2">
              {/* Status Badge */}
              <span
                className={`px-3 py-1 rounded-full text-white text-xs ${
                  isActive(item?.end_date) === "Expired"
                    ? "bg-red-600"
                    : "bg-green-600"
                }`}
              >
                {isActive(item?.end_date)}
              </span>

              {/* Branch Badge */}
              <span className="px-3 py-1 rounded-full text-gray-700 text-xs font-semibold bg-gray-100 shadow-sm">
                Branch:{" "}
                {item?.branch === "shia"
                  ? "Shia Mosjid Branch"
                  : item?.branch === "lalmatia"
                  ? "Lalmatia Branch"
                  : item?.branch}
              </span>
            </div>

            <td className="text-left space-y-2 col-span-2 px-6 py-4">
              <h3 className="text-lg font-bold text-blue-800">
                {item?.package_name}
              </h3>
              <h5 className="text-md font-medium text-gray-700">
                <p>{formatDate(item?.createdAt)}</p>
              </h5>
            </td>
            <td className="col-span-1 px-6 py-4">
              <div className="flex flex-col w-full h-full">
                <h4 className="text-sm font-semibold text-gray-700 mb-1">
                  Start On
                </h4>
                <h5 className="text-sm text-gray-600">{item?.start_date}</h5>
                <p className="text-xs text-gray-500"></p>
              </div>
            </td>
            <td className="text-center col-span-1 px-6 py-4">
              <div className="flex flex-col w-full h-full gap-1">
                <h4 className="text-sm font-semibold text-gray-700">
                  Expire On
                </h4>
                <h5 className="text-sm text-gray-600">{item?.end_date}</h5>
              </div>
            </td>
            <td className="text-right col-span-1 px-6 py-4">
              <h4 className="text-sm font-semibold text-gray-700">
                Receipt No
              </h4>
              <h5 className="text-gray-700">{item?.receipt_no}</h5>
            </td>
            <td className="text-right col-span-1 px-6 py-4">
              <h4 className="text-sm font-semibold text-gray-700">
                Admission Fee
              </h4>
              <h5 className="text-gray-700">{item?.admissionFee}</h5>
            </td>
            <td className="text-right col-span-1 px-6 py-4">
              <h4 className="text-sm font-semibold text-gray-700">
                Package Fee
              </h4>
              <h5 className="text-gray-700">{item?.packageFee}</h5>
            </td>
            <td className="text-right col-span-1 px-6 py-4">
              <h4 className="text-sm font-semibold text-gray-700">Discount</h4>
              <h5 className="text-gray-700">{item?.discount}</h5>
            </td>
            <td className="text-right col-span-1 px-6 py-4">
              <h4 className="text-sm font-semibold text-gray-700">
                Total Cost
              </h4>
              <h5 className="text-gray-800 font-semibold">
                {parseInt(item?.packageFee) +
                  parseInt(item?.admissionFee) -
                  parseInt(item?.discount)}
              </h5>
            </td>
            <td className="text-right col-span-1 px-6 py-4">
              <div className="flex items-center gap-3">
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => handleGetPrintData(item?._id, "thermal")}
                >
                  <AiOutlinePrinter className="text-xl" />
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  onClick={() => handleGetPrintData(item?._id, "A4Print")}
                >
                  <AiOutlineFile className="text-xl" />
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  onClick={() => handleInvoiceDelete(item._id, data, user)}
                >
                  <AiOutlineDelete className="text-xl" />
                </button>
              </div>
            </td>
          </tr>
        ))
      ) : (
        <h3 className="text-center py-6 text-2xl font-bold text-gray-600">
          No Data
        </h3>
      )}
    </div>
  );
}

export default InvoiceRow;

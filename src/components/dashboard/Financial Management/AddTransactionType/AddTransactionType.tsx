import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { RiDeleteBin7Line } from "react-icons/ri";
import { FiEdit3 } from "react-icons/fi";
import Swal from "sweetalert2";
// import Modal from "../../../partial/Modal/Modal";
// import { useAuth } from "../../../../providers/AuthProvider";

function AddTransactionType() {
  const [isShowModal, setIsShowModal] = useState<any>(false);
  const [paymentMethodData, setPaymentMethodData] = useState<any[]>([]);
  const [isShowDeleteModal, setIsShowDeleteModal] = useState<any>(false);
  const [isShowEditModal, setIsShowEditModal] = useState<any>(false);
  const [targetId, setTargetId] = useState<any>("");
  // const axiosSecure = UseAxiosSecure();
  // const { branch } = useAuth();

  // useEffect(() => {
  //   const fetchPaymentMethodData = async () => {
  //     try {
  //       const response = await axiosSecure.get(
  //         `/transaction-type?branch=${branch}`
  //       );
  //       setPaymentMethodData(response?.data);
  //     } catch (error) {
  //       console.error("Error fetching payment method data:", error);
  //     }
  //   };

  //   fetchPaymentMethodData();
  // }, [axiosSecure, isShowDeleteModal, isShowModal, isShowEditModal]);

  // const handleDelete = async (id) => {
  //   try {
  //     Swal.fire({
  //       title: "Are you sure?",
  //       text: "You won't be able to revert this!",
  //       icon: "warning",
  //       showCancelButton: true,
  //       confirmButtonColor: "#3085d6",
  //       cancelButtonColor: "#d33",
  //       confirmButtonText: "Yes, delete it!",
  //     }).then(async (result) => {
  //       if (result.isConfirmed) {
  //         const response = await axiosSecure.delete(`/transaction-type/${id}`);
  //         if (response.status === 200 || response.status === 201) {
  //           setIsShowDeleteModal((prev) => !prev);
  //           Swal.fire({
  //             title: "Success",
  //             text: "Payment method deleted successfully",
  //             icon: "success",
  //             confirmButtonText: "Ok",
  //           });
  //         }
  //       }
  //     });
  //   } catch (error) {
  //     console.log("error", error);
  //     Swal.fire({
  //       title: "Error",
  //       text: `Something went wrong`,
  //       icon: "error",
  //       confirmButtonText: "Ok",
  //     });
  //   }
  // };

  return (
    <div className="container mx-auto pt-0 p-12">
      <div className="flex md:flex-row flex-col gap-2 flex-wrap justify-between items-center mb-6">
        <h2 className="md:text-3xl font-semibold text-2xl">
          Add Transaction Type
        </h2>
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white"
          onClick={() => setIsShowModal(true)}
        >
          <FaPlus />
          <span>Add New</span>
        </button>
      </div>

      <div className="border-t py-4 rounded-xl shadow">
        <div className="hidden sm:grid sm:grid-cols-12 gap-4 items-center py-2 px-4 border-b">
          <h5 className="col-span-3 text-xl font-semibold">Value</h5>
          <h5 className="col-span-5 text-xl font-semibold">Label</h5>
          <h5 className="col-span-2 text-xl font-semibold">Type</h5>
          <h5 className="col-span-2 text-xl font-semibold text-right">
            Action
          </h5>
        </div>

        {paymentMethodData?.length > 0 ? (
          paymentMethodData.map((item, index) => (
            <div
              className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center py-4 px-4 border-t"
              key={index}
            >
              <h3 className="sm:col-span-3 text-lg font-semibold">
                {item?.value}
              </h3>
              <p className="sm:col-span-5">
                {item?.label.length > 50
                  ? item?.label.slice(0, 50) + "..."
                  : item?.label}
              </p>
              <h3 className="sm:col-span-2 text-lg">{item?.type}</h3>
              <div className="flex justify-start sm:justify-end sm:col-span-2 space-x-4">
                <button
                  className="bg-blue-100 text-white p-2 rounded-xl"
                  onClick={() => {
                    setTargetId(item?._id);
                    setIsShowEditModal(true);
                  }}
                >
                  <FiEdit3 className="text-blue-500 text-xl" />
                </button>
                <button
                  className="bg-red-100 text-white p-2 rounded-xl"
                  // onClick={() => handleDelete(item?._id)}
                >
                  <RiDeleteBin7Line className="text-red-500 text-xl" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <h1 className="text-2xl font-semibold">
                No Payment Method Found
              </h1>
              <p className="text-gray-500 text-sm">
                No payment method found with this search criteria.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {/* <Modal isShowModal={isShowEditModal} setIsShowModal={setIsShowEditModal}>
        <EditTransactionType
          setIsShowModal={setIsShowEditModal}
          isShowModal={isShowEditModal}
          targetId={targetId}
        />
      </Modal>
      <Modal isShowModal={isShowModal} setIsShowModal={setIsShowModal}>
        <CreateTransactionType
          setIsShowModal={setIsShowModal}
          isShowModal={isShowModal}
        />
      </Modal> */}
    </div>
  );
}

export default AddTransactionType;

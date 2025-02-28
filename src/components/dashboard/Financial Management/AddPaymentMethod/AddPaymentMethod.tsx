import { useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";
// import Modal from "../../../partial/Modal/Modal";
// import AddPaymentMethodForm from "./AddPaymentMethodForm";
// import UseAxiosSecure from "../../../../Hook/UseAxioSecure";
import Swal from "sweetalert2";
import { RiDeleteBin7Line } from "react-icons/ri";
// import { useAuth } from "../../../../providers/AuthProvider";

function AddPaymentMethod() {
  const [isShowModal, setIsShowModal] = useState<any>(false);
  const [paymentMethodData, setPaymentMethodData] = useState<any[]>([]);
  const [isShowDeleteModal, setIsShowDeleteModal] = useState<any>(false);
  // const { branch } = useAuth();
  // const axiosSecure = UseAxiosSecure();

  // useEffect(() => {
  //   const fetchPaymentMethodData = async () => {
  //     try {
  //       const response = await axiosSecure.get(
  //         `/payment-method?branch=${branch}`
  //       );
  //       setPaymentMethodData(response.data);
  //     } catch (error) {
  //       console.error("Error fetching payment method data:", error);
  //     }
  //   };

  //   fetchPaymentMethodData();
  // }, [axiosSecure, isShowDeleteModal, isShowModal]);

  // const handleDelete = async (id: any) => {
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
  //         const response = await axiosSecure.delete(`/payment-method/${id}`);

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
    <div className="pt-0 p-5">
      <h2 className="text-3xl  font-semibold mb-2 mt-3 ml-3">
        Add Payment Method
      </h2>
      <h2 className="text-sm font-normal mb-9 text-gray-500 ml-3">
        View and manage the payment methods in your account
      </h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="border flex-col py-4 px-6 rounded-xl">
          {paymentMethodData?.length > 0 ? (
            paymentMethodData.map((item, index) => (
              <div
                className="gap-4 flex justify-between items-center border rounded-xl px-4 py-1 mb-2 transition-transform duration-200 hover:scale-105 hover:shadow-lg"
                key={index}
              >
                <img
                  src={item?.image}
                  alt="logo"
                  className="w-10 h-10 rounded-full object-contain object-center"
                />
                <h3 className="text-xl font-semibold">{item?.name}</h3>
                <button
                  className="bg-red-100 text-white p-1 rounded transition-all duration-200 hover:bg-red-500 hover:text-white"
                  // onClick={() => handleDelete(item?._id)}
                >
                  <RiDeleteBin7Line className="text-red-500 text-xl hover:text-white" />
                </button>
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
        <div
          className="flex items-center gap-4 justify-center flex-col rounded-xl h-[300px] border border-blue-300 bg-blue-100 cursor-pointer transition-transform duration-200 hover:scale-105 hover:shadow-lg"
          onClick={() => setIsShowModal(true)}
        >
          <GoPlus className="text-4xl text-blue-500" />
          <h3 className="text-xl font-semibold text-blue-500">
            Add New Payment Method
          </h3>
        </div>
      </div>
      {/* <Modal isShowModal={isShowModal} setIsShowModal={setIsShowModal}>
        <AddPaymentMethodForm
          setIsShowModal={setIsShowModal}
          isShowModal={isShowModal}
        />
      </Modal> */}
    </div>
  );
}

export default AddPaymentMethod;

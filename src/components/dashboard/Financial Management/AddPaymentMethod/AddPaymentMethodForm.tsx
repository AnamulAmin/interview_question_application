import React, { useEffect, useState } from "react";
// import ImageUpload from "../../../../config/Upload/ImageUploadcpanel";
// import { useAuth } from "../../../../providers/AuthProvider";
// import UseAxiosSecure from "../../../../Hook/UseAxioSecure";
import Swal from "sweetalert2";

function AddPaymentMethodForm({ setIsShowModal, isShowModal }: any): any {
  const [imageUrl, setImageUrl] = useState("");
  // const { user } = useAuth();
  // const axiosSecure = UseAxiosSecure();
  const [loading, setLoading] = useState(false);

  // const handleSubmit = async (e: any) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   const name = e.target.method_name.value;
  //   const logo = e.target.method_logo.value;
  //   console.log("handleSubmit", e);

  //   try {
  //     const response = await axiosSecure.post(`/payment-method/create`, {
  //       name,
  //       image: logo,
  //       branch: user?.branch || "shia",
  //     });

  //     if (response.status === 200 || response.status === 201) {
  //       Swal.fire({
  //         title: "Success",
  //         text: "Payment method added successfully",
  //         icon: "success",
  //         confirmButtonText: "Ok",
  //       });
  //       setImageUrl("");
  //       setIsShowModal(false);
  //       e.target.method_name.value = "";
  //       e.target.method_logo.value = "";
  //     }
  //     setLoading(false);
  //   } catch (error) {
  //     console.log("error", error);
  //     Swal.fire({
  //       title: "Error",
  //       text: `Something went wrong`,
  //       icon: "error",
  //       confirmButtonText: "Ok",
  //     });
  //     setLoading(false);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   const paymentMethodInput = document.getElementById("method_name");
  //   if (!isShowModal) {
  //     paymentMethodInput.value = "";
  //     setImageUrl("");
  //   }
  // }, [isShowModal]);
  return (
    <form
      className="bg-white p-9 py-6 rounded-xl"
      // onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-1 gap-4">
        <div className="flex flex-col gap-4">
          <label htmlFor="method_name" className="text-lg font-semibold">
            Payment Method Name
          </label>
          <input
            type="text"
            id="method_name"
            name="method_name"
            placeholder="Payment method name"
            className="border-2 py-3 outline-none border-gray-300 rounded-xl p-2 w-full"
          />
        </div>
        <div className="flex justify-between items-center gap-4 ">
          <div className="flex flex-col gap-4 w-full">
            <label htmlFor="" className="text-lg font-semibold">
              Enter Logo URL
            </label>
            <input
              type="text"
              id="method_logo"
              value={imageUrl}
              placeholder="Enter logo url"
              className="border-2 outline-none border-gray-300 rounded-xl p-2 w-full self-end py-3"
            />
          </div>
        </div>
        {/* <ImageUpload setImageUrl={setImageUrl} label="Upload Logo" /> */}
      </div>
      <button className="bg-blue-500 w-full font-medium text-white hover:bg-blue-600 px-4 py-3 rounded-lg ml-auto flex gap-3 mt-9 ">
        {loading && (
          <span className="loading loading-spinner loading-md"></span>
        )}
        Add Payment Method
      </button>
    </form>
  );
}

export default AddPaymentMethodForm;

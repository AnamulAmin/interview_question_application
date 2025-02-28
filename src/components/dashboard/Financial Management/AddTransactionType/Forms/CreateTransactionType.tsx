import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
// import { useAuth } from "../../../../../providers/AuthProvider";
// import UseAxiosSecure from "../../../../../Hook/UseAxioSecure";

function CreateTransactionType({ setIsShowModal, isShowModal }: any): any {
  // const { user } = useAuth();
  // const axiosSecure = UseAxiosSecure();
  const [loading, setLoading] = useState(false);

  const surveyFields = [
    { value: "income", label: "Income" },
    { value: "expense", label: "Expense" },
  ];

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   const value = e.target.value.value;
  //   const label = e.target.label.value;
  //   const type = e.target.type.value;

  //   console.log("handleSubmit", { value, label, type });

  //   try {
  //     const response = await axiosSecure.post(`/transaction-type/create`, {
  //       value,
  //       type,
  //       label,
  //       branch: user?.branch || "shia",
  //     });
  //     if (response.status === 200 || response.status === 201) {
  //       Swal.fire({
  //         title: "Success",
  //         text: "Payment method added successfully",
  //         icon: "success",
  //         confirmButtonText: "Ok",
  //       });
  //       setIsShowModal(false);
  //       e.target.value.value = "";
  //       e.target.label.value = "";
  //       e.target.type.value = "";
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

  return (
    <form
      className="bg-white p-7 rounded-xl w-[90%] md:w-[40%]"
      // onSubmit={handleSubmit}
    >
      <h3 className="text-2xl font-semibold mb-6 text-nowrap">Add Question</h3>
      <div className="grid grid-cols-1 gap-4">
        <div className="flex flex-col gap-3">
          <label htmlFor="label" className="text-xl font-semibold">
            Label
          </label>
          <input
            type="text"
            id="label"
            name="label"
            className="border-2 border-gray-300 rounded-xl outline-none p-2 w-full"
          />
        </div>
        <div className="flex flex-col gap-3">
          <label htmlFor="value" className="text-xl font-semibold">
            Value
          </label>
          <input
            type="text"
            name="value"
            id="value"
            className="border-2 border-gray-300 rounded-xl outline-none p-2 w-full"
          />
        </div>
        <div className="flex flex-col gap-3">
          <label htmlFor="type" className="text-xl font-semibold">
            Type
          </label>
          <select
            type="text"
            id="type"
            name="type"
            className="border-2 border-gray-300 rounded-xl outline-none p-2 w-full"
          >
            {surveyFields.map((item, index) => (
              <option key={index} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button
        className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 font-semibold rounded-lg ml-auto  w-fit mt-12 flex gap-3 items-center"
        disabled={loading}
      >
        {loading && (
          <span className="loading loading-spinner loading-md"></span>
        )}
        Add Transaction Type
      </button>
    </form>
  );
}

export default CreateTransactionType;

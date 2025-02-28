import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
// import { useAuth } from "../../../../../providers/AuthProvider";
// import UseAxiosSecure from "../../../../../Hook/UseAxioSecure";

function EditTransactionType({
  setIsShowModal,
  isShowModal,
  targetId,
}: any): any {
  // const { user } = useAuth();
  // const axiosSecure = UseAxiosSecure();
  const [value, setValue] = useState<any>("");
  const [type, setType] = useState<any>("");
  const [label, setLabel] = useState<any>("");
  const [loading, setLoading] = useState<any>(false);

  const surveyFields = [
    { name: "income", label: "Income" },
    { name: "expense", label: "Expense" },
  ];

  // useEffect(() => {
  //   const labelField = document.getElementById("label");

  //   const fetchPaymentMethodData = async () => {
  //     try {
  //       const response = await axiosSecure.get(
  //         `/transaction-type/${targetId}?branch=${user?.branch}`
  //       );
  //       labelField.value = response.data?.label;
  //       setType(response.data?.type);
  //       setValue(response.data?.value);
  //       setLabel(response.data?.label);
  //     } catch (error) {
  //       console.error("Error fetching payment method data:", error);
  //     }
  //   };

  //   fetchPaymentMethodData();
  // }, [axiosSecure, isShowModal, targetId]);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   const value = e.target.value.value;
  //   const label = e.target.label.value;
  //   const type = e.target.type.value;

  //   console.log("handleSubmit", { value, label, type });

  //   try {
  //     const response = await axiosSecure.put(`/transaction-type/${targetId}`, {
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
  //       setValue("");
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
      className="bg-white p-8 rounded-xl w-[90%] md:w-[40%]"
      // onSubmit={handleSubmit}
    >
      <h3 className="text-2xl font-semibold mb-5 text-nowrap ">
        Edit Question
      </h3>
      <div className="grid grid-cols-1 gap-4">
        <div className="flex flex-col gap-4">
          <label htmlFor="label" className="text-xl font-semibold">
            Label
          </label>
          <input
            type="text"
            id="label"
            name="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="border-2 border-gray-300 outline-none p-3 rounded-xl w-full"
          />
        </div>
        <div className="flex flex-col gap-4">
          <label htmlFor="value" className="text-xl font-semibold">
            Value
          </label>
          <input
            type="text"
            id="value"
            name="value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="border-2 border-gray-300 outline-none p-3 rounded-xl w-full"
          />
        </div>
        <div className="flex flex-col gap-4">
          <label htmlFor="type" className="text-xl font-semibold">
            Field Type
          </label>
          <select
            type="text"
            id="type"
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border-2 border-gray-300 outline-none p-3 rounded-xl w-full"
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
        type="submit"
        className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 font-semibold rounded-lg ml-auto block w-fit mt-12"
        disabled={loading}
      >
        {loading && (
          <span className="loading loading-spinner loading-md"></span>
        )}
        Edit Transaction Type
      </button>
    </form>
  );
}

export default EditTransactionType;

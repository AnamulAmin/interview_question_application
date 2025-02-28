// import React from "react";
import { AiOutlineDelete } from "react-icons/ai";
// import { FiEdit } from "react-icons/fi";
// import toast from "react-hot-toast";
// import Swal from "sweetalert2";
import moment from "moment";

function ReportRow({ data, setIsDeleteInvoice, timeFrame, index }: any): any {
  // const axiosSecure = UseAxiosSecure();
  // const handleInvoiceDelete = async (id) => {
  //   try {
  //     Swal.fire({
  //       title: "Do you want to Delete the item?",

  //       showCancelButton: true,
  //       confirmButtonText: "Delete",
  //     }).then(async (result) => {
  //       /* Read more about isConfirmed, isDenied below */
  //       if (result.isConfirmed) {
  //         const res = await axiosSecure.delete(`/invoice/delete/${id}`);
  //         console.log("res 16561", res);
  //         toast.success("Invoice Deleted Successfully");
  //         setIsDeleteInvoice((prev) => !prev);
  //       } else if (result.isDenied) {
  //         Swal.fire("Changes are not saved", "", "info");
  //       }
  //     });
  //   } catch (error) {
  //     toast.error("Member Deleted Failed");
  //     console.error("res 16561", error);
  //   }
  // };
  return (
    <>
      {timeFrame === "daily" ? (
        <div className="grid grid-cols-12  hover:bg-gray-50 text-lg text-center font-semibold">
          <div className="col-span-1 text-left font-normal">
            <p className="py-3">{index + 1}</p>
          </div>
          <div className="col-span-2">
            <h3 className="text-sm font-normal mr-3 py-4">
              {data?.receipt_no}
            </h3>
          </div>

          <div className="col-span-2 text-sm text-left font-normal">
            <h5 className="mr-2 py-2">
              {data?.member_name} <span>({data?.member_id})</span>
            </h5>
          </div>

          <div className="text-sm col-span-1 font-normal text-center ">
            <h5 className="py-2">
              <span className="text-nowrap">
                {moment(data?.admission_date).format("DD-MM")}
              </span>{" "}
              <br />
              {moment(data?.admission_date).format("HH:mm")}
            </h5>
          </div>
          <div className="text-sm col-span-1 font-normal text-center ">
            <h5 className="py-4">{data?.admissionFee}</h5>
          </div>
          <div className="text-sm col-span-1 font-normal text-center ">
            <h5 className="py-4">{data?.packageFee}</h5>
          </div>

          <div className="text-sm col-span-1 font-normal text-center ">
            <h5 className="py-4">{data?.discount}</h5>
          </div>
          <div className="text-sm col-span-1 font-normal text-center ">
            <h5 className="py-4">{data?.payment_method}</h5>
          </div>
          <div className="col-span-2 text-sm text-right flex gap-6  font-normal justify-end">
            <h5 className="py-4">
              {parseInt(data?.admissionFee) +
                parseInt(data?.packageFee) -
                parseInt(data?.discount)}
            </h5>
            <button
              className="flex  text-red-500  transition-all duration-500 items-center gap-3  text-2xl hover:bg-red-200 p-2 rounded-lg"
              // onClick={() => handleInvoiceDelete(data._id)}
            >
              <AiOutlineDelete />
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-12 items-center justify-between  border-gray-300 hover:bg-gray-50 text-xs md:text-lg md:font-semibold">
          <div className="col-span-1 text-left ">{data.date}</div>
          <div className="col-span-2 text-center  border-l border-gray-300">
            {data?.packageFees}
          </div>
          <div className="text-center col-span-3  border-l border-gray-300 ">
            {data?.admissionFees}
          </div>

          <div className=" col-span-2 text-center  border-l border-gray-300">
            {data?.monthlyFees || 0}
          </div>

          <div className="col-span-2 text-center  border-l border-gray-300">
            {data?.discount}
          </div>
          <div className="col-span-2 text-right  border-l border-gray-300">
            {data?.total}
          </div>
        </div>
      )}
    </>
  );
}

export default ReportRow;

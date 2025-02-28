import { AiOutlineDelete } from "react-icons/ai";
// import UseAxiosSecure from "../../../../../../Hook/UseAxioSecure";

function InvoiceRow({
  data,
  setIsDeleteTransaction = () => {},
  timeFrame,
  index,
}: any): any {
  console.log(setIsDeleteTransaction, "setIsDeleteTransaction");
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
  //         const res = await axiosSecure.delete(`/transaction/delete/${id}`);
  //         setIsDeleteTransaction((prev) => !prev);
  //         console.log("res 16561", res);
  //         toast.success("Invoice Deleted Successfully");
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
        <div className="grid font-normal grid-cols-12 rounded-md hover:bg-gray-50   text-xs md:text-lg text-center">
          <div className="py-2 pt-3 text-left col-span-1 space-y-1">
            <h3 className=" text-xs md:text-lg  font-normal">{index + 1}</h3>
          </div>
          <div className="py-2 pt-3 text-left space-y-1  col-span-2">
            <h5 className="text-md first-letter:capitalize    mr-3">
              {data?.transaction_type || "income"}
            </h5>
          </div>

          <div className="py-2 pt-3  hidden md:block col-span-2">
            <h5 className="ml-3   "> {data?.receipt_no}</h5>
          </div>

          <div className="py-2 pt-3 col-span-2">
            <h5>{data?.transaction_name || data?.package_name}</h5>
          </div>

          <div className="py-2 pt-3  col-span-2">
            <h5>{data?.payment_method}</h5>
          </div>
          <div className="py-2 pt-3 col-span-2">
            <h5>
              {data?.transaction_type
                ? data?.amount
                : parseInt(data?.packageFee) +
                  parseInt(data?.admissionFee) -
                  parseInt(data?.discount)}
            </h5>
          </div>

          <div className="py-2 text-right col-span-1">
            <button
              className="flex  text-red-500  transition-all duration-500 items-center gap-3 flex-row-reverse text-2xl hover:bg-red-200 p-2 rounded-lg"
              // onClick={() => handleInvoiceDelete(data._id)}
            >
              <AiOutlineDelete />
            </button>
          </div>
        </div>
      ) : (
        <tr className="grid grid-cols-12 items-center justify-between border border-gray-400    hover:bg-blue-100 text-lg font-semibold">
          <div className="col-span-3 text-left ">{data.date}</div>
          <div className="col-span-3 text-center border-l border-gray-400">
            {data?.income}
          </div>
          <div className="text-center col-span-3 border-l border-gray-400 ">
            {data?.expense}
          </div>

          <div className="col-span-3 text-right border-l border-gray-400">
            {data?.total}
          </div>
        </tr>
      )}
    </>
  );
}

export default InvoiceRow;

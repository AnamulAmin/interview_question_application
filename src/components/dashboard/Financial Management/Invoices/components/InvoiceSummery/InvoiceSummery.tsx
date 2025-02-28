function InvoiceSummery({
  data,
  startDate,
  endDate,
  method_summary,
  cumulativeBalance,
}: any): any {
  const value = -1;
  return (
    <div className="bg-white  p-4 rounded-xl shadow space-y-5 pb-10">
      <h3 className="md:text-2xl font-medium leading-6 text-gray-900 border-b pb-4 ">
        Summary
      </h3>

      <ul className="md:text-lg space-y-4">
        <li className="flex items-center justify-between gap-4">
          <p className="">Cumulative Balance :</p>{" "}
          <span
            className={`${
              cumulativeBalance?.cumulativeBalance > 0
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {cumulativeBalance?.cumulativeBalance || 0}{" "}
            <span className="text-black">BDT </span>
          </span>
        </li>
        <li className="flex items-center justify-between gap-4">
          <b className="text-sm md:text-base font-normal">From - To Date :</b>{" "}
          {startDate} - {endDate}
        </li>
        <li className="flex items-center justify-between gap-4">
          <b className="text-sm md:text-base font-normal capitalize">
            total Admission Fees (filtered) :
          </b>
          <span
            className={`${
              data?.totalAdmissionFees > 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {data?.totalAdmissionFees || 0}{" "}
            <span className="text-black">BDT </span>
          </span>
        </li>
        <li className="flex items-center justify-between gap-4">
          <b className="text-sm md:text-base font-normal capitalize">
            total Package Fees (filtered):
          </b>{" "}
          <span
            className={`${
              data?.totalPackageFees > 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {data?.totalPackageFees || 0}{" "}
            <span className="text-black">BDT </span>
          </span>
        </li>
        <li className="flex items-center justify-between gap-4">
          <b className="font-normal capitalize text-sm md:text-base">
            total Discount (filtered):
          </b>{" "}
          <span className={`text-red-500`}>
            {data?.totalDiscount || 0} <span className="text-black">BDT </span>
          </span>
        </li>

        <li className="flex border-t pt-2 border-gray-400 items-center justify-between gap-4">
          <b className="font-semibold capitalize">Total Collected :</b>{" "}
          <span
            className={`${
              parseInt(data?.totalAdmissionFees) +
                parseInt(data?.totalPackageFees) -
                parseInt(data?.totalDiscount) >
              0
                ? "text-green-500 font-semibold"
                : "text-red-500 font-semibold"
            }`}
          >
            {data?.totalAdmissionFees || data?.totalPackageFees
              ? parseInt(data?.totalAdmissionFees) +
                parseInt(data?.totalPackageFees) -
                parseInt(data?.totalDiscount)
              : 0}{" "}
            <span className="text-black">BDT </span>
          </span>
        </li>
        {method_summary?.map((item: any, index: any) => (
          <li className="flex items-center justify-between gap-4" key={index}>
            <b className="font-normal  capitalize">{item?.method_name}</b>{" "}
            <span className="text-neutral-900">
              {parseInt(item?.totalAdmissionFees) +
                parseInt(item?.totalPackageFees) -
                parseInt(item?.totalDiscount)}{" "}
              <span className="text-black">BDT </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default InvoiceSummery;

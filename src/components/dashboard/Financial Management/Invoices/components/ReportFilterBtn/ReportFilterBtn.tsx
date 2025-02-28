import React from "react";

function ReportFilterBtn({ children, isActive = false, ...rest }: any): any {
  return (
    <div
      className={`flex gap-3 cursor-pointer  items-center text-sm md:text-base  py-2 px-3 md:px-4 rounded-xl hover:bg-neutral-800 hover:text-white hover:border border hover:border-gray-300 hover:shadow-none transition duration-300 ${
        isActive ? "bg-neutral-800 text-white" : "bg-white text-black"
      }`}
      {...rest}
    >
      {children}
    </div>
  );
}

export default ReportFilterBtn;

import React from "react";

function InvoiceTableTopBtn({ children }: any): any {
  return (
    <div className="flex md:gap-3 cursor-pointer font-semibold items-center  py-2 text-xs md:text-base px-2 md:px-4 rounded-xl  hover:bg-neutral-800 hover:text-white hover:border border hover:border-gray-300 hover:shadow-none transition duration-300">
      {children}
    </div>
  );
}

export default InvoiceTableTopBtn;

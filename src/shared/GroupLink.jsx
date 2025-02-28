import { useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

function GroupLink({ children, groupName, icon, ...rest }) {
  const [openSubRoute, setOpenSubRoute] = useState < any > false;

  return (
    <div
      className={`flex flex-col p-2 items-center text-md text-neutral-800 pl-0 hover:bg-neutral-200 border-2 border-black rounded-md ${
        openSubRoute ? "bg-white text-neutral-800" : ""
      } relative`}
    >
      <div
        className={`w-full rounded-none hover:text-neutral-800 hover:bg-transparent p-2 flex justify-between `}
        onClick={() => setOpenSubRoute(!openSubRoute)}
      >
        <span className="flex gap-3 text-lg font-bold">
          {icon}
          {groupName}
        </span>
        {openSubRoute ? <FaArrowDown /> : <FaArrowUp />}
      </div>

      {/* <PlusOrMinus isTrue={openSubRoute} /> */}
      <ul
        className={`flex flex-col px-2 gap-2 transition-all duration-500 w-full overflow-auto ${
          openSubRoute ? "h-40" : "h-[0] p-0 mt-0"
        }`}
        style={{ scrollbarWidth: "thin" }}
      >
        {children}
      </ul>
    </div>
  );
}

export default GroupLink;

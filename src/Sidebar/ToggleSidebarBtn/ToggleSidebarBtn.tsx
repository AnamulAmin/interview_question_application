import React from "react";
import { FaAngleRight } from "react-icons/fa6";

interface ToggleSidebarBtnProps {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const ToggleSidebarBtn: React.FC<ToggleSidebarBtnProps> = ({ isCollapsed, setIsCollapsed }) => {
  return (
    <div className="sticky md:absolute -left-4 z-50 top-6 md:top-8">
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="rounded-r-lg md:rounded-lg pr-2 py-2 pl-1 md:pl-6 bg-white md:hover:bg-gray-300 text-gray-500 border border-gray-300 transition-colors"
      >
        <FaAngleRight
          className={`transform transition-transform text-[1rem] ${
            isCollapsed ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>
    </div>
  );
};

export default ToggleSidebarBtn;

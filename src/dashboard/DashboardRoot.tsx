import { useState } from "react";
import { Outlet } from "react-router-dom";

import ToggleSidebarBtn from "../Sidebar/ToggleSidebarBtn/ToggleSidebarBtn";
const DashboardRoot = () => {
  const [isCollapsed, setIsCollapsed] = useState<any>(false);

  return (
    <div className="flex">
      {/* <Header/> */}
      <div className="md:p-8 bg-slate-50 h-dvh overflow-auto relative w-full">
        <ToggleSidebarBtn
          setIsCollapsed={setIsCollapsed}
          isCollapsed={isCollapsed}
        />
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardRoot;

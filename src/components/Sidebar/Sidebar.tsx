import "./Sidebar.css";
import MenuItems from "./MenuItems";
import GroupLink from "./MenuLink/GroupLink";
import { Link } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import { Button } from "@nextui-org/button";
// import { useState } from "react";
import { IoIosSettings } from "react-icons/io";
import useGetCompanyData from "../../hooks/GetDataHook/useGetCompanyData";

const Sidebar = ({ isCollapsed }: any) => {
  const allMenuItems = MenuItems(); // Assuming this returns a properly typed array
  // const [isOpen, setIsOpen] = useState<any>(false);
  const companyData = useGetCompanyData({}); // Specify CompanyData type for the hook

  return (
    <div
      className={`sidebar border-r border-gray-400 border-dashed h-dvh overflow-auto p-4 poppins text-[#737373] ${
        isCollapsed ? "w-[80px] hidden md:block" : "w-[330px]"
      } bg-white shadow-lg transition-all duration-300`}
    >
      {/* Menu */}
      <nav className="text-base font-normal h-full">
        <div className="flex flex-col gap-2 h-full max-h-screen">
          <Link to={"/"} className="flex flex-col items-start mb-6">
            {!isCollapsed && (
              <img
                src={companyData?.companyLogo || "/no-image.png"}
                alt="Logo"
                className="w-[100%] max-h-[150px] mb-1 object-contain"
              />
            )}
          </Link>
          {allMenuItems.map((cat) => (
            <GroupLink key={cat.title} item={cat} />
          ))}

          <Popover key={"settings"} placement={"right-end"}>
            <PopoverTrigger>
              <Button
                variant="flat"
                className={`capitalize justify-start w-full gap-3 mt-auto`}
                // onMouseEnter={() => setIsOpen(true)}
                // onMouseLeave={() => setIsOpen(false)}
                color="primary"
              >
                <IoIosSettings />
                Settings
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className=" px-2 space-y-3 py-4 flex flex-col items-stretch">
                <Link to={"/dashboard/company-profile"} className=" text-black">
                  <button className="w-full">Profile & Currency</button>
                </Link>
                {/* <Link to={"/dashboard/config"} className=" text-black">
                  <button className="w-full">Config</button>
                </Link> */}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;

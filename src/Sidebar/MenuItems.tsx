import { IoIosHome } from "react-icons/io";
import { IoFastFoodOutline, IoSettingsOutline } from "react-icons/io5";
import { MdOutlineInventory } from "react-icons/md";
import { BiTable } from "react-icons/bi";
import { FaUserTie } from "react-icons/fa";
function MenuItemsList() {
  const allMenuItems = [
    {
      title: "Manage Food",
      icon: <IoFastFoodOutline />,
      list: [
        { title: "Food Category", path: "/menu-category" },
        { title: " Food Subcategory", path: "/menu-subcategory" },
        { title: "Create Food Item", path: "/create-menu" },
        { title: "View Food Item", path: "/view-all-menu" },
        // { title: "Bulk Upload Menu", path: "/bulk-menu-upload" },
      ],
    },
    {
      title: "Inventory",
      icon: <MdOutlineInventory />,
      list: [
        {
          title: " Inventory Category",
          path: "/inventory-category",
        },
        {
          title: " Inventory Child Category",
          path: "/inventory-child-category",
        },
        {
          title: "View Inventory",
          path: "/inventory-tracking",
        },
      ],
    },
    {
      title: "Table & Reservation",
      icon: <BiTable />,
      list: [{ title: "View All Table", path: "/tables" }],
    },
    {
      title: "Employee",
      icon: <FaUserTie />,
      list: [
        { title: "Employee Roles", path: "/employee-role" },
        { title: "View All Employees", path: "/employee" },
        { title: "Employee Attendance", path: "/employ_attendance" },
      ],
    },
    {
      title: "Bulk Upload",
      icon: <IoIosHome />,
      list: [
        { title: "Bulk Menu", path: "/bulk-menu-upload" },
        { title: "Bulk Inventory", path: "/bulk-inventory" },
        // { title: "Employee Attendance", path: "/employ_attendance" },
      ],
    },
    {
      title: "Settings",
      icon: <IoSettingsOutline />,
      list: [
        { title: "Discount", path: "/discount" },
        { title: "Vat", path: "/vat" },
        { title: "Profile & Currency", path: "/company-profile" },
        // { title: "Employee Attendance", path: "/employ_attendance" },
      ],
    },
    // Other sections like Category, Subcategory, etc.
  ];

  return allMenuItems;
}

export default MenuItemsList;

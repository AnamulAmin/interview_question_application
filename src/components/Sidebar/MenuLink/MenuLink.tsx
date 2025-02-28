import { Link } from "react-router-dom";

const MenuLink: any = ({ item, location, isCollapsed }: any) => {
  // const isActive = location.pathname === item.path;

  // Function to check if the link is active
  const isActiveLink = (pathName: string, currentPath: string): boolean => {
    const splitPath = currentPath.split("/")[2];
    return pathName === splitPath;
  };

  return (
    <Link
      to={`/${item.path}`}
      className={`flex items-center text-[12px] gap-2 px-2 py-1 pl-5 rounded-xl transition-colors ${
        isActiveLink(item.path, location.pathname)
          ? "bg-[#087D6D] text-white shadow"
          : "text-gray-700 hover:bg-[#087d6d13] hover:text-gray-900"
      }`}
    >
      {item.icon}
      {!isCollapsed && <span>{item.title}</span>}
    </Link>
  );
};

export default MenuLink;

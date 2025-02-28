import { useEffect, useState } from "react";
import { useAuth } from "../../../providers/AuthProvider";
import useAxiosSecure from "../../../Hook/useAxiosSecure";
import MenuItemsList from "../../Sidebar/MenuItems";
import PermissionItem from "./permissionItem/permissionItem";
import useGetDepartments from "../../../Hook/GetDepartments/useGetDepartments";

const UserPermission = () => {
  const [role, setRole] = useState(""); // Default selected role, can be dynamic
  const [permissionData, setPermissionData] = useState([]);

  const [isCollapsed, setIsCollapsed] = useState(false); // For handling collapsible menu

  const departments = useGetDepartments();
  const { user } = useAuth();

  const menuItems = MenuItemsList({ userRole: "admin" });

  const axiosSecure = useAxiosSecure();

  const isAllowedRoute = (pathName) => {
    const isAllowed = permissionData.find(
      (item) => item.path === pathName
    )?.isAllowed;

    return isAllowed || false;
  };

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await axiosSecure.get(
          `/permissions/${role}?branch=${user?.branch}`
        );

        console.log("response", response);

        setPermissionData(response?.data?.routesData);
      } catch (error) {
        console.error("Error fetching permissions:", error);
      }
    };
    fetchPermissions();

    console.log(role, "role in permission item");
  }, [role, axiosSecure]);

  return (
    <div className="p-6 pt-0">
      <div className="">
        <h2 className="text-3xl font-semibold mb-9">
          Set Permissions for {role}
        </h2>

        {/* Dropdown to select Role from departments */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Select Role</span>
          </label>
          <select
            className="select customInput mb-6"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Select Role</option>
            {departments.map((department) => (
              <option key={department._id} value={department.Role}>
                {department.Role}
              </option>
            ))}
          </select>
        </div>

        <nav className="text-base font-normal">
          <ul className="grid md:grid-cols-3 gap-4">
            {menuItems.map((cat) => (
              <li key={cat.title} className="mb-2">
                <div className="collapse rounded-xl">
                  <input
                    type="checkbox"
                    id={`collapsed-${cat.title}`}
                    className="hidden"
                  />
                  <label
                    htmlFor={`collapsed-${cat.title}`}
                    className={`customSaveButton flex items-center gap-3`}
                  >
                    {!isCollapsed && cat.icon}
                    {!isCollapsed && cat.title}
                  </label>
                  <div className="collapse-content px-1 pt-2">
                    {cat.list &&
                      cat.list.map((item, index) => (
                        <PermissionItem
                          item={item}
                          key={index}
                          group_name={cat.title}
                          role={role}
                          path={item?.path}
                          isAllowedRoute={isAllowedRoute}
                        />
                      ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </nav>

        {/* Add more permission checkboxes similarly */}
      </div>
    </div>
  );
};

export default UserPermission;

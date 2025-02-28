import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionItem,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { Card } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import MenuItemsList from "../../Sidebar/MenuItems";
import PermissionItem from "./permissionItem/permissionItem";

interface PermissionItemProps {
  path: string;
  isAllowed: boolean;
}

interface Department {
  _id: string;
  Role: string;
}

const UserPermission: React.FC = () => {
  const [role, setRole] = useState<string>(""); // Default selected role
  const [permissionData, setPermissionData] = useState<PermissionItemProps[]>(
    []
  );
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false); // Collapsible menu state

  // const departments: Department[] = useGetDepartments();
  // const { user } = useAuth();
  const menuItems = MenuItemsList();
  // const axiosSecure = useAxiosSecure();

  const isAllowedRoute = (pathName: string): boolean => {
    const isAllowed = permissionData.find(
      (item) => item.path === pathName
    )?.isAllowed;

    return isAllowed || false;
  };

  // useEffect(() => {
  //   const fetchPermissions = async () => {
  //     try {
  //       const response = await axiosSecure.get(
  //         `/permissions/${role}?branch=${user?.branch}`
  //       );
  //       console.log("Permissions Response:", response);
  //       setPermissionData(response?.data?.routesData || []);
  //     } catch (error) {
  //       console.error("Error fetching permissions:", error);
  //     }
  //   };

  //   if (role) fetchPermissions();
  // }, [role, axiosSecure, user?.branch]);

  return (
    <div className="bg-slate-50 p-6 w-full max-w-4xl mx-auto rounded-xl shadow-md space-y-6">
      <h2 className="text-2xl font-bold">
        Set Permissions for {role || "Role"}
      </h2>

      {/* Role Selection */}
      {/* <div className="space-y-2">
        <label className="text-lg font-medium">Select Role</label>
        <Select
          placeholder="Select Role"
          selectedKeys={[role]}
          onChange={(key) => setRole(key as string)}
          aria-label="Select Role"
        >
          {departments.map((department) => (
            <SelectItem key={department._id} value={department.Role}>
              {department.Role}
            </SelectItem>
          ))}
        </Select>
      </div> */}

      {/* Permission List */}
      <Card className="p-4 bg-white shadow-sm">
        <nav className="grid md:grid-cols-3 gap-4">
          {menuItems.map((cat) => (
            <div key={cat.title} className="mb-4">
              <Accordion>
                {cat.list?.map((item: any, index: number) => (
                  <AccordionItem
                    key="1"
                    aria-label="Accordion 1"
                    title="Accordion 1"
                  >
                    <PermissionItem
                      item={item}
                      key={index}
                      group_name={cat.title}
                      role={role}
                      path={item?.path}
                      isAllowedRoute={isAllowedRoute}
                    />
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </nav>
      </Card>

      {/* Toggle Collapse */}
      <Button
        color="warning"
        onPress={() => setIsCollapsed(!isCollapsed)}
        className="w-full"
      >
        {isCollapsed ? "Expand All" : "Collapse All"}
      </Button>
    </div>
  );
};

export default UserPermission;

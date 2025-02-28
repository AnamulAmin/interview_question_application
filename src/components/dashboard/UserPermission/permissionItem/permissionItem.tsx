import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface PermissionItemProps {
  item: {
    title: string;
    path: string;
  };
  group_name: string;
  role: string;
  isAllowedRoute: (path: string) => boolean;
  path: string;
}

const PermissionItem: React.FC<PermissionItemProps> = ({
  item,
  group_name,
  role,
  isAllowedRoute,
  path,
}) => {
  const [permissions, setPermissions] = useState<boolean>(false);

  const handleSubmit = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!role) return;

    const checked = e.target.checked;
    setPermissions(checked);

    const routeItem = {
      title: item?.title,
      isAllowed: checked,
      role,
      group_name,
      path: item?.path,
      // branch: user?.branch || "",
    };

    console.log("routeItem", routeItem);

    // try {
    //   await axiosSecure.put("/permissions", routeItem);
    //   toast.success("Permission updated successfully");
    // } catch (error) {
    //   console.error("Error updating permissions:", error);
    //   toast.error("Error updating permissions");
    // }
  };

  useEffect(() => {
    const isAllowed = isAllowedRoute(path);
    setPermissions(isAllowed);
  }, [isAllowedRoute, path]);

  return (
    <div className="form-control">
      <label className="cursor-pointer label">
        <span className="label-text">{item?.title}</span>
        <input
          type="checkbox"
          name={item?.title}
          checked={permissions}
          onChange={handleSubmit}
          className="checkbox checkbox-primary"
        />
      </label>
    </div>
  );
};

export default PermissionItem;

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../../../providers/AuthProvider";
import useAxiosSecure from "../../../../Hook/useAxiosSecure";

function PermissionItem({ item, group_name, role, isAllowedRoute, path }) {
  const { user } = useAuth();

  const [permissions, setPermissions] = useState(false);

  const axiosSecure = useAxiosSecure();
  const handleSubmit = async (e) => {
    if(role === "") return;
    const checked = e.target.checked;
    setPermissions(checked);

    const routeItem = {
      title: item?.title,
      isAllowed: checked,
      role: role,
      group_name,
      path: item?.path,
      branch: user?.branch,
    };

    console.log("routeItem", routeItem);
    try {
      await axiosSecure.put(`/permissions`, routeItem);
      toast.success(" Permission updated successfully");
    } catch (error) {
      console.error("Error updating permissions:", error);
      toast.error("Error updating permissions");
    }
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
}

export default PermissionItem;

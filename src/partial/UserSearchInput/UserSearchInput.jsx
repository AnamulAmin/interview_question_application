import { useState, useCallback, useEffect } from "react";

import toast from "react-hot-toast";
import { useAuth } from "../../../providers/AuthProvider";

// Debounce function to delay API calls until the user stops typing
const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const UserSearch = ({ setIsShow, isShow, diet_id, setUserId, setDietId }) => {
  const [searchTerm, setSearchTerm] = useState < any > "";
  const [usersData, setUsersData] = useState < any > [];
  const axiosSecure = useAxiosSecure();
  const { branch } = useAuth();

  // Handle search with debouncing to avoid frequent API calls
  const handleSearch = useCallback(
    debounce(async (value) => {
      try {
        const res = await axiosSecure.get(
          `/users/get-users-search?search=${value}&branch=${branch}`
        );
        setUsersData(res?.data || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }, 300),
    [axiosSecure]
  );

  useEffect(() => {
    if (searchTerm) {
      handleSearch(searchTerm);
    } else {
      handleSearch("a"); // Fetch default users if no search term is provided
    }
  }, [searchTerm, handleSearch]);

  const onSendDietPlan = async (id) => {
    const data = { set_diet_id: diet_id, isActive: false, user: id };
    try {
      const response = await axiosSecure.put(
        `/diet-plan/update-food-habit/${id}?branch=${branch}`,
        data
      );
      if (response?.status === 200 || response.status === 201) {
        toast.success("Sent Diet Plan successfully!");
        setIsShow(false);
        setDietId("");
        return response?.status;
      }
    } catch (error) {
      console.error("Error sending diet plan:", error);
      toast.error("Request failed!");
    }
  };

  return (
    <div className="p-6 px-0 pt-4 bg-white rounded-lg">
      <input
        type="text"
        placeholder="Search by name or email..."
        className="focus:border-gray-300 appearance-none text-gray-700 border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline mb-6"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <table className="min-w-full bg-white">
        <thead className="font-semibold">
          <tr>
            <td className="py-2 px-4 border-b text-left">Image</td>
            <td className="py-2 px-4 border-b text-left">Name</td>
            <td className="py-2 px-4 border-b text-left">Email</td>
            <td className="py-2 px-4 border-b text-left">Action</td>
          </tr>
        </thead>
        <tbody>
          {usersData.length > 0 ? (
            usersData.slice(0, 7).map((user) => (
              <tr key={user._id} className="hover:bg-slate-100 cursor-pointer">
                <td className="py-2 px-4 border-b">
                  <img
                    src={user.photourl || "https://via.placeholder.com/150"}
                    alt={user.full_name}
                    className="w-10 h-10 rounded-full"
                  />
                </td>
                <td className="py-2 px-4 border-b">{user.full_name}</td>
                <td className="py-2 px-4 border-b">
                  {user.email || "Email not provided"}
                </td>
                <td className="py-2 px-4 border-b">
                  <div className="flex max-w-min gap-3 cursor-pointer items-center bg-blue-500 text-white py-1 px-3 rounded-xl shadow hover:bg-blue-600  border-gray-300 transition duration-300">
                    <button onClick={() => onSendDietPlan(user._id)}>
                      Send
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center py-20">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserSearch;

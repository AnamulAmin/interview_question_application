import { useState, useCallback, useEffect } from "react";

import toast from "react-hot-toast";
import { useAuth } from "../../../providers/AuthProvider";
import useAxiosSecure from "../../../Hook/useAxiosSecure";

const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    console.log(args);
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const DietPlanSearch = ({ setIsShow, isShow, userId, setUserId }) => {
  const [searchTerm, setSearchTerm] = useState < any > "";
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState < any > "";
  const [usersData, setUsersData] = useState < any > [];
  const { branch } = useAuth();

  console.log("userId 52454", userId);
  const axiosSecure = useAxiosSecure();

  const handleSearch = useCallback(
    debounce(async (value) => {
      const res = await axiosSecure.get(
        `/diet-plan/get-diet-by-search?search=${searchTerm}&brach=${branch}`
      );
      console.log("res 16561", res);
      setUsersData(res?.data);

      setDebouncedSearchTerm(value);
    }, 300),
    [searchTerm]
  );

  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm, handleSearch]);

  const onSendDietPlan = async (id) => {
    const data = { set_diet_id: id, isActive: false };
    console.log("data", data);
    try {
      const response = await axiosSecure.put(
        `/diet-plan/update-food-habit/${userId}`,
        data
      );
      console.log("response", response);
      if (response?.status === 200 || response.status === 201) {
        toast.success("Sent Diet Plan successful!");
        setIsShow(false);
        setUserId("");
        return response?.status;
      }
    } catch (error) {
      console.log(error);
      toast.error("Request failed!");
    }
  };

  return (
    <div className="p-6 bg-white min-w-[60%] rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Diet Search</h1>
      <input
        type="text"
        placeholder="Search by name"
        className="w-full p-2 border border-gray-300 rounded-md mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">Name</th>
            <th className="py-2 px-4 border-b text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {usersData.length > 0 ? (
            usersData.map((diet) => (
              <tr
                key={diet.id}
                className="hover:bg-slate-100 cursor-pointer border-b w-full"
              >
                <td className="py-2 px-4 font-bold capitalize text-yellow-900">
                  {diet.dietName}
                </td>
                <td className="py-2 px-4 text-right">
                  <button
                    className="text-lg p-2 rounded-lg transition duration-300 bg-slate-700 hover:text-black text-white hover:bg-yellow-500 "
                    onClick={() => {
                      onSendDietPlan(diet._id);
                    }}
                  >
                    Send
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center py-4">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DietPlanSearch;

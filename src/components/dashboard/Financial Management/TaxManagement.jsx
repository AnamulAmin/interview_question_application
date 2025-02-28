import React, { useEffect, useState, useContext } from "react";
import Mtitle from "/src/components library/Mtitle";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";
import { AuthContext } from "../../../providers/AuthProvider";
import UseAxiosSecure from "../../../Hook/UseAxioSecure";
import Mpagination from "../../../components library/Mpagination";
import MtableLoading from "../../../components library/MtableLoading";
import { TfiSearch } from "react-icons/tfi";
import { GoPlus } from "react-icons/go";
import debounce from "lodash.debounce"; // Import debounce function

const TaxManagement = () => {
  const { branch } = useContext(AuthContext);
  const axiosSecure = UseAxiosSecure();
  const [taxData, setTaxData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    // Fetch tax data from the API
    axiosSecure
      .get(`/users/tax?branch=${branch}`)
      .then((response) => {
        setTaxData(response.data.data);
        const initiallySelected = response.data.data
          .filter((user) => user.tax === "yes")
          .map((user) => user._id);
        setSelectedIds(initiallySelected);
      })
      .catch((error) => console.error("Error fetching tax data:", error))
      .finally(() => setIsLoading(false));
  }, [branch, axiosSecure]);

  const filteredData = searchQuery
    ? taxData.filter((item) =>
        item.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.contact_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.member_id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : taxData;

  const { paginatedData, paginationControls, rowsPerPageAndTotal } =
    Mpagination({ totalData: filteredData });

  const openModal = () => {
    console.log("Opening modal...");
  };

  const debouncedUpdateTaxStatus = debounce(async (updates) => {
    try {
      const response = await axiosSecure.put("/users/tax", updates);
      console.log("Backend update response:", response.data);
    } catch (error) {
      console.error("Error updating tax status:", error);
    }
  }, 300); // Debounce to limit API calls to one per 300ms

  const handleSelect = (id) => {
    setSelectedIds((prevSelectedIds) => {
      const newSelectedIds = prevSelectedIds.includes(id)
        ? prevSelectedIds.filter((selectedId) => selectedId !== id)
        : [...prevSelectedIds, id];

      // Prepare updates for API
      const updates = taxData.map((user) => ({
        _id: user._id,
        tax: newSelectedIds.includes(user._id) ? "yes" : "no",
      }));

      // Call the debounced update function
      debouncedUpdateTaxStatus(updates);

      return newSelectedIds;
    });
  };

  return (
    <div className="p-4">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Mtitle
            title="Tax Management"
            rightcontent={
              <div className="flex justify-between md:mt-0 mt-3">
                <div className="flex justify-end gap-4 items-center">
                  <div className="md:w-64 border shadow-sm py-2 px-3 bg-white rounded-xl">
                    <div className="flex items-center gap-2">
                      <TfiSearch className="text-2xl font-bold text-gray-500" />
                      <input
                        type="text"
                        className="outline-none w-full"
                        placeholder="Search package"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  <div
                    onClick={openModal}
                    className="flex gap-2 cursor-pointer items-center bg-yellow-500 text-white py-2 px-4 rounded-xl shadow hover:bg-yellow-600 transition duration-300"
                  >
                    <button className="font-semibold">New</button>
                    <GoPlus className="text-xl text-white" />
                  </div>
                </div>
              </div>
            }
          />

          <div className="text-sm">{rowsPerPageAndTotal}</div>
          {filteredData.length === 0 ? (
            <div className="text-center py-4">
              <p className="font-bold">
                No tax data available for this branch. Please check your connection or contact support.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto border shadow-sm rounded-xl p-4 mt-5">
              <table className="table w-full">
                <thead className="bg-yellow-500">
                  <tr className="text-sm font-medium text-white text-left">
                    <th className="p-3 rounded-l-xl">
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          setSelectedIds(
                            e.target.checked ? filteredData.map((item) => item._id) : []
                          )
                        }
                        checked={selectedIds.length === filteredData.length}
                      />
                    </th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Contact No</th>
                    <th className="p-3">Member ID</th>
                    <th className="p-3">Gender</th>
                    <th className="p-3">Expire Date</th>
                    <th className="p-3 rounded-r-xl">Admission Date</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-100 hover:rounded-xl">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          onChange={() => handleSelect(user._id)}
                          checked={selectedIds.includes(user._id)}
                        />
                      </td>
                      <td className="px-4 py-3">{user.full_name}</td>
                      <td className="px-4 py-3">{user.contact_no}</td>
                      <td className="px-4 py-3">{user.member_id}</td>
                      <td className="px-4 py-3">{user.gender}</td>
                      <td className="px-4 py-3">{user.expiredate}</td>
                      <td className="px-4 py-3">{user.admission_date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <MtableLoading data={filteredData} />
              {paginationControls}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TaxManagement;

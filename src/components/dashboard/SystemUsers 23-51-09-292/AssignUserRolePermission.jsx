// pages/system-users.js

import { useState } from "react";
import { MdAssignmentAdd } from "react-icons/md";

export default function AssignUserRolePermission() {
  // Sample data for system users
  const initialUsers = [
    {
      id: 1,
      name: "Barry Young",
      email: "feby.tanot@mailinator.com",
      phone: "+1 (603) 244-6779",
      address: "Deserunt modi veniam",
      accountCreated: "2024-01-30 08:58:11 pm",
    },
  ];

  const [users, setUsers] = useState(initialUsers);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10); // Adjust the number of users per page

  // Pagination Logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Handle page changes
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 pt-0">
      <h1 className="text-3xl font-semibold mb-9">System Users List</h1>

      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-100 text-center">
            <td className="p-2 border">SL</td>
            <td className="p-2 border">Name</td>
            <td className="p-2 border">Email</td>
            <td className="p-2 border">Phone</td>
            <td className="p-2 border">Address</td>
            <td className="p-2 border">Account Created</td>
            <td className="p-2 border">Action</td>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user, index) => (
            <tr key={user.id} className="border-b text-center">
              <td className="p-2 border">{indexOfFirstUser + index + 1}</td>
              <td className="p-2 border">{user.name}</td>
              <td className="p-2 border">{user.email}</td>
              <td className="p-2 border">{user.phone}</td>
              <td className="p-2 border">{user.address}</td>
              <td className="p-2 border">{user.accountCreated}</td>
              <td className="p-2 py-3 border">
                <div className="flex justify-center">
                  <button className="flex  text-white bg-green-500 items-center gap-2 justify-center  rounded-2xl px-4 py-1 ">
                    <MdAssignmentAdd /> Assign
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastUser >= users.length}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

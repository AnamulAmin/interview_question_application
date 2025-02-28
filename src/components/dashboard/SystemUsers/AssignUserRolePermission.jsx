// pages/system-users.js

import { useState } from "react";

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

  const [users, setUsers] = useState < any > initialUsers;
  const [currentPage, setCurrentPage] = useState < any > 1;
  const [usersPerPage] = useState < any > 10; // Adjust the number of users per page

  // Pagination Logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Handle page changes
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">System Users List</h1>

      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">SL</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Phone</th>
            <th className="p-2 border">Address</th>
            <th className="p-2 border">Account Created</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user, index) => (
            <tr key={user.id} className="border-b">
              <td className="p-2 border">{indexOfFirstUser + index + 1}</td>
              <td className="p-2 border">{user.name}</td>
              <td className="p-2 border">{user.email}</td>
              <td className="p-2 border">{user.phone}</td>
              <td className="p-2 border">{user.address}</td>
              <td className="p-2 border">{user.accountCreated}</td>
              <td className="p-2 border">
                <button className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded mr-2">
                  Assign
                </button>
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

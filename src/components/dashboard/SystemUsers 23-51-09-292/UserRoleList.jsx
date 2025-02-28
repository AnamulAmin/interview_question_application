// pages/user-roles.js
import { useState } from "react";

export default function UserRoleList() {
  // Sample data for user roles
  const initialRoles = [
    {
      id: 1,
      roleName: "Order Manager",
      description: "Can Manage Orders",
      createdAt: "2024-02-09 02:20:59 am",
      updatedAt: "2024-02-09 02:20:59 am",
    },
    {
      id: 2,
      roleName: "ChildCategory Management",
      description: "Can Manage ChildCategory Related Operation",
      createdAt: "2023-07-20 12:36:56 pm",
      updatedAt: "2023-07-20 12:36:56 pm",
    },
    {
      id: 3,
      roleName: "Dashboard",
      description: "Can Access Dashboard",
      createdAt: "2023-07-20 12:31:05 pm",
      updatedAt: "2023-07-20 12:31:05 pm",
    },
    {
      id: 4,
      roleName: "Subcategory Management",
      description: "Manages All Subcategory Related Operations",
      createdAt: "2023-07-19 12:24:12 pm",
      updatedAt: "2023-07-19 12:24:12 pm",
    },
  ];

  const [roles, setRoles] = useState(initialRoles);
  const [currentPage, setCurrentPage] = useState(1);
  const [rolesPerPage] = useState(10); // Adjust the number of roles per page

  // Calculate current roles for pagination
  const indexOfLastRole = currentPage * rolesPerPage;
  const indexOfFirstRole = indexOfLastRole - rolesPerPage;
  const currentRoles = roles.slice(indexOfFirstRole, indexOfLastRole);

  // Handle page changes
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">User Role List</h1>
      <div className="flex justify-between mb-4">
        <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
          + Create New Role
        </button>
      </div>

      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">SL</th>
            <th className="p-2 border">Role Name</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Created At</th>
            <th className="p-2 border">Updated At</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentRoles.map((role, index) => (
            <tr key={role.id} className="border-b">
              <td className="p-2 border">{indexOfFirstRole + index + 1}</td>
              <td className="p-2 border">{role.roleName}</td>
              <td className="p-2 border">{role.description}</td>
              <td className="p-2 border">{role.createdAt}</td>
              <td className="p-2 border">{role.updatedAt}</td>
              <td className="p-2 border">
                <button className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded mr-2">
                  Edit
                </button>
                <button className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded">
                  Delete
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
          disabled={indexOfLastRole >= roles.length}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

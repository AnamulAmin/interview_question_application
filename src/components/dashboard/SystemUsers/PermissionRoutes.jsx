// pages/permission-routes.js
import { useState, useEffect } from "react";

export default function PermissionRoutes() {
  // Sample data
  const initialRoutes = [
    {
      id: 1,
      route: "approve/withdraw",
      name: "ApproveWithdraw",
      method: "POST",
      createdAt: "2024-09-05 10:21:17 am",
      updatedAt: "2024-09-05 10:21:17 am",
    },
    {
      id: 2,
      route: "deny/withdraw/{id}",
      name: "DenyWithdraw",
      method: "GET",
      createdAt: "2024-09-05 10:21:17 am",
      updatedAt: "2024-09-05 10:21:17 am",
    },
    {
      id: 3,
      route: "get/withdraw/info/{id}",
      name: "getWithdrawInfo",
      method: "GET",
      createdAt: "2024-09-05 10:21:17 am",
      updatedAt: "2024-09-05 10:21:17 am",
    },
    {
      id: 4,
      route: "delete/withdraw/{id}",
      name: "DeleteWithdraw",
      method: "GET",
      createdAt: "2024-09-05 10:21:17 am",
      updatedAt: "2024-09-05 10:21:17 am",
    },
    {
      id: 5,
      route: "view/cancelled/withdraws",
      name: "ViewCancelledWithdraws",
      method: "GET",
      createdAt: "2024-09-05 10:21:17 am",
      updatedAt: "2024-09-05 10:21:17 am",
    },
    // Add more routes if necessary...
  ];

  const [routes, setRoutes] = useState < any > initialRoutes;
  const [currentPage, setCurrentPage] = useState < any > 1;
  const [routesPerPage] = useState < any > 15; // Set how many routes to display per page

  // Calculate displayed routes
  const indexOfLastRoute = currentPage * routesPerPage;
  const indexOfFirstRoute = indexOfLastRoute - routesPerPage;
  const currentRoutes = routes.slice(indexOfFirstRoute, indexOfLastRoute);

  // Handle page changes
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Dummy function for regenerating routes
  const regenerateRoutes = () => {
    console.log("Routes regenerated");
    // Implement route regeneration functionality here
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Permission Route List</h1>
      <div className="flex justify-between mb-4">
        <button
          onClick={regenerateRoutes}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
        >
          Regenerate Routes
        </button>
      </div>

      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">SL</th>
            <th className="p-2 border">Route</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Method</th>
            <th className="p-2 border">Created At</th>
            <th className="p-2 border">Updated At</th>
          </tr>
        </thead>
        <tbody>
          {currentRoutes.map((route, index) => (
            <tr key={route.id} className="border-b">
              <td className="p-2 border">{indexOfFirstRoute + index + 1}</td>
              <td className="p-2 border">{route.route}</td>
              <td className="p-2 border">{route.name}</td>
              <td className="p-2 border">{route.method}</td>
              <td className="p-2 border">{route.createdAt}</td>
              <td className="p-2 border">{route.updatedAt}</td>
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
          disabled={indexOfLastRoute >= routes.length}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

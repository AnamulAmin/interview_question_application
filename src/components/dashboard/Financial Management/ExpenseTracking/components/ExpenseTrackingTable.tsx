import React from "react";

function ExpenseTrackingTable({ arrayData }: any) {
  // Calculate the total expense
  const totalExpense = arrayData?.reduce(
    (sum: any, item: any) => sum + (item?.total || 0),
    0
  );

  return (
    <div className="overflow-auto h-full max-h-[750px] p-4 bg-white rounded-xl shadow-lg">
      <table className="min-w-full border-collapse table-auto bg-white shadow-md rounded-lg overflow-hidden">
        {/* Table Head */}
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="py-3 px-4 font-semibold text-left">SL</th>
            <th className="py-3 px-4 font-semibold text-left">Name</th>
            <th className="py-3 px-4 font-semibold text-left">Total</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {arrayData?.length > 0 ? (
            arrayData.map((item: any, index: any) => (
              <tr
                key={index}
                className="hover:bg-gray-100 transition-colors duration-200"
              >
                <td className="py-2 px-4 border-b text-gray-700">
                  {index + 1}
                </td>
                <td className="py-2 px-4 border-b text-gray-700">
                  {item?._id || "N/A"}
                </td>
                <td className="py-2 px-4 border-b text-gray-700">
                  {item?.total || 0}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="py-4 text-center text-gray-500">
                No expenses found.
              </td>
            </tr>
          )}
        </tbody>

        {/* Table Footer */}
        <tfoot>
          <tr className="bg-gray-100">
            <td className="py-3 px-4 font-semibold text-right text-gray-700">
              Total Expense:
            </td>
            <td className="py-3 px-4 font-semibold text-gray-700">
              {totalExpense.toFixed(2)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default ExpenseTrackingTable;

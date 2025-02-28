import { useState } from "react";

export default function SalesReport() {
  const [startDate, setStartDate] = useState < any > "";
  const [endDate, setEndDate] = useState < any > "";
  const [orderStatus, setOrderStatus] = useState < any > "Approved";
  const [paymentStatus, setPaymentStatus] =
    useState < any > "Payment Successful";
  const [paymentMethod, setPaymentMethod] = useState < any > "Bkash";
  const [isGenerating, setIsGenerating] = useState < any > false;

  const handleGenerateReport = () => {
    setIsGenerating(true);
    // Simulate report generation
    setTimeout(() => {
      alert("Report generated!");
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-5xl mx-auto bg-white p-8 shadow-md rounded-md">
        <h1 className="text-2xl font-bold mb-5">Sales Report Criteria</h1>

        {/* Sales Report Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Start Date */}
          <div className="flex flex-col">
            <label
              htmlFor="start-date"
              className="text-sm font-medium text-gray-700"
            >
              Start Date
            </label>
            <input
              type="date"
              id="start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* End Date */}
          <div className="flex flex-col">
            <label
              htmlFor="end-date"
              className="text-sm font-medium text-gray-700"
            >
              End Date
            </label>
            <input
              type="date"
              id="end-date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Order Status */}
          <div className="flex flex-col">
            <label
              htmlFor="order-status"
              className="text-sm font-medium text-gray-700"
            >
              Order Status
            </label>
            <select
              id="order-status"
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
              className="p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Payment Status */}
          <div className="flex flex-col">
            <label
              htmlFor="payment-status"
              className="text-sm font-medium text-gray-700"
            >
              Payment Status
            </label>
            <select
              id="payment-status"
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="Payment Successful">Payment Successful</option>
              <option value="Payment Failed">Payment Failed</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>

          {/* Payment Method */}
          <div className="flex flex-col">
            <label
              htmlFor="payment-method"
              className="text-sm font-medium text-gray-700"
            >
              Payment Method
            </label>
            <select
              id="payment-method"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="Bkash">Bkash</option>
              <option value="Nagad">Nagad</option>
              <option value="Card">Card</option>
              <option value="Cash">Cash</option>
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <div className="mt-5">
          <button
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className={`px-4 py-2 rounded-md text-white ${
              isGenerating ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-700"
            } focus:outline-none`}
          >
            {isGenerating ? "Generating..." : "Generate Report"}
          </button>
        </div>
      </div>
    </div>
  );
}

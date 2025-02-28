import React, { useState } from "react";
// import { PDFDownloadLink } from "@react-pdf/renderer";
import useGetCompanyData from "@/hooks/GetDataHook/useGetCompanyData";
import moment from "moment";
import useGetTransaction from "@/hooks/GetDataHook/useGetTransaction";
// import useExportToExcel from "@/helpers/Export/useExportToExcel";
import ReportFilter from "../Invoices/components/ReportFilter/ReportFilter";
import InvoiceTableTopBtn from "./components/InvoiceTableTopBtn/InvoiceTableTopBtn";
// import MonthlyInvoicePdfTemplate from "./components/InvoicePdfTemplate/MonthlyInvoicePdfTemplate";
// import InvoicePdfTemplate from "./components/InvoicePdfTemplate/InvoicePdfTemplate";
import InvoiceRow from "./components/InvoiceRow/InvoiceRow";

const Transactions: React.FC = () => {
  const [isDeleteTransaction, setIsDeleteTransaction] =
    useState<boolean>(false);
  const [isShowAddTransaction, setIsShowAddTransaction] =
    useState<boolean>(false);

  const currentDate: string = moment().format("YYYY-MM-DD");
  const [startDate, setStartDate] = useState<string>(currentDate);
  const [endDate, setEndDate] = useState<string>(currentDate);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [transactionType, setTransactionType] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [isAddFilterWithSearch, setIsAddFilterWithSearch] =
    useState<boolean>(false);
  const [timeFrame, setTimeFrame] = useState<string>("");
  const [receiver, setReceiver] = useState<string>("");

  // Fetch transaction data using custom hook
  const {
    transactionData,
    summary,
    receivers,
    method_summary,
    cumulativeBalance,
  } = useGetTransaction({
    // query: {
    //   start_date: startDate,
    //   end_date: endDate,
    //   transaction_type: transactionType,
    //   receiver,
    //   time_frame: timeFrame,
    //   search,
    //   isAddFilterWithSearch,
    // },
    // isShowAddTransaction,
    // isSubmit,
    // isDeleteTransaction,
  });

  const profileData = useGetCompanyData({}); // Hook to fetch company data
  // const exportToExcel = useExportToExcel({ data: transactionData }); // Hook for exporting to Excel

  return (
    <div className="p-3">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 relative">
        {/* Report Filter Component */}
        <ReportFilter
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          setIsSubmit={setIsSubmit}
          setReceiver={setReceiver}
          summary={summary}
          receivers={receivers && receivers[0]}
          setTimeFrame={setTimeFrame}
          setSearch={setSearch}
          setIsAddFilterWithSearch={setIsAddFilterWithSearch}
          search={search}
          isAddFilterWithSearch={isAddFilterWithSearch}
          method_summary={method_summary}
          summary_type={"transactions"}
          cumulativeBalance={cumulativeBalance}
        />

        <div
          className="col-span-2 bg-white min-h-[500px] max-h-[94dvh] overflow-x-hidden overflow-y-scroll rounded-xl shadow p-4 pt-2"
          style={{
            scrollbarWidth: "none",
            scrollbarColor: "black rgba(255, 255, 255, 0)",
          }}
        >
          <div className="flex justify-between items-center gap-5 border-b border-gray-200 pb-4 pt-2">
            <h3 className="md:text-lg font-semibold">Invoices Billing</h3>
            <div className="flex items-center gap-5">
              {/* Download PDF Button */}
              {/* <InvoiceTableTopBtn>
                <PDFDownloadLink
                  document={
                    timeFrame === "monthly" ? (
                      <MonthlyInvoicePdfTemplate
                        data={transactionData}
                        summary={summary[0]}
                        cumulativeBalance={cumulativeBalance}
                        method_summary={method_summary}
                        profileData={profileData}
                      />
                    ) : (
                      <InvoicePdfTemplate
                        transactions={transactionData}
                        summary={summary[0]}
                        cumulativeBalance={cumulativeBalance}
                        method_summary={method_summary}
                        profileData={profileData}
                      />
                    )
                  }
                  fileName="transactions.pdf"
                >
                  {"Download PDF"}
                </PDFDownloadLink>
              </InvoiceTableTopBtn> */}

              {/* Export to Excel Button */}
              {/* <InvoiceTableTopBtn>
                <button
                  id="btnAddMember"
                  type="button"
                  className="font-semibold"
                  onClick={exportToExcel}
                >
                  Export To Excel
                </button>
              </InvoiceTableTopBtn> */}

              {/* Add New Invoice Button */}
              <InvoiceTableTopBtn>
                <button
                  id="btnAddMember"
                  type="button"
                  className="font-semibold"
                  onClick={() => setIsShowAddTransaction(true)}
                >
                  Add New Invoice
                </button>
              </InvoiceTableTopBtn>
            </div>
          </div>

          {/* Transaction Table */}
          <div className="col-span-2 bg-white p-4 pt-2">
            <div className="grid grid-cols-12 justify-between items-center gap-5 border-b border-gray-200 pb-2">
              {timeFrame === "monthly" ? (
                <>
                  <b className="col-span-3">Date</b>
                  <b className="col-span-3 text-center">Incomes</b>
                  <b className="col-span-3 text-center">Expenses</b>
                  <b className="col-span-3 text-right">Total</b>
                </>
              ) : (
                <>
                  <b className="col-span-1">SL.No.</b>
                  <b className="col-span-2">Tran Type</b>
                  <b className="col-span-2 hidden md:block">Tran No</b>
                  <b className="col-span-2">Tran Name</b>
                  <b className="col-span-2">Pay Method</b>
                  <b className="col-span-2">Amount</b>
                  <b className="col-span-1 text-right pr-6">Action</b>
                </>
              )}
            </div>

            {/* Transaction Rows */}
            <div className="w-full min-h-[600px] max-h-[92dvh] overflow-x-hidden overflow-y-scroll rounded-md">
              {transactionData?.length > 0 ? (
                transactionData.map((item: any, index: number) => (
                  <InvoiceRow
                    key={index}
                    data={item}
                    setIsDeleteTransaction={setIsDeleteTransaction}
                    timeFrame={timeFrame}
                    index={index}
                  />
                ))
              ) : (
                <div className="flex justify-center items-center h-96">
                  <div className="text-center">
                    <h1 className="text-2xl font-semibold">
                      No Transaction Found
                    </h1>
                    <p className="text-gray-500 text-sm mt-2">
                      No transaction found with this search criteria.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;

import { useState, useEffect } from "react";
import moment from "moment";
import useGetExpanseData from "@/hooks/GetDataHook/useGetExpanseData";
import InputDateFilter from "./components/InputDateFilter/InputDateFilter";
import ExpenseTrackingTable from "./components/ExpenseTrackingTable";
import ExpenseTrackingChart from "./components/ExpenseTrackingChart";

const ExpenseTracking: any = () => {
  // const { user } = useAuth();
  const currentDate = moment().format("YYYY-MM-DD");
  const [year, setYear] = useState<any>(new Date().getFullYear());
  const [month, setMonth] = useState<any>(new Date().getMonth() + 1);
  const [selectType, setSelectType] = useState<any>("last30Days");
  const [loading, setLoading] = useState<any>(true);
  const [error, setError] = useState<any>(null);

  const expenseData = useGetExpanseData({
    // query: {
    // branch: user.branch,
    // year: year,
    // month: month,
    // },
  });

  // useEffect(() => {
  //   setLoading(!expenseData); // Adjust loading based on data presence
  //   setError(null); // Reset error on new request
  // }, [expenseData]);

  return (
    <div>
      {/* <Mtitle
        title={`Expense Tracking ${selectType ? `- ${selectType}` : ""}`}
      /> */}
      <div className="p-5 w-full">
        <InputDateFilter
          year={year}
          setYear={setYear}
          month={month}
          setMonth={setMonth}
          selectType={selectType}
          setSelectType={setSelectType}
        />

        <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 justify-start min-h-[750px]">
          {loading ? (
            <div className="col-span-2 flex justify-center items-center h-96">
              <p>Loading...</p>
            </div>
          ) : error ? (
            <div className="col-span-2 flex justify-center items-center h-96 text-red-500">
              <p>Failed to load data: {error.message}</p>
            </div>
          ) : (
            <>
              <ExpenseTrackingTable arrayData={expenseData} />
              <ExpenseTrackingChart expenseData={expenseData} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracking;

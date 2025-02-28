import { useRef, useState } from "react";
import Summery from "../TransactionSummery/TransactionSummery";

function InvoiceFilter({
  startDate,
  setStartDate,
  endDate,
  setEndDate = () => {},
  setTransactionType = () => {},
  summary = {},
}: any): any {
  const [filterByDateRange, setFilterByDateRange] = useState(false);
  const [isShowIncome, setIsShowIncome] = useState(true);
  const [isShowExpense, setIsShowExpense] = useState(true);

  const transaction_types = [
    { value: "income_service", name: "INCOME - SERVICE" },
    { value: "salary", name: "EXPENSE - SALARY" },
    { value: "rent", name: "EXPENSE - RENT" },
    { value: "others", name: "EXPENSE - OTHERS" },
    { value: "internet_bill", name: "EXPENSE - INTERNET BILL" },
    { value: "fitant_monthly_bill", name: "EXPENSE - FITANT MONTHLY BILL" },
    { value: "electric_bill", name: "EXPENSE - ELECTRIC BILL" },
    { value: "daily_expense", name: "EXPENSE - DAILY EXPENSE" },
    { value: "daily_cost", name: "EXPENSE - DAILY COST" },
  ];

  const filterDate = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const start_date = e.target.start_date.value;
    const end_date = e.target.end_date;
    const transaction_type = e.target.transaction_type.value;

    console.log(
      "start_date",
      start_date,
      "end_date",
      end_date,
      "transaction_type",
      transaction_type
    );

    setStartDate(start_date);
    if (filterByDateRange) {
      setEndDate(end_date.value);
    } else {
      setEndDate("");
    }
    setTransactionType(transaction_type);
  };
  return (
    <div className="col-span-1 space-y-5  rounded-md sticky top-0 left-0">
      <form className="space-y-4 bg-white p-4 rounded" onSubmit={handleSubmit}>
        <h3 className="text-lg font-medium leading-6 text-gray-900 border-b pb-4 ">
          Filter
        </h3>
        <input
          type="text"
          placeholder="Enter Search Keyword"
          className="input input-bordered w-full"
        />
        <div className="flex gap-4">
          <input
            type="checkbox"
            defaultChecked
            className="checkbox"
            id="showIncome"
            value={isShowIncome}
            onChange={() => setIsShowIncome(!isShowIncome)}
          />
          <label htmlFor="showIncome" className="cursor-pointer">
            Show Incomes
          </label>
        </div>
        <div className="flex gap-4">
          <input
            type="checkbox"
            defaultChecked
            className="checkbox"
            id="showExpense"
            value={isShowExpense}
            onChange={() => setIsShowExpense(!isShowExpense)}
          />
          <label htmlFor="showExpense" className="cursor-pointer">
            Show Expenses
          </label>
        </div>
        <div className={"w-full space-y-2 pt-2"}>
          <select
            className={`focus:border-gray-400 appearance-none text-gray-700 text-sm border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline`}
            name="transaction_type"
          >
            <option value={""}>Select Type </option>
            {transaction_types.map((item, index) => {
              return (
                <option value={item.value} key={index}>
                  {item.name}
                </option>
              );
            })}
          </select>
        </div>

        <div className="flex gap-4 ">
          <input
            type="checkbox"
            id={"filterByDate"}
            defaultChecked
            className="checkbox"
            onChange={() => setFilterByDateRange(!filterByDateRange)}
            checked={filterByDateRange}
          />
          <label htmlFor={"filterByDate"} className="cursor-pointer">
            Filter by Date Range
          </label>
        </div>
        <input
          type="date"
          className="input input-bordered w-full "
          name="start_date"
          defaultValue={startDate}
        />

        {filterByDateRange && (
          <input
            type="date"
            className="input input-bordered w-full "
            ref={filterDate}
            defaultValue={endDate}
            name="end_date"
          />
        )}

        <button
          className="text-white w-full h-12 grid place-items-center rounded-md bg-neutral   hover:bg-yellow-300 hover:text-black  text-xl font-semibold transition-all duration-200 ease-in-out"
          type="submit"
        >
          Search
        </button>
      </form>

      <Summery data={summary[0]} startDate={startDate} endDate={endDate} />
    </div>
  );
}

export default InvoiceFilter;

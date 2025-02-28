import { useEffect } from "react";
import ByMonth from "./ByMonth/ByMonth";

function InputDateFilter({
  year,
  setYear,
  month,
  setMonth,
  selectType,
  setSelectType,
  isDaily,
}: any): any {
  useEffect(() => {
    setYear(new Date().getFullYear());
    setMonth(new Date().getMonth() + 1);
    console.log(selectType);
  }, [selectType]);

  return (
    <div className="rounded-lg bg-white w-full p-2 gap-4 grid grid-cols-6">
      <select
        className="border rounded-xl outline-none px-3 py-1 w-full col-span-2"
        value={selectType}
        onChange={(e) => {
          setSelectType(e.target.value);
        }}
      >
        <option value={"last30Days"}>Last 30 days</option>
        <option value={"byMonth"}>By Month</option>
      </select>

      <div className="flex gap-4 items-center col-span-4">
        {selectType === "byMonth" && (
          <ByMonth
            year={year}
            setYear={setYear}
            month={month}
            setMonth={setMonth}
          />
        )}
      </div>
    </div>
  );
}

export default InputDateFilter;

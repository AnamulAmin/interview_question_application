const startYear = 2000;
const endYear = new Date().getFullYear();

const yearsArray: any = [];

for (let year = startYear; year <= endYear; year++) {
  yearsArray.push(year);
}

function ByMonth({ year, month, setYear, setMonth }: any): any {
  return (
    <div className="w-full flex gap-4">
      <select
        className="border rounded-xl outline-none p-3 w-full max-w-xs"
        value={year}
        onChange={(e) => {
          setYear(e.target.value);
        }}
      >
        {yearsArray.map((item: any, index: any) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
      </select>

      <select
        className="border rounded-xl outline-none p-3 w-full max-w-xs"
        value={month}
        onChange={(e) => {
          setMonth(e.target.value);
        }}
      >
        <option value="1">January</option>
        <option value="2">February</option>
        <option value="3">March</option>
        <option value="4">April</option>
        <option value="5">May</option>
        <option value="6">June</option>
        <option value="7">July</option>
        <option value="8">August</option>
        <option value="9">September</option>
        <option value="10">October</option>
        <option value="11">November</option>
        <option value="12">December</option>
      </select>
    </div>
  );
}

export default ByMonth;

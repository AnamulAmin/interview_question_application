import { useState } from "react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  // Legend,
} from "recharts";
// import UseAxiosSecure from "../../../../../Hook/UseAxioSecure";
// import { AuthContext } from "../../../../../providers/AuthProvider";

function SalesChart({ year, month, selectType }: any): any {
  //   const data = [
  //     {
  //       name: "Page A",
  //       uv: 4000,
  //       pv: 2400,
  //       amt: 2400,
  //     },
  //     {
  //       name: "Page B",
  //       uv: 3000,
  //       pv: 1398,
  //       amt: 2210,
  //     },
  //     {
  //       name: "Page C",
  //       uv: 2000,
  //       pv: 9800,
  //       amt: 2290,
  //     },
  //     {
  //       name: "Page D",
  //       uv: 2780,
  //       pv: 3908,
  //       amt: 2000,
  //     },
  //     {
  //       name: "Page E",
  //       uv: 1890,
  //       pv: 4800,
  //       amt: 2181,
  //     },
  //     {
  //       name: "Page F",
  //       uv: 2390,
  //       pv: 3800,
  //       amt: 2500,
  //     },
  //     {
  //       name: "Page G",
  //       uv: 3490,
  //       pv: 4300,
  //       amt: 2100,
  //     },
  //   ];

  const [data, setData] = useState();

  // const axiosSecure = UseAxiosSecure();
  // const { branch } = useContext(AuthContext);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const response = await axiosSecure.get(
  //       `invoice/get-sales-report?year=${year}&month=${month}&branch=${branch}`
  //     );
  //     setData(response?.data);
  //   };
  //   fetchData();
  // }, [year, month, selectType]);

  console.log(data, "data");

  return (
    <BarChart
      width={900}
      height={400}
      data={data}
      margin={{
        top: 20,
        right: 25,
        left: -25,
        bottom: 10,
      }}
    >
      <CartesianGrid strokeDasharray="7 10" stroke="#d3d3d3" />
      <Bar
        dataKey="totalSales"
        fill="#82ca9d"
        activeBar={<Rectangle fill="gold" stroke="purple" strokeWidth={5} />}
        barSize={10}
        yAxisId="left"
      />
      <Bar
        dataKey="totalAmount"
        fill="#8884d8"
        barSize={10}
        activeBar={<Rectangle fill="pink" stroke="blue" strokeWidth={5} />}
        yAxisId="right"
      />
      <XAxis dataKey="label" />
      <YAxis dataKey="totalAmount" yAxisId="right" />
      <YAxis dataKey="totalSales" yAxisId="left" />
      <Tooltip />
      {/* <Legend /> */}
    </BarChart>
  );
}

export default SalesChart;

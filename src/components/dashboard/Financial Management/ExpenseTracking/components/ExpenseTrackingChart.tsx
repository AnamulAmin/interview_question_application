import { useEffect, useState } from "react";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ExpenseTrackingChart({ expenseData }: any): any {
  const [chartData, setChartData] = useState<any[]>([]);

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  useEffect(() => {
    const convertData = expenseData?.map((item: any) => ({
      ...item,
      fill: getRandomColor(),
      name: item._id,
    }));
    setChartData(convertData);
  }, [expenseData]);

  // Dynamic sizes based on data length
  const isLowData = chartData.length <= 5;
  const outerRadius = isLowData ? "90%" : "70%";
  const innerRadius = isLowData ? "20%" : "30%";
  const barSize = isLowData ? 20 : 10;

  return (
    <div className="w-full h-96">
      {chartData?.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            barSize={barSize}
            data={chartData}
          >
            <RadialBar
              label={{
                position: "insideStart",
                fill: "#fff",
                fontSize: isLowData ? 12 : 10,
              }}
              background
              dataKey="total"
            />
            <Legend
              iconSize={10}
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ paddingTop: 20 }}
            />
            <Tooltip formatter={(value: any) => [`$${value}`, "Total"]} />
          </RadialBarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          <p>No expense data available to display.</p>
        </div>
      )}
    </div>
  );
}

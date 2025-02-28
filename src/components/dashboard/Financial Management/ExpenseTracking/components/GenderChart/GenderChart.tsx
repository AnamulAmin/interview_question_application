import { useState } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
// import UseAxiosSecure from '../../../../../Hook/UseAxioSecure';
// import { AuthContext } from '../../../../../providers/AuthProvider';

const COLORS = ["#0088FE", "#FF69B4"]; // Blue for Male, Pink for Female

const GenderChart = () => {
  const [info, setInfo] = useState<any>(null);
  // const axiosSecure = UseAxiosSecure();
  // const { branch } = useContext(AuthContext);

  // useEffect(() => {
  //   const fetchData = () => {
  //     axiosSecure
  //       .get(`users/get-stats/${branch}`)
  //       .then((response) => {
  //         setInfo(response?.data[0]);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching data:", error);
  //       });
  //   };
  //   fetchData();
  // }, [axiosSecure, branch]);

  // If info is not yet fetched, show a loading state or return null
  if (!info)
    return (
      <div className="flex items-center justify-center h-[400px] bg-gray-100">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-blue-500"></span>
          <p className="mt-4 text-blue-500 font-semibold">Loading...</p>
        </div>
      </div>
    );

  // Calculate the data for the chart
  const total = info.totalMembers.maleCount + info.totalMembers.femaleCount;
  const data = [
    { name: "Male", value: (info.totalMembers.maleCount / total) * 100 },
    { name: "Female", value: (info.totalMembers.femaleCount / total) * 100 },
  ];

  return (
    <PieChart width={400} height={400}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        outerRadius={100}
        fill="#8884d8"
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default GenderChart;

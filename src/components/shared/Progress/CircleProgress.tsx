import getRemainingPercentage from "@/helpers/GetRemainingPercentage";
import { CircularProgress } from "@nextui-org/progress";
import React from "react";

export default function CircleProgress({
  label = "",
  strokeColor = "stroke-green-500",
  totalTimes = 0,
  createdTime = "",
  createdDate = "",
  height = "h-20",
  width = "w-20",
}: any) {
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    let renderTime = 500;

    const updateProgress = () => {
      const percentage = getRemainingPercentage(
        totalTimes,
        createdTime,
        createdDate
      );

      if (percentage > 0) {
        setValue(percentage);
      } else {
        setValue(0);
        clearInterval(interval); // 🛑 Stop when percentage reaches 0
      }
    };

    const interval = setInterval(updateProgress, renderTime);

    updateProgress(); // Run immediately before interval starts

    return () => clearInterval(interval);
  }, [totalTimes, createdTime, createdDate]);

  return (
    <CircularProgress
      aria-label="Loading..."
      color="warning"
      classNames={{
        svg: `${height} ${width} drop-shadow-md`,
        indicator: strokeColor,
        track: "stroke-gray-200",
        value: "text-lg font-semibold text-black",
      }}
      showValueLabel={true}
      strokeWidth={4}
      label={label}
      value={value.toFixed(2)}
      formatOptions={{ style: "percent" }}
    />
  );
}

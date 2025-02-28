export const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const LEAVE_DAY_COMBINATIONS = DAYS_OF_WEEK.flatMap((day1, index1) =>
  DAYS_OF_WEEK.slice(index1 + 1).map((day2) => ({
    key: `${day1},${day2}`,
    value: `${day1},${day2}`,
    label: `${day1},${day2}`,
  }))
);

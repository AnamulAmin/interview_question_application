import { Calendar, DateInput, Input } from "@nextui-org/react";
import moment from "moment";
import { useRef, useEffect, useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";

export default function InputCalendar({
  boxClass,
  value,
  onChange,
  ...props
}: any) {
  const [date, setDate] = useState<any>(null);
  const [focused, setFocused] = useState<boolean>(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (value) {
      setDate(value);
    }
  }, [value]);

  return (
    <div className={boxClass} ref={calendarRef}>
      {/* DateInput Field */}
      <div onClick={() => setFocused(true)} className="relative">
        <label className="text-gray-500 absolute top-1/2 -translate-y-1/2 right-4 z-10">
          <FaCalendarAlt />
        </label>
        <Input
          value={date}
          autoFocus={!focused}
          isDisabled={true}
          className="opacity-100"
          {...props}
        />
      </div>

      {/* Calendar Component */}
      {focused && (
        <div className="absolute z-20 bg-white ">
          <Calendar
            aria-label="Date (Page Behaviour)"
            pageBehavior="single"
            onChange={(date) => {
              const dateValue = moment(date).format("YYYY-MM-DD");

              console.log(date, "Selected Date", dateValue);
              setDate(date);
              onChange(dateValue);
              setFocused(false);
            }}
          />
        </div>
      )}
    </div>
  );
}

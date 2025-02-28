import { useState } from "react";

function FilterRadioInput({ label, id, name, checked, onChange, type }) {
  const [isChecked, setIsChecked] = useState < any > checked;
  // console.log(isChecked, "isChecked");
  const handleChange = (e) => {
    setIsChecked(e.target.checked);
    onChange(e.target.checked, id, type);
  };
  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={isChecked}
        onChange={handleChange}
      />
      <label htmlFor={id} className={`text-lg`}>
        {label}
      </label>
    </div>
  );
}

export default FilterRadioInput;

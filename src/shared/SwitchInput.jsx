import React from "react";
import Switch from "react-switch";
function SwitchInput({ label, checked, setChecked }) {
  return (
    <div className="mb-6 flex items-center">
      <label className="block text-gray-700 font-semibold mr-2">{label}</label>
      <Switch
        id="switch"
        checked={checked}
        onChange={setChecked}
        offColor="#ccc"
        onColor="#00b894"
        checkedIcon={false} 
        uncheckedIcon={false} 
        handleDiameter={16} 
        height={20} 
        width={40} 
      />
    </div>
  );
}

export default SwitchInput;

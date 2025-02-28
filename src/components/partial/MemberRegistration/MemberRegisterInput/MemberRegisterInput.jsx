import React from "react";

function MemberRegisterInput({
  label,
  type,
  readOnly,
  register,
  error,
  name,
  isRequired = true,
  onChange = { onChange: () => {} },
  ...res
}) {
  return (
    <div className={"w-[95%] flex flex-col space-y-1 md:space-y-2 pt-2"}>
    <label htmlFor={label} className="capitalize font-bold text-[0.9rem]">
      {label}
    </label>
    <input
      type={type}
      id={label}
      className={`focus:border-yellow-400 appearance-none text-gray-700 text-sm border shadow-sm rounded-xl w-full md:py-3 md:px-3 py-2 px-2 leading-tight focus:outline-none focus:shadow-outline ${
        readOnly && "cursor-not-allowed bg-[#eee]"
      }`}
      readOnly={readOnly}
      // Only spread the register function if the name is provided
      {...(name ? register(name, { required: isRequired, onChange }) : {})}
      {...res}
    />

    {error?.[name]?.message && (
      <p className="text-red-500 pt-2 pl-2">{error?.[name]?.message}</p>
    )}
  </div>
  );
}

export default MemberRegisterInput;

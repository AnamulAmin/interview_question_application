import { useState } from "react";

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
  const [isShowPassword, setIsShowPassword] = useState < any > false;
  const handleClickShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };
  return (
    <div
      className={"w-[95%] flex flex-col space-y-1 md:space-y-2 pt-2 relative"}
    >
      <label htmlFor={label} className="capitalize font-bold text-[0.9rem]">
        {label}
      </label>
      <input
        type={isShowPassword ? "text" : type}
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

      {type === "password" && (
        <div className="flex items-center justify-end absolute right-4 top-1/2">
          <button
            onClick={handleClickShowPassword}
            className="text-sm text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {isShowPassword ? "Hide" : "Show"}
          </button>
        </div>
      )}
    </div>
  );
}

export default MemberRegisterInput;

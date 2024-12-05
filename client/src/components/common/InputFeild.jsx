import React, { useId } from "react";
import { IoIosSearch } from "react-icons/io";

const InputField = React.forwardRef(function Input(
  {
    label,
    type = "text",
    className = "",
    labelclass = "",
    mainstyle = "",
    outerClass = "",
    isSearch = true,
    id = "",
    ...props
  },
  ref
) {
  const useid = useId();
  return (
    <div className={`w-full ${mainstyle} `}>
      {label && (
        <label className={`inline-block mb-1 pl-1 text-label-color text-sm font-regular ${labelclass}`} htmlFor={id}>
          {label}
        </label>
      )}
      <div className={`flex items-center bg-white text-black border border-gray-300 w-full font-regular ${outerClass}`}>
        <input
          type={type}
          className={`px-3 outline-none focus:bg-gray-50 duration-200 text-sm font-regular placeholder:text-sm placeholder:font-regular h-8 w-full ${className}`}
          ref={ref}
          {...props}
          id={id}
        />
        {isSearch && (
          <div className="flex items-center justify-center w-12 h-full ">
            <IoIosSearch className="text-2xl" />
          </div>
        )}
      </div>
    </div>
  );
});

export default InputField;

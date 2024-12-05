import React from "react";

const SelectBox = React.forwardRef(function SelectBox(
  { label, options, className = "", mainStyle = "", defaultValue = "", labelclass = "", id, name, title, ...props },
  ref
) {

  let optionExists = false, finalOptions = options;

  if (defaultValue) {
    // console.log("OPTION :", defaultValue)
    optionExists = options.some(option => option.value === defaultValue);
    finalOptions = optionExists ? options : [...options, { value: defaultValue, label: defaultValue }];
  }
  return (
    <div className={`flex  ${mainStyle}  `}> {/* flex-col */}
      {label && (
        <label className={`mb-1 pl-1 text-label-color text-sm font-regular ${labelclass}`} htmlFor={id || name}> {label} </label>
      )}
      <select
        id={id || name}
        name={name}
        ref={ref}
        className={`px-3 py-1 border border-gray-300 text-sm font-regular text-gray-800 ${className}`}
        {...props}
        defaultValue={defaultValue}
      >
        <option value="">{title ? title : "Select"} </option>
        {finalOptions.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label || option.value}
          </option>
        ))}
      </select>
    </div>
  );
});

export default SelectBox;

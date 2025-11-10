import React from "react";

const Input = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,  // ← Add this
  error,
  required = false,
  className = "",
  id,  // ← Add this for checkbox functionality
  checked,  // ← Add this for checkbox
}) => {
  return (
    <label className="flex flex-col">
      {label && (
        <p className="text-base font-medium leading-normal pb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </p>
      )}
      <input
        id={id}
        className={`w-full rounded-lg border ${
          error ? "border-red-500" : "border-gray-300"
        } bg-white p-3.5 text-base placeholder:text-gray-500 focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700 ${className}`}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        checked={checked}
        onChange={onChange}
        onBlur={onBlur}  // ← Add this
      />
      {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
    </label>
  );
};
export default Input;

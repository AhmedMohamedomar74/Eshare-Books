import React from "react";
import { useSelector } from "react-redux";

const Input = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required = false,
  className = "",
}) => {
  const { content } = useSelector((state) => state.lang);

  return (
    <label className="flex flex-col">
      <p className="text-base font-medium leading-normal pb-2">
        {label} {required && <span className="text-red-500">{content.common.required}</span>}
      </p>
      <input
        className={`w-full rounded-lg border ${
          error ? "border-red-500" : "border-gray-300"
        } bg-white p-3.5 text-base placeholder:text-gray-500 focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700 ${className}`}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
    </label>
  );
};

export default Input;
import React from "react";

export const InputNumber = ({
  id,
  name,
  type = "text",
  placeholder,
  className = "",
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-typo-secondary">
        {name}
      </label>
      <input
        id={id}
        name={Number}
        type={Number}
        placeholder={placeholder}
        className={`border border-typo-outline rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-60 ${className}`}
      />
    </div>
  );
};

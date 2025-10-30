import React from "react";

export const InputText = ({
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
        name={name}
        type={type}
        placeholder={placeholder}
        className={`bg-typo-white2 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-60 ${className}`}
      />
    </div>
  );
};

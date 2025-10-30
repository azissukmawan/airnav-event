import React from "react";

export const TextArea = ({
  id,
  name,
  placeholder,
  className = "",
  rows = 3,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-typo-secondary">
        {name}
      </label>
      <textarea
        id={id}
        name={name}
        placeholder={placeholder}
        rows={rows}
        className={`border border-typo-outline rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-60 resize-none ${className}`}
      ></textarea>
    </div>
  );
};

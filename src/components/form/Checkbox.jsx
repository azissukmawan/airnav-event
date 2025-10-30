import React from "react";

export const Checkbox = ({ options = [], selected = [], onChange }) => {
  const toggleOption = (value) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {options.map((opt) => (
        <label
          key={opt.value}
          className="flex items-center gap-2 cursor-pointer text-gray-700"
        >
          <input
            type="checkbox"
            checked={selected.includes(opt.value)}
            onChange={() => toggleOption(opt.value)}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span>{opt.label}</span>
        </label>
      ))}
    </div>
  );
};

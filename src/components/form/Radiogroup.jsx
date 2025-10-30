import React from "react";

export function RadioGroup({
  options = [],
  selected,
  onChange,
  name = "radio-group",
}) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((opt) => (
        <label
          key={opt.value}
          className="flex items-center gap-2 cursor-pointer text-gray-700"
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={selected === opt.value}
            onChange={() => onChange(opt.value)}
            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
          />
          <span>{opt.label}</span>
        </label>
      ))}
    </div>
  );
}

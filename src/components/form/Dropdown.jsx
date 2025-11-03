import { useState, useEffect } from "react";
import clsx from "clsx";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { Typography } from "../typography";
import { Dropdown } from "../form/Dropdown";

const baseClasses =
  "w-full h-11 px-4 flex items-center justify-between rounded-md transition-all duration-150";

const variantClasses = {
  primary:
    "bg-primary text-typo-white border border-transparent hover:bg-primary-70",
  secondary:
    "bg-primary-10 text-primary border border-transparent hover:bg-primary-20",
  third: "bg-typo-light text-typo-surface border border-transparent",
  white:
    "bg-white text-primary border border-gray-200 hover:bg-primary-10 hover:text-primary",
  outline:
    "bg-typo-white text-primary border-2 border-primary hover:bg-primary hover:text-typo-white",
};

export const Dropdown = ({
  label = "Select option",
  options = [],
  variant = "primary",
  type = "basic", // "basic" | "search"
  className = "",
  onSelect,
  value,
}) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  useEffect(() => {
  if (value) {
    const matchedOption = options.find((opt) => opt.value === value);
    setSelected(matchedOption || null);
  } else {
    setSelected(null);
  }
}, [value, options]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSelect = (option) => {
    setSelected(option);
    setOpen(false);
    setSearchTerm("");
    if (onSelect) onSelect(option.value);
  };

  const variantStyle = variantClasses[variant] || variantClasses.primary;

  const filteredOptions =
    type === "search"
      ? options.filter((opt) =>
          opt.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : options;

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={clsx(baseClasses, variantStyle, className)}
      >
        <Typography type="button" font="poppins" weight="semibold">
          {selected ? selected.label : label}
        </Typography>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-full rounded-md shadow-lg bg-white border border-gray-100">
          {type === "search" && (
            <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
              <Search size={16} className="text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-sm outline-none"
              />
            </div>
          )}

          <ul className="max-h-48 overflow-auto py-1 w-full">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  className={clsx(
                    "px-4 py-2 cursor-pointer hover:bg-primary-10 transition-all duration-150",
                    selected?.value === option.value &&
                      "bg-primary-10 font-semibold"
                  )}
                >
                  <Typography type="button" font="poppins" weight="medium">
                    {option.label}
                  </Typography>
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-400">
                <Typography type="button" font="poppins" weight="medium">
                  No options
                </Typography>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;

import { useState } from "react";
import clsx from "clsx";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { Typography } from "../typography";

const variantClasses = {
  primary:
    "border border-gray-300 bg-white hover:border-primary focus:ring-2 focus:ring-primary",
  outline:
    "border-2 border-primary bg-white hover:bg-primary-10 focus:ring-2 focus:ring-primary",
};

export const MultiSelect = ({
  label = "Select options",
  options = [],
  variant = "primary",
  className = "",
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState([]);

  const toggleOption = (option) => {
    let updated;
    if (selected.includes(option.value)) {
      updated = selected.filter((v) => v !== option.value);
    } else {
      updated = [...selected, option.value];
    }
    setSelected(updated);
    if (onChange) onChange(updated);
  };

  const handleRemove = (value) => {
    const updated = selected.filter((v) => v !== value);
    setSelected(updated);
    if (onChange) onChange(updated);
  };

  const variantStyle = variantClasses[variant] || variantClasses.primary;

  return (
    <div className="relative w-full">
      {/* Tombol utama */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={clsx(
          "flex items-center justify-between w-full px-3 py-2 rounded-md transition-all duration-150",
          variantStyle,
          className
        )}
      >
        <div className="flex flex-wrap gap-1 items-center text-left">
          {selected.length > 0 ? (
            options
              .filter((o) => selected.includes(o.value))
              .map((o) => (
                <span
                  key={o.value}
                  className="flex items-center bg-primary-10 text-primary px-2 py-0.5 rounded-md text-sm"
                >
                  {o.label}
                  <X
                    size={14}
                    className="ml-1 cursor-pointer hover:text-primary-70"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(o.value);
                    }}
                  />
                </span>
              ))
          ) : (
            <Typography
              type="button"
              font="poppins"
              weight="medium"
              className="text-gray-500"
            >
              {label}
            </Typography>
          )}
        </div>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {/* Daftar opsi */}
      {open && (
        <div className="absolute z-20 mt-2 w-full rounded-md shadow-md bg-white border border-gray-200">
          <ul className="max-h-48 overflow-auto py-1">
            {options.length > 0 ? (
              options.map((option) => (
                <li
                  key={option.value}
                  onClick={() => toggleOption(option)}
                  className={clsx(
                    "flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-primary-10",
                    selected.includes(option.value) && "bg-primary-10"
                  )}
                >
                  <Typography type="button" font="poppins" weight="medium">
                    {option.label}
                  </Typography>
                  {selected.includes(option.value) && (
                    <span className="text-primary font-semibold text-sm">
                      ✓
                    </span>
                  )}
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

export default MultiSelect;

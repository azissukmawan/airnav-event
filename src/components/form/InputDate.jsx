import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const InputDate = ({ label = "Tanggal", selected, onChange }) => {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-typo text-sm font-medium">{label}</label>
      <DatePicker
        selected={selected}
        onChange={onChange}
        dateFormat="dd/MM/yyyy"
        placeholderText="dd/mm/yy"
        className="bg-typo-white2 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary w-full"
      />
    </div>
  );
};

export default InputDate;

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const InputTime = ({ label = "Waktu", selected, onChange }) => {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-typo text-sm font-medium">{label}</label>
      <DatePicker
        selected={selected}
        onChange={onChange}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={15}
        timeCaption="Waktu"
        dateFormat="HH:mm"
        timeFormat="HH:mm"
        placeholderText="Pilih waktu"
        className="bg-typo-light rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary w-full"
      />
    </div>
  );
};

export default InputTime;
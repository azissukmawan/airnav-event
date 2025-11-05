import React from "react";

const CardStatus = ({ icon, value, label, color }) => {
  return (
    <div
      className={`flex items-center gap-3 bg-white p-5 rounded-xl shadow-sm border-l-4 ${color} w-full`}
    >
      <div className="text-3xl">{icon}</div>
      <div>
        <p className="text-2xl font-semibold text-gray-800">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
};

export default CardStatus;

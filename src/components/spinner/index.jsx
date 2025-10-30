import React from "react";

const Spinner = () => {
  return (
    <div className="flex items-center justify-center space-x-2 h-16">
      <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
      <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.2s]"></div>
      <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.4s]"></div>
    </div>
  );
};

export default Spinner;

import React, { useState } from "react";
import { Search } from "lucide-react";

const SearchBar = ({ placeholder = "Cari sesuatu...", onSearch }) => {
  const [query, setQuery] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (onSearch) onSearch(value);
  };

  const handleSearchClick = () => {
    if (onSearch) onSearch(query);
  };

  return (
    <div className="flex items-center w-full bg-white rounded-full border border-typo-inline overflow-hidden focus-within:ring-2 focus-within:ring-primary-60">
      <button
        onClick={handleSearchClick}
        className="p-4 text-typo-icon hover:text-primary-60 transition-colors"
      >
        <Search className="w-5 h-5" />
      </button>

      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleInputChange}
        className="flex-1 p-2 outline-none text-typo-secondary placeholder-typo-icon"
      />
    </div>
  );
};

export default SearchBar;

import React from "react";

const SearchBar = ({
  searchValue,
  setSearchValue,
  placeholder = "Search...",
}) => {
  return (
    <div className="w-full">
      <input
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="bg-[#1D1D1D] w-full text-[#999] border-[#2D2F37] border-[1px] rounded-lg p-2 hover:border-[#D9A876] focus:border-[#D9A876] focus:ring-[#D9A876] focus:outline-none focus:ring-1 transition-all duration-300 ease-in-out md:w-[200px] h-[40px] px-[10px] text-[16px] placeholder-[#666]"
        placeholder={placeholder}
      />
    </div>
  );
};

export default SearchBar;

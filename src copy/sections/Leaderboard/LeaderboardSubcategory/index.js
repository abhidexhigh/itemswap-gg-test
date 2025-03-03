import { useState } from "react";

const LeaderboardSubcategory = ({
  subcategories,
  activeSubcategory,
  setActiveSubcategory,
}) => {
  return (
    <ul className="flex flex-wrap pl-0 mb-0 list-none !border">
      {subcategories?.map((subcategory, index) => (
        <li
          key={index}
          className={`flex-auto flex-grow-1 text-center !border !border-white rounded-none font-black -mb-[1px] text-[14px] cursor-pointer px-[12px] md:p-0 ${
            subcategory === activeSubcategory ? "!bg-[#ca9372]" : "bg-[#313030]"
          }`}
          onClick={() => setActiveSubcategory(subcategory)}
        >
          <a className="h-[50px] p-0 leading-[50px]">{subcategory}</a>
        </li>
      ))}
    </ul>
  );
};

export default LeaderboardSubcategory;

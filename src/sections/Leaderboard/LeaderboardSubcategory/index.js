import { useState } from "react";

const LeaderboardSubcategory = ({
  subcategories,
  activeSubcategory,
  setActiveSubcategory,
}) => {
  return (
    <ul className="flex flex-wrap pl-0 mb-0 list-none !border !border-[#ffffff50] rounded-l-lg overflow-hidden rounded-r-lg md:!mx-auto">
      {subcategories?.map((subcategory, index) => (
        <li
          key={index}
          className={`flex-auto flex-grow-1 text-center !border-r !border-[#ffffff14] rounded-none font-black -mb-[1px] text-[16px] cursor-pointer px-[12px] md:p-0 ${
            subcategory === activeSubcategory
              ? "!bg-[#ffffff] text-black"
              : "bg-[#222231] text-white"
          }`}
          onClick={() => setActiveSubcategory(subcategory)}
        >
          <a
            className={`h-[50px] p-0 leading-[50px] ${subcategory === activeSubcategory ? "!text-black" : "!text-white"}`}
          >
            {subcategory}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default LeaderboardSubcategory;

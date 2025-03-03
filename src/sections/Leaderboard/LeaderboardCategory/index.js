import { useState } from "react";

const LeaderboardCategory = ({
  categories,
  activeCategory,
  setActiveCategory,
  setActiveSubcategory,
}) => {
  return (
    <nav className="flex my-[32px] justify-center">
      <ul className="flex justify-center list-none max-w-[1096px] p-0 w-full border border-[#e9eaed] m-0">
        {categories?.map((category, i) => (
          <li
            className="flex items-center justify-center flex-grow box-border cursor-pointer"
            key={i}
          >
            <a
              className={`w-full h-[60px] flex items-center justify-center gap-[4px] ${
                category === activeCategory
                  ? "bg-[#605f5f] shadow-[0_2px_0_#fe8758_inset]"
                  : "bg-[#313030]"
              }`}
              onClick={() => {
                setActiveCategory(category);
                setActiveSubcategory();
              }}
            >
              {category}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default LeaderboardCategory;

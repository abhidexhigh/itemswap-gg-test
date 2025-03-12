import { useState } from "react";

const LeaderboardCategory = ({
  categories,
  activeCategory,
  setActiveCategory,
  setActiveSubcategory,
}) => {
  return (
    <nav className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 my-8">
      <div className="overflow-x-auto">
        <ul className="flex min-w-max lg:min-w-0 border border-[#ffffff4d] rounded-lg bg-[#1a1b2b]">
          {categories?.map((category, i) => (
            <li key={i} className="flex-1 min-w-[120px] lg:min-w-0">
              <button
                className={`w-full h-[50px] px-4 flex items-center justify-center text-sm sm:text-base font-medium transition-all duration-200
                  ${
                    category === activeCategory
                      ? "bg-[#2a2a3a] text-[#ca9372] border-t-2 border-[#ca9372]"
                      : "text-white hover:bg-[#2a2a3a] hover:text-[#ca9372]"
                  }`}
                onClick={() => {
                  setActiveCategory(category);
                  setActiveSubcategory();
                }}
              >
                {category}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default LeaderboardCategory;

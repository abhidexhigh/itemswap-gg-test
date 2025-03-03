import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "../../../i18n";

const TrendFilters = ({ buttons, dropdown1, dropdown2, onButtonClick }) => {
  const { t } = useTranslation();
  const others = t("others");
  const [selectedBtn, setSelectedBtn] = useState(buttons[0]);

  const handleButtonClick = (button) => {
    setSelectedBtn(button);
    onButtonClick(button);
  };

  return (
    <div
      className="mt-2"
      style={{
        background: "rgba(0, 0, 0, 0.2)",
        borderRadius: "16px",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(2px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        padding: "10px",
        overflow: "auto",
      }}
    >
      <div className="!px-4 !py-8 lg:flex lg:items-center">
        <div
          className="inline-flex shadow-sm rounded-md mx-1 !bg-[#222231] mb-1"
          role="group"
        >
          {buttons?.map((button) => (
            <button
              type="button"
              className={` border border-gray-200 text-md font-medium px-4 py-2 text-[#fff] hover:bg-gray-200 hover:text-gray-900 focus:z-10 focus:ring-blue-700 focus:text-blue-700 ${
                selectedBtn === button
                  ? "bg-[#fff] text-gray-900"
                  : "text-gray-700}"
              }`}
              onClick={() => handleButtonClick(button)}
            >
              {others?.[button?.toLowerCase()]}
            </button>
          ))}
        </div>
        {dropdown1 && dropdown1?.length > 0 && (
          <div className="mx-1 mb-1">
            <select className="bg-gray-50 border h-[36px] border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              {dropdown1?.map((drop) => (
                <option value={drop}>{drop}</option>
              ))}
            </select>
          </div>
        )}
        {dropdown2 && dropdown2?.length > 0 && (
          <div className="mx-1 mb-1">
            <select className="bg-gray-50 border h-[36px] border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              {dropdown2?.map((drop) => (
                <option value={drop}>{drop}</option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendFilters;

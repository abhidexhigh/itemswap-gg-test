import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "../../../i18n";

const TrendFilters = ({
  buttons,
  dropdown1,
  dropdown2,
  onButtonClick,
  imageButtons,
}) => {
  const { t } = useTranslation();
  const others = t("others");
  const [selectedBtn, setSelectedBtn] = useState(buttons[0]);

  const handleButtonClick = (button) => {
    setSelectedBtn(button);
    onButtonClick(button);
  };

  // Check if we're using image buttons or text buttons
  const isImageMode = Array.isArray(imageButtons) && imageButtons.length > 0;

  return (
    <div
    // className="mt-2"
    // style={{
    //   background: "rgba(0, 0, 0, 0.2)",
    //   borderRadius: "10px",
    //   boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    //   backdropFilter: "blur(2px)",
    //   border: "1px solid rgba(255, 255, 255, 0.3)",
    //   padding: "6px",
    //   overflow: "auto",
    //   width: "fit-content",
    // }}
    >
      <div className="!py-2 lg:flex lg:items-center w-fit mx-auto">
        <div
          className="inline-flex shadow-sm rounded-md mx-1 !bg-[#1D1D1D] !border !border-[#2D2F37]"
          role="group"
        >
          {isImageMode
            ? imageButtons?.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  className={`border border-[#2D2F37] text-md font-medium p-2 hover:bg-[#2D2F37] hover:text-white focus:z-10 focus:ring-[#D9A876] focus:text-[#D9A876] ${
                    selectedBtn === buttons[index]
                      ? "bg-[#2D2F37] text-[#D9A876]"
                      : "text-[#999]"
                  }`}
                  onClick={() => handleButtonClick(buttons[index])}
                >
                  <img
                    src={item}
                    alt={buttons[index]}
                    width={32}
                    height={32}
                    className={`w-8 h-8 md:w-10 md:h-10 ${
                      selectedBtn === buttons[index]
                        ? "rounded-md"
                        : "border border-[#2D2F37] rounded-md opacity-70"
                    }`}
                  />
                </button>
              ))
            : buttons?.map((button) => (
                <button
                  key={button}
                  type="button"
                  className={`border border-[#2D2F37] text-md font-medium px-4 py-2 hover:bg-[#2D2F37] hover:text-white focus:z-10 focus:ring-[#D9A876] focus:text-[#D9A876] ${
                    selectedBtn === button
                      ? "bg-[#2D2F37] text-[#D9A876]"
                      : "text-[#999]"
                  }`}
                  onClick={() => handleButtonClick(button)}
                >
                  {others?.[button?.toLowerCase()] || button}
                </button>
              ))}
        </div>
        {dropdown1 && dropdown1?.length > 0 && (
          <div className="mx-1 mb-1">
            <select className="bg-[#1D1D1D] border h-[36px] border-[#2D2F37] text-[#999] text-md rounded-lg focus:ring-[#D9A876] focus:border-[#D9A876] block w-full p-2.5">
              {dropdown1?.map((drop) => (
                <option key={drop} value={drop}>
                  {drop}
                </option>
              ))}
            </select>
          </div>
        )}
        {dropdown2 && dropdown2?.length > 0 && (
          <div className="mx-1 mb-1">
            <select className="bg-[#1D1D1D] border h-[36px] border-[#2D2F37] text-[#999] text-md rounded-lg focus:ring-[#D9A876] focus:border-[#D9A876] block w-full p-2.5">
              {dropdown2?.map((drop) => (
                <option key={drop} value={drop}>
                  {drop}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendFilters;

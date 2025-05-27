import React from "react";
import RoundOff from "../utils/RoundOff";

const ColoredValue = ({ value, prefix = "", suffix = "" }) => {
  // Default to white/normal color
  let textColor = "text-white";

  // Apply color based on value range
  if (value < 4) {
    textColor = "text-red-500";
  } else if (value >= 4 && value <= 4.5) {
    textColor = "text-orange-500";
  } else if (value > 4.5 && value <= 5) {
    textColor = "text-yellow-500";
  }

  return (
    <span className={textColor}>
      {prefix}
      {RoundOff(value)}
      {suffix}
    </span>
  );
};

export default ColoredValue;

import React, { useState } from "react";
import GlobalTooltip from "src/components/tooltip/GlobalTooltip.jsx";

const ItemTable = ({ itemsData }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <table className="table-fixed group">
      <tbody>
        {/* Example loop for rows */}
        {Array.from({ length: 10 }).map((_, rowIndex) => (
          <tr key={rowIndex}>
            {/* {rowIndex === 0 && (
                <td className="w-[40px] h-[40px]"></td>
            )} */}
            {/* Example loop for columns */}
            {itemsData
              .slice(rowIndex * 10, (rowIndex + 1) * 10)
              .map((item, colIndex) => (
                <td
                  key={colIndex}
                  className="md:pb-[8px] md:pr-[8px] pt-0 relative"
                  onMouseEnter={() =>
                    setHoveredIndex({ row: rowIndex, col: colIndex })
                  }
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="relative">
                    <div className="relative">
                      {hoveredIndex?.row === rowIndex &&
                      hoveredIndex?.col === colIndex ? (
                        <GlobalTooltip
                          title={item.name}
                          desc="Deal 8% bonus damage"
                          subDesc="+55% attack damage"
                        >
                          {item.imageUrl && (
                            <img
                              src={item.imageUrl}
                              className={`w-[38px] md:w-[84px] md:h-[84px] rounded-[16px] !bg-black transition-all duration-300 ${
                                hoveredIndex &&
                                hoveredIndex.row !== rowIndex &&
                                hoveredIndex.col !== colIndex &&
                                "grayscale opacity-20"
                              } ${
                                hoveredIndex &&
                                hoveredIndex.row === rowIndex &&
                                hoveredIndex.col === colIndex
                                  ? "not-grayscale opacity-100"
                                  : "opacity-80"
                              }`}
                            />
                          )}
                        </GlobalTooltip>
                      ) : (
                        <>
                          {item.imageUrl && (
                            <img
                              src={item.imageUrl}
                              className={`w-[38px] md:w-[84px] md:h-[84px] rounded-[16px] transition-all duration-300 ${
                                hoveredIndex &&
                                hoveredIndex.row !== rowIndex &&
                                hoveredIndex.col !== colIndex &&
                                "grayscale opacity-20"
                              } ${
                                hoveredIndex &&
                                hoveredIndex.row === rowIndex &&
                                hoveredIndex.col === colIndex
                                  ? "not-grayscale opacity-100"
                                  : ""
                              }`}
                            />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </td>
              ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ItemTable;

//Old Code

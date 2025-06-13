import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import "../../../../../i18n";
import "react-tooltip/dist/react-tooltip.css";
import GirlCrush from "@assets/image/traits/GirlCrush.svg";
import TrendFilters from "src/components/trendFilters";
import {
  HiArrowSmUp,
  HiArrowSmDown,
  HiChevronDown,
  HiChevronUp,
} from "react-icons/hi";
import ReactTltp from "src/components/tooltip/ReactTltp";
import metaDeckAugments from "../../../../data/newData/metaDeckAugments.json";
import augments from "../../../../data/newData/augments.json";
import ScrollableTable from "src/utils/ScrollableTable";
import { OptimizedImage } from "../../../../utils/imageOptimizer";
import SearchBar from "src/components/searchBar";
import ColoredValue from "src/components/ColoredValue";

const ProjectItems = () => {
  const { t } = useTranslation();
  const others = t("others");
  const { augmentStats } = metaDeckAugments;

  const [augmentsStatsData, setAugmentsStatsData] = useState(augmentStats);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [searchValue, setSearchValue] = useState("");
  const [mobileFilter, setMobileFilter] = useState("roundOnePickRate");
  const [expandedRows, setExpandedRows] = useState(new Set());

  // Mobile filter options (excluding serial no, image, name, avg rank)
  const mobileFilterOptions = [
    { key: "roundOnePickRate", label: others?.firstPick || "First Pick" },
    { key: "roundTwoPickRate", label: others?.secondPick || "Second Pick" },
    { key: "roundThreePickRate", label: others?.thirdPick || "Third Pick" },
    { key: "tops", label: others?.top4 || "Top 4%" },
    { key: "wins", label: others?.winPercentage || "Win %" },
    { key: "pickRate", label: others?.pickPercentage || "Pick %" },
    { key: "plays", label: others?.played || "Played" },
  ];

  const getCellClass = (key) => {
    if (sortConfig.key === key) {
      return "bg-[#2D2F37] text-[#D9A876]";
    }
    return "";
  };

  const handleButtonClick = (button) => {
    if (button === "All") {
      setAugmentsStatsData(augmentStats);
    } else {
      setAugmentsStatsData(
        augmentStats.filter(
          (augment) => augment.tier.toLowerCase() === button.toLowerCase()
        )
      );
    }
  };

  const handleMobileFilterClick = (filterKey) => {
    setMobileFilter(filterKey);

    // If clicking on the same filter, toggle sort direction
    if (mobileFilter === filterKey && sortConfig.key === filterKey) {
      const newDirection =
        sortConfig.direction === "ascending" ? "descending" : "ascending";
      setSortConfig({ key: filterKey, direction: newDirection });
    } else {
      // Auto-sort by the selected filter (default to descending for new selections)
      setSortConfig({ key: filterKey, direction: "descending" });
    }
  };

  const toggleRowExpansion = (index) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(index)) {
      newExpandedRows.delete(index);
    } else {
      newExpandedRows.add(index);
    }
    setExpandedRows(newExpandedRows);
  };

  const renderMobileValue = (item, key) => {
    switch (key) {
      case "roundOnePickRate":
      case "roundTwoPickRate":
      case "roundThreePickRate":
        return `${item[key].toFixed(2)}%`;
      case "tops":
      case "wins":
        return `${((item[key] * 100) / item.plays).toFixed(2)}%`;
      case "pickRate":
        return `${(item[key] * 100).toFixed(2)}%`;
      case "plays":
        return item[key].toLocaleString("en-US");
      default:
        return item[key];
    }
  };

  const renderExpandedContent = (item) => {
    const hiddenData = [
      {
        label: others?.firstPick || "First Pick",
        value: `${item.roundOnePickRate.toFixed(2)}%`,
        key: "roundOnePickRate",
      },
      {
        label: others?.secondPick || "Second Pick",
        value: `${item.roundTwoPickRate.toFixed(2)}%`,
        key: "roundTwoPickRate",
      },
      {
        label: others?.thirdPick || "Third Pick",
        value: `${item.roundThreePickRate.toFixed(2)}%`,
        key: "roundThreePickRate",
      },
      {
        label: others?.top4 || "Top 4%",
        value: `${((item.tops * 100) / item.plays).toFixed(2)}%`,
        key: "tops",
      },
      {
        label: others?.winPercentage || "Win %",
        value: `${((item.wins * 100) / item.plays).toFixed(2)}%`,
        key: "wins",
      },
      {
        label: others?.pickPercentage || "Pick %",
        value: `${(item.pickRate * 100).toFixed(2)}%`,
        key: "pickRate",
      },
      {
        label: others?.played || "Played",
        value: item.plays.toLocaleString("en-US"),
        key: "plays",
      },
    ];

    // Filter out the currently selected mobile filter
    const filteredData = hiddenData.filter((data) => data.key !== mobileFilter);

    return (
      <div className="grid grid-cols-3 gap-3 justify-between text-center px-4 py-3 bg-[#1a1a1a] border-t border-[#2D2F37]">
        {filteredData.map((data, index) => (
          <div key={index} className="flex flex-col">
            <span className="text-xs text-gray-400 mb-1">{data.label}</span>
            <span className="text-sm text-white">{data.value}</span>
          </div>
        ))}
      </div>
    );
  };

  useEffect(() => {
    let sortedData = [...augmentStats];
    if (sortConfig !== null) {
      sortedData.sort((a, b) => {
        let aValue, bValue;

        if (["tops", "wins"].includes(sortConfig.key)) {
          // calculate the top percentage and win percentage based on the plays
          aValue = (a[sortConfig.key] * 100) / a.plays;
          bValue = (b[sortConfig.key] * 100) / b.plays;
        } else {
          aValue = a[sortConfig.key];
          bValue = b[sortConfig.key];
        }

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    setAugmentsStatsData(sortedData);
  }, [augmentStats, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    setAugmentsStatsData(
      augmentStats.filter((augment) =>
        augment.key.toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  }, [searchValue]);

  const renderSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? (
        <HiArrowSmUp className="text-lg" />
      ) : (
        <HiArrowSmDown className="text-lg" />
      );
    }
    return null;
  };

  return (
    <>
      <div className="pt-2 bg-[#111111] md:bg-transparent w-full">
        {/* Header section with filters and search */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-[#111111] md:bg-transparent px-2 sm:px-4 mb-2.5 md:mb-0">
          <div className="w-full sm:w-auto sm:mb-0">
            <TrendFilters
              buttons={["All", "Silver", "Gold", "Prismatic"]}
              onButtonClick={handleButtonClick}
            />
          </div>
          {/* Mobile Filter Buttons - Only visible on mobile */}
          <div className="block md:hidden mb-2">
            <div className="flex flex-col items-center gap-2 px-4">
              {/* First Row - Always 4 buttons */}
              <div className="flex gap-0">
                {mobileFilterOptions.slice(0, 4).map((option, index) => {
                  const isFirst = index === 0;
                  const isLast = index === 3;
                  const isActive = mobileFilter === option.key;

                  return (
                    <button
                      key={option.key}
                      onClick={() => handleMobileFilterClick(option.key)}
                      className={`
                      px-3 py-2 text-xs font-medium transition-colors flex items-center justify-center space-x-1 border
                      ${isFirst ? "rounded-l-lg" : ""} 
                      ${isLast ? "rounded-r-lg" : ""} 
                      ${!isFirst ? "-ml-px" : ""} 
                      ${
                        isActive
                          ? "bg-[#D9A876] text-black border-[#D9A876] z-10 relative"
                          : "bg-[#2D2F37] text-white border-[#404040] hover:bg-[#3D3F47] hover:border-[#4A4A4A]"
                      }
                    `}
                    >
                      <span>{option.label}</span>
                      {isActive && sortConfig.key === option.key && (
                        <span className="ml-1">
                          {sortConfig.direction === "ascending" ? (
                            <HiArrowSmUp className="w-3 h-3" />
                          ) : (
                            <HiArrowSmDown className="w-3 h-3" />
                          )}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Second Row - Remaining buttons */}
              <div className="flex gap-0">
                {mobileFilterOptions.slice(4).map((option, index) => {
                  const actualIndex = index + 4;
                  const isFirst = index === 0;
                  const isLast =
                    index === mobileFilterOptions.slice(4).length - 1;
                  const isActive = mobileFilter === option.key;

                  return (
                    <button
                      key={option.key}
                      onClick={() => handleMobileFilterClick(option.key)}
                      className={`
                      px-3 py-2 text-xs font-medium transition-colors flex items-center justify-center space-x-1 border
                      ${isFirst ? "rounded-l-lg" : ""} 
                      ${isLast ? "rounded-r-lg" : ""} 
                      ${!isFirst ? "-ml-px" : ""} 
                      ${
                        isActive
                          ? "bg-[#D9A876] text-black border-[#D9A876] z-10 relative"
                          : "bg-[#2D2F37] text-white border-[#404040] hover:bg-[#3D3F47] hover:border-[#4A4A4A]"
                      }
                    `}
                    >
                      <span>{option.label}</span>
                      {isActive && sortConfig.key === option.key && (
                        <span className="ml-1">
                          {sortConfig.direction === "ascending" ? (
                            <HiArrowSmUp className="w-3 h-3" />
                          ) : (
                            <HiArrowSmDown className="w-3 h-3" />
                          )}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="w-full sm:w-auto px-4 sm:px-0">
            <SearchBar
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              placeholder="Search augment..."
            />
          </div>
        </div>

        {/* Table section */}
        <div className="projects-row">
          {/* Desktop Table - Hidden on mobile */}
          <div className="hidden md:block overflow-auto">
            <ScrollableTable>
              <table className="w-full min-w-[900px] relative border-collapse">
                <thead className="sticky top-0 z-50">
                  <tr className="bg-[#000000]">
                    <th className="p-2 font-semibold text-center border-b border-[#2D2F37]">
                      <p className="p-0 text-sm sm:text-base md:text-[16px] mb-0 py-2">
                        {others.rank}
                      </p>
                    </th>
                    <th
                      className={`cursor-pointer p-2 font-semibold border-b border-[#2D2F37] ${sortConfig?.key === "key" ? "bg-[#2D2F37]" : ""}`}
                      onClick={() => requestSort("key")}
                    >
                      <p className="p-0 text-sm sm:text-base my-auto md:text-[16px] text-left flex items-center">
                        {others?.augment}
                        <span className="ml-2">{renderSortIcon("key")}</span>
                      </p>
                    </th>
                    <th
                      className={`cursor-pointer p-2 font-semibold border-b border-[#2D2F37] ${sortConfig?.key === "avgPlacement" ? "bg-[#2D2F37]" : ""}`}
                      onClick={() => requestSort("avgPlacement")}
                    >
                      <p className="p-0 text-sm sm:text-base my-auto md:text-[16px] text-left flex items-center">
                        {others?.avgPlacement}
                        <span className="ml-2">
                          {renderSortIcon("avgPlacement")}
                        </span>
                      </p>
                    </th>
                    <th
                      className={`cursor-pointer p-2 font-semibold border-b border-[#2D2F37] ${sortConfig?.key === "roundOnePickRate" ? "bg-[#2D2F37]" : ""}`}
                      onClick={() => requestSort("roundOnePickRate")}
                    >
                      <p className="p-0 text-sm sm:text-base my-auto md:text-[16px] text-left flex items-center">
                        {others?.firstPick}
                        <span className="ml-2">
                          {renderSortIcon("roundOnePickRate")}
                        </span>
                      </p>
                    </th>
                    <th
                      className={`cursor-pointer p-2 font-semibold border-b border-[#2D2F37] ${sortConfig?.key === "roundTwoPickRate" ? "bg-[#2D2F37]" : ""}`}
                      onClick={() => requestSort("roundTwoPickRate")}
                    >
                      <p className="p-0 text-sm sm:text-base my-auto md:text-[16px] text-left flex items-center">
                        {others?.secondPick}
                        <span className="ml-2">
                          {renderSortIcon("roundTwoPickRate")}
                        </span>
                      </p>
                    </th>
                    <th
                      className={`cursor-pointer p-2 font-semibold border-b border-[#2D2F37] ${sortConfig?.key === "roundThreePickRate" ? "bg-[#2D2F37]" : ""}`}
                      onClick={() => requestSort("roundThreePickRate")}
                    >
                      <p className="p-0 text-sm sm:text-base my-auto md:text-[16px] text-left flex items-center">
                        {others?.thirdPick}
                        <span className="ml-2">
                          {renderSortIcon("roundThreePickRate")}
                        </span>
                      </p>
                    </th>
                    <th
                      className={`cursor-pointer p-2 font-semibold border-b border-[#2D2F37] ${sortConfig?.key === "tops" ? "bg-[#2D2F37]" : ""}`}
                      onClick={() => requestSort("tops")}
                    >
                      <p className="p-0 text-sm sm:text-base my-auto md:text-[16px] text-left flex items-center">
                        {others?.top4}
                        <span className="ml-2">{renderSortIcon("tops")}</span>
                      </p>
                    </th>
                    <th
                      className={`cursor-pointer p-2 font-semibold border-b border-[#2D2F37] ${sortConfig?.key === "wins" ? "bg-[#2D2F37]" : ""}`}
                      onClick={() => requestSort("wins")}
                    >
                      <p className="p-0 text-sm sm:text-base my-auto md:text-[16px] text-left flex items-center">
                        {others?.winPercentage}
                        <span className="ml-2">{renderSortIcon("wins")}</span>
                      </p>
                    </th>
                    <th
                      className={`cursor-pointer p-2 font-semibold border-b border-[#2D2F37] ${sortConfig?.key === "pickRate" ? "bg-[#2D2F37]" : ""}`}
                      onClick={() => requestSort("pickRate")}
                    >
                      <p className="p-0 text-sm sm:text-base my-auto md:text-[16px] text-left flex items-center">
                        {others?.pickPercentage}
                        <span className="ml-2">
                          {renderSortIcon("pickRate")}
                        </span>
                      </p>
                    </th>
                    <th
                      className={`cursor-pointer p-2 font-semibold border-b border-[#2D2F37] ${sortConfig?.key === "plays" ? "bg-[#2D2F37]" : ""}`}
                      onClick={() => requestSort("plays")}
                    >
                      <p className="p-0 text-sm sm:text-base my-auto md:text-[16px] text-left flex items-center">
                        {others?.played}
                        <span className="ml-2">{renderSortIcon("plays")}</span>
                      </p>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[#111111]">
                  {augmentsStatsData.map(
                    (item, index) =>
                      augments.find(
                        (augment) =>
                          augment.key ===
                          item.key?.split("_")[item?.key?.split("_").length - 1]
                      )?.key && (
                        <tr
                          className="hover:bg-[#2D2F37] transition-colors duration-200 border-b border-[#2D2F37]"
                          key={index}
                        >
                          <td className="p-2 text-center">
                            <div className="text-center text-base">
                              {index + 1}
                            </div>
                          </td>
                          <td className={`p-2 ${getCellClass("key")}`}>
                            <div>
                              <div className="flex justify-start items-center">
                                <OptimizedImage
                                  src={
                                    augments.find(
                                      (augment) =>
                                        augment.key ===
                                        item.key?.split("_")[
                                          item?.key?.split("_").length - 1
                                        ]
                                    )?.imageUrl
                                  }
                                  alt="icon"
                                  width={80}
                                  height={80}
                                  className="w-12 h-12 sm:w-14 sm:h-14 md:w-[80px] md:h-[80px] mr-1 rounded-md"
                                  data-tooltip-id={item?.key}
                                />
                                <ReactTltp
                                  variant="augment"
                                  id={item?.key}
                                  content={augments.find(
                                    (augment) =>
                                      augment.key ===
                                      item.key?.split("_")[
                                        item?.key?.split("_").length - 1
                                      ]
                                  )}
                                />
                                <div>
                                  <p className="p-0 text-base sm:text-base md:text-lg text-[#fff] mb-1 ml-2 truncate max-w-[120px] sm:max-w-full">
                                    {
                                      augments.find(
                                        (augment) =>
                                          augment.key ===
                                          item.key?.split("_")[
                                            item?.key?.split("_").length - 1
                                          ]
                                      )?.name
                                    }
                                  </p>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className={`p-2 ${getCellClass("avgPlacement")}`}>
                            <p className="p-0 text-base sm:text-base md:text-lg text-[#fff] mb-0">
                              <ColoredValue
                                value={item?.avgPlacement}
                                prefix="#"
                              />
                            </p>
                          </td>
                          <td
                            className={`p-2 ${getCellClass("roundOnePickRate")}`}
                          >
                            <p className="p-0 text-base sm:text-base md:text-lg text-[#fff] mb-0">
                              {item?.roundOnePickRate.toFixed(2)}%
                            </p>
                          </td>
                          <td
                            className={`p-2 ${getCellClass("roundTwoPickRate")}`}
                          >
                            <p className="p-0 text-base sm:text-base md:text-lg text-[#fff] mb-0">
                              {item?.roundTwoPickRate.toFixed(2)}%
                            </p>
                          </td>
                          <td
                            className={`p-2 ${getCellClass("roundThreePickRate")}`}
                          >
                            <p className="p-0 text-base sm:text-base md:text-lg text-[#fff] mb-0">
                              {item?.roundThreePickRate.toFixed(2)}%
                            </p>
                          </td>
                          <td className={`p-2 ${getCellClass("tops")}`}>
                            <p className="p-0 text-base sm:text-base md:text-lg text-[#fff] mb-0">
                              {((item?.tops * 100) / item?.plays).toFixed(2)}%
                            </p>
                          </td>
                          <td className={`p-2 ${getCellClass("wins")}`}>
                            <p className="p-0 text-base sm:text-base md:text-lg text-[#fff] mb-0">
                              {((item?.wins * 100) / item?.plays).toFixed(2)}%
                            </p>
                          </td>
                          <td className={`p-2 ${getCellClass("pickRate")}`}>
                            <p className="p-0 text-base sm:text-base md:text-lg text-[#fff] mb-0">
                              {(item?.pickRate * 100).toFixed(2)}%
                            </p>
                          </td>
                          <td className={`p-2 ${getCellClass("plays")}`}>
                            <p className="p-0 text-base sm:text-base md:text-lg text-[#fff] mb-0">
                              {item?.plays.toLocaleString("en-US")}
                            </p>
                          </td>
                        </tr>
                      )
                  )}
                </tbody>
              </table>
            </ScrollableTable>
          </div>

          {/* Mobile Table - Only visible on mobile */}
          <div className="block md:hidden">
            <div className="bg-[#111111]">
              {/* Mobile Table Header */}
              <div
                className="grid gap-1 p-3 bg-[#1a1a1a] text-white font-semibold text-sm border-b border-[#2D2F37]"
                style={{ gridTemplateColumns: "10% 45% 20% 22%" }}
              >
                <div className="text-center">#</div>
                <div
                  className={`cursor-pointer flex items-center ${sortConfig?.key === "key" ? "text-[#D9A876]" : ""}`}
                  onClick={() => requestSort("key")}
                >
                  Augment
                  <span className="ml-1">{renderSortIcon("key")}</span>
                </div>
                <div
                  className={`text-center cursor-pointer flex items-center justify-center ${sortConfig?.key === "avgPlacement" ? "text-[#D9A876]" : ""}`}
                  onClick={() => requestSort("avgPlacement")}
                >
                  Avg Rank
                  <span className="ml-1">{renderSortIcon("avgPlacement")}</span>
                </div>
                <div
                  className={`text-center flex items-center justify-center ${mobileFilter === sortConfig.key ? "text-[#D9A876]" : ""}`}
                >
                  <span>
                    {
                      mobileFilterOptions.find(
                        (option) => option.key === mobileFilter
                      )?.label
                    }
                  </span>
                  {mobileFilter === sortConfig.key && (
                    <span className="ml-1">
                      {sortConfig.direction === "ascending" ? (
                        <HiArrowSmUp className="w-3 h-3" />
                      ) : (
                        <HiArrowSmDown className="w-3 h-3" />
                      )}
                    </span>
                  )}
                </div>
              </div>

              {/* Mobile Table Body */}
              {augmentsStatsData.map(
                (item, index) =>
                  augments.find(
                    (augment) =>
                      augment.key ===
                      item.key?.split("_")[item?.key?.split("_").length - 1]
                  )?.key && (
                    <div key={index} className="border-b border-[#2D2F37]">
                      {/* Main Row */}
                      <div
                        className="grid gap-1 p-3 items-center cursor-pointer hover:bg-[#2D2F37] transition-colors duration-200"
                        style={{ gridTemplateColumns: "10% 45% 20% 22%" }}
                        onClick={() => toggleRowExpansion(index)}
                      >
                        {/* Serial No */}
                        <div className="text-center text-white font-medium">
                          {index + 1}
                        </div>

                        {/* Image & Name */}
                        <div className="flex items-center space-x-2 min-w-0">
                          <OptimizedImage
                            src={
                              augments.find(
                                (augment) =>
                                  augment.key ===
                                  item.key?.split("_")[
                                    item?.key?.split("_").length - 1
                                  ]
                              )?.imageUrl
                            }
                            alt="icon"
                            width={32}
                            height={32}
                            className="w-12 h-12 rounded-md flex-shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-white text-sm truncate leading-tight mb-0">
                              {
                                augments.find(
                                  (augment) =>
                                    augment.key ===
                                    item.key?.split("_")[
                                      item?.key?.split("_").length - 1
                                    ]
                                )?.name
                              }
                            </p>
                          </div>
                        </div>

                        {/* Avg Rank */}
                        <div className="text-center text-white text-sm">
                          <ColoredValue value={item?.avgPlacement} prefix="#" />
                        </div>

                        {/* Selected Filter Value */}
                        <div
                          className={`text-center text-sm ${mobileFilter === sortConfig.key ? "text-[#D9A876] font-medium" : "text-white"} flex items-center justify-center space-x-1`}
                        >
                          <span>{renderMobileValue(item, mobileFilter)}</span>
                          {expandedRows.has(index) ? (
                            <HiChevronUp className="w-4 h-4" />
                          ) : (
                            <HiChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </div>

                      {/* Expanded Content */}
                      {expandedRows.has(index) && renderExpandedContent(item)}
                    </div>
                  )
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectItems;

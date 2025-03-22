import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import "../../../../../i18n";
import "react-tooltip/dist/react-tooltip.css";
import GirlCrush from "@assets/image/traits/GirlCrush.svg";
import TrendFilters from "src/components/trendFilters";
import { HiArrowSmUp, HiArrowSmDown } from "react-icons/hi";
import ReactTltp from "src/components/tooltip/ReactTltp";
import metaDeckAugments from "../../../../data/newData/metaDeckAugments.json";
import augments from "../../../../data/newData/augments.json";
import ScrollableTable from "src/utils/ScrollableTable";
import { OptimizedImage } from "../../../../utils/imageOptimizer";

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

  const getCellClass = (key) => {
    if (sortConfig.key === key) {
      return "bg-[#222240] text-[#fff]";
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
      <div className="pt-2 bg-[#1a1b31] md:bg-transparent w-full">
        {/* Header section with filters and search */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-[#1a1b31] md:bg-transparent px-2 sm:px-4 mb-2.5 md:mb-0">
          <div className="w-full sm:w-auto sm:mb-0">
            <TrendFilters
              buttons={["All", "Silver", "Gold", "Prismatic"]}
              onButtonClick={handleButtonClick}
            />
          </div>
          <div className="w-full sm:w-auto px-4 sm:px-0">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="bg-[#222231] w-full text-[#fff] border-[#ffffff80] border-[1px] rounded-[4px] hover:border-[#ffffff60] hover:shadow-lg transition-all duration-300 ease-in-out sm:w-[180px] md:w-[200px] lg:w-[250px] h-[40px] px-[10px] text-[14px] sm:text-[16px] placeholder-[#fff]"
              placeholder="Search..."
            />
          </div>
        </div>

        {/* Table section */}
        <div className="projects-row overflow-auto">
          <ScrollableTable>
            <table className="w-full min-w-[900px] relative lg:border-separate lg:border-spacing-y-2">
              <thead className="sticky top-0 z-50">
                <tr className="bg-[#0f0f1e]">
                  <th className="lg:rounded-l-lg p-2 font-semibold">
                    <p className="p-0 text-sm sm:text-base !mx-2 my-2 md:text-[16px]">
                      {others.rank}
                    </p>
                  </th>
                  <th
                    className={`cursor-pointer p-2 font-semibold ${sortConfig?.key === "key" ? "bg-[#1e1e3a]" : ""}`}
                    onClick={() => requestSort("key")}
                  >
                    <p className="p-0 text-sm sm:text-base my-auto md:text-[16px] text-left flex items-center">
                      {others?.augment}
                      <span className="ml-2">{renderSortIcon("key")}</span>
                    </p>
                  </th>
                  <th
                    className={`cursor-pointer p-2 font-semibold ${sortConfig?.key === "avgPlacement" ? "bg-[#1e1e3a]" : ""}`}
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
                    className={`cursor-pointer p-2 font-semibold ${sortConfig?.key === "roundOnePickRate" ? "bg-[#1e1e3a]" : ""}`}
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
                    className={`cursor-pointer p-2 font-semibold ${sortConfig?.key === "roundTwoPickRate" ? "bg-[#1e1e3a]" : ""}`}
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
                    className={`cursor-pointer p-2 font-semibold ${sortConfig?.key === "roundThreePickRate" ? "bg-[#1e1e3a]" : ""}`}
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
                    className={`cursor-pointer p-2 font-semibold ${sortConfig?.key === "tops" ? "bg-[#1e1e3a]" : ""}`}
                    onClick={() => requestSort("tops")}
                  >
                    <p className="p-0 text-sm sm:text-base my-auto md:text-[16px] text-left flex items-center">
                      {others?.top4}
                      <span className="ml-2">{renderSortIcon("tops")}</span>
                    </p>
                  </th>
                  <th
                    className={`cursor-pointer p-2 font-semibold ${sortConfig?.key === "wins" ? "bg-[#1e1e3a]" : ""}`}
                    onClick={() => requestSort("wins")}
                  >
                    <p className="p-0 text-sm sm:text-base my-auto md:text-[16px] text-left flex items-center">
                      {others?.winPercentage}
                      <span className="ml-2">{renderSortIcon("wins")}</span>
                    </p>
                  </th>
                  <th
                    className={`cursor-pointer p-2 font-semibold ${sortConfig?.key === "pickRate" ? "bg-[#1e1e3a]" : ""}`}
                    onClick={() => requestSort("pickRate")}
                  >
                    <p className="p-0 text-sm sm:text-base my-auto md:text-[16px] text-left flex items-center">
                      {others?.pickPercentage}
                      <span className="ml-2">{renderSortIcon("pickRate")}</span>
                    </p>
                  </th>
                  <th
                    className={`cursor-pointer p-2 lg:rounded-r-lg font-semibold ${sortConfig?.key === "plays" ? "bg-[#1e1e3a]" : ""}`}
                    onClick={() => requestSort("plays")}
                  >
                    <p className="p-0 text-sm sm:text-base my-auto md:text-[16px] text-left flex items-center">
                      {others?.played}
                      <span className="ml-2">{renderSortIcon("plays")}</span>
                    </p>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-[#1a1b31]">
                {augmentsStatsData.map(
                  (item, index) =>
                    augments.find(
                      (augment) =>
                        augment.key ===
                        item.key?.split("_")[item?.key?.split("_").length - 1]
                    )?.key && (
                      <tr
                        className="m-2 hover:bg-[#292a4ae0] transition-colors duration-200 md:border-[1px] md:border-[#ffffff50]"
                        key={index}
                      >
                        <td className="p-2 lg:rounded-l-lg">
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
                                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mr-1 rounded-md"
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
                            #{item?.avgPlacement.toFixed(2)}
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
                        <td
                          className={`p-2 lg:rounded-r-lg ${getCellClass("plays")}`}
                        >
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
      </div>
    </>
  );
};

export default ProjectItems;

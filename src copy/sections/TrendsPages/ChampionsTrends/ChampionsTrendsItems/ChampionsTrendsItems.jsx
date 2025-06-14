import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import "../../../../../i18n";
import "react-tooltip/dist/react-tooltip.css";
import ReactTltp from "src/components/tooltip/ReactTltp";
import {
  HiArrowSmUp,
  HiArrowSmDown,
  HiChevronDown,
  HiChevronUp,
} from "react-icons/hi";
import metaDeckChampionsStats from "../../../../data/newData/metaDeckChampions.json";
import Comps from "../../../../data/compsNew.json";
import CardImage from "src/components/cardImage";
import TrendFilters from "src/components/trendFilters";
import ScrollableTable from "src/utils/ScrollableTable";
import { OptimizedImage } from "../../../../utils/imageOptimizer";
import SearchBar from "src/components/searchBar";
import ColoredValue from "src/components/ColoredValue";
import ItemDisplay from "src/components/item/ItemDisplay";

const ProjectItems = () => {
  const { t } = useTranslation();
  const others = t("others");

  const [metaDeckChampionsStatsData, setMetaDeckChampionsStatsData] = useState(
    metaDeckChampionsStats
  );
  const [searchValue, setSearchValue] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [mobileFilter, setMobileFilter] = useState("tops");
  const [expandedRows, setExpandedRows] = useState(new Set());

  // Mobile filter options (excluding serial no, image, name, avg rank, recommended items)
  const mobileFilterOptions = [
    { key: "tops", label: others?.top4 || "Top 4%" },
    { key: "wins", label: others?.winPercentage || "Win %" },
    { key: "pickRate", label: others?.pickPercentage || "Pick %" },
    { key: "plays", label: others?.played || "Played" },
    {
      key: "threeStarPercentage",
      label: others?.threeStarsPercentage || "3⭐ %",
    },
    { key: "threeStarRank", label: others?.threeStarsRank || "3⭐ Rank" },
  ];

  useEffect(() => {
    let sortedData = [...metaDeckChampionsStatsData];
    if (sortConfig !== null) {
      sortedData.sort((a, b) => {
        let aValue, bValue;

        if (["firstPick", "secondPick", "thirdPick"].includes(sortConfig.key)) {
          const index =
            sortConfig.key === "firstPick"
              ? 0
              : sortConfig.key === "secondPick"
                ? 1
                : 2;
          aValue = a.augmentRoundStats[index]?.avgPlacement || 0;
          bValue = b.augmentRoundStats[index]?.avgPlacement || 0;
        } else if (["tops", "wins"].includes(sortConfig.key)) {
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
    setMetaDeckChampionsStatsData(sortedData);
  }, [metaDeckChampionsStats, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
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
      case "tops":
      case "wins":
        return `${((item[key] * 100) / item.plays).toFixed(2)}%`;
      case "pickRate":
      case "threeStarPercentage":
        return `${(item[key] * 100).toFixed(2)}%`;
      case "plays":
        return item[key].toLocaleString("en-US");
      case "threeStarRank":
        return `#${item[key].toFixed(2)}`;
      default:
        return item[key];
    }
  };

  const renderExpandedContent = (item) => {
    const hiddenData = [
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
      {
        label: others?.threeStarsPercentage || "3⭐ %",
        value: `${(item.threeStarPercentage * 100).toFixed(2)}%`,
        key: "threeStarPercentage",
      },
      {
        label: others?.threeStarsRank || "3⭐ Rank",
        value: `#${item.threeStarRank.toFixed(2)}`,
        key: "threeStarRank",
      },
    ];

    // Filter out the currently selected mobile filter
    const filteredData = hiddenData.filter((data) => data.key !== mobileFilter);

    return (
      <div className="grid grid-cols-3 gap-3 p-4 bg-[#1a1a1a] border-t border-[#2D2F37]">
        {filteredData.map((data, index) => (
          <div key={index} className="flex flex-col">
            <span className="text-xs text-gray-400 mb-1">{data.label}</span>
            <span className="text-sm text-white">{data.value}</span>
          </div>
        ))}
        {/* Recommended Items */}
        <div className="flex flex-col">
          <span className="text-xs text-gray-400 mb-2">
            {others?.recommended} {others.items}
          </span>
          <div className="flex flex-wrap justify-start gap-1">
            {champions
              .find((champ) => champ.key === item.key)
              ?.recommendItems.map((itemKey) =>
                items.find(
                  (i) =>
                    i.key ===
                    itemKey?.split("_")[itemKey?.split("_").length - 1]
                )
              )
              .map(
                (itemImg, idx) =>
                  itemImg && (
                    <div key={idx} className="relative">
                      {/* <OptimizedImage
                        src={itemImg}
                        alt="icon"
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded border border-[#ffffff40]"
                      /> */}
                      <ItemDisplay
                        item={itemImg}
                        size="xSmall"
                        borderRadius="rounded-[4px]"
                        backgroundRadius="rounded-[4px]"
                        showTooltip={false}
                      />
                    </div>
                  )
              )}
          </div>
        </div>
      </div>
    );
  };

  const {
    props: {
      pageProps: {
        dehydratedState: {
          queries: { data },
        },
      },
    },
  } = Comps;
  const { champions } = data?.refs;
  const { items } = data?.refs;
  const { forces } = data?.refs;

  const lookup = new Map(champions.map((champion) => [champion.key, champion]));

  // Merge objects from arr1 with matching objects from arr2
  const merged = metaDeckChampionsStats.map((champion) => {
    return { ...champion, ...(lookup.get(champion.key) || {}) };
  });

  const handleButtonClick = (button) => {
    if (button === "All") {
      setMetaDeckChampionsStatsData(metaDeckChampionsStats);
    } else {
      const filteredData = merged.filter((champion) => champion.cost == button);
      setMetaDeckChampionsStatsData(filteredData);
    }
  };

  useEffect(() => {
    const filteredData = merged.filter((champion) =>
      champion.key.toLowerCase().includes(searchValue.toLowerCase())
    );
    setMetaDeckChampionsStatsData(filteredData);
  }, [searchValue]);

  // Add getCellClass function to highlight sorted column cells
  const getCellClass = (key) => {
    if (sortConfig.key === key) {
      return "bg-[#2D2F37] text-[#D9A876]";
    }
    return "";
  };

  // Add renderSortIcon function for consistent icon rendering
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
    // <ProjectItemsStyleWrapper>
    <div className="pt-2 bg-[#111111] md:bg-transparent">
      <div className="md:flex md:justify-between md:items-center bg-[#111111] md:bg-transparent mb-2.5 md:mb-0">
        <div className="flex items-center mx-auto md:!ml-0 md:!mr-0 justify-center md:justify-start">
          <h1 className="text-[#fff] hidden md:block text-lg md:text-xl font-bold mb-0">
            Cost
          </h1>
          <TrendFilters
            buttons={["All", "1", "2", "3", "4", "5"]}
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
        <div className="mb-2 md:mb-0 px-4">
          <SearchBar
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            placeholder="Search champion..."
          />
        </div>
      </div>
      <div className="projects-row">
        {/* Desktop Table - Hidden on mobile */}
        <div className="hidden md:block overflow-auto">
          <ScrollableTable>
            <table className="w-[900px] md:w-full relative border-collapse">
              <thead className="sticky top-0 z-50">
                <tr className="bg-[#000000]">
                  <th className="p-2 font-semibold text-center border-b border-[#2D2F37]">
                    <p className="p-0 text-base md:text-[16px] mb-0 py-2">
                      {others.rank}
                    </p>
                  </th>
                  <th
                    className={`cursor-pointer p-2 font-semibold border-b border-[#2D2F37] ${sortConfig?.key === "key" ? "bg-[#2D2F37]" : ""}`}
                    onClick={() => requestSort("key")}
                  >
                    <p className="p-0 text-sm sm:text-base my-auto md:text-[16px] text-left flex items-center">
                      {others.champions}
                      <span className="ml-2">{renderSortIcon("key")}</span>
                    </p>
                  </th>
                  <th
                    className={`cursor-pointer p-2 font-semibold border-b border-[#2D2F37] ${sortConfig?.key === "avgPlacement" ? "bg-[#2D2F37]" : ""}`}
                    onClick={() => requestSort("avgPlacement")}
                  >
                    <p className="p-0 text-sm sm:text-base my-auto md:text-[16px] text-left flex items-center">
                      {others.avgRank}
                      <span className="ml-2">
                        {renderSortIcon("avgPlacement")}
                      </span>
                    </p>
                  </th>
                  <th
                    className={`cursor-pointer p-2 font-semibold border-b border-[#2D2F37] ${sortConfig?.key === "tops" ? "bg-[#2D2F37]" : ""}`}
                    onClick={() => requestSort("tops")}
                  >
                    <p className="p-0 text-sm sm:text-base my-auto md:text-[16px] text-left flex items-center">
                      {others.top4}
                      <span className="ml-2">{renderSortIcon("tops")}</span>
                    </p>
                  </th>
                  <th
                    className={`cursor-pointer p-2 font-semibold border-b border-[#2D2F37] ${sortConfig?.key === "wins" ? "bg-[#2D2F37]" : ""}`}
                    onClick={() => requestSort("wins")}
                  >
                    <p className="p-0 text-sm sm:text-base my-auto md:text-[16px] text-left flex items-center">
                      {others.winPercentage}
                      <span className="ml-2">{renderSortIcon("wins")}</span>
                    </p>
                  </th>
                  <th
                    className={`cursor-pointer p-2 font-semibold border-b border-[#2D2F37] ${sortConfig?.key === "pickRate" ? "bg-[#2D2F37]" : ""}`}
                    onClick={() => requestSort("pickRate")}
                  >
                    <p className="p-0 text-sm sm:text-base my-auto md:text-[16px] text-left flex items-center">
                      {others.pickPercentage}
                      <span className="ml-2">{renderSortIcon("pickRate")}</span>
                    </p>
                  </th>
                  <th
                    className={`cursor-pointer p-2 font-semibold border-b border-[#2D2F37] ${sortConfig?.key === "plays" ? "bg-[#2D2F37]" : ""}`}
                    onClick={() => requestSort("plays")}
                  >
                    <p className="p-0 text-sm sm:text-base my-auto md:text-[16px] text-left flex items-center">
                      {others.played}
                      <span className="ml-2">{renderSortIcon("plays")}</span>
                    </p>
                  </th>
                  <th className="p-2 font-semibold border-b border-[#2D2F37]">
                    <p className="p-0 text-base my-auto md:text-[16px] text-left">
                      {others?.threeStarsPercentage}
                    </p>
                  </th>
                  <th className="p-2 font-semibold border-b border-[#2D2F37]">
                    <p className="p-0 text-base my-auto md:text-[16px] text-left">
                      {others?.threeStarsRank}
                    </p>
                  </th>
                  <th className="p-2 font-semibold border-b border-[#2D2F37]">
                    <p className="p-0 text-base my-auto md:text-[16px] text-center">
                      {others?.recommended} {others.items}
                    </p>
                  </th>
                </tr>
              </thead>
              {metaDeckChampionsStatsData.map(
                (champion, index) =>
                  champions.find((champ) => champ.key === champion.key)
                    ?.key && (
                    <tr
                      className="bg-[#111111] hover:bg-[#2D2F37] transition-colors duration-200 border-b border-[#2D2F37]"
                      key={index}
                    >
                      <td className="p-2 text-center">
                        <div className="text-center">{index + 1}</div>
                      </td>
                      <td className={`p-2 ${getCellClass("key")}`}>
                        <div>
                          <div className="flex justify-start items-center">
                            <CardImage
                              src={champions.find(
                                (champ) => champ.key === champion.key
                              )}
                              imgStyle="md:w-[80px]"
                              identificationImageStyle="w=[16px] md:w-[32px]"
                              textStyle="text-[10px] md:text-[16px] hidden"
                              forces={forces}
                              cardSize="md:!w-[80px] md:!h-[80px]"
                            />
                            <p className="p-0 text-left text-base md:text-xl mb-0 ml-2 text-[#fff]">
                              {
                                champions.find(
                                  (champ) => champ.key === champion.key
                                )?.key
                              }
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className={`p-2 ${getCellClass("avgPlacement")}`}>
                        <p className="p-0 text-left text-base md:text-lg mb-0">
                          <ColoredValue
                            value={champion?.avgPlacement}
                            prefix="#"
                          />
                        </p>
                      </td>
                      <td className={`p-2 ${getCellClass("tops")}`}>
                        <p className="p-0 text-left text-base md:text-lg mb-0 text-[#fff]">
                          {((champion?.tops * 100) / champion?.plays).toFixed(
                            2
                          )}
                          %
                        </p>
                      </td>
                      <td className={`p-2 ${getCellClass("wins")}`}>
                        <p className="p-0 text-left text-base md:text-lg mb-0 text-[#fff]">
                          {((champion?.wins * 100) / champion?.plays).toFixed(
                            2
                          )}
                          %
                        </p>
                      </td>
                      <td className={`p-2 ${getCellClass("pickRate")}`}>
                        <p className="p-0 text-left text-base md:text-lg mb-0 text-[#fff]">
                          {(champion?.pickRate * 100).toFixed(2)}%
                        </p>
                      </td>
                      <td className={`p-2 ${getCellClass("plays")}`}>
                        <p className="p-0 text-left text-base md:text-lg mb-0 text-[#fff]">
                          {champion?.plays.toLocaleString("en-US")}
                        </p>
                      </td>
                      <td className="p-2">
                        <p className="p-0 text-left text-base md:text-lg mb-0 text-[#fff]">
                          {(champion?.threeStarPercentage * 100).toFixed(2)}%
                        </p>
                      </td>
                      <td className="p-2">
                        <p className="p-0 text-left text-base md:text-lg mb-0 text-[#fff]">
                          #{(champion?.threeStarRank).toFixed(2)}
                        </p>
                      </td>
                      <td className="p-2">
                        <div className="flex justify-center items-center gap-1">
                          {champions
                            .find((champ) => champ.key === champion.key)
                            ?.recommendItems.map((item) =>
                              items.find(
                                (i) =>
                                  i.key ===
                                  item?.split("_")[item?.split("_").length - 1]
                              )
                            )
                            .map(
                              (item) =>
                                item && (
                                  <>
                                    <div className="relative z-10 hover:z-20 aspect-square rounded-lg">
                                      <ItemDisplay
                                        item={item}
                                        size="small"
                                        borderRadius="rounded-[4px]"
                                        backgroundRadius="rounded-[4px]"
                                        tooltipId={item?.name}
                                        showTooltip={true}
                                      />
                                    </div>
                                  </>
                                )
                            )}
                        </div>
                      </td>
                    </tr>
                  )
              )}
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
                Champion
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
            {metaDeckChampionsStatsData.map(
              (champion, index) =>
                champions.find((champ) => champ.key === champion.key)?.key && (
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
                        <CardImage
                          src={champions.find(
                            (champ) => champ.key === champion.key
                          )}
                          imgStyle="w-16 h-16"
                          identificationImageStyle="w-3 h-3"
                          textStyle="text-[8px] hidden"
                          forces={forces}
                          cardSize="!w-16 !h-16"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-white text-base truncate leading-tight mb-0">
                            {
                              champions.find(
                                (champ) => champ.key === champion.key
                              )?.key
                            }
                          </p>
                        </div>
                      </div>

                      {/* Avg Rank */}
                      <div className="text-center text-white text-base">
                        <ColoredValue
                          value={champion?.avgPlacement}
                          prefix="#"
                        />
                      </div>

                      {/* Selected Filter Value */}
                      <div
                        className={`text-center text-base ${mobileFilter === sortConfig.key ? "text-[#D9A876] font-medium" : "text-white"} flex items-center justify-center space-x-1`}
                      >
                        <span>{renderMobileValue(champion, mobileFilter)}</span>
                        {expandedRows.has(index) ? (
                          <HiChevronUp className="w-4 h-4" />
                        ) : (
                          <HiChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {expandedRows.has(index) && renderExpandedContent(champion)}
                  </div>
                )
            )}
          </div>
        </div>
      </div>
    </div>
    // </ProjectItemsStyleWrapper>
  );
};

export default ProjectItems;

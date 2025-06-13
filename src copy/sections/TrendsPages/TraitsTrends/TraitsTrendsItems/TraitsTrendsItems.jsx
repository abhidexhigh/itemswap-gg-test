import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import "../../../../../i18n";
import CardImage from "src/components/cardImage";
import "react-tooltip/dist/react-tooltip.css";
import TrendFilters from "src/components/trendFilters";
import {
  HiArrowSmUp,
  HiArrowSmDown,
  HiChevronDown,
  HiChevronUp,
} from "react-icons/hi";
import metaDeckTraitStats from "../../../../data/newData/metaDeckTraits.json";
import Comps from "../../../../data/compsNew.json";
import ReactTltp from "src/components/tooltip/ReactTltp";
import ScrollableTable from "src/utils/ScrollableTable";
import { OptimizedImage } from "../../../../utils/imageOptimizer";
import SearchBar from "src/components/searchBar";
import ColoredValue from "src/components/ColoredValue";
import TraitImage from "src/components/TraitImage/TraitImage";

const ProjectItems = () => {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const others = t("others");

  // const { metaDeckTraitStats } = MetaDeckTraits?.metaDeckTrait;

  const [metaDeckTraitStatsData, setMetaDeckTraitStatsData] =
    useState(metaDeckTraitStats);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [searchValue, setSearchValue] = useState("");
  const [mobileFilter, setMobileFilter] = useState("tops");
  const [expandedRows, setExpandedRows] = useState(new Set());

  // Mobile filter options (excluding serial no, image, name, avg rank, top 3 champions)
  const mobileFilterOptions = [
    { key: "tops", label: others?.top4 || "Top 4%" },
    { key: "wins", label: others?.winPercentage || "Win %" },
    { key: "pickRate", label: others?.pickPercentage || "Pick %" },
    { key: "plays", label: others?.played || "Played" },
  ];

  useEffect(() => {
    let sortedData = [...metaDeckTraitStats];
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
    setMetaDeckTraitStatsData(sortedData);
  }, [metaDeckTraitStats, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
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
  const { traits } = data?.refs;
  const { forces } = data?.refs;

  const handleButtonClick = (button) => {
    if (button === "All") {
      setMetaDeckTraitStatsData(metaDeckTraitStats);
    } else {
      setMetaDeckTraitStatsData(
        metaDeckTraitStats.filter(
          (trait) => trait.tier.toLowerCase() === button.toLowerCase()
        )
      );
    }
  };

  useEffect(() => {
    if (searchValue) {
      setMetaDeckTraitStatsData(
        metaDeckTraitStats.filter((trait) =>
          trait.key.toLowerCase().includes(searchValue.toLowerCase())
        )
      );
    } else {
      setMetaDeckTraitStatsData(metaDeckTraitStats);
    }
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

  // Function to get the tier-specific image URL for a trait
  const getTraitTier = (traitKey, traitTier) => {
    const trait = traits?.find((t) => t?.key === traitKey);
    if (!trait) return null;

    const tierData = trait.tiers?.find(
      (t) => t.tier.toLowerCase() === traitTier.toLowerCase()
    );
    return tierData || trait;
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
      <div className="grid grid-cols-3 gap-3 p-4 bg-[#1a1a1a] border-t border-[#2D2F37] text-center">
        {filteredData.map((data, index) => (
          <div key={index} className="flex flex-col">
            <span className="text-xs text-gray-400 mb-1">{data.label}</span>
            <span className="text-sm text-white">{data.value}</span>
          </div>
        ))}
        {/* Top 3 Champions */}
        <div className="col-span-3 flex flex-col mt-2">
          {/* <span className="text-xs text-gray-400 mb-2">
            {others?.top3} {others?.champions}
          </span> */}
          <div className="flex mx-auto flex-wrap gap-3">
            {item?.traitChampionStats?.slice(0, 3)?.map((champion, idx) => (
              <div key={idx}>
                <CardImage
                  src={champions?.find((champ) => champ?.key === champion)}
                  imgStyle="w-12"
                  identificationImageStyle="w-1"
                  textStyle="text-[6px]"
                  forces={forces}
                  cardSize="!w-16 !h-16"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="pt-2 bg-[#111111] md:bg-transparent w-full">
        {/* Header section with filters and search */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-[#111111] md:bg-transparent px-2 sm:px-4 mb-2.5 md:mb-0">
          <div className="w-full sm:w-auto sm:mb-0 overflow-x-auto sm:overflow-visible">
            <TrendFilters
              buttons={["All", "Bronze", "Silver", "Gold", "Prismatic"]}
              onButtonClick={handleButtonClick}
            />
          </div>
          {/* Mobile Filter Buttons - Only visible on mobile */}
          <div className="block md:hidden mb-2">
            <div className="flex justify-center items-center gap-2 px-4">
              <div className="flex gap-0">
                {mobileFilterOptions.map((option, index) => {
                  const isFirst = index === 0;
                  const isLast = index === mobileFilterOptions.length - 1;
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
              placeholder="Search trait..."
            />
          </div>
        </div>

        {/* Table section */}
        <div className="projects-row overflow-auto">
          {/* Desktop Table - Hidden on mobile */}
          <div className="hidden md:block">
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
                      <p className="p-0 text-sm sm:text-base my-auto md:text-[16px] text-left flex items-center ml-[18px]">
                        {others.traits}
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
                        {others.played}
                        <span className="ml-2">{renderSortIcon("plays")}</span>
                      </p>
                    </th>
                    <th className="p-2 font-semibold border-b border-[#2D2F37] text-center">
                      {others.top3} {others.champions}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[#111111]">
                  {metaDeckTraitStatsData.map((metaTrait, index) => (
                    <tr
                      className={`hover:bg-[#2D2F37] transition-colors duration-200 border-b border-[#2D2F37]`}
                      key={index}
                    >
                      <td className="p-2 text-center">
                        <div className="text-center text-base">{index + 1}</div>
                      </td>
                      <td className={`p-2 py-2 ${getCellClass("key")}`}>
                        <div>
                          <div className="flex justify-start items-center gap-2">
                            <TraitImage
                              trait={getTraitTier(
                                metaTrait?.key,
                                metaTrait?.tier
                              )}
                              size="large"
                              borderRadius="rounded-[4px]"
                              backgroundRadius="rounded-[4px]"
                              tooltipId={metaTrait?.key}
                              showTooltip={true}
                            />
                            <div>
                              <p className="p-0 text-base sm:text-lg md:text-xl text-[#fff] mb-0 truncate max-w-[120px] sm:max-w-full">
                                {
                                  traits?.find(
                                    (trait) => trait?.key === metaTrait?.key
                                  )?.name
                                }
                              </p>
                              <p className="m-0 text-xs font-extralight">
                                {/* Commented code removed for brevity */}
                              </p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className={`p-2 ${getCellClass("avgPlacement")}`}>
                        <p className="p-0 text-left text-base sm:text-base md:text-lg mb-0 text-[#fff]">
                          <ColoredValue
                            value={metaTrait?.avgPlacement}
                            prefix="#"
                          />
                        </p>
                      </td>
                      <td className={`p-2 ${getCellClass("tops")}`}>
                        <p className="p-0 text-left text-base sm:text-base md:text-lg mb-0 text-[#fff]">
                          {((metaTrait?.tops * 100) / metaTrait?.plays).toFixed(
                            2
                          )}
                          %
                        </p>
                      </td>
                      <td className={`p-2 ${getCellClass("wins")}`}>
                        <p className="p-0 text-left text-base sm:text-base md:text-lg mb-0 text-[#fff]">
                          {((metaTrait?.wins * 100) / metaTrait?.plays).toFixed(
                            2
                          )}
                          %
                        </p>
                      </td>
                      <td className={`p-2 ${getCellClass("pickRate")}`}>
                        <p className="p-0 text-left text-base sm:text-base md:text-lg mb-0 text-[#fff]">
                          {(metaTrait?.pickRate * 100).toFixed(2)}%
                        </p>
                      </td>
                      <td className={`p-2 ${getCellClass("plays")}`}>
                        <p className="p-0 text-left text-base sm:text-base md:text-lg mb-0 text-[#fff]">
                          {metaTrait?.plays.toLocaleString("en-US")}
                        </p>
                      </td>
                      <td className="p-2">
                        <div className="flex flex-wrap justify-center items-center gap-1 md:gap-2">
                          {metaTrait?.traitChampionStats
                            ?.slice(0, 3)
                            ?.map((champion, idx) => (
                              <div key={idx}>
                                <CardImage
                                  src={champions?.find(
                                    (champ) => champ?.key === champion
                                  )}
                                  imgStyle="md:w-[64px]"
                                  identificationImageStyle="w-[12px] sm:w-[16px] md:w-[32px]"
                                  textStyle="text-[8px] sm:text-[10px] md:text-[12px]"
                                  forces={forces}
                                  cardSize="md:!w-[64px] md:!h-[64px]"
                                />
                              </div>
                            ))}
                        </div>
                      </td>
                    </tr>
                  ))}
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
                  Trait
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
              {metaDeckTraitStatsData.map((metaTrait, index) => (
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
                      <TraitImage
                        trait={getTraitTier(metaTrait?.key, metaTrait?.tier)}
                        size="medium"
                        borderRadius="rounded-[4px]"
                        backgroundRadius="rounded-[4px]"
                        tooltipId={metaTrait?.key}
                        showTooltip={true}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-white text-sm truncate leading-tight mb-0">
                          {
                            traits?.find(
                              (trait) => trait?.key === metaTrait?.key
                            )?.name
                          }
                        </p>
                      </div>
                    </div>

                    {/* Avg Rank */}
                    <div className="text-center text-white text-base">
                      <ColoredValue
                        value={metaTrait?.avgPlacement}
                        prefix="#"
                      />
                    </div>

                    {/* Selected Filter Value */}
                    <div
                      className={`text-center text-base ${mobileFilter === sortConfig.key ? "text-[#D9A876] font-medium" : "text-white"} flex items-center justify-center space-x-1`}
                    >
                      <span>{renderMobileValue(metaTrait, mobileFilter)}</span>
                      {expandedRows.has(index) ? (
                        <HiChevronUp className="w-4 h-4" />
                      ) : (
                        <HiChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {expandedRows.has(index) && renderExpandedContent(metaTrait)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectItems;

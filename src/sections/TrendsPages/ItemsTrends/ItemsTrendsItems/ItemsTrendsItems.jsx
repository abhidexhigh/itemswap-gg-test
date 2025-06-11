import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../../../../../i18n";
import "react-tooltip/dist/react-tooltip.css";
import TrendFilters from "src/components/trendFilters";
import {
  HiArrowSmUp,
  HiArrowSmDown,
  HiChevronDown,
  HiChevronUp,
} from "react-icons/hi";
import metaDeckItemStats from "../../../../data/newData/metaDeckItems.json";
import Comps from "../../../../data/compsNew.json";
import ReactTltp from "src/components/tooltip/ReactTltp";
import CardImage from "src/components/cardImage";
import ScrollableTable from "src/utils/ScrollableTable";
import { OptimizedImage } from "../../../../utils/imageOptimizer";
import SearchBar from "src/components/searchBar";
import ColoredValue from "src/components/ColoredValue";
import ItemDisplay from "src/components/item/ItemDisplay";

const ItemsTrendsItems = () => {
  const { t } = useTranslation();
  const others = t("others");
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

  const [metaDeckItemStatsData, setMetaDeckItemStatsData] =
    useState(metaDeckItemStats);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [searchValue, setSearchValue] = useState("");
  const [mobileFilter, setMobileFilter] = useState("tops");
  const [expandedRows, setExpandedRows] = useState(new Set());

  // Mobile filter options (excluding serial no, image, name, avg rank, synergy items, top champions)
  const mobileFilterOptions = [
    { key: "tops", label: others?.top4 || "Top 4%" },
    { key: "wins", label: others?.winPercentage || "Win %" },
    { key: "pickRate", label: others?.pickPercentage || "Pick %" },
    { key: "plays", label: others?.played || "Played" },
  ];

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

  useEffect(() => {
    let sortedData = [...metaDeckItemStats];
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
    setMetaDeckItemStatsData(sortedData);
  }, [metaDeckItemStats, sortConfig]);

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
      <div className="p-4 bg-[#1a1a1a] border-t border-[#2D2F37]">
        <div className="grid grid-cols-3 gap-3 mb-4">
          {filteredData.map((data, index) => (
            <div key={index} className="flex flex-col">
              <span className="text-xs text-gray-400 mb-1">{data.label}</span>
              <span className="text-sm text-white">{data.value}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center">
          {/* Synergy Items */}
          <div className="">
            <span className="text-xs text-gray-400 mb-2 block">
              {others?.synergy} {others?.items}
            </span>
            <div className="flex flex-wrap gap-1">
              {item?.itemSynergyStats?.slice(0, 3).map((synergy, w) => (
                <div key={w} className="relative">
                  <ItemDisplay
                    item={items.find((i) => i.key === synergy)}
                    size="small"
                    borderRadius="rounded-[4px]"
                    backgroundRadius="rounded-[4px]"
                    showTooltip={false}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Top Champions */}
          <div>
            <span className="text-xs text-gray-400 mb-2 block">
              {others?.top3} {others?.champions}
            </span>
            <div className="flex flex-wrap gap-1">
              {item?.itemChampionStats?.slice(0, 3).map((champion, x) => (
                <div key={x} className="flex-shrink-0">
                  <CardImage
                    src={{
                      ...champions.find((champ) => champ.key === champion),
                    }}
                    imgStyle="w-12"
                    identificationImageStyle="w-1"
                    textStyle="text-[6px]"
                    forces={forces}
                    cardSize="!w-12 !h-12"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleButtonClick = (button) => {
    if (button === "All") {
      setMetaDeckItemStatsData(metaDeckItemStats);
    } else {
      setMetaDeckItemStatsData(
        metaDeckItemStats.filter((item) =>
          items
            .find((i) => i.key === item.key)
            ?.tags?.includes(button.toLowerCase())
        )
      );
    }
  };

  useEffect(() => {
    setMetaDeckItemStatsData(
      metaDeckItemStats.filter((item) =>
        items
          .find((i) => i.key === item.key)
          ?.name?.toLowerCase()
          .includes(searchValue.toLowerCase())
      )
    );
  }, [searchValue]);

  return (
    <>
      <div className="pt-2 bg-[#111111] md:bg-transparent w-full">
        {/* Header section with filters and search */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-[#111111] md:bg-transparent px-2 sm:px-4 mb-2.5 md:mb-0">
          <div className="w-full sm:w-auto sm:mb-0">
            <TrendFilters
              buttons={["All", "Normal"]}
              onButtonClick={handleButtonClick}
            />
          </div>
          {/* Mobile Filter Buttons - Only visible on mobile */}
          <div className="block md:hidden mb-2">
            <div className="flex flex-col items-center gap-2 px-4">
              {/* Single Row - All 4 buttons */}
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
              placeholder="Search item..."
            />
          </div>
        </div>

        {/* Table section */}
        <div className="projects-row">
          {/* Desktop Table - Hidden on mobile */}
          <div className="hidden md:block overflow-auto">
            <ScrollableTable>
              <table className="w-full min-w-[1100px] relative border-collapse">
                <thead className="sticky top-0 z-50">
                  <tr className="bg-[#000000]">
                    <th className="p-2 font-semibold w-[50px] text-center border-b border-[#2D2F37]">
                      <p className="p-0 text-sm sm:text-base md:text-[16px] mb-0 py-2">
                        {others.rank}
                      </p>
                    </th>
                    <th
                      className={`cursor-pointer p-2 font-semibold min-w-[200px] sm:min-w-[220px] md:min-w-[280px] border-b border-[#2D2F37] ${sortConfig?.key === "key" ? "bg-[#2D2F37]" : ""}`}
                      onClick={() => requestSort("key")}
                    >
                      <p className="p-0 text-sm sm:text-base my-auto md:text-[16px] text-left flex items-center">
                        {others.items}
                        <span className="ml-2">{renderSortIcon("key")}</span>
                      </p>
                    </th>
                    <th
                      className={`cursor-pointer p-2 font-semibold min-w-[80px] sm:min-w-[90px] border-b border-[#2D2F37] ${sortConfig?.key === "avgPlacement" ? "bg-[#2D2F37]" : ""}`}
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
                      className={`cursor-pointer p-2 font-semibold min-w-[80px] sm:min-w-[90px] border-b border-[#2D2F37] ${sortConfig?.key === "tops" ? "bg-[#2D2F37]" : ""}`}
                      onClick={() => requestSort("tops")}
                    >
                      <p className="p-0 text-sm sm:text-base my-auto md:text-[16px] text-left flex items-center">
                        {others.top4}
                        <span className="ml-2">{renderSortIcon("tops")}</span>
                      </p>
                    </th>
                    <th
                      className={`cursor-pointer p-2 font-semibold min-w-[80px] sm:min-w-[90px] border-b border-[#2D2F37] ${sortConfig?.key === "wins" ? "bg-[#2D2F37]" : ""}`}
                      onClick={() => requestSort("wins")}
                    >
                      <p className="p-0 text-sm sm:text-base my-auto md:text-[16px] text-left flex items-center">
                        {others.winPercentage}
                        <span className="ml-2">{renderSortIcon("wins")}</span>
                      </p>
                    </th>
                    <th
                      className={`cursor-pointer p-2 font-semibold min-w-[80px] sm:min-w-[90px] border-b border-[#2D2F37] ${sortConfig?.key === "pickRate" ? "bg-[#2D2F37]" : ""}`}
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
                      className={`cursor-pointer p-2 font-semibold min-w-[80px] sm:min-w-[90px] border-b border-[#2D2F37] ${sortConfig?.key === "plays" ? "bg-[#2D2F37]" : ""}`}
                      onClick={() => requestSort("plays")}
                    >
                      <p className="p-0 text-sm sm:text-base my-auto md:text-[16px] text-left flex items-center">
                        {others.played}
                        <span className="ml-2">{renderSortIcon("plays")}</span>
                      </p>
                    </th>
                    <th className="p-2 font-semibold min-w-[120px] border-b border-[#2D2F37]">
                      <p className="p-0 text-sm sm:text-base md:text-[16px] mb-0 text-center">
                        {others.synergy} {others.items}
                      </p>
                    </th>
                    <th className="p-2 font-semibold min-w-[140px] border-b border-[#2D2F37]">
                      <p className="p-0 text-sm sm:text-base md:text-[16px] text-center mb-0">
                        {others.top3} {others.champions}
                      </p>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[#111111]">
                  {metaDeckItemStatsData.map(
                    (item, index) =>
                      items.find((i) => i.key === item.key)?.key && (
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
                              <div className="flex justify-start items-center space-x-1 sm:space-x-2">
                                <div
                                  data-tooltip-id={`${items.find((i) => i.key === item.key)?.key}}`}
                                >
                                  <ItemDisplay
                                    item={items.find((i) => i.key === item.key)}
                                    size="midMedium"
                                    borderRadius="rounded-[4px]"
                                    backgroundRadius="rounded-[4px]"
                                    tooltipId={`${items.find((i) => i.key === item.key)?.key}}`}
                                    showTooltip={true}
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="p-0 text-sm sm:text-sm md:text-base mb-1 md:mb-2 text-[#fff] truncate max-w-[90px] sm:max-w-[150px] md:max-w-full">
                                    {
                                      items.find((i) => i.key === item.key)
                                        ?.name
                                    }
                                  </p>
                                  <div className="flex items-center flex-wrap gap-1">
                                    {items
                                      .find((i) => i.key === item.key)
                                      ?.compositions?.map((comp, index) => (
                                        <React.Fragment key={index}>
                                          <OptimizedImage
                                            alt="Item Image"
                                            width={80}
                                            height={80}
                                            src={
                                              items.find((i) => i.key === comp)
                                                .imageUrl
                                            }
                                            className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 !border !border-[#ffffff60] rounded-md"
                                            data-tooltip-id={`${items.find((i) => i.key === comp).key}_${index}`}
                                          />
                                          {index === 0 && (
                                            <span className="mx-1">+</span>
                                          )}
                                          <ReactTltp
                                            variant="item"
                                            id={`${items.find((i) => i.key === comp).key}_${index}`}
                                            content={items.find(
                                              (i) => i.key === comp
                                            )}
                                          />
                                        </React.Fragment>
                                      ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className={`p-2 ${getCellClass("avgPlacement")}`}>
                            <p className="p-0 text-sm sm:text-base md:text-[16px] mb-0 text-[#fff] whitespace-nowrap">
                              <ColoredValue
                                value={item?.avgPlacement}
                                prefix="#"
                              />
                            </p>
                          </td>
                          <td className={`p-2 ${getCellClass("tops")}`}>
                            <p className="p-0 text-base sm:text-base md:text-[16px] mb-0 text-[#fff]">
                              {((item?.tops * 100) / item?.plays).toFixed(2)}%
                            </p>
                          </td>
                          <td className={`p-2 ${getCellClass("wins")}`}>
                            <p className="p-0 text-base sm:text-base md:text-[16px] mb-0 text-[#fff]">
                              {((item?.wins * 100) / item?.plays).toFixed(2)}%
                            </p>
                          </td>
                          <td className={`p-2 ${getCellClass("pickRate")}`}>
                            <p className="p-0 text-base sm:text-base md:text-[16px] mb-0 text-[#fff]">
                              {(item?.pickRate * 100).toFixed(2)}%
                            </p>
                          </td>
                          <td className={`p-2 ${getCellClass("plays")}`}>
                            <p className="p-0 text-base sm:text-base md:text-[16px] mb-0 text-[#fff]">
                              {item?.plays.toLocaleString("en-US")}
                            </p>
                          </td>
                          <td className="p-2">
                            <div className="flex flex-wrap justify-center items-center gap-1">
                              {item?.itemSynergyStats
                                ?.slice(0, 3)
                                .map((synergy, w) => (
                                  <div key={w} className="relative">
                                    <ItemDisplay
                                      item={items.find(
                                        (i) => i.key === synergy
                                      )}
                                      size="xSmall"
                                      borderRadius="rounded-[4px]"
                                      backgroundRadius="rounded-[4px]"
                                      tooltipId={`${items.find((i) => i.key === synergy)?.key}_${w}`}
                                      showTooltip={true}
                                    />
                                  </div>
                                ))}
                            </div>
                          </td>
                          <td className="p-2">
                            <div className="flex flex-nowrap justify-center items-center gap-1 md:gap-2 overflow-x-auto">
                              {item?.itemChampionStats
                                ?.slice(0, 3)
                                .map((champion, x) => (
                                  <div key={x} className="flex-shrink-0">
                                    <CardImage
                                      src={{
                                        ...champions.find(
                                          (champ) => champ.key === champion
                                        ),
                                      }}
                                      imgStyle="w-[32px] md:w-[64px]"
                                      identificationImageStyle="w-[10px] sm:w-[12px] md:w-[16px] lg:w-[32px]"
                                      textStyle="text-[6px] sm:text-[8px] md:text-[10px] lg:text-[16px]"
                                      forces={forces}
                                      cardSize="!w-[72px] !h-[72px] md:!w-[64px] md:!h-[64px]"
                                    />
                                  </div>
                                ))}
                            </div>
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
                  Item
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
              {metaDeckItemStatsData.map(
                (item, index) =>
                  items.find((i) => i.key === item.key)?.key && (
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
                          <ItemDisplay
                            item={items.find((i) => i.key === item.key)}
                            size="midMedium"
                            borderRadius="rounded-[4px]"
                            backgroundRadius="rounded-[4px]"
                            showTooltip={true}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-white text-xs truncate leading-tight">
                              {items.find((i) => i.key === item.key)?.name}
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

export default ItemsTrendsItems;

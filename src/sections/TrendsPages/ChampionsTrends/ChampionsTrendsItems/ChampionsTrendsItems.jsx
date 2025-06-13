import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
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

// Virtual scrolling hook for page scroll
const usePageVirtualScroll = (items, itemHeight, buffer = 5) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerTop, setContainerTop] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const updateScrollTop = () => {
      setScrollTop(window.pageYOffset);
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerTop(window.pageYOffset + rect.top);
      }
    };

    const handleScroll = () => {
      requestAnimationFrame(updateScrollTop);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateScrollTop();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const relativeScrollTop = Math.max(0, scrollTop - containerTop);
  const viewportHeight = window.innerHeight || 800;

  const startIndex = Math.max(
    0,
    Math.floor(relativeScrollTop / itemHeight) - buffer
  );
  const visibleCount = Math.ceil(viewportHeight / itemHeight) + buffer * 2;
  const endIndex = Math.min(startIndex + visibleCount, items.length);

  const visibleItems = items.slice(startIndex, endIndex);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  return {
    visibleItems,
    totalHeight,
    offsetY,
    startIndex,
    endIndex,
    containerRef,
  };
};

// Memoized row component
const GridRow = React.memo(
  ({
    champion,
    index,
    championData,
    recommendedItems,
    forces,
    getCellClass,
  }) => {
    return (
      <div
        className="grid bg-[#111111] hover:bg-[#2D2F37] transition-colors duration-200 border-b border-[#2D2F37]"
        style={{
          gridTemplateColumns:
            "60px 2fr 120px 100px 100px 100px 120px 120px 120px 200px",
          height: "100px", // Fixed height for virtual scrolling
        }}
      >
        <div
          className={`p-2 text-center flex items-center justify-center ${getCellClass("")}`}
        >
          <div className="text-center text-white">{index + 1}</div>
        </div>
        <div className={`p-2 flex items-center ${getCellClass("key")}`}>
          <div className="flex justify-start items-center">
            <CardImage
              src={championData}
              imgStyle="w-[60px] h-[60px]"
              identificationImageStyle="w-[16px] h-[16px]"
              textStyle="text-[10px] hidden"
              forces={forces}
              cardSize="!w-[60px] !h-[60px]"
            />
            <p className="p-0 text-left text-base md:text-lg mb-0 ml-2 text-[#fff] truncate">
              {championData.key}
            </p>
          </div>
        </div>
        <div
          className={`p-2 flex items-center ${getCellClass("avgPlacement")}`}
        >
          <p className="p-0 text-left text-base md:text-lg mb-0">
            <ColoredValue value={champion?.avgPlacement} prefix="#" />
          </p>
        </div>
        <div className={`p-2 flex items-center ${getCellClass("tops")}`}>
          <p className="p-0 text-left text-base md:text-lg mb-0 text-[#fff]">
            {((champion?.tops * 100) / champion?.plays).toFixed(2)}%
          </p>
        </div>
        <div className={`p-2 flex items-center ${getCellClass("wins")}`}>
          <p className="p-0 text-left text-base md:text-lg mb-0 text-[#fff]">
            {((champion?.wins * 100) / champion?.plays).toFixed(2)}%
          </p>
        </div>
        <div className={`p-2 flex items-center ${getCellClass("pickRate")}`}>
          <p className="p-0 text-left text-base md:text-lg mb-0 text-[#fff]">
            {(champion?.pickRate * 100).toFixed(2)}%
          </p>
        </div>
        <div className={`p-2 flex items-center ${getCellClass("plays")}`}>
          <p className="p-0 text-left text-base md:text-lg mb-0 text-[#fff]">
            {champion?.plays.toLocaleString("en-US")}
          </p>
        </div>
        <div className="p-2 flex items-center">
          <p className="p-0 text-left text-base md:text-lg mb-0 text-[#fff]">
            {(champion?.threeStarPercentage * 100).toFixed(2)}%
          </p>
        </div>
        <div className="p-2 flex items-center">
          <p className="p-0 text-left text-base md:text-lg mb-0 text-[#fff]">
            #{champion?.threeStarRank.toFixed(2)}
          </p>
        </div>
        <div className="p-2 flex items-center justify-center">
          <div className="flex justify-center items-center gap-1">
            {recommendedItems.slice(0, 4).map((item, itemIndex) => (
              <div
                key={itemIndex}
                className="relative aspect-square rounded-lg"
              >
                <ItemDisplay
                  item={item}
                  size="xSmall"
                  borderRadius="rounded-[4px]"
                  backgroundRadius="rounded-[4px]"
                  tooltipId={item?.name}
                  showTooltip={true}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

GridRow.displayName = "GridRow";

const ProjectItems = () => {
  const { t } = useTranslation();
  const others = t("others");
  const scrollContainerRef = useRef(null);

  // Pre-process data once
  const {
    props: {
      pageProps: {
        dehydratedState: {
          queries: { data },
        },
      },
    },
  } = Comps;

  const { champions, items, forces } = data?.refs || {};

  // Memoize lookup map and merged data
  const { championLookup, mergedData } = useMemo(() => {
    const lookup = new Map(
      champions?.map((champion) => [champion.key, champion]) || []
    );
    const merged = metaDeckChampionsStats.map((champion) => ({
      ...champion,
      ...(lookup.get(champion.key) || {}),
    }));
    return { championLookup: lookup, mergedData: merged };
  }, [champions]);

  const [filteredData, setFilteredData] = useState(mergedData);
  const [searchValue, setSearchValue] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [mobileFilter, setMobileFilter] = useState("tops");
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [costFilter, setCostFilter] = useState("All");

  // Mobile filter options
  const mobileFilterOptions = useMemo(
    () => [
      { key: "tops", label: others?.top4 || "Top 4%" },
      { key: "wins", label: others?.winPercentage || "Win %" },
      { key: "pickRate", label: others?.pickPercentage || "Pick %" },
      { key: "plays", label: others?.played || "Played" },
      {
        key: "threeStarPercentage",
        label: others?.threeStarsPercentage || "3-Stars%",
      },
      { key: "threeStarRank", label: others?.threeStarsRank || "3-Stars Rank" },
    ],
    [others]
  );

  // Memoize sorted and filtered data with debouncing
  const processedData = useMemo(() => {
    let data = [...mergedData];

    // Apply cost filter
    if (costFilter !== "All") {
      data = data.filter((champion) => champion.cost == costFilter);
    }

    // Apply search filter
    if (searchValue) {
      const searchLower = searchValue.toLowerCase();
      data = data.filter((champion) =>
        champion.key.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      data.sort((a, b) => {
        let aValue, bValue;

        if (["firstPick", "secondPick", "thirdPick"].includes(sortConfig.key)) {
          const index =
            sortConfig.key === "firstPick"
              ? 0
              : sortConfig.key === "secondPick"
                ? 1
                : 2;
          aValue = a.augmentRoundStats?.[index]?.avgPlacement || 0;
          bValue = b.augmentRoundStats?.[index]?.avgPlacement || 0;
        } else if (["tops", "wins"].includes(sortConfig.key)) {
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

    return data;
  }, [mergedData, costFilter, searchValue, sortConfig]);

  // Update filtered data when processed data changes
  useEffect(() => {
    setFilteredData(processedData);
  }, [processedData]);

  // Memoize recommended items for each champion
  const championRecommendedItems = useMemo(() => {
    const itemsMap = new Map();
    champions?.forEach((champion) => {
      if (champion.recommendItems) {
        const recommendedItems = champion.recommendItems
          .map((itemKey) => {
            const key = itemKey?.split("_")[itemKey?.split("_").length - 1];
            return items?.find((item) => item.key === key);
          })
          .filter(Boolean);
        itemsMap.set(champion.key, recommendedItems);
      }
    });
    return itemsMap;
  }, [champions, items]);

  // Virtual scrolling setup with page scroll
  const itemHeight = 100; // Fixed item height

  const { visibleItems, totalHeight, offsetY, startIndex, containerRef } =
    usePageVirtualScroll(filteredData, itemHeight);

  const requestSort = useCallback((key) => {
    setSortConfig((prev) => {
      let direction = "ascending";
      if (prev.key === key && prev.direction === "ascending") {
        direction = "descending";
      }
      return { key, direction };
    });
  }, []);

  const handleMobileFilterClick = useCallback(
    (filterKey) => {
      setMobileFilter((prev) => {
        if (prev === filterKey && sortConfig.key === filterKey) {
          const newDirection =
            sortConfig.direction === "ascending" ? "descending" : "ascending";
          setSortConfig({ key: filterKey, direction: newDirection });
          return prev;
        } else {
          setSortConfig({ key: filterKey, direction: "descending" });
          return filterKey;
        }
      });
    },
    [sortConfig]
  );

  const toggleRowExpansion = useCallback((index) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  }, []);

  const renderMobileValue = useCallback((item, key) => {
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
  }, []);

  const renderExpandedContent = useCallback(
    (item) => {
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

      const filteredDataHidden = hiddenData.filter(
        (data) => data.key !== mobileFilter
      );
      const recommendedItems = championRecommendedItems.get(item.key) || [];

      return (
        <div className="grid grid-cols-3 gap-3 p-4 bg-[#1a1a1a] border-t border-[#2D2F37]">
          {filteredDataHidden.map((data, index) => (
            <div key={index} className="flex flex-col">
              <span className="text-xs text-gray-400 mb-1">{data.label}</span>
              <span className="text-sm text-white">{data.value}</span>
            </div>
          ))}
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 mb-2">
              {others?.recommended} {others?.items}
            </span>
            <div className="flex flex-wrap justify-start gap-1">
              {recommendedItems.slice(0, 6).map((itemImg, idx) => (
                <div key={idx} className="relative">
                  <ItemDisplay
                    item={itemImg}
                    size="xSmall"
                    borderRadius="rounded-[4px]"
                    backgroundRadius="rounded-[4px]"
                    showTooltip={false}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    },
    [mobileFilter, championRecommendedItems, others]
  );

  const handleButtonClick = useCallback((button) => {
    setCostFilter(button);
  }, []);

  const handleSearchChange = useCallback((value) => {
    setSearchValue(value);
  }, []);

  const getCellClass = useCallback(
    (key) => {
      if (sortConfig.key === key) {
        return "bg-[#2D2F37] text-[#D9A876]";
      }
      return "";
    },
    [sortConfig.key]
  );

  const renderSortIcon = useCallback(
    (key) => {
      if (sortConfig.key === key) {
        return sortConfig.direction === "ascending" ? (
          <HiArrowSmUp className="text-lg" />
        ) : (
          <HiArrowSmDown className="text-lg" />
        );
      }
      return null;
    },
    [sortConfig]
  );

  // Handle scroll events for virtual scrolling - removed since we use page scroll

  // Memoize mobile table rows (no virtual scrolling for mobile due to complexity)
  const mobileTableRows = useMemo(() => {
    return filteredData
      .map((champion, index) => {
        const championData = championLookup.get(champion.key);
        if (!championData?.key) return null;

        return (
          <div key={champion.key} className="border-b border-[#2D2F37]">
            <div
              className="grid gap-1 p-3 items-center cursor-pointer hover:bg-[#2D2F37] transition-colors duration-200"
              style={{ gridTemplateColumns: "10% 45% 20% 22%" }}
              onClick={() => toggleRowExpansion(index)}
            >
              <div className="text-center text-white font-medium">
                {index + 1}
              </div>
              <div className="flex items-center space-x-2 min-w-0">
                <CardImage
                  src={championData}
                  imgStyle="w-12 h-12"
                  identificationImageStyle="w-3 h-3"
                  textStyle="text-[8px] hidden"
                  forces={forces}
                  cardSize="!w-12 !h-12"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-white text-sm truncate leading-tight mb-0">
                    {championData.key}
                  </p>
                </div>
              </div>
              <div className="text-center text-white text-sm">
                <ColoredValue value={champion?.avgPlacement} prefix="#" />
              </div>
              <div
                className={`text-center text-sm ${
                  mobileFilter === sortConfig.key
                    ? "text-[#D9A876] font-medium"
                    : "text-white"
                } flex items-center justify-center space-x-1`}
              >
                <span>{renderMobileValue(champion, mobileFilter)}</span>
                {expandedRows.has(index) ? (
                  <HiChevronUp className="w-3 h-3" />
                ) : (
                  <HiChevronDown className="w-3 h-3" />
                )}
              </div>
            </div>
            {expandedRows.has(index) && renderExpandedContent(champion)}
          </div>
        );
      })
      .filter(Boolean);
  }, [
    filteredData,
    championLookup,
    forces,
    mobileFilter,
    sortConfig.key,
    expandedRows,
    toggleRowExpansion,
    renderMobileValue,
    renderExpandedContent,
  ]);

  return (
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

        {/* Mobile Filter Buttons */}
        <div className="block md:hidden mb-2">
          <div className="flex flex-col items-center gap-2 px-4">
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

            <div className="flex gap-0">
              {mobileFilterOptions.slice(4).map((option, index) => {
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
            setSearchValue={handleSearchChange}
            placeholder="Search champion..."
          />
        </div>
      </div>

      <div className="projects-row">
        {/* Desktop Grid - Hidden on mobile with Virtual Scrolling */}
        <div className="hidden md:block">
          <div className="w-full">
            {/* Grid Header - Sticky */}
            <div
              className="grid bg-[#000000] sticky top-[113px] z-50 border-b border-[#2D2F37]"
              style={{
                gridTemplateColumns:
                  "60px 2fr 120px 100px 100px 100px 120px 120px 120px 200px",
              }}
            >
              <div className="p-2 font-semibold text-center text-white">
                <p className="p-0 text-base md:text-[16px] mb-0 py-2">
                  {others?.rank}
                </p>
              </div>
              <div
                className={`cursor-pointer p-2 font-semibold text-white ${
                  sortConfig?.key === "key" ? "bg-[#2D2F37]" : ""
                }`}
                onClick={() => requestSort("key")}
              >
                <p className="p-0 text-sm sm:text-base my-auto md:text-[16px] text-left flex items-center py-2">
                  {others?.champions}
                  <span className="ml-2">{renderSortIcon("key")}</span>
                </p>
              </div>
              <div
                className={`cursor-pointer p-2 font-semibold text-white ${
                  sortConfig?.key === "avgPlacement" ? "bg-[#2D2F37]" : ""
                }`}
                onClick={() => requestSort("avgPlacement")}
              >
                <p className="p-0 text-sm sm:text-base my-auto md:text-[16px] text-left flex items-center py-2">
                  {others?.avgRank}
                  <span className="ml-2">{renderSortIcon("avgPlacement")}</span>
                </p>
              </div>
              <div
                className={`cursor-pointer p-2 font-semibold text-white ${
                  sortConfig?.key === "tops" ? "bg-[#2D2F37]" : ""
                }`}
                onClick={() => requestSort("tops")}
              >
                <p className="p-0 text-sm sm:text-base my-auto md:text-[16px] text-left flex items-center py-2">
                  {others?.top4}
                  <span className="ml-2">{renderSortIcon("tops")}</span>
                </p>
              </div>
              <div
                className={`cursor-pointer p-2 font-semibold text-white ${
                  sortConfig?.key === "wins" ? "bg-[#2D2F37]" : ""
                }`}
                onClick={() => requestSort("wins")}
              >
                <p className="p-0 text-sm sm:text-base my-auto md:text-[16px] text-left flex items-center py-2">
                  {others?.winPercentage}
                  <span className="ml-2">{renderSortIcon("wins")}</span>
                </p>
              </div>
              <div
                className={`cursor-pointer p-2 font-semibold text-white ${
                  sortConfig?.key === "pickRate" ? "bg-[#2D2F37]" : ""
                }`}
                onClick={() => requestSort("pickRate")}
              >
                <p className="p-0 text-sm sm:text-base my-auto md:text-[16px] text-left flex items-center py-2">
                  {others?.pickPercentage}
                  <span className="ml-2">{renderSortIcon("pickRate")}</span>
                </p>
              </div>
              <div
                className={`cursor-pointer p-2 font-semibold text-white ${
                  sortConfig?.key === "plays" ? "bg-[#2D2F37]" : ""
                }`}
                onClick={() => requestSort("plays")}
              >
                <p className="p-0 text-sm sm:text-base my-auto md:text-[16px] text-left flex items-center py-2">
                  {others?.played}
                  <span className="ml-2">{renderSortIcon("plays")}</span>
                </p>
              </div>
              <div className="p-2 font-semibold text-white">
                <p className="p-0 text-base my-auto md:text-[16px] text-left py-2">
                  {others?.threeStarsPercentage}
                </p>
              </div>
              <div className="p-2 font-semibold text-white">
                <p className="p-0 text-base my-auto md:text-[16px] text-left py-2">
                  {others?.threeStarsRank}
                </p>
              </div>
              <div className="p-2 font-semibold text-white">
                <p className="p-0 text-base my-auto md:text-[16px] text-center py-2">
                  {others?.recommended} {others?.items}
                </p>
              </div>
            </div>

            {/* Virtual Scrolling Container - Uses page scroll */}
            <div
              ref={containerRef}
              className="bg-[#111111]"
              style={{ height: `${totalHeight}px`, position: "relative" }}
            >
              <div style={{ transform: `translateY(${offsetY}px)` }}>
                {visibleItems.map((champion, visibleIndex) => {
                  const actualIndex = startIndex + visibleIndex;
                  const championData = championLookup.get(champion.key);
                  if (!championData?.key) return null;

                  const recommendedItems =
                    championRecommendedItems.get(champion.key) || [];

                  return (
                    <GridRow
                      key={champion.key}
                      champion={champion}
                      index={actualIndex}
                      championData={championData}
                      recommendedItems={recommendedItems}
                      forces={forces}
                      getCellClass={getCellClass}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Table - Only visible on mobile */}
        <div className="block md:hidden">
          <div className="bg-[#111111]">
            {/* Mobile Table Header - Sticky */}
            <div
              className="grid gap-1 p-3 bg-[#1a1a1a] text-white font-semibold text-sm border-b border-[#2D2F37] sticky top-[100px] z-50"
              style={{ gridTemplateColumns: "10% 45% 20% 22%" }}
            >
              <div className="text-center">#</div>
              <div
                className={`cursor-pointer flex items-center ${
                  sortConfig?.key === "key" ? "text-[#D9A876]" : ""
                }`}
                onClick={() => requestSort("key")}
              >
                Champion
                <span className="ml-1">{renderSortIcon("key")}</span>
              </div>
              <div
                className={`text-center cursor-pointer flex items-center justify-center ${
                  sortConfig?.key === "avgPlacement" ? "text-[#D9A876]" : ""
                }`}
                onClick={() => requestSort("avgPlacement")}
              >
                Avg Rank
                <span className="ml-1">{renderSortIcon("avgPlacement")}</span>
              </div>
              <div
                className={`text-center flex items-center justify-center ${
                  mobileFilter === sortConfig.key ? "text-[#D9A876]" : ""
                }`}
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

            {/* Mobile Table Body - Uses page scroll */}
            <div>{mobileTableRows}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectItems;

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
import TrendFilters from "src/components/trendFilters";
import {
  HiArrowSmUp,
  HiArrowSmDown,
  HiChevronDown,
  HiChevronUp,
} from "react-icons/hi";
import metaDeckItemStats from "../../../../data/newData/metaDeckItems.json";
import useCompsData from "../../../../hooks/useCompsData";
import Forces from "../../../../data/newData/force.json";
import ReactTltp from "src/components/tooltip/ReactTltp";
import CardImage from "src/components/cardImage";
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
  ({ item, index, synergyItems, championData, forces, getCellClass }) => {
    return (
      <div
        className="grid bg-[#111111] hover:bg-[#2D2F37] transition-colors duration-200 border-b border-[#2D2F37]"
        style={{
          gridTemplateColumns:
            "60px 1.5fr 120px 120px 120px 120px 120px 200px 240px",
          height: "100px", // Fixed height for virtual scrolling
        }}
      >
        <div
          className={`p-2 text-center flex items-center justify-center ${getCellClass("")}`}
        >
          <div className="text-center text-white">{index + 1}</div>
        </div>
        <div className={`p-2 flex items-center ${getCellClass("key")}`}>
          <div className="flex justify-start items-center space-x-1 sm:space-x-2">
            <div data-tooltip-id={`${item.itemData.key}}`}>
              <ItemDisplay
                item={item.itemData}
                size="midMedium"
                borderRadius="rounded-[4px]"
                backgroundRadius="rounded-[4px]"
                tooltipId={`${item.itemData.key}}`}
                showTooltip={true}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="p-0 text-sm sm:text-sm md:text-base mb-1 md:mb-2 text-[#fff] truncate">
                {item.itemData.name}
              </p>
              <div className="flex items-center flex-wrap gap-1">
                {item.compositionItems.map((compItem, compIndex) => (
                  <React.Fragment key={compIndex}>
                    <OptimizedImage
                      alt="Item Image"
                      width={80}
                      height={80}
                      src={compItem.imageUrl}
                      className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 !border !border-[#ffffff60] rounded-md"
                      data-tooltip-id={`${compItem.key}_${compIndex}`}
                    />
                    {compIndex === 0 && <span className="mx-1">+</span>}
                    <ReactTltp
                      variant="item"
                      id={`${compItem.key}_${compIndex}`}
                      content={compItem}
                    />
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div
          className={`p-2 flex items-center ${getCellClass("avgPlacement")}`}
        >
          <p className="p-0 text-left text-base md:text-lg mb-0">
            <ColoredValue value={item?.avgPlacement} prefix="#" />
          </p>
        </div>
        <div className={`p-2 flex items-center ${getCellClass("tops")}`}>
          <p className="p-0 text-left text-base md:text-lg mb-0 text-[#fff]">
            {((item?.tops * 100) / item?.plays).toFixed(2)}%
          </p>
        </div>
        <div className={`p-2 flex items-center ${getCellClass("wins")}`}>
          <p className="p-0 text-left text-base md:text-lg mb-0 text-[#fff]">
            {((item?.wins * 100) / item?.plays).toFixed(2)}%
          </p>
        </div>
        <div className={`p-2 flex items-center ${getCellClass("pickRate")}`}>
          <p className="p-0 text-left text-base md:text-lg mb-0 text-[#fff]">
            {(item?.pickRate * 100).toFixed(2)}%
          </p>
        </div>
        <div className={`p-2 flex items-center ${getCellClass("plays")}`}>
          <p className="p-0 text-left text-base md:text-lg mb-0 text-[#fff]">
            {item?.plays.toLocaleString("en-US")}
          </p>
        </div>
        <div className="p-2 flex items-center justify-center">
          <div className="flex flex-wrap justify-center items-center gap-1">
            {synergyItems.map((synergyItem, w) => (
              <div key={w} className="relative">
                <ItemDisplay
                  item={synergyItem}
                  size="xSmall"
                  borderRadius="rounded-[4px]"
                  backgroundRadius="rounded-[4px]"
                  tooltipId={`${synergyItem?.key}_${w}`}
                  showTooltip={true}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="p-2 flex items-center justify-center">
          <div className="flex flex-nowrap justify-center items-center gap-1 md:gap-2">
            {championData.map((champion, x) => (
              <div key={x} className="flex-shrink-0">
                <CardImage
                  src={champion}
                  imgStyle="w-[32px] md:w-[64px]"
                  identificationImageStyle="w-[10px] sm:w-[12px] md:w-[16px]"
                  textStyle="text-[6px] sm:text-[8px] md:text-[10px]"
                  forces={forces}
                  cardSize="!w-[64px] !h-[64px] md:!w-[64px] md:!h-[64px]"
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

  // Use the custom hook instead of direct JSON import
  const { champions, items, forces, isLoading, isError, error, refetch } =
    useCompsData();

  // All useState hooks must be called before any early returns
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [searchValue, setSearchValue] = useState("");
  const [mobileFilter, setMobileFilter] = useState("tops");
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [tagFilter, setTagFilter] = useState("All");

  // Memoize lookup maps and processed data - MUST be before early returns
  const { itemLookup, championLookup, processedItemData } = useMemo(() => {
    const itemMap = new Map(items?.map((item) => [item.key, item]) || []);
    const championMap = new Map(
      champions?.map((champion) => [champion.key, champion]) || []
    );

    // Pre-process items with their data
    const processedItems = metaDeckItemStats.map((itemStat) => {
      const itemData = itemMap.get(itemStat.key);
      return {
        ...itemStat,
        itemData,
        // Pre-compute synergy items
        synergyItems:
          itemStat.itemSynergyStats
            ?.slice(0, 3)
            .map((synergy) => itemMap.get(synergy))
            .filter(Boolean) || [],
        // Pre-compute champion data
        championData:
          itemStat.itemChampionStats
            ?.slice(0, 3)
            .map((champion) => championMap.get(champion))
            .filter(Boolean) || [],
        // Pre-compute composition items
        compositionItems:
          itemData?.compositions
            ?.map((comp) => itemMap.get(comp))
            .filter(Boolean) || [],
      };
    });

    return {
      itemLookup: itemMap,
      championLookup: championMap,
      processedItemData: processedItems,
    };
  }, [items, champions]);

  // Mobile filter options - MUST be before early returns
  const mobileFilterOptions = useMemo(
    () => [
      { key: "tops", label: others?.top4 || "Top 4%" },
      { key: "wins", label: others?.winPercentage || "Win %" },
      { key: "pickRate", label: others?.pickPercentage || "Pick %" },
      { key: "plays", label: others?.played || "Played" },
    ],
    [others]
  );

  // Memoize filtered and sorted data - MUST be before early returns
  const filteredData = useMemo(() => {
    let data = [...processedItemData];

    // Apply tag filter
    if (tagFilter !== "All") {
      data = data.filter((item) =>
        item.itemData?.tags?.includes(tagFilter.toLowerCase())
      );
    }

    // Apply search filter
    if (searchValue) {
      data = data.filter((item) =>
        item.itemData?.name?.toLowerCase().includes(searchValue.toLowerCase())
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
  }, [processedItemData, tagFilter, searchValue, sortConfig]);

  // Virtual scrolling setup with page scroll - MUST be before early returns
  const itemHeight = 120; // Fixed item height
  const { visibleItems, totalHeight, offsetY, startIndex, containerRef } =
    usePageVirtualScroll(filteredData, itemHeight);

  // Event handlers - memoized - MUST be before early returns
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
        // If clicking on the same filter, toggle sort direction
        if (prev === filterKey && sortConfig.key === filterKey) {
          const newDirection =
            sortConfig.direction === "ascending" ? "descending" : "ascending";
          setSortConfig({ key: filterKey, direction: newDirection });
          return prev;
        } else {
          // Auto-sort by the selected filter (default to descending for new selections)
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
        return `${(item[key] * 100).toFixed(2)}%`;
      case "plays":
        return item[key].toLocaleString("en-US");
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
      ];

      const filteredDataHidden = hiddenData.filter(
        (data) => data.key !== mobileFilter
      );

      return (
        <div className="p-4 bg-[#1a1a1a] border-t border-[#2D2F37]">
          <div className="grid grid-cols-3 gap-3 mb-4">
            {filteredDataHidden.map((data, index) => (
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
                {item.synergyItems.map((synergyItem, w) => (
                  <div key={w} className="relative">
                    <ItemDisplay
                      item={synergyItem}
                      size="small"
                      borderRadius="rounded-[4px]"
                      backgroundRadius="rounded-[4px]"
                      tooltipId={`${synergyItem?.key}_${w}`}
                      showTooltip={true}
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
                {item.championData.map((championData, x) => (
                  <div key={x} className="flex-shrink-0">
                    <CardImage
                      src={championData}
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
    },
    [mobileFilter, forces, others]
  );

  const handleButtonClick = useCallback((button) => {
    setTagFilter(button);
  }, []);

  const handleSearchChange = useCallback((value) => {
    setSearchValue(value);
  }, []);

  // Add getCellClass function to highlight sorted column cells - MUST be before early returns
  const getCellClass = useCallback(
    (key) => {
      if (sortConfig.key === key) {
        return "bg-[#2D2F37] text-[#D9A876]";
      }
      return "";
    },
    [sortConfig.key]
  );

  // Add renderSortIcon function for consistent icon rendering - MUST be before early returns
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

  // Memoize mobile table rows - MUST be before early returns
  const mobileTableRows = useMemo(() => {
    return filteredData
      .map((item, index) => {
        if (!item.itemData?.key) return null;

        return (
          <div key={item.key} className="border-b border-[#2D2F37]">
            <div
              className="grid gap-1 p-3 items-center cursor-pointer hover:bg-[#2D2F37] transition-colors duration-200"
              style={{ gridTemplateColumns: "10% 45% 20% 22%" }}
              onClick={() => toggleRowExpansion(index)}
            >
              <div className="text-center text-white font-medium">
                {index + 1}
              </div>
              <div className="flex items-center space-x-2 min-w-0">
                <ItemDisplay
                  item={item.itemData}
                  size="midMedium"
                  borderRadius="rounded-[4px]"
                  backgroundRadius="rounded-[4px]"
                  showTooltip={true}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-white text-xs truncate leading-tight mb-0">
                    {item.itemData.name}
                  </p>
                </div>
              </div>
              <div className="text-center text-white text-sm">
                <ColoredValue value={item?.avgPlacement} prefix="#" />
              </div>
              <div
                className={`text-center text-sm ${
                  mobileFilter === sortConfig.key
                    ? "text-[#D9A876] font-medium"
                    : "text-white"
                } flex items-center justify-center space-x-1`}
              >
                <span>{renderMobileValue(item, mobileFilter)}</span>
                {expandedRows.has(index) ? (
                  <HiChevronUp className="w-4 h-4" />
                ) : (
                  <HiChevronDown className="w-4 h-4" />
                )}
              </div>
            </div>
            {expandedRows.has(index) && renderExpandedContent(item)}
          </div>
        );
      })
      .filter(Boolean);
  }, [
    filteredData,
    mobileFilter,
    sortConfig.key,
    expandedRows,
    toggleRowExpansion,
    renderMobileValue,
    renderExpandedContent,
  ]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="pt-2 bg-[#111111] md:bg-transparent w-full">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D9A876]"></div>
          <span className="ml-3 text-white">Loading game data...</span>
        </div>
      </div>
    );
  }

  // Show error state
  if (isError) {
    return (
      <div className="pt-2 bg-[#111111] md:bg-transparent w-full">
        <div className="flex flex-col justify-center items-center py-20">
          <div className="text-red-400 mb-4">
            Failed to load game data: {error}
          </div>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-[#D9A876] text-black rounded hover:bg-[#F2A03D] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="pt-2 bg-[#111111] md:bg-transparent w-full">
        {/* Header section with filters and search */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-[#111111] md:bg-transparent px-2 sm:px-4 mb-2.5 md:mb-0">
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
              setSearchValue={handleSearchChange}
              placeholder="Search item..."
            />
          </div>
        </div>

        {/* Table section */}
        <div className="projects-row">
          {/* Desktop Grid - Hidden on mobile with Virtual Scrolling */}
          <div className="hidden md:block">
            <div className="w-full">
              {/* Grid Header - Sticky */}
              <div
                className="grid bg-[#000000] sticky top-[113px] z-50 border-b border-[#2D2F37]"
                style={{
                  gridTemplateColumns:
                    "60px 1.5fr 120px 120px 120px 120px 120px 200px 240px",
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
                    {others?.items}
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
                    <span className="ml-2">
                      {renderSortIcon("avgPlacement")}
                    </span>
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
                  <p className="p-0 text-base my-auto md:text-[16px] text-center py-2">
                    {others?.synergy} {others?.items}
                  </p>
                </div>
                <div className="p-2 font-semibold text-white">
                  <p className="p-0 text-base my-auto md:text-[16px] text-center py-2">
                    {others?.top3} {others?.champions}
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
                  {visibleItems.map((item, visibleIndex) => {
                    const actualIndex = startIndex + visibleIndex;
                    if (!item.itemData?.key) return null;

                    return (
                      <GridRow
                        key={item.key}
                        item={item}
                        index={actualIndex}
                        synergyItems={item.synergyItems}
                        championData={item.championData}
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
                  Item
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
    </>
  );
};

export default ProjectItems;

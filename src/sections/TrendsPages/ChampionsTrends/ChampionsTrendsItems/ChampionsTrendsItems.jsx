import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  memo,
  useCallback,
} from "react";
import { useTranslation } from "react-i18next";
import "../../../../../i18n";
import "react-tooltip/dist/react-tooltip.css";
import {
  HiArrowSmUp,
  HiArrowSmDown,
  HiChevronDown,
  HiChevronUp,
} from "react-icons/hi";
import useCompsData from "../../../../hooks/useCompsData";
import { useMetaDeckChampions } from "../../../../hooks/useMetaDeckData";
import CardImage from "src/components/cardImage";
import TrendFilters from "src/components/trendFilters";
import SearchBar from "src/components/searchBar";
import ColoredValue from "src/components/ColoredValue";
import ItemDisplay from "src/components/item/ItemDisplay";

// Debounce hook for search
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Throttle utility
const throttle = (func, limit) => {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Universal virtual scrolling hook for both desktop and mobile
const useVirtualScroll = (items, itemHeight, buffer = 3) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerTop, setContainerTop] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const updateScroll = throttle(() => {
      setScrollTop(window.pageYOffset);
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerTop(window.pageYOffset + rect.top);
      }
    }, 16);

    window.addEventListener("scroll", updateScroll, { passive: true });
    updateScroll();

    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  const relativeScrollTop = Math.max(0, scrollTop - containerTop);
  const viewportHeight = window.innerHeight || 800;

  const startIndex = Math.max(
    0,
    Math.floor(relativeScrollTop / itemHeight) - buffer
  );
  const visibleCount = Math.ceil(viewportHeight / itemHeight) + buffer * 2;
  const endIndex = Math.min(startIndex + visibleCount, items.length);

  return {
    visibleItems: items.slice(startIndex, endIndex),
    totalHeight: items.length * itemHeight,
    offsetY: startIndex * itemHeight,
    startIndex,
    containerRef,
  };
};

// Memoized desktop row component
const DesktopGridRow = memo(
  ({
    champion,
    index,
    championData,
    recommendedItems,
    forces,
    getCellClass,
  }) => {
    const topsPercentage = useMemo(
      () => (champion?.tops / champion?.plays).toFixed(2),
      [champion?.tops, champion?.plays]
    );

    const winsPercentage = useMemo(
      () => (champion?.wins / champion?.plays).toFixed(2),
      [champion?.wins, champion?.plays]
    );

    const pickRatePercentage = useMemo(
      () => (champion?.pickRate).toFixed(2),
      [champion?.pickRate]
    );

    const threeStarPercentage = useMemo(
      () => (champion?.threeStarPercentage).toFixed(2),
      [champion?.threeStarPercentage]
    );

    const playsFormatted = useMemo(
      () => champion?.plays.toLocaleString("en-US"),
      [champion?.plays]
    );

    return (
      <div
        className="grid bg-[#111111] hover:bg-[#2D2F37] transition-colors duration-200 border-b border-[#2D2F37]"
        style={{
          gridTemplateColumns:
            "60px 1fr 120px 120px 120px 120px 120px 120px 120px 260px",
          height: "100px",
          willChange: "transform",
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
              imgStyle="w-[80px] h-[80px]"
              identificationImageStyle="w-[16px] h-[16px]"
              textStyle="text-[10px] hidden"
              forces={forces}
              cardSize="!w-[80px] !h-[80px]"
            />
            <p className="p-0 text-left text-base md:text-lg mb-0 ml-2 text-[#fff] truncate">
              {championData.key}
            </p>
          </div>
        </div>

        <div
          className={`p-2 flex items-center ${getCellClass("avgPlacement")}`}
        >
          <ColoredValue value={champion?.avgPlacement} prefix="#" />
        </div>

        <div className={`p-2 flex items-center ${getCellClass("tops")}`}>
          <p className="p-0 text-left text-base md:text-lg mb-0 text-[#fff]">
            {topsPercentage}%
          </p>
        </div>

        <div className={`p-2 flex items-center ${getCellClass("wins")}`}>
          <p className="p-0 text-left text-base md:text-lg mb-0 text-[#fff]">
            {winsPercentage}%
          </p>
        </div>

        <div className={`p-2 flex items-center ${getCellClass("pickRate")}`}>
          <p className="p-0 text-left text-base md:text-lg mb-0 text-[#fff]">
            {pickRatePercentage}%
          </p>
        </div>

        <div className={`p-2 flex items-center ${getCellClass("plays")}`}>
          <p className="p-0 text-left text-base md:text-lg mb-0 text-[#fff]">
            {playsFormatted}
          </p>
        </div>

        <div className="p-2 flex items-center">
          <p className="p-0 text-left text-base md:text-lg mb-0 text-[#fff]">
            {threeStarPercentage}%
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
                  size="small"
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

DesktopGridRow.displayName = "DesktopGridRow";

// Memoized mobile row component
const MobileGridRow = memo(
  ({
    champion,
    index,
    forces,
    mobileFilter,
    sortConfig,
    expandedRows,
    onToggleExpansion,
    renderMobileValue,
    renderExpandedContent,
    getCellClass,
  }) => {
    const isExpanded = expandedRows.has(index);

    const handleToggle = useCallback(() => {
      onToggleExpansion(index);
    }, [index, onToggleExpansion]);

    return (
      <div className="border-b border-[#2D2F37]">
        <div
          className="grid gap-1 p-3 items-center cursor-pointer hover:bg-[#2D2F37] transition-colors duration-200"
          style={{
            gridTemplateColumns: "10% 45% 20% 22%",
            height: "80px", // Fixed height for virtual scrolling
            willChange: "transform",
          }}
          onClick={handleToggle}
        >
          <div className="text-center text-white font-medium">{index + 1}</div>

          <div className="flex items-center space-x-2 min-w-0">
            <CardImage
              src={champion}
              imgStyle="w-12 h-12"
              identificationImageStyle="w-3 h-3"
              textStyle="text-[8px] hidden"
              forces={forces}
              cardSize="!w-[60px] !h-[60px]"
            />
            <div className="min-w-0 flex-1">
              <p className="text-white text-sm truncate leading-tight mb-0">
                {champion.key}
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
            {isExpanded ? (
              <HiChevronUp className="w-3 h-3" />
            ) : (
              <HiChevronDown className="w-3 h-3" />
            )}
          </div>
        </div>

        {isExpanded && renderExpandedContent(champion)}
      </div>
    );
  }
);

MobileGridRow.displayName = "MobileGridRow";

const ProjectItems = () => {
  const { t } = useTranslation();
  const others = t("others");

  // Use the custom hook instead of direct JSON import
  const { champions, items, forces, isLoading, isError, error, refetch } =
    useCompsData();

  // Use meta deck champions hook for champions stats data
  const {
    data: metaDeckChampionsStats,
    isLoading: isChampionsLoading,
    isError: isChampionsError,
    error: championsError,
    refetch: refetchChampions,
  } = useMetaDeckChampions();

  // State management - simplified like TraitsTrendsItems.jsx
  const [metaDeckChampionsStatsData, setMetaDeckChampionsStatsData] = useState(
    metaDeckChampionsStats || []
  );
  const [searchValue, setSearchValue] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [mobileFilter, setMobileFilter] = useState("tops");
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [costFilter, setCostFilter] = useState("All");

  // Mobile filter options
  const mobileFilterOptions = [
    { key: "tops", label: others?.top4 || "Top 4%" },
    { key: "wins", label: others?.winPercentage || "Win %" },
    { key: "pickRate", label: others?.pickPercentage || "Pick %" },
    { key: "plays", label: others?.played || "Played" },
    {
      key: "threeStarPercentage",
      label: others?.threeStarsPercentage || "3-Stars%",
    },
    { key: "threeStarRank", label: others?.threeStarsRank || "3-Stars Rank" },
  ];

  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  const toggleRowExpansion = useCallback((index) => {
    setExpandedRows((prev) => {
      const newExpandedRows = new Set(prev);
      if (newExpandedRows.has(index)) {
        newExpandedRows.delete(index);
      } else {
        newExpandedRows.add(index);
      }
      return newExpandedRows;
    });
  }, []);

  const renderMobileValue = useCallback((item, key) => {
    switch (key) {
      case "tops":
      case "wins":
        return `${(item[key] / item.plays).toFixed(2)}%`;
      case "pickRate":
      case "threeStarPercentage":
        return `${item[key].toFixed(2)}%`;
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
          value: `${(item.tops / item.plays).toFixed(2)}%`,
          key: "tops",
        },
        {
          label: others?.winPercentage || "Win %",
          value: `${(item.wins / item.plays).toFixed(2)}%`,
          key: "wins",
        },
        {
          label: others?.pickPercentage || "Pick %",
          value: `${item.pickRate.toFixed(2)}%`,
          key: "pickRate",
        },
        {
          label: others?.played || "Played",
          value: item.plays.toLocaleString("en-US"),
          key: "plays",
        },
        {
          label: others?.threeStarsPercentage || "3⭐ %",
          value: `${item.threeStarPercentage.toFixed(2)}%`,
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

      // Get recommended items
      const recommendedItems = item.recommendItems
        ? item.recommendItems
            .map((itemKey) => {
              const key = itemKey?.split("_")[itemKey?.split("_").length - 1];
              return items?.find((itemObj) => itemObj.key === key);
            })
            .filter(Boolean)
        : [];

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
                    tooltipId={itemImg?.name}
                    showTooltip={true}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    },
    [others, items, mobileFilter]
  );

  // Simplified data processing like TraitsTrendsItems.jsx
  useEffect(() => {
    let data = [...(metaDeckChampionsStats || [])];

    // Merge champion data
    data = data.map((champion) => ({
      ...champion,
      ...(champions?.find((champ) => champ.key === champion.key) || {}),
    }));

    // Apply cost filter
    if (costFilter !== "All") {
      data = data.filter((champion) => champion.cost == costFilter);
    }

    // Apply search filter
    if (searchValue) {
      data = data.filter((champion) =>
        champion.key.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      data.sort((a, b) => {
        let aValue, bValue;

        if (["tops", "wins"].includes(sortConfig.key)) {
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

    setMetaDeckChampionsStatsData(data);
  }, [metaDeckChampionsStats, champions, costFilter, searchValue, sortConfig]);

  // Virtual scrolling setup for both desktop and mobile
  const desktopItemHeight = 100;
  const mobileItemHeight = 80;

  const {
    visibleItems: desktopVisibleItems,
    totalHeight: desktopTotalHeight,
    offsetY: desktopOffsetY,
    startIndex: desktopStartIndex,
    containerRef: desktopContainerRef,
  } = useVirtualScroll(metaDeckChampionsStatsData, desktopItemHeight);

  const {
    visibleItems: mobileVisibleItems,
    totalHeight: mobileTotalHeight,
    offsetY: mobileOffsetY,
    startIndex: mobileStartIndex,
    containerRef: mobileContainerRef,
  } = useVirtualScroll(metaDeckChampionsStatsData, mobileItemHeight);

  // Show loading state for either comps data or champions data
  if (isLoading || isChampionsLoading) {
    return (
      <div className="pt-2 bg-[#111111] md:bg-transparent">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D9A876]"></div>
          <span className="ml-3 text-white">Loading game data...</span>
        </div>
      </div>
    );
  }

  // Show error state for either comps data or champions data
  if (isError || isChampionsError) {
    const errorMessage = error || championsError;
    const retryFunction = isError ? refetch : refetchChampions;

    return (
      <div className="pt-2 bg-[#111111] md:bg-transparent">
        <div className="flex flex-col justify-center items-center py-20">
          <div className="text-red-400 mb-4">
            Failed to load game data: {errorMessage}
          </div>
          <button
            onClick={() => retryFunction()}
            className="px-4 py-2 bg-[#D9A876] text-black rounded hover:bg-[#F2A03D] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleButtonClick = (button) => {
    setCostFilter(button);
  };

  const getCellClass = (key) => {
    if (sortConfig.key === key) {
      return "bg-[#2D2F37] text-[#D9A876]";
    }
    return "";
  };

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
            setSearchValue={setSearchValue}
            placeholder="Search champion..."
          />
        </div>
      </div>

      <div className="projects-row">
        {/* Desktop Grid with Virtual Scrolling */}
        <div className="hidden md:block">
          <div className="w-full">
            {/* Grid Header - Sticky */}
            <div
              className="grid bg-[#000000] sticky top-[113px] z-50 border-b border-[#2D2F37]"
              style={{
                gridTemplateColumns:
                  "60px 1fr 120px 120px 120px 120px 120px 120px 120px 260px",
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

            {/* Virtual Scrolling Container */}
            <div
              ref={desktopContainerRef}
              className="bg-[#111111]"
              style={{
                height: `${desktopTotalHeight}px`,
                position: "relative",
              }}
            >
              <div style={{ transform: `translateY(${desktopOffsetY}px)` }}>
                {desktopVisibleItems.map((champion, visibleIndex) => {
                  const actualIndex = desktopStartIndex + visibleIndex;
                  if (!champion?.key) return null;

                  const recommendedItems = champion.recommendItems
                    ? champion.recommendItems
                        .map((itemKey) => {
                          const key =
                            itemKey?.split("_")[itemKey?.split("_").length - 1];
                          return items?.find((item) => item.key === key);
                        })
                        .filter(Boolean)
                    : [];

                  return (
                    <DesktopGridRow
                      key={champion.key}
                      champion={champion}
                      index={actualIndex}
                      championData={champion}
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

        {/* Mobile Table with Virtual Scrolling */}
        <div className="block md:hidden">
          <div className="bg-[#111111]">
            {/* Mobile Table Header - Sticky */}
            <div
              className="grid gap-1 p-3 bg-[#1a1a1a] text-white font-semibold text-sm border-b border-[#2D2F37] sticky top-[100px] z-50"
              style={{ gridTemplateColumns: "10% 45% 20% 22%" }}
            >
              <div className="text-center flex items-center justify-center">
                #
              </div>
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

            {/* Mobile Virtual Scrolling Container */}
            <div
              ref={mobileContainerRef}
              className="bg-[#111111]"
              style={{
                height: `${mobileTotalHeight}px`,
                position: "relative",
              }}
            >
              <div style={{ transform: `translateY(${mobileOffsetY}px)` }}>
                {mobileVisibleItems.map((champion, visibleIndex) => {
                  const actualIndex = mobileStartIndex + visibleIndex;
                  if (!champion?.key) return null;

                  return (
                    <MobileGridRow
                      key={champion.key}
                      champion={champion}
                      index={actualIndex}
                      forces={forces}
                      mobileFilter={mobileFilter}
                      sortConfig={sortConfig}
                      expandedRows={expandedRows}
                      onToggleExpansion={toggleRowExpansion}
                      renderMobileValue={renderMobileValue}
                      renderExpandedContent={renderExpandedContent}
                      getCellClass={getCellClass}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectItems;

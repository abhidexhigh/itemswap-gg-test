import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  memo,
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

// Custom hooks
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const useVirtualScroll = (
  items,
  itemHeight,
  containerHeight,
  isMobile = false
) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerTop, setContainerTop] = useState(0);
  const containerRef = useRef(null);

  const throttle = useCallback((func, limit) => {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }, []);

  const handleScroll = useCallback(
    throttle(() => {
      if (isMobile && containerRef.current) {
        setScrollTop(containerRef.current.scrollTop);
      } else {
        setScrollTop(window.pageYOffset);
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          setContainerTop(window.pageYOffset + rect.top);
        }
      }
    }, 16),
    [isMobile, throttle]
  );

  useEffect(() => {
    if (isMobile) {
      const container = containerRef.current;
      if (container) {
        container.addEventListener("scroll", handleScroll, { passive: true });
        return () => container.removeEventListener("scroll", handleScroll);
      }
    } else {
      window.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll();
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll, isMobile]);

  const relativeScrollTop = isMobile
    ? scrollTop
    : Math.max(0, scrollTop - containerTop);
  const viewportHeight = isMobile ? containerHeight : window.innerHeight || 800;
  const buffer = 3;

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

// Memoized components
const DesktopGridRow = memo(
  ({
    champion,
    index,
    championData,
    recommendedItems,
    forces,
    getCellClass,
  }) => {
    const stats = useMemo(
      () => ({
        tops: ((champion?.tops * 100) / champion?.plays).toFixed(2),
        wins: ((champion?.wins * 100) / champion?.plays).toFixed(2),
        pickRate: (champion?.pickRate * 100).toFixed(2),
        threeStar: (champion?.threeStarPercentage * 100).toFixed(2),
        plays: champion?.plays.toLocaleString("en-US"),
      }),
      [champion]
    );

    return (
      <div
        className="grid bg-[#111111] hover:bg-[#2D2F37] transition-colors duration-200 border-b border-[#2D2F37]"
        style={{
          gridTemplateColumns:
            "60px 1fr 120px 120px 120px 120px 120px 120px 120px 260px",
          height: "100px",
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
            {stats.tops}%
          </p>
        </div>
        <div className={`p-2 flex items-center ${getCellClass("wins")}`}>
          <p className="p-0 text-left text-base md:text-lg mb-0 text-[#fff]">
            {stats.wins}%
          </p>
        </div>
        <div className={`p-2 flex items-center ${getCellClass("pickRate")}`}>
          <p className="p-0 text-left text-base md:text-lg mb-0 text-[#fff]">
            {stats.pickRate}%
          </p>
        </div>
        <div className={`p-2 flex items-center ${getCellClass("plays")}`}>
          <p className="p-0 text-left text-base md:text-lg mb-0 text-[#fff]">
            {stats.plays}
          </p>
        </div>
        <div className="p-2 flex items-center">
          <p className="p-0 text-left text-base md:text-lg mb-0 text-[#fff]">
            {stats.threeStar}%
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

const MobileRow = memo(
  ({
    champion,
    index,
    championData,
    forces,
    mobileFilter,
    sortConfig,
    expandedRows,
    onToggle,
    renderMobileValue,
    renderExpandedContent,
  }) => {
    const isExpanded = expandedRows.has(index);
    const handleClick = useCallback(() => onToggle(index), [index, onToggle]);

    return (
      <div className="border-b border-[#2D2F37]">
        <div
          className="grid gap-1 p-3 items-center cursor-pointer hover:bg-[#2D2F37] transition-colors duration-200"
          style={{ gridTemplateColumns: "10% 45% 20% 22%" }}
          onClick={handleClick}
        >
          <div className="text-center text-white font-medium">{index + 1}</div>
          <div className="flex items-center space-x-2 min-w-0">
            <CardImage
              src={championData}
              imgStyle="w-12 h-12"
              identificationImageStyle="w-3 h-3"
              textStyle="text-[8px] hidden"
              forces={forces}
              cardSize="!w-[60px] !h-[60px]"
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

const ProjectItems = () => {
  const { t } = useTranslation();
  const others = t("others");

  // Data hooks
  const { champions, items, forces, isLoading, isError, error, refetch } =
    useCompsData();
  const {
    data: metaDeckChampionsStats,
    isLoading: isChampionsLoading,
    isError: isChampionsError,
    error: championsError,
    refetch: refetchChampions,
  } = useMetaDeckChampions();

  // State
  const [searchValue, setSearchValue] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [mobileFilter, setMobileFilter] = useState("tops");
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [costFilter, setCostFilter] = useState("All");

  const debouncedSearchValue = useDebounce(searchValue, 300);

  // Data processing
  const { championLookup, mergedData, championRecommendedItems } =
    useMemo(() => {
      const lookup = new Map(
        champions?.map((champion) => [champion.key, champion]) || []
      );
      const merged = (metaDeckChampionsStats || []).map((champion) => ({
        ...champion,
        ...(lookup.get(champion.key) || {}),
      }));

      const itemsMap = new Map();
      champions?.forEach((champion) => {
        if (champion.recommendItems) {
          const recommendedItems = champion.recommendItems
            .map((itemKey) => {
              const key = itemKey?.split("_").pop();
              return items?.find((item) => item.key === key);
            })
            .filter(Boolean);
          itemsMap.set(champion.key, recommendedItems);
        }
      });

      return {
        championLookup: lookup,
        mergedData: merged,
        championRecommendedItems: itemsMap,
      };
    }, [champions, items, metaDeckChampionsStats]);

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

  const processedData = useMemo(() => {
    let data = mergedData;

    if (costFilter !== "All") {
      data = data.filter((champion) => champion.cost == costFilter);
    }

    if (debouncedSearchValue) {
      const searchLower = debouncedSearchValue.toLowerCase();
      data = data.filter((champion) =>
        champion.key.toLowerCase().includes(searchLower)
      );
    }

    if (sortConfig.key) {
      data = [...data].sort((a, b) => {
        let aValue, bValue;
        if (["tops", "wins"].includes(sortConfig.key)) {
          aValue = (a[sortConfig.key] * 100) / a.plays;
          bValue = (b[sortConfig.key] * 100) / b.plays;
        } else {
          aValue = a[sortConfig.key];
          bValue = b[sortConfig.key];
        }

        const result = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        return sortConfig.direction === "ascending" ? result : -result;
      });
    }

    return data;
  }, [mergedData, costFilter, debouncedSearchValue, sortConfig]);

  // Virtual scrolling
  const desktopVirtual = useVirtualScroll(processedData, 100);
  const mobileVirtual = useVirtualScroll(processedData, 80, 600, true);

  // Event handlers
  const requestSort = useCallback((key) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
  }, []);

  const handleMobileFilterClick = useCallback(
    (filterKey) => {
      setMobileFilter((prev) => {
        if (prev === filterKey && sortConfig.key === filterKey) {
          setSortConfig((s) => ({
            ...s,
            direction: s.direction === "ascending" ? "descending" : "ascending",
          }));
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
      newSet.has(index) ? newSet.delete(index) : newSet.add(index);
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
      ].filter((data) => data.key !== mobileFilter);

      const recommendedItems = championRecommendedItems.get(item.key) || [];

      return (
        <div className="grid grid-cols-3 gap-3 p-4 bg-[#1a1a1a] border-t border-[#2D2F37]">
          {hiddenData.map((data, index) => (
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
    [mobileFilter, championRecommendedItems, others]
  );

  const getCellClass = useCallback(
    (key) => (sortConfig.key === key ? "bg-[#2D2F37] text-[#D9A876]" : ""),
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

  // Loading and error states
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

  // Render mobile filter buttons
  const renderMobileFilterButtons = () => (
    <div className="block md:hidden mb-2">
      <div className="flex flex-col items-center gap-2 px-4">
        {[mobileFilterOptions.slice(0, 4), mobileFilterOptions.slice(4)].map(
          (group, groupIndex) => (
            <div key={groupIndex} className="flex gap-0">
              {group.map((option, index) => {
                const isFirst = index === 0;
                const isLast = index === group.length - 1;
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
          )
        )}
      </div>
    </div>
  );

  return (
    <div className="pt-2 bg-[#111111] md:bg-transparent">
      <div className="md:flex md:justify-between md:items-center bg-[#111111] md:bg-transparent mb-2.5 md:mb-0">
        <div className="flex items-center mx-auto md:!ml-0 md:!mr-0 justify-center md:justify-start">
          <h1 className="text-[#fff] hidden md:block text-lg md:text-xl font-bold mb-0">
            Cost
          </h1>
          <TrendFilters
            buttons={["All", "1", "2", "3", "4", "5"]}
            onButtonClick={setCostFilter}
          />
        </div>

        {renderMobileFilterButtons()}

        <div className="mb-2 md:mb-0 px-4">
          <SearchBar
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            placeholder="Search champion..."
          />
        </div>
      </div>

      <div className="projects-row">
        {/* Desktop Grid */}
        <div className="hidden md:block">
          <div className="w-full">
            {/* Desktop Header */}
            <div
              className="grid bg-[#000000] sticky top-[113px] z-50 border-b border-[#2D2F37]"
              style={{
                gridTemplateColumns:
                  "60px 1fr 120px 120px 120px 120px 120px 120px 120px 260px",
              }}
            >
              {[
                { key: null, label: others?.rank },
                { key: "key", label: others?.champions },
                { key: "avgPlacement", label: others?.avgRank },
                { key: "tops", label: others?.top4 },
                { key: "wins", label: others?.winPercentage },
                { key: "pickRate", label: others?.pickPercentage },
                { key: "plays", label: others?.played },
                { key: null, label: others?.threeStarsPercentage },
                { key: null, label: others?.threeStarsRank },
                { key: null, label: `${others?.recommended} ${others?.items}` },
              ].map((col, index) => (
                <div
                  key={index}
                  className={`${col.key ? "cursor-pointer" : ""} p-2 font-semibold text-white ${
                    sortConfig?.key === col.key ? "bg-[#2D2F37]" : ""
                  }`}
                  onClick={col.key ? () => requestSort(col.key) : undefined}
                >
                  <p className="p-0 text-sm sm:text-base my-auto md:text-[16px] text-left flex items-center py-2">
                    {col.label}
                    {col.key && (
                      <span className="ml-2">{renderSortIcon(col.key)}</span>
                    )}
                  </p>
                </div>
              ))}
            </div>

            {/* Desktop Virtual Container */}
            <div
              ref={desktopVirtual.containerRef}
              className="bg-[#111111]"
              style={{
                height: `${desktopVirtual.totalHeight}px`,
                position: "relative",
              }}
            >
              <div
                style={{ transform: `translateY(${desktopVirtual.offsetY}px)` }}
              >
                {desktopVirtual.visibleItems.map((champion, visibleIndex) => {
                  const actualIndex = desktopVirtual.startIndex + visibleIndex;
                  const championData = championLookup.get(champion.key);
                  if (!championData?.key) return null;

                  const recommendedItems =
                    championRecommendedItems.get(champion.key) || [];

                  return (
                    <DesktopGridRow
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

        {/* Mobile Table */}
        <div className="block md:hidden">
          <div className="bg-[#111111]">
            {/* Mobile Header */}
            <div
              className="grid gap-1 p-3 bg-[#1a1a1a] text-white font-semibold text-sm border-b border-[#2D2F37] sticky top-[100px] z-50"
              style={{ gridTemplateColumns: "10% 45% 20% 22%" }}
            >
              <div className="text-center flex items-center justify-center">
                #
              </div>
              <div
                className={`cursor-pointer flex items-center ${sortConfig?.key === "key" ? "text-[#D9A876]" : ""}`}
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

            {/* Mobile Virtual Container */}
            <div
              ref={mobileVirtual.containerRef}
              className="overflow-auto"
              style={{ height: "600px" }}
            >
              <div
                style={{
                  height: `${mobileVirtual.totalHeight}px`,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    transform: `translateY(${mobileVirtual.offsetY}px)`,
                  }}
                >
                  {mobileVirtual.visibleItems.map((champion, visibleIndex) => {
                    const actualIndex = mobileVirtual.startIndex + visibleIndex;
                    const championData = championLookup.get(champion.key);
                    if (!championData?.key) return null;

                    return (
                      <MobileRow
                        key={champion.key}
                        champion={champion}
                        index={actualIndex}
                        championData={championData}
                        forces={forces}
                        mobileFilter={mobileFilter}
                        sortConfig={sortConfig}
                        expandedRows={expandedRows}
                        onToggle={toggleRowExpansion}
                        renderMobileValue={renderMobileValue}
                        renderExpandedContent={renderExpandedContent}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectItems;

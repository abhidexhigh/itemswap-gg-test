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
import TrendFilters from "src/components/trendFilters";
import {
  HiArrowSmUp,
  HiArrowSmDown,
  HiChevronDown,
  HiChevronUp,
} from "react-icons/hi";
import useCompsData from "../../../../hooks/useCompsData";
import { useMetaDeckItems } from "../../../../hooks/useMetaDeckData";
import ReactTltp from "src/components/tooltip/ReactTltp";
import CardImage from "src/components/cardImage";
import { OptimizedImage } from "../../../../utils/imageOptimizer";
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

const useVirtualScroll = (items, itemHeight, isMobile = false) => {
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
  const viewportHeight = isMobile ? 600 : window.innerHeight || 800;
  const buffer = 5;

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
const DesktopGridRow = memo(({ item, index, forces, getCellClass }) => {
  const stats = useMemo(
    () => ({
      tops: ((item?.tops * 100) / item?.plays).toFixed(2),
      wins: ((item?.wins * 100) / item?.plays).toFixed(2),
      pickRate: (item?.pickRate * 100).toFixed(2),
      plays: item?.plays.toLocaleString("en-US"),
    }),
    [item]
  );

  return (
    <div
      className="grid bg-[#111111] hover:bg-[#2D2F37] transition-colors duration-200 border-b border-[#2D2F37]"
      style={{
        gridTemplateColumns:
          "60px 1.5fr 120px 120px 120px 120px 120px 200px 240px",
        height: "100px",
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

      <div className={`p-2 flex items-center ${getCellClass("avgPlacement")}`}>
        <p className="p-0 text-left text-base md:text-lg mb-0">
          <ColoredValue value={item?.avgPlacement} prefix="#" />
        </p>
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

      <div className="p-2 flex items-center justify-center">
        <div className="flex flex-wrap justify-center items-center gap-1">
          {item.synergyItems.map((synergyItem, w) => (
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
          {item.championData.map((champion, x) => (
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
});

const MobileRow = memo(
  ({
    item,
    index,
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
            {isExpanded ? (
              <HiChevronUp className="w-4 h-4" />
            ) : (
              <HiChevronDown className="w-4 h-4" />
            )}
          </div>
        </div>

        {isExpanded && renderExpandedContent(item)}
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
    data: metaDeckItemStats,
    isLoading: isItemsLoading,
    isError: isItemsError,
    error: itemsError,
    refetch: refetchItems,
  } = useMetaDeckItems();

  // State
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [searchValue, setSearchValue] = useState("");
  const [mobileFilter, setMobileFilter] = useState("tops");
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [tagFilter, setTagFilter] = useState("All");

  const debouncedSearchValue = useDebounce(searchValue, 300);

  // Data processing
  const { itemLookup, championLookup, processedItemData } = useMemo(() => {
    const itemMap = new Map(items?.map((item) => [item.key, item]) || []);
    const championMap = new Map(
      champions?.map((champion) => [champion.key, champion]) || []
    );

    const processedItems = (metaDeckItemStats || []).map((itemStat) => {
      const itemData = itemMap.get(itemStat.key);
      return {
        ...itemStat,
        itemData,
        synergyItems:
          itemStat.itemSynergyStats
            ?.slice(0, 3)
            .map((synergy) => itemMap.get(synergy))
            .filter(Boolean) || [],
        championData:
          itemStat.itemChampionStats
            ?.slice(0, 3)
            .map((champion) => championMap.get(champion))
            .filter(Boolean) || [],
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
  }, [items, champions, metaDeckItemStats]);

  const mobileFilterOptions = useMemo(
    () => [
      { key: "tops", label: others?.top4 || "Top 4%" },
      { key: "wins", label: others?.winPercentage || "Win %" },
      { key: "pickRate", label: others?.pickPercentage || "Pick %" },
      { key: "plays", label: others?.played || "Played" },
    ],
    [others]
  );

  const filteredData = useMemo(() => {
    let data = [...processedItemData];

    if (tagFilter !== "All") {
      data = data.filter((item) =>
        item.itemData?.tags?.includes(tagFilter.toLowerCase())
      );
    }

    if (debouncedSearchValue) {
      data = data.filter((item) =>
        item.itemData?.name
          ?.toLowerCase()
          .includes(debouncedSearchValue.toLowerCase())
      );
    }

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

        const result = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        return sortConfig.direction === "ascending" ? result : -result;
      });
    }

    return data;
  }, [processedItemData, tagFilter, debouncedSearchValue, sortConfig]);

  // Virtual scrolling
  const desktopVirtual = useVirtualScroll(filteredData, 100);
  const mobileVirtual = useVirtualScroll(filteredData, 80, true);

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
      ].filter((data) => data.key !== mobileFilter);

      return (
        <div className="p-4 bg-[#1a1a1a] border-t border-[#2D2F37]">
          <div className="grid grid-cols-3 gap-3 mb-4">
            {hiddenData.map((data, index) => (
              <div key={index} className="flex flex-col">
                <span className="text-xs text-gray-400 mb-1">{data.label}</span>
                <span className="text-sm text-white">{data.value}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center">
            <div>
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
  if (isLoading || isItemsLoading) {
    return (
      <div className="pt-2 bg-[#111111] md:bg-transparent w-full">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D9A876]"></div>
          <span className="ml-3 text-white">Loading game data...</span>
        </div>
      </div>
    );
  }

  if (isError || isItemsError) {
    const errorMessage = error || itemsError;
    const retryFunction = isError ? refetch : refetchItems;

    return (
      <div className="pt-2 bg-[#111111] md:bg-transparent w-full">
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
  );

  return (
    <div className="pt-2 bg-[#111111] md:bg-transparent w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center bg-[#111111] md:bg-transparent px-2 sm:px-4 mb-2.5 md:mb-0">
        {renderMobileFilterButtons()}

        <div className="w-full sm:w-auto px-4 sm:px-0">
          <SearchBar
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            placeholder="Search item..."
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
                  "60px 1.5fr 120px 120px 120px 120px 120px 200px 240px",
              }}
            >
              {[
                { key: null, label: others?.rank },
                { key: "key", label: others?.items },
                { key: "avgPlacement", label: others?.avgRank },
                { key: "tops", label: others?.top4 },
                { key: "wins", label: others?.winPercentage },
                { key: "pickRate", label: others?.pickPercentage },
                { key: "plays", label: others?.played },
                { key: null, label: `${others?.synergy} ${others?.items}` },
                { key: null, label: `${others?.top3} ${others?.champions}` },
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
                {desktopVirtual.visibleItems.map((item, visibleIndex) => {
                  const actualIndex = desktopVirtual.startIndex + visibleIndex;
                  if (!item.itemData?.key) return null;

                  return (
                    <DesktopGridRow
                      key={item.key}
                      item={item}
                      index={actualIndex}
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
              <div className="text-center">#</div>
              <div
                className={`cursor-pointer flex items-center ${sortConfig?.key === "key" ? "text-[#D9A876]" : ""}`}
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
                  {mobileVirtual.visibleItems.map((item, visibleIndex) => {
                    const actualIndex = mobileVirtual.startIndex + visibleIndex;
                    if (!item.itemData?.key) return null;

                    return (
                      <MobileRow
                        key={item.key}
                        item={item}
                        index={actualIndex}
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

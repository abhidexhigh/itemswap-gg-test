import React, { useState, useEffect, useCallback } from "react";
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
import { PiEye } from "react-icons/pi";
import useCompsData from "../../../../hooks/useCompsData";
import { useMetaDeckSkillTree } from "../../../../hooks/useMetaDeckData";
import ReactTltp from "src/components/tooltip/ReactTltp";
import CardImage from "src/components/cardImage";
import { OptimizedImage } from "../../../../utils/imageOptimizer";
import SearchBar from "src/components/searchBar";
import ColoredValue from "src/components/ColoredValue";
import CompsModal from "./CompsModal";
import SkillTreeImage from "src/components/SkillTreeImage";

const ProjectItems = () => {
  const { t } = useTranslation();
  const others = t("others");

  // Use the custom hook instead of direct JSON import
  const {
    metaDecks,
    traits,
    champions,
    items,
    forces,
    skillTree,
    isLoading,
    isError,
    error,
    refetch,
  } = useCompsData();

  // Use meta deck skill tree hook for skill tree stats data
  const {
    data: metaDeckSkillTreeStats,
    isLoading: isSkillTreeLoading,
    isError: isSkillTreeError,
    error: skillTreeError,
    refetch: refetchSkillTree,
  } = useMetaDeckSkillTree();

  // All useState hooks must be called before any early returns
  const [metaDeckSkillTreeStatsData, setMetaDeckSkillTreeStatsData] = useState(
    metaDeckSkillTreeStats || []
  );
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [searchValue, setSearchValue] = useState("");
  // Track selected variant
  const [selectedVariant, setSelectedVariant] = useState("All");
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItemForModal, setSelectedItemForModal] = useState(null);
  // Mobile state
  const [mobileFilter, setMobileFilter] = useState("tops");
  const [expandedRows, setExpandedRows] = useState(new Set());

  // Mobile filter options (excluding serial no, image, name, avg rank, top 3 comps)
  const mobileFilterOptions = [
    { key: "tops", label: others?.top4 || "Top 4%" },
    { key: "wins", label: others?.winPercentage || "Win %" },
    {
      key: "threeStarPercentage",
      label: others?.threeStarsPercentage || "3⭐ %",
    },
    { key: "plays", label: others?.played || "Played" },
  ];

  // Get unique variants from the skill tree data and prepare buttons and image URLs
  const uniqueVariants = [
    "All",
    ...new Set((metaDeckSkillTreeStats || []).map((item) => item.variant)),
  ];
  const variantImages = {
    All: "/images/all_button.webp",
    Light:
      "https://res.cloudinary.com/dg0cmj6su/image/upload/v1745815427/light_mz3oml.webp",
    Dark: "https://res.cloudinary.com/dg0cmj6su/image/upload/v1745815427/dark_rtcoqw.webp",
    Fire: "https://res.cloudinary.com/dg0cmj6su/image/upload/v1745815427/fire_mj0fey.webp",
    Storm:
      "https://res.cloudinary.com/dg0cmj6su/image/upload/v1745815427/storm_vpfovn.webp",
    Water:
      "https://res.cloudinary.com/dg0cmj6su/image/upload/v1745815427/water_lxpw8d.webp",
  };

  // Prepare image URLs for the buttons
  const imageButtonsUrls = uniqueVariants.map(
    (variant) => variantImages[variant] || ""
  );

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

  // Helper function to apply search filter
  const applySearchFilter = useCallback(
    (dataToFilter) => {
      const searchLower = searchValue.toLowerCase().trim();
      setMetaDeckSkillTreeStatsData(
        dataToFilter.filter((item) => {
          // If search value is empty, return all items
          if (!searchLower) return true;

          // Check if item name contains search text
          if (item.name?.toLowerCase().includes(searchLower)) {
            return true;
          }

          // Check in items array as fallback
          const foundItem = items.find((i) => i.key === item.key);
          if (
            foundItem &&
            foundItem.name?.toLowerCase().includes(searchLower)
          ) {
            return true;
          }

          return false;
        })
      );
    },
    [searchValue, items]
  );

  // All useEffect hooks must be called before early returns
  useEffect(() => {
    let sortedData = [...(metaDeckSkillTreeStats || [])];
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
          aValue = a.skillTreeRoundStats[index]?.avgPlacement || 0;
          bValue = b.skillTreeRoundStats[index]?.avgPlacement || 0;
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

    setMetaDeckSkillTreeStatsData(sortedData);
  }, [metaDeckSkillTreeStats, sortConfig]);

  // Update search filter whenever search value changes
  useEffect(() => {
    // Get the current filtered data based on selected variant
    const currentVariantFilter = selectedVariant;
    const variantFiltered =
      currentVariantFilter === "All"
        ? metaDeckSkillTreeStats || []
        : (metaDeckSkillTreeStats || []).filter(
            (item) => item.variant === currentVariantFilter
          );

    // Apply search filter on top of variant filter
    applySearchFilter(variantFiltered);
  }, [searchValue, selectedVariant, metaDeckSkillTreeStats, applySearchFilter]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleButtonClick = (button) => {
    // Apply both variant and search filters together
    const variantFiltered =
      button === "All"
        ? metaDeckSkillTreeStats || []
        : (metaDeckSkillTreeStats || []).filter(
            (item) => item.variant === button
          );

    // Apply search filter on top of variant filter
    applySearchFilter(variantFiltered);
  };

  // Override handleButtonClick from TrendFilters to track selected variant
  const handleVariantClick = (button) => {
    setSelectedVariant(button);
    handleButtonClick(button);
  };

  // Function to open the modal with the selected item's details
  const openModal = (item) => {
    setSelectedItemForModal(item);
    setIsModalOpen(true);
  };

  // Mobile filter functions
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
        return `${(item[key] / item.plays).toFixed(2)}%`;
      case "threeStarPercentage":
        return `${item[key].toFixed(2)}%`;
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
        value: `${(item.tops / item.plays).toFixed(2)}%`,
        key: "tops",
      },
      {
        label: others?.winPercentage || "Win %",
        value: `${(item.wins / item.plays).toFixed(2)}%`,
        key: "wins",
      },
      {
        label: others?.threeStarsPercentage || "3⭐ %",
        value: `${item.threeStarPercentage.toFixed(2)}%`,
        key: "threeStarPercentage",
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
      <div className="bg-[#1a1a1a] border-t border-[#2D2F37]">
        <div className="grid grid-cols-3 gap-3 p-4">
          {filteredData.map((data, index) => (
            <div key={index} className="flex flex-col">
              <span className="text-xs text-gray-400 mb-1">{data.label}</span>
              <span className="text-sm text-white">{data.value}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center px-4">
          {/* Best Pairs */}
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 mb-2 text-center">
              {others?.best} {others?.pairs}
            </span>
            <div className="flex flex-wrap gap-1">
              {item?.bestPairs?.map((skillKey, index) => {
                const skill = skillTree.find(
                  (s) => s.key === skillKey || s.name === skillKey
                );
                if (!skill) return null;
                return (
                  <div key={`skill-${index}`} className="relative">
                    <SkillTreeImage
                      skill={skill}
                      size="medium"
                      tooltipId={`skill-${skill.key}-${index}`}
                      className="w-16 h-16"
                    />
                  </div>
                );
              })}
            </div>
          </div>
          {/* Top 3 Champions */}
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 mb-2 text-center">
              {others?.top3} {others?.champions}
            </span>
            <div className="flex gap-1">
              {item?.top3Champions?.map((champKey, index) => {
                const champion = champions.find(
                  (c) => c.key === champKey || c.name === champKey
                );
                if (!champion) return null;
                return (
                  <div key={`champ-${index}`} className="relative">
                    <CardImage
                      src={champion}
                      imgStyle="w-16 h-16"
                      identificationImageStyle="w-2 h-2"
                      textStyle="text-[6px] hidden"
                      cardSize="!w-16 !h-16"
                      forces={forces}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Show loading state for either comps data or skill tree data
  if (isLoading || isSkillTreeLoading) {
    return (
      <div className="pt-2 bg-[#111111] md:bg-transparent w-full">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D9A876]"></div>
          <span className="ml-3 text-white">Loading game data...</span>
        </div>
      </div>
    );
  }

  // Show error state for either comps data or skill tree data
  if (isError || isSkillTreeError) {
    const errorMessage = error || skillTreeError;
    const retryFunction = isError ? refetch : refetchSkillTree;

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

  return (
    <>
      <div className="pt-2 bg-[#111111] md:bg-transparent w-full">
        {/* Header section with filters and search */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-[#111111] md:bg-transparent px-2 sm:px-4 mb-2.5 md:mb-0">
          <div className="w-full sm:w-auto sm:mb-0">
            <TrendFilters
              buttons={uniqueVariants}
              imageButtons={imageButtonsUrls}
              onButtonClick={handleVariantClick}
            />
          </div>
          <div className="w-full sm:w-auto px-4 sm:px-0">
            <SearchBar
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              placeholder="Search skill..."
            />
          </div>
        </div>

        {/* Mobile Filter Buttons - Only visible on mobile */}
        <div className="block md:hidden mb-2">
          <div className="flex flex-col items-center gap-2 px-4">
            {/* All buttons in a single row since we only have 4 filters */}
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

        {/* Desktop Grid - Hidden on mobile */}
        <div className="hidden md:block projects-row">
          <div className="w-full">
            {/* Grid Header - Sticky */}
            <div
              className="grid bg-[#000000] sticky top-[110px] z-50 border-b border-[#2D2F37]"
              style={{
                gridTemplateColumns:
                  "60px 1.5fr 120px 120px 120px 120px 120px 160px 220px 160px",
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
                <p className="p-0 text-sm sm:text-base my-auto md:text-[16px] text-left flex items-center py-2 ml-[10px]">
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
                  sortConfig?.key === "threeStarPercentage"
                    ? "bg-[#2D2F37]"
                    : ""
                }`}
                onClick={() => requestSort("threeStarPercentage")}
              >
                <p className="p-0 text-sm sm:text-base my-auto md:text-[16px] text-left flex items-center py-2">
                  {others?.threeStarsPercentage}
                  <span className="ml-2">
                    {renderSortIcon("threeStarPercentage")}
                  </span>
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
                <p className="p-0 text-sm sm:text-base md:text-[16px] text-center mb-0 py-2">
                  {others?.best} {others?.pairs}
                </p>
              </div>
              <div className="p-2 font-semibold text-white">
                <p className="p-0 text-sm sm:text-base md:text-[16px] text-center mb-0 py-2">
                  {others?.top3} {others?.champions}
                </p>
              </div>
              <div className="p-2 font-semibold text-white">
                <p className="p-0 text-sm sm:text-base md:text-[16px] text-center mb-0 py-2">
                  {others?.top3} {others?.comps}
                </p>
              </div>
            </div>

            {/* Grid Body */}
            <div className="bg-[#111111]">
              {metaDeckSkillTreeStatsData.map((item, index) => (
                <div
                  key={index}
                  className="grid bg-[#111111] hover:bg-[#2D2F37] transition-colors duration-200 border-b border-[#2D2F37]"
                  style={{
                    gridTemplateColumns:
                      "60px 1.5fr 120px 120px 120px 120px 120px 160px 220px 160px",
                  }}
                >
                  <div
                    className={`p-2 text-center flex items-center justify-center ${getCellClass("")}`}
                  >
                    <div className="text-center text-white">{index + 1}</div>
                  </div>
                  <div
                    className={`p-2 flex items-center ${getCellClass("key")}`}
                  >
                    <div className="flex justify-start items-center space-x-1 sm:space-x-2">
                      <SkillTreeImage
                        skill={skillTree?.find((i) => i?.key === item?.key)}
                        size="medium"
                        tooltipId={`${item?.key}-${index}`}
                        className="w-14 h-14 md:w-20 md:h-20"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="p-0 text-sm sm:text-sm md:text-base mb-1 md:mb-2 text-[#fff] truncate">
                          {items.find((i) => i.key === item.key)?.name ||
                            item.name}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`p-2 flex items-center ${getCellClass("avgPlacement")}`}
                  >
                    <p className="p-0 text-left text-base md:text-lg mb-0 whitespace-nowrap">
                      <ColoredValue value={item?.avgPlacement} prefix="#" />
                    </p>
                  </div>
                  <div
                    className={`p-2 flex items-center ${getCellClass("tops")}`}
                  >
                    <p className="p-0 text-left text-base md:text-lg mb-0 text-[#fff]">
                      {(item?.tops / item?.plays).toFixed(2)}%
                    </p>
                  </div>
                  <div
                    className={`p-2 flex items-center ${getCellClass("wins")}`}
                  >
                    <p className="p-0 text-left text-base md:text-lg mb-0 text-[#fff]">
                      {(item?.wins / item?.plays).toFixed(2)}%
                    </p>
                  </div>
                  <div
                    className={`p-2 flex items-center ${getCellClass("threeStarPercentage")}`}
                  >
                    <p className="p-0 text-left text-base md:text-lg mb-0 text-[#fff]">
                      {item?.threeStarPercentage.toFixed(2)}%
                    </p>
                  </div>
                  <div
                    className={`p-2 flex items-center ${getCellClass("plays")}`}
                  >
                    <p className="p-0 text-left text-base md:text-lg mb-0 text-[#fff]">
                      {item?.plays.toLocaleString("en-US")}
                    </p>
                  </div>
                  <div className="p-2 flex items-center justify-center">
                    <div className="flex items-center justify-center flex-wrap gap-1">
                      {item?.bestPairs?.map((skillKey, index) => {
                        const skill = skillTree.find(
                          (s) => s.key === skillKey || s.name === skillKey
                        );
                        if (!skill) return null;
                        return (
                          <React.Fragment key={`skill-${index}`}>
                            <SkillTreeImage
                              skill={skill}
                              size="medium"
                              tooltipId={`skill-${skill.key}-${index}`}
                              className="w-12 h-12 md:w-14 md:h-14"
                            />
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                  <div className="p-2 flex items-center justify-center">
                    <div className="flex items-center justify-center flex-wrap gap-1">
                      {item?.top3Champions?.map((champKey, index) => {
                        const champion = champions.find(
                          (c) => c.key === champKey || c.name === champKey
                        );
                        if (!champion) return null;
                        return (
                          <React.Fragment key={`champ-${index}`}>
                            <CardImage
                              src={champion}
                              imgStyle="w-[68px] md:w-[84px]"
                              identificationImageStyle="w=[16px] md:w-[24px]"
                              textStyle="text-[10px] md:text-[16px] hidden"
                              cardSize="!w-[48px] !h-[48px] md:!w-[64px] md:!h-[64px]"
                              forces={forces}
                            />
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                  <div className="p-2 flex items-center justify-center">
                    <button
                      onClick={() => openModal(item)}
                      className="group flex items-center justify-center hover:scale-110 hover:translate-y-[-2px] gap-1.5 p-1 text-sm sm:text-base md:text-[16px] text-center text-[#D9A876] hover:text-[#F2A03D] transition-all duration-200 cursor-pointer w-full mx-auto relative"
                      title="View top comps"
                    >
                      <PiEye className="text-lg group-hover:scale-110 transition-all duration-200" />
                      <span className="truncate">
                        {/* {item?.top3Comps?.join(", ") || "N/A"} */}
                        {/* <GradientText
                          value={item?.top3Comps?.join(", ") || "N/A"}
                        /> */}
                      </span>
                      {/* <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-[#D9A876] group-hover:w-3/4 transition-all duration-300"></span> */}
                      <img
                        src="/images/rule_1_1.png"
                        alt="rule"
                        width={150}
                        height={150}
                        className="w-0 absolute -bottom-3 left-1/2 -translate-x-1/2 group-hover:w-1/3 transition-all duration-300"
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Table - Only visible on mobile */}
        <div className="block md:hidden">
          <div className="bg-[#111111]">
            {/* Mobile Table Header - Sticky */}
            <div
              className="grid gap-1 p-3 bg-[#1a1a1a] text-white font-semibold text-sm border-b border-[#2D2F37] sticky top-[100px] z-50"
              style={{ gridTemplateColumns: "8% 35% 15% 17% 22%" }}
            >
              <div className="text-center flex justify-center items-center">
                #
              </div>
              <div
                className={`cursor-pointer flex items-center ${sortConfig?.key === "key" ? "text-[#D9A876]" : ""}`}
                onClick={() => requestSort("key")}
              >
                Skill
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
              <div className="text-center flex justify-center items-center">
                Top 3 Comps
              </div>
            </div>

            {/* Mobile Table Body */}
            {metaDeckSkillTreeStatsData.map((item, index) => (
              <div key={index} className="border-b border-[#2D2F37]">
                {/* Main Row */}
                <div
                  className="grid gap-1 p-3 items-center cursor-pointer hover:bg-[#2D2F37] transition-colors duration-200"
                  style={{ gridTemplateColumns: "8% 35% 15% 17% 22%" }}
                  onClick={() => toggleRowExpansion(index)}
                >
                  {/* Serial No */}
                  <div className="text-center text-white font-medium">
                    {index + 1}
                  </div>

                  {/* Image & Name */}
                  <div className="flex items-center space-x-2 min-w-0">
                    <SkillTreeImage
                      skill={skillTree?.find((i) => i?.key === item?.key)}
                      size="large"
                      tooltipId={`${item?.key}`}
                      className="w-12 h-12 flex-shrink-0"
                    />
                    <ReactTltp
                      variant="item"
                      id={`${item?.key}`}
                      content={items.find((i) => i.key === item.key) || item}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-white text-sm truncate leading-tight mb-0">
                        {items.find((i) => i.key === item.key)?.name ||
                          item.name}
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

                  {/* Top 3 Comps */}
                  <div className="text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(item);
                      }}
                      className="group flex items-center justify-center gap-1 text-xs text-[#D9A876] hover:text-[#F2A03D] transition-all duration-200 cursor-pointer w-full"
                      title="View top comps"
                    >
                      <PiEye className="text-sm group-hover:scale-110 transition-all duration-200" />
                      <span>View</span>
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedRows.has(index) && renderExpandedContent(item)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Render the modal */}
      <CompsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedItem={selectedItemForModal}
        comps={metaDecks}
        champions={champions}
        items={items}
        forces={forces}
        skillTree={skillTree}
        traits={traits}
        others={others}
      />
    </>
  );
};

export default ProjectItems;

import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import "../../../../../i18n";
import "react-tooltip/dist/react-tooltip.css";
import TrendFilters from "src/components/trendFilters";
import { HiArrowSmUp, HiArrowSmDown } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import { PiEye } from "react-icons/pi";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { createPortal } from "react-dom";
import metaDeckSkillTreeStats from "../../../../data/newData/metaDeckSkillTree.json";
import Comps from "../../../../data/compsNew.json";
import Forces from "../../../../data/newData/force.json";
import ReactTltp from "src/components/tooltip/ReactTltp";
import CardImage from "src/components/cardImage";
import ScrollableTable from "src/utils/ScrollableTable";
import { OptimizedImage } from "../../../../utils/imageOptimizer";
import SearchBar from "src/components/searchBar";
import ColoredValue from "src/components/ColoredValue";
import ForceIcon from "src/components/forceIcon";
import CompsModal from "./CompsModal";
import GradientText from "src/components/gradientText/GradientText";

const ProjectItems = () => {
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
  const { metaDecks } = data?.metaDeckList;
  const { traits } = data?.refs;
  const { champions } = data?.refs;
  const { items } = data?.refs;
  const { forces } = data?.refs;
  const { skillTree } = data?.refs;

  console.log("skillTree", skillTree);

  const [metaDeckSkillTreeStatsData, setMetaDeckSkillTreeStatsData] = useState(
    metaDeckSkillTreeStats
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

  // Get unique variants from the skill tree data and prepare buttons and image URLs
  const uniqueVariants = [
    "All",
    ...new Set(metaDeckSkillTreeStats.map((item) => item.variant)),
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

  useEffect(() => {
    let sortedData = [...metaDeckSkillTreeStats];
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
    console.log("sortedData", sortedData);
    setMetaDeckSkillTreeStatsData(sortedData);
  }, [metaDeckSkillTreeStats, sortConfig]);

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
        ? metaDeckSkillTreeStats
        : metaDeckSkillTreeStats.filter((item) => item.variant === button);

    // Apply search filter on top of variant filter
    applySearchFilter(variantFiltered);
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

  // Update search filter whenever search value changes
  useEffect(() => {
    // Get the current filtered data based on selected variant
    const currentVariantFilter = selectedVariant;
    const variantFiltered =
      currentVariantFilter === "All"
        ? metaDeckSkillTreeStats
        : metaDeckSkillTreeStats.filter(
            (item) => item.variant === currentVariantFilter
          );

    // Apply search filter on top of variant filter
    applySearchFilter(variantFiltered);
  }, [searchValue, selectedVariant, metaDeckSkillTreeStats, applySearchFilter]);

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

        {/* Table section */}
        <div className="projects-row overflow-auto">
          <ScrollableTable>
            <table className="w-full min-w-[1300px] relative lg:border-separate lg:border-spacing-y-2">
              <thead className="sticky top-0 z-50">
                <tr className="bg-[#000000]">
                  <th className="lg:rounded-l-lg p-2 font-semibold w-[50px]">
                    <p className="p-0 text-sm sm:text-base !mx-2 my-2 md:text-[16px]">
                      {others.rank}
                    </p>
                  </th>
                  <th
                    className={`cursor-pointer p-2 font-semibold min-w-[200px] sm:min-w-[220px] md:min-w-[200px] ${sortConfig?.key === "key" ? "bg-[#2D2F37]" : ""}`}
                    onClick={() => requestSort("key")}
                  >
                    <p className="p-0 text-sm sm:text-base my-auto md:text-[16px] text-left flex items-center">
                      {others.items}
                      <span className="ml-2">{renderSortIcon("key")}</span>
                    </p>
                  </th>
                  <th
                    className={`cursor-pointer p-2 font-semibold min-w-[80px] sm:min-w-[90px] ${sortConfig?.key === "avgPlacement" ? "bg-[#2D2F37]" : ""}`}
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
                    className={`cursor-pointer p-2 font-semibold min-w-[80px] sm:min-w-[90px] ${sortConfig?.key === "tops" ? "bg-[#2D2F37]" : ""}`}
                    onClick={() => requestSort("tops")}
                  >
                    <p className="p-0 text-sm sm:text-base my-auto md:text-[16px] text-left flex items-center">
                      {others.top4}
                      <span className="ml-2">{renderSortIcon("tops")}</span>
                    </p>
                  </th>
                  <th
                    className={`cursor-pointer p-2 font-semibold min-w-[80px] sm:min-w-[90px] ${sortConfig?.key === "wins" ? "bg-[#2D2F37]" : ""}`}
                    onClick={() => requestSort("wins")}
                  >
                    <p className="p-0 text-sm sm:text-base my-auto md:text-[16px] text-left flex items-center">
                      {others.winPercentage}
                      <span className="ml-2">{renderSortIcon("wins")}</span>
                    </p>
                  </th>
                  <th
                    className={`cursor-pointer p-2 font-semibold min-w-[80px] sm:min-w-[90px] ${sortConfig?.key === "threeStarPercentage" ? "bg-[#2D2F37]" : ""}`}
                    onClick={() => requestSort("threeStarPercentage")}
                  >
                    <p className="p-0 text-sm sm:text-base my-auto md:text-[16px] text-left flex items-center">
                      {others.threeStarsPercentage}
                      <span className="ml-2">
                        {renderSortIcon("threeStarPercentage")}
                      </span>
                    </p>
                  </th>
                  <th
                    className={`cursor-pointer p-2 font-semibold min-w-[80px] sm:min-w-[90px] ${sortConfig?.key === "plays" ? "bg-[#2D2F37]" : ""}`}
                    onClick={() => requestSort("plays")}
                  >
                    <p className="p-0 text-sm sm:text-base my-auto md:text-[16px] text-left flex items-center">
                      {others.played}
                      <span className="ml-2">{renderSortIcon("plays")}</span>
                    </p>
                  </th>
                  <th className="p-2 font-semibold min-w-[140px]">
                    <p className="p-0 text-sm sm:text-base !mx-2 my-2 md:text-[16px] text-center">
                      {others.top3} {others.champions}
                    </p>
                  </th>
                  <th className="p-2 font-semibold min-w-[140px]">
                    <p className="p-0 text-sm sm:text-base !mx-2 my-2 md:text-[16px] text-center">
                      {others.best} {others.pairs}
                    </p>
                  </th>
                  <th className="lg:rounded-r-lg p-2 font-semibold min-w-[140px]">
                    <p className="p-0 text-sm sm:text-base !mx-2 my-2 md:text-[16px] text-center">
                      {others.top3} {others.comps}
                    </p>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-[#111111]">
                {console.log(
                  "metaDeckSkillTreeStatsData",
                  metaDeckSkillTreeStatsData
                )}
                {metaDeckSkillTreeStatsData.map((item, index) => (
                  <tr
                    className="m-2 hover:bg-[#2D2F37] transition-colors duration-200 md:border-[1px] md:border-[#2D2F37]"
                    key={index}
                  >
                    <td className="p-2 lg:rounded-l-lg">
                      <div className="text-center text-base">{index + 1}</div>
                    </td>
                    <td className={`p-2 ${getCellClass("key")}`}>
                      <div>
                        <div className="flex justify-start items-center space-x-1 sm:space-x-2">
                          <>
                            <OptimizedImage
                              src={
                                items?.find((i) => i?.key === item?.key)
                                  ?.imageUrl || item?.imageUrl
                              }
                              alt="icon"
                              width={80}
                              height={80}
                              className="w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] md:w-[84px] md:h-[84px] !border !border-[#ffffff60] rounded-md flex-shrink-0"
                              data-tooltip-id={`${item?.key}`}
                            />
                            <ReactTltp
                              variant="item"
                              id={`${item?.key}`}
                              content={
                                items.find((i) => i.key === item.key) || item
                              }
                            />
                          </>
                          <div className="min-w-0 flex-1">
                            <p className="p-0 text-sm sm:text-sm md:text-base mb-1 md:mb-2 text-[#fff] truncate max-w-[90px] sm:max-w-[150px] md:max-w-full">
                              {items.find((i) => i.key === item.key)?.name ||
                                item.name}
                            </p>
                            <div className="flex items-center flex-wrap gap-1">
                              {items
                                .find((i) => i.key === item.key)
                                ?.compositions?.map((comp, index) => {
                                  const compItem = items.find(
                                    (i) => i.key === comp
                                  );
                                  if (!compItem) return null;
                                  return (
                                    <React.Fragment key={index}>
                                      <OptimizedImage
                                        alt="Item Image"
                                        width={80}
                                        height={80}
                                        src={compItem.imageUrl}
                                        className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 !border !border-[#ffffff60] rounded-md"
                                        data-tooltip-id={`${compItem.key}_${index}`}
                                      />
                                      {index === 0 && (
                                        <span className="mx-1">+</span>
                                      )}
                                      <ReactTltp
                                        variant="item"
                                        id={`${compItem.key}_${index}`}
                                        content={compItem}
                                      />
                                    </React.Fragment>
                                  );
                                })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className={`p-2 ${getCellClass("avgPlacement")}`}>
                      <p className="p-0 text-sm sm:text-base md:text-[16px] mb-0 text-[#fff] whitespace-nowrap">
                        <ColoredValue value={item?.avgPlacement} prefix="#" />
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
                    <td
                      className={`p-2 ${getCellClass("threeStarPercentage")}`}
                    >
                      <p className="p-0 text-base sm:text-base md:text-[16px] mb-0 text-[#fff]">
                        {(item?.threeStarPercentage * 100).toFixed(2)}%
                      </p>
                    </td>
                    <td className={`p-2 ${getCellClass("plays")}`}>
                      <p className="p-0 text-base sm:text-base md:text-[16px] mb-0 text-[#fff]">
                        {item?.plays.toLocaleString("en-US")}
                      </p>
                    </td>
                    <td className="p-2 font-semibold min-w-[140px]">
                      <div className="flex items-center justify-center flex-wrap gap-1">
                        {item?.top3Champions?.map((champKey, index) => {
                          const champion = champions.find(
                            (c) => c.key === champKey || c.name === champKey
                          );
                          if (!champion) return null;
                          console.log("champion", champion);
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
                    </td>
                    <td className="p-2 font-semibold min-w-[140px]">
                      <div className="flex items-center justify-center flex-wrap gap-1">
                        {item?.bestPairs?.map((skillKey, index) => {
                          const skill = skillTree.find(
                            (s) => s.key === skillKey || s.name === skillKey
                          );
                          if (!skill) return null;
                          return (
                            <React.Fragment key={`skill-${index}`}>
                              <OptimizedImage
                                alt={skill.name}
                                width={80}
                                height={80}
                                src={skill.imageUrl}
                                className="w-6 h-6 sm:w-8 sm:h-8 md:w-14 md:h-14"
                                data-tooltip-id={`skill-${skill.key}-${index}`}
                              />
                              <ReactTltp
                                variant="skillTree"
                                id={`skill-${skill.key}-${index}`}
                                content={skill}
                              />
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </td>
                    <td className="p-2 font-semibold min-w-[120px]">
                      <button
                        onClick={() => openModal(item)}
                        className="group flex items-center justify-center hover:scale-110 hover:translate-y-[-2px] gap-1.5 p-1 text-sm sm:text-base md:text-[16px] text-center text-[#D9A876] hover:text-[#F2A03D] transition-all duration-200 cursor-pointer w-full mx-auto relative"
                        title="View top comps"
                      >
                        <PiEye className="text-lg group-hover:scale-110 transition-all duration-200" />
                        <span className="truncate">
                          {/* {item?.top3Comps?.join(", ") || "N/A"} */}
                          <GradientText
                            value={item?.top3Comps?.join(", ") || "N/A"}
                          />
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollableTable>
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

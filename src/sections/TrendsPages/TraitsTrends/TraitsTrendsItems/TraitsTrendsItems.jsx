import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import "../../../../../i18n";
import CardImage from "src/components/cardImage";
import "react-tooltip/dist/react-tooltip.css";
import TrendFilters from "src/components/trendFilters";
import { HiArrowSmUp, HiArrowSmDown } from "react-icons/hi";
import metaDeckTraitStats from "../../../../data/newData/metaDeckTraits.json";
import Comps from "../../../../data/compsNew.json";
import ReactTltp from "src/components/tooltip/ReactTltp";
import ScrollableTable from "src/utils/ScrollableTable";
import { OptimizedImage } from "../../../../utils/imageOptimizer";
import SearchBar from "src/components/searchBar";

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
          <div>
            <ScrollableTable>
              <table className="w-full min-w-[900px] relative lg:border-separate lg:border-spacing-y-2">
                <thead className="sticky top-0 z-50">
                  <tr className="bg-[#00000099]">
                    <th className="lg:rounded-l-lg p-2 font-semibold">
                      <p className="p-0 text-sm sm:text-base !mx-2 my-2 md:text-[16px]">
                        {others.rank}
                      </p>
                    </th>
                    <th
                      className={`cursor-pointer p-2 font-semibold ${sortConfig?.key === "key" ? "bg-[#2D2F37]" : ""}`}
                      onClick={() => requestSort("key")}
                    >
                      <p className="p-0 text-sm sm:text-base my-auto md:text-[16px] text-left flex items-center">
                        {others.traits}
                        <span className="ml-2">{renderSortIcon("key")}</span>
                      </p>
                    </th>
                    <th
                      className={`cursor-pointer p-2 font-semibold ${sortConfig?.key === "avgPlacement" ? "bg-[#2D2F37]" : ""}`}
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
                      className={`cursor-pointer p-2 font-semibold ${sortConfig?.key === "tops" ? "bg-[#2D2F37]" : ""}`}
                      onClick={() => requestSort("tops")}
                    >
                      <p className="p-0 text-sm sm:text-base my-auto md:text-[16px] text-left flex items-center">
                        {others.top4}
                        <span className="ml-2">{renderSortIcon("tops")}</span>
                      </p>
                    </th>
                    <th
                      className={`cursor-pointer p-2 font-semibold ${sortConfig?.key === "wins" ? "bg-[#2D2F37]" : ""}`}
                      onClick={() => requestSort("wins")}
                    >
                      <p className="p-0 text-sm sm:text-base my-auto md:text-[16px] text-left flex items-center">
                        {others.winPercentage}
                        <span className="ml-2">{renderSortIcon("wins")}</span>
                      </p>
                    </th>
                    <th
                      className={`cursor-pointer p-2 font-semibold ${sortConfig?.key === "pickRate" ? "bg-[#2D2F37]" : ""}`}
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
                      className={`cursor-pointer p-2 font-semibold ${sortConfig?.key === "plays" ? "bg-[#2D2F37]" : ""}`}
                      onClick={() => requestSort("plays")}
                    >
                      <p className="p-0 text-sm sm:text-base my-auto md:text-[16px] text-left flex items-center">
                        {others.played}
                        <span className="ml-2">{renderSortIcon("plays")}</span>
                      </p>
                    </th>
                    <th className="p-2 font-semibold">
                      {others.top3} {others.champions}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[#111111]">
                  {metaDeckTraitStatsData.map((metaTrait, index) => (
                    <tr
                      className={`m-2 hover:bg-[#2D2F37] transition-colors duration-200 md:border-[1px] md:border-[#2D2F37]`}
                      key={index}
                    >
                      <td className="p-2 lg:rounded-l-lg">
                        <div className="text-center text-base">{index + 1}</div>
                      </td>
                      <td className={`p-2 ${getCellClass("key")}`}>
                        <div>
                          <div className="flex justify-start items-center">
                            <OptimizedImage
                              src={
                                traits?.find((t) => t?.key === metaTrait?.key)
                                  ?.imageUrl
                              }
                              alt="icon"
                              width={80}
                              height={80}
                              className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 mr-2 rounded-md"
                              data-tooltip-id={metaTrait?.key}
                            />
                            <ReactTltp
                              variant="trait"
                              id={metaTrait?.key}
                              content={traits?.find(
                                (trait) => trait?.key === metaTrait?.key
                              )}
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
                          #{metaTrait?.avgPlacement}
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
                      <td className="p-2 lg:rounded-r-lg">
                        <div className="flex flex-wrap justify-center items-center gap-1 md:gap-2">
                          {metaTrait?.traitChampionStats
                            ?.slice(0, 3)
                            ?.map((champion, idx) => (
                              <div key={idx}>
                                <CardImage
                                  src={champions?.find(
                                    (champ) => champ?.key === champion
                                  )}
                                  imgStyle="w-[40px] sm:w-[60px] md:w-[84px]"
                                  identificationImageStyle="w-[12px] sm:w-[16px] md:w-[32px]"
                                  textStyle="text-[8px] sm:text-[10px] md:text-[12px]"
                                  forces={forces}
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
        </div>
      </div>
    </>
  );
};

export default ProjectItems;

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import "../../../../../i18n";
import CardImage from "src/components/cardImage";
import "react-tooltip/dist/react-tooltip.css";
import TrendFilters from "src/components/trendFilters";
import { FaSortAmountDownAlt, FaSortAmountUp } from "react-icons/fa";
import metaDeckTraitStats from "../../../../data/newData/metaDeckTraits.json";
import Comps from "../../../../data/compsNew.json";
import ReactTltp from "src/components/tooltip/ReactTltp";
import ScrollableTable from "src/utils/ScrollableTable";

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

  return (
    <>
      <div className="pt-2 bg-[#1a1b31] md:bg-transparent w-full">
        {/* Header section with filters and search */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-[#1a1b31] md:bg-transparent pb-2.5 px-2 sm:px-4">
          <div className="w-full sm:w-auto mb-3 sm:mb-0 overflow-x-auto sm:overflow-visible">
            <TrendFilters
              buttons={["All", "Bronze", "Silver", "Gold", "Prismatic"]}
              onButtonClick={handleButtonClick}
            />
          </div>
          <div className="w-full sm:w-auto px-4 sm:px-0">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="bg-[#222231] w-full text-[#fff] border-[#ffffff80] border-[1px] rounded-[4px] hover:border-[#ffffff60] hover:shadow-lg transition-all duration-300 ease-in-out sm:w-[180px] md:w-[200px] lg:w-[250px] h-[40px] px-[10px] text-[14px] sm:text-[16px] placeholder-[#fff]"
              placeholder="Search..."
            />
          </div>
        </div>

        {/* Table section */}
        <div className="projects-row overflow-auto">
          <div>
            <ScrollableTable>
              <table className="w-full min-w-[900px] relative lg:border-separate lg:border-spacing-y-2">
                <thead className="sticky top-0 z-50">
                  <tr className="bg-[#1a1b31]">
                    <th className="lg:rounded-l-lg p-2">
                      <p className="p-0 text-sm sm:text-base !mx-2 my-2 md:text-[16px]">
                        {others.rank}
                      </p>
                    </th>
                    <th
                      className={`cursor-pointer p-2 ${sortConfig?.key === "key" ? "bg-[#000000]" : ""}`}
                      onClick={() => requestSort("key")}
                    >
                      <p className="cursor-pointer mb-0 text-sm sm:text-base flex items-center">
                        {others?.traits}
                        <span className="ml-2">
                          {sortConfig?.key === "key" ? (
                            sortConfig.direction === "ascending" ? (
                              <FaSortAmountUp />
                            ) : (
                              <FaSortAmountDownAlt />
                            )
                          ) : null}
                        </span>
                      </p>
                    </th>
                    <th
                      className={`cursor-pointer p-2 ${sortConfig?.key === "avgPlacement" ? "bg-[#000000]" : ""}`}
                      onClick={() => requestSort("avgPlacement")}
                    >
                      <p className="cursor-pointer mb-0 text-sm sm:text-base flex items-center">
                        {others?.avgRank}
                        <span className="ml-2">
                          {sortConfig?.key === "avgPlacement" ? (
                            sortConfig.direction === "ascending" ? (
                              <FaSortAmountUp />
                            ) : (
                              <FaSortAmountDownAlt />
                            )
                          ) : null}
                        </span>
                      </p>
                    </th>
                    <th
                      className={`cursor-pointer p-2 ${sortConfig?.key === "tops" ? "bg-[#000000]" : ""}`}
                      onClick={() => requestSort("tops")}
                    >
                      <p className="cursor-pointer mb-0 text-sm sm:text-base flex items-center">
                        {others?.top4}
                        <span className="ml-2">
                          {sortConfig?.key === "tops" ? (
                            sortConfig.direction === "ascending" ? (
                              <FaSortAmountUp />
                            ) : (
                              <FaSortAmountDownAlt />
                            )
                          ) : null}
                        </span>
                      </p>
                    </th>
                    <th
                      className={`cursor-pointer p-2 ${sortConfig?.key === "wins" ? "bg-[#000000]" : ""}`}
                      onClick={() => requestSort("wins")}
                    >
                      <p className="cursor-pointer mb-0 text-sm sm:text-base flex items-center">
                        {others?.winPercentage}
                        <span className="ml-2">
                          {sortConfig?.key === "wins" ? (
                            sortConfig.direction === "ascending" ? (
                              <FaSortAmountUp />
                            ) : (
                              <FaSortAmountDownAlt />
                            )
                          ) : null}
                        </span>
                      </p>
                    </th>
                    <th
                      className={`cursor-pointer p-2 ${sortConfig?.key === "pickRate" ? "bg-[#000000]" : ""}`}
                      onClick={() => requestSort("pickRate")}
                    >
                      <p className="cursor-pointer mb-0 text-sm sm:text-base flex items-center">
                        {others?.pickPercentage}
                        <span className="ml-2">
                          {sortConfig?.key === "pickRate" ? (
                            sortConfig.direction === "ascending" ? (
                              <FaSortAmountUp />
                            ) : (
                              <FaSortAmountDownAlt />
                            )
                          ) : null}
                        </span>
                      </p>
                    </th>
                    <th
                      className={`cursor-pointer p-2 ${sortConfig?.key === "plays" ? "bg-[#000000]" : ""}`}
                      onClick={() => requestSort("plays")}
                    >
                      <p className="cursor-pointer mb-0 text-sm sm:text-base flex items-center">
                        {others?.played}
                        <span className="ml-2">
                          {sortConfig?.key === "plays" ? (
                            sortConfig.direction === "ascending" ? (
                              <FaSortAmountUp />
                            ) : (
                              <FaSortAmountDownAlt />
                            )
                          ) : null}
                        </span>
                      </p>
                    </th>
                    <th className="p-2 lg:rounded-r-lg">
                      <p className="p-0 text-sm sm:text-base text-center !mx-2 my-2 md:text-[16px]">
                        {others?.top3} {others?.champions}
                      </p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {metaDeckTraitStatsData.map((metaTrait, index) => (
                    <tr
                      className="m-2 bg-[#1a1b31] hover:bg-[#292a4ae0] transition-colors duration-200"
                      key={index}
                    >
                      <td className="p-2 lg:rounded-l-lg">
                        <div className="text-center text-base">{index + 1}</div>
                      </td>
                      <td className="p-2">
                        <div>
                          <div className="flex justify-start items-center">
                            <Image
                              src={
                                traits
                                  ?.find(
                                    (trait) => trait?.key === metaTrait?.key
                                  )
                                  ?.tiers?.find(
                                    (tier) => tier?.tier == metaTrait?.tier
                                  )?.imageUrl
                              }
                              width={80}
                              height={80}
                              className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 mr-2 rounded-md"
                              alt="icon"
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
                      <td className="p-2">
                        <p className="p-0 text-left text-base sm:text-base md:text-lg mb-0 text-[#fff]">
                          #{metaTrait?.avgPlacement}
                        </p>
                      </td>
                      <td className="p-2">
                        <p className="p-0 text-left text-base sm:text-base md:text-lg mb-0 text-[#fff]">
                          {((metaTrait?.tops * 100) / metaTrait?.plays).toFixed(
                            2
                          )}
                          %
                        </p>
                      </td>
                      <td className="p-2">
                        <p className="p-0 text-left text-base sm:text-base md:text-lg mb-0 text-[#fff]">
                          {((metaTrait?.wins * 100) / metaTrait?.plays).toFixed(
                            2
                          )}
                          %
                        </p>
                      </td>
                      <td className="p-2">
                        <p className="p-0 text-left text-base sm:text-base md:text-lg mb-0 text-[#fff]">
                          {(metaTrait?.pickRate * 100).toFixed(2)}%
                        </p>
                      </td>
                      <td className="p-2">
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

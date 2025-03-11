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
    // <ProjectItemsStyleWrapper>
    <>
      <div className="pt-2 bg-[#1a1b31] md:bg-transparent">
        <div className="md:flex md:justify-between md:items-center bg-[#1a1b31] md:bg-transparent">
          <TrendFilters
            buttons={["All", "Bronze", "Silver", "Gold", "Prismatic"]}
            onButtonClick={handleButtonClick}
          />
          <div className="mb-2 md:mb-0 px-2">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="bg-[#222231] w-full text-[#fff] border-[#ffffff80] border-[1px] rounded-[4px] hover:border-[#ffffff60] hover:shadow-lg transition-all duration-300 ease-in-out md:w-[200px] h-[40px] px-[10px] text-[16px] placeholder-[#fff] placeholder-[16px] md:mt-0"
              placeholder="Search..."
            />
          </div>
        </div>
        <div className="projects-row overflow-auto md:overflow-hidden">
          <div>
            <ScrollableTable>
              <table className="w-[900px] md:w-full table-auto md:border-separate md:border-spacing-y-2">
                <tr className="bg-[#1a1b31]">
                  <th className="md:rounded-l-lg">
                    <p className="p-0 text-sm !mx-2 my-2 md:text-[14px]">
                      {others.rank}
                    </p>
                  </th>
                  <th
                    className={`cursor-pointer ${sortConfig?.key === "key" ? "" : ""}`}
                    onClick={() => requestSort("key")}
                  >
                    <p className="cursor-pointer mb-0">
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
                    className={`cursor-pointer ${sortConfig?.key === "avgPlacement" ? "" : ""}`}
                    onClick={() => requestSort("avgPlacement")}
                  >
                    <p className="cursor-pointer mb-0">
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
                    className={`cursor-pointer ${sortConfig?.key === "tops" ? "" : ""}`}
                    onClick={() => requestSort("tops")}
                  >
                    <p className="cursor-pointer mb-0">
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
                    className={`cursor-pointer ${sortConfig?.key === "wins" ? "" : ""}`}
                    onClick={() => requestSort("wins")}
                  >
                    <p className="cursor-pointer mb-0">
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
                    className={`cursor-pointer ${sortConfig?.key === "pickRate" ? "" : ""}`}
                    onClick={() => requestSort("pickRate")}
                  >
                    <p className="cursor-pointer mb-0">
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
                    className={`cursor-pointer ${sortConfig?.key === "plays" ? "" : ""}`}
                    onClick={() => requestSort("plays")}
                  >
                    <p className="cursor-pointer mb-0">
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
                  <th className="th10 md:rounded-r-lg">
                    <p className="p-0 text-sm text-center !mx-2 my-2 md:text-[16px]">
                      {others?.top3} {others?.champions}
                    </p>
                  </th>
                </tr>
                {metaDeckTraitStatsData.map((metaTrait, index) => (
                  <tr className="m-2 bg-[#1a1b31] hover:bg-[#292a4ae0]">
                    <td className="md:rounded-l-lg">
                      <div className="text-center">{index + 1}</div>
                    </td>
                    <td className="py-2">
                      <div>
                        <div className="flex justify-start items-center">
                          <Image
                            src={
                              traits
                                ?.find((trait) => trait?.key === metaTrait?.key)
                                ?.tiers?.find(
                                  (tier) => tier?.tier == metaTrait?.tier
                                )?.imageUrl
                            }
                            width={80}
                            height={80}
                            className="w-20 md:w-20 mr-2"
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
                            <p className="p-0 !text-md md:!text-xl text-[#fff] mb-0">
                              {
                                traits?.find(
                                  (trait) => trait?.key === metaTrait?.key
                                )?.name
                              }
                            </p>
                            <p className="m-0 text-xs font-extralight">
                              {/* <div className="text-center">
                              {Object.entries(
                                traits?.find(
                                  (trait) => trait?.key === metaTrait?.key
                                ).stats
                              ).map(([key, value], index) => (
                                <span
                                  className={`py-1 rounded-full text-[#fff] text-sm ${key === traits?.find((trait) => trait?.key === metaTrait?.key)?.styles?.find((style) => style?.min)}`}
                                >
                                  {key}
                                  {index <
                                  Object.keys(
                                    traits?.find(
                                      (trait) => trait?.key === metaTrait?.key
                                    ).stats
                                  ).length -
                                    1
                                    ? "/"
                                    : ""}
                                </span>
                              ))}
                            </div> */}
                            </p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2">
                      <p className="p-0 text-left text-sm md:text-lg mb-0 text-[#fff]">
                        #{metaTrait?.avgPlacement}
                      </p>
                    </td>
                    <td className="py-2">
                      <p className="p-0 text-left text-sm md:text-lg mb-0 text-[#fff]">
                        {((metaTrait?.tops * 100) / metaTrait?.plays).toFixed(
                          2
                        )}
                        %
                      </p>
                    </td>
                    <td className="py-2">
                      <p className="p-0 text-left text-sm md:text-lg mb-0 text-[#fff]">
                        {((metaTrait?.wins * 100) / metaTrait?.plays).toFixed(
                          2
                        )}
                        %
                      </p>
                    </td>
                    <td className="py-2">
                      <p className="p-0 text-left text-sm md:text-lg mb-0 text-[#fff]">
                        {(metaTrait?.pickRate * 100).toFixed(2)}%
                      </p>
                    </td>
                    <td className="py-2">
                      <p className="p-0 text-left text-sm md:text-lg mb-0 text-[#fff]">
                        {metaTrait?.plays.toLocaleString("en-US")}
                      </p>
                    </td>
                    <td className="md:rounded-r-lg py-2">
                      <div className="flex justify-center items-center gap-1 md:gap-2">
                        {metaTrait?.traitChampionStats
                          ?.slice(0, 3)
                          ?.map((champion) => (
                            <>
                              <CardImage
                                src={champions?.find(
                                  (champ) => champ?.key === champion
                                )}
                                imgStyle="w-[72px] md:w-[84px]"
                                identificationImageStyle="w=[16px] md:w-[32px]"
                                textStyle="text-[10px] md:text-[12px]"
                                forces={forces}
                              />
                            </>
                          ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </table>
            </ScrollableTable>
          </div>
        </div>
      </div>
    </>
    // </ProjectItemsStyleWrapper>
  );
};

export default ProjectItems;

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../../../../../i18n";
import CardImage from "src/components/cardImage";
import { Tooltip } from "react-tooltip";
import nextArrowIcon from "@assets/images/icons/next-arrow.png";
import ProjectCard from "../TraitsTrendsCard/TraitsTrendsCard";
import ProjectItemsStyleWrapper from "./TraitsTrendsItems.style";
import projectsData from "@assets/data/projects/dataV6";
import indianWeapon from "@assets/image/items/weapons/indian weapon.png";
import TraitTooltip from "src/components/tooltip/TraitTooltip";
import "react-tooltip/dist/react-tooltip.css";
import GirlCrush from "@assets/image/traits/GirlCrush.svg";
import TrendFilters from "src/components/trendFilters";
import { FaSortAmountDownAlt, FaSortAmountUp } from "react-icons/fa";
import MetaDeckTraits from "../../../../data/trends/MetaDeckTraits.json";
import Comps from "../../../../data/compsNew.json";
import ReactTltp from "src/components/tooltip/ReactTltp";

const ProjectItems = () => {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const others = t("others");

  const { metaDeckTraitStats } = MetaDeckTraits?.metaDeckTrait;

  const [metaDeckTraitStatsData, setMetaDeckTraitStatsData] =
    useState(metaDeckTraitStats);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

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
    console.log("key", key);
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

  const handleButtonClick = (button) => {
    if (button === "All") {
      setMetaDeckTraitStatsData(metaDeckTraitStats);
    } else {
      console.log(metaDeckTraitStats[0], button);
      setMetaDeckTraitStatsData(
        metaDeckTraitStats.filter(
          (trait) => trait.level.toLowerCase() === button.toLowerCase()
        )
      );
    }
  };

  return (
    // <ProjectItemsStyleWrapper>
    <>
      <div className="container md:!max-w-[95%]">
        <br />
        <TrendFilters
          buttons={["All", "Bronze", "Silver", "Gold", "Prismatic"]}
          onButtonClick={handleButtonClick}
        />
        <div className="projects-row overflow-auto md:overflow-hidden">
          <div>
            <table className="w-[900px] md:w-full border-separate border-spacing-y-2">
              <tr>
                <th className="th1">
                  <p className="p-0 text-md text-center mb-0">#</p>
                </th>
                <th
                  className={`cursor-pointer ${sortConfig?.key === "key" ? "bg-[#000000]" : ""}`}
                  onClick={() => requestSort("key")}
                >
                  <p className="p-0 text-sm md:text-base mb-0 text-left py-4">
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
                  className={`cursor-pointer ${sortConfig?.key === "avgPlacement" ? "bg-[#000000]" : ""}`}
                  onClick={() => requestSort("avgPlacement")}
                >
                  <p className="p-0 text-sm md:text-base mb-0 text-left py-4">
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
                  className={`cursor-pointer ${sortConfig?.key === "tops" ? "bg-[#000000]" : ""}`}
                  onClick={() => requestSort("tops")}
                >
                  <p className="p-0 text-sm md:text-base mb-0 text-left py-4">
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
                  className={`cursor-pointer ${sortConfig?.key === "wins" ? "bg-[#000000]" : ""}`}
                  onClick={() => requestSort("wins")}
                >
                  <p className="p-0 text-sm md:text-base mb-0 text-left py-4">
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
                  className={`cursor-pointer ${sortConfig?.key === "pickRate" ? "bg-[#000000]" : ""}`}
                  onClick={() => requestSort("pickRate")}
                >
                  <p className="p-0 text-sm md:text-base mb-0 text-left py-4">
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
                  className={`cursor-pointer ${sortConfig?.key === "plays" ? "bg-[#000000]" : ""}`}
                  onClick={() => requestSort("plays")}
                >
                  <p className="p-0 text-sm md:text-base mb-0 text-left py-4">
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
                <th className="th10">
                  <p className="p-0 text-sm md:text-base mb-0 text-center py-4">
                    {others?.top3} {others?.champions}
                  </p>
                </th>
              </tr>
              {metaDeckTraitStatsData.map((metaTrait, index) => (
                <tr className="m-2 bg-[#1a1b31] hover:bg-[#292a4ae0]">
                  <td className="ml-2">
                    <div className="text-center">{index + 1}</div>
                  </td>
                  <td>
                    <div>
                      <div className="flex justify-start items-center">
                        <img
                          src={
                            traits
                              ?.find((trait) => trait?.key === metaTrait?.key)
                              ?.styles?.find(
                                (style) => style?.style === metaTrait?.level
                              )?.imageUrl
                          }
                          className="w-20 md:w-24 mr-2"
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
                            <div className="text-center">
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
                            </div>
                          </p>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className="p-0 text-left text-sm md:text-lg mb-0 text-[#fff]">
                      #{metaTrait?.avgPlacement}
                    </p>
                  </td>
                  <td>
                    <p className="p-0 text-left text-sm md:text-lg mb-0 text-[#fff]">
                      {((metaTrait?.tops * 100) / metaTrait?.plays).toFixed(2)}%
                    </p>
                  </td>
                  <td>
                    <p className="p-0 text-left text-sm md:text-lg mb-0 text-[#fff]">
                      {((metaTrait?.wins * 100) / metaTrait?.plays).toFixed(2)}%
                    </p>
                  </td>
                  <td>
                    <p className="p-0 text-left text-sm md:text-lg mb-0 text-[#fff]">
                      {(metaTrait?.pickRate * 100).toFixed(2)}%
                    </p>
                  </td>
                  <td>
                    <p className="p-0 text-left text-sm md:text-lg mb-0 text-[#fff]">
                      {metaTrait?.plays.toLocaleString("en-US")}
                    </p>
                  </td>
                  <td>
                    <div className="flex justify-center items-center gap-1 md:gap-2">
                      {metaTrait?.traitChampionStats
                        ?.slice(0, 3)
                        ?.map((champion) => (
                          <>
                            <CardImage
                              src={champions?.find(
                                (champ) => champ?.key === champion?.key
                              )}
                              imgStyle="w-[72px] md:w-[112px]"
                              identificationImageStyle="w=[16px] md:w-[32px]"
                              textStyle="text-[10px] md:text-[16px]"
                            />
                          </>
                        ))}
                    </div>
                  </td>
                </tr>
              ))}
            </table>
          </div>
        </div>
      </div>
    </>
    // </ProjectItemsStyleWrapper>
  );
};

export default ProjectItems;

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import "../../../../../i18n";
import "react-tooltip/dist/react-tooltip.css";
import ReactTltp from "src/components/tooltip/ReactTltp";
import { FaSortAmountDownAlt, FaSortAmountUp } from "react-icons/fa";
import metaDeckChampionsStats from "../../../../data/newData/metaDeckChampions.json";
import Comps from "../../../../data/compsNew.json";
import CardImage from "src/components/cardImage";
import TrendFilters from "src/components/trendFilters";

const ProjectItems = () => {
  const { t } = useTranslation();
  const others = t("others");

  const [metaDeckChampionsStatsData, setMetaDeckChampionsStatsData] = useState(
    metaDeckChampionsStats
  );
  const [searchValue, setSearchValue] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  useEffect(() => {
    let sortedData = [...metaDeckChampionsStatsData];
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
    setMetaDeckChampionsStatsData(sortedData);
  }, [metaDeckChampionsStats, sortConfig]);

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
  const { items } = data?.refs;
  const { forces } = data?.refs;

  const lookup = new Map(champions.map((champion) => [champion.key, champion]));

  // Merge objects from arr1 with matching objects from arr2
  const merged = metaDeckChampionsStats.map((champion) => {
    return { ...champion, ...(lookup.get(champion.key) || {}) };
  });

  const handleButtonClick = (button) => {
    console.log(button);
    if (button === "All") {
      setMetaDeckChampionsStatsData(metaDeckChampionsStats);
    } else {
      const filteredData = merged.filter((champion) => champion.cost == button);
      setMetaDeckChampionsStatsData(filteredData);
    }
  };

  useEffect(() => {
    const filteredData = merged.filter((champion) =>
      champion.key.toLowerCase().includes(searchValue.toLowerCase())
    );
    setMetaDeckChampionsStatsData(filteredData);
  }, [searchValue]);

  return (
    // <ProjectItemsStyleWrapper>
    <div className="pt-2">
      <div className="md:flex md:justify-between md:items-center">
        <div className="flex items-center mx-auto md:!ml-0 md:!mr-0 justify-center md:justify-start">
          <h1 className="text-[#fff] hidden md:block text-lg md:text-xl font-bold mb-0">
            Cost
          </h1>
          <TrendFilters
            buttons={["All", "1", "2", "3", "4", "5"]}
            onButtonClick={handleButtonClick}
          />
        </div>
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
      {/* <TrendFilters
        dropdown1={["v14.2", "v14.1"]}
        dropdown2={[
          "All Ranks",
          "Iron",
          "Bronze",
          "Silver",
          "Gold",
          "Platinum",
          "Diamond",
          "Master",
          "Grandmaster",
          "Challenger",
        ]}
      /> */}
      <div className="projects-row overflow-auto md:overflow-hidden">
        <div>
          <table className="w-[900px] md:w-full lg:border-separate lg:border-spacing-y-2">
            <tr className="bg-[#1a1b31]">
              <th className="lg:rounded-l-lg">
                <p className="p-0 text-sm !mx-2 my-2 md:text-[14px]">#</p>
              </th>
              <th
                className={`cursor-pointer ${sortConfig?.key === "key" ? "bg-[#000000]" : ""}`}
                onClick={() => requestSort("key")}
              >
                <p className="p-0 text-sm my-auto md:text-[16px] text-left">
                  {others.champion}
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
                <p className="p-0 text-sm my-auto md:text-[16px] text-left">
                  {others.avgRank}
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
                <p className="p-0 text-sm my-auto md:text-[16px] text-left">
                  {others.top4}
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
                <p className="p-0 text-sm my-auto md:text-[16px] text-left">
                  {others.winPercentage}
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
                <p className="p-0 text-sm my-auto md:text-[16px] text-left">
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
                <p className="p-0 text-sm my-auto md:text-[16px] text-left">
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
              <th>
                <p className="p-0 text-sm my-auto md:text-[16px] text-left">
                  {others?.threeStarsPercentage}
                </p>
              </th>
              <th>
                <p className="p-0 text-sm my-auto md:text-[16px] text-left">
                  {others?.threeStarsRank}
                </p>
              </th>
              <th className="lg:rounded-r-lg">
                <p className="p-0 text-sm my-auto md:text-[16px] text-left">
                  {others?.recommended} {others.items}
                </p>
              </th>
            </tr>
            {metaDeckChampionsStatsData.map(
              (champion, index) =>
                champions.find((champ) => champ.key === champion.key)?.key && (
                  <tr
                    className="m-2 bg-[#1a1b31] hover:bg-[#292a4ae0]"
                    key={index}
                  >
                    <td className="ml-2 lg:rounded-l-lg">
                      <div className="text-center">{index + 1}</div>
                    </td>
                    <td className="py-0.5 md:py-2">
                      <div>
                        <div className="flex justify-start items-center">
                          <CardImage
                            src={champions.find(
                              (champ) => champ.key === champion.key
                            )}
                            imgStyle="w-[68px] md:w-[84px]"
                            identificationImageStyle="w=[16px] md:w-[32px]"
                            textStyle="text-[10px] md:text-[16px] hidden"
                            forces={forces}
                          />
                          <p className="p-0 text-left text-sm md:text-xl mb-0 ml-2 text-[#fff]">
                            {
                              champions.find(
                                (champ) => champ.key === champion.key
                              )?.key
                            }
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-0.5 md:py-2">
                      <p className="p-0 text-left text-sm md:text-lg mb-0 text-[#fff]">
                        #{champion?.avgPlacement}
                      </p>
                    </td>
                    <td className="py-0.5 md:py-2">
                      <p className="p-0 text-left text-sm md:text-lg mb-0 text-[#fff]">
                        {((champion?.tops * 100) / champion?.plays).toFixed(2)}%
                      </p>
                    </td>
                    <td className="py-0.5 md:py-2">
                      <p className="p-0 text-left text-sm md:text-lg mb-0 text-[#fff]">
                        {((champion?.wins * 100) / champion?.plays).toFixed(2)}%
                      </p>
                    </td>
                    <td className="py-0.5 md:py-2">
                      <p className="p-0 text-left text-sm md:text-lg mb-0 text-[#fff]">
                        {(champion?.pickRate * 100).toFixed(2)}%
                      </p>
                    </td>
                    <td className="py-0.5 md:py-2">
                      <p className="p-0 text-left text-sm md:text-lg mb-0 text-[#fff]">
                        {champion?.plays.toLocaleString("en-US")}
                      </p>
                    </td>
                    <td className="py-0.5 md:py-2">
                      <p className="p-0 text-left text-sm md:text-lg mb-0 text-[#fff]">
                        {(champion?.threeStarPercentage * 100).toFixed(2)}%
                      </p>
                    </td>
                    <td className="py-0.5 md:py-2">
                      <p className="p-0 text-left text-sm md:text-lg mb-0 text-[#fff]">
                        #{(champion?.threeStarRank).toFixed(2)}
                      </p>
                    </td>
                    <td className="lg:rounded-r-lg">
                      <div className="flex justify-start items-center">
                        {champions
                          .find((champ) => champ.key === champion.key)
                          ?.recommendItems.map(
                            (item) =>
                              items.find(
                                (i) =>
                                  i.key ===
                                  item?.split("_")[item?.split("_").length - 1]
                              )?.imageUrl
                            // item?.split("_")[item?.split("_").length - 1]
                          )
                          .map(
                            (item) =>
                              item && (
                                <>
                                  <Image
                                    src={item}
                                    alt="icon"
                                    width={80}
                                    height={80}
                                    className="w-12 md:w-16 mr-2 rounded-lg shadow-md !border !border-[#ffffff50]"
                                    data-tooltip-id={item}
                                  />
                                  <ReactTltp
                                    variant="item"
                                    id={item}
                                    content={items.find(
                                      (i) => i.imageUrl === item
                                    )}
                                  />
                                </>
                              )
                          )}
                      </div>
                    </td>
                  </tr>
                )
            )}
          </table>
        </div>
      </div>
    </div>
    // </ProjectItemsStyleWrapper>
  );
};

export default ProjectItems;

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import "../../../../../i18n";
import "react-tooltip/dist/react-tooltip.css";
import ReactTltp from "src/components/tooltip/ReactTltp";
import { HiArrowSmUp, HiArrowSmDown } from "react-icons/hi";
import metaDeckChampionsStats from "../../../../data/newData/metaDeckChampions.json";
import Comps from "../../../../data/compsNew.json";
import CardImage from "src/components/cardImage";
import TrendFilters from "src/components/trendFilters";
import ScrollableTable from "src/utils/ScrollableTable";
import { OptimizedImage } from "../../../../utils/imageOptimizer";
import SearchBar from "src/components/searchBar";
import ColoredValue from "src/components/ColoredValue";

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
    // <ProjectItemsStyleWrapper>
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
        <div className="mb-2 md:mb-0 px-4">
          <SearchBar
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            placeholder="Search champion..."
          />
        </div>
      </div>
      <div className="projects-row overflow-auto md:overflow-hidden">
        <ScrollableTable>
          <table className="w-[900px] md:w-full relative lg:border-separate lg:border-spacing-y-2">
            <thead className="sticky top-0 z-50">
              <tr className="bg-[#000000]">
                <th className="lg:rounded-l-lg">
                  <p className="p-0 text-base !mx-2 my-2 md:text-[16px]">
                    {others.rank}
                  </p>
                </th>
                <th
                  className={`cursor-pointer p-2 font-semibold ${sortConfig?.key === "key" ? "bg-[#2D2F37]" : ""}`}
                  onClick={() => requestSort("key")}
                >
                  <p className="p-0 text-sm sm:text-base my-auto md:text-[16px] text-left flex items-center">
                    {others.champions}
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
                    <span className="ml-2">{renderSortIcon("pickRate")}</span>
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
                <th>
                  <p className="p-0 text-base my-auto md:text-[16px] text-left">
                    {others?.threeStarsPercentage}
                  </p>
                </th>
                <th>
                  <p className="p-0 text-base my-auto md:text-[16px] text-left">
                    {others?.threeStarsRank}
                  </p>
                </th>
                <th className="lg:rounded-r-lg">
                  <p className="p-0 text-base my-auto md:text-[16px] text-left">
                    {others?.recommended} {others.items}
                  </p>
                </th>
              </tr>
            </thead>
            {metaDeckChampionsStatsData.map(
              (champion, index) =>
                champions.find((champ) => champ.key === champion.key)?.key && (
                  <tr
                    className="m-2 bg-[#111111] hover:bg-[#2D2F37]"
                    key={index}
                  >
                    <td className="ml-2 lg:rounded-l-lg">
                      <div className="text-center">{index + 1}</div>
                    </td>
                    <td className={`p-2 ${getCellClass("key")}`}>
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
                            cardSize="!w-[80px] !h-[80px] md:!w-[96px] md:!h-[96px]"
                          />
                          <p className="p-0 text-left text-base md:text-xl mb-0 ml-2 text-[#fff]">
                            {
                              champions.find(
                                (champ) => champ.key === champion.key
                              )?.key
                            }
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className={`p-2 ${getCellClass("avgPlacement")}`}>
                      <p className="p-0 text-left text-base md:text-lg mb-0">
                        <ColoredValue
                          value={champion?.avgPlacement}
                          prefix="#"
                        />
                      </p>
                    </td>
                    <td className={`p-2 ${getCellClass("tops")}`}>
                      <p className="p-0 text-left text-base md:text-lg mb-0 text-[#fff]">
                        {((champion?.tops * 100) / champion?.plays).toFixed(2)}%
                      </p>
                    </td>
                    <td className={`p-2 ${getCellClass("wins")}`}>
                      <p className="p-0 text-left text-base md:text-lg mb-0 text-[#fff]">
                        {((champion?.wins * 100) / champion?.plays).toFixed(2)}%
                      </p>
                    </td>
                    <td className={`p-2 ${getCellClass("pickRate")}`}>
                      <p className="p-0 text-left text-base md:text-lg mb-0 text-[#fff]">
                        {(champion?.pickRate * 100).toFixed(2)}%
                      </p>
                    </td>
                    <td className={`p-2 ${getCellClass("plays")}`}>
                      <p className="p-0 text-left text-base md:text-lg mb-0 text-[#fff]">
                        {champion?.plays.toLocaleString("en-US")}
                      </p>
                    </td>
                    <td className="py-0.5 md:py-2">
                      <p className="p-0 text-left text-base md:text-lg mb-0 text-[#fff]">
                        {(champion?.threeStarPercentage * 100).toFixed(2)}%
                      </p>
                    </td>
                    <td className="py-0.5 md:py-2">
                      <p className="p-0 text-left text-base md:text-lg mb-0 text-[#fff]">
                        #{(champion?.threeStarRank).toFixed(2)}
                      </p>
                    </td>
                    <td className="lg:rounded-r-lg">
                      <div className="flex justify-start items-center gap-1">
                        {champions
                          .find((champ) => champ.key === champion.key)
                          ?.recommendItems.map(
                            (item) =>
                              items.find(
                                (i) =>
                                  i.key ===
                                  item?.split("_")[item?.split("_").length - 1]
                              )?.imageUrl
                          )
                          .map(
                            (item) =>
                              item && (
                                <div className="relative z-10 hover:z-20 !border !border-[#ffffff40] aspect-square rounded-lg">
                                  <OptimizedImage
                                    src={item}
                                    alt="icon"
                                    width={80}
                                    height={80}
                                    className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mr-1 rounded-md"
                                    data-tooltip-id={item}
                                  />
                                  <ReactTltp
                                    variant="item"
                                    id={item}
                                    content={items.find(
                                      (i) => i.imageUrl === item
                                    )}
                                  />
                                </div>
                              )
                          )}
                      </div>
                    </td>
                  </tr>
                )
            )}
          </table>
        </ScrollableTable>
      </div>
    </div>
    // </ProjectItemsStyleWrapper>
  );
};

export default ProjectItems;

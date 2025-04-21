import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import "../../../../../i18n";
import "react-tooltip/dist/react-tooltip.css";
import TrendFilters from "src/components/trendFilters";
import { HiArrowSmUp, HiArrowSmDown } from "react-icons/hi";
import metaDeckItemStats from "../../../../data/newData/metaDeckItems.json";
import Comps from "../../../../data/compsNew.json";
import Forces from "../../../../data/newData/force.json";
import ReactTltp from "src/components/tooltip/ReactTltp";
import CardImage from "src/components/cardImage";
import ScrollableTable from "src/utils/ScrollableTable";
import { OptimizedImage } from "../../../../utils/imageOptimizer";
import SearchBar from "src/components/searchBar";

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
  const { champions } = data?.refs;
  const { items } = data?.refs;
  const { forces } = data?.refs;

  const [metaDeckItemStatsData, setMetaDeckItemStatsData] =
    useState(metaDeckItemStats);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [searchValue, setSearchValue] = useState("");

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
    let sortedData = [...metaDeckItemStats];
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
    setMetaDeckItemStatsData(sortedData);
  }, [metaDeckItemStats, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleButtonClick = (button) => {
    if (button === "All") {
      setMetaDeckItemStatsData(metaDeckItemStats);
    } else {
      setMetaDeckItemStatsData(
        metaDeckItemStats.filter((item) =>
          items
            .find((i) => i.key === item.key)
            ?.tags?.includes(button.toLowerCase())
        )
      );
    }
  };

  useEffect(() => {
    setMetaDeckItemStatsData(
      metaDeckItemStats.filter((item) =>
        items
          .find((i) => i.key === item.key)
          ?.name?.toLowerCase()
          .includes(searchValue.toLowerCase())
      )
    );
  }, [searchValue]);

  return (
    <>
      <div className="pt-2 bg-[#111111] md:bg-transparent w-full">
        {/* Header section with filters and search */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-[#111111] md:bg-transparent px-2 sm:px-4 mb-2.5 md:mb-0">
          <div className="w-full sm:w-auto sm:mb-0">
            <TrendFilters
              buttons={["All", "Normal", "Radiant"]}
              onButtonClick={handleButtonClick}
            />
          </div>
          <div className="w-full sm:w-auto px-4 sm:px-0">
            <SearchBar
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              placeholder="Search item..."
            />
          </div>
        </div>

        {/* Table section */}
        <div className="projects-row overflow-auto">
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
                      {others.items}
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
                  <th className="p-2 font-semibold">
                    <p className="p-0 text-sm sm:text-base !mx-2 my-2 md:text-[16px]">
                      {others.synergy} {others.items}
                    </p>
                  </th>
                  <th className="lg:rounded-r-lg p-2 font-semibold">
                    <p className="p-0 text-sm sm:text-base !mx-2 my-2 md:text-[16px] text-center">
                      {others.top3} {others.champions}
                    </p>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-[#111111]">
                {metaDeckItemStatsData.map(
                  (item, index) =>
                    items.find((i) => i.key === item.key)?.key && (
                      <tr
                        className="m-2 hover:bg-[#2D2F37] transition-colors duration-200 md:border-[1px] md:border-[#2D2F37]"
                        key={index}
                      >
                        <td className="p-2 lg:rounded-l-lg">
                          <div className="text-center text-base">
                            {index + 1}
                          </div>
                        </td>
                        <td className={`p-2 ${getCellClass("key")}`}>
                          <div>
                            <div className="flex justify-start items-center">
                              <>
                                <OptimizedImage
                                  src={
                                    items?.find((i) => i?.key === item?.key)
                                      ?.imageUrl
                                  }
                                  alt="icon"
                                  width={80}
                                  height={80}
                                  className="w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] md:w-[84px] md:h-[84px] mr-1 !border !border-[#ffffff60] rounded-md"
                                  data-tooltip-id={`${items.find((i) => i.key === item.key)?.key}}`}
                                />
                                <ReactTltp
                                  variant="item"
                                  id={`${items.find((i) => i.key === item.key)?.key}}`}
                                  content={items.find(
                                    (i) => i.key === item.key
                                  )}
                                />
                              </>
                              <div className="ml-2">
                                <p className="p-0 text-base sm:text-base mb-2 md:!text-[16px] text-[#fff] truncate max-w-[120px] sm:max-w-full">
                                  {items.find((i) => i.key === item.key)?.name}
                                </p>
                                <div className="flex items-center flex-wrap gap-1">
                                  {items
                                    .find((i) => i.key === item.key)
                                    ?.compositions?.map((comp, index) => (
                                      <React.Fragment key={index}>
                                        <OptimizedImage
                                          alt="Item Image"
                                          width={80}
                                          height={80}
                                          src={
                                            items.find((i) => i.key === comp)
                                              .imageUrl
                                          }
                                          className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 !border !border-[#ffffff60] rounded-md"
                                          data-tooltip-id={`${items.find((i) => i.key === comp).key}_${index}`}
                                        />
                                        {index === 0 && (
                                          <span className="mx-1">+</span>
                                        )}
                                        <ReactTltp
                                          variant="item"
                                          id={`${items.find((i) => i.key === comp).key}_${index}`}
                                          content={items.find(
                                            (i) => i.key === comp
                                          )}
                                        />
                                      </React.Fragment>
                                    ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className={`p-2 ${getCellClass("avgPlacement")}`}>
                          <p className="p-0 text-base sm:text-base md:text-[16px] mb-0 text-[#fff]">
                            #{item?.avgPlacement}
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
                        <td className={`p-2 ${getCellClass("pickRate")}`}>
                          <p className="p-0 text-base sm:text-base md:text-[16px] mb-0 text-[#fff]">
                            {(item?.pickRate * 100).toFixed(2)}%
                          </p>
                        </td>
                        <td className={`p-2 ${getCellClass("plays")}`}>
                          <p className="p-0 text-base sm:text-base md:text-[16px] mb-0 text-[#fff]">
                            {item?.plays.toLocaleString("en-US")}
                          </p>
                        </td>
                        <td className="p-2">
                          <div className="flex flex-wrap justify-start items-center gap-1">
                            {item?.itemSynergyStats
                              ?.slice(0, 3)
                              .map((synergy, w) => (
                                <div key={w} className="relative">
                                  <OptimizedImage
                                    alt="Item Image"
                                    width={80}
                                    height={80}
                                    src={
                                      items.find((i) => i.key === synergy)
                                        ?.imageUrl
                                    }
                                    className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 !border !border-[#ffffff60] rounded-md"
                                    data-tooltip-id={`${
                                      items.find((i) => i.key === synergy)?.key
                                    }_${w}`}
                                  />
                                  <ReactTltp
                                    variant="item"
                                    id={`${
                                      items.find((i) => i.key === synergy)?.key
                                    }_${w}`}
                                    content={items.find(
                                      (i) => i.key === synergy
                                    )}
                                  />
                                </div>
                              ))}
                          </div>
                        </td>
                        <td className="p-2 lg:rounded-r-lg">
                          <div className="flex flex-nowrap justify-center items-center gap-1 md:gap-2 overflow-x-auto">
                            {item?.itemChampionStats
                              ?.slice(0, 3)
                              .map((champion, x) => (
                                <div key={x} className="flex-shrink-0">
                                  <CardImage
                                    src={{
                                      ...champions.find(
                                        (champ) => champ.key === champion
                                      ),
                                    }}
                                    imgStyle="w-[32px] sm:w-[40px] md:w-[60px] lg:w-[84px]"
                                    identificationImageStyle="w-[10px] sm:w-[12px] md:w-[16px] lg:w-[32px]"
                                    textStyle="text-[6px] sm:text-[8px] md:text-[10px] lg:text-[16px]"
                                    forces={forces}
                                  />
                                </div>
                              ))}
                          </div>
                        </td>
                      </tr>
                    )
                )}
              </tbody>
            </table>
          </ScrollableTable>
        </div>
      </div>
    </>
  );
};

export default ProjectItems;

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import "../../../../../i18n";
import "react-tooltip/dist/react-tooltip.css";
import TrendFilters from "src/components/trendFilters";
import { FaSortAmountDownAlt, FaSortAmountUp } from "react-icons/fa";
import metaDeckItemStats from "../../../../data/newData/metaDeckItems.json";
import Comps from "../../../../data/compsNew.json";
import Forces from "../../../../data/newData/force.json";
import ReactTltp from "src/components/tooltip/ReactTltp";
import CardImage from "src/components/cardImage";
import ScrollableTable from "src/utils/ScrollableTable";

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
    console.log("key", key);
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
      console.log("button", button, metaDeckItemStats);
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
      <div className="pt-2 bg-[#1a1b31] md:bg-transparent w-full">
        {/* Header section with filters and search */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-[#1a1b31] md:bg-transparent pb-2.5 px-2 sm:px-4">
          <div className="w-full sm:w-auto mb-3 sm:mb-0">
            <TrendFilters
              buttons={["All", "Normal", "Radiant"]}
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
          <ScrollableTable>
            <table className="w-full min-w-[900px] relative lg:border-separate lg:border-spacing-y-2">
              <thead className="sticky top-0 z-50">
                <tr className="bg-[#1a1b31]">
                  <th className="lg:rounded-l-lg p-2">
                    <p className="p-0 text-sm sm:text-base !mx-2 my-2 md:text-[16px]">
                      {others.rank}
                    </p>
                  </th>
                  <th className="p-2">
                    <p
                      className={`cursor-pointer mb-0 text-sm sm:text-base flex items-center`}
                      onClick={() => requestSort("key")}
                    >
                      {others?.items}
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
                  <th className="p-2">
                    <p
                      className={`cursor-pointer mb-0 text-sm sm:text-base flex items-center`}
                      onClick={() => requestSort("avgPlacement")}
                    >
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
                  <th className="p-2">
                    <p
                      className={`cursor-pointer mb-0 text-sm sm:text-base flex items-center`}
                      onClick={() => requestSort("tops")}
                    >
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
                  <th className="p-2">
                    <p
                      className={`cursor-pointer mb-0 text-sm sm:text-base flex items-center`}
                      onClick={() => requestSort("wins")}
                    >
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
                  <th className="p-2">
                    <p
                      className={`cursor-pointer mb-0 text-sm sm:text-base flex items-center`}
                      onClick={() => requestSort("pickRate")}
                    >
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
                  <th className="p-2">
                    <p
                      className={`cursor-pointer mb-0 text-sm sm:text-base flex items-center`}
                      onClick={() => requestSort("plays")}
                    >
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
                  <th className="p-2">
                    <p className="p-0 text-sm sm:text-base !mx-2 my-2 md:text-[16px]">
                      {others?.synergy} {others?.items}
                    </p>
                  </th>
                  <th className="text-center lg:rounded-r-lg p-2">
                    <p className="p-0 text-sm sm:text-base !mx-2 my-2 md:text-[16px]">
                      {others?.top3} {others?.champions}
                    </p>
                  </th>
                </tr>
              </thead>
              <tbody>
                {metaDeckItemStatsData.map(
                  (item, index) =>
                    items.find((i) => i.key === item.key)?.key && (
                      <tr
                        className="m-2 bg-[#1a1b31] hover:bg-[#292a4ae0] transition-colors duration-200"
                        key={index}
                      >
                        <td className="p-2 lg:rounded-l-lg">
                          <div className="text-center text-base">
                            {index + 1}
                          </div>
                        </td>
                        <td className="p-2">
                          <div>
                            <div className="flex justify-start items-center">
                              <>
                                <Image
                                  alt="Item Image"
                                  width={80}
                                  height={80}
                                  src={
                                    items.find((i) => i.key === item.key)
                                      ?.imageUrl
                                  }
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
                                        <Image
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
                        <td className="p-2">
                          <p className="p-0 text-base sm:text-base md:text-[16px] mb-0 text-[#fff]">
                            #{item?.avgPlacement}
                          </p>
                        </td>
                        <td className="p-2">
                          <p className="p-0 text-base sm:text-base md:text-[16px] mb-0 text-[#fff]">
                            {((item?.tops * 100) / item?.plays).toFixed(2)}%
                          </p>
                        </td>
                        <td className="p-2">
                          <p className="p-0 text-base sm:text-base md:text-[16px] mb-0 text-[#fff]">
                            {((item?.wins * 100) / item?.plays).toFixed(2)}%
                          </p>
                        </td>
                        <td className="p-2">
                          <p className="p-0 text-base sm:text-base md:text-[16px] mb-0 text-[#fff]">
                            {(item?.pickRate * 100).toFixed(2)}%
                          </p>
                        </td>
                        <td className="p-2">
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
                                  <Image
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

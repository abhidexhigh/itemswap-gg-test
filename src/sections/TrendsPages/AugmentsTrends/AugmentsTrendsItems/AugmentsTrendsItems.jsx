import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import "../../../../../i18n";
import "react-tooltip/dist/react-tooltip.css";
import GirlCrush from "@assets/image/traits/GirlCrush.svg";
import TrendFilters from "src/components/trendFilters";
import { BsSortDown, BsSortUp } from "react-icons/bs";
import { FaSortAmountUp, FaSortAmountDownAlt } from "react-icons/fa";
import ReactTltp from "src/components/tooltip/ReactTltp";
import metaDeckAugments from "../../../../data/newData/metaDeckAugments.json";
import augments from "../../../../data/newData/augments.json";

const ProjectItems = () => {
  const { t } = useTranslation();
  const others = t("others");
  const { augmentStats } = metaDeckAugments;

  const [augmentsStatsData, setAugmentsStatsData] = useState(augmentStats);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [searchValue, setSearchValue] = useState("");

  const handleButtonClick = (button) => {
    if (button === "All") {
      setAugmentsStatsData(augmentStats);
    } else {
      console.log(augmentStats[0], button);
      setAugmentsStatsData(
        augmentStats.filter(
          (augment) => augment.tier.toLowerCase() === button.toLowerCase()
        )
      );
    }
  };

  useEffect(() => {
    let sortedData = [...augmentStats];
    if (sortConfig !== null) {
      sortedData.sort((a, b) => {
        let aValue, bValue;

        if (["tops", "wins"].includes(sortConfig.key)) {
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
    setAugmentsStatsData(sortedData);
  }, [augmentStats, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    setAugmentsStatsData(
      augmentStats.filter((augment) =>
        augment.key.toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  }, [searchValue]);

  return (
    <>
      <div className="container md:!max-w-[80%] px-0 pt-2">
        <div className="flex justify-between items-center">
          <TrendFilters
            buttons={["All", "Silver", "Gold", "Prismatic"]}
            onButtonClick={handleButtonClick}
          />
          <div>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="bg-[#222231] text-[#fff] border-[#ffffff80] border-[1px] rounded-[4px] hover:border-[#ffffff60] hover:shadow-lg transition-all duration-300 ease-in-out w-[200px] h-[40px] px-[10px] text-[16px] placeholder-[#fff] placeholder-[16px] mt-[10px] md:mt-0"
              placeholder="Search..."
            />
          </div>
        </div>
        <div className="projects-row overflow-auto md:overflow-hidden">
          <div>
            <table className="w-full border-separate border-spacing-y-2">
              <thead>
                <tr className=" bg-[#1a1b31]">
                  <th className="!rounded-l-lg">
                    <p className="p-0 text-sm !mx-2 my-2 md:text-[14px]"># </p>
                  </th>
                  <th
                    className={` cursor-pointer`}
                    onClick={() => requestSort("key")}
                  >
                    <p className="p-0 text-sm my-auto md:text-[16px] text-left">
                      {others?.augment}
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
                    className={` cursor-pointer`}
                    onClick={() => requestSort("avgPlacement")}
                  >
                    <p className="p-0 text-sm my-auto md:text-[16px] text-left">
                      {others?.avgPlacement}
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
                    className={` cursor-pointer`}
                    onClick={() => requestSort("roundOnePickRate")}
                  >
                    <p className="p-0 text-sm my-auto md:text-[16px] text-left">
                      {others?.firstPick}
                      <span className="ml-2">
                        {sortConfig?.key === "roundOnePickRate" ? (
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
                    className={` cursor-pointer`}
                    onClick={() => requestSort("roundTwoPickRate")}
                  >
                    <p className="p-0 text-sm my-auto md:text-[16px] text-left">
                      {others?.secondPick}
                      <span className="ml-2">
                        {sortConfig?.key === "roundTwoPickRate" ? (
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
                    className={` cursor-pointer`}
                    onClick={() => requestSort("roundThreePickRate")}
                  >
                    <p className="p-0 text-sm my-auto md:text-[16px] text-left">
                      {others?.thirdPick}
                      <span className="ml-2">
                        {sortConfig?.key === "roundThreePickRate" ? (
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
                    className={` cursor-pointer`}
                    onClick={() => requestSort("tops")}
                  >
                    <p className="p-0 text-sm my-auto md:text-[16px] text-left">
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
                    className={` cursor-pointer`}
                    onClick={() => requestSort("wins")}
                  >
                    <p className="p-0 text-sm my-auto md:text-[16px] text-left">
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
                    className={` cursor-pointer`}
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
                    className={` cursor-pointer !rounded-r-lg`}
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
                </tr>
              </thead>
              <tbody
                className="bg-[#1a1b31]"
                // style={{
                //   background: "rgba(0, 0, 0, 0.2)",
                //   boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                //   backdropFilter: "blur(2px)",
                //   border: "1px solid rgba(35, 31, 31, 0.3)",
                // }}
              >
                {augmentsStatsData.map(
                  (item, index) =>
                    augments.find(
                      (augment) =>
                        augment.key ===
                        item.key?.split("_")[item?.key?.split("_").length - 1]
                    )?.key && (
                      <tr className="m-2 hover:bg-[#292a4ae0] border-[1px] border-[#ffffff50]">
                        <td className="ml-2 !rounded-l-lg">
                          <div className="text-center text-lg">{index + 1}</div>
                        </td>
                        <td>
                          <div>
                            <div className="flex justify-start items-center">
                              <Image
                                src={
                                  augments.find(
                                    (augment) =>
                                      augment.key ===
                                      item.key?.split("_")[
                                        item?.key?.split("_").length - 1
                                      ]
                                  )?.imageUrl
                                }
                                alt="icon"
                                width={80}
                                height={80}
                                className="w-10 md:w-16 h-10 md:h-16 mr-1"
                                data-tooltip-id={item?.key}
                              />
                              <ReactTltp
                                variant="augment"
                                id={item?.key}
                                content={augments.find(
                                  (augment) =>
                                    augment.key ===
                                    item.key?.split("_")[
                                      item?.key?.split("_").length - 1
                                    ]
                                )}
                              />
                              <div>
                                <p className="p-0 !text-base md:!text-lg text-[#fff] mb-1 ml-2">
                                  {
                                    augments.find(
                                      (augment) =>
                                        augment.key ===
                                        item.key?.split("_")[
                                          item?.key?.split("_").length - 1
                                        ]
                                    )?.name
                                  }
                                </p>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <p className="p-0 text-xs md:text-lg text-[#fff] mb-0">
                            #{item?.avgPlacement.toFixed(2)}
                          </p>
                        </td>
                        <td>
                          <p className="p-0 text-xs md:text-lg text-[#fff] mb-0">
                            {item?.roundOnePickRate.toFixed(2)}%
                          </p>
                        </td>
                        <td>
                          <p className="p-0 text-xs md:text-lg text-[#fff] mb-0">
                            {item?.roundTwoPickRate.toFixed(2)}%
                          </p>
                        </td>
                        <td>
                          <p className="p-0 text-xs md:text-lg text-[#fff] mb-0">
                            {item?.roundThreePickRate.toFixed(2)}%
                          </p>
                        </td>
                        {/* {item?.augmentRoundStats?.lenght === 3
                          ? item?.augmentRoundStats
                          : [
                              ...item?.augmentRoundStats,
                              ...Array(3 - item?.augmentRoundStats.length).fill(
                                null
                              ),
                            ]?.map((roundStat) => (
                              <td>
                                <p className="p-0 text-xs md:text-lg text-[#fff] mb-0">
                                  {roundStat?.avgPlacement
                                    ? roundStat?.avgPlacement.toFixed(2) + "%"
                                    : "-"}
                                </p>
                              </td>
                            ))} */}
                        <td>
                          <p className="p-0 text-xs md:text-lg text-[#fff] mb-0">
                            {((item?.tops * 100) / item?.plays).toFixed(2)}%
                          </p>
                        </td>
                        <td>
                          <p className="p-0 text-xs md:text-lg text-[#fff] mb-0">
                            {((item?.wins * 100) / item?.plays).toFixed(2)}%
                          </p>
                        </td>
                        <td>
                          <p className="p-0 text-xs md:text-lg text-[#fff] mb-0">
                            {(item?.pickRate * 100).toFixed(2)}%
                          </p>
                        </td>
                        <td className="!rounded-r-lg">
                          <p className="p-0 text-xs md:text-lg text-[#fff] mb-0">
                            {item?.plays.toLocaleString("en-US")}
                          </p>
                        </td>
                      </tr>
                    )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectItems;

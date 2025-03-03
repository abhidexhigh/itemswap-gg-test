import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../../../../../i18n";
import "react-tooltip/dist/react-tooltip.css";
import GirlCrush from "@assets/image/traits/GirlCrush.svg";
import TrendFilters from "src/components/trendFilters";
import { BsSortDown, BsSortUp } from "react-icons/bs";
import { FaSortAmountUp, FaSortAmountDownAlt } from "react-icons/fa";
import ReactTltp from "src/components/tooltip/ReactTltp";
import metaDeckAugments from "../../../../data/trends/metaDeckAugments.json";
import { augments } from "../../../../data/augments.json";

const ProjectItems = () => {
  const { t } = useTranslation();
  const others = t("others");
  const {
    metaDeckAugment: { augmentStats },
  } = metaDeckAugments;

  const [augmentsStatsData, setAugmentsStatsData] = useState(augmentStats);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const handleButtonClick = (button) => {
    if (button === "All") {
      setAugmentsStatsData(augmentStats);
    } else {
      console.log(augmentStats[0], button);
      setAugmentsStatsData(
        augmentStats.filter(
          (augment) => augment.level.toLowerCase() === button.toLowerCase()
        )
      );
    }
  };

  useEffect(() => {
    let sortedData = [...augmentStats];
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
    setAugmentsStatsData(sortedData);
  }, [augmentStats, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return (
    <>
      <div className="container md:!max-w-[95%] px-0">
        <TrendFilters
          buttons={["All", "Silver", "Gold", "Prismatic"]}
          onButtonClick={handleButtonClick}
          // dropdown1={["v14.2", "v14.1"]}
          // dropdown2={[
          //   "All Ranks",
          //   "Iron",
          //   "Bronze",
          //   "Silver",
          //   "Gold",
          //   "Platinum",
          //   "Diamond",
          //   "Master",
          //   "Grandmaster",
          //   "Challenger",
          // ]}
        />
        <div className="projects-row overflow-auto md:overflow-hidden">
          <div>
            <table className="w-full border-separate border-spacing-y-2">
              <thead>
                <tr className=" bg-[#222231]">
                  <th className="th1">
                    <p className="p-0 text-base text-[#fff] !mx-2 py-4 mb-0">
                      #{" "}
                    </p>
                  </th>
                  <th
                    className={` cursor-pointer ${sortConfig?.key === "key" ? "bg-[#000000]" : ""}`}
                    onClick={() => requestSort("key")}
                  >
                    <p className="p-0 text-base text-[#fff] !mx- py-4 mb-0 text-left">
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
                    className={` cursor-pointer ${sortConfig?.key === "avgPlacement" ? "bg-[#000000]" : ""}`}
                    onClick={() => requestSort("avgPlacement")}
                  >
                    <p className="p-0 text-base text-[#fff] !mx- py-4 mb-0 text-left">
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
                    className={` cursor-pointer ${sortConfig?.key === "firstPick" ? "bg-[#000000]" : ""}`}
                    onClick={() => requestSort("firstPick")}
                  >
                    <p className="p-0 text-base text-[#fff] !mx- py-4 mb-0 text-left">
                      {others?.firstPick}
                      <span className="ml-2">
                        {sortConfig?.key === "firstPick" ? (
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
                    className={` cursor-pointer ${sortConfig?.key === "secondPick" ? "bg-[#000000]" : ""}`}
                    onClick={() => requestSort("secondPick")}
                  >
                    <p className="p-0 text-base text-[#fff] !mx- py-4 mb-0 text-left">
                      {others?.secondPick}
                      <span className="ml-2">
                        {sortConfig?.key === "secondPick" ? (
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
                    className={` cursor-pointer ${sortConfig?.key === "thirdPick" ? "bg-[#000000]" : ""}`}
                    onClick={() => requestSort("thirdPick")}
                  >
                    <p className="p-0 text-base text-[#fff] !mx- py-4 mb-0 text-left">
                      {others?.thirdPick}
                      <span className="ml-2">
                        {sortConfig?.key === "thirdPick" ? (
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
                    className={` cursor-pointer ${sortConfig?.key === "tops" ? "bg-[#000000]" : ""}`}
                    onClick={() => requestSort("tops")}
                  >
                    <p className="p-0 text-base text-[#fff] !mx- py-4 mb-0 text-left">
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
                    className={` cursor-pointer ${sortConfig?.key === "wins" ? "bg-[#000000]" : ""}`}
                    onClick={() => requestSort("wins")}
                  >
                    <p className="p-0 text-base text-[#fff] !mx- py-4 mb-0 text-left">
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
                    className={` cursor-pointer ${sortConfig?.key === "pickRate" ? "bg-[#000000]" : ""}`}
                    onClick={() => requestSort("pickRate")}
                  >
                    <p className="p-0 text-base text-[#fff] !mx- py-4 mb-0 text-left">
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
                    className={` cursor-pointer w-[80px] ${sortConfig?.key === "plays" ? "bg-[#000000]" : ""}`}
                    onClick={() => requestSort("plays")}
                  >
                    <p className="p-0 text-base text-[#fff] !mx- py-4 mb-0 text-left">
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
                        <td className="ml-2">
                          <div className="text-center text-lg">{index + 1}</div>
                        </td>
                        <td>
                          <div>
                            <div className="flex justify-start items-center">
                              <img
                                src={
                                  augments.find(
                                    (augment) =>
                                      augment.key ===
                                      item.key?.split("_")[
                                        item?.key?.split("_").length - 1
                                      ]
                                  )?.imageUrl
                                }
                                className="w-10 md:w-16 h-10 md:h-16 mr-1"
                                alt="icon"
                                data-tooltip-id={item?.key}
                              />
                              {/* <Tooltip
                                id={item?.key}
                                effect="solid"
                                style={{
                                  zIndex: 999,
                                  backgroundColor: "#333",
                                  opacity: "1 !important",
                                  border: "1px solid red",
                                  borderRadius: "10px",
                                }}
                              >
                                <TraitTooltip
                                  title="Lillia"
                                  icon={GirlCrush.src}
                                  description={{
                                    title: "Confetti Bloom",
                                    text: "Deal magic damage to adjacent enemies. Heal Lillia and her nearest ally.",
                                  }}
                                  magicDamage="180 / 270 / 400"
                                  healAmount="180 / 220 / 260"
                                  allyHealAmount="90 / 110 / 130"
                                  rangeFilled={70}
                                />
                              </Tooltip> */}
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
                        {item?.augmentRoundStats?.lenght === 3
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
                            ))}
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
                        <td>
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

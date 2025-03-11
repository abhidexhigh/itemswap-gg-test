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
    // <ProjectItemsStyleWrapper>
    <>
      <div className="pt-2 bg-[#1a1b31] md:bg-transparent">
        <div className="md:flex md:justify-between md:items-center bg-[#1a1b31] md:bg-transparent">
          <TrendFilters
            buttons={["All", "Normal", "Radiant"]}
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
          <ScrollableTable>
            <table className="w-[900px] md:w-full md:border-separate md:border-spacing-y-2">
              <tr className="bg-[#1a1b31]">
                <th className="md:rounded-l-lg">
                  <p className="p-0 text-base !mx-2 my-2 md:text-[14px]">
                    {others.rank}
                  </p>
                </th>
                <th>
                  <p
                    className={`cursor-pointer mb-0 text-base`}
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
                <th>
                  <p
                    className={`cursor-pointer mb-0`}
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
                <th className="md:px-2">
                  <p
                    className={`cursor-pointer mb-0`}
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
                <th className="md:px-2">
                  <p
                    className={`cursor-pointer mb-0`}
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
                <th className="md:px-2 !pr-4">
                  <p
                    className={`cursor-pointer mb-0`}
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
                <th className="md:px-2">
                  <p
                    className={`cursor-pointer mb-0`}
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
                <th className="">
                  <p className="p-0 text-base !mx-2 my-2 md:text-[16px]">
                    {others?.synergy} {others?.items}
                  </p>
                </th>
                <th className="text-center md:rounded-r-lg">
                  <p className="p-0 text-base !mx-2 my-2 md:text-[16px]">
                    {others?.top3} {others?.champions}
                  </p>
                </th>
              </tr>
              {metaDeckItemStatsData.map(
                (item, index) =>
                  items.find((i) => i.key === item.key)?.key && (
                    <tr
                      className="m-2 bg-[#1a1b31] hover:bg-[#292a4ae0]"
                      key={index}
                    >
                      <td className="ml-2 md:rounded-l-lg">
                        <div className="text-center">{index + 1}</div>
                      </td>
                      <td className="py-2">
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
                                className="w-[68px] md:w-[84px] mr-1 !border !border-[#ffffff60] rounded-md"
                                data-tooltip-id={`${items.find((i) => i.key === item.key)?.key}}`}
                              />
                              <ReactTltp
                                variant="item"
                                id={`${items.find((i) => i.key === item.key)?.key}}`}
                                content={items.find((i) => i.key === item.key)}
                              />
                            </>
                            <div className="ml-2">
                              <p className="p-0 !text-base mb-2 md:!text-[16px] text-[#fff]">
                                {items.find((i) => i.key === item.key)?.name}
                              </p>
                              <div className="flex items-center">
                                {items
                                  .find((i) => i.key === item.key)
                                  ?.compositions?.map((comp, index) => (
                                    <>
                                      <Image
                                        alt="Item Image"
                                        width={80}
                                        height={80}
                                        src={
                                          items.find((i) => i.key === comp)
                                            .imageUrl
                                        }
                                        className="w-8 md:w-10 md:h-10 !border !border-[#ffffff60] rounded-md"
                                        key={index}
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
                                    </>
                                  ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-2">
                        <p className="p-0 text-base  md:text-[16px] mb-0 text-[#fff]">
                          #{item?.avgPlacement}
                        </p>
                      </td>
                      <td className="py-2">
                        <p className="p-0 text-base  md:text-[16px] mb-0 text-[#fff]">
                          {((item?.tops * 100) / item?.plays).toFixed(2)}%
                        </p>
                      </td>
                      <td className="py-2">
                        <p className="p-0 text-base  md:text-[16px] mb-0 text-[#fff]">
                          {((item?.wins * 100) / item?.plays).toFixed(2)}%
                        </p>
                      </td>
                      <td className="py-2">
                        <p className="p-0 text-base  md:text-[16px] mb-0 text-[#fff]">
                          {(item?.pickRate * 100).toFixed(2)}%
                        </p>
                      </td>
                      <td className="py-2">
                        <p className="p-0 text-base  md:text-[16px] mb-0 text-[#fff]">
                          {item?.plays.toLocaleString("en-US")}
                        </p>
                      </td>
                      <td className="py-2">
                        <div className="flex justify-start items-center">
                          {item?.itemSynergyStats
                            ?.slice(0, 3)
                            .map((synergy, w) => (
                              <>
                                <Image
                                  alt="Item Image"
                                  width={80}
                                  height={80}
                                  src={
                                    items.find((i) => i.key === synergy)
                                      ?.imageUrl
                                  }
                                  className="w-12 md:w-14 mr-2 !border !border-[#ffffff60] rounded-md"
                                  data-tooltip-id={`${
                                    items.find((i) => i.key === synergy)?.key
                                  }_${w}`}
                                />
                                <ReactTltp
                                  variant="item"
                                  id={`${
                                    items.find((i) => i.key === synergy)?.key
                                  }_${w}`}
                                  content={items.find((i) => i.key === synergy)}
                                />
                              </>
                            ))}
                        </div>
                      </td>
                      <td className="md:rounded-r-lg py-2">
                        <div className="flex justify-start items-center gap-1 md:gap-2">
                          {item?.itemChampionStats
                            ?.slice(0, 3)
                            .map((champion, x) => (
                              <>
                                <CardImage
                                  src={{
                                    ...champions.find(
                                      (champ) => champ.key === champion
                                    ),
                                  }}
                                  imgStyle="w-[48px] md:w-[84px]"
                                  identificationImageStyle="w=[16px] md:w-[32px]"
                                  textStyle="text-[10px] md:text-[16px]"
                                  forces={forces}
                                />
                              </>
                            ))}
                        </div>
                      </td>
                    </tr>
                  )
              )}
            </table>
          </ScrollableTable>
          {/* <Tooltip
              id="my-tooltip"
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
        </div>
      </div>
    </>
    // </ProjectItemsStyleWrapper>
  );
};

export default ProjectItems;

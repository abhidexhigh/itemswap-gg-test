import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import React, { useState } from "react";
import { Tooltip } from "react-tooltip";
import nextArrowIcon from "@assets/images/icons/next-arrow.png";
import ProjectCard from "../ItemsTrendsCard/ItemsTrendsCard";
import ProjectItemsStyleWrapper from "./ItemsTrendsItems.style";
import projectsData from "@assets/data/projects/dataV6";
import indianWeapon from "@assets/image/items/weapons/indian weapon.png";
import TraitTooltip from "src/components/tooltip/TraitTooltip";
import "react-tooltip/dist/react-tooltip.css";
import GirlCrush from "@assets/image/traits/GirlCrush.svg";
import TrendFilters from "src/components/trendFilters";
import metaDeckItems from "../../../../assets/data/trends/metaDeckItems.json";
import allData from "../../../../ApiStructure/Comps/Comps.json";
import ReactTltp from "src/components/tooltip/ReactTltp";

const ProjectItems = () => {
  const metaDeckItemsStats = metaDeckItems.metaDeckItem.metaDeckItemStats;
  const {
    props: {
      pageProps: {
        dehydratedState: { queries: data },
      },
    },
  } = allData;
  const {
    state: {
      data: { champions },
    },
  } = data?.find((item) => item?.queryKey.includes("championRefs"));
  const {
    state: {
      data: { items },
    },
  } = data?.find((item) => item?.queryKey.includes("itemRefs"));
  console.log(items);
  const [isOpen, setIsOpen] = useState(false);
  return (
    // <ProjectItemsStyleWrapper>
    <>
      <div className="container">
        <br />
        <TrendFilters
          buttons={["All", "Normal", "Trait", "Artifact", "Rediant", "Support"]}
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
        />
        <div className="projects-row overflow-auto md:overflow-hidden">
          <div>
            <table className="w-full border-separate border-spacing-y-2">
              <tr>
                <th className="th1">
                  <p className="p-0 text-xs !mx-2">#</p>
                </th>
                <th>
                  <p className="p-0 text-xs !mx-2">Item</p>
                </th>
                <th className="th3">
                  <p className="p-0 text-xs !mx-2">Avg. Rank</p>
                </th>
                <th className="th4">
                  <p className="p-0 text-xs !mx-2">TOP4</p>
                </th>
                <th className="th5">
                  <p className="p-0 text-xs !mx-2">Win%</p>
                </th>
                <th className="th6">
                  <p className="p-0 text-xs !mx-2">Pick%</p>
                </th>
                <th className="th7">
                  <p className="p-0 text-xs !mx-2">Played</p>
                </th>
                <th className="w-[120px]">
                  <p className="p-0 text-xs !mx-2">Synergy Items</p>
                </th>
                <th className="w-[120px]">
                  <p className="p-0 text-xs !mx-2">Top3 Champions</p>
                </th>
              </tr>
              {metaDeckItemsStats.map(
                (item, index) =>
                  items.find(
                    (i) =>
                      i.key ===
                      item.key?.split("_")[item.key?.split("_").length - 1]
                  )?.key && (
                    <tr
                      className="m-2 bg-[#1a1b31] hover:bg-[#292a4ae0]"
                      key={index}
                    >
                      <td className="ml-2">
                        <div className="text-center">{index + 1}</div>
                      </td>
                      <td>
                        <div>
                          <div className="flex justify-start items-center">
                            <>
                              <img
                                src={
                                  items.find(
                                    (i) =>
                                      i.key ===
                                      item.key?.split("_")[
                                        item.key?.split("_").length - 1
                                      ]
                                  )?.imageUrl
                                }
                                className="w-10 h-10 mr-1"
                                alt="icon"
                                data-tooltip-id={
                                  items.find(
                                    (i) =>
                                      i.key ===
                                      item.key?.split("_")[
                                        item.key?.split("_").length - 1
                                      ]
                                  )?.key
                                }
                              />
                              <ReactTltp
                                key={index}
                                id={
                                  items.find(
                                    (i) =>
                                      i.key ===
                                      item.key?.split("_")[
                                        item.key?.split("_").length - 1
                                      ]
                                  )?.key
                                }
                                content={
                                  items.find(
                                    (i) =>
                                      i.key ===
                                      item.key?.split("_")[
                                        item.key?.split("_").length - 1
                                      ]
                                  )?.name
                                }
                              />
                            </>
                            <div>
                              <p className="p-0 !text-xs mb-1">
                                {
                                  items.find(
                                    (i) =>
                                      i.key ===
                                      item.key?.split("_")[
                                        item.key?.split("_").length - 1
                                      ]
                                  )?.name
                                }
                              </p>
                              <div className="flex items-center">
                                {items
                                  .find(
                                    (i) =>
                                      i.key ===
                                      item.key?.split("_")[
                                        item.key?.split("_").length - 1
                                      ]
                                  )
                                  ?.compositions?.map((comp, index) => (
                                    <>
                                      <img
                                        src={
                                          items.find((i) => i.key === comp)
                                            .imageUrl
                                        }
                                        className="w-4 h-4"
                                        alt="icon"
                                        key={index}
                                        data-tooltip-id={
                                          items.find((i) => i.key === comp).key
                                        }
                                      />
                                      {index === 0 && (
                                        <span className="mx-1">+</span>
                                      )}
                                      <ReactTltp
                                        key={index}
                                        id={
                                          items.find((i) => i.key === comp).key
                                        }
                                        content={
                                          items.find((i) => i.key === comp).name
                                        }
                                      />
                                    </>
                                  ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <p className="p-0 text-xs mb-0">
                          #{item?.avgPlacement}
                        </p>
                      </td>
                      <td>
                        <p className="p-0 text-xs mb-0">
                          {((item?.tops * 100) / item?.plays).toFixed(2)}%
                        </p>
                      </td>
                      <td>
                        <p className="p-0 text-xs mb-0">
                          {((item?.wins * 100) / item?.plays).toFixed(2)}%
                        </p>
                      </td>
                      <td>
                        <p className="p-0 text-xs mb-0">
                          {(item?.pickRate * 100).toFixed(2)}%
                        </p>
                      </td>
                      <td>
                        <p className="p-0 text-xs mb-0">
                          {item?.plays.toLocaleString("en-US")}
                        </p>
                      </td>
                      <td>
                        <div className="flex justify-start items-center">
                          {item?.itemSynergyStats
                            ?.slice(0, 3)
                            .map((synergy) => (
                              <>
                                <img
                                  src={
                                    items.find(
                                      (i) =>
                                        i.key ===
                                        synergy?.key?.split("_")[
                                          synergy.key?.split("_").length - 1
                                        ]
                                    )?.imageUrl
                                  }
                                  className="w-6 h-6 mr-2"
                                  alt="icon"
                                  data-tooltip-id={
                                    items.find(
                                      (i) =>
                                        i.key ===
                                        synergy?.key?.split("_")[
                                          synergy.key?.split("_").length - 1
                                        ]
                                    )?.key
                                  }
                                />
                                <ReactTltp
                                  key={index}
                                  id={
                                    items.find(
                                      (i) =>
                                        i.key ===
                                        synergy?.key?.split("_")[
                                          synergy.key?.split("_").length - 1
                                        ]
                                    )?.key
                                  }
                                  content={
                                    items.find(
                                      (i) =>
                                        i.key ===
                                        synergy?.key?.split("_")[
                                          synergy.key?.split("_").length - 1
                                        ]
                                    )?.name
                                  }
                                />
                              </>
                            ))}
                        </div>
                      </td>
                      <td>
                        <div className="flex justify-start items-center">
                          {item?.itemChampionStats
                            ?.slice(0, 3)
                            .map((champion) => (
                              <>
                                <img
                                  src={
                                    champions.find(
                                      (champ) =>
                                        champ.key ===
                                        champion.key?.split("_")[
                                          champion.key?.split("_").length - 1
                                        ]
                                    )?.imageUrl
                                  }
                                  className="w-6 h-6 mr-2"
                                  alt="icon"
                                  data-tooltip-id={
                                    champions.find(
                                      (champ) =>
                                        champ.key ===
                                        champion.key?.split("_")[
                                          champion.key?.split("_").length - 1
                                        ]
                                    )?.key
                                  }
                                />
                                <ReactTltp
                                  key={index}
                                  id={
                                    champions.find(
                                      (champ) =>
                                        champ.key ===
                                        champion.key?.split("_")[
                                          champion.key?.split("_").length - 1
                                        ]
                                    )?.key
                                  }
                                  content={
                                    champions.find(
                                      (champ) =>
                                        champ.key ===
                                        champion.key?.split("_")[
                                          champion.key?.split("_").length - 1
                                        ]
                                    )?.name
                                  }
                                />
                              </>
                            ))}
                        </div>
                      </td>
                    </tr>
                  )
              )}
            </table>
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
      </div>
    </>
    // </ProjectItemsStyleWrapper>
  );
};

export default ProjectItems;

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import React, { useState } from "react";
import { Tooltip } from "react-tooltip";
import nextArrowIcon from "@assets/images/icons/next-arrow.png";
import ProjectCard from "../ChampionsTrendsCard/ChampionsTrendsCard";
import ProjectItemsStyleWrapper from "./ChampionsTrendsItems.style";
import projectsData from "@assets/data/projects/dataV6";
import indianWeapon from "@assets/image/items/weapons/indian weapon.png";
import TraitTooltip from "src/components/tooltip/TraitTooltip";
import "react-tooltip/dist/react-tooltip.css";
import GirlCrush from "@assets/image/traits/GirlCrush.svg";
import TrendFilters from "src/components/trendFilters";
import metaDeckChampions from "../../../../assets/data/trends/metaDeckChampions.json";
import allData from "../../../../ApiStructure/Comps/Comps.json";

const ProjectItems = () => {
  const metaDeckChampionsStats =
    metaDeckChampions.metaDeckChampion.metaDeckChampionStats;
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
    <div className="container">
      <TrendFilters
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
                <p className="p-0 text-xs !mx-2">Champions</p>
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
              <th className="th8">
                <p className="p-0 text-xs !mx-2">3-Stars%</p>
              </th>
              <th className="th9">
                <p className="p-0 text-xs !mx-2">3-Stars Rank</p>
              </th>
              <th className="th10">
                <p className="p-0 text-xs !mx-2">Recommend Items</p>
              </th>
            </tr>
            {metaDeckChampionsStats.map(
              (champion, index) =>
                champions.find(
                  (champ) => champ.key === champion.key?.split("_")[1]
                )?.key && (
                  <tr
                    className="m-2 bg-[#1a1b31] hover:bg-[#292a4ae0]"
                    key={index}
                  >
                    <td className="ml-2">
                      <div className="text-center">1</div>
                    </td>
                    <td>
                      <div>
                        <div className="flex justify-start items-center">
                          <img
                            src={
                              champions.find(
                                (champ) =>
                                  champ.key === champion.key?.split("_")[1]
                              )?.imageUrl
                            }
                            className="w-10 h-10 mr-1"
                            alt="icon"
                            data-tooltip-id="my-tooltip"
                          />
                          <p className="p-0 !text-xs mb-0">
                            {
                              champions.find(
                                (champ) =>
                                  champ.key === champion.key?.split("_")[1]
                              )?.key
                            }
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <p className="p-0 text-xs mb-0">
                        #{champion?.avgPlacement}
                      </p>
                    </td>
                    <td>
                      <p className="p-0 text-xs mb-0">
                        {((champion?.tops * 100) / champion?.plays).toFixed(2)}%
                      </p>
                    </td>
                    <td>
                      <p className="p-0 text-xs mb-0">
                        {((champion?.wins * 100) / champion?.plays).toFixed(2)}%
                      </p>
                    </td>
                    <td>
                      <p className="p-0 text-xs mb-0">
                        {(champion?.pickRate * 100).toFixed(2)}%
                      </p>
                    </td>
                    <td>
                      <p className="p-0 text-xs mb-0">
                        {champion?.plays.toLocaleString("en-US")}
                      </p>
                    </td>
                    <td>
                      <p className="p-0 text-xs mb-0">
                        {(
                          champion?.championTierStats?.[2]?.pickRate * 100
                        ).toFixed(2)}
                        %
                      </p>
                    </td>
                    <td>
                      <p className="p-0 text-xs mb-0">
                        #
                        {(champion?.championTierStats?.[2]?.avgPlacement).toFixed(
                          2
                        )}
                      </p>
                    </td>
                    <td>
                      <div className="flex justify-start items-center">
                        {console.log(
                          champions
                            .find(
                              (champ) =>
                                champ.key === champion.key?.split("_")[1]
                            )
                            ?.recommendItems.map(
                              (item) =>
                                items.find(
                                  (i) =>
                                    i.key ===
                                    item?.split("_")[
                                      item?.split("_").length - 1
                                    ]
                                )?.imageUrl
                              // item?.split("_")[item?.split("_").length - 1]
                            )
                        )}
                        {champions
                          .find(
                            (champ) => champ.key === champion.key?.split("_")[1]
                          )
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
                                <img
                                  src={item}
                                  className="w-6 h-6 mr-2"
                                  alt="icon"
                                />
                              )
                          )}
                      </div>
                    </td>
                  </tr>
                )
            )}
          </table>
          <Tooltip
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
          </Tooltip>
        </div>
      </div>
    </div>
    // </ProjectItemsStyleWrapper>
  );
};

export default ProjectItems;

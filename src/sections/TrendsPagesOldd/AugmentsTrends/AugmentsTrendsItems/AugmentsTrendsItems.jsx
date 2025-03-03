import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import React, { useState } from "react";
import { Tooltip } from "react-tooltip";
import nextArrowIcon from "@assets/images/icons/next-arrow.png";
import ProjectCard from "../AugmentsTrendsCard/AugmentsTrendsCard";
import ProjectItemsStyleWrapper from "./AugmentsTrendsItems.style";
import projectsData from "@assets/data/projects/dataV6";
import indianWeapon from "@assets/image/items/weapons/indian weapon.png";
import TraitTooltip from "src/components/tooltip/TraitTooltip";
import "react-tooltip/dist/react-tooltip.css";
import GirlCrush from "@assets/image/traits/GirlCrush.svg";
import TrendFilters from "src/components/trendFilters";
import metaDeckAugments from "../../../../assets/data/trends/metaDeckAugments.json";
import { augments } from "../../../../assets/data/augments/augments.json";

const ProjectItems = () => {
  // Extracting all the augmentStats arrays
  const allAugmentStats =
    metaDeckAugments.metaDeckAugment.metaDeckAugmentStats.reduce(
      (acc, item) => {
        if (item.augmentStats) {
          acc.push(...item.augmentStats);
        }
        return acc;
      },
      []
    );

  // Sorting the merged array by avgPlacement in ascending order
  allAugmentStats.sort((a, b) => a.avgPlacement - b.avgPlacement);

  // Logging the sorted array to the console
  console.log(allAugmentStats);
  const { data } = projectsData;
  const [isOpen, setIsOpen] = useState(false);
  return (
    // <ProjectItemsStyleWrapper>
    <>
      <div className="container">
        <br />
        <TrendFilters
          buttons={["Silver", "Gold", "Prismatic"]}
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
                  <p className="p-0 text-xs !mx-2">Augment</p>
                </th>
                <th className="th3">
                  <p className="p-0 text-xs !mx-2">Avg. Rank</p>
                </th>
                <th className="th4">
                  <p className="p-0 text-xs !mx-2">1st Pick</p>
                </th>
                <th className="th5">
                  <p className="p-0 text-xs !mx-2">2nd Pick</p>
                </th>
                <th className="th6">
                  <p className="p-0 text-xs !mx-2">3rd Pick</p>
                </th>
                <th className="th7">
                  <p className="p-0 text-xs !mx-2">TOP4</p>
                </th>
                <th className="w-[80px]">
                  <p className="p-0 text-xs !mx-2">Win%</p>
                </th>
                <th className="w-[80px]">
                  <p className="p-0 text-xs !mx-2">Pick%</p>
                </th>
                <th className="w-[80px]">
                  <p className="p-0 text-xs !mx-2">Played</p>
                </th>
              </tr>
              {allAugmentStats.map(
                (item, index) =>
                  augments.find(
                    (augment) =>
                      augment.key ===
                      item.key?.split("_")[item?.key?.split("_").length - 1]
                  )?.key && (
                    <tr className="m-2 bg-[#1a1b31] hover:bg-[#292a4ae0]">
                      <td className="ml-2">
                        <div className="text-center">{index + 1}</div>
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
                              className="w-10 h-10 mr-1"
                              alt="icon"
                              data-tooltip-id="my-tooltip"
                            />
                            <div>
                              <p className="p-0 !text-xs mb-1">
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
                        <p className="p-0 text-xs mb-0">
                          #{item?.avgPlacement.toFixed(2)}
                        </p>
                      </td>
                      {item?.augmentRoundStats?.map((roundStat) => (
                        <td>
                          <p className="p-0 text-xs mb-0">
                            {roundStat?.avgPlacement.toFixed(2)}%
                          </p>
                        </td>
                      ))}
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
    </>
    // </ProjectItemsStyleWrapper>
  );
};

export default ProjectItems;

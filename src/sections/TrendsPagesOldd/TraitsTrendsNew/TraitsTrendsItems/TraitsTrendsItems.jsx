import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import React, { useState } from "react";
import { Tooltip } from "react-tooltip";
import nextArrowIcon from "@assets/images/icons/next-arrow.png";
import ProjectCard from "../TraitsTrendsCard/TraitsTrendsCard";
import ProjectItemsStyleWrapper from "./TraitsTrendsItems.style";
import projectsData from "@assets/data/projects/dataV6";
import indianWeapon from "@assets/image/items/weapons/indian weapon.png";
import TraitTooltip from "src/components/tooltip/TraitTooltip";
import "react-tooltip/dist/react-tooltip.css";
import GirlCrush from "@assets/image/traits/GirlCrush.svg";
import TrendFilters from "src/components/trendFilters";

const ProjectItems = () => {
  const { data } = projectsData;
  const [isOpen, setIsOpen] = useState(false);
  return (
    // <ProjectItemsStyleWrapper>
    <>
      <div className="container">
        <br />
        <TrendFilters
          buttons={["All", "Bronze", "Silver", "Gold", "Prismatic"]}
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
                <th className="th10">
                  <p className="p-0 text-xs !mx-2">Recommend Items</p>
                </th>
              </tr>
              <tr className="m-2 bg-[#1a1b31] hover:bg-[#292a4ae0]">
                <td className="ml-2">
                  <div className="text-center">1</div>
                </td>
                <td>
                  <div>
                    <div className="flex justify-start items-center">
                      <img
                        src={indianWeapon.src}
                        className="w-10 h-10 mr-1"
                        alt="icon"
                        data-tooltip-id="my-tooltip"
                      />
                      <div>
                        <p className="p-0 !text-xs mb-0">Ziggs</p>
                        <p className="m-0 text-xs font-extralight">
                          3 / 5 / 7 / <span className="font-bold">10</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <p className="p-0 text-xs mb-0">#3.61</p>
                </td>
                <td>
                  <p className="p-0 text-xs mb-0">66.80%</p>
                </td>
                <td>
                  <p className="p-0 text-xs mb-0">20.77%</p>
                </td>
                <td>
                  <p className="p-0 text-xs mb-0">1.42%</p>
                </td>
                <td>
                  <p className="p-0 text-xs mb-0">825,278</p>
                </td>
                <td>
                  <div className="flex justify-start items-center">
                    <img
                      src={indianWeapon.src}
                      className="w-6 h-6 mr-2"
                      alt="icon"
                    />
                    <img
                      src={indianWeapon.src}
                      className="w-6 h-6 mr-2"
                      alt="icon"
                    />
                    <img
                      src={indianWeapon.src}
                      className="w-6 h-6 mr-2"
                      alt="icon"
                    />
                    <img
                      src={indianWeapon.src}
                      className="w-6 h-6 mr-2"
                      alt="icon"
                    />
                    <img
                      src={indianWeapon.src}
                      className="w-6 h-6 mr-2"
                      alt="icon"
                    />
                  </div>
                </td>
              </tr>
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

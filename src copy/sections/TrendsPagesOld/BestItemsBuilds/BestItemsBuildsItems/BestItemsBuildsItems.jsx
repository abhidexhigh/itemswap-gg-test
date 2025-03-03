import React, { useState } from "react";
import { Tooltip } from "react-tooltip";
import projectsData from "@assets/data/projects/dataV6";
import TraitTooltip from "src/components/tooltip/TraitTooltip";
import "react-tooltip/dist/react-tooltip.css";
import GirlCrush from "@assets/image/traits/GirlCrush.svg";
import TrendFilters from "src/components/trendFilters";
import TierContent from "./TierContent";

const ProjectItems = () => {
  const { data } = projectsData;
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Tier 1"); // [Tier 1, Tier 2, Tier 3, Tier 4, Tier 5
  return (
    // <ProjectItemsStyleWrapper>
    <>
      <div className="container">
        <br />
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
            {/* TABS START */}
            <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 md:hidden">
              <ul className="flex flex-wrap -mb-px justify-between">
                <li className="w-[20%]" onClick={() => setActiveTab("Tier 1")}>
                  <div
                    className={`inline-block w-full py-4 ${
                      activeTab === "Tier 1"
                        ? "text-blue-600 border-b-2 border-blue-600 active"
                        : "border-transparent"
                    } border-b-2 rounded-t-lg hover:text-blue-500 hover:border-blue-500 cursor-pointer`}
                  >
                    Tier 1
                  </div>
                </li>
                <li className="w-[20%]" onClick={() => setActiveTab("Tier 2")}>
                  <div
                    className={`inline-block w-full py-4 ${
                      activeTab === "Tier 2"
                        ? "text-blue-600 border-b-2 border-blue-600 active"
                        : "border-transparent"
                    } border-b-2 rounded-t-lg hover:text-blue-500 hover:border-blue-500 cursor-pointer`}
                    aria-current="page"
                  >
                    Tier 2
                  </div>
                </li>
                <li className="w-[20%]" onClick={() => setActiveTab("Tier 3")}>
                  <div
                    className={`inline-block w-full py-4 ${
                      activeTab === "Tier 3"
                        ? "text-blue-600 border-b-2 border-blue-600 active"
                        : "border-transparent"
                    } border-b-2 rounded-t-lg hover:text-blue-500 hover:border-blue-500 cursor-pointer`}
                    aria-current="page"
                  >
                    Tier 3
                  </div>
                </li>
                <li className="w-[20%]" onClick={() => setActiveTab("Tier 4")}>
                  <div
                    className={`inline-block w-full py-4 ${
                      activeTab === "Tier 4"
                        ? "text-blue-600 border-b-2 border-blue-600 active"
                        : "border-transparent"
                    } border-b-2 rounded-t-lg hover:text-blue-500 hover:border-blue-500 cursor-pointer`}
                  >
                    Tier 4
                  </div>
                </li>
                <li className="w-[20%]" onClick={() => setActiveTab("Tier 5")}>
                  <div
                    className={`inline-block w-full py-4 ${
                      activeTab === "Tier 5"
                        ? "text-blue-600 border-b-2 border-blue-600 active"
                        : "border-transparent"
                    } border-b-2 rounded-t-lg hover:text-blue-500 hover:border-blue-500 cursor-pointer`}
                  >
                    Tier 5
                  </div>
                </li>
              </ul>
            </div>
            {/* TABS END */}
            <div className="flex flex-col md:grid grid-cols-5 gap-4">
              <div
                className={`bg-slate-800 md:block ${
                  activeTab === "Tier 1" ? "block" : "hidden"
                }`}
              >
                <TierContent />
              </div>
              <div
                className={`bg-slate-800 md:block ${
                  activeTab === "Tier 2" ? "block" : "hidden"
                }`}
              >
                <TierContent />
              </div>
              <div
                className={`bg-slate-800 md:block ${
                  activeTab === "Tier 3" ? "block" : "hidden"
                }`}
              >
                03
              </div>
              <div
                className={`bg-slate-800 md:block ${
                  activeTab === "Tier 4" ? "block" : "hidden"
                }`}
              >
                04
              </div>
              <div
                className={`bg-slate-800 md:block ${
                  activeTab === "Tier 5" ? "block" : "hidden"
                }`}
              >
                05
              </div>
            </div>
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

import React, { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import "../../../../../i18n";
import "react-tooltip/dist/react-tooltip.css";
import TierContent from "./TierContent";
import BestItemsBuilds from "../../../../data/newData/bestItemsBuilds.json";
import ProjectCardStyleWrapper from "./BestItemsBuildsItems.style";

const ProjectItems = React.memo(() => {
  const { t } = useTranslation();
  const others = t("others");
  const { metaDeckChampionStats } = BestItemsBuilds;
  const [activeTab, setActiveTab] = useState("Tier 1");

  // Memoize filtered data to prevent re-filtering on every render
  const filteredDataByTier = useMemo(() => {
    if (!metaDeckChampionStats) return {};

    return {
      1: metaDeckChampionStats.filter((stats) => stats?.cost === 1),
      2: metaDeckChampionStats.filter((stats) => stats?.cost === 2),
      3: metaDeckChampionStats.filter((stats) => stats?.cost === 3),
      4: metaDeckChampionStats.filter((stats) => stats?.cost === 4),
      5: metaDeckChampionStats.filter((stats) => stats?.cost === 5),
    };
  }, [metaDeckChampionStats]);

  return (
    <ProjectCardStyleWrapper>
      <div className="pt-2 px-2 sm:px-4">
        <div className="projects-row overflow-auto md:overflow-hidden">
          <div>
            {/* TABS START */}
            <div className="text-sm font-medium text-center text-white border-b border-gray-700 md:hidden bg-[#222231] rounded-t-lg shadow-lg">
              <ul className="flex flex-wrap -mb-px justify-between">
                <li className="w-[20%]" onClick={() => setActiveTab("Tier 1")}>
                  <div
                    className={`inline-block w-full py-2 !text-base font-bold transition-all duration-200 ${
                      activeTab === "Tier 1"
                        ? "text-[#121212] border-b-2 border-blue-600 active bg-[#ffffff] rounded-t-lg"
                        : "border-transparent text-gray-300 hover:text-blue-400 hover:border-blue-400"
                    } border-b-2 rounded-t-lg cursor-pointer`}
                  >
                    {others?.tier} 1
                  </div>
                </li>
                <li className="w-[20%]" onClick={() => setActiveTab("Tier 2")}>
                  <div
                    className={`inline-block w-full py-2 !text-base font-bold transition-all duration-200 ${
                      activeTab === "Tier 2"
                        ? "text-[#121212] border-b-2 border-blue-600 active bg-[#ffffff] rounded-t-lg"
                        : "border-transparent text-gray-300 hover:text-blue-400 hover:border-blue-400"
                    } border-b-2 rounded-t-lg cursor-pointer`}
                    aria-current="page"
                  >
                    {others?.tier} 2
                  </div>
                </li>
                <li className="w-[20%]" onClick={() => setActiveTab("Tier 3")}>
                  <div
                    className={`inline-block w-full py-2 !text-base font-bold transition-all duration-200 ${
                      activeTab === "Tier 3"
                        ? "text-[#121212] border-b-2 border-blue-600 active bg-[#ffffff] rounded-t-lg"
                        : "border-transparent text-gray-300 hover:text-blue-400 hover:border-blue-400"
                    } border-b-2 rounded-t-lg cursor-pointer`}
                    aria-current="page"
                  >
                    {others?.tier} 3
                  </div>
                </li>
                <li className="w-[20%]" onClick={() => setActiveTab("Tier 4")}>
                  <div
                    className={`inline-block w-full py-2 !text-base font-bold transition-all duration-200 ${
                      activeTab === "Tier 4"
                        ? "text-[#121212] border-b-2 border-blue-600 active bg-[#ffffff] rounded-t-lg"
                        : "border-transparent text-gray-300 hover:text-blue-400 hover:border-blue-400"
                    } border-b-2 rounded-t-lg cursor-pointer`}
                  >
                    {others?.tier} 4
                  </div>
                </li>
                <li className="w-[20%]" onClick={() => setActiveTab("Tier 5")}>
                  <div
                    className={`inline-block w-full py-2 !text-base font-bold transition-all duration-200 ${
                      activeTab === "Tier 5"
                        ? "text-[#121212] border-b-2 border-blue-600 active bg-[#ffffff] rounded-t-lg"
                        : "border-transparent text-gray-300 hover:text-blue-400 hover:border-blue-400"
                    } border-b-2 rounded-t-lg cursor-pointer`}
                  >
                    {others?.tier} 5
                  </div>
                </li>
              </ul>
            </div>
            {/* TABS END */}
            <div className="flex flex-col md:grid grid-cols-5 gap-3 mt-3">
              <div
                className={`bg-[#111111] md:block !rounded-lg !border !border-[#ffffff50] shadow-lg transition-all duration-300 hover:border-[#ffffff70] ${
                  activeTab === "Tier 1" ? "block" : "hidden"
                }`}
              >
                <TierContent cost="1" itemsData={filteredDataByTier[1] || []} />
              </div>
              <div
                className={`bg-[#111111] md:block !rounded-lg !border !border-[#ffffff50] shadow-lg transition-all duration-300 hover:border-[#ffffff70] ${
                  activeTab === "Tier 2" ? "block" : "hidden"
                }`}
              >
                <TierContent cost="2" itemsData={filteredDataByTier[2] || []} />
              </div>
              <div
                className={`bg-[#111111] md:block !rounded-lg !border !border-[#ffffff50] shadow-lg transition-all duration-300 hover:border-[#ffffff70] ${
                  activeTab === "Tier 3" ? "block" : "hidden"
                }`}
              >
                <TierContent cost="3" itemsData={filteredDataByTier[3] || []} />
              </div>
              <div
                className={`bg-[#111111] md:block !rounded-lg !border !border-[#ffffff50] shadow-lg transition-all duration-300 hover:border-[#ffffff70] ${
                  activeTab === "Tier 4" ? "block" : "hidden"
                }`}
              >
                <TierContent cost="4" itemsData={filteredDataByTier[4] || []} />
              </div>
              <div
                className={`bg-[#111111] md:block !rounded-lg !border !border-[#ffffff50] shadow-lg transition-all duration-300 hover:border-[#ffffff70] ${
                  activeTab === "Tier 5" ? "block" : "hidden"
                }`}
              >
                <TierContent cost="5" itemsData={filteredDataByTier[5] || []} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProjectCardStyleWrapper>
  );
});

ProjectItems.displayName = "ProjectItems";

export default ProjectItems;

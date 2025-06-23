// components/ChampionsList.jsx
import React, { memo, useMemo } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import ReactTltp from "src/components/tooltip/ReactTltp";
import CardImage from "src/components/cardImage";
import { OptimizedImage } from "src/utils/imageOptimizer";

const ChampionWithItems = memo(
  ({ champion, championMap, itemMap, forces, tier }) => {
    const championDetails = championMap.get(champion?.key);

    const championItems = useMemo(() => {
      if (!champion?.items || !itemMap) return [];
      return champion.items
        .map((itemKey) => itemMap.get(itemKey))
        .filter(Boolean)
        .slice(0, 3);
    }, [champion?.items, itemMap]);

    if (!championDetails) return null;

    return (
      <div className="flex flex-col items-center gap-x-4 flex-grow basis-0 min-w-[65px] md:min-w-[80px] max-w-[78px] md:max-w-[150px]">
        <div className="inline-flex items-center justify-center flex-col">
          <div className="flex flex-col w-full aspect-square rounded-[20px]">
            <div
              className="relative inline-flex rounded-[10px]"
              data-tooltip-id={championDetails.key}
            >
              <CardImage
                src={championDetails}
                forces={forces}
                tier={tier}
                imgStyle="w-[68px] md:w-[84px]"
                identificationImageStyle="w=[16px] md:w-[32px]"
                textStyle="text-[10px] md:text-[16px] hidden"
                cardSize="!w-[80px] !h-[80px] md:!w-[106px] md:!h-[106px]"
                showCost={true}
                loading="lazy"
              />
            </div>
            <ReactTltp
              variant="champion"
              id={championDetails.key}
              content={championDetails}
            />
          </div>
        </div>
        <div className="inline-flex items-center justify-center w-full gap-0.5 flex-wrap">
          {championItems.map((itemDetails, idx) => (
            <div
              key={`${itemDetails.key}-${idx}`}
              className="relative z-10 hover:z-20 !border !border-[#ffffff20] aspect-square rounded-lg"
            >
              <ReactTltp
                variant="item"
                content={itemDetails}
                id={`${itemDetails.key}-${idx}`}
              />
              <OptimizedImage
                alt={itemDetails.name || "Item"}
                width={20}
                height={20}
                src={itemDetails.imageUrl}
                className="w-[20px] md:w-[30px] rounded-lg transition-all duration-300 hover:scale-150"
                data-tooltip-id={`${itemDetails.key}-${idx}`}
                loading="lazy"
                sizes="30px"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
);

const ChampionsList = memo(
  ({ championData, lookupMaps, isChampionsCollapsed, onToggleCollapsed }) => {
    const { sortedChampions, championsToDisplay } = championData;

    return (
      <div className="-mb-[8px] max-w-[342px] lg:mb-0 lg:w-full lg:max-w-[87%] lg:flex-shrink-0">
        <div className="flex flex-col">
          <div className="flex flex-wrap justify-center my-1 lg:justify-center gap-2 w-full">
            {/* Mobile view */}
            <div className="lg:hidden">
              <div className="flex flex-wrap justify-center gap-2 w-full">
                {championsToDisplay.map((champion, index) => (
                  <ChampionWithItems
                    key={`mobile-${champion.key}-${index}`}
                    champion={champion}
                    championMap={lookupMaps.championMap}
                    itemMap={lookupMaps.itemMap}
                    forces={lookupMaps.forces}
                    tier={champion.tier}
                  />
                ))}
              </div>
              {sortedChampions.length > 4 && (
                <div className="flex items-center justify-center mt-1 w-full">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#ffffff30] to-[#ffffff30]"></div>
                  <button
                    onClick={onToggleCollapsed}
                    className="mx-3 w-7 h-7 bg-[#2D2F37] hover:bg-[#3D3F47] text-[#D9A876] rounded-full transition-all duration-300 flex items-center justify-center"
                  >
                    {isChampionsCollapsed ? (
                      <FaChevronDown className="text-xs" />
                    ) : (
                      <FaChevronUp className="text-xs" />
                    )}
                  </button>
                  <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#ffffff30] to-[#ffffff30]"></div>
                </div>
              )}
            </div>
            {/* Desktop view */}
            <div className="hidden lg:flex flex-wrap justify-between gap-2 w-full">
              {sortedChampions.map((champion, index) => (
                <ChampionWithItems
                  key={`desktop-${champion.key}-${index}`}
                  champion={champion}
                  championMap={lookupMaps.championMap}
                  itemMap={lookupMaps.itemMap}
                  forces={lookupMaps.forces}
                  tier={champion.tier}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default ChampionsList;

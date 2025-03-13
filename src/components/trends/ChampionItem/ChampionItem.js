import React, { memo, useCallback } from "react";
import Image from "next/image";
import { IoMdCheckmarkCircle } from "react-icons/io";
import ReactTltp from "src/components/tooltip/ReactTltp";
import ImageBorders from "../../../data/newData/costWiseBorders.json";

/**
 * ChampionItem - A reusable component for displaying champion items
 * Used by both MetaTrends and RecentDecks components
 */
const ChampionItem = ({ champion, setSelectedChampion, index, forces }) => {
  // Use useCallback to memoize the click handler
  const handleClick = useCallback(() => {
    if (champion?.key) {
      setSelectedChampion(champion.key);
    }
  }, [champion?.key, setSelectedChampion]);

  // Early return if champion is not provided
  if (!champion) return null;

  // Find border image once
  const borderImage = ImageBorders?.find(
    (border) => border?.cost === champion?.cost
  )?.imageUrl;

  // Find force image once
  const forceImage = forces?.find(
    (force) => force?.key === champion?.variant
  )?.imageUrl;

  return (
    <div
      className={`relative inline-flex cursor-pointer shadow-none hover:[box-shadow:rgba(255,_0,_0)_0px_54px_55px,_rgba(0,_0,_0,_0.12)_0px_-12px_30px,_rgba(0,_0,_0,_0.12)_0px_4px_6px,_rgba(0,_0,_0,_0.17)_0px_12px_13px,_rgba(0,_0,_0,_0.09)_0px_-3px_5px] hover:-translate-y-0.5 transition-all duration-300 ease-in-out`}
      onClick={handleClick}
    >
      <ReactTltp variant="champion" content={champion} id={champion?.key} />
      <div
        className="relative inline-flex flex-col"
        data-tooltip-id={champion?.key}
      >
        <div className="relative flex flex-col w-[72px] h-[72px] lg:w-[98px] lg:h-[98px]">
          <div
            className={`relative inline-flex rounded-[6px] w-full h-full ${
              champion?.selected ? "border-[green]" : "border-none"
            } bg-cover`}
            style={{
              backgroundImage: `url(${borderImage})`,
            }}
          >
            {champion.cardImage && (
              <Image
                src={champion.cardImage}
                alt={`${champion.name || "Champion"} Image`}
                className="w-[95%] h-[95%] m-auto"
                width={80}
                height={80}
                priority={index < 4} // Prioritize loading for first 4 images
              />
            )}

            {forceImage && (
              <Image
                src={forceImage}
                className="absolute -top-[3px] -right-[3px] w-[20px] md:w-[30px]"
                alt={`${champion.variant || "Force"} icon`}
                width={32}
                height={32}
              />
            )}

            {champion?.selected && (
              <IoMdCheckmarkCircle className="absolute top-0 right-0 w-full h-full p-3 bg-[#00000060] text-[#86efaccc]" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Use React.memo to prevent unnecessary re-renders
export default memo(ChampionItem);

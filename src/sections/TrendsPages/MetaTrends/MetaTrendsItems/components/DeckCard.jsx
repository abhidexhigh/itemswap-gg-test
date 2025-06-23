// components/DeckCard.jsx
import React, { memo, useMemo, useState, useCallback } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import DeckHeader from "./DeckHeader";
import ChampionsList from "./ChampionsList";

const DeckCard = memo(
  ({ metaDeck, index, isClosed, onToggleClosed, lookupMaps, others }) => {
    const [isChampionsCollapsed, setIsChampionsCollapsed] = useState(true);

    const championData = useMemo(() => {
      if (!metaDeck?.deck?.champions || !lookupMaps.championMap) {
        return { sortedChampions: [], championsToDisplay: [] };
      }

      const sortedChampions = metaDeck.deck.champions.slice().sort((a, b) => {
        const champA = lookupMaps.championMap.get(a.key);
        const champB = lookupMaps.championMap.get(b.key);
        return (champA?.cost || 0) - (champB?.cost || 0);
      });

      const championsToDisplay = isChampionsCollapsed
        ? sortedChampions
            .slice()
            .sort((a, b) => {
              const isATier4Plus = (a?.tier || 0) >= 4;
              const isBTier4Plus = (b?.tier || 0) >= 4;
              if (isATier4Plus && !isBTier4Plus) return -1;
              if (!isATier4Plus && isBTier4Plus) return 1;
              return 0;
            })
            .slice(0, 4)
        : sortedChampions;

      return { sortedChampions, championsToDisplay };
    }, [
      metaDeck?.deck?.champions,
      lookupMaps.championMap,
      isChampionsCollapsed,
    ]);

    const handleChampionsToggle = useCallback(() => {
      setIsChampionsCollapsed((prev) => !prev);
    }, []);

    const statsData = useMemo(
      () => [
        [others?.top4, "65.3%"],
        [others?.winPercentage, "26.6%"],
        [others?.pickPercentage, "0.39%"],
        [others?.avgPlacement, "4.52"],
      ],
      [others]
    );

    return (
      <div className="flex flex-col gap-[1px] bg-gradient-to-r from-[#5f5525] to-[#6D4600] p-[1px] rounded-lg overflow-hidden shadow-lg mb-4 md:!mb-10">
        <div className="bg-[#000000] rounded-lg">
          <DeckHeader metaDeck={metaDeck} lookupMaps={lookupMaps} />

          <div className="flex items-center justify-center mt-1 w-full transition-all duration-300 ease-in-out">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#ffffff30] to-[#ffffff30]"></div>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#ffffff30] to-[#ffffff30]"></div>
          </div>

          {!isClosed && (
            <div className="flex flex-col bg-center bg-no-repeat mt-[-1px]">
              <div className="flex min-h-[150px] flex-col justify-between items-center bg-[#111111] lg:flex-row lg:gap-[15px] lg:py-[0px] xl:px-6 rounded-b-lg">
                <ChampionsList
                  championData={championData}
                  lookupMaps={lookupMaps}
                  isChampionsCollapsed={isChampionsCollapsed}
                  onToggleCollapsed={handleChampionsToggle}
                />

                {/* Stats sections */}
                <div className="md:hidden flex text-center w-full h-full justify-between pb-1 px-[16px] sm:px-[18px]">
                  {statsData.map(([label, value], i) => (
                    <dl key={i} className="flex flex-col justify-between">
                      <dt className="text-[12px] font-medium leading-5 text-[#999]">
                        {label}
                      </dt>
                      <dd className="text-base font-medium leading-4 text-[#D9A876]">
                        <span>{value}</span>
                      </dd>
                    </dl>
                  ))}
                </div>

                <div className="md:flex flex-col hidden">
                  <div className="flex w-full flex-col gap-y-4 h-full justify-between rounded-[4px] bg-[#1D1D1D] pt-[10px] pb-1 px-[16px] sm:px-[18px]">
                    {statsData.map(([label, value], i) => (
                      <dl key={i} className="flex justify-between gap-x-6">
                        <dt className="text-[11px] md:text-[14px] font-medium leading-5 text-[#999]">
                          {label}
                        </dt>
                        <dd className="text-[11px] md:text-[14px] font-medium leading-5 text-[#D9A876]">
                          <span>{value}</span>
                        </dd>
                      </dl>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default DeckCard;

import React, { memo, useMemo, useCallback, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import MetaTrendsItem from "../MetaTrendsItem/MetaTrendsItem";
import { OptimizedImage } from "src/utils/imageOptimizer";

// Memoize static arrays to prevent recreation
const coinIcons = [
  "https://res.cloudinary.com/dg0cmj6su/image/upload/v1742550115/01_uwt4jg.png",
  "https://res.cloudinary.com/dg0cmj6su/image/upload/v1742550115/02_wnemuc.png",
  "https://res.cloudinary.com/dg0cmj6su/image/upload/v1742550114/03_pfqvqc.png",
  "https://res.cloudinary.com/dg0cmj6su/image/upload/v1742550114/04_m1yxes.png",
  "https://res.cloudinary.com/dg0cmj6su/image/upload/v1742550114/05_zqb2ji.png",
];

// Simplified CoinIcon component
const CoinIcon = memo(({ index, priority = false }) => {
  if (index >= coinIcons.length) return null;

  return (
    <div className="flex items-center gap-1">
      <div className="relative">
        <OptimizedImage
          src={coinIcons[index]}
          className="w-8 md:w-10 2xl:w-12"
          alt={`Cost ${index + 1} Icon`}
          width={48}
          height={48}
          priority={priority}
        />
      </div>
    </div>
  );
});

// Optimized ChampionsCostSection component
const ChampionsCostSection = memo(
  ({ champions, costIndex, setSelectedChampion, forces, selectedChampion }) => {
    // Store processed champions in ref to prevent reshuffling
    const processedChampionsRef = useRef(null);

    // Process champions only once
    const sortedChampions = useMemo(() => {
      // If we already have processed these champions, return them
      if (processedChampionsRef.current?.original === champions) {
        return processedChampionsRef.current.sorted;
      }

      if (!champions || champions.length === 0) return [];

      // Sort once by type, then by name for consistency
      const sorted = [...champions].sort((a, b) => {
        const typeCompare = (a.type || "").localeCompare(b.type || "");
        if (typeCompare !== 0) return typeCompare;
        return (a.name || "").localeCompare(b.name || "");
      });

      // Store result in ref to prevent future reshuffling
      processedChampionsRef.current = {
        original: champions,
        sorted: sorted,
      };

      return sorted;
    }, [champions]);

    // Memoize the renderChampion function
    const renderChampion = useCallback(
      (champion, j) => (
        <MetaTrendsItem
          key={`${champion.key || j}`}
          champion={{
            ...champion,
            selected: champion.key === selectedChampion,
          }}
          setSelectedChampion={setSelectedChampion}
          index={j}
          forces={forces}
        />
      ),
      [setSelectedChampion, forces, selectedChampion]
    );

    return (
      <div className="mx-auto w-full">
        <div
          className="flex items-center flex-wrap mb-2 justify-center rounded-tl-none rounded-tr-none"
          style={{ gap: "8px" }}
        >
          <div className="hidden lg:flex items-center">
            {costIndex < coinIcons.length && (
              <CoinIcon index={costIndex} priority={true} />
            )}
          </div>
          {sortedChampions.map((champion, j) => renderChampion(champion, j))}
        </div>
      </div>
    );
  },
  // Custom comparison function to prevent unnecessary re-renders
  (prevProps, nextProps) => {
    return (
      prevProps.champions === nextProps.champions &&
      prevProps.costIndex === nextProps.costIndex &&
      prevProps.selectedChampion === nextProps.selectedChampion &&
      prevProps.forces === nextProps.forces
    );
  }
);

const MetaTrendsCard = ({
  championsByCost,
  setSelectedChampion,
  selectedChampion,
  forces,
}) => {
  const { t } = useTranslation();
  const others = t("others");

  // State for mobile tabs
  const [activeTab, setActiveTab] = useState(0);

  // Memoized tab button component
  const TabButton = memo(({ index, isActive, onClick }) => (
    <button
      onClick={() => onClick(index)}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
        isActive
          ? "bg-[#2d2f37] text-[#FFC528] border border-[#FFC528]"
          : "bg-[#1D1D1D] text-gray-400 hover:bg-[#2D2F37] border border-gray-600"
      }`}
    >
      {index < coinIcons.length && (
        <OptimizedImage
          src={coinIcons[index]}
          className="w-6 h-6"
          alt={`Cost ${index + 1} Icon`}
          width={24}
          height={24}
          priority={true}
        />
      )}
    </button>
  ));

  // Memoized mobile tabs navigation
  const MobileTabsNav = memo(() => (
    <div className="lg:hidden mx-3">
      <div className="flex gap-2 overflow-x-auto pb-2 pt-2 justify-center">
        {championsByCost.map((champions, index) => (
          <TabButton
            key={`tab-${index}`}
            index={index}
            isActive={activeTab === index}
            onClick={setActiveTab}
          />
        ))}
      </div>
    </div>
  ));

  // Memoized mobile content
  const mobileContent = useMemo(() => {
    if (!championsByCost[activeTab]) return null;

    return (
      <ChampionsCostSection
        key={`mobile-cost-${activeTab}`}
        champions={championsByCost[activeTab]}
        costIndex={activeTab}
        setSelectedChampion={setSelectedChampion}
        forces={forces}
        selectedChampion={selectedChampion}
      />
    );
  }, [
    championsByCost,
    activeTab,
    setSelectedChampion,
    forces,
    selectedChampion,
  ]);

  // Memoized desktop content
  const desktopContent = useMemo(() => {
    return championsByCost.map((champions, i) => (
      <ChampionsCostSection
        key={`desktop-cost-${i}`}
        champions={champions}
        costIndex={i}
        setSelectedChampion={setSelectedChampion}
        forces={forces}
        selectedChampion={selectedChampion}
      />
    ));
  }, [championsByCost, setSelectedChampion, forces, selectedChampion]);

  return (
    <div className="rounded-[4px]">
      {/* Mobile Tabs Navigation */}
      <MobileTabsNav />

      <div className="grid grid-cols-1 m-2">
        {/* Mobile View - Show only active tab */}
        <div className="lg:hidden">{mobileContent}</div>

        {/* Desktop View - Show all sections */}
        <div className="hidden lg:block">{desktopContent}</div>
      </div>
    </div>
  );
};

export default memo(MetaTrendsCard);

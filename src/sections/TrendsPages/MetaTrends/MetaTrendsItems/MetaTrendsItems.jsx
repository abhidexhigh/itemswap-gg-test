import { useTranslation } from "react-i18next";
import "../../../../../i18n";
import React, {
  useState,
  useCallback,
  useMemo,
  memo,
  useRef,
  useEffect,
} from "react";
import "react-tooltip/dist/react-tooltip.css";
import MetaTrendsCard from "../MetaTrendsCard/MetaTrendsCard";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useCompsData } from "../../../../hooks/useCompsData";

import CardImage from "src/components/cardImage";
import { OptimizedImage } from "src/utils/imageOptimizer";
import ForceIcon from "src/components/forceIcon";
import TraitImage from "src/components/TraitImage/TraitImage";
import SkillTreeImage from "src/components/SkillTreeImage";
import AugmentImage from "src/components/AugmentImage";
import ItemDisplay from "src/components/item/ItemDisplay";
import { WithTooltip } from "src/components/tooltip/GlobalTooltip";

// Simple utility functions
const shuffle = (array) => {
  if (!array?.length) return [];
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Optimized intersection observer for lazy loading
const useLazyLoading = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          // Once visible, stop observing to prevent unnecessary updates
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.05, rootMargin: "100px" }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [isVisible]);

  return [ref, isVisible];
};

// Fixed scroll handler with proper throttling
const useInfiniteScroll = (callback, hasMore) => {
  useEffect(() => {
    if (!hasMore) return;

    let timeoutId = null;
    let isThrottled = false;

    const handleScroll = () => {
      if (isThrottled) return;

      isThrottled = true;
      timeoutId = setTimeout(() => {
        const { scrollTop, scrollHeight, clientHeight } =
          document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - 1000 && hasMore) {
          callback();
        }
        isThrottled = false;
      }, 150);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [callback, hasMore]);
};

// Optimized lazy wrapper component
const LazyWrapper = memo(({ children, height = "120px" }) => {
  const [ref, isVisible] = useLazyLoading();

  return (
    <div ref={ref} style={{ minHeight: height }}>
      {isVisible ? (
        children
      ) : (
        <div
          style={{
            height,
            backgroundColor: "transparent",
            contain: "layout style paint",
          }}
        />
      )}
    </div>
  );
});

// Simplified tab button
const TabButton = memo(({ active, label, onClick }) => (
  <button
    type="button"
    className={`px-6 py-3 text-sm md:text-base font-medium transition-colors duration-200 ${
      active ? "bg-[#2D2F37] text-[#D9A876]" : "text-[#999] hover:bg-[#2D2F37]"
    }`}
    onClick={onClick}
  >
    {label}
  </button>
));

// Reusable CSS classes to reduce repetition in item components
const itemContainerClass =
  "flex flex-col items-center gap-2 cursor-pointer group";
const imageContainerClass =
  "relative aspect-square w-full max-w-[96px] transition-transform duration-200 group-hover:scale-105";
const selectedOverlayClass =
  "absolute inset-0 bg-[#00000080] rounded-lg flex items-center justify-center z-20";
const labelClass =
  "hidden lg:block text-sm md:text-base text-[#D9A876] bg-[#1b1a32] px-3 py-1 rounded-full truncate max-w-full";

const TraitItem = memo(
  ({ trait, selectedItem, onSelect, i }) => {
    const handleClick = useCallback(
      () => onSelect("trait", trait?.key),
      [onSelect, trait?.key]
    );
    const isSelected = trait?.key === selectedItem;

    return (
      <WithTooltip variant="trait" content={trait}>
        <div className={itemContainerClass} onClick={handleClick}>
          <div className={imageContainerClass}>
            <TraitImage
              trait={trait}
              size="xlarge"
              className="w-full h-full rounded-lg"
              loading="lazy"
              showTooltip={false}
            />
            {isSelected && (
              <div className={selectedOverlayClass}>
                <IoMdCheckmarkCircle className="text-[#86efac] text-4xl z-50" />
              </div>
            )}
          </div>
          <span className={labelClass}>{trait?.name}</span>
        </div>
      </WithTooltip>
    );
  },
  (prevProps, nextProps) =>
    prevProps.trait?.key === nextProps.trait?.key &&
    prevProps.selectedItem === nextProps.selectedItem &&
    prevProps.i === nextProps.i
);

const ForceItem = memo(
  ({ force, selectedItem, onSelect, i }) => {
    const [isHovered, setIsHovered] = useState(false);
    const handleClick = useCallback(
      () => onSelect("force", force?.key),
      [onSelect, force?.key]
    );
    const isSelected = force?.key === selectedItem;

    return (
      <WithTooltip variant="force" content={force}>
        <div
          className={itemContainerClass}
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className={imageContainerClass}>
            <ForceIcon
              force={force}
              size="xxlarge"
              isHovered={isHovered}
              className="w-full h-full object-cover rounded-lg"
              loading="lazy"
            />
            {isSelected && (
              <div className={selectedOverlayClass}>
                <IoMdCheckmarkCircle className="text-[#86efac] text-4xl z-50" />
              </div>
            )}
          </div>
          <span className="hidden lg:block text-sm md:text-base text-[#cccccc] bg-[#1b1a32] px-3 py-1 rounded-full truncate max-w-full">
            {force?.name}
          </span>
        </div>
      </WithTooltip>
    );
  },
  (prevProps, nextProps) =>
    prevProps.force?.key === nextProps.force?.key &&
    prevProps.selectedItem === nextProps.selectedItem &&
    prevProps.i === nextProps.i
);

const SkillTreeItem = memo(
  ({ skill, selectedSkillTree, onSelect, i, mobile = false }) => {
    const handleClick = useCallback(
      () => onSelect("skillTree", skill?.key),
      [onSelect, skill?.key]
    );
    const isSelected = skill?.key === selectedSkillTree;

    const containerClass = mobile
      ? "flex flex-col items-center gap-1 cursor-pointer group w-12 sm:w-14 flex-shrink-0"
      : "flex flex-col items-center gap-1 cursor-pointer group w-16 md:w-20 lg:w-24 flex-shrink-0";
    const textClass = mobile ? "text-[10px]" : "text-xs";
    const iconClass = mobile ? "text-2xl" : "text-3xl";

    return (
      <WithTooltip variant="skillTree" content={skill}>
        <div className={containerClass} onClick={handleClick}>
          <div className="relative aspect-square w-full transition-transform duration-200 group-hover:scale-105">
            <SkillTreeImage
              skill={skill}
              size={mobile ? "small" : "large"}
              className="w-full h-full"
              showTooltip={false}
              loading="lazy"
            />
            {isSelected && (
              <div className={selectedOverlayClass}>
                <IoMdCheckmarkCircle
                  className={`text-[#86efac] ${iconClass} z-50`}
                />
              </div>
            )}
          </div>
          <span
            className={`${textClass} truncate max-w-full text-center text-[#cccccc] mt-1`}
          >
            {skill?.name}
          </span>
        </div>
      </WithTooltip>
    );
  },
  (prevProps, nextProps) =>
    prevProps.skill?.key === nextProps.skill?.key &&
    prevProps.selectedSkillTree === nextProps.selectedSkillTree &&
    prevProps.mobile === nextProps.mobile &&
    prevProps.i === nextProps.i
);

const ItemIcon = memo(
  ({ item, selectedItem, onSelect, i }) => {
    const handleClick = useCallback(
      () => onSelect("item", item?.key),
      [onSelect, item?.key]
    );
    const isSelected = item?.key === selectedItem;

    return (
      <WithTooltip variant="item" content={item}>
        <div
          className="flex flex-col items-center gap-2 cursor-pointer group max-w-[84px]"
          onClick={handleClick}
        >
          <div className="relative aspect-square w-full transition-transform duration-200 group-hover:scale-110">
            <OptimizedImage
              alt={item?.name}
              width={60}
              height={60}
              src={item?.imageUrl}
              className="w-full h-full object-contain rounded-lg !border !border-[#ffffff20]"
              loading="lazy"
              sizes="(max-width: 768px) 50vw, 84px"
            />
            {isSelected && (
              <div className={selectedOverlayClass}>
                <IoMdCheckmarkCircle className="text-[#86efac] text-5xl z-50" />
              </div>
            )}
          </div>
        </div>
      </WithTooltip>
    );
  },
  (prevProps, nextProps) =>
    prevProps.item?.key === nextProps.item?.key &&
    prevProps.selectedItem === nextProps.selectedItem &&
    prevProps.i === nextProps.i
);

// Simplified champion component
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
        <div className="flex items-center justify-center w-full gap-0.5 flex-wrap">
          {championItems.map((itemDetails, idx) => (
            <div
              key={`${itemDetails.key}-${idx}`}
              className="hover:z-20 hover:scale-125 transition-all duration-300"
            >
              <ItemDisplay
                item={itemDetails}
                tooltipId={`${itemDetails.key}-${idx}`}
                size="xxSmall"
                showFrame={true}
                borderRadius="rounded-lg"
                backgroundRadius="rounded-lg"
                style="default"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
);

// Optimized deck header with better memoization
const DeckHeader = memo(
  ({ metaDeck, forceMap, traitMap, skillMap, augmentMap }) => {
    const [hoveredForce, setHoveredForce] = useState(null);

    const handleForceMouseEnter = useCallback((forceKey) => {
      setHoveredForce(forceKey);
    }, []);

    const handleForceMouseLeave = useCallback(() => {
      setHoveredForce(null);
    }, []);

    const headerData = useMemo(() => {
      if (!metaDeck?.deck)
        return {
          forceDetails: [],
          skillDetails: [],
          traitDetails: [],
          augmentDetails: [],
        };

      const forceDetails =
        metaDeck.deck.forces
          ?.map((force) => ({
            ...force,
            details: forceMap.get(force?.key.toLowerCase()),
          }))
          .filter((force) => force.details) || [];

      const skillDetails =
        metaDeck.deck.skillTree
          ?.map((skill) => skillMap.get(skill))
          .filter(Boolean) || [];

      const traitDetails =
        metaDeck.deck.traits
          ?.map((trait) => {
            const traitDetails = traitMap.get(trait?.key);
            if (!traitDetails) return null;
            const tier = traitDetails.tiers?.find(
              (t) => trait?.numUnits >= t?.min && trait?.numUnits <= t?.max
            );
            return tier?.imageUrl
              ? { ...traitDetails, tier, numUnits: trait?.numUnits }
              : null;
          })
          .filter(Boolean) || [];

      const augmentDetails =
        metaDeck.deck.augments
          ?.map((augment) => augmentMap.get(augment))
          .filter(Boolean) || [];

      return { forceDetails, skillDetails, traitDetails, augmentDetails };
    }, [metaDeck?.deck, forceMap, traitMap, skillMap, augmentMap]);

    const { forceDetails, skillDetails, traitDetails, augmentDetails } =
      headerData;

    return (
      <header className="relative flex flex-col md:flex-col justify-between items-start md:items-end py-[10px] pl-3 md:pl-4 pr-3 md:pr-[36px] lg:min-h-[50px] lg:flex-row lg:items-center lg:py-[5px] lg:pr-[16px]">
        <div className="inline-flex flex-col flex-wrap gap-[8px] w-full md:w-auto md:flex-row md:items-center md:gap-[4px]">
          <strong className="text-[26px] font-semibold leading-none text-[#F2A03D] text-center md:text-left">
            {metaDeck?.name}
          </strong>
          {/* Desktop: Traits */}
          <div className="hidden md:flex items-center gap-1 ml-4">
            {traitDetails.slice(0, 5).map((trait, index) => {
              const tooltipId = `${trait.key}-${index}`;
              return (
                <div key={`${trait.key}-${index}`} className="relative">
                  <TraitImage
                    trait={trait}
                    size="default"
                    className="w-[38px] h-[38px] md:w-[36px] md:h-[36px]"
                    loading="lazy"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile layout */}
        <div className="flex md:hidden flex-col gap-y-3 mt-2 w-full items-center">
          <div className="flex items-center gap-x-2 w-fit overflow-hidden border border-[#ffffff40] rounded-lg p-1">
            {forceDetails.slice(0, 4).map((force, index) => (
              <WithTooltip key={`${force.key}-${index}`} content={force?.key}>
                <ForceIcon
                  force={force.details}
                  size="custom"
                  customSize="w-[30px] h-[30px]"
                  className="flex-shrink-0 aspect-square"
                  isHovered={hoveredForce === force?.key}
                  loading="lazy"
                />
              </WithTooltip>
            ))}
            {forceDetails.length > 0 && skillDetails.length > 0 && (
              <div className="flex-shrink-0 h-8 w-px bg-[#ffffff30] mx-1"></div>
            )}
            {skillDetails.slice(0, 3).map((skill, index) => (
              <SkillTreeImage
                key={`${skill.key}-${index}`}
                skill={skill}
                size="default"
                className="flex-shrink-0 w-[30px] h-[30px] shadow-md rounded-full shadow-[#ffffff20]"
                loading="lazy"
              />
            ))}
          </div>

          <div className="flex items-center gap-x-1 w-fit overflow-x-auto scrollbar-hide">
            {traitDetails.slice(0, 6).map((trait, index) => (
              <TraitImage
                key={`${trait.key}-${index}`}
                trait={trait}
                size="small"
                className="flex-shrink-0 !w-[34px] !h-[34px]"
                loading="lazy"
              />
            ))}
            {traitDetails.length > 0 && augmentDetails.length > 0 && (
              <div className="flex-shrink-0 h-8 w-px bg-[#ffffff30] mx-2"></div>
            )}
            {augmentDetails.slice(0, 4).map((augment, index) => (
              <AugmentImage
                key={`augment-${augment.key}-${index}`}
                augment={augment}
                size="default"
                className="flex-shrink-0 mx-0.5"
                loading="lazy"
              />
            ))}
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden md:inline-flex flex-shrink-0 justify-between gap-1 !gap-x-6 md:mt-1">
          <div className="flex flex-wrap gap-1 md:gap-0 md:inline-flex md:flex-wrap justify-start md:justify-end items-center md:mr-0">
            {forceDetails.map((force, index) => (
              <WithTooltip key={`${force.key}-${index}`} content={force?.key}>
                <div
                  className="flex justify-center items-center bg-[#000] rounded-full mx-1 pr-2 border-[1px] border-[#ffffff30] h-[90%]"
                  onMouseEnter={() => handleForceMouseEnter(force?.key)}
                  onMouseLeave={handleForceMouseLeave}
                >
                  <ForceIcon
                    force={force.details}
                    size="custom"
                    customSize="w-[30px] h-[30px] md:w-[36px] md:h-[36px]"
                    className="mr-1"
                    isHovered={hoveredForce === force?.key}
                    loading="lazy"
                  />
                  <span className="text-[18px]">{force?.numUnits}</span>
                </div>
              </WithTooltip>
            ))}
            {forceDetails.length > 0 && skillDetails.length > 0 && (
              <div className="flex items-center mx-2">
                <div className="h-12 w-px bg-[#ffffff30]"></div>
              </div>
            )}
            {skillDetails.map((skill, index) => (
              <SkillTreeImage
                key={`${skill.key}-${index}`}
                skill={skill}
                size="medium"
                loading="lazy"
              />
            ))}
            {skillDetails.length > 0 && augmentDetails.length > 0 && (
              <div className="flex items-center mx-2">
                <div className="h-12 w-px bg-[#ffffff30]"></div>
              </div>
            )}
            {augmentDetails.map((augment, index) => (
              <AugmentImage
                key={`augment-${augment.key}-${index}`}
                augment={augment}
                size="medium"
                className="mx-0.5"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </header>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if metaDeck name or deck composition changes
    return (
      prevProps.metaDeck?.name === nextProps.metaDeck?.name &&
      JSON.stringify(prevProps.metaDeck?.deck) ===
        JSON.stringify(nextProps.metaDeck?.deck)
    );
  }
);

// Optimized deck component with better performance
const MetaDeck = memo(
  ({ metaDeck, i, isClosed, handleIsClosed, lookupMaps, others }) => {
    const [isChampionsCollapsed, setIsChampionsCollapsed] = useState(true);

    const deckData = useMemo(() => {
      if (!metaDeck?.deck?.champions || !lookupMaps.championMap)
        return { sortedChampions: [], championsToDisplay: [] };

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

    const { sortedChampions, championsToDisplay } = deckData;

    // Pre-compute deck closed state for better performance
    const isDeckClosed = isClosed[i];

    return (
      <LazyWrapper height="200px">
        <div className="flex flex-col gap-[1px] bg-gradient-to-r from-[#5f5525] to-[#6D4600] p-[1px] rounded-lg overflow-hidden shadow-lg mb-4 md:!mb-10">
          <div className="bg-[#000000] rounded-lg">
            <DeckHeader
              metaDeck={metaDeck}
              forceMap={lookupMaps.forceMap}
              traitMap={lookupMaps.traitMap}
              skillMap={lookupMaps.skillMap}
              augmentMap={lookupMaps.augmentMap}
            />
            <div className="flex items-center justify-center mt-1 w-full transition-all duration-300 ease-in-out">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#ffffff30] to-[#ffffff30]"></div>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#ffffff30] to-[#ffffff30]"></div>
            </div>
            {!isDeckClosed && (
              <div className="flex flex-col bg-center bg-no-repeat mt-[-1px]">
                <div className="flex min-h-[150px] flex-col justify-between items-center bg-[#111111] lg:flex-row lg:gap-[15px] lg:py-[0px] xl:px-6 rounded-b-lg">
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
                                onClick={handleChampionsToggle}
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

                  {/* Stats sections */}
                  <div className="md:hidden flex text-center w-full h-full justify-between pb-1 px-[16px] sm:px-[18px]">
                    {["65.3%", "26.6%", "0.39%", "4.52"].map((value, i) => (
                      <dl key={i} className="flex flex-col justify-between">
                        <dt className="text-[12px] font-medium leading-5 text-[#999]">
                          {
                            [
                              others?.top4,
                              others?.winPercentage,
                              others?.pickPercentage,
                              others?.avgPlacement,
                            ][i]
                          }
                        </dt>
                        <dd className="text-base font-medium leading-4 text-[#D9A876]">
                          {value}
                        </dd>
                      </dl>
                    ))}
                  </div>

                  <div className="hidden md:flex flex-col w-full gap-y-4 h-full justify-between rounded-[4px] bg-[#1D1D1D] pt-[10px] pb-1 px-[16px] sm:px-[18px]">
                    {[
                      [others?.top4, "65.3%"],
                      [others?.winPercentage, "26.6%"],
                      [others?.pickPercentage, "0.39%"],
                      [others?.avgPlacement, "4.52"],
                    ].map(([label, value], i) => (
                      <dl key={i} className="flex justify-between gap-x-6">
                        <dt className="text-[11px] md:text-[14px] font-medium leading-5 text-[#999]">
                          {label}
                        </dt>
                        <dd className="text-[11px] md:text-[14px] font-medium leading-5 text-[#D9A876]">
                          {value}
                        </dd>
                      </dl>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </LazyWrapper>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.metaDeck?.name === nextProps.metaDeck?.name &&
      prevProps.i === nextProps.i &&
      prevProps.isClosed[prevProps.i] === nextProps.isClosed[nextProps.i]
    );
  }
);

// Main component with simplified logic
const MetaTrendsItems = () => {
  const { t } = useTranslation();
  const others = t("others");

  // State
  const [selectedChampion, setSelectedChampion] = useState(null);
  const [selectedTrait, setSelectedTrait] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedSkillTree, setSelectedSkillTree] = useState(null);
  const [isClosed, setIsClosed] = useState({});
  const [activeTab, setActiveTab] = useState("Champions");
  const [activeTraitsSubTab, setActiveTraitsSubTab] = useState("Origin");
  const [activeSkillsSubTab, setActiveSkillsSubTab] = useState(null);
  const [visibleDecks, setVisibleDecks] = useState(10);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Data
  const {
    metaDecks,
    champions,
    items,
    traits,
    augments,
    forces,
    skillTree,
    isLoading,
    error,
    refetch,
  } = useCompsData();

  // Simplified lookup maps
  const lookupMaps = useMemo(
    () => ({
      championMap: new Map(champions?.map((c) => [c.key, c]) || []),
      itemMap: new Map(items?.map((i) => [i.key, i]) || []),
      traitMap: new Map(traits?.map((t) => [t.key, t]) || []),
      forceMap: new Map(forces?.map((f) => [f.key.toLowerCase(), f]) || []),
      skillMap: new Map(skillTree?.map((s) => [s.key, s]) || []),
      augmentMap: new Map(augments?.map((a) => [a.key, a]) || []),
      forces,
    }),
    [champions, items, traits, forces, skillTree, augments]
  );

  const [compsData, setCompsData] = useState(metaDecks || []);

  useEffect(() => {
    setCompsData(metaDecks || []);
  }, [metaDecks]);

  // Optimized data processing with better performance
  const { filteredChampions, groupedArray } = useMemo(() => {
    if (!champions?.length) return { filteredChampions: [], groupedArray: [] };

    const championsByType = new Map();
    for (const champion of champions) {
      if (!champion.type) continue;
      if (!championsByType.has(champion.type)) {
        championsByType.set(champion.type, []);
      }
      championsByType.get(champion.type).push(champion);
    }

    const filtered = [];
    for (const group of championsByType.values()) {
      const selected = shuffle([...group]).slice(0, 2);
      filtered.push(...selected);
    }

    const groupedByCost = new Map();
    for (const champion of filtered) {
      const { cost } = champion;
      if (!groupedByCost.has(cost)) {
        groupedByCost.set(cost, []);
      }
      groupedByCost.get(cost).push({ ...champion, selected: false });
    }

    return {
      filteredChampions: filtered,
      groupedArray: Array.from(groupedByCost.entries())
        .sort(([costA], [costB]) => costA - costB)
        .map(([, champions]) => champions),
    };
  }, [champions]);

  const championsWithSelection = useMemo(() => {
    return groupedArray.map((costGroup) =>
      costGroup.map((champion) => ({
        ...champion,
        selected: champion.key === selectedChampion,
      }))
    );
  }, [groupedArray, selectedChampion]);

  const filteredItems = useMemo(() => {
    return items?.filter((item) => !item?.isFromItem) || [];
  }, [items]);

  const skillsByVariant = useMemo(() => {
    if (!skillTree?.length) return {};
    const grouped = {};
    const validSkills = skillTree.filter((skill) => skill?.imageUrl);

    validSkills.forEach((skill) => {
      const variant = skill.variant || "General";
      if (!grouped[variant]) grouped[variant] = [];
      grouped[variant].push(skill);
    });

    return grouped;
  }, [skillTree]);

  // Initialize skills sub-tab
  useEffect(() => {
    const variants = Object.keys(skillsByVariant);
    if (variants.length > 0 && !activeSkillsSubTab) {
      setActiveSkillsSubTab(variants[0]);
    }
  }, [skillsByVariant, activeSkillsSubTab]);

  // Filter and sort functions
  const filterAndSortDecks = useCallback(
    (type, key) => {
      if (!metaDecks?.length) return [];

      // First filter decks that match the criteria
      const filteredDecks = metaDecks.filter((deck) => {
        switch (type) {
          case "trait":
            return deck.deck.traits.some(
              (trait) => trait.key === key && trait.numUnits > 0
            );
          case "force":
            return deck.deck.forces.some(
              (force) =>
                force.key.toLowerCase() === key.toLowerCase() &&
                force.numUnits > 0
            );
          case "champion":
            return deck.deck.champions.some((champion) => champion.key === key);
          case "item":
            return deck.deck.champions.some((champion) =>
              champion.items?.some((item) => item === key)
            );
          case "skillTree":
            return deck.deck?.skillTree?.includes(key) || false;
          default:
            return true;
        }
      });

      // Then sort the filtered decks by relevance
      return filteredDecks.sort((a, b) => {
        switch (type) {
          case "trait":
            const aTraitCount =
              a.deck.traits.find((trait) => trait.key === key)?.numUnits || 0;
            const bTraitCount =
              b.deck.traits.find((trait) => trait.key === key)?.numUnits || 0;
            return bTraitCount - aTraitCount;
          case "force":
            const aForceCount =
              a.deck.forces.find(
                (force) => force.key.toLowerCase() === key.toLowerCase()
              )?.numUnits || 0;
            const bForceCount =
              b.deck.forces.find(
                (force) => force.key.toLowerCase() === key.toLowerCase()
              )?.numUnits || 0;
            return bForceCount - aForceCount;
          case "champion":
            // For champions, we can sort by champion tier if available
            const aChampion = a.deck.champions.find(
              (champion) => champion.key === key
            );
            const bChampion = b.deck.champions.find(
              (champion) => champion.key === key
            );
            const aTier = aChampion?.tier || 0;
            const bTier = bChampion?.tier || 0;
            return bTier - aTier; // Higher tier champions first
          case "item":
            const aItemCount = a.deck.champions.reduce((count, champion) => {
              return (
                count +
                (champion.items?.filter((item) => item === key).length || 0)
              );
            }, 0);
            const bItemCount = b.deck.champions.reduce((count, champion) => {
              return (
                count +
                (champion.items?.filter((item) => item === key).length || 0)
              );
            }, 0);
            return bItemCount - aItemCount;
          case "skillTree":
            // For skillTree, maintain original order since they either have it or don't
            return 0;
          default:
            return 0;
        }
      });
    },
    [metaDecks]
  );

  // Optimized filter handler with batched state updates
  const handleFilterChange = useCallback(
    (type, key) => {
      const isCurrentSelection =
        (type === "champion" && selectedChampion === key) ||
        ((type === "trait" || type === "force") && selectedTrait === key) ||
        (type === "item" && selectedItem === key) ||
        (type === "skillTree" && selectedSkillTree === key);

      // Use React's automatic batching for better performance
      if (isCurrentSelection) {
        // Reset all selections and data
        setCompsData(metaDecks || []);
        setSelectedChampion(null);
        setSelectedTrait(null);
        setSelectedItem(null);
        setSelectedSkillTree(null);
        setVisibleDecks(10);
      } else {
        // Apply filter and update selections
        const filteredDecks = filterAndSortDecks(type, key);
        setCompsData(filteredDecks);
        setSelectedChampion(type === "champion" ? key : null);
        setSelectedTrait(type === "trait" || type === "force" ? key : null);
        setSelectedItem(type === "item" ? key : null);
        setSelectedSkillTree(type === "skillTree" ? key : null);
        setVisibleDecks(10);
      }
    },
    [
      selectedChampion,
      selectedTrait,
      selectedItem,
      selectedSkillTree,
      metaDecks,
      filterAndSortDecks,
    ]
  );

  // Optimized event handlers
  const handleIsClosed = useCallback((event) => {
    const buttonId = event.currentTarget.id;
    setIsClosed((prev) => ({ ...prev, [buttonId]: !prev[buttonId] }));
  }, []);

  // Fixed infinite scroll load function
  const loadMoreDecks = useCallback(() => {
    if (isLoadingMore || visibleDecks >= compsData.length) return;

    setIsLoadingMore(true);
    // Use immediate update for better UX
    setTimeout(() => {
      setVisibleDecks((prev) => Math.min(prev + 8, compsData.length));
      setIsLoadingMore(false);
    }, 100);
  }, [compsData.length, visibleDecks, isLoadingMore]);

  const hasMoreDecks = visibleDecks < compsData.length;
  useInfiniteScroll(loadMoreDecks, hasMoreDecks);

  useEffect(() => {
    setVisibleDecks(10);
  }, [compsData]);

  const visibleCompsData = useMemo(() => {
    return compsData.slice(0, visibleDecks);
  }, [compsData, visibleDecks]);

  // Simplified tab content
  const tabContent = useMemo(() => {
    switch (activeTab) {
      case "Champions":
        return (
          <MetaTrendsCard
            itemCount={13}
            championsByCost={championsWithSelection}
            setSelectedChampion={(key) => handleFilterChange("champion", key)}
            selectedChampion={selectedChampion}
            forces={forces}
          />
        );
      case "Traits":
        return (
          <div className="p-3 md:p-6 bg-[#111111] rounded-lg mt-2">
            {/* Mobile Sub-tabs */}
            <div className="lg:hidden mb-4">
              <div className="flex justify-center">
                <div className="inline-flex rounded-lg overflow-hidden border border-[#2D2F37] bg-[#1D1D1D]">
                  {["Origin", "Forces"].map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                        activeTraitsSubTab === tab
                          ? "bg-[#2D2F37] text-[#D9A876]"
                          : "text-[#999] hover:bg-[#2D2F37]"
                      }`}
                      onClick={() => setActiveTraitsSubTab(tab)}
                    >
                      {others?.[tab.toLowerCase()]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile View */}
            <div className="lg:hidden grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 w-full max-h-[300px] overflow-y-auto">
              {activeTraitsSubTab === "Origin" &&
                traits?.slice(0, 24).map((trait, i) => (
                  <div
                    key={`trait-${trait.key}-${i}`}
                    className="w-full max-w-[70px] sm:max-w-[80px]"
                  >
                    <LazyWrapper height="80px">
                      <TraitItem
                        trait={trait}
                        selectedItem={selectedTrait}
                        onSelect={handleFilterChange}
                        i={i}
                      />
                    </LazyWrapper>
                  </div>
                ))}
              {activeTraitsSubTab === "Forces" &&
                forces?.slice(0, 24).map((force, i) => (
                  <div
                    key={`force-${force.key}-${i}`}
                    className="w-full max-w-[70px] sm:max-w-[80px]"
                  >
                    <LazyWrapper height="80px">
                      <ForceItem
                        force={force}
                        selectedItem={selectedTrait}
                        onSelect={handleFilterChange}
                        i={i}
                      />
                    </LazyWrapper>
                  </div>
                ))}
            </div>

            {/* Desktop View */}
            <div className="hidden lg:block space-y-6">
              {[
                [others?.origin, traits?.slice(0, 24)],
                [others?.forces, forces?.slice(0, 24)],
              ].map(([label, items], idx) => (
                <div
                  key={idx}
                  className="flex flex-col lg:flex-row items-center gap-4"
                >
                  <div className="p-1 rounded-lg text-[#D9A876] font-semibold text-center min-w-[100px]">
                    {label}
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 w-full">
                    {items?.map((item, i) =>
                      idx === 0 ? (
                        <TraitItem
                          key={`trait-${item.key}-${i}`}
                          trait={item}
                          selectedItem={selectedTrait}
                          onSelect={handleFilterChange}
                          i={i}
                        />
                      ) : (
                        <ForceItem
                          key={`force-${item.key}-${i}`}
                          force={item}
                          selectedItem={selectedTrait}
                          onSelect={handleFilterChange}
                          i={i}
                        />
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "Items":
        return (
          <div className="p-3 md:p-6 bg-[#111111] rounded-lg mt-2 max-h-[155px] md:max-h-full overflow-y-auto grid grid-cols-6 sm:grid-cols-8 md:grid-cols-6 lg:grid-cols-8 xl:!flex justify-center xl:!flex-wrap gap-1 lg:gap-4">
            {filteredItems.slice(0, 40).map((item, i) => (
              <div
                key={`item-${item.key}-${i}`}
                className="w-full max-w-[50px] sm:max-w-[60px] md:max-w-[84px]"
              >
                <LazyWrapper height="60px">
                  <ItemIcon
                    item={item}
                    selectedItem={selectedItem}
                    onSelect={handleFilterChange}
                    i={i}
                  />
                </LazyWrapper>
              </div>
            ))}
          </div>
        );
      case "SkillTree":
        return (
          <div className="p-3 px-0 md:p-6 bg-[#111111] rounded-lg mt-2">
            {/* Mobile Sub-tabs */}
            <div className="lg:hidden mb-4">
              {Object.keys(skillsByVariant).length > 1 && (
                <div className="flex justify-center">
                  <div className="inline-flex rounded-lg overflow-x-auto border border-[#2D2F37] bg-[#1D1D1D]">
                    {Object.keys(skillsByVariant).map((variant) => (
                      <button
                        key={variant}
                        type="button"
                        className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                          activeSkillsSubTab === variant
                            ? "bg-[#2D2F37] text-[#D9A876]"
                            : "text-[#999] hover:bg-[#2D2F37]"
                        }`}
                        onClick={() => setActiveSkillsSubTab(variant)}
                      >
                        {variant}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile View */}
            <div className="lg:hidden flex flex-wrap justify-center gap-2 w-full max-h-[300px] overflow-y-auto px-2">
              {activeSkillsSubTab &&
                skillsByVariant[activeSkillsSubTab]
                  ?.slice(0, 20)
                  .map((skill, i) => (
                    <LazyWrapper
                      height="60px"
                      key={`mobile-skill-${skill.key}-${i}`}
                    >
                      <SkillTreeItem
                        skill={skill}
                        selectedSkillTree={selectedSkillTree}
                        onSelect={handleFilterChange}
                        i={i}
                        mobile={true}
                      />
                    </LazyWrapper>
                  ))}
            </div>

            {/* Desktop View */}
            <div className="hidden lg:flex flex-wrap justify-center gap-3 w-full">
              {skillTree
                ?.filter((skill) => skill?.imageUrl)
                ?.slice(0, 30)
                ?.map((skill, i) => (
                  <SkillTreeItem
                    key={`desktop-skill-${skill.key}-${i}`}
                    skill={skill}
                    selectedSkillTree={selectedSkillTree}
                    onSelect={handleFilterChange}
                    i={i}
                  />
                ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  }, [
    activeTab,
    activeTraitsSubTab,
    activeSkillsSubTab,
    skillsByVariant,
    championsWithSelection,
    handleFilterChange,
    forces,
    traits,
    skillTree,
    selectedTrait,
    selectedSkillTree,
    filteredItems,
    selectedItem,
    selectedChampion,
    others,
  ]);

  const tabButtons = useMemo(() => {
    const tabs = [
      { key: "Champions", label: others?.champions },
      { key: "Traits", label: others?.traits },
      { key: "Items", label: others?.items },
      { key: "SkillTree", label: others?.skills },
    ];

    return tabs.map((tab) => (
      <TabButton
        key={tab.key}
        active={activeTab === tab.key}
        label={tab.label}
        onClick={() => setActiveTab(tab.key)}
      />
    ));
  }, [activeTab, others]);

  // Loading state
  if (isLoading) {
    return (
      <div className="mx-auto md:px-0 lg:px-0 py-6 flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D9A876]"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="mx-auto md:px-0 lg:px-0 py-6 flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-red-400 text-6xl">⚠️</div>
        <div className="text-red-400 text-lg font-medium">
          Failed to load data
        </div>
        <div className="text-gray-400 text-sm text-center max-w-md">
          {error}. Please check your internet connection and try again.
        </div>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-[#2D2F37] hover:bg-[#3D3F47] text-[#D9A876] rounded-lg text-sm transition-colors duration-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div
      className="mx-auto md:px-0 lg:px-0 py-6"
      style={{ contain: "layout style" }}
    >
      <div className="space-y-6">
        <div>
          <div className="flex justify-center md:justify-start">
            <div className="inline-flex rounded-lg overflow-hidden border border-[#2D2F37] bg-[#1D1D1D]">
              {tabButtons}
            </div>
          </div>
          <div className="rounded-lg shadow-lg">{tabContent}</div>
        </div>

        <div
          className="space-y-4"
          id="meta-trends-items"
          style={{ contain: "layout" }}
        >
          {visibleCompsData.length > 0 ? (
            <div className="space-y-4">
              {visibleCompsData.map((metaDeck, index) => (
                <MetaDeck
                  key={`deck-${metaDeck.name}-${index}`}
                  metaDeck={metaDeck}
                  i={index}
                  isClosed={isClosed}
                  handleIsClosed={handleIsClosed}
                  lookupMaps={lookupMaps}
                  others={others}
                />
              ))}

              {/* Loading indicator */}
              {isLoadingMore && (
                <div className="flex justify-center py-6 items-center space-x-2 text-[#D9A876]">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#D9A876]"></div>
                  <span className="text-sm">Loading more decks...</span>
                </div>
              )}

              {/* Manual load button for mobile */}
              {hasMoreDecks && !isLoadingMore && (
                <div className="md:hidden flex justify-center py-4">
                  <button
                    onClick={loadMoreDecks}
                    className="px-4 py-2 bg-[#2D2F37] hover:bg-[#3D3F47] text-[#D9A876] rounded-lg text-sm transition-colors duration-200"
                  >
                    Load More
                  </button>
                </div>
              )}

              {/* End indicator */}
              {!hasMoreDecks && compsData.length > 10 && (
                <div className="flex flex-col items-center py-6 space-y-2">
                  <div className="text-gray-500 text-sm text-center">
                    ✓ Showing all {compsData.length} decks
                  </div>
                  <div className="text-gray-600 text-xs text-center md:hidden">
                    Scroll up to see more options
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              No decks found matching the current filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(MetaTrendsItems);

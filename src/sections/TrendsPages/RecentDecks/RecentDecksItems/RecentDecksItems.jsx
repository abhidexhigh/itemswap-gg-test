import { useTranslation } from "react-i18next";
import Link from "next/link";
import "../../../../../i18n";
import React, {
  useState,
  useCallback,
  useMemo,
  memo,
  useEffect,
  useRef,
  startTransition,
  lazy,
  Suspense,
} from "react";
import { Tooltip } from "react-tooltip";
import moment from "moment";
import TraitTooltip from "src/components/tooltip/TraitTooltip";
import "react-tooltip/dist/react-tooltip.css";
import GirlCrush from "@assets/image/traits/GirlCrush.svg";
import RecentDecksCard from "../RecentDecksCard/RecentDecksCard";
import MetaTrendsCard from "../../MetaTrends/MetaTrendsCard/MetaTrendsCard";
import { PiEye, PiEyeClosed } from "react-icons/pi";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import CardImage from "src/components/cardImage";
import Comps from "../../../../data/compsNew.json";
import RecentDecksHistory from "../../../../data/newData/recentDecksHistory.json";
import ReactTltp from "src/components/tooltip/ReactTltp";
import { OptimizedImage } from "src/utils/imageOptimizer";
import ForceIcon from "src/components/forceIcon";
import SkillTreeImage from "src/components/SkillTreeImage";
import TraitImage from "src/components/TraitImage/TraitImage";

// Constants
const MOBILE_DISPLAY_LIMIT = 4;
const DESKTOP_DISPLAY_LIMIT = 20; // Reduced from 50
const INITIAL_RENDER_LIMIT = 8; // Only render first 8 items initially
const SCROLL_THRESHOLD = 100;
const INTERSECTION_THRESHOLD = 0.1;

// Stable empty arrays to prevent re-renders
const EMPTY_ARRAY = [];
const EMPTY_OBJECT = {};

// Lazy load heavy components
const LazyMetaTrendsCard = lazy(
  () => import("../../MetaTrends/MetaTrendsCard/MetaTrendsCard")
);

// Optimized loading component
const LoadingSpinner = memo(() => (
  <div className="flex justify-center items-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D9A876]"></div>
  </div>
));

// Custom hook for intersection observer with better performance
const useIntersectionObserver = (threshold = INTERSECTION_THRESHOLD) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold, rootMargin: "50px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
};

// Optimized virtualization with reduced DOM nodes
const useVirtualList = (items, containerHeight = 600, itemHeight = 200) => {
  const [visibleRange, setVisibleRange] = useState({
    start: 0,
    end: INITIAL_RENDER_LIMIT,
  });
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef();

  const handleScroll = useCallback(
    (e) => {
      const newScrollTop = e.target.scrollTop;
      setScrollTop(newScrollTop);

      const start = Math.floor(newScrollTop / itemHeight);
      const visibleCount = Math.ceil(containerHeight / itemHeight);
      const end = Math.min(start + visibleCount + 2, items.length); // Buffer of 2

      setVisibleRange({ start, end });
    },
    [itemHeight, containerHeight, items.length]
  );

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end);
  }, [items, visibleRange]);

  return { visibleItems, handleScroll, containerRef, visibleRange };
};

// Heavily optimized TabButton with reduced re-renders
const TabButton = memo(({ active, label, onClick, tabKey }) => {
  const handleClick = useCallback(() => onClick(tabKey), [onClick, tabKey]);

  return (
    <button
      type="button"
      className={`px-6 py-3 text-sm md:text-base font-medium transition-colors duration-200 ${
        active
          ? "bg-[#2D2F37] text-[#D9A876]"
          : "text-[#999] hover:bg-[#2D2F37]"
      }`}
      onClick={handleClick}
    >
      {label}
    </button>
  );
});

// Optimized with lazy loading and reduced DOM complexity
const ItemIcon = memo(({ item, selectedItem, onSelect, index }) => {
  const [ref, isVisible] = useIntersectionObserver();
  const isSelected = item?.key === selectedItem;
  const tooltipId = `${item?.key}-${index}`;

  const handleClick = useCallback(() => {
    onSelect("item", item?.key);
  }, [onSelect, item?.key]);

  return (
    <div
      ref={ref}
      className="flex flex-col items-center gap-2 cursor-pointer group max-w-[84px]"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
    >
      {isVisible && (
        <>
          <ReactTltp variant="item" content={item} id={tooltipId} />
          <div className="relative aspect-square w-full transition-transform duration-200 group-hover:scale-110">
            <OptimizedImage
              alt={item?.name || "Item"}
              width={84}
              height={84}
              src={item?.imageUrl}
              className="w-full h-full object-contain rounded-lg !border !border-[#ffffff20]"
              data-tooltip-id={tooltipId}
              loading="lazy"
            />
            {isSelected && (
              <div className="absolute inset-0 bg-[#00000080] rounded-lg flex items-center justify-center">
                <IoMdCheckmarkCircle className="text-[#86efac] text-5xl z-50" />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
});

// Optimized TraitItem with reduced re-renders
const TraitItem = memo(({ trait, selectedTrait, onSelect, index }) => {
  const isSelected = trait?.key === selectedTrait;
  const tooltipId = `${trait?.key}-${index}`;

  const handleClick = useCallback(() => {
    onSelect("trait", trait?.key);
  }, [onSelect, trait?.key]);

  return (
    <div
      className="flex flex-col items-center gap-2 cursor-pointer group"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
    >
      <ReactTltp variant="trait" content={trait} id={tooltipId} />
      <div className="relative aspect-square w-full max-w-[96px] transition-transform duration-200 group-hover:scale-105">
        <TraitImage
          trait={trait}
          size="xlarge"
          className="w-full h-full rounded-lg"
          data-tooltip-id={tooltipId}
          loading="lazy"
        />
        {isSelected && (
          <div className="absolute inset-0 bg-[#00000080] rounded-lg flex items-center justify-center z-20">
            <IoMdCheckmarkCircle className="text-[#86efac] text-4xl z-50" />
          </div>
        )}
      </div>
      <span className="hidden lg:block text-sm md:text-base text-[#D9A876] bg-[#1b1a32] px-3 py-1 rounded-full truncate max-w-full">
        {trait?.name}
      </span>
    </div>
  );
});

// Optimized ForceItem
const ForceItem = memo(({ force, selectedTrait, onSelect, index }) => {
  const isSelected = force?.key === selectedTrait;
  const tooltipId = `${force?.key}-${index}`;

  const handleClick = useCallback(() => {
    onSelect("force", force?.key);
  }, [onSelect, force?.key]);

  return (
    <div
      className="flex flex-col items-center gap-2 cursor-pointer group"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
    >
      <ReactTltp variant="force" content={force} id={tooltipId} />
      <div className="relative aspect-square w-full max-w-[96px] transition-transform duration-200 group-hover:scale-105">
        <ForceIcon
          force={force}
          size="xxlarge"
          className="w-full h-full object-cover rounded-lg"
          data-tooltip-id={tooltipId}
          loading="lazy"
        />
        {isSelected && (
          <div className="absolute inset-0 bg-[#00000080] rounded-lg flex items-center justify-center">
            <IoMdCheckmarkCircle className="text-[#86efac] text-4xl z-50" />
          </div>
        )}
      </div>
      <span className="hidden lg:block text-sm md:text-base text-[#cccccc] bg-[#1b1a32] px-3 py-1 rounded-full truncate max-w-full">
        {force?.name}
      </span>
    </div>
  );
});

// Heavily optimized ChampionWithItems with Map caching
const ChampionWithItems = memo(
  ({ champion, championDetails, itemsMap, forces, tier }) => {
    const championItems = useMemo(() => {
      if (!champion?.items?.length || !itemsMap) return EMPTY_ARRAY;

      return champion.items
        .map((itemKey) => itemsMap.get(itemKey))
        .filter(Boolean);
    }, [champion?.items, itemsMap]);

    if (!champion || !championDetails) return null;

    return (
      <div className="flex flex-col items-center gap-x-4 flex-grow basis-0 min-w-[65px] md:min-w-[80px] max-w-[78px] md:max-w-[110px]">
        <div className="inline-flex items-center justify-center flex-col">
          <div className="flex flex-col w-full aspect-square rounded-[20px]">
            <div
              className="relative inline-flex rounded-lg"
              data-tooltip-id={championDetails.key}
            >
              <CardImage
                src={championDetails}
                forces={forces}
                tier={tier}
                imgStyle="w-[68px] md:w-[84px]"
                identificationImageStyle="w=[16px] md:w-[32px]"
                textStyle="text-[10px] md:text-[16px] hidden"
                cardSize="!w-[80px] !h-[80px] md:!w-[96px] md:!h-[96px]"
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
              key={`item-${itemDetails.key}-${idx}`}
              className="relative z-10 hover:z-20 !border !border-[#ffffff20] aspect-square rounded-lg"
            >
              <ReactTltp
                variant="item"
                content={itemDetails}
                id={`item-${itemDetails.key}-${idx}`}
              />
              <OptimizedImage
                alt={itemDetails.name || "Item"}
                width={50}
                height={50}
                src={itemDetails.imageUrl}
                className="w-[20px] md:w-[30px] rounded-lg hover:scale-150 transition-all duration-300"
                data-tooltip-id={`item-${itemDetails.key}-${idx}`}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
);

// Stable PlacementBadge with memoized styles
const PlacementBadge = memo(({ placement }) => {
  const badgeClass = useMemo(() => {
    const baseClass =
      "rounded-lg !border-[#ffffff40] !border p-2 py-0 shadow-lg ";
    switch (placement) {
      case 1:
        return baseClass + "text-[#3aedbd] !border-[#3aedbd]";
      case 2:
        return baseClass + "text-[#FBDB51] !border-[#FBDB51]";
      case 3:
        return baseClass + "text-[#6eccff] !border-[#6eccff]";
      default:
        return baseClass + "text-[#ffffff]";
    }
  }, [placement]);

  return (
    <div className={badgeClass}>
      <div className="text-xl md:text-3xl p-2">{placement}</div>
    </div>
  );
});

// Heavily optimized DeckHeader with better data processing
const DeckHeader = memo(
  ({
    metaDeck,
    forces,
    traits,
    isClosed,
    index,
    skills,
    augmentDetails,
    forceDetailsMap,
    skillDetailsMap,
    traitDetailsMap,
  }) => {
    // Use pre-computed maps for O(1) lookups
    const computedData = useMemo(() => {
      const forceDetails = metaDeck?.deck?.forces
        ? metaDeck.deck.forces
            .map((force) => ({
              ...force,
              details: forceDetailsMap.get(force?.key?.toLowerCase()),
            }))
            .filter((item) => item.details)
        : EMPTY_ARRAY;

      const skillDetails = metaDeck?.deck?.skillTree
        ? metaDeck.deck.skillTree
            .map((skill) => skillDetailsMap.get(skill))
            .filter(Boolean)
        : EMPTY_ARRAY;

      const traitDetails = metaDeck?.deck?.traits
        ? metaDeck.deck.traits
            .map((trait) => {
              const traitDetails = traitDetailsMap.get(trait?.key);
              if (!traitDetails) return null;

              const tier = traitDetails.tiers?.find(
                (t) => trait?.numUnits >= t?.min && trait?.numUnits <= t?.max
              );

              return tier?.imageUrl
                ? { ...traitDetails, tier, numUnits: trait?.numUnits }
                : null;
            })
            .filter(Boolean)
        : EMPTY_ARRAY;

      return { forceDetails, skillDetails, traitDetails };
    }, [metaDeck?.deck, forceDetailsMap, skillDetailsMap, traitDetailsMap]);

    return (
      <header className="relative flex flex-col md:flex-col justify-between items-start md:items-end bg-[#111111] py-[15px] pl-3 md:pl-4 pr-3 md:pr-[36px] lg:min-h-[50px] lg:flex-row lg:items-center lg:py-[5px] lg:pr-[16px] rounded-t-lg">
        <div className="inline-flex flex-col flex-wrap gap-[8px] w-full md:w-auto md:flex-row md:items-center md:gap-[4px]">
          <div className="flex items-center gap-x-2">
            <PlacementBadge placement={metaDeck?.placement} />
            <Link
              href={`/user/${metaDeck?.puuid}/${metaDeck?.key}`}
              className="flex items-center gap-x-2"
            >
              <div className="relative">
                <OptimizedImage
                  src={metaDeck?.imageUrl}
                  alt={metaDeck?.name || "User"}
                  width={80}
                  height={80}
                  className="w-16 relative"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-col">
                <div className="-mb-1 text-lg">{metaDeck?.name}</div>
                <div className="-mb-1 font-normal text-sm">
                  {moment(metaDeck?.dateTime).fromNow()} • {metaDeck?.duration}
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop: Traits on left side */}
          <div className="hidden md:flex items-center gap-1 ml-4">
            {computedData.traitDetails.map((trait, idx) => (
              <div key={`trait-${trait.key}-${idx}`} className="relative">
                <TraitImage
                  trait={trait}
                  size="default"
                  className="w-[38px] h-[38px] md:w-[36px] md:h-[36px]"
                  data-tooltip-id={`trait-${trait.key}-${idx}`}
                  loading="lazy"
                />
                <ReactTltp
                  variant="trait"
                  id={`trait-${trait.key}-${idx}`}
                  content={trait}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile layout optimizations */}
        <div className="flex md:hidden flex-col gap-y-3 mt-2 w-full items-center">
          <div className="flex items-center gap-x-2 w-fit overflow-hidden !border !border-[#ffffff40] rounded-lg p-1">
            {computedData.forceDetails.map((force, idx) => (
              <div
                key={`mobile-force-${force.key}-${idx}`}
                className="flex-shrink-0 w-[30px] h-[30px]"
              >
                <ForceIcon
                  force={force.details}
                  size="custom"
                  customSize="w-full h-full"
                  className="aspect-square"
                  data-tooltip-id={`mobile-force-${force?.key}-${idx}`}
                  loading="lazy"
                />
                <ReactTltp
                  content={force?.key}
                  id={`mobile-force-${force?.key}-${idx}`}
                />
              </div>
            ))}

            {computedData.forceDetails.length > 0 &&
              computedData.skillDetails.length > 0 && (
                <div className="flex-shrink-0 h-8 w-px bg-[#ffffff30] mx-1"></div>
              )}

            {computedData.skillDetails.map((skill, idx) => (
              <div
                key={`mobile-skill-${skill.key}-${idx}`}
                className="flex-shrink-0 w-[30px] h-[30px] shadow-md rounded-full shadow-[#ffffff20]"
              >
                <SkillTreeImage
                  skill={skill}
                  size="default"
                  tooltipId={skill.key}
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          <div className="flex items-center gap-x-1 w-fit overflow-x-auto scrollbar-hide">
            {computedData.traitDetails.map((trait, idx) => (
              <div
                key={`mobile-trait-${trait.key}-${idx}`}
                className="flex-shrink-0"
              >
                <TraitImage
                  trait={trait}
                  size="small"
                  className="!w-[34px] !h-[34px]"
                  data-tooltip-id={`mobile-trait-${trait.key}-${idx}`}
                  loading="lazy"
                />
                <ReactTltp
                  variant="trait"
                  id={`mobile-trait-${trait.key}-${idx}`}
                  content={trait}
                />
              </div>
            ))}

            {computedData.traitDetails.length > 0 &&
              augmentDetails.length > 0 && (
                <div className="flex-shrink-0 h-8 w-px bg-[#ffffff30] mx-2"></div>
              )}

            {augmentDetails.map((augment, idx) => (
              <div
                key={`mobile-augment-${augment.key}-${idx}`}
                className="flex-shrink-0"
              >
                <OptimizedImage
                  alt={augment.name || "Augment"}
                  width={32}
                  height={32}
                  src={augment.imageUrl}
                  className="!w-[30px] !h-[30px] rounded-md mx-0.5"
                  data-tooltip-id={`mobile-augment-${augment.key}-${idx}`}
                  loading="lazy"
                />
                <ReactTltp
                  variant="augment"
                  content={augment}
                  id={`mobile-augment-${augment.key}-${idx}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop layout with better performance */}
        <div className="hidden md:inline-flex flex-shrink-0 justify-between gap-1 !gap-x-6 md:mt-1">
          <div className="flex flex-wrap gap-1 md:gap-0 md:inline-flex md:flex-wrap justify-start md:justify-end items-center md:mr-0">
            {computedData.forceDetails.map((force, idx) => (
              <div
                key={`desktop-force-${force.key}-${idx}`}
                className="flex justify-center items-center bg-[#000] rounded-full mx-1 pr-2 border-[1px] border-[#ffffff30] h-[90%]"
              >
                <ForceIcon
                  force={force.details}
                  size="custom"
                  customSize="w-[30px] h-[30px] md:w-[36px] md:h-[36px]"
                  className="mr-1"
                  data-tooltip-id={`desktop-force-${force?.key}-${idx}`}
                  loading="lazy"
                />
                <ReactTltp
                  content={force?.key}
                  id={`desktop-force-${force?.key}-${idx}`}
                />
                <span className="text-[18px]">{force?.numUnits}</span>
              </div>
            ))}

            {computedData.forceDetails.length > 0 &&
              computedData.skillDetails.length > 0 && (
                <div className="flex items-center mx-2">
                  <div className="h-12 w-px bg-[#ffffff30]"></div>
                </div>
              )}

            {computedData.skillDetails.map((skill, idx) => (
              <SkillTreeImage
                key={`desktop-skill-${skill.key}-${idx}`}
                skill={skill}
                size="medium"
                tooltipId={skill.key}
                loading="lazy"
              />
            ))}

            {computedData.skillDetails.length > 0 &&
              augmentDetails.length > 0 && (
                <div className="flex items-center mx-2">
                  <div className="h-12 w-px bg-[#ffffff30]"></div>
                </div>
              )}

            {augmentDetails.map((augment, idx) => (
              <div
                key={`desktop-augment-${augment.key}-${idx}`}
                className="relative"
              >
                <OptimizedImage
                  alt={augment.name || "Augment"}
                  width={48}
                  height={48}
                  src={augment.imageUrl}
                  className="w-[38px] h-[38px] md:w-[36px] md:h-[36px] mx-0.5 rounded-md"
                  data-tooltip-id={`desktop-augment-${augment.key}-${idx}`}
                  loading="lazy"
                />
                <ReactTltp
                  variant="augment"
                  content={augment}
                  id={`desktop-augment-${augment.key}-${idx}`}
                />
              </div>
            ))}
          </div>
        </div>
      </header>
    );
  }
);

// Optimized MetaDeck with lazy loading and reduced DOM
const MetaDeck = memo(
  ({
    metaDeck,
    index,
    isClosed,
    handleIsClosed,
    championsMap,
    itemsMap,
    traits,
    forces,
    augments,
    skills,
    forceDetailsMap,
    skillDetailsMap,
    traitDetailsMap,
  }) => {
    const [isChampionsCollapsed, setIsChampionsCollapsed] = useState(true);
    const [ref, isVisible] = useIntersectionObserver();

    const toggleClosed = useCallback(
      (e) => {
        handleIsClosed(e);
      },
      [handleIsClosed]
    );

    const toggleChampionsSection = useCallback(() => {
      startTransition(() => {
        setIsChampionsCollapsed((prev) => !prev);
      });
    }, []);

    // Pre-compute all champion data with better performance
    const computedChampionData = useMemo(() => {
      if (!metaDeck?.deck?.champions?.length || !championsMap?.size) {
        return {
          sortedChampions: EMPTY_ARRAY,
          championsToDisplay: EMPTY_ARRAY,
          augmentDetails: EMPTY_ARRAY,
        };
      }

      const sortedChampions = metaDeck.deck.champions.slice().sort((a, b) => {
        const champA = championsMap.get(a.key);
        const champB = championsMap.get(b.key);
        return (champA?.cost || 0) - (champB?.cost || 0);
      });

      let championsToDisplay;
      if (isChampionsCollapsed) {
        const prioritizedChampions = [...sortedChampions].sort((a, b) => {
          const champA = championsMap.get(a.key);
          const champB = championsMap.get(b.key);

          const isAFourStar = (a?.tier || 0) >= 4;
          const isBFourStar = (b?.tier || 0) >= 4;
          if (isAFourStar && !isBFourStar) return -1;
          if (!isAFourStar && isBFourStar) return 1;

          const costDiff = (champB?.cost || 0) - (champA?.cost || 0);
          if (costDiff !== 0) return costDiff;

          const aHasItems = a.items?.length > 0;
          const bHasItems = b.items?.length > 0;
          if (aHasItems && !bHasItems) return -1;
          if (!aHasItems && bHasItems) return 1;

          return 0;
        });
        championsToDisplay = prioritizedChampions.slice(
          0,
          MOBILE_DISPLAY_LIMIT
        );
      } else {
        championsToDisplay = sortedChampions;
      }

      const augmentDetailsMap = new Map(augments.map((a) => [a.key, a]));
      const augmentDetails = metaDeck?.deck?.augments
        ? metaDeck.deck.augments
            .map((augment) => augmentDetailsMap.get(augment))
            .filter(Boolean)
        : EMPTY_ARRAY;

      return { sortedChampions, championsToDisplay, augmentDetails };
    }, [metaDeck?.deck, championsMap, augments, isChampionsCollapsed]);

    if (!metaDeck) return null;

    return (
      <div
        ref={ref}
        className="flex flex-col gap-[1px] bg-gradient-to-r from-[#5f5525] to-[#6D4600] p-[1px] rounded-lg overflow-hidden shadow-lg mb-4 md:!mb-6"
      >
        {isVisible && (
          <div className="bg-[#000000] rounded-lg">
            <DeckHeader
              metaDeck={metaDeck}
              forces={forces}
              traits={traits}
              isClosed={isClosed}
              index={index}
              skills={skills}
              augmentDetails={computedChampionData.augmentDetails}
              forceDetailsMap={forceDetailsMap}
              skillDetailsMap={skillDetailsMap}
              traitDetailsMap={traitDetailsMap}
            />

            {!isClosed[index] && (
              <div className="flex flex-col bg-center bg-no-repeat mt-[-1px]">
                <div className="flex min-h-[150px] flex-col justify-between items-center bg-[#111111] lg:flex-row lg:gap-[15px] lg:py-[0px] xl:px-6 rounded-b-lg">
                  <div className="-mb-[8px] max-w-[342px] lg:mb-0 lg:w-full lg:max-w-full lg:flex-shrink-0">
                    <div className="flex flex-col">
                      {/* Mobile view */}
                      <div className="lg:hidden">
                        <div className="flex flex-wrap justify-center gap-2 w-full">
                          {computedChampionData.championsToDisplay.map(
                            (champion, idx) => {
                              const championDetails = championsMap.get(
                                champion.key
                              );
                              return championDetails ? (
                                <ChampionWithItems
                                  key={`${isChampionsCollapsed ? "collapsed" : "expanded"}-${champion.key}-${idx}`}
                                  champion={champion}
                                  championDetails={championDetails}
                                  itemsMap={itemsMap}
                                  forces={forces}
                                  tier={champion.tier}
                                />
                              ) : null;
                            }
                          )}
                        </div>

                        {computedChampionData.sortedChampions.length >
                          MOBILE_DISPLAY_LIMIT && (
                          <div className="flex items-center justify-center mt-1 w-full transition-all duration-300 ease-in-out">
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#ffffff30] to-[#ffffff30] transition-all duration-300"></div>
                            <button
                              onClick={toggleChampionsSection}
                              className="mx-3 w-7 h-7 bg-[#2D2F37] hover:bg-[#3D3F47] text-[#D9A876] rounded-full transition-all duration-300 ease-in-out flex items-center justify-center shadow-md border border-[#ffffff20] flex-shrink-0 hover:scale-110 active:scale-95"
                              title={
                                isChampionsCollapsed
                                  ? `Show all ${computedChampionData.sortedChampions.length} champions`
                                  : "Show fewer champions"
                              }
                            >
                              <div className="transition-transform duration-300 ease-in-out">
                                {isChampionsCollapsed ? (
                                  <FaChevronDown className="text-xs" />
                                ) : (
                                  <FaChevronUp className="text-xs" />
                                )}
                              </div>
                            </button>
                            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#ffffff30] to-[#ffffff30] transition-all duration-300"></div>
                          </div>
                        )}
                      </div>

                      {/* Desktop view */}
                      <div className="hidden lg:flex flex-wrap justify-center gap-2 w-full">
                        {computedChampionData.sortedChampions.map(
                          (champion, idx) => {
                            const championDetails = championsMap.get(
                              champion.key
                            );
                            return championDetails ? (
                              <ChampionWithItems
                                key={`desktop-${champion.key}-${idx}`}
                                champion={champion}
                                championDetails={championDetails}
                                itemsMap={itemsMap}
                                forces={forces}
                                tier={champion.tier}
                              />
                            ) : null;
                          }
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

// Optimized SkillTreeItem components
const SkillTreeItem = memo(({ skill, selectedSkillTree, onSelect, index }) => {
  const isSelected = skill?.key === selectedSkillTree;
  const tooltipId = `skill-${skill?.key}-${index}`;

  const handleClick = useCallback(() => {
    onSelect("skillTree", skill?.key);
  }, [onSelect, skill?.key]);

  return (
    <div
      className="flex flex-col items-center gap-1 cursor-pointer group w-16 md:w-20 lg:w-24 flex-shrink-0"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
    >
      <ReactTltp variant="skillTree" content={skill} id={tooltipId} />
      <div className="relative aspect-square w-full transition-transform duration-200 group-hover:scale-105">
        <SkillTreeImage
          skill={skill}
          size="large"
          tooltipId={tooltipId}
          className="w-full h-full"
          showTooltip={false}
          loading="lazy"
        />
        {isSelected && (
          <div className="absolute inset-0 bg-[#00000080] rounded-lg flex items-center justify-center">
            <IoMdCheckmarkCircle className="text-[#86efac] text-3xl z-50" />
          </div>
        )}
      </div>
      <span className="text-xs truncate max-w-full text-center text-[#cccccc] mt-1">
        {skill?.name}
      </span>
    </div>
  );
});

const MobileSkillTreeItem = memo(
  ({ skill, selectedSkillTree, onSelect, index }) => {
    const isSelected = skill?.key === selectedSkillTree;
    const tooltipId = `mobile-skill-${skill?.key}-${index}`;

    const handleClick = useCallback(() => {
      onSelect("skillTree", skill?.key);
    }, [onSelect, skill?.key]);

    return (
      <div
        className="flex flex-col items-center gap-1 cursor-pointer group w-12 sm:w-14 flex-shrink-0"
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-pressed={isSelected}
      >
        <ReactTltp variant="skillTree" content={skill} id={tooltipId} />
        <div className="relative aspect-square w-full transition-transform duration-200 group-hover:scale-105">
          <SkillTreeImage
            skill={skill}
            size="xlarge"
            tooltipId={tooltipId}
            className="w-full h-full"
            showTooltip={false}
            loading="lazy"
          />
          {isSelected && (
            <div className="absolute inset-0 bg-[#00000080] rounded-lg flex items-center justify-center">
              <IoMdCheckmarkCircle className="text-[#86efac] text-2xl z-50" />
            </div>
          )}
        </div>
        <span className="text-[10px] truncate max-w-full text-center text-[#cccccc] mt-1 leading-tight">
          {skill?.name}
        </span>
      </div>
    );
  }
);

// Main optimized component
const RecentDecksItems = () => {
  const { t } = useTranslation();
  const others = t("others");

  // State management with better organization
  const [filters, setFilters] = useState({
    selectedChampion: null,
    selectedTrait: null,
    selectedItem: null,
    selectedSkillTree: null,
  });

  const [ui, setUi] = useState({
    isClosed: EMPTY_OBJECT,
    activeTab: "Champions",
    activeTraitsSubTab: "Origin",
    activeSkillsSubTab: null,
  });

  // Extract and memoize data once with better performance
  const gameData = useMemo(() => {
    try {
      const {
        props: {
          pageProps: {
            dehydratedState: {
              queries: { data },
            },
          },
        },
      } = Comps;

      const metaDecks = RecentDecksHistory?.metaDecks || EMPTY_ARRAY;
      const champions = data?.refs?.champions || EMPTY_ARRAY;
      const items = data?.refs?.items || EMPTY_ARRAY;
      const traits = data?.refs?.traits || EMPTY_ARRAY;
      const augments = data?.refs?.augments || EMPTY_ARRAY;
      const forces = data?.refs?.forces || EMPTY_ARRAY;
      const skillTree = data?.refs?.skillTree || EMPTY_ARRAY;

      // Create Maps for O(1) lookups
      const championsMap = new Map(
        champions.map((champ) => [champ.key, champ])
      );
      const itemsMap = new Map(items.map((item) => [item.key, item]));
      const traitsMap = new Map(traits.map((trait) => [trait.key, trait]));
      const augmentsMap = new Map(
        augments.map((augment) => [augment.key, augment])
      );
      const forcesMap = new Map(
        forces.map((force) => [force.key.toLowerCase(), force])
      );
      const skillTreeMap = new Map(
        skillTree.map((skill) => [skill.key, skill])
      );

      return {
        metaDecks,
        champions,
        items,
        traits,
        augments,
        forces,
        skillTree,
        // Maps for O(1) lookups
        championsMap,
        itemsMap,
        traitsMap,
        augmentsMap,
        forcesMap,
        skillTreeMap,
      };
    } catch (error) {
      console.error("Error loading game data:", error);
      return {
        metaDecks: EMPTY_ARRAY,
        champions: EMPTY_ARRAY,
        items: EMPTY_ARRAY,
        traits: EMPTY_ARRAY,
        augments: EMPTY_ARRAY,
        forces: EMPTY_ARRAY,
        skillTree: EMPTY_ARRAY,
        championsMap: new Map(),
        itemsMap: new Map(),
        traitsMap: new Map(),
        augmentsMap: new Map(),
        forcesMap: new Map(),
        skillTreeMap: new Map(),
      };
    }
  }, []);

  const [compsData, setCompsData] = useState(() => gameData.metaDecks);

  // Optimized shuffle function with better performance
  const shuffle = useCallback((array) => {
    if (!array?.length) return EMPTY_ARRAY;
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }, []);

  // Heavily optimized champion processing with reduced computation
  const processedChampions = useMemo(() => {
    if (!gameData.champions?.length) {
      return { filteredChampions: EMPTY_ARRAY, groupedArray: EMPTY_ARRAY };
    }

    // Use Map for grouping by type
    const championsByType = new Map();
    gameData.champions.forEach((champion) => {
      if (!championsByType.has(champion.type)) {
        championsByType.set(champion.type, []);
      }
      championsByType.get(champion.type).push(champion);
    });

    const filtered = [];
    for (const [, group] of championsByType) {
      const selected = shuffle(group).slice(0, 2);
      filtered.push(...selected);
    }

    // Group by cost using Map
    const groupedByCost = new Map();
    filtered.forEach((champion) => {
      const { cost } = champion;
      if (!groupedByCost.has(cost)) {
        groupedByCost.set(cost, []);
      }
      groupedByCost.get(cost).push({
        ...champion,
        selected: champion.key === filters.selectedChampion,
      });
    });

    return {
      filteredChampions: filtered,
      groupedArray: Array.from(groupedByCost.values()),
    };
  }, [gameData.champions, shuffle, filters.selectedChampion]);

  // Optimize filtered items with better caching
  const filteredItems = useMemo(() => {
    return gameData.items?.filter((item) => !item?.isFromItem) || EMPTY_ARRAY;
  }, [gameData.items]);

  // Optimized filter change handler with better performance
  const handleFilterChange = useCallback(
    (type, key) => {
      if (!gameData.metaDecks?.length) return;

      startTransition(() => {
        const currentFilterKey =
          type === "trait" || type === "force"
            ? filters.selectedTrait
            : filters[
                `selected${type.charAt(0).toUpperCase() + type.slice(1)}`
              ];

        if (currentFilterKey === key) {
          // Reset filter
          setFilters({
            selectedChampion: null,
            selectedTrait: null,
            selectedItem: null,
            selectedSkillTree: null,
          });
          setCompsData(gameData.metaDecks);
          return;
        }

        let newCompsData;
        const newFilters = { ...filters };

        switch (type) {
          case "trait":
            newFilters.selectedTrait = key;
            newCompsData = gameData.metaDecks.filter((deck) =>
              deck.deck?.traits?.some((trait) => trait.key === key)
            );
            break;
          case "force":
            newFilters.selectedTrait = key;
            newCompsData = gameData.metaDecks.filter((deck) =>
              deck.deck?.forces?.some(
                (force) => force.key.toLowerCase() === key.toLowerCase()
              )
            );
            break;
          case "champion":
            newFilters.selectedChampion = key;
            newCompsData = gameData.metaDecks.filter((deck) =>
              deck.deck?.champions?.some((champion) => champion.key === key)
            );
            break;
          case "item":
            newFilters.selectedItem = key;
            newCompsData = gameData.metaDecks.filter((deck) =>
              deck.deck?.champions?.some((champion) =>
                champion.items?.some((item) => item === key)
              )
            );
            break;
          case "skillTree":
            newFilters.selectedSkillTree = key;
            newCompsData = gameData.metaDecks.filter((deck) =>
              deck.deck?.skillTree?.includes(key)
            );
            break;
          default:
            return;
        }

        setFilters(newFilters);
        setCompsData(newCompsData);
      });
    },
    [gameData.metaDecks, filters]
  );

  const handleIsClosed = useCallback((event) => {
    const buttonId = event.currentTarget.id;
    setUi((prev) => ({
      ...prev,
      isClosed: { ...prev.isClosed, [buttonId]: !prev.isClosed[buttonId] },
    }));
  }, []);

  const handleTabChange = useCallback((tab) => {
    startTransition(() => {
      setUi((prev) => ({ ...prev, activeTab: tab }));
    });
  }, []);

  const handleTraitsSubTabChange = useCallback((subTab) => {
    setUi((prev) => ({ ...prev, activeTraitsSubTab: subTab }));
  }, []);

  const handleSkillsSubTabChange = useCallback((subTab) => {
    setUi((prev) => ({ ...prev, activeSkillsSubTab: subTab }));
  }, []);

  // Optimized skills grouping with better performance
  const skillsByVariant = useMemo(() => {
    if (!gameData.skillTree?.length) return EMPTY_OBJECT;

    const grouped = new Map();
    const validSkills = gameData.skillTree.filter((skill) => skill?.imageUrl);

    validSkills.forEach((skill) => {
      const variant = skill.variant || "General";
      if (!grouped.has(variant)) {
        grouped.set(variant, []);
      }
      grouped.get(variant).push(skill);
    });

    return Object.fromEntries(grouped);
  }, [gameData.skillTree]);

  // Initialize skills sub-tab with reduced effects
  useEffect(() => {
    const variants = Object.keys(skillsByVariant);
    if (variants.length > 0 && !ui.activeSkillsSubTab) {
      setUi((prev) => ({ ...prev, activeSkillsSubTab: variants[0] }));
    }
  }, [skillsByVariant, ui.activeSkillsSubTab]);

  // Use virtualization for better performance
  const { visibleItems: visibleDecks } = useVirtualList(compsData, 600, 200);

  // Optimized tab content with lazy rendering and reduced DOM
  const tabContent = useMemo(() => {
    switch (ui.activeTab) {
      case "Champions":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <LazyMetaTrendsCard
              itemCount={13}
              championsByCost={processedChampions.groupedArray}
              setSelectedChampion={(key) => handleFilterChange("champion", key)}
              selectedChampion={filters.selectedChampion}
              forces={gameData.forces}
            />
          </Suspense>
        );
      case "Traits":
        return (
          <div className="p-3 md:p-6 bg-[#111111] rounded-lg">
            {/* Mobile Sub-tabs */}
            <div className="lg:hidden mb-4">
              <div className="flex justify-center">
                <div className="inline-flex rounded-lg overflow-hidden border border-[#2D2F37] bg-[#1D1D1D]">
                  <TabButton
                    active={ui.activeTraitsSubTab === "Origin"}
                    label={others?.origin}
                    onClick={handleTraitsSubTabChange}
                    tabKey="Origin"
                  />
                  <TabButton
                    active={ui.activeTraitsSubTab === "Forces"}
                    label={others?.forces}
                    onClick={handleTraitsSubTabChange}
                    tabKey="Forces"
                  />
                </div>
              </div>
            </div>

            {/* Mobile View */}
            <div className="lg:hidden">
              {ui.activeTraitsSubTab === "Origin" && (
                <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full">
                  {gameData.traits?.slice(0, 12).map((trait, i) => (
                    <TraitItem
                      key={`trait-${trait.key}`}
                      trait={trait}
                      selectedTrait={filters.selectedTrait}
                      onSelect={handleFilterChange}
                      index={i}
                    />
                  ))}
                </div>
              )}

              {ui.activeTraitsSubTab === "Forces" && (
                <div className="grid grid-cols-5 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full">
                  {gameData.forces?.slice(0, 10).map((force, i) => (
                    <ForceItem
                      key={`force-${force.key}`}
                      force={force}
                      selectedTrait={filters.selectedTrait}
                      onSelect={handleFilterChange}
                      index={i}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Desktop View */}
            <div className="hidden lg:block space-y-6">
              <div className="flex flex-col lg:flex-row items-center gap-4">
                <div className="p-1 rounded-lg text-[#D9A876] font-semibold text-center min-w-[100px]">
                  {others?.origin}
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 w-full">
                  {gameData.traits?.map((trait, i) => (
                    <TraitItem
                      key={`trait-${trait.key}`}
                      trait={trait}
                      selectedTrait={filters.selectedTrait}
                      onSelect={handleFilterChange}
                      index={i}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col lg:flex-row items-center gap-4">
                <div className="p-1 rounded-lg text-[#D9A876] font-semibold text-center min-w-[100px]">
                  {others?.forces}
                </div>
                <div className="grid grid-cols-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 w-full">
                  {gameData.forces?.map((force, i) => (
                    <ForceItem
                      key={`force-${force.key}`}
                      force={force}
                      selectedTrait={filters.selectedTrait}
                      onSelect={handleFilterChange}
                      index={i}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case "Items":
        return (
          <div className="p-3 md:p-6 bg-[#111111] rounded-lg max-h-[155px] md:max-h-full mb-8 overflow-y-auto">
            <div className="grid grid-cols-6 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:!flex justify-center xl:!flex-wrap gap-2 lg:gap-4">
              {filteredItems.slice(0, 24).map((item, i) => (
                <ItemIcon
                  key={`item-${item.key}`}
                  item={item}
                  selectedItem={filters.selectedItem}
                  onSelect={handleFilterChange}
                  index={i}
                />
              ))}
            </div>
          </div>
        );
      case "SkillTree":
        return (
          <div className="p-3 md:p-6 bg-[#111111] rounded-lg">
            {/* Mobile Sub-tabs */}
            <div className="lg:hidden mb-4">
              {Object.keys(skillsByVariant).length > 1 && (
                <div className="flex justify-center">
                  <div className="inline-flex rounded-lg overflow-x-auto border border-[#2D2F37] bg-[#1D1D1D]">
                    {Object.keys(skillsByVariant).map((variant) => (
                      <TabButton
                        key={variant}
                        active={ui.activeSkillsSubTab === variant}
                        label={variant}
                        onClick={handleSkillsSubTabChange}
                        tabKey={variant}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile View */}
            <div className="lg:hidden">
              {ui.activeSkillsSubTab &&
                skillsByVariant[ui.activeSkillsSubTab] && (
                  <div className="flex flex-wrap justify-center gap-2 w-full">
                    {skillsByVariant[ui.activeSkillsSubTab]
                      .slice(0, 12)
                      .map((skill, i) => (
                        <MobileSkillTreeItem
                          key={`mobile-skill-${skill.key}`}
                          skill={skill}
                          selectedSkillTree={filters.selectedSkillTree}
                          onSelect={handleFilterChange}
                          index={i}
                        />
                      ))}
                  </div>
                )}
            </div>

            {/* Desktop View */}
            <div className="hidden lg:block">
              <div className="flex flex-wrap justify-center gap-3 w-full">
                {gameData.skillTree
                  ?.filter((skill) => skill?.imageUrl)
                  ?.map((skill, i) => (
                    <SkillTreeItem
                      key={`desktop-skill-${skill.key}`}
                      skill={skill}
                      selectedSkillTree={filters.selectedSkillTree}
                      onSelect={handleFilterChange}
                      index={i}
                    />
                  ))}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  }, [
    ui.activeTab,
    ui.activeTraitsSubTab,
    ui.activeSkillsSubTab,
    skillsByVariant,
    processedChampions.groupedArray,
    handleFilterChange,
    handleTraitsSubTabChange,
    handleSkillsSubTabChange,
    gameData,
    filters,
    filteredItems,
    others,
  ]);

  return (
    <div className="mx-auto md:px-6 lg:px-8 py-6">
      <div className="space-y-2">
        {/* Tabs Section */}
        <div className="flex justify-center md:justify-start">
          <div className="inline-flex rounded-lg overflow-hidden border border-[#2D2F37] bg-[#1D1D1D]">
            <TabButton
              active={ui.activeTab === "Champions"}
              label={others?.champions}
              onClick={handleTabChange}
              tabKey="Champions"
            />
            <TabButton
              active={ui.activeTab === "Traits"}
              label={others?.traits}
              onClick={handleTabChange}
              tabKey="Traits"
            />
            <TabButton
              active={ui.activeTab === "Items"}
              label={others?.items}
              onClick={handleTabChange}
              tabKey="Items"
            />
            <TabButton
              active={ui.activeTab === "SkillTree"}
              label={others?.skills}
              onClick={handleTabChange}
              tabKey="SkillTree"
            />
          </div>
        </div>

        {/* Content Sections */}
        <div className="bg-[#111111] md:bg-transparent rounded-lg shadow-lg">
          {tabContent}
        </div>

        {/* Results Section - Use visible decks for virtualization */}
        <div className="flex flex-col gap-[16px]">
          <div>
            {(compsData.length > DESKTOP_DISPLAY_LIMIT
              ? visibleDecks
              : compsData
            )
              ?.slice(0, DESKTOP_DISPLAY_LIMIT)
              ?.map((metaDeck, i) => (
                <MetaDeck
                  key={`${metaDeck.key || metaDeck.puuid}-${i}`}
                  metaDeck={metaDeck}
                  index={metaDeck.virtualIndex || i}
                  isClosed={ui.isClosed}
                  handleIsClosed={handleIsClosed}
                  championsMap={gameData.championsMap}
                  itemsMap={gameData.itemsMap}
                  traits={gameData.traits}
                  forces={gameData.forces}
                  augments={gameData.augments}
                  skills={gameData.skillTree}
                  forceDetailsMap={gameData.forcesMap}
                  skillDetailsMap={gameData.skillTreeMap}
                  traitDetailsMap={gameData.traitsMap}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(RecentDecksItems);

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

// Add SkillTreeIcon component
const SkillTreeIcon = memo(({ skillTree, skills, size = "default" }) => {
  const skillDetails = skills?.find((s) => s.key === skillTree);
  if (!skillDetails) return null;

  return (
    <SkillTreeImage skill={skillDetails} size={size} tooltipId={skillTree} />
  );
});

// Reusable tab button component
const TabButton = memo(
  ({ active, label, onClick }) => (
    <button
      type="button"
      className={`px-6 py-3 text-sm md:text-base font-medium transition-colors duration-200 ${
        active
          ? "bg-[#2D2F37] text-[#D9A876]"
          : "text-[#999] hover:bg-[#2D2F37]"
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  ),
  (prevProps, nextProps) => {
    return (
      prevProps.active === nextProps.active &&
      prevProps.label === nextProps.label
    );
  }
);

// Trait item component - optimized with stable refs
const TraitItem = memo(({ trait, selectedTrait, onSelect, i, t }) => {
  const handleClick = useCallback(() => {
    onSelect("trait", trait?.key);
  }, [onSelect, trait?.key]);

  const isSelected = trait?.key === selectedTrait;

  return (
    <div
      className="flex flex-col items-center gap-2 cursor-pointer group"
      onClick={handleClick}
    >
      <ReactTltp variant="trait" content={trait} id={`${trait?.key}-${i}`} />
      <div className="relative aspect-square w-full max-w-[96px] transition-transform duration-200 group-hover:scale-105">
        <TraitImage
          trait={trait}
          size="xlarge"
          className="w-full h-full rounded-lg"
          data-tooltip-id={`${trait?.key}-${i}`}
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

// Force item component - optimized with stable state management
const ForceItem = memo(({ force, selectedTrait, onSelect, i, t }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = useCallback(() => {
    onSelect("force", force?.key);
  }, [onSelect, force?.key]);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  const isSelected = force?.key === selectedTrait;

  return (
    <div
      className="flex flex-col items-center gap-2 cursor-pointer group"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <ReactTltp variant="force" content={force} id={`${force?.key}-${i}`} />
      <div className="relative aspect-square w-full max-w-[96px] transition-transform duration-200 group-hover:scale-105">
        <ForceIcon
          force={force}
          size="xxlarge"
          isHovered={isHovered}
          className="w-full h-full object-cover rounded-lg"
          data-tooltip-id={`${force?.key}-${i}`}
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

// Item icon component - optimized
const ItemIcon = memo(({ item, selectedItem, onSelect, i }) => {
  const handleClick = useCallback(() => {
    onSelect("item", item?.key);
  }, [onSelect, item?.key]);

  const isSelected = item?.key === selectedItem;

  return (
    <div
      className="flex flex-col items-center gap-2 cursor-pointer group max-w-[84px]"
      onClick={handleClick}
    >
      <ReactTltp variant="item" content={item} id={`${item?.key}-${i}`} />
      <div className="relative aspect-square w-full transition-transform duration-200 group-hover:scale-110">
        <OptimizedImage
          alt={item?.name || "Item"}
          width={84}
          height={84}
          src={item?.imageUrl}
          className="w-full h-full object-contain rounded-lg !border !border-[#ffffff20]"
          data-tooltip-id={`${item?.key}-${i}`}
          loading="lazy"
        />
        {isSelected && (
          <div className="absolute inset-0 bg-[#00000080] rounded-lg flex items-center justify-center">
            <IoMdCheckmarkCircle className="text-[#86efac] text-5xl z-50" />
          </div>
        )}
      </div>
    </div>
  );
});

// Champion with items component - heavily optimized
const ChampionWithItems = memo(
  ({ champion, championDetails, items, forces, tier }) => {
    if (!champion || !championDetails) return null;

    const championItems = useMemo(() => {
      if (!champion?.items || !items) return [];
      return champion.items
        .map((itemKey) => items.find((i) => i.key === itemKey))
        .filter(Boolean);
    }, [champion?.items, items]);

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
              key={idx}
              className="relative z-10 hover:z-20 !border !border-[#ffffff20] aspect-square rounded-lg"
            >
              <ReactTltp
                variant="item"
                content={itemDetails}
                id={itemDetails.key}
              />
              <OptimizedImage
                alt={itemDetails.name || "Item"}
                width={50}
                height={50}
                src={itemDetails.imageUrl}
                className="w-[20px] md:w-[30px] rounded-lg hover:scale-150 transition-all duration-300"
                data-tooltip-id={itemDetails.key}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
);

// Augment icon component
const AugmentIcon = memo(({ augment, augments }) => {
  const augmentDetails = augments?.find((a) => a.key === augment);
  if (!augmentDetails) return null;

  return (
    <div className="flex justify-center items-center md:w-[64px] relative">
      <OptimizedImage
        alt={augmentDetails.name || "Augment"}
        width={80}
        height={80}
        src={augmentDetails.imageUrl}
        className="w-[64px] md:w-[86px]"
        data-tooltip-id={augment}
        loading="lazy"
      />
      <ReactTltp variant="augment" content={augmentDetails} id={augment} />
    </div>
  );
});

// Placement badge component
const PlacementBadge = memo(({ placement }) => (
  <div
    className={`rounded-lg !border-[#ffffff40] !border p-2 py-0 shadow-lg ${
      placement === 1
        ? "text-[#3aedbd] !border-[#3aedbd]"
        : placement === 2
          ? "text-[#FBDB51] !border-[#FBDB51]"
          : placement === 3
            ? "text-[#6eccff] !border-[#6eccff]"
            : "text-[#ffffff]"
    }`}
  >
    <div className="text-xl md:text-3xl p-2">{placement}</div>
  </div>
));

// Deck header component - heavily optimized with memoized force handling
const DeckHeader = memo(
  ({
    metaDeck,
    forces,
    traits,
    toggleClosed,
    isClosed,
    i,
    skills,
    augments,
    augmentDetails,
  }) => {
    const [hoveredForce, setHoveredForce] = useState(null);

    // Pre-compute all derived data to avoid recalculation
    const { forceDetails, skillDetails, traitDetails } = useMemo(() => {
      const computedForceDetails =
        metaDeck?.deck?.forces && forces
          ? metaDeck.deck.forces
              .map((force) => ({
                ...force,
                details: forces.find(
                  (t) => t.key.toLowerCase() === force?.key.toLowerCase()
                ),
              }))
              .filter((force) => force.details)
          : [];

      const computedSkillDetails =
        metaDeck?.deck?.skillTree && skills
          ? metaDeck.deck.skillTree
              .map((skill) => skills.find((s) => s.key === skill))
              .filter(Boolean)
          : [];

      const computedTraitDetails =
        metaDeck?.deck?.traits && traits
          ? metaDeck.deck.traits
              .map((trait) => {
                const traitDetails = traits.find((t) => t.key === trait?.key);
                if (!traitDetails) return null;

                const tier = traitDetails.tiers?.find(
                  (t) => trait?.numUnits >= t?.min && trait?.numUnits <= t?.max
                );

                return tier?.imageUrl
                  ? { ...traitDetails, tier, numUnits: trait?.numUnits }
                  : null;
              })
              .filter(Boolean)
          : [];

      return {
        forceDetails: computedForceDetails,
        skillDetails: computedSkillDetails,
        traitDetails: computedTraitDetails,
      };
    }, [metaDeck?.deck, forces, skills, traits]);

    const handleMouseEnter = useCallback((forceKey) => {
      setHoveredForce(forceKey);
    }, []);

    const handleMouseLeave = useCallback(() => {
      setHoveredForce(null);
    }, []);

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
            {traitDetails.map((trait, index) => (
              <div key={`${trait.key}-${index}`} className="relative">
                <TraitImage
                  trait={trait}
                  size="default"
                  className="w-[38px] h-[38px] md:w-[36px] md:h-[36px]"
                  data-tooltip-id={`${trait.key}-${index}`}
                />
                <ReactTltp
                  variant="trait"
                  id={`${trait.key}-${index}`}
                  content={trait}
                />
              </div>
            ))}
          </div>
        </div>
        <OptimizedImage
          src={
            "https://res.cloudinary.com/dg0cmj6su/image/upload/v1736245309/rule_1_1_otljzg.png"
          }
          alt={"border"}
          width={100}
          height={100}
          className="w-[100px] mx-auto rounded-lg md:hidden"
        />
        {/* Mobile: Single row with force icons and skill tree */}
        <div className="flex md:hidden flex-col gap-y-3 mt-2 w-full items-center">
          {/* First row: Force icons and skill tree */}
          <div className="flex items-center gap-x-2 w-fit overflow-hidden !border !border-[#ffffff40] rounded-lg p-1">
            {/* Force icons only (no background, border, count) */}
            {forceDetails.map((force, index) => (
              <div
                key={`${force.key}-${index}`}
                className="flex-shrink-0 w-[30px] h-[30px]"
                onMouseEnter={() => handleMouseEnter(force?.key)}
                onMouseLeave={handleMouseLeave}
              >
                <ForceIcon
                  force={force.details}
                  size="custom"
                  customSize="w-full h-full"
                  className="aspect-square"
                  data-tooltip-id={`${force?.key}-${index}`}
                  isHovered={hoveredForce === force?.key}
                />
                <ReactTltp content={force?.key} id={`${force?.key}-${index}`} />
              </div>
            ))}
            {/* Vertical divider */}
            {forceDetails.length > 0 && skillDetails.length > 0 && (
              <div className="flex-shrink-0 h-8 w-px bg-[#ffffff30] mx-1"></div>
            )}
            {/* Skill tree icons */}
            {skillDetails.map((skill, index) => (
              <div
                key={`${skill.key}-${index}`}
                className="flex-shrink-0 w-[30px] h-[30px] shadow-md rounded-full shadow-[#ffffff20]"
              >
                <SkillTreeIcon
                  skillTree={skill.key}
                  skills={skills}
                  size="default"
                />
              </div>
            ))}
          </div>
          {/* Second row: Traits and Augments */}
          <div className="flex items-center gap-x-1 w-fit overflow-x-auto scrollbar-hide">
            {traitDetails.map((trait, index) => (
              <div key={`${trait.key}-${index}`} className="flex-shrink-0">
                <TraitImage
                  trait={trait}
                  size="small"
                  className="!w-[34px] !h-[34px]"
                  data-tooltip-id={`${trait.key}-${index}`}
                />
                <ReactTltp
                  variant="trait"
                  id={`${trait.key}-${index}`}
                  content={trait}
                />
              </div>
            ))}
            {/* Vertical separator between traits and augments */}
            {traitDetails.length > 0 && augmentDetails.length > 0 && (
              <div className="flex-shrink-0 h-8 w-px bg-[#ffffff30] mx-2"></div>
            )}
            {/* Augments */}
            {augmentDetails.map((augment, index) => (
              <div
                key={`augment-${augment.key}-${index}`}
                className="flex-shrink-0"
              >
                <OptimizedImage
                  alt={augment.name || "Augment"}
                  width={32}
                  height={32}
                  src={augment.imageUrl}
                  className="!w-[30px] !h-[30px] rounded-md mx-0.5"
                  data-tooltip-id={`augment-${augment.key}-${index}`}
                  loading="eager"
                />
                <ReactTltp
                  variant="augment"
                  content={augment}
                  id={`augment-${augment.key}-${index}`}
                />
              </div>
            ))}
          </div>
        </div>
        {/* Desktop layout */}
        <div className="hidden md:inline-flex flex-shrink-0 justify-between gap-1 !gap-x-6 md:mt-1">
          <div className="flex flex-wrap gap-1 md:gap-0 md:inline-flex md:flex-wrap justify-start md:justify-end items-center md:mr-0">
            {/* Force icons with count and border */}
            {forceDetails.map((force, index) => (
              <div
                key={`${force.key}-${index}`}
                className="flex justify-center items-center bg-[#000] rounded-full mx-1 pr-2 border-[1px] border-[#ffffff30] h-[90%]"
                onMouseEnter={() => handleMouseEnter(force?.key)}
                onMouseLeave={handleMouseLeave}
              >
                <ForceIcon
                  force={force.details}
                  size="custom"
                  customSize="w-[30px] h-[30px] md:w-[36px] md:h-[36px]"
                  className="mr-1"
                  data-tooltip-id={`${force?.key}-${index}`}
                  isHovered={hoveredForce === force?.key}
                />
                <ReactTltp content={force?.key} id={`${force?.key}-${index}`} />
                <span className="text-[18px]">{force?.numUnits}</span>
              </div>
            ))}
            {/* Vertical separator between forces and skills */}
            {forceDetails.length > 0 && skillDetails.length > 0 && (
              <div className="flex items-center mx-2">
                <div className="h-12 w-px bg-[#ffffff30]"></div>
              </div>
            )}
            {/* Skill tree icons */}
            {skillDetails.map((skill, index) => (
              <SkillTreeIcon
                key={`${skill.key}-${index}`}
                skillTree={skill.key}
                skills={skills}
                size="medium"
              />
            ))}
            {/* Vertical separator between skills and augments */}
            {skillDetails.length > 0 && augmentDetails.length > 0 && (
              <div className="flex items-center mx-2">
                <div className="h-12 w-px bg-[#ffffff30]"></div>
              </div>
            )}
            {/* Augments */}
            {augmentDetails.map((augment, index) => (
              <div key={`augment-${augment.key}-${index}`} className="relative">
                <OptimizedImage
                  alt={augment.name || "Augment"}
                  width={48}
                  height={48}
                  src={augment.imageUrl}
                  className="w-[38px] h-[38px] md:w-[36px] md:h-[36px] mx-0.5 rounded-md"
                  data-tooltip-id={`augment-${augment.key}-${index}`}
                  loading="eager"
                />
                <ReactTltp
                  variant="augment"
                  content={augment}
                  id={`augment-${augment.key}-${index}`}
                />
              </div>
            ))}
          </div>
        </div>
      </header>
    );
  }
);

// Meta deck component - optimized with reduced champion rendering
const MetaDeck = memo(
  ({
    metaDeck,
    i,
    isClosed,
    handleIsClosed,
    champions,
    items,
    traits,
    forces,
    augments,
    skills,
  }) => {
    const toggleClosed = useCallback(
      (e) => {
        handleIsClosed(e);
      },
      [handleIsClosed]
    );

    const [isChampionsCollapsed, setIsChampionsCollapsed] = useState(true);

    const toggleChampionsSection = useCallback(() => {
      setIsChampionsCollapsed((prev) => !prev);
    }, []);

    // Pre-compute all champion data to avoid recalculation
    const {
      sortedChampions,
      championsToDisplay,
      championsMap,
      augmentDetails,
    } = useMemo(() => {
      const computedSortedChampions =
        metaDeck?.deck?.champions && champions
          ? metaDeck.deck.champions.slice().sort((a, b) => {
              const champA = champions.find((c) => c.key === a.key);
              const champB = champions.find((c) => c.key === b.key);
              return (champA?.cost || 0) - (champB?.cost || 0);
            })
          : [];

      // Create a map for O(1) champion lookups
      const computedChampionsMap = new Map();
      champions?.forEach((champion) => {
        computedChampionsMap.set(champion.key, champion);
      });

      const computedChampionsToDisplay = (() => {
        if (!computedSortedChampions.length) return [];

        if (isChampionsCollapsed) {
          const prioritizedChampions = [...computedSortedChampions].sort(
            (a, b) => {
              const champA = computedChampionsMap.get(a.key);
              const champB = computedChampionsMap.get(b.key);

              const isAFourStar = (a?.tier || 0) >= 4;
              const isBFourStar = (b?.tier || 0) >= 4;
              if (isAFourStar && !isBFourStar) return -1;
              if (!isAFourStar && isBFourStar) return 1;

              const costDiff = (champB?.cost || 0) - (champA?.cost || 0);
              if (costDiff !== 0) return costDiff;

              const aHasItems = a.items && a.items.length > 0;
              const bHasItems = b.items && b.items.length > 0;
              if (aHasItems && !bHasItems) return -1;
              if (!aHasItems && bHasItems) return 1;

              return 0;
            }
          );

          return prioritizedChampions.slice(0, 4);
        }

        return computedSortedChampions;
      })();

      const computedAugmentDetails =
        metaDeck?.deck?.augments && augments
          ? metaDeck.deck.augments
              .map((augment) => augments.find((a) => a.key === augment))
              .filter(Boolean)
          : [];

      return {
        sortedChampions: computedSortedChampions,
        championsToDisplay: computedChampionsToDisplay,
        championsMap: computedChampionsMap,
        augmentDetails: computedAugmentDetails,
      };
    }, [metaDeck?.deck, champions, augments, isChampionsCollapsed]);

    const hasMoreChampions =
      sortedChampions.length > championsToDisplay.length &&
      isChampionsCollapsed;

    return (
      <div className="flex flex-col gap-[1px] bg-gradient-to-r from-[#5f5525] to-[#6D4600] p-[1px] rounded-lg overflow-hidden shadow-lg mb-4 md:!mb-6">
        <div className="bg-[#000000] rounded-lg">
          <DeckHeader
            metaDeck={metaDeck}
            forces={forces}
            traits={traits}
            toggleClosed={toggleClosed}
            isClosed={isClosed[i]}
            i={i}
            skills={skills}
            augments={augments}
            augmentDetails={augmentDetails}
          />

          {!isClosed[i] && (
            <div className="flex flex-col bg-center bg-no-repeat mt-[-1px]">
              <div className="flex min-h-[150px] flex-col justify-between items-center bg-[#111111] lg:flex-row lg:gap-[15px] lg:py-[0px] xl:px-6 rounded-b-lg">
                <div className="-mb-[8px] max-w-[342px] lg:mb-0 lg:w-full lg:max-w-full lg:flex-shrink-0">
                  <div className="flex flex-col">
                    {/* Mobile view: Collapsible champions */}
                    <div className="lg:hidden">
                      <div className="flex flex-wrap justify-center gap-2 w-full">
                        {/* Collapsed: Show 4 champions with items & higher cost */}
                        {isChampionsCollapsed &&
                          championsToDisplay.map((champion, index) => {
                            const championDetails = championsMap.get(
                              champion.key
                            );
                            return championDetails ? (
                              <ChampionWithItems
                                key={`collapsed-${champion.key}-${index}`}
                                champion={champion}
                                championDetails={championDetails}
                                items={items}
                                forces={forces}
                                tier={champion.tier}
                              />
                            ) : null;
                          })}

                        {/* Expanded: Show all champions */}
                        {!isChampionsCollapsed &&
                          sortedChampions.map((champion, index) => {
                            const championDetails = championsMap.get(
                              champion.key
                            );
                            return championDetails ? (
                              <div
                                key={`expanded-${champion.key}-${index}`}
                                className="transition-all duration-500 ease-in-out opacity-100 transform scale-100 translate-y-0"
                                style={{
                                  transitionDelay: `${index * 30}ms`,
                                }}
                              >
                                <ChampionWithItems
                                  champion={champion}
                                  championDetails={championDetails}
                                  items={items}
                                  forces={forces}
                                  tier={champion.tier}
                                />
                              </div>
                            ) : null;
                          })}
                      </div>

                      {/* Line with toggle button at the center - Mobile only */}
                      {sortedChampions.length > 4 && (
                        <div className="flex items-center justify-center mt-1 w-full transition-all duration-300 ease-in-out">
                          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#ffffff30] to-[#ffffff30] transition-all duration-300"></div>
                          <button
                            onClick={toggleChampionsSection}
                            className="mx-3 w-7 h-7 bg-[#2D2F37] hover:bg-[#3D3F47] text-[#D9A876] rounded-full transition-all duration-300 ease-in-out flex items-center justify-center shadow-md border border-[#ffffff20] flex-shrink-0 hover:scale-110 active:scale-95"
                            title={
                              isChampionsCollapsed
                                ? `Show all ${sortedChampions.length} champions`
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

                    {/* Desktop view: All champions visible */}
                    <div className="hidden lg:flex flex-wrap justify-center gap-2 w-full">
                      {sortedChampions.map((champion, index) => {
                        const championDetails = championsMap.get(champion.key);
                        return championDetails ? (
                          <ChampionWithItems
                            key={`desktop-${champion.key}-${index}`}
                            champion={champion}
                            championDetails={championDetails}
                            items={items}
                            forces={forces}
                            tier={champion.tier}
                          />
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>

                <div className="hidden flex items-center gap-x-8">
                  <div className="hidden md:flex md:flex-col justify-center gap-[2px] lg:py-[8px]">
                    {augmentDetails.map((augment, index) => (
                      <AugmentIcon
                        key={`${augment.key}-${index}`}
                        augment={augment.key}
                        augments={augments}
                      />
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

// SkillTreeItem component - optimized
const SkillTreeItem = memo(({ skill, selectedSkillTree, onSelect, i }) => {
  const handleClick = useCallback(() => {
    onSelect("skillTree", skill?.key);
  }, [onSelect, skill?.key]);

  const isSelected = skill?.key === selectedSkillTree;

  return (
    <div
      className="flex flex-col items-center gap-1 cursor-pointer group w-16 md:w-20 lg:w-24 flex-shrink-0"
      onClick={handleClick}
    >
      <ReactTltp
        variant="skillTree"
        content={skill}
        id={`skill-${skill?.key}-${i}`}
      />
      <div className="relative aspect-square w-full transition-transform duration-200 group-hover:scale-105">
        <SkillTreeImage
          skill={skill}
          size="large"
          tooltipId={`skill-${skill?.key}-${i}`}
          className="w-full h-full"
          showTooltip={false}
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

// Mobile SkillTreeItem component
const MobileSkillTreeItem = memo(
  ({ skill, selectedSkillTree, onSelect, i }) => {
    const handleClick = useCallback(() => {
      onSelect("skillTree", skill?.key);
    }, [onSelect, skill?.key]);

    const isSelected = skill?.key === selectedSkillTree;

    return (
      <div
        className="flex flex-col items-center gap-1 cursor-pointer group w-12 sm:w-14 flex-shrink-0"
        onClick={handleClick}
      >
        <ReactTltp
          variant="skillTree"
          content={skill}
          id={`mobile-skill-${skill?.key}-${i}`}
        />
        <div className="relative aspect-square w-full transition-transform duration-200 group-hover:scale-105">
          <SkillTreeImage
            skill={skill}
            size="xlarge"
            tooltipId={`mobile-skill-${skill?.key}-${i}`}
            className="w-full h-full"
            showTooltip={false}
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

const RecentDecksItems = () => {
  const { t } = useTranslation();
  const others = t("others");
  const [selectedChampion, setSelectedChampion] = useState(null);
  const [selectedTrait, setSelectedTrait] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedSkillTree, setSelectedSkillTree] = useState(null);
  const [isClosed, setIsClosed] = useState({});
  const [activeTab, setActiveTab] = useState("Champions");
  const [activeTraitsSubTab, setActiveTraitsSubTab] = useState("Origin");
  const [activeSkillsSubTab, setActiveSkillsSubTab] = useState(null);

  // Extract and memoize data once from the JSON structure
  const { metaDecks, champions, items, traits, augments, forces, skillTree } =
    useMemo(() => {
      const {
        props: {
          pageProps: {
            dehydratedState: {
              queries: { data },
            },
          },
        },
      } = Comps;

      return {
        metaDecks: RecentDecksHistory?.metaDecks || [],
        champions: data?.refs?.champions || [],
        items: data?.refs?.items || [],
        traits: data?.refs?.traits || [],
        augments: data?.refs?.augments || [],
        forces: data?.refs?.forces || [],
        skillTree: data?.refs?.skillTree || [],
      };
    }, []);

  const [compsData, setCompsData] = useState(metaDecks);

  // Optimized shuffle function with early return
  const shuffle = useCallback((array) => {
    if (!array?.length) return [];
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }, []);

  // Heavily optimized champion processing with Map for O(1) lookups
  const { filteredChampions, groupedArray } = useMemo(() => {
    if (!champions?.length) {
      return { filteredChampions: [], groupedArray: [] };
    }

    // Use Map for better performance
    const championsByType = new Map();
    champions.forEach((champion) => {
      if (!championsByType.has(champion.type)) {
        championsByType.set(champion.type, []);
      }
      championsByType.get(champion.type).push(champion);
    });

    // Process each type and select 2 champions
    const filtered = [];
    for (const [type, group] of championsByType) {
      const selected = shuffle([...group]).slice(0, 2);
      filtered.push(...selected);
    }

    // Group by cost more efficiently
    const groupedByCost = new Map();
    filtered.forEach((champion) => {
      const { cost } = champion;
      if (!groupedByCost.has(cost)) {
        groupedByCost.set(cost, []);
      }
      groupedByCost.get(cost).push({
        ...champion,
        selected: champion.key === selectedChampion,
      });
    });

    return {
      filteredChampions: filtered,
      groupedArray: Array.from(groupedByCost.values()),
    };
  }, [champions, shuffle, selectedChampion]);

  // Optimize filtered items with early return
  const filteredItems = useMemo(() => {
    return items?.filter((item) => !item?.isFromItem) || [];
  }, [items]);

  // Optimized filter change handler with batch updates
  const handleFilterChange = useCallback(
    (type, key) => {
      if (!metaDecks?.length) return;

      // Batch state updates
      const updates = {
        selectedChampion: null,
        selectedTrait: null,
        selectedItem: null,
        selectedSkillTree: null,
      };

      let newCompsData;

      if (type === "trait") {
        if (selectedTrait === key) {
          newCompsData = metaDecks;
        } else {
          updates.selectedTrait = key;
          newCompsData = metaDecks.filter((deck) =>
            deck.deck?.traits?.some((trait) => trait.key === key)
          );
        }
      } else if (type === "force") {
        if (selectedTrait === key) {
          newCompsData = metaDecks;
        } else {
          updates.selectedTrait = key;
          newCompsData = metaDecks.filter((deck) =>
            deck.deck?.forces?.some(
              (force) => force.key.toLowerCase() === key.toLowerCase()
            )
          );
        }
      } else if (type === "champion") {
        if (selectedChampion === key) {
          newCompsData = metaDecks;
        } else {
          updates.selectedChampion = key;
          newCompsData = metaDecks.filter((deck) =>
            deck.deck?.champions?.some((champion) => champion.key === key)
          );
        }
      } else if (type === "item") {
        if (selectedItem === key) {
          newCompsData = metaDecks;
        } else {
          updates.selectedItem = key;
          newCompsData = metaDecks.filter((deck) =>
            deck.deck?.champions?.some(
              (champion) =>
                champion.items && champion.items.some((item) => item === key)
            )
          );
        }
      } else if (type === "skillTree") {
        if (selectedSkillTree === key) {
          newCompsData = metaDecks;
        } else {
          updates.selectedSkillTree = key;
          newCompsData = metaDecks.filter((deck) =>
            deck.deck?.skillTree?.includes(key)
          );
        }
      }

      // Apply batch updates
      setSelectedChampion(updates.selectedChampion);
      setSelectedTrait(updates.selectedTrait);
      setSelectedItem(updates.selectedItem);
      setSelectedSkillTree(updates.selectedSkillTree);
      setCompsData(newCompsData);
    },
    [
      metaDecks,
      selectedChampion,
      selectedItem,
      selectedTrait,
      selectedSkillTree,
    ]
  );

  const handleIsClosed = useCallback((event) => {
    const buttonId = event.currentTarget.id;
    setIsClosed((prev) => ({ ...prev, [buttonId]: !prev[buttonId] }));
  }, []);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  const handleTraitsSubTabChange = useCallback((subTab) => {
    setActiveTraitsSubTab(subTab);
  }, []);

  const handleSkillsSubTabChange = useCallback((subTab) => {
    setActiveSkillsSubTab(subTab);
  }, []);

  // Simplified skills grouping using existing variant property
  const skillsByVariant = useMemo(() => {
    if (!skillTree?.length) return {};

    const grouped = new Map();
    const validSkills = skillTree.filter((skill) => skill?.imageUrl);

    validSkills.forEach((skill) => {
      // Use existing variant property, with fallbacks for category/type if needed
      const variant = skill.variant || "General";

      if (!grouped.has(variant)) {
        grouped.set(variant, []);
      }
      grouped.get(variant).push(skill);
    });

    return Object.fromEntries(grouped);
  }, [skillTree]);

  // Initialize skills sub-tab efficiently
  useEffect(() => {
    const variants = Object.keys(skillsByVariant);
    if (variants.length > 0 && !activeSkillsSubTab) {
      setActiveSkillsSubTab(variants[0]);
    }
  }, [skillsByVariant, activeSkillsSubTab]);

  // Heavily optimized tab content with lazy rendering
  const tabContent = useMemo(() => {
    switch (activeTab) {
      case "Champions":
        return (
          <MetaTrendsCard
            itemCount={13}
            championsByCost={groupedArray}
            setSelectedChampion={(key) => handleFilterChange("champion", key)}
            selectedChampion={selectedChampion}
            forces={forces}
          />
        );
      case "Traits":
        return (
          <div className="p-3 md:p-6 bg-[#111111] rounded-lg">
            {/* Mobile Sub-tabs */}
            <div className="lg:hidden mb-4">
              <div className="flex justify-center">
                <div className="inline-flex rounded-lg overflow-hidden border border-[#2D2F37] bg-[#1D1D1D]">
                  <button
                    type="button"
                    className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                      activeTraitsSubTab === "Origin"
                        ? "bg-[#2D2F37] text-[#D9A876]"
                        : "text-[#999] hover:bg-[#2D2F37]"
                    }`}
                    onClick={() => handleTraitsSubTabChange("Origin")}
                  >
                    {others?.origin}
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                      activeTraitsSubTab === "Forces"
                        ? "bg-[#2D2F37] text-[#D9A876]"
                        : "text-[#999] hover:bg-[#2D2F37]"
                    }`}
                    onClick={() => handleTraitsSubTabChange("Forces")}
                  >
                    {others?.forces}
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile View - Conditional rendering */}
            <div className="lg:hidden">
              {activeTraitsSubTab === "Origin" && (
                <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full">
                  {traits?.map((trait, i) => (
                    <TraitItem
                      key={`trait-${trait.key}-${i}`}
                      trait={trait}
                      selectedTrait={selectedTrait}
                      onSelect={handleFilterChange}
                      i={i}
                      t={t}
                    />
                  ))}
                </div>
              )}

              {activeTraitsSubTab === "Forces" && (
                <div className="grid grid-cols-5 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full">
                  {forces?.map((force, i) => (
                    <ForceItem
                      key={`force-${force.key}-${i}`}
                      force={force}
                      selectedTrait={selectedTrait}
                      onSelect={handleFilterChange}
                      i={i}
                      t={t}
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
                  {traits?.map((trait, i) => (
                    <TraitItem
                      key={`trait-${trait.key}-${i}`}
                      trait={trait}
                      selectedTrait={selectedTrait}
                      onSelect={handleFilterChange}
                      i={i}
                      t={t}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col lg:flex-row items-center gap-4">
                <div className="p-1 rounded-lg text-[#D9A876] font-semibold text-center min-w-[100px]">
                  {others?.forces}
                </div>
                <div className="grid grid-cols-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 w-full">
                  {forces?.map((force, i) => (
                    <ForceItem
                      key={`force-${force.key}-${i}`}
                      force={force}
                      selectedTrait={selectedTrait}
                      onSelect={handleFilterChange}
                      i={i}
                      t={t}
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
              {filteredItems.map((item, i) => (
                <ItemIcon
                  key={`item-${item.key}-${i}`}
                  item={item}
                  selectedItem={selectedItem}
                  onSelect={handleFilterChange}
                  i={i}
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
                      <button
                        key={variant}
                        type="button"
                        className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                          activeSkillsSubTab === variant
                            ? "bg-[#2D2F37] text-[#D9A876]"
                            : "text-[#999] hover:bg-[#2D2F37]"
                        }`}
                        onClick={() => handleSkillsSubTabChange(variant)}
                      >
                        {variant}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile View - Conditional rendering */}
            <div className="lg:hidden">
              {activeSkillsSubTab && skillsByVariant[activeSkillsSubTab] && (
                <div className="flex flex-wrap justify-center gap-2 w-full">
                  {skillsByVariant[activeSkillsSubTab].map((skill, i) => (
                    <MobileSkillTreeItem
                      key={`mobile-skill-${skill.key}-${i}`}
                      skill={skill}
                      selectedSkillTree={selectedSkillTree}
                      onSelect={handleFilterChange}
                      i={i}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Desktop View */}
            <div className="hidden lg:block">
              <div className="flex flex-wrap justify-center gap-3 w-full">
                {skillTree
                  ?.filter((skill) => skill?.imageUrl)
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
    groupedArray,
    handleFilterChange,
    handleTraitsSubTabChange,
    handleSkillsSubTabChange,
    forces,
    traits,
    skillTree,
    selectedTrait,
    selectedSkillTree,
    filteredItems,
    selectedItem,
    others,
    selectedChampion,
    t,
  ]);

  return (
    <div className="mx-auto md:px-6 lg:px-8 py-6">
      <div className="space-y-2">
        {/* Tabs Section */}
        <div className="flex justify-center md:justify-start">
          <div className="inline-flex rounded-lg overflow-hidden border border-[#2D2F37] bg-[#1D1D1D]">
            <TabButton
              active={activeTab === "Champions"}
              label={others?.champions}
              onClick={() => handleTabChange("Champions")}
            />
            <TabButton
              active={activeTab === "Traits"}
              label={others?.traits}
              onClick={() => handleTabChange("Traits")}
            />
            <TabButton
              active={activeTab === "Items"}
              label={others?.items}
              onClick={() => handleTabChange("Items")}
            />
            <TabButton
              active={activeTab === "SkillTree"}
              label={others?.skills}
              onClick={() => handleTabChange("SkillTree")}
            />
          </div>
        </div>

        {/* Content Sections */}
        <div className="bg-[#111111] md:bg-transparent rounded-lg shadow-lg">
          {tabContent}
        </div>

        {/* Results Section - Virtualized for better performance */}
        <div className="flex flex-col gap-[16px]">
          <div>
            {compsData?.map((metaDeck, i) => (
              <MetaDeck
                key={`${metaDeck.key || metaDeck.puuid}-${i}`}
                metaDeck={metaDeck}
                i={i}
                isClosed={isClosed}
                handleIsClosed={handleIsClosed}
                champions={champions}
                items={items}
                traits={traits}
                forces={forces}
                augments={augments}
                skills={skillTree}
              />
            ))}
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
  );
};

export default memo(RecentDecksItems);

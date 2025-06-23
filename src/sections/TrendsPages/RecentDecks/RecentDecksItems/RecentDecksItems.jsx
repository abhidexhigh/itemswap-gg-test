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
} from "react";
import moment from "moment";
import "react-tooltip/dist/react-tooltip.css";
import RecentDecksCard from "../RecentDecksCard/RecentDecksCard";
import MetaTrendsCard from "../../MetaTrends/MetaTrendsCard/MetaTrendsCard";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import CardImage from "src/components/cardImage";
import { useCompsData } from "../../../../hooks/useCompsData";
import RecentDecksHistory from "../../../../data/newData/recentDecksHistory.json";
import ReactTltp from "src/components/tooltip/ReactTltp";
import { OptimizedImage } from "src/utils/imageOptimizer";
import ForceIcon from "src/components/forceIcon";
import SkillTreeImage from "src/components/SkillTreeImage";
import TraitImage from "src/components/TraitImage/TraitImage";

// Utility functions
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const shuffle = (array) => {
  if (!array?.length) return [];
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Custom hooks
const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIntersecting] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIntersecting(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "100px", ...options }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, isIntersecting];
};

const useInfiniteScroll = (callback, hasMore) => {
  useEffect(() => {
    const handleScroll = debounce(() => {
      if (!hasMore) return;

      const scrollTop = Math.max(
        window.pageYOffset,
        document.documentElement.scrollTop,
        document.body.scrollTop
      );
      const windowHeight =
        window.innerHeight || document.documentElement.clientHeight;
      const documentHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight
      );

      const distanceFromBottom = documentHeight - (scrollTop + windowHeight);

      if (distanceFromBottom <= 300) callback();
    }, 100);

    const events = ["scroll", "touchmove", "touchend"];
    events.forEach((event) => {
      window.addEventListener(event, handleScroll, { passive: true });
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleScroll);
      });
    };
  }, [callback, hasMore]);
};

// Component wrappers
const LazyComponent = memo(({ children, height = "120px" }) => {
  const [ref, isVisible] = useIntersectionObserver();
  return (
    <div ref={ref}>{isVisible ? children : <div style={{ height }} />}</div>
  );
});

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

// Optimized item components
const TraitItem = memo(({ trait, selectedTrait, onSelect, index }) => {
  const handleClick = useCallback(() => {
    onSelect("trait", trait?.key);
  }, [onSelect, trait?.key]);

  const isSelected = trait?.key === selectedTrait;

  return (
    <LazyComponent>
      <div
        className="flex flex-col items-center gap-2 cursor-pointer group"
        onClick={handleClick}
      >
        <ReactTltp
          variant="trait"
          content={trait}
          id={`${trait?.key}-${index}`}
        />
        <div className="relative aspect-square w-full max-w-[96px] transition-transform duration-200 group-hover:scale-105">
          <TraitImage
            trait={trait}
            size="xlarge"
            className="w-full h-full rounded-lg"
            data-tooltip-id={`${trait?.key}-${index}`}
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
    </LazyComponent>
  );
});

const ForceItem = memo(({ force, selectedTrait, onSelect, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = useCallback(() => {
    onSelect("force", force?.key);
  }, [onSelect, force?.key]);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  const isSelected = force?.key === selectedTrait;

  return (
    <LazyComponent>
      <div
        className="flex flex-col items-center gap-2 cursor-pointer group"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <ReactTltp
          variant="force"
          content={force}
          id={`${force?.key}-${index}`}
        />
        <div className="relative aspect-square w-full max-w-[96px] transition-transform duration-200 group-hover:scale-105">
          <ForceIcon
            force={force}
            size="xxlarge"
            isHovered={isHovered}
            className="w-full h-full object-cover rounded-lg"
            data-tooltip-id={`${force?.key}-${index}`}
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
    </LazyComponent>
  );
});

const SkillTreeItem = memo(
  ({ skill, selectedSkillTree, onSelect, index, mobile = false }) => {
    const handleClick = useCallback(() => {
      onSelect("skillTree", skill?.key);
    }, [onSelect, skill?.key]);

    const isSelected = skill?.key === selectedSkillTree;
    const containerClass = mobile
      ? "flex flex-col items-center gap-1 cursor-pointer group w-12 sm:w-14 flex-shrink-0"
      : "flex flex-col items-center gap-1 cursor-pointer group w-16 md:w-20 lg:w-24 flex-shrink-0";
    const textClass = mobile ? "text-[10px]" : "text-xs";
    const iconClass = mobile ? "text-2xl" : "text-3xl";

    return (
      <LazyComponent>
        <div className={containerClass} onClick={handleClick}>
          <ReactTltp
            variant="skillTree"
            content={skill}
            id={`skill-${skill?.key}-${index}`}
          />
          <div className="relative aspect-square w-full transition-transform duration-200 group-hover:scale-105">
            <SkillTreeImage
              skill={skill}
              size={mobile ? "xlarge" : "large"}
              tooltipId={`skill-${skill?.key}-${index}`}
              className="w-full h-full"
              showTooltip={false}
              loading="lazy"
            />
            {isSelected && (
              <div className="absolute inset-0 bg-[#00000080] rounded-lg flex items-center justify-center">
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
      </LazyComponent>
    );
  }
);

const ItemIcon = memo(({ item, selectedItem, onSelect, index }) => {
  const handleClick = useCallback(() => {
    onSelect("item", item?.key);
  }, [onSelect, item?.key]);

  const isSelected = item?.key === selectedItem;

  return (
    <LazyComponent>
      <div
        className="flex flex-col items-center gap-2 cursor-pointer group max-w-[84px]"
        onClick={handleClick}
      >
        <ReactTltp variant="item" content={item} id={`${item?.key}-${index}`} />
        <div className="relative aspect-square w-full transition-transform duration-200 group-hover:scale-110">
          <OptimizedImage
            alt={item?.name}
            width={84}
            height={84}
            src={item?.imageUrl}
            className="w-full h-full object-contain rounded-lg !border !border-[#ffffff20]"
            data-tooltip-id={`${item?.key}-${index}`}
            loading="lazy"
            priority={false}
          />
          {isSelected && (
            <div className="absolute inset-0 bg-[#00000080] rounded-lg flex items-center justify-center">
              <IoMdCheckmarkCircle className="text-[#86efac] text-5xl z-50" />
            </div>
          )}
        </div>
      </div>
    </LazyComponent>
  );
});

// Deck components
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

const ChampionWithItems = memo(
  ({ champion, championDetails, itemsMap, forces, tier }) => {
    const championItems = useMemo(() => {
      if (!champion?.items?.length || !itemsMap) return [];
      return champion.items
        .map((itemKey) => itemsMap.get(itemKey))
        .filter(Boolean)
        .slice(0, 3);
    }, [champion?.items, itemsMap]);

    if (!champion || !championDetails) return null;

    return (
      <LazyComponent height="120px">
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
                  width={30}
                  height={30}
                  src={itemDetails.imageUrl}
                  className="w-[20px] md:w-[30px] rounded-lg hover:scale-150 transition-all duration-300"
                  data-tooltip-id={`item-${itemDetails.key}-${idx}`}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </LazyComponent>
    );
  }
);

const DeckHeader = memo(({ metaDeck, computedData, augmentDetails }) => {
  if (!metaDeck) return null;

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

        {/* Desktop: Traits */}
        <div className="hidden md:flex items-center gap-1 ml-4">
          {computedData.traitDetails.slice(0, 5).map((trait, idx) => (
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

      {/* Mobile layout */}
      <div className="flex md:hidden flex-col gap-y-3 mt-2 w-full items-center">
        <div className="flex items-center gap-x-2 w-fit overflow-hidden !border !border-[#ffffff40] rounded-lg p-1">
          {computedData.forceDetails.slice(0, 4).map((force, idx) => (
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

          {computedData.skillDetails.slice(0, 3).map((skill, idx) => (
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
          {computedData.traitDetails.slice(0, 6).map((trait, idx) => (
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

          {augmentDetails.slice(0, 4).map((augment, idx) => (
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

      {/* Desktop layout */}
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
});

const MetaDeck = memo(
  ({ metaDeck, index, isClosed, handleIsClosed, gameData }) => {
    const [isChampionsCollapsed, setIsChampionsCollapsed] = useState(true);

    const toggleChampionsSection = useCallback(() => {
      startTransition(() => {
        setIsChampionsCollapsed((prev) => !prev);
      });
    }, []);

    // Pre-compute all data
    const computedData = useMemo(() => {
      if (!metaDeck?.deck) {
        return {
          sortedChampions: [],
          championsToDisplay: [],
          augmentDetails: [],
          forceDetails: [],
          skillDetails: [],
          traitDetails: [],
        };
      }

      const sortedChampions = metaDeck.deck.champions?.length
        ? metaDeck.deck.champions.slice().sort((a, b) => {
            const champA = gameData.championsMap.get(a.key);
            const champB = gameData.championsMap.get(b.key);
            return (champA?.cost || 0) - (champB?.cost || 0);
          })
        : [];

      let championsToDisplay;
      if (isChampionsCollapsed && sortedChampions.length > 4) {
        const prioritized = [...sortedChampions].sort((a, b) => {
          const isAFourStar = (a?.tier || 0) >= 4;
          const isBFourStar = (b?.tier || 0) >= 4;
          if (isAFourStar && !isBFourStar) return -1;
          if (!isAFourStar && isBFourStar) return 1;
          return 0;
        });
        championsToDisplay = prioritized.slice(0, 4);
      } else {
        championsToDisplay = sortedChampions;
      }

      const forceDetails = metaDeck.deck.forces
        ? metaDeck.deck.forces
            .map((force) => ({
              ...force,
              details: gameData.forceDetailsMap.get(force?.key?.toLowerCase()),
            }))
            .filter((item) => item.details)
        : [];

      const skillDetails = metaDeck.deck.skillTree
        ? metaDeck.deck.skillTree
            .map((skill) => gameData.skillDetailsMap.get(skill))
            .filter(Boolean)
        : [];

      const traitDetails = metaDeck.deck.traits
        ? metaDeck.deck.traits
            .map((trait) => {
              const traitDetails = gameData.traitDetailsMap.get(trait?.key);
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

      const augmentDetails = metaDeck.deck.augments
        ? metaDeck.deck.augments
            .map((augment) => gameData.augmentsMap.get(augment))
            .filter(Boolean)
        : [];

      return {
        sortedChampions,
        championsToDisplay,
        augmentDetails,
        forceDetails,
        skillDetails,
        traitDetails,
      };
    }, [metaDeck?.deck, gameData, isChampionsCollapsed]);

    if (!metaDeck) return null;

    return (
      <LazyComponent height="200px">
        <div className="flex flex-col gap-[1px] bg-gradient-to-r from-[#5f5525] to-[#6D4600] p-[1px] rounded-lg overflow-hidden shadow-lg mb-4 md:!mb-6">
          <div className="bg-[#000000] rounded-lg">
            <DeckHeader
              metaDeck={metaDeck}
              computedData={computedData}
              augmentDetails={computedData.augmentDetails}
            />

            {!isClosed[index] && (
              <div className="flex flex-col bg-center bg-no-repeat mt-[-1px]">
                <div className="flex min-h-[150px] flex-col justify-between items-center bg-[#111111] lg:flex-row lg:gap-[15px] lg:py-[0px] xl:px-6 rounded-b-lg">
                  <div className="-mb-[8px] max-w-[342px] lg:mb-0 lg:w-full lg:max-w-full lg:flex-shrink-0">
                    <div className="flex flex-col">
                      {/* Mobile view */}
                      <div className="lg:hidden">
                        <div className="flex flex-wrap justify-center gap-2 w-full">
                          {computedData.championsToDisplay.map(
                            (champion, idx) => {
                              const championDetails = gameData.championsMap.get(
                                champion.key
                              );
                              return championDetails ? (
                                <ChampionWithItems
                                  key={`${isChampionsCollapsed ? "collapsed" : "expanded"}-${champion.key}-${idx}`}
                                  champion={champion}
                                  championDetails={championDetails}
                                  itemsMap={gameData.itemsMap}
                                  forces={gameData.forces}
                                  tier={champion.tier}
                                />
                              ) : null;
                            }
                          )}
                        </div>

                        {computedData.sortedChampions.length > 4 && (
                          <div className="flex items-center justify-center mt-1 w-full transition-all duration-300 ease-in-out">
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#ffffff30] to-[#ffffff30] transition-all duration-300"></div>
                            <button
                              onClick={toggleChampionsSection}
                              className="mx-3 w-7 h-7 bg-[#2D2F37] hover:bg-[#3D3F47] text-[#D9A876] rounded-full transition-all duration-300 ease-in-out flex items-center justify-center shadow-md border border-[#ffffff20] flex-shrink-0 hover:scale-110 active:scale-95"
                            >
                              {isChampionsCollapsed ? (
                                <FaChevronDown className="text-xs" />
                              ) : (
                                <FaChevronUp className="text-xs" />
                              )}
                            </button>
                            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#ffffff30] to-[#ffffff30] transition-all duration-300"></div>
                          </div>
                        )}
                      </div>

                      {/* Desktop view */}
                      <div className="hidden lg:flex flex-wrap justify-center gap-2 w-full">
                        {computedData.sortedChampions.map((champion, idx) => {
                          const championDetails = gameData.championsMap.get(
                            champion.key
                          );
                          return championDetails ? (
                            <ChampionWithItems
                              key={`desktop-${champion.key}-${idx}`}
                              champion={champion}
                              championDetails={championDetails}
                              itemsMap={gameData.itemsMap}
                              forces={gameData.forces}
                              tier={champion.tier}
                            />
                          ) : null;
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </LazyComponent>
    );
  }
);

// Main component
const RecentDecksItems = () => {
  const { t } = useTranslation();
  const others = t("others");

  // State
  const [filters, setFilters] = useState({
    selectedChampion: null,
    selectedTrait: null,
    selectedItem: null,
    selectedSkillTree: null,
  });

  const [ui, setUi] = useState({
    isClosed: {},
    activeTab: "Champions",
    activeTraitsSubTab: "Origin",
    activeSkillsSubTab: null,
  });

  const [visibleDecks, setVisibleDecks] = useState(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadingRef = useRef(false);

  // Data
  const {
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

  // Extract and memoize data with Maps
  const gameData = useMemo(() => {
    try {
      const metaDecks = RecentDecksHistory?.metaDecks || [];

      return {
        metaDecks,
        champions,
        items,
        traits,
        augments,
        forces,
        skillTree,
        championsMap: new Map(champions.map((champ) => [champ.key, champ])),
        itemsMap: new Map(items.map((item) => [item.key, item])),
        traitsMap: new Map(traits.map((trait) => [trait.key, trait])),
        augmentsMap: new Map(augments.map((augment) => [augment.key, augment])),
        forceDetailsMap: new Map(
          forces.map((force) => [force.key.toLowerCase(), force])
        ),
        skillDetailsMap: new Map(skillTree.map((skill) => [skill.key, skill])),
        traitDetailsMap: new Map(traits.map((trait) => [trait.key, trait])),
      };
    } catch (error) {
      console.error("Error loading game data:", error);
      return {
        metaDecks: [],
        champions: [],
        items: [],
        traits: [],
        augments: [],
        forces: [],
        skillTree: [],
        championsMap: new Map(),
        itemsMap: new Map(),
        traitsMap: new Map(),
        augmentsMap: new Map(),
        forceDetailsMap: new Map(),
        skillDetailsMap: new Map(),
        traitDetailsMap: new Map(),
      };
    }
  }, [champions, items, traits, augments, forces, skillTree]);

  const [compsData, setCompsData] = useState(() => gameData.metaDecks);

  useEffect(() => {
    setCompsData(gameData.metaDecks);
    setVisibleDecks(6);
  }, [gameData.metaDecks]);

  // Champion processing
  const processedChampions = useMemo(() => {
    if (!gameData.champions?.length) {
      return { filteredChampions: [], groupedArray: [] };
    }

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
  }, [gameData.champions, filters.selectedChampion]);

  const filteredItems = useMemo(() => {
    return gameData.items?.filter((item) => !item?.isFromItem) || [];
  }, [gameData.items]);

  const skillsByVariant = useMemo(() => {
    if (!gameData.skillTree?.length) return {};
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

  // Initialize skills sub-tab
  useEffect(() => {
    const variants = Object.keys(skillsByVariant);
    if (variants.length > 0 && !ui.activeSkillsSubTab) {
      setUi((prev) => ({ ...prev, activeSkillsSubTab: variants[0] }));
    }
  }, [skillsByVariant, ui.activeSkillsSubTab]);

  // Filter handler
  const handleFilterChange = useCallback(
    debounce((type, key) => {
      console.log(`Filter change: ${type} - ${key}`); // Debug log
      const metaDecks = gameData.metaDecks;
      if (!metaDecks?.length) return;

      startTransition(() => {
        const currentFilterKey =
          type === "trait" || type === "force"
            ? filters.selectedTrait
            : filters[
                `selected${type.charAt(0).toUpperCase() + type.slice(1)}`
              ];

        if (currentFilterKey === key) {
          setFilters({
            selectedChampion: null,
            selectedTrait: null,
            selectedItem: null,
            selectedSkillTree: null,
          });
          setCompsData(metaDecks);
          setVisibleDecks(6);
          return;
        }

        let newCompsData;
        const newFilters = { ...filters };

        switch (type) {
          case "trait":
            newFilters.selectedTrait = key;
            newCompsData = [...metaDecks].sort((a, b) => {
              const aCount =
                a.deck?.traits?.find((trait) => trait.key === key)?.numUnits ||
                0;
              const bCount =
                b.deck?.traits?.find((trait) => trait.key === key)?.numUnits ||
                0;
              return bCount - aCount;
            });
            break;
          case "force":
            newFilters.selectedTrait = key;
            newCompsData = [...metaDecks].sort((a, b) => {
              const aCount =
                a.deck?.forces?.find(
                  (force) => force.key.toLowerCase() === key.toLowerCase()
                )?.numUnits || 0;
              const bCount =
                b.deck?.forces?.find(
                  (force) => force.key.toLowerCase() === key.toLowerCase()
                )?.numUnits || 0;
              return bCount - aCount;
            });
            break;
          case "champion":
            newFilters.selectedChampion = key;
            newCompsData = [...metaDecks].sort((a, b) => {
              const aHas =
                a.deck?.champions?.some((champion) => champion.key === key) ||
                false;
              const bHas =
                b.deck?.champions?.some((champion) => champion.key === key) ||
                false;
              if (aHas && !bHas) return -1;
              if (!aHas && bHas) return 1;
              return 0;
            });
            break;
          case "item":
            newFilters.selectedItem = key;
            newCompsData = [...metaDecks].sort((a, b) => {
              const aCount =
                a.deck?.champions?.reduce((count, champion) => {
                  return (
                    count +
                    (champion.items?.filter((item) => item === key).length || 0)
                  );
                }, 0) || 0;
              const bCount =
                b.deck?.champions?.reduce((count, champion) => {
                  return (
                    count +
                    (champion.items?.filter((item) => item === key).length || 0)
                  );
                }, 0) || 0;
              return bCount - aCount;
            });
            break;
          case "skillTree":
            console.log(
              `SkillTree filter - current: ${filters.selectedSkillTree}, new: ${key}`
            );
            newFilters.selectedSkillTree = key;
            console.log(
              "Sample deck skillTree:",
              metaDecks[0]?.deck?.skillTree
            );
            newCompsData = [...metaDecks].sort((a, b) => {
              const aHas = a.deck?.skillTree?.includes(key) || false;
              const bHas = b.deck?.skillTree?.includes(key) || false;
              console.log(`Deck ${a.name || "A"}: has skill ${key}? ${aHas}`);
              console.log(`Deck ${b.name || "B"}: has skill ${key}? ${bHas}`);
              if (aHas && !bHas) return -1;
              if (!aHas && bHas) return 1;
              return 0;
            });
            break;
          default:
            return;
        }

        setFilters(newFilters);
        setCompsData(newCompsData);
        setVisibleDecks(6);
      });
    }, 150),
    [filters, gameData.metaDecks]
  );

  // Event handlers
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

  // Infinite scroll
  const loadMoreDecks = useCallback(() => {
    if (loadingRef.current || isLoadingMore) return;
    if (visibleDecks >= compsData.length) return;

    loadingRef.current = true;
    setIsLoadingMore(true);

    setTimeout(() => {
      setVisibleDecks((prev) => Math.min(prev + 6, compsData.length));
      setIsLoadingMore(false);
      loadingRef.current = false;
    }, 100);
  }, [compsData.length, visibleDecks, isLoadingMore]);

  const hasMoreDecks = visibleDecks < compsData.length;
  useInfiniteScroll(loadMoreDecks, hasMoreDecks);

  const visibleCompsData = useMemo(() => {
    return compsData.slice(0, visibleDecks);
  }, [compsData, visibleDecks]);

  // Tab content
  const tabContent = useMemo(() => {
    switch (ui.activeTab) {
      case "Champions":
        return (
          <MetaTrendsCard
            itemCount={13}
            championsByCost={processedChampions.groupedArray}
            setSelectedChampion={(key) => handleFilterChange("champion", key)}
            selectedChampion={filters.selectedChampion}
            forces={gameData.forces}
          />
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
              )}

              {ui.activeTraitsSubTab === "Forces" && (
                <div className="grid grid-cols-5 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full">
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
              {filteredItems.map((item, i) => (
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
                        <SkillTreeItem
                          key={`mobile-skill-${skill.key}`}
                          skill={skill}
                          selectedSkillTree={filters.selectedSkillTree}
                          onSelect={handleFilterChange}
                          index={i}
                          mobile={true}
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

  // Loading state
  if (isLoading) {
    return (
      <div className="mx-auto md:px-6 lg:px-8 py-6">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D9A876]"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="mx-auto md:px-6 lg:px-8 py-6">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
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
      </div>
    );
  }

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

        {/* Results Section */}
        <div className="flex flex-col gap-[16px]">
          <div>
            {visibleCompsData.length > 0 ? (
              <>
                {visibleCompsData.map((metaDeck, i) => (
                  <MetaDeck
                    key={`${metaDeck.key || metaDeck.puuid}-${i}`}
                    metaDeck={metaDeck}
                    index={i}
                    isClosed={ui.isClosed}
                    handleIsClosed={handleIsClosed}
                    gameData={gameData}
                  />
                ))}

                {/* Loading indicator */}
                {isLoadingMore && (
                  <div className="flex justify-center py-6">
                    <div className="flex items-center space-x-2 text-[#D9A876]">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#D9A876]"></div>
                      <span className="text-sm">Loading more decks...</span>
                    </div>
                  </div>
                )}

                {/* Manual load button */}
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
                {!hasMoreDecks && compsData.length > 6 && (
                  <div className="flex flex-col items-center py-6 space-y-2">
                    <div className="text-gray-500 text-sm text-center">
                      ✓ Showing all {compsData.length} decks
                    </div>
                    <div className="text-gray-600 text-xs text-center md:hidden">
                      Scroll up to see more options
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-gray-400">
                No decks found matching the current filters.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(RecentDecksItems);

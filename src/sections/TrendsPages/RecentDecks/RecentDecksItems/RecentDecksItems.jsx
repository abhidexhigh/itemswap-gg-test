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

// OPTIMIZATION 1: Constants and utilities
const MOBILE_DISPLAY_LIMIT = 4;
const DESKTOP_DISPLAY_LIMIT = 20;
const SCROLL_THRESHOLD = 300; // Increased for mobile
const EMPTY_ARRAY = [];
const EMPTY_OBJECT = {};

// OPTIMIZATION 2: Debounce utility for mobile performance
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// OPTIMIZATION 3: Simple intersection observer for lazy loading
const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIntersecting] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIntersecting(true);
          observer.unobserve(element); // Stop observing once visible
        }
      },
      { threshold: 0.1, rootMargin: "100px", ...options }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, isIntersecting];
};

// OPTIMIZATION 4: Mobile-optimized infinite scroll
const useInfiniteScroll = (callback, hasMore) => {
  const scrollTimeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!hasMore) return;

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
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

        if (distanceFromBottom <= SCROLL_THRESHOLD) {
          callback();
        }
      }, 100);
    };

    const events = ["scroll", "touchmove", "touchend"];
    const options = { passive: true };

    events.forEach((event) => {
      window.addEventListener(event, handleScroll, options);
    });

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, handleScroll, options);
      });
    };
  }, [callback, hasMore]);
};

// OPTIMIZATION 5: Lightweight lazy loading wrapper
const LazyComponent = memo(({ children, height = "120px" }) => {
  const [ref, isVisible] = useIntersectionObserver();

  return (
    <div ref={ref}>{isVisible ? children : <div style={{ height }} />}</div>
  );
});

// OPTIMIZATION 6: Heavily optimized TabButton
const TabButton = memo(
  ({ active, label, onClick, tabKey }) => {
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
  },
  (prevProps, nextProps) => {
    return (
      prevProps.active === nextProps.active &&
      prevProps.label === nextProps.label &&
      prevProps.tabKey === nextProps.tabKey
    );
  }
);

// OPTIMIZATION 7: Optimized ItemIcon with lazy loading
const ItemIcon = memo(
  ({ item, selectedItem, onSelect, index }) => {
    const isSelected = item?.key === selectedItem;
    const tooltipId = `${item?.key}-${index}`;

    const handleClick = useCallback(() => {
      onSelect("item", item?.key);
    }, [onSelect, item?.key]);

    return (
      <LazyComponent>
        <div
          className="flex flex-col items-center gap-2 cursor-pointer group max-w-[84px]"
          onClick={handleClick}
          role="button"
          tabIndex={0}
          aria-pressed={isSelected}
        >
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
        </div>
      </LazyComponent>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.item?.key === nextProps.item?.key &&
      prevProps.selectedItem === nextProps.selectedItem
    );
  }
);

// OPTIMIZATION 8: Optimized TraitItem
const TraitItem = memo(
  ({ trait, selectedTrait, onSelect, index }) => {
    const isSelected = trait?.key === selectedTrait;
    const tooltipId = `${trait?.key}-${index}`;

    const handleClick = useCallback(() => {
      onSelect("trait", trait?.key);
    }, [onSelect, trait?.key]);

    return (
      <LazyComponent>
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
      </LazyComponent>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.trait?.key === nextProps.trait?.key &&
      prevProps.selectedTrait === nextProps.selectedTrait
    );
  }
);

// OPTIMIZATION 9: Optimized ForceItem
const ForceItem = memo(
  ({ force, selectedTrait, onSelect, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    const isSelected = force?.key === selectedTrait;
    const tooltipId = `${force?.key}-${index}`;

    const handleClick = useCallback(() => {
      onSelect("force", force?.key);
    }, [onSelect, force?.key]);

    const handleMouseEnter = useCallback(() => setIsHovered(true), []);
    const handleMouseLeave = useCallback(() => setIsHovered(false), []);

    return (
      <LazyComponent>
        <div
          className="flex flex-col items-center gap-2 cursor-pointer group"
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          role="button"
          tabIndex={0}
          aria-pressed={isSelected}
        >
          <ReactTltp variant="force" content={force} id={tooltipId} />
          <div className="relative aspect-square w-full max-w-[96px] transition-transform duration-200 group-hover:scale-105">
            <ForceIcon
              force={force}
              size="xxlarge"
              isHovered={isHovered}
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
      </LazyComponent>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.force?.key === nextProps.force?.key &&
      prevProps.selectedTrait === nextProps.selectedTrait
    );
  }
);

// OPTIMIZATION 10: Optimized SkillTreeItem components
const SkillTreeItem = memo(
  ({ skill, selectedSkillTree, onSelect, index }) => {
    const isSelected = skill?.key === selectedSkillTree;
    const tooltipId = `skill-${skill?.key}-${index}`;

    const handleClick = useCallback(() => {
      onSelect("skillTree", skill?.key);
    }, [onSelect, skill?.key]);

    return (
      <LazyComponent>
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
      </LazyComponent>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.skill?.key === nextProps.skill?.key &&
      prevProps.selectedSkillTree === nextProps.selectedSkillTree
    );
  }
);

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
  },
  (prevProps, nextProps) => {
    return (
      prevProps.skill?.key === nextProps.skill?.key &&
      prevProps.selectedSkillTree === nextProps.selectedSkillTree
    );
  }
);

// OPTIMIZATION 11: Heavily optimized ChampionWithItems
const ChampionWithItems = memo(
  ({ champion, championDetails, itemsMap, forces, tier }) => {
    const championItems = useMemo(() => {
      if (!champion?.items?.length || !itemsMap) return EMPTY_ARRAY;
      return champion.items
        .map((itemKey) => itemsMap.get(itemKey))
        .filter(Boolean)
        .slice(0, 3); // Limit items for performance
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
  },
  (prevProps, nextProps) => {
    return (
      prevProps.champion?.key === nextProps.champion?.key &&
      prevProps.tier === nextProps.tier &&
      JSON.stringify(prevProps.champion?.items) ===
        JSON.stringify(nextProps.champion?.items)
    );
  }
);

// OPTIMIZATION 12: Simplified PlacementBadge
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

// OPTIMIZATION 13: Simplified DeckHeader with pre-computed data
const DeckHeader = memo(
  ({ metaDeck, computedData, augmentDetails }) => {
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

          {/* Desktop: Traits on left side */}
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

        {/* Mobile layout - simplified */}
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

        {/* Desktop layout - simplified */}
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
  },
  (prevProps, nextProps) => {
    return (
      prevProps.metaDeck?.key === nextProps.metaDeck?.key &&
      JSON.stringify(prevProps.computedData) ===
        JSON.stringify(nextProps.computedData) &&
      JSON.stringify(prevProps.augmentDetails) ===
        JSON.stringify(nextProps.augmentDetails)
    );
  }
);

// OPTIMIZATION 14: Highly optimized MetaDeck with proper lazy loading
const MetaDeck = memo(
  ({ metaDeck, index, isClosed, handleIsClosed, gameData }) => {
    const [isChampionsCollapsed, setIsChampionsCollapsed] = useState(true);

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

    // Pre-compute all data once with Maps for O(1) lookups
    const computedData = useMemo(() => {
      if (!metaDeck?.deck) {
        return {
          sortedChampions: EMPTY_ARRAY,
          championsToDisplay: EMPTY_ARRAY,
          augmentDetails: EMPTY_ARRAY,
          forceDetails: EMPTY_ARRAY,
          skillDetails: EMPTY_ARRAY,
          traitDetails: EMPTY_ARRAY,
        };
      }

      const sortedChampions = metaDeck.deck.champions?.length
        ? metaDeck.deck.champions.slice().sort((a, b) => {
            const champA = gameData.championsMap.get(a.key);
            const champB = gameData.championsMap.get(b.key);
            return (champA?.cost || 0) - (champB?.cost || 0);
          })
        : EMPTY_ARRAY;

      let championsToDisplay;
      if (
        isChampionsCollapsed &&
        sortedChampions.length > MOBILE_DISPLAY_LIMIT
      ) {
        const prioritized = [...sortedChampions].sort((a, b) => {
          const champA = gameData.championsMap.get(a.key);
          const champB = gameData.championsMap.get(b.key);

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
        championsToDisplay = prioritized.slice(0, MOBILE_DISPLAY_LIMIT);
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
        : EMPTY_ARRAY;

      const skillDetails = metaDeck.deck.skillTree
        ? metaDeck.deck.skillTree
            .map((skill) => gameData.skillDetailsMap.get(skill))
            .filter(Boolean)
        : EMPTY_ARRAY;

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
        : EMPTY_ARRAY;

      const augmentDetails = metaDeck.deck.augments
        ? metaDeck.deck.augments
            .map((augment) => gameData.augmentsMap.get(augment))
            .filter(Boolean)
        : EMPTY_ARRAY;

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

                        {computedData.sortedChampions.length >
                          MOBILE_DISPLAY_LIMIT && (
                          <div className="flex items-center justify-center mt-1 w-full transition-all duration-300 ease-in-out">
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#ffffff30] to-[#ffffff30] transition-all duration-300"></div>
                            <button
                              onClick={toggleChampionsSection}
                              className="mx-3 w-7 h-7 bg-[#2D2F37] hover:bg-[#3D3F47] text-[#D9A876] rounded-full transition-all duration-300 ease-in-out flex items-center justify-center shadow-md border border-[#ffffff20] flex-shrink-0 hover:scale-110 active:scale-95"
                              title={
                                isChampionsCollapsed
                                  ? `Show all ${computedData.sortedChampions.length} champions`
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
  },
  (prevProps, nextProps) => {
    return (
      prevProps.metaDeck?.key === nextProps.metaDeck?.key &&
      prevProps.isClosed === nextProps.isClosed &&
      prevProps.index === nextProps.index
    );
  }
);

// OPTIMIZATION 15: Main component with simplified state management
const RecentDecksItems = () => {
  const { t } = useTranslation();
  const others = t("others");

  // Simplified state management
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

  const [visibleDecks, setVisibleDecks] = useState(6); // Start with fewer decks
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadingRef = useRef(false);

  // OPTIMIZATION 16: Extract and memoize data once with Maps
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
        championsMap,
        itemsMap,
        traitsMap: traitsMap,
        augmentsMap,
        forceDetailsMap: forcesMap,
        skillDetailsMap: skillTreeMap,
        traitDetailsMap: traitsMap,
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
        forceDetailsMap: new Map(),
        skillDetailsMap: new Map(),
        traitDetailsMap: new Map(),
      };
    }
  }, []);

  const [compsData, setCompsData] = useState(() => gameData.metaDecks);
  const metaDecksRef = useRef(gameData.metaDecks);

  useEffect(() => {
    metaDecksRef.current = gameData.metaDecks;
    setCompsData(gameData.metaDecks);
    setVisibleDecks(6); // Reset visible decks when data changes
  }, [gameData.metaDecks]);

  // OPTIMIZATION 17: Optimized shuffle function
  const shuffle = useCallback((array) => {
    if (!array?.length) return EMPTY_ARRAY;
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }, []);

  // OPTIMIZATION 18: Simplified champion processing
  const processedChampions = useMemo(() => {
    if (!gameData.champions?.length) {
      return { filteredChampions: EMPTY_ARRAY, groupedArray: EMPTY_ARRAY };
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
  }, [gameData.champions, shuffle, filters.selectedChampion]);

  const filteredItems = useMemo(() => {
    return gameData.items?.filter((item) => !item?.isFromItem) || EMPTY_ARRAY;
  }, [gameData.items]);

  // OPTIMIZATION 19: Debounced sort change handler
  const handleFilterChange = useCallback(
    debounce((type, key) => {
      const metaDecks = metaDecksRef.current;
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
            // Sort by trait count (numUnits) - highest first
            newCompsData = [...metaDecks].sort((a, b) => {
              const aTraitCount =
                a.deck?.traits?.find((trait) => trait.key === key)?.numUnits ||
                0;
              const bTraitCount =
                b.deck?.traits?.find((trait) => trait.key === key)?.numUnits ||
                0;
              return bTraitCount - aTraitCount;
            });
            break;
          case "force":
            newFilters.selectedTrait = key;
            // Sort by force count (numUnits) - highest first
            newCompsData = [...metaDecks].sort((a, b) => {
              const aForceCount =
                a.deck?.forces?.find(
                  (force) => force.key.toLowerCase() === key.toLowerCase()
                )?.numUnits || 0;
              const bForceCount =
                b.deck?.forces?.find(
                  (force) => force.key.toLowerCase() === key.toLowerCase()
                )?.numUnits || 0;
              return bForceCount - aForceCount;
            });
            break;
          case "champion":
            newFilters.selectedChampion = key;
            // Sort by champion presence - decks with champion first
            newCompsData = [...metaDecks].sort((a, b) => {
              const aHasChampion =
                a.deck?.champions?.some((champion) => champion.key === key) ||
                false;
              const bHasChampion =
                b.deck?.champions?.some((champion) => champion.key === key) ||
                false;

              if (aHasChampion && !bHasChampion) return -1;
              if (!aHasChampion && bHasChampion) return 1;

              // If both have or both don't have, maintain original order
              return 0;
            });
            break;
          case "item":
            newFilters.selectedItem = key;
            // Sort by item count across all champions - highest first
            newCompsData = [...metaDecks].sort((a, b) => {
              const aItemCount =
                a.deck?.champions?.reduce((count, champion) => {
                  if (!champion.items) return count;
                  return (
                    count + champion.items.filter((item) => item === key).length
                  );
                }, 0) || 0;
              const bItemCount =
                b.deck?.champions?.reduce((count, champion) => {
                  if (!champion.items) return count;
                  return (
                    count + champion.items.filter((item) => item === key).length
                  );
                }, 0) || 0;
              return bItemCount - aItemCount;
            });
            break;
          case "skillTree":
            newFilters.selectedSkillTree = key;
            // Sort by skill presence - decks with skill first
            newCompsData = [...metaDecks].sort((a, b) => {
              const aHasSkill = a.deck?.skillTree?.includes(key) || false;
              const bHasSkill = b.deck?.skillTree?.includes(key) || false;

              if (aHasSkill && !bHasSkill) return -1;
              if (!aHasSkill && bHasSkill) return 1;

              // If both have or both don't have, maintain original order
              return 0;
            });
            break;
          default:
            return;
        }

        setFilters(newFilters);
        setCompsData(newCompsData);
        setVisibleDecks(6); // Reset visible decks on filter change
      });
    }, 150),
    [filters]
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

  // OPTIMIZATION 20: Simplified skills grouping
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

  useEffect(() => {
    const variants = Object.keys(skillsByVariant);
    if (variants.length > 0 && !ui.activeSkillsSubTab) {
      setUi((prev) => ({ ...prev, activeSkillsSubTab: variants[0] }));
    }
  }, [skillsByVariant, ui.activeSkillsSubTab]);

  // OPTIMIZATION 21: Infinite scroll for mobile performance
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

  // OPTIMIZATION 22: Memoized tab content
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

  // OPTIMIZATION 23: Visible decks with proper slicing
  const visibleCompsData = useMemo(() => {
    return compsData.slice(0, visibleDecks);
  }, [compsData, visibleDecks]);

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

        {/* Results Section with infinite scroll */}
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

                {/* Manual load button as fallback */}
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

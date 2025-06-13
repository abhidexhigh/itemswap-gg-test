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
import { PiEye, PiEyeClosed } from "react-icons/pi";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import Comps from "../../../../data/compsNew.json";
import ReactTltp from "src/components/tooltip/ReactTltp";
import CardImage from "src/components/cardImage";
import { OptimizedImage } from "src/utils/imageOptimizer";
import ForceIcon from "src/components/forceIcon";
import TraitImage from "src/components/TraitImage/TraitImage";
import SkillTreeImage from "src/components/SkillTreeImage";

// OPTIMIZATION 1: Move filter cache outside component to persist across renders
const filterCache = new Map();

// OPTIMIZATION 2: Add debounce utility
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

// OPTIMIZATION 3: Add viewport detection for lazy loading
const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIntersecting] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIntersecting(entry.isIntersecting);
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [options]);

  return [ref, isIntersecting];
};

// OPTIMIZATION 4: Mobile-first infinite scroll with comprehensive detection
const useInfiniteScroll = (callback, hasMore) => {
  const [isMobile, setIsMobile] = useState(false);
  const scrollTimeoutRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.innerWidth <= 768 ||
          /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          )
      );
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!hasMore) return;

      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(
        () => {
          // Multiple methods to get scroll position for mobile compatibility
          const scrollTop = Math.max(
            window.pageYOffset,
            document.documentElement.scrollTop,
            document.body.scrollTop
          );

          const windowHeight =
            window.innerHeight || document.documentElement.clientHeight;
          const documentHeight = Math.max(
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight,
            document.body.scrollHeight,
            document.body.offsetHeight
          );

          // Very aggressive trigger for mobile - 300px from bottom
          const triggerDistance = isMobile ? 300 : 800;
          const distanceFromBottom =
            documentHeight - (scrollTop + windowHeight);

          console.log("Scroll Debug:", {
            isMobile,
            scrollTop,
            windowHeight,
            documentHeight,
            distanceFromBottom,
            triggerDistance,
            shouldTrigger: distanceFromBottom <= triggerDistance,
          });

          if (distanceFromBottom <= triggerDistance) {
            callback();
          }
        },
        isMobile ? 50 : 100
      ); // Very fast response on mobile
    };

    // Add multiple event listeners for maximum mobile compatibility
    const events = ["scroll", "touchmove", "touchend"];
    const options = { passive: true };

    events.forEach((event) => {
      window.addEventListener(event, handleScroll, options);
      document.addEventListener(event, handleScroll, options);
    });

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, handleScroll, options);
        document.removeEventListener(event, handleScroll, options);
      });
    };
  }, [callback, hasMore, isMobile]);
};

// OPTIMIZATION 5: Memoized Tab Button with better comparison
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

// OPTIMIZATION 6: Lazy loading wrapper
const LazyComponent = memo(({ children, threshold = 0.1 }) => {
  const [ref, isVisible] = useIntersectionObserver({ threshold });

  return (
    <div ref={ref}>
      {isVisible ? children : <div style={{ height: "120px" }} />}
    </div>
  );
});

// OPTIMIZATION 7: Optimized TraitItem with better memoization
const TraitItem = memo(
  ({ trait, selectedTrait, onSelect, i }) => {
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
            id={`${trait?.key}-${i}`}
          />
          <div className="relative aspect-square w-full max-w-[96px] transition-transform duration-200 group-hover:scale-105">
            <TraitImage
              trait={trait}
              size="xlarge"
              className="w-full h-full rounded-lg"
              data-tooltip-id={`${trait?.key}-${i}`}
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
      prevProps.selectedTrait === nextProps.selectedTrait &&
      prevProps.i === nextProps.i
    );
  }
);

// OPTIMIZATION 8: Optimized ForceItem
const ForceItem = memo(
  ({ force, selectedTrait, onSelect, i }) => {
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
            id={`${force?.key}-${i}`}
          />
          <div className="relative aspect-square w-full max-w-[96px] transition-transform duration-200 group-hover:scale-105">
            <ForceIcon
              force={force}
              size="xxlarge"
              isHovered={isHovered}
              className="w-full h-full object-cover rounded-lg"
              data-tooltip-id={`${force?.key}-${i}`}
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
      prevProps.selectedTrait === nextProps.selectedTrait &&
      prevProps.i === nextProps.i
    );
  }
);

// OPTIMIZATION 9: Optimized SkillTreeItem with proper mobile rendering
const SkillTreeItem = memo(
  ({ skill, selectedSkillTree, onSelect, i }) => {
    const handleClick = useCallback(() => {
      onSelect("skillTree", skill?.key);
    }, [onSelect, skill?.key]);

    const isSelected = skill?.key === selectedSkillTree;

    return (
      <LazyComponent>
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
      prevProps.selectedSkillTree === nextProps.selectedSkillTree &&
      prevProps.i === nextProps.i
    );
  }
);

// OPTIMIZATION: Mobile optimized SkillTreeItem for filters
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
            size="small"
            tooltipId={`mobile-skill-${skill?.key}-${i}`}
            className="w-full h-full rounded-lg"
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
      prevProps.selectedSkillTree === nextProps.selectedSkillTree &&
      prevProps.i === nextProps.i
    );
  }
);

// OPTIMIZATION 10: Optimized ItemIcon
const ItemIcon = memo(
  ({ item, selectedItem, onSelect, i }) => {
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
          <ReactTltp variant="item" content={item} id={`${item?.key}-${i}`} />
          <div className="relative aspect-square w-full transition-transform duration-200 group-hover:scale-110">
            <OptimizedImage
              alt={item?.name}
              width={84}
              height={84}
              src={item?.imageUrl}
              className="w-full h-full object-contain rounded-lg !border !border-[#ffffff20]"
              data-tooltip-id={`${item?.key}-${i}`}
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
  },
  (prevProps, nextProps) => {
    return (
      prevProps.item?.key === nextProps.item?.key &&
      prevProps.selectedItem === nextProps.selectedItem &&
      prevProps.i === nextProps.i
    );
  }
);

// OPTIMIZATION 11: Optimized ChampionWithItems
const ChampionWithItems = memo(
  ({ champion, champions, items, forces, tier }) => {
    const championDetails = useMemo(() => {
      return champions?.find((c) => c.key === champion?.key);
    }, [champions, champion?.key]);

    const championItems = useMemo(() => {
      if (!champion?.items || !items) return [];
      return champion.items
        .map((item) => items.find((i) => i.key === item))
        .filter(Boolean);
    }, [champion?.items, items]);

    if (!championDetails) return null;

    return (
      <LazyComponent>
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
            {championItems.slice(0, 3).map(
              (
                itemDetails,
                idx // Limit items shown
              ) => (
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
                  />
                </div>
              )
            )}
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

// OPTIMIZATION 12: Simplified and optimized AugmentIcon
const AugmentIcon = memo(
  ({ augment, augments }) => {
    const augmentDetails = useMemo(() => {
      return augments?.find((a) => a.key === augment);
    }, [augments, augment]);

    if (!augmentDetails) return null;

    return (
      <div className="flex justify-center items-center relative">
        <OptimizedImage
          alt={augmentDetails.name || "Augment"}
          width={50}
          height={50}
          src={augmentDetails.imageUrl}
          className="w-full h-full"
          data-tooltip-id={augment}
          loading="lazy"
        />
        <ReactTltp variant="augment" content={augmentDetails} id={augment} />
      </div>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.augment === nextProps.augment;
  }
);

// OPTIMIZATION 13: Simplified SkillTreeIcon
const SkillTreeIcon = memo(
  ({ skillTree, skills, size = "default" }) => {
    const skillDetails = useMemo(() => {
      return skills?.find((s) => s.key === skillTree);
    }, [skills, skillTree]);

    if (!skillDetails) return null;

    return (
      <SkillTreeImage
        skill={skillDetails}
        size={size}
        tooltipId={skillTree}
        loading="lazy"
      />
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.skillTree === nextProps.skillTree &&
      prevProps.size === nextProps.size
    );
  }
);

// OPTIMIZATION 14: Optimized DeckHeader with reduced re-renders
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

    // Memoize expensive calculations
    const forceDetails = useMemo(() => {
      if (!metaDeck?.deck?.forces || !forces) return [];
      return metaDeck.deck.forces
        .map((force) => ({
          ...force,
          details: forces.find(
            (t) => t.key.toLowerCase() === force?.key.toLowerCase()
          ),
        }))
        .filter((force) => force.details);
    }, [metaDeck?.deck?.forces, forces]);

    const skillDetails = useMemo(() => {
      if (!metaDeck?.deck?.skillTree || !skills) return [];
      return metaDeck.deck.skillTree
        .map((skill) => skills.find((s) => s.key === skill))
        .filter(Boolean);
    }, [metaDeck?.deck?.skillTree, skills]);

    const traitDetails = useMemo(() => {
      if (!metaDeck?.deck?.traits || !traits) return [];
      return metaDeck.deck.traits
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
        .filter(Boolean);
    }, [metaDeck?.deck?.traits, traits]);

    const handleMouseEnter = useCallback((forceKey) => {
      setHoveredForce(forceKey);
    }, []);

    const handleMouseLeave = useCallback(() => {
      setHoveredForce(null);
    }, []);

    return (
      <header className="relative flex flex-col md:flex-col justify-between items-start md:items-end py-[10px] pl-3 md:pl-4 pr-3 md:pr-[36px] lg:min-h-[50px] lg:flex-row lg:items-center lg:py-[5px] lg:pr-[16px]">
        <div className="inline-flex flex-col flex-wrap gap-[8px] w-full md:w-auto md:flex-row md:items-center md:gap-[4px]">
          <strong className="text-[26px] font-semibold leading-none text-[#F2A03D] text-center md:text-left">
            {metaDeck?.name}
          </strong>
          {/* Desktop: Traits on left side */}
          <div className="hidden md:flex items-center gap-1 ml-4">
            {traitDetails.slice(0, 5).map(
              (
                trait,
                index // Limit traits shown
              ) => (
                <div key={`${trait.key}-${index}`} className="relative">
                  <TraitImage
                    trait={trait}
                    size="default"
                    className="w-[38px] h-[38px] md:w-[36px] md:h-[36px]"
                    data-tooltip-id={`${trait.key}-${index}`}
                    loading="lazy"
                  />
                  <ReactTltp
                    variant="trait"
                    id={`${trait.key}-${index}`}
                    content={trait}
                  />
                </div>
              )
            )}
          </div>
        </div>

        {/* Optimized mobile layout */}
        <div className="flex md:hidden flex-col gap-y-3 mt-2 w-full items-center">
          <div className="flex items-center gap-x-2 w-fit overflow-hidden !border !border-[#ffffff40] rounded-lg p-1">
            {forceDetails.slice(0, 4).map(
              (
                force,
                index // Limit forces shown
              ) => (
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
                    loading="lazy"
                  />
                  <ReactTltp
                    content={force?.key}
                    id={`${force?.key}-${index}`}
                  />
                </div>
              )
            )}
            {forceDetails.length > 0 && skillDetails.length > 0 && (
              <div className="flex-shrink-0 h-8 w-px bg-[#ffffff30] mx-1"></div>
            )}
            {skillDetails.slice(0, 3).map(
              (
                skill,
                index // Limit skills shown
              ) => (
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
              )
            )}
          </div>

          {/* Optimized traits and augments row */}
          <div className="flex items-center gap-x-1 w-fit overflow-x-auto scrollbar-hide">
            {traitDetails.slice(0, 6).map(
              (
                trait,
                index // Limit traits shown
              ) => (
                <div key={`${trait.key}-${index}`} className="flex-shrink-0">
                  <TraitImage
                    trait={trait}
                    size="small"
                    className="!w-[34px] !h-[34px]"
                    data-tooltip-id={`${trait.key}-${index}`}
                    loading="lazy"
                  />
                  <ReactTltp
                    variant="trait"
                    id={`${trait.key}-${index}`}
                    content={trait}
                  />
                </div>
              )
            )}
            {traitDetails.length > 0 && augmentDetails.length > 0 && (
              <div className="flex-shrink-0 h-8 w-px bg-[#ffffff30] mx-2"></div>
            )}
            {augmentDetails.slice(0, 4).map(
              (
                augment,
                index // Limit augments shown
              ) => (
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
                    loading="lazy"
                  />
                  <ReactTltp
                    variant="augment"
                    content={augment}
                    id={`augment-${augment.key}-${index}`}
                  />
                </div>
              )
            )}
          </div>
        </div>

        {/* Desktop layout - also optimized */}
        <div className="hidden md:inline-flex flex-shrink-0 justify-between gap-1 !gap-x-6 md:mt-1">
          <div className="flex flex-wrap gap-1 md:gap-0 md:inline-flex md:flex-wrap justify-start md:justify-end items-center md:mr-0">
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
                  loading="lazy"
                />
                <ReactTltp content={force?.key} id={`${force?.key}-${index}`} />
                <span className="text-[18px]">{force?.numUnits}</span>
              </div>
            ))}
            {forceDetails.length > 0 && skillDetails.length > 0 && (
              <div className="flex items-center mx-2">
                <div className="h-12 w-px bg-[#ffffff30]"></div>
              </div>
            )}
            {skillDetails.map((skill, index) => (
              <SkillTreeIcon
                key={`${skill.key}-${index}`}
                skillTree={skill.key}
                skills={skills}
                size="medium"
              />
            ))}
            {skillDetails.length > 0 && augmentDetails.length > 0 && (
              <div className="flex items-center mx-2">
                <div className="h-12 w-px bg-[#ffffff30]"></div>
              </div>
            )}
            {augmentDetails.map((augment, index) => (
              <div key={`augment-${augment.key}-${index}`} className="relative">
                <OptimizedImage
                  alt={augment.name || "Augment"}
                  width={48}
                  height={48}
                  src={augment.imageUrl}
                  className="w-[38px] h-[38px] md:w-[36px] md:h-[36px] mx-0.5 rounded-md"
                  data-tooltip-id={`augment-${augment.key}-${index}`}
                  loading="lazy"
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
  },
  (prevProps, nextProps) => {
    return (
      prevProps.metaDeck?.name === nextProps.metaDeck?.name &&
      prevProps.isClosed === nextProps.isClosed &&
      prevProps.i === nextProps.i &&
      JSON.stringify(prevProps.metaDeck?.deck?.forces) ===
        JSON.stringify(nextProps.metaDeck?.deck?.forces) &&
      JSON.stringify(prevProps.metaDeck?.deck?.traits) ===
        JSON.stringify(nextProps.metaDeck?.deck?.traits) &&
      JSON.stringify(prevProps.metaDeck?.deck?.skillTree) ===
        JSON.stringify(nextProps.metaDeck?.deck?.skillTree)
    );
  }
);

// OPTIMIZATION 15: Heavily optimized MetaDeck with pagination
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
    others,
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

    // Memoize sorted champions
    const sortedChampions = useMemo(() => {
      if (!metaDeck?.deck?.champions || !champions) return [];
      return metaDeck.deck.champions.slice().sort((a, b) => {
        const champA = champions.find((c) => c.key === a.key);
        const champB = champions.find((c) => c.key === b.key);
        return (champA?.cost || 0) - (champB?.cost || 0);
      });
    }, [metaDeck?.deck?.champions, champions]);

    // Optimized champions display logic with proper prioritization
    const championsToDisplay = useMemo(() => {
      if (!sortedChampions.length) return [];

      if (isChampionsCollapsed) {
        // Priority-based sorting for collapsed view
        const prioritizedChampions = [...sortedChampions].sort((a, b) => {
          const champA = champions.find((c) => c.key === a.key);
          const champB = champions.find((c) => c.key === b.key);

          // Priority 1: Tier 4 or higher (highest priority)
          const isATier4Plus = (a?.tier || 0) >= 4;
          const isBTier4Plus = (b?.tier || 0) >= 4;
          if (isATier4Plus && !isBTier4Plus) return -1;
          if (!isATier4Plus && isBTier4Plus) return 1;

          // Priority 2: Higher cost (if both are same tier level)
          if (isATier4Plus === isBTier4Plus) {
            const costDiff = (champB?.cost || 0) - (champA?.cost || 0);
            if (costDiff !== 0) return costDiff;
          }

          // Priority 3: Has items (if same tier and cost)
          const aHasItems = a.items && a.items.length > 0;
          const bHasItems = b.items && b.items.length > 0;
          if (aHasItems && !bHasItems) return -1;
          if (!aHasItems && bHasItems) return 1;

          return 0;
        });

        return prioritizedChampions.slice(0, 4);
      }

      return sortedChampions;
    }, [sortedChampions, isChampionsCollapsed, champions]);

    const hasMoreChampions =
      sortedChampions.length > championsToDisplay.length &&
      isChampionsCollapsed;

    const augmentDetails = useMemo(() => {
      if (!metaDeck?.deck?.augments || !augments) return [];
      return metaDeck.deck.augments
        .map((augment) => augments.find((a) => a.key === augment))
        .filter(Boolean);
    }, [metaDeck?.deck?.augments, augments]);

    return (
      <div
        key={i}
        className="flex flex-col gap-[1px] bg-gradient-to-r from-[#5f5525] to-[#6D4600] p-[1px] rounded-lg overflow-hidden shadow-lg mb-4 md:!mb-10"
      >
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
          <div className="flex items-center justify-center mt-1 w-full transition-all duration-300 ease-in-out">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#ffffff30] to-[#ffffff30] transition-all duration-300"></div>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#ffffff30] to-[#ffffff30] transition-all duration-300"></div>
          </div>
          {!isClosed[i] && (
            <div className="flex flex-col bg-center bg-no-repeat mt-[-1px]">
              <div className="flex min-h-[150px] flex-col justify-between items-center bg-[#111111] lg:flex-row lg:gap-[15px] lg:py-[0px] xl:px-6 rounded-b-lg">
                <div className="-mb-[8px] max-w-[342px] lg:mb-0 lg:w-full lg:max-w-[87%] lg:flex-shrink-0">
                  <div className="flex flex-col">
                    <div className="flex flex-wrap justify-center my-1 lg:justify-center gap-2 w-full">
                      {/* Mobile view: Collapsible champions */}
                      <div className="lg:hidden">
                        <div className="flex flex-wrap justify-center gap-2 w-full">
                          {/* Show champions based on collapse state */}
                          {championsToDisplay.map((champion, index) => (
                            <div
                              key={`${isChampionsCollapsed ? "collapsed" : "expanded"}-${champion.key}-${index}`}
                              className={`transition-all duration-500 ease-in-out ${
                                !isChampionsCollapsed
                                  ? "opacity-100 transform scale-100 translate-y-0"
                                  : ""
                              }`}
                              style={{
                                transitionDelay: !isChampionsCollapsed
                                  ? `${index * 30}ms`
                                  : "0ms",
                              }}
                            >
                              <ChampionWithItems
                                champion={champion}
                                champions={champions}
                                items={items}
                                forces={forces}
                                tier={champion.tier}
                              />
                            </div>
                          ))}
                        </div>

                        {/* Toggle button for mobile - only show if there are more than 4 champions */}
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
                        {sortedChampions.map((champion, index) => (
                          <ChampionWithItems
                            key={`desktop-${champion.key}-${index}`}
                            champion={champion}
                            champions={champions}
                            items={items}
                            forces={forces}
                            tier={champion.tier}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats sections - simplified and optimized */}
                <div className="md:hidden flex text-center w-full h-full justify-between pb-1 px-[16px] sm:px-[18px]">
                  <dl className="flex flex-col justify-between">
                    <dt className="text-[12px] font-medium leading-5 text-[#999]">
                      {others?.top4}
                    </dt>
                    <dd className="text-base font-medium leading-4 text-[#D9A876]">
                      <span>65.3%</span>
                    </dd>
                  </dl>
                  <dl className="flex flex-col justify-between">
                    <dt className="text-[12px] font-medium leading-5 text-[#999]">
                      {others?.winPercentage}
                    </dt>
                    <dd className="text-base font-medium leading-4 text-[#D9A876]">
                      <span>26.6%</span>
                    </dd>
                  </dl>
                  <dl className="flex flex-col justify-between">
                    <dt className="text-[12px] font-medium leading-5 text-[#999]">
                      {others?.pickPercentage}
                    </dt>
                    <dd className="text-base font-medium leading-4 text-[#D9A876]">
                      <span>0.39%</span>
                    </dd>
                  </dl>
                  <dl className="flex flex-col justify-between">
                    <dt className="text-[12px] font-medium leading-5 text-[#999]">
                      {others?.avgPlacement}
                    </dt>
                    <dd className="text-base font-medium leading-4 text-[#D9A876]">
                      <span>4.52</span>
                    </dd>
                  </dl>
                </div>

                {/* Desktop stats */}
                <div className="md:flex flex-col hidden">
                  <div className="flex w-full flex-col gap-y-4 h-full justify-between rounded-[4px] bg-[#1D1D1D] pt-[10px] pb-1 px-[16px] sm:px-[18px]">
                    <dl className="flex justify-between gap-x-6">
                      <dt className="text-[11px] md:text-[14px] font-medium leading-5 text-[#999]">
                        {others?.top4}
                      </dt>
                      <dd className="text-[11px] md:text-[14px] font-medium leading-5 text-[#D9A876]">
                        <span>65.3%</span>
                      </dd>
                    </dl>
                    <dl className="flex justify-between gap-x-6">
                      <dt className="text-[11px] md:text-[14px] font-medium leading-5 text-[#999]">
                        {others?.winPercentage}
                      </dt>
                      <dd className="text-[11px] md:text-[14px] font-medium leading-5 text-[#D9A876]">
                        <span>26.6%</span>
                      </dd>
                    </dl>
                    <dl className="flex justify-between gap-x-6">
                      <dt className="text-[11px] md:text-[14px] font-medium leading-5 text-[#999]">
                        {others?.pickPercentage}
                      </dt>
                      <dd className="text-[11px] md:text-[14px] font-medium leading-5 text-[#D9A876]">
                        <span>0.39%</span>
                      </dd>
                    </dl>
                    <dl className="flex justify-between gap-x-6">
                      <dt className="text-[11px] md:text-[14px] font-medium leading-5 text-[#999]">
                        {others?.avgPlacement}
                      </dt>
                      <dd className="text-[11px] md:text-[14px] font-medium leading-5 text-[#D9A876]">
                        <span>4.52</span>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.metaDeck?.name === nextProps.metaDeck?.name &&
      prevProps.isClosed === nextProps.isClosed &&
      prevProps.i === nextProps.i &&
      JSON.stringify(prevProps.metaDeck?.deck?.champions) ===
        JSON.stringify(nextProps.metaDeck?.deck?.champions)
    );
  }
);

// OPTIMIZATION 16: Main component optimizations
const MetaTrendsItems = () => {
  const { t } = useTranslation();
  const others = t("others");

  // State management optimizations
  const [selectedChampion, setSelectedChampion] = useState(null);
  const [selectedTrait, setSelectedTrait] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedSkillTree, setSelectedSkillTree] = useState(null);
  const [isClosed, setIsClosed] = useState({});
  const [activeTab, setActiveTab] = useState("Champions");
  const [activeTraitsSubTab, setActiveTraitsSubTab] = useState("Origin");
  const [activeSkillsSubTab, setActiveSkillsSubTab] = useState(null);

  // OPTIMIZATION 17: Memoize data extraction to prevent recalculation
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

      return {
        metaDecks: data?.metaDeckList?.metaDecks || [],
        champions: data?.refs?.champions || [],
        items: data?.refs?.items || [],
        traits: data?.refs?.traits || [],
        augments: data?.refs?.augments || [],
        forces: data?.refs?.forces || [],
        skillTree: data?.refs?.skillTree || [],
      };
    } catch (error) {
      console.error("Error extracting data:", error);
      return {
        metaDecks: [],
        champions: [],
        items: [],
        traits: [],
        augments: [],
        forces: [],
        skillTree: [],
      };
    }
  }, []);

  const { metaDecks, champions, items, traits, augments, forces, skillTree } =
    gameData;

  const [compsData, setCompsData] = useState(() => metaDecks);

  const metaDecksRef = useRef(metaDecks);
  useEffect(() => {
    metaDecksRef.current = metaDecks;
    setCompsData(metaDecks);
  }, [metaDecks]);

  // OPTIMIZATION 18: Proper shuffle function (not debounced)
  const shuffle = useCallback((array) => {
    if (!array || !array.length) return [];

    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }, []);

  // OPTIMIZATION 19: Fixed champion filtering logic to match original source code
  const { filteredChampions, groupedArray } = useMemo(() => {
    if (!champions || !champions.length) {
      return { filteredChampions: [], groupedArray: [] };
    }

    // Original logic: Group champions by type, then shuffle and take 2 from each type
    const championsByType = new Map();
    champions.forEach((champion) => {
      if (!champion.type) return;

      if (!championsByType.has(champion.type)) {
        championsByType.set(champion.type, []);
      }
      championsByType.get(champion.type).push(champion);
    });

    const filtered = [];
    for (const [_, group] of championsByType) {
      // Shuffle each group and take 2 champions from each type
      const selected = shuffle([...group]).slice(0, 2);
      filtered.push(...selected);
    }

    // Group the filtered champions by cost
    const groupedByCost = new Map();
    filtered.forEach((champion) => {
      const { cost } = champion;
      if (!groupedByCost.has(cost)) {
        groupedByCost.set(cost, []);
      }
      groupedByCost.get(cost).push({
        ...champion,
        selected: false,
      });
    });

    return {
      filteredChampions: filtered,
      groupedArray: Array.from(groupedByCost.entries())
        .sort(([costA], [costB]) => costA - costB)
        .map(([cost, champions]) => champions),
    };
  }, [champions, shuffle]);

  const championsWithSelection = useMemo(() => {
    if (!groupedArray.length) return groupedArray;

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

  // OPTIMIZATION 20: Debounced filter handler
  const handleFilterChange = useCallback(
    debounce((type, key) => {
      const metaDecks = metaDecksRef.current;
      if (!metaDecks?.length) return;

      let newCompsData;
      const cacheKey = `${type}:${key}`;

      const filterLogic = {
        trait: () => {
          if (selectedTrait === key) {
            setSelectedTrait(null);
            return metaDecks;
          } else {
            setSelectedTrait(key);
            if (filterCache.has(cacheKey)) {
              return filterCache.get(cacheKey);
            }
            const filtered = metaDecks.filter((deck) =>
              deck.deck.traits.some((trait) => trait.key === key)
            );
            filterCache.set(cacheKey, filtered);
            return filtered;
          }
        },
        force: () => {
          if (selectedTrait === key) {
            setSelectedTrait(null);
            return metaDecks;
          } else {
            setSelectedTrait(key);
            if (filterCache.has(cacheKey)) {
              return filterCache.get(cacheKey);
            }
            const filtered = metaDecks.filter((deck) =>
              deck.deck.forces.some(
                (force) => force.key.toLowerCase() === key.toLowerCase()
              )
            );
            filterCache.set(cacheKey, filtered);
            return filtered;
          }
        },
        champion: () => {
          if (selectedChampion === key) {
            setSelectedChampion(null);
            return metaDecks;
          } else {
            setSelectedChampion(key);
            if (filterCache.has(cacheKey)) {
              return filterCache.get(cacheKey);
            }
            const filtered = metaDecks.filter((deck) =>
              deck.deck.champions.some((champion) => champion.key === key)
            );
            filterCache.set(cacheKey, filtered);
            return filtered;
          }
        },
        item: () => {
          if (selectedItem === key) {
            setSelectedItem(null);
            return metaDecks;
          } else {
            setSelectedItem(key);
            if (filterCache.has(cacheKey)) {
              return filterCache.get(cacheKey);
            }
            const filtered = metaDecks.filter((deck) =>
              deck.deck.champions.some(
                (champion) =>
                  champion.items && champion.items.some((item) => item === key)
              )
            );
            filterCache.set(cacheKey, filtered);
            return filtered;
          }
        },
        skillTree: () => {
          if (selectedSkillTree === key) {
            setSelectedSkillTree(null);
            return metaDecks;
          } else {
            setSelectedSkillTree(key);
            if (filterCache.has(cacheKey)) {
              return filterCache.get(cacheKey);
            }
            const filtered = metaDecks.filter((deck) =>
              deck.deck?.skillTree?.includes(key)
            );
            filterCache.set(cacheKey, filtered);
            return filtered;
          }
        },
      };

      newCompsData = filterLogic[type]?.() || metaDecks;

      // Reset other selections
      if (type === "trait" || type === "force") {
        setSelectedChampion(null);
        setSelectedItem(null);
        setSelectedSkillTree(null);
      } else if (type === "champion") {
        setSelectedTrait(null);
        setSelectedItem(null);
        setSelectedSkillTree(null);
      } else if (type === "item") {
        setSelectedChampion(null);
        setSelectedTrait(null);
        setSelectedSkillTree(null);
      } else if (type === "skillTree") {
        setSelectedChampion(null);
        setSelectedTrait(null);
        setSelectedItem(null);
      }

      setCompsData(newCompsData);
    }, 150),
    [selectedChampion, selectedItem, selectedTrait, selectedSkillTree]
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

  // OPTIMIZATION 21: Simplified skills grouping
  const skillsByVariant = useMemo(() => {
    if (!skillTree || skillTree.length === 0) return {};

    const grouped = { General: [] };
    const validSkills = skillTree.filter((skill) => skill?.imageUrl);

    validSkills.forEach((skill) => {
      // Simplified categorization
      let variant = "General";

      if (skill.category) {
        variant = skill.category;
      } else if (skill.type) {
        variant = skill.type;
      }

      if (!grouped[variant]) {
        grouped[variant] = [];
      }
      grouped[variant].push(skill);
    });

    return grouped;
  }, [skillTree]);

  // Initialize skills sub-tab
  useEffect(() => {
    if (Object.keys(skillsByVariant).length > 0 && !activeSkillsSubTab) {
      const firstVariant = Object.keys(skillsByVariant)[0];
      setActiveSkillsSubTab(firstVariant);
    }
  }, [skillsByVariant, activeSkillsSubTab]);

  // OPTIMIZATION 22: Remove auto-scroll as it can cause performance issues
  // useEffect removed for auto-scroll

  // OPTIMIZATION 23: Optimized tab content with reduced renders
  const handleTabContent = useMemo(() => {
    const tabComponents = {
      Champions: () => (
        <MetaTrendsCard
          itemCount={13}
          championsByCost={championsWithSelection}
          setSelectedChampion={(key) => handleFilterChange("champion", key)}
          selectedChampion={selectedChampion}
          forces={forces}
        />
      ),
      Traits: () => (
        <div className="p-3 md:p-6 bg-[#111111] rounded-lg mt-2">
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

          {/* Mobile View */}
          <div className="lg:hidden">
            {activeTraitsSubTab === "Origin" && (
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 w-full max-h-[300px] overflow-y-auto">
                {traits?.map((trait, i) => (
                  <div
                    key={`trait-${trait.key}-${i}`}
                    className="w-full max-w-[70px] sm:max-w-[80px]"
                  >
                    <TraitItem
                      trait={trait}
                      selectedTrait={selectedTrait}
                      onSelect={handleFilterChange}
                      i={i}
                    />
                  </div>
                ))}
              </div>
            )}

            {activeTraitsSubTab === "Forces" && (
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 w-full max-h-[300px] overflow-y-auto">
                {forces?.map((force, i) => (
                  <div
                    key={`force-${force.key}-${i}`}
                    className="w-full max-w-[70px] sm:max-w-[80px]"
                  >
                    <ForceItem
                      force={force}
                      selectedTrait={selectedTrait}
                      onSelect={handleFilterChange}
                      i={i}
                    />
                  </div>
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
                {traits?.map(
                  (
                    trait,
                    i // Show all traits on desktop
                  ) => (
                    <TraitItem
                      key={`trait-${trait.key}-${i}`}
                      trait={trait}
                      selectedTrait={selectedTrait}
                      onSelect={handleFilterChange}
                      i={i}
                    />
                  )
                )}
              </div>
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-4">
              <div className="p-1 rounded-lg text-[#D9A876] font-semibold text-center min-w-[100px]">
                {others?.forces}
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 w-full">
                {forces?.map(
                  (
                    force,
                    i // Show all forces on desktop
                  ) => (
                    <ForceItem
                      key={`force-${force.key}-${i}`}
                      force={force}
                      selectedTrait={selectedTrait}
                      onSelect={handleFilterChange}
                      i={i}
                    />
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      ),
      Items: () => (
        <div className="p-3 md:p-6 bg-[#111111] rounded-lg mt-2 max-h-[300px] md:max-h-full overflow-y-auto">
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-6 lg:grid-cols-8 xl:!flex justify-center xl:!flex-wrap gap-1 lg:gap-4">
            {filteredItems.map(
              (
                item,
                i // Show all items
              ) => (
                <div
                  key={`item-${item.key}-${i}`}
                  className="w-full max-w-[50px] sm:max-w-[60px] md:max-w-[84px]"
                >
                  <ItemIcon
                    item={item}
                    selectedItem={selectedItem}
                    onSelect={handleFilterChange}
                    i={i}
                  />
                </div>
              )
            )}
          </div>
        </div>
      ),
      SkillTree: () => (
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
                      onClick={() => handleSkillsSubTabChange(variant)}
                    >
                      {variant}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mobile View */}
          <div className="lg:hidden">
            {activeSkillsSubTab && skillsByVariant[activeSkillsSubTab] && (
              <div className="flex flex-wrap justify-center gap-2 w-full max-h-[300px] overflow-y-auto px-2">
                {skillsByVariant[activeSkillsSubTab].map(
                  (
                    skill,
                    i // Show all skills in mobile
                  ) => (
                    <MobileSkillTreeItem
                      key={`mobile-skill-${skill.key}-${i}`}
                      skill={skill}
                      selectedSkillTree={selectedSkillTree}
                      onSelect={handleFilterChange}
                      i={i}
                    />
                  )
                )}
              </div>
            )}
          </div>

          {/* Desktop View */}
          <div className="hidden lg:block">
            <div className="flex flex-wrap justify-center gap-3 w-full">
              {skillTree
                ?.filter((skill) => skill?.imageUrl)
                ?.map(
                  (
                    skill,
                    i // Show all skills on desktop
                  ) => (
                    <SkillTreeItem
                      key={`desktop-skill-${skill.key}-${i}`}
                      skill={skill}
                      selectedSkillTree={selectedSkillTree}
                      onSelect={handleFilterChange}
                      i={i}
                    />
                  )
                )}
            </div>
          </div>
        </div>
      ),
    };

    return tabComponents[activeTab]?.() || null;
  }, [
    activeTab,
    activeTraitsSubTab,
    activeSkillsSubTab,
    skillsByVariant,
    championsWithSelection,
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
    selectedChampion,
    others,
  ]);

  const deckProps = useMemo(() => {
    return {
      champions,
      items,
      traits,
      forces,
      augments,
      others,
      skills: skillTree,
    };
  }, [champions, items, traits, forces, augments, skillTree, others]);

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
        onClick={() => handleTabChange(tab.key)}
      />
    ));
  }, [activeTab, handleTabChange, others]);

  // OPTIMIZATION 24: Simplified and more reliable auto-loading
  const [visibleDecks, setVisibleDecks] = useState(3); // Start with fewer decks for testing
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadingRef = useRef(false);
  const lastLoadTime = useRef(0);

  const loadMoreDecks = useCallback(() => {
    const now = Date.now();

    // Prevent rapid multiple calls (debounce at callback level)
    if (loadingRef.current || now - lastLoadTime.current < 500) {
      console.log("Blocked duplicate load call");
      return;
    }

    if (!hasMoreDecks) {
      console.log("No more decks to load");
      return;
    }

    console.log("Loading more decks...", {
      current: visibleDecks,
      total: compsData.length,
    });

    loadingRef.current = true;
    lastLoadTime.current = now;
    setIsLoadingMore(true);

    // Immediate update for better mobile experience
    setTimeout(() => {
      setVisibleDecks((prev) => {
        const newCount = Math.min(prev + 2, compsData.length); // Load 2 at a time
        console.log("Updated visible decks:", newCount);
        return newCount;
      });
      setIsLoadingMore(false);
      loadingRef.current = false;
    }, 100);
  }, [compsData.length, visibleDecks]);

  const hasMoreDecks = visibleDecks < compsData.length;

  // Use infinite scroll hook
  useInfiniteScroll(loadMoreDecks, hasMoreDecks);

  // Reset when data changes
  useEffect(() => {
    console.log("Data changed, resetting visible decks");
    setVisibleDecks(3);
    loadingRef.current = false;
    lastLoadTime.current = 0;
  }, [compsData]);

  const visibleCompsData = useMemo(() => {
    const result = compsData.slice(0, visibleDecks);
    console.log("Visible decks updated:", {
      showing: result.length,
      total: compsData.length,
    });
    return result;
  }, [compsData, visibleDecks]);

  return (
    <div className="mx-auto md:px-0 lg:px-0 py-6">
      <div className="space-y-6">
        <div>
          <div className="">
            <div className="flex justify-center md:justify-start">
              <div className="inline-flex rounded-lg overflow-hidden border border-[#2D2F37] bg-[#1D1D1D]">
                {tabButtons}
              </div>
            </div>

            <div className="rounded-lg shadow-lg">{handleTabContent}</div>
          </div>
        </div>

        <div className="space-y-4" id="meta-trends-items">
          {visibleCompsData.length > 0 ? (
            <div className="space-y-4">
              {visibleCompsData.map((metaDeck, index) => (
                <MetaDeck
                  key={`deck-${metaDeck.name}-${index}`}
                  metaDeck={metaDeck}
                  i={index}
                  isClosed={isClosed}
                  handleIsClosed={handleIsClosed}
                  {...deckProps}
                />
              ))}

              {/* Debug info for mobile testing */}
              <div className="md:hidden text-xs text-gray-500 text-center py-2">
                Showing {visibleCompsData.length} of {compsData.length} decks
                {hasMoreDecks && " - Scroll down for more"}
              </div>

              {/* Loading indicator */}
              {isLoadingMore && (
                <div className="flex justify-center py-6">
                  <div className="flex items-center space-x-2 text-[#D9A876]">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#D9A876]"></div>
                    <span className="text-sm">Loading more decks...</span>
                  </div>
                </div>
              )}

              {/* Manual load button as fallback for mobile */}
              {hasMoreDecks && !isLoadingMore && (
                <div className="md:hidden flex justify-center py-4">
                  <button
                    onClick={loadMoreDecks}
                    className="px-4 py-2 bg-[#2D2F37] hover:bg-[#3D3F47] text-[#D9A876] rounded-lg text-sm transition-colors duration-200"
                  >
                    Load More ({compsData.length - visibleDecks} remaining)
                  </button>
                </div>
              )}

              {/* End indicator */}
              {!hasMoreDecks && compsData.length > 3 && (
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

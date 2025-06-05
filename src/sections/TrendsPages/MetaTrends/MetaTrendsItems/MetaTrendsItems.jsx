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
// PERFORMANCE OPTIMIZATION: Direct import for lightweight CSS chart (no dynamic loading needed)
import MyBarChartComponent from "./BarGraph";

// PERFORMANCE OPTIMIZATION: Enhanced cache with LRU-like behavior
const MAX_CACHE_SIZE = 100;
const filterCache = new Map();

// PERFORMANCE OPTIMIZATION: Clear cache when it gets too large
const clearCacheIfNeeded = () => {
  if (filterCache.size > MAX_CACHE_SIZE) {
    const firstKey = filterCache.keys().next().value;
    filterCache.delete(firstKey);
  }
};

// PERFORMANCE OPTIMIZATION: Scroll-aware intersection observer optimization
let isScrolling = false;
let scrollTimeout;

const handleScroll = () => {
  isScrolling = true;
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    isScrolling = false;
  }, 150); // Debounce scroll end detection
};

// Add scroll listener once
if (typeof window !== "undefined") {
  window.addEventListener("scroll", handleScroll, { passive: true });
}

// PERFORMANCE OPTIMIZATION: Optimized intersection observer with scroll awareness
const createOptimizedObserver = (callback, options = {}) => {
  const defaultOptions = {
    threshold: 0.1,
    rootMargin: "100px",
    ...options,
  };

  return new IntersectionObserver((entries) => {
    // Always process visibility for initial detection, but skip expensive operations during scroll
    entries.forEach((entry) => {
      // Allow callback to decide what to do based on scroll state
      callback(entry, isScrolling);
    });
  }, defaultOptions);
};

// PERFORMANCE OPTIMIZATION: Memoized tab button with stable props
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

// PERFORMANCE OPTIMIZATION: Heavily optimized TraitItem with scroll-aware intersection observer
const TraitItem = memo(({ trait, selectedTrait, onSelect, i, t }) => {
  const [isVisible, setIsVisible] = useState(true); // Start visible for immediate loading
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const itemRef = useRef(null);

  useEffect(() => {
    const observer = createOptimizedObserver((entry, isScrolling) => {
      // Track visibility for potential future optimizations, but don't block content
      if (entry.isIntersecting && !hasBeenVisible) {
        setHasBeenVisible(true);
        // Disconnect after first visibility
        if (itemRef.current) observer.unobserve(itemRef.current);
      }
    });

    if (itemRef.current) {
      observer.observe(itemRef.current);
    }

    return () => {
      if (itemRef.current) observer.unobserve(itemRef.current);
    };
  }, [hasBeenVisible]);

  const handleClick = useCallback(() => {
    onSelect("trait", trait?.key);
  }, [onSelect, trait?.key]);

  return (
    <div
      ref={itemRef}
      className="flex flex-col items-center gap-2 cursor-pointer group"
      onClick={handleClick}
      style={{ willChange: isScrolling ? "auto" : "transform" }}
    >
      <ReactTltp variant="trait" content={trait} id={`${trait?.key}-${i}`} />
      <div className="relative aspect-square w-full max-w-[96px] transition-transform duration-200 group-hover:scale-105">
        <TraitImage
          trait={trait}
          size="xlarge"
          className="w-full h-full rounded-lg"
          data-tooltip-id={`${trait?.key}-${i}`}
        />
        {trait?.key === selectedTrait && (
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

// PERFORMANCE OPTIMIZATION: Optimized ForceItem with better state management
const ForceItem = memo(({ force, selectedTrait, onSelect, i, t }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // Start visible for immediate loading
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const itemRef = useRef(null);

  useEffect(() => {
    const observer = createOptimizedObserver((entry, isScrolling) => {
      // Track visibility for potential future optimizations, but don't block content
      if (entry.isIntersecting && !hasBeenVisible) {
        setHasBeenVisible(true);
        // Disconnect after first visibility
        if (itemRef.current) observer.unobserve(itemRef.current);
      }
    });

    if (itemRef.current) {
      observer.observe(itemRef.current);
    }

    return () => {
      if (itemRef.current) observer.unobserve(itemRef.current);
    };
  }, [hasBeenVisible]);

  const handleClick = useCallback(() => {
    onSelect("force", force?.key);
  }, [onSelect, force?.key]);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  return (
    <div
      ref={itemRef}
      className="flex flex-col items-center gap-2 cursor-pointer group"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ willChange: isScrolling ? "auto" : "transform" }}
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
        {force?.key === selectedTrait && (
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

// PERFORMANCE OPTIMIZATION: Optimized SkillTreeItem with lazy loading
const SkillTreeItem = memo(({ skill, selectedSkillTree, onSelect, i }) => {
  const [isVisible, setIsVisible] = useState(true); // Start visible for immediate loading
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const itemRef = useRef(null);

  useEffect(() => {
    const observer = createOptimizedObserver((entry, isScrolling) => {
      // Track visibility for potential future optimizations, but don't block content
      if (entry.isIntersecting && !hasBeenVisible) {
        setHasBeenVisible(true);
        // Disconnect after first visibility
        if (itemRef.current) observer.unobserve(itemRef.current);
      }
    });

    if (itemRef.current) {
      observer.observe(itemRef.current);
    }

    return () => {
      if (itemRef.current) observer.unobserve(itemRef.current);
    };
  }, [hasBeenVisible]);

  const handleClick = useCallback(() => {
    onSelect("skillTree", skill?.key);
  }, [onSelect, skill?.key]);

  return (
    <div
      ref={itemRef}
      className="flex flex-col items-center gap-1 cursor-pointer group w-16 md:w-20 lg:w-24 flex-shrink-0"
      onClick={handleClick}
      style={{ willChange: isScrolling ? "auto" : "transform" }}
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
        {skill?.key === selectedSkillTree && (
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

// PERFORMANCE OPTIMIZATION: Optimized ItemIcon with intersection observer
const ItemIcon = memo(({ item, selectedItem, onSelect, i }) => {
  const [isVisible, setIsVisible] = useState(true); // Start visible for immediate loading
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const itemRef = useRef(null);

  useEffect(() => {
    const observer = createOptimizedObserver((entry, isScrolling) => {
      // Track visibility for potential future optimizations, but don't block content
      if (entry.isIntersecting && !hasBeenVisible) {
        setHasBeenVisible(true);
        // Disconnect after first visibility
        if (itemRef.current) observer.unobserve(itemRef.current);
      }
    });

    if (itemRef.current) {
      observer.observe(itemRef.current);
    }

    return () => {
      if (itemRef.current) observer.unobserve(itemRef.current);
    };
  }, [hasBeenVisible]);

  const handleClick = useCallback(() => {
    onSelect("item", item?.key);
  }, [onSelect, item?.key]);

  return (
    <div
      ref={itemRef}
      className="flex flex-col items-center gap-2 cursor-pointer group max-w-[84px]"
      onClick={handleClick}
      style={{ willChange: isScrolling ? "auto" : "transform" }}
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
          loading="eager"
          priority={i < 12} // Prioritize first 12 items
        />
        {item?.key === selectedItem && (
          <div className="absolute inset-0 bg-[#00000080] rounded-lg flex items-center justify-center">
            <IoMdCheckmarkCircle className="text-[#86efac] text-5xl z-50" />
          </div>
        )}
      </div>
    </div>
  );
});

// PERFORMANCE OPTIMIZATION: Heavily optimized ChampionWithItems component
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
                cardSize="!w-[80px] !h-[80px] md:!w-[96px] md:!h-[96px]"
                showCost={true}
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
                className={`w-[20px] md:w-[30px] rounded-lg transition-all duration-300 ${
                  isScrolling ? "" : "hover:scale-150"
                }`}
                data-tooltip-id={`${itemDetails.key}-${idx}`}
                loading="eager"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
);

// PERFORMANCE OPTIMIZATION: Memoized AugmentIcon with better caching
const AugmentIcon = memo(({ augment, augments }) => {
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
        loading="eager"
      />
      <ReactTltp variant="augment" content={augmentDetails} id={augment} />
    </div>
  );
});

// PERFORMANCE OPTIMIZATION: Memoized SkillTreeIcon with better caching
const SkillTreeIcon = memo(({ skillTree, skills, size = "default" }) => {
  const skillDetails = useMemo(() => {
    return skills?.find((s) => s.key === skillTree);
  }, [skills, skillTree]);

  if (!skillDetails) return null;

  return (
    <SkillTreeImage skill={skillDetails} size={size} tooltipId={skillTree} />
  );
});

// PERFORMANCE OPTIMIZATION: Heavily optimized DeckHeader with stable references
const DeckHeader = memo(
  ({ metaDeck, forces, traits, toggleClosed, isClosed, i, skills }) => {
    // PERFORMANCE OPTIMIZATION: Memoize hover state to prevent unnecessary re-renders
    const [hoveredForce, setHoveredForce] = useState(null);

    // PERFORMANCE OPTIMIZATION: Memoize force details to prevent recalculation
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

    // PERFORMANCE OPTIMIZATION: Memoize skill details
    const skillDetails = useMemo(() => {
      if (!metaDeck?.deck?.skillTree || !skills) return [];
      return metaDeck.deck.skillTree
        .map((skill) => skills.find((s) => s.key === skill))
        .filter(Boolean);
    }, [metaDeck?.deck?.skillTree, skills]);

    // PERFORMANCE OPTIMIZATION: Memoize trait details with tiers
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
      <header className="relative flex flex-col md:flex-col justify-between items-start md:items-end py-[15px] pl-3 md:pl-4 pr-3 md:pr-[36px] lg:min-h-[50px] lg:flex-row lg:items-center lg:py-[5px] lg:pr-[16px]">
        <div className="inline-flex flex-col flex-wrap gap-[8px] w-full md:w-auto md:flex-row md:items-center md:gap-[4px]">
          <strong className="text-[26px] font-semibold leading-none text-[#F2A03D] text-center md:text-left">
            {metaDeck?.name}
          </strong>
          {/* Desktop force icons with count and border */}
          <span className="hidden md:flex justify-start md:justify-center items-center">
            {forceDetails.map((force, index) => (
              <div
                key={`${force.key}-${index}`}
                className="flex justify-center items-center bg-[#000] rounded-full mx-1 pr-2 border-[1px] border-[#ffffff50]"
                onMouseEnter={() => handleMouseEnter(force?.key)}
                onMouseLeave={handleMouseLeave}
              >
                <ForceIcon
                  force={force.details}
                  size="custom"
                  customSize="w-[30px] h-[30px] md:w-[40px] md:h-[40px]"
                  className="mr-1"
                  data-tooltip-id={`${force?.key}-${index}`}
                  isHovered={hoveredForce === force?.key}
                />
                <ReactTltp content={force?.key} id={`${force?.key}-${index}`} />
                <span className="text-[18px]">{force?.numUnits}</span>
              </div>
            ))}
          </span>
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
          {/* Second row: Traits */}
          {traitDetails.length > 0 && (
            <div className="flex items-center gap-x-1 w-fit overflow-x-auto scrollbar-hide">
              {traitDetails.map((trait, index) => (
                <div key={`${trait.key}-${index}`} className="flex-shrink-0">
                  <TraitImage
                    trait={trait}
                    size="small"
                    className="w-[32px] h-[32px]"
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
          )}
        </div>
        {/* Desktop layout */}
        <div className="hidden md:inline-flex flex-shrink-0 justify-between gap-1 !gap-x-6 md:mt-1">
          <span className="flex justify-center gap-x-1 items-center">
            {skillDetails.map((skill, index) => (
              <SkillTreeIcon
                key={`${skill.key}-${index}`}
                skillTree={skill.key}
                skills={skills}
                size="large"
              />
            ))}
          </span>
          <div className="flex flex-wrap gap-1 md:gap-0 md:inline-flex md:flex-wrap justify-start md:justify-end md:mr-0">
            {traitDetails.map((trait, index) => (
              <div key={`${trait.key}-${index}`} className="relative">
                <TraitImage
                  trait={trait}
                  size="default"
                  className="w-[38px] h-[38px] md:w-[48px] md:h-[48px]"
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
          <div className="absolute right-[16px] top-[16px] inline-flex gap-[8px] lg:relative lg:right-[0px] lg:top-[0px]">
            <button
              className="inline-flex w-[16px] cursor-pointer items-center text-[#D9A876]"
              title="Hide"
              id={i.toString()}
              onClick={toggleClosed}
            >
              {!isClosed ? <PiEye /> : <PiEyeClosed />}
            </button>
          </div>
        </div>
      </header>
    );
  }
);

// PERFORMANCE OPTIMIZATION: Heavily optimized MetaDeck with intersection observer and lazy loading
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
    // PERFORMANCE OPTIMIZATION: Stable toggle function
    const toggleClosed = useCallback(
      (e) => {
        handleIsClosed(e);
      },
      [handleIsClosed]
    );

    // State for champions collapse/expand
    const [isChampionsCollapsed, setIsChampionsCollapsed] = useState(true);

    // Toggle function for champions section
    const toggleChampionsSection = useCallback(() => {
      setIsChampionsCollapsed((prev) => !prev);
    }, []);

    // PERFORMANCE OPTIMIZATION: Enhanced intersection observer with better thresholds
    const deckRef = useRef(null);
    const [isVisible, setIsVisible] = useState(true); // Start visible for better UX
    const [hasBeenVisible, setHasBeenVisible] = useState(false);

    useEffect(() => {
      // PERFORMANCE OPTIMIZATION: Use intersection observer for optimization, not blocking visibility
      const observer = createOptimizedObserver(
        (entry, isScrolling) => {
          if (entry.isIntersecting && !hasBeenVisible) {
            setHasBeenVisible(true);
            // Can add additional optimizations here based on visibility
          }
        },
        { threshold: 0.05, rootMargin: "100px" }
      );

      if (deckRef.current) {
        observer.observe(deckRef.current);
      }

      return () => {
        if (deckRef.current) observer.unobserve(deckRef.current);
      };
    }, [hasBeenVisible]);

    // PERFORMANCE OPTIMIZATION: Memoize sorted champions to prevent re-sorting
    const sortedChampions = useMemo(() => {
      if (!metaDeck?.deck?.champions || !champions) return [];
      return metaDeck.deck.champions.slice().sort((a, b) => {
        const champA = champions.find((c) => c.key === a.key);
        const champB = champions.find((c) => c.key === b.key);
        return (champA?.cost || 0) - (champB?.cost || 0);
      });
    }, [metaDeck?.deck?.champions, champions]);

    // Calculate champions to display based on collapse state
    const championsToDisplay = useMemo(() => {
      if (!sortedChampions.length) return [];

      // Show first 4 champions when collapsed, all when expanded
      const maxChampionsInFirstRow = 4;
      return isChampionsCollapsed
        ? sortedChampions.slice(0, maxChampionsInFirstRow)
        : sortedChampions;
    }, [sortedChampions, isChampionsCollapsed]);

    // Check if there are more champions to show
    const hasMoreChampions = sortedChampions.length > 4;

    // PERFORMANCE OPTIMIZATION: Memoize augment details
    const augmentDetails = useMemo(() => {
      if (!metaDeck?.deck?.augments || !augments) return [];
      return metaDeck.deck.augments
        .map((augment) => augments.find((a) => a.key === augment))
        .filter(Boolean);
    }, [metaDeck?.deck?.augments, augments]);

    return (
      <div
        ref={deckRef}
        key={i}
        className="flex flex-col gap-[1px] !border border-[#FFFFFF]/30 rounded-lg overflow-hidden shadow-lg bg-[#00000099] mb-4"
        style={{
          background: "rgba(0, 0, 0, 0.6)",
        }}
      >
        <DeckHeader
          metaDeck={metaDeck}
          forces={forces}
          traits={traits}
          toggleClosed={toggleClosed}
          isClosed={isClosed[i]}
          i={i}
          skills={skills}
        />
        <OptimizedImage
          src={
            "https://res.cloudinary.com/dg0cmj6su/image/upload/v1738605248/Frame_18_1_otofdu.png"
          }
          alt={"border"}
          width={300}
          height={300}
          className="w-[90%] mx-auto md:hidden"
        />
        {!isClosed[i] && isVisible && (
          <div className="flex flex-col bg-center bg-no-repeat mt-[-1px]">
            <div className="flex min-h-[150px] flex-col justify-between items-center bg-[#111111] lg:flex-row lg:gap-[15px] lg:py-[0px] xl:px-6">
              <div className="mb-[16px] max-w-[342px] lg:mb-0 lg:w-full lg:max-w-[80%] lg:flex-shrink-0">
                <div className="flex flex-col">
                  <div className="flex flex-wrap justify-center lg:justify-center gap-2 w-full">
                    {/* First 4 champions - always visible */}
                    {sortedChampions.slice(0, 4).map((champion, index) => (
                      <ChampionWithItems
                        key={`${champion.key}-${index}`}
                        champion={champion}
                        champions={champions}
                        items={items}
                        forces={forces}
                        tier={champion.tier}
                      />
                    ))}
                  </div>

                  {/* Additional champions with smooth animation */}
                  {hasMoreChampions && (
                    <div
                      className={`overflow-hidden transition-all duration-500 ease-in-out ${
                        isChampionsCollapsed
                          ? "max-h-0 opacity-0 transform translate-y-[-10px]"
                          : "max-h-96 opacity-100 transform translate-y-0"
                      }`}
                    >
                      <div className="flex flex-wrap justify-center lg:justify-center gap-2 w-full pt-2 transition-all duration-300 ease-in-out">
                        {sortedChampions.slice(4).map((champion, index) => (
                          <div
                            key={`${champion.key}-${index + 4}`}
                            className={`transition-all duration-500 ease-in-out ${
                              isChampionsCollapsed
                                ? "opacity-0 transform scale-95 translate-y-[-5px]"
                                : "opacity-100 transform scale-100 translate-y-0"
                            }`}
                            style={{
                              transitionDelay: isChampionsCollapsed
                                ? "0ms"
                                : `${index * 50}ms`,
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
                    </div>
                  )}

                  {/* Line with toggle button at the center */}
                  {hasMoreChampions && (
                    <div className="flex items-center justify-center mt-1 w-full transition-all duration-300 ease-in-out">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#ffffff30] to-[#ffffff30] transition-all duration-300"></div>
                      <button
                        onClick={toggleChampionsSection}
                        className="mx-3 w-7 h-7 bg-[#2D2F37] hover:bg-[#3D3F47] text-[#D9A876] rounded-full transition-all duration-300 ease-in-out flex items-center justify-center shadow-md border border-[#ffffff20] flex-shrink-0 hover:scale-110 active:scale-95"
                        title={
                          isChampionsCollapsed
                            ? `Show ${sortedChampions.length - championsToDisplay.length} more champions`
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
              </div>

              <div className="mb-[12px] grid w-full grid-cols-3 md:grip-cols-4 gap-[12px] sm:w-auto md:mb-0 md:!flex md:items-center">
                <div className="md:!hidden flex h-[98px] flex-col justify-between rounded-[4px] bg-[#1D1D1D] py-[12px] sm:w-[126px] sm:px-[6px] lg:w-[130px]">
                  <div className="flex justify-center gap-[2px]">
                    <span className="text-[12px] leading-none text-[#999]">
                      {others?.bestAugments}
                    </span>
                  </div>
                  <div className="flex justify-center gap-[2px] lg:py-[8px] lg:px-[6px]">
                    {augmentDetails.map((augment, index) => (
                      <AugmentIcon
                        key={`${augment.key}-${index}`}
                        augment={augment.key}
                        augments={augments}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex w-full flex-col justify-between rounded-[4px] bg-[#1D1D1D] pt-[10px] pb-1">
                  <div
                    style={{
                      width: "113px",
                      height: "75px",
                    }}
                    className="md:hidden mx-auto"
                  >
                    <MyBarChartComponent height={80} width={100} />
                    <p className="text-center mb-0 text-[11px] md:text-[14px] font-medium leading-5 text-[#999]">
                      {others?.avgRanking}
                    </p>
                  </div>
                </div>

                <div className="hidden md:flex md:flex-col justify-center gap-y-[2px] lg:py-[8px]">
                  {augmentDetails.map((augment, index) => (
                    <div
                      key={`${augment.key}-${index}`}
                      className="flex justify-center items-center md:w-[48px] relative"
                    >
                      <AugmentIcon augment={augment.key} augments={augments} />
                    </div>
                  ))}
                </div>

                <div className="flex flex-col">
                  <div className="flex w-full flex-col h-full justify-between rounded-[4px] bg-[#1D1D1D] pt-[10px] pb-1 px-[16px] sm:px-[18px]">
                    <dl className="flex justify-between">
                      <dt className="text-[11px] md:text-[14px] font-medium leading-5 text-[#999]">
                        {others?.top4}
                      </dt>
                      <dd className="text-[11px] md:text-[14px] font-medium leading-5 text-[#D9A876]">
                        <span>65.3%</span>
                      </dd>
                    </dl>
                    <dl className="flex justify-between">
                      <dt className="text-[11px] md:text-[14px] font-medium leading-5 text-[#999]">
                        {others?.winPercentage}
                      </dt>
                      <dd className="text-[11px] md:text-[14px] font-medium leading-5 text-[#D9A876]">
                        <span>26.6%</span>
                      </dd>
                    </dl>
                    <dl className="flex justify-between">
                      <dt className="text-[11px] md:text-[14px] font-medium leading-5 text-[#999]">
                        {others?.pickPercentage}
                      </dt>
                      <dd className="text-[11px] md:text-[14px] font-medium leading-5 text-[#D9A876]">
                        <span>0.39%</span>
                      </dd>
                    </dl>
                    <dl className="flex justify-between">
                      <dt className="text-[11px] md:text-[14px] font-medium leading-5 text-[#999]">
                        {others?.avgPlacement}
                      </dt>
                      <dd className="text-[11px] md:text-[14px] font-medium leading-5 text-[#D9A876]">
                        <span>4.52</span>
                      </dd>
                    </dl>

                    <div
                      style={{
                        width: "150px",
                        height: "80px",
                      }}
                      className="hidden md:block mt-2 mx-auto"
                    >
                      <MyBarChartComponent height={70} width={80} />
                      <p className="text-center mb-0 text-[11px] md:text-[14px] font-medium leading-5 text-[999]">
                        {others?.avgRanking}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

// PERFORMANCE OPTIMIZATION: Main component with single scroll optimization
const MetaTrendsItems = () => {
  const { t } = useTranslation();
  const othersRef = useRef(t("others"));
  const others = othersRef.current;

  const [selectedChampion, setSelectedChampion] = useState(null);
  const [selectedTrait, setSelectedTrait] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedSkillTree, setSelectedSkillTree] = useState(null);
  const [isClosed, setIsClosed] = useState({});
  const [activeTab, setActiveTab] = useState("Champions");

  // State for mobile sub-tabs within Traits
  const [activeTraitsSubTab, setActiveTraitsSubTab] = useState("Origin");

  // State for mobile sub-tabs within Skills
  const [activeSkillsSubTab, setActiveSkillsSubTab] = useState(null);

  // PERFORMANCE OPTIMIZATION: Enhanced data extraction with better memoization
  const { metaDecks, champions, items, traits, augments, forces, skillTree } =
    useMemo(() => {
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

  // PERFORMANCE OPTIMIZATION: State for filtered comps data with stable reference
  const [compsData, setCompsData] = useState(() => metaDecks);

  // PERFORMANCE OPTIMIZATION: Stable reference to original metaDecks
  const metaDecksRef = useRef(metaDecks);
  useEffect(() => {
    metaDecksRef.current = metaDecks;
    setCompsData(metaDecks);
  }, [metaDecks]);

  // PERFORMANCE OPTIMIZATION: Enhanced shuffle function with WeakMap caching
  const shuffleRef = useRef(null);
  const shuffle = useCallback((array) => {
    if (!array || !array.length) return [];

    // Enhanced caching with WeakMap
    if (!shuffleRef.current) {
      shuffleRef.current = new WeakMap();
    }

    if (shuffleRef.current.has(array)) {
      return shuffleRef.current.get(array);
    }

    // Fisher-Yates shuffle algorithm
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }

    shuffleRef.current.set(array, newArray);
    return newArray;
  }, []);

  // PERFORMANCE OPTIMIZATION: Heavily optimized champion processing with stable references
  const processedChampionsRef = useRef(null);
  const { filteredChampions, groupedArray } = useMemo(() => {
    if (processedChampionsRef.current) {
      return processedChampionsRef.current;
    }

    if (!champions || !champions.length) {
      return { filteredChampions: [], groupedArray: [] };
    }

    // PERFORMANCE OPTIMIZATION: Use Map for O(1) lookups
    const championsByType = new Map();
    champions.forEach((champion) => {
      if (!champion.type) return;

      if (!championsByType.has(champion.type)) {
        championsByType.set(champion.type, []);
      }
      championsByType.get(champion.type).push(champion);
    });

    // PERFORMANCE OPTIMIZATION: Optimized selection and grouping
    const filtered = [];
    for (const [_, group] of championsByType) {
      const selected = shuffle([...group]).slice(0, 2);
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
        selected: false,
      });
    });

    const result = {
      filteredChampions: filtered,
      groupedArray: Array.from(groupedByCost.entries())
        .sort(([costA], [costB]) => costA - costB)
        .map(([cost, champions]) => champions),
    };

    processedChampionsRef.current = result;
    return result;
  }, [champions, shuffle]);

  // PERFORMANCE OPTIMIZATION: Optimized selection state management
  const championsWithSelection = useMemo(() => {
    if (!groupedArray.length) return groupedArray;

    return groupedArray.map((costGroup) =>
      costGroup.map((champion) => ({
        ...champion,
        selected: champion.key === selectedChampion,
      }))
    );
  }, [groupedArray, selectedChampion]);

  // PERFORMANCE OPTIMIZATION: Memoized filtered items with stable reference
  const filteredItems = useMemo(() => {
    return items?.filter((item) => !item?.isFromItem) || [];
  }, [items]);

  // PERFORMANCE OPTIMIZATION: Enhanced cache key generation
  const getFilterCacheKey = useCallback((type, key) => {
    return `${type}:${key}`;
  }, []);

  // PERFORMANCE OPTIMIZATION: Optimized filter handler with better caching strategy
  const handleFilterChange = useCallback(
    (type, key) => {
      const metaDecks = metaDecksRef.current;
      if (!metaDecks?.length) return;

      let newCompsData;
      const cacheKey = getFilterCacheKey(type, key);

      // PERFORMANCE OPTIMIZATION: Enhanced filtering logic with better cache management
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
            clearCacheIfNeeded();
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
            clearCacheIfNeeded();
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
            clearCacheIfNeeded();
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
            clearCacheIfNeeded();
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
            clearCacheIfNeeded();
            filterCache.set(cacheKey, filtered);
            return filtered;
          }
        },
      };

      newCompsData = filterLogic[type]?.() || metaDecks;

      // PERFORMANCE OPTIMIZATION: Reset other selections efficiently
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
    },
    [
      getFilterCacheKey,
      selectedChampion,
      selectedItem,
      selectedTrait,
      selectedSkillTree,
    ]
  );

  // PERFORMANCE OPTIMIZATION: Stable callback for deck closing
  const handleIsClosed = useCallback((event) => {
    const buttonId = event.currentTarget.id;
    setIsClosed((prev) => ({ ...prev, [buttonId]: !prev[buttonId] }));
  }, []);

  // PERFORMANCE OPTIMIZATION: Stable tab change handler
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  // Stable handler for traits sub-tab changes
  const handleTraitsSubTabChange = useCallback((subTab) => {
    setActiveTraitsSubTab(subTab);
  }, []);

  // Stable handler for skills sub-tab changes
  const handleSkillsSubTabChange = useCallback((subTab) => {
    setActiveSkillsSubTab(subTab);
  }, []);

  // PERFORMANCE OPTIMIZATION: Heavily memoized tab content with lazy loading

  // Group skills by variant/category for mobile tabs
  const skillsByVariant = useMemo(() => {
    if (!skillTree || skillTree.length === 0) return {};

    const grouped = {};
    const validSkills = skillTree.filter((skill) => skill?.imageUrl);

    validSkills.forEach((skill) => {
      // Try to extract variant from skill name or use a default category
      let variant = "General";

      // Check if skill has a category/type property
      if (skill.category) {
        variant = skill.category;
      } else if (skill.type) {
        variant = skill.type;
      } else if (skill.variant) {
        variant = skill.variant;
      } else if (skill.name) {
        // Try to infer variant from skill name patterns
        const skillName = skill.name.toLowerCase();
        if (
          skillName.includes("fire") ||
          skillName.includes("flame") ||
          skillName.includes("burn")
        ) {
          variant = "Fire";
        } else if (
          skillName.includes("water") ||
          skillName.includes("ice") ||
          skillName.includes("frost")
        ) {
          variant = "Water";
        } else if (
          skillName.includes("earth") ||
          skillName.includes("stone") ||
          skillName.includes("rock")
        ) {
          variant = "Earth";
        } else if (
          skillName.includes("air") ||
          skillName.includes("wind") ||
          skillName.includes("storm")
        ) {
          variant = "Air";
        } else if (
          skillName.includes("light") ||
          skillName.includes("holy") ||
          skillName.includes("divine")
        ) {
          variant = "Light";
        } else if (
          skillName.includes("dark") ||
          skillName.includes("shadow") ||
          skillName.includes("void")
        ) {
          variant = "Dark";
        } else if (
          skillName.includes("nature") ||
          skillName.includes("plant") ||
          skillName.includes("forest")
        ) {
          variant = "Nature";
        }
      }

      if (!grouped[variant]) {
        grouped[variant] = [];
      }
      grouped[variant].push(skill);
    });

    return grouped;
  }, [skillTree]);

  // Initialize skills sub-tab when variants are available
  useEffect(() => {
    if (Object.keys(skillsByVariant).length > 0 && !activeSkillsSubTab) {
      const firstVariant = Object.keys(skillsByVariant)[0];
      setActiveSkillsSubTab(firstVariant);
    }
  }, [skillsByVariant, activeSkillsSubTab]);

  // Auto-scroll to meta-trends-items section on component load
  useEffect(() => {
    const scrollToResults = () => {
      const element = document.getElementById("meta-trends-items");
      if (element) {
        // Get element position and add offset for fixed tabs
        const elementPosition =
          element.getBoundingClientRect().top + window.pageYOffset;
        const offset = 120; // Adjust this value based on your fixed tabs height
        const targetPosition = elementPosition - offset;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    };

    // Small delay to ensure content is rendered
    const timer = setTimeout(scrollToResults, 100);

    return () => clearTimeout(timer);
  }, []); // Empty dependency array means this runs once on mount

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
          {/* Mobile Sub-tabs for Origin and Forces */}
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

          {/* Mobile View - Show only active sub-tab */}
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

          {/* Desktop View - Show both sections */}
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
      ),
      Items: () => (
        <div className="p-3 md:p-6 bg-[#111111] rounded-lg mt-2 max-h-[184px] overflow-y-auto scrollbar-hide">
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
      ),
      SkillTree: () => (
        <div className="p-3 px-0 md:p-6 bg-[#111111] rounded-lg mt-2">
          {/* Mobile Sub-tabs for Skill Variants */}
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

          {/* Mobile View - Show only active sub-tab */}
          <div className="lg:hidden">
            {activeSkillsSubTab && skillsByVariant[activeSkillsSubTab] && (
              <div className="flex flex-wrap justify-center gap-2 w-full">
                {skillsByVariant[activeSkillsSubTab].map((skill, i) => (
                  <SkillTreeImage
                    key={`mobile-skill-${skill.key}-${i}`}
                    skill={skill}
                    size="xlarge"
                    selectedSkillTree={selectedSkillTree}
                    onSelect={handleFilterChange}
                    i={i}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Desktop View - Show all skills */}
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
    t,
  ]);

  // PERFORMANCE OPTIMIZATION: Memoized deck props to prevent object recreation
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

  // PERFORMANCE OPTIMIZATION: Memoized tab buttons to prevent recreation
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

  return (
    <div className="mx-auto md:px-0 lg:px-0 py-6">
      <div className="space-y-6">
        <div>
          <div className="">
            {/* PERFORMANCE OPTIMIZATION: Optimized tabs section */}
            <div className="flex justify-center md:justify-start">
              <div className="inline-flex rounded-lg overflow-hidden border border-[#2D2F37] bg-[#1D1D1D]">
                {tabButtons}
              </div>
            </div>

            {/* PERFORMANCE OPTIMIZATION: Memoized content sections */}
            <div className="rounded-lg shadow-lg">{handleTabContent}</div>
          </div>
        </div>

        {/* PERFORMANCE OPTIMIZATION: Single scroll results section with intersection observer optimization */}
        <div className="space-y-4" id="meta-trends-items">
          {compsData.length > 0 ? (
            <div className="space-y-4">
              {compsData.map((metaDeck, index) => (
                <MetaDeck
                  key={`deck-${index}`}
                  metaDeck={metaDeck}
                  i={index}
                  isClosed={isClosed}
                  handleIsClosed={handleIsClosed}
                  {...deckProps}
                />
              ))}
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

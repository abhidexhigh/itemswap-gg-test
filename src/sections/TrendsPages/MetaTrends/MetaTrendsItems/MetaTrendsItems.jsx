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
import ReactTltp from "src/components/tooltip/ReactTltp";
import CardImage from "src/components/cardImage";
import { OptimizedImage } from "src/utils/imageOptimizer";
import ForceIcon from "src/components/forceIcon";
import TraitImage from "src/components/TraitImage/TraitImage";
import SkillTreeImage from "src/components/SkillTreeImage";

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
    const observer = new IntersectionObserver(([entry]) => {
      setIntersecting(entry.isIntersecting);
    }, options);

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, isIntersecting];
};

const useInfiniteScroll = (callback, hasMore) => {
  const [isMobile, setIsMobile] = useState(false);

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
    const handleScroll = debounce(
      () => {
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

        const triggerDistance = isMobile ? 300 : 800;
        const distanceFromBottom = documentHeight - (scrollTop + windowHeight);

        if (distanceFromBottom <= triggerDistance) callback();
      },
      isMobile ? 50 : 100
    );

    const events = ["scroll", "touchmove", "touchend"];
    events.forEach((event) => {
      window.addEventListener(event, handleScroll, { passive: true });
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleScroll);
      });
    };
  }, [callback, hasMore, isMobile]);
};

// Component wrappers
const LazyComponent = memo(({ children, threshold = 0.1 }) => {
  const [ref, isVisible] = useIntersectionObserver({ threshold });
  return (
    <div ref={ref}>
      {isVisible ? children : <div style={{ height: "120px" }} />}
    </div>
  );
});

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

// Optimized item components
const TraitItem = memo(({ trait, selectedItem, onSelect, i }) => {
  const handleClick = useCallback(() => {
    onSelect("trait", trait?.key);
  }, [onSelect, trait?.key]);

  const isSelected = trait?.key === selectedItem;

  return (
    <LazyComponent>
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

const ForceItem = memo(({ force, selectedItem, onSelect, i }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = useCallback(() => {
    onSelect("force", force?.key);
  }, [onSelect, force?.key]);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  const isSelected = force?.key === selectedItem;

  return (
    <LazyComponent>
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
  ({ skill, selectedSkillTree, onSelect, i, mobile = false }) => {
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
            id={`skill-${skill?.key}-${i}`}
          />
          <div className="relative aspect-square w-full transition-transform duration-200 group-hover:scale-105">
            <SkillTreeImage
              skill={skill}
              size={mobile ? "small" : "large"}
              tooltipId={`skill-${skill?.key}-${i}`}
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

const ItemIcon = memo(({ item, selectedItem, onSelect, i }) => {
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
});

// Optimized deck components
const ChampionWithItems = memo(
  ({ champion, champions, items, forces, tier }) => {
    const championDetails = useMemo(
      () => champions?.find((c) => c.key === champion?.key),
      [champions, champion?.key]
    );

    const championItems = useMemo(() => {
      if (!champion?.items || !items) return [];
      return champion.items
        .map((item) => items.find((i) => i.key === item))
        .filter(Boolean)
        .slice(0, 3); // Limit items
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
                  className="w-[20px] md:w-[30px] rounded-lg transition-all duration-300 hover:scale-150"
                  data-tooltip-id={`${itemDetails.key}-${idx}`}
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

const DeckHeader = memo(({ metaDeck, forces, traits, skills, augments }) => {
  const [hoveredForce, setHoveredForce] = useState(null);

  const { forceDetails, skillDetails, traitDetails, augmentDetails } =
    useMemo(() => {
      const forceDetails =
        metaDeck?.deck?.forces
          ?.map((force) => ({
            ...force,
            details: forces?.find(
              (t) => t.key.toLowerCase() === force?.key.toLowerCase()
            ),
          }))
          .filter((force) => force.details) || [];

      const skillDetails =
        metaDeck?.deck?.skillTree
          ?.map((skill) => skills?.find((s) => s.key === skill))
          .filter(Boolean) || [];

      const traitDetails =
        metaDeck?.deck?.traits
          ?.map((trait) => {
            const traitDetails = traits?.find((t) => t.key === trait?.key);
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
        metaDeck?.deck?.augments
          ?.map((augment) => augments?.find((a) => a.key === augment))
          .filter(Boolean) || [];

      return { forceDetails, skillDetails, traitDetails, augmentDetails };
    }, [metaDeck, forces, traits, skills, augments]);

  const renderForceIcon = (force, index, isMobile = false) => (
    <div
      key={`${force.key}-${index}`}
      className={
        isMobile
          ? "flex-shrink-0 w-[30px] h-[30px]"
          : "flex justify-center items-center bg-[#000] rounded-full mx-1 pr-2 border-[1px] border-[#ffffff30] h-[90%]"
      }
      onMouseEnter={() => setHoveredForce(force?.key)}
      onMouseLeave={() => setHoveredForce(null)}
    >
      <ForceIcon
        force={force.details}
        size="custom"
        customSize={
          isMobile
            ? "w-full h-full"
            : "w-[30px] h-[30px] md:w-[36px] md:h-[36px]"
        }
        className={isMobile ? "aspect-square" : "mr-1"}
        data-tooltip-id={`${force?.key}-${index}`}
        isHovered={hoveredForce === force?.key}
        loading="lazy"
      />
      <ReactTltp content={force?.key} id={`${force?.key}-${index}`} />
      {!isMobile && <span className="text-[18px]">{force?.numUnits}</span>}
    </div>
  );

  return (
    <header className="relative flex flex-col md:flex-col justify-between items-start md:items-end py-[10px] pl-3 md:pl-4 pr-3 md:pr-[36px] lg:min-h-[50px] lg:flex-row lg:items-center lg:py-[5px] lg:pr-[16px]">
      <div className="inline-flex flex-col flex-wrap gap-[8px] w-full md:w-auto md:flex-row md:items-center md:gap-[4px]">
        <strong className="text-[26px] font-semibold leading-none text-[#F2A03D] text-center md:text-left">
          {metaDeck?.name}
        </strong>
        {/* Desktop: Traits */}
        <div className="hidden md:flex items-center gap-1 ml-4">
          {traitDetails.slice(0, 5).map((trait, index) => (
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
          ))}
        </div>
      </div>

      {/* Mobile layout */}
      <div className="flex md:hidden flex-col gap-y-3 mt-2 w-full items-center">
        <div className="flex items-center gap-x-2 w-fit overflow-hidden !border !border-[#ffffff40] rounded-lg p-1">
          {forceDetails
            .slice(0, 4)
            .map((force, index) => renderForceIcon(force, index, true))}
          {forceDetails.length > 0 && skillDetails.length > 0 && (
            <div className="flex-shrink-0 h-8 w-px bg-[#ffffff30] mx-1"></div>
          )}
          {skillDetails.slice(0, 3).map((skill, index) => (
            <div
              key={`${skill.key}-${index}`}
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
          {traitDetails.slice(0, 6).map((trait, index) => (
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
          ))}
          {traitDetails.length > 0 && augmentDetails.length > 0 && (
            <div className="flex-shrink-0 h-8 w-px bg-[#ffffff30] mx-2"></div>
          )}
          {augmentDetails.slice(0, 4).map((augment, index) => (
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
          ))}
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:inline-flex flex-shrink-0 justify-between gap-1 !gap-x-6 md:mt-1">
        <div className="flex flex-wrap gap-1 md:gap-0 md:inline-flex md:flex-wrap justify-start md:justify-end items-center md:mr-0">
          {forceDetails.map((force, index) => renderForceIcon(force, index))}
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
              tooltipId={skill.key}
              loading="lazy"
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
});

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
    const [isChampionsCollapsed, setIsChampionsCollapsed] = useState(true);

    const sortedChampions = useMemo(() => {
      if (!metaDeck?.deck?.champions || !champions) return [];
      return metaDeck.deck.champions.slice().sort((a, b) => {
        const champA = champions.find((c) => c.key === a.key);
        const champB = champions.find((c) => c.key === b.key);
        return (champA?.cost || 0) - (champB?.cost || 0);
      });
    }, [metaDeck?.deck?.champions, champions]);

    const championsToDisplay = useMemo(() => {
      if (!sortedChampions.length) return [];
      if (isChampionsCollapsed) {
        const prioritized = [...sortedChampions].sort((a, b) => {
          const isATier4Plus = (a?.tier || 0) >= 4;
          const isBTier4Plus = (b?.tier || 0) >= 4;
          if (isATier4Plus && !isBTier4Plus) return -1;
          if (!isATier4Plus && isBTier4Plus) return 1;
          return 0;
        });
        return prioritized.slice(0, 4);
      }
      return sortedChampions;
    }, [sortedChampions, isChampionsCollapsed]);

    return (
      <div className="flex flex-col gap-[1px] bg-gradient-to-r from-[#5f5525] to-[#6D4600] p-[1px] rounded-lg overflow-hidden shadow-lg mb-4 md:!mb-10">
        <div className="bg-[#000000] rounded-lg">
          <DeckHeader
            metaDeck={metaDeck}
            forces={forces}
            traits={traits}
            skills={skills}
            augments={augments}
          />
          <div className="flex items-center justify-center mt-1 w-full transition-all duration-300 ease-in-out">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#ffffff30] to-[#ffffff30]"></div>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#ffffff30] to-[#ffffff30]"></div>
          </div>
          {!isClosed[i] && (
            <div className="flex flex-col bg-center bg-no-repeat mt-[-1px]">
              <div className="flex min-h-[150px] flex-col justify-between items-center bg-[#111111] lg:flex-row lg:gap-[15px] lg:py-[0px] xl:px-6 rounded-b-lg">
                <div className="-mb-[8px] max-w-[342px] lg:mb-0 lg:w-full lg:max-w-[87%] lg:flex-shrink-0">
                  <div className="flex flex-col">
                    <div className="flex flex-wrap justify-center my-1 lg:justify-center gap-2 w-full">
                      {/* Mobile view */}
                      <div className="lg:hidden">
                        <div className="flex flex-wrap justify-center gap-2 w-full">
                          {championsToDisplay.map((champion, index) => (
                            <div key={`mobile-${champion.key}-${index}`}>
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
                        {sortedChampions.length > 4 && (
                          <div className="flex items-center justify-center mt-1 w-full">
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#ffffff30] to-[#ffffff30]"></div>
                            <button
                              onClick={() =>
                                setIsChampionsCollapsed((prev) => !prev)
                              }
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
                        <span>{value}</span>
                      </dd>
                    </dl>
                  ))}
                </div>

                <div className="md:flex flex-col hidden">
                  <div className="flex w-full flex-col gap-y-4 h-full justify-between rounded-[4px] bg-[#1D1D1D] pt-[10px] pb-1 px-[16px] sm:px-[18px]">
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

// Main component
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
  const [visibleDecks, setVisibleDecks] = useState(3);
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
  const [compsData, setCompsData] = useState(() => metaDecks);

  useEffect(() => {
    setCompsData(metaDecks);
  }, [metaDecks]);

  // Memoized data processing
  const { filteredChampions, groupedArray } = useMemo(() => {
    if (!champions?.length) return { filteredChampions: [], groupedArray: [] };

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
      const selected = shuffle([...group]).slice(0, 2);
      filtered.push(...selected);
    }

    const groupedByCost = new Map();
    filtered.forEach((champion) => {
      const { cost } = champion;
      if (!groupedByCost.has(cost)) {
        groupedByCost.set(cost, []);
      }
      groupedByCost.get(cost).push({ ...champion, selected: false });
    });

    return {
      filteredChampions: filtered,
      groupedArray: Array.from(groupedByCost.entries())
        .sort(([costA], [costB]) => costA - costB)
        .map(([cost, champions]) => champions),
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
    const grouped = new Map();
    const validSkills = skillTree.filter((skill) => skill?.imageUrl);

    validSkills.forEach((skill) => {
      const variant = skill.variant || "General";
      if (!grouped.has(variant)) {
        grouped.set(variant, []);
      }
      grouped.get(variant).push(skill);
    });

    return Object.fromEntries(grouped);
  }, [skillTree]);

  // Initialize skills sub-tab
  useEffect(() => {
    const variants = Object.keys(skillsByVariant);
    if (variants.length > 0 && !activeSkillsSubTab) {
      setActiveSkillsSubTab(variants[0]);
    }
  }, [skillsByVariant, activeSkillsSubTab]);

  // Filter handler with caching
  const filterCache = useRef(new Map());

  const handleFilterChange = useCallback(
    debounce((type, key) => {
      const cacheKey = `${type}:${key}`;
      let newCompsData;

      const sortStrategies = {
        trait: () => {
          if (selectedTrait === key) {
            setSelectedTrait(null);
            return metaDecks;
          }
          setSelectedTrait(key);
          if (filterCache.current.has(cacheKey)) {
            return filterCache.current.get(cacheKey);
          }
          const sorted = [...metaDecks].sort((a, b) => {
            const aCount =
              a.deck.traits.find((trait) => trait.key === key)?.numUnits || 0;
            const bCount =
              b.deck.traits.find((trait) => trait.key === key)?.numUnits || 0;
            return bCount - aCount;
          });
          filterCache.current.set(cacheKey, sorted);
          return sorted;
        },
        force: () => {
          if (selectedTrait === key) {
            setSelectedTrait(null);
            return metaDecks;
          }
          setSelectedTrait(key);
          if (filterCache.current.has(cacheKey)) {
            return filterCache.current.get(cacheKey);
          }
          const sorted = [...metaDecks].sort((a, b) => {
            const aCount =
              a.deck.forces.find(
                (force) => force.key.toLowerCase() === key.toLowerCase()
              )?.numUnits || 0;
            const bCount =
              b.deck.forces.find(
                (force) => force.key.toLowerCase() === key.toLowerCase()
              )?.numUnits || 0;
            return bCount - aCount;
          });
          filterCache.current.set(cacheKey, sorted);
          return sorted;
        },
        champion: () => {
          if (selectedChampion === key) {
            setSelectedChampion(null);
            return metaDecks;
          }
          setSelectedChampion(key);
          if (filterCache.current.has(cacheKey)) {
            return filterCache.current.get(cacheKey);
          }
          const sorted = [...metaDecks].sort((a, b) => {
            const aHas = a.deck.champions.some(
              (champion) => champion.key === key
            );
            const bHas = b.deck.champions.some(
              (champion) => champion.key === key
            );
            if (aHas && !bHas) return -1;
            if (!aHas && bHas) return 1;
            return 0;
          });
          filterCache.current.set(cacheKey, sorted);
          return sorted;
        },
        item: () => {
          if (selectedItem === key) {
            setSelectedItem(null);
            return metaDecks;
          }
          setSelectedItem(key);
          if (filterCache.current.has(cacheKey)) {
            return filterCache.current.get(cacheKey);
          }
          const sorted = [...metaDecks].sort((a, b) => {
            const aCount = a.deck.champions.reduce((count, champion) => {
              return (
                count +
                (champion.items?.filter((item) => item === key).length || 0)
              );
            }, 0);
            const bCount = b.deck.champions.reduce((count, champion) => {
              return (
                count +
                (champion.items?.filter((item) => item === key).length || 0)
              );
            }, 0);
            return bCount - aCount;
          });
          filterCache.current.set(cacheKey, sorted);
          return sorted;
        },
        skillTree: () => {
          if (selectedSkillTree === key) {
            setSelectedSkillTree(null);
            return metaDecks;
          }
          setSelectedSkillTree(key);
          if (filterCache.current.has(cacheKey)) {
            return filterCache.current.get(cacheKey);
          }
          const sorted = [...metaDecks].sort((a, b) => {
            const aHas = a.deck?.skillTree?.includes(key) || false;
            const bHas = b.deck?.skillTree?.includes(key) || false;
            if (aHas && !bHas) return -1;
            if (!aHas && bHas) return 1;
            return 0;
          });
          filterCache.current.set(cacheKey, sorted);
          return sorted;
        },
      };

      newCompsData = sortStrategies[type]?.() || metaDecks;

      // Reset other selections
      if (type !== "champion") setSelectedChampion(null);
      if (type !== "trait" && type !== "force") setSelectedTrait(null);
      if (type !== "item") setSelectedItem(null);
      if (type !== "skillTree") setSelectedSkillTree(null);

      setCompsData(newCompsData);
    }, 50),
    [
      selectedChampion,
      selectedItem,
      selectedTrait,
      selectedSkillTree,
      metaDecks,
    ]
  );

  // Event handlers
  const handleIsClosed = useCallback((event) => {
    const buttonId = event.currentTarget.id;
    setIsClosed((prev) => ({ ...prev, [buttonId]: !prev[buttonId] }));
  }, []);

  // Infinite scroll
  const loadingRef = useRef(false);
  const loadMoreDecks = useCallback(() => {
    if (loadingRef.current || visibleDecks >= compsData.length) return;

    loadingRef.current = true;
    setIsLoadingMore(true);

    setTimeout(() => {
      setVisibleDecks((prev) => Math.min(prev + 5, compsData.length));
      setIsLoadingMore(false);
      loadingRef.current = false;
    }, 100);
  }, [compsData.length, visibleDecks]);

  const hasMoreDecks = visibleDecks < compsData.length;
  useInfiniteScroll(loadMoreDecks, hasMoreDecks);

  useEffect(() => {
    setVisibleDecks(3);
    loadingRef.current = false;
  }, [compsData]);

  const visibleCompsData = useMemo(() => {
    return compsData.slice(0, visibleDecks);
  }, [compsData, visibleDecks]);

  // Tab content
  const tabContent = useMemo(() => {
    const tabs = {
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
                      selectedItem={selectedTrait}
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
                      selectedItem={selectedTrait}
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
            {[
              [others?.origin, traits],
              [others?.forces, forces],
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
      ),
      Items: () => (
        <div className="p-3 md:p-6 bg-[#111111] rounded-lg mt-2 max-h-[155px] md:max-h-full overflow-y-auto">
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-6 lg:grid-cols-8 xl:!flex justify-center xl:!flex-wrap gap-1 lg:gap-4">
            {filteredItems.map((item, i) => (
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
            ))}
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
          <div className="lg:hidden">
            {activeSkillsSubTab && skillsByVariant[activeSkillsSubTab] && (
              <div className="flex flex-wrap justify-center gap-2 w-full max-h-[300px] overflow-y-auto px-2">
                {skillsByVariant[activeSkillsSubTab].map((skill, i) => (
                  <SkillTreeItem
                    key={`mobile-skill-${skill.key}-${i}`}
                    skill={skill}
                    selectedSkillTree={selectedSkillTree}
                    onSelect={handleFilterChange}
                    i={i}
                    mobile={true}
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
      ),
    };

    return tabs[activeTab]?.() || null;
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

  const deckProps = useMemo(
    () => ({
      champions,
      items,
      traits,
      forces,
      augments,
      others,
      skills: skillTree,
    }),
    [champions, items, traits, forces, augments, skillTree, others]
  );

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
      <div className="mx-auto md:px-0 lg:px-0 py-6">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D9A876]"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="mx-auto md:px-0 lg:px-0 py-6">
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
    <div className="mx-auto md:px-0 lg:px-0 py-6">
      <div className="space-y-6">
        <div>
          <div className="flex justify-center md:justify-start">
            <div className="inline-flex rounded-lg overflow-hidden border border-[#2D2F37] bg-[#1D1D1D]">
              {tabButtons}
            </div>
          </div>
          <div className="rounded-lg shadow-lg">{tabContent}</div>
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

              {/* Loading indicator */}
              {isLoadingMore && (
                <div className="flex justify-center py-6">
                  <div className="flex items-center space-x-2 text-[#D9A876]">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#D9A876]"></div>
                    <span className="text-sm">Loading more decks...</span>
                  </div>
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

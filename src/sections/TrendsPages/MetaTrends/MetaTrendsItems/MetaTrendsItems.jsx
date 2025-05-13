import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";
import "../../../../../i18n";
import React, {
  useState,
  useCallback,
  useMemo,
  memo,
  Suspense,
  lazy,
  useRef,
  useEffect,
} from "react";
import TraitTooltip from "src/components/tooltip/TraitTooltip";
import "react-tooltip/dist/react-tooltip.css";
import GirlCrush from "@assets/image/traits/GirlCrush.svg";
import MetaTrendsCard from "../MetaTrendsCard/MetaTrendsCard";
import augment from "@assets/image/augments/1.png";
import arrowRight from "@assets/image/icons/arrow-right.svg";
import { PiEye, PiEyeClosed } from "react-icons/pi";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { IoMdCheckmarkCircle } from "react-icons/io";
import Comps from "../../../../data/compsNew.json";
import ReactTltp from "src/components/tooltip/ReactTltp";
import CardImage from "src/components/cardImage";
import "chart.js/auto";
import { OptimizedImage } from "src/utils/imageOptimizer";
import ForceIcon from "src/components/forceIcon";

// Dynamically import heavy components with loading fallbacks
const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse bg-gray-700 h-[350px] rounded-lg"></div>
  ),
});

const MyBarChartComponent = dynamic(() => import("./BarGraph"), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse bg-gray-700 h-[350px] rounded-lg"></div>
  ),
});

// Split into smaller components for better performance
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

const TraitItem = memo(({ trait, selectedTrait, onSelect, i, t }) => (
  <div
    className="flex flex-col items-center gap-2 cursor-pointer group"
    onClick={() => onSelect("trait", trait?.key)}
  >
    <ReactTltp variant="trait" content={trait} id={`${trait?.key}-${i}`} />
    <div className="relative aspect-square w-full max-w-[96px] transition-transform duration-200 group-hover:scale-105">
      <OptimizedImage
        alt={trait?.name}
        width={96}
        height={96}
        src={trait?.imageUrl}
        className="w-full h-full object-cover rounded-lg"
        data-tooltip-id={`${trait?.key}-${i}`}
        loading="lazy"
      />
      {trait?.key === selectedTrait && (
        <div className="absolute inset-0 bg-[#00000080] rounded-lg flex items-center justify-center">
          <IoMdCheckmarkCircle className="text-[#86efac] text-4xl z-50" />
        </div>
      )}
    </div>
    <span className="hidden lg:block text-sm md:text-base text-[#D9A876] bg-[#1b1a32] px-3 py-1 rounded-full truncate max-w-full">
      {trait?.name}
    </span>
  </div>
));

const ForceItem = memo(({ force, selectedTrait, onSelect, i, t }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex flex-col items-center gap-2 cursor-pointer group"
      onClick={() => onSelect("force", force?.key)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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

const SkillTreeItem = memo(({ skill, selectedSkillTree, onSelect, i }) => (
  <div
    className="flex flex-col items-center gap-1 cursor-pointer group max-w-[70px] md:max-w-[96px]"
    onClick={() => onSelect("skillTree", skill?.key)}
  >
    <ReactTltp
      variant="skillTree"
      content={skill}
      id={`skill-${skill?.key}-${i}`}
    />
    <div className="relative aspect-square w-full transition-transform duration-200 group-hover:scale-105">
      <div className="bg-gradient-to-br from-[#232339] to-[#1a1a2a] p-1 rounded-lg border border-white/10 hover:border-white/30 transition-all duration-200 w-full h-full flex items-center justify-center">
        <OptimizedImage
          alt={skill?.name || "Skill"}
          width={80}
          height={80}
          src={skill?.imageUrl}
          className="w-[80%] h-[80%] object-cover rounded-md"
          data-tooltip-id={`skill-${skill?.key}-${i}`}
          loading="lazy"
        />
      </div>
      {skill?.key === selectedSkillTree && (
        <div className="absolute inset-0 bg-[#00000080] rounded-lg flex items-center justify-center">
          <IoMdCheckmarkCircle className="text-[#86efac] text-3xl z-50" />
        </div>
      )}
    </div>
    <span className="hidden lg:block text-xs truncate max-w-full text-center text-[#cccccc]">
      {skill?.name}
    </span>
  </div>
));

const ItemIcon = memo(({ item, selectedItem, onSelect, i }) => (
  <div
    className="flex flex-col items-center gap-2 cursor-pointer group max-w-[84px]"
    onClick={() => onSelect("item", item?.key)}
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
      />
      {item?.key === selectedItem && (
        <div className="absolute inset-0 bg-[#00000080] rounded-lg flex items-center justify-center">
          <IoMdCheckmarkCircle className="text-[#86efac] text-5xl z-50" />
        </div>
      )}
    </div>
  </div>
));

const ChampionWithItems = memo(
  ({ champion, champions, items, forces, tier }) => {
    if (!champion) return null;

    const championDetails = champions?.find((c) => c.key === champion?.key);
    if (!championDetails) return null;

    return (
      <div className="flex flex-col items-center gap-x-4 flex-grow basis-0 min-w-[65px] md:min-w-[80px] max-w-[78px] md:max-w-[150px]">
        {/* <p
          className="ellipsis text-center text-[12px] md:text-[16px] leading-[14px] text-[#D9A876] font-extralight w-full p-[2px] m-0"
          style={{
            textShadow:
              "rgb(0, 0, 0) -1px 0px 2px, rgb(0, 0, 0) 0px 1px 2px, rgb(0, 0, 0) 1px 0px 2px, rgb(0, 0, 0) 0px -1px 2px",
          }}
        >
          {championDetails.name}
        </p> */}

        <div className="inline-flex items-center justify-center flex-col">
          <div className="flex flex-col w-full aspect-square rounded-[20px]">
            <div
              className="relative inline-flex rounded-[10px]"
              data-tooltip-id={championDetails.key}
            >
              <CardImage
                src={championDetails}
                imgStyle="!w-28"
                forces={forces}
                tier={tier}
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
          {champion?.items?.map((item, idx) => {
            const itemDetails = items?.find((i) => i.key === item);
            if (!itemDetails) return null;

            return (
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
            );
          })}
        </div>
      </div>
    );
  }
);

const AugmentIcon = memo(({ augment, augments }) => {
  const augmentDetails = augments?.find((a) => a.key === augment);
  if (!augmentDetails) return null;

  return (
    <div className="flex justify-center items-center relative">
      <OptimizedImage
        alt={augmentDetails.name || "Augment"}
        width={80}
        height={80}
        src={augmentDetails.imageUrl}
        className="w-full h-full"
        data-tooltip-id={augment}
        loading="lazy"
      />
      <ReactTltp variant="augment" content={augmentDetails} id={augment} />
    </div>
  );
});

const SkillTreeIcon = memo(({ skillTree, skills }) => {
  const skillDetails = skills?.find((s) => s.key === skillTree);
  if (!skillDetails) return null;

  return (
    <div className="flex justify-center items-center relative">
      <div className="bg-gradient-to-br from-[#232339] to-[#1a1a2a] p-1 rounded-lg border border-white/10 hover:border-white/30 transition-all duration-200 hover:shadow-lg hover:-translate-y-[2px] cursor-pointer">
        <OptimizedImage
          alt={skillDetails.name || "Skill"}
          width={80}
          height={80}
          src={skillDetails.imageUrl}
          className="w-8 h-8 md:w-10 md:h-10 rounded-md"
          data-tooltip-id={skillTree}
          loading="lazy"
        />
      </div>
      <ReactTltp variant="skillTree" content={skillDetails} id={skillTree} />
    </div>
  );
});

// Extracted to reduce render calculations and improve memoization
const DeckHeader = memo(
  ({ metaDeck, forces, traits, toggleClosed, isClosed, i, skills }) => {
    // Add hover state management for force icons
    const [hoveredForce, setHoveredForce] = useState(null);

    return (
      <header className="relative flex md:flex-col justify-between items-end py-[15px] pl-3 md:pl-4 pr-3 md:pr-[36px] lg:min-h-[50px] lg:flex-row lg:items-center lg:py-[5px] lg:pr-[16px]">
        <div className="inline-flex flex-col flex-wrap gap-[8px] md:flex-row md:items-center md:gap-[4px]">
          <strong className="text-[26px] font-semibold leading-none text-[#F2A03D]">
            {metaDeck?.name}
          </strong>
          <span className="flex justify-center items-center">
            {metaDeck?.deck?.forces?.map((force, i) => {
              const forceDetails = forces?.find(
                (t) => t.key.toLowerCase() === force?.key.toLowerCase()
              );
              if (!forceDetails) return null;

              return (
                <div
                  key={i}
                  className="flex justify-center items-center bg-[#000] rounded-full mx-1 pr-2 border-[1px] border-[#ffffff50]"
                  onMouseEnter={() => setHoveredForce(force?.key)}
                  onMouseLeave={() => setHoveredForce(null)}
                >
                  <ForceIcon
                    force={forceDetails}
                    size="custom"
                    customSize="w-[24px] h-[24px] md:w-[40px] md:h-[40px]"
                    className="mr-1"
                    data-tooltip-id={`${force?.key}-${i}`}
                    isHovered={hoveredForce === force?.key}
                  />
                  <ReactTltp content={force?.key} id={`${force?.key}-${i}`} />
                  <span className="text-[18px]">{force?.numUnits}</span>
                </div>
              );
            })}
          </span>
        </div>
        <div className="inline-flex flex-shrink-0 gap-[22px] md:mt-0">
          <span className="flex justify-center gap-x-2 items-center">
            {metaDeck?.deck?.skillTree?.map((skill, i) => {
              const skillDetails = skills?.find((s) => s.key === skill);
              if (!skillDetails) return null;

              return (
                <SkillTreeIcon key={i} skillTree={skill} skills={skills} />
              );
            })}
          </span>
          <div className="inline-flex flex-wrap">
            {metaDeck?.deck?.traits?.map((trait, i) => {
              const traitDetails = traits?.find((t) => t.key === trait?.key);
              const tier = traitDetails?.tiers?.find(
                (t) => trait?.numUnits >= t?.min && trait?.numUnits <= t?.max
              );

              if (!traitDetails || !tier?.imageUrl) return null;

              return (
                <div
                  key={i}
                  className="relative w-[30px] h-[30px] md:w-[56px] md:h-[56px]"
                >
                  <OptimizedImage
                    alt={traitDetails.name || "Trait"}
                    width={50}
                    height={50}
                    src={tier.imageUrl}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover object-center w-[30px] md:w-[56px]"
                    data-tooltip-id={traitDetails.key}
                    loading="lazy"
                  />
                  <ReactTltp
                    variant="trait"
                    id={traitDetails.key}
                    content={{
                      ...traitDetails,
                      numUnits: trait?.numUnits,
                    }}
                  />
                </div>
              );
            })}
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

// Virtualize the meta deck rendering for better performance
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
    // Avoid re-creating the handler function on every render
    const toggleClosed = useCallback(
      (e) => {
        handleIsClosed(e);
      },
      [handleIsClosed]
    );

    // Add intersection observer for lazy rendering
    const deckRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            // Once visible, no need to observe anymore
            if (deckRef.current) observer.unobserve(deckRef.current);
          }
        },
        { threshold: 0.1 }
      );

      if (deckRef.current) {
        observer.observe(deckRef.current);
      }

      return () => {
        if (deckRef.current) observer.unobserve(deckRef.current);
      };
    }, []);

    return (
      <div
        ref={deckRef}
        key={i}
        className="flex flex-col gap-[1px] !border border-[#6936ff]/30 rounded-lg overflow-hidden shadow-lg bg-[#00000099] mb-4"
        style={{
          background: "rgba(0, 0, 0, 0.6)",
          // backdropFilter: "blur(2px)",
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

        {!isClosed[i] && isVisible && (
          <div className="flex flex-col bg-center bg-no-repeat mt-[-1px]">
            <div className="flex min-h-[150px] flex-col justify-between items-center bg-[#111111] py-[16px] lg:flex-row lg:gap-[15px] lg:py-[0px] xl:px-6">
              <div className="mb-[16px] max-w-[342px] lg:mb-0 lg:w-full lg:max-w-[80%] lg:flex-shrink-0">
                <div className="flex flex-wrap justify-center lg:justify-center gap-2 w-full">
                  {metaDeck?.deck?.champions.map((champion, i) => (
                    <ChampionWithItems
                      key={i}
                      champion={champion}
                      champions={champions}
                      items={items}
                      forces={forces}
                      tier={champion.tier}
                    />
                  ))}
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
                    {metaDeck?.deck?.augments.map((augment, i) => (
                      <AugmentIcon
                        key={i}
                        augment={augment}
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

                <div className="hidden md:flex md:flex-col justify-center gap-[2px] lg:py-[8px]">
                  {metaDeck?.deck?.augments.map((augment, i) => (
                    <div
                      key={i}
                      className="flex justify-center items-center md:w-[64px] relative"
                    >
                      <AugmentIcon augment={augment} augments={augments} />
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
                      <p className="text-center mb-0 text-[11px] md:text-[14px] font-medium leading-5 text-[#999]">
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

// Optimize MetaTrendsItems to reduce unnecessary renders
const MetaTrendsItems = () => {
  const { t } = useTranslation();
  const others = t("others");
  const [selectedChampion, setSelectedChampion] = useState(null);
  const [selectedTrait, setSelectedTrait] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedSkillTree, setSelectedSkillTree] = useState(null);
  const [isClosed, setIsClosed] = useState({});
  const [activeTab, setActiveTab] = useState("Champions");
  const [visibleDecks, setVisibleDecks] = useState(10); // For virtualization

  // Extract data once from the JSON structure - heavily memoized
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
        metaDecks: data?.metaDeckList?.metaDecks || [],
        champions: data?.refs?.champions || [],
        items: data?.refs?.items || [],
        traits: data?.refs?.traits || [],
        augments: data?.refs?.augments || [],
        forces: data?.refs?.forces || [],
        skillTree: data?.refs?.skillTree || [],
      };
    }, []);

  // State for filtered comps data
  const [compsData, setCompsData] = useState(metaDecks);

  // Load more items when user scrolls to bottom
  const loadMoreDecks = useCallback(() => {
    setVisibleDecks((prev) => Math.min(prev + 10, compsData.length));
  }, [compsData.length]);

  // Setup intersection observer for infinite scroll
  const observerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleDecks < compsData.length) {
          loadMoreDecks();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [loadMoreDecks, visibleDecks, compsData.length]);

  // Optimized shuffle function that runs only ONCE (using a ref)
  const shuffleRef = useRef(null);
  const shuffle = useCallback((array) => {
    if (!array || !array.length) return [];

    // If we've already shuffled, return the cached result
    if (shuffleRef.current && shuffleRef.current.has(array)) {
      return shuffleRef.current.get(array);
    }

    // Otherwise, perform the shuffle
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }

    // Cache the result
    if (!shuffleRef.current) {
      shuffleRef.current = new WeakMap();
    }
    shuffleRef.current.set(array, newArray);

    return newArray;
  }, []);

  // Store processed champion data in a ref to prevent regeneration on clicks
  const processedChampionsRef = useRef(null);

  // Pre-process and memoize champion data - run only once
  const { filteredChampions, groupedArray } = useMemo(() => {
    // If we already have processed champions, return them
    if (processedChampionsRef.current) {
      return processedChampionsRef.current;
    }

    if (!champions || !champions.length) {
      return { filteredChampions: [], groupedArray: [] };
    }

    // Group champions by type with a Map for better performance
    const championsByType = new Map();
    champions.forEach((champion) => {
      if (!champion.type) return;

      if (!championsByType.has(champion.type)) {
        championsByType.set(champion.type, []);
      }
      championsByType.get(champion.type).push(champion);
    });

    // For each type, shuffle the group and keep only 2 champions
    const filtered = [];
    for (const [_, group] of championsByType) {
      const selected = shuffle([...group]).slice(0, 2);
      filtered.push(...selected);
    }

    // Function to arrange champions by cost using a Map for better performance
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

    const result = {
      filteredChampions: filtered,
      groupedArray: Array.from(groupedByCost.values()),
    };

    // Store the result to prevent recalculation
    processedChampionsRef.current = result;

    return result;
  }, [champions, shuffle]);

  // Update selected status in grouped array without reshuffling
  const championsWithSelection = useMemo(() => {
    if (!groupedArray.length) return groupedArray;

    // Update only the selected status, without changing the order
    return groupedArray.map((costGroup) =>
      costGroup.map((champion) => ({
        ...champion,
        selected: champion.key === selectedChampion,
      }))
    );
  }, [groupedArray, selectedChampion]);

  // Memoize the filtered items list - avoid filter on every render
  const filteredItems = useMemo(() => {
    return items?.filter((item) => !item?.isFromItem) || [];
  }, [items]);

  // Consolidated handler for changing filters with proper memoization
  const handleFilterChange = useCallback(
    (type, key) => {
      if (!metaDecks?.length) return;

      let newCompsData;

      if (type === "trait") {
        if (selectedTrait === key) {
          setSelectedTrait(null);
          newCompsData = metaDecks;
        } else {
          setSelectedTrait(key);
          newCompsData = metaDecks.filter((deck) =>
            deck.deck.traits.some((trait) => trait.key === key)
          );
        }
        setSelectedChampion(null);
        setSelectedItem(null);
        setSelectedSkillTree(null);
      } else if (type === "force") {
        if (selectedTrait === key) {
          setSelectedTrait(null);
          newCompsData = metaDecks;
        } else {
          setSelectedTrait(key);
          newCompsData = metaDecks.filter((deck) =>
            deck.deck.forces.some(
              (force) => force.key.toLowerCase() === key.toLowerCase()
            )
          );
        }
        setSelectedChampion(null);
        setSelectedItem(null);
        setSelectedSkillTree(null);
      } else if (type === "champion") {
        if (selectedChampion === key) {
          setSelectedChampion(null);
          newCompsData = metaDecks;
        } else {
          setSelectedChampion(key);
          newCompsData = metaDecks.filter((deck) =>
            deck.deck.champions.some((champion) => champion.key === key)
          );
        }
        setSelectedTrait(null);
        setSelectedItem(null);
        setSelectedSkillTree(null);
      } else if (type === "item") {
        if (selectedItem === key) {
          setSelectedItem(null);
          newCompsData = metaDecks;
        } else {
          setSelectedItem(key);
          newCompsData = metaDecks.filter((deck) =>
            deck.deck.champions.some(
              (champion) =>
                champion.items && champion.items.some((item) => item === key)
            )
          );
        }
        setSelectedChampion(null);
        setSelectedTrait(null);
        setSelectedSkillTree(null);
      } else if (type === "skillTree") {
        if (selectedSkillTree === key) {
          setSelectedSkillTree(null);
          newCompsData = metaDecks;
        } else {
          setSelectedSkillTree(key);
          newCompsData = metaDecks.filter((deck) =>
            deck.deck?.skillTree?.includes(key)
          );
        }
        setSelectedChampion(null);
        setSelectedTrait(null);
        setSelectedItem(null);
      }

      setCompsData(newCompsData);
      // Reset visible decks when filter changes
      setVisibleDecks(10);
    },
    [
      metaDecks,
      selectedChampion,
      selectedItem,
      selectedTrait,
      selectedSkillTree,
    ]
  );

  // Optimized function with useCallback to avoid recreation on every render
  const handleIsClosed = useCallback((event) => {
    const buttonId = event.currentTarget.id;
    setIsClosed((prev) => ({ ...prev, [buttonId]: !prev[buttonId] }));
  }, []);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  // Memoize tab content to prevent recalculation
  const handleTabContent = useMemo(() => {
    switch (activeTab) {
      case "Champions":
        return (
          <MetaTrendsCard
            itemCount={13}
            championsByCost={championsWithSelection}
            setSelectedChampion={(key) => handleFilterChange("champion", key)}
            forces={forces}
          />
        );
      case "Traits":
        return (
          <div className="p-3 md:p-6 bg-[#1a1b30] rounded-lg">
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row items-center gap-4">
                <div className="p-1 rounded-lg text-[#D9A876] font-semibold text-center min-w-[100px]">
                  {others?.origin}
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 w-full">
                  {traits?.map((trait, i) => (
                    <TraitItem
                      key={i}
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
                      key={i}
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
          <div className="p-3 md:p-6 bg-[#1a1b30] rounded-lg">
            <div className="grid grid-cols-5 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:!flex justify-center xl:!flex-wrap gap-2 lg:gap-4">
              {filteredItems.map((item, i) => (
                <ItemIcon
                  key={i}
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
          <div className="p-3 md:p-6 bg-[#1a1b30] rounded-lg">
            <div className="flex flex-wrap justify-center gap-2 mx-auto w-full">
              {skillTree
                // ?.slice(0, 13)
                ?.filter((skill) => skill?.imageUrl)
                ?.map((skill, i) => (
                  <SkillTreeItem
                    key={i}
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
    championsWithSelection,
    handleFilterChange,
    forces,
    traits,
    skillTree,
    selectedTrait,
    selectedSkillTree,
    filteredItems,
    selectedItem,
    others,
    t,
  ]);

  return (
    <div className="mx-auto md:px-0 lg:px-0 py-6">
      <div className="space-y-6">
        <div>
          <div className="">
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
                  label={others?.skillTree || "Skill Tree"}
                  onClick={() => handleTabChange("SkillTree")}
                />
              </div>
            </div>

            {/* Content Sections */}
            <div className="rounded-lg shadow-lg">{handleTabContent}</div>
          </div>
        </div>

        {/* Results Section with Virtualization */}
        <div className="space-y-4">
          {compsData.slice(0, visibleDecks).map((metaDeck, i) => (
            <MetaDeck
              key={i}
              metaDeck={metaDeck}
              i={i}
              isClosed={isClosed}
              handleIsClosed={handleIsClosed}
              champions={champions}
              items={items}
              traits={traits}
              forces={forces}
              augments={augments}
              others={others}
              skills={skillTree}
            />
          ))}

          {/* Loading indicator and observer reference for infinite scroll */}
          {visibleDecks < compsData.length && (
            <div
              ref={observerRef}
              className="animate-pulse bg-gray-800 h-[80px] rounded-lg flex items-center justify-center text-gray-400"
            >
              Loading more...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(MetaTrendsItems);

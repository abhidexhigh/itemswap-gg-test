import { useTranslation } from "react-i18next";
import Link from "next/link";
import "../../../../../i18n";
import React, { useState, useCallback, useMemo, memo, useEffect } from "react";
import { Tooltip } from "react-tooltip";
import moment from "moment";
import TraitTooltip from "src/components/tooltip/TraitTooltip";
import "react-tooltip/dist/react-tooltip.css";
import GirlCrush from "@assets/image/traits/GirlCrush.svg";
import RecentDecksCard from "../RecentDecksCard/RecentDecksCard";
import MetaTrendsCard from "../../MetaTrends/MetaTrendsCard/MetaTrendsCard";
import { PiEye, PiEyeClosed } from "react-icons/pi";
import { IoMdCheckmarkCircle } from "react-icons/io";
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
const TabButton = memo(({ active, label, onClick }) => (
  <button
    type="button"
    className={`px-6 py-3 text-sm md:text-base font-medium transition-colors duration-200 ${
      active ? "bg-[#ffffff] text-[#111111]" : "text-white hover:bg-[#ffffff20]"
    }`}
    onClick={onClick}
  >
    {label}
  </button>
));

// Trait item component
const TraitItem = memo(({ trait, selectedTrait, onSelect, i, t }) => (
  <div
    className="flex flex-col items-center gap-2 cursor-pointer group"
    onClick={() => onSelect("trait", trait?.key)}
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
));

// Force item component
const ForceItem = memo(({ force, selectedTrait, onSelect, i, t }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = useCallback(() => {
    onSelect("force", force?.key);
  }, [onSelect, force?.key]);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

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

// Item icon component
const ItemIcon = memo(({ item, selectedItem, onSelect, i }) => (
  <div
    className="flex flex-col items-center gap-2 cursor-pointer group max-w-[84px]"
    onClick={() => onSelect("item", item?.key)}
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
      {item?.key === selectedItem && (
        <div className="absolute inset-0 bg-[#00000080] rounded-lg flex items-center justify-center">
          <IoMdCheckmarkCircle className="text-[#86efac] text-5xl z-50" />
        </div>
      )}
    </div>
  </div>
));

// Champion with items component
const ChampionWithItems = memo(
  ({ champion, champions, items, forces, tier }) => {
    if (!champion) return null;

    const championDetails = champions?.find((c) => c.key === champion?.key);
    if (!championDetails) return null;

    return (
      <div className="flex flex-col items-center gap-x-4 flex-grow basis-0 min-w-[65px] md:min-w-[80px] max-w-[78px] md:max-w-[150px]">
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

// Deck header component
const DeckHeader = memo(
  ({ metaDeck, forces, traits, toggleClosed, isClosed, i, skills }) => {
    // Add hover state management for force icons
    const [hoveredForce, setHoveredForce] = useState(null);

    return (
      <header className="relative flex flex-col md:flex-col justify-between items-start md:items-end bg-[#111111] py-[15px] pl-3 md:pl-4 pr-3 md:pr-[36px] lg:min-h-[50px] lg:flex-row lg:items-center lg:py-[5px] lg:pr-[16px]">
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
          {/* Desktop force icons with count and border */}
          <span className="hidden md:flex justify-start md:justify-center items-center">
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
                    customSize="w-[30px] h-[30px] md:w-[40px] md:h-[40px]"
                    className="mr-1"
                    data-tooltip-id={`${force?.key}-${i}`}
                  />
                  <ReactTltp content={force?.key} id={`${force?.key}-${i}`} />
                  <span className="text-[18px]">{force?.numUnits}</span>
                </div>
              );
            })}
          </span>
        </div>
        {/* Mobile: Single row with force icons and skill tree */}
        <div className="flex md:hidden flex-col gap-y-2 mt-3 w-full">
          {/* First row: Force icons and skill tree */}
          <div className="flex items-center gap-x-2 w-full overflow-x-auto scrollbar-hide">
            {/* Force icons only (no background, border, count) */}
            {metaDeck?.deck?.forces?.map((force, i) => {
              const forceDetails = forces?.find(
                (t) => t.key.toLowerCase() === force?.key.toLowerCase()
              );
              if (!forceDetails) return null;

              return (
                <div
                  key={i}
                  className="flex-shrink-0 w-[30px] h-[30px]"
                  onMouseEnter={() => setHoveredForce(force?.key)}
                  onMouseLeave={() => setHoveredForce(null)}
                >
                  <ForceIcon
                    force={forceDetails}
                    size="custom"
                    customSize="w-full h-full"
                    className="aspect-square"
                    data-tooltip-id={`${force?.key}-${i}`}
                  />
                  <ReactTltp content={force?.key} id={`${force?.key}-${i}`} />
                </div>
              );
            })}
            {/* Vertical divider */}
            {metaDeck?.deck?.forces?.length > 0 &&
              metaDeck?.deck?.skillTree?.length > 0 && (
                <div className="flex-shrink-0 h-8 w-px bg-[#ffffff30] mx-1"></div>
              )}
            {/* Skill tree icons */}
            {metaDeck?.deck?.skillTree &&
              metaDeck?.deck?.skillTree.length > 0 &&
              metaDeck?.deck?.skillTree?.map((skill, i) => {
                const skillDetails = skills?.find((s) => s.key === skill);
                if (!skillDetails) return null;

                return (
                  <div key={i} className="flex-shrink-0">
                    <SkillTreeIcon
                      skillTree={skill}
                      skills={skills}
                      size="default"
                    />
                  </div>
                );
              })}
          </div>
          {/* Second row: Traits */}
          {metaDeck?.deck?.traits && metaDeck?.deck?.traits.length > 0 && (
            <div className="flex items-center gap-x-1 w-full overflow-x-auto scrollbar-hide">
              {metaDeck?.deck?.traits?.map((trait, i) => {
                const traitDetails = traits?.find((t) => t.key === trait?.key);
                const tier = traitDetails?.tiers?.find(
                  (t) => trait?.numUnits >= t?.min && trait?.numUnits <= t?.max
                );

                if (!traitDetails || !tier?.imageUrl) return null;

                return (
                  <div key={i} className="flex-shrink-0">
                    {/* <OptimizedImage
                        alt={traitDetails.name || "Trait"}
                        width={50}
                        height={50}
                        src={tier.imageUrl}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover object-center w-[36px]"
                        data-tooltip-id={`mobile-trait-${traitDetails.key}-${i}`}
                        loading="lazy"
                      /> */}
                    <TraitImage
                      trait={traitDetails}
                      size="small"
                      className="w-[36px] h-[36px]"
                      data-tooltip-id={`mobile-trait-${traitDetails.key}-${i}`}
                    />
                    <ReactTltp
                      variant="trait"
                      id={`mobile-trait-${traitDetails.key}-${i}`}
                      content={{
                        ...traitDetails,
                        numUnits: trait?.numUnits,
                      }}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {/* Desktop layout */}
        <div className="hidden md:inline-flex flex-shrink-0 justify-between gap-1 mt-3 md:mt-0">
          {metaDeck?.deck?.skillTree &&
            metaDeck?.deck?.skillTree.length > 0 && (
              <span className="flex justify-center gap-x-1 items-center">
                {metaDeck?.deck?.skillTree?.map((skill, i) => {
                  const skillDetails = skills?.find((s) => s.key === skill);
                  if (!skillDetails) return null;

                  return (
                    <SkillTreeIcon
                      key={i}
                      skillTree={skill}
                      skills={skills}
                      size="medium"
                    />
                  );
                })}
              </span>
            )}
          <div className="flex flex-wrap gap-1 md:gap-0 md:inline-flex md:flex-wrap justify-start md:justify-end md:mr-0">
            {metaDeck?.deck?.traits?.map((trait, i) => {
              const traitDetails = traits?.find((t) => t.key === trait?.key);
              const tier = traitDetails?.tiers?.find(
                (t) => trait?.numUnits >= t?.min && trait?.numUnits <= t?.max
              );

              if (!traitDetails || !tier?.imageUrl) return null;

              return (
                <div
                  key={i}
                  className="relative w-[38px] h-[38px] md:w-[56px] md:h-[56px]"
                >
                  <OptimizedImage
                    alt={traitDetails.name || "Trait"}
                    width={50}
                    height={50}
                    src={tier.imageUrl}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover object-center w-[38px] md:w-[56px]"
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
              className="inline-flex w-[16px] cursor-pointer items-center text-white"
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

// Meta deck component
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
    // Avoid re-creating the handler function on every render
    const toggleClosed = useCallback(
      (e) => {
        handleIsClosed(e);
      },
      [handleIsClosed]
    );

    return (
      <div
        className="flex flex-col gap-[1px] !border border-[#ffffff4d] rounded-lg overflow-hidden shadow-lg bg-[#00000099] mb-4"
        style={{
          background: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(2px)",
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

        {!isClosed[i] && (
          <div className="flex flex-col bg-center bg-no-repeat mt-[-1px]">
            <div className="flex min-h-[150px] flex-col justify-between items-center bg-[#111111] py-[16px] lg:flex-row lg:gap-[15px] lg:py-[0px] xl:px-6">
              <div className="flex items-center gap-x-8">
                <div className="hidden md:flex md:flex-col justify-center gap-[2px] lg:py-[8px]">
                  {metaDeck?.deck?.augments?.map((augment, i) => (
                    <AugmentIcon
                      key={i}
                      augment={augment}
                      augments={augments}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-[16px] max-w-[342px] lg:mb-0 lg:w-full lg:max-w-[93%] lg:flex-shrink-0">
                <div className="flex flex-wrap justify-center lg:justify-center gap-2 w-full">
                  {metaDeck?.deck?.champions?.map((champion, i) => (
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
            </div>
          </div>
        )}
      </div>
    );
  }
);

// SkillTreeItem component (used in the filter section)
const SkillTreeItem = memo(({ skill, selectedSkillTree, onSelect, i }) => {
  const handleClick = useCallback(() => {
    onSelect("skillTree", skill?.key);
  }, [onSelect, skill?.key]);

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

const RecentDecksItems = () => {
  const { t } = useTranslation();
  const others = t("others");
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

  // Extract data once from the JSON structure using useMemo
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

  // Memoized shuffle function
  const shuffle = useCallback((array) => {
    if (!array || !array.length) return [];
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }, []);

  // Pre-process and memoize champion data
  const { filteredChampions, groupedArray } = useMemo(() => {
    if (!champions || !champions.length) {
      return { filteredChampions: [], groupedArray: [] };
    }

    // Group champions by type
    const championsByType = {};
    champions.forEach((champion) => {
      if (!championsByType[champion.type]) {
        championsByType[champion.type] = [];
      }
      championsByType[champion.type].push(champion);
    });

    // For each type, shuffle the group and keep only 2 champions
    const filtered = [];
    for (const type in championsByType) {
      const group = championsByType[type];
      const selected = shuffle([...group]).slice(0, 2);
      filtered.push(...selected);
    }

    // Function to arrange champions by cost
    const groupedByCost = filtered.reduce((acc, champion) => {
      const { cost } = champion;
      if (!acc[cost]) {
        acc[cost] = [];
      }
      acc[cost].push({
        ...champion,
        selected: champion.key === selectedChampion,
      });
      return acc;
    }, {});

    return {
      filteredChampions: filtered,
      groupedArray: Object.values(groupedByCost),
    };
  }, [champions, shuffle, selectedChampion]);

  // Memoize the filtered items list
  const filteredItems = useMemo(() => {
    return items?.filter((item) => !item?.isFromItem) || [];
  }, [items]);

  // Optimized filter change handler with proper memoization
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
            deck.deck?.traits?.some((trait) => trait.key === key)
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
            deck.deck?.forces?.some(
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
            deck.deck?.champions?.some((champion) => champion.key === key)
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
            deck.deck?.champions?.some(
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

  // Stable handler for traits sub-tab changes
  const handleTraitsSubTabChange = useCallback((subTab) => {
    setActiveTraitsSubTab(subTab);
  }, []);

  // Stable handler for skills sub-tab changes
  const handleSkillsSubTabChange = useCallback((subTab) => {
    setActiveSkillsSubTab(subTab);
  }, []);

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

  // Memoize tab content to avoid unnecessary rerenders
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
        );
      case "Items":
        return (
          <div className="p-3 md:p-6 bg-[#111111] rounded-lg max-h-[184px] mb-8 overflow-y-auto scrollbar-hide">
            <div className="grid grid-cols-6 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:!flex justify-center xl:!flex-wrap gap-2 lg:gap-4">
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
          <div className="p-3 md:p-6 bg-[#111111] rounded-lg">
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
          <div className="inline-flex rounded-lg overflow-hidden border border-[#ffffff20] bg-[#111111]">
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

        {/* Results Section */}
        <div className="flex flex-col gap-[16px]">
          <div>
            {compsData?.map((metaDeck, i) => (
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

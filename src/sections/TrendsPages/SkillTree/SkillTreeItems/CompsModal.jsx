import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { IoMdClose, IoMdCheckmarkCircle } from "react-icons/io";
import ReactTltp from "src/components/tooltip/ReactTltp";
import CardImage from "src/components/cardImage";
import { OptimizedImage } from "../../../../utils/imageOptimizer";
import ForceIcon from "src/components/forceIcon";
import SkillTreeImage from "src/components/SkillTreeImage";
import TraitImage from "src/components/TraitImage/TraitImage";

// ChampionWithItems component for displaying champions in the comps modal
export const ChampionWithItems = ({
  champion,
  champions,
  items,
  forces,
  tier,
}) => {
  if (!champion) return null;

  const championDetails = champions?.find((c) => c.key === champion?.key);
  if (!championDetails) return null;

  return (
    <div className="flex flex-col items-center gap-x-2 sm:gap-x-4 flex-grow basis-0 min-w-[78px] sm:min-w-[65px] md:min-w-[80px] max-w-[70px] sm:max-w-[78px] md:max-w-[150px]">
      <div className="inline-flex items-center justify-center flex-col">
        <div className="flex flex-col w-full aspect-square rounded-[20px]">
          <div
            className="relative inline-flex rounded-[10px]"
            data-tooltip-id={championDetails.key}
          >
            <CardImage
              src={championDetails}
              imgStyle="sm:!w-20 md:!w-32"
              forces={forces}
              tier={tier}
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
              className="relative z-0 hover:z-20 !border !border-[#ffffff20] aspect-square rounded-lg"
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
                className="w-[17px] sm:w-[20px] md:w-[28px] rounded-lg hover:scale-150 transition-all duration-300"
                data-tooltip-id={itemDetails.key}
                loading="lazy"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

// SkillTreeIcon component for displaying skill tree in the comps modal
export const SkillTreeIcon = ({ skillTree, skills, size = "small" }) => {
  const skillDetails = skills?.find((s) => s.key === skillTree);
  if (!skillDetails) return null;

  return (
    <SkillTreeImage skill={skillDetails} size={size} tooltipId={skillTree} />
  );
};

// CompCard component to display a single comp in the modal
export const CompCard = ({
  comp,
  champions,
  items,
  forces,
  skillTree,
  traits,
  others,
}) => {
  if (!comp) return null;

  // Add hover state management for force icons
  const [hoveredForce, setHoveredForce] = useState(null);

  return (
    <div className="flex flex-col gap-[1px] !border border-[#FFFFFF]/30 rounded-lg overflow-hidden shadow-lg bg-[#00000099] mb-2 sm:mb-4">
      {/* Comp Header */}
      <header className="relative flex flex-col md:flex-col justify-between items-start md:items-end py-[15px] pl-3 md:pl-4 pr-3 md:pr-[36px] lg:min-h-[50px] lg:flex-row lg:items-center lg:py-[5px] lg:pr-[16px]">
        <div className="inline-flex flex-col flex-wrap gap-[8px] w-full md:w-auto md:flex-row md:items-center md:gap-[4px]">
          <strong className="text-[26px] font-semibold leading-none text-[#F2A03D] text-center md:text-left">
            {comp?.name}
          </strong>
          {/* Desktop force icons with count and border */}
          <span className="hidden md:flex justify-start md:justify-center items-center">
            {comp.deck?.forces?.map((force, i) => {
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
                    data-tooltip-id={`force-${force?.key}-${i}`}
                    isHovered={hoveredForce === force?.key}
                  />
                  <ReactTltp
                    content={force?.key}
                    id={`force-${force?.key}-${i}`}
                  />
                  <span className="text-[18px]">{force?.numUnits}</span>
                </div>
              );
            })}
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
          <div className="flex items-center gap-x-2 w-fit overflow-x-auto scrollbar-hide !border !border-[#ffffff40] rounded-lg p-1">
            {/* Force icons only (no background, border, count) */}
            {comp.deck?.forces?.map((force, i) => {
              const forceDetails = forces?.find(
                (t) => t.key.toLowerCase() === force?.key.toLowerCase()
              );
              if (!forceDetails) return null;

              return (
                <div
                  key={i}
                  className="flex-shrink-0 w-[24px] h-[24px]"
                  onMouseEnter={() => setHoveredForce(force?.key)}
                  onMouseLeave={() => setHoveredForce(null)}
                >
                  <ForceIcon
                    force={forceDetails}
                    size="custom"
                    customSize="w-full h-full"
                    className="aspect-square"
                    data-tooltip-id={`force-${force?.key}-${i}`}
                    isHovered={hoveredForce === force?.key}
                  />
                  <ReactTltp
                    content={force?.key}
                    id={`force-${force?.key}-${i}`}
                  />
                </div>
              );
            })}
            {/* Vertical divider */}
            {comp.deck?.forces?.length > 0 &&
              comp.deck?.skillTree?.length > 0 && (
                <div className="flex-shrink-0 h-6 w-px bg-[#ffffff30] mx-1"></div>
              )}
            {/* Skill tree icons */}
            {comp.deck?.skillTree?.map((skill, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[24px] h-[24px] shadow-md rounded-full shadow-[#ffffff20]"
              >
                <SkillTreeIcon skillTree={skill} skills={skillTree} />
              </div>
            ))}
          </div>
          {/* Second row: Traits */}
          {comp.deck?.traits && comp.deck?.traits.length > 0 && (
            <div className="flex items-center gap-x-1 w-fit overflow-x-auto scrollbar-hide">
              {comp.deck?.traits?.map((trait, i) => {
                const traitDetails = traits?.find((t) => t.key === trait?.key);
                const tier = traitDetails?.tiers?.find(
                  (t) => trait?.numUnits >= t?.min && trait?.numUnits <= t?.max
                );

                if (!traitDetails || !tier?.imageUrl) return null;

                return (
                  <div key={i} className="flex-shrink-0">
                    <TraitImage
                      trait={{
                        ...traitDetails,
                        tier,
                        numUnits: trait?.numUnits,
                      }}
                      size="small"
                      className="w-[24px] h-[24px]"
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
        <div className="hidden md:inline-flex flex-shrink-0 justify-between gap-1 !gap-x-6 md:mt-1">
          <span className="flex justify-center gap-x-1 items-center">
            {comp.deck?.skillTree?.map((skill, i) => (
              <SkillTreeIcon
                key={i}
                skillTree={skill}
                skills={skillTree}
                size="large"
              />
            ))}
          </span>
          <div className="flex flex-wrap gap-1 md:gap-0 md:inline-flex md:flex-wrap justify-start md:justify-end md:mr-0">
            {comp.deck?.traits?.map((trait, i) => {
              const traitDetails = traits?.find((t) => t.key === trait?.key);
              const tier = traitDetails?.tiers?.find(
                (t) => trait?.numUnits >= t?.min && trait?.numUnits <= t?.max
              );

              if (!traitDetails || !tier?.imageUrl) return null;

              return (
                <div key={i} className="relative">
                  <TraitImage
                    trait={{ ...traitDetails, tier, numUnits: trait?.numUnits }}
                    size="default"
                    className="w-[38px] h-[38px] md:w-[48px] md:h-[48px]"
                    data-tooltip-id={`trait-${traitDetails.key}-${i}`}
                  />
                  <ReactTltp
                    variant="trait"
                    id={`trait-${traitDetails.key}-${i}`}
                    content={{
                      ...traitDetails,
                      numUnits: trait?.numUnits,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </header>
      <OptimizedImage
        src={
          "https://res.cloudinary.com/dg0cmj6su/image/upload/v1738605248/Frame_18_1_otofdu.png"
        }
        alt={"border"}
        width={300}
        height={300}
        className="w-[90%] mx-auto md:hidden"
      />

      {/* Comp Champions */}
      <div className="flex flex-col bg-center bg-no-repeat mt-[-1px]">
        <div className="flex min-h-[150px] flex-col justify-between items-center bg-[#111111] lg:flex-row lg:gap-[15px] lg:py-[0px] xl:px-6">
          <div className="mb-[16px] max-w-[342px] lg:mb-0 lg:w-full lg:max-w-[80%] lg:flex-shrink-0">
            <div className="flex flex-wrap justify-center lg:justify-center gap-2 w-full">
              {comp.deck?.champions.map((champion, i) => (
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

          <div className="flex justify-between w-full sm:w-[180px] bg-[#1D1D1D] rounded-[4px] p-3 sm:p-4">
            <dl className="flex flex-col justify-between mb-2 text-center">
              <dt className="text-sm sm:text-[14px] font-medium text-[#999]">
                {others?.top4}
              </dt>
              <dd className="text-lg sm:text-[14px] font-medium text-[#D9A876]">
                <span>{((comp.topRate * 100) / comp.plays).toFixed(2)}%</span>
              </dd>
            </dl>
            <dl className="flex flex-col justify-between mb-2 text-center">
              <dt className="text-sm sm:text-[14px] font-medium text-[#999]">
                {others?.winPercentage}
              </dt>
              <dd className="text-lg sm:text-[14px] font-medium text-[#D9A876]">
                <span>{((comp.winRate * 100) / comp.plays).toFixed(2)}%</span>
              </dd>
            </dl>
            <dl className="flex flex-col justify-between mb-2 text-center">
              <dt className="text-sm sm:text-[14px] font-medium text-[#999]">
                {others?.pickPercentage}
              </dt>
              <dd className="text-lg sm:text-[14px] font-medium text-[#D9A876]">
                <span>{(comp.pickRate * 100).toFixed(2)}%</span>
              </dd>
            </dl>
            <dl className="flex flex-col justify-between mb-2 text-center">
              <dt className="text-sm sm:text-[14px] font-medium text-[#999]">
                {others?.avgPlacement}
              </dt>
              <dd className="text-lg sm:text-[14px] font-medium text-[#D9A876]">
                <span>{comp.avgPlacement.toFixed(2)}</span>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Modal Component
const CompsModal = ({
  isOpen,
  onClose,
  selectedItem,
  comps,
  champions,
  items,
  forces,
  skillTree,
  traits,
  others,
}) => {
  if (!isOpen || !selectedItem) return null;

  // Skip rendering on the server-side
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  // Find the top 3 comps from the provided comps data
  const top3CompsNames = selectedItem.top3Comps || [];
  const top3Comps = comps
    .filter((comp) => top3CompsNames.includes(comp.name))
    .slice(0, 3);

  // Don't render anything if we're not in the browser
  if (!isBrowser) return null;

  // Use createPortal to render the modal directly to the document body
  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-1 sm:p-4"
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div className="relative bg-[#111111] rounded-lg w-[99%] sm:w-[98%] max-w-[1800px] h-[95vh] sm:h-[90vh] overflow-auto border border-[#2D2F37]">
        <div className="sticky top-0 z-10 bg-[#111111] p-3 sm:p-4 border-b border-[#2D2F37] flex justify-between items-center">
          <h2 className="text-base sm:text-xl font-semibold text-[#FFFFFF] truncate pr-2 mb-0">
            {others.top3} {others.comps} -{" "}
            {items.find((i) => i.key === selectedItem.key)?.name ||
              selectedItem.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-[#D9A876] text-xl sm:text-2xl transition-colors duration-200 flex-shrink-0"
          >
            <IoMdClose />
          </button>
        </div>

        <div className="p-2 sm:p-4 space-y-4 sm:space-y-6">
          {top3Comps.length > 0 ? (
            top3Comps.map((comp, index) => (
              <CompCard
                key={index}
                comp={comp}
                champions={champions}
                items={items}
                forces={forces}
                skillTree={skillTree}
                traits={traits}
                others={others}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-400">
              {others.noCompsFound || "No compositions found"}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CompsModal;

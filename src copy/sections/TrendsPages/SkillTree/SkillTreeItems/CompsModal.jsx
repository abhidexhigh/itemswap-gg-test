import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { IoMdClose, IoMdCheckmarkCircle } from "react-icons/io";
import ReactTltp from "src/components/tooltip/ReactTltp";
import CardImage from "src/components/cardImage";
import { OptimizedImage } from "../../../../utils/imageOptimizer";
import ForceIcon from "src/components/forceIcon";

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
export const SkillTreeIcon = ({ skillTree, skills }) => {
  const skillDetails = skills?.find((s) => s.key === skillTree);
  if (!skillDetails) return null;

  return (
    <div className="flex justify-center items-center relative">
      <div className="bg-gradient-to-br from-[#232339] to-[#1a1a2a] p-0.5 sm:p-1 rounded-lg border border-white/10 hover:border-white/30 transition-all duration-200 hover:shadow-lg hover:-translate-y-[2px] cursor-pointer">
        <OptimizedImage
          alt={skillDetails.name || "Skill"}
          width={80}
          height={80}
          src={skillDetails.imageUrl}
          className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-md"
          data-tooltip-id={skillTree}
          loading="lazy"
        />
      </div>
      <ReactTltp variant="skillTree" content={skillDetails} id={skillTree} />
    </div>
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

  return (
    <div className="flex flex-col gap-[1px] !border border-[#2D2F37] rounded-lg overflow-hidden shadow-lg bg-[#00000099] mb-2 sm:mb-4 hover:bg-[#0a0a0a] transition-colors duration-200">
      {/* Comp Header */}
      <header className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center p-2 sm:py-[15px] sm:pl-4 sm:pr-[16px] lg:min-h-[50px] bg-[#111111] border-b border-[#2D2F37]">
        <div className="inline-flex flex-col sm:flex-row items-start sm:items-center gap-[4px] sm:gap-[8px] mb-2 sm:mb-0">
          <strong className="text-lg sm:text-[26px] font-semibold leading-none text-[#D9A876]">
            {comp.name}
          </strong>
          <span className="flex flex-wrap justify-start items-center gap-1 sm:gap-0">
            {comp.deck?.forces?.map((force, i) => {
              const forceDetails = forces?.find(
                (t) => t.key.toLowerCase() === force?.key.toLowerCase()
              );
              if (!forceDetails) return null;

              return (
                <div
                  key={i}
                  className="flex justify-center items-center bg-[#000] rounded-full mx-1 pr-2 border-[1px] border-[#ffffff50]"
                >
                  <ForceIcon
                    force={forceDetails}
                    size="custom"
                    customSize="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px] md:w-[40px] md:h-[40px]"
                    className="mr-1"
                    data-tooltip-id={`force-${force?.key}-${i}`}
                  />
                  <ReactTltp
                    content={force?.key}
                    id={`force-${force?.key}-${i}`}
                  />
                  <span className="text-sm sm:text-[18px]">
                    {force?.numUnits}
                  </span>
                </div>
              );
            })}
          </span>
        </div>
        <div className="inline-flex gap-[10px] sm:gap-[22px]">
          <span className="flex justify-center gap-x-1 sm:gap-x-2 items-center">
            {comp.deck?.skillTree?.map((skill, i) => (
              <SkillTreeIcon key={i} skillTree={skill} skills={skillTree} />
            ))}
          </span>
          <div className="inline-flex flex-wrap">
            {comp.deck?.traits?.map((trait, i) => {
              const traitDetails = traits?.find((t) => t.key === trait?.key);
              const tier = traitDetails?.tiers?.find(
                (t) => t?.min >= trait?.numUnits
              );

              if (!traitDetails || !tier?.imageUrl) return null;

              return (
                <div
                  key={i}
                  className="relative w-[24px] h-[24px] sm:w-[30px] sm:h-[30px] md:w-[56px] md:h-[56px]"
                >
                  <OptimizedImage
                    alt={traitDetails.name || "Trait"}
                    width={50}
                    height={50}
                    src={tier.imageUrl}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover object-center w-[24px] sm:w-[30px] md:w-[56px]"
                    data-tooltip-id={`trait-${traitDetails.key}-${i}`}
                    loading="lazy"
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

      {/* Comp Champions */}
      <div className="flex flex-col sm:flex bg-center bg-no-repeat mt-[-1px]">
        <div className="flex flex-col sm:flex-row w-full min-h-[150px] justify-between items-center bg-[#111111] py-3 px-2 sm:py-4 sm:px-6 gap-3 sm:gap-4">
          <div className="flex-grow flex justify-center w-full">
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 w-full">
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

          <div className="flex-shrink-0 w-full sm:w-[180px] bg-[#1D1D1D] rounded-[4px] p-3 sm:p-4">
            <dl className="flex justify-between mb-2">
              <dt className="text-[12px] sm:text-[14px] font-medium text-[#999]">
                {others?.top4}
              </dt>
              <dd className="text-[12px] sm:text-[14px] font-medium text-[#D9A876]">
                <span>{((comp.topRate * 100) / comp.plays).toFixed(2)}%</span>
              </dd>
            </dl>
            <dl className="flex justify-between mb-2">
              <dt className="text-[12px] sm:text-[14px] font-medium text-[#999]">
                {others?.winPercentage}
              </dt>
              <dd className="text-[12px] sm:text-[14px] font-medium text-[#D9A876]">
                <span>{((comp.winRate * 100) / comp.plays).toFixed(2)}%</span>
              </dd>
            </dl>
            <dl className="flex justify-between mb-2">
              <dt className="text-[12px] sm:text-[14px] font-medium text-[#999]">
                {others?.pickPercentage}
              </dt>
              <dd className="text-[12px] sm:text-[14px] font-medium text-[#D9A876]">
                <span>{(comp.pickRate * 100).toFixed(2)}%</span>
              </dd>
            </dl>
            <dl className="flex justify-between">
              <dt className="text-[12px] sm:text-[14px] font-medium text-[#999]">
                {others?.avgPlacement}
              </dt>
              <dd className="text-[12px] sm:text-[14px] font-medium text-[#D9A876]">
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

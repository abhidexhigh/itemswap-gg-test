// components/DeckHeader.jsx
import React, { memo, useState, useCallback, useMemo } from "react";
import ReactTltp from "src/components/tooltip/ReactTltp";
import { OptimizedImage } from "src/utils/imageOptimizer";
import ForceIcon from "src/components/forceIcon";
import TraitImage from "src/components/TraitImage/TraitImage";
import SkillTreeImage from "src/components/SkillTreeImage";

const DeckHeader = memo(({ metaDeck, lookupMaps }) => {
  const [hoveredForce, setHoveredForce] = useState(null);

  const headerData = useMemo(() => {
    const forceDetails =
      metaDeck?.deck?.forces
        ?.map((force) => ({
          ...force,
          details: lookupMaps.forceMap.get(force?.key.toLowerCase()),
        }))
        .filter((force) => force.details) || [];

    const skillDetails =
      metaDeck?.deck?.skillTree
        ?.map((skill) => lookupMaps.skillMap.get(skill))
        .filter(Boolean) || [];

    const traitDetails =
      metaDeck?.deck?.traits
        ?.map((trait) => {
          const traitDetails = lookupMaps.traitMap.get(trait?.key);
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
        ?.map((augment) => lookupMaps.augmentMap.get(augment))
        .filter(Boolean) || [];

    return { forceDetails, skillDetails, traitDetails, augmentDetails };
  }, [metaDeck, lookupMaps]);

  const renderForceIcon = useCallback(
    (force, index, isMobile = false) => {
      const tooltipId = `${force?.key}-${index}`;
      return (
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
            data-tooltip-id={tooltipId}
            isHovered={hoveredForce === force?.key}
            loading="lazy"
          />
          <ReactTltp content={force?.key} id={tooltipId} />
          {!isMobile && <span className="text-[18px]">{force?.numUnits}</span>}
        </div>
      );
    },
    [hoveredForce]
  );

  const { forceDetails, skillDetails, traitDetails, augmentDetails } =
    headerData;

  return (
    <header className="relative flex flex-col md:flex-col justify-between items-start md:items-end py-[10px] pl-3 md:pl-4 pr-3 md:pr-[36px] lg:min-h-[50px] lg:flex-row lg:items-center lg:py-[5px] lg:pr-[16px]">
      <div className="inline-flex flex-col flex-wrap gap-[8px] w-full md:w-auto md:flex-row md:items-center md:gap-[4px]">
        <strong className="text-[26px] font-semibold leading-none text-[#F2A03D] text-center md:text-left">
          {metaDeck?.name}
        </strong>
        {/* Desktop: Traits */}
        <div className="hidden md:flex items-center gap-1 ml-4">
          {traitDetails.slice(0, 5).map((trait, index) => {
            const tooltipId = `${trait.key}-${index}`;
            return (
              <div key={`${trait.key}-${index}`} className="relative">
                <TraitImage
                  trait={trait}
                  size="default"
                  className="w-[38px] h-[38px] md:w-[36px] md:h-[36px]"
                  data-tooltip-id={tooltipId}
                  loading="lazy"
                />
                <ReactTltp variant="trait" id={tooltipId} content={trait} />
              </div>
            );
          })}
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
          {traitDetails.slice(0, 6).map((trait, index) => {
            const tooltipId = `${trait.key}-${index}`;
            return (
              <div key={`${trait.key}-${index}`} className="flex-shrink-0">
                <TraitImage
                  trait={trait}
                  size="small"
                  className="!w-[34px] !h-[34px]"
                  data-tooltip-id={tooltipId}
                  loading="lazy"
                />
                <ReactTltp variant="trait" id={tooltipId} content={trait} />
              </div>
            );
          })}
          {traitDetails.length > 0 && augmentDetails.length > 0 && (
            <div className="flex-shrink-0 h-8 w-px bg-[#ffffff30] mx-2"></div>
          )}
          {augmentDetails.slice(0, 4).map((augment, index) => {
            const tooltipId = `augment-${augment.key}-${index}`;
            return (
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
                  data-tooltip-id={tooltipId}
                  loading="lazy"
                  sizes="30px"
                />
                <ReactTltp variant="augment" content={augment} id={tooltipId} />
              </div>
            );
          })}
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
          {augmentDetails.map((augment, index) => {
            const tooltipId = `augment-${augment.key}-${index}`;
            return (
              <div key={`augment-${augment.key}-${index}`} className="relative">
                <OptimizedImage
                  alt={augment.name || "Augment"}
                  width={48}
                  height={48}
                  src={augment.imageUrl}
                  className="w-[38px] h-[38px] md:w-[36px] md:h-[36px] mx-0.5 rounded-md"
                  data-tooltip-id={tooltipId}
                  loading="lazy"
                  sizes="36px"
                />
                <ReactTltp variant="augment" content={augment} id={tooltipId} />
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
});

export default DeckHeader;

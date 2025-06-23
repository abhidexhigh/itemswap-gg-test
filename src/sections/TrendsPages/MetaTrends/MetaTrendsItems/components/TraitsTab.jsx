// components/TraitsTab.jsx
import React, { memo, useState } from "react";
import { IoMdCheckmarkCircle } from "react-icons/io";
import ReactTltp from "src/components/tooltip/ReactTltp";
import ForceIcon from "src/components/forceIcon";
import TraitImage from "src/components/TraitImage/TraitImage";

const TraitItem = memo(({ trait, selectedItem, onSelect, i }) => {
  const isSelected = trait?.key === selectedItem;
  const tooltipId = `${trait?.key}-${i}`;

  return (
    <div
      className="flex flex-col items-center gap-2 cursor-pointer group"
      onClick={() => onSelect("trait", trait?.key)}
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
  );
});

const ForceItem = memo(({ force, selectedItem, onSelect, i }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isSelected = force?.key === selectedItem;
  const tooltipId = `${force?.key}-${i}`;

  return (
    <div
      className="flex flex-col items-center gap-2 cursor-pointer group"
      onClick={() => onSelect("force", force?.key)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
  );
});

const TraitsTab = memo(
  ({ traits, forces, selectedTrait, onFilterChange, others }) => {
    const [activeTraitsSubTab, setActiveTraitsSubTab] = useState("Origin");

    return (
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
              {traits?.slice(0, 24).map((trait, i) => (
                <div
                  key={`trait-${trait.key}-${i}`}
                  className="w-full max-w-[70px] sm:max-w-[80px]"
                >
                  <TraitItem
                    trait={trait}
                    selectedItem={selectedTrait}
                    onSelect={onFilterChange}
                    i={i}
                  />
                </div>
              ))}
            </div>
          )}
          {activeTraitsSubTab === "Forces" && (
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 w-full max-h-[300px] overflow-y-auto">
              {forces?.slice(0, 24).map((force, i) => (
                <div
                  key={`force-${force.key}-${i}`}
                  className="w-full max-w-[70px] sm:max-w-[80px]"
                >
                  <ForceItem
                    force={force}
                    selectedItem={selectedTrait}
                    onSelect={onFilterChange}
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
            [others?.origin, traits?.slice(0, 32)],
            [others?.forces, forces?.slice(0, 32)],
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
                      onSelect={onFilterChange}
                      i={i}
                    />
                  ) : (
                    <ForceItem
                      key={`force-${item.key}-${i}`}
                      force={item}
                      selectedItem={selectedTrait}
                      onSelect={onFilterChange}
                      i={i}
                    />
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

export default TraitsTab;

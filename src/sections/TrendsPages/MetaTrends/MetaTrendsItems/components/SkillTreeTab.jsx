// components/SkillTreeTab.jsx
import React, { memo, useState, useEffect, useMemo } from "react";
import { IoMdCheckmarkCircle } from "react-icons/io";
import ReactTltp from "src/components/tooltip/ReactTltp";
import SkillTreeImage from "src/components/SkillTreeImage";

const SkillTreeItem = memo(
  ({ skill, selectedSkillTree, onSelect, i, mobile = false }) => {
    const isSelected = skill?.key === selectedSkillTree;
    const containerClass = mobile
      ? "flex flex-col items-center gap-1 cursor-pointer group w-12 sm:w-14 flex-shrink-0"
      : "flex flex-col items-center gap-1 cursor-pointer group w-16 md:w-20 lg:w-24 flex-shrink-0";
    const textClass = mobile ? "text-[10px]" : "text-xs";
    const iconClass = mobile ? "text-2xl" : "text-3xl";
    const tooltipId = `skill-${skill?.key}-${i}`;

    return (
      <div
        className={containerClass}
        onClick={() => onSelect("skillTree", skill?.key)}
      >
        <ReactTltp variant="skillTree" content={skill} id={tooltipId} />
        <div className="relative aspect-square w-full transition-transform duration-200 group-hover:scale-105">
          <SkillTreeImage
            skill={skill}
            size={mobile ? "small" : "large"}
            tooltipId={tooltipId}
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
    );
  }
);

const SkillTreeTab = memo(
  ({ skillTree, selectedSkillTree, onFilterChange }) => {
    const [activeSkillsSubTab, setActiveSkillsSubTab] = useState(null);

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

    useEffect(() => {
      const variants = Object.keys(skillsByVariant);
      if (variants.length > 0 && !activeSkillsSubTab) {
        setActiveSkillsSubTab(variants[0]);
      }
    }, [skillsByVariant, activeSkillsSubTab]);

    return (
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
              {skillsByVariant[activeSkillsSubTab]
                .slice(0, 20)
                .map((skill, i) => (
                  <SkillTreeItem
                    key={`mobile-skill-${skill.key}-${i}`}
                    skill={skill}
                    selectedSkillTree={selectedSkillTree}
                    onSelect={onFilterChange}
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
              ?.slice(0, 24)
              ?.map((skill, i) => (
                <SkillTreeItem
                  key={`desktop-skill-${skill.key}-${i}`}
                  skill={skill}
                  selectedSkillTree={selectedSkillTree}
                  onSelect={onFilterChange}
                  i={i}
                />
              ))}
          </div>
        </div>
      </div>
    );
  }
);

export default SkillTreeTab;

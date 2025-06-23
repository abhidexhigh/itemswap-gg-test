// components/TabNavigation.jsx
import React, { memo } from "react";

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

const TabNavigation = memo(({ activeTab, onTabChange, others }) => {
  const tabs = [
    { key: "Champions", label: others?.champions },
    { key: "Traits", label: others?.traits },
    { key: "Items", label: others?.items },
    { key: "SkillTree", label: others?.skills },
  ];

  return (
    <div className="flex justify-center md:justify-start">
      <div className="inline-flex rounded-lg overflow-hidden border border-[#2D2F37] bg-[#1D1D1D]">
        {tabs.map((tab) => (
          <TabButton
            key={tab.key}
            active={activeTab === tab.key}
            label={tab.label}
            onClick={() => onTabChange(tab.key)}
          />
        ))}
      </div>
    </div>
  );
});

export default TabNavigation;

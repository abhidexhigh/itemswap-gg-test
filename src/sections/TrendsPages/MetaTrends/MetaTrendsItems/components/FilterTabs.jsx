// components/FilterTabs.jsx
import React, { memo, useMemo } from "react";
import ChampionsTab from "./ChampionsTab";
import TraitsTab from "./TraitsTab";
import ItemsTab from "./ItemsTab";
import SkillTreeTab from "./SkillTreeTab";

const FilterTabs = memo(
  ({
    activeTab,
    champions,
    items,
    traits,
    forces,
    skillTree,
    selectedChampion,
    selectedTrait,
    selectedItem,
    selectedSkillTree,
    onFilterChange,
    others,
  }) => {
    const tabContent = useMemo(() => {
      switch (activeTab) {
        case "Champions":
          return (
            <ChampionsTab
              champions={champions}
              selectedChampion={selectedChampion}
              onFilterChange={onFilterChange}
              forces={forces}
            />
          );
        case "Traits":
          return (
            <TraitsTab
              traits={traits}
              forces={forces}
              selectedTrait={selectedTrait}
              onFilterChange={onFilterChange}
              others={others}
            />
          );
        case "Items":
          return (
            <ItemsTab
              items={items}
              selectedItem={selectedItem}
              onFilterChange={onFilterChange}
            />
          );
        case "SkillTree":
          return (
            <SkillTreeTab
              skillTree={skillTree}
              selectedSkillTree={selectedSkillTree}
              onFilterChange={onFilterChange}
            />
          );
        default:
          return null;
      }
    }, [
      activeTab,
      champions,
      items,
      traits,
      forces,
      skillTree,
      selectedChampion,
      selectedTrait,
      selectedItem,
      selectedSkillTree,
      onFilterChange,
      others,
    ]);

    return <div className="rounded-lg shadow-lg">{tabContent}</div>;
  }
);

export default FilterTabs;

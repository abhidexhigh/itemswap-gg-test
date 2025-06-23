// MetaTrendsItems.jsx - Main Component
import { useTranslation } from "react-i18next";
import "../../../../../i18n";
import React, { useState, useCallback, useMemo, memo } from "react";
import { useCompsData } from "../../../../hooks/useCompsData";

// Import modular components
import TabNavigation from "./components/TabNavigation";
import FilterTabs from "./components/FilterTabs";
import DecksList from "./components/DecksList";
import { ErrorState, LoadingState } from "./components/LoadingState";

// Utility functions
const createLookupMaps = (
  champions,
  items,
  traits,
  forces,
  skillTree,
  augments
) => {
  return {
    championMap: new Map(champions?.map((c) => [c.key, c]) || []),
    itemMap: new Map(items?.map((i) => [i.key, i]) || []),
    traitMap: new Map(traits?.map((t) => [t.key, t]) || []),
    forceMap: new Map(forces?.map((f) => [f.key.toLowerCase(), f]) || []),
    skillMap: new Map(skillTree?.map((s) => [s.key, s]) || []),
    augmentMap: new Map(augments?.map((a) => [a.key, a]) || []),
    forces, // Keep original array for compatibility
  };
};

const MetaTrendsItems = () => {
  const { t } = useTranslation();
  const others = t("others");

  // State
  const [selectedChampion, setSelectedChampion] = useState(null);
  const [selectedTrait, setSelectedTrait] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedSkillTree, setSelectedSkillTree] = useState(null);
  const [activeTab, setActiveTab] = useState("Champions");
  const [compsData, setCompsData] = useState([]);

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

  // Create stable lookup maps
  const lookupMaps = useMemo(
    () =>
      createLookupMaps(champions, items, traits, forces, skillTree, augments),
    [champions, items, traits, forces, skillTree, augments]
  );

  // Initialize comps data
  React.useEffect(() => {
    if (metaDecks) {
      setCompsData(metaDecks);
    }
  }, [metaDecks]);

  // Filter handler
  const handleFilterChange = useCallback(
    (type, key) => {
      // Reset all selections first
      setSelectedChampion(null);
      setSelectedTrait(null);
      setSelectedItem(null);
      setSelectedSkillTree(null);

      // Set the new selection
      if (type === "champion") setSelectedChampion(key);
      else if (type === "trait" || type === "force") setSelectedTrait(key);
      else if (type === "item") setSelectedItem(key);
      else if (type === "skillTree") setSelectedSkillTree(key);

      // Apply filtering logic (simplified for performance)
      const filtered = metaDecks.filter((deck) => {
        if (type === "champion") {
          return deck.deck.champions.some((champion) => champion.key === key);
        }
        if (type === "trait") {
          return deck.deck.traits.some((trait) => trait.key === key);
        }
        if (type === "force") {
          return deck.deck.forces.some(
            (force) => force.key.toLowerCase() === key.toLowerCase()
          );
        }
        if (type === "item") {
          return deck.deck.champions.some((champion) =>
            champion.items?.includes(key)
          );
        }
        if (type === "skillTree") {
          return deck.deck.skillTree?.includes(key);
        }
        return true;
      });

      setCompsData(filtered);
    },
    [metaDecks]
  );

  const filterProps = {
    champions,
    items,
    traits,
    forces,
    skillTree,
    selectedChampion,
    selectedTrait,
    selectedItem,
    selectedSkillTree,
    onFilterChange: handleFilterChange,
    others,
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <div className="mx-auto md:px-0 lg:px-0 py-6">
      <div className="space-y-6">
        <div>
          <TabNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            others={others}
          />
          <FilterTabs activeTab={activeTab} {...filterProps} />
        </div>

        <DecksList
          compsData={compsData}
          lookupMaps={lookupMaps}
          others={others}
        />
      </div>
    </div>
  );
};

export default memo(MetaTrendsItems);

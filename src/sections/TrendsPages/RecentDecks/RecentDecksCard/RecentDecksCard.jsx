import React, { memo } from "react";
import ChampionCard from "../../../../components/trends/ChampionCard";

/**
 * RecentDecksCard component for displaying champion cards by cost
 */
const RecentDecksCard = ({
  championsByCost,
  setSelectedChampion,
  selectedChampion,
  forces,
}) => {
  return (
    <ChampionCard
      championsByCost={championsByCost}
      setSelectedChampion={setSelectedChampion}
      selectedChampion={selectedChampion}
      forces={forces}
      componentType="recent"
    />
  );
};

// Use React.memo to prevent unnecessary re-renders
export default memo(RecentDecksCard);

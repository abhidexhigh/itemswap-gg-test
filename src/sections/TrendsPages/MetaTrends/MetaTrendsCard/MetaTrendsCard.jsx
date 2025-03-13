import React, { memo } from "react";
import ChampionCard from "../../../../components/trends/ChampionCard";

/**
 * MetaTrendsCard component for displaying champion cards by cost
 */
const MetaTrendsCard = ({
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
      componentType="meta"
    />
  );
};

// Use React.memo to prevent unnecessary re-renders
export default memo(MetaTrendsCard);

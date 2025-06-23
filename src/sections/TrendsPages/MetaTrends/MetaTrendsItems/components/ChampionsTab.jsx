// components/ChampionsTab.jsx
import React, { memo, useMemo } from "react";
import MetaTrendsCard from "../../MetaTrendsCard/MetaTrendsCard";

const shuffle = (array) => {
  if (!array?.length) return [];
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const ChampionsTab = memo(
  ({ champions, selectedChampion, onFilterChange, forces }) => {
    const { groupedArray } = useMemo(() => {
      if (!champions?.length) return { groupedArray: [] };

      const championsByType = new Map();
      champions.forEach((champion) => {
        if (!champion.type) return;
        if (!championsByType.has(champion.type)) {
          championsByType.set(champion.type, []);
        }
        championsByType.get(champion.type).push(champion);
      });

      const filtered = [];
      for (const [_, group] of championsByType) {
        const selected = shuffle([...group]).slice(0, 2);
        filtered.push(...selected);
      }

      const groupedByCost = new Map();
      filtered.forEach((champion) => {
        const { cost } = champion;
        if (!groupedByCost.has(cost)) {
          groupedByCost.set(cost, []);
        }
        groupedByCost.get(cost).push({ ...champion, selected: false });
      });

      return {
        groupedArray: Array.from(groupedByCost.entries())
          .sort(([costA], [costB]) => costA - costB)
          .map(([cost, champions]) => champions),
      };
    }, [champions]);

    const championsWithSelection = useMemo(() => {
      return groupedArray.map((costGroup) =>
        costGroup.map((champion) => ({
          ...champion,
          selected: champion.key === selectedChampion,
        }))
      );
    }, [groupedArray, selectedChampion]);

    return (
      <MetaTrendsCard
        itemCount={13}
        championsByCost={championsWithSelection}
        setSelectedChampion={(key) => onFilterChange("champion", key)}
        selectedChampion={selectedChampion}
        forces={forces}
      />
    );
  }
);

export default ChampionsTab;

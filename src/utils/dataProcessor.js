// utils/dataProcessor.js - Optimized data processing
export class DataProcessor {
  constructor() {
    this.cache = new Map();
    this.indexes = new Map();
    this.preProcessedData = null;
  }

  // Pre-process all data once
  preProcessData(rawData) {
    const { metaDecks, champions, items, traits, forces, skillTree, augments } =
      rawData;

    if (this.preProcessedData) return this.preProcessedData;

    console.time("Data preprocessing");

    // Create optimized lookup structures
    const lookupMaps = {
      championMap: new Map(
        champions?.map((c) => [
          c.key,
          { ...c, costGroup: Math.floor(c.cost) },
        ]) || []
      ),
      itemMap: new Map(items?.map((i) => [i.key, i]) || []),
      traitMap: new Map(traits?.map((t) => [t.key, t]) || []),
      forceMap: new Map(forces?.map((f) => [f.key.toLowerCase(), f]) || []),
      skillMap: new Map(skillTree?.map((s) => [s.key, s]) || []),
      augmentMap: new Map(augments?.map((a) => [a.key, a]) || []),
    };

    // Create reverse indexes for efficient filtering
    const championDecksIndex = new Map(); // champion -> deck indexes
    const traitDecksIndex = new Map(); // trait -> deck indexes
    const itemDecksIndex = new Map(); // item -> deck indexes
    const skillDecksIndex = new Map(); // skill -> deck indexes

    metaDecks?.forEach((deck, deckIndex) => {
      // Index champions
      deck.deck.champions?.forEach((champion) => {
        if (!championDecksIndex.has(champion.key)) {
          championDecksIndex.set(champion.key, []);
        }
        championDecksIndex.get(champion.key).push(deckIndex);
      });

      // Index traits
      deck.deck.traits?.forEach((trait) => {
        if (!traitDecksIndex.has(trait.key)) {
          traitDecksIndex.set(trait.key, []);
        }
        traitDecksIndex.get(trait.key).push(deckIndex);
      });

      // Index items
      deck.deck.champions?.forEach((champion) => {
        champion.items?.forEach((item) => {
          if (!itemDecksIndex.has(item)) {
            itemDecksIndex.set(item, []);
          }
          itemDecksIndex.get(item).push(deckIndex);
        });
      });

      // Index skills
      deck.deck.skillTree?.forEach((skill) => {
        if (!skillDecksIndex.has(skill)) {
          skillDecksIndex.set(skill, []);
        }
        skillDecksIndex.get(skill).push(deckIndex);
      });
    });

    // Pre-process champions by cost groups
    const championsByCost = new Map();
    champions?.forEach((champion) => {
      const cost = champion.cost || 0;
      if (!championsByCost.has(cost)) {
        championsByCost.set(cost, []);
      }
      championsByCost.get(cost).push(champion);
    });

    // Pre-filter items (remove derived items)
    const filteredItems = items?.filter((item) => !item?.isFromItem) || [];

    // Pre-group skills by variant
    const skillsByVariant = new Map();
    skillTree
      ?.filter((skill) => skill?.imageUrl)
      .forEach((skill) => {
        const variant = skill.variant || "General";
        if (!skillsByVariant.has(variant)) {
          skillsByVariant.set(variant, []);
        }
        skillsByVariant.get(variant).push(skill);
      });

    this.preProcessedData = {
      lookupMaps,
      indexes: {
        championDecks: championDecksIndex,
        traitDecks: traitDecksIndex,
        itemDecks: itemDecksIndex,
        skillDecks: skillDecksIndex,
      },
      processedCollections: {
        championsByCost: Array.from(championsByCost.entries()).sort(
          ([a], [b]) => a - b
        ),
        filteredItems,
        skillsByVariant: Object.fromEntries(skillsByVariant),
        traits: traits?.slice(0, 50) || [], // Limit for performance
        forces: forces?.slice(0, 50) || [],
      },
      metaDecks: metaDecks || [],
    };

    console.timeEnd("Data preprocessing");
    return this.preProcessedData;
  }

  // Ultra-fast filtering using indexes
  filterDecks(type, key) {
    const cacheKey = `${type}:${key}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const { indexes, metaDecks } = this.preProcessedData;
    let deckIndexes = [];

    switch (type) {
      case "champion":
        deckIndexes = indexes.championDecks.get(key) || [];
        break;
      case "trait":
      case "force":
        deckIndexes = indexes.traitDecks.get(key) || [];
        break;
      case "item":
        deckIndexes = indexes.itemDecks.get(key) || [];
        break;
      case "skillTree":
        deckIndexes = indexes.skillDecks.get(key) || [];
        break;
      default:
        return metaDecks;
    }

    // Get decks by index (O(1) lookup)
    const filteredDecks = deckIndexes.map((index) => metaDecks[index]);

    // Sort by relevance (decks with more of the selected item first)
    const sortedDecks = this.sortDecksByRelevance(filteredDecks, type, key);

    this.cache.set(cacheKey, sortedDecks);
    return sortedDecks;
  }

  sortDecksByRelevance(decks, type, key) {
    return decks.sort((a, b) => {
      let aScore = 0,
        bScore = 0;

      switch (type) {
        case "champion":
          aScore = a.deck.champions.filter((c) => c.key === key).length;
          bScore = b.deck.champions.filter((c) => c.key === key).length;
          break;
        case "trait":
          aScore = a.deck.traits.find((t) => t.key === key)?.numUnits || 0;
          bScore = b.deck.traits.find((t) => t.key === key)?.numUnits || 0;
          break;
        case "item":
          aScore = a.deck.champions.reduce(
            (sum, c) => sum + (c.items?.filter((i) => i === key).length || 0),
            0
          );
          bScore = b.deck.champions.reduce(
            (sum, c) => sum + (c.items?.filter((i) => i === key).length || 0),
            0
          );
          break;
      }

      return bScore - aScore;
    });
  }

  // Get processed champion data with O(1) lookups
  getChampionData(deckChampions, isCollapsed = true) {
    const { lookupMaps } = this.preProcessedData;

    // Sort champions by cost using pre-calculated cost groups
    const sortedChampions = deckChampions
      .map((champion) => ({
        ...champion,
        details: lookupMaps.championMap.get(champion.key),
      }))
      .filter((c) => c.details)
      .sort((a, b) => (a.details.cost || 0) - (b.details.cost || 0));

    if (!isCollapsed) return sortedChampions;

    // Get priority champions (tier 4+) first
    const priorityChampions = sortedChampions.filter((c) => (c.tier || 0) >= 4);
    const otherChampions = sortedChampions.filter((c) => (c.tier || 0) < 4);

    return [...priorityChampions, ...otherChampions].slice(0, 4);
  }

  clearCache() {
    this.cache.clear();
  }
}

// Create singleton instance
export const dataProcessor = new DataProcessor();

// React hook for optimized data access
import { useMemo } from "react";

export function useOptimizedData(rawData) {
  return useMemo(() => {
    return dataProcessor.preProcessData(rawData);
  }, [rawData.metaDecks, rawData.champions, rawData.items]); // Only key dependencies
}

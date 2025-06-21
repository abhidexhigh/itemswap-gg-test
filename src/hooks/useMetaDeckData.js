import { useQuery } from "@tanstack/react-query";
import {
  fetchMetaDeckChampions,
  fetchMetaDeckTraits,
  fetchMetaDeckItems,
  fetchMetaDeckSkillTree,
  fetchMetaDeckAugments,
} from "../services/apiService";

// Define the API functions mapping
const API_FUNCTIONS = {
  champions: fetchMetaDeckChampions,
  traits: fetchMetaDeckTraits,
  items: fetchMetaDeckItems,
  skillTree: fetchMetaDeckSkillTree,
  augments: fetchMetaDeckAugments,
};

/**
 * Generic hook factory for fetching meta deck data
 * @param {string} dataType - Type of data to fetch (champions, traits, items, skillTree, augments)
 * @param {Object} options - React Query options
 * @returns {Object} - Hook state and methods
 */
export const useMetaDeckData = (dataType, options = {}) => {
  const apiFunction = API_FUNCTIONS[dataType];

  if (!apiFunction) {
    throw new Error(
      `Invalid dataType: ${dataType}. Valid types are: ${Object.keys(API_FUNCTIONS).join(", ")}`
    );
  }

  const {
    data: metaDeckData,
    isLoading,
    error,
    refetch,
    isFetching,
    isError,
    isSuccess,
    dataUpdatedAt,
  } = useQuery({
    queryKey: [`meta-deck-${dataType}`],
    queryFn: async () => {
      const result = await apiFunction();

      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error || `Failed to load ${dataType} data`);
      }
    },
    // Default options optimized for meta deck data
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
    // Allow custom options to override defaults
    ...options,
  });

  return {
    // Data
    data: metaDeckData || [],

    // State
    isLoading,
    isFetching,
    isError,
    isSuccess,
    error: error?.message || null,
    lastFetchTime: dataUpdatedAt ? new Date(dataUpdatedAt) : null,

    // Methods
    refetch,

    // Computed
    hasData: Array.isArray(metaDeckData) && metaDeckData.length > 0,
    isEmpty:
      !isLoading && !error && (!metaDeckData || metaDeckData.length === 0),
  };
};

// Specific hooks for each data type
export const useMetaDeckChampions = (options = {}) =>
  useMetaDeckData("champions", options);
export const useMetaDeckTraits = (options = {}) =>
  useMetaDeckData("traits", options);
export const useMetaDeckItems = (options = {}) =>
  useMetaDeckData("items", options);
export const useMetaDeckSkillTree = (options = {}) =>
  useMetaDeckData("skillTree", options);
export const useMetaDeckAugments = (options = {}) =>
  useMetaDeckData("augments", options);

export default useMetaDeckData;

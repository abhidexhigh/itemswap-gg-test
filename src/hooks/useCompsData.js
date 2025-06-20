import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCompsData } from "../services/apiService";

/**
 * React Query key for comps data
 */
export const COMPS_DATA_QUERY_KEY = ["comps-data"];

/**
 * Custom hook for fetching and managing comps data using React Query
 * This provides global caching, automatic background updates, and error handling
 *
 * @param {Object} options - React Query options
 * @returns {Object} - Hook state and methods
 */
export const useCompsData = (options = {}) => {
  const {
    data: gameData,
    isLoading,
    error,
    refetch,
    isFetching,
    isError,
    isSuccess,
    dataUpdatedAt,
  } = useQuery({
    queryKey: COMPS_DATA_QUERY_KEY,
    queryFn: async () => {
      const result = await fetchCompsData();

      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error || "Failed to load data");
      }
    },
    // Default options optimized for game data
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

  // Provide default empty data structure while loading
  const defaultData = {
    metaDecks: [],
    champions: [],
    items: [],
    traits: [],
    augments: [],
    forces: [],
    skillTree: [],
  };

  const finalData = gameData || defaultData;

  return {
    // Data - with individual arrays for easy destructuring
    gameData: finalData,
    metaDecks: finalData.metaDecks,
    champions: finalData.champions,
    items: finalData.items,
    traits: finalData.traits,
    augments: finalData.augments,
    forces: finalData.forces,
    skillTree: finalData.skillTree,

    // State
    isLoading,
    isFetching, // Different from isLoading - true during background refetches
    isError,
    isSuccess,
    error: error?.message || null,
    lastFetchTime: dataUpdatedAt ? new Date(dataUpdatedAt) : null,

    // Methods
    refetch,

    // Computed
    hasData: finalData.metaDecks.length > 0,
    isEmpty: !isLoading && !error && finalData.metaDecks.length === 0,
  };
};

/**
 * Hook to prefetch comps data (useful for preloading)
 */
export const usePrefetchCompsData = () => {
  const { prefetchQuery } = useQueryClient();

  return () => {
    prefetchQuery({
      queryKey: COMPS_DATA_QUERY_KEY,
      queryFn: async () => {
        const result = await fetchCompsData();
        if (result.success) {
          return result.data;
        }
        throw new Error(result.error || "Failed to load data");
      },
    });
  };
};

export default useCompsData;

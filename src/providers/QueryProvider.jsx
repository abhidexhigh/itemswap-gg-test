import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Create a client with optimized settings for game data
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Game data doesn't change frequently, so we can cache it longer
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      // Retry failed requests
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Don't refetch on window focus for stable game data
      refetchOnWindowFocus: false,
      // Background refetch to keep data fresh
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
  },
});

export const QueryProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Show devtools in development */}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
};

export default QueryProvider;

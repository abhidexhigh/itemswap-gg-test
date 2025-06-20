import React from "react";
import { useCompsData } from "../hooks/useCompsData";

// Component 1: Shows champions data
const ChampionsDisplay = () => {
  const { champions, isLoading, isFetching } = useCompsData();

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-lg font-bold text-white mb-2">
        Champions Component
        {isFetching && (
          <span className="text-yellow-400 ml-2">(Refreshing...)</span>
        )}
      </h3>
      {isLoading ? (
        <div className="text-gray-400">Loading champions...</div>
      ) : (
        <div className="text-gray-300">Found {champions.length} champions</div>
      )}
    </div>
  );
};

// Component 2: Shows items data
const ItemsDisplay = () => {
  const { items, isLoading, isFetching } = useCompsData();

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-lg font-bold text-white mb-2">
        Items Component
        {isFetching && (
          <span className="text-yellow-400 ml-2">(Refreshing...)</span>
        )}
      </h3>
      {isLoading ? (
        <div className="text-gray-400">Loading items...</div>
      ) : (
        <div className="text-gray-300">Found {items.length} items</div>
      )}
    </div>
  );
};

// Component 3: Shows meta decks
const MetaDecksDisplay = () => {
  const { metaDecks, isLoading, isFetching, refetch, lastFetchTime } =
    useCompsData();

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold text-white">
          Meta Decks Component
          {isFetching && (
            <span className="text-yellow-400 ml-2">(Refreshing...)</span>
          )}
        </h3>
        <button
          onClick={refetch}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
        >
          Refresh
        </button>
      </div>
      {isLoading ? (
        <div className="text-gray-400">Loading meta decks...</div>
      ) : (
        <div className="text-gray-300">
          <div>Found {metaDecks.length} meta decks</div>
          {lastFetchTime && (
            <div className="text-xs text-gray-500 mt-1">
              Last updated: {lastFetchTime.toLocaleTimeString()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Main demo component
const ReactQueryDemo = () => {
  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-6">
        React Query Global Caching Demo
      </h1>

      <div className="mb-4 p-4 bg-blue-900 rounded-lg">
        <h2 className="text-lg font-semibold text-blue-200 mb-2">
          🚀 How This Works:
        </h2>
        <ul className="text-blue-100 text-sm space-y-1">
          <li>• All three components use the same `useCompsData()` hook</li>
          <li>• The API is called only ONCE when the first component mounts</li>
          <li>• All subsequent components get data from React Query's cache</li>
          <li>
            • When you click "Refresh", all components update simultaneously
          </li>
          <li>• React Query automatically handles loading states and errors</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ChampionsDisplay />
        <ItemsDisplay />
        <MetaDecksDisplay />
      </div>

      <div className="mt-6 p-4 bg-green-900 rounded-lg">
        <h2 className="text-lg font-semibold text-green-200 mb-2">
          ✅ Benefits You Get:
        </h2>
        <ul className="text-green-100 text-sm space-y-1">
          <li>
            • <strong>Single API call</strong> - No duplicate requests
          </li>
          <li>
            • <strong>Global caching</strong> - Data shared across all
            components
          </li>
          <li>
            • <strong>Background updates</strong> - Data stays fresh
            automatically
          </li>
          <li>
            • <strong>Error handling</strong> - Built-in retry and error states
          </li>
          <li>
            • <strong>Loading states</strong> - Automatic loading indicators
          </li>
          <li>
            • <strong>DevTools</strong> - Great debugging experience
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ReactQueryDemo;

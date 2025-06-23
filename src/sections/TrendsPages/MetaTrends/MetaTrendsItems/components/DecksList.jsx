// components/DecksList.jsx
import React, { useState, useCallback, useMemo, memo } from "react";
import DeckCard from "./DeckCard";
import InfiniteScroll from "./InfiniteScroll";

const DecksList = memo(({ compsData, lookupMaps, others }) => {
  const [visibleDecks, setVisibleDecks] = useState(5);
  const [isClosed, setIsClosed] = useState({});

  const handleIsClosed = useCallback((event) => {
    const buttonId = event.currentTarget.id;
    setIsClosed((prev) => ({ ...prev, [buttonId]: !prev[buttonId] }));
  }, []);

  const loadMoreDecks = useCallback(() => {
    setVisibleDecks((prev) => Math.min(prev + 3, compsData.length));
  }, [compsData.length]);

  const visibleCompsData = useMemo(() => {
    return compsData.slice(0, visibleDecks);
  }, [compsData, visibleDecks]);

  const hasMoreDecks = visibleDecks < compsData.length;

  React.useEffect(() => {
    setVisibleDecks(5);
  }, [compsData]);

  if (compsData.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No decks found matching the current filters.
      </div>
    );
  }

  return (
    <div className="space-y-4" id="meta-trends-items">
      <div className="space-y-4">
        {visibleCompsData.map((metaDeck, index) => (
          <DeckCard
            key={`deck-${metaDeck.name}-${index}`}
            metaDeck={metaDeck}
            index={index}
            isClosed={isClosed[index]}
            onToggleClosed={handleIsClosed}
            lookupMaps={lookupMaps}
            others={others}
          />
        ))}
      </div>

      <InfiniteScroll
        hasMore={hasMoreDecks}
        onLoadMore={loadMoreDecks}
        totalCount={compsData.length}
        visibleCount={visibleDecks}
      />
    </div>
  );
});

export default DecksList;

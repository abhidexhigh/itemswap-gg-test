// components/InfiniteScroll.jsx
import React, { useEffect, useRef, useState, memo } from "react";

const throttle = (func, wait) => {
  let timeout;
  let previous = 0;
  return (...args) => {
    const now = Date.now();
    if (now - previous > wait) {
      func(...args);
      previous = now;
    } else {
      clearTimeout(timeout);
      timeout = setTimeout(
        () => {
          func(...args);
          previous = Date.now();
        },
        wait - (now - previous)
      );
    }
  };
};

const InfiniteScroll = memo(
  ({ hasMore, onLoadMore, totalCount, visibleCount }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const loadingRef = useRef(false);

    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth <= 768);
      };
      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
      if (!hasMore) return;

      const handleScroll = throttle(() => {
        if (loadingRef.current) return;

        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        const triggerDistance = isMobile ? 400 : 800;
        const distanceFromBottom = documentHeight - (scrollTop + windowHeight);

        if (distanceFromBottom <= triggerDistance) {
          loadingRef.current = true;
          setIsLoading(true);

          // Use requestIdleCallback for better performance
          const callback = window.requestIdleCallback || setTimeout;
          callback(() => {
            onLoadMore();
            setIsLoading(false);
            loadingRef.current = false;
          });
        }
      }, 300);

      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }, [hasMore, onLoadMore, isMobile]);

    if (!hasMore && totalCount <= 5) return null;

    return (
      <>
        {/* Loading indicator */}
        {isLoading && hasMore && (
          <div className="flex justify-center py-6">
            <div className="flex items-center space-x-2 text-[#D9A876]">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#D9A876]"></div>
              <span className="text-sm">Loading more decks...</span>
            </div>
          </div>
        )}

        {/* Manual load button for mobile */}
        {hasMore && !isLoading && (
          <div className="md:hidden flex justify-center py-4">
            <button
              onClick={() => {
                setIsLoading(true);
                onLoadMore();
                setIsLoading(false);
              }}
              className="px-4 py-2 bg-[#2D2F37] hover:bg-[#3D3F47] text-[#D9A876] rounded-lg text-sm transition-colors duration-200"
            >
              Load More ({totalCount - visibleCount} remaining)
            </button>
          </div>
        )}

        {/* End indicator */}
        {!hasMore && totalCount > 5 && (
          <div className="flex flex-col items-center py-6 space-y-2">
            <div className="text-gray-500 text-sm text-center">
              ✓ Showing all {totalCount} decks
            </div>
            <div className="text-gray-600 text-xs text-center md:hidden">
              Scroll up to see more options
            </div>
          </div>
        )}
      </>
    );
  }
);

export default InfiniteScroll;

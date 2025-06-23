// components/VirtualizedGrid.jsx - For rendering hundreds of media files efficiently
import React, { useState, useEffect, useRef, memo, useMemo } from "react";

const VirtualizedGrid = memo(
  ({
    items,
    renderItem,
    itemHeight = 120,
    itemWidth = 96,
    containerHeight = 300,
    columns = 6,
    overscan = 3,
  }) => {
    const [scrollTop, setScrollTop] = useState(0);
    const containerRef = useRef();

    // Calculate visible items based on scroll position
    const visibleItems = useMemo(() => {
      const rowHeight = itemHeight + 8; // Include gap
      const startRow = Math.floor(scrollTop / rowHeight);
      const endRow = Math.min(
        Math.ceil((scrollTop + containerHeight) / rowHeight),
        Math.ceil(items.length / columns)
      );

      const startIndex = Math.max(0, (startRow - overscan) * columns);
      const endIndex = Math.min(items.length, (endRow + overscan) * columns);

      return {
        startIndex,
        endIndex,
        startRow: Math.max(0, startRow - overscan),
        totalRows: Math.ceil(items.length / columns),
      };
    }, [
      scrollTop,
      containerHeight,
      items.length,
      columns,
      itemHeight,
      overscan,
    ]);

    const handleScroll = (e) => {
      setScrollTop(e.target.scrollTop);
    };

    const totalHeight = Math.ceil(items.length / columns) * (itemHeight + 8);

    return (
      <div
        ref={containerRef}
        style={{ height: containerHeight, overflow: "auto" }}
        onScroll={handleScroll}
        className="relative"
      >
        <div style={{ height: totalHeight, position: "relative" }}>
          {items
            .slice(visibleItems.startIndex, visibleItems.endIndex)
            .map((item, index) => {
              const absoluteIndex = visibleItems.startIndex + index;
              const row = Math.floor(absoluteIndex / columns);
              const col = absoluteIndex % columns;

              return (
                <div
                  key={item.key || absoluteIndex}
                  style={{
                    position: "absolute",
                    top: row * (itemHeight + 8),
                    left: col * (itemWidth + 8),
                    width: itemWidth,
                    height: itemHeight,
                  }}
                >
                  {renderItem(item, absoluteIndex)}
                </div>
              );
            })}
        </div>
      </div>
    );
  }
);

// Progressive image loading component
const ProgressiveImage = memo(
  ({ src, alt, className, width, height, priority = false, ...props }) => {
    const [imageSrc, setImageSrc] = useState(priority ? src : null);
    const [imageRef, isVisible] = useIntersectionObserver({
      threshold: 0.1,
      rootMargin: "50px",
    });

    useEffect(() => {
      if (!priority && isVisible && !imageSrc) {
        const img = new Image();
        img.onload = () => setImageSrc(src);
        img.src = src;
      }
    }, [isVisible, src, imageSrc, priority]);

    return (
      <div ref={imageRef} className={className} style={{ width, height }}>
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={alt}
            width={width}
            height={height}
            loading="lazy"
            {...props}
          />
        ) : (
          <div
            className="bg-gray-800 animate-pulse rounded"
            style={{ width, height }}
          />
        )}
      </div>
    );
  }
);

// Optimized Items Tab with virtualization
export const OptimizedItemsTab = memo(
  ({ items, selectedItem, onFilterChange }) => {
    const renderItem = (item, index) => (
      <div
        className="flex flex-col items-center gap-2 cursor-pointer group"
        onClick={() => onFilterChange("item", item?.key)}
      >
        <div className="relative aspect-square w-full transition-transform duration-200 group-hover:scale-110">
          <ProgressiveImage
            alt={item?.name}
            width={84}
            height={84}
            src={item?.imageUrl}
            className="w-full h-full object-contain rounded-lg border border-[#ffffff20]"
            priority={index < 12} // Prioritize first 12 images
          />
          {selectedItem === item?.key && (
            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
              <div className="text-green-400 text-4xl">✓</div>
            </div>
          )}
        </div>
      </div>
    );

    return (
      <div className="p-3 md:p-6 bg-[#111111] rounded-lg mt-2">
        <VirtualizedGrid
          items={items}
          renderItem={renderItem}
          itemHeight={100}
          itemWidth={84}
          containerHeight={300}
          columns={8}
        />
      </div>
    );
  }
);

// Intersection Observer hook
function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIntersecting] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIntersecting(entry.isIntersecting);
    }, options);

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, isIntersecting];
}

export default VirtualizedGrid;

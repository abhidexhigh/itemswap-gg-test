import { useRef, useEffect, useState } from "react";

export default function ScrollableTable({ children }) {
  const scrollRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768); // Adjust width for mobile/tablet breakpoint

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle touch scroll on mobile
  useEffect(() => {
    if (!isMobile) return; // Only apply on mobile

    const scrollElement = scrollRef.current;
    let startX = 0;
    let startY = 0;
    let lockedDirection = null;

    const onTouchStart = (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      lockedDirection = null; // Reset direction on each new touch
    };

    const onTouchMove = (e) => {
      const diffX = e.touches[0].clientX - startX;
      const diffY = e.touches[0].clientY - startY;

      // Lock direction if not decided yet
      if (!lockedDirection) {
        lockedDirection =
          Math.abs(diffX) > Math.abs(diffY) ? "horizontal" : "vertical";
      }

      // If horizontal is locked, prevent vertical
      if (lockedDirection === "horizontal") {
        scrollElement.scrollLeft -= diffX; // Scrolling horizontally
        startX = e.touches[0].clientX; // Reset startX for smoothness
        e.preventDefault(); // Prevent vertical scroll
      }

      // If vertical is locked, prevent horizontal
      if (lockedDirection === "vertical") {
        scrollElement.scrollTop -= diffY; // Scrolling vertically
        startY = e.touches[0].clientY; // Reset startY for smoothness
        e.preventDefault(); // Prevent horizontal scroll
      }
    };

    scrollElement.addEventListener("touchstart", onTouchStart, {
      passive: false,
    });
    scrollElement.addEventListener("touchmove", onTouchMove, {
      passive: false,
    });

    return () => {
      scrollElement.removeEventListener("touchstart", onTouchStart);
      scrollElement.removeEventListener("touchmove", onTouchMove);
    };
  }, [isMobile]);

  return (
    <div ref={scrollRef} className="h-[800px] overflow-auto">
      {children}
    </div>
  );
}

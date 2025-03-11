import { useRef, useEffect, useState } from "react";

export default function ScrollableTable({ children }) {
  const scrollRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768); // Mobile/tablet breakpoint

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
      lockedDirection = null; // Reset direction on new touch
    };

    const onTouchMove = (e) => {
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const diffX = currentX - startX;
      const diffY = currentY - startY;

      // Lock direction once user starts moving
      if (!lockedDirection) {
        lockedDirection =
          Math.abs(diffX) > Math.abs(diffY) ? "horizontal" : "vertical";
      }

      const atTop = scrollElement.scrollTop === 0;
      const atBottom =
        scrollElement.scrollHeight - scrollElement.scrollTop ===
        scrollElement.clientHeight;
      const atLeft = scrollElement.scrollLeft === 0;
      const atRight =
        scrollElement.scrollWidth - scrollElement.scrollLeft ===
        scrollElement.clientWidth;

      let shouldPrevent = false;

      if (lockedDirection === "vertical") {
        // Scrolling up and at top OR scrolling down and at bottom — allow parent scroll
        if ((diffY > 0 && atTop) || (diffY < 0 && atBottom)) {
          shouldPrevent = false;
        } else {
          scrollElement.scrollTop -= diffY; // Scroll table
          startY = currentY; // Reset for smoothness
          shouldPrevent = true;
        }
      } else if (lockedDirection === "horizontal") {
        // Scrolling right and at left OR scrolling left and at right — allow parent scroll
        if ((diffX > 0 && atLeft) || (diffX < 0 && atRight)) {
          shouldPrevent = false;
        } else {
          scrollElement.scrollLeft -= diffX; // Scroll table
          startX = currentX; // Reset for smoothness
          shouldPrevent = true;
        }
      }

      if (shouldPrevent) e.preventDefault(); // Only block when we are not at the edge
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

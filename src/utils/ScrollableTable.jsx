import { useRef, useEffect, useState } from "react";

export default function ScrollableTable({ children }) {
  const scrollRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [direction, setDirection] = useState(null); // To dynamically set overflow direction

  // Detect if mobile based on screen width
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();

    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle touch detection and direction lock
  useEffect(() => {
    if (!isMobile) return;

    const scrollElement = scrollRef.current;
    let startX = 0;
    let startY = 0;
    let locked = false; // To lock once direction is detected

    const onTouchStart = (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      locked = false; // Reset lock for new gesture
      setDirection(null); // Reset direction on new gesture
    };

    const onTouchMove = (e) => {
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const diffX = Math.abs(currentX - startX);
      const diffY = Math.abs(currentY - startY);

      if (!locked) {
        // Lock to first significant move direction
        if (diffX > 10 || diffY > 10) {
          if (diffX > diffY) {
            setDirection("horizontal"); // Lock to horizontal
          } else {
            setDirection("vertical"); // Lock to vertical
          }
          locked = true;
        }
      }
    };

    const onTouchEnd = () => {
      // Optional: Reset direction after touch ends (if you want to unlock)
      // setDirection(null); // Uncomment if you want to unlock after gesture ends
    };

    scrollElement.addEventListener("touchstart", onTouchStart, {
      passive: true,
    });
    scrollElement.addEventListener("touchmove", onTouchMove, { passive: true });
    scrollElement.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      scrollElement.removeEventListener("touchstart", onTouchStart);
      scrollElement.removeEventListener("touchmove", onTouchMove);
      scrollElement.removeEventListener("touchend", onTouchEnd);
    };
  }, [isMobile]);

  return (
    <div
      ref={scrollRef}
      className={`h-[800px] scroll-smooth ${
        // Dynamically control overflow based on locked direction
        isMobile
          ? direction === "horizontal"
            ? "overflow-x-auto overflow-y-hidden"
            : direction === "vertical"
              ? "overflow-y-auto overflow-x-hidden"
              : "overflow-auto"
          : "overflow-auto"
      }`}
    >
      {children}
    </div>
  );
}

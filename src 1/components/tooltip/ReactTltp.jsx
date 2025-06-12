import { Tooltip } from "react-tooltip";
import Image from "next/image";
import "react-tooltip/dist/react-tooltip.css";
import Comps from "../../data/compsNew.json";
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { OptimizedImage } from "../../utils/imageOptimizer";

// Single container ID for all tooltips
const TOOLTIP_CONTAINER_ID = "global-tooltip-container";

// Store created tooltip IDs to avoid duplicates and for cleanup
const createdTooltips = new Set();

// Helper to detect touch devices
const isTouchDevice = () => {
  if (typeof window === "undefined") return false;
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  );
};

// Component to render tooltip in a portal
const TooltipPortal = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    // Create container only once
    let container = document.getElementById(TOOLTIP_CONTAINER_ID);
    if (!container) {
      container = document.createElement("div");
      container.id = TOOLTIP_CONTAINER_ID;
      container.style.position = "fixed";
      container.style.zIndex = "10000";
      container.style.pointerEvents = "none";
      container.style.top = "0";
      container.style.left = "0";
      container.style.width = "100%";
      container.style.height = "100%";
      document.body.appendChild(container);
    }
    containerRef.current = container;

    setMounted(true);

    return () => setMounted(false);
  }, []);

  return mounted
    ? createPortal(
        <div
          className="tooltip-portal"
          style={{
            position: "fixed",
            zIndex: 10000,
            pointerEvents: "none",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          {children}
        </div>,
        containerRef.current || document.body
      )
    : null;
};

// Global initialization for tooltips
if (typeof window !== "undefined") {
  // Use a more reliable initialization approach
  const initializeTooltips = () => {
    // Force tooltips to be reinitialized
    const event = new Event("mousemove");
    document.dispatchEvent(event);

    // Enhanced mobile touch handling with better production support
    if (isTouchDevice()) {
      // Remove existing listeners first to avoid duplicates
      document.removeEventListener("touchstart", handleTouchStart);

      document.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
    }
  };

  const handleTouchStart = (e) => {
    const tooltipId =
      e.target.getAttribute("data-tooltip-id") ||
      e.target.closest("[data-tooltip-id]")?.getAttribute("data-tooltip-id");

    if (!tooltipId) return;

    // Hide all other tooltips
    document.querySelectorAll(".react-tooltip").forEach((tooltip) => {
      if (tooltip.id !== tooltipId) {
        tooltip.style.opacity = "0";
      }
    });

    // Show current tooltip
    const tooltip = document.getElementById(tooltipId);
    if (tooltip) {
      const isVisible = tooltip.style.opacity === "1";
      tooltip.style.opacity = isVisible ? "0" : "1";

      if (!isVisible) {
        // Position tooltip near touch point
        const touch = e.touches[0];
        const targetRect = e.target.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        let posY = targetRect.bottom + 10;
        let posX = targetRect.left + targetRect.width / 2;

        // Ensure tooltip stays in viewport
        requestAnimationFrame(() => {
          if (!tooltip) return;

          const tooltipRect = tooltip.getBoundingClientRect();

          // Adjust Y position if needed
          if (posY + tooltipRect.height > viewportHeight - 20) {
            posY = Math.max(20, targetRect.top - tooltipRect.height - 10);
          }

          // Adjust X position if needed
          posX = Math.min(
            Math.max(tooltipRect.width / 2 + 10, posX),
            viewportWidth - tooltipRect.width / 2 - 10
          );

          tooltip.style.top = `${posY}px`;
          tooltip.style.left = `${posX}px`;
          tooltip.style.transform = "translate(-50%, 0)";
        });
      }
    }
  };

  // Initialize immediately and also after DOM is fully loaded
  initializeTooltips();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeTooltips);
  } else {
    setTimeout(initializeTooltips, 100);
  }
}

const ReactTltp = ({ variant = "", content, id }) => {
  const {
    props: {
      pageProps: {
        dehydratedState: {
          queries: { data },
        },
      },
    },
  } = Comps;
  const { metaDecks } = data?.metaDeckList;
  const { champions } = data?.refs;
  const { items } = data?.refs;
  const { traits } = data?.refs;
  const isTouch = useRef(null);
  const [tooltipVisible, setTooltipVisible] = useState(true);

  // Generate a unique ID if not provided
  const uniqueId = useRef(
    id || `tooltip-${Math.random().toString(36).substring(2, 9)}`
  );
  const tooltipId = uniqueId.current;

  // Detect if this is a touch device on mount
  useEffect(() => {
    isTouch.current = isTouchDevice();
  }, []);

  // Track this tooltip instance
  useEffect(() => {
    createdTooltips.add(tooltipId);

    // Force tooltips to be reinitialized with better production support
    const reinitTooltips = () => {
      try {
        const event = new Event("mousemove");
        document.dispatchEvent(event);

        // For production builds, also dispatch mouseenter events
        if (process.env.NODE_ENV === "production") {
          const mouseEnterEvent = new Event("mouseenter");
          document.dispatchEvent(mouseEnterEvent);
        }
      } catch (error) {
        console.warn("Tooltip reinitialization failed:", error);
      }
    };

    // Multiple initialization attempts for production reliability
    reinitTooltips();
    const timer1 = setTimeout(reinitTooltips, 100);
    const timer2 = setTimeout(reinitTooltips, 500);

    // Force reinitialization on window focus (helps with production issues)
    const handleFocus = () => reinitTooltips();
    window.addEventListener("focus", handleFocus);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener("focus", handleFocus);

      // Instead of removing DOM elements directly, just hide this tooltip
      setTooltipVisible(false);

      // Let React handle cleanup through unmounting
      createdTooltips.delete(tooltipId);
    };
  }, [tooltipId]);

  // Don't render if not visible
  if (!tooltipVisible) return null;

  // Get appropriate events based on device type
  const getEventTypes = () => {
    if (typeof window === "undefined") return ["hover"]; // Default for SSR

    // For production builds, always include hover for desktop compatibility
    // Add touch events for mobile devices
    const isMobile = isTouchDevice();

    if (isMobile) {
      // For mobile devices, use both touch and hover as fallback
      return ["touch", "hover"];
    }

    // For desktop devices, use hover primarily but add touch as fallback
    return ["hover", "touch"];
  };

  // Common tooltip props
  const tooltipProps = {
    id: tooltipId,
    delayShow: 0, // Remove delay for better mobile experience
    className: `tooltip-container tooltip-${variant}`,
    style: {
      zIndex: 10000,
      position: "fixed",
      backgroundColor: variant ? "black" : undefined,
      border: variant === "otherTraits" ? "1px solid #000000" : undefined,
      borderRadius: variant === "otherTraits" ? "4px" : undefined,
      maxWidth: "90vw",
      opacity: 0, // Start hidden
      transition: "opacity 0.2s ease-in-out", // Smooth transition
    },
    place: "bottom",
    offset: 40, // Increase distance between cursor and tooltip
    clickable: false,
    positionStrategy: "fixed",
    float: true,
    noArrow: false,
    events: getEventTypes(),
    appendTo: () =>
      document.getElementById(TOOLTIP_CONTAINER_ID) || document.body,
    // Use render prop to ensure tooltip content is properly rendered
    render: (attrs) => (
      <div
        className="tooltip-content"
        {...attrs}
        style={{
          ...attrs.style,
          overflowX: "hidden",
          overflowY: "auto",
          maxHeight: isTouchDevice() ? "70vh" : "auto", // Limit height on mobile
        }}
      >
        {variant === "champion" && (
          <div className="w-[200px] text-[#fff] bg-black">
            <div className="flex justify-start items-center gap-x-2">
              {content?.name}
              <span className="flex justify-center items-center">
                <OptimizedImage
                  src="https://res.cloudinary.com/dg0cmj6su/image/upload/v1720771035/dollar_i5ay9s.png"
                  className="w-3"
                  alt="dollar"
                  width={24}
                  height={24}
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/SkhXQAAAABJRU5ErkJggg=="
                />
                {content?.cost}
              </span>
            </div>
            <div className="mb-2">
              {content?.traits?.map((trait, index) => (
                <div className="flex justity-left items-center" key={index}>
                  <OptimizedImage
                    src={traits?.find((t) => t?.key === trait)?.imageUrl}
                    className="w-5"
                    alt={trait}
                    width={24}
                    height={24}
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/SkhXQAAAABJRU5ErkJggg=="
                  />
                  <span className="text-xs font-light">{trait}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-start items-center gap-x-2">
              <div>Abilities</div>
              <div className="flex justify-start items-center gap-x-2">
                {content?.abilities?.map((ability, index) => (
                  <div key={index}>
                    <OptimizedImage
                      src={ability?.imageUrl}
                      alt="skill"
                      width={24}
                      height={24}
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/SkhXQAAAABJRU5ErkJggg=="
                      className="w-8 rounded-sm !border !border-white/60"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="text-[10px] text-left font-light mb-1">
              {content?.skill?.desc}
            </div>
            <div className="text-xs text-left font-light">
              Attack Range: {content?.attackRange}
            </div>
            <div className="text-xs text-left font-light">
              Attack Speed: {content?.attackSpeed}
            </div>
            <div className="text-xs text-left font-light mb-1">
              Damage: {content?.attackDamage}
            </div>
            <div className="text-xs text-left font-light mb-1">
              Mana: {content?.mana}
            </div>
            <div>
              <div className="text-xs text-left font-light">
                Recommended Items
              </div>
              <div className="flex justify-start items-center gap-x-1">
                {content?.recommendItems?.map((item, index) => (
                  <OptimizedImage
                    key={index}
                    src={items?.find((i) => i?.key === item)?.imageUrl}
                    alt={item}
                    width={24}
                    height={24}
                    className="w-8 rounded-sm !border !border-white/60"
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {variant === "item" && (
          <div className="w-[150px] text-[#fff] bg-[black]">
            <div className="flex justify-start items-center gap-x-2">
              {content?.name}
            </div>
            <div className="text-xs font-light mb-2">{content?.shortDesc}</div>
            <div className="flex justify-start items-center gap-x-2">
              {content?.compositions &&
                content?.compositions.length > 0 &&
                content?.compositions?.map((comp, index) => (
                  <div className="flex justify-center items-center" key={index}>
                    <div className="rounded-full">
                      <OptimizedImage
                        src={
                          items?.find((item) => item?.key === comp)?.imageUrl
                        }
                        width={24}
                        height={24}
                        className="w-10 mr-1"
                        alt={comp}
                      />
                    </div>
                    {index < content?.compositions?.length - 1 ? " +" : ""}
                  </div>
                ))}
            </div>
          </div>
        )}

        {variant === "trait" && (
          <div className="w-[200px] text-[#fff] bg-black">
            <div className="flex justify-start items-center gap-x-2">
              {content?.name}
            </div>
            <div className="text-[12px] font-light mb-2">{content?.desc}</div>
            <div className="text-center">
              {content.stats ? (
                Object.entries(content.stats).map(([key, value]) => (
                  <div
                    className={`mb-1 text-xs flex justify-start items-center ${parseInt(key) === parseInt(content?.numUnits) || parseInt(key) - 1 === parseInt(content?.numUnits) ? "text-[#23aa23] font-bold" : "text-[#fff] font-light"}`}
                    key={key}
                  >
                    <span
                      className={`px-2 py-1 rounded-full ${parseInt(key) === parseInt(content?.numUnits) || parseInt(key) - 1 === parseInt(content?.numUnits) ? "bg-[#ffffff]" : "bg-[#a97322]"}`}
                    >
                      {key}
                    </span>
                    : {value}
                  </div>
                ))
              ) : (
                <p>No stats available.</p>
              )}
            </div>
          </div>
        )}

        {variant === "otherTraits" && (
          <div className="max-w-[300px] text-[#fff] bg-black">
            <div className="flex text-lg justify-start items-center gap-x-2">
              {"Traits"}
            </div>
            <div className="text-[12px] font-light mb-2">{content?.desc}</div>
            <div className="grid grid-cols-4 justify-center items-center gap-x-4">
              {content?.map((trait, index) => (
                <div key={index}>
                  <OptimizedImage
                    src={traits?.find((t) => t?.key === trait?.name)?.imageUrl}
                    className="w-14"
                    alt={trait?.name}
                    width={24}
                    height={24}
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/SkhXQAAAABJRU5ErkJggg=="
                  />
                  <div className="text-sm text-center font-light">
                    {trait?.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {variant === "augment" && (
          <div className="w-[200px] text-[#fff] bg-black">
            <div className="flex justify-start items-center gap-x-2">
              {content?.name}
            </div>
            <div className="text-[12px] font-light mb-2">{content?.desc}</div>
          </div>
        )}

        {variant === "force" && (
          <div className="w-fit text-[#fff] bg-black">
            <div className="flex justify-start items-center gap-x-2">
              {content?.name}
            </div>
          </div>
        )}

        {variant === "skillTree" && (
          <div className="w-[200px] text-[#fff] bg-black">
            <div className="flex justify-start items-center gap-x-2">
              {content?.name}
            </div>
          </div>
        )}

        {!variant && content}
      </div>
    ),
  };

  return (
    <TooltipPortal>
      <Tooltip {...tooltipProps} />
    </TooltipPortal>
  );
};

export default ReactTltp;

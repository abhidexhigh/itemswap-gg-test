import { Tooltip } from "react-tooltip";
import Image from "next/image";
import "react-tooltip/dist/react-tooltip.css";
import Comps from "../../data/compsNew.json";
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { OptimizedImage } from "../../utils/imageOptimizer";

// Single container ID for all tooltips
const TOOLTIP_CONTAINER_ID = "global-tooltip-container";

// Helper to detect touch devices
const isTouchDevice = () => {
  if (typeof window === "undefined") return false;
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
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
  // Run once when the component is loaded
  setTimeout(() => {
    // Force tooltips to be reinitialized
    const event = new Event("mousemove");
    document.dispatchEvent(event);

    // Add a global event listener to handle tooltip cleanup
    window.addEventListener("beforeunload", () => {
      // Clean up any tooltips that might be in the DOM
      const tooltips = document.querySelectorAll(".react-tooltip");
      tooltips.forEach((tooltip) => {
        if (tooltip && tooltip.parentNode) {
          tooltip.parentNode.removeChild(tooltip);
        }
      });
    });

    // Simplified mobile touch handling
    if (isTouchDevice()) {
      document.addEventListener(
        "touchstart",
        (e) => {
          const tooltipId =
            e.target.getAttribute("data-tooltip-id") ||
            e.target
              .closest("[data-tooltip-id]")
              ?.getAttribute("data-tooltip-id");

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
        },
        { passive: true }
      );
    }
  }, 100);
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

  // Detect if this is a touch device on mount
  useEffect(() => {
    isTouch.current = isTouchDevice();
  }, []);

  // Force tooltips to be reinitialized when component mounts
  useEffect(() => {
    const reinitTooltips = () => {
      const event = new Event("mousemove");
      document.dispatchEvent(event);
    };

    reinitTooltips();

    // Also reinitialize after a short delay to ensure everything is loaded
    const timer = setTimeout(reinitTooltips, 100);

    return () => {
      clearTimeout(timer);
      // Clean up this specific tooltip when component unmounts
      try {
        const tooltip = document.getElementById(id);
        if (tooltip && tooltip.parentNode) {
          tooltip.parentNode.removeChild(tooltip);
        }
      } catch (e) {
        console.log("Tooltip cleanup error:", e);
      }
    };
  }, [id]);

  // Get appropriate events based on device type
  const getEventTypes = () => {
    if (typeof window === "undefined") return ["hover"]; // Default for SSR

    // For touch devices, use touch events only
    if (isTouchDevice()) {
      return ["touch"];
    }

    // For non-touch devices, use hover only
    return ["hover"];
  };

  // Common tooltip props
  const tooltipProps = {
    id,
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
    clickable: true,
    positionStrategy: "fixed",
    float: true,
    noArrow: true,
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
              {content?.traits.map((trait, index) => (
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

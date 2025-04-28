import React, { useEffect, useState, useRef } from "react";
import { Tooltip } from "react-tooltip";
import "../../../assets/scss/components/tooltip/tooltip.scss";
import ChampTooltip from "./ChampTooltip";
import TraitTooltip from "./TraitTooltip";
import ItemTooltip from "./ItemTooltip";
import ForceTooltip from "./ForceTooltip";
import AugmentTooltip from "./AugmentTooltip";
import { createPortal } from "react-dom";

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

// Safe DOM node removal utility to prevent "removeChild" errors
const safelyRemoveTooltip = (id) => {
  try {
    // Find any existing tooltips with this ID
    const existingTooltips = document.querySelectorAll(`#${CSS.escape(id)}`);

    // If multiple exist, remove all but one to prevent duplicates
    if (existingTooltips.length > 1) {
      for (let i = 1; i < existingTooltips.length; i++) {
        if (existingTooltips[i] && existingTooltips[i].parentNode) {
          try {
            existingTooltips[i].parentNode.removeChild(existingTooltips[i]);
          } catch (e) {
            // Silent catch for any removeChild errors
            console.debug("Tooltip cleanup error:", e);
          }
        }
      }
    }
  } catch (err) {
    // Catch any unexpected errors but don't crash
    console.debug("Error cleaning up tooltips:", err);
  }
};

// Initialize global tooltip handling
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
          try {
            tooltip.parentNode.removeChild(tooltip);
          } catch (e) {
            // Ignore errors during cleanup
          }
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
        },
        { passive: true }
      );
    }
  }, 100);
}

const ReactTltp = ({ id, name, description, title, content, variant }) => {
  const isTouch = useRef(isTouchDevice());

  // Handle tooltip cleanup on component mount and unmount
  useEffect(() => {
    // Run cleanup on mount to remove any duplicate tooltips with this ID
    if (id) {
      safelyRemoveTooltip(id);

      // Force tooltips to be reinitialized
      const event = new Event("mousemove");
      document.dispatchEvent(event);
    }

    // Clean up on unmount
    return () => {
      if (id) {
        safelyRemoveTooltip(id);
      }
    };
  }, [id]);

  // Get common tooltip props
  const getTooltipProps = () => ({
    id,
    className: `tooltip ${variant ? `tooltip-${variant}` : ""}`,
    style: { backgroundColor: "#27272c", zIndex: 9999 },
    place: variant === "champion" || variant === "trait" ? "bottom" : "top",
    offset: 20,
    delayShow: isTouch.current ? 0 : 200,
    appendTo: () =>
      document.getElementById(TOOLTIP_CONTAINER_ID) || document.body,
    noArrow: false,
    events: isTouch.current ? ["touch"] : ["hover"],
  });

  // Choose the appropriate tooltip content based on variant
  const renderTooltip = () => {
    const tooltipProps = getTooltipProps();

    let tooltipContent;

    if (variant === "champion") {
      tooltipContent = <ChampTooltip data={content} />;
    } else if (variant === "trait") {
      tooltipContent = <TraitTooltip data={content} />;
    } else if (variant === "item") {
      tooltipContent = <ItemTooltip data={content} />;
    } else if (variant === "force") {
      tooltipContent = <ForceTooltip data={content} />;
    } else if (variant === "augment") {
      tooltipContent = <AugmentTooltip data={content} />;
    } else {
      tooltipContent = (
        <>
          {title ? <h2 className="mb-1 text-xl font-bold">{title}</h2> : null}
          {name ? <h2 className="mb-1">{name}</h2> : null}
          {description ? <p>{description}</p> : null}
          {content && !variant ? <p>{content}</p> : null}
        </>
      );
    }

    return (
      <TooltipPortal>
        <Tooltip {...tooltipProps}>{tooltipContent}</Tooltip>
      </TooltipPortal>
    );
  };

  return renderTooltip();
};

export default React.memo(ReactTltp);

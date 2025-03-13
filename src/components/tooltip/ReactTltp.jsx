import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import Comps from "../../data/compsNew.json";
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";

// Component to render tooltip in a portal
const TooltipPortal = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setMounted(true);

    // Create a container for tooltips if it doesn't exist
    if (!document.getElementById("tooltip-container")) {
      const tooltipContainer = document.createElement("div");
      tooltipContainer.id = "tooltip-container";
      tooltipContainer.style.position = "fixed";
      tooltipContainer.style.zIndex = "999999";
      tooltipContainer.style.pointerEvents = "none";
      tooltipContainer.style.top = "0";
      tooltipContainer.style.left = "0";
      tooltipContainer.style.width = "100%";
      tooltipContainer.style.height = "100%";
      document.body.appendChild(tooltipContainer);
      containerRef.current = tooltipContainer;
    } else {
      containerRef.current = document.getElementById("tooltip-container");
    }

    return () => {
      setMounted(false);
      // We don't remove the container on unmount as other tooltips might be using it
    };
  }, []);

  return mounted
    ? createPortal(
        <div
          className="tooltip-portal"
          style={{
            position: "fixed",
            zIndex: 999999,
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
  }, 1000);
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
  let renderData = "";

  // Force tooltips to be reinitialized when component mounts
  useEffect(() => {
    const reinitTooltips = () => {
      const event = new Event("mousemove");
      document.dispatchEvent(event);
    };

    reinitTooltips();

    // Also reinitialize after a short delay to ensure everything is loaded
    const timer = setTimeout(reinitTooltips, 500);

    return () => {
      clearTimeout(timer);

      // Clean up this specific tooltip when component unmounts
      try {
        const tooltip = document.getElementById(id);
        if (tooltip && tooltip.parentNode) {
          tooltip.parentNode.removeChild(tooltip);
        }
      } catch (e) {
        // Ignore errors during cleanup
        console.log("Tooltip cleanup error:", e);
      }
    };
  }, [id]);

  // Common tooltip props
  const tooltipProps = {
    id,
    delayShow: 500,
    className: "tooltip-container",
    style: {
      zIndex: 999999,
      position: "fixed",
      backgroundColor: variant ? "black" : undefined,
      border: variant === "otherTraits" ? "1px solid #000000" : undefined,
      borderRadius: variant === "otherTraits" ? "4px" : undefined,
    },
    place: "bottom",
    clickable: true,
    positionStrategy: "fixed",
    float: true,
    noArrow: true,
    appendTo: () =>
      document.getElementById("tooltip-container") || document.body,
    // Use render prop to ensure tooltip content is properly rendered
    render: (attrs) => (
      <div className="tooltip-content" {...attrs}>
        {variant === "champion" && (
          <div className="w-[200px] text-[#fff] bg-black">
            <div className="flex justify-start items-center gap-x-2">
              {content?.name}
              <span className="flex justify-center items-center">
                <img
                  src="https://res.cloudinary.com/dg0cmj6su/image/upload/v1720771035/dollar_i5ay9s.png"
                  className="w-3"
                />
                {content?.cost}
              </span>
            </div>
            <div className="mb-2">
              {content?.traits.map((trait) => (
                <div className="flex justity-left items-center">
                  <img
                    src={traits?.find((t) => t?.key === trait)?.imageUrl}
                    className="w-5"
                  />
                  <span className="text-xs font-light">{trait}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-start items-center text-xs font-light mb-2">
              <div>Attack Range: </div>
              <div>{content?.attackRange}</div>
            </div>
            <div className="flex justify-start items-center gap-x-2">
              <img src={content?.skill?.imageUrl} className="w-6" />
              <div className="text-xs font-light">
                <div>{content?.skill?.name}</div>
                <div>Mana: {content?.skill?.skillMana}</div>
              </div>
            </div>
            <div className="text-[10px] text-left font-light mb-1">
              {content?.skill?.desc}
            </div>
            <div className="text-xs text-left font-light">
              Attack Speed: {content?.attackSpeed}
            </div>
            <div className="text-xs text-left font-light mb-1">
              Damage: {content?.damagePerSecond}
            </div>
            <div>
              <div className="text-xs text-left font-light">
                Recommended Items
              </div>
              <div className="flex justify-start items-center gap-x-1">
                {content?.recommendItems?.map((item) => (
                  <img
                    src={items?.find((i) => i?.key === item)?.imageUrl}
                    className="w-8"
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
                  <div className="flex justify-center items-center">
                    <div className="rounded-full">
                      <img
                        src={
                          items?.find((item) => item?.key === comp)?.imageUrl
                        }
                        className="w-10 mr-1"
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
                    className={`mb-1 text-xs flex justify-start items-center ${parseInt(key) === parseInt(content?.numUnits) || parseInt(key) - 1 === parseInt(content?.numUnits) ? "text-[#23aa23] font-bold" : "text-[#fff]  font-light"}`}
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
              {content?.map((trait) => (
                <div className="">
                  <img
                    src={traits?.find((t) => t?.key === trait?.name)?.imageUrl}
                    className="w-14"
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

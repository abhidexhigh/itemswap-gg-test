import { createContext, useContext, useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { OptimizedImage } from "../../utils/imageOptimizer";
import ItemDisplay from "../item/ItemDisplay";
import { useCompsData } from "../../hooks/useCompsData";

// Context for tooltip management
const TooltipContext = createContext();

// Hook to use tooltip
export const useTooltip = () => {
  const context = useContext(TooltipContext);
  if (!context) {
    throw new Error("useTooltip must be used within TooltipProvider");
  }
  return context;
};

// Single tooltip component
const TooltipContent = ({
  variant,
  content,
  position,
  visible,
  isBelow = false,
  champions,
  items,
  traits,
}) => {
  if (!visible || !content) return null;

  const renderContent = () => {
    switch (variant) {
      case "champion":
        return (
          <div className="w-[200px] text-[#fff] !bg-black !border !border-white/30 !rounded-lg !p-2">
            <div className="flex justify-start items-center gap-x-2">
              {content?.name}
              <span className="flex justify-center items-center">
                <OptimizedImage
                  src="https://res.cloudinary.com/dg0cmj6su/image/upload/v1720771035/dollar_i5ay9s.png"
                  className="w-3"
                  alt="dollar"
                  width={24}
                  height={24}
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
        );

      case "item":
        return (
          <div className="w-[150px] text-[#fff] bg-[black] shadow-md rounded-lg p-2 !border border-white/30">
            <div className="flex justify-center text-center items-center gap-x-2">
              {content?.name}
            </div>
            <div className="text-xs text-center font-light mb-2">
              {content?.shortDesc}
            </div>
            <div className="flex justify-center items-center gap-x-2">
              {content?.compositions &&
                content?.compositions.length > 0 &&
                content?.compositions?.map((comp, index) => (
                  <div className="flex justify-center items-center" key={index}>
                    <ItemDisplay
                      item={items?.find((item) => item?.key === comp)}
                      tooltipId={`tooltip-comp-${comp}-${index}`}
                      size="xxSmall"
                      showFrame={true}
                      showTooltip={false}
                      borderRadius="rounded-full"
                      backgroundRadius="rounded-full"
                      style="default"
                    />
                    {index < content?.compositions?.length - 1 && (
                      <span className="mx-1 text-white">+</span>
                    )}
                  </div>
                ))}
            </div>
          </div>
        );

      case "trait":
        return (
          <div className="w-[200px] text-[#fff] !bg-black shadow-md rounded-lg p-2 !border border-white/30">
            <div className="flex justify-start items-center gap-x-2">
              {content?.name}
            </div>
            <div className="text-[12px] font-light mb-2">{content?.desc}</div>
            <div className="text-center">
              {content?.tiers?.map((tier, index) => {
                if (tier?.tier === "base") return null;
                return (
                  <div
                    className="flex justify-start items-center gap-x-2"
                    key={index}
                  >
                    <div
                      className={`text-xs font-light ${tier.min === content?.tier?.min ? "text-green-500 font-bold" : ""}`}
                    >
                      {tier?.min && `${tier?.min} - `}
                    </div>
                    <div
                      className={`text-xs font-light ${content?.tier?.min && tier.min === content?.tier?.min ? "text-green-500 font-bold" : ""}`}
                    >
                      {tier?.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case "otherTraits":
        return (
          <div className="max-w-[300px] text-[#fff] !bg-black !border !border-white/30 !rounded-lg !p-2">
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
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/SkhXQAAAABJRU5ErkJggg=="
                  />
                  <div className="text-sm text-center font-light">
                    {trait?.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "augment":
        return (
          <div className="w-[200px] text-[#fff] !bg-black !border !border-white/30 !rounded-lg !p-2">
            <div className="flex justify-start items-center gap-x-2">
              {content?.name}
            </div>
            <div className="text-[12px] font-light mb-2">{content?.desc}</div>
          </div>
        );

      case "force":
        return (
          <div className="w-fit text-[#fff] !bg-black !border !border-white/30 !rounded-lg !p-2">
            <div className="flex justify-start items-center gap-x-2">
              {content?.name}
            </div>
          </div>
        );

      case "skillTree":
        return (
          <div className="w-[200px] text-[#fff] !bg-black !border !border-white/30 !rounded-lg !p-2">
            <div className="flex justify-start items-center gap-x-2">
              {content?.name}
            </div>
          </div>
        );

      default:
        return (
          <div className="text-[#fff] !bg-black !border !border-white/30 !rounded-lg !p-2">
            {content}
          </div>
        );
    }
  };

  return (
    <div
      className="fixed z-[99999999999999] pointer-events-none"
      style={{
        left: position.x,
        top: position.y,
        transform: isBelow ? "translate(-50%, 0)" : "translate(-50%, -100%)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.15s ease-in-out",
      }}
    >
      <div className="tooltip-content">{renderContent()}</div>
    </div>
  );
};

// Tooltip provider component
export const TooltipProvider = ({ children }) => {
  const [tooltip, setTooltip] = useState({
    visible: false,
    content: null,
    variant: "",
    position: { x: 0, y: 0 },
    isBelow: false,
  });

  const timeoutRef = useRef(null);
  const [container, setContainer] = useState(null);

  // Use the hook to get game data
  const { champions, items, traits } = useCompsData();

  useEffect(() => {
    // Create tooltip container
    const tooltipContainer = document.createElement("div");
    tooltipContainer.id = "global-tooltip-container";
    tooltipContainer.style.position = "fixed";
    tooltipContainer.style.top = "0";
    tooltipContainer.style.left = "0";
    tooltipContainer.style.width = "100%";
    tooltipContainer.style.height = "100%";
    tooltipContainer.style.pointerEvents = "none";
    tooltipContainer.style.zIndex = "99999999999999"; // Higher than header z-index

    document.body.appendChild(tooltipContainer);
    setContainer(tooltipContainer);

    return () => {
      if (tooltipContainer && document.body.contains(tooltipContainer)) {
        document.body.removeChild(tooltipContainer);
      }
    };
  }, []);

  const showTooltip = (variant, content, event) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const rect = event.target.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Estimate tooltip dimensions (we'll adjust these based on content)
    let tooltipWidth = 200; // Default width
    let tooltipHeight = 150; // Default height

    // Adjust dimensions based on variant
    switch (variant) {
      case "champion":
        tooltipWidth = 200;
        tooltipHeight = 250;
        break;
      case "item":
        tooltipWidth = 150;
        tooltipHeight = 120;
        break;
      case "trait":
        tooltipWidth = 200;
        tooltipHeight = 180;
        break;
      case "otherTraits":
        tooltipWidth = 300;
        tooltipHeight = 200;
        break;
      case "augment":
      case "force":
      case "skillTree":
        tooltipWidth = 200;
        tooltipHeight = 80;
        break;
    }

    // Calculate initial position (centered above the element)
    let x = rect.left + rect.width / 2;
    let y = rect.top - 10;
    let isBelow = false;

    // Horizontal boundary checks
    if (x - tooltipWidth / 2 < 10) {
      // Too far left, align to left edge
      x = tooltipWidth / 2 + 10;
    } else if (x + tooltipWidth / 2 > viewportWidth - 10) {
      // Too far right, align to right edge
      x = viewportWidth - tooltipWidth / 2 - 10;
    }

    // Vertical boundary checks
    if (y - tooltipHeight < 10) {
      // Not enough space above, show below the element
      y = rect.bottom + 10;
      isBelow = true;
    }

    // If still going outside bottom viewport, adjust
    if (y + tooltipHeight > viewportHeight - 10) {
      y = viewportHeight - tooltipHeight - 10;
    }

    setTooltip({
      visible: true,
      content,
      variant,
      position: { x, y },
      isBelow,
    });
  };

  const hideTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setTooltip((prev) => ({ ...prev, visible: false }));
    }, 100);
  };

  const value = {
    showTooltip,
    hideTooltip,
  };

  return (
    <TooltipContext.Provider value={value}>
      {children}
      {container &&
        createPortal(
          <TooltipContent
            {...tooltip}
            champions={champions}
            items={items}
            traits={traits}
          />,
          container
        )}
    </TooltipContext.Provider>
  );
};

// Hook component for easy usage
export const WithTooltip = ({
  children,
  variant,
  content,
  className = "",
  ...props
}) => {
  const { showTooltip, hideTooltip } = useTooltip();

  const handleMouseEnter = (e) => {
    if (content) {
      showTooltip(variant, content, e);
    }
  };

  const handleMouseLeave = () => {
    hideTooltip();
  };

  return (
    <div
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </div>
  );
};

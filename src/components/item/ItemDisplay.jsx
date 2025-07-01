import React, { useMemo } from "react";
import Image from "next/image";
import { WithTooltip } from "../tooltip/GlobalTooltip";
import { OptimizedImage } from "../../utils/imageOptimizer";

// Background styles
const backgroundStyles = {
  // Black gradient (default style)
  default:
    "bg-[linear-gradient(to_bottom,rgba(31,41,55,0.3)_0%,rgba(0,0,0,1)_80%)] blur-[1px]",

  // Other styles available if needed
  blackVoid:
    "bg-[radial-gradient(circle,rgba(156,163,175,0.1)_0%,rgba(2,6,23,0.98)_80%)] blur-[1.5px]",
  blackElliptical:
    "bg-[radial-gradient(ellipse_at_center,rgba(75,85,99,0.15)_0%,rgba(0,0,0,0.95)_60%)] blur-[1.5px]",
  indigoGlow:
    "bg-[radial-gradient(circle,rgba(79,70,229,0.3)_0%,rgba(17,24,39,0.85)_70%)] blur-[1.5px]",
};

const ItemDisplay = ({
  item,
  isHovered = false,
  isFaded = false,
  tooltipId,
  style = "default",
  // Size customization props with defaults matching original sizes
  size = "medium", // 'small', 'medium', 'large', or custom object
  frameSize, // Custom frame size override
  imageSize, // Custom image size override
  borderRadius = "rounded-[0px]",
  backgroundRadius = "rounded-[16px]",
  showTooltip = true,
  showFrame = true,
}) => {
  // Size presets - using identical width/height for perfect squares
  const sizePresets = {
    xxSmall: {
      container: "h-[24px] w-[24px] md:h-[32px] md:w-[32px]",
      frame: "h-full w-full",
      image: "h-[16px] w-[16px] md:h-[24px] md:w-[24px]",
    },
    xSmall: {
      container: "h-[32px] w-[32px] md:h-[48px] md:w-[48px]",
      frame: "h-full w-full",
      image: "h-[24px] w-[24px] md:h-[32px] md:w-[32px]",
    },
    small: {
      container: "h-[48px] w-[48px] md:h-[64px] md:w-[64px]",
      frame: "h-full w-full",
      image: "h-[40px] w-[40px] md:h-[56px] md:w-[56px]",
    },
    midSmall: {
      container: "h-[56px] w-[56px] md:h-[72px] md:w-[72px]",
      frame: "h-full w-full",
      image: "h-[48px] w-[48px] md:h-[64px] md:w-[64px]",
    },
    midMedium: {
      container: "h-[60px] w-[60px] md:h-[80px] md:w-[80px]",
      frame: "h-full w-full",
      image: "h-[52px] w-[52px] md:h-[72px] md:w-[72px]",
    },
    medium: {
      container: "h-[64px] w-[64px] md:h-[96px] md:w-[96px]",
      frame: "h-full w-full",
      image: "h-[56px] w-[56px] md:h-[84px] md:w-[84px]",
    },
    large: {
      container: "h-[72px] w-[72px] md:h-[120px] md:w-[120px]",
      frame: "h-full w-full",
      image: "h-[64px] w-[64px] md:h-[108px] md:w-[108px]",
    },
  };

  // Determine sizes to use
  const containerSizeClass =
    typeof size === "object" ? size.container : sizePresets[size]?.container;
  const frameSizeClass =
    frameSize ||
    (typeof size === "object" ? size.frame : sizePresets[size]?.frame);
  const imageSizeClass =
    imageSize ||
    (typeof size === "object" ? size.image : sizePresets[size]?.image);

  const content = (
    <div
      className={`relative flex items-center justify-center ${containerSizeClass}`}
    >
      {/* Background Effect */}
      <div
        className={`absolute inset-0 z-0 flex items-center justify-center overflow-hidden ${backgroundRadius}`}
      >
        <div className={`absolute inset-0 ${backgroundStyles[style]}`}></div>
      </div>

      {/* Frame Image */}
      {showFrame && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <OptimizedImage
            src="https://res.cloudinary.com/dg0cmj6su/image/upload/v1746434099/item_1_mpqgp5.webp"
            alt="item frame"
            width={36}
            height={36}
            className={`aspect-square object-contain ${frameSizeClass}`}
            loading="eager"
            fetchPriority="high"
          />
        </div>
      )}

      {/* Item Image */}
      <div className="relative z-10 flex items-center justify-center">
        <OptimizedImage
          src={item?.imageUrl}
          alt={item?.name}
          width={36}
          height={36}
          className={`aspect-square object-contain ${
            isHovered ? "opacity-100" : "opacity-80"
          } ${isFaded ? "opacity-20 grayscale" : ""} ${borderRadius}`}
          loading="eager"
          fetchPriority="high"
        />
      </div>
    </div>
  );

  return showTooltip ? (
    <WithTooltip variant="item" content={item}>
      {content}
    </WithTooltip>
  ) : (
    content
  );
};

export default ItemDisplay;

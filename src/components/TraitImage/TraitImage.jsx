import React from "react";
import { OptimizedImage } from "src/utils/imageOptimizer";
import ReactTltp from "../tooltip/ReactTltp";

const TraitImage = ({
  trait,
  size = "default",
  className = "",
  showFrame = true,
  tooltipId,
  showTooltip = true,
  ...props
}) => {
  // Define size variants
  const sizeClasses = {
    small: "w-[38px] h-[38px]",
    default: "w-[56px] h-[56px]",
    large: "w-[80px] h-[80px]",
    xlarge: "w-[96px] h-[96px]",
  };

  const imageSize = sizeClasses[size] || sizeClasses.default;

  // Frame URL from Cloudinary
  const frameUrl =
    "https://res.cloudinary.com/dg0cmj6su/image/upload/v1746632714/vecteezy_gold-square-frame-on-transparent-background_42730276_1_1_ree5mp.webp";

  return (
    <div className={`relative ${imageSize} ${className}`} {...props}>
      {/* Main trait image */}
      <OptimizedImage
        alt={trait?.name || "Trait"}
        width={
          size === "small"
            ? 38
            : size === "large"
              ? 80
              : size === "xlarge"
                ? 96
                : 56
        }
        height={
          size === "small"
            ? 38
            : size === "large"
              ? 80
              : size === "xlarge"
                ? 96
                : 56
        }
        src={trait?.tier?.imageUrl || trait?.imageUrl}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover object-center w-full h-full"
        loading="eager"
        data-tooltip-id={tooltipId}
      />

      {/* Gold frame overlay */}
      {showFrame && (
        <OptimizedImage
          alt="Gold frame"
          width={
            size === "small"
              ? 38
              : size === "large"
                ? 80
                : size === "xlarge"
                  ? 96
                  : 56
          }
          height={
            size === "small"
              ? 38
              : size === "large"
                ? 80
                : size === "xlarge"
                  ? 96
                  : 56
          }
          src={frameUrl}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10"
          loading="eager"
        />
      )}

      {/* Tooltip always rendered to prevent flickering */}
      {showTooltip && (
        <ReactTltp variant="trait" id={tooltipId} content={trait} />
      )}
    </div>
  );
};

export default TraitImage;

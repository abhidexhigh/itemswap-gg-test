import React, { memo } from "react";
import { OptimizedImage } from "../../utils/imageOptimizer";
import ReactTltp from "../tooltip/ReactTltp";

const AugmentImage = memo(
  ({
    augment,
    size = "default",
    className = "",
    showTooltip = true,
    tooltipId,
    loading = "lazy",
    ...props
  }) => {
    if (!augment || !augment.imageUrl) return null;

    // Size configurations with proper dimensions
    const sizeConfigs = {
      small: {
        containerClass: "w-6 h-6", // 24px
        width: 24,
        height: 24,
        sizes: "24px",
      },
      default: {
        containerClass: "w-8 h-8", // 32px
        width: 32,
        height: 32,
        sizes: "32px",
      },
      medium: {
        containerClass: "w-9 h-9", // 36px
        width: 36,
        height: 36,
        sizes: "36px",
      },
      large: {
        containerClass: "w-12 h-12", // 48px
        width: 48,
        height: 48,
        sizes: "48px",
      },
      xlarge: {
        containerClass: "w-16 h-16", // 64px
        width: 64,
        height: 64,
        sizes: "64px",
      },
      xxlarge: {
        containerClass: "w-20 h-20", // 80px
        width: 80,
        height: 80,
        sizes: "80px",
      },
    };

    const config = sizeConfigs[size] || sizeConfigs.default;
    const uniqueTooltipId =
      tooltipId || `augment-${augment.key}-${Math.random()}`;

    return (
      <div
        className={`relative inline-block ${config.containerClass} ${className}`}
        {...props}
      >
        {/* Augment Image */}
        <OptimizedImage
          alt={augment.name || "Augment"}
          width={config.width}
          height={config.height}
          src={augment.imageUrl}
          className="w-full h-full object-contain object-center rounded-md border border-[#ffffff20]"
          data-tooltip-id={showTooltip ? uniqueTooltipId : undefined}
          loading={loading}
          sizes={config.sizes}
        />

        {/* Tooltip */}
        {showTooltip && (
          <ReactTltp variant="augment" content={augment} id={uniqueTooltipId} />
        )}
      </div>
    );
  }
);

AugmentImage.displayName = "AugmentImage";

export default AugmentImage;

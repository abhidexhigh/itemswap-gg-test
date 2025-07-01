import React, { memo } from "react";
import { OptimizedImage } from "../../utils/imageOptimizer";
import { WithTooltip } from "../tooltip/GlobalTooltip";

const SkillTreeImage = memo(
  ({
    skill,
    skills,
    size = "default",
    className = "",
    showTooltip = true,
    tooltipId,
    skillTree, // For backward compatibility when passing skill key directly
  }) => {
    // Handle both skill object and skill key scenarios
    const skillDetails =
      skill || (skillTree && skills?.find((s) => s.key === skillTree));

    if (!skillDetails) return null;

    // Size configurations
    const sizeClasses = {
      small: "w-6 h-6", // 24px
      default: "w-8 h-8", // 32px
      medium: "w-10 h-10", // 40px
      large: "w-12 h-12", // 48px
      xlarge: "w-14 h-14", // 56px
    };

    const containerSize = sizeClasses[size] || sizeClasses.default;
    const uniqueTooltipId =
      tooltipId || `skill-${skillDetails.key}-${Math.random()}`;

    const content = (
      <div className={`relative inline-block ${containerSize} ${className}`}>
        {/* Frame Image */}
        <OptimizedImage
          src="https://res.cloudinary.com/dg0cmj6su/image/upload/v1749019145/round_frame_v2_1_wgu1h9.webp"
          alt="Skill Frame"
          width={48}
          height={48}
          className="absolute inset-0 w-full h-full object-contain pointer-events-none z-10"
          loading="eager"
          fetchPriority="high"
        />

        {/* Skill Image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <OptimizedImage
            alt={skillDetails.name || "Skill"}
            width={40}
            height={40}
            src={skillDetails.imageUrl}
            className="w-full h-full object-cover aspect-square"
            loading="eager"
          />
        </div>
      </div>
    );

    return showTooltip ? (
      <WithTooltip variant="skillTree" content={skillDetails}>
        {content}
      </WithTooltip>
    ) : (
      content
    );
  }
);

SkillTreeImage.displayName = "SkillTreeImage";

export default SkillTreeImage;

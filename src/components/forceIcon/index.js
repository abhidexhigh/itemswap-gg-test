import React, { useRef, useEffect } from "react";
import { OptimizedImage } from "../../utils/imageOptimizer";

const ForceIcon = ({
  force,
  size = "small", // small, medium, large, or custom
  customSize,
  isHovered = false,
  className = "",
  iconFrameUrl = "https://res.cloudinary.com/dg0cmj6su/image/upload/v1745572723/force_icon_frame_1_dzkfh9.webp",
}) => {
  const forceVideoRef = useRef(null);
  const hasVideo = Boolean(force?.videoUrl);

  // Size mapping
  const sizeClasses = {
    small: "w-[20px] md:w-[30px]",
    medium: "w-[30px] md:w-[40px]",
    large: "w-[40px] md:w-[60px]",
    xxlarge: "w-[60px] md:w-[96px]",
    custom: customSize || "w-[20px] md:w-[30px]",
  };

  const containerClass = sizeClasses[size] || sizeClasses.small;

  // Padding for image vs video
  const contentPadding = hasVideo && size === "xxlarge" ? "p-2.5" : "p-1";

  // Effect to handle force video play when parent is hovered
  useEffect(() => {
    if (isHovered && forceVideoRef.current && hasVideo) {
      // Play force video on hover
      const playPromise = forceVideoRef.current.play();

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Error playing force video:", error);
        });
      }
    } else if (!isHovered && forceVideoRef.current) {
      // Pause and reset force video when not hovering
      forceVideoRef.current.pause();
      forceVideoRef.current.currentTime = 0;
    }
  }, [isHovered, hasVideo]);

  // Effect to preload video
  useEffect(() => {
    if (hasVideo && forceVideoRef.current) {
      forceVideoRef.current.load();
    }
  }, [hasVideo]);

  return (
    <div className={`relative ${containerClass} ${className}`}>
      {force && (
        <>
          {hasVideo ? (
            <video
              ref={forceVideoRef}
              src={force.videoUrl}
              muted
              playsInline
              loop
              className={`rounded-full ${containerClass} ${contentPadding}`}
              preload="auto"
            />
          ) : (
            <OptimizedImage
              src={force.imageUrl}
              alt="force"
              width={60}
              height={60}
              className={`rounded-full ${containerClass} ${contentPadding}`}
            />
          )}
          <OptimizedImage
            src={iconFrameUrl}
            className="absolute top-0 right-0 w-full object-contain"
            alt="Border Image"
            width={200}
            height={200}
          />
        </>
      )}
    </div>
  );
};

export default ForceIcon;

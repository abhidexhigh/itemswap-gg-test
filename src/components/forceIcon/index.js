import React, { useRef, useEffect, memo, useState } from "react";
import { OptimizedImage } from "../../utils/imageOptimizer";

const ForceIcon = ({
  force,
  size = "small", // small, medium, large, or custom
  customSize,
  isHovered = false,
  className = "w-[40px] md:w-[30px]",
  iconFrameUrl = "https://res.cloudinary.com/dg0cmj6su/image/upload/v1745572723/force_icon_frame_1_dzkfh9.webp",
  showImageOnly = false, // New prop to force showing static image only
}) => {
  const forceVideoRef = useRef(null);
  const hasVideo = Boolean(force?.videoUrl);
  const videoLoadedRef = useRef(false);
  const [showVideo, setShowVideo] = useState(false);

  // Size mapping
  const sizeClasses = {
    small: "w-[30px] md:w-[30px]",
    medium: "w-[30px] md:w-[40px]",
    large: "w-[40px] md:w-[60px]",
    xxlarge: "w-[60px] md:w-[96px]",
    custom: customSize || "w-[20px] md:w-[30px]",
  };

  const containerClass = sizeClasses[size] || sizeClasses.small;

  // Padding for image vs video
  const contentPadding = hasVideo && size === "xxlarge" ? "p-2.5" : "p-1";

  // Effect to handle video loading and play state
  useEffect(() => {
    // If showImageOnly is true, don't handle video at all
    if (showImageOnly || !hasVideo) {
      setShowVideo(false);
      return;
    }

    if (isHovered) {
      // Only load and show video when hovered
      if (forceVideoRef.current && !videoLoadedRef.current) {
        forceVideoRef.current.load();
        videoLoadedRef.current = true;
      }

      // Set state to show video after a small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setShowVideo(true);

        // Play the video
        if (forceVideoRef.current) {
          const playPromise = forceVideoRef.current.play();

          if (playPromise !== undefined) {
            playPromise.catch((error) => {
              if (process.env.NODE_ENV === "development") {
                console.error("Error playing force video:", error);
              }
            });
          }
        }
      }, 50);

      return () => clearTimeout(timer);
    } else {
      // Hide video when not hovered
      setShowVideo(false);

      // Pause and reset video
      if (forceVideoRef.current) {
        forceVideoRef.current.pause();
        forceVideoRef.current.currentTime = 0;
      }
    }
  }, [isHovered, hasVideo, showImageOnly]);

  // Don't render if there's no force data
  if (!force) return null;

  return (
    <div className={`relative ${containerClass} ${className}`}>
      {/* Always render the static image */}
      <OptimizedImage
        src={force.imageUrl}
        alt="force"
        width={60}
        height={60}
        className={`rounded-full ${containerClass} ${contentPadding} ${showVideo ? "opacity-0 absolute" : "opacity-100"}`}
        loading="eager"
        fetchPriority="high"
      />

      {/* Render video element only if needed, but keep it hidden until ready */}
      {hasVideo && !showImageOnly && (
        <video
          ref={forceVideoRef}
          src={force.videoUrl}
          muted
          playsInline
          loop
          className={`rounded-full ${containerClass} ${contentPadding} ${showVideo ? "opacity-100" : "opacity-0 absolute"}`}
          preload="none"
        />
      )}

      <OptimizedImage
        src={iconFrameUrl}
        className="absolute top-0 right-0 w-full object-contain"
        alt="Border Image"
        width={200}
        height={200}
        loading="eager"
        fetchPriority="high"
      />
    </div>
  );
};

// Memoize component to prevent unnecessary re-renders
export default memo(ForceIcon);

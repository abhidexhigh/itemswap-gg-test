import React, { useRef, useEffect, memo, useState, useCallback } from "react";
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
  const [videoError, setVideoError] = useState(false);
  const hoverTimeoutRef = useRef(null);

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

  // Handle video errors
  const handleVideoError = useCallback(() => {
    setVideoError(true);
    setShowVideo(false);
    console.warn(
      `Force video not available for: ${force?.name || "Unknown force"}`
    );
  }, [force?.name]);

  // Effect to handle video loading and play state with smooth transitions
  useEffect(() => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    // If showImageOnly is true or no video, don't handle video at all
    if (showImageOnly || !hasVideo || videoError) {
      setShowVideo(false);
      return;
    }

    if (isHovered) {
      // Preload video metadata first for smoother transition
      if (forceVideoRef.current && !videoLoadedRef.current) {
        forceVideoRef.current.preload = "metadata";
        forceVideoRef.current.load();
        videoLoadedRef.current = true;
      }

      // Debounced hover to avoid rapid state changes
      hoverTimeoutRef.current = setTimeout(() => {
        setShowVideo(true);

        // Play the video after a brief delay for smooth transition
        setTimeout(() => {
          if (forceVideoRef.current && isHovered) {
            // Load full video content when needed
            forceVideoRef.current.preload = "auto";

            const playPromise = forceVideoRef.current.play();

            if (playPromise !== undefined) {
              playPromise.catch((error) => {
                if (process.env.NODE_ENV === "development") {
                  console.error("Error playing force video:", error);
                }
                setVideoError(true);
                setShowVideo(false);
              });
            }
          }
        }, 100);
      }, 50);
    } else {
      // Smooth transition out
      setShowVideo(false);

      // Pause and reset video with delay to allow transition
      setTimeout(() => {
        if (forceVideoRef.current) {
          forceVideoRef.current.pause();
          forceVideoRef.current.currentTime = 0;
        }
      }, 300); // Match transition duration
    }

    // Cleanup function
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
    };
  }, [isHovered, hasVideo, showImageOnly, videoError]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Don't render if there's no force data
  if (!force) return null;

  return (
    <div className={`relative ${containerClass} ${className}`}>
      {/* Always render the static image with smooth transition */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${
          showVideo && !videoError ? "opacity-0" : "opacity-100"
        }`}
      >
        <OptimizedImage
          src={force.imageUrl}
          alt="force"
          width={60}
          height={60}
          className={`rounded-full w-full h-full ${contentPadding} object-cover`}
          loading="eager"
          fetchPriority="high"
        />
      </div>

      {/* Render video element with smooth transition */}
      {hasVideo && !showImageOnly && !videoError && (
        <div
          className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${
            showVideo ? "opacity-100" : "opacity-0"
          }`}
        >
          <video
            ref={forceVideoRef}
            src={force.videoUrl}
            muted
            playsInline
            loop
            onError={handleVideoError}
            className={`rounded-full w-full h-full ${contentPadding} object-cover`}
            preload="none"
          />
        </div>
      )}

      {/* Frame overlay */}
      <OptimizedImage
        src={iconFrameUrl}
        className="absolute top-0 right-0 w-full h-full object-contain pointer-events-none z-10"
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

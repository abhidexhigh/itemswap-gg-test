import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { OptimizedImage } from "../../utils/imageOptimizer";
import ReactTltp from "../tooltip/ReactTltp";
import ForceIcon from "../forceIcon";

const CardImage = ({
  src,
  imgStyle = "w-[48px] md:w-[96px]",
  identificationImageStyle = "w-[16px] md:w-[32px]",
  textStyle = "text-[10px] md:text-[16px]",
  forces,
  cardSize = "",
  tier = 0, // Add tier prop with default value 0
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // Default to true to show initial image
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [videoAvailable, setVideoAvailable] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Check if source has a video
  const hasVideo = useMemo(() => Boolean(src?.cardVideo), [src?.cardVideo]);

  // Check if force has a video
  const hasForceVideo = useMemo(() => {
    if (!forces || !src?.variant) return false;
    return Boolean(
      forces.find((force) => force.key === src?.variant)?.videoUrl
    );
  }, [forces, src?.variant]);

  // Get force object for the ForceIcon
  const forceObject = useMemo(() => {
    if (!forces || !src?.variant) return null;
    return forces.find((force) => force.key === src?.variant);
  }, [forces, src?.variant]);

  // Setup intersection observer to detect when card is visible
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
          // Reset hover state when not visible
          setIsHovered(false);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  // Simplified video handling logic
  useEffect(() => {
    if (!isVisible || !hasVideo || !videoRef.current) return;

    if (isHovered && videoAvailable) {
      // Only load video when needed
      if (!videoLoaded) {
        videoRef.current.load();
        setVideoLoaded(true);
      }

      const playPromise = videoRef.current.play();

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Error playing video:", error);
          if (error.name === "NotAllowedError" || error.name === "AbortError") {
            // Browser policy prevented autoplay or user interrupted
            setVideoAvailable(false);
          }
        });
      }
    } else if (videoRef.current) {
      videoRef.current.pause();
      if (!isVisible) {
        // Reset video state when not visible to free resources
        videoRef.current.currentTime = 0;
        setVideoLoaded(false);
      }
    }
  }, [isHovered, isVisible, hasVideo, videoAvailable, videoLoaded]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleVideoError = useCallback(() => {
    setVideoAvailable(false);
    console.warn(`Video not available for: ${src?.name || "Unknown"}`);
  }, [src?.name]);

  // Create array of star count based on tier
  const starArray = useMemo(() => {
    return tier > 0 ? Array(tier).fill(1) : [];
  }, [tier]);

  return (
    <div className="inline-flex flex-col items-center">
      <div className="inline-flex items-center justify-center flex-col">
        <div className="inline-flex flex-col">
          {/* Star icons display above the image */}
          {tier > 0 && (
            <div
              className={`flex justify-center gap-[1px] mb-1 ${
                tier > 2 ? "visible" : "invisible"
              }`}
            >
              {starArray.map((_, index) => (
                <OptimizedImage
                  key={index}
                  src={`${tier === 4 ? "https://res.cloudinary.com/dg0cmj6su/image/upload/v1746781271/prismatic_i5en18.webp" : "https://res.cloudinary.com/dg0cmj6su/image/upload/v1746781271/gold_3_atgi3f.webp"}`}
                  width={12}
                  height={12}
                  className="w-[10px] h-[10px] md:w-[14px] md:h-[14px]"
                  alt="Star"
                />
              ))}
            </div>
          )}
          <div className={`flex flex-col rounded-lg`}>
            <div
              ref={containerRef}
              className={`relative !bg-black rounded-lg ${cardSize}`}
              data-tooltip-id={src?.key}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {/* Show video on hover if available, otherwise show image */}
              {isVisible && isHovered && hasVideo && videoAvailable ? (
                <video
                  ref={videoRef}
                  src={src?.cardVideo}
                  muted
                  playsInline
                  loop
                  onError={handleVideoError}
                  className={`object-cover object-center rounded-lg w-full h-full ${imgStyle}`}
                  preload="metadata"
                />
              ) : (
                src?.cardImage && (
                  <OptimizedImage
                    src={src?.cardImage}
                    alt="champion"
                    width={80}
                    height={80}
                    className={`object-cover object-canter mx-auto rounded-lg w-auto h-full ${imgStyle}`}
                    loading={isVisible ? "eager" : "lazy"}
                    fetchPriority={isVisible ? "high" : "auto"}
                  />
                )
              )}
              <OptimizedImage
                src={
                  "https://res.cloudinary.com/dg0cmj6su/image/upload/v1744443307/ghjhhhhhhhh_axvnyo.png"
                }
                className="absolute top-0 right-0 w-full h-full"
                alt="Border Image"
                width={200}
                height={200}
                loading={isVisible ? "eager" : "lazy"}
                fetchPriority={isVisible ? "high" : "auto"}
              />
              {/* Force icon container - always render */}
              <div
                className={`absolute -top-[6px] -right-[6px] w-[20px] rounded-full overflow-hidden md:w-[30px] ${identificationImageStyle}`}
              >
                {forceObject && (
                  <ForceIcon
                    force={forceObject}
                    isHovered={isHovered}
                    size="small"
                    showImageOnly={!isVisible || !isHovered}
                    className="w-[20px] rounded-full overflow-hidden md:w-[30px]"
                  />
                )}
              </div>
            </div>
            {isVisible && (
              <ReactTltp variant="champion" id={src?.key} content={src} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardImage;

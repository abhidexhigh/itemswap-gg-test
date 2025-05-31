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
import costWiseFrameData from "../../data/costWiseFrame.json";

const CardImage = ({
  src,
  imgStyle = "w-[48px] md:w-[96px]",
  identificationImageStyle = "w-[16px] md:w-[32px]",
  textStyle = "text-[10px] md:text-[16px]",
  forces,
  cardSize = "",
  tier = 0, // Add tier prop with default value 0
  showCost = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // Default to true to show initial image
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const imageRef = useRef(null);
  const [videoAvailable, setVideoAvailable] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

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

  // Get frame image based on cost
  const frameImage = useMemo(() => {
    const frameData = costWiseFrameData.costWiseFrame.find(
      (frame) => frame.cost === src.cost
    );
    return frameData?.imageUrl || costWiseFrameData.costWiseFrame[0].imageUrl; // fallback to cost 1 frame
  }, [src]);

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

  // Preload video when component mounts to make hover transition smoother
  useEffect(() => {
    if (hasVideo && src?.cardVideo && isVisible) {
      const videoPreload = document.createElement("video");
      videoPreload.src = src.cardVideo;
      videoPreload.preload = "auto";
      videoPreload.muted = true;
      videoPreload.onloadeddata = () => {
        setVideoLoaded(true);
      };
      videoPreload.onerror = () => {
        setVideoAvailable(false);
        setVideoError(true);
      };
    }
  }, [hasVideo, src?.cardVideo, isVisible]);

  // Enhanced video handling logic
  useEffect(() => {
    if (!isVisible || !hasVideo || !videoRef.current) return;

    if (isHovered && videoAvailable && !videoError) {
      // Make sure video is loaded
      if (videoRef.current.readyState < 2) {
        videoRef.current.load();
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
      }
    }
  }, [isHovered, isVisible, hasVideo, videoAvailable, videoError]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleVideoError = useCallback(() => {
    setVideoAvailable(false);
    setVideoError(true);
    console.warn(`Video not available for: ${src?.name || "Unknown"}`);
  }, [src?.name]);

  // Create array of star count based on tier
  const starArray = useMemo(() => {
    return tier > 0 ? Array(tier).fill(1) : [];
  }, [tier]);

  return (
    <div className="inline-flex flex-col items-center">
      <div className="inline-flex items-center justify-center flex-col">
        <div className="inline-flex flex-col w-full">
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
                  width={10}
                  height={10}
                  className="w-[10px] h-[10px] md:w-[14px] md:h-[14px]"
                  alt="Star"
                  priority={true}
                />
              ))}
            </div>
          )}
          <div className="flex flex-col rounded-lg w-full relative">
            <div
              ref={containerRef}
              className={`relative !bg-black rounded-lg aspect-square ${cardSize}`}
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                aspectRatio: "1/1",
              }}
              data-tooltip-id={src?.key}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {/* Always render the static image */}
              <div
                className={`absolute inset-0 z-10 transition-opacity duration-300 ${
                  isHovered && hasVideo && videoAvailable && !videoError
                    ? "opacity-0"
                    : "opacity-100"
                }`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {src?.cardImage && (
                  <OptimizedImage
                    ref={imageRef}
                    src={src?.cardImage}
                    alt={src?.name || "champion"}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover object-center rounded-lg"
                    priority={true}
                  />
                )}
              </div>

              {/* Always render the video but keep it hidden until needed */}
              {hasVideo && (
                <div
                  className="absolute inset-0 z-20 flex items-center justify-center"
                  style={{
                    opacity: isHovered && videoAvailable && !videoError ? 1 : 0,
                    transition: "opacity 0.3s ease",
                  }}
                >
                  <video
                    ref={videoRef}
                    src={src?.cardVideo}
                    muted
                    playsInline
                    loop
                    onError={handleVideoError}
                    className="w-full h-full object-cover object-center rounded-lg"
                    preload="auto"
                  />
                </div>
              )}

              <OptimizedImage
                src={frameImage}
                className="absolute top-0 left-0 w-full h-full z-30 pointer-events-none"
                alt="Cost Frame"
                width={200}
                height={200}
                priority={true}
              />

              {/* Cost icon positioned in bottom right corner */}
              {src?.cost && showCost && (
                <div className="absolute bottom-0.5 right-0.5 w-fit z-30">
                  <div className="flex items-center gap-x-1 rounded-full bg-slate-800 px-1 ">
                    <OptimizedImage
                      src={
                        "https://res.cloudinary.com/dg0cmj6su/image/upload/v1748080983/Coin_C_zj8naw_mqv3h4.webp"
                      }
                      alt={`Cost ${src.cost}`}
                      width={10}
                      height={10}
                      className="w-3 h-3 object-contain"
                      priority={true}
                    />
                    <div className="text-xs font-medium text-white md:text-sm md:font-semibold ">
                      {src.cost}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Force icon positioned outside container without overflow:hidden */}
            {forceObject && (
              <div
                className="absolute z-30"
                style={{
                  top: "-6px",
                  right: "-6px",
                  width: "30px",
                  height: "30px",
                }}
              >
                <ForceIcon
                  force={forceObject}
                  isHovered={isHovered}
                  size="small"
                  showImageOnly={!isVisible || !isHovered}
                  className="w-full h-full rounded-full"
                />
              </div>
            )}

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

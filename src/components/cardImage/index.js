import React, { useState, useRef, useMemo } from "react";
import { OptimizedImage } from "../../utils/imageOptimizer";
import { WithTooltip } from "../tooltip/GlobalTooltip";
import ForceIcon from "../forceIcon";
import costWiseFrameData from "../../data/costWiseFrame.json";

const CardImage = ({
  src,
  imgStyle = "w-[48px] md:w-[96px]",
  identificationImageStyle = "w-[16px] md:w-[32px]",
  textStyle = "text-[10px] md:text-[16px]",
  forces,
  cardSize = "",
  tier = 0,
  showCost = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef(null);

  // Check if source has a video
  const hasVideo = useMemo(() => Boolean(src?.cardVideo), [src?.cardVideo]);

  // Get force object for the ForceIcon
  const forceObject = useMemo(() => {
    if (!forces || !src?.variant) return null;
    return forces.find((force) => force.key === src?.variant);
  }, [forces, src?.variant]);

  // Get frame image based on cost
  const frameImage = useMemo(() => {
    const frameData = costWiseFrameData.costWiseFrame.find(
      (frame) => frame?.cost === src?.cost
    );
    return frameData?.imageUrl || costWiseFrameData.costWiseFrame[0].imageUrl;
  }, [src]);

  // Create array of star count based on tier
  const starArray = useMemo(() => {
    return tier > 0 ? Array(tier).fill(1) : [];
  }, [tier]);

  // Simple hover handlers
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (hasVideo && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Video play failed, continue silently
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (hasVideo && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const cardContent = (
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
                  src={`${
                    tier === 4
                      ? "https://res.cloudinary.com/dg0cmj6su/image/upload/v1746781271/prismatic_i5en18.webp"
                      : "https://res.cloudinary.com/dg0cmj6su/image/upload/v1746781271/gold_3_atgi3f.webp"
                  }`}
                  width={10}
                  height={10}
                  className="w-[10px] h-[10px] md:w-[14px] md:h-[14px]"
                  alt="Star"
                />
              ))}
            </div>
          )}

          <div className="flex flex-col rounded-lg w-full relative">
            <div
              className={`relative !bg-black rounded-lg aspect-square overflow-visible ${cardSize}`}
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                aspectRatio: "1/1",
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {/* Static image */}
              <div
                className={`absolute inset-0 z-10 transition-opacity duration-300 ${
                  isHovered && hasVideo ? "opacity-0" : "opacity-100"
                }`}
              >
                {src?.cardImage && (
                  <OptimizedImage
                    src={src?.cardImage}
                    alt={src?.name || "champion"}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover object-center rounded-lg"
                    loading="eager"
                    priority={true}
                  />
                )}
              </div>

              {/* Video element */}
              {hasVideo && (
                <div
                  className="absolute inset-0 z-20 flex items-center justify-center"
                  style={{
                    opacity: isHovered ? 1 : 0,
                    transition: "opacity 0.3s ease",
                  }}
                >
                  <video
                    ref={videoRef}
                    src={src?.cardVideo}
                    muted
                    playsInline
                    loop
                    preload="metadata"
                    poster={src?.cardImage}
                    className="w-full h-full object-cover object-center rounded-lg"
                  />
                </div>
              )}

              {/* Frame overlay */}
              <OptimizedImage
                src={frameImage}
                className="absolute top-0 left-0 w-full h-full z-30 pointer-events-none"
                alt="Cost Frame"
                width={96}
                height={96}
                loading="eager"
                priority={true}
              />

              {/* Cost display */}
              {src?.cost && showCost && (
                <div className="absolute bottom-0.5 right-0.5 w-fit z-30">
                  <div className="flex items-center gap-x-1 rounded-full bg-slate-800 px-1">
                    <OptimizedImage
                      src="https://res.cloudinary.com/dg0cmj6su/image/upload/v1748080983/Coin_C_zj8naw_mqv3h4.webp"
                      alt={`Cost ${src.cost}`}
                      width={10}
                      height={10}
                      className="w-3 h-3 object-contain"
                      loading="eager"
                      priority={true}
                    />
                    <div className="text-xs font-medium text-white md:text-sm md:font-semibold">
                      {src.cost}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Force icon */}
            {forceObject && (
              <div
                className="absolute z-30 transition-all duration-300 ease-in-out"
                style={{
                  top: "-6px",
                  right: "-6px",
                  width: "30px",
                  height: "30px",
                  transform: isHovered ? "scale(1.1)" : "scale(1)",
                }}
              >
                <ForceIcon
                  force={forceObject}
                  isHovered={isHovered}
                  size="small"
                  showImageOnly={false}
                  className="w-full h-full rounded-full transition-all duration-300 ease-in-out"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <WithTooltip variant="champion" content={src}>
      {cardContent}
    </WithTooltip>
  );
};

export default CardImage;

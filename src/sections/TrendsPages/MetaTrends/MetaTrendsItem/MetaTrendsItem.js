import React, { memo, useCallback, useState, useRef } from "react";
import { IoMdCheckmarkCircle, IoMdCheckmark } from "react-icons/io";
import ReactTltp from "src/components/tooltip/ReactTltp";
import ImageBorders from "../../../../data/newData/costWiseBorders.json";
import { OptimizedImage } from "src/utils/imageOptimizer";

const MetaTrendsItem = ({
  champion,
  title,
  description,
  image,
  link,
  setSelectedChampion,
  index,
  forces,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef(null);

  // Use useCallback to memoize the click handler
  const handleClick = useCallback(() => {
    if (champion?.key) {
      setSelectedChampion(champion.key);
    }
  }, [champion?.key, setSelectedChampion]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, []);

  // Early return if champion is not provided
  if (!champion) return null;

  // Find border image once
  const borderImage = ImageBorders?.find(
    (border) => border?.cost === champion?.cost
  )?.imageUrl;

  // Find force image once
  const forceImage = forces?.find(
    (force) => force?.key === champion?.variant
  )?.imageUrl;

  // Create unique tooltip ID
  const tooltipId = `${champion?.key}-${index}`;

  return (
    <div
      className={`relative inline-flex cursor-pointer [box-shadow:rgba(255,_0,_0)_0px_5px_15px] shadow-none hover:[box-shadow:rgba(255,_0,_0)_0px_54px_55px,_rgba(0,_0,_0,_0.12)_0px_-12px_30px,_rgba(0,_0,_0,_0.12)_0px_4px_6px,_rgba(0,_0,_0,_0.17)_0px_12px_13px,_rgba(0,_0,_0,_0.09)_0px_-3px_5px] hover:-translate-y-0.5 transition-all duration-300 ease-in-out`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <ReactTltp variant="champion" content={champion} id={tooltipId} />
      <div
        className="relative inline-flex flex-col"
        data-tooltip-id={tooltipId}
      >
        <div className="relative flex flex-col w-[72px] h-[72px] lg:w-[104px] !bg-black lg:h-[104px]">
          <div
            className={`relative inline-flex rounded-[6px] w-full h-full ${
              champion?.selected ? "border-[green]" : "border-none"
            } bg-cover`}
            style={
              {
                // backgroundImage: `url(${borderImage})`,
                // backgroundImage: `url(https://res.cloudinary.com/dg0cmj6su/image/upload/v1744371801/character_frame_rv7l87.png)`,
                // zIndex: 100,
              }
            }
          >
            {champion.cardImage && (
              <>
                {/* If champion.cardImage extension is .webp or .png or .jpg or .jpeg, then use the Image component, else if it's .mp4 or .webm, then use the video component */}
                {champion.cardImage.endsWith(".webp") ||
                champion.cardImage.endsWith(".png") ||
                champion.cardImage.endsWith(".jpg") ||
                champion.cardImage.endsWith(".jpeg") ? (
                  <OptimizedImage
                    src={champion.cardImage}
                    alt={`${champion.name || "Champion Image"}`}
                    className="w-auto h-[95%] m-auto"
                    width={80}
                    height={80}
                    priority={index < 4} // Prioritize loading for first 4 images
                  />
                ) : (
                  <video
                    ref={videoRef}
                    src={champion.cardImage}
                    muted
                    playsInline
                    className="w-full h-full m-auto rounded-[15px]"
                  />
                )}
              </>
            )}

            {forceImage && (
              <OptimizedImage
                src={forceImage}
                className="absolute -top-[3px] -right-[3px] w-[20px] md:w-[30px]"
                alt={`${champion.variant || "Force Icon"}`}
                width={32}
                height={32}
              />
            )}
            <OptimizedImage
              src={
                "https://res.cloudinary.com/dg0cmj6su/image/upload/v1744443307/ghjhhhhhhhh_axvnyo.png"
              }
              className="absolute top-0 right-0 w-full h-full"
              alt={`${champion.name || "Border Image"}`}
              width={200}
              height={200}
            />

            {champion?.selected && (
              <IoMdCheckmarkCircle className="absolute top-0 right-0 w-full h-full p-3 bg-[#00000060] text-[#86efaccc]" />
            )}
          </div>
        </div>
      </div>
      {/* <ReactTltp
        key={`${champion?.key}${index}`}
        id={`${champion?.key}${index}`}
        content={"Heellooooooooo"}
      /> */}
      {/* <div className="flex justify-center items-center absolute top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 bg-[#2322228f] rounded-[6px]">
          <span
            width="14"
            height="15"
            color="#FFFFFF"
            className="IconContainer block h-[14px] w-[14px]"
          >
            <IoMdCheckmarkCircle />
          </span>
        </div> */}
    </div>
  );
};

// Use React.memo to prevent unnecessary re-renders
export default memo(MetaTrendsItem);

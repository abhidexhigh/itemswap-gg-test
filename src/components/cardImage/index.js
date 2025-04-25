import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { OptimizedImage } from "../../utils/imageOptimizer";
import ReactTltp from "../tooltip/ReactTltp";

const CardImage = ({
  src,
  imgStyle = "w-[48px] md:w-[96px]",
  identificationImageStyle = "w=[16px] md:w-[32px]",
  textStyle = "text-[10px] md:text-[16px]",
  forces,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef(null);
  const [videoAvailable, setVideoAvailable] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const playAttemptRef = useRef(0);

  // Check if source has a video
  const hasVideo = useMemo(() => Boolean(src?.cardVideo), [src?.cardVideo]);

  // Effect to preload video
  useEffect(() => {
    if (hasVideo && videoRef.current) {
      videoRef.current.load();
    }
  }, [hasVideo]);

  // Effect to handle video play when hovered
  useEffect(() => {
    let playTimeoutId;

    if (isHovered && videoRef.current && hasVideo && videoAvailable) {
      // Reset play attempts when hover starts
      playAttemptRef.current = 0;

      const attemptToPlay = () => {
        if (playAttemptRef.current >= 3) {
          console.warn("Max play attempts reached for video");
          return;
        }

        if (!videoRef.current) {
          console.warn("Video reference is not available");
          return;
        }

        const playPromise = videoRef.current.play();
        playAttemptRef.current += 1;

        // Handle play promise to avoid DOMException
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch((error) => {
              console.error("Error playing video:", error);

              if (error.name === "NotAllowedError") {
                // Browser policy prevented autoplay, retry with user gesture simulation
                playTimeoutId = setTimeout(attemptToPlay, 100);
              } else if (playAttemptRef.current < 3) {
                // Try again for other errors
                playTimeoutId = setTimeout(attemptToPlay, 200);
              } else {
                setVideoAvailable(false);
              }
            });
        }
      };

      // Start attempting to play with a slight delay
      playTimeoutId = setTimeout(attemptToPlay, 50);
    } else if (!isHovered && videoRef.current) {
      setIsPlaying(false);
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    return () => {
      if (playTimeoutId) {
        clearTimeout(playTimeoutId);
      }
    };
  }, [isHovered, hasVideo, videoAvailable]);

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

  return (
    <div className="inline-flex flex-col items-center">
      <div className="inline-flex items-center justify-center flex-col">
        <div className="inline-flex flex-col">
          <div className={`flex flex-col rounded-lg`}>
            <div
              className="relative w-[48px] h-[48px] !bg-black md:w-[96px] md:h-[96px] rounded-lg"
              data-tooltip-id={src?.key}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {/* Show video on hover if available, otherwise show image */}
              {isHovered && hasVideo && videoAvailable ? (
                <video
                  ref={videoRef}
                  src={src?.cardVideo}
                  muted
                  playsInline
                  loop
                  onError={handleVideoError}
                  className={`object-cover object-center rounded-lg w-full h-full ${imgStyle}`}
                  preload="auto"
                />
              ) : (
                src?.cardImage && (
                  <OptimizedImage
                    src={src?.cardImage}
                    alt="champion"
                    width={80}
                    height={80}
                    className={`object-cover object-canter mx-auto rounded-lg w-auto h-full ${imgStyle}`}
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
              />
              <div
                className={`absolute -top-[6px] -right-[6px] w-[20px] rounded-full overflow-hidden md:w-[30px] ${identificationImageStyle}`}
              >
                <div className="relative">
                  {forces &&
                    src?.variant &&
                    // id videoUrl is not null, then show the force video else show the force image
                    (forces?.find((force) => force.key === src?.variant)
                      ?.videoUrl ? (
                      <video
                        src={
                          forces?.find((force) => force.key === src?.variant)
                            ?.videoUrl
                        }
                        muted
                        playsInline
                        autoPlay
                        loop
                        className="p-1 rounded-full w-[20px] md:w-[30px]"
                      />
                    ) : (
                      <OptimizedImage
                        src={
                          forces?.find((force) => force.key === src?.variant)
                            ?.imageUrl
                        }
                        alt="force"
                        width={20}
                        height={20}
                        className="p-0.5 rounded-full w-[20px] md:w-[30px]"
                      />
                    ))}
                  <OptimizedImage
                    src={
                      "https://res.cloudinary.com/dg0cmj6su/image/upload/v1745572723/force_icon_frame_1_dzkfh9.webp"
                    }
                    className="absolute top-0 right-0 w-full object-contain"
                    alt="Border Image"
                    width={200}
                    height={200}
                  />
                </div>
              </div>
              {/* <div className="absolute bottom-0 w-full bg-gradient-to-r from-[#1a1b3110] via-[#1a1b31] to-[#1a1b3110] bg-opacity-50">
                <p
                  className={`ellipsis text-center text-[11px] md:text-[16px] leading-[14px] text-[#ffffff] font-extralight
                                           w-full py-0.5 m-0 ${textStyle}`}
                >
                  {src?.name}
                </p>
              </div> */}
            </div>
            <ReactTltp variant="champion" id={src?.key} content={src} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardImage;

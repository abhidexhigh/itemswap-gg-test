import React, {
  memo,
  useCallback,
  useState,
  useRef,
  useEffect,
  useMemo,
} from "react";
import { IoMdCheckmarkCircle, IoMdCheckmark } from "react-icons/io";
import ReactTltp from "src/components/tooltip/ReactTltp";
import ImageBorders from "../../../../data/newData/costWiseBorders.json";
import { OptimizedImage } from "src/utils/imageOptimizer";
import CardImage from "src/components/cardImage";

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
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoAvailable, setVideoAvailable] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const playAttemptRef = useRef(0);

  // Check if champion has a video
  const hasVideo = useMemo(
    () => Boolean(champion?.cardVideo),
    [champion?.cardVideo]
  );

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

  // Use useCallback to memoize the click handler
  const handleClick = useCallback(() => {
    if (champion?.key) {
      setSelectedChampion(champion.key);
    }
  }, [champion?.key, setSelectedChampion]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleVideoLoaded = useCallback(() => {
    setVideoLoaded(true);
  }, []);

  const handleVideoError = useCallback(() => {
    setVideoAvailable(false);
    console.warn(`Video not available for champion: ${champion?.name}`);
  }, [champion?.name]);

  // Early return if champion is not provided
  if (!champion) return null;

  // Find force image once
  const forceImage = useMemo(
    () => forces.find((f) => f.key === champion.variant)?.imageUrl || null,
    [forces, champion.variant]
  );

  // Create unique tooltip ID
  const tooltipId = `${champion?.key}-${index}`;

  return (
    <div
      className={`relative inline-flex cursor-pointer [box-shadow:rgba(255,_0,_0)_0px_5px_15px] shadow-none hover:[box-shadow:rgba(255,_0,_0)_0px_54px_55px,_rgba(0,_0,_0,_0.12)_0px_-12px_30px,_rgba(0,_0,_0,_0.12)_0px_4px_6px,_rgba(0,_0,_0,_0.17)_0px_12px_13px,_rgba(0,_0,_0,_0.09)_0px_-3px_5px] hover:-translate-y-0.5 transition-all duration-300 ease-in-out`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CardImage
        src={champion}
        forces={forces}
        imgStyle="w-28"
        identificationImageStyle="w-[20px] md:w-[30px]"
      />
    </div>
  );
};

// Use React.memo to prevent unnecessary re-renders
export default memo(MetaTrendsItem);

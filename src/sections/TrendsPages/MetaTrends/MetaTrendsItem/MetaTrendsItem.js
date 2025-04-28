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

const MetaTrendsItem = memo(
  ({
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
    const hasMountedRef = useRef(false);

    // Check if champion has a video - memoized
    const hasVideo = useMemo(
      () => Boolean(champion?.cardVideo),
      [champion?.cardVideo]
    );

    // Create unique tooltip ID only once
    const tooltipId = useMemo(
      () => `${champion?.key}-${index}`,
      [champion?.key, index]
    );

    // Find force image once
    const forceImage = useMemo(
      () =>
        forces && champion?.variant
          ? forces.find((f) => f.key === champion.variant)?.imageUrl || null
          : null,
      [forces, champion?.variant]
    );

    // Effect to preload video with lazy loading
    useEffect(() => {
      // Early return if no video or already handled
      if (!hasVideo || hasMountedRef.current) return;

      hasMountedRef.current = true;

      // Create an observer to only load video when near viewport
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && videoRef.current) {
            // Set video load attributes only when in viewport
            videoRef.current.setAttribute("preload", "metadata");
            observer.unobserve(videoRef.current);
          }
        },
        { rootMargin: "200px" }
      );

      if (videoRef.current) {
        observer.observe(videoRef.current);
      }

      return () => {
        if (videoRef.current) {
          observer.unobserve(videoRef.current);
        }
      };
    }, [hasVideo]);

    // Effect to handle video play when hovered - optimized version
    useEffect(() => {
      let playTimeoutId;

      if (!videoRef.current || !hasVideo || !videoAvailable) return;

      if (isHovered) {
        // Reset play attempts when hover starts
        playAttemptRef.current = 0;

        const attemptToPlay = () => {
          if (playAttemptRef.current >= 3) {
            // Limit retry attempts
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
                // Only retry if needed and with increasing delays
                if (playAttemptRef.current < 3) {
                  playTimeoutId = setTimeout(
                    attemptToPlay,
                    100 * playAttemptRef.current
                  );
                } else {
                  // Mark as unavailable after 3 failed attempts
                  setVideoAvailable(false);
                }
              });
          }
        };

        // Start attempting to play with a slight delay
        playTimeoutId = setTimeout(attemptToPlay, 50);
      } else if (videoRef.current) {
        // If not hovered, pause and reset video
        setIsPlaying(false);
        videoRef.current.pause();

        // Only reset currentTime when fully unloaded - saves CPU
        if (videoRef.current.readyState > 0) {
          videoRef.current.currentTime = 0;
        }
      }

      return () => {
        if (playTimeoutId) {
          clearTimeout(playTimeoutId);
        }
      };
    }, [isHovered, hasVideo, videoAvailable]);

    // Memoize handler functions to avoid unnecessary recreations
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
    }, []);

    // Early return if champion is not provided
    if (!champion) return null;

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
  }
);

// Name the component for better debugging
MetaTrendsItem.displayName = "MetaTrendsItem";

export default MetaTrendsItem;

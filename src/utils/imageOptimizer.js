import Image from "next/image";

/**
 * Highly optimized Image component for better performance
 * @param {Object} props - Image component props
 */
export const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  placeholder = false, // Disabled by default for performance
  loading,
  sizes,
  ...props
}) => {
  // Determine loading strategy
  const loadingStrategy = loading || (priority ? "eager" : "lazy");

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      placeholder="empty" // Always use empty for better performance
      quality={20} // Reduced quality for better performance (was 75)
      loading={loadingStrategy}
      // sizes={sizes || "(max-width: 768px) 100vw, 50vw"} // Better responsive sizing
      // Disable optimization for better performance in some cases
      unoptimized={false}
      // Add decoding for better performance
      decoding="async"
      {...props}
    />
  );
};

/**
 * Helper function to determine if an image should be loaded with priority
 * More conservative approach for better performance
 */
export const shouldPrioritizeImage = (index, threshold = 2) => {
  // Reduced from 4 to 2
  return index < threshold;
};

/**
 * Helper function to get optimized image dimensions
 * Smaller sizes for better performance
 */
export const getOptimizedDimensions = (size) => {
  const dimensions = {
    tiny: { width: 24, height: 24 },
    small: { width: 40, height: 40 }, // Reduced from 48
    medium: { width: 64, height: 64 }, // Reduced from 72
    large: { width: 80, height: 80 }, // Reduced from 96
    xlarge: { width: 96, height: 96 },
  };
  return dimensions[size] || dimensions.medium;
};

import Image from "next/image";

/**
 * Optimized Image component with common configurations
 * @param {Object} props - Image component props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Alt text for the image
 * @param {number} props.width - Width of the image
 * @param {number} props.height - Height of the image
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.priority - Whether to prioritize loading
 * @param {boolean} props.placeholder - Whether to show placeholder
 * @returns {JSX.Element} Optimized Image component
 */
export const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  placeholder = true,
  ...props
}) => {
  // Default blur placeholder
  const blurDataURL =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/SkhXQAAAABJRU5ErkJggg==";

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      placeholder={placeholder ? "blur" : "empty"}
      blurDataURL={placeholder ? blurDataURL : undefined}
      quality={75} // Optimize quality for better performance
      loading={priority ? "eager" : "lazy"}
      {...props}
    />
  );
};

/**
 * Helper function to determine if an image should be loaded with priority
 * @param {number} index - Index of the image in a list
 * @param {number} threshold - Threshold for priority loading (default: 4)
 * @returns {boolean} Whether to prioritize loading
 */
export const shouldPrioritizeImage = (index, threshold = 4) => {
  return index < threshold;
};

/**
 * Helper function to get optimized image dimensions
 * @param {string} size - Size variant ('small' | 'medium' | 'large')
 * @returns {Object} Width and height for the specified size
 */
export const getOptimizedDimensions = (size) => {
  const dimensions = {
    small: { width: 48, height: 48 },
    medium: { width: 72, height: 72 },
    large: { width: 96, height: 96 },
  };
  return dimensions[size] || dimensions.medium;
};

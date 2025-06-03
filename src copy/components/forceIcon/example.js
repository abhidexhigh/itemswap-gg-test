import React, { useState } from "react";
import ForceIcon from "./index";

// Example data representing a force
const exampleForce = {
  key: "example",
  name: "Example Force",
  imageUrl: "https://example.com/force-image.png",
  videoUrl: "https://example.com/force-video.mp4",
};

const ForceIconExample = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">ForceIcon Component Examples</h2>

      <div className="grid grid-cols-4 gap-8">
        {/* Small size */}
        <div
          className="flex flex-col items-center"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <ForceIcon force={exampleForce} size="small" isHovered={isHovered} />
          <p className="mt-2 text-sm">Small</p>
        </div>

        {/* Medium size */}
        <div className="flex flex-col items-center">
          <ForceIcon force={exampleForce} size="medium" isHovered={isHovered} />
          <p className="mt-2 text-sm">Medium</p>
        </div>

        {/* Large size */}
        <div className="flex flex-col items-center">
          <ForceIcon force={exampleForce} size="large" isHovered={isHovered} />
          <p className="mt-2 text-sm">Large</p>
        </div>

        {/* Custom size */}
        <div className="flex flex-col items-center">
          <ForceIcon
            force={exampleForce}
            size="custom"
            customSize="w-[50px] md:w-[70px]"
            isHovered={isHovered}
          />
          <p className="mt-2 text-sm">Custom Size</p>
        </div>
      </div>

      {/* Example with different border */}
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Custom Border Example</h3>
        <div className="flex items-center">
          <ForceIcon
            force={exampleForce}
            size="medium"
            isHovered={isHovered}
            iconFrameUrl="https://example.com/custom-border.png"
          />
          <p className="ml-4">With custom border image</p>
        </div>
      </div>
    </div>
  );
};

export default ForceIconExample;

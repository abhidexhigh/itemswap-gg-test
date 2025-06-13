"use client";

import { useState } from "react";
import LightVariantCard from "./LightVariantCard";
import DarkVariantCard from "./DarkVariantCard";
import FireVariantCard from "./FireVariantCard";
import StormVariantCard from "./StormVariantCard";
import WaterVariantCard from "./WaterVariantCard";

export default function VariantShowcase() {
  // Sample image URLs - replace with actual character images
  const sampleImages = [
    "/sample-character-1.jpg", // Replace with actual path
    "/sample-character-2.jpg", // Replace with actual path
    "/sample-character-3.jpg", // Replace with actual path
  ];

  // Use state to track which image to display
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Function to cycle through images
  const cycleImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % sampleImages.length);
  };

  // Current image to display
  const currentImage = sampleImages[currentImageIndex];

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-2 text-center">
        Character Variant Cards
      </h1>
      <p className="text-gray-400 text-center mb-8">
        Five elemental variants with unique visual effects
      </p>

      {/* Image selector */}
      <div className="mb-8 flex justify-center">
        <button
          onClick={cycleImage}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          Change Character Image
        </button>
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-10 max-w-4xl mx-auto">
        <div className="flex flex-col items-center">
          <LightVariantCard image={currentImage} name="Light Variant" />
          <div className="mt-4 text-center">
            <p className="text-yellow-400 font-semibold text-lg">Light</p>
            <p className="text-gray-400 text-sm mt-1">
              Divine radiance and golden aura
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <DarkVariantCard image={currentImage} name="Dark Variant" />
          <div className="mt-4 text-center">
            <p className="text-purple-400 font-semibold text-lg">Dark</p>
            <p className="text-gray-400 text-sm mt-1">
              Shadow magic with twinkling particles
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <FireVariantCard image={currentImage} name="Fire Variant" />
          <div className="mt-4 text-center">
            <p className="text-red-400 font-semibold text-lg">Fire</p>
            <p className="text-gray-400 text-sm mt-1">
              Rising flames and ember effects
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <StormVariantCard image={currentImage} name="Storm Variant" />
          <div className="mt-4 text-center">
            <p className="text-blue-400 font-semibold text-lg">Storm</p>
            <p className="text-gray-400 text-sm mt-1">
              Lightning strikes and stormy clouds
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <WaterVariantCard image={currentImage} name="Water Variant" />
          <div className="mt-4 text-center">
            <p className="text-cyan-400 font-semibold text-lg">Water</p>
            <p className="text-gray-400 text-sm mt-1">
              Bubbles and flowing water effects
            </p>
          </div>
        </div>
      </div>

      {/* Design highlights */}
      <div className="mt-12 max-w-2xl mx-auto bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold text-white mb-4">Design Features</h2>
        <ul className="list-disc pl-5 text-gray-300 space-y-2">
          <li>
            Each variant has a unique elemental theme with matching colors and
            effects
          </li>
          <li>
            Character images remain fully visible as the focal point of each
            card
          </li>
          <li>Interactive canvas animations add depth and movement</li>
          <li>Elemental identifier badges help distinguish each variant</li>
          <li>Consistent card size and shape across all variants (96×96px)</li>
          <li>Hover animations provide subtle interactivity</li>
        </ul>
      </div>

      {/* Implementation notes */}
      <div className="mt-6 max-w-2xl mx-auto bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold text-white mb-4">Implementation</h2>
        <ul className="list-disc pl-5 text-gray-300 space-y-1">
          <li>Uses HTML5 Canvas for particle animations</li>
          <li>Tailwind CSS for styling and responsive layout</li>
          <li>Next.js Image component for optimized image loading</li>
          <li>SVG icons to represent elemental affinities</li>
          <li>CSS gradients and shadows for elemental effects</li>
        </ul>
      </div>
    </div>
  );
}

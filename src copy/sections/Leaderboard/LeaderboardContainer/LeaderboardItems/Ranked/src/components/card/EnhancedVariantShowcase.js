"use client";

import { useState } from "react";
import LightVariantCard from "./LightVariantCard";
import DarkVariantCard from "./DarkVariantCard";
import FireVariantCard from "./FireVariantCard";
import StormVariantCard from "./StormVariantCard";
import WaterVariantCard from "./WaterVariantCard";
import LightVariantCard2 from "./LightVariantCard2";
import DarkVariantCard2 from "./DarkVariantCard2";
import FireVariantCard2 from "./FireVariantCard2";
import StormVariantCard2 from "./StormVariantCard2";
import WaterVariantCard2 from "./WaterVariantCard2";
import NatureVariantCard2 from "./NatureVariantCard2";

export default function EnhancedVariantShowcase() {
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
    <div className="p-8 bg-gray-950 min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-2 text-center">
        Enhanced Character Variant Cards
      </h1>
      <p className="text-gray-400 text-center mb-8">
        Multiple design options with improved character visibility
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

      {/* Original designs */}
      <div className="mb-10">
        <h2 className="text-xl text-white mb-4 border-b border-gray-800 pb-2">
          Original Designs
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 max-w-4xl mx-auto">
          <div className="flex flex-col items-center">
            <LightVariantCard image={currentImage} name="Light Variant" />
            <p className="mt-3 text-yellow-400 font-semibold">Light</p>
          </div>

          <div className="flex flex-col items-center">
            <DarkVariantCard image={currentImage} name="Dark Variant" />
            <p className="mt-3 text-purple-400 font-semibold">Dark</p>
          </div>

          <div className="flex flex-col items-center">
            <FireVariantCard image={currentImage} name="Fire Variant" />
            <p className="mt-3 text-red-400 font-semibold">Fire</p>
          </div>

          <div className="flex flex-col items-center">
            <StormVariantCard image={currentImage} name="Storm Variant" />
            <p className="mt-3 text-blue-400 font-semibold">Storm (Blue)</p>
          </div>

          <div className="flex flex-col items-center">
            <WaterVariantCard image={currentImage} name="Water Variant" />
            <p className="mt-3 text-cyan-400 font-semibold">Water</p>
          </div>
        </div>
      </div>

      {/* Enhanced designs */}
      <div className="mb-10">
        <h2 className="text-xl text-white mb-4 border-b border-gray-800 pb-2">
          Enhanced Visibility Designs
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 max-w-5xl mx-auto">
          <div className="flex flex-col items-center">
            <LightVariantCard2 image={currentImage} name="Light Variant 2" />
            <p className="mt-3 text-amber-400 font-semibold">Light</p>
            <p className="text-gray-500 text-xs mt-1">
              Darker background with subtle effects
            </p>
          </div>

          <div className="flex flex-col items-center">
            <DarkVariantCard2 image={currentImage} name="Dark Variant 2" />
            <p className="mt-3 text-purple-400 font-semibold">Dark</p>
            <p className="text-gray-500 text-xs mt-1">
              Void portals and shadow wisps
            </p>
          </div>

          <div className="flex flex-col items-center">
            <FireVariantCard2 image={currentImage} name="Fire Variant 2" />
            <p className="mt-3 text-red-400 font-semibold">Fire</p>
            <p className="text-gray-500 text-xs mt-1">
              Bottom embers with bursts
            </p>
          </div>

          <div className="flex flex-col items-center">
            <StormVariantCard2 image={currentImage} name="Storm Variant 2" />
            <p className="mt-3 text-green-400 font-semibold">Storm</p>
            <p className="text-gray-500 text-xs mt-1">
              Lightning with branches
            </p>
          </div>

          <div className="flex flex-col items-center">
            <WaterVariantCard2 image={currentImage} name="Water Variant 2" />
            <p className="mt-3 text-blue-400 font-semibold">Water</p>
            <p className="text-gray-500 text-xs mt-1">
              Subtle droplets and waves
            </p>
          </div>

          <div className="flex flex-col items-center">
            <NatureVariantCard2 image={currentImage} name="Nature Variant 2" />
            <p className="mt-3 text-emerald-400 font-semibold">Nature</p>
            <p className="text-gray-500 text-xs mt-1">
              Falling leaves and growing vines
            </p>
          </div>
        </div>
      </div>

      {/* Improvement notes */}
      <div className="mt-12 max-w-2xl mx-auto bg-gray-900 p-6 rounded-lg">
        <h2 className="text-xl font-bold text-white mb-4">
          Design Improvements
        </h2>
        <ul className="list-disc pl-5 text-gray-300 space-y-2">
          <li>Darker backgrounds to improve character visibility</li>
          <li>
            Effects moved to edges and corners to keep character unobscured
          </li>
          <li>Reduced opacity on particle effects</li>
          <li>Simplified color palette for each variant</li>
          <li>Storm variant redesigned with dark green colors</li>
          <li>
            More subtle visual effects that don't distract from the character
          </li>
        </ul>
      </div>

      {/* Implementation tips */}
      <div className="mt-6 max-w-2xl mx-auto bg-gray-900 p-6 rounded-lg">
        <h2 className="text-xl font-bold text-white mb-4">
          Implementation Tips
        </h2>
        <ul className="list-disc pl-5 text-gray-300 space-y-1">
          <li>
            Original designs have more dramatic effects (may be preferable for
            3D or larger cards)
          </li>
          <li>
            Enhanced designs prioritize character visibility (better for smaller
            displays)
          </li>
          <li>
            Canvas-based animations can be toggled based on device performance
          </li>
          <li>
            Border effects could be made more pronounced for clickable cards
          </li>
          <li>
            Consider user settings to allow players to choose their preferred
            style
          </li>
        </ul>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import CharacterCard from "./CharacterCard";
import DarkCharacterCard from "./DarkCharacterCard";
import NeonGlowCard from "./NeonGlowCard";
import FireEdgeCard from "./FireEdgeCard";
import IceFrameCard from "./IceFrameCard";
import MinimalistFrameCard from "./MinimalistFrameCard";
import GlitchEffectCard from "./GlitchEffectCard";
import AmbientGlowCard from "./AmbientGlowCard";
import AuroraCard from "./AuroraCard";
import DustParticleCard from "./DustParticleCard";
import LightBeamCard from "./LightBeamCard";
import MistyFlowCard from "./MistyFlowCard";
import ShimmeryTrailCard from "./ShimmeryTrailCard";
import StarfieldCard from "./StarfieldCard";

// Variant cards
import DarkVariantCard from "./DarkVariantCard";
import DarkVariantCard2 from "./DarkVariantCard2";
import DarkVariantChaos from "./DarkVariantChaos";
import FireVariantCard from "./FireVariantCard";
import FireVariantCard2 from "./FireVariantCard2";
import FireVariantFlame from "./FireVariantFlame";
import FireVariantVolcanic from "./FireVariantVolcanic";
import LightVariantCard from "./LightVariantCard";
import LightVariantCard2 from "./LightVariantCard2";
import LightVariantPrism from "./LightVariantPrism";
import NatureVariantCard2 from "./NatureVariantCard2";
import NatureVariantJungle from "./NatureVariantJungle";
import StormVariantCard from "./StormVariantCard";
import StormVariantCard2 from "./StormVariantCard2";
import StormVariantTornado from "./StormVariantTornado";
import WaterVariantCard from "./WaterVariantCard";
import WaterVariantCard2 from "./WaterVariantCard2";
import WaterVariantAbyssal from "./WaterVariantAbyssal";
import WaterVariantCenterFocus from "./WaterVariantCenterFocus";
import WaterVariantGlacier from "./WaterVariantGlacier";
import WaterVariantWhirlpool from "./WaterVariantWhirlpool";
import EarthVariantCrystal from "./EarthVariantCrystal";
import EarthVariantMountain from "./EarthVariantMountain";
import AirVariantBreeze from "./AirVariantBreeze";

export default function CardShowcase() {
  // Actual image URLs from cloudinary
  const imageUrls = [
    "https://res.cloudinary.com/dg0cmj6su/image/upload/v1744351121/CardTesting/PNG/Succubus_Light.png",
    "https://res.cloudinary.com/dg0cmj6su/image/upload/v1744351119/CardTesting/PNG/Succubus_Dark.png",
    "https://res.cloudinary.com/dg0cmj6su/image/upload/v1744351122/CardTesting/PNG/Succubus_Fire.png",
    "https://res.cloudinary.com/dg0cmj6su/image/upload/v1744351115/CardTesting/PNG/Succubus_Storm.png",
    "https://res.cloudinary.com/dg0cmj6su/image/upload/v1744351114/CardTesting/PNG/Succubus_Water.png",
    "https://res.cloudinary.com/dg0cmj6su/image/upload/v1744351169/CardTesting/PNG/Nine_tails_Light.png",
    "https://res.cloudinary.com/dg0cmj6su/image/upload/v1744351170/CardTesting/PNG/Nine_tails_Dark.png",
    "https://res.cloudinary.com/dg0cmj6su/image/upload/v1744351169/CardTesting/PNG/Nine_tails_Fire.png",
    "https://res.cloudinary.com/dg0cmj6su/image/upload/v1744351169/CardTesting/PNG/Nine_tails_Storm.png",
    "https://res.cloudinary.com/dg0cmj6su/image/upload/v1744351177/CardTesting/PNG/Nine_tails_Water.png",
    "https://res.cloudinary.com/dg0cmj6su/image/upload/v1744351169/CardTesting/PNG/Nine_tails_Light.png",
    "https://res.cloudinary.com/dg0cmj6su/image/upload/v1744351170/CardTesting/PNG/Nine_tails_Dark.png",
    "https://res.cloudinary.com/dg0cmj6su/image/upload/v1744351169/CardTesting/PNG/Nine_tails_Fire.png",
    "https://res.cloudinary.com/dg0cmj6su/image/upload/v1744351169/CardTesting/PNG/Nine_tails_Storm.png",
    "https://res.cloudinary.com/dg0cmj6su/image/upload/v1744351177/CardTesting/PNG/Nine_tails_Water.png",
    "https://res.cloudinary.com/dg0cmj6su/image/upload/v1744351199/CardTesting/PNG/Magic_Archer_Light.png",
    "https://res.cloudinary.com/dg0cmj6su/image/upload/v1744351206/CardTesting/PNG/Magic_Archer_Dark.png",
    "https://res.cloudinary.com/dg0cmj6su/image/upload/v1744351199/CardTesting/PNG/Magic_Archer_Fire.png",
    "https://res.cloudinary.com/dg0cmj6su/image/upload/v1744351199/CardTesting/PNG/Magic_Archer_Storm.png",
    "https://res.cloudinary.com/dg0cmj6su/image/upload/v1744351200/CardTesting/PNG/Magic_Archer_Water.png",
    "https://res.cloudinary.com/dg0cmj6su/image/upload/v1744351229/CardTesting/PNG/Fairy_Dragon_Light.png",
    "https://res.cloudinary.com/dg0cmj6su/image/upload/v1744351228/CardTesting/PNG/Fairy_Dragon_Dark.png",
    "https://res.cloudinary.com/dg0cmj6su/image/upload/v1744351228/CardTesting/PNG/Fairy_Dragon_Fire.png",
    "https://res.cloudinary.com/dg0cmj6su/image/upload/v1744351228/CardTesting/PNG/Fairy_Dragon_Storm.png",
    "https://res.cloudinary.com/dg0cmj6su/image/upload/v1744351228/CardTesting/PNG/Fairy_Dragon_Water.png",
  ];

  // Use state to track which image to display
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Card size state (100% is default)
  const [cardSize, setCardSize] = useState(100);

  // Function to cycle through images
  const cycleImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % imageUrls.length);
  };

  // Current image to display
  const currentImage = imageUrls[currentImageIndex];

  // Group cards by categories
  const basicCards = [
    { Component: CharacterCard, name: "Original", title: "Gold Style" },
    { Component: DarkCharacterCard, name: "Dark", title: "Purple Style" },
    { Component: NeonGlowCard, name: "Neon", title: "Cyan Style" },
    { Component: FireEdgeCard, name: "Fire", title: "Flame Style" },
    { Component: IceFrameCard, name: "Ice", title: "Frost Style" },
    { Component: MinimalistFrameCard, name: "Minimal", title: "Clean Style" },
    { Component: GlitchEffectCard, name: "Glitch", title: "Digital Style" },
  ];

  const effectCards = [
    { Component: AmbientGlowCard, name: "Ambient", title: "Glow Style" },
    { Component: AuroraCard, name: "Aurora", title: "Northern Style" },
    { Component: DustParticleCard, name: "Dust", title: "Particle Style" },
    { Component: LightBeamCard, name: "Light", title: "Beam Style" },
    { Component: MistyFlowCard, name: "Misty", title: "Flow Style" },
    { Component: ShimmeryTrailCard, name: "Shimmer", title: "Trail Style" },
    { Component: StarfieldCard, name: "Star", title: "Field Style" },
  ];

  const elementalVariants = [
    { Component: DarkVariantCard, name: "Dark", title: "Variant 1" },
    { Component: DarkVariantCard2, name: "Dark", title: "Variant 2" },
    { Component: DarkVariantChaos, name: "Dark", title: "Chaos" },
    { Component: FireVariantCard, name: "Fire", title: "Variant 1" },
    { Component: FireVariantCard2, name: "Fire", title: "Variant 2" },
    { Component: FireVariantFlame, name: "Fire", title: "Flame" },
    { Component: FireVariantVolcanic, name: "Fire", title: "Volcanic" },
    { Component: LightVariantCard, name: "Light", title: "Variant 1" },
    { Component: LightVariantCard2, name: "Light", title: "Variant 2" },
    { Component: LightVariantPrism, name: "Light", title: "Prism" },
    { Component: NatureVariantCard2, name: "Nature", title: "Variant 2" },
    { Component: NatureVariantJungle, name: "Nature", title: "Jungle" },
    { Component: StormVariantCard, name: "Storm", title: "Variant 1" },
    { Component: StormVariantCard2, name: "Storm", title: "Variant 2" },
    { Component: StormVariantTornado, name: "Storm", title: "Tornado" },
    { Component: WaterVariantCard, name: "Water", title: "Variant 1" },
    { Component: WaterVariantCard2, name: "Water", title: "Variant 2" },
    { Component: WaterVariantAbyssal, name: "Water", title: "Abyssal" },
    {
      Component: WaterVariantCenterFocus,
      name: "Water",
      title: "Center Focus",
    },
    { Component: WaterVariantGlacier, name: "Water", title: "Glacier" },
    { Component: WaterVariantWhirlpool, name: "Water", title: "Whirlpool" },
    { Component: EarthVariantCrystal, name: "Earth", title: "Crystal" },
    { Component: EarthVariantMountain, name: "Earth", title: "Mountain" },
    { Component: AirVariantBreeze, name: "Air", title: "Breeze" },
  ];

  // CSS styles for card wrapper with dynamic size
  const cardWrapperStyle = {
    transform: `scale(${cardSize / 100})`,
    transformOrigin: "center top",
    margin: "0 auto",
    transition: "transform 0.3s ease",
  };

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-8 text-center">
        Card Design Showcase
      </h1>

      {/* Controls Section */}
      <div className="mb-8 flex flex-col md:flex-row justify-center items-center gap-8">
        <button
          onClick={cycleImage}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          Change Character Image ({currentImageIndex + 1}/{imageUrls.length})
        </button>

        <div className="flex flex-col items-center">
          <label htmlFor="size-slider" className="text-white mb-2">
            Card Size: {cardSize}%
          </label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCardSize(Math.max(50, cardSize - 10))}
              className="px-3 py-1 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              -
            </button>
            <input
              id="size-slider"
              type="range"
              min="50"
              max="150"
              value={cardSize}
              onChange={(e) => setCardSize(Number(e.target.value))}
              className="w-32 md:w-48"
            />
            <button
              onClick={() => setCardSize(Math.min(150, cardSize + 10))}
              className="px-3 py-1 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Basic Card Section */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4 text-center">
          Basic Cards
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
          {basicCards.map((card, index) => (
            <div key={index} className="flex flex-col items-center">
              <div style={cardWrapperStyle}>
                <card.Component
                  image={currentImage}
                  name={card.name}
                  title={card.title}
                />
              </div>
              <p className="mt-2 text-white text-center">{card.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Effect Cards Section */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4 text-center">
          Effect Cards
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
          {effectCards.map((card, index) => (
            <div key={index} className="flex flex-col items-center">
              <div style={cardWrapperStyle}>
                <card.Component
                  image={currentImage}
                  name={card.name}
                  title={card.title}
                />
              </div>
              <p className="mt-2 text-white text-center">{card.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Elemental Variants Section */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4 text-center">
          Elemental Variants
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
          {elementalVariants.map((card, index) => (
            <div key={index} className="flex flex-col items-center">
              <div style={cardWrapperStyle}>
                <card.Component
                  image={currentImage}
                  name={card.name}
                  title={card.title}
                />
              </div>
              <p className="mt-2 text-white text-center">{`${card.name} - ${card.title}`}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Design notes */}
      <div className="mt-12 max-w-2xl mx-auto bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold text-white mb-4">Design Notes</h2>
        <ul className="list-disc pl-5 text-gray-300 space-y-2">
          <li>
            All designs keep the character image fully visible as the focal
            point
          </li>
          <li>
            Effects and decorations are kept to the edges to avoid obscuring the
            character
          </li>
          <li>
            The image container maintains full dimensions with proper aspect
            ratio
          </li>
          <li>
            Hover effects add interactivity without compromising image
            visibility
          </li>
          <li>
            Each design has a unique theme while maintaining visual clarity
          </li>
          <li>Use the size slider to adjust card size from 50% to 150%</li>
        </ul>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function GlitchEffectCard({
  image,
  name,
  title,
  description,
  stats,
}) {
  const [isHovering, setIsHovering] = useState(false);

  // Generate random offset values for glitch effect
  const generateOffsets = () => {
    const smallOffset = () => Math.random() * 4 - 2 + "px";
    return {
      redX: smallOffset(),
      redY: smallOffset(),
      blueX: smallOffset(),
      blueY: smallOffset(),
      greenX: smallOffset(),
      greenY: smallOffset(),
    };
  };

  const [offsets, setOffsets] = useState(generateOffsets());

  // Update offsets periodically for animation
  useEffect(() => {
    if (!isHovering) return;

    const interval = setInterval(() => {
      setOffsets(generateOffsets());
    }, 150);

    return () => clearInterval(interval);
  }, [isHovering]);

  return (
    <div
      className="relative w-[104px] h-[104px] max-w-md aspect-[4/4] rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 bg-black"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Dark background */}
      <div className="absolute inset-0 bg-gray-900 z-0"></div>

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-20 z-10"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
          backgroundSize: "cover",
        }}
      ></div>

      {/* Card content with glitch effect */}
      <div className="relative z-20 h-full flex flex-col">
        {/* Base image */}
        <div className="relative flex-1 overflow-hidden">
          <Image
            src={image}
            alt={name || "Character"}
            fill
            className="object-cover object-center"
            priority
          />

          {/* RGB split overlays for glitch effect - only show on hover */}
          {isHovering && (
            <>
              <div
                className="absolute inset-0 z-30 mix-blend-screen opacity-50"
                style={{
                  transform: `translate(${offsets.redX}, ${offsets.redY})`,
                }}
              >
                <Image
                  src={image}
                  alt=""
                  fill
                  className="object-cover object-center"
                  style={{ filter: "url(#red-channel)" }}
                />
              </div>

              <div
                className="absolute inset-0 z-30 mix-blend-screen opacity-50"
                style={{
                  transform: `translate(${offsets.blueX}, ${offsets.blueY})`,
                }}
              >
                <Image
                  src={image}
                  alt=""
                  fill
                  className="object-cover object-center"
                  style={{ filter: "url(#blue-channel)" }}
                />
              </div>

              <div
                className="absolute inset-0 z-30 mix-blend-screen opacity-50"
                style={{
                  transform: `translate(${offsets.greenX}, ${offsets.greenY})`,
                }}
              >
                <Image
                  src={image}
                  alt=""
                  fill
                  className="object-cover object-center"
                  style={{ filter: "url(#green-channel)" }}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Digital border */}
      <div className="absolute inset-0 border border-cyan-500/60 rounded-lg pointer-events-none z-40"></div>

      {/* Filter definitions for color channel separation */}
      <svg width="0" height="0" className="absolute">
        <filter id="red-channel">
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 1 0"
          />
        </filter>
        <filter id="blue-channel">
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 1 0 0
                    0 0 0 1 0"
          />
        </filter>
        <filter id="green-channel">
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0
                    0 1 0 0 0
                    0 0 0 0 0
                    0 0 0 1 0"
          />
        </filter>
      </svg>

      {/* Horizontal scan line effect */}
      <div
        className="absolute inset-0 z-30 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(transparent 50%, rgba(0, 0, 0, 0.8) 50%)",
          backgroundSize: "100% 4px",
        }}
      ></div>
    </div>
  );
}

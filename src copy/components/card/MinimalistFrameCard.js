"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function MinimalistFrameCard({
  image,
  name,
  title,
  description,
  stats,
}) {
  return (
    <div className="relative w-[104px] h-[104px] max-w-md aspect-[4/4] rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 group">
      {/* Pure white background */}
      <div className="absolute inset-0 bg-white z-0"></div>

      {/* Subtle shadow */}
      <div className="absolute inset-0 shadow-inner z-5"></div>

      {/* Card content */}
      <div className="relative z-20 h-full flex flex-col">
        {/* Image container */}
        <div className="relative flex-1 overflow-hidden">
          <Image
            src={image}
            alt={name || "Character"}
            fill
            className="object-cover object-center"
            priority
          />
        </div>
      </div>

      {/* Elegant thin border with hover effect */}
      <div className="absolute inset-0 border border-gray-200 rounded-lg pointer-events-none z-30 transition-all duration-300 group-hover:border-gray-400"></div>

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gray-800 rounded-tl-lg z-40"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gray-800 rounded-tr-lg z-40"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gray-800 rounded-bl-lg z-40"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gray-800 rounded-br-lg z-40"></div>
    </div>
  );
}

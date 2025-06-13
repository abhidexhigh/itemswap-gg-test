"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function StormVariantCard2({
  image,
  name,
  title,
  description,
  stats,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [lightningFlash, setLightningFlash] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Rain/storm particles
    const raindrops = [];
    const raindropCount = 45;

    class Raindrop {
      constructor() {
        this.reset();
      }

      reset() {
        // Start at random position at the top
        this.x = Math.random() * canvas.width;
        this.y = -5;
        this.length = Math.random() * 6 + 3;
        this.width = Math.random() * 0.7 + 0.3;
        this.speed = Math.random() * 5 + 4;

        // More intense green colors
        const alpha = Math.random() * 0.5 + 0.3;
        this.color = `rgba(0, 120, 0, ${alpha})`;
      }

      update() {
        // Fall downward with slight angle
        this.y += this.speed;
        this.x += 0.5; // Slight angle to simulate wind

        // Reset when off screen
        if (this.y > canvas.height) {
          this.reset();
        }
      }

      draw() {
        if (!ctx) return;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - 1, this.y + this.length);
        ctx.stroke();
      }
    }

    // Create secondary lightning branches
    const createLightningBranch = (startX, startY, angle, scale = 0.6) => {
      if (!ctx) return;

      const branchLength = (Math.random() * 0.3 + 0.2) * canvas.height;
      let x = startX;
      let y = startY;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.strokeStyle = "rgba(200, 255, 200, 0.7)";
      ctx.lineWidth = 1 * scale;

      const segments = 3 + Math.floor(Math.random() * 3);
      for (let i = 0; i < segments; i++) {
        // Calculate next point with zigzag pattern and specified angle bias
        const nextX = x + (Math.random() * 10 - 5 + angle) * scale;
        const nextY = y + branchLength / segments;

        ctx.lineTo(nextX, nextY);

        x = nextX;
        y = nextY;
      }

      ctx.stroke();

      // Add glow effect
      ctx.shadowColor = "rgba(120, 255, 120, 0.6)";
      ctx.shadowBlur = 8 * scale;
      ctx.stroke();

      // Reset shadow
      ctx.shadowBlur = 0;
    };

    // Enhanced lightning bolt generator
    const createLightning = () => {
      if (!ctx) return;

      // Random starting point at the top
      const startX = Math.random() * canvas.width;
      const startY = 0;

      // Generate lightning path
      let x = startX;
      let y = startY;

      // Lightning bolt properties
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.strokeStyle = "rgba(220, 255, 220, 0.95)";
      ctx.lineWidth = 2.0;

      // Draw zigzag path
      const segments = 5 + Math.floor(Math.random() * 5);
      let branchPoints = [];

      for (let i = 0; i < segments; i++) {
        // Calculate next point with zigzag pattern
        const nextX = x + (Math.random() * 25 - 12.5);
        const nextY = y + canvas.height / segments;

        ctx.lineTo(nextX, nextY);

        // Potential branch point
        if (Math.random() < 0.4 && i > 0) {
          branchPoints.push({ x: nextX, y: nextY, angle: nextX > x ? 3 : -3 });
        }

        x = nextX;
        y = nextY;
      }

      ctx.stroke();

      // Add glow effect
      ctx.shadowColor = "rgba(150, 255, 150, 0.9)";
      ctx.shadowBlur = 15;
      ctx.stroke();

      // Reset shadow
      ctx.shadowBlur = 0;

      // Create branches
      branchPoints.forEach((point) => {
        createLightningBranch(point.x, point.y, point.angle);
      });
    };

    // Initialize raindrops with staggered positions
    for (let i = 0; i < raindropCount; i++) {
      const raindrop = new Raindrop();
      raindrop.y = Math.random() * canvas.height; // Distribute throughout the canvas initially
      raindrops.push(raindrop);
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw raindrops
      raindrops.forEach((raindrop) => {
        raindrop.update();
        raindrop.draw();
      });

      // Randomly trigger lightning (more frequently)
      if (Math.random() < 0.015) {
        createLightning();
        setLightningFlash(true);
        setTimeout(() => setLightningFlash(false), 150);
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-[104px] h-[104px] max-w-md aspect-[4/4] rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 ${
        lightningFlash ? "brightness-110" : ""
      }`}
    >
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 pointer-events-none"
      />

      {/* Storm themed background - dark green */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-green-950 to-gray-900 z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-green-900/20 z-0"></div>

      {/* Muted storm cloud effect */}
      <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-green-900/20 to-transparent z-0"></div>

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

          {/* Subtle overlay that preserves character visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-green-950/20 via-transparent to-transparent"></div>

          {/* Lightning flash overlay - more intense */}
          <div
            className={`absolute inset-0 bg-green-300/15 transition-opacity duration-150 ${
              lightningFlash ? "opacity-90" : "opacity-0"
            }`}
          ></div>
        </div>
      </div>

      {/* Dark green border */}
      <div className="absolute inset-0 border-2 border-green-800/80 rounded-lg pointer-events-none z-30"></div>

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-green-700 rounded-tl-lg z-30"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-green-700 rounded-tr-lg z-30"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-green-700 rounded-bl-lg z-30"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-green-700 rounded-br-lg z-30"></div>
    </div>
  );
}

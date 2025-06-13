"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function ShimmeryTrailCard({
  image,
  name,
  title,
  description,
  stats,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

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

    // Shimmer trail parameters
    const trailParticles = [];
    const maxParticles = 120;
    const spawnRate = 0.3; // Particles per frame (less than 1 for slower spawning)

    // Animation timing
    let lastTime = 0;
    let elapsedTime = 0;
    let particleAccumulator = 0;

    // Path points for the border trail
    const generatePathPoints = () => {
      const margin = 10; // Margin from edge
      const corners = [
        { x: margin, y: margin }, // Top left
        { x: canvas.width - margin, y: margin }, // Top right
        { x: canvas.width - margin, y: canvas.height - margin }, // Bottom right
        { x: margin, y: canvas.height - margin }, // Bottom left
      ];

      // Generate points along the path
      const points = [];
      const segmentCount = 20; // Points per side

      // Add points for each side
      for (let i = 0; i < 4; i++) {
        const start = corners[i];
        const end = corners[(i + 1) % 4];

        for (let j = 0; j < segmentCount; j++) {
          const ratio = j / segmentCount;
          points.push({
            x: start.x + (end.x - start.x) * ratio,
            y: start.y + (end.y - start.y) * ratio,
          });
        }
      }

      return points;
    };

    const pathPoints = generatePathPoints();

    class ShimmerParticle {
      constructor() {
        this.reset();
      }

      reset() {
        // Start at a random point on the path
        const pathIndex = Math.floor(Math.random() * pathPoints.length);
        const point = pathPoints[pathIndex];

        this.x = point.x;
        this.y = point.y;
        this.pathIndex = pathIndex;

        // Movement along the path
        this.speed = Math.random() * 0.002 + 0.001; // Very slow movement
        this.progress = 0; // Progress along current segment

        // Appearance
        this.size = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.3 + 0.1;

        // Color - golden shimmer with slight variations
        this.hue = Math.random() * 20 + 40; // Gold range (40-60)
        this.saturation = Math.random() * 20 + 80; // 80-100%
        this.lightness = Math.random() * 20 + 70; // 70-90%

        // Subtle movement perpendicular to path
        this.perpDistance = Math.random() * 4 - 2;
        this.perpSpeed = Math.random() * 0.0002 + 0.0001;
        this.perpOffset = Math.random() * Math.PI * 2;

        // Life
        this.life = 1.0;
        this.fadeSpeed = Math.random() * 0.0005 + 0.0002;
      }

      update(deltaTime) {
        // Progress along the path
        this.progress += this.speed * deltaTime;

        // If reached end of segment, move to next point
        if (this.progress >= 1) {
          this.pathIndex = (this.pathIndex + 1) % pathPoints.length;
          this.progress = 0;
        }

        // Calculate position
        const currentPoint = pathPoints[this.pathIndex];
        const nextPoint = pathPoints[(this.pathIndex + 1) % pathPoints.length];

        // Interpolate between points
        this.x =
          currentPoint.x + (nextPoint.x - currentPoint.x) * this.progress;
        this.y =
          currentPoint.y + (nextPoint.y - currentPoint.y) * this.progress;

        // Calculate perpendicular offset
        if (nextPoint.x !== currentPoint.x || nextPoint.y !== currentPoint.y) {
          const dx = nextPoint.x - currentPoint.x;
          const dy = nextPoint.y - currentPoint.y;
          const length = Math.sqrt(dx * dx + dy * dy);

          // Normalize and get perpendicular vector
          const perpX = -dy / length;
          const perpY = dx / length;

          // Add perpendicular oscillation
          const perpFactor =
            Math.sin(elapsedTime * this.perpSpeed + this.perpOffset) *
            this.perpDistance;
          this.x += perpX * perpFactor;
          this.y += perpY * perpFactor;
        }

        // Slowly fade out particles
        this.life -= this.fadeSpeed * deltaTime;

        if (this.life <= 0) {
          this.reset();
        }
      }

      draw() {
        if (!ctx) return;

        // Adjust opacity based on life
        const currentOpacity = this.opacity * this.life;

        // Draw shimmer particle
        const gradient = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.size * 2
        );

        gradient.addColorStop(
          0,
          `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${currentOpacity})`
        );
        gradient.addColorStop(
          1,
          `hsla(${this.hue}, ${this.saturation}%, ${this.lightness - 10}%, 0)`
        );

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Animation loop
    const animate = (timestamp) => {
      // Calculate delta time
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      elapsedTime += deltaTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn new particles at a controlled rate
      particleAccumulator += spawnRate;
      while (particleAccumulator >= 1 && trailParticles.length < maxParticles) {
        trailParticles.push(new ShimmerParticle());
        particleAccumulator -= 1;
      }

      // Draw and update trail particles
      trailParticles.forEach((particle) => {
        particle.update(deltaTime);
        particle.draw();
      });

      // Draw subtle glow along the path
      if (pathPoints.length > 0) {
        ctx.strokeStyle = "rgba(255, 230, 150, 0.05)";
        ctx.lineWidth = 8;

        ctx.beginPath();
        ctx.moveTo(pathPoints[0].x, pathPoints[0].y);

        for (let i = 1; i < pathPoints.length; i++) {
          ctx.lineTo(pathPoints[i].x, pathPoints[i].y);
        }

        // Close the path
        ctx.lineTo(pathPoints[0].x, pathPoints[0].y);
        ctx.stroke();
      }

      requestAnimationFrame(animate);
    };

    animate(0);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-[104px] h-[104px] max-w-md aspect-[4/4] rounded-lg overflow-hidden transition-all duration-300 hover:scale-105"
    >
      {/* Deep background */}
      <div className="absolute inset-0 bg-gray-900 z-0"></div>

      {/* Subtle pattern */}
      <div
        className="absolute inset-0 opacity-5 z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.2' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
        }}
      ></div>

      {/* Canvas for animations */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 pointer-events-none"
      />

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

          {/* Golden tint overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 via-transparent to-amber-800/10 mix-blend-overlay"></div>
        </div>
      </div>

      {/* Elegant border */}
      <div className="absolute inset-0 border border-amber-500/10 rounded-lg pointer-events-none z-30"></div>

      {/* Corner embellishments */}
      <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-amber-500/20 rounded-tl-lg z-30"></div>
      <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-amber-500/20 rounded-tr-lg z-30"></div>
      <div className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-amber-500/20 rounded-bl-lg z-30"></div>
      <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-amber-500/20 rounded-br-lg z-30"></div>

      {/* Elegant symbol */}
      <div className="absolute bottom-1.5 right-1.5 w-4 h-4 flex items-center justify-center z-40">
        <svg
          viewBox="0 0 24 24"
          className="w-3 h-3 text-amber-300/60 fill-current"
        >
          <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,5A3,3 0 0,1 15,8A3,3 0 0,1 12,11A3,3 0 0,1 9,8A3,3 0 0,1 12,5Z" />
        </svg>
      </div>

      {/* Subtle glow */}
      <div className="absolute inset-0 rounded-lg shadow-[0_0_8px_rgba(255,200,100,0.1)] z-30 pointer-events-none"></div>
    </div>
  );
}

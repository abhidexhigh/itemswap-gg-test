"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function WaterVariantGlacier({
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

    // Glacier properties
    const iceShards = [];
    const shardCount = 25;
    const snowflakes = [];
    const snowflakeCount = 15;

    // Glacial blue colors
    const iceColors = [
      "rgba(220, 240, 255, 0.4)",
      "rgba(200, 225, 255, 0.35)",
      "rgba(180, 210, 255, 0.3)",
      "rgba(150, 200, 255, 0.25)",
    ];

    // Ice crack patterns
    const cracks = [];
    const crackCount = 3;

    class IceShard {
      constructor() {
        this.reset();
      }

      reset() {
        // Random position
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        // Size and opacity
        this.size = Math.random() * 15 + 5;
        this.opacity = Math.random() * 0.15 + 0.05;

        // Shape properties
        this.points = Math.floor(Math.random() * 3) + 3; // 3-5 points
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() * 0.001 - 0.0005) * 0.2;

        // Shimmer effect
        this.shimmerSpeed = Math.random() * 0.01 + 0.005;
        this.shimmerRange = Math.random() * 0.05 + 0.02;
        this.shimmerOffset = Math.random() * Math.PI * 2;

        // Color
        this.color = iceColors[Math.floor(Math.random() * iceColors.length)];
      }

      update(time) {
        // Subtle rotation
        this.rotation += this.rotationSpeed;

        // Shimmer effect - subtle opacity variation
        const shimmerFactor = Math.sin(
          time * this.shimmerSpeed + this.shimmerOffset
        );
        this.currentOpacity = this.opacity + shimmerFactor * this.shimmerRange;
      }

      draw() {
        if (!ctx) return;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // Draw crystalline shard
        ctx.beginPath();

        // Start from center
        const angleStep = (Math.PI * 2) / this.points;

        for (let i = 0; i < this.points; i++) {
          const angle = i * angleStep;
          const distance = this.size * (0.8 + Math.random() * 0.4); // Slightly random shard shape

          const x = Math.cos(angle) * distance;
          const y = Math.sin(angle) * distance;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.closePath();

        // Fill with translucent blue
        ctx.fillStyle = this.color.replace(
          /[\d\.]+\)$/,
          `${this.currentOpacity})`
        );
        ctx.fill();

        // Add shimmer highlight
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.currentOpacity * 0.8})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        ctx.restore();
      }
    }

    class Snowflake {
      constructor() {
        this.reset();
      }

      reset() {
        // Position
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        // Movement
        this.speedX = (Math.random() * 0.2 - 0.1) * 0.3;
        this.speedY = (Math.random() * 0.2 + 0.1) * 0.3;

        // Appearance
        this.size = Math.random() * 2 + 0.5;
        this.opacity = Math.random() * 0.3 + 0.1;

        // Shimmer
        this.shimmerSpeed = Math.random() * 0.03 + 0.01;
        this.shimmerOffset = Math.random() * Math.PI * 2;
      }

      update(time) {
        // Drift movement
        this.x += this.speedX;
        this.y += this.speedY;

        // Add slight wiggle
        this.x += Math.sin(time * 0.001 + this.shimmerOffset) * 0.2;

        // Reset if out of bounds
        if (this.y > canvas.height) {
          this.y = 0;
          this.x = Math.random() * canvas.width;
        }

        if (this.x < 0 || this.x > canvas.width) {
          this.x = Math.random() * canvas.width;
        }

        // Shimmer effect
        this.currentOpacity =
          this.opacity + Math.sin(time * this.shimmerSpeed) * 0.05;
      }

      draw() {
        if (!ctx) return;

        // Draw snowflake
        ctx.fillStyle = `rgba(255, 255, 255, ${this.currentOpacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    class IceCrack {
      constructor() {
        this.reset();
        this.generate();
      }

      reset() {
        // Start position
        this.startX = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
        this.startY = Math.random() * canvas.height * 0.8 + canvas.height * 0.1;

        // Crack properties
        this.length = Math.random() * 30 + 20;
        this.branches = Math.floor(Math.random() * 3) + 1;
        this.width = Math.random() * 0.6 + 0.2;
        this.opacity = Math.random() * 0.15 + 0.05;

        // Shimmer
        this.shimmerSpeed = Math.random() * 0.001 + 0.0005;
        this.paths = [];
      }

      generate() {
        // Generate main path
        const mainPath = this.generatePath(
          this.startX,
          this.startY,
          Math.random() * Math.PI * 2,
          this.length
        );
        this.paths.push(mainPath);

        // Generate branches
        for (let i = 0; i < this.branches; i++) {
          const branchPoint =
            Math.floor(Math.random() * (mainPath.length - 2)) + 1;
          const branchAngle = Math.random() * Math.PI - Math.PI / 2; // Branch at different angles
          const branchLength = this.length * (Math.random() * 0.4 + 0.3);

          const branchPath = this.generatePath(
            mainPath[branchPoint].x,
            mainPath[branchPoint].y,
            branchAngle,
            branchLength
          );

          this.paths.push(branchPath);
        }
      }

      generatePath(startX, startY, angle, length) {
        const path = [];
        let x = startX;
        let y = startY;
        let currentAngle = angle;
        const segmentLength = 3;
        const totalSegments = Math.floor(length / segmentLength);

        path.push({ x, y });

        for (let i = 0; i < totalSegments; i++) {
          // Slight angle variation for natural look
          currentAngle += Math.random() * 0.2 - 0.1;

          x += Math.cos(currentAngle) * segmentLength;
          y += Math.sin(currentAngle) * segmentLength;

          path.push({ x, y });
        }

        return path;
      }

      update(time) {
        // Subtle shimmer effect
        this.currentOpacity =
          this.opacity + Math.sin(time * this.shimmerSpeed) * 0.03;
      }

      draw() {
        if (!ctx) return;

        ctx.strokeStyle = `rgba(255, 255, 255, ${this.currentOpacity})`;
        ctx.lineWidth = this.width;

        // Draw each path
        this.paths.forEach((path) => {
          ctx.beginPath();
          ctx.moveTo(path[0].x, path[0].y);

          for (let i = 1; i < path.length; i++) {
            ctx.lineTo(path[i].x, path[i].y);
          }

          ctx.stroke();
        });

        // Add glow effect
        ctx.shadowColor = "rgba(200, 230, 255, 0.5)";
        ctx.shadowBlur = 2;
        ctx.strokeStyle = `rgba(230, 240, 255, ${this.currentOpacity * 0.7})`;
        ctx.lineWidth = this.width * 0.5;

        this.paths.forEach((path) => {
          ctx.beginPath();
          ctx.moveTo(path[0].x, path[0].y);

          for (let i = 1; i < path.length; i++) {
            ctx.lineTo(path[i].x, path[i].y);
          }

          ctx.stroke();
        });

        ctx.shadowBlur = 0;
      }
    }

    // Initialize ice shards
    for (let i = 0; i < shardCount; i++) {
      iceShards.push(new IceShard());
    }

    // Initialize snowflakes
    for (let i = 0; i < snowflakeCount; i++) {
      snowflakes.push(new Snowflake());
    }

    // Initialize ice cracks
    for (let i = 0; i < crackCount; i++) {
      cracks.push(new IceCrack());
    }

    // Animation loop
    const animate = () => {
      const time = Date.now();

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Add depth with gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "rgba(180, 220, 250, 0.05)");
      gradient.addColorStop(0.5, "rgba(150, 200, 240, 0.04)");
      gradient.addColorStop(1, "rgba(120, 180, 230, 0.03)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw ice cracks (deepest layer)
      cracks.forEach((crack) => {
        crack.update(time);
        crack.draw();
      });

      // Draw ice shards (middle layer)
      iceShards.forEach((shard) => {
        shard.update(time);
        shard.draw();
      });

      // Draw snowflakes (top layer)
      snowflakes.forEach((snowflake) => {
        snowflake.update(time);
        snowflake.draw();
      });

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
      className="relative w-[104px] h-[104px] max-w-md aspect-[4/4] rounded-lg overflow-hidden transition-all duration-300 hover:scale-105"
    >
      {/* Cold blue background */}
      <div className="absolute inset-0 bg-blue-950 z-0"></div>

      {/* Glacial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-900/50 via-cyan-900/30 to-blue-950/70 z-0"></div>

      {/* Frosty top edge */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-sky-200/40 to-transparent z-30"></div>

      {/* Ice layer effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-100/10 to-transparent h-1/4 z-0"></div>

      {/* Particle canvas */}
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

          {/* Ice overlay effect - subtle frost on the image */}
          <div className="absolute inset-0 bg-gradient-to-t from-sky-900/20 to-transparent mix-blend-overlay"></div>

          {/* Glacial texture overlay */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, rgba(230,240,255,0.1) 10%, transparent 10.5%),
                                  radial-gradient(circle at 30% 25%, rgba(230,240,255,0.1) 5%, transparent 5.5%),
                                  radial-gradient(circle at 70% 75%, rgba(230,240,255,0.1) 7%, transparent 7.5%)`,
              backgroundSize: "20px 20px, 15px 15px, 25px 25px",
            }}
          ></div>
        </div>
      </div>

      {/* Glacial border */}
      <div className="absolute inset-0 border border-sky-200/30 rounded-lg pointer-events-none z-30"></div>

      {/* Frosted corners */}
      <div className="absolute top-0 left-0 w-[10px] h-[10px] bg-gradient-radial from-sky-200/20 to-transparent z-30"></div>
      <div className="absolute top-0 right-0 w-[10px] h-[10px] bg-gradient-radial from-sky-200/20 to-transparent z-30"></div>
      <div className="absolute bottom-0 left-0 w-[10px] h-[10px] bg-gradient-radial from-sky-200/20 to-transparent z-30"></div>
      <div className="absolute bottom-0 right-0 w-[10px] h-[10px] bg-gradient-radial from-sky-200/20 to-transparent z-30"></div>
    </div>
  );
}

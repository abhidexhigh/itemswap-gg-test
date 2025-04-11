"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function LightBeamCard({
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

    // Light beam parameters
    const beams = [];
    const beamCount = 10;

    // Central light parameters
    const centralLights = [];
    const centralLightCount = 15;

    // Animation timing
    let lastTime = 0;
    let elapsedTime = 0;

    class LightBeam {
      constructor() {
        this.reset();
      }

      reset() {
        // Start position from edge of canvas
        const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left

        if (side === 0) {
          // Top
          this.x = Math.random() * canvas.width;
          this.y = 0;
        } else if (side === 1) {
          // Right
          this.x = canvas.width;
          this.y = Math.random() * canvas.height;
        } else if (side === 2) {
          // Bottom
          this.x = Math.random() * canvas.width;
          this.y = canvas.height;
        } else {
          // Left
          this.x = 0;
          this.y = Math.random() * canvas.height;
        }

        // Target is center of canvas
        this.targetX = canvas.width / 2;
        this.targetY = canvas.height / 2;

        // Calculate angle to center
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        this.angle = Math.atan2(dy, dx);

        // Speed and properties
        this.speed = Math.random() * 0.2 + 0.1;
        this.width = Math.random() * 3 + 1;
        this.length = Math.random() * 50 + 30;

        // Color
        this.hue = Math.random() * 60 + 180; // Blue to cyan range
        this.opacity = Math.random() * 0.3 + 0.1;

        // Life and animation
        this.life = 0;
        this.maxLife = Math.random() * 300 + 200;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulseOffset = Math.random() * Math.PI * 2;
      }

      update(deltaTime) {
        // Move toward center
        this.x += Math.cos(this.angle) * this.speed * deltaTime;
        this.y += Math.sin(this.angle) * this.speed * deltaTime;

        // Life counter
        this.life += deltaTime;

        // Pulse effect
        this.currentOpacity =
          this.opacity *
          (0.5 +
            0.5 * Math.sin(this.life * this.pulseSpeed + this.pulseOffset));

        // Reset when reaching center or max life
        const distToCenter = Math.sqrt(
          Math.pow(this.x - this.targetX, 2) +
            Math.pow(this.y - this.targetY, 2)
        );

        if (distToCenter < 5 || this.life > this.maxLife) {
          this.reset();
        }
      }

      draw() {
        if (!ctx) return;

        // Calculate end point of beam
        const endX = this.x - Math.cos(this.angle) * this.length;
        const endY = this.y - Math.sin(this.angle) * this.length;

        // Create gradient for beam
        const gradient = ctx.createLinearGradient(this.x, this.y, endX, endY);

        gradient.addColorStop(0, `hsla(${this.hue}, 100%, 70%, 0)`);
        gradient.addColorStop(
          0.4,
          `hsla(${this.hue}, 100%, 70%, ${this.currentOpacity})`
        );
        gradient.addColorStop(
          0.6,
          `hsla(${this.hue}, 100%, 70%, ${this.currentOpacity})`
        );
        gradient.addColorStop(1, `hsla(${this.hue}, 100%, 70%, 0)`);

        // Draw beam
        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.width;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }
    }

    class CentralLight {
      constructor() {
        this.reset();
      }

      reset() {
        // Position near center
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 30;
        this.x = canvas.width / 2 + Math.cos(angle) * distance;
        this.y = canvas.height / 2 + Math.sin(angle) * distance;

        // Size and appearance
        this.size = Math.random() * 5 + 2;
        this.originalSize = this.size;

        // Color
        this.hue = Math.random() * 60 + 180; // Blue to cyan range
        this.brightness = Math.random() * 30 + 70; // 70-100%
        this.opacity = Math.random() * 0.5 + 0.3;

        // Animation
        this.pulseSpeed = Math.random() * 0.01 + 0.005;
        this.pulseOffset = Math.random() * Math.PI * 2;
        this.orbitSpeed =
          (Math.random() * 0.0005 + 0.0001) * (Math.random() > 0.5 ? 1 : -1);
        this.orbitRadius = distance;
        this.orbitAngle = angle;
      }

      update(deltaTime) {
        // Pulse size
        this.size =
          this.originalSize *
          (0.8 +
            0.4 * Math.sin(elapsedTime * this.pulseSpeed + this.pulseOffset));

        // Orbit slightly around center
        this.orbitAngle += this.orbitSpeed * deltaTime;
        this.x =
          canvas.width / 2 + Math.cos(this.orbitAngle) * this.orbitRadius;
        this.y =
          canvas.height / 2 + Math.sin(this.orbitAngle) * this.orbitRadius;
      }

      draw() {
        if (!ctx) return;

        // Create glow
        const glow = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.size * 2
        );

        glow.addColorStop(
          0,
          `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.opacity})`
        );
        glow.addColorStop(1, `hsla(${this.hue}, 100%, ${this.brightness}%, 0)`);

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx.fill();

        // Draw core
        ctx.fillStyle = `hsla(${this.hue}, 80%, 95%, ${this.opacity * 1.2})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Initialize light beams
    for (let i = 0; i < beamCount; i++) {
      beams.push(new LightBeam());
    }

    // Initialize central lights
    for (let i = 0; i < centralLightCount; i++) {
      centralLights.push(new CentralLight());
    }

    // Animation loop
    const animate = (timestamp) => {
      // Calculate delta time
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      elapsedTime += deltaTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Add subtle background gradient
      const bgGradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2
      );

      bgGradient.addColorStop(0, "rgba(30, 50, 80, 0.1)");
      bgGradient.addColorStop(0.5, "rgba(20, 30, 60, 0.05)");
      bgGradient.addColorStop(1, "rgba(10, 20, 40, 0)");

      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw light beams
      beams.forEach((beam) => {
        beam.update(deltaTime);
        beam.draw();
      });

      // Draw central glow
      const centralGlow = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 4
      );

      centralGlow.addColorStop(0, "rgba(150, 200, 255, 0.15)");
      centralGlow.addColorStop(1, "rgba(100, 150, 255, 0)");

      ctx.fillStyle = centralGlow;
      ctx.beginPath();
      ctx.arc(
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 4,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Draw central lights
      centralLights.forEach((light) => {
        light.update(deltaTime);
        light.draw();
      });

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
      {/* Dark background */}
      <div className="absolute inset-0 bg-slate-900 z-0"></div>

      {/* Subtle texture */}
      <div
        className="absolute inset-0 opacity-10 z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.1 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: "100% 100%",
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

          {/* Central light glow overlay */}
          <div
            className="absolute inset-0 opacity-30 mix-blend-screen"
            style={{
              background:
                "radial-gradient(circle at center, rgba(150, 200, 255, 0.3) 0%, transparent 70%)",
            }}
          ></div>
        </div>
      </div>

      {/* Card border */}
      <div className="absolute inset-0 border border-sky-500/20 rounded-lg pointer-events-none z-30"></div>

      {/* Corners */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-sky-400/30 rounded-tl-lg z-30"></div>
      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-sky-400/30 rounded-tr-lg z-30"></div>
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-sky-400/30 rounded-bl-lg z-30"></div>
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-sky-400/30 rounded-br-lg z-30"></div>

      {/* Light symbol */}
      <div className="absolute bottom-1 right-1 w-6 h-6 flex items-center justify-center z-40">
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 text-sky-400/60 fill-current"
        >
          <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z" />
        </svg>
      </div>

      {/* Glow effect */}
      <div className="absolute inset-0 rounded-lg shadow-[0_0_15px_rgba(100,150,255,0.3),inset_0_0_8px_rgba(120,170,255,0.2)] z-30 pointer-events-none"></div>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function AirVariantBreeze({
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

    // Wind streams and particles
    const windStreams = [];
    const streamCount = 5;

    // Floating particles
    const floatingParticles = [];
    const particleCount = 40;

    // Animation variables
    let windTime = 0;

    // Wind stream class
    class WindStream {
      constructor() {
        this.reset();
      }

      reset() {
        // Position - random height, start from left
        this.startX = -30;
        this.y = Math.random() * canvas.height;

        // Width and curvature
        this.width = canvas.width + 60; // Extend beyond canvas
        this.amplitude = Math.random() * 20 + 10;
        this.wavelength = Math.random() * 200 + 100;

        // Speed and direction
        this.speed = Math.random() * 0.5 + 0.5;
        this.frequency = Math.random() * 0.01 + 0.005;
        this.phase = Math.random() * Math.PI * 2;

        // Appearance
        this.thickness = Math.random() * 1.5 + 0.5;
        this.opacity = Math.random() * 0.15 + 0.05;

        // Lifespan
        this.lifespan = Math.random() * 200 + 200;
        this.age = 0;
      }

      update() {
        // Aging
        this.age++;

        // Phase movement for wave animation
        this.phase += this.speed * 0.02;

        // Reset when lifecycle complete
        if (this.age >= this.lifespan) {
          this.reset();
        }
      }

      draw() {
        if (!ctx) return;

        // Calculate fade based on lifecycle
        const fadeInPeriod = this.lifespan * 0.2;
        const fadeOutPeriod = this.lifespan * 0.2;
        let alpha = this.opacity;

        if (this.age < fadeInPeriod) {
          alpha = this.opacity * (this.age / fadeInPeriod);
        } else if (this.age > this.lifespan - fadeOutPeriod) {
          alpha = this.opacity * ((this.lifespan - this.age) / fadeOutPeriod);
        }

        // Draw wind stream
        ctx.strokeStyle = `rgba(220, 240, 255, ${alpha})`;
        ctx.lineWidth = this.thickness;
        ctx.beginPath();

        // Create wavy line
        for (let x = 0; x <= this.width; x += 5) {
          const relX = x / this.width;
          const waveY =
            Math.sin(
              relX * Math.PI * 2 * (this.width / this.wavelength) + this.phase
            ) * this.amplitude;

          const pointX = this.startX + x;
          const pointY = this.y + waveY;

          if (x === 0) {
            ctx.moveTo(pointX, pointY);
          } else {
            ctx.lineTo(pointX, pointY);
          }
        }

        ctx.stroke();
      }
    }

    // Floating particle class
    class FloatingParticle {
      constructor() {
        this.reset();
      }

      reset() {
        // Position - random placement
        this.x = Math.random() * (canvas.width + 50) - 25;
        this.y = Math.random() * (canvas.height + 50) - 25;

        // Base parameters
        this.baseY = this.y;
        this.baseX = this.x;

        // Size and appearance
        this.radius = Math.random() * 1.5 + 0.5;
        this.opacity = Math.random() * 0.5 + 0.3;

        // Colors - light blues and whites
        this.hue = Math.random() * 40 + 200; // Blues
        this.saturation = Math.random() * 40 + 20;
        this.lightness = 80 + Math.random() * 20;

        // Movement
        this.speedX = 0.2 + Math.random() * 0.8;
        this.floatAmplitude = Math.random() * 15 + 5;
        this.floatSpeed = Math.random() * 0.01 + 0.005;
        this.floatOffset = Math.random() * Math.PI * 2;

        // Rotation for non-circular particles
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.01;

        // Randomize whether particle is dot or line
        this.type = Math.random() > 0.7 ? "line" : "dot";
        if (this.type === "line") {
          this.length = Math.random() * 5 + 3;
        }
      }

      update() {
        // Horizontal movement
        this.x += this.speedX;

        // Vertical floating movement
        this.floatOffset += this.floatSpeed;
        this.y = this.baseY + Math.sin(this.floatOffset) * this.floatAmplitude;

        // Rotation update for line particles
        if (this.type === "line") {
          this.rotation += this.rotationSpeed;
        }

        // Reset if out of bounds
        if (this.x > canvas.width + 30) {
          this.x = -20;
          this.baseX = this.x;
        }
      }

      draw() {
        if (!ctx) return;

        // Set color based on particle properties
        ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.opacity})`;
        ctx.strokeStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.opacity})`;

        if (this.type === "dot") {
          // Draw circular particle
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Draw line particle with rotation
          ctx.save();
          ctx.translate(this.x, this.y);
          ctx.rotate(this.rotation);

          ctx.beginPath();
          ctx.moveTo(-this.length / 2, 0);
          ctx.lineTo(this.length / 2, 0);
          ctx.lineWidth = this.radius;
          ctx.stroke();

          ctx.restore();
        }
      }
    }

    // Create wind streams
    for (let i = 0; i < streamCount; i++) {
      const stream = new WindStream();
      windStreams.push(stream);
    }

    // Create floating particles
    for (let i = 0; i < particleCount; i++) {
      const particle = new FloatingParticle();
      // Distribute initial positions
      particle.x = Math.random() * canvas.width;
      particle.baseX = particle.x;
      floatingParticles.push(particle);
    }

    // Draw air currents in background
    const drawAirCurrents = () => {
      if (!ctx) return;

      windTime += 0.01;

      // Create subtle flowing background pattern
      const gradientHeight = canvas.height * 0.8;

      // Draw 3 flowing layers with different speeds
      for (let layer = 0; layer < 3; layer++) {
        const speed = 0.5 + layer * 0.3;
        const layerTime = windTime * speed;

        ctx.strokeStyle = `rgba(210, 230, 255, 0.04)`;
        ctx.lineWidth = 2 - layer * 0.4;

        ctx.beginPath();

        // Create flowing horizontal lines
        for (let y = 0; y < gradientHeight; y += 20) {
          const relY = y / gradientHeight;

          // First point
          ctx.moveTo(0, relY * canvas.height);

          // Curve points
          for (let x = 0; x <= canvas.width; x += canvas.width / 10) {
            const relX = x / canvas.width;

            const yOffset =
              Math.sin(relX * Math.PI * 3 + layerTime) *
              Math.sin(relY * Math.PI + layerTime * 0.7) *
              (10 - layer * 2);

            ctx.lineTo(x, relY * canvas.height + yOffset);
          }
        }

        ctx.stroke();
      }
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background air currents
      drawAirCurrents();

      // Draw wind streams
      windStreams.forEach((stream) => {
        stream.update();
        stream.draw();
      });

      // Draw floating particles
      floatingParticles.forEach((particle) => {
        particle.update();
        particle.draw();
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
      {/* Air/Wind background */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-100 via-sky-200 to-blue-300 z-0"></div>

      {/* Radial breeze effect */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(circle at 60% 40%, rgba(255,255,255,0.5) 0%, rgba(220,240,255,0.2) 60%, rgba(200,220,255,0.1) 100%)",
        }}
      ></div>

      {/* Swirl overlay */}
      <div
        className="absolute inset-0 opacity-5 z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.03' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.3 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: "150% 150%",
          animation: "slowRotate 30s linear infinite",
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

          {/* Subtle wind vignette overlay */}
          <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(180,220,255,0.2)]"></div>

          {/* Wind overlay effect */}
          <div
            className="absolute inset-0 opacity-10 mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,50 C20,40 40,60 60,50 C80,40 100,60 100,50' fill='none' stroke='white' stroke-width='1'/%3E%3Cpath d='M0,30 C20,20 40,40 60,30 C80,20 100,40 100,30' fill='none' stroke='white' stroke-width='1'/%3E%3Cpath d='M0,70 C20,60 40,80 60,70 C80,60 100,80 100,70' fill='none' stroke='white' stroke-width='1'/%3E%3C/svg%3E")`,
              backgroundSize: "200% 200%",
              animation: "windFlow 15s linear infinite",
            }}
          ></div>
        </div>
      </div>

      {/* Air frame */}
      <div className="absolute inset-0 border border-sky-400/20 rounded-lg pointer-events-none z-30"></div>

      {/* Air corner accents */}
      <div className="absolute top-0 left-0 w-7 h-7 border-t-2 border-l-2 border-sky-300/30 rounded-tl-lg z-30"></div>
      <div className="absolute top-0 right-0 w-7 h-7 border-t-2 border-r-2 border-sky-300/30 rounded-tr-lg z-30"></div>
      <div className="absolute bottom-0 left-0 w-7 h-7 border-b-2 border-l-2 border-sky-400/30 rounded-bl-lg z-30"></div>
      <div className="absolute bottom-0 right-0 w-7 h-7 border-b-2 border-r-2 border-sky-400/30 rounded-br-lg z-30"></div>

      {/* Air symbol in bottom right */}
      <div className="absolute bottom-1 right-1 w-6 h-6 flex items-center justify-center z-40">
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 text-sky-500/40 fill-current"
        >
          <path d="M4,10a6,6 0 1,0 12,0a6,6 0 1,0 -12,0 M4,18a3,3 0 1,0 6,0a3,3 0 1,0 -6,0 M16,19a2,2 0 1,0 4,0a2,2 0 1,0 -4,0" />
        </svg>
      </div>

      {/* Airy glow effect */}
      <div className="absolute inset-0 rounded-lg shadow-[0_0_10px_rgba(180,220,255,0.4),inset_0_0_8px_rgba(180,220,255,0.2)] z-30 pointer-events-none"></div>

      {/* Add keyframes for animations */}
      <style jsx global>{`
        @keyframes windFlow {
          0% {
            background-position: 0% 0%;
          }
          100% {
            background-position: 100% 0%;
          }
        }

        @keyframes slowRotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

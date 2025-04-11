"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function EarthVariantCrystal({
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

    // Crystal formation parameters
    const crystals = [];
    const crystalCount = 15;

    // Dust particles for ambient effect
    const dustParticles = [];
    const dustCount = 30;

    // Animation variables
    let angle = 0;
    let pulseTime = 0;

    // Crystal class for geometric shards
    class Crystal {
      constructor() {
        this.reset();
      }

      reset() {
        // Position
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        // Size and shape
        this.size = Math.random() * 15 + 10;
        this.sides = Math.floor(Math.random() * 3) + 3; // 3-5 sides
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.001;

        // Visual properties
        this.opacity = Math.random() * 0.2 + 0.1;

        // Color - earth tones and crystal hues
        this.colors = [
          "rgba(120, 80, 40, 0.3)", // Brown
          "rgba(60, 130, 100, 0.2)", // Forest green
          "rgba(150, 120, 50, 0.25)", // Amber
          "rgba(100, 70, 30, 0.3)", // Earthy brown
          "rgba(140, 170, 90, 0.2)", // Mossy green
          "rgba(180, 150, 90, 0.25)", // Sandy brown
          "rgba(100, 80, 120, 0.2)", // Purple crystal
        ];
        this.color =
          this.colors[Math.floor(Math.random() * this.colors.length)];

        // Crystal properties
        this.facetCount = Math.floor(Math.random() * 3) + 2;
        this.innerSize = this.size * (0.4 + Math.random() * 0.3);

        // Animation
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulseAmount = Math.random() * 0.15 + 0.05;
        this.pulseOffset = Math.random() * Math.PI * 2;

        // Glow properties
        this.glowSize = this.size * 1.3;
        this.glowOpacity = Math.random() * 0.2 + 0.05;
        this.glowColor = "rgba(255, 240, 180, 0.1)";
      }

      update() {
        // Subtle rotation
        this.rotation += this.rotationSpeed;

        // Pulsing effect
        this.pulseFactor =
          1 +
          Math.sin(pulseTime * this.pulseSpeed + this.pulseOffset) *
            this.pulseAmount;
      }

      draw() {
        if (!ctx) return;

        // Save context for crystal drawing
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // Draw crystal glow
        const glow = ctx.createRadialGradient(
          0,
          0,
          0,
          0,
          0,
          this.glowSize * this.pulseFactor
        );
        glow.addColorStop(
          0,
          "rgba(255, 240, 180, " + this.glowOpacity * this.pulseFactor + ")"
        );
        glow.addColorStop(
          0.5,
          "rgba(255, 240, 180, " +
            this.glowOpacity * 0.5 * this.pulseFactor +
            ")"
        );
        glow.addColorStop(1, "rgba(255, 240, 180, 0)");

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(0, 0, this.glowSize * this.pulseFactor, 0, Math.PI * 2);
        ctx.fill();

        // Draw outer crystal shape
        ctx.fillStyle = this.color;
        ctx.beginPath();

        const angle = (Math.PI * 2) / this.sides;
        const size = this.size * this.pulseFactor;

        for (let i = 0; i < this.sides; i++) {
          const x = Math.cos(i * angle) * size;
          const y = Math.sin(i * angle) * size;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.closePath();
        ctx.fill();

        // Draw inner facets
        ctx.fillStyle = "rgba(255, 255, 255, 0.15)";

        for (let i = 0; i < this.facetCount; i++) {
          const facetAngle = (Math.PI * 2) / this.facetCount;
          const innerSize = this.innerSize * this.pulseFactor;

          ctx.beginPath();
          ctx.moveTo(0, 0);
          const x1 = Math.cos(i * facetAngle) * innerSize;
          const y1 = Math.sin(i * facetAngle) * innerSize;
          ctx.lineTo(x1, y1);

          const x2 = Math.cos((i + 1) * facetAngle) * innerSize;
          const y2 = Math.sin((i + 1) * facetAngle) * innerSize;
          ctx.lineTo(x2, y2);

          ctx.closePath();
          ctx.fill();
        }

        // Add crystal highlights
        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        ctx.lineWidth = 0.5;
        ctx.beginPath();

        for (let i = 0; i < this.sides; i++) {
          const x = Math.cos(i * angle) * size * 0.8;
          const y = Math.sin(i * angle) * size * 0.8;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.closePath();
        ctx.stroke();

        ctx.restore();
      }
    }

    // Dust particle class for ambient effects
    class DustParticle {
      constructor() {
        this.reset();
      }

      reset() {
        // Position
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        // Size and appearance
        this.radius = Math.random() * 1.5 + 0.5;
        this.opacity = Math.random() * 0.3 + 0.1;

        // Color - earth tones
        const earthTones = [
          [120, 100, 80], // Brown
          [140, 120, 90], // Tan
          [100, 80, 60], // Dark earth
          [160, 140, 100], // Sand
        ];

        const colorIndex = Math.floor(Math.random() * earthTones.length);
        this.color = earthTones[colorIndex];

        // Add slight random variation to color
        this.color = this.color.map((c) =>
          Math.min(255, Math.max(0, c + (Math.random() * 30 - 15)))
        );

        // Movement
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.speedY = (Math.random() - 0.5) * 0.2;

        // Life properties
        this.life = Math.random() * 150 + 50;
        this.age = 0;
      }

      update() {
        // Slow drifting movement
        this.x += this.speedX;
        this.y += this.speedY;

        // Aging
        this.age++;

        // Check if need to reset
        if (
          this.age > this.life ||
          this.x < -10 ||
          this.x > canvas.width + 10 ||
          this.y < -10 ||
          this.y > canvas.height + 10
        ) {
          this.reset();
        }
      }

      draw() {
        if (!ctx) return;

        // Calculate fade based on age
        let alpha = this.opacity;
        const fadePeriod = this.life * 0.2;

        if (this.age < fadePeriod) {
          alpha = this.opacity * (this.age / fadePeriod);
        } else if (this.age > this.life - fadePeriod) {
          alpha = this.opacity * ((this.life - this.age) / fadePeriod);
        }

        // Draw dust particle
        ctx.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Draw background crystal texture
    const drawCrystalTexture = () => {
      if (!ctx) return;

      const lineCount = 8;

      ctx.strokeStyle = "rgba(160, 140, 100, 0.04)";
      ctx.lineWidth = 1;

      // Draw crisscrossing crystal lattice pattern
      for (let i = 0; i < lineCount; i++) {
        const angleOffset = ((Math.PI * 2) / lineCount) * i + angle * 0.1;

        ctx.beginPath();

        // Start from center
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        // Draw extending lines
        for (let j = 0; j < 3; j++) {
          const lineAngle = angleOffset + ((Math.PI * 2) / 3) * j;

          const endX = centerX + Math.cos(lineAngle) * (canvas.width * 2);
          const endY = centerY + Math.sin(lineAngle) * (canvas.height * 2);

          ctx.moveTo(centerX, centerY);
          ctx.lineTo(endX, endY);
        }

        ctx.stroke();
      }
    };

    // Create crystals
    for (let i = 0; i < crystalCount; i++) {
      const crystal = new Crystal();
      crystals.push(crystal);
    }

    // Create dust particles
    for (let i = 0; i < dustCount; i++) {
      const dust = new DustParticle();
      dustParticles.push(dust);
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update animation variables
      angle += 0.002;
      pulseTime += 0.05;

      // Draw background texture
      drawCrystalTexture();

      // Draw crystals
      crystals.forEach((crystal) => {
        crystal.update();
        crystal.draw();
      });

      // Draw dust particles
      dustParticles.forEach((dust) => {
        dust.update();
        dust.draw();
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
      {/* Earth/Crystal background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-emerald-100 to-amber-200 z-0"></div>

      {/* Stone texture overlay */}
      <div
        className="absolute inset-0 z-0 opacity-15"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.5 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: "150% 150%",
        }}
      ></div>

      {/* Crystal facet overlay */}
      <div
        className="absolute inset-0 z-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,0 L100,0 L50,100 Z' fill='%23fff'/%3E%3Cpath d='M0,100 L100,100 L50,0 Z' fill='%23fff'/%3E%3Cpath d='M0,0 L0,100 L100,50 Z' fill='%23fff'/%3E%3Cpath d='M100,0 L100,100 L0,50 Z' fill='%23fff'/%3E%3C/svg%3E")`,
          backgroundSize: "50% 50%",
        }}
      ></div>

      {/* Crystal growth effect overlay */}
      <div
        className="absolute inset-0 z-1 opacity-10"
        style={{
          background:
            "radial-gradient(circle at 40% 60%, rgba(240,230,140,0.4) 0%, rgba(180,210,160,0.1) 50%, rgba(150,120,100,0.05) 100%)",
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

          {/* Crystal vignette overlay */}
          <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(180,160,120,0.2)]"></div>

          {/* Crystal-like gradient overlay */}
          <div
            className="absolute inset-0 opacity-15 mix-blend-overlay"
            style={{
              background:
                "linear-gradient(45deg, rgba(180,160,100,0.5) 0%, rgba(180,200,140,0.2) 50%, rgba(220,180,120,0.5) 100%)",
            }}
          ></div>
        </div>
      </div>

      {/* Earth crystal frame */}
      <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none z-30">
        <div className="absolute inset-0 border border-amber-700/20 rounded-lg"></div>

        {/* Earth corner accents - crystal/stone like */}
        <svg
          className="absolute top-0 left-0 w-12 h-12 z-30 text-amber-700/20"
          viewBox="0 0 48 48"
          fill="none"
        >
          <path d="M0 0L16 0L0 16L0 0Z" fill="currentColor" />
          <path
            d="M0 16L16 0L24 8L8 24L0 16Z"
            fill="currentColor"
            fillOpacity="0.6"
          />
        </svg>

        <svg
          className="absolute top-0 right-0 w-12 h-12 z-30 text-amber-700/20"
          viewBox="0 0 48 48"
          fill="none"
          style={{ transform: "scaleX(-1)" }}
        >
          <path d="M0 0L16 0L0 16L0 0Z" fill="currentColor" />
          <path
            d="M0 16L16 0L24 8L8 24L0 16Z"
            fill="currentColor"
            fillOpacity="0.6"
          />
        </svg>

        <svg
          className="absolute bottom-0 left-0 w-12 h-12 z-30 text-amber-700/20"
          viewBox="0 0 48 48"
          fill="none"
          style={{ transform: "scaleY(-1)" }}
        >
          <path d="M0 0L16 0L0 16L0 0Z" fill="currentColor" />
          <path
            d="M0 16L16 0L24 8L8 24L0 16Z"
            fill="currentColor"
            fillOpacity="0.6"
          />
        </svg>

        <svg
          className="absolute bottom-0 right-0 w-12 h-12 z-30 text-amber-700/20"
          viewBox="0 0 48 48"
          fill="none"
          style={{ transform: "scale(-1)" }}
        >
          <path d="M0 0L16 0L0 16L0 0Z" fill="currentColor" />
          <path
            d="M0 16L16 0L24 8L8 24L0 16Z"
            fill="currentColor"
            fillOpacity="0.6"
          />
        </svg>
      </div>

      {/* Earth symbol in bottom right */}
      <div className="absolute bottom-1 right-1 w-6 h-6 flex items-center justify-center z-40">
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 text-amber-700/40 fill-current"
        >
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm-5-9c.8 0 1.5-.7 1.5-1.5S7.8 8 7 8s-1.5.7-1.5 1.5S6.2 11 7 11zm4-3c.8 0 1.5-.7 1.5-1.5S11.8 5 11 5s-1.5.7-1.5 1.5S10.2 8 11 8zm6 6c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5 1.5-.7 1.5-1.5-.7-1.5-1.5-1.5z" />
        </svg>
      </div>

      {/* Crystal glow effect */}
      <div className="absolute inset-0 rounded-lg shadow-[0_0_10px_rgba(180,160,100,0.4),inset_0_0_8px_rgba(180,160,100,0.2)] z-30 pointer-events-none"></div>

      {/* Add keyframes for animations */}
      <style jsx global>{`
        @keyframes crystallize {
          0% {
            opacity: 0.2;
            transform: scale(0.8);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.1);
          }
          100% {
            opacity: 0.2;
            transform: scale(0.8);
          }
        }
      `}</style>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function DustParticleCard({
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

    // Dust particle parameters
    const particles = [];
    const particleCount = 80;

    // Light beam parameters
    const beamCenterX = canvas.width * 0.5;
    const beamWidth = canvas.width * 0.7;

    // Animation timing
    let lastTime = 0;
    let elapsedTime = 0;

    class DustParticle {
      constructor() {
        this.reset();
      }

      reset() {
        // Position
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        // Distance from beam center determines visibility
        const distFromCenter = Math.abs(this.x - beamCenterX);
        const beamFactor = 1 - Math.min(1, distFromCenter / (beamWidth / 2));

        // Size and appearance - smaller particles with higher opacity in beam center
        this.size = Math.random() * 2 + 0.5;
        this.baseOpacity = Math.random() * 0.15 * beamFactor + 0.03;
        this.opacity = this.baseOpacity;

        // Movement
        this.speedX = (Math.random() - 0.5) * 0.05; // Very slow horizontal drift
        this.speedY = -Math.random() * 0.07 - 0.02; // Slow upward drift

        // Slight wobble
        this.wobbleAmplitude = Math.random() * 0.2;
        this.wobbleSpeed = Math.random() * 0.0002 + 0.0001;
        this.wobbleOffset = Math.random() * Math.PI * 2;

        // Color variations of warm light
        this.hue = Math.random() * 15 + 40; // 40-55, golden to amber
        this.saturation = Math.random() * 20 + 10; // 10-30%
        this.lightness = Math.random() * 30 + 70; // 70-100%

        // Sparkle effect
        this.sparkleSpeed = Math.random() * 0.001 + 0.0005;
        this.sparkleOffset = Math.random() * Math.PI * 2;
      }

      update(deltaTime) {
        // Basic movement
        this.x += this.speedX * deltaTime;
        this.y += this.speedY * deltaTime;

        // Add slight wobble
        this.x +=
          Math.sin(elapsedTime * this.wobbleSpeed + this.wobbleOffset) *
          this.wobbleAmplitude;

        // Calculate beam intensity based on distance from center
        const distFromCenter = Math.abs(this.x - beamCenterX);
        const beamFactor = 1 - Math.min(1, distFromCenter / (beamWidth / 2));

        // Vary opacity based on position in beam
        const sparkle =
          0.5 +
          0.5 * Math.sin(elapsedTime * this.sparkleSpeed + this.sparkleOffset);
        this.opacity = this.baseOpacity * beamFactor * sparkle;

        // Reset when particle leaves top of screen or gets too far from beam
        if (this.y < -10 || beamFactor < 0.05) {
          this.reset();
          this.y = canvas.height + 5;
        }
      }

      draw() {
        if (!ctx) return;

        // Skip rendering very faint particles
        if (this.opacity < 0.01) return;

        // Draw dust particle with glow
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
          `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.opacity})`
        );
        glow.addColorStop(
          1,
          `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, 0)`
        );

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx.fill();

        // Draw particle core
        ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.opacity * 1.5})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      const particle = new DustParticle();
      // Distribute particles throughout the canvas initially
      particle.y = Math.random() * canvas.height;
      particles.push(particle);
    }

    // Animation loop
    const animate = (timestamp) => {
      // Calculate delta time
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      elapsedTime += deltaTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw beam of light
      const drawBeam = () => {
        // Slowly vary beam intensity and width
        const pulseIntensity = 0.3 + 0.2 * Math.sin(elapsedTime * 0.0005);
        const beamHeight = canvas.height * 1.5;

        // Create vertical light beam gradient
        const beamGradient = ctx.createLinearGradient(0, 0, 0, beamHeight);
        beamGradient.addColorStop(
          0,
          `rgba(255, 230, 180, ${0.03 * pulseIntensity})`
        );
        beamGradient.addColorStop(
          0.5,
          `rgba(255, 210, 140, ${0.02 * pulseIntensity})`
        );
        beamGradient.addColorStop(
          1,
          `rgba(255, 180, 100, ${0.01 * pulseIntensity})`
        );

        // Create horizontal light beam gradient for falloff
        const beamFalloff = ctx.createRadialGradient(
          beamCenterX,
          canvas.height * 0.5,
          0,
          beamCenterX,
          canvas.height * 0.5,
          beamWidth / 2
        );
        beamFalloff.addColorStop(
          0,
          `rgba(255, 255, 255, ${0.2 * pulseIntensity})`
        );
        beamFalloff.addColorStop(
          0.6,
          `rgba(255, 255, 255, ${0.1 * pulseIntensity})`
        );
        beamFalloff.addColorStop(1, "rgba(255, 255, 255, 0)");

        // Draw beam with gradients
        ctx.globalCompositeOperation = "lighter";

        ctx.fillStyle = beamGradient;
        ctx.fillRect(beamCenterX - beamWidth / 2, -10, beamWidth, beamHeight);

        ctx.fillStyle = beamFalloff;
        ctx.fillRect(beamCenterX - beamWidth / 2, -10, beamWidth, beamHeight);

        ctx.globalCompositeOperation = "source-over";
      };

      // Draw beam
      drawBeam();

      // Update and draw particles
      particles.forEach((particle) => {
        particle.update(deltaTime);
        particle.draw();
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
      <div className="absolute inset-0 bg-neutral-900 z-0"></div>

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

          {/* Warm overlay */}
          <div
            className="absolute inset-0 opacity-10 mix-blend-overlay"
            style={{
              background:
                "radial-gradient(circle at 50% 30%, rgba(255,210,150,0.15), rgba(50,30,10,0.15))",
            }}
          ></div>
        </div>
      </div>

      {/* Subtle border */}
      <div className="absolute inset-0 border border-amber-700/10 rounded-lg pointer-events-none z-30"></div>

      {/* Corners */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-amber-600/15 rounded-tl-lg z-30"></div>
      <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-amber-600/15 rounded-tr-lg z-30"></div>
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-amber-600/15 rounded-bl-lg z-30"></div>
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-amber-600/15 rounded-br-lg z-30"></div>

      {/* Light symbol */}
      <div className="absolute bottom-1.5 right-1.5 w-4 h-4 flex items-center justify-center z-40 opacity-50">
        <svg
          viewBox="0 0 24 24"
          className="w-3 h-3 text-amber-400/60 fill-current"
        >
          <path d="M3.55,18.54L4.96,19.95L6.76,18.16L5.34,16.74M11,22.45C11.32,22.45 13,22.45 13,22.45V19.5H11M12,5.5A6,6 0 0,0 6,11.5A6,6 0 0,0 12,17.5A6,6 0 0,0 18,11.5C18,8.18 15.31,5.5 12,5.5M20,12.5H23V10.5H20M17.24,18.16L19.04,19.95L20.45,18.54L18.66,16.74M20.45,4.46L19.04,3.05L17.24,4.84L18.66,6.26M13,0.55V3.5H11V0.55M4,10.5H1V12.5H4M6.76,4.84L4.96,3.05L3.55,4.46L5.34,6.26L6.76,4.84Z" />
        </svg>
      </div>

      {/* Subtle inner glow */}
      <div className="absolute inset-0 rounded-lg shadow-[inset_0_0_20px_rgba(255,200,100,0.05)] z-30 pointer-events-none"></div>
    </div>
  );
}

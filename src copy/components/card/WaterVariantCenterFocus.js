"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function WaterVariantCenterFocus({
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

    // Center of the canvas
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Radius of the circular water area
    const waterRadius = canvas.width * 0.35;

    // Bubbles/water particles inside the central area
    const bubbles = [];
    const bubbleCount = 20;

    class Bubble {
      constructor() {
        this.reset();
      }

      reset() {
        // Position within circular area in center
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * waterRadius * 0.8;
        this.x = centerX + Math.cos(angle) * distance;
        this.y = centerY + Math.sin(angle) * distance;

        // Size and appearance
        this.size = Math.random() * 2 + 0.8;
        this.opacity = Math.random() * 0.4 + 0.1;

        // Movement
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.speedY = (Math.random() - 0.5) * 0.2;
        this.amplitude = Math.random() * 0.5 + 0.2;
        this.frequency = Math.random() * 0.02 + 0.01;
        this.phase = Math.random() * Math.PI * 2;

        // Life properties
        this.maxLife = 100 + Math.random() * 100;
        this.life = this.maxLife;
      }

      update() {
        // Calculate distance from center
        const dx = this.x - centerX;
        const dy = this.y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Move in a circular pattern within the water area
        this.x += this.speedX;
        this.y += this.speedY;

        // Add gentle oscillation
        this.x +=
          Math.sin(Date.now() * this.frequency + this.phase) * this.amplitude;
        this.y +=
          Math.cos(Date.now() * this.frequency + this.phase) * this.amplitude;

        // Reduce life
        this.life--;

        // Keep bubbles inside water radius with a soft boundary
        if (distance > waterRadius * 0.8) {
          // Push back toward center
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * 0.2;
          this.y -= Math.sin(angle) * 0.2;
        }

        // Calculate opacity based on life and distance from center
        const lifeRatio = this.life / this.maxLife;
        const distanceRatio = 1 - distance / waterRadius;
        this.opacity = (Math.random() * 0.2 + 0.1) * lifeRatio * distanceRatio;

        // Reset when life is over
        if (this.life <= 0) {
          this.reset();
        }
      }

      draw() {
        if (!ctx) return;

        // Water bubble with blue tint
        ctx.fillStyle = `rgba(120, 180, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // Light reflection highlight
        const highlightSize = this.size * 0.4;
        const highlightX = this.x - this.size * 0.3;
        const highlightY = this.y - this.size * 0.3;

        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.8})`;
        ctx.beginPath();
        ctx.arc(highlightX, highlightY, highlightSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Water ripple effect
    class Ripple {
      constructor() {
        this.reset();
      }

      reset() {
        // Position within central area
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * waterRadius * 0.7;
        this.x = centerX + Math.cos(angle) * distance;
        this.y = centerY + Math.sin(angle) * distance;

        // Ripple properties
        this.radius = 1;
        this.maxRadius = Math.random() * 10 + 5;
        this.growSpeed = Math.random() * 0.2 + 0.05;
        this.opacity = Math.random() * 0.3 + 0.1;
        this.thickness = Math.random() * 1 + 0.5;
      }

      update() {
        // Grow ripple
        this.radius += this.growSpeed;

        // Fade out as it expands
        this.opacity *= 0.98;

        // Reset when too large or faded
        if (this.radius > this.maxRadius || this.opacity < 0.01) {
          this.reset();
        }
      }

      draw() {
        if (!ctx) return;

        ctx.strokeStyle = `rgba(120, 200, 255, ${this.opacity})`;
        ctx.lineWidth = this.thickness;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // Initialize bubbles
    for (let i = 0; i < bubbleCount; i++) {
      const bubble = new Bubble();
      // Stagger initial life
      bubble.life = Math.random() * bubble.maxLife;
      bubbles.push(bubble);
    }

    // Initialize ripples
    const ripples = [];
    const rippleCount = 5;

    for (let i = 0; i < rippleCount; i++) {
      const ripple = new Ripple();
      ripple.radius = Math.random() * ripple.maxRadius; // Stagger initial size
      ripples.push(ripple);
    }

    // Periodically create new ripples
    const createNewRipple = () => {
      // Replace oldest ripple
      if (ripples.length > rippleCount - 1) {
        ripples.shift();
      }
      ripples.push(new Ripple());
    };

    const rippleInterval = setInterval(createNewRipple, 1000);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw water area glow
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        waterRadius
      );
      gradient.addColorStop(0, "rgba(0, 100, 200, 0.1)");
      gradient.addColorStop(0.7, "rgba(0, 150, 255, 0.05)");
      gradient.addColorStop(1, "rgba(0, 100, 200, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, waterRadius, 0, Math.PI * 2);
      ctx.fill();

      // Draw ripples
      ripples.forEach((ripple) => {
        ripple.update();
        ripple.draw();
      });

      // Draw bubbles
      bubbles.forEach((bubble) => {
        bubble.update();
        bubble.draw();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      clearInterval(rippleInterval);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-[104px] h-[104px] max-w-md aspect-[4/4] rounded-lg overflow-hidden transition-all duration-300 hover:scale-105"
    >
      {/* Background base */}
      <div className="absolute inset-0 bg-slate-950 z-0"></div>

      {/* Deep water background highlights */}
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <div className="w-3/5 h-3/5 rounded-full bg-blue-950/20 blur-md"></div>
      </div>

      {/* Subtle deep water radial gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-blue-900/10 via-blue-950/5 to-transparent z-0"></div>

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

          {/* Water refraction overlay */}
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-blue-950/10 to-transparent mix-blend-overlay"></div>

          {/* Subtle center vignette for depth */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2/3 h-2/3 rounded-full bg-blue-700/5 blur-md mix-blend-screen"></div>
          </div>
        </div>
      </div>

      {/* Border design */}
      <div className="absolute inset-0 border border-blue-900/30 rounded-lg pointer-events-none z-30"></div>

      {/* Accent lines */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-700/40 to-transparent z-30"></div>
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-700/40 to-transparent z-30"></div>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function WaterVariantWhirlpool({
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

    // Vortex center
    const vortexX = canvas.width / 2;
    const vortexY = canvas.height * 0.55; // Slightly below center

    // Vortex properties
    const vortexRadius = canvas.width * 0.35;
    const vortexIntensity = 0.3;

    // Spiral water particles
    const particles = [];
    const particleCount = 40;

    class VortexParticle {
      constructor() {
        this.reset();
      }

      reset() {
        // Random position on the circle's edge
        const angle = Math.random() * Math.PI * 2;
        this.x = vortexX + Math.cos(angle) * vortexRadius;
        this.y = vortexY + Math.sin(angle) * vortexRadius;

        // Initial properties
        this.angle = angle;
        this.radius = vortexRadius;
        this.speed = Math.random() * 0.02 + 0.01;
        this.size = Math.random() * 1.8 + 0.5;
        this.opacity = Math.random() * 0.3 + 0.1;

        // Spiral inward with varied rates
        this.radialSpeed = (Math.random() * 0.3 + 0.2) * 0.5;

        // Color variations
        const blueVariants = [
          `rgba(30, 120, 255, ${this.opacity})`,
          `rgba(0, 100, 200, ${this.opacity})`,
          `rgba(50, 150, 255, ${this.opacity})`,
        ];
        this.color =
          blueVariants[Math.floor(Math.random() * blueVariants.length)];
      }

      update() {
        // Rotate around center
        this.angle += this.speed;

        // Spiral inward
        this.radius -= this.radialSpeed;

        // Apply vortex effect - rotate faster as particles get closer to center
        const distanceFactor = Math.max(0.1, this.radius / vortexRadius);
        const rotationSpeed =
          this.speed * (1 + vortexIntensity / distanceFactor);
        this.angle += rotationSpeed;

        // Update position
        this.x = vortexX + Math.cos(this.angle) * this.radius;
        this.y = vortexY + Math.sin(this.angle) * this.radius;

        // Opacity increases as particles move toward center
        this.opacity = Math.min(0.6, 0.1 + (1 - distanceFactor) * 0.4);

        // Update color
        this.color = this.color.replace(/[\d\.]+\)$/, `${this.opacity})`);

        // Reset when reaching center
        if (this.radius < 2) {
          this.reset();
        }
      }

      draw() {
        if (!ctx) return;

        // Draw water particle
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // Draw trail
        if (this.radius < vortexRadius * 0.8) {
          const trailLength = (1 - this.radius / vortexRadius) * 0.15;
          const trailAngle = this.angle - trailLength;

          const trailX = vortexX + Math.cos(trailAngle) * this.radius;
          const trailY = vortexY + Math.sin(trailAngle) * this.radius;

          ctx.strokeStyle = this.color.replace(
            /[\d\.]+\)$/,
            `${this.opacity * 0.5})`
          );
          ctx.lineWidth = this.size * 0.8;
          ctx.beginPath();
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(trailX, trailY);
          ctx.stroke();
        }
      }
    }

    // Circle boundary rings
    const drawVortexBoundary = () => {
      if (!ctx) return;

      // Outer ring
      ctx.strokeStyle = "rgba(0, 120, 200, 0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(vortexX, vortexY, vortexRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Create glow effect
      ctx.shadowColor = "rgba(0, 150, 255, 0.3)";
      ctx.shadowBlur = 5;
      ctx.strokeStyle = "rgba(0, 150, 255, 0.08)";
      ctx.beginPath();
      ctx.arc(vortexX, vortexY, vortexRadius - 1, 0, Math.PI * 2);
      ctx.stroke();

      // Reset shadow
      ctx.shadowBlur = 0;

      // Inner rings (spiral guide lines)
      for (let i = 0.8; i > 0.1; i -= 0.2) {
        const alpha = 0.05 + (1 - i) * 0.05;
        ctx.strokeStyle = `rgba(0, 150, 255, ${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(vortexX, vortexY, vortexRadius * i, 0, Math.PI * 2);
        ctx.stroke();
      }
    };

    // Draw swirling patterns
    const drawSwirls = (time) => {
      if (!ctx) return;

      // Draw spiral lines
      const spiralCount = 3;

      for (let s = 0; s < spiralCount; s++) {
        const offset = (s / spiralCount) * Math.PI * 2;
        const rotation = time * 0.0005;

        ctx.beginPath();

        for (let r = 0; r < vortexRadius; r += 0.5) {
          const angle = r * 0.15 + offset + rotation;
          const x = vortexX + Math.cos(angle) * r;
          const y = vortexY + Math.sin(angle) * r;

          if (r === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        const gradient = ctx.createLinearGradient(
          vortexX - vortexRadius,
          vortexY - vortexRadius,
          vortexX + vortexRadius,
          vortexY + vortexRadius
        );
        gradient.addColorStop(0, "rgba(0, 100, 200, 0.01)");
        gradient.addColorStop(0.5, "rgba(0, 150, 255, 0.08)");
        gradient.addColorStop(1, "rgba(0, 100, 200, 0.01)");

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    };

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      const particle = new VortexParticle();
      // Stagger initial positions
      particle.radius = vortexRadius * (0.2 + Math.random() * 0.8);
      particle.angle = Math.random() * Math.PI * 2;
      particle.x = vortexX + Math.cos(particle.angle) * particle.radius;
      particle.y = vortexY + Math.sin(particle.angle) * particle.radius;
      particles.push(particle);
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw vortex background
      const gradient = ctx.createRadialGradient(
        vortexX,
        vortexY,
        0,
        vortexX,
        vortexY,
        vortexRadius
      );
      gradient.addColorStop(0, "rgba(0, 120, 255, 0.15)");
      gradient.addColorStop(0.7, "rgba(0, 80, 200, 0.05)");
      gradient.addColorStop(1, "rgba(0, 50, 150, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(vortexX, vortexY, vortexRadius, 0, Math.PI * 2);
      ctx.fill();

      // Draw swirls
      drawSwirls(Date.now());

      // Draw vortex boundary
      drawVortexBoundary();

      // Draw particles
      particles.forEach((particle) => {
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
      {/* Dark blue background */}
      <div className="absolute inset-0 bg-slate-950 z-0"></div>

      {/* Deep ocean gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950 via-blue-950 to-slate-950 z-0"></div>

      {/* Centered vortex glow */}
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <div className="absolute w-3/5 h-3/5 bg-blue-900/5 rounded-full blur-md"></div>
      </div>

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

          {/* Very subtle vignette */}
          <div className="absolute inset-0 shadow-[inset_0_0_10px_rgba(0,0,0,0.3)]"></div>

          {/* Whirlpool overlay effect */}
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-blue-900/10 to-blue-950/20 mix-blend-overlay"></div>
        </div>
      </div>

      {/* Border with water-like properties */}
      <div className="absolute inset-0 border border-blue-900/40 rounded-lg pointer-events-none z-30"></div>

      {/* Water ripple accents */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent z-30"></div>
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent z-30"></div>
    </div>
  );
}

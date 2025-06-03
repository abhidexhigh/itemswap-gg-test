"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function LightVariantCard2({
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

    // Light particles - smaller and more subtle
    const particles = [];
    const particleCount = 30;

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1 + 0.3; // Smaller size
        this.speedX = (Math.random() - 0.5) * 0.2; // Slower
        this.speedY = (Math.random() - 0.5) * 0.2; // Slower

        // Softer light colors with lower opacity
        const colors = [
          `rgba(255, 215, 0, ${Math.random() * 0.3 + 0.1})`, // gold
          `rgba(255, 255, 240, ${Math.random() * 0.3 + 0.1})`, // ivory
          `rgba(255, 248, 220, ${Math.random() * 0.3 + 0.1})`, // cornsilk
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];

        // Pulsing properties
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulseAmount = Math.random() * 0.3 + 0.7;
        this.pulseOffset = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Pulse size for gentle glow effect
        const pulse = Math.sin(Date.now() * this.pulseSpeed + this.pulseOffset);
        this.currentSize = this.size * (1 + pulse * 0.2);

        // Wrap around edges
        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.currentSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      const particle = new Particle();
      particles.push(particle);
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

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
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 pointer-events-none"
      />

      {/* Light themed background - more neutral, less bright */}
      <div className="absolute inset-0 bg-neutral-900 z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-800 via-neutral-900 to-amber-950/30 z-0"></div>

      {/* Very subtle glow effect */}
      <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-amber-800/10 to-transparent z-0"></div>

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

          {/* Extremely subtle light vignette that enhances rather than obscures */}
          <div className="absolute inset-0 shadow-[inset_0_0_10px_rgba(255,215,0,0.15)]"></div>
        </div>
      </div>

      {/* Elegant border with golden accent */}
      <div className="absolute inset-0 border border-amber-700/50 rounded-lg pointer-events-none z-30"></div>

      {/* Golden accent line at bottom (more subtle) */}
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-amber-900/60 via-amber-500/80 to-amber-900/60 z-30"></div>

      {/* Light rays from corners - very subtle */}
      <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-amber-500/10 to-transparent z-30"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 bg-gradient-to-tr from-amber-500/10 to-transparent z-30"></div>
    </div>
  );
}

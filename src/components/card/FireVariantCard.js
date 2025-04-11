"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function FireVariantCard({
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

    // Flame particles
    const flames = [];
    const flameCount = 35;

    class Flame {
      constructor() {
        // Start flames at the bottom of the card
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.size = Math.random() * 2 + 0.8;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = -(Math.random() * 0.8 + 0.4); // Negative to move upward

        // Fire colors
        const colors = [
          `rgba(255, 0, 0, ${Math.random() * 0.6 + 0.2})`, // red
          `rgba(255, 69, 0, ${Math.random() * 0.6 + 0.2})`, // orange-red
          `rgba(255, 140, 0, ${Math.random() * 0.6 + 0.2})`, // dark orange
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];

        // Flame life properties
        this.maxLife = 80 + Math.random() * 60;
        this.life = this.maxLife;
      }

      update() {
        // Move upward with flickering horizontal motion
        this.x +=
          this.speedX + Math.sin(Date.now() * 0.01 + this.y * 0.1) * 0.1;
        this.y += this.speedY;

        // Decrease life and size as flame rises
        this.life--;
        this.size *= 0.995;

        // Fade out as life decreases
        this.opacity = this.life / this.maxLife;

        // Reset flame when it burns out
        if (this.life <= 0 || this.size < 0.5) {
          this.x = Math.random() * canvas.width;
          this.y = canvas.height;
          this.size = Math.random() * 2 + 0.8;
          this.life = this.maxLife;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;

        // Draw flame as a small upward triangle
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.size, this.y + this.size * 1.5);
        ctx.lineTo(this.x + this.size, this.y + this.size * 1.5);
        ctx.closePath();
        ctx.fill();

        // Add a glowing center
        const gradient = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.size
        );
        gradient.addColorStop(0, "rgba(255, 255, 0, 0.8)");
        gradient.addColorStop(1, "rgba(255, 0, 0, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 1;
      }
    }

    // Initialize flames
    for (let i = 0; i < flameCount; i++) {
      const flame = new Flame();
      // Stagger initial positions
      flame.y = canvas.height - Math.random() * 20;
      flame.life = Math.random() * flame.maxLife;
      flames.push(flame);
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      flames.forEach((flame) => {
        flame.update();
        flame.draw();
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

      {/* Fire themed background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-red-950 to-orange-950 z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-transparent to-yellow-500/20 z-0"></div>

      {/* Heat distortion effect */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-red-500/30 to-transparent z-5"></div>
      <div className="absolute -bottom-10 -left-10 -right-10 h-20 bg-red-600/30 blur-xl z-5 animate-pulse"></div>

      {/* Card content */}
      <div className="relative z-20 h-full flex flex-col">
        {/* Image container with clear center */}
        <div className="relative flex-1 overflow-hidden">
          <Image
            src={image}
            alt={name || "Character"}
            fill
            className="object-cover object-center"
            priority
          />

          {/* Keep center clear for character visibility */}
          <div className="absolute inset-0 border-[5px] border-transparent"></div>
          <div className="absolute inset-x-0 bottom-0 h-1/5 bg-gradient-to-t from-red-900/50 to-transparent"></div>
        </div>
      </div>

      {/* Fiery border */}
      <div className="absolute inset-0 border-2 border-red-600/80 rounded-lg pointer-events-none z-30"></div>
      <div className="absolute inset-0 shadow-[0_0_12px_rgba(255,0,0,0.6)] rounded-lg z-30"></div>

      {/* Fire variant symbol */}
      <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 border border-red-400 z-40 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="white"
          className="w-3 h-3"
        >
          <path
            fillRule="evenodd"
            d="M13.5 4.938a7 7 0 11-9.006 1.737c.202-.257.59-.218.793.039.278.352.594.672.943.954.332.269.786-.049.773-.476a5.977 5.977 0 01.572-2.759 6.026 6.026 0 012.486-2.665c.247-.14.55-.016.677.238A6.967 6.967 0 0013.5 4.938zM14 12a4 4 0 01-4 4c-1.913 0-3.52-1.398-3.91-3.182-.093-.429.44-.643.814-.413a4.043 4.043 0 001.601.564c.303.038.531-.24.51-.544a5.975 5.975 0 011.315-4.192.447.447 0 01.685.172A4.978 4.978 0 0114 12z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
}

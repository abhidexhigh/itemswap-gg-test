"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function FireEdgeCard({
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

    // Ember particle system for fire effect
    const embers = [];
    const emberCount = 35;

    class Ember {
      constructor() {
        // Start embers at the bottom
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 10;

        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = -(Math.random() * 1 + 0.5); // Negative to move upward

        // Fire colors: reds, oranges, yellows
        const colors = [
          `rgba(255, 69, 0, ${Math.random() * 0.7 + 0.3})`, // red-orange
          `rgba(255, 140, 0, ${Math.random() * 0.7 + 0.3})`, // dark orange
          `rgba(255, 215, 0, ${Math.random() * 0.7 + 0.3})`, // gold
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];

        // Life properties
        this.maxLife = 100 + Math.random() * 150;
        this.life = this.maxLife;
      }

      update() {
        // Move upward with slight horizontal drift
        this.x += this.speedX;
        this.y += this.speedY;

        // Decrease life
        this.life--;

        // Fade out as life decreases
        this.opacity = this.life / this.maxLife;

        // Regenerate ember when it disappears
        if (this.life <= 0) {
          this.x = Math.random() * canvas.width;
          this.y = canvas.height + Math.random() * 10;
          this.life = this.maxLife;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    // Initialize embers
    for (let i = 0; i < emberCount; i++) {
      embers.push(new Ember());
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      embers.forEach((ember) => {
        ember.update();
        ember.draw();
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
      <div className="absolute inset-0 bg-gradient-to-b from-black via-orange-950/80 to-red-950/80 z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-transparent to-orange-500/10 z-0"></div>

      {/* Glow effects */}
      <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-orange-500/30 to-transparent z-5"></div>
      <div className="absolute -bottom-10 -left-10 -right-10 h-20 bg-orange-600/20 blur-xl z-5 animate-pulse"></div>

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
          <div className="absolute inset-0 bg-gradient-to-t from-red-950/40 via-transparent to-transparent"></div>
        </div>
      </div>

      {/* Border effects */}
      <div className="absolute inset-0 border-2 border-orange-600/50 rounded-lg pointer-events-none z-30"></div>
      <div className="absolute inset-0 shadow-[0_0_10px_rgba(255,140,0,0.4)] rounded-lg pointer-events-none z-30"></div>
    </div>
  );
}

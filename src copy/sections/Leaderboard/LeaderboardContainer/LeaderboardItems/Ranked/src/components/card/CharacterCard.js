"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function CharacterCard({
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

    // Set canvas size to match container
    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Particle system
    const particles = [];
    const particleCount = 50;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.color = `rgba(255, 215, 0, ${Math.random() * 0.5 + 0.2})`;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

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
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
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
      className="relative w-[104px] h-[104px] max-w-md aspect-[4/4] rounded-lg overflow-hidden"
    >
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 pointer-events-none"
      />

      {/* Background lighting effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 via-transparent to-amber-600/30 z-0"></div>
      <div className="absolute -inset-10 bg-amber-500/10 blur-3xl z-0 animate-pulse"></div>

      {/* Card content */}
      <div className="relative z-20 h-full flex flex-col">
        {/* Image container with border */}
        <div className="relative flex-1 overflow-hidden border-b-2 border-amber-500">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            priority
          />

          {/* Lighting overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-transparent to-amber-600/20"></div>
        </div>
      </div>

      {/* Border effect */}
      <div className="absolute inset-0 border-2 border-amber-500/50 rounded-lg pointer-events-none z-30"></div>
      <div className="absolute inset-0 border border-amber-300/20 rounded-lg pointer-events-none z-30"></div>
    </div>
  );
}

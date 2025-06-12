"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function LightVariantCard({
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

    // Light particles
    const particles = [];
    const particleCount = 50;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;

        // Golden light colors
        const colors = [
          `rgba(255, 215, 0, ${Math.random() * 0.7 + 0.3})`, // gold
          `rgba(255, 255, 240, ${Math.random() * 0.7 + 0.3})`, // ivory
          `rgba(255, 248, 220, ${Math.random() * 0.7 + 0.3})`, // cornsilk
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Add gentle floating motion
        this.y += Math.sin(Date.now() * 0.001 + this.x * 0.1) * 0.1;

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
      className="relative w-[104px] h-[104px] max-w-md aspect-[4/4] rounded-lg overflow-hidden transition-all duration-300 hover:scale-105"
    >
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 pointer-events-none"
      />

      {/* Light themed background */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-50 via-amber-100 to-amber-200 z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-amber-300/20 z-0"></div>

      {/* Radial glow */}
      <div className="absolute inset-0 bg-radial-gradient z-0"></div>
      <div className="absolute -inset-10 bg-yellow-400/10 blur-3xl z-0 animate-pulse"></div>

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

          {/* Light aura that doesn't obscure character */}
          <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/10 via-transparent to-yellow-500/10"></div>
        </div>
      </div>

      {/* Divine border */}
      <div className="absolute inset-0 border-2 border-yellow-400/70 rounded-lg pointer-events-none z-30"></div>

      {/* Corner light flares */}
      <div className="absolute top-0 left-0 w-5 h-5 bg-gradient-to-br from-yellow-300 to-transparent rounded-tl-lg z-30"></div>
      <div className="absolute top-0 right-0 w-5 h-5 bg-gradient-to-bl from-yellow-300 to-transparent rounded-tr-lg z-30"></div>
      <div className="absolute bottom-0 left-0 w-5 h-5 bg-gradient-to-tr from-yellow-300 to-transparent rounded-bl-lg z-30"></div>
      <div className="absolute bottom-0 right-0 w-5 h-5 bg-gradient-to-tl from-yellow-300 to-transparent rounded-br-lg z-30"></div>

      {/* Light variant symbol */}
      <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-yellow-400 border border-yellow-600 z-40 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="white"
          className="w-3 h-3"
        >
          <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.06l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM14.596 15.657a.75.75 0 001.06-1.06l-1.06-1.061a.75.75 0 10-1.06 1.06l1.06 1.06zM5.404 6.464a.75.75 0 001.06-1.06l-1.06-1.06a.75.75 0 10-1.061 1.06l1.06 1.06z" />
        </svg>
      </div>
    </div>
  );
}

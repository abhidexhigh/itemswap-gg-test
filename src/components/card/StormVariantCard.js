"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function StormVariantCard({
  image,
  name,
  title,
  description,
  stats,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [lightningFlash, setLightningFlash] = useState(false);

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

    // Cloud/mist particles
    const clouds = [];
    const cloudCount = 25;

    class Cloud {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 2;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.3;

        // Cloud colors - grays with a slight blue tint
        const alpha = Math.random() * 0.2 + 0.1;
        const colors = [
          `rgba(220, 220, 255, ${alpha})`, // light blue-gray
          `rgba(200, 200, 220, ${alpha})`, // medium blue-gray
          `rgba(180, 180, 200, ${alpha})`, // dark blue-gray
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
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

    // Lightning bolt generator
    const createLightning = () => {
      if (!ctx) return;

      // Random starting point at the top
      const startX = Math.random() * canvas.width;
      const startY = 0;

      // Generate lightning path
      let x = startX;
      let y = startY;

      // Lightning bolt properties
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
      ctx.lineWidth = 1;

      // Draw zigzag path
      const segments = 5 + Math.floor(Math.random() * 5);
      for (let i = 0; i < segments; i++) {
        // Calculate next point with zigzag pattern
        const nextX = x + (Math.random() * 20 - 10);
        const nextY = y + canvas.height / segments;

        ctx.lineTo(nextX, nextY);

        x = nextX;
        y = nextY;
      }

      ctx.stroke();

      // Add glow effect
      ctx.shadowColor = "rgba(100, 200, 255, 0.8)";
      ctx.shadowBlur = 15;
      ctx.stroke();

      // Reset shadow
      ctx.shadowBlur = 0;
    };

    // Initialize cloud particles
    for (let i = 0; i < cloudCount; i++) {
      clouds.push(new Cloud());
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw cloud particles
      clouds.forEach((cloud) => {
        cloud.update();
        cloud.draw();
      });

      // Randomly trigger lightning
      if (Math.random() < 0.01) {
        createLightning();
        setLightningFlash(true);
        setTimeout(() => setLightningFlash(false), 100);
      }

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
      className={`relative w-[104px] h-[104px] max-w-md aspect-[4/4] rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 ${
        lightningFlash ? "brightness-125" : ""
      }`}
    >
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 pointer-events-none"
      />

      {/* Storm themed background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-blue-950 to-slate-950 z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-800/10 via-transparent to-blue-500/10 z-0"></div>

      {/* Storm cloud effects */}
      <div
        className="absolute inset-0 mix-blend-overlay opacity-30 z-5"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 0%, rgba(100, 150, 255, 0.3), rgba(0, 0, 0, 0.2))",
        }}
      ></div>

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

          {/* Lightning flash overlay */}
          <div
            className={`absolute inset-0 bg-blue-500/10 transition-opacity duration-100 ${
              lightningFlash ? "opacity-60" : "opacity-0"
            }`}
          ></div>

          {/* Ensure character visibility with a subtle vignette */}
          <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,0.4)]"></div>
        </div>
      </div>

      {/* Electric border */}
      <div className="absolute inset-0 border-2 border-blue-500/70 rounded-lg pointer-events-none z-30"></div>

      {/* Lightning corner accents */}
      <div className="absolute top-0 right-0 w-10 h-6 z-30 overflow-hidden">
        <div className="absolute w-[3px] h-10 bg-blue-400 rotate-45 translate-x-3 -translate-y-2"></div>
      </div>
      <div className="absolute bottom-0 left-0 w-10 h-6 z-30 overflow-hidden">
        <div className="absolute w-[3px] h-10 bg-blue-400 rotate-45 translate-x-3 translate-y-2"></div>
      </div>

      {/* Storm variant symbol */}
      <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-blue-600 border border-blue-400 z-40 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="white"
          className="w-3 h-3"
        >
          <path d="M11.983 1.907a.75.75 0 00-1.292-.657l-8.5 9.5A.75.75 0 002.75 12h6.572l-1.305 6.093a.75.75 0 001.292.657l8.5-9.5A.75.75 0 0017.25 8h-6.572l1.305-6.093z" />
        </svg>
      </div>
    </div>
  );
}

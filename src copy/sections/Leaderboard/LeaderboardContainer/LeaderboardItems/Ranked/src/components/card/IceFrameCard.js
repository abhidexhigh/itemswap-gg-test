"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function IceFrameCard({
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

    // Snowflake particles
    const snowflakes = [];
    const snowflakeCount = 30;

    class Snowflake {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = Math.random() * 0.3 + 0.1;
        this.opacity = Math.random() * 0.7 + 0.3;
        this.color = `rgba(255, 255, 255, ${this.opacity})`;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Sway effect
        this.x += Math.sin(this.y * 0.05) * 0.1;

        // Reset when off screen
        if (this.y > canvas.height) {
          this.y = 0;
          this.x = Math.random() * canvas.width;
        }
        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Initialize snowflakes
    for (let i = 0; i < snowflakeCount; i++) {
      snowflakes.push(new Snowflake());
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      snowflakes.forEach((flake) => {
        flake.update();
        flake.draw();
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

      {/* Ice themed background */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-900 via-blue-950/80 to-sky-950/90 z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-sky-700/5 via-transparent to-white/10 z-0"></div>

      {/* Frost effects */}
      <div className="absolute top-0 left-0 right-0 h-1/5 bg-gradient-to-b from-white/20 to-transparent z-5"></div>
      <div className="absolute -top-10 -left-10 -right-10 h-20 bg-white/10 blur-xl z-5"></div>

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

          {/* Frosty frame that doesn't obscure the character */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-sky-200/10"></div>
          <div className="absolute inset-0 border-[5px] border-white/10 pointer-events-none"></div>
        </div>
      </div>

      {/* Ice crystal border */}
      <div className="absolute inset-0 border-2 border-sky-200/30 rounded-lg pointer-events-none z-30"></div>
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent z-40"></div>
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-white/60 to-transparent z-40"></div>
      <div className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-transparent via-white/60 to-transparent z-40"></div>
      <div className="absolute inset-y-0 right-0 w-[2px] bg-gradient-to-b from-transparent via-white/60 to-transparent z-40"></div>
    </div>
  );
}

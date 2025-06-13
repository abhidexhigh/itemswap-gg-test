"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function DarkVariantCard({
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

    // Shadow particles
    const particles = [];
    const particleCount = 60;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;

        // Dark, shadowy colors
        const colors = [
          `rgba(75, 0, 130, ${Math.random() * 0.5 + 0.1})`, // indigo
          `rgba(48, 25, 52, ${Math.random() * 0.5 + 0.1})`, // dark purple
          `rgba(25, 25, 25, ${Math.random() * 0.5 + 0.1})`, // near black
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];

        // Twinkle properties
        this.alpha = Math.random() * 0.5 + 0.1;
        this.twinkleSpeed = Math.random() * 0.01 + 0.005;
        this.twinkleDirection = Math.random() > 0.5 ? 1 : -1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Twinkle effect - fade in and out
        this.alpha += this.twinkleSpeed * this.twinkleDirection;
        if (this.alpha > 0.6 || this.alpha < 0.1) {
          this.twinkleDirection *= -1;
        }

        // Wrap around edges
        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        if (!ctx) return;
        const color = this.color.replace(/[\d\.]+\)$/g, `${this.alpha})`);
        ctx.fillStyle = color;
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

      {/* Dark themed background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-purple-950 to-gray-900 z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-indigo-900/20 z-0"></div>

      {/* Dark energy effect */}
      <div
        className="absolute inset-0 mix-blend-multiply opacity-30 z-5"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, rgba(75, 0, 130, 0.4), rgba(0, 0, 0, 0.2))",
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

          {/* Dark aura that enhances character visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-purple-950/40 via-transparent to-purple-950/30"></div>
          <div className="absolute inset-0 shadow-[inset_0_0_15px_rgba(128,0,128,0.3)]"></div>
        </div>
      </div>

      {/* Shadow border */}
      <div className="absolute inset-0 border-2 border-purple-800/60 rounded-lg pointer-events-none z-30"></div>
      <div className="absolute inset-0 shadow-[0_0_15px_rgba(75,0,130,0.5)] rounded-lg z-30"></div>

      {/* Dark variant symbol */}
      <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-purple-900 border border-purple-700 z-40 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="white"
          className="w-3 h-3"
        >
          <path
            fillRule="evenodd"
            d="M10.21 14.77a.75.75 0 01.02-1.06L14.168 10 10.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
            clipRule="evenodd"
          />
          <path
            fillRule="evenodd"
            d="M4.21 14.77a.75.75 0 01.02-1.06L8.168 10 4.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function DarkSuccubusCard({ image, name, title, description }) {
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

    const particles = [];
    const particleCount = 60;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1 + 0.5; // smaller particles
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.color = `rgba(138, 43, 226, ${Math.random() * 0.7 + 0.2})`; // deep violet glow
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update();
        p.draw();
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
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 pointer-events-none"
      />

      {/* Dark magical background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-black/20 to-purple-600/30 z-0"></div>
      <div className="absolute -inset-10 bg-purple-800/20 blur-3xl z-0 animate-pulse"></div>

      {/* Card content */}
      <div className="relative z-20 h-full flex flex-col">
        <div className="relative flex-1 overflow-hidden border-b-2 border-purple-700">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-700/20 via-transparent to-purple-900/20"></div>
        </div>
      </div>

      {/* Magical border */}
      <div className="absolute inset-0 border-2 border-purple-700/40 rounded-lg pointer-events-none z-30"></div>
      <div className="absolute inset-0 border border-purple-400/20 rounded-lg pointer-events-none z-30"></div>
    </div>
  );
}

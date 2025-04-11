"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function WaterVariantCard2({
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

    // Water droplet particles - fewer and more subtle
    const droplets = [];
    const dropletCount = 10;

    class Droplet {
      constructor() {
        this.reset();
      }

      reset() {
        // Random position along the sides and bottom
        const side = Math.floor(Math.random() * 3); // 0: bottom, 1: left, 2: right

        if (side === 0) {
          // bottom
          this.x = Math.random() * canvas.width;
          this.y = canvas.height;
          this.speedX = (Math.random() - 0.5) * 0.2;
          this.speedY = -(Math.random() * 0.4 + 0.1); // Upward
        } else if (side === 1) {
          // left
          this.x = 0;
          this.y = Math.random() * canvas.height;
          this.speedX = Math.random() * 0.2 + 0.1; // Rightward
          this.speedY = (Math.random() - 0.5) * 0.2;
        } else {
          // right
          this.x = canvas.width;
          this.y = Math.random() * canvas.height;
          this.speedX = -(Math.random() * 0.2 + 0.1); // Leftward
          this.speedY = (Math.random() - 0.5) * 0.2;
        }

        this.size = Math.random() * 1.5 + 0.5;
        this.maxSize = this.size;

        // Very low opacity blue color
        this.alpha = Math.random() * 0.15 + 0.05;
        this.color = `rgba(0, 70, 128, ${this.alpha})`;

        // Lifetime for droplet
        this.life = 100 + Math.random() * 100;
        this.maxLife = this.life;
      }

      update() {
        // Update position
        this.x += this.speedX;
        this.y += this.speedY;

        // Reduce life
        this.life--;

        // Fade out towards end of life
        if (this.life < 30) {
          this.alpha = (this.life / 30) * (Math.random() * 0.15 + 0.05);
          this.color = `rgba(0, 70, 128, ${this.alpha})`;
          this.size = this.maxSize * (this.life / 30);
        }

        // Reset when dead or off screen
        if (
          this.life <= 0 ||
          this.x < -5 ||
          this.x > canvas.width + 5 ||
          this.y < -5 ||
          this.y > canvas.height + 5
        ) {
          this.reset();
        }
      }

      draw() {
        if (!ctx) return;

        // Draw water droplet shape
        ctx.fillStyle = this.color;
        ctx.beginPath();

        // Teardrop shape
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

        ctx.fill();

        // Add subtle highlight
        const highlightSize = this.size * 0.3;
        const highlightX = this.x - this.size * 0.25;
        const highlightY = this.y - this.size * 0.25;

        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha * 0.8})`;
        ctx.beginPath();
        ctx.arc(highlightX, highlightY, highlightSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Initialize droplets with staggered positions
    for (let i = 0; i < dropletCount; i++) {
      const droplet = new Droplet();
      // Set random life so they don't all reset at the same time
      droplet.life = Math.random() * droplet.maxLife;
      droplets.push(droplet);
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      droplets.forEach((droplet) => {
        droplet.update();
        droplet.draw();
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

      {/* Water themed background - darker to improve visibility */}
      <div className="absolute inset-0 bg-slate-950 z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-blue-950/50 to-blue-950/80 z-0"></div>

      {/* Very subtle water ripple at bottom only */}
      <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-blue-900/20 to-transparent z-5"></div>

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

          {/* Minimal water overlay at bottom only */}
          <div className="absolute inset-x-0 bottom-0 h-1/5 bg-gradient-to-t from-blue-900/30 to-transparent"></div>
        </div>
      </div>

      {/* Subtle flowing border design */}
      <div className="absolute inset-0 border border-blue-900/60 rounded-lg pointer-events-none z-30"></div>

      {/* Water wave accent at bottom */}
      <div
        className="absolute inset-x-0 bottom-0 h-[3px] z-30 overflow-hidden"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(0,150,255,0.5) 50%, transparent 100%)",
          backgroundSize: "200% 100%",
          animation: "waveMove 3s infinite linear",
        }}
      ></div>

      {/* Keyframe animation for CSS */}
      <style jsx>{`
        @keyframes waveMove {
          0% {
            background-position: 0% 0%;
          }
          100% {
            background-position: 200% 0%;
          }
        }
      `}</style>
    </div>
  );
}

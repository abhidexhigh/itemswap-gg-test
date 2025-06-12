"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function WaterVariantCard({
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

    // Bubble particles
    const bubbles = [];
    const bubbleCount = 20;

    class Bubble {
      constructor() {
        this.reset();
      }

      reset() {
        // Start bubbles at the bottom
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 5;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.speedY = -(Math.random() * 0.4 + 0.2); // Negative to move upward

        // Bubble alpha for transparency
        this.alpha = Math.random() * 0.4 + 0.1;

        // Random colors - blues and cyans
        const colors = [
          `rgba(0, 191, 255, ${this.alpha})`, // deep sky blue
          `rgba(135, 206, 235, ${this.alpha})`, // sky blue
          `rgba(173, 216, 230, ${this.alpha})`, // light blue
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];

        // Bubble sway properties
        this.swayAmount = Math.random() * 0.5;
        this.swaySpeed = Math.random() * 0.01 + 0.005;
        this.swayOffset = Math.random() * Math.PI * 2;
      }

      update() {
        // Move upward with swaying motion
        this.x +=
          this.speedX +
          Math.sin(Date.now() * this.swaySpeed + this.swayOffset) *
            this.swayAmount;
        this.y += this.speedY;

        // Reset when bubble goes off the top
        if (this.y < -10) {
          this.reset();
        }
      }

      draw() {
        if (!ctx) return;
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color
          .replace(")", ", 0.3)")
          .replace("rgba", "rgba");
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Add a highlight to make it look like a bubble
        const highlight = ctx.createRadialGradient(
          this.x - this.size * 0.3,
          this.y - this.size * 0.3,
          0,
          this.x - this.size * 0.3,
          this.y - this.size * 0.3,
          this.size * 0.6
        );
        highlight.addColorStop(0, "rgba(255, 255, 255, 0.5)");
        highlight.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.fillStyle = highlight;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Water waves (decorative lines at bottom of card)
    const drawWaves = () => {
      if (!ctx) return;

      const waveHeight = 3;
      const waveCount = 2;
      const now = Date.now() * 0.001;

      for (let i = 0; i < waveCount; i++) {
        const yOffset = canvas.height - 5 - i * 4;
        ctx.beginPath();
        ctx.moveTo(0, yOffset);

        // Draw wave path
        for (let x = 0; x < canvas.width; x += 5) {
          const y = yOffset + Math.sin(x * 0.05 + now + i) * waveHeight;
          ctx.lineTo(x, y);
        }

        ctx.strokeStyle = `rgba(100, 200, 255, ${0.3 - i * 0.1})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    };

    // Initialize bubbles
    for (let i = 0; i < bubbleCount; i++) {
      const bubble = new Bubble();
      // Distribute bubbles initially throughout the canvas
      bubble.y = Math.random() * canvas.height;
      bubbles.push(bubble);
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawWaves();

      bubbles.forEach((bubble) => {
        bubble.update();
        bubble.draw();
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

      {/* Water themed background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-800 via-blue-900 to-blue-950 z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-600/20 z-0"></div>

      {/* Underwater light rays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,200,255,0.2),rgba(0,0,100,0.1))] z-0"></div>
      <div
        className="absolute inset-0 opacity-20 mix-blend-overlay"
        style={{
          backgroundImage:
            "linear-gradient(0deg, rgba(0, 150, 255, 0.3) 0%, transparent 75%)",
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

          {/* Underwater effect that doesn't obscure character */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 via-transparent to-transparent"></div>

          {/* Water ripple effect */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cfilter id='water' x='-50%25' y='-50%25' width='200%25' height='200%25'%3E%3CfeDisplacementMap in='SourceGraphic' scale='5' xChannelSelector='R' yChannelSelector='G'%3E%3CfeTurbulence baseFrequency='0.03 0.06' numOctaves='3' result='TURB' type='fractalNoise'%3E%3C/feTurbulence%3E%3C/feDisplacementMap%3E%3C/filter%3E%3C/defs%3E%3Crect width='100%25' height='100%25' filter='url(%23water)'/%3E%3C/svg%3E\")",
              backgroundSize: "cover",
            }}
          ></div>
        </div>
      </div>

      {/* Water border */}
      <div className="absolute inset-0 border-2 border-cyan-500/60 rounded-lg pointer-events-none z-30"></div>
      <div className="absolute inset-0 shadow-[0_0_15px_rgba(0,150,255,0.3)] rounded-lg z-30"></div>

      {/* Water droplet corners */}
      <div className="absolute top-0 left-0 w-3 h-6 bg-gradient-to-br from-cyan-400/60 to-transparent rounded-tr-full z-30"></div>
      <div className="absolute bottom-0 right-0 w-3 h-6 bg-gradient-to-tl from-cyan-400/60 to-transparent rounded-bl-full z-30"></div>

      {/* Water variant symbol */}
      <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-cyan-600 border border-cyan-400 z-40 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="white"
          className="w-3 h-3"
        >
          <path
            fillRule="evenodd"
            d="M7.84 1.804A1 1 0 018.82 1h2.36a1 1 0 01.98.804l.331 1.652a6.993 6.993 0 011.929 1.115l1.598-.54a1 1 0 011.186.447l1.18 2.044a1 1 0 01-.205 1.251l-1.267 1.113a7.047 7.047 0 010 2.228l1.267 1.113a1 1 0 01.206 1.25l-1.18 2.045a1 1 0 01-1.187.447l-1.598-.54a6.993 6.993 0 01-1.929 1.115l-.33 1.652a1 1 0 01-.98.804H8.82a1 1 0 01-.98-.804l-.331-1.652a6.993 6.993 0 01-1.929-1.115l-1.598.54a1 1 0 01-1.186-.447l-1.18-2.044a1 1 0 01.205-1.251l1.267-1.114a7.05 7.05 0 010-2.227L1.821 7.773a1 1 0 01-.206-1.25l1.18-2.045a1 1 0 011.187-.447l1.598.54A6.993 6.993 0 017.51 3.456l.33-1.652zM10 13a3 3 0 100-6 3 3 0 000 6z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
}

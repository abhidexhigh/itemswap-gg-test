"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function FireVariantCard2({
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

    // Ember particles - smaller, fewer, and only at the bottom
    const embers = [];
    const emberCount = 15;

    class Ember {
      constructor() {
        this.reset();
      }

      reset() {
        // Position at the bottom of the card
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.size = Math.random() * 2 + 0.8; // Increased size
        this.speedX = (Math.random() - 0.5) * 0.4; // More horizontal movement
        this.speedY = -(Math.random() * 0.8 + 0.3); // Faster upward movement

        // More vibrant fire colors with higher opacity
        const alpha = Math.random() * 0.5 + 0.2; // Higher alpha
        const colors = [
          `rgba(255, 69, 0, ${alpha})`, // red-orange
          `rgba(255, 140, 0, ${alpha})`, // dark orange
          `rgba(255, 165, 0, ${alpha})`, // orange
          `rgba(255, 100, 0, ${alpha})`, // added another orange shade
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];

        // Life properties
        this.maxLife = 70 + Math.random() * 50; // Longer life
        this.life = this.maxLife;
      }

      update() {
        // Update position with slight drift
        this.x += this.speedX;
        this.y += this.speedY;

        // Add gentle horizontal oscillation
        this.x += Math.sin(Date.now() * 0.003 + this.y * 0.1) * 0.1;

        // Decrease life
        this.life--;

        // Calculate opacity based on life
        this.opacity = this.life / this.maxLife;

        // Decrease size as it rises, but ensure it stays positive
        this.currentSize = Math.max(0.1, this.size * this.opacity);

        // Reset when life is over
        if (this.life <= 0 || this.y < 0) {
          this.reset();
        }
      }

      draw() {
        if (!ctx) return;
        // Use a semi-transparent version of the color
        ctx.fillStyle = this.color.replace(
          /[\d\.]+\)$/,
          `${this.opacity * 0.7})`
        );

        // Draw as a small circle
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.currentSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Initialize embers
    for (let i = 0; i < emberCount; i++) {
      const ember = new Ember();
      // Stagger initial positions
      ember.y = canvas.height - Math.random() * 10;
      ember.life = Math.random() * ember.maxLife;
      embers.push(ember);
    }

    // Create additional embers at random intervals for bursts
    const createEmberBurst = () => {
      const burstCount = Math.floor(Math.random() * 3) + 2;
      const burstX = Math.random() * canvas.width;

      for (let i = 0; i < burstCount; i++) {
        const ember = new Ember();
        ember.x = burstX + (Math.random() - 0.5) * 10;
        ember.y = canvas.height - Math.random() * 5;
        ember.speedY = -(Math.random() * 1 + 0.5); // Faster upward
        embers.push(ember);

        // Remove oldest embers if we exceed the count too much
        if (embers.length > emberCount + 10) {
          embers.shift();
        }
      }
    };

    // Set interval for ember bursts
    const burstInterval = setInterval(createEmberBurst, 700);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw embers
      embers.forEach((ember) => {
        ember.update();
        ember.draw();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      clearInterval(burstInterval);
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

      {/* Fire themed background - more vibrant red base with smoother transitions */}
      <div className="absolute inset-0 bg-gray-950 z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-red-950/10 to-orange-950/30 z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-red-950/30 via-transparent to-transparent z-0"></div>

      {/* Smooth fire glow at bottom that blends better with background */}
      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-orange-900/30 via-red-900/15 to-transparent z-5"></div>

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

          {/* Gradual bottom glow for better blending with flames */}
          <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-orange-900/35 via-orange-900/15 to-transparent"></div>
        </div>
      </div>

      {/* Fire border with more consistent color matching the flames */}
      <div className="absolute inset-0 border border-orange-800/50 rounded-lg pointer-events-none z-30"></div>

      {/* Corner accents */}
      <div className="absolute bottom-0 left-0 w-4 h-12 bg-gradient-to-tr from-orange-600/40 to-transparent z-30"></div>
      <div className="absolute bottom-0 right-0 w-4 h-12 bg-gradient-to-tl from-orange-600/40 to-transparent z-30"></div>
    </div>
  );
}

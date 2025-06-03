"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function StarfieldCard({
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

    // Star parameters
    const stars = [];
    const starCount = 100;

    // Shooting star parameters
    const shootingStars = [];
    const maxShootingStars = 1; // Maximum number of simultaneous shooting stars
    const shootingStarChance = 0.0005; // Chance per frame to spawn a new shooting star

    // Animation timing
    let lastTime = 0;
    let elapsedTime = 0;

    class Star {
      constructor() {
        this.reset();
      }

      reset() {
        // Position
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.z = Math.random() * 2; // Depth/parallax factor

        // Visual properties
        this.size = 0.5 + Math.random() * 1.5;
        this.baseOpacity = 0.1 + Math.random() * 0.6;

        // Parallax movement (stars in back move slower)
        this.speedX =
          (0.0001 + (1 - this.z) * 0.0001) * (Math.random() > 0.5 ? 1 : -1);
        this.speedY =
          (0.00005 + (1 - this.z) * 0.00005) * (Math.random() > 0.5 ? 1 : -1);

        // Twinkle effect
        this.twinkleSpeed = Math.random() * 0.0005 + 0.0002;
        this.twinkleOffset = Math.random() * Math.PI * 2;

        // Color variation
        this.hue =
          Math.random() > 0.8
            ? Math.random() * 60 // Some gold/yellow stars
            : Math.random() * 260 + 180; // Mostly blue/purple/teal
        this.saturation = Math.random() * 50;
        this.lightness = 80 + Math.random() * 20;
      }

      update(deltaTime) {
        // Very slow movement
        this.x += this.speedX * deltaTime;
        this.y += this.speedY * deltaTime;

        // Wrap around screen edges
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;

        // Calculate twinkle effect
        this.opacity =
          this.baseOpacity *
          (0.5 +
            0.5 *
              Math.sin(elapsedTime * this.twinkleSpeed + this.twinkleOffset));
      }

      draw() {
        if (!ctx) return;

        // Draw star glow
        const glow = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.size * 3
        );

        glow.addColorStop(
          0,
          `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.opacity * 0.5})`
        );
        glow.addColorStop(
          1,
          `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, 0)`
        );

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Draw star core
        ctx.fillStyle = `hsla(${this.hue}, ${this.saturation * 0.7}%, ${this.lightness + 10}%, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    class ShootingStar {
      constructor() {
        this.reset();
      }

      reset() {
        // Start position (from edge of screen)
        const side = Math.floor(Math.random() * 2); // 0: top, 1: right
        if (side === 0) {
          this.x = Math.random() * canvas.width;
          this.y = -10;
          this.angle = Math.PI / 2 + (Math.random() * 0.8 - 0.4); // Mostly downward
        } else {
          this.x = canvas.width + 10;
          this.y = Math.random() * (canvas.height * 0.7);
          this.angle = Math.PI + (Math.random() * 0.8 - 0.4); // Mostly leftward
        }

        // Movement
        this.speed = Math.random() * 0.2 + 0.1;
        this.length = Math.random() * 30 + 10;

        // Visual properties
        this.width = Math.random() * 2 + 1;
        this.opacity = 0; // Start invisible
        this.maxOpacity = Math.random() * 0.4 + 0.2;

        // Lifespan
        this.life = 0;
        this.fadeInDuration = Math.random() * 1000 + 500;
        this.activeDuration = Math.random() * 1500 + 1000;
        this.fadeOutDuration = Math.random() * 1000 + 500;
        this.totalDuration =
          this.fadeInDuration + this.activeDuration + this.fadeOutDuration;

        // Color
        this.hue = Math.random() * 60 + 180; // Blue-cyan range
        this.saturation = Math.random() * 30 + 70;
        this.lightness = Math.random() * 20 + 70;
      }

      update(deltaTime) {
        // Update position
        this.x += Math.cos(this.angle) * this.speed * deltaTime * 0.1;
        this.y += Math.sin(this.angle) * this.speed * deltaTime * 0.1;

        // Update life
        this.life += deltaTime;

        // Update opacity based on life stage
        if (this.life < this.fadeInDuration) {
          // Fade in
          this.opacity = (this.life / this.fadeInDuration) * this.maxOpacity;
        } else if (this.life < this.fadeInDuration + this.activeDuration) {
          // Active
          this.opacity = this.maxOpacity;
        } else {
          // Fade out
          const fadeOutProgress =
            (this.life - this.fadeInDuration - this.activeDuration) /
            this.fadeOutDuration;
          this.opacity = this.maxOpacity * (1 - fadeOutProgress);
        }

        // Check if completed
        return this.life >= this.totalDuration;
      }

      draw() {
        if (!ctx || this.opacity <= 0) return;

        // Calculate trail end point
        const endX = this.x - Math.cos(this.angle) * this.length;
        const endY = this.y - Math.sin(this.angle) * this.length;

        // Draw trail
        const gradient = ctx.createLinearGradient(this.x, this.y, endX, endY);
        gradient.addColorStop(
          0,
          `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.opacity})`
        );
        gradient.addColorStop(
          0.6,
          `hsla(${this.hue}, ${this.saturation * 0.8}%, ${this.lightness * 0.9}%, ${this.opacity * 0.5})`
        );
        gradient.addColorStop(
          1,
          `hsla(${this.hue}, ${this.saturation * 0.5}%, ${this.lightness * 0.8}%, 0)`
        );

        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.width;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Draw head glow
        const glow = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.width * 3
        );

        glow.addColorStop(
          0,
          `hsla(${this.hue}, ${this.saturation * 0.8}%, ${this.lightness + 10}%, ${this.opacity})`
        );
        glow.addColorStop(
          1,
          `hsla(${this.hue}, ${this.saturation * 0.5}%, ${this.lightness}%, 0)`
        );

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width * 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Initialize stars
    for (let i = 0; i < starCount; i++) {
      stars.push(new Star());
    }

    // Animation loop
    const animate = (timestamp) => {
      // Calculate delta time
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      elapsedTime += deltaTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background gradient
      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGradient.addColorStop(0, "rgba(10, 10, 30, 0.4)");
      bgGradient.addColorStop(1, "rgba(5, 5, 20, 0.2)");

      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw stars
      stars.forEach((star) => {
        star.update(deltaTime);
        star.draw();
      });

      // Occasionally spawn a new shooting star
      if (
        shootingStars.length < maxShootingStars &&
        Math.random() < shootingStarChance * deltaTime
      ) {
        shootingStars.push(new ShootingStar());
      }

      // Update and draw shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const star = shootingStars[i];
        const completed = star.update(deltaTime);

        // Draw if still active
        star.draw();

        // Remove if completed
        if (completed) {
          shootingStars.splice(i, 1);
        }
      }

      requestAnimationFrame(animate);
    };

    animate(0);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-[104px] h-[104px] max-w-md aspect-[4/4] rounded-lg overflow-hidden transition-all duration-300 hover:scale-105"
    >
      {/* Deep space background */}
      <div className="absolute inset-0 bg-indigo-950 z-0"></div>

      {/* Subtle nebula texture */}
      <div
        className="absolute inset-0 opacity-20 z-0"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 20%, rgba(120,100,200,0.4) 0%, transparent 50%),
                             radial-gradient(circle at 70% 60%, rgba(80,120,220,0.3) 0%, transparent 40%)`,
        }}
      ></div>

      {/* Canvas for animations */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 pointer-events-none"
      />

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

          {/* Night sky overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/40 via-transparent to-purple-900/30 mix-blend-multiply"></div>
        </div>
      </div>

      {/* Subtle border */}
      <div className="absolute inset-0 border border-indigo-500/10 rounded-lg pointer-events-none z-30"></div>

      {/* Corners */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-indigo-400/20 rounded-tl-lg z-30"></div>
      <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-indigo-400/20 rounded-tr-lg z-30"></div>
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-indigo-400/20 rounded-bl-lg z-30"></div>
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-indigo-400/20 rounded-br-lg z-30"></div>

      {/* Star symbol */}
      <div className="absolute bottom-1.5 right-1.5 w-4 h-4 flex items-center justify-center z-40 opacity-50">
        <svg
          viewBox="0 0 24 24"
          className="w-3 h-3 text-purple-300/80 fill-current"
        >
          <path d="M12,15.39L8.24,17.66L9.23,13.38L5.91,10.5L10.29,10.13L12,6.09L13.71,10.13L18.09,10.5L14.77,13.38L15.76,17.66M22,9.24L14.81,8.63L12,2L9.19,8.63L2,9.24L7.45,13.97L5.82,21L12,17.27L18.18,21L16.54,13.97L22,9.24Z" />
        </svg>
      </div>

      {/* Subtle inner glow */}
      <div className="absolute inset-0 rounded-lg shadow-[inset_0_0_15px_rgba(120,100,220,0.1)] z-30 pointer-events-none"></div>
    </div>
  );
}

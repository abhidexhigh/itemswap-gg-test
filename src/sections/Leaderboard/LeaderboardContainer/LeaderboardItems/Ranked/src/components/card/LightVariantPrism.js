"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function LightVariantPrism({
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

    // Rainbow prism effects
    const prismRays = [];
    const rayCount = 20;

    // Spectrum particles
    const spectrumParticles = [];
    const particleCount = 40;

    // Light flare spots
    const flareSpots = [];
    const flareCount = 5;

    // Prismatic ray class
    class PrismRay {
      constructor() {
        this.reset();
      }

      reset() {
        // Position at center
        this.startX = canvas.width / 2 + (Math.random() - 0.5) * 20;
        this.startY = canvas.height / 2 + (Math.random() - 0.5) * 20;

        // Length and width
        this.length = Math.random() * (canvas.width * 0.8) + canvas.width * 0.2;
        this.width = Math.random() * 2 + 0.5;

        // Angle
        this.angle = Math.random() * Math.PI * 2;

        // Color
        this.hue = Math.random() * 360;
        this.saturation = 95;
        this.lightness = 65;

        // Opacity
        this.opacity = Math.random() * 0.15 + 0.05;

        // Movement
        this.rotationSpeed = (Math.random() - 0.5) * 0.002;

        // Life
        this.life = Math.random() * 200 + 100;
        this.maxLife = this.life;
      }

      update() {
        // Rotate
        this.angle += this.rotationSpeed;

        // Decrease life
        this.life--;

        // Opacity based on life
        const lifeRatio = this.life / this.maxLife;
        this.currentOpacity = this.opacity * lifeRatio;

        // Change hue over time
        this.hue = (this.hue + 0.2) % 360;

        // Reset when life is over
        if (this.life <= 0) {
          this.reset();
        }
      }

      draw() {
        if (!ctx) return;

        // End points based on angle and length
        const endX = this.startX + Math.cos(this.angle) * this.length;
        const endY = this.startY + Math.sin(this.angle) * this.length;

        // Create gradient
        const gradient = ctx.createLinearGradient(
          this.startX,
          this.startY,
          endX,
          endY
        );

        // Rainbow effect along the ray
        for (let i = 0; i <= 1; i += 0.2) {
          const rayHue = (this.hue + i * 60) % 360; // Color spread
          gradient.addColorStop(
            i,
            `hsla(${rayHue}, ${this.saturation}%, ${this.lightness}%, ${this.currentOpacity * (1 - i * 0.5)})`
          );
        }

        // Draw ray
        ctx.beginPath();
        ctx.moveTo(this.startX, this.startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.width;
        ctx.lineCap = "round";
        ctx.stroke();

        // Add glow effect
        ctx.shadowColor = `hsla(${this.hue}, 100%, 70%, ${this.currentOpacity * 0.7})`;
        ctx.shadowBlur = 5;
        ctx.lineWidth = this.width * 0.5;
        ctx.stroke();

        ctx.shadowBlur = 0;
      }
    }

    // Spectrum particle class
    class SpectrumParticle {
      constructor() {
        this.reset();
      }

      reset() {
        // Position
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        // Size
        this.radius = Math.random() * 2 + 0.5;

        // Color - vibrant rainbow colors
        this.hue = Math.random() * 360;
        this.saturation = 90 + Math.random() * 10;
        this.lightness = 60 + Math.random() * 20;

        // Opacity
        this.opacity = Math.random() * 0.4 + 0.2;

        // Movement
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;

        // Oscillation
        this.oscSpeed = Math.random() * 0.05 + 0.01;
        this.oscAmplitude = Math.random() * 0.5 + 0.5;
        this.oscOffset = Math.random() * Math.PI * 2;

        // Life
        this.life = Math.random() * 150 + 100;
        this.maxLife = this.life;
      }

      update() {
        // Move with slight oscillation
        const time = Date.now() * 0.001;
        this.x +=
          this.speedX +
          Math.sin(time * this.oscSpeed + this.oscOffset) *
            this.oscAmplitude *
            0.1;
        this.y +=
          this.speedY +
          Math.cos(time * this.oscSpeed + this.oscOffset) *
            this.oscAmplitude *
            0.1;

        // Change hue slightly
        this.hue = (this.hue + 0.5) % 360;

        // Decrease life
        this.life--;

        // Calculate opacity based on life
        const lifeRatio = this.life / this.maxLife;
        this.currentOpacity = this.opacity * lifeRatio;

        // Reset if off-screen or dead
        if (
          this.life <= 0 ||
          this.x < -10 ||
          this.x > canvas.width + 10 ||
          this.y < -10 ||
          this.y > canvas.height + 10
        ) {
          this.reset();
        }
      }

      draw() {
        if (!ctx) return;

        // Draw glowing particle
        ctx.save();

        // Set glow effect
        ctx.shadowColor = `hsla(${this.hue}, 100%, 70%, ${this.currentOpacity * 0.7})`;
        ctx.shadowBlur = 5;

        // Draw circle
        ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.currentOpacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
    }

    // Light flare spot class
    class FlareSpot {
      constructor() {
        this.reset();
      }

      reset() {
        // Position - spread around the center
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * (canvas.width * 0.3);

        this.x = canvas.width / 2 + Math.cos(angle) * distance;
        this.y = canvas.height / 2 + Math.sin(angle) * distance;

        // Size
        this.baseRadius = Math.random() * 15 + 5;
        this.radius = this.baseRadius;

        // Color - white to light pastel
        this.hue = Math.random() * 60 + 30; // Gold/yellow tint
        this.saturation = Math.random() * 30 + 10;
        this.lightness = 90 + Math.random() * 10;

        // Opacity
        this.baseOpacity = Math.random() * 0.15 + 0.05;
        this.opacity = this.baseOpacity;

        // Pulsing
        this.pulseSpeed = Math.random() * 0.01 + 0.005;
        this.pulseOffset = Math.random() * Math.PI * 2;
      }

      update() {
        const time = Date.now() * 0.001;

        // Pulse size and opacity
        const pulseFactor =
          0.5 + Math.sin(time * this.pulseSpeed + this.pulseOffset) * 0.5;
        this.radius = this.baseRadius * (0.8 + pulseFactor * 0.4);
        this.opacity = this.baseOpacity * (0.7 + pulseFactor * 0.5);
      }

      draw() {
        if (!ctx) return;

        // Draw light flare with gradient
        const gradient = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.radius
        );

        gradient.addColorStop(
          0,
          `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.opacity})`
        );
        gradient.addColorStop(
          0.6,
          `hsla(${this.hue}, ${this.saturation - 10}%, ${this.lightness - 10}%, ${this.opacity * 0.5})`
        );
        gradient.addColorStop(
          1,
          `hsla(${this.hue}, ${this.saturation - 20}%, ${this.lightness - 20}%, 0)`
        );

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Create prism rays
    for (let i = 0; i < rayCount; i++) {
      const ray = new PrismRay();
      ray.life = Math.random() * ray.maxLife; // Stagger lifespans
      prismRays.push(ray);
    }

    // Create spectrum particles
    for (let i = 0; i < particleCount; i++) {
      const particle = new SpectrumParticle();
      particle.life = Math.random() * particle.maxLife; // Stagger lifespans
      spectrumParticles.push(particle);
    }

    // Create light flare spots
    for (let i = 0; i < flareCount; i++) {
      flareSpots.push(new FlareSpot());
    }

    // Draw prism background
    const drawPrismBackground = () => {
      if (!ctx) return;

      // Create radial gradient for prism effect
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.max(canvas.width, canvas.height) * 0.7;

      // Rainbow rings
      const time = Date.now() * 0.0005;

      for (let i = 0; i < 5; i++) {
        const ringRadius = radius * (0.3 + i * 0.1);
        const offset = time + (i * Math.PI) / 2.5;

        // Slightly shifting gradient for each ring
        const gradient = ctx.createRadialGradient(
          centerX,
          centerY,
          ringRadius * 0.1,
          centerX,
          centerY,
          ringRadius
        );

        // Create rainbow spectrum effect
        for (let j = 0; j < 7; j++) {
          const position = j / 6;
          const hue = (offset * 30 + j * 30) % 360;

          gradient.addColorStop(
            position,
            `hsla(${hue}, 80%, 70%, ${0.03 - i * 0.005})`
          );
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Diffused white center
      const centerGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        radius * 0.3
      );
      centerGradient.addColorStop(0, "rgba(255, 255, 255, 0.07)");
      centerGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.fillStyle = centerGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.3, 0, Math.PI * 2);
      ctx.fill();
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background first
      drawPrismBackground();

      // Draw light flare spots
      flareSpots.forEach((flare) => {
        flare.update();
        flare.draw();
      });

      // Draw prism rays
      prismRays.forEach((ray) => {
        ray.update();
        ray.draw();
      });

      // Draw spectrum particles last (on top)
      spectrumParticles.forEach((particle) => {
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
      {/* Base white background with slight tint */}
      <div className="absolute inset-0 bg-white z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/40 z-0"></div>

      {/* Prismatic canvas layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 pointer-events-none"
      />

      {/* Subtle glass texture */}
      <div
        className="absolute inset-0 opacity-10 z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`,
          backgroundSize: "100px 100px",
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

          {/* Subtle rainbow edge overlay */}
          <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(255,255,255,0.3)]"></div>
          <div
            className="absolute inset-0 mix-blend-overlay opacity-10"
            style={{
              backgroundImage: `
                   linear-gradient(45deg, 
                     #ff000030 0%, 
                     #ff800030 14%, 
                     #ffff0030 28%, 
                     #00ff0030 42%, 
                     #00ffff30 56%, 
                     #0000ff30 70%, 
                     #ff00ff30 84%, 
                     #ff000030 100%)
                 `,
            }}
          ></div>
        </div>
      </div>

      {/* Refined border */}
      <div className="absolute inset-0 rounded-lg border border-white/60 z-30 pointer-events-none"></div>

      {/* Corner diamonds */}
      <div className="absolute top-[1px] left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent z-30"></div>
      <div className="absolute bottom-[1px] left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent z-30"></div>
      <div className="absolute left-[1px] top-1/2 -translate-y-1/2 h-1/3 w-[2px] bg-gradient-to-b from-transparent via-white to-transparent z-30"></div>
      <div className="absolute right-[1px] top-1/2 -translate-y-1/2 h-1/3 w-[2px] bg-gradient-to-b from-transparent via-white to-transparent z-30"></div>

      {/* Shimmering border glow */}
      <div className="absolute inset-0 rounded-lg shadow-[0_0_10px_rgba(255,255,255,0.5),inset_0_0_10px_rgba(255,255,255,0.5)] z-30 pointer-events-none"></div>
    </div>
  );
}

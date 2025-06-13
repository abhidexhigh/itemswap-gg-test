"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function FireVariantFlame({
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

    // Flame parameters
    const embers = [];
    const emberCount = 30;

    // Flame base points
    const flamePoints = [];
    const flameCount = 8;

    // Smoke particles
    const smokeParticles = [];
    const smokeCount = 15;

    // Animation timing
    let lastTime = 0;
    let elapsedTime = 0;

    // Ember particle class
    class Ember {
      constructor() {
        this.reset();
      }

      reset() {
        // Position - start at bottom of screen
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 20;

        // Size
        this.size = Math.random() * 3 + 1;
        this.initialSize = this.size;

        // Movement - reduce speed values for slower movement
        this.speedX = (Math.random() - 0.5) * 0.3; // reduced from 0.8
        this.speedY = -Math.random() * 1.2 - 0.8; // reduced from -Math.random() * 2 - 1.5
        this.gravity = -0.02; // reduced from -0.05 for slower acceleration

        // Wobble effect - reduce for smoother movement
        this.wobble = Math.random() * 0.1; // reduced from 0.2
        this.wobbleSpeed = Math.random() * 0.05; // reduced from 0.1
        this.wobbleOffset = Math.random() * Math.PI * 2;

        // Color - fire colors
        const fireColors = [
          [255, 50, 0], // Red-orange
          [255, 140, 0], // Orange
          [255, 200, 0], // Yellow-orange
          [255, 220, 80], // Yellow
        ];

        const colorIndex = Math.floor(Math.random() * fireColors.length);
        this.color = fireColors[colorIndex];

        // Life - increase for longer-lasting particles
        this.maxLife = Math.random() * 150 + 120; // increased from 100 + 80
        this.life = this.maxLife;
      }

      update(deltaTime) {
        // Movement
        this.x += this.speedX * deltaTime;
        this.y += this.speedY * deltaTime;

        // Apply gravity effect (particles rise)
        this.speedY += this.gravity * deltaTime;

        // Wobble movement
        this.x +=
          Math.sin(elapsedTime * this.wobbleSpeed + this.wobbleOffset) *
          this.wobble *
          deltaTime;

        // Age the particle
        this.life -= deltaTime;

        // Adjust size as it rises and ages
        const lifeRatio = this.life / this.maxLife;
        this.size = this.initialSize * lifeRatio;

        // Reset if gone or dead
        if (
          this.life <= 0 ||
          this.y < -20 ||
          this.x < -20 ||
          this.x > canvas.width + 20
        ) {
          this.reset();
        }
      }

      draw() {
        if (!ctx) return;

        // Calculate opacity based on life
        const lifeRatio = this.life / this.maxLife;
        const alpha = lifeRatio * 0.8; // Fade out as it rises

        // Create glow effect
        const glowSize = this.size * 2;
        const glow = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          glowSize
        );

        glow.addColorStop(
          0,
          `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${alpha})`
        );
        glow.addColorStop(
          1,
          `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, 0)`
        );

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(this.x, this.y, glowSize, 0, Math.PI * 2);
        ctx.fill();

        // Draw the ember core
        ctx.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${alpha * 1.2})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Flame base class
    class FlameBase {
      constructor() {
        this.reset();
      }

      reset() {
        // Position along bottom
        this.x = Math.random() * canvas.width;
        this.y = canvas.height - Math.random() * 5;

        // Size and shape
        this.width = Math.random() * 20 + 15;
        this.height = Math.random() * 40 + 20;

        // Animation - slower wave movement
        this.waveFactor = Math.random() * 10 + 5;
        this.waveSpeed = Math.random() * 0.005 + 0.002; // reduced from 0.01 + 0.004
        this.offset = Math.random() * Math.PI * 2;

        // Color - fire gradient
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update(deltaTime) {
        // Wave movement
        this.offset += this.waveSpeed * deltaTime;

        // Random chance to reset
        if (Math.random() < 0.002 * deltaTime) {
          this.reset();
        }
      }

      draw() {
        if (!ctx) return;

        // Calculate waviness
        const waveX = Math.sin(this.offset) * this.waveFactor;

        // Create flame gradient
        const gradient = ctx.createLinearGradient(
          this.x,
          this.y,
          this.x + waveX,
          this.y - this.height
        );

        gradient.addColorStop(0, `rgba(255, 120, 0, ${this.opacity})`);
        gradient.addColorStop(0.4, `rgba(255, 160, 0, ${this.opacity * 0.8})`);
        gradient.addColorStop(0.7, `rgba(255, 220, 0, ${this.opacity * 0.6})`);
        gradient.addColorStop(1, "rgba(255, 240, 150, 0)");

        // Draw the flame
        ctx.fillStyle = gradient;
        ctx.beginPath();

        // Starting point
        ctx.moveTo(this.x - this.width / 2, this.y);

        // Curved flame shape
        ctx.quadraticCurveTo(
          this.x + waveX,
          this.y - this.height * 0.7,
          this.x + this.width / 2,
          this.y
        );

        ctx.closePath();
        ctx.fill();

        // Add inner glow
        const innerGlow = ctx.createRadialGradient(
          this.x + waveX * 0.5,
          this.y - this.height * 0.4,
          0,
          this.x + waveX * 0.5,
          this.y - this.height * 0.4,
          this.width * 0.8
        );

        innerGlow.addColorStop(0, `rgba(255, 240, 150, ${this.opacity * 0.6})`);
        innerGlow.addColorStop(1, "rgba(255, 240, 150, 0)");

        ctx.fillStyle = innerGlow;
        ctx.beginPath();
        ctx.arc(
          this.x + waveX * 0.5,
          this.y - this.height * 0.4,
          this.width * 0.8,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    }

    // Smoke particle class
    class SmokeParticle {
      constructor() {
        this.reset();
      }

      reset() {
        // Position - start at random positions along bottom
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;

        // Size and appearance
        this.initialSize = Math.random() * 15 + 5;
        this.size = this.initialSize;
        this.opacity = Math.random() * 0.1 + 0.05;

        // Movement - reduce speed for slower movement
        this.speedX = (Math.random() - 0.5) * 0.15; // reduced from 0.3
        this.speedY = -Math.random() * 0.25 - 0.1; // reduced from -Math.random() * 0.4 - 0.2

        // Life - increase for longer animation
        this.maxLife = Math.random() * 200 + 150; // increased from 150 + 100
        this.life = this.maxLife;

        // Rotation and shape - slower rotation
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.0005; // reduced from 0.001
      }

      update(deltaTime) {
        // Movement
        this.x += this.speedX * deltaTime;
        this.y += this.speedY * deltaTime;

        // Slowly expand as it rises
        this.size =
          this.initialSize * (0.8 + 0.4 * (1 - this.life / this.maxLife));

        // Rotation
        this.rotation += this.rotationSpeed * deltaTime;

        // Age
        this.life -= deltaTime;

        // Reset if gone or dead
        if (
          this.life <= 0 ||
          this.y < -50 ||
          this.x < -50 ||
          this.x > canvas.width + 50
        ) {
          this.reset();
        }
      }

      draw() {
        if (!ctx) return;

        // Opacity based on life
        const lifeRatio = this.life / this.maxLife;
        const alpha = this.opacity * lifeRatio;

        // Save context
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // Draw smoke puff
        ctx.fillStyle = `rgba(20, 20, 20, ${alpha})`;
        ctx.beginPath();

        // Cloud-like shape
        const startAngle = 0;
        const endAngle = Math.PI * 2;
        ctx.arc(0, 0, this.size, startAngle, endAngle);

        ctx.fill();
        ctx.restore();
      }
    }

    // Create flame bases
    for (let i = 0; i < flameCount; i++) {
      const flame = new FlameBase();
      flamePoints.push(flame);
    }

    // Create embers
    for (let i = 0; i < emberCount; i++) {
      const ember = new Ember();
      ember.y = Math.random() * canvas.height; // Distribute initially
      ember.life = Math.random() * ember.maxLife; // Stagger life
      embers.push(ember);
    }

    // Create smoke particles
    for (let i = 0; i < smokeCount; i++) {
      const smoke = new SmokeParticle();
      smoke.y = Math.random() * canvas.height; // Distribute initially
      smoke.life = Math.random() * smoke.maxLife; // Stagger life
      smokeParticles.push(smoke);
    }

    // Draw heated edges for card
    const drawHeatDistortion = () => {
      if (!ctx) return;

      const distortionWidth = 30;
      const intensity = 3;

      // Heat distortion along edges
      ctx.save();

      // Draw top distortion
      const topGradient = ctx.createLinearGradient(0, 0, 0, distortionWidth);
      topGradient.addColorStop(0, "rgba(255, 200, 100, 0.2)");
      topGradient.addColorStop(1, "rgba(255, 200, 100, 0)");

      ctx.fillStyle = topGradient;

      ctx.beginPath();
      ctx.moveTo(0, 0);

      for (let x = 0; x <= canvas.width; x += 10) {
        const y =
          Math.sin((x / canvas.width) * Math.PI * 4 + elapsedTime * 0.01) *
          intensity;
        ctx.lineTo(x, y);
      }

      ctx.lineTo(canvas.width, distortionWidth);
      ctx.lineTo(0, distortionWidth);
      ctx.closePath();
      ctx.fill();

      // Draw other edges with similar distortion...

      ctx.restore();
    };

    // Animation loop
    const animate = (timestamp) => {
      // Calculate delta time
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      elapsedTime += deltaTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw heat distortion
      drawHeatDistortion();

      // Draw smoke behind flames
      smokeParticles.forEach((smoke) => {
        smoke.update(deltaTime * 0.05); // reduced from 0.1 for slower movement
        smoke.draw();
      });

      // Draw flames
      flamePoints.forEach((flame) => {
        flame.update(deltaTime * 0.05); // reduced from 0.1 for slower movement
        flame.draw();
      });

      // Draw embers
      embers.forEach((ember) => {
        ember.update(deltaTime * 0.05); // reduced from 0.1 for slower movement
        ember.draw();
      });

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
      {/* Fire gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-950 via-orange-800 to-amber-950 z-0"></div>

      {/* Ember texture overlay */}
      <div
        className="absolute inset-0 z-0 opacity-15"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.2 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: "120% 120%",
        }}
      ></div>

      {/* Heat ripple effect */}
      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,100 Q100,80 200,100 T400,100 L400,400 L0,400 Z' fill='%23ff8800'/%3E%3Cpath d='M0,150 Q100,130 200,150 T400,150 L400,400 L0,400 Z' fill='%23ff5500'/%3E%3Cpath d='M0,200 Q100,180 200,200 T400,200 L400,400 L0,400 Z' fill='%23ff3300'/%3E%3C/svg%3E")`,
          backgroundSize: "100% 100%",
        }}
      ></div>

      {/* Glow effect */}
      <div
        className="absolute inset-0 z-1 opacity-20"
        style={{
          background:
            "radial-gradient(circle at 40% 60%, rgba(255,140,20,0.8) 0%, rgba(255,80,0,0.4) 50%, rgba(120,30,0,0.1) 100%)",
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
          {/* Character highlight shadow/light effect */}
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.6) 90%)",
              mixBlendMode: "multiply",
            }}
          ></div>

          {/* Dramatic lighting effect */}
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 40% 30%, rgba(255,200,100,0.3) 0%, transparent 60%)",
              mixBlendMode: "overlay",
            }}
          ></div>

          <Image
            src={image}
            alt={name || "Character"}
            fill
            className="object-cover object-center"
            priority
            style={{
              filter: "drop-shadow(0 0 8px rgba(255,160,20,0.3))",
            }}
          />

          {/* Fire vignette overlay */}
          <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(255,60,0,0.2)]"></div>

          {/* Fire-like gradient overlay */}
          <div
            className="absolute inset-0 opacity-15 mix-blend-overlay"
            style={{
              background:
                "linear-gradient(45deg, rgba(255,60,0,0.5) 0%, rgba(255,160,0,0.2) 50%, rgba(255,200,0,0.5) 100%)",
            }}
          ></div>

          {/* Enhanced inner shadow to focus on character */}
          <div className="absolute inset-0 shadow-[inset_0_0_30px_10px_rgba(0,0,0,0.5)] z-10"></div>
        </div>
      </div>

      {/* Fire frame */}
      <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none z-30">
        <div className="absolute inset-0 border border-orange-700/20 rounded-lg"></div>

        {/* Corner flames */}
        <svg
          className="absolute top-0 left-0 w-12 h-12 z-30 text-orange-500/30"
          viewBox="0 0 48 48"
          fill="none"
        >
          <path d="M0,0 C10,15 5,30 0,30 L0,0 Z" fill="currentColor" />
          <path
            d="M0,0 C20,10 15,35 0,40 L0,0 Z"
            fill="currentColor"
            fillOpacity="0.7"
          />
        </svg>

        <svg
          className="absolute top-0 right-0 w-12 h-12 z-30 text-orange-500/30"
          viewBox="0 0 48 48"
          fill="none"
          style={{ transform: "scaleX(-1)" }}
        >
          <path d="M0,0 C10,15 5,30 0,30 L0,0 Z" fill="currentColor" />
          <path
            d="M0,0 C20,10 15,35 0,40 L0,0 Z"
            fill="currentColor"
            fillOpacity="0.7"
          />
        </svg>

        <svg
          className="absolute bottom-0 left-0 w-12 h-12 z-30 text-orange-500/30"
          viewBox="0 0 48 48"
          fill="none"
          style={{ transform: "rotate(270deg)" }}
        >
          <path d="M0,0 C10,15 5,30 0,30 L0,0 Z" fill="currentColor" />
          <path
            d="M0,0 C20,10 15,35 0,40 L0,0 Z"
            fill="currentColor"
            fillOpacity="0.7"
          />
        </svg>

        <svg
          className="absolute bottom-0 right-0 w-12 h-12 z-30 text-orange-500/30"
          viewBox="0 0 48 48"
          fill="none"
          style={{ transform: "rotate(180deg)" }}
        >
          <path d="M0,0 C10,15 5,30 0,30 L0,0 Z" fill="currentColor" />
          <path
            d="M0,0 C20,10 15,35 0,40 L0,0 Z"
            fill="currentColor"
            fillOpacity="0.7"
          />
        </svg>
      </div>

      {/* Fire symbol in bottom right */}
      <div className="absolute bottom-1 right-1 w-6 h-6 flex items-center justify-center z-40">
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 text-orange-500/60 fill-current"
        >
          <path
            d="M12,2C6.5,2,2,6.5,2,12s4.5,10,10,10s10-4.5,10-10S17.5,2,12,2z M16,17c-1.1,0-2-0.9-2-2c0-1.2,2-4,2-4s2,2.8,2,4
            C18,16.1,17.1,17,16,17z M10.5,17.5c-0.6,0-1-0.4-1-1c0-0.7,1-2,1-2s1,1.3,1,2C11.5,17,11.1,17.5,10.5,17.5z M8,11
            c-0.6,0-1-0.4-1-1c0-0.6,1-2,1-2s1,1.4,1,2C9,10.6,8.6,11,8,11z M12,10.5c-1.4,0-2.5-1.1-2.5-2.5C9.5,6.4,12,3,12,3s2.5,3.4,2.5,5
            C14.5,9.4,13.4,10.5,12,10.5z"
          />
        </svg>
      </div>

      {/* Fire glow effect */}
      <div className="absolute inset-0 rounded-lg shadow-[0_0_15px_rgba(255,100,0,0.6),inset_0_0_8px_rgba(255,120,0,0.3)] z-30 pointer-events-none"></div>

      {/* Add keyframes for animations */}
      <style jsx global>{`
        @keyframes flicker {
          0% {
            opacity: 0.8;
            transform: scale(0.95);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          100% {
            opacity: 0.8;
            transform: scale(0.95);
          }
        }

        @keyframes ember {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          100% {
            transform: translateY(-20px) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

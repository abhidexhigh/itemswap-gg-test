"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function WaterVariantAbyssal({
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

    // Deep sea particles
    const planktonParticles = [];
    const planktonCount = 40;

    // Jellyfish entities
    const jellyfishes = [];
    const jellyfishCount = 3;

    // Bioluminescent particles
    const bioLumParticles = [];
    const bioLumCount = 15;

    // Air bubbles
    const bubbles = [];
    const bubbleCount = 12;

    // Plankton particle class
    class Plankton {
      constructor() {
        this.reset();
      }

      reset() {
        // Position
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        // Size and shape
        this.size = Math.random() * 2 + 0.5;
        this.shape = Math.random(); // 0-0.5: circle, 0.5-1: line

        // Movement
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.speedY = (Math.random() - 0.5) * 0.2;

        // Drift effect
        this.driftAmplitude = Math.random() * 0.5 + 0.2;
        this.driftFrequency = Math.random() * 0.005 + 0.002;
        this.driftOffset = Math.random() * Math.PI * 2;

        // Appearance
        this.opacity = Math.random() * 0.4 + 0.1;
        this.color =
          Math.random() < 0.8
            ? `rgba(200, 210, 240, ${this.opacity})`
            : `rgba(150, 200, 255, ${this.opacity})`;
      }

      update() {
        // Basic movement
        this.x += this.speedX;
        this.y += this.speedY;

        // Drift horizontally
        this.x +=
          Math.sin(Date.now() * this.driftFrequency + this.driftOffset) *
          this.driftAmplitude *
          0.05;

        // Reset if out of bounds
        if (
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

        ctx.fillStyle = this.color;

        if (this.shape < 0.5) {
          // Circle
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Small line
          ctx.save();
          ctx.translate(this.x, this.y);
          ctx.rotate(Date.now() * 0.001 + this.driftOffset);

          ctx.beginPath();
          ctx.moveTo(-this.size, 0);
          ctx.lineTo(this.size, 0);
          ctx.lineWidth = this.size * 0.5;
          ctx.strokeStyle = this.color;
          ctx.stroke();

          ctx.restore();
        }
      }
    }

    // Jellyfish class
    class Jellyfish {
      constructor() {
        this.reset();
      }

      reset() {
        // Position from bottom
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 20;

        // Size
        this.size = Math.random() * 15 + 8;

        // Movement
        this.speedY = -Math.random() * 0.3 - 0.1; // Upward
        this.speedX = (Math.random() - 0.5) * 0.1; // Slight sideways drift

        // Wobble effect
        this.wobbleAmplitude = Math.random() * 0.8 + 0.2;
        this.wobbleFrequency = Math.random() * 0.01 + 0.005;
        this.wobbleOffset = Math.random() * Math.PI * 2;

        // Pulsing animation
        this.pulseRate = Math.random() * 0.04 + 0.02;
        this.pulseOffset = Math.random() * Math.PI * 2;

        // Appearance
        this.baseOpacity = Math.random() * 0.4 + 0.3;
        this.opacity = this.baseOpacity;

        // Color - bioluminescent colors
        this.colorType = Math.floor(Math.random() * 3);

        switch (this.colorType) {
          case 0: // Blue
            this.bodyColor = `rgba(50, 100, 255, ${this.opacity})`;
            this.glowColor = `rgba(100, 150, 255, ${this.opacity * 0.7})`;
            break;
          case 1: // Purple
            this.bodyColor = `rgba(130, 70, 255, ${this.opacity})`;
            this.glowColor = `rgba(180, 120, 255, ${this.opacity * 0.7})`;
            break;
          case 2: // Teal
            this.bodyColor = `rgba(0, 200, 220, ${this.opacity})`;
            this.glowColor = `rgba(100, 220, 240, ${this.opacity * 0.7})`;
            break;
        }

        // Tentacle properties
        this.tentacleCount = Math.floor(Math.random() * 3) + 4;
        this.tentacleLength = this.size * (Math.random() * 0.5 + 1.5);
      }

      update() {
        // Move jellyfish
        this.y += this.speedY;
        this.x +=
          this.speedX +
          Math.sin(Date.now() * this.wobbleFrequency + this.wobbleOffset) *
            this.wobbleAmplitude *
            0.1;

        // Pulse animation - change opacity and size slightly
        const pulse = Math.sin(Date.now() * this.pulseRate + this.pulseOffset);
        this.opacity = this.baseOpacity * (0.8 + pulse * 0.2);
        this.currentSize = this.size * (0.9 + pulse * 0.1);

        // Reset if off top of screen
        if (this.y < -this.size * 2 - this.tentacleLength) {
          this.reset();
        }
      }

      draw() {
        if (!ctx) return;

        ctx.save();
        ctx.translate(this.x, this.y);

        // Update colors with current opacity
        const bodyOpacity = this.opacity;
        const glowOpacity = this.opacity * 0.7;
        const bodyColor = this.bodyColor.replace(
          /[\d\.]+\)$/,
          `${bodyOpacity})`
        );
        const glowColor = this.glowColor.replace(
          /[\d\.]+\)$/,
          `${glowOpacity})`
        );

        // Draw bell (body)
        ctx.beginPath();

        // Bell shape
        ctx.moveTo(-this.currentSize * 0.8, 0);
        ctx.bezierCurveTo(
          -this.currentSize * 0.8,
          -this.currentSize * 0.8,
          this.currentSize * 0.8,
          -this.currentSize * 0.8,
          this.currentSize * 0.8,
          0
        );

        // Bottom curve of bell
        ctx.bezierCurveTo(
          this.currentSize * 0.5,
          this.currentSize * 0.3,
          -this.currentSize * 0.5,
          this.currentSize * 0.3,
          -this.currentSize * 0.8,
          0
        );

        ctx.closePath();

        // Fill with gradient
        const gradient = ctx.createRadialGradient(
          0,
          -this.currentSize * 0.4,
          0,
          0,
          -this.currentSize * 0.4,
          this.currentSize * 1.2
        );
        gradient.addColorStop(0, glowColor);
        gradient.addColorStop(0.7, bodyColor);
        gradient.addColorStop(1, "rgba(0, 20, 80, 0)");

        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw tentacles
        ctx.strokeStyle = bodyColor;

        for (let i = 0; i < this.tentacleCount; i++) {
          const tentacleX =
            -this.currentSize * 0.7 +
            (i * this.currentSize * 1.4) / (this.tentacleCount - 1);
          const tentacleLength =
            this.tentacleLength *
            (0.8 + Math.sin(Date.now() * 0.002 + i) * 0.2);

          ctx.beginPath();
          ctx.moveTo(tentacleX, this.currentSize * 0.2);

          // Create curvy tentacles
          let curveX = tentacleX;
          let segments = 5;

          for (let j = 0; j <= segments; j++) {
            const t = j / segments;
            const segmentY = this.currentSize * 0.2 + tentacleLength * t;

            // Wiggle amount increases toward end of tentacle
            const wiggleAmount =
              Math.sin(Date.now() * 0.003 + i + j) * this.currentSize * 0.2 * t;
            curveX = tentacleX + wiggleAmount;

            if (j === 0) {
              ctx.lineTo(curveX, segmentY);
            } else {
              ctx.lineTo(curveX, segmentY);
            }
          }

          ctx.lineWidth = this.currentSize * 0.1 * (1 - i / this.tentacleCount);
          ctx.stroke();
        }

        // Add slight glow
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = this.currentSize * 0.8;

        // Redraw center for glow
        ctx.beginPath();
        ctx.arc(
          0,
          -this.currentSize * 0.3,
          this.currentSize * 0.4,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = glowColor;
        ctx.fill();

        ctx.restore();
      }
    }

    // Bioluminescent particle class
    class BioLumParticle {
      constructor() {
        this.reset();
      }

      reset() {
        // Position
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        // Size
        this.radius = Math.random() * 3 + 1.5;

        // Color - bioluminescent
        this.hue =
          Math.random() < 0.5
            ? Math.random() * 40 + 180 // Blue to teal
            : Math.random() * 60 + 260; // Purple to blue
        this.saturation = 80 + Math.random() * 20;
        this.lightness = 50 + Math.random() * 30;

        // Opacity
        this.baseOpacity = Math.random() * 0.4 + 0.1;
        this.opacity = this.baseOpacity;

        // Pulsing
        this.pulseSpeed = Math.random() * 0.02 + 0.005;
        this.pulseOffset = Math.random() * Math.PI * 2;

        // Movement - very slow
        this.speedX = (Math.random() - 0.5) * 0.15;
        this.speedY = (Math.random() - 0.5) * 0.15;
      }

      update() {
        // Very slow movement
        this.x += this.speedX;
        this.y += this.speedY;

        // Pulsing glow
        const pulse = Math.sin(Date.now() * this.pulseSpeed + this.pulseOffset);
        this.opacity = this.baseOpacity * (0.5 + pulse * 0.5);
        this.currentRadius = this.radius * (0.8 + pulse * 0.2);

        // Reset if off-screen
        if (
          this.x < -20 ||
          this.x > canvas.width + 20 ||
          this.y < -20 ||
          this.y > canvas.height + 20
        ) {
          this.reset();
        }
      }

      draw() {
        if (!ctx) return;

        // Draw glowing particle
        ctx.save();

        // Glow effect
        ctx.shadowColor = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.opacity})`;
        ctx.shadowBlur = this.currentRadius * 3;

        // Main light
        ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.currentRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
    }

    // Bubble class
    class Bubble {
      constructor() {
        this.reset();
      }

      reset() {
        // Position from bottom
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 10;

        // Size
        this.radius = Math.random() * 2.5 + 0.8;

        // Movement
        this.speedY = -Math.random() * 0.5 - 0.2; // Upward
        this.speedX = (Math.random() - 0.5) * 0.1; // Slight sideways drift

        // Wobble
        this.wobbleAmplitude = Math.random() * 0.3 + 0.1;
        this.wobbleFrequency = Math.random() * 0.02 + 0.01;
        this.wobbleOffset = Math.random() * Math.PI * 2;

        // Appearance
        this.opacity = Math.random() * 0.4 + 0.1;
      }

      update() {
        // Rise upward
        this.y += this.speedY;

        // Wobble side to side
        this.x +=
          this.speedX +
          Math.sin(Date.now() * this.wobbleFrequency + this.wobbleOffset) *
            this.wobbleAmplitude;

        // Reset if off top of screen
        if (this.y < -10) {
          this.reset();
        }
      }

      draw() {
        if (!ctx) return;

        // Draw bubble
        ctx.strokeStyle = `rgba(200, 230, 255, ${this.opacity})`;
        ctx.lineWidth = 0.5;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();

        // Highlight spot
        ctx.fillStyle = `rgba(220, 240, 255, ${this.opacity * 0.6})`;
        ctx.beginPath();
        ctx.arc(
          this.x - this.radius * 0.3,
          this.y - this.radius * 0.3,
          this.radius * 0.3,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    }

    // Create plankton particles
    for (let i = 0; i < planktonCount; i++) {
      const plankton = new Plankton();
      planktonParticles.push(plankton);
    }

    // Create jellyfishes
    for (let i = 0; i < jellyfishCount; i++) {
      const jellyfish = new Jellyfish();
      // Stagger vertical positions
      jellyfish.y = canvas.height - Math.random() * canvas.height * 1.5;
      jellyfishes.push(jellyfish);
    }

    // Create bioluminescent particles
    for (let i = 0; i < bioLumCount; i++) {
      bioLumParticles.push(new BioLumParticle());
    }

    // Create air bubbles
    for (let i = 0; i < bubbleCount; i++) {
      const bubble = new Bubble();
      // Stagger initial positions
      bubble.y = Math.random() * canvas.height;
      bubbles.push(bubble);
    }

    // Create water current effects
    const drawWaterCurrents = () => {
      if (!ctx) return;

      // Draw subtle currents
      const time = Date.now() * 0.001;

      for (let i = 0; i < 3; i++) {
        const y = canvas.height * (0.2 + i * 0.3);
        const amplitude = 5 + i * 2;
        const wavelength = canvas.width * (0.8 + i * 0.4);
        const speed = 0.2 + i * 0.1;

        ctx.beginPath();

        for (let x = 0; x < canvas.width; x += 5) {
          const waveY =
            y +
            Math.sin((x / wavelength) * Math.PI * 2 + time * speed) * amplitude;

          if (x === 0) {
            ctx.moveTo(x, waveY);
          } else {
            ctx.lineTo(x, waveY);
          }
        }

        ctx.strokeStyle = `rgba(100, 150, 255, ${0.03 - i * 0.005})`;
        ctx.lineWidth = 15 + i * 5;
        ctx.stroke();
      }
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw water currents
      drawWaterCurrents();

      // Draw plankton
      planktonParticles.forEach((plankton) => {
        plankton.update();
        plankton.draw();
      });

      // Draw bubbles
      bubbles.forEach((bubble) => {
        bubble.update();
        bubble.draw();
      });

      // Draw jellyfishes
      jellyfishes.forEach((jellyfish) => {
        jellyfish.update();
        jellyfish.draw();
      });

      // Draw bioluminescent particles on top
      bioLumParticles.forEach((particle) => {
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
      {/* Deep ocean background */}
      <div className="absolute inset-0 bg-blue-950 z-0"></div>

      {/* Deep sea gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-blue-950/60 to-indigo-950/90 z-0"></div>

      {/* Abyssal light shafts */}
      <div
        className="absolute inset-0 opacity-10 z-0"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 30% 5%, rgba(100,150,255,0.3) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 10%, rgba(80,120,255,0.2) 0%, transparent 50%)
          `,
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

          {/* Deep sea vignette */}
          <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,40,0.8)]"></div>

          {/* Underwater lighting effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-indigo-950/30 mix-blend-color"></div>

          {/* Light rays */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(160deg, rgba(120,180,255,0.3) 0%, transparent 40%),
                linear-gradient(200deg, rgba(100,160,255,0.2) 0%, transparent 40%)
              `,
            }}
          ></div>
        </div>
      </div>

      {/* Deep sea frame */}
      <div className="absolute inset-0 border border-blue-800/30 rounded-lg pointer-events-none z-30"></div>

      {/* Pressure resistant frame corners */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-700/40 rounded-tl-lg z-30"></div>
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-700/40 rounded-tr-lg z-30"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-700/40 rounded-bl-lg z-30"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-700/40 rounded-br-lg z-30"></div>

      {/* Bioluminescent glow */}
      <div className="absolute inset-0 rounded-lg shadow-[0_0_10px_rgba(80,150,255,0.2),inset_0_0_10px_rgba(80,150,255,0.2)] z-30 pointer-events-none"></div>
    </div>
  );
}

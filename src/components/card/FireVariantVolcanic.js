"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function FireVariantVolcanic({
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

    // Lava and ember particles
    const embers = [];
    const emberCount = 25;

    // Lava bubbles
    const lavaBubbles = [];
    const bubbleCount = 8;

    // Smoke particles
    const smokeParticles = [];
    const smokeCount = 12;

    // Ember class - glowing particles that float upward
    class Ember {
      constructor() {
        this.reset();
      }

      reset() {
        // Position at bottom of card
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 5;

        // Random upward velocity
        this.speedY = Math.random() * 1.5 - 2.5; // Always moving up
        this.speedX = (Math.random() - 0.5) * 0.7; // Slight horizontal drift

        // Size and appearance
        this.radius = Math.random() * 2.5 + 0.5;
        this.opacity = Math.random() * 0.7 + 0.3;

        // Color variations - from yellow to deep red
        this.hue = Math.random() * 50 + 10; // 10-60 range (red to yellow)
        this.saturation = Math.random() * 30 + 70; // 70-100%
        this.lightness = Math.random() * 20 + 50; // 50-70%

        // Pulsing glow
        this.glowSpeed = Math.random() * 0.05 + 0.02;
        this.glowOffset = Math.random() * Math.PI * 2;

        // Life properties
        this.life = Math.random() * 100 + 100;
        this.maxLife = this.life;
      }

      update() {
        // Move particle
        this.x += this.speedX;
        this.y += this.speedY;

        // Add slight zigzag motion
        this.x += Math.sin(Date.now() * 0.003 + this.glowOffset) * 0.3;

        // Slow down as it rises
        this.speedY *= 0.995;

        // Decrease life
        this.life--;

        // Calculate current radius with pulsing
        const pulse = Math.sin(Date.now() * this.glowSpeed + this.glowOffset);
        this.currentRadius = this.radius * (0.8 + pulse * 0.2);

        // Calculate current opacity based on life
        const lifeRatio = this.life / this.maxLife;
        this.currentOpacity = this.opacity * lifeRatio;

        // Reset when life is over or if off-screen
        if (this.life <= 0 || this.y < -10) {
          this.reset();
        }
      }

      draw() {
        if (!ctx) return;

        // Draw ember particle with glow
        ctx.save();

        // Glow effect
        ctx.shadowColor = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.currentOpacity * 0.7})`;
        ctx.shadowBlur = 10 * this.currentRadius;

        // Main ember
        ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.currentOpacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.currentRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
    }

    // Lava bubble class - bubbles that rise and pop in lava
    class LavaBubble {
      constructor() {
        this.reset();
      }

      reset() {
        // Position in bottom quarter of card
        this.x = Math.random() * canvas.width;
        this.y = canvas.height - Math.random() * (canvas.height / 4);

        // Size and appearance
        this.radius = Math.random() * 5 + 3;
        this.borderWidth = Math.random() * 1 + 0.5;
        this.opacity = Math.random() * 0.3 + 0.2;

        // Rising speed
        this.speed = Math.random() * 0.3 + 0.1;

        // Life and state
        this.life = 0;
        this.maxLife = Math.random() * 100 + 50;
        this.state = "rising"; // 'rising', 'popping'

        // Popping animation
        this.popRadius = this.radius;
        this.popSpeed = this.radius / 10;
      }

      update() {
        if (this.state === "rising") {
          // Rise slowly
          this.y -= this.speed;

          // Add slight horizontal drift
          this.x += Math.sin(this.life * 0.05) * 0.1;

          // Increase life
          this.life++;

          // Start popping when life reaches threshold
          // or when near top of lava area
          if (
            this.life > this.maxLife ||
            this.y < canvas.height - canvas.height / 3
          ) {
            this.state = "popping";
          }
        } else if (this.state === "popping") {
          // Expand and fade out when popping
          this.popRadius += this.popSpeed;
          this.opacity -= 0.05;

          // Reset when completely popped
          if (this.opacity <= 0) {
            this.reset();
          }
        }
      }

      draw() {
        if (!ctx) return;

        if (this.state === "rising") {
          // Draw bubble
          ctx.strokeStyle = `rgba(255, 200, 100, ${this.opacity})`;
          ctx.lineWidth = this.borderWidth;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.stroke();

          // Inner highlight
          const gradient = ctx.createRadialGradient(
            this.x - this.radius * 0.3,
            this.y - this.radius * 0.3,
            0,
            this.x,
            this.y,
            this.radius
          );
          gradient.addColorStop(
            0,
            `rgba(255, 220, 150, ${this.opacity * 0.5})`
          );
          gradient.addColorStop(1, `rgba(255, 160, 60, 0)`);

          ctx.fillStyle = gradient;
          ctx.fill();
        } else if (this.state === "popping") {
          // Draw popping effect
          ctx.strokeStyle = `rgba(255, 200, 100, ${this.opacity})`;
          ctx.lineWidth = this.borderWidth * 0.7;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.popRadius, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    }

    // Smoke particle class
    class SmokeParticle {
      constructor() {
        this.reset();
      }

      reset() {
        // Position near top of card
        this.x = Math.random() * canvas.width;
        this.y = canvas.height / 3 + Math.random() * (canvas.height / 6);

        // Movement
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.speedY = -Math.random() * 0.1 - 0.05; // Slow upward drift

        // Size and appearance
        this.radius = Math.random() * 8 + 4;
        this.opacity = Math.random() * 0.15 + 0.05;

        // Expansion
        this.expansionRate = Math.random() * 0.03 + 0.01;

        // Life
        this.life = Math.random() * 200 + 100;
        this.maxLife = this.life;
      }

      update() {
        // Drift
        this.x += this.speedX;
        this.y += this.speedY;

        // Expand
        this.radius += this.expansionRate;

        // Decrease life
        this.life--;

        // Calculate opacity based on life
        const lifeRatio = this.life / this.maxLife;
        this.currentOpacity = this.opacity * lifeRatio;

        // Reset when life is over or too transparent
        if (this.life <= 0 || this.currentOpacity < 0.01) {
          this.reset();
        }
      }

      draw() {
        if (!ctx) return;

        // Draw smoke cloud
        const gradient = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.radius
        );
        gradient.addColorStop(0, `rgba(80, 70, 60, ${this.currentOpacity})`);
        gradient.addColorStop(
          0.6,
          `rgba(60, 50, 45, ${this.currentOpacity * 0.6})`
        );
        gradient.addColorStop(1, `rgba(50, 40, 40, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Create ember particles
    for (let i = 0; i < emberCount; i++) {
      const ember = new Ember();
      // Stagger initial positions
      ember.life = Math.random() * ember.maxLife;
      ember.y = canvas.height - Math.random() * canvas.height;
      embers.push(ember);
    }

    // Create lava bubbles
    for (let i = 0; i < bubbleCount; i++) {
      const bubble = new LavaBubble();
      // Stagger initial positions and timing
      bubble.life = Math.random() * bubble.maxLife * 0.7;
      lavaBubbles.push(bubble);
    }

    // Create smoke particles
    for (let i = 0; i < smokeCount; i++) {
      const smoke = new SmokeParticle();
      // Stagger initial positions
      smoke.life = Math.random() * smoke.maxLife;
      smokeParticles.push(smoke);
    }

    // Draw lava flow background effect
    const drawLavaBackground = () => {
      if (!ctx) return;

      const time = Date.now() * 0.001;

      // Create base lava gradient
      const baseGradient = ctx.createLinearGradient(
        0,
        canvas.height * 0.6,
        0,
        canvas.height
      );
      baseGradient.addColorStop(0, "rgba(80, 0, 0, 0.5)");
      baseGradient.addColorStop(1, "rgba(180, 30, 0, 0.8)");

      ctx.fillStyle = baseGradient;
      ctx.fillRect(0, canvas.height * 0.6, canvas.width, canvas.height * 0.4);

      // Draw lava flow waves
      const waveCount = 5;
      const waveHeight = canvas.height * 0.05;
      const waveWidth = canvas.width;

      for (let i = 0; i < waveCount; i++) {
        ctx.beginPath();

        // Create wavy pattern
        ctx.moveTo(0, canvas.height * 0.6 - i * 3);

        for (let x = 0; x < canvas.width; x += 20) {
          const y =
            canvas.height * 0.6 -
            i * 3 +
            (Math.sin(x * 0.03 + time + i) * waveHeight * (i + 1)) / waveCount;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();

        // Create color gradient for each wave
        const waveGradient = ctx.createLinearGradient(
          0,
          canvas.height * 0.6,
          0,
          canvas.height
        );

        // Alternate between orange and red tones
        if (i % 2 === 0) {
          waveGradient.addColorStop(
            0,
            `rgba(255, ${100 + i * 20}, 30, ${0.1 + i * 0.02})`
          );
          waveGradient.addColorStop(
            1,
            `rgba(200, ${80 + i * 15}, 0, ${0.15 + i * 0.02})`
          );
        } else {
          waveGradient.addColorStop(
            0,
            `rgba(230, ${70 + i * 15}, 0, ${0.1 + i * 0.02})`
          );
          waveGradient.addColorStop(
            1,
            `rgba(180, ${50 + i * 10}, 0, ${0.15 + i * 0.02})`
          );
        }

        ctx.fillStyle = waveGradient;
        ctx.fill();
      }

      // Add hot spots that pulse
      const hotspotCount = 3;

      for (let i = 0; i < hotspotCount; i++) {
        const x = ((i + 1) * canvas.width) / (hotspotCount + 1);
        const y =
          canvas.height * 0.75 + Math.sin(time * 0.5) * canvas.height * 0.05;
        const radius =
          canvas.width * 0.1 * (0.7 + Math.sin(time * 2 + i) * 0.3);

        const hotspotGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        hotspotGradient.addColorStop(0, "rgba(255, 200, 50, 0.4)");
        hotspotGradient.addColorStop(0.5, "rgba(255, 120, 30, 0.2)");
        hotspotGradient.addColorStop(1, "rgba(200, 50, 0, 0)");

        ctx.fillStyle = hotspotGradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw lava background
      drawLavaBackground();

      // Draw smoke particles
      smokeParticles.forEach((smoke) => {
        smoke.update();
        smoke.draw();
      });

      // Draw lava bubbles
      lavaBubbles.forEach((bubble) => {
        bubble.update();
        bubble.draw();
      });

      // Draw ember particles
      embers.forEach((ember) => {
        ember.update();
        ember.draw();
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
      {/* Dark background */}
      <div className="absolute inset-0 bg-slate-900 z-0"></div>

      {/* Volcanic rock texture overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-stone-900 to-red-950/80 z-0 opacity-80"></div>

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

          {/* Vignette overlay */}
          <div className="absolute inset-0 shadow-[inset_0_0_15px_rgba(0,0,0,0.8)]"></div>

          {/* Heat distortion effect */}
          <div
            className="absolute bottom-0 inset-x-0 h-1/3 opacity-30 mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeDisplacementMap in='SourceGraphic' scale='30'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              animation: "pulse 4s ease-in-out infinite",
            }}
          ></div>
        </div>
      </div>

      {/* Decorative frame */}
      <div className="absolute inset-0 border border-amber-800/40 rounded-lg pointer-events-none z-30"></div>

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-7 h-7 border-t-2 border-l-2 border-orange-600/60 rounded-tl-lg z-30"></div>
      <div className="absolute top-0 right-0 w-7 h-7 border-t-2 border-r-2 border-orange-600/60 rounded-tr-lg z-30"></div>
      <div className="absolute bottom-0 left-0 w-7 h-7 border-b-2 border-l-2 border-orange-600/60 rounded-bl-lg z-30"></div>
      <div className="absolute bottom-0 right-0 w-7 h-7 border-b-2 border-r-2 border-orange-600/60 rounded-br-lg z-30"></div>

      {/* Glowing edges */}
      <div className="absolute inset-0 rounded-lg shadow-[0_0_8px_rgba(255,120,30,0.4),inset_0_0_8px_rgba(255,120,30,0.4)] z-30 pointer-events-none"></div>

      {/* Add a keyframe animation for the heat distortion effect */}
      <style jsx global>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.4;
          }
        }
      `}</style>
    </div>
  );
}

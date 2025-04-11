"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function EarthVariantMountain({
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

    // Dust particles
    const dustParticles = [];
    const dustCount = 30;

    // Floating rocks
    const floatingRocks = [];
    const rockCount = 8;

    // Falling pebbles
    const fallingPebbles = [];
    const pebbleCount = 12;

    // Dust particle class
    class DustParticle {
      constructor() {
        this.reset();
      }

      reset() {
        // Position
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        // Size and appearance
        this.radius = Math.random() * 1.5 + 0.5;
        this.opacity = Math.random() * 0.3 + 0.1;

        // Colors - earthy tones
        this.hue = Math.random() * 30 + 30; // Brown to orange
        this.saturation = Math.random() * 30 + 10;
        this.lightness = Math.random() * 20 + 60;

        // Movement
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.speedY = (Math.random() - 0.5) * 0.2;

        // Drift effect
        this.driftAmplitude = Math.random() * 0.5 + 0.2;
        this.driftFrequency = Math.random() * 0.005 + 0.002;
        this.driftOffset = Math.random() * Math.PI * 2;
      }

      update() {
        // Basic movement
        this.x += this.speedX;
        this.y += this.speedY;

        // Drift effect
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

        ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Floating rock class
    class FloatingRock {
      constructor() {
        this.reset();
      }

      reset() {
        // Position
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        // Size and shape
        this.size = Math.random() * 10 + 5;
        this.pointCount = Math.floor(Math.random() * 3) + 5; // 5-7 points
        this.points = this.generateShape();

        // Movement - very slow floating
        this.speedX = (Math.random() - 0.5) * 0.1;
        this.speedY = (Math.random() - 0.5) * 0.1;

        // Rotation
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.002;

        // Color
        this.colorIndex = Math.floor(Math.random() * 3);

        // Colors - stone variants
        switch (this.colorIndex) {
          case 0: // Gray stone
            this.color = `rgba(100, 100, 105, 0.4)`;
            this.strokeColor = `rgba(80, 80, 85, 0.5)`;
            break;
          case 1: // Brown stone
            this.color = `rgba(120, 90, 70, 0.4)`;
            this.strokeColor = `rgba(90, 70, 50, 0.5)`;
            break;
          case 2: // Slate blue
            this.color = `rgba(70, 80, 100, 0.4)`;
            this.strokeColor = `rgba(50, 60, 80, 0.5)`;
            break;
        }

        // Lifespan
        this.lifeTime = Math.random() * 300 + 200;
        this.maxLife = this.lifeTime;
      }

      generateShape() {
        const points = [];
        for (let i = 0; i < this.pointCount; i++) {
          const angle = (i / this.pointCount) * Math.PI * 2;
          const radius = this.size * (0.7 + Math.random() * 0.3); // Varying radius
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          points.push({ x, y });
        }
        return points;
      }

      update() {
        // Slow movement
        this.x += this.speedX;
        this.y += this.speedY;

        // Rotation
        this.rotation += this.rotationSpeed;

        // Decrease life
        this.lifeTime--;

        // Reset if off-screen or life ends
        if (
          this.x < -this.size * 2 ||
          this.x > canvas.width + this.size * 2 ||
          this.y < -this.size * 2 ||
          this.y > canvas.height + this.size * 2 ||
          this.lifeTime <= 0
        ) {
          this.reset();
        }
      }

      draw() {
        if (!ctx) return;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // Draw rock shape
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);

        for (let i = 1; i < this.pointCount; i++) {
          ctx.lineTo(this.points[i].x, this.points[i].y);
        }

        ctx.closePath();

        // Set opacity based on remaining life
        const opacity = this.lifeTime / this.maxLife;
        const fillColor = this.color.replace(/[\d\.]+\)$/, `${opacity * 0.4})`);
        const strokeColor = this.strokeColor.replace(
          /[\d\.]+\)$/,
          `${opacity * 0.5})`
        );

        // Fill and stroke
        ctx.fillStyle = fillColor;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 1;

        ctx.fill();
        ctx.stroke();

        // Add crack detail for larger rocks
        if (this.size > 8) {
          ctx.beginPath();
          ctx.moveTo(this.points[0].x * 0.3, this.points[0].y * 0.3);

          // Random zigzag line
          for (let i = 1; i < 4; i++) {
            const x = (Math.random() - 0.5) * this.size * 0.8;
            const y = (Math.random() - 0.5) * this.size * 0.8;
            ctx.lineTo(x, y);
          }

          ctx.strokeStyle = this.strokeColor.replace(
            /[\d\.]+\)$/,
            `${opacity * 0.3})`
          );
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }

        ctx.restore();
      }
    }

    // Falling pebble class
    class FallingPebble {
      constructor() {
        this.reset();
      }

      reset() {
        // Start from top
        this.x = Math.random() * canvas.width;
        this.y = -10;

        // Size and appearance
        this.size = Math.random() * 3 + 1;
        this.type = Math.floor(Math.random() * 2); // 0 = circle, 1 = square-ish

        // Movement
        this.speedY = Math.random() * 0.8 + 0.3;
        this.speedX = (Math.random() - 0.5) * 0.3;

        // Rotation
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.05;

        // Color - stone variants
        this.colorIndex = Math.floor(Math.random() * 3);

        switch (this.colorIndex) {
          case 0: // Gray
            this.color = `rgba(120, 120, 125, 0.7)`;
            break;
          case 1: // Brown
            this.color = `rgba(130, 100, 70, 0.7)`;
            break;
          case 2: // Dark gray
            this.color = `rgba(90, 90, 95, 0.7)`;
            break;
        }
      }

      update() {
        // Fall down
        this.y += this.speedY;
        this.x += this.speedX;

        // Rotate
        this.rotation += this.rotationSpeed;

        // Reset if off bottom
        if (this.y > canvas.height + 10) {
          this.reset();
        }
      }

      draw() {
        if (!ctx) return;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        ctx.fillStyle = this.color;

        if (this.type === 0) {
          // Circle pebble
          ctx.beginPath();
          ctx.arc(0, 0, this.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Angular pebble
          ctx.beginPath();

          const points = 4; // Square-ish shape
          for (let i = 0; i < points; i++) {
            const angle = (i / points) * Math.PI * 2;
            const radius = this.size * (0.8 + Math.random() * 0.4);
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }

          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      }
    }

    // Create dust particles
    for (let i = 0; i < dustCount; i++) {
      const dust = new DustParticle();
      dustParticles.push(dust);
    }

    // Create floating rocks
    for (let i = 0; i < rockCount; i++) {
      const rock = new FloatingRock();
      // Stagger lifetimes
      rock.lifeTime = Math.random() * rock.maxLife;
      floatingRocks.push(rock);
    }

    // Create falling pebbles
    for (let i = 0; i < pebbleCount; i++) {
      const pebble = new FallingPebble();
      // Distribute initial positions
      pebble.y = Math.random() * canvas.height;
      fallingPebbles.push(pebble);
    }

    // Draw mountain terrain background
    const drawMountainBackground = () => {
      if (!ctx) return;

      // Mountain silhouettes (3 layers)
      const mountainLayers = 3;

      for (let i = 0; i < mountainLayers; i++) {
        const yPosition = canvas.height * (0.4 + i * 0.2);
        const amplitude = 20 - i * 5;
        const frequency = 0.02 + i * 0.01;
        const opacity = 0.15 - i * 0.03;

        // Create mountain range path
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);

        // Generate mountain ridge
        for (let x = 0; x <= canvas.width; x += 5) {
          const noise1 = Math.sin(x * frequency) * amplitude;
          const noise2 = Math.sin(x * frequency * 2 + 1) * amplitude * 0.5;
          const y = yPosition + noise1 + noise2;

          ctx.lineTo(x, y);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();

        // Fill mountains with gradient
        const gradient = ctx.createLinearGradient(
          0,
          yPosition - amplitude,
          0,
          canvas.height
        );

        if (i === 0) {
          // Front mountains - more detailed
          gradient.addColorStop(0, `rgba(100, 80, 60, ${opacity + 0.05})`);
          gradient.addColorStop(0.4, `rgba(80, 70, 60, ${opacity})`);
          gradient.addColorStop(1, `rgba(70, 60, 50, ${opacity - 0.05})`);
        } else {
          // Background mountains - bluer with distance
          gradient.addColorStop(0, `rgba(80, 90, 100, ${opacity})`);
          gradient.addColorStop(0.6, `rgba(70, 80, 100, ${opacity - 0.02})`);
          gradient.addColorStop(1, `rgba(60, 70, 90, ${opacity - 0.05})`);
        }

        ctx.fillStyle = gradient;
        ctx.fill();
      }
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw mountain background
      drawMountainBackground();

      // Update and draw floating rocks
      floatingRocks.forEach((rock) => {
        rock.update();
        rock.draw();
      });

      // Update and draw dust particles
      dustParticles.forEach((dust) => {
        dust.update();
        dust.draw();
      });

      // Update and draw falling pebbles
      fallingPebbles.forEach((pebble) => {
        pebble.update();
        pebble.draw();
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
      {/* Earth/mountain background */}
      <div className="absolute inset-0 bg-stone-800 z-0"></div>

      {/* Mountain gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-700/40 via-stone-800/60 to-stone-900 z-0"></div>

      {/* Rock texture overlay */}
      <div
        className="absolute inset-0 opacity-20 z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E")`,
          backgroundSize: "100px 100px",
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

          {/* Stone vignette overlay */}
          <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(20,10,0,0.6)]"></div>

          {/* Subtle rocky texture overlay */}
          <div
            className="absolute inset-0 opacity-10 mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              backgroundSize: "120% 120%",
            }}
          ></div>
        </div>
      </div>

      {/* Rock frame */}
      <div className="absolute inset-0 border border-stone-600/30 rounded-lg pointer-events-none z-30"></div>

      {/* Stone corners */}
      <div className="absolute top-0 left-0 w-7 h-7 border-t-2 border-l-2 border-amber-800/30 rounded-tl-lg z-30"></div>
      <div className="absolute top-0 right-0 w-7 h-7 border-t-2 border-r-2 border-amber-800/30 rounded-tr-lg z-30"></div>
      <div className="absolute bottom-0 left-0 w-7 h-7 border-b-2 border-l-2 border-amber-800/30 rounded-bl-lg z-30"></div>
      <div className="absolute bottom-0 right-0 w-7 h-7 border-b-2 border-r-2 border-amber-800/30 rounded-br-lg z-30"></div>

      {/* Subtle earth glow */}
      <div className="absolute inset-0 rounded-lg shadow-[0_0_8px_rgba(160,120,80,0.15),inset_0_0_8px_rgba(160,120,80,0.15)] z-30 pointer-events-none"></div>
    </div>
  );
}

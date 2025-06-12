"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function NatureVariantJungle({
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

    // Jungle particles
    const leaves = [];
    const leafCount = 15;

    // Fireflies
    const fireflies = [];
    const fireflyCount = 8;

    // Butterflies
    const butterflies = [];
    const butterflyCount = 3;

    // Leaf class for falling leaves
    class Leaf {
      constructor() {
        this.reset();
      }

      reset() {
        // Position - start from top
        this.x = Math.random() * canvas.width;
        this.y = -20;

        // Size
        this.size = Math.random() * 8 + 4;

        // Type - different leaf shapes
        this.type = Math.floor(Math.random() * 4);

        // Color - greens and autumn colors
        this.colorType = Math.random() < 0.7 ? "green" : "autumn";

        if (this.colorType === "green") {
          this.hue = 90 + Math.random() * 40; // Green hues
          this.saturation = 60 + Math.random() * 40;
          this.lightness = 20 + Math.random() * 30;
        } else {
          this.hue = 20 + Math.random() * 30; // Autumn hues
          this.saturation = 70 + Math.random() * 30;
          this.lightness = 30 + Math.random() * 20;
        }

        // Movement
        this.speedY = Math.random() * 0.5 + 0.3;
        this.speedX = (Math.random() - 0.5) * 0.3;

        // Rotation
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.05;

        // Swing motion
        this.swingOffset = Math.random() * Math.PI * 2;
        this.swingSpeed = Math.random() * 0.02 + 0.01;
        this.swingAmplitude = Math.random() * 1.5 + 0.5;

        // Opacity
        this.opacity = Math.random() * 0.6 + 0.4;
      }

      update() {
        // Fall with gravity
        this.y += this.speedY;

        // Horizontal movement with swinging
        this.x +=
          this.speedX +
          Math.sin(Date.now() * this.swingSpeed + this.swingOffset) *
            this.swingAmplitude;

        // Rotation
        this.rotation += this.rotationSpeed;

        // Reset if off screen
        if (
          this.y > canvas.height + 20 ||
          this.x < -20 ||
          this.x > canvas.width + 20
        ) {
          this.reset();
        }
      }

      draw() {
        if (!ctx) return;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // Set color
        ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.opacity})`;
        ctx.strokeStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness - 10}%, ${this.opacity * 0.8})`;
        ctx.lineWidth = 0.5;

        // Draw different leaf shapes
        switch (this.type) {
          case 0: // Simple oval leaf
            ctx.beginPath();
            ctx.ellipse(0, 0, this.size * 0.5, this.size, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Leaf vein
            ctx.beginPath();
            ctx.moveTo(0, -this.size);
            ctx.lineTo(0, this.size);
            ctx.strokeStyle = `hsla(${this.hue}, ${this.saturation - 20}%, ${this.lightness - 20}%, ${this.opacity * 0.6})`;
            ctx.stroke();
            break;

          case 1: // Heart-shaped leaf
            ctx.beginPath();
            ctx.moveTo(0, this.size * 0.7);
            ctx.bezierCurveTo(
              this.size * 0.6,
              0,
              this.size,
              -this.size * 0.7,
              0,
              -this.size * 0.7
            );
            ctx.bezierCurveTo(
              -this.size,
              -this.size * 0.7,
              -this.size * 0.6,
              0,
              0,
              this.size * 0.7
            );
            ctx.fill();
            ctx.stroke();
            break;

          case 2: // Maple leaf (simplified)
            ctx.beginPath();

            for (let i = 0; i < 5; i++) {
              const angle = (i * Math.PI * 2) / 5;
              const x1 = Math.cos(angle) * this.size * 0.7;
              const y1 = Math.sin(angle) * this.size * 0.7;
              const x2 = Math.cos(angle + Math.PI / 5) * this.size * 0.7;
              const y2 = Math.sin(angle + Math.PI / 5) * this.size * 0.7;

              ctx.moveTo(0, 0);
              ctx.lineTo(x1, y1);
              ctx.lineTo(x2, y2);
              ctx.lineTo(0, 0);
            }

            ctx.fill();
            ctx.stroke();
            break;

          case 3: // Simple round leaf
            ctx.beginPath();
            ctx.arc(0, 0, this.size * 0.6, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Leaf stem
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, this.size);
            ctx.strokeStyle = `hsla(${this.hue - 10}, ${this.saturation - 20}%, ${this.lightness - 20}%, ${this.opacity * 0.7})`;
            ctx.stroke();
            break;
        }

        ctx.restore();
      }
    }

    // Firefly class
    class Firefly {
      constructor() {
        this.reset();
      }

      reset() {
        // Position randomly in the lower half of card
        this.x = Math.random() * canvas.width;
        this.y = canvas.height * 0.4 + Math.random() * (canvas.height * 0.6);

        // Size and appearance
        this.radius = Math.random() * 1.5 + 0.5;
        this.baseOpacity = Math.random() * 0.4 + 0.4;
        this.opacity = this.baseOpacity;

        // Color - yellow with slight variation
        this.hue = 50 + Math.random() * 20; // Yellow-green
        this.saturation = 70 + Math.random() * 30;
        this.lightness = 60 + Math.random() * 20;

        // Movement
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;

        // Pulsing glow
        this.pulseSpeed = Math.random() * 0.05 + 0.02;
        this.pulseOffset = Math.random() * Math.PI * 2;

        // Direction changes
        this.directionChangeInterval = Math.random() * 100 + 50;
        this.directionTimer = 0;
      }

      update() {
        // Move firefly
        this.x += this.speedX;
        this.y += this.speedY;

        // Pulse glow
        const pulse = Math.sin(Date.now() * this.pulseSpeed + this.pulseOffset);
        this.opacity = this.baseOpacity * (0.5 + pulse * 0.5);

        // Occasionally change direction
        this.directionTimer++;
        if (this.directionTimer > this.directionChangeInterval) {
          this.speedX = (Math.random() - 0.5) * 0.4;
          this.speedY = (Math.random() - 0.5) * 0.4;
          this.directionTimer = 0;
          this.directionChangeInterval = Math.random() * 100 + 50;
        }

        // Keep in bounds
        if (this.x < 0) this.x = 0;
        if (this.x > canvas.width) this.x = canvas.width;
        if (this.y < canvas.height * 0.3) this.y = canvas.height * 0.3;
        if (this.y > canvas.height) this.y = canvas.height;
      }

      draw() {
        if (!ctx) return;

        // Draw glowing firefly
        ctx.save();

        // Glow effect
        ctx.shadowColor = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.opacity})`;
        ctx.shadowBlur = this.radius * 4;

        // Main light
        ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
    }

    // Butterfly class
    class Butterfly {
      constructor() {
        this.reset();
      }

      reset() {
        // Position
        this.x = Math.random() < 0.5 ? -20 : canvas.width + 20;
        this.y = canvas.height * 0.3 + Math.random() * (canvas.height * 0.4);

        // Size
        this.size = Math.random() * 5 + 3;

        // Color - vibrant tropical colors
        this.colorType = Math.floor(Math.random() * 4);

        switch (this.colorType) {
          case 0: // Blue morpho
            this.wingColor = "hsla(220, 90%, 60%, 0.7)";
            this.bodyColor = "hsla(220, 70%, 20%, 0.8)";
            break;
          case 1: // Orange monarch
            this.wingColor = "hsla(30, 90%, 50%, 0.7)";
            this.bodyColor = "hsla(0, 0%, 10%, 0.8)";
            break;
          case 2: // Vibrant green
            this.wingColor = "hsla(120, 70%, 45%, 0.7)";
            this.bodyColor = "hsla(120, 70%, 15%, 0.8)";
            break;
          case 3: // Purple-pink
            this.wingColor = "hsla(290, 70%, 60%, 0.7)";
            this.bodyColor = "hsla(290, 70%, 20%, 0.8)";
            break;
        }

        // Movement
        this.speedX =
          this.x < 0 ? Math.random() * 0.5 + 0.3 : -Math.random() * 0.5 - 0.3;
        this.speedY = (Math.random() - 0.5) * 0.2;

        // Wing flapping
        this.wingAngle = 0;
        this.wingSpeed = Math.random() * 0.2 + 0.1;

        // Path oscillation
        this.pathAmplitude = Math.random() * 10 + 5;
        this.pathFrequency = Math.random() * 0.02 + 0.01;
        this.pathOffset = Math.random() * Math.PI * 2;
      }

      update() {
        // Move forward
        this.x += this.speedX;

        // Oscillate up and down for natural flight
        this.y +=
          this.speedY +
          Math.sin(Date.now() * this.pathFrequency + this.pathOffset) * 0.3;

        // Flap wings
        this.wingAngle = Math.sin(Date.now() * this.wingSpeed) * 0.6;

        // Reset if off-screen
        if (
          (this.speedX > 0 && this.x > canvas.width + 20) ||
          (this.speedX < 0 && this.x < -20) ||
          this.y < -20 ||
          this.y > canvas.height + 20
        ) {
          this.reset();
        }
      }

      draw() {
        if (!ctx) return;

        ctx.save();
        ctx.translate(this.x, this.y);

        // Draw wings
        ctx.fillStyle = this.wingColor;

        // Right wing
        ctx.save();
        ctx.rotate(this.wingAngle);
        ctx.beginPath();
        ctx.ellipse(
          this.size * 0.5,
          0,
          this.size,
          this.size * 0.7,
          0,
          0,
          Math.PI * 2
        );
        ctx.fill();
        ctx.restore();

        // Left wing
        ctx.save();
        ctx.rotate(-this.wingAngle);
        ctx.beginPath();
        ctx.ellipse(
          -this.size * 0.5,
          0,
          this.size,
          this.size * 0.7,
          0,
          0,
          Math.PI * 2
        );
        ctx.fill();
        ctx.restore();

        // Body
        ctx.fillStyle = this.bodyColor;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size * 0.15, this.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
    }

    // Create falling leaves
    for (let i = 0; i < leafCount; i++) {
      const leaf = new Leaf();
      // Distribute initial positions
      leaf.y = Math.random() * canvas.height;
      leaves.push(leaf);
    }

    // Create fireflies
    for (let i = 0; i < fireflyCount; i++) {
      fireflies.push(new Firefly());
    }

    // Create butterflies
    for (let i = 0; i < butterflyCount; i++) {
      const butterfly = new Butterfly();
      butterfly.x = Math.random() * canvas.width; // Initial position inside canvas
      butterflies.push(butterfly);
    }

    // Draw jungle vines
    const drawVines = () => {
      if (!ctx) return;

      // Draw several vines
      const vineCount = 4;

      for (let i = 0; i < vineCount; i++) {
        const startX = ((i + 1) * canvas.width) / (vineCount + 1);
        const startY = 0;

        // Vine color
        const hue = 100 + Math.random() * 40;
        const saturation = 30 + Math.random() * 20;
        const lightness = 20 + Math.random() * 20;

        ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.6)`;
        ctx.lineWidth = Math.random() * 1.5 + 0.5;

        // Draw the main vine
        ctx.beginPath();
        ctx.moveTo(startX, startY);

        // Create a wavy vine
        const segments = 10;
        const amplitude = 5 + Math.random() * 10;
        const frequency = 0.1 + Math.random() * 0.1;
        const timeOffset = Date.now() * 0.0005 * (i + 1);

        for (let j = 1; j <= segments; j++) {
          const y = (canvas.height * j) / segments;
          const waveOffset = Math.sin(j * frequency + timeOffset) * amplitude;
          const x = startX + waveOffset;

          ctx.lineTo(x, y);
        }

        ctx.stroke();

        // Add small leaves to the vine
        const leafCount = Math.floor(Math.random() * 3) + 2;

        for (let j = 0; j < leafCount; j++) {
          const leafY = (canvas.height * (j + 1)) / (leafCount + 1);
          const segmentIndex = Math.floor(
            (segments * (j + 1)) / (leafCount + 1)
          );
          const waveOffset =
            Math.sin(segmentIndex * frequency + timeOffset) * amplitude;
          const leafX = startX + waveOffset;

          // Draw a small leaf
          ctx.fillStyle = `hsla(${hue + 10}, ${saturation + 20}%, ${lightness + 10}%, 0.7)`;
          ctx.save();
          ctx.translate(leafX, leafY);
          ctx.rotate(Math.PI * 0.25 * (j % 2 === 0 ? 1 : -1));

          // Leaf shape
          ctx.beginPath();
          ctx.ellipse(0, 0, 3, 6, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }
      }
    };

    // Animate jungle scene
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw vines first
      drawVines();

      // Draw butterflies
      butterflies.forEach((butterfly) => {
        butterfly.update();
        butterfly.draw();
      });

      // Draw leaves
      leaves.forEach((leaf) => {
        leaf.update();
        leaf.draw();
      });

      // Draw fireflies on top
      fireflies.forEach((firefly) => {
        firefly.update();
        firefly.draw();
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
      {/* Base background - deep jungle green */}
      <div className="absolute inset-0 bg-green-950 z-0"></div>

      {/* Jungle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-900/40 via-green-950 to-green-950/90 z-0"></div>

      {/* Soft light beams */}
      <div
        className="absolute inset-0 opacity-30 z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 30% 30%, rgba(200,255,180,0.1) 0%, transparent 40%),
            radial-gradient(circle at 70% 60%, rgba(180,255,200,0.1) 0%, transparent 40%)
          `,
        }}
      ></div>

      {/* Foliage texture */}
      <div
        className="absolute inset-0 opacity-20 z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath fill='%23308030' opacity='0.1' d='M0,0 L50,50 L0,100 Z'/%3E%3Cpath fill='%23206020' opacity='0.1' d='M100,0 L50,50 L100,100 Z'/%3E%3C/svg%3E")`,
          backgroundSize: "30px 30px",
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

          {/* Jungle vignette overlay */}
          <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,20,0,0.7)]"></div>

          {/* Leaf overlay shadows */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                radial-gradient(ellipse at 20% 10%, transparent 0%, rgba(0,0,0,0.2) 60%, transparent 75%),
                radial-gradient(ellipse at 80% 30%, transparent 0%, rgba(0,0,0,0.2) 60%, transparent 75%),
                radial-gradient(ellipse at 40% 90%, transparent 0%, rgba(0,0,0,0.2) 60%, transparent 75%)
              `,
            }}
          ></div>
        </div>
      </div>

      {/* Organic frame */}
      <div className="absolute inset-0 border border-green-700/40 rounded-lg pointer-events-none z-30"></div>

      {/* Leafy corners */}
      <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-green-500/60 rounded-tl-lg z-30"></div>
      <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-green-500/60 rounded-tr-lg z-30"></div>
      <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-green-500/60 rounded-bl-lg z-30"></div>
      <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-green-500/60 rounded-br-lg z-30"></div>

      {/* Leaf accent in corner */}
      <div
        className="absolute top-0 left-0 w-8 h-8 z-30 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 0 0, rgba(50,200,50,0.2), transparent 80%)",
        }}
      ></div>

      {/* Subtle green glow */}
      <div className="absolute inset-0 rounded-lg shadow-[0_0_8px_rgba(50,200,100,0.2),inset_0_0_8px_rgba(50,200,100,0.2)] z-30 pointer-events-none"></div>
    </div>
  );
}

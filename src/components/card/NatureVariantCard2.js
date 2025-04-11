"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function NatureVariantCard2({
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

    // Leaves particles
    const leaves = [];
    const leafCount = 15;

    // Leaf shapes
    const leafShapes = [
      // Simple oval leaf
      (ctx, x, y, size) => {
        ctx.beginPath();
        ctx.ellipse(x, y, size * 0.7, size * 1.2, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();

        // Leaf vein
        ctx.beginPath();
        ctx.moveTo(x - size * 0.5, y - size * 0.5);
        ctx.lineTo(x + size * 0.5, y + size * 0.5);
        ctx.stroke();
      },

      // Round leaf
      (ctx, x, y, size) => {
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();

        // Cross veins
        ctx.beginPath();
        ctx.moveTo(x - size * 0.7, y);
        ctx.lineTo(x + size * 0.7, y);
        ctx.moveTo(x, y - size * 0.7);
        ctx.lineTo(x, y + size * 0.7);
        ctx.stroke();
      },

      // Heart-shaped leaf
      (ctx, x, y, size) => {
        const s = size * 0.8;
        ctx.beginPath();
        ctx.moveTo(x, y + s);
        ctx.bezierCurveTo(x - s * 2, y, x - s * 2, y - s * 2, x, y - s);
        ctx.bezierCurveTo(x + s * 2, y - s * 2, x + s * 2, y, x, y + s);
        ctx.fill();

        // Central vein
        ctx.beginPath();
        ctx.moveTo(x, y - s);
        ctx.lineTo(x, y + s);
        ctx.stroke();
      },
    ];

    class Leaf {
      constructor() {
        this.reset();
      }

      reset() {
        // Position at random top positions
        this.x = Math.random() * canvas.width;
        this.y = -5;

        // Size and rotation
        this.size = Math.random() * 2.5 + 1.5;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.05;

        // Movement
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = Math.random() * 0.5 + 0.3;
        this.waveMagnitude = Math.random() * 0.8 + 0.2;
        this.waveSpeed = Math.random() * 0.02 + 0.01;
        this.waveOffset = Math.random() * Math.PI * 2;

        // Appearance
        this.shape = Math.floor(Math.random() * leafShapes.length);
        this.opacity = Math.random() * 0.4 + 0.2;

        // Select a green color variant
        const greenVariants = [
          `rgba(50, 120, 50, ${this.opacity})`, // Forest green
          `rgba(100, 160, 50, ${this.opacity})`, // Lime green
          `rgba(30, 100, 30, ${this.opacity})`, // Deep green
          `rgba(70, 140, 70, ${this.opacity})`, // Bright green
        ];

        this.color =
          greenVariants[Math.floor(Math.random() * greenVariants.length)];
        this.strokeColor = this.color.replace(
          /[\d\.]+\)$/,
          `${this.opacity * 0.8})`
        );
      }

      update() {
        // Falling movement
        this.y += this.speedY;

        // Side-to-side motion like falling leaves
        this.x +=
          this.speedX +
          Math.sin(Date.now() * this.waveSpeed + this.waveOffset) *
            this.waveMagnitude;

        // Rotation
        this.rotation += this.rotationSpeed;

        // Reset when off screen
        if (
          this.y > canvas.height + 10 ||
          this.x < -10 ||
          this.x > canvas.width + 10
        ) {
          this.reset();
        }
      }

      draw() {
        if (!ctx) return;

        ctx.save();

        // Translate and rotate
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // Draw leaf
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = 0.5;

        leafShapes[this.shape](ctx, 0, 0, this.size);

        ctx.restore();
      }
    }

    // Growing vines at the bottom and sides
    const drawVines = () => {
      if (!ctx) return;

      const time = Date.now() * 0.001;

      // Bottom vines
      const numBottomVines = 3;
      for (let i = 0; i < numBottomVines; i++) {
        const startX = (canvas.width / (numBottomVines + 1)) * (i + 1);
        const startY = canvas.height;
        const height = 15 + Math.sin(time + i) * 3;
        const curl = Math.sin(time * 0.5 + i * 2) * 5;

        ctx.strokeStyle = "rgba(30, 120, 30, 0.6)";
        ctx.lineWidth = 1.5;

        // Main vine
        ctx.beginPath();
        ctx.moveTo(startX, startY);

        // Bezier curve for natural vine look
        ctx.bezierCurveTo(
          startX + curl,
          startY - height * 0.3,
          startX + curl,
          startY - height * 0.7,
          startX,
          startY - height
        );

        ctx.stroke();

        // Add small leaves on the vine
        const leafPositions = [0.3, 0.6, 0.9];
        leafPositions.forEach((pos) => {
          const leafX = startX + curl * pos;
          const leafY = startY - height * pos;

          ctx.fillStyle = "rgba(50, 130, 50, 0.5)";
          ctx.beginPath();
          ctx.ellipse(
            leafX,
            leafY,
            2,
            3,
            Math.PI / 4 + Math.sin(time + i + pos) * 0.5,
            0,
            Math.PI * 2
          );
          ctx.fill();
        });
      }

      // Side vines (left and right)
      const sidePositions = [
        { x: 0, y: canvas.height * 0.7, direction: 1 },
        { x: canvas.width, y: canvas.height * 0.3, direction: -1 },
      ];

      sidePositions.forEach((pos, i) => {
        const length = 12 + Math.sin(time + i) * 4;
        const curl = Math.sin(time * 0.7 + i * 1.5) * 4;

        ctx.strokeStyle = "rgba(30, 130, 30, 0.5)";
        ctx.lineWidth = 1.2;

        // Main vine
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);

        // Bezier curve for natural vine look
        ctx.bezierCurveTo(
          pos.x + length * 0.3 * pos.direction,
          pos.y + curl,
          pos.x + length * 0.7 * pos.direction,
          pos.y + curl,
          pos.x + length * pos.direction,
          pos.y
        );

        ctx.stroke();

        // Add small leaves
        const leafPos = 0.6;
        const leafX = pos.x + length * leafPos * pos.direction;
        const leafY = pos.y + curl * leafPos;

        ctx.fillStyle = "rgba(60, 140, 60, 0.5)";
        ctx.beginPath();
        ctx.ellipse(
          leafX,
          leafY,
          2,
          3,
          pos.direction > 0 ? Math.PI / 4 : -Math.PI / 4,
          0,
          Math.PI * 2
        );
        ctx.fill();
      });
    };

    // Initialize leaves
    for (let i = 0; i < leafCount; i++) {
      const leaf = new Leaf();
      // Stagger initial positions
      leaf.y = Math.random() * canvas.height;
      leaves.push(leaf);
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw falling leaves
      leaves.forEach((leaf) => {
        leaf.update();
        leaf.draw();
      });

      // Draw growing vines
      drawVines();

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

      {/* Nature themed background */}
      <div className="absolute inset-0 bg-gray-900 z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-green-950/30 to-green-900/20 z-0"></div>

      {/* Subtle forest-floor texture */}
      <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-green-900/30 to-transparent z-0"></div>

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

          {/* Natural vignette around the edges */}
          <div className="absolute inset-0 shadow-[inset_0_0_10px_rgba(0,0,0,0.4)]"></div>

          {/* Subtle leafy overlay in corners */}
          <div className="absolute top-0 left-0 w-10 h-10 bg-gradient-to-br from-green-900/15 to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-tl from-green-900/15 to-transparent"></div>
        </div>
      </div>

      {/* Natural border */}
      <div className="absolute inset-0 border border-green-800/60 rounded-lg pointer-events-none z-30"></div>

      {/* Corner accents that look like leaves/vines */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-green-700/80 rounded-tl-lg z-30"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-green-700/80 rounded-tr-lg z-30"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-green-700/80 rounded-bl-lg z-30"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-green-700/80 rounded-br-lg z-30"></div>
    </div>
  );
}

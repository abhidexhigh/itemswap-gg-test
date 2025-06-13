"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function MistyFlowCard({
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

    // Mist parameters
    const mistLayerCount = 4;
    const mistLayers = [];

    // Animation timing
    let lastTime = 0;
    let elapsedTime = 0;

    class MistLayer {
      constructor(depth) {
        this.depth = depth; // 0 = closest, 1 = furthest
        this.reset();
      }

      reset() {
        // Generate noise
        this.noiseOffset = Math.random() * 1000;

        // Layer position - focuses at bottom of card
        this.heightRatio = 0.3 + this.depth * 0.2; // How much of the canvas height to cover
        this.y = canvas.height * (1 - this.heightRatio);

        // Movement
        this.speed =
          (0.01 + this.depth * 0.01) * (Math.random() > 0.5 ? 1 : -1); // Very slow movement
        this.x = 0;

        // Appearance
        this.opacity = 0.15 - this.depth * 0.05; // More transparent in back
        this.color = {
          r: 220 + this.depth * 20, // Whiter in back
          g: 225 + this.depth * 20,
          b: 235 + this.depth * 15,
        };

        // Wave parameters
        this.waveFrequency = 0.01 + this.depth * 0.01;
        this.waveAmplitude = 5 + this.depth * 3;
        this.waveSpeed = 0.0001 + this.depth * 0.00005;

        // Multiple noise layers for more natural look
        this.detailFrequency = 0.03 + this.depth * 0.02;
        this.detailAmplitude = 3 + this.depth * 2;
        this.detailSpeed = 0.0002 + this.depth * 0.00008;
      }

      update(deltaTime) {
        // Very slow horizontal movement
        this.x += this.speed * deltaTime * 0.01;

        // Wrap around when needed
        if (this.x > canvas.width) {
          this.x = 0;
        } else if (this.x < -canvas.width) {
          this.x = 0;
        }
      }

      draw(time) {
        if (!ctx) return;

        // Base layer gradient
        const gradient = ctx.createLinearGradient(0, this.y, 0, canvas.height);
        gradient.addColorStop(
          0,
          `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`
        );
        gradient.addColorStop(
          0.3,
          `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity * 0.6})`
        );
        gradient.addColorStop(
          1,
          `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity})`
        );

        ctx.fillStyle = gradient;

        // Calculate wave shape
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);
        ctx.lineTo(0, this.y + this.waveAmplitude);

        // Draw wavy top edge
        for (let x = 0; x <= canvas.width; x += 3) {
          // Combine multiple wave frequencies for more natural look
          const y =
            this.y +
            Math.sin(
              (x + this.x) * this.waveFrequency + time * this.waveSpeed
            ) *
              this.waveAmplitude +
            Math.sin(
              (x + this.x) * this.detailFrequency + time * this.detailSpeed
            ) *
              this.detailAmplitude;

          ctx.lineTo(x, y);
        }

        // Complete the path
        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();
        ctx.fill();

        // Add subtle detail to mist
        this.drawMistDetail(time);
      }

      drawMistDetail(time) {
        // Add swirling details
        for (let i = 0; i < 5; i++) {
          const xOffset = (this.x * (1.5 + i * 0.2)) % canvas.width;
          const yBase = this.y + canvas.height * (0.1 + i * 0.05);
          const width =
            canvas.width * (0.3 + Math.sin(time * 0.0001 + i) * 0.1);
          const height = canvas.height * 0.2;

          // Adjust opacity based on depth and detail layer
          const detailOpacity = this.opacity * 0.5 * (1 - i * 0.15);

          // Detail gradient
          const detailGradient = ctx.createRadialGradient(
            xOffset,
            yBase,
            0,
            xOffset,
            yBase,
            width
          );

          detailGradient.addColorStop(
            0,
            `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${detailOpacity})`
          );
          detailGradient.addColorStop(
            1,
            `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`
          );

          ctx.fillStyle = detailGradient;
          ctx.beginPath();
          ctx.ellipse(xOffset, yBase, width, height, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Initialize mist layers
    for (let i = 0; i < mistLayerCount; i++) {
      const depth = i / (mistLayerCount - 1); // 0 to 1
      mistLayers.push(new MistLayer(depth));
    }

    // Animation loop
    const animate = (timestamp) => {
      // Calculate delta time
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      elapsedTime += deltaTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background glow
      const drawBackglow = () => {
        const glowRadius = canvas.height * 0.8;
        const glowCenterY = canvas.height * 0.9;

        // Create subtle pulsing glow
        const pulseIntensity = 0.5 + 0.5 * Math.sin(elapsedTime * 0.0003);
        const glowOpacity = 0.08 * pulseIntensity;

        const glow = ctx.createRadialGradient(
          canvas.width / 2,
          glowCenterY,
          0,
          canvas.width / 2,
          glowCenterY,
          glowRadius
        );

        glow.addColorStop(0, `rgba(220, 230, 255, ${glowOpacity})`);
        glow.addColorStop(1, "rgba(220, 230, 255, 0)");

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(canvas.width / 2, glowCenterY, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      };

      // Draw backglow
      drawBackglow();

      // Draw mist layers back to front
      mistLayers.sort((a, b) => b.depth - a.depth); // Draw back to front
      mistLayers.forEach((layer) => {
        layer.update(deltaTime);
        layer.draw(elapsedTime);
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
      {/* Dark background */}
      <div className="absolute inset-0 bg-slate-800 z-0"></div>

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

          {/* Cool overlay */}
          <div
            className="absolute inset-0 opacity-15 mix-blend-color-burn"
            style={{
              background:
                "linear-gradient(to bottom, rgba(30,40,50,0) 60%, rgba(50,70,90,0.2) 100%)",
            }}
          ></div>
        </div>
      </div>

      {/* Card border */}
      <div className="absolute inset-0 border border-slate-500/20 rounded-lg pointer-events-none z-30"></div>

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-slate-400/20 rounded-tl-lg z-30"></div>
      <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-slate-400/20 rounded-tr-lg z-30"></div>
      <div className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-sky-400/10 rounded-bl-lg z-30"></div>
      <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-sky-400/10 rounded-br-lg z-30"></div>

      {/* Mist symbol */}
      <div className="absolute bottom-1.5 right-1.5 w-4 h-4 flex items-center justify-center z-40 opacity-40">
        <svg
          viewBox="0 0 24 24"
          className="w-3 h-3 text-slate-300 fill-current"
        >
          <path d="M3,15H13A1,1 0 0,1 14,16A1,1 0 0,1 13,17H3A1,1 0 0,1 2,16A1,1 0 0,1 3,15M16,15H21A1,1 0 0,1 22,16A1,1 0 0,1 21,17H16A1,1 0 0,1 15,16A1,1 0 0,1 16,15M1,12A5,5 0 0,1 6,7C7,4.65 9.3,3 12,3C15.43,3 18.24,5.66 18.5,9.03L19,9C21.19,9 22.97,10.76 23,13H21A2,2 0 0,0 19,11H17V10A5,5 0 0,0 12,5C9.5,5 7.45,6.82 7.06,9.19C6.73,9.07 6.37,9 6,9A3,3 0 0,0 3,12C3,12.35 3.06,12.69 3.17,13H1.1L1,12M3,19H5A1,1 0 0,1 6,20A1,1 0 0,1 5,21H3A1,1 0 0,1 2,20A1,1 0 0,1 3,19M8,19H21A1,1 0 0,1 22,20A1,1 0 0,1 21,21H8A1,1 0 0,1 7,20A1,1 0 0,1 8,19Z" />
        </svg>
      </div>

      {/* Subtle inner glow */}
      <div className="absolute inset-0 rounded-lg shadow-[inset_0_0_15px_rgba(200,215,255,0.07)] z-30 pointer-events-none"></div>
    </div>
  );
}

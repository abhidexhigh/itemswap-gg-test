"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function StormVariantTornado({
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

    // Tornado dust particles
    const dustParticles = [];
    const dustCount = 50;

    // Lightning bolts
    const lightningBolts = [];
    const maxLightningBolts = 3;

    // Rain drops
    const raindrops = [];
    const raindropCount = 100;

    // Dust particle class
    class DustParticle {
      constructor() {
        this.reset();
      }

      reset() {
        // Center of tornado
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        // Distance from center
        this.distance = Math.random() * 35 + 5;

        // Angle around center (in radians)
        this.angle = Math.random() * Math.PI * 2;

        // Calculate position
        this.x = centerX + Math.cos(this.angle) * this.distance;
        this.y = centerY + Math.sin(this.angle) * this.distance;

        // Vertical position in tornado (0 = top, 1 = bottom)
        this.yPosition = Math.random();

        // Speed of rotation
        this.rotationSpeed =
          (0.02 + Math.random() * 0.03) * (this.distance < 20 ? -1 : 1);

        // Size and appearance
        this.radius = Math.random() * 1.5 + 0.5;
        this.opacity = Math.random() * 0.6 + 0.2;

        // Colors - grayish with slight blue/purple tint
        this.hue = 220 + Math.random() * 40;
        this.saturation = Math.random() * 20 + 5;
        this.lightness = Math.random() * 30 + 60;
      }

      update() {
        // Update angle
        this.angle += this.rotationSpeed;

        // Distance changes over time (pulsing effect)
        this.distance += Math.sin(Date.now() * 0.001) * 0.1;

        // Center of tornado
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        // Calculate funnel shape
        // Wider at top, narrower at bottom
        const funnelWidth = 10 + 25 * this.yPosition;

        // Update position based on angle and funnel shape
        this.x = centerX + Math.cos(this.angle) * funnelWidth;
        this.y =
          centerY - canvas.height * 0.3 + this.yPosition * canvas.height * 0.6;

        // Move up slightly (cyclical)
        this.yPosition -= 0.002;
        if (this.yPosition < 0) {
          this.yPosition = 1;
        }

        // Randomly adjust opacity for flickering effect
        this.opacity = Math.max(
          0.1,
          Math.min(0.8, this.opacity + (Math.random() - 0.5) * 0.05)
        );
      }

      draw() {
        if (!ctx) return;

        // Draw particle
        ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Lightning bolt class
    class LightningBolt {
      constructor() {
        this.reset();
      }

      reset() {
        // Starting position (top of screen)
        this.startX = Math.random() * canvas.width;
        this.startY = 0;

        // Ending position (random point in lower half)
        this.endX =
          canvas.width / 2 + (Math.random() - 0.5) * canvas.width * 0.5;
        this.endY = canvas.height / 2 + Math.random() * (canvas.height / 2);

        // Lightning properties
        this.segments = Math.floor(Math.random() * 5) + 3;
        this.width = Math.random() * 2 + 1;
        this.jitter = 20 + Math.random() * 30;

        // Color and opacity
        this.opacity = 0.8 + Math.random() * 0.2;
        this.hue = Math.random() * 60 + 200; // Blue to purple

        // Lifespan
        this.life = 15;
        this.maxLife = this.life;

        // Generate points
        this.points = this.generatePoints();

        // Generate branches with 40% chance
        this.hasBranch = Math.random() < 0.4;
        if (this.hasBranch) {
          this.branchStartIndex = Math.floor(
            Math.random() * (this.points.length - 1)
          );
          this.branchPoints = this.generateBranch(
            this.points[this.branchStartIndex].x,
            this.points[this.branchStartIndex].y
          );
        }
      }

      generatePoints() {
        const points = [];
        const segmentLength =
          Math.sqrt(
            Math.pow(this.endX - this.startX, 2) +
              Math.pow(this.endY - this.startY, 2)
          ) / this.segments;

        // Direction vector
        const dirX = (this.endX - this.startX) / this.segments;
        const dirY = (this.endY - this.startY) / this.segments;

        // Generate points with jitter
        for (let i = 0; i <= this.segments; i++) {
          const baseX = this.startX + dirX * i;
          const baseY = this.startY + dirY * i;

          // Add randomness (more in the middle, less at ends)
          const jitterFactor =
            (i / this.segments) * (1 - i / this.segments) * 4;
          const jitterX = (Math.random() - 0.5) * this.jitter * jitterFactor;

          points.push({
            x: baseX + jitterX,
            y: baseY,
          });
        }

        return points;
      }

      generateBranch(startX, startY) {
        const points = [];
        const segments = Math.floor(Math.random() * 3) + 2;

        // Random end point for branch
        const endX = startX + (Math.random() - 0.5) * 40;
        const endY = startY + Math.random() * 40;

        // Direction vector
        const dirX = (endX - startX) / segments;
        const dirY = (endY - startY) / segments;

        // Generate points with jitter
        for (let i = 0; i <= segments; i++) {
          const baseX = startX + dirX * i;
          const baseY = startY + dirY * i;

          // Add randomness
          const jitterX = (Math.random() - 0.5) * this.jitter * 0.5;
          const jitterY = (Math.random() - 0.5) * this.jitter * 0.5;

          points.push({
            x: baseX + jitterX,
            y: baseY + jitterY,
          });
        }

        return points;
      }

      update() {
        // Decrease lifespan
        this.life--;

        // Fade out
        this.currentOpacity = this.opacity * (this.life / this.maxLife);
      }

      draw() {
        if (!ctx || this.life <= 0) return;

        // Draw main lightning bolt
        ctx.strokeStyle = `hsla(${this.hue}, 100%, 80%, ${this.currentOpacity})`;
        ctx.lineWidth = this.width;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        // Glow effect
        ctx.shadowColor = `hsla(${this.hue}, 100%, 90%, ${this.currentOpacity * 0.8})`;
        ctx.shadowBlur = 10;

        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);

        for (let i = 1; i < this.points.length; i++) {
          ctx.lineTo(this.points[i].x, this.points[i].y);
        }

        ctx.stroke();

        // Draw branch if exists
        if (this.hasBranch) {
          ctx.beginPath();
          ctx.moveTo(this.branchPoints[0].x, this.branchPoints[0].y);

          for (let i = 1; i < this.branchPoints.length; i++) {
            ctx.lineTo(this.branchPoints[i].x, this.branchPoints[i].y);
          }

          ctx.stroke();
        }

        // Reset shadow
        ctx.shadowBlur = 0;
      }
    }

    // Raindrop class
    class Raindrop {
      constructor() {
        this.reset();
      }

      reset() {
        // Position - start above screen
        this.x = Math.random() * canvas.width;
        this.y = -Math.random() * 20;

        // Size
        this.length = Math.random() * 7 + 3;
        this.width = Math.random() * 1 + 0.5;

        // Speed - varies by size
        this.speedY = this.length * 0.5 + Math.random() * 2 + 5;
        this.speedX = -Math.random() * 2 - 1; // Wind effect

        // Appearance
        this.opacity = Math.random() * 0.3 + 0.1;
      }

      update() {
        // Move with gravity and wind
        this.y += this.speedY;
        this.x += this.speedX;

        // Reset if off screen
        if (this.y > canvas.height || this.x < -this.length) {
          this.reset();
        }
      }

      draw() {
        if (!ctx) return;

        // Draw elongated raindrop
        ctx.strokeStyle = `rgba(180, 210, 255, ${this.opacity})`;
        ctx.lineWidth = this.width;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.speedX * 0.5, this.y - this.length);
        ctx.stroke();
      }
    }

    // Create dust particles
    for (let i = 0; i < dustCount; i++) {
      const dust = new DustParticle();
      dustParticles.push(dust);
    }

    // Create raindrops
    for (let i = 0; i < raindropCount; i++) {
      const raindrop = new Raindrop();
      raindrop.y = Math.random() * canvas.height; // Distribute across canvas
      raindrops.push(raindrop);
    }

    // Draw storm background
    const drawStormBackground = () => {
      if (!ctx) return;

      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.8
      );

      // Storm cloud center
      gradient.addColorStop(0, "rgba(70, 70, 90, 0.2)");
      // Dark edges
      gradient.addColorStop(1, "rgba(40, 40, 60, 0)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Dark cloud bands
      const time = Date.now() * 0.0005;
      const bandCount = 3;

      for (let i = 0; i < bandCount; i++) {
        const yPos = canvas.height * (0.3 + i * 0.2);
        const amplitude = 10 + i * 5;

        ctx.fillStyle = `rgba(30, 30, 50, ${0.1 - i * 0.02})`;
        ctx.beginPath();
        ctx.moveTo(0, yPos);

        for (let x = 0; x < canvas.width; x += 5) {
          const waveOffset = Math.sin(x * 0.02 + time + i) * amplitude;
          ctx.lineTo(x, yPos + waveOffset);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.fill();
      }
    };

    // Draw tornado funnel base
    const drawTornadoBase = () => {
      if (!ctx) return;

      const centerX = canvas.width / 2;
      const baseY = canvas.height * 0.75;
      const width = canvas.width * 0.4;
      const height = canvas.height * 0.2;

      // Create gradient for base
      const gradient = ctx.createRadialGradient(
        centerX,
        baseY,
        0,
        centerX,
        baseY,
        width
      );

      gradient.addColorStop(0, "rgba(70, 70, 90, 0.3)");
      gradient.addColorStop(0.7, "rgba(50, 50, 70, 0.15)");
      gradient.addColorStop(1, "rgba(40, 40, 60, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.ellipse(centerX, baseY, width, height * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw storm background
      drawStormBackground();

      // Draw tornado base
      drawTornadoBase();

      // Update and draw dust particles
      dustParticles.forEach((dust) => {
        dust.update();
        dust.draw();
      });

      // Random lightning creation
      if (lightningBolts.length < maxLightningBolts && Math.random() < 0.01) {
        lightningBolts.push(new LightningBolt());
      }

      // Update and draw lightning
      for (let i = lightningBolts.length - 1; i >= 0; i--) {
        lightningBolts[i].update();
        lightningBolts[i].draw();

        // Remove dead lightning
        if (lightningBolts[i].life <= 0) {
          lightningBolts.splice(i, 1);
        }
      }

      // Update and draw raindrops
      raindrops.forEach((drop) => {
        drop.update();
        drop.draw();
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
      {/* Storm background */}
      <div className="absolute inset-0 bg-slate-800 z-0"></div>

      {/* Storm gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-700/30 via-slate-800/40 to-slate-900/90 z-0"></div>

      {/* Lightning flashes */}
      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(200,210,255,0.2) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(180,200,255,0.15) 0%, transparent 40%)
          `,
          animation: "stormFlash 8s infinite",
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

          {/* Storm vignette overlay */}
          <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,30,0.7)]"></div>

          {/* Rain streaks overlay */}
          <div
            className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise' x='0%25' y='0%25' width='100%25' height='100%25'%3E%3CfeTurbulence baseFrequency='0.02 0.15' result='NOISE' numOctaves='1' /%3E%3CfeDisplacementMap in='SourceGraphic' in2='NOISE' scale='5' xChannelSelector='R' yChannelSelector='G' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.3' /%3E%3C/svg%3E")`,
              backgroundSize: "100% 100%",
            }}
          ></div>
        </div>
      </div>

      {/* Storm frame */}
      <div className="absolute inset-0 border border-slate-600/30 rounded-lg pointer-events-none z-30"></div>

      {/* Metallic corners */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-slate-400/40 rounded-tl-lg z-30"></div>
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-slate-400/40 rounded-tr-lg z-30"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-slate-400/40 rounded-bl-lg z-30"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-slate-400/40 rounded-br-lg z-30"></div>

      {/* Electric glow */}
      <div className="absolute inset-0 rounded-lg shadow-[0_0_8px_rgba(120,150,255,0.2),inset_0_0_8px_rgba(120,150,255,0.2)] z-30 pointer-events-none"></div>

      {/* Add lightning flash animation */}
      <style jsx global>{`
        @keyframes stormFlash {
          0%,
          95%,
          100% {
            opacity: 0.1;
          }
          97% {
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function AmbientGlowCard({
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

    // Glow orb parameters
    const orbs = [];
    const orbCount = 12;

    // Animation timing
    let lastTime = 0;
    let elapsedTime = 0;

    class GlowOrb {
      constructor() {
        this.reset();
      }

      reset() {
        // Orbit parameters
        this.distance = Math.random() * (canvas.width * 0.3) + 10;
        this.orbitSpeed =
          (Math.random() * 0.00005 + 0.00002) * (Math.random() > 0.5 ? 1 : -1);
        this.orbitAngle = Math.random() * Math.PI * 2;

        // Calculate position
        this.x = canvas.width / 2 + Math.cos(this.orbitAngle) * this.distance;
        this.y = canvas.height / 2 + Math.sin(this.orbitAngle) * this.distance;

        // Size and appearance
        this.size = Math.random() * 8 + 4;
        this.originalSize = this.size;

        // Color properties - subtle pastel colors
        this.hue = Math.random() * 360;
        this.saturation = Math.random() * 20 + 60; // 60-80%
        this.lightness = Math.random() * 20 + 70; // 70-90%
        this.opacity = Math.random() * 0.2 + 0.1;

        // Animation
        this.pulseSpeed = Math.random() * 0.0003 + 0.0001;
        this.pulseOffset = Math.random() * Math.PI * 2;
      }

      update(deltaTime) {
        // Very slow orbit movement
        this.orbitAngle += this.orbitSpeed * deltaTime;
        this.x = canvas.width / 2 + Math.cos(this.orbitAngle) * this.distance;
        this.y = canvas.height / 2 + Math.sin(this.orbitAngle) * this.distance;

        // Very slow pulse effect
        this.size =
          this.originalSize *
          (0.8 +
            0.4 * Math.sin(elapsedTime * this.pulseSpeed + this.pulseOffset));

        // Slow color shift
        this.hue = (this.hue + (0.01 * deltaTime) / 1000) % 360;
      }

      draw() {
        if (!ctx) return;

        // Draw outer glow
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
          `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.opacity})`
        );
        glow.addColorStop(
          1,
          `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, 0)`
        );

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Draw core
        const innerGlow = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.size
        );

        innerGlow.addColorStop(
          0,
          `hsla(${this.hue}, ${this.saturation - 10}%, ${this.lightness + 10}%, ${this.opacity * 2})`
        );
        innerGlow.addColorStop(
          1,
          `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, 0)`
        );

        ctx.fillStyle = innerGlow;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Initialize orbs
    for (let i = 0; i < orbCount; i++) {
      orbs.push(new GlowOrb());
    }

    // Animation loop
    const animate = (timestamp) => {
      // Calculate delta time
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      elapsedTime += deltaTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Add ambient background gradient that slowly shifts
      const hueShift = (elapsedTime * 0.01) % 360;
      const bgGradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width
      );

      bgGradient.addColorStop(0, `hsla(${hueShift}, 70%, 5%, 0.1)`);
      bgGradient.addColorStop(
        0.5,
        `hsla(${(hueShift + 30) % 360}, 80%, 10%, 0.05)`
      );
      bgGradient.addColorStop(1, `hsla(${(hueShift + 60) % 360}, 90%, 15%, 0)`);

      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw connecting lines between nearby orbs
      ctx.strokeStyle = `rgba(255, 255, 255, 0.03)`;
      ctx.lineWidth = 0.5;

      for (let i = 0; i < orbs.length; i++) {
        for (let j = i + 1; j < orbs.length; j++) {
          const orb1 = orbs[i];
          const orb2 = orbs[j];

          // Calculate distance between orbs
          const dx = orb1.x - orb2.x;
          const dy = orb1.y - orb2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Only connect if they're close enough
          if (distance < canvas.width * 0.25) {
            // Opacity based on distance
            const opacity = 0.03 * (1 - distance / (canvas.width * 0.25));

            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(orb1.x, orb1.y);
            ctx.lineTo(orb2.x, orb2.y);
            ctx.stroke();
          }
        }
      }

      // Draw orbs
      orbs.forEach((orb) => {
        orb.update(deltaTime);
        orb.draw();
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
      <div className="absolute inset-0 bg-gray-950 z-0"></div>

      {/* Subtle star field */}
      <div
        className="absolute inset-0 opacity-30 z-0"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, white 1px, transparent 1px), 
                             radial-gradient(circle at 40% 70%, white 0.5px, transparent 0.5px),
                             radial-gradient(circle at 70% 20%, white 0.8px, transparent 0.8px),
                             radial-gradient(circle at 90% 90%, white 0.7px, transparent 0.7px)`,
          backgroundSize: `300px 300px, 200px 200px, 250px 250px, 150px 150px`,
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

          {/* Color wash overlay */}
          <div
            className="absolute inset-0 opacity-20 mix-blend-color"
            style={{
              background:
                "linear-gradient(45deg, #012 0%, #123 50%, #234 100%)",
            }}
          ></div>
        </div>
      </div>

      {/* Glowing border */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        <div className="absolute inset-0 border border-[#3366aa33] rounded-lg"></div>
        <div className="absolute inset-0 rounded-lg shadow-[inset_0_0_10px_rgba(100,150,255,0.1)]"></div>
      </div>

      {/* Dark symbol */}
      <div className="absolute bottom-1 right-1 w-5 h-5 flex items-center justify-center z-40 opacity-50">
        <svg
          viewBox="0 0 24 24"
          className="w-4 h-4 text-indigo-300 fill-current"
        >
          <path d="M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7Z" />
        </svg>
      </div>
    </div>
  );
}

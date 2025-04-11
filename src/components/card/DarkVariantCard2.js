"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function DarkVariantCard2({
  image,
  name,
  title,
  description,
  stats,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [voidPulse, setVoidPulse] = useState(false);
  const [runeFlash, setRuneFlash] = useState(false);

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

    // Dark magic particles
    const shadowParticles = [];
    const particleCount = 20;

    // New array for arcane runes
    const arcaneRunes = [];
    const runeCount = 5;

    // New array for dark energy wisps
    const darkWisps = [];
    const wispCount = 8;

    // Shadow particle class
    class ShadowParticle {
      constructor() {
        this.reset();
      }

      reset() {
        // Position at random edges
        const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left

        if (side === 0) {
          // top
          this.x = Math.random() * canvas.width;
          this.y = -2;
          this.speedY = Math.random() * 0.3 + 0.1; // downward
        } else if (side === 1) {
          // right
          this.x = canvas.width + 2;
          this.y = Math.random() * canvas.height;
          this.speedX = -(Math.random() * 0.3 + 0.1); // leftward
        } else if (side === 2) {
          // bottom
          this.x = Math.random() * canvas.width;
          this.y = canvas.height + 2;
          this.speedY = -(Math.random() * 0.3 + 0.1); // upward
        } else {
          // left
          this.x = -2;
          this.y = Math.random() * canvas.height;
          this.speedX = Math.random() * 0.3 + 0.1; // rightward
        }

        // Default speeds if not set based on side
        this.speedX = this.speedX || (Math.random() - 0.5) * 0.2;
        this.speedY = this.speedY || (Math.random() - 0.5) * 0.2;

        // Size and appearance
        this.size = Math.random() * 3 + 1;
        this.opacity = Math.random() * 0.4 + 0.1;
        this.color = `rgba(75, 0, 130, ${this.opacity})`;

        // Life and duration
        this.life = Math.random() * 150 + 100;
        this.maxLife = this.life;

        // Pulsing properties
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulseOffset = Math.random() * Math.PI * 2;
      }

      update() {
        // Drift with slight random movement
        this.x += this.speedX;
        this.y += this.speedY;

        // Add slight wave motion
        this.x += Math.sin(Date.now() * 0.001 + this.pulseOffset) * 0.2;

        // Reduce life
        this.life--;

        // Calculate opacity based on life
        const lifeRatio = this.life / this.maxLife;
        this.opacity = (Math.random() * 0.2 + 0.1) * lifeRatio;
        this.color = `rgba(75, 0, 130, ${this.opacity})`;

        // Pulse size
        const pulse = Math.sin(Date.now() * this.pulseSpeed + this.pulseOffset);
        this.currentSize = this.size * (0.8 + pulse * 0.2);

        // Reset when life is over or if off-screen by too much
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

        // Draw main particle
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.currentSize, 0, Math.PI * 2);
        ctx.fill();

        // Draw shadow trail
        ctx.strokeStyle = this.color.replace(
          /[\d\.]+\)$/,
          `${this.opacity * 0.5})`
        );
        ctx.lineWidth = this.currentSize * 0.5;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.speedX * 5, this.y - this.speedY * 5);
        ctx.stroke();
      }
    }

    // Create subtle shadow / dark magic effect
    const drawShadowEffects = () => {
      if (!ctx) return;

      // Add a few wispy shadow tendrils
      const numTendrils = 3;
      const startTime = Date.now();

      for (let i = 0; i < numTendrils; i++) {
        const tendrilStartX = Math.random() * canvas.width;
        const tendrilStartY = Math.random() * 10 + canvas.height - 15;
        const tendrilLength = Math.random() * 20 + 10;
        const tendrilWidth = Math.random() * 1.5 + 0.5;

        ctx.beginPath();
        ctx.moveTo(tendrilStartX, tendrilStartY);

        // Create a bezier curve for a wisp-like effect
        const controlPoint1X = tendrilStartX - 5 + Math.random() * 10;
        const controlPoint1Y = tendrilStartY - tendrilLength * 0.5;
        const controlPoint2X = tendrilStartX - 5 + Math.random() * 10;
        const controlPoint2Y = tendrilStartY - tendrilLength * 0.8;
        const endX = tendrilStartX;
        const endY = tendrilStartY - tendrilLength;

        ctx.bezierCurveTo(
          controlPoint1X,
          controlPoint1Y,
          controlPoint2X,
          controlPoint2Y,
          endX,
          endY
        );

        // Create a gradient for the tendril
        const gradient = ctx.createLinearGradient(
          tendrilStartX,
          tendrilStartY,
          endX,
          endY
        );
        gradient.addColorStop(0, "rgba(75, 0, 130, 0.5)");
        gradient.addColorStop(1, "rgba(75, 0, 130, 0)");

        ctx.strokeStyle = gradient;
        ctx.lineWidth = tendrilWidth;
        ctx.stroke();
      }

      // Add a subtle shadow at the bottom
      const shadowGradient = ctx.createLinearGradient(
        0,
        canvas.height - 20,
        0,
        canvas.height
      );
      shadowGradient.addColorStop(0, "rgba(30, 0, 50, 0)");
      shadowGradient.addColorStop(1, "rgba(30, 0, 50, 0.4)");

      ctx.fillStyle = shadowGradient;
      ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
    };

    // Void portal effect
    const createVoidEffect = () => {
      if (!ctx) return;

      // Create a void portal somewhere on the card
      const portalX = Math.random() * (canvas.width - 20) + 10;
      const portalY = Math.random() * (canvas.height - 20) + 10;
      const portalSize = Math.random() * 10 + 5;

      // Dark portal background
      const portalGradient = ctx.createRadialGradient(
        portalX,
        portalY,
        0,
        portalX,
        portalY,
        portalSize
      );

      portalGradient.addColorStop(0, "rgba(25, 0, 50, 0.8)");
      portalGradient.addColorStop(0.5, "rgba(75, 0, 130, 0.5)");
      portalGradient.addColorStop(1, "rgba(75, 0, 130, 0)");

      ctx.fillStyle = portalGradient;
      ctx.beginPath();
      ctx.arc(portalX, portalY, portalSize, 0, Math.PI * 2);
      ctx.fill();

      // Outer glow
      ctx.shadowColor = "rgba(128, 0, 255, 0.6)";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(portalX, portalY, portalSize * 0.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 0;

      // Trigger the void pulse effect
      setVoidPulse(true);
      setTimeout(() => setVoidPulse(false), 300);
    };

    // New class for arcane runes
    class ArcaneRune {
      constructor() {
        this.reset();
      }

      reset() {
        // Position randomly within the card
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        // Appearance
        this.size = Math.random() * 6 + 3;
        this.opacity = 0;
        this.maxOpacity = Math.random() * 0.4 + 0.2;
        this.fadeSpeed = Math.random() * 0.01 + 0.005;

        // Rune type (different shapes)
        this.runeType = Math.floor(Math.random() * 5);

        // Rotation
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = Math.random() * 0.002 - 0.001;

        // Lifespan
        this.life = 0;
        this.maxLife = Math.random() * 150 + 100;
        this.state = "appearing"; // 'appearing', 'visible', 'fading'
      }

      update() {
        // Update rotation
        this.rotation += this.rotationSpeed;

        // State management
        this.life++;

        if (this.state === "appearing") {
          this.opacity += this.fadeSpeed;
          if (this.opacity >= this.maxOpacity) {
            this.opacity = this.maxOpacity;
            this.state = "visible";
          }
        } else if (this.state === "visible") {
          if (this.life > this.maxLife * 0.7) {
            this.state = "fading";
          }
        } else if (this.state === "fading") {
          this.opacity -= this.fadeSpeed;
          if (this.opacity <= 0) {
            this.reset();
          }
        }

        // Subtle pulsing
        const pulse = Math.sin(Date.now() * 0.003 + this.x + this.y);
        this.currentOpacity = this.opacity * (0.8 + pulse * 0.2);
      }

      draw() {
        if (!ctx) return;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // Draw arcane rune symbol based on type
        ctx.strokeStyle = `rgba(160, 32, 240, ${this.currentOpacity})`;
        ctx.lineWidth = 0.5;

        switch (this.runeType) {
          case 0: // Pentagon with inner lines
            this.drawSymbol1();
            break;
          case 1: // Triangle with circles
            this.drawSymbol2();
            break;
          case 2: // Cross with diamond
            this.drawSymbol3();
            break;
          case 3: // Spiral
            this.drawSymbol4();
            break;
          case 4: // Star
            this.drawSymbol5();
            break;
        }

        // Add glow effect
        if (this.opacity > 0.3) {
          ctx.shadowColor = "rgba(160, 32, 240, 0.5)";
          ctx.shadowBlur = 5;
          ctx.strokeStyle = `rgba(200, 100, 255, ${this.currentOpacity * 0.7})`;
          ctx.lineWidth = 0.3;

          // Redraw for glow
          switch (this.runeType) {
            case 0:
              this.drawSymbol1();
              break;
            case 1:
              this.drawSymbol2();
              break;
            case 2:
              this.drawSymbol3();
              break;
            case 3:
              this.drawSymbol4();
              break;
            case 4:
              this.drawSymbol5();
              break;
          }

          ctx.shadowBlur = 0;
        }

        ctx.restore();
      }

      // Different rune symbols
      drawSymbol1() {
        // Pentagon with inner lines
        ctx.beginPath();
        const points = 5;
        const radius = this.size;

        for (let i = 0; i < points; i++) {
          const angle = (i * 2 * Math.PI) / points - Math.PI / 2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.closePath();
        ctx.stroke();

        // Inner lines
        for (let i = 0; i < points; i++) {
          const angle1 = (i * 2 * Math.PI) / points - Math.PI / 2;
          const angle2 =
            (((i + 2) % points) * 2 * Math.PI) / points - Math.PI / 2;

          const x1 = Math.cos(angle1) * radius;
          const y1 = Math.sin(angle1) * radius;
          const x2 = Math.cos(angle2) * radius;
          const y2 = Math.sin(angle2) * radius;

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }

      drawSymbol2() {
        // Triangle with circle
        const radius = this.size;

        // Triangle
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
          const angle = (i * 2 * Math.PI) / 3 - Math.PI / 2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();

        // Circle
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.5, 0, Math.PI * 2);
        ctx.stroke();

        // Inner dot
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.1, 0, Math.PI * 2);
        ctx.stroke();
      }

      drawSymbol3() {
        // Cross with diamond
        const radius = this.size;

        // Cross
        ctx.beginPath();
        ctx.moveTo(0, -radius);
        ctx.lineTo(0, radius);
        ctx.moveTo(-radius, 0);
        ctx.lineTo(radius, 0);
        ctx.stroke();

        // Diamond
        ctx.beginPath();
        ctx.moveTo(0, -radius * 0.5);
        ctx.lineTo(radius * 0.5, 0);
        ctx.lineTo(0, radius * 0.5);
        ctx.lineTo(-radius * 0.5, 0);
        ctx.closePath();
        ctx.stroke();
      }

      drawSymbol4() {
        // Spiral
        const radius = this.size;
        let r = radius * 0.1;
        const steps = 30;
        const angleStep = (Math.PI * 4) / steps;

        ctx.beginPath();
        ctx.moveTo(r, 0);

        for (let i = 0; i <= steps; i++) {
          const angle = i * angleStep;
          r = radius * 0.1 + (radius - radius * 0.1) * (i / steps);
          const x = Math.cos(angle) * r;
          const y = Math.sin(angle) * r;
          ctx.lineTo(x, y);
        }

        ctx.stroke();
      }

      drawSymbol5() {
        // Star
        const outerRadius = this.size;
        const innerRadius = this.size * 0.4;
        const points = 5;

        ctx.beginPath();

        for (let i = 0; i < points * 2; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const angle = (i * Math.PI) / points - Math.PI / 2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.closePath();
        ctx.stroke();
      }
    }

    // Dark energy wisps
    class DarkWisp {
      constructor() {
        this.reset();
      }

      reset() {
        // Position
        this.startX = Math.random() * canvas.width;
        this.startY = Math.random() * canvas.height;

        // Properties
        this.length = Math.random() * 30 + 15;
        this.width = Math.random() * 2 + 0.5;
        this.angle = Math.random() * Math.PI * 2;
        this.curveIntensity = Math.random() * 10 + 5;

        // Animation
        this.drift = Math.random() * 0.5 + 0.1;
        this.speedX = Math.cos(this.angle) * this.drift;
        this.speedY = Math.sin(this.angle) * this.drift;

        // Appearance
        this.opacity = Math.random() * 0.3 + 0.1;
        this.hue = Math.random() * 60 + 270; // Purple to blue hues

        // Life
        this.life = Math.random() * 200 + 100;
        this.maxLife = this.life;
      }

      update() {
        // Move wisp
        this.startX += this.speedX;
        this.startY += this.speedY;

        // Slowly rotate angle
        this.angle += Math.random() * 0.05 - 0.025;

        // Update life
        this.life--;

        // Reset if off screen or dead
        if (
          this.life <= 0 ||
          this.startX < -this.length ||
          this.startX > canvas.width + this.length ||
          this.startY < -this.length ||
          this.startY > canvas.height + this.length
        ) {
          this.reset();
        }

        // Update opacity based on life
        this.currentOpacity = this.opacity * (this.life / this.maxLife);
      }

      draw() {
        if (!ctx) return;

        // Create wisp curve
        ctx.beginPath();

        // Start point
        ctx.moveTo(this.startX, this.startY);

        // Calculate end point
        const endX = this.startX + Math.cos(this.angle) * this.length;
        const endY = this.startY + Math.sin(this.angle) * this.length;

        // Calculate control points for curve
        const perpAngle = this.angle + Math.PI / 2;
        const ctrlX =
          (this.startX + endX) / 2 + Math.cos(perpAngle) * this.curveIntensity;
        const ctrlY =
          (this.startY + endY) / 2 + Math.sin(perpAngle) * this.curveIntensity;

        // Draw curve
        ctx.quadraticCurveTo(ctrlX, ctrlY, endX, endY);

        // Style
        const gradient = ctx.createLinearGradient(
          this.startX,
          this.startY,
          endX,
          endY
        );
        gradient.addColorStop(0, `hsla(${this.hue}, 100%, 30%, 0)`);
        gradient.addColorStop(
          0.4,
          `hsla(${this.hue}, 100%, 50%, ${this.currentOpacity})`
        );
        gradient.addColorStop(
          0.6,
          `hsla(${this.hue}, 100%, 50%, ${this.currentOpacity})`
        );
        gradient.addColorStop(1, `hsla(${this.hue}, 100%, 30%, 0)`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.width;
        ctx.lineCap = "round";
        ctx.stroke();

        // Add glow effect
        ctx.shadowColor = `hsla(${this.hue}, 100%, 70%, ${this.currentOpacity})`;
        ctx.shadowBlur = 3;
        ctx.lineWidth = this.width * 0.5;
        ctx.stroke();

        ctx.shadowBlur = 0;
      }
    }

    // Initialize arcane runes
    for (let i = 0; i < runeCount; i++) {
      const rune = new ArcaneRune();
      rune.life = Math.floor(Math.random() * rune.maxLife * 0.8); // Stagger appearances
      arcaneRunes.push(rune);
    }

    // Initialize dark wisps
    for (let i = 0; i < wispCount; i++) {
      const wisp = new DarkWisp();
      wisp.life = Math.floor(Math.random() * wisp.maxLife * 0.8); // Stagger appearances
      darkWisps.push(wisp);
    }

    // Create rune flash effect
    const createRuneFlash = () => {
      // Create a new rune at a random position that will flash intensely
      const flashRune = new ArcaneRune();
      flashRune.maxOpacity = 0.8; // Brighter than normal
      flashRune.fadeSpeed = 0.03; // Fade in faster
      arcaneRunes.push(flashRune);

      // Add extra wisps from the flash point
      for (let i = 0; i < 3; i++) {
        const wisp = new DarkWisp();
        wisp.startX = flashRune.x;
        wisp.startY = flashRune.y;
        wisp.opacity = 0.5; // Brighter than normal
        darkWisps.push(wisp);
      }

      // Trigger the visual effect for the component
      setRuneFlash(true);
      setTimeout(() => setRuneFlash(false), 350);
    };

    // Initialize shadow particles
    for (let i = 0; i < particleCount; i++) {
      const particle = new ShadowParticle();
      // Stagger initial positions
      particle.life = Math.random() * particle.maxLife;
      shadowParticles.push(particle);
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw shadow particles
      shadowParticles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      // Draw tendrils
      drawShadowEffects();

      // Draw dark wisps (below runes)
      darkWisps.forEach((wisp) => {
        wisp.update();
        wisp.draw();
      });

      // Draw arcane runes (on top)
      arcaneRunes.forEach((rune) => {
        rune.update();
        rune.draw();
      });

      requestAnimationFrame(animate);
    };

    animate();

    // Randomly create void portals
    const voidInterval = setInterval(() => {
      if (Math.random() < 0.3) {
        // 30% chance each interval
        createVoidEffect();
      }
    }, 2000); // Check every 2 seconds

    // Randomly create rune flashes
    const runeInterval = setInterval(() => {
      if (Math.random() < 0.4) {
        // 40% chance each interval
        createRuneFlash();
      }
    }, 3000); // Check every 3 seconds

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      clearInterval(voidInterval);
      clearInterval(runeInterval);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-[104px] h-[104px] max-w-md aspect-[4/4] rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 ${
        voidPulse ? "contrast-125 saturate-150" : ""
      } ${runeFlash ? "brightness-110" : ""}`}
    >
      {/* Particle canvas for subtle effects */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 pointer-events-none"
      />

      {/* Dark themed background with void theme */}
      <div className="absolute inset-0 bg-slate-950 z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-indigo-950/10 to-purple-950/30 z-0"></div>
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-purple-950/20 z-0"></div>

      {/* Subtle dark energy at the bottom */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-purple-950/40 via-indigo-950/20 to-transparent z-0"></div>

      {/* New magical elements */}
      <div
        className="absolute inset-0 opacity-10 mix-blend-color-dodge z-0"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 20%, rgba(160,32,240,0.4) 0%, transparent 25%),
                               radial-gradient(circle at 70% 60%, rgba(80,16,120,0.4) 0%, transparent 25%)`,
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

          {/* Dark vignette around the edge */}
          <div className="absolute inset-0 shadow-[inset_0_0_15px_rgba(0,0,0,0.8)]"></div>

          {/* Dark corner accents that don't overlap the character */}
          <div className="absolute top-0 left-0 w-12 h-12 bg-gradient-to-br from-purple-900/25 to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-tl from-purple-900/25 to-transparent"></div>

          {/* Void pulse overlay */}
          <div
            className={`absolute inset-0 bg-indigo-900/10 transition-opacity duration-300 ${
              voidPulse ? "opacity-60" : "opacity-0"
            }`}
          ></div>

          {/* Rune flash overlay */}
          <div
            className={`absolute inset-0 bg-purple-900/5 transition-opacity duration-300 ${
              runeFlash ? "opacity-60" : "opacity-0"
            }`}
          ></div>
        </div>
      </div>

      {/* Decorative frame elements */}
      <div className="absolute inset-0 border border-purple-900/60 rounded-lg pointer-events-none z-30"></div>

      {/* Shadowy rune-like accent in corners */}
      <div className="absolute top-[2px] left-[2px] w-6 h-6 border-t border-l border-purple-700/90 rounded-tl-lg z-30"></div>
      <div className="absolute top-[2px] right-[2px] w-6 h-6 border-t border-r border-purple-700/90 rounded-tr-lg z-30"></div>
      <div className="absolute bottom-[2px] left-[2px] w-6 h-6 border-b border-l border-purple-700/90 rounded-bl-lg z-30"></div>
      <div className="absolute bottom-[2px] right-[2px] w-6 h-6 border-b border-r border-purple-700/90 rounded-br-lg z-30"></div>

      {/* New arcane symbol decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-purple-600/50 to-transparent z-30"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-purple-600/50 to-transparent z-30"></div>
    </div>
  );
}

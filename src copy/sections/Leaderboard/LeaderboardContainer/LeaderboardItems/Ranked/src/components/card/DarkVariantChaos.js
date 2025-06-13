"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function DarkVariantChaos({
  image,
  name,
  title,
  description,
  stats,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [chaosPulse, setChaosPulse] = useState(false);

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

    // Chaos energy particles
    const chaosParticles = [];
    const particleCount = 20;

    // Void shards
    const voidShards = [];
    const shardCount = 12;

    // Unstable energy bolts
    const energyBolts = [];
    const boltCount = 6;

    // Particle class
    class ChaosParticle {
      constructor() {
        this.reset();
      }

      reset() {
        // Position randomly around the card
        const angle = Math.random() * Math.PI * 2;
        const distance =
          Math.random() * (canvas.width * 0.5) + canvas.width * 0.1;

        this.x = canvas.width / 2 + Math.cos(angle) * distance;
        this.y = canvas.height / 2 + Math.sin(angle) * distance;

        // Size and shape
        this.size = Math.random() * 3 + 1;
        this.sharpness = Math.random(); // 0 = round, 1 = sharp

        // Color
        this.hue = Math.random() * 60 + 270; // Purple to blue hues
        this.saturation = 70 + Math.random() * 30;
        this.lightness = 15 + Math.random() * 25;
        this.opacity = Math.random() * 0.5 + 0.2;

        // Movement
        const speed = Math.random() * 0.8 + 0.2;
        const moveAngle = Math.random() * Math.PI * 2;
        this.vx = Math.cos(moveAngle) * speed;
        this.vy = Math.sin(moveAngle) * speed;

        // Rotation
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.1;

        // Life
        this.life = Math.random() * 100 + 50;
        this.maxLife = this.life;

        // Flicker effect
        this.flickerSpeed = Math.random() * 0.2 + 0.1;
        this.flickerIntensity = Math.random() * 0.5 + 0.5;
      }

      update() {
        // Movement with chaotic changes
        this.x += this.vx;
        this.y += this.vy;

        // Random direction changes
        if (Math.random() < 0.05) {
          this.vx += (Math.random() - 0.5) * 0.2;
          this.vy += (Math.random() - 0.5) * 0.2;

          // Limit speed
          const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
          if (speed > 1) {
            this.vx = (this.vx / speed) * 1;
            this.vy = (this.vy / speed) * 1;
          }
        }

        // Rotation
        this.rotation += this.rotationSpeed;

        // Decrease life
        this.life--;

        // Calculate opacity with flicker effect
        const lifeRatio = this.life / this.maxLife;
        const flicker =
          Math.sin(Date.now() * this.flickerSpeed) * this.flickerIntensity;
        this.currentOpacity = this.opacity * lifeRatio * (0.7 + flicker * 0.3);

        // Reset when life is over or if off-screen
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

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // Set color with flicker effect
        ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.currentOpacity})`;

        // Draw shape based on sharpness
        if (this.sharpness < 0.3) {
          // Circle
          ctx.beginPath();
          ctx.arc(0, 0, this.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (this.sharpness < 0.6) {
          // Square
          ctx.fillRect(-this.size, -this.size, this.size * 2, this.size * 2);
        } else {
          // Star/jagged shape
          ctx.beginPath();
          const spikes = 5;
          const outerRadius = this.size;
          const innerRadius = this.size * 0.5;

          for (let i = 0; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (Math.PI * 2 * i) / (spikes * 2);

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

        // Add glow effect
        ctx.shadowColor = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness + 20}%, ${this.currentOpacity * 0.7})`;
        ctx.shadowBlur = this.size * 2;

        if (this.sharpness < 0.3) {
          ctx.beginPath();
          ctx.arc(0, 0, this.size * 0.7, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }
    }

    // Void shard class
    class VoidShard {
      constructor() {
        this.reset();
      }

      reset() {
        // Position randomly on the card edges
        const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left

        if (side === 0) {
          this.x = Math.random() * canvas.width;
          this.y = -5;
          this.angle = Math.PI / 2 + (Math.random() - 0.5) * 0.5;
        } else if (side === 1) {
          this.x = canvas.width + 5;
          this.y = Math.random() * canvas.height;
          this.angle = Math.PI + (Math.random() - 0.5) * 0.5;
        } else if (side === 2) {
          this.x = Math.random() * canvas.width;
          this.y = canvas.height + 5;
          this.angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.5;
        } else {
          this.x = -5;
          this.y = Math.random() * canvas.height;
          this.angle = 0 + (Math.random() - 0.5) * 0.5;
        }

        // Size and shape
        this.length = Math.random() * 30 + 15;
        this.width = Math.random() * 3 + 1;

        // Movement
        this.speed = Math.random() * 1 + 0.5;
        this.rotationSpeed = (Math.random() - 0.5) * 0.05;

        // Appearance
        this.opacity = Math.random() * 0.4 + 0.2;
        this.color =
          Math.random() < 0.7
            ? "rgba(30, 0, 60, " + this.opacity + ")"
            : "rgba(0, 15, 40, " + this.opacity + ")";

        // Life
        this.life = Math.random() * 150 + 50;
        this.maxLife = this.life;
      }

      update() {
        // Move toward center
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        // Slightly rotate angle
        this.angle += this.rotationSpeed;

        // Decrease life
        this.life--;

        // Calculate opacity based on life
        const lifeRatio = this.life / this.maxLife;
        this.currentOpacity =
          this.opacity * (lifeRatio < 0.3 ? lifeRatio / 0.3 : 1);

        // Reset when life is over
        if (this.life <= 0) {
          this.reset();
        }
      }

      draw() {
        if (!ctx) return;

        ctx.save();

        // Get end point based on angle and length
        const endX = this.x + Math.cos(this.angle) * this.length;
        const endY = this.y + Math.sin(this.angle) * this.length;

        // Draw main shard
        const gradient = ctx.createLinearGradient(this.x, this.y, endX, endY);
        gradient.addColorStop(
          0,
          this.color.replace(/[\d\.]+\)$/, this.currentOpacity + ")")
        );
        gradient.addColorStop(1, this.color.replace(/[\d\.]+\)$/, "0)"));

        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.width;
        ctx.lineCap = "round";
        ctx.stroke();

        ctx.restore();
      }
    }

    // Energy bolt class - chaotic electric bolts
    class EnergyBolt {
      constructor() {
        this.reset();
      }

      reset() {
        // Start at random point
        this.startX = Math.random() * canvas.width;
        this.startY = Math.random() * canvas.height;

        // End at another random point, not too far
        const angle = Math.random() * Math.PI * 2;
        const distance =
          Math.random() * (canvas.width * 0.3) + canvas.width * 0.1;
        this.endX = this.startX + Math.cos(angle) * distance;
        this.endY = this.startY + Math.sin(angle) * distance;

        // Bolt properties
        this.width = Math.random() * 1.5 + 0.5;
        this.segments = Math.floor(Math.random() * 5) + 3;
        this.jitter = Math.random() * 20 + 10;

        // Branch properties
        this.branches = Math.floor(Math.random() * 3);

        // Appearance
        this.baseHue = Math.random() < 0.7 ? 270 : 200; // Purple or blue
        this.hue = this.baseHue + Math.random() * 30 - 15;
        this.opacity = Math.random() * 0.6 + 0.2;

        // Animation
        this.duration = Math.random() * 30 + 15;
        this.life = 0;
        this.active = Math.random() < 0.3; // Only some are active initially

        // Generate points along the bolt
        this.generatePoints();
      }

      generatePoints() {
        this.points = [];

        // Main bolt
        for (let i = 0; i <= this.segments; i++) {
          const ratio = i / this.segments;
          const x = this.startX + (this.endX - this.startX) * ratio;
          const y = this.startY + (this.endY - this.startY) * ratio;

          // Add jitter for middle segments
          const jitterX =
            i > 0 && i < this.segments
              ? (Math.random() - 0.5) * this.jitter
              : 0;
          const jitterY =
            i > 0 && i < this.segments
              ? (Math.random() - 0.5) * this.jitter
              : 0;

          this.points.push({
            x: x + jitterX,
            y: y + jitterY,
          });
        }

        // Generate branches
        this.branchPoints = [];

        for (let i = 0; i < this.branches; i++) {
          const branchPoints = [];

          // Start from a random point on the main bolt (not the first or last)
          const startIdx = Math.floor(Math.random() * (this.segments - 1)) + 1;
          const startPoint = this.points[startIdx];

          // Random direction and shorter length
          const angle = Math.random() * Math.PI * 2;
          const length =
            Math.random() * (canvas.width * 0.15) + canvas.width * 0.05;
          const endX = startPoint.x + Math.cos(angle) * length;
          const endY = startPoint.y + Math.sin(angle) * length;

          // Generate branch segments
          const branchSegments = Math.floor(this.segments / 2) + 1;

          for (let j = 0; j <= branchSegments; j++) {
            const ratio = j / branchSegments;
            const x = startPoint.x + (endX - startPoint.x) * ratio;
            const y = startPoint.y + (endY - startPoint.y) * ratio;

            // Add jitter for middle segments
            const jitterX =
              j > 0 && j < branchSegments
                ? (Math.random() - 0.5) * this.jitter * 0.7
                : 0;
            const jitterY =
              j > 0 && j < branchSegments
                ? (Math.random() - 0.5) * this.jitter * 0.7
                : 0;

            branchPoints.push({
              x: x + jitterX,
              y: y + jitterY,
            });
          }

          this.branchPoints.push(branchPoints);
        }
      }

      update() {
        if (this.active) {
          this.life++;

          // Regenerate points occasionally for active bolts
          if (this.life % 5 === 0) {
            this.generatePoints();
          }

          // Deactivate after duration
          if (this.life >= this.duration) {
            this.active = false;
            this.life = 0;
          }
        } else {
          // Random chance to activate
          if (Math.random() < 0.01) {
            this.active = true;
            this.life = 0;
            this.reset();
          }
        }
      }

      draw() {
        if (!ctx || !this.active) return;

        // Draw main bolt
        ctx.strokeStyle = `hsla(${this.hue}, 90%, 65%, ${this.opacity})`;
        ctx.lineWidth = this.width;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);

        for (let i = 1; i <= this.segments; i++) {
          ctx.lineTo(this.points[i].x, this.points[i].y);
        }

        ctx.stroke();

        // Draw branches
        for (const branch of this.branchPoints) {
          ctx.beginPath();
          ctx.moveTo(branch[0].x, branch[0].y);

          for (let i = 1; i < branch.length; i++) {
            ctx.lineTo(branch[i].x, branch[i].y);
          }

          ctx.stroke();
        }

        // Add glow effect
        ctx.shadowColor = `hsla(${this.hue}, 90%, 75%, ${this.opacity * 0.7})`;
        ctx.shadowBlur = this.width * 3;

        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);

        for (let i = 1; i <= this.segments; i++) {
          ctx.lineTo(this.points[i].x, this.points[i].y);
        }

        ctx.stroke();

        ctx.shadowBlur = 0;
      }
    }

    // Create chaos energy particles
    for (let i = 0; i < particleCount; i++) {
      const particle = new ChaosParticle();
      // Stagger initial positions and lifespans
      particle.life = Math.random() * particle.maxLife;
      chaosParticles.push(particle);
    }

    // Create void shards
    for (let i = 0; i < shardCount; i++) {
      const shard = new VoidShard();
      // Stagger initial positions and lifespans
      shard.life = Math.random() * shard.maxLife;
      voidShards.push(shard);
    }

    // Create energy bolts
    for (let i = 0; i < boltCount; i++) {
      const bolt = new EnergyBolt();
      energyBolts.push(bolt);
    }

    // Create chaotic distortion field
    const createChaosField = () => {
      if (!ctx) return;

      // Generate a major chaotic pulse at a random location
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = Math.random() * (canvas.width * 0.3) + canvas.width * 0.1;

      // Create a radial gradient for the pulse
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, "rgba(120, 0, 180, 0.4)");
      gradient.addColorStop(0.4, "rgba(80, 0, 120, 0.2)");
      gradient.addColorStop(1, "rgba(40, 0, 80, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      // Add chaotic energy sparks
      for (let i = 0; i < 10; i++) {
        const sparkRadius = Math.random() * 5 + 2;
        const sparkDistance = Math.random() * radius * 0.8;
        const sparkAngle = Math.random() * Math.PI * 2;

        const sparkX = x + Math.cos(sparkAngle) * sparkDistance;
        const sparkY = y + Math.sin(sparkAngle) * sparkDistance;

        ctx.fillStyle = `rgba(200, ${Math.random() * 100 + 100}, 255, ${Math.random() * 0.5 + 0.3})`;
        ctx.beginPath();
        ctx.arc(sparkX, sparkY, sparkRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Create chaotic waves
      ctx.strokeStyle = "rgba(150, 50, 220, 0.2)";
      ctx.lineWidth = 2;

      for (let i = 0; i < 3; i++) {
        const waveRadius = radius * (0.6 + i * 0.2);

        ctx.beginPath();

        for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
          const noise = Math.random() * radius * 0.2;
          const waveX = x + Math.cos(angle) * (waveRadius + noise);
          const waveY = y + Math.sin(angle) * (waveRadius + noise);

          if (angle === 0) {
            ctx.moveTo(waveX, waveY);
          } else {
            ctx.lineTo(waveX, waveY);
          }
        }

        ctx.closePath();
        ctx.stroke();
      }

      // Activate bolts near the chaos pulse
      energyBolts.forEach((bolt) => {
        const dist = Math.hypot(bolt.startX - x, bolt.startY - y);
        if (dist < radius * 1.5) {
          bolt.active = true;
          bolt.life = 0;

          // Move the bolt closer to the chaos field
          bolt.startX = x + (Math.random() - 0.5) * radius * 0.5;
          bolt.startY = y + (Math.random() - 0.5) * radius * 0.5;
          bolt.generatePoints();
        }
      });

      // Trigger the visual effect for the component
      setChaosPulse(true);
      setTimeout(() => setChaosPulse(false), 400);
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw void shards first (background)
      voidShards.forEach((shard) => {
        shard.update();
        shard.draw();
      });

      // Draw chaos particles
      chaosParticles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      // Draw energy bolts (on top)
      energyBolts.forEach((bolt) => {
        bolt.update();
        bolt.draw();
      });

      requestAnimationFrame(animate);
    };

    animate();

    // Periodically create chaos fields
    const chaosInterval = setInterval(() => {
      if (Math.random() < 0.3) {
        // 30% chance each interval
        createChaosField();
      }
    }, 2500); // Check every 2.5 seconds

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      clearInterval(chaosInterval);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-[104px] h-[104px] max-w-md aspect-[4/4] rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 ${
        chaosPulse ? "contrast-150 hue-rotate-15" : ""
      }`}
    >
      {/* Dark background */}
      <div className="absolute inset-0 bg-slate-950 z-0"></div>

      {/* Chaotic void overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-slate-950 to-purple-950/30 z-0"></div>

      {/* Chaotic energy pattern */}
      <div
        className="absolute inset-0 opacity-20 z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 30% 20%, rgba(120,0,180,0.3) 0%, transparent 30%),
            radial-gradient(circle at 70% 60%, rgba(60,0,120,0.3) 0%, transparent 30%),
            radial-gradient(circle at 40% 80%, rgba(90,10,160,0.3) 0%, transparent 25%)
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

          {/* Dark vignette overlay */}
          <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.9)]"></div>

          {/* Chaotic energy effect */}
          <div
            className="absolute inset-0 mix-blend-color-dodge opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(45deg, 
                  rgba(60,0,120,0) 45%, 
                  rgba(120,20,180,0.3) 50%, 
                  rgba(60,0,120,0) 55%
                )
              `,
              backgroundSize: "300% 300%",
              animation: "chaosShift 5s ease-in-out infinite alternate",
            }}
          ></div>

          {/* Chaos pulse overlay */}
          <div
            className={`absolute inset-0 bg-purple-900/10 transition-opacity duration-300 ${
              chaosPulse ? "opacity-70" : "opacity-0"
            }`}
          ></div>
        </div>
      </div>

      {/* Decorative frame */}
      <div className="absolute inset-0 border border-purple-900/60 rounded-lg pointer-events-none z-30"></div>

      {/* Chaotic corner accents */}
      <div
        className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-indigo-700/60 rounded-tl-lg z-30"
        style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
      ></div>
      <div
        className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-purple-700/60 rounded-tr-lg z-30"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }}
      ></div>
      <div
        className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-purple-700/60 rounded-bl-lg z-30"
        style={{ clipPath: "polygon(0 0, 0 100%, 100% 100%)" }}
      ></div>
      <div
        className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-indigo-700/60 rounded-br-lg z-30"
        style={{ clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }}
      ></div>

      {/* Unstable energy glow */}
      <div className="absolute inset-0 rounded-lg shadow-[0_0_8px_rgba(120,20,180,0.3),inset_0_0_8px_rgba(120,20,180,0.3)] z-30 pointer-events-none"></div>

      {/* Add keyframe animation for chaos effects */}
      <style jsx global>{`
        @keyframes chaosShift {
          0% {
            background-position: 0% 0%;
          }
          100% {
            background-position: 100% 100%;
          }
        }
      `}</style>
    </div>
  );
}

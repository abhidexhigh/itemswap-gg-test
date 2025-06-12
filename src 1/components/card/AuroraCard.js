"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function AuroraCard({ image, name, title, description, stats }) {
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

    // Aurora parameters
    const auroraHeight = canvas.height * 0.6;
    const waveLayers = 5;

    // Aurora colors
    const auroraColors = [
      { h: 160, s: 80, l: 45 }, // Teal
      { h: 180, s: 85, l: 50 }, // Cyan
      { h: 200, s: 90, l: 55 }, // Sky blue
      { h: 240, s: 85, l: 60 }, // Blue
      { h: 280, s: 80, l: 50 }, // Purple
    ];

    // Animation timing
    let lastTime = 0;
    let elapsedTime = 0;

    // Star field parameters
    const stars = [];
    const starCount = 40;

    // Create stars
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * (canvas.height * 0.7), // Only in top part
        size: Math.random() * 1.2 + 0.3,
        twinkleSpeed: Math.random() * 0.002 + 0.001,
        twinkleOffset: Math.random() * Math.PI * 2,
      });
    }

    const drawAurora = (time) => {
      // Create a clip path for the top portion
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, canvas.width, auroraHeight);
      ctx.clip();

      // Very slow-moving time factor
      const slowTime = time * 0.0001;

      // Draw each wave layer
      for (let layer = 0; layer < waveLayers; layer++) {
        const colorIndex = layer % auroraColors.length;
        const color = auroraColors[colorIndex];

        // Wave properties
        const waveAmplitude = 8 + layer * 4; // Height of the wave
        const waveFrequency = 0.01 + layer * 0.005; // Frequency of the wave
        const waveSpeed = 0.04 + layer * 0.01; // Speed of wave movement
        const baseY = auroraHeight * 0.2 + layer * (auroraHeight * 0.15); // Vertical position

        // Create gradient for this wave
        const gradient = ctx.createLinearGradient(
          0,
          baseY - waveAmplitude * 2,
          0,
          baseY + waveAmplitude * 3
        );

        gradient.addColorStop(
          0,
          `hsla(${color.h}, ${color.s}%, ${color.l}%, 0)`
        );
        gradient.addColorStop(
          0.5,
          `hsla(${color.h}, ${color.s}%, ${color.l}%, 0.3)`
        );
        gradient.addColorStop(
          1,
          `hsla(${color.h}, ${color.s}%, ${color.l}%, 0)`
        );

        ctx.fillStyle = gradient;

        // Draw the wave
        ctx.beginPath();

        // Start at left edge, below the wave
        ctx.moveTo(0, canvas.height);

        // Draw left edge up to wave start
        ctx.lineTo(0, baseY);

        // Draw the wave across the canvas
        for (let x = 0; x <= canvas.width; x += 5) {
          // Multiple sine waves with different frequencies for more natural look
          const y =
            baseY +
            Math.sin(x * waveFrequency + slowTime * waveSpeed) * waveAmplitude +
            Math.sin(x * waveFrequency * 0.5 + slowTime * (waveSpeed * 0.7)) *
              (waveAmplitude * 0.5);

          ctx.lineTo(x, y);
        }

        // Complete the path
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();

        ctx.fill();
      }

      ctx.restore();
    };

    const drawStars = (time) => {
      stars.forEach((star) => {
        // Slow twinkle effect
        const twinkle =
          0.3 + 0.7 * Math.sin(time * star.twinkleSpeed + star.twinkleOffset);

        // Draw the star with varying opacity
        ctx.fillStyle = `rgba(255, 255, 255, ${twinkle * 0.7})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Add small glow
        const glow = ctx.createRadialGradient(
          star.x,
          star.y,
          0,
          star.x,
          star.y,
          star.size * 3
        );

        glow.addColorStop(0, `rgba(255, 255, 255, ${twinkle * 0.3})`);
        glow.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    // Animation loop
    const animate = (timestamp) => {
      // Calculate delta time
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      elapsedTime += deltaTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw night sky background gradient
      const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGradient.addColorStop(0, "rgba(10, 15, 30, 0.5)");
      skyGradient.addColorStop(0.5, "rgba(5, 10, 20, 0.3)");
      skyGradient.addColorStop(1, "rgba(0, 5, 10, 0)");

      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      drawStars(elapsedTime);

      // Draw aurora
      drawAurora(elapsedTime);

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
      {/* Base background */}
      <div className="absolute inset-0 bg-slate-950 z-0"></div>

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

          {/* Night overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-blue-950/20 to-indigo-950/30 mix-blend-multiply"></div>

          {/* Subtle highlight at top */}
          <div
            className="absolute top-0 left-0 right-0 h-12 opacity-30"
            style={{
              background:
                "linear-gradient(to bottom, rgba(150,200,255,0.2), transparent)",
            }}
          ></div>
        </div>
      </div>

      {/* Card border */}
      <div className="absolute inset-0 border border-indigo-500/20 rounded-lg pointer-events-none z-30"></div>

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-400/20 rounded-tl-lg z-30"></div>
      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-400/20 rounded-tr-lg z-30"></div>
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-indigo-500/20 rounded-bl-lg z-30"></div>
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-indigo-500/20 rounded-br-lg z-30"></div>

      {/* Night sky symbol */}
      <div className="absolute bottom-1.5 right-1.5 w-4 h-4 flex items-center justify-center z-40">
        <svg
          viewBox="0 0 24 24"
          className="w-3 h-3 text-cyan-400/60 fill-current"
        >
          <path d="M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z" />
        </svg>
      </div>

      {/* Subtle glow effect */}
      <div className="absolute inset-0 rounded-lg shadow-[0_0_12px_rgba(100,180,255,0.15),inset_0_0_6px_rgba(120,200,255,0.1)] z-30 pointer-events-none"></div>
    </div>
  );
}

'use client';

import { useEffect, useRef } from 'react';

interface ParticleOverlayProps {
  active: boolean;
}

interface Particle {
  type: 'image' | 'glow';
  img?: HTMLImageElement;
  color?: string; // For glow circles
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  targetSize: number;
  opacity: number;
  maxOpacity: number;
  rotation: number;
  spin: number;
  fadeSpeed: number;
  gravity: number;
  friction: number;
  driftSpeed: number;
  driftAmplitude: number;
  driftOffset: number;
}

const PARTICLE_SOURCES = [
  '/emoji/sticker1.webp',
  '/emoji/sticker2.webp',
  '/emoji/sticker3.webp',
  '/emoji/sticker4.webp',
  '/emoji/sticker5.webp',
  '/emoji/sticker6.webp',
  '/emoji/sticker7.webp',
  '/emoji/sticker8.webp',
  '/particel/c-.png',
  '/particel/c-sharp.png',
  '/particel/css-3.png',
  '/particel/java-script.png',
  '/particel/java.png',
  '/particel/physics.png',
  '/particel/python.png',
  '/particel/text.png',
  '/particel/bot.png',
  '/particel/code.png',
  '/particel/comit.svg',
  '/particel/database.png',
  '/particel/iot.png',
  '/particel/machine-learning.png',
  '/particel/robot-talking.png',
  '/particel/server.png',
  '/particel/social.png',
  '/particel/upb.png',
];

const GLOW_COLORS = [
  'rgba(175, 208, 110, 0.7)', // Pistachio
  'rgba(135, 174, 206, 0.7)', // Carolina Blue
  'rgba(248, 202, 7, 0.7)',   // Yellow
  'rgba(32, 44, 96, 0.7)'     // Delft Blue
];

export default function ParticleOverlay({ active }: ParticleOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const activeRef = useRef<boolean>(false);

  activeRef.current = active;

  // Preload images once
  useEffect(() => {
    if (imagesRef.current.length > 0) return;
    const loadedImages: HTMLImageElement[] = [];
    PARTICLE_SOURCES.forEach((src) => {
      const img = new Image();
      img.src = src;
      loadedImages.push(img);
    });
    imagesRef.current = loadedImages;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let spawnTimer = 0;
    let activeStartTime = 0;

    // Handle Resize
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Helper to create a single particle
    const createParticle = (x: number, y: number): Particle => {
      const finalType = Math.random() < 0.75 ? 'image' : 'glow';
      let img: HTMLImageElement | undefined;
      let color: string | undefined;

      if (finalType === 'image' && imagesRef.current.length > 0) {
        img = imagesRef.current[Math.floor(Math.random() * imagesRef.current.length)];
      } else {
        color = GLOW_COLORS[Math.floor(Math.random() * GLOW_COLORS.length)];
      }

      // Floating up from bottom
      const vx = (Math.random() - 0.5) * 1.5;
      const vy = -1.5 - Math.random() * 2.5;
      const friction = 0.99;
      const gravity = -0.01 - Math.random() * 0.02; // slow drift upward

      const size = 0; // grow size from zero
      const targetSize = finalType === 'image'
        ? (Math.random() * 16 + 16) // 25-50px for images
        : (Math.random() * 12 + 6);  // 6-18px for glow dots

      const maxOpacity = Math.random() * 0.3 + 0.7; // 0.7 - 1.0 max opacity
      const fadeSpeed = 0.002 + Math.random() * 0.004;

      return {
        type: finalType,
        img,
        color,
        x,
        y,
        vx,
        vy,
        size,
        targetSize,
        opacity: 0, // fade-in for rising particles
        maxOpacity,
        rotation: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.05,
        fadeSpeed,
        gravity,
        friction,
        driftSpeed: 0.01 + Math.random() * 0.02,
        driftAmplitude: Math.random() * 1.5,
        driftOffset: Math.random() * 100,
      };
    };

    // Simulation Loop
    const tick = (timestamp: number) => {
      // Clear canvas
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Track how long the overlay has been active
      if (activeRef.current) {
        if (activeStartTime === 0) {
          activeStartTime = Date.now();
        }
      } else {
        activeStartTime = 0;
      }

      // Generate continuous bottom particles if active, after a 3-second delay
      if (activeRef.current && activeStartTime > 0) {
        const elapsed = Date.now() - activeStartTime;
        if (elapsed >= 1000) {
          spawnTimer++;
          if (spawnTimer % 6 === 0) { // spawn every ~100ms
            const bottomX = Math.random() * window.innerWidth;
            const bottomY = window.innerHeight + 30;
            particlesRef.current.push(createParticle(bottomX, bottomY));
          }
        }
      }

      // Update & Draw Particles
      particlesRef.current = particlesRef.current.filter((p) => {
        // Physics update
        p.vx *= p.friction;
        p.vy *= p.friction;
        p.vy += p.gravity;
        p.x += p.vx + Math.sin(timestamp * p.driftSpeed + p.driftOffset) * p.driftAmplitude;
        p.y += p.vy;
        p.rotation += p.spin;

        // Size scaling animation
        if (p.size < p.targetSize) {
          p.size += (p.targetSize - p.size) * 0.1;
        }

        // Opacity animation (fade-in then fade-out)
        if (!activeRef.current) {
          // If deactivated, fade out everything quickly
          p.opacity -= 0.02;
        } else if (p.opacity < p.maxOpacity && p.vy < 0 && p.y > window.innerHeight - 200) {
          // Fade in when starting from bottom
          p.opacity += 0.05;
        } else {
          // Normal fade out over time
          p.opacity -= p.fadeSpeed;
        }

        // Remove dead particles
        if (p.opacity <= 0 || p.x < -100 || p.x > window.innerWidth + 100 || p.y < -100) {
          return false;
        }

        // Draw particle
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, p.opacity));
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.type === 'image' && p.img && (p.img.complete || p.img.naturalWidth > 0)) {
          // Draw image centered
          ctx.drawImage(p.img, -p.size / 2, -p.size / 2, p.size, p.size);
        } else {
          // Draw glowing circle
          const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size / 2);
          gradient.addColorStop(0, '#ffffff');
          gradient.addColorStop(0.3, p.color || 'rgba(255, 255, 255, 0.5)');
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
        return true;
      });

      animationId = requestAnimationFrame(tick);
    };

    animationId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
}

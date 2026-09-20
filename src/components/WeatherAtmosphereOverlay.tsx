import React, { useEffect, useRef } from 'react';
import { LightingMode, WeatherIntensity } from '../types';

interface WeatherAtmosphereOverlayProps {
  lightingMode: LightingMode;
  intensity?: WeatherIntensity;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseAlpha: number;
  alpha: number;
  phase: number;
  speed: number;
  wobbleSpeed: number;
  pulseSpeed: number;
  kind: 'mote' | 'mist' | 'sparkle';
}

interface LightRay {
  originX: number;
  originY: number;
  angle: number;
  width: number;
  length: number;
  intensity: number;
  pulsePhase: number;
  pulseSpeed: number;
}

export const WeatherAtmosphereOverlay: React.FC<WeatherAtmosphereOverlayProps> = ({
  lightingMode,
  intensity = 'subtle',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (intensity === 'off') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initRays();
    };

    window.addEventListener('resize', handleResize);

    // Mouse velocity & interaction tracking for atmospheric breeze
    let lastMouseX = -1000;
    let lastMouseY = -1000;
    let mouseVx = 0;
    let mouseVy = 0;
    let mouseActive = false;
    let mouseTimeout: NodeJS.Timeout | null = null;

    const handlePointerMove = (e: PointerEvent) => {
      if (lastMouseX > -500) {
        mouseVx = (e.clientX - lastMouseX) * 0.04;
        mouseVy = (e.clientY - lastMouseY) * 0.04;
      }
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      mouseActive = true;

      if (mouseTimeout) clearTimeout(mouseTimeout);
      mouseTimeout = setTimeout(() => {
        mouseActive = false;
        mouseVx = 0;
        mouseVy = 0;
      }, 150);
    };

    window.addEventListener('pointermove', handlePointerMove);

    // Dynamic Atmosphere Parameters per Lighting Mode
    // Colors & ray angles lerp smoothly between transitions
    const modeConfigs = {
      day: {
        // Crisp sunbeam angle from top-left skylight (35° to 45°)
        rayAngle: 0.72, // radians ~41°
        rayOriginX: 0.15,
        rayOriginY: -0.05,
        rayR: 255,
        rayG: 242,
        rayB: 205,
        rayAlphaBase: intensity === 'vivid' ? 0.18 : 0.11,
        // Dust motes: soft warm sunlight specks
        moteR: 255,
        moteG: 250,
        moteB: 225,
        moteAlpha: intensity === 'vivid' ? 0.75 : 0.55,
        moteCount: intensity === 'vivid' ? 85 : 55,
        mistR: 255,
        mistG: 245,
        mistB: 220,
        mistAlpha: intensity === 'vivid' ? 0.06 : 0.03,
        ambientGlowR: 255,
        ambientGlowG: 220,
        ambientGlowB: 160,
        ambientGlowAlpha: intensity === 'vivid' ? 0.08 : 0.04,
      },
      sunset: {
        // Dramatic low-angle golden hour shafts traversing room (70° angle)
        rayAngle: 1.25, // radians ~71°
        rayOriginX: -0.05,
        rayOriginY: 0.25,
        rayR: 255,
        rayG: 145,
        rayB: 65,
        rayAlphaBase: intensity === 'vivid' ? 0.24 : 0.15,
        // Dust motes: golden and copper glowing particles
        moteR: 255,
        moteG: 185,
        moteB: 95,
        moteAlpha: intensity === 'vivid' ? 0.85 : 0.65,
        moteCount: intensity === 'vivid' ? 95 : 65,
        mistR: 240,
        mistG: 120,
        mistB: 70,
        mistAlpha: intensity === 'vivid' ? 0.09 : 0.05,
        ambientGlowR: 255,
        ambientGlowG: 110,
        ambientGlowB: 40,
        ambientGlowAlpha: intensity === 'vivid' ? 0.12 : 0.06,
      },
      night: {
        // Cool architectural spotlights and soft lunar window rays
        rayAngle: 0.55, // radians ~31°
        rayOriginX: 0.35,
        rayOriginY: -0.08,
        rayR: 110,
        rayG: 175,
        rayB: 255,
        rayAlphaBase: intensity === 'vivid' ? 0.14 : 0.08,
        // Motes: cool cyan crystalline particles & occasional star-like twinkle
        moteR: 140,
        moteG: 215,
        moteB: 255,
        moteAlpha: intensity === 'vivid' ? 0.7 : 0.48,
        moteCount: intensity === 'vivid' ? 70 : 45,
        mistR: 60,
        mistG: 110,
        mistB: 200,
        mistAlpha: intensity === 'vivid' ? 0.08 : 0.04,
        ambientGlowR: 40,
        ambientGlowG: 90,
        ambientGlowB: 180,
        ambientGlowAlpha: intensity === 'vivid' ? 0.09 : 0.04,
      },
    };

    // Current interpolated state for silky smooth morphing
    const currentTheme = { ...modeConfigs[lightingMode] };

    // Initialize Light Rays
    let rays: LightRay[] = [];
    const initRays = () => {
      rays = [
        {
          originX: width * currentTheme.rayOriginX,
          originY: height * currentTheme.rayOriginY,
          angle: currentTheme.rayAngle - 0.1,
          width: width * 0.28,
          length: Math.hypot(width, height) * 1.2,
          intensity: 1.0,
          pulsePhase: 0,
          pulseSpeed: 0.012,
        },
        {
          originX: width * (currentTheme.rayOriginX + 0.12),
          originY: height * currentTheme.rayOriginY,
          angle: currentTheme.rayAngle + 0.04,
          width: width * 0.22,
          length: Math.hypot(width, height) * 1.15,
          intensity: 0.75,
          pulsePhase: 1.8,
          pulseSpeed: 0.016,
        },
        {
          originX: width * (currentTheme.rayOriginX - 0.08),
          originY: height * currentTheme.rayOriginY,
          angle: currentTheme.rayAngle + 0.14,
          width: width * 0.18,
          length: Math.hypot(width, height) * 1.1,
          intensity: 0.6,
          pulsePhase: 3.5,
          pulseSpeed: 0.009,
        },
      ];
    };

    initRays();

    // Initialize Particles (Dust Motes & Volumetric Mist Orbs)
    const maxParticles = 110;
    const particles: Particle[] = [];

    for (let i = 0; i < maxParticles; i++) {
      const isMist = i < 14;
      const isSparkle = i >= 14 && i < 26;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (isMist ? 0.15 : 0.4),
        vy: isMist ? (Math.random() - 0.5) * 0.1 : (Math.random() * 0.4 - 0.1),
        size: isMist ? Math.random() * 90 + 50 : isSparkle ? Math.random() * 2.5 + 1.2 : Math.random() * 2.8 + 1.0,
        baseAlpha: isMist ? Math.random() * 0.05 + 0.02 : Math.random() * 0.6 + 0.2,
        alpha: 0.5,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.4 + 0.2,
        wobbleSpeed: Math.random() * 0.02 + 0.008,
        pulseSpeed: Math.random() * 0.03 + 0.015,
        kind: isMist ? 'mist' : isSparkle ? 'sparkle' : 'mote',
      });
    }

    let time = 0;

    const render = () => {
      time += 0.016;

      // 1. Lerp current atmospheric color & angle towards target lightingMode
      const target = modeConfigs[lightingMode];
      const lerpSpeed = 0.035;

      currentTheme.rayAngle += (target.rayAngle - currentTheme.rayAngle) * lerpSpeed;
      currentTheme.rayOriginX += (target.rayOriginX - currentTheme.rayOriginX) * lerpSpeed;
      currentTheme.rayOriginY += (target.rayOriginY - currentTheme.rayOriginY) * lerpSpeed;
      currentTheme.rayR += (target.rayR - currentTheme.rayR) * lerpSpeed;
      currentTheme.rayG += (target.rayG - currentTheme.rayG) * lerpSpeed;
      currentTheme.rayB += (target.rayB - currentTheme.rayB) * lerpSpeed;
      currentTheme.rayAlphaBase += (target.rayAlphaBase - currentTheme.rayAlphaBase) * lerpSpeed;

      currentTheme.moteR += (target.moteR - currentTheme.moteR) * lerpSpeed;
      currentTheme.moteG += (target.moteG - currentTheme.moteG) * lerpSpeed;
      currentTheme.moteB += (target.moteB - currentTheme.moteB) * lerpSpeed;
      currentTheme.moteAlpha += (target.moteAlpha - currentTheme.moteAlpha) * lerpSpeed;

      currentTheme.mistR += (target.mistR - currentTheme.mistR) * lerpSpeed;
      currentTheme.mistG += (target.mistG - currentTheme.mistG) * lerpSpeed;
      currentTheme.mistB += (target.mistB - currentTheme.mistB) * lerpSpeed;
      currentTheme.mistAlpha += (target.mistAlpha - currentTheme.mistAlpha) * lerpSpeed;

      currentTheme.ambientGlowR += (target.ambientGlowR - currentTheme.ambientGlowR) * lerpSpeed;
      currentTheme.ambientGlowG += (target.ambientGlowG - currentTheme.ambientGlowG) * lerpSpeed;
      currentTheme.ambientGlowB += (target.ambientGlowB - currentTheme.ambientGlowB) * lerpSpeed;
      currentTheme.ambientGlowAlpha += (target.ambientGlowAlpha - currentTheme.ambientGlowAlpha) * lerpSpeed;

      // Clear Canvas
      ctx.clearRect(0, 0, width, height);

      // 2. Render Ambient Horizon Glow / Lens Vignette Bloom
      const glowOriginX = width * Math.max(0, Math.min(1, currentTheme.rayOriginX));
      const glowOriginY = height * Math.max(0, Math.min(1, Math.abs(currentTheme.rayOriginY)));
      const glowGrad = ctx.createRadialGradient(
        glowOriginX,
        glowOriginY,
        10,
        glowOriginX,
        glowOriginY,
        width * 0.75
      );
      glowGrad.addColorStop(
        0,
        `rgba(${Math.round(currentTheme.ambientGlowR)}, ${Math.round(currentTheme.ambientGlowG)}, ${Math.round(currentTheme.ambientGlowB)}, ${currentTheme.ambientGlowAlpha * 1.5})`
      );
      glowGrad.addColorStop(
        0.5,
        `rgba(${Math.round(currentTheme.ambientGlowR)}, ${Math.round(currentTheme.ambientGlowG)}, ${Math.round(currentTheme.ambientGlowB)}, ${currentTheme.ambientGlowAlpha * 0.4})`
      );
      glowGrad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);

      // 3. Render Volumetric Light Rays (God-Rays)
      rays.forEach((ray, idx) => {
        ray.originX = width * (currentTheme.rayOriginX + (idx === 1 ? 0.12 : idx === 2 ? -0.08 : 0));
        ray.originY = height * currentTheme.rayOriginY;
        ray.angle = currentTheme.rayAngle + (idx === 1 ? 0.04 : idx === 2 ? 0.12 : -0.06);

        // Soft breathing pulsation in the light shafts
        const pulse = 0.8 + Math.sin(time * 1.2 + ray.pulsePhase) * 0.2;
        const currentRayAlpha = currentTheme.rayAlphaBase * ray.intensity * pulse;

        ctx.save();
        ctx.translate(ray.originX, ray.originY);
        ctx.rotate(ray.angle);

        // Volumetric ray projection gradient
        const rayGrad = ctx.createLinearGradient(0, 0, ray.length, 0);
        rayGrad.addColorStop(
          0,
          `rgba(${Math.round(currentTheme.rayR)}, ${Math.round(currentTheme.rayG)}, ${Math.round(currentTheme.rayB)}, ${currentRayAlpha * 1.6})`
        );
        rayGrad.addColorStop(
          0.35,
          `rgba(${Math.round(currentTheme.rayR)}, ${Math.round(currentTheme.rayG)}, ${Math.round(currentTheme.rayB)}, ${currentRayAlpha * 0.9})`
        );
        rayGrad.addColorStop(
          0.75,
          `rgba(${Math.round(currentTheme.rayR)}, ${Math.round(currentTheme.rayG)}, ${Math.round(currentTheme.rayB)}, ${currentRayAlpha * 0.25})`
        );
        rayGrad.addColorStop(1, 'rgba(0,0,0,0)');

        // Cross-section trapezoid for natural light dispersion
        ctx.fillStyle = rayGrad;
        ctx.beginPath();
        const startHalf = ray.width * 0.15;
        const endHalf = ray.width * 1.4;
        ctx.moveTo(0, -startHalf);
        ctx.lineTo(ray.length, -endHalf);
        ctx.lineTo(ray.length, endHalf);
        ctx.lineTo(0, startHalf);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      });

      // 4. Render Atmospheric Particles (Dust Motes, Mist Orbs & Sparkles)
      const activeCount = Math.min(particles.length, target.moteCount);

      for (let i = 0; i < activeCount; i++) {
        const p = particles[i];

        // Gentle Brownian oscillation
        p.phase += p.wobbleSpeed;
        const wobbleX = Math.sin(p.phase) * 0.35;
        const wobbleY = Math.cos(p.phase * 0.7) * 0.25;

        // Interactive mouse impulse: if cursor is near, nudge particles away like a soft breeze
        if (mouseActive) {
          const dx = p.x - lastMouseX;
          const dy = p.y - lastMouseY;
          const distSq = dx * dx + dy * dy;
          const maxDist = 220;
          if (distSq < maxDist * maxDist && distSq > 1) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / maxDist) * 0.7;
            p.vx += (dx / dist) * force + mouseVx * 0.3;
            p.vy += (dy / dist) * force + mouseVy * 0.3;
          }
        }

        // Apply physics with damping
        p.x += p.vx + wobbleX;
        p.y += p.vy + wobbleY;
        p.vx *= 0.96;
        p.vy *= 0.96;

        // Wrap around boundaries seamlessly
        if (p.x < -100) p.x = width + 50;
        if (p.x > width + 100) p.x = -50;
        if (p.y < -100) p.y = height + 50;
        if (p.y > height + 100) p.y = -50;

        // Calculate illumination boost if particle floats inside a sun/light beam
        let rayBoost = 1.0;
        rays.forEach((ray) => {
          const rx = p.x - ray.originX;
          const ry = p.y - ray.originY;
          // Rotate point into ray's local coordinates
          const localX = rx * Math.cos(-ray.angle) - ry * Math.sin(-ray.angle);
          const localY = rx * Math.sin(-ray.angle) + ry * Math.cos(-ray.angle);
          if (localX > 0 && localX < ray.length) {
            const maxRayWidthAtX = ray.width * (0.15 + (localX / ray.length) * 1.25);
            if (Math.abs(localY) < maxRayWidthAtX) {
              const rayCoreProximity = 1 - Math.abs(localY) / maxRayWidthAtX;
              rayBoost += rayCoreProximity * 0.85;
            }
          }
        });

        // Pulsing sparkle opacity
        const pulse = 0.75 + Math.sin(time * 2.5 + p.phase * 3) * 0.25;

        if (p.kind === 'mist') {
          // Soft ambient mist puff
          const mistGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          const alpha = currentTheme.mistAlpha * rayBoost;
          mistGrad.addColorStop(
            0,
            `rgba(${Math.round(currentTheme.mistR)}, ${Math.round(currentTheme.mistG)}, ${Math.round(currentTheme.mistB)}, ${alpha})`
          );
          mistGrad.addColorStop(
            0.6,
            `rgba(${Math.round(currentTheme.mistR)}, ${Math.round(currentTheme.mistG)}, ${Math.round(currentTheme.mistB)}, ${alpha * 0.3})`
          );
          mistGrad.addColorStop(1, 'rgba(0,0,0,0)');

          ctx.fillStyle = mistGrad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.kind === 'sparkle') {
          // Micro-sparkle with 4-point subtle star glint
          const alpha = Math.min(1, currentTheme.moteAlpha * pulse * rayBoost * 1.2);
          ctx.fillStyle = `rgba(${Math.round(currentTheme.moteR)}, ${Math.round(currentTheme.moteG)}, ${Math.round(currentTheme.moteB)}, ${alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.8, 0, Math.PI * 2);
          ctx.fill();

          // Delicate starlight cross rays
          if (pulse > 0.85) {
            ctx.strokeStyle = `rgba(${Math.round(currentTheme.moteR)}, ${Math.round(currentTheme.moteG)}, ${Math.round(currentTheme.moteB)}, ${alpha * 0.6})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            const arm = p.size * 3;
            ctx.moveTo(p.x - arm, p.y);
            ctx.lineTo(p.x + arm, p.y);
            ctx.moveTo(p.x, p.y - arm);
            ctx.lineTo(p.x, p.y + arm);
            ctx.stroke();
          }
        } else {
          // Classic illuminated floating dust mote
          const alpha = Math.min(0.95, currentTheme.moteAlpha * p.baseAlpha * pulse * rayBoost);
          ctx.fillStyle = `rgba(${Math.round(currentTheme.moteR)}, ${Math.round(currentTheme.moteG)}, ${Math.round(currentTheme.moteB)}, ${alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animFrameId = requestAnimationFrame(render);
    };

    // Start loop
    animFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      if (mouseTimeout) clearTimeout(mouseTimeout);
    };
  }, [lightingMode, intensity]);

  if (intensity === 'off') return null;

  return (
    <canvas
      ref={canvasRef}
      id="weather-atmosphere-canvas"
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-10 h-full w-full mix-blend-screen transition-opacity duration-1000"
    />
  );
};

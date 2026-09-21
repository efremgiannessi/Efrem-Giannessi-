import React, { useEffect, useRef } from 'react';

interface ActiveTheoryCanvasProps {
  intensity?: number;
}

export const ActiveTheoryCanvas: React.FC<ActiveTheoryCanvasProps> = ({ intensity = 1.0 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse tracker
    const mouse = {
      x: width * 0.5,
      y: height * 0.4,
      targetX: width * 0.5,
      targetY: height * 0.4,
      radius: 200,
      active: false,
    };

    // Particles mesh
    const numCols = Math.floor(width / 45);
    const numRows = Math.floor(height / 45);
    const particles: {
      origX: number;
      origY: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      phase: number;
    }[] = [];

    const colors = [
      'rgba(0, 240, 255, ', // Cyan (Active Theory signature)
      'rgba(147, 51, 234, ', // Deep Violet
      'rgba(245, 158, 11, ', // Architectural Amber
      'rgba(255, 255, 255, ', // Crisp White
    ];

    for (let c = 0; c <= numCols; c++) {
      for (let r = 0; r <= numRows; r++) {
        const x = (c / numCols) * width;
        const y = (r / numRows) * height;
        const colorBase = colors[(c + r) % colors.length];
        particles.push({
          origX: x,
          origY: y,
          x: x + (Math.random() - 0.5) * 10,
          y: y + (Math.random() - 0.5) * 10,
          vx: 0,
          vy: 0,
          size: Math.random() > 0.85 ? 1.8 : 1.0,
          color: colorBase,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    // Interactive Floating Energy Orbs (Active Theory ambient light fluid)
    const orbs = [
      { x: width * 0.2, y: height * 0.3, vx: 0.2, vy: 0.15, radius: 280, color: 'rgba(0, 240, 255, 0.04)' },
      { x: width * 0.8, y: height * 0.6, vx: -0.18, vy: 0.12, radius: 340, color: 'rgba(139, 92, 246, 0.045)' },
      { x: width * 0.5, y: height * 0.8, vx: 0.12, vy: -0.15, radius: 300, color: 'rgba(245, 158, 11, 0.035)' },
    ];

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        mouse.targetX = e.touches[0].clientX;
        mouse.targetY = e.touches[0].clientY;
        mouse.active = true;
      }
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    // Click shockwave ripples
    const shockwaves: { x: number; y: number; radius: number; maxRadius: number; opacity: number }[] = [];

    const handleClick = (e: MouseEvent) => {
      shockwaves.push({
        x: e.clientX,
        y: e.clientY,
        radius: 5,
        maxRadius: Math.min(width, height) * 0.45,
        opacity: 0.9,
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('click', handleClick, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    let time = 0;

    const render = () => {
      time += 0.015;

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      ctx.clearRect(0, 0, width, height);

      // 1. Deep Void Ambient Background with Subtle Gradient
      ctx.fillStyle = '#050507';
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Ethereal Glowing Orbs
      orbs.forEach((orb) => {
        orb.x += orb.vx;
        orb.y += orb.vy;

        if (orb.x < -orb.radius) orb.x = width + orb.radius;
        if (orb.x > width + orb.radius) orb.x = -orb.radius;
        if (orb.y < -orb.radius) orb.y = height + orb.radius;
        if (orb.y > height + orb.radius) orb.y = -orb.radius;

        const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
        grad.addColorStop(0, orb.color);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Update and draw shockwaves
      for (let s = shockwaves.length - 1; s >= 0; s--) {
        const sw = shockwaves[s];
        sw.radius += 8;
        sw.opacity *= 0.94;

        ctx.strokeStyle = `rgba(0, 240, 255, ${sw.opacity * 0.6})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.stroke();

        // Secondary amber ring
        if (sw.radius > 20) {
          ctx.strokeStyle = `rgba(245, 158, 11, ${sw.opacity * 0.3})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(sw.x, sw.y, sw.radius * 0.75, 0, Math.PI * 2);
          ctx.stroke();
        }

        if (sw.opacity < 0.02 || sw.radius > sw.maxRadius) {
          shockwaves.splice(s, 1);
        }
      }

      // 3. Update & Draw Dynamic Particle Mesh
      const step = 4;
      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];

        // Harmonic Wave Movement
        const wave = Math.sin(time + p.origX * 0.005 + p.phase) * 6;
        const wave2 = Math.cos(time * 0.8 + p.origY * 0.005 + p.phase) * 5;

        let targetX = p.origX + wave2;
        let targetY = p.origY + wave;

        // Mouse displacement & repulsion (Active Theory signature ripple)
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (1 - dist / mouse.radius) * 38 * intensity;
          const angle = Math.atan2(dy, dx);
          targetX -= Math.cos(angle) * force;
          targetY -= Math.sin(angle) * force;
        }

        // Shockwave displacement
        for (let s = 0; s < shockwaves.length; s++) {
          const sw = shockwaves[s];
          const sdx = p.x - sw.x;
          const sdy = p.y - sw.y;
          const sdist = Math.sqrt(sdx * sdx + sdy * sdy);
          const diff = Math.abs(sdist - sw.radius);
          if (diff < 40) {
            const sforce = (1 - diff / 40) * 15 * sw.opacity;
            const sAngle = Math.atan2(sdy, sdx);
            targetX += Math.cos(sAngle) * sforce;
            targetY += Math.sin(sAngle) * sforce;
          }
        }

        // Particle Physics
        p.vx = (targetX - p.x) * 0.12;
        p.vy = (targetY - p.y) * 0.12;
        p.x += p.vx;
        p.y += p.vy;

        // Draw particle node
        const alpha = Math.max(0.08, Math.min(0.7, (1 - dist / (mouse.radius * 1.5)) * 0.85 * intensity));
        ctx.fillStyle = `${p.color}${alpha})`;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }

      // 4. Subtle Interconnecting Wireframe Lines (Architectural Grid Lines)
      ctx.lineWidth = 0.5;
      const connectionDist = 55;
      for (let i = 0; i < particles.length; i += step) {
        const p1 = particles[i];
        const dxM = mouse.x - p1.x;
        const dyM = mouse.y - p1.y;
        const distM = Math.sqrt(dxM * dxM + dyM * dyM);

        if (distM < mouse.radius * 1.2) {
          for (let j = i + 1; j < Math.min(i + 12, particles.length); j++) {
            const p2 = particles[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const d = Math.sqrt(dx * dx + dy * dy);

            if (d < connectionDist) {
              const lineAlpha = (1 - d / connectionDist) * 0.18 * (1 - distM / (mouse.radius * 1.2));
              ctx.strokeStyle = `rgba(0, 240, 255, ${lineAlpha})`;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      id="active-theory-fluid-canvas"
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

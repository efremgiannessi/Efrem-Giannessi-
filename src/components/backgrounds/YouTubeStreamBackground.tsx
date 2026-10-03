import React, { useEffect, useRef } from 'react';

export const YouTubeStreamBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.offsetWidth || 1200;
    let height = canvas.offsetHeight || 800;
    canvas.width = width;
    canvas.height = height;

    const handleResize = () => {
      if (!canvas) return;
      if (canvas.offsetWidth > 0 && canvas.offsetHeight > 0) {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
      }
    };

    window.addEventListener('resize', handleResize);

    // Floating particles & streaming glyphs
    interface Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      alpha: number;
      rot: number;
      rotSpeed: number;
      type: 'play' | 'orb' | 'spark' | 'ring';
    }

    const particles: Particle[] = Array.from({ length: 50 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 8 + 3,
      speedY: -(Math.random() * 0.8 + 0.3),
      speedX: (Math.random() - 0.5) * 0.5,
      alpha: Math.random() * 0.6 + 0.3,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.04,
      type: Math.random() > 0.6 ? 'play' : Math.random() > 0.3 ? 'orb' : Math.random() > 0.15 ? 'ring' : 'spark',
    }));

    const barCount = 56;
    let time = 0;

    const render = () => {
      // Dynamic resize check
      if (canvas.offsetWidth > 0 && canvas.offsetHeight > 0) {
        if (canvas.width !== canvas.offsetWidth || canvas.height !== canvas.offsetHeight) {
          width = canvas.width = canvas.offsetWidth;
          height = canvas.height = canvas.offsetHeight;
        }
      }

      if (!width || !height || width <= 0 || height <= 0 || !Number.isFinite(width) || !Number.isFinite(height)) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      time += 0.025;
      ctx.clearRect(0, 0, width, height);

      // 1. Ambient Background Glowing Red/Magenta Gradients
      const glow1 = ctx.createRadialGradient(width * 0.25, height * 0.35, 10, width * 0.25, height * 0.35, width * 0.45);
      glow1.addColorStop(0, 'rgba(239, 68, 68, 0.18)');
      glow1.addColorStop(0.5, 'rgba(185, 28, 28, 0.08)');
      glow1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glow1;
      ctx.fillRect(0, 0, width, height);

      const glow2 = ctx.createRadialGradient(width * 0.8, height * 0.6, 20, width * 0.8, height * 0.6, width * 0.5);
      glow2.addColorStop(0, 'rgba(244, 63, 94, 0.16)');
      glow2.addColorStop(0.6, 'rgba(217, 70, 239, 0.06)');
      glow2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glow2;
      ctx.fillRect(0, 0, width, height);

      // 2. High-Tech Cyber Scanlines Grid
      ctx.fillStyle = 'rgba(255, 30, 60, 0.035)';
      for (let y = 0; y < height; y += 6) {
        ctx.fillRect(0, y, width, 1.5);
      }

      // 3. Oscilloscope / Sine Audio Frequency Waveform in Mid-Ground
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 68, 68, 0.45)';
      ctx.shadowColor = 'rgba(255, 30, 60, 0.8)';
      ctx.shadowBlur = 12;
      ctx.lineWidth = 2;
      ctx.beginPath();
      const waveMidY = height * 0.72;
      for (let x = 0; x <= width; x += 15) {
        const sinWave = Math.sin(time * 2 + x * 0.012) * 25 + Math.cos(time * 1.2 + x * 0.02) * 15;
        if (x === 0) ctx.moveTo(x, waveMidY + sinWave);
        else ctx.lineTo(x, waveMidY + sinWave);
      }
      ctx.stroke();

      // Secondary Amber Harmonic Wave
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.35)';
      ctx.shadowColor = 'rgba(251, 191, 36, 0.7)';
      ctx.shadowBlur = 8;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = 0; x <= width; x += 15) {
        const sinWave2 = Math.sin(time * 2.8 + x * 0.015) * 18 + Math.sin(time * 0.9 - x * 0.008) * 12;
        if (x === 0) ctx.moveTo(x, waveMidY - 15 + sinWave2);
        else ctx.lineTo(x, waveMidY - 15 + sinWave2);
      }
      ctx.stroke();
      ctx.restore();

      // 4. Vibrant Neon Spectrum Equalizer Bars along the bottom (LUMINOUS & TALL)
      const barWidth = width / barCount;
      for (let i = 0; i < barCount; i++) {
        const waveA = Math.sin(time * 2.2 + i * 0.22);
        const waveB = Math.cos(time * 1.1 + i * 0.45);
        const waveC = Math.sin(time * 3.1 + i * 0.12);
        const intensity = (waveA + waveB + waveC + 3) / 6; // 0..1

        const barHeight = Math.max(15, 25 + intensity * 140);
        const x = i * barWidth;
        const y = Math.max(0, height - barHeight);

        if (Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(height)) {
          // Intense Red & Crimson to Amber Gradient
          const gradient = ctx.createLinearGradient(x, y, x, Math.max(y + 1, height));
          gradient.addColorStop(0, `rgba(255, 50, 75, ${0.45 + intensity * 0.45})`);
          gradient.addColorStop(0.35, `rgba(220, 38, 38, ${0.28 + intensity * 0.35})`);
          gradient.addColorStop(0.75, `rgba(185, 28, 28, ${0.15 + intensity * 0.2})`);
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.fillStyle = gradient;
          ctx.fillRect(x + 1.5, y, Math.max(1, barWidth - 3), barHeight);

          // Glowing Cap Spark on top of each bar
          ctx.fillStyle = `rgba(255, 255, 255, ${0.7 + intensity * 0.3})`;
          ctx.fillRect(x + 1.5, Math.max(0, y - 3), Math.max(1, barWidth - 3), 3);

          // Neon Glow line right under cap
          ctx.fillStyle = `rgba(255, 100, 100, ${0.5 + intensity * 0.4})`;
          ctx.fillRect(x + 1.5, Math.max(0, y), Math.max(1, barWidth - 3), 2);
        }
      }

      // 5. Floating Streaming Play Icons & Luminous Photons
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rot += p.rotSpeed;

        if (p.y < -30) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }
        if (p.x < -20) p.x = width + 10;
        if (p.x > width + 20) p.x = -10;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);

        if (p.type === 'play') {
          // Luminous Triangle Play Button with Neon Halo
          ctx.shadowColor = 'rgba(255, 0, 60, 0.9)';
          ctx.shadowBlur = 14;
          ctx.fillStyle = `rgba(255, 50, 80, ${p.alpha})`;
          ctx.beginPath();
          ctx.moveTo(-p.size, -p.size * 0.85);
          ctx.lineTo(p.size * 1.3, 0);
          ctx.lineTo(-p.size, p.size * 0.85);
          ctx.closePath();
          ctx.fill();

          // White center dot
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.9})`;
          ctx.fillRect(-1.5, -1.5, 3, 3);
        } else if (p.type === 'ring') {
          // Concentric Neon Pulse Ring
          ctx.strokeStyle = `rgba(255, 75, 75, ${p.alpha * 0.8})`;
          ctx.shadowColor = 'rgba(255, 30, 60, 0.7)';
          ctx.shadowBlur = 10;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 1.4, 0, Math.PI * 2);
          ctx.stroke();
        } else if (p.type === 'orb') {
          // Glowing Red/Amber Flare Orb
          const radGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 3);
          radGrad.addColorStop(0, `rgba(255, 120, 80, ${p.alpha})`);
          radGrad.addColorStop(0.4, `rgba(239, 68, 68, ${p.alpha * 0.6})`);
          radGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
          ctx.fillStyle = radGrad;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 3, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Intense White/Pink Spark
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
          ctx.shadowColor = 'rgba(255, 60, 100, 1)';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.8, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      // 6. Cinematic Moving Broadcast Timecode Bar along the top
      ctx.save();
      const tcOffset = (time * 20) % 60;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.fillRect(0, 15, width, 18);
      for (let tx = -60 + tcOffset; tx < width + 60; tx += 60) {
        ctx.fillStyle = 'rgba(255, 50, 75, 0.18)';
        ctx.fillRect(tx, 18, 20, 12);
      }
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {/* High-Impact Canvas Layer */}
      <canvas 
        ref={canvasRef} 
        className="w-full h-full block" 
      />

      {/* Futuristic Telemetry HUD Stamps */}
      <div className="absolute top-8 right-6 font-mono text-[10px] text-red-400/50 tracking-widest hidden md:flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping shadow-[0_0_10px_rgba(255,0,50,1)]" />
        <span>LIVE YOUTUBE STREAM // 4K 60FPS • BITRATE: 38.4 Mbps</span>
      </div>

      <div className="absolute bottom-10 left-8 font-mono text-[10px] text-rose-400/40 tracking-widest hidden md:block">
        AUTODESK REVIT PRECAST API // AUDIO-VISUAL WORKFLOW STREAM
      </div>

      {/* Subtle Bottom & Top Edge Fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#07080b]/50 via-transparent to-[#07080b]/70 pointer-events-none" />
    </div>
  );
};

import React, { useState, useEffect } from 'react';

interface ActiveTheoryHUDProps {
  currentProjectIndex?: number;
  totalProjects?: number;
  activeViewMode?: 'flow' | 'grid' | 'index';
}

export const ActiveTheoryHUD: React.FC<ActiveTheoryHUDProps> = ({
  currentProjectIndex = 1,
  totalProjects = 6,
  activeViewMode = 'flow',
}) => {
  const [fps, setFps] = useState<number>(60);
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    // Clock
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('it-IT', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    // Subtle FPS monitor
    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;

    const measureFps = () => {
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setFps(Math.min(60, Math.round((frameCount * 1000) / (now - lastTime))));
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(measureFps);
    };
    animId = requestAnimationFrame(measureFps);

    return () => {
      clearInterval(interval);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      id="active-theory-hud"
      className="fixed inset-0 pointer-events-none z-30 select-none overflow-hidden"
      aria-hidden="true"
    >
      {/* 1. Corner Technical Crosshairs */}
      <div className="absolute top-4 left-4 text-white/30 font-mono text-[10px] flex items-center gap-1.5">
        <span className="text-cyan-400 font-bold">+</span>
        <span className="hidden sm:inline tracking-widest text-[9px] uppercase">LAT: 43.7696° N</span>
      </div>

      <div className="absolute top-4 right-4 text-white/30 font-mono text-[10px] flex items-center gap-1.5">
        <span className="hidden sm:inline tracking-widest text-[9px] uppercase">LON: 11.2558° E</span>
        <span className="text-cyan-400 font-bold">+</span>
      </div>

      <div className="absolute bottom-4 left-4 text-white/30 font-mono text-[10px] flex items-center gap-2">
        <span className="text-amber-400 font-bold">+</span>
        <span className="hidden md:inline tracking-widest text-[9px] uppercase">
          SYS // BIM 5D • REVIT SDK • WEBGL2.0
        </span>
      </div>

      <div className="absolute bottom-4 right-4 text-white/30 font-mono text-[10px] flex items-center gap-2">
        <span className="hidden sm:inline tracking-widest text-[9px] uppercase text-white/40">
          FPS {fps}.0 • {timeStr} CET
        </span>
        <span className="text-amber-400 font-bold">+</span>
      </div>

      {/* Subtle Vertical Technical Side Gauge */}
      <div className="hidden lg:flex flex-col items-center justify-center absolute left-4 top-1/2 -translate-y-1/2 gap-3 text-white/20 font-mono text-[8px] tracking-widest uppercase [writing-mode:vertical-rl] rotate-180">
        <span>ARCHITECTURAL COMPUTING</span>
        <div className="w-px h-12 bg-white/10" />
        <span className="text-cyan-400/60 font-semibold">VIEW // {activeViewMode}</span>
      </div>

      {/* Subtle Right Side Project Indicator */}
      <div className="hidden lg:flex flex-col items-center justify-center absolute right-4 top-1/2 -translate-y-1/2 gap-3 text-white/20 font-mono text-[8px] tracking-widest uppercase [writing-mode:vertical-rl]">
        <span>EFREM GIANNESSI STUDIO</span>
        <div className="w-px h-12 bg-white/10" />
        <span className="text-amber-400/60 font-semibold">
          INDEX [{String(currentProjectIndex).padStart(2, '0')} / {String(totalProjects).padStart(2, '0')}]
        </span>
      </div>
    </div>
  );
};

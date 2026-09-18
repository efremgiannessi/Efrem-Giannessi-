import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { OfficeStation, LightingMode, Hotspot } from '../types';

interface OfficeVideoCanvasProps {
  currentStation: OfficeStation;
  lightingMode: LightingMode;
  isTransitioning: boolean;
  transitionDirection: 'left' | 'right' | 'direct';
  onSelectHotspot: (hotspot: Hotspot) => void;
  showHotspots: boolean;
}

export const OfficeVideoCanvas: React.FC<OfficeVideoCanvasProps> = ({
  currentStation,
  lightingMode,
  isTransitioning,
  transitionDirection,
  onSelectHotspot,
  showHotspots,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mouse parallax state
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [smoothMouse, setSmoothMouse] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Handle mouse move for interactive 3D camera pan
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    // Normalized between -1 and 1
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  }, []);

  // Handle touch move for mobile interactivity
  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || !e.touches[0]) return;
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((touch.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  }, []);

  // Smooth interpolation of mouse movement
  useEffect(() => {
    let animId: number;
    const animate = () => {
      setSmoothMouse((prev) => ({
        x: prev.x + (mousePos.x - prev.x) * 0.05,
        y: prev.y + (mousePos.y - prev.y) * 0.05,
      }));
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [mousePos]);

  // Floating ambient light particles canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Generate floating dust particles / light orbs
    const count = 35;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.8,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -Math.random() * 0.4 - 0.1,
      alpha: Math.random() * 0.5 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      angle: Math.random() * Math.PI * 2,
    }));

    let animId: number;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX + smoothMouse.x * 0.3;
        p.y += p.speedY + smoothMouse.y * 0.2;
        p.angle += p.pulseSpeed;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const currentAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.angle));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        if (lightingMode === 'sunset') {
          ctx.fillStyle = `rgba(255, 210, 150, ${currentAlpha})`;
        } else if (lightingMode === 'night') {
          ctx.fillStyle = `rgba(160, 200, 255, ${currentAlpha * 1.2})`;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha * 0.8})`;
        }
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [smoothMouse, lightingMode]);

  // Active background based on current lighting mode
  const currentBgUrl = currentStation.backgrounds[lightingMode];

  // Lighting overlay filter classes
  const getLightingFilter = () => {
    switch (lightingMode) {
      case 'sunset':
        return 'mix-blend-color-burn bg-gradient-to-t from-amber-900/40 via-orange-500/20 to-rose-900/30';
      case 'night':
        return 'mix-blend-multiply bg-gradient-to-t from-blue-950/70 via-indigo-950/40 to-slate-900/60';
      default:
        return 'bg-gradient-to-t from-black/40 via-transparent to-black/20';
    }
  };

  // Parallax transform calculation
  const parallaxX = smoothMouse.x * 18 + currentStation.cameraAngle.panX;
  const parallaxY = smoothMouse.y * 12 + currentStation.cameraAngle.panY;
  const rotateY = smoothMouse.x * 2.5;
  const rotateX = -smoothMouse.y * 2.5;
  const baseZoom = currentStation.cameraAngle.zoom;

  // Horizontal motion direction when transitioning
  const slideInitialX = transitionDirection === 'left' ? -120 : transitionDirection === 'right' ? 120 : 0;

  return (
    <div
      ref={containerRef}
      id="office-video-viewport"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      className="relative h-full w-full select-none overflow-hidden bg-stone-950 cursor-grab active:cursor-grabbing"
      style={{ perspective: 1200 }}
    >
      {/* 3D Moving Video/Image Stage */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentStation.id}-${lightingMode}`}
          initial={{
            opacity: 0,
            scale: baseZoom * 1.15,
            x: slideInitialX,
            filter: 'blur(16px) brightness(1.2)',
          }}
          animate={{
            opacity: 1,
            scale: isTransitioning ? baseZoom * 1.12 : baseZoom,
            x: 0,
            filter: isTransitioning ? 'blur(8px) brightness(1.1)' : 'blur(0px) brightness(1)',
          }}
          exit={{
            opacity: 0,
            scale: baseZoom * 0.92,
            x: -slideInitialX,
            filter: 'blur(14px) brightness(0.8)',
          }}
          transition={{
            duration: 0.85,
            ease: [0.25, 1, 0.5, 1],
          }}
          className="absolute inset-[-4%] h-[108%] w-[108%]"
          style={{
            transform: `translate3d(${parallaxX}px, ${parallaxY}px, 0px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`,
            transformStyle: 'preserve-3d',
            willChange: 'transform, filter',
          }}
        >
          {/* Main Panoramic Visual */}
          <img
            src={currentBgUrl}
            alt={currentStation.name}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover object-center pointer-events-none transition-transform duration-700"
          />

          {/* Cinematic lighting atmosphere layer */}
          <div className={`absolute inset-0 pointer-events-none transition-colors duration-1000 ${getLightingFilter()}`} />

          {/* Vignette & Depth Mask */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.65)_100%)]" />

          {/* Interactive Hotspots Anchored to 3D Space */}
          {showHotspots && (
            <div className="absolute inset-0 pointer-events-none">
              {currentStation.hotspots.map((hotspot) => {
                return (
                  <div
                    key={hotspot.id}
                    style={{
                      left: `${hotspot.x}%`,
                      top: `${hotspot.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    className="absolute pointer-events-auto group z-20"
                  >
                    {/* Hotspot Pulsing Button */}
                    <button
                      type="button"
                      id={`hotspot-${hotspot.id}`}
                      onClick={() => onSelectHotspot(hotspot)}
                      className="relative flex h-12 w-12 items-center justify-center rounded-full bg-stone-900/80 p-1 text-white shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-125 hover:bg-amber-500 hover:text-black focus:outline-none focus:ring-4 focus:ring-amber-400/40"
                      title={hotspot.title}
                    >
                      {/* Pulse rings */}
                      <span className="absolute -inset-1.5 animate-ping rounded-full bg-amber-400/35 duration-1000" />
                      <span className="absolute -inset-3 animate-pulse rounded-full bg-white/15" />
                      <span className="relative text-xl transition-transform group-hover:rotate-12">
                        {hotspot.emoji}
                      </span>
                    </button>

                    {/* Tooltip on hover */}
                    <div className="pointer-events-none absolute bottom-full left-1/2 mb-3 -translate-x-1/2 opacity-0 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 translate-y-2">
                      <div className="flex flex-col items-center whitespace-nowrap rounded-xl border border-white/20 bg-stone-900/95 px-3 py-1.5 text-xs text-white shadow-2xl backdrop-blur-md">
                        <div className="flex items-center gap-1.5 font-semibold text-amber-300">
                          <span>{hotspot.emoji}</span>
                          <span>{hotspot.title}</span>
                        </div>
                        {hotspot.badge && (
                          <span className="text-[10px] text-stone-400">{hotspot.badge}</span>
                        )}
                        <div className="absolute -bottom-1 h-2 w-2 rotate-45 border-r border-b border-white/20 bg-stone-900/95" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Ambient Floating Dust & Light Canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-10 opacity-70"
      />

      {/* Interactive Compass / View Indicator in Top Right Corner */}
      <div className="pointer-events-none absolute top-20 right-6 z-20 flex flex-col items-end text-right">
        <div className="flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3.5 py-1.5 backdrop-blur-md">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-medium tracking-wider uppercase text-white/90">
            Vista Interattiva 360°
          </span>
          <span className="text-[11px] text-stone-300 font-mono">
            {Math.round(smoothMouse.x * 20)}°
          </span>
        </div>
        <p className="mt-1 text-[11px] text-white/50">Muovi il mouse o tocca per orientare la visuale</p>
      </div>
    </div>
  );
};

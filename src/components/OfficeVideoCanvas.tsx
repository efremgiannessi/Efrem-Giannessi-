import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  RotateCcw,
  Crosshair,
  Maximize2,
  Minimize2,
  Video,
  Volume2,
  VolumeX,
  Gauge,
  Sparkles,
} from 'lucide-react';
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
  const videoRef = useRef<HTMLVideoElement>(null);

  // Video playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(8);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(true);
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);
  const [hasVideoError, setHasVideoError] = useState<boolean>(false);
  const [showTechnicalHud, setShowTechnicalHud] = useState<boolean>(true);
  const [activeHoverHotspot, setActiveHoverHotspot] = useState<Hotspot | null>(null);

  // Mouse parallax state
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [smoothMouse, setSmoothMouse] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Reset video state when station changes
  useEffect(() => {
    setVideoLoaded(false);
    setHasVideoError(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.playbackRate = playbackSpeed;
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Autoplay policy fallback: ensure muted and try once more
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
          }
        });
    }
  }, [currentStation.id, playbackSpeed]);

  // Sync video play/pause
  const togglePlayPause = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  // Handle timeline seeking
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
  };

  // Cycle playback speed (0.5x -> 1x -> 1.5x -> 2x)
  const cyclePlaybackSpeed = () => {
    const speeds = [0.5, 1, 1.5, 2];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    setPlaybackSpeed(nextSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = nextSpeed;
    }
  };

  // Restart video to start
  const handleRestartVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  // Handle mouse move for interactive 3D camera pan
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  }, []);

  // Handle touch move for mobile interactivity
  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || !e.touches[0]) return;
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width - 0.5) * 2.4;
    const y = ((touch.clientY - rect.top) / rect.height - 0.5) * 2.4;
    setMousePos({ x: Math.max(-1.2, Math.min(1.2, x)), y: Math.max(-1.2, Math.min(1.2, y)) });
  }, []);

  // Gyroscope / device orientation support for mobile phone tilt
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;
      const x = Math.max(-1, Math.min(1, e.gamma / 35));
      const y = Math.max(-1, Math.min(1, (e.beta - 45) / 35));
      setMousePos({ x, y });
    };

    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }
    return () => {
      if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
        window.removeEventListener('deviceorientation', handleOrientation, true);
      }
    };
  }, []);

  // Smooth interpolation of camera movement
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

    const count = 30;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.8,
      speedX: (Math.random() - 0.5) * 0.35,
      speedY: -Math.random() * 0.35 - 0.1,
      alpha: Math.random() * 0.5 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      angle: Math.random() * Math.PI * 2,
    }));

    let animId: number;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX + smoothMouse.x * 0.25;
        p.y += p.speedY + smoothMouse.y * 0.18;
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
          ctx.fillStyle = `rgba(140, 200, 255, ${currentAlpha * 1.2})`;
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

  // Active fallback image based on current lighting mode
  const currentBgUrl = currentStation.backgrounds[lightingMode];

  // Lighting overlay filter classes
  const getLightingFilter = () => {
    switch (lightingMode) {
      case 'sunset':
        return 'mix-blend-color-burn bg-gradient-to-t from-amber-950/40 via-orange-600/15 to-rose-950/25';
      case 'night':
        return 'mix-blend-multiply bg-gradient-to-t from-blue-950/70 via-indigo-950/40 to-slate-900/60';
      default:
        return 'bg-gradient-to-t from-black/35 via-transparent to-black/20';
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

  // Format time (00:00.0)
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const ms = Math.floor((secs % 1) * 10);
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms}`;
  };

  return (
    <div
      ref={containerRef}
      id="office-video-viewport"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      className="relative h-full w-full select-none overflow-hidden bg-stone-950 cursor-grab active:cursor-grabbing"
      style={{ perspective: 1200 }}
    >
      {/* 3D Moving Interactive Video Stage */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentStation.id}`}
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
          {/* Main Interactive Video Stream */}
          {!hasVideoError ? (
            <video
              ref={videoRef}
              id={`video-${currentStation.id}`}
              src={currentStation.videoUrl}
              poster={currentBgUrl}
              autoPlay
              loop
              muted={isVideoMuted}
              playsInline
              preload="auto"
              onLoadedMetadata={(e) => {
                const target = e.currentTarget;
                if (target.duration && !isNaN(target.duration)) {
                  setDuration(target.duration);
                }
                setVideoLoaded(true);
              }}
              onTimeUpdate={(e) => {
                setCurrentTime(e.currentTarget.currentTime);
              }}
              onError={() => {
                setHasVideoError(true);
              }}
              className="h-full w-full object-cover object-center pointer-events-none transition-transform duration-700"
            />
          ) : (
            /* Fallback high-resolution architectural image if video cannot load */
            <img
              src={currentBgUrl}
              alt={currentStation.name}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover object-center pointer-events-none transition-transform duration-700"
            />
          )}

          {/* Cinematic lighting atmosphere layer */}
          <div
            className={`absolute inset-0 pointer-events-none transition-colors duration-1000 ${getLightingFilter()}`}
          />

          {/* Vignette & Depth Mask */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.65)_100%)]" />

          {/* Technical Architectural HUD Grid Overlay (Toggleable) */}
          {showTechnicalHud && (
            <div className="absolute inset-0 pointer-events-none z-10 opacity-35">
              {/* Scan grid pattern */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)',
                  backgroundSize: '80px 80px',
                }}
              />
              {/* Center Crosshair */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="h-10 w-10 border border-white/20 rounded-full flex items-center justify-center">
                  <div className="h-1.5 w-1.5 bg-amber-400 rounded-full animate-ping" />
                </div>
                <div className="absolute top-1/2 left-[-16px] w-4 h-[1px] bg-white/30" />
                <div className="absolute top-1/2 right-[-16px] w-4 h-[1px] bg-white/30" />
                <div className="absolute left-1/2 top-[-16px] w-[1px] h-4 bg-white/30" />
                <div className="absolute left-1/2 bottom-[-16px] w-[1px] h-4 bg-white/30" />
              </div>
            </div>
          )}

          {/* Interactive Clickable Hotspots Anchored in Video Coordinates */}
          {showHotspots && (
            <div className="absolute inset-0 pointer-events-none z-20">
              {currentStation.hotspots.map((hotspot) => {
                const isHovered = activeHoverHotspot?.id === hotspot.id;

                return (
                  <div
                    key={hotspot.id}
                    style={{
                      left: `${hotspot.x}%`,
                      top: `${hotspot.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    className="absolute pointer-events-auto group z-20"
                    onMouseEnter={() => setActiveHoverHotspot(hotspot)}
                    onMouseLeave={() => setActiveHoverHotspot(null)}
                  >
                    {/* Technical Target Lock Animation when hovered */}
                    {isHovered && (
                      <div className="pointer-events-none absolute -inset-6 flex items-center justify-center animate-spin [animation-duration:8s]">
                        <div className="h-16 w-16 rounded-full border border-dashed border-amber-400/80" />
                      </div>
                    )}

                    {/* Hotspot Pulsing Video Button */}
                    <button
                      type="button"
                      id={`hotspot-${hotspot.id}`}
                      onClick={() => onSelectHotspot(hotspot)}
                      className="relative flex h-13 w-13 items-center justify-center rounded-full bg-stone-900/85 p-1.5 text-white shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-125 hover:bg-amber-500 hover:text-black focus:outline-none focus:ring-4 focus:ring-amber-400/50"
                      title={hotspot.title}
                    >
                      {/* Pulse rings */}
                      <span className="absolute -inset-2 animate-ping rounded-full bg-amber-400/35 duration-1000" />
                      <span className="absolute -inset-4 animate-pulse rounded-full bg-amber-300/15" />
                      <span className="relative text-2xl transition-transform duration-300 group-hover:rotate-12">
                        {hotspot.emoji}
                      </span>
                    </button>

                    {/* Coordinate Tag Badge */}
                    <div className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-1.5 opacity-75 group-hover:opacity-100 transition-opacity">
                      <span className="font-mono text-[9px] font-semibold text-amber-300/90 bg-black/70 px-1.5 py-0.5 rounded border border-amber-400/30 whitespace-nowrap">
                        X:{hotspot.x}% Y:{hotspot.y}%
                      </span>
                    </div>

                    {/* Rich Tooltip on Hover */}
                    <div className="pointer-events-none absolute bottom-full left-1/2 mb-3 -translate-x-1/2 opacity-0 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 z-30">
                      <div className="flex flex-col items-center whitespace-nowrap rounded-xl border border-amber-400/30 bg-stone-900/95 px-3.5 py-2 text-xs text-white shadow-2xl backdrop-blur-md">
                        <div className="flex items-center gap-2 font-semibold text-amber-300">
                          <span className="text-base">{hotspot.emoji}</span>
                          <span className="tracking-wide">{hotspot.title}</span>
                        </div>
                        {hotspot.badge && (
                          <span className="mt-0.5 text-[10px] font-medium text-stone-400">
                            {hotspot.badge} • Clicca per scheda tecnica
                          </span>
                        )}
                        <div className="absolute -bottom-1 h-2 w-2 rotate-45 border-r border-b border-amber-400/30 bg-stone-900/95" />
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
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-10 opacity-70" />

      {/* Top Right Live Telemetry & 360° Compass */}
      <div className="pointer-events-none absolute top-16 sm:top-20 right-3 sm:right-6 z-20 flex flex-col items-end text-right">
        <div className="flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-3 py-1.5 backdrop-blur-md shadow-lg">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-white/90">
            VIDEO LIVE 1080p
          </span>
          <span className="h-3 w-[1px] bg-white/20" />
          <span className="text-[10px] sm:text-[11px] text-amber-300 font-mono">
            {Math.round(smoothMouse.x * 20)}° CAM
          </span>
        </div>
        <p className="mt-1 text-[9px] sm:text-[11px] text-white/60 hidden xs:block">
          Muovi il cursore per orientare la telecamera
        </p>
      </div>

      {/* Interactive Video Player Control HUD Bar (Bottom Right) */}
      <div className="absolute bottom-20 sm:bottom-24 right-3 sm:right-6 z-30 max-w-[94vw] sm:max-w-md">
        <div className="flex flex-col gap-1.5 rounded-2xl border border-white/15 bg-stone-900/85 p-2.5 sm:p-3 text-white shadow-2xl backdrop-blur-xl transition-all">
          {/* Top Bar: Play/Pause, Title, Speed, HUD toggle */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={togglePlayPause}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-stone-950 font-bold hover:bg-amber-400 transition-transform active:scale-95 shadow-md"
                title={isPlaying ? 'Pausa Video' : 'Riproduci Video'}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
              </button>

              <button
                type="button"
                onClick={handleRestartVideo}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-stone-300 hover:bg-white/20 hover:text-white transition-colors"
                title="Ricomincia Video"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>

              <div className="flex items-center gap-1.5 text-[11px] font-mono text-stone-300">
                <span className="text-white font-semibold">{formatTime(currentTime)}</span>
                <span className="text-stone-500">/</span>
                <span className="text-stone-400">{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Playback Speed Switcher */}
              <button
                type="button"
                onClick={cyclePlaybackSpeed}
                className="flex items-center gap-1 rounded-lg bg-white/10 px-2 py-1 text-[10px] font-mono font-bold text-amber-300 hover:bg-white/20 transition-colors"
                title="Velocità Riproduzione Video"
              >
                <Gauge className="h-3 w-3" />
                <span>{playbackSpeed}x</span>
              </button>

              {/* Technical HUD Grid Toggle */}
              <button
                type="button"
                onClick={() => setShowTechnicalHud(!showTechnicalHud)}
                className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                  showTechnicalHud
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                    : 'bg-white/10 text-stone-400 hover:bg-white/20 hover:text-white'
                }`}
                title={showTechnicalHud ? 'Nascondi Griglia Tecnica' : 'Mostra Griglia Tecnica'}
              >
                <Crosshair className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Timeline Scrubber with Hotspot Marks */}
          <div className="relative flex items-center pt-1">
            <input
              type="range"
              min={0}
              max={duration || 8}
              step={0.05}
              value={currentTime}
              onChange={handleSeek}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-stone-700 accent-amber-400 focus:outline-none"
              title="Scorri il video interattivo"
            />
            {/* Timeline Hotspot Markers */}
            {currentStation.hotspots.map((h, i) => {
              const markerPos = ((i + 1) / (currentStation.hotspots.length + 1)) * 100;
              return (
                <button
                  key={`marker-${h.id}`}
                  type="button"
                  style={{ left: `${markerPos}%` }}
                  onClick={() => onSelectHotspot(h)}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-2.5 w-2.5 rounded-full bg-amber-400 hover:scale-150 transition-transform shadow"
                  title={`Punto interattivo: ${h.title}`}
                />
              );
            })}
          </div>

          {/* Status and Active Station Badge */}
          <div className="flex items-center justify-between text-[10px] text-stone-400 pt-0.5">
            <span className="truncate max-w-[200px] text-stone-300 font-medium">
              🎬 {currentStation.shortName} • Video Interattivo
            </span>
            <span className="font-mono text-emerald-400 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block animate-ping" />
              60 FPS
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

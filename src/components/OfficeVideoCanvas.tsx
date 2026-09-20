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
import { OfficeStation, LightingMode, Hotspot, TransitionStyle } from '../types';
import { MotionBlurStreaks } from './MotionBlurStreaks';

interface OfficeVideoCanvasProps {
  currentStation: OfficeStation;
  lightingMode: LightingMode;
  isTransitioning: boolean;
  transitionDirection: 'left' | 'right' | 'direct';
  onSelectHotspot: (hotspot: Hotspot) => void;
  showHotspots: boolean;
  transitionStyle?: TransitionStyle;
  onSelectTransitionStyle?: (style: TransitionStyle) => void;
}

export const OfficeVideoCanvas: React.FC<OfficeVideoCanvasProps> = ({
  currentStation,
  lightingMode,
  isTransitioning,
  transitionDirection,
  onSelectHotspot,
  showHotspots,
  transitionStyle = 'motion-blur',
  onSelectTransitionStyle,
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

  // Mouse parallax state and layer refs
  const targetPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const bgImageRef = useRef<HTMLDivElement>(null);
  const lightingLayerRef = useRef<HTMLDivElement>(null);
  const hudGridRef = useRef<HTMLDivElement>(null);
  const hotspotsLayerRef = useRef<HTMLDivElement>(null);
  const [hudAngle, setHudAngle] = useState<number>(0);

  // Reset video state when station changes
  useEffect(() => {
    setVideoLoaded(false);
    setHasVideoError(false);
    setCurrentTime(0);
    if (videoRef.current && currentStation.videoUrl) {
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
    } else {
      setIsPlaying(false);
    }
  }, [currentStation.id, currentStation.videoUrl, playbackSpeed]);

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
    targetPos.current = {
      x: Math.max(-1.1, Math.min(1.1, x)),
      y: Math.max(-1.1, Math.min(1.1, y)),
    };
  }, []);

  // Smooth recenter when cursor leaves the viewport
  const handleMouseLeave = useCallback(() => {
    targetPos.current = { x: 0, y: 0 };
  }, []);

  // Handle touch move for mobile interactivity
  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || !e.touches[0]) return;
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width - 0.5) * 2.2;
    const y = ((touch.clientY - rect.top) / rect.height - 0.5) * 2.2;
    targetPos.current = {
      x: Math.max(-1.1, Math.min(1.1, x)),
      y: Math.max(-1.1, Math.min(1.1, y)),
    };
  }, []);

  const handleTouchEnd = useCallback(() => {
    targetPos.current = { x: 0, y: 0 };
  }, []);

  // Gyroscope / device orientation support for mobile phone tilt
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;
      const x = Math.max(-1, Math.min(1, e.gamma / 35));
      const y = Math.max(-1, Math.min(1, (e.beta - 45) / 35));
      targetPos.current = { x, y };
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

  // Silky-smooth 60fps / 120fps direct GPU transform interpolation loop
  useEffect(() => {
    let animId: number;
    let frameCount = 0;

    const animate = () => {
      // Exponential damping for liquid-smooth organic movement
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * 0.08;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * 0.08;

      const x = currentPos.current.x;
      const y = currentPos.current.y;
      const panX = currentStation.cameraAngle.panX || 0;
      const panY = currentStation.cameraAngle.panY || 0;
      const baseZoom = currentStation.cameraAngle.zoom || 1.05;

      // 1. Background 4K UHD Imagery Layer:
      // Organic counter-pan to reveal parallax depth around the focal elements,
      // accompanied by subtle optical lens rotation and perspective scale.
      if (bgImageRef.current) {
        const bgShiftX = x * -28 + panX;
        const bgShiftY = y * -20 + panY;
        const rotY = x * 3.2;
        const rotX = -y * 3.2;
        const depthScale = baseZoom * (1.05 + (x * x + y * y) * 0.012);
        bgImageRef.current.style.transform = `translate3d(${bgShiftX.toFixed(2)}px, ${bgShiftY.toFixed(2)}px, -15px) rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg) scale(${depthScale.toFixed(3)})`;
      }

      // 2. Cinematic Lighting Atmosphere Layer:
      // Shifts light reflection across surfaces as the perspective tilts
      if (lightingLayerRef.current) {
        const lightShiftX = x * -14;
        const lightShiftY = y * -10;
        lightingLayerRef.current.style.transform = `translate3d(${lightShiftX.toFixed(2)}px, ${lightShiftY.toFixed(2)}px, 5px)`;
      }

      // 3. Technical Holographic HUD Viewfinder Grid:
      // Floats in front of the lens plane with distinct forward parallax
      if (hudGridRef.current) {
        const hudShiftX = x * 14;
        const hudShiftY = y * 10;
        const hudRotY = x * 1.5;
        const hudRotX = -y * 1.5;
        hudGridRef.current.style.transform = `translate3d(${hudShiftX.toFixed(2)}px, ${hudShiftY.toFixed(2)}px, 35px) rotateY(${hudRotY.toFixed(2)}deg) rotateX(${hudRotX.toFixed(2)}deg)`;
      }

      // 4. Interactive Hotspots Layer:
      // Anchored with forward 3D depth separation over the architectural surface
      if (hotspotsLayerRef.current) {
        const hotShiftX = x * -18 + panX * 0.8;
        const hotShiftY = y * -14 + panY * 0.8;
        const hotRotY = x * 2.2;
        const hotRotX = -y * 2.2;
        hotspotsLayerRef.current.style.transform = `translate3d(${hotShiftX.toFixed(2)}px, ${hotShiftY.toFixed(2)}px, 45px) rotateY(${hotRotY.toFixed(2)}deg) rotateX(${hotRotX.toFixed(2)}deg)`;
      }

      // Throttled update of camera telemetry readout
      frameCount++;
      if (frameCount % 6 === 0) {
        const angle = Math.round(x * 20);
        setHudAngle((prev) => (prev !== angle ? angle : prev));
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [currentStation.cameraAngle]);

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
        p.x += p.speedX + currentPos.current.x * 0.35;
        p.y += p.speedY + currentPos.current.y * 0.25;
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
  }, [lightingMode]);

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

  // Base camera zoom
  const baseZoom = currentStation.cameraAngle.zoom;

  // Horizontal motion direction when transitioning
  const slideInitialX = transitionDirection === 'left' ? -140 : transitionDirection === 'right' ? 140 : 0;

  // Format time (00:00.0)
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const ms = Math.floor((secs % 1) * 10);
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms}`;
  };

  // Transition style dynamic animation variant calculator
  const getTransitionVariants = () => {
    switch (transitionStyle) {
      case 'cross-dissolve':
        return {
          initial: {
            opacity: 0,
            scale: baseZoom * 1.02,
            x: slideInitialX * 0.25,
            filter: 'blur(10px) brightness(1.15)',
          },
          animate: {
            opacity: 1,
            scale: isTransitioning ? baseZoom * 1.02 : 1,
            x: 0,
            filter: isTransitioning ? 'blur(4px) brightness(1.05)' : 'blur(0px) brightness(1)',
          },
          exit: {
            opacity: 0,
            scale: baseZoom * 0.98,
            x: -slideInitialX * 0.25,
            filter: 'blur(12px) brightness(0.9)',
          },
          transition: {
            duration: 0.95,
            ease: [0.4, 0.0, 0.2, 1], // cinematic cubic-bezier cross-dissolve
          },
        };

      case 'warp-zoom':
        return {
          initial: {
            opacity: 0,
            scale: baseZoom * 1.35,
            x: 0,
            filter: 'blur(20px) brightness(1.35) contrast(1.1)',
          },
          animate: {
            opacity: 1,
            scale: isTransitioning ? baseZoom * 1.12 : 1,
            x: 0,
            filter: isTransitioning ? 'blur(6px) brightness(1.08)' : 'blur(0px) brightness(1) contrast(1)',
          },
          exit: {
            opacity: 0,
            scale: baseZoom * 0.72,
            x: 0,
            filter: 'blur(22px) brightness(0.65)',
          },
          transition: {
            duration: 0.85,
            ease: [0.16, 1, 0.3, 1], // warp exponential ease out
          },
        };

      case 'motion-blur':
      default:
        return {
          initial: {
            opacity: 0,
            scale: baseZoom * 1.15,
            x: slideInitialX * 1.6,
            filter: 'blur(24px) brightness(1.3) contrast(1.08)',
          },
          animate: {
            opacity: 1,
            scale: isTransitioning ? baseZoom * 1.08 : 1,
            x: 0,
            filter: isTransitioning ? 'blur(10px) brightness(1.15)' : 'blur(0px) brightness(1) contrast(1)',
          },
          exit: {
            opacity: 0,
            scale: baseZoom * 0.9,
            x: -slideInitialX * 1.6,
            filter: 'blur(22px) brightness(0.7)',
          },
          transition: {
            duration: 0.85,
            ease: [0.22, 1, 0.36, 1], // fluid kinematic deceleration
          },
        };
    }
  };

  const currentVariants = getTransitionVariants();

  return (
    <div
      ref={containerRef}
      id="office-video-viewport"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative h-full w-full select-none overflow-hidden bg-stone-950 cursor-grab active:cursor-grabbing"
      style={{ perspective: 1200 }}
    >
      {/* Dynamic Motion Blur / Cross-Dissolve Overlay Streaks */}
      <MotionBlurStreaks
        isTransitioning={isTransitioning}
        direction={transitionDirection}
        transitionStyle={transitionStyle}
      />

      {/* 3D Moving Interactive Video Stage */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentStation.id}`}
          initial={currentVariants.initial}
          animate={currentVariants.animate}
          exit={currentVariants.exit}
          transition={currentVariants.transition}
          className="absolute inset-0 h-full w-full overflow-hidden"
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Layer 1: High-Resolution 4K UHD Imagery or Video with subtle 3D counter-pan & tilt */}
          <div
            ref={bgImageRef}
            className="absolute inset-[-8%] h-[116%] w-[116%] pointer-events-none will-change-transform"
            style={{
              transformOrigin: 'center center',
            }}
          >
            {!hasVideoError && currentStation.videoUrl ? (
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
                className="h-full w-full object-cover object-center pointer-events-none"
              />
            ) : (
              /* Fallback high-resolution 4k architectural image */
              <img
                src={currentBgUrl}
                alt={currentStation.name}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover object-center pointer-events-none select-none"
              />
            )}
          </div>

          {/* Layer 2: Cinematic lighting atmosphere layer with parallax light angle shift */}
          <div
            ref={lightingLayerRef}
            className={`absolute inset-[-4%] h-[108%] w-[108%] pointer-events-none transition-colors duration-1000 will-change-transform ${getLightingFilter()}`}
          />

          {/* Layer 3: Vignette & Depth Lens Mask */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.65)_100%)]" />

          {/* Layer 4: Technical Architectural HUD Grid Overlay (Floating Viewfinder) */}
          {showTechnicalHud && (
            <div
              ref={hudGridRef}
              className="absolute inset-0 pointer-events-none z-10 opacity-35 will-change-transform"
            >
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

          {/* Layer 5: Interactive Clickable Hotspots Anchored in Video Coordinates with 3D Pop */}
          {showHotspots && (
            <div
              ref={hotspotsLayerRef}
              className="absolute inset-0 pointer-events-none z-20 will-change-transform"
              style={{ transformStyle: 'preserve-3d' }}
            >
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
            {currentStation.videoUrl ? 'VIDEO LIVE 1080p' : 'FOTO 4K UHD'}
          </span>
          <span className="h-3 w-[1px] bg-white/20" />
          <span className="text-[10px] sm:text-[11px] text-amber-300 font-mono">
            {hudAngle}° CAM
          </span>
        </div>
        <p className="mt-1 text-[9px] sm:text-[11px] text-white/60 hidden xs:block">
          {currentStation.videoUrl
            ? 'Muovi il cursore per orientare la telecamera'
            : 'Muovi il cursore per esplorare la profondità 3D'}
        </p>
      </div>

      {/* Interactive Control HUD Bar (Bottom Right): Video Player or High-Res Photography */}
      <div className="absolute bottom-20 sm:bottom-24 right-3 sm:right-6 z-30 max-w-[94vw] sm:max-w-md">
        {currentStation.videoUrl ? (
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

                {/* Transition FX Switcher */}
                {onSelectTransitionStyle && (
                  <button
                    type="button"
                    onClick={() => {
                      const styles: TransitionStyle[] = ['motion-blur', 'cross-dissolve', 'warp-zoom'];
                      const nextIndex = (styles.indexOf(transitionStyle) + 1) % styles.length;
                      onSelectTransitionStyle(styles[nextIndex]);
                    }}
                    className="flex items-center gap-1 rounded-lg bg-amber-500/15 border border-amber-400/30 px-2 py-1 text-[10px] font-mono font-bold text-amber-300 hover:bg-amber-500/25 transition-colors"
                    title="Cambia Effetto Transizione Sfondo (Motion Blur / Cross Dissolve / Warp Zoom)"
                  >
                    <Sparkles className="h-3 w-3 text-amber-400" />
                    <span className="capitalize hidden sm:inline">{transitionStyle.replace('-', ' ')}</span>
                  </button>
                )}
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
        ) : (
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/15 bg-stone-900/85 px-3.5 py-2.5 text-white shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold text-base">
                {currentStation.emoji}
              </div>
              <div>
                <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <span>{currentStation.shortName}</span>
                  <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono">
                    Foto 4K UHD
                  </span>
                </div>
                <div className="text-[10px] text-stone-400">
                  Visualizzazione Fotografica 4K • Parallasse 3D
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
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

              {/* Transition FX Switcher */}
              {onSelectTransitionStyle && (
                <button
                  type="button"
                  onClick={() => {
                    const styles: TransitionStyle[] = ['motion-blur', 'cross-dissolve', 'warp-zoom'];
                    const nextIndex = (styles.indexOf(transitionStyle) + 1) % styles.length;
                    onSelectTransitionStyle(styles[nextIndex]);
                  }}
                  className="flex items-center gap-1 rounded-lg bg-amber-500/15 border border-amber-400/30 px-2 py-1 text-[10px] font-mono font-bold text-amber-300 hover:bg-amber-500/25 transition-colors"
                  title="Cambia Effetto Transizione Sfondo (Motion Blur / Cross Dissolve / Warp Zoom)"
                >
                  <Sparkles className="h-3 w-3 text-amber-400" />
                  <span className="capitalize hidden sm:inline">{transitionStyle.replace('-', ' ')}</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

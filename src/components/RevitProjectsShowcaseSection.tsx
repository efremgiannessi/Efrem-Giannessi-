import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Layers, Sparkles, Play, Pause, ChevronLeft, ChevronRight, 
  Maximize2, Minimize2, RefreshCw, Eye, Wand2, Compass, 
  Cpu, Box, Radio, ExternalLink, Zap, ShieldCheck, ChevronDown, ChevronUp,
  Activity, Orbit, Crosshair, Terminal
} from 'lucide-react';
import { audioSystem } from '../utils/audioSynthesizer';
import { RevitCyberspaceBackground } from './backgrounds/RevitCyberspaceBackground';

export interface RevitProjectMediaItem {
  id: string;
  driveId: string;
  src: string;
  thumbSrc: string;
}

export const REVIT_DRIVE_FOLDER_URL = "https://drive.google.com/drive/folders/1f1NdrmRafMzJSLSwNE4M_3TeBIIiesGo";

// Initial seeded fallback projects from the Drive folder
export const INITIAL_REVIT_PROJECTS: RevitProjectMediaItem[] = [
  {
    id: 'revit-1',
    driveId: '1HKuJpoNDlOUw-orJwLNy0JpnJxvUXbaD',
    src: 'https://lh3.googleusercontent.com/d/1HKuJpoNDlOUw-orJwLNy0JpnJxvUXbaD=w1600',
    thumbSrc: 'https://lh3.googleusercontent.com/d/1HKuJpoNDlOUw-orJwLNy0JpnJxvUXbaD=w400',
  },
  {
    id: 'revit-2',
    driveId: '12Dcr7b2KQpGJIkJElTUawVBlGxbA0zME',
    src: 'https://lh3.googleusercontent.com/d/12Dcr7b2KQpGJIkJElTUawVBlGxbA0zME=w1600',
    thumbSrc: 'https://lh3.googleusercontent.com/d/12Dcr7b2KQpGJIkJElTUawVBlGxbA0zME=w400',
  },
  {
    id: 'revit-3',
    driveId: '1S30ihpx3inf2sURtZElga2K01ztoBTg7',
    src: 'https://lh3.googleusercontent.com/d/1S30ihpx3inf2sURtZElga2K01ztoBTg7=w1600',
    thumbSrc: 'https://lh3.googleusercontent.com/d/1S30ihpx3inf2sURtZElga2K01ztoBTg7=w400',
  },
  {
    id: 'revit-4',
    driveId: '1MOG-3fkSnt5VbVuZWFhqh-nmnLZR-sSv',
    src: 'https://lh3.googleusercontent.com/d/1MOG-3fkSnt5VbVuZWFhqh-nmnLZR-sSv=w1600',
    thumbSrc: 'https://lh3.googleusercontent.com/d/1MOG-3fkSnt5VbVuZWFhqh-nmnLZR-sSv=w400',
  },
];

export type CyberspaceTransitionStyle = 
  | 'quantum-slices'
  | 'hyperdrive-warp'
  | 'cyber-cube'
  | 'neon-matrix-glitch'
  | 'vortex-plasma'
  | 'wireframe-axonometric'
  | 'anamorphic-laser'
  | 'hexagonal-iris';

export const CYBERSPACE_TRANSITIONS: { id: CyberspaceTransitionStyle; label: string; icon: string; desc: string }[] = [
  { id: 'quantum-slices', label: 'Tagli Quantistici 3D', icon: '⚡', desc: '8 Lame olografiche verticali con inerzia 3D e bordi laser al neon' },
  { id: 'hyperdrive-warp', label: 'Iperspazio Cyberspace', icon: '🚀', desc: 'Accelerazione a curvatura con scia stellare luminosa e shockwave' },
  { id: 'cyber-cube', label: 'Cubo Cinetico 3D', icon: '🎲', desc: 'Rotazione volumetrica a 90° con riflessi prismatici ciano e magenta' },
  { id: 'neon-matrix-glitch', label: 'Glitch Matrice RGB', icon: '👾', desc: 'Scomposizione a triplo canale cromatico con scanline cyberpunk' },
  { id: 'vortex-plasma', label: 'Vortice di Plasma', icon: '🌀', desc: 'Torsione iperspaziale con flare radiale e anello energetico' },
  { id: 'wireframe-axonometric', label: 'Assonometria Futurista', icon: '📐', desc: 'Inclinazione 3D con griglia wireframe di calcolo parametrico' },
  { id: 'anamorphic-laser', label: 'Laser Anamorfico', icon: '✨', desc: 'Fascio laser collimato con dispersione fotonica ad altissima luminosità' },
  { id: 'hexagonal-iris', label: 'Diaframma Esagonale', icon: '💠', desc: 'Apertura geometrica a celle nanotecnologiche concentriche' },
];

const DEFAULT_VISIBLE_LIMIT = 6;

export const RevitProjectsShowcaseSection: React.FC = () => {
  const [projects, setProjects] = useState<RevitProjectMediaItem[]>(INITIAL_REVIT_PROJECTS);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [prevIndex, setPrevIndex] = useState<number>(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [isLiveSyncing, setIsLiveSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [activeStyle, setActiveStyle] = useState<CyberspaceTransitionStyle>('quantum-slices');
  const [autoCycleStyles, setAutoCycleStyles] = useState<boolean>(true);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState<boolean>(false);
  const [isExpandedList, setIsExpandedList] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const SLIDE_DURATION_MS = 5000;
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-sync with Google Drive folder via server endpoint
  const fetchLiveRevitFolder = async (force = false) => {
    try {
      setIsLiveSyncing(true);
      const res = await fetch(`/api/revit-projects${force ? '?force=true' : ''}`);
      if (res.ok) {
        const data = await res.json();
        if (data?.projects && Array.isArray(data.projects) && data.projects.length > 0) {
          setProjects(data.projects);
          setLastSyncTime(new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }));
        }
      }
    } catch (e) {
      console.warn('[RevitProjects] Drive live sync fallback to cached items:', e);
    } finally {
      setIsLiveSyncing(false);
    }
  };

  useEffect(() => {
    fetchLiveRevitFolder();
    const interval = setInterval(() => fetchLiveRevitFolder(false), 60000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = useCallback((nextIdx: number, dir: 'next' | 'prev' = 'next') => {
    setPrevIndex(currentIndex);
    setDirection(dir);
    setCurrentIndex(nextIdx);
    setProgress(0);
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), 900);

    // If auto-cycle styles is enabled, switch to next transition effect
    if (autoCycleStyles) {
      const styles = CYBERSPACE_TRANSITIONS.map(s => s.id);
      const nextStyleIdx = (styles.indexOf(activeStyle) + 1) % styles.length;
      setActiveStyle(styles[nextStyleIdx]);
    }
  }, [currentIndex, autoCycleStyles, activeStyle]);

  const handleNext = useCallback(() => {
    audioSystem.playClick(720);
    const next = (currentIndex + 1) % projects.length;
    goToSlide(next, 'next');
  }, [currentIndex, projects.length, goToSlide]);

  const handlePrev = useCallback(() => {
    audioSystem.playClick(580);
    const prev = (currentIndex - 1 + projects.length) % projects.length;
    goToSlide(prev, 'prev');
  }, [currentIndex, projects.length, goToSlide]);

  // Slideshow progress timer
  useEffect(() => {
    if (!isPlaying || projects.length <= 1) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    const startTime = Date.now();
    const updateRateMs = 50;

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentPct = Math.min(100, (elapsed / SLIDE_DURATION_MS) * 100);
      setProgress(currentPct);

      if (elapsed >= SLIDE_DURATION_MS) {
        clearInterval(progressIntervalRef.current!);
        handleNext();
      }
    }, updateRateMs);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isPlaying, currentIndex, projects.length, handleNext]);

  const currentProject = projects[currentIndex] || projects[0] || INITIAL_REVIT_PROJECTS[0];
  const activeStyleConfig = CYBERSPACE_TRANSITIONS.find(s => s.id === activeStyle) || CYBERSPACE_TRANSITIONS[0];

  // Limited visible list of projects
  const visibleProjects = useMemo(() => {
    if (isExpandedList) return projects;
    return projects.slice(0, DEFAULT_VISIBLE_LIMIT);
  }, [projects, isExpandedList]);

  const hasMoreThanLimit = projects.length > DEFAULT_VISIBLE_LIMIT;
  const remainingCount = Math.max(0, projects.length - DEFAULT_VISIBLE_LIMIT);

  return (
    <section 
      id="progetti-revit" 
      className="relative py-24 md:py-32 px-4 sm:px-6 md:px-12 border-t border-white/10 bg-[#050609] overflow-hidden"
    >
      {/* 3D Wireframe & Cyberspace Blueprint Animated Background */}
      <RevitCyberspaceBackground />

      {/* Background Holographic Atmosphere & Cyberspace Laser Grids */}
      <div className="absolute top-1/4 -right-48 w-[600px] h-[600px] bg-cyan-600/12 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute bottom-10 -left-48 w-[550px] h-[550px] bg-fuchsia-600/12 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#00f0ff09_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] pointer-events-none" />

      {/* Cyber Perspective Floor Grid (Subtle Sci-Fi Ground Plane) */}
      <div 
        className="absolute bottom-0 inset-x-0 h-96 opacity-20 pointer-events-none"
        style={{
          background: 'linear-gradient(transparent, rgba(0,240,255,0.15))',
          maskImage: 'linear-gradient(to top, black, transparent)',
          transform: 'perspective(500px) rotateX(60deg)',
          transformOrigin: 'bottom center',
          backgroundImage: 'linear-gradient(to right, rgba(0,240,255,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,240,255,0.4) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2.5 font-mono text-xs text-cyan-400 uppercase tracking-widest mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_12px_rgba(0,240,255,1)]" />
              <span>CYBERSPACE BIM ENGINE // TRANSIZIONI 3D AD ALTA ENERGIA</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase font-sans">
              Progetti <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-amber-300">Revit</span>
            </h2>
            <p className="text-stone-400 max-w-2xl mt-3 text-sm md:text-base leading-relaxed">
              Galleria dinamica interattiva dei progetti prefabbricati e modelli 3D in Revit.
              Dotata di motori di transizione tridimensionali con effetti cyberspazio, deformazioni a curvatura e glitch ottici al neon.
            </p>
          </div>

          {/* Header Action Tools */}
          <div className="shrink-0 flex flex-wrap items-center gap-3">
            {/* Live Drive Sync Status */}
            <button
              onClick={() => {
                audioSystem.playClick(850);
                fetchLiveRevitFolder(true);
              }}
              title="Aggiorna e sincronizza con la cartella Google Drive"
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-[11px] font-mono text-cyan-300 hover:text-white transition shadow active:scale-95 group"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isLiveSyncing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
              <span>{isLiveSyncing ? 'Sincronizzazione...' : `Sincronizza Live (${projects.length})`}</span>
              {lastSyncTime && <span className="text-stone-500 text-[10px]">({lastSyncTime})</span>}
            </button>
          </div>
        </div>

        {/* Main Spectacular 3D Showcase Stage */}
        <div className="relative rounded-3xl bg-slate-950 border border-cyan-500/40 shadow-[0_25px_80px_rgba(0,0,0,0.85),0_0_60px_rgba(0,240,255,0.18)] overflow-hidden group">
          {/* Top Futuristic HUD Overlay (NO FILENAMES!) */}
          <div className="absolute top-0 inset-x-0 z-30 flex items-center justify-between p-4 sm:p-5 bg-gradient-to-b from-black/90 via-black/50 to-transparent pointer-events-none select-none font-mono">
            <div className="flex items-center gap-2 pointer-events-auto">
              <span className="px-2.5 py-1 rounded-md bg-cyan-950/80 border border-cyan-400/70 text-cyan-300 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm">
                Modello #{currentIndex + 1} di {projects.length}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-black/70 border border-white/10 text-stone-300 text-[10px] backdrop-blur-md">
                <Crosshair className="w-3 h-3 text-cyan-400 animate-pulse" />
                <span>CYBER-HUD // X: 45.242 Y: 09.182 Z: +12.4m</span>
              </span>
            </div>

            <div className="flex items-center gap-2 pointer-events-auto">
              <span className="hidden md:inline-block text-[10px] text-fuchsia-400 font-bold bg-fuchsia-950/70 border border-fuchsia-800/80 px-2 py-0.5 rounded backdrop-blur-md">
                {activeStyleConfig.label}
              </span>
              {/* Fullscreen Button */}
              <button
                onClick={() => {
                  audioSystem.playClick(750);
                  setIsFullscreenOpen(true);
                }}
                title="Visualizza a schermo intero"
                className="p-2 rounded-xl bg-black/75 hover:bg-cyan-950/90 text-stone-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-400/80 backdrop-blur-md transition active:scale-95"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Center Stage: The 3D Cyberspace Canvas */}
          <div 
            className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-[#020305] overflow-hidden select-none"
            style={{ perspective: '1600px' }}
          >
            {/* Luminous Cyberspace Star-lines Shockwave Triggered on Transition */}
            {isTransitioning && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.8, 0] }}
                transition={{ duration: 0.7 }}
                className="absolute inset-0 z-20 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at center, rgba(0,240,255,0.4) 0%, transparent 70%)',
                  mixBlendMode: 'screen'
                }}
              />
            )}

            {/* 8 Distinct Cyberspace Futuristic 3D Transition Engines */}
            <AnimatePresence mode="wait">
              {/* 1. Tagli Quantistici 3D (8 Lame Olografiche Verticali) */}
              {activeStyle === 'quantum-slices' && (
                <motion.div
                  key={`slice-${currentIndex}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.65 }}
                  className="absolute inset-0 grid grid-cols-8 w-full h-full overflow-hidden"
                >
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((colIdx) => (
                    <motion.div
                      key={colIdx}
                      initial={{ 
                        y: direction === 'next' ? (colIdx % 2 === 0 ? -160 : 160) : (colIdx % 2 === 0 ? 160 : -160),
                        opacity: 0,
                        rotateY: colIdx % 2 === 0 ? 35 : -35,
                        scale: 1.25,
                        z: -250
                      }}
                      animate={{ 
                        y: 0, 
                        opacity: 1,
                        rotateY: 0,
                        scale: 1,
                        z: 0
                      }}
                      exit={{ 
                        y: direction === 'next' ? (colIdx % 2 === 0 ? 120 : -120) : (colIdx % 2 === 0 ? -120 : 120),
                        opacity: 0,
                        scale: 0.85,
                        z: -200
                      }}
                      transition={{ 
                        duration: 0.75, 
                        delay: colIdx * 0.04, 
                        ease: [0.16, 1, 0.3, 1] 
                      }}
                      className="relative h-full overflow-hidden border-r border-cyan-400/40"
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <div 
                        className="absolute top-0 bottom-0 bg-cover bg-center"
                        style={{
                          width: '800%',
                          left: `-${colIdx * 100}%`,
                          backgroundImage: `url(${currentProject.src})`,
                        }}
                      />
                      <div className="absolute inset-y-0 right-0 w-[2px] bg-cyan-300 shadow-[0_0_12px_rgba(0,240,255,1)] pointer-events-none" />
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* 2. Iperspazio Cyberspace (Hyperspace Star-Warp & Tunnel Depth) */}
              {activeStyle === 'hyperdrive-warp' && (
                <motion.div
                  key={`hyperdrive-${currentIndex}`}
                  initial={{ 
                    scale: 2.4, 
                    z: -800, 
                    opacity: 0, 
                    filter: 'blur(20px) brightness(250%)',
                    rotateZ: direction === 'next' ? 15 : -15
                  }}
                  animate={{ 
                    scale: 1, 
                    z: 0, 
                    opacity: 1, 
                    filter: 'blur(0px) brightness(100%)',
                    rotateZ: 0 
                  }}
                  exit={{ 
                    scale: 0.3, 
                    z: 600, 
                    opacity: 0, 
                    filter: 'blur(15px) brightness(50%)',
                    rotateZ: direction === 'next' ? -15 : 15 
                  }}
                  transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 w-full h-full"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <img
                    src={currentProject.src}
                    alt="Progetto Revit Cyberspazio"
                    className="w-full h-full object-cover"
                  />
                  {/* Cyberspace speed lines streak */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,240,255,0.4)_100%)] mix-blend-screen pointer-events-none" />
                </motion.div>
              )}

              {/* 3. Cubo Cinetico 3D (Volumetric Perspective Cube Pivot) */}
              {activeStyle === 'cyber-cube' && (
                <motion.div
                  key={`cube-${currentIndex}`}
                  initial={{ 
                    rotateY: direction === 'next' ? 90 : -90,
                    scale: 0.8,
                    opacity: 0,
                    z: -400
                  }}
                  animate={{ 
                    rotateY: 0, 
                    scale: 1, 
                    opacity: 1,
                    z: 0 
                  }}
                  exit={{ 
                    rotateY: direction === 'next' ? -90 : 90,
                    scale: 0.8,
                    opacity: 0,
                    z: -400
                  }}
                  transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 w-full h-full"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <img
                    src={currentProject.src}
                    alt="Progetto Revit Cubo 3D"
                    className="w-full h-full object-cover shadow-[0_0_50px_rgba(0,240,255,0.3)]"
                  />
                  {/* Holographic edge neon glow */}
                  <div className="absolute inset-0 border-2 border-cyan-400/50 shadow-[inset_0_0_40px_rgba(0,240,255,0.4)] pointer-events-none" />
                </motion.div>
              )}

              {/* 4. Glitch Matrice RGB (Triple Channel Displacement & Scanlines) */}
              {activeStyle === 'neon-matrix-glitch' && (
                <motion.div
                  key={`glitch-${currentIndex}`}
                  initial={{ opacity: 0, x: -30, skewX: 15, filter: 'contrast(180%)' }}
                  animate={{ opacity: 1, x: 0, skewX: 0, filter: 'contrast(100%)' }}
                  exit={{ opacity: 0, x: 30, skewX: -15, filter: 'contrast(200%)' }}
                  transition={{ duration: 0.65, ease: 'easeOut' }}
                  className="absolute inset-0 w-full h-full"
                >
                  {/* Red Channel Shift */}
                  <motion.div
                    initial={{ x: 15, opacity: 0.7 }}
                    animate={{ x: 0, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 mix-blend-screen pointer-events-none"
                    style={{
                      backgroundImage: `url(${currentProject.src})`,
                      backgroundSize: 'cover',
                      filter: 'drop-shadow(-4px 0px 0px rgba(255,0,80,0.8))'
                    }}
                  />
                  {/* Cyan Channel Shift */}
                  <motion.div
                    initial={{ x: -15, opacity: 0.7 }}
                    animate={{ x: 0, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 mix-blend-screen pointer-events-none"
                    style={{
                      backgroundImage: `url(${currentProject.src})`,
                      backgroundSize: 'cover',
                      filter: 'drop-shadow(4px 0px 0px rgba(0,240,255,0.8))'
                    }}
                  />
                  <img
                    src={currentProject.src}
                    alt="Progetto Revit Matrix Glitch"
                    className="w-full h-full object-cover"
                  />
                  {/* Cyberpunk Scanlines */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[size:100%_4px] pointer-events-none" />
                </motion.div>
              )}

              {/* 5. Vortice di Plasma (Torsion & Angular Flare) */}
              {activeStyle === 'vortex-plasma' && (
                <motion.div
                  key={`plasma-${currentIndex}`}
                  initial={{ 
                    scale: 1.5, 
                    rotate: direction === 'next' ? 30 : -30,
                    filter: 'blur(16px) contrast(150%)',
                    opacity: 0 
                  }}
                  animate={{ 
                    scale: 1, 
                    rotate: 0,
                    filter: 'blur(0px) contrast(100%)',
                    opacity: 1 
                  }}
                  exit={{ 
                    scale: 0.7, 
                    rotate: direction === 'next' ? -20 : 20,
                    filter: 'blur(12px)',
                    opacity: 0 
                  }}
                  transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 w-full h-full"
                >
                  <img
                    src={currentProject.src}
                    alt="Progetto Revit Plasma Warp"
                    className="w-full h-full object-cover"
                  />
                  <motion.div 
                    initial={{ scale: 0.2, opacity: 1 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 0.85 }}
                    className="absolute inset-0 m-auto w-64 h-64 rounded-full border-4 border-fuchsia-400 shadow-[0_0_60px_rgba(240,0,255,1)] pointer-events-none"
                  />
                </motion.div>
              )}

              {/* 6. Assonometria Futurista (3D Wireframe Blueprint Tilt) */}
              {activeStyle === 'wireframe-axonometric' && (
                <motion.div
                  key={`axono-${currentIndex}`}
                  initial={{ 
                    rotateX: 45, 
                    rotateY: direction === 'next' ? -25 : 25, 
                    scale: 0.7, 
                    z: -500,
                    opacity: 0 
                  }}
                  animate={{ 
                    rotateX: 0, 
                    rotateY: 0, 
                    scale: 1, 
                    z: 0,
                    opacity: 1 
                  }}
                  exit={{ 
                    rotateX: -35, 
                    rotateY: direction === 'next' ? 20 : -20, 
                    scale: 0.7, 
                    z: -400,
                    opacity: 0 
                  }}
                  transition={{ duration: 0.9, ease: [0.2, 0.9, 0.3, 1] }}
                  className="absolute inset-0 w-full h-full"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <img
                    src={currentProject.src}
                    alt="Progetto Revit Assonometria"
                    className="w-full h-full object-cover"
                  />
                  {/* Cyan Isometric Grid Overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f0ff20_1px,transparent_1px),linear-gradient(to_bottom,#00f0ff20_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />
                </motion.div>
              )}

              {/* 7. Laser Anamorfico (Horizontal & Vertical Dual Sweep) */}
              {activeStyle === 'anamorphic-laser' && (
                <motion.div
                  key={`laser-${currentIndex}`}
                  initial={{ opacity: 0, scaleX: 1.3, filter: 'brightness(300%)' }}
                  animate={{ opacity: 1, scaleX: 1, filter: 'brightness(100%)' }}
                  exit={{ opacity: 0, scaleX: 0.7, filter: 'brightness(0%)' }}
                  transition={{ duration: 0.75, ease: [0.25, 1, 0.5, 1] }}
                  className="absolute inset-0 w-full h-full"
                >
                  <img
                    src={currentProject.src}
                    alt="Progetto Revit Laser Anamorfico"
                    className="w-full h-full object-cover"
                  />
                  {/* Blinding Vertical Neon Sweep Line */}
                  <motion.div
                    initial={{ left: '0%' }}
                    animate={{ left: '100%' }}
                    transition={{ duration: 0.75, ease: 'easeInOut' }}
                    className="absolute top-0 bottom-0 w-2 bg-white shadow-[0_0_30px_rgba(0,240,255,1),0_0_60px_rgba(0,240,255,0.8)] pointer-events-none"
                  />
                </motion.div>
              )}

              {/* 8. Diaframma Esagonale Sci-Fi (Nano-Aperture Clip-Path Expansion) */}
              {activeStyle === 'hexagonal-iris' && (
                <motion.div
                  key={`iris-${currentIndex}`}
                  initial={{ 
                    clipPath: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%)',
                    scale: 1.25,
                    opacity: 0
                  }}
                  animate={{ 
                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                    scale: 1,
                    opacity: 1
                  }}
                  exit={{ 
                    clipPath: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%)',
                    scale: 0.8,
                    opacity: 0
                  }}
                  transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 w-full h-full"
                >
                  <img
                    src={currentProject.src}
                    alt="Progetto Revit Diaframma Esagonale"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 border-4 border-cyan-400 shadow-[0_0_30px_rgba(0,240,255,0.6)] pointer-events-none" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Ambient Technical Watermark Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none" />

            {/* Left / Right Nav Arrows on Stage Hover */}
            <button
              onClick={handlePrev}
              title="Progetto precedente"
              className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-3.5 rounded-full bg-black/80 hover:bg-cyan-950/95 text-white border border-white/10 hover:border-cyan-400 backdrop-blur-md transition-all duration-300 shadow-xl hover:scale-110 active:scale-95 group-hover:opacity-100 opacity-80"
            >
              <ChevronLeft className="w-5 h-5 text-cyan-400" />
            </button>

            <button
              onClick={handleNext}
              title="Prossimo progetto"
              className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-3.5 rounded-full bg-black/80 hover:bg-cyan-950/95 text-white border border-white/10 hover:border-cyan-400 backdrop-blur-md transition-all duration-300 shadow-xl hover:scale-110 active:scale-95 group-hover:opacity-100 opacity-80"
            >
              <ChevronRight className="w-5 h-5 text-cyan-400" />
            </button>
          </div>

          {/* Bottom Control Bar & Progress Timer */}
          <div className="relative bg-slate-950/95 border-t border-slate-800/90 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 font-mono text-xs z-20">
            {/* Auto-Play Play/Pause & Slide Counter */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  audioSystem.playClick(600);
                  setIsPlaying(!isPlaying);
                }}
                title={isPlaying ? "Metti in pausa lo scorrimento automatico" : "Avvia scorrimento automatico"}
                className={`p-2 rounded-xl border transition flex items-center gap-1.5 ${
                  isPlaying 
                    ? 'bg-cyan-950/70 border-cyan-400/60 text-cyan-300 shadow-sm shadow-cyan-900/40' 
                    : 'bg-slate-800 border-slate-700 text-stone-400 hover:text-white'
                }`}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span className="text-[11px] font-bold">{isPlaying ? 'AUTO PLAY' : 'PAUSA'}</span>
              </button>

              <div className="flex items-center gap-1.5 text-stone-400 text-[11px]">
                <span className="text-white font-bold">{currentIndex + 1}</span>
                <span>/</span>
                <span>{projects.length}</span>
              </div>
            </div>

            {/* Progress Countdown Bar */}
            <div className="flex-1 max-w-xs h-1.5 bg-slate-800 rounded-full overflow-hidden mx-2 hidden sm:block">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400 transition-all duration-75 ease-linear shadow-[0_0_8px_rgba(0,240,255,0.8)]"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Architecture Details Indicators (NO FILENAME) */}
            <div className="flex items-center gap-2 text-[10px] text-stone-400">
              <span className="flex items-center gap-1 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-md">
                <Box className="w-3 h-3 text-cyan-400" />
                <span>Geometria Parametrica C.A.P.</span>
              </span>
              <span className="hidden md:flex items-center gap-1 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-md">
                <Activity className="w-3 h-3 text-emerald-400" />
                <span>Risoluzione 4K Ultra HD</span>
              </span>
            </div>
          </div>
        </div>

        {/* Model Selector - Compact List Layout with Small Thumbnails and Fixed Limit */}
        <div className="mt-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-mono">
                Selettore Modelli ({isExpandedList ? projects.length : `${visibleProjects.length} di ${projects.length}`})
              </h4>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-stone-400">
              <span className="hidden sm:inline">Visualizzazione compatta (max {DEFAULT_VISIBLE_LIMIT} modelli)</span>
              {hasMoreThanLimit && (
                <button
                  onClick={() => {
                    audioSystem.playClick(600);
                    setIsExpandedList(!isExpandedList);
                  }}
                  className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-bold bg-slate-900 border border-slate-700/80 px-3 py-1.5 rounded-lg transition hover:bg-slate-800 active:scale-95"
                >
                  {isExpandedList ? (
                    <>
                      <span>Riduci a {DEFAULT_VISIBLE_LIMIT}</span>
                      <ChevronUp className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      <span>Mostra tutti (+{remainingCount})</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Compact List of Models: 2 columns on desktop/tablet, 1 on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
            {visibleProjects.map((proj, idx) => {
              const isSelected = idx === currentIndex;
              const formattedNumber = String(idx + 1).padStart(2, '0');

              return (
                <div
                  key={proj.id}
                  onClick={() => {
                    audioSystem.playClick(650);
                    goToSlide(idx, idx > currentIndex ? 'next' : 'prev');
                  }}
                  onMouseEnter={() => audioSystem.playTechHover()}
                  className={`group cursor-pointer rounded-xl p-2.5 border transition-all duration-200 flex items-center gap-3 ${
                    isSelected
                      ? 'bg-slate-800/95 border-cyan-400/90 shadow-[0_0_20px_rgba(0,240,255,0.25)] ring-1 ring-cyan-400/70'
                      : 'bg-slate-900/70 border-slate-800/90 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  {/* Left Number Index */}
                  <span className={`w-5 shrink-0 text-center font-mono text-xs font-bold ${
                    isSelected ? 'text-cyan-400' : 'text-stone-500 group-hover:text-stone-300'
                  }`}>
                    {formattedNumber}
                  </span>

                  {/* Small Thumbnail */}
                  <div className="relative w-22 sm:w-26 h-13 sm:h-15 shrink-0 aspect-[16/10] rounded-lg overflow-hidden bg-slate-950 border border-white/10">
                    <img
                      src={proj.thumbSrc}
                      alt="Progetto Revit BIM"
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Small Eye / Play Overlay on Hover */}
                    <div className={`absolute inset-0 flex items-center justify-center transition-colors ${
                      isSelected 
                        ? 'bg-cyan-950/40' 
                        : 'bg-black/25 group-hover:bg-black/10'
                    }`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${
                        isSelected
                          ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/50'
                          : 'bg-black/75 text-white/90 group-hover:bg-cyan-500 group-hover:text-black'
                      }`}>
                        <Eye className="w-3 h-3" />
                      </div>
                    </div>
                  </div>

                  {/* Right: Title & Meta Info (NO FILENAMES!) */}
                  <div className="flex-1 min-w-0 pr-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-bold ${
                        isSelected 
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/80' 
                          : 'bg-slate-800 text-stone-400'
                      }`}>
                        Revit BIM 3D
                      </span>

                      {isSelected && (
                        <span className="text-[9px] font-mono text-cyan-400 flex items-center gap-1 font-bold animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                          IN VISIONE
                        </span>
                      )}
                    </div>

                    <h5 className={`text-xs sm:text-[13px] font-semibold line-clamp-1 leading-snug transition-colors ${
                      isSelected 
                        ? 'text-white' 
                        : 'text-stone-300 group-hover:text-white'
                    }`}>
                      Modello Strutturale Esecutivo #{formattedNumber}
                    </h5>

                    <p className="text-[11px] font-mono text-stone-400 line-clamp-1 mt-0.5">
                      Prefabbricati C.A.P. • Render 4K UHD
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Expand / Collapse Bar if more than 6 models */}
          {hasMoreThanLimit && (
            <div className="text-center pt-2">
              <button
                onClick={() => {
                  audioSystem.playClick(650);
                  setIsExpandedList(!isExpandedList);
                }}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-mono text-slate-300 hover:text-white transition shadow-sm active:scale-95"
              >
                {isExpandedList ? (
                  <>
                    <ChevronUp className="w-4 h-4 text-cyan-400" />
                    <span>Riduci la visualizzazione a {DEFAULT_VISIBLE_LIMIT} modelli</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 text-cyan-400" />
                    <span>Mostra tutti i {projects.length} modelli dell'elenco (+{remainingCount})</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen High-Resolution Lightbox Modal */}
      <AnimatePresence>
        {isFullscreenOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/95 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-7xl w-full max-h-[96vh] flex flex-col items-center"
            >
              {/* Top controls */}
              <div className="w-full flex items-center justify-between pb-3 text-white font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-cyan-300 font-bold">
                    Progetto Revit // Modello #{currentIndex + 1} di {projects.length}
                  </span>
                </div>
                <button
                  onClick={() => {
                    audioSystem.playClick(400);
                    setIsFullscreenOpen(false);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-red-950/60 border border-red-800 text-red-300 hover:text-white transition"
                >
                  Chiudi [Esc]
                </button>
              </div>

              {/* Image in Ultra Resolution */}
              <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-black flex items-center justify-center">
                <img
                  src={currentProject.src}
                  alt="Progetto Revit BIM Fullscreen"
                  className="max-h-[82vh] w-auto object-contain"
                />
              </div>

              {/* Bottom Nav inside lightbox */}
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={handlePrev}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs transition border border-slate-700"
                >
                  ◀ Precedente
                </button>
                <button
                  onClick={handleNext}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-bold font-mono text-xs transition shadow-lg"
                >
                  Prossimo ▶
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

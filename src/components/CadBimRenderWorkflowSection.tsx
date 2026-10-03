import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Layers,
  Box,
  Camera,
  CheckCircle2,
  Maximize2,
  Sparkles,
  ArrowRight,
  Sun,
  Moon,
  Compass,
  FileCode,
  Eye,
  Check,
  Zap,
  Grid,
  FileText,
  Scan,
  Crosshair,
  Search,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { audioSystem } from '../utils/audioSynthesizer';

export type WorkflowStage = 'cad2d' | 'bim3d' | 'render';

interface CoherenceHotspot {
  id: string;
  name: string;
  cadCoord: { x: number; y: number };
  bimCoord: { x: number; y: number };
  renderCoord: { x: number; y: number };
  description: string;
  specs: string;
}

const COHERENCE_HOTSPOTS: CoherenceHotspot[] = [
  {
    id: 'pool',
    name: 'Piscina a Sfioro Infinity (12.00 x 4.00 m)',
    cadCoord: { x: 74, y: 64 },
    bimCoord: { x: 72, y: 70 },
    renderCoord: { x: 70, y: 72 },
    description: 'Vasca in c.a. a sfioro continuo con canaletta perimetrale e scalinata sommersa.',
    specs: 'Dim. 12.00x4.00 m • Quota specchio d\'acqua -1.45m • Finitura mosaico antracite',
  },
  {
    id: 'curtain-wall',
    name: 'Vetrata Continua Soggiorno (L = 14.50 m)',
    cadCoord: { x: 42, y: 46 },
    bimCoord: { x: 48, y: 52 },
    renderCoord: { x: 48, y: 50 },
    description: 'Facciata a cellule vetrate strutturali a tutt\'altezza con ante scorrevoli a filo pavimento.',
    specs: 'Campata 14.50 m • Vetrocamera triplo basso-emissivo Ug 0.6 • Profilati a scomparsa',
  },
  {
    id: 'cantilever',
    name: 'Sbalzo Copertura & Terrazza (Aggetto 3.20 m)',
    cadCoord: { x: 40, y: 22 },
    bimCoord: { x: 38, y: 28 },
    renderCoord: { x: 40, y: 26 },
    description: 'Solaio a sbalzo in c.a. precompresso che protegge la zona living dal surriscaldamento estivo.',
    specs: 'Sporgenza libera 3.20 m • Cassero a vista con doghe di legno • Faretti LED integrati',
  },
  {
    id: 'living',
    name: 'Soggiorno Living a Doppia Altezza (58.4 m²)',
    cadCoord: { x: 36, y: 35 },
    bimCoord: { x: 42, y: 40 },
    renderCoord: { x: 42, y: 42 },
    description: 'Ambiente giorno open space con camino scenografico e collegamento visivo verso il patio.',
    specs: 'Sup. netta 58.4 m² • H libera 3.80 m • Pavimento in massetto microcemento levigato',
  },
];

interface StageMeta {
  id: WorkflowStage;
  number: string;
  name: string;
  software: string;
  styleLabel: string;
  durationSec: number;
  badge: string;
  badgeColor: string;
  description: string;
  bulletSpecs: string[];
}

const STAGES: StageMeta[] = [
  {
    id: 'cad2d',
    number: '01',
    name: 'Pianta Esecutiva 2D CAD (Disegno Classico B&N)',
    software: 'AutoCAD .DWG // Scala 1:100 Esecutivo',
    styleLabel: 'DISEGNO TECNICO IN BIANCO E NERO',
    durationSec: 5,
    badge: 'FASE 1 // PIANTA 2D CLASSICA B&N',
    badgeColor: 'text-stone-900 bg-white border-stone-300',
    description:
      'Tavola architettonica esecutiva classica in bianco e nero: partizioni murarie con retinature a 45°, arredi quotati, catene di quote millimetriche a 45°, assi strutturali A-B-C-D e 1-2-3-4-5, piscina a sfioro 12.00x4.00m e cartiglio normato.',
    bulletSpecs: [
      'Stile Classico: Fondo Bianco Opaco e Tratto Nero Netto',
      'Muri Portanti Sezionati con Doppia Linea e Retinatura Piena',
      'Arredi, Serramenti, Sanitari e Quote Dettagliate in Scala 1:100',
      'Piscina a Sfioro 12.00x4.00m con Canaletta e Scalini Sommersi',
    ],
  },
  {
    id: 'bim3d',
    number: '02',
    name: 'Modello 3D BIM (Revit Stile Linee Nascoste)',
    software: 'Autodesk Revit // LOD 350 Modello Bianco',
    styleLabel: 'MODELLO BIANCO CON LINEE (HIDDEN LINE)',
    durationSec: 5,
    badge: 'FASE 2 // BIM 3D BIANCO CON LINEE',
    badgeColor: 'text-blue-900 bg-blue-50 border-blue-200',
    description:
      'Il medesimo edificio visualizzato nel visual style ufficiale di Autodesk Revit "Linee Nascoste (Hidden Line)": volumi geometrici in puro bianco, spigoli e profili in netto tratto nero vettoriale, quote altimetriche e nessun rendering o shader colorato.',
    bulletSpecs: [
      'Stile Ufficiale: Autodesk Revit Linee Nascoste (Hidden Line)',
      'Volumi Puri Bianchi con Contorni Neri ad Alta Risoluzione',
      'Quote Altimetriche di Livello (±0.00m, +3.80m, +7.20m)',
      'Zero Rendering: Solo Geometrie BIM Parametriche e Linee',
    ],
  },
  {
    id: 'render',
    number: '03',
    name: 'Rendering Fotorealistico 4K Finale',
    software: 'Twinmotion / Chaos Corona // PBR Ray Tracing',
    styleLabel: 'FOTOREALISMO ARCHITETTONICO 4K',
    durationSec: 5,
    badge: 'FASE 3 // RENDERING FOTOREALISTICO 4K',
    badgeColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-400/40',
    description:
      'La medesima villa completata con materiali fisici PBR (calcestruzzo faccia a vista con casseri in legno, doghe in teak, vetro trasparente riflettente, acqua con caustiche fisiche) e illuminazione serale calibrata.',
    bulletSpecs: [
      'Stessa Identica Pianta, Stesso Sbalzo e Stessa Piscina',
      'Illuminazione Twilight con Faretti LED e Riflessi Acqua',
      'Materiali Calibrati: Calcestruzzo Cassero, Legno e Alluminio',
      'Risoluzione Massima 4K Ultra-HD (3840x2160)',
    ],
  },
];

// URLs for the real 3D model and render of the modern villa
const VILLA_BIM_CLAY_IMAGE = 'https://lh3.googleusercontent.com/d/1hGIgUaSTBdFCOfM8Rzgo08E47esVAtiT=w2048';
const VILLA_RENDER_SUNSET_IMAGE = 'https://lh3.googleusercontent.com/d/1c2TkqbRPV_PApjYrt1PcMue4rMU8EHf2=w2048';
const VILLA_RENDER_NIGHT_IMAGE = 'https://lh3.googleusercontent.com/d/15STZ7yfKexRqGGA4P7eLcCGbp-Dgr8iV=w2048';

export const CadBimRenderWorkflowSection: React.FC = () => {
  // Video Playback State
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0); // 0 to 15 seconds
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [activeStage, setActiveStage] = useState<WorkflowStage>('cad2d');
  const [nightLighting, setNightLighting] = useState<boolean>(false);
  const [isCompareMode, setIsCompareMode] = useState<boolean>(false);
  const [compareSplit, setCompareSplit] = useState<number>(50); // 0 to 100%
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);
  const [showHotspots, setShowHotspots] = useState<boolean>(true);

  const totalDuration = 15;
  const animFrameRef = useRef<number | null>(null);
  const lastTickTimeRef = useRef<number>(performance.now());
  const compareContainerRef = useRef<HTMLDivElement>(null);

  // Compute active stage from current timeline position
  const getStageFromTime = useCallback((time: number): WorkflowStage => {
    if (time < 5) return 'cad2d';
    if (time < 10) return 'bim3d';
    return 'render';
  }, []);

  // Main Video Loop animation
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    lastTickTimeRef.current = performance.now();

    const tick = (now: number) => {
      const dt = (now - lastTickTimeRef.current) / 1000;
      lastTickTimeRef.current = now;

      setCurrentTime((prevTime) => {
        const nextTime = prevTime + dt * playbackSpeed;
        if (nextTime >= totalDuration) {
          return 0; // Loop seamlessly
        }
        return nextTime;
      });

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, playbackSpeed, totalDuration]);

  // Keep activeStage synchronized with currentTime
  useEffect(() => {
    const stage = getStageFromTime(currentTime);
    if (stage !== activeStage) {
      setActiveStage(stage);
      audioSystem.playClick(600 + (stage === 'cad2d' ? 0 : stage === 'bim3d' ? 120 : 240));
    }
  }, [currentTime, activeStage, getStageFromTime]);

  const handleJumpToStage = (stage: WorkflowStage) => {
    audioSystem.playClick(700);
    if (stage === 'cad2d') setCurrentTime(0.5);
    else if (stage === 'bim3d') setCurrentTime(5.5);
    else setCurrentTime(10.5);
  };

  const handleTogglePlay = () => {
    audioSystem.playClick(isPlaying ? 500 : 800);
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    audioSystem.playBootBeep(880);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handleSpeedChange = (speed: number) => {
    audioSystem.playClick(900);
    setPlaybackSpeed(speed);
  };

  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
  };

  // Compare split slider mouse drag
  const handleCompareMove = (clientX: number) => {
    if (!compareContainerRef.current) return;
    const rect = compareContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setCompareSplit(pct);
  };

  const currentStageMeta = STAGES.find((s) => s.id === activeStage) || STAGES[0];
  const activeRenderImage = nightLighting ? VILLA_RENDER_NIGHT_IMAGE : VILLA_RENDER_SUNSET_IMAGE;
  const activeHotspotObj = COHERENCE_HOTSPOTS.find((h) => h.id === selectedHotspot);

  return (
    <section
      id="workflow-cad-bim-render"
      className="relative py-16 md:py-24 px-4 sm:px-6 md:px-12 bg-[#050608] border-t border-white/10 select-none overflow-hidden"
    >
      {/* Background Architectural Ambience */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      {/* Embedded SVG Filter for Authentic Revit Hidden Line effect (White Surfaces + Black Silhouette Edge Lines) */}
      <svg className="absolute w-0 h-0 pointer-events-none">
        <defs>
          <filter id="revitHiddenLineFilter" colorInterpolationFilters="sRGB">
            {/* Convert to pure grayscale */}
            <feColorMatrix
              type="matrix"
              values="0.3333 0.3333 0.3333 0 0
                      0.3333 0.3333 0.3333 0 0
                      0.3333 0.3333 0.3333 0 0
                      0      0      0      1 0"
              result="gray"
            />
            {/* Boost brightness and contrast so surfaces become crisp white while edges remain sharp black */}
            <feComponentTransfer in="gray" result="contrast">
              <feFuncR type="linear" slope="3.8" intercept="-0.85" />
              <feFuncG type="linear" slope="3.8" intercept="-0.85" />
              <feFuncB type="linear" slope="3.8" intercept="-0.85" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 uppercase tracking-widest mb-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>COERENZA ARCHITETTONICA ASSOLUTA // 1:1 STESSO EDIFICIO</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase text-white tracking-tight font-sans">
              Villa Contemporanea: Dal CAD al BIM al Render
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm md:text-base mt-2 max-w-3xl font-sans leading-relaxed">
              Dimostrazione video dell'evoluzione del <strong>medesimo edificio</strong>: 
              dalla <strong>pianta CAD 2D esecutiva in bianco e nero</strong> (stile grafici classici con arredi, quote e retinature), 
              al <strong>modello 3D BIM volumetrico in bianco con linee nere</strong> (stile ufficiale Revit <em>Linee Nascoste</em>, senza rendering), 
              fino al <strong>rendering fotorealistico 4K finale</strong> con materiali fisici PBR e luce serale.
            </p>
          </div>

          {/* Quick Stage Indicator Pills */}
          <div className="flex items-center gap-2 font-mono text-xs">
            {STAGES.map((s) => {
              const isActive = activeStage === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => handleJumpToStage(s.id)}
                  className={`px-3 py-1.5 rounded-lg border transition-all duration-300 flex items-center gap-1.5 ${
                    isActive
                      ? 'border-cyan-400 bg-cyan-950/80 text-cyan-300 font-bold shadow-[0_0_12px_rgba(6,182,212,0.3)] scale-105'
                      : 'border-white/10 bg-white/5 text-stone-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  <span>{s.number}.</span>
                  <span>{s.id === 'cad2d' ? 'Pianta CAD (B&N)' : s.id === 'bim3d' ? 'BIM Bianco+Linee' : 'Render 4K'}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MAIN VIDEO PLAYER CONTAINER                                               */}
        {/* ========================================================================= */}
        <div className="relative bg-stone-950 border border-white/15 rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.85)]">
          {/* Top Video HUD Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 bg-black/85 border-b border-white/10 backdrop-blur-md font-mono text-xs">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <span className="font-bold text-white tracking-wider">TIMELAPSE // STESSO EDIFICIO IN 3 FASI</span>
              </div>
              <span className="text-white/20">|</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold border border-white/20 bg-white/10 text-white">
                {currentStageMeta.styleLabel}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Hotspots Toggle */}
              <button
                onClick={() => {
                  audioSystem.playClick(650);
                  setShowHotspots(!showHotspots);
                }}
                className={`px-2.5 py-1 rounded text-[11px] font-bold border flex items-center gap-1.5 transition-all ${
                  showHotspots
                    ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300'
                    : 'bg-white/5 text-stone-400 border-white/15'
                }`}
                title="Mostra punti di riscontro coerenza tra le 3 fasi"
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>Punti Coerenza (4)</span>
              </button>

              {/* Compare Mode Toggle */}
              <button
                onClick={() => {
                  audioSystem.playClick(750);
                  setIsCompareMode(!isCompareMode);
                }}
                className={`px-2.5 py-1 rounded text-[11px] font-bold border flex items-center gap-1.5 transition-all ${
                  isCompareMode
                    ? 'bg-cyan-400 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                    : 'bg-white/5 text-stone-300 border-white/15 hover:border-cyan-400'
                }`}
                title="Attiva tendina comparativa Split CAD vs RENDER"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{isCompareMode ? 'Disattiva Confronto' : 'Tenda Confronto CAD/Render'}</span>
              </button>

              {/* Day / Night Render Toggle */}
              <button
                onClick={() => {
                  audioSystem.playClick(850);
                  setNightLighting(!nightLighting);
                }}
                className={`p-1.5 rounded border transition-all ${
                  nightLighting
                    ? 'bg-purple-950/80 border-purple-400 text-purple-300'
                    : 'bg-amber-950/60 border-amber-400 text-amber-300'
                }`}
                title={nightLighting ? 'Passa a Luce Tramonto' : 'Passa a Luce Notturna'}
              >
                {nightLighting ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Video Viewport Area (16:9 Aspect Ratio) */}
          <div
            ref={compareContainerRef}
            onMouseMove={(e) => {
              if (isCompareMode) handleCompareMove(e.clientX);
            }}
            onTouchMove={(e) => {
              if (isCompareMode && e.touches[0]) handleCompareMove(e.touches[0].clientX);
            }}
            className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-[#f8f9fa] overflow-hidden select-none"
          >
            {/* ------------------------------------------------------------- */}
            {/* VIEWPORT MODE A: NORMAL TIMELAPSE (3 Cross-fading Stages)     */}
            {/* ------------------------------------------------------------- */}
            {!isCompareMode && (
              <>
                {/* ========================================================= */}
                {/* 1. FASE CAD 2D: Disegno Tecnico Classico in Bianco e Nero */}
                {/* ========================================================= */}
                <div
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out bg-[#fcfcfc] ${
                    activeStage === 'cad2d' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  <div className="relative w-full h-full p-2 sm:p-5 flex items-center justify-center bg-[#fdfdfd]">
                    {/* Architectural Paper Frame and Fine Grid */}
                    <div className="absolute inset-2 sm:inset-4 border border-stone-400 pointer-events-none" />
                    <div className="absolute inset-3 sm:inset-5 border-2 border-stone-900 pointer-events-none" />

                    {/* Classic Black & White Architectural Floor Plan SVG */}
                    <svg
                      viewBox="0 0 1000 620"
                      className="w-full h-full max-h-[580px]"
                    >
                      <defs>
                        {/* 45-degree architectural dimension tick */}
                        <marker
                          id="cadTickClassic"
                          markerWidth="6"
                          markerHeight="6"
                          refX="3"
                          refY="3"
                          orient="auto"
                        >
                          <line x1="0" y1="6" x2="6" y2="0" stroke="#000000" strokeWidth="1.8" />
                        </marker>
                        {/* Door swing arrow */}
                        <marker
                          id="doorArrowClassic"
                          markerWidth="6"
                          markerHeight="6"
                          refX="4"
                          refY="3"
                          orient="auto"
                        >
                          <polygon points="0,1 5,3 0,5" fill="#000000" />
                        </marker>
                        {/* Diagonal wall hatch pattern for cut walls */}
                        <pattern
                          id="wallHatchDense"
                          width="6"
                          height="6"
                          patternTransform="rotate(45 0 0)"
                          patternUnits="userSpaceOnUse"
                        >
                          <line x1="0" y1="0" x2="0" y2="6" stroke="#000000" strokeWidth="1.3" />
                        </pattern>
                        {/* Parquet floor hatching in bedroom suites */}
                        <pattern
                          id="parquetHatch"
                          width="12"
                          height="12"
                          patternUnits="userSpaceOnUse"
                        >
                          <rect x="0" y="0" width="6" height="12" fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
                          <rect x="6" y="0" width="6" height="12" fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
                        </pattern>
                      </defs>

                      {/* Structural Orthogonal Grid Axes (Dashed lines) */}
                      <g stroke="#94a3b8" strokeWidth="0.7" strokeDasharray="6 3 2 3" opacity="0.7">
                        <line x1="90" y1="45" x2="90" y2="575" />
                        <line x1="310" y1="45" x2="310" y2="575" />
                        <line x1="680" y1="45" x2="680" y2="575" />
                        <line x1="930" y1="45" x2="930" y2="575" />
                        <line x1="35" y1="115" x2="965" y2="115" />
                        <line x1="35" y1="260" x2="965" y2="260" />
                        <line x1="35" y1="480" x2="965" y2="480" />
                      </g>

                      {/* Grid Axis Bubble Circles on perimeter */}
                      <g fill="#ffffff" stroke="#111111" strokeWidth="1.2" fontFamily="monospace" fontSize="11" fontWeight="bold">
                        <circle cx="90" cy="35" r="11" />
                        <text x="90" y="39" textAnchor="middle">1</text>
                        <circle cx="310" cy="35" r="11" />
                        <text x="310" y="39" textAnchor="middle">2</text>
                        <circle cx="680" cy="35" r="11" />
                        <text x="680" y="39" textAnchor="middle">3</text>
                        <circle cx="930" cy="35" r="11" />
                        <text x="930" y="39" textAnchor="middle">4</text>

                        <circle cx="22" cy="115" r="11" />
                        <text x="22" y="119" textAnchor="middle">A</text>
                        <circle cx="22" cy="260" r="11" />
                        <text x="22" y="264" textAnchor="middle">B</text>
                        <circle cx="22" cy="480" r="11" />
                        <text x="22" y="484" textAnchor="middle">C</text>
                      </g>

                      {/* Cantilevered Roof Slab Overhang Outline (3.20m sbalzo) - Dashed Line */}
                      <polygon
                        points="70,95 715,95 715,285 500,285 500,505 70,505"
                        fill="none"
                        stroke="#4b5563"
                        strokeWidth="1.4"
                        strokeDasharray="7 4"
                      />
                      <text x="310" y="88" fill="#374151" fontSize="10" fontFamily="monospace" fontWeight="bold">
                        - - PROIEZIONE SBALZO COPERTURA [+3.20m] - -
                      </text>

                      {/* Floor parquet fill for suites */}
                      <polygon points="106,128 300,128 300,466 106,466" fill="url(#parquetHatch)" opacity="0.6" />

                      {/* Main External Load-Bearing Concrete Walls (Hatched core) */}
                      <g fill="url(#wallHatchDense)" stroke="#000000" strokeWidth="2.5" strokeLinejoin="miter">
                        <polygon points="90,115 680,115 680,260 480,260 480,480 90,480" />
                      </g>

                      {/* White inner room cavity to clear hatched walls */}
                      <polygon
                        points="106,131 664,131 664,244 464,244 464,464 106,464"
                        fill="#ffffff"
                        stroke="#000000"
                        strokeWidth="1.6"
                      />

                      {/* Continuous Floor-to-Ceiling Glass Sliding Doors (14.50m span) */}
                      <g stroke="#000000" strokeWidth="1.8">
                        {/* Living front sliding glass line */}
                        <line x1="280" y1="244" x2="464" y2="244" strokeWidth="3.2" stroke="#000000" />
                        <line x1="464" y1="244" x2="464" y2="380" strokeWidth="3.2" stroke="#000000" />
                        {/* Glass Slider Indicators */}
                        <line x1="320" y1="238" x2="355" y2="238" markerEnd="url(#doorArrowClassic)" />
                        <line x1="420" y1="238" x2="385" y2="238" markerEnd="url(#doorArrowClassic)" />
                        <text x="320" y="231" fill="#111111" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
                          VETRATA SCORREVOLE L=14.50m (TRIPLO VETRO)
                        </text>
                      </g>

                      {/* Interior Partitions (15cm) */}
                      <g stroke="#000000" strokeWidth="1.8" fill="none">
                        {/* Kitchen divider */}
                        <line x1="280" y1="131" x2="280" y2="244" strokeDasharray="5 3" />
                        {/* Master Suite partition */}
                        <line x1="106" y1="270" x2="280" y2="270" />
                        <line x1="210" y1="270" x2="210" y2="380" />
                        <line x1="106" y1="380" x2="280" y2="380" />
                        {/* Internal door openings and swings */}
                        <path d="M 280,310 A 35,35 0 0,1 245,345" stroke="#374151" strokeWidth="1" strokeDasharray="2 2" fill="none" />
                        <line x1="280" y1="310" x2="280" y2="345" stroke="#000000" strokeWidth="2" />
                      </g>

                      {/* Architectural Furniture Cad Blocks (Arredi in Bianco & Nero) */}
                      <g stroke="#374151" strokeWidth="1" fill="#ffffff">
                        {/* Living: Modular L-Shaped Sectional Sofa */}
                        <polygon points="320,150 420,150 420,210 390,210 390,175 320,175" fill="#f8fafc" strokeWidth="1.2" />
                        {/* Living: Coffee Table */}
                        <rect x="345" y="185" width="40" height="22" strokeWidth="1" />
                        {/* Living: TV Low Cabinet */}
                        <rect x="445" y="150" width="14" height="70" strokeWidth="1" />

                        {/* Kitchen: Central Island with Dual Sink & Induction */}
                        <rect x="520" y="150" width="110" height="45" fill="#f8fafc" strokeWidth="1.2" />
                        <circle cx="550" cy="172" r="8" strokeWidth="1" />
                        <circle cx="575" cy="172" r="8" strokeWidth="1" />
                        <rect x="600" y="162" width="20" height="20" strokeWidth="1" />
                        {/* Dining Table for 8 people */}
                        <rect x="535" y="215" width="85" height="35" strokeWidth="1.2" />
                        {[...Array(4)].map((_, i) => (
                          <rect key={`c1-${i}`} x={540 + i * 20} y="206" width="12" height="7" rx="1" />
                        ))}
                        {[...Array(4)].map((_, i) => (
                          <rect key={`c2-${i}`} x={540 + i * 20} y="252" width="12" height="7" rx="1" />
                        ))}

                        {/* Master Suite: King Size Bed with Pillows */}
                        <rect x="125" y="150" width="70" height="60" strokeWidth="1.2" />
                        <rect x="130" y="155" width="28" height="15" rx="2" />
                        <rect x="162" y="155" width="28" height="15" rx="2" />
                        {/* Nightstands */}
                        <rect x="110" y="150" width="12" height="18" />
                        <rect x="198" y="150" width="12" height="18" />

                        {/* Bathroom: Walk-in Shower & Vanity */}
                        <rect x="215" y="275" width="60" height="35" strokeWidth="1" strokeDasharray="3 2" />
                        <circle cx="245" cy="292" r="4" />
                        <rect x="215" y="325" width="30" height="16" rx="2" />
                        <circle cx="230" cy="333" r="5" />
                      </g>

                      {/* Modern Rectangular Infinity Pool (12.00 x 4.00 m) in Black & White CAD style */}
                      <g>
                        {/* Outer perimeter overflow gutter */}
                        <rect
                          x="530"
                          y="295"
                          width="390"
                          height="160"
                          fill="#f3f4f6"
                          stroke="#111111"
                          strokeWidth="2"
                        />
                        {/* Inner Pool Basin */}
                        <rect
                          x="538"
                          y="303"
                          width="374"
                          height="144"
                          fill="#ffffff"
                          stroke="#000000"
                          strokeWidth="2.4"
                        />
                        {/* Submerged Stairs */}
                        <line x1="538" y1="330" x2="578" y2="330" stroke="#000000" strokeWidth="1.4" />
                        <line x1="538" y1="360" x2="578" y2="360" stroke="#000000" strokeWidth="1.4" />
                        <line x1="538" y1="390" x2="578" y2="390" stroke="#000000" strokeWidth="1.4" />
                        {/* Water Level Annotation */}
                        <text x="690" y="365" fill="#000000" fontSize="12" fontFamily="monospace" fontWeight="bold">
                          PISCINA A SFIORO [12.00 × 4.00 m]
                        </text>
                        <text x="705" y="385" fill="#4b5563" fontSize="10" fontFamily="monospace">
                          Prof. -1.45 m • Sup. 48.00 m² // SKIMMER A SFIORO
                        </text>
                      </g>

                      {/* Solarium Teak Decking Area (Hatched in black/white) */}
                      <g stroke="#9ca3af" strokeWidth="0.8">
                        <rect x="464" y="244" width="216" height="236" fill="#fafafa" stroke="#111111" strokeWidth="1.5" />
                        {[...Array(11)].map((_, i) => (
                          <line key={i} x1="464" y1={265 + i * 20} x2="680" y2={265 + i * 20} />
                        ))}
                        <text x="510" y="258" fill="#111111" fontSize="10.5" fontFamily="monospace" fontWeight="bold">
                          DECK SOLARIUM IN DOGHE [42.0 m²]
                        </text>
                      </g>

                      {/* Structural Concrete Columns (Sezionati e Pieni Neri) */}
                      <g fill="#000000" stroke="#000000">
                        <rect x="275" y="240" width="10" height="10" />
                        <rect x="458" y="240" width="10" height="10" />
                        <rect x="458" y="375" width="10" height="10" />
                        <rect x="458" y="458" width="10" height="10" />
                        <rect x="658" y="240" width="10" height="10" />
                      </g>

                      {/* Classical Dimension Chains with 45° Ticks (Quote Architettoniche) */}
                      <g stroke="#000000" strokeWidth="1" fontSize="10" fontFamily="monospace" fill="#000000">
                        {/* Top Total Length Quote: 22.40 m */}
                        <line x1="90" y1="65" x2="680" y2="65" markerStart="url(#cadTickClassic)" markerEnd="url(#cadTickClassic)" />
                        <line x1="90" y1="60" x2="90" y2="115" stroke="#94a3b8" strokeWidth="0.6" />
                        <line x1="680" y1="60" x2="680" y2="115" stroke="#94a3b8" strokeWidth="0.6" />
                        <text x="385" y="58" textAnchor="middle" fontWeight="bold">L = 22.40 m</text>

                        {/* Bottom Total Length Quote (including Pool): 32.00 m */}
                        <line x1="90" y1="535" x2="920" y2="535" markerStart="url(#cadTickClassic)" markerEnd="url(#cadTickClassic)" />
                        <line x1="90" y1="480" x2="90" y2="540" stroke="#94a3b8" strokeWidth="0.6" />
                        <line x1="920" y1="455" x2="920" y2="540" stroke="#94a3b8" strokeWidth="0.6" />
                        <text x="505" y="555" textAnchor="middle" fontWeight="bold">LUNGHEZZA TOTALE LOTTO CON PISCINA = 32.00 m</text>

                        {/* Left Height Quote: 14.40 m */}
                        <line x1="50" y1="115" x2="50" y2="480" markerStart="url(#cadTickClassic)" markerEnd="url(#cadTickClassic)" />
                        <line x1="45" y1="115" x2="90" y2="115" stroke="#94a3b8" strokeWidth="0.6" />
                        <line x1="45" y1="480" x2="90" y2="480" stroke="#94a3b8" strokeWidth="0.6" />
                        <text x="40" y="300" textAnchor="middle" transform="rotate(-90 40 300)" fontWeight="bold">
                          H = 14.40 m
                        </text>
                      </g>

                      {/* North Arrow Symbol */}
                      <g transform="translate(930, 85)">
                        <circle cx="0" cy="0" r="22" fill="#ffffff" stroke="#000000" strokeWidth="1.5" />
                        <polygon points="0,-18 5,0 0,-3 -5,0" fill="#000000" />
                        <polygon points="0,18 5,0 0,3 -5,0" fill="#e5e7eb" stroke="#000000" strokeWidth="0.8" />
                        <text x="-4" y="-24" fill="#000000" fontSize="12" fontFamily="monospace" fontWeight="bold">N</text>
                      </g>

                      {/* Classical Title Block / Cartiglio Tecnico (B&W) */}
                      <g transform="translate(685, 495)">
                        <rect x="0" y="0" width="285" height="95" fill="#ffffff" stroke="#000000" strokeWidth="2" />
                        <line x1="0" y1="24" x2="285" y2="24" stroke="#000000" strokeWidth="1.2" />
                        <line x1="0" y1="52" x2="285" y2="52" stroke="#000000" strokeWidth="1.2" />
                        <line x1="170" y1="52" x2="170" y2="95" stroke="#000000" strokeWidth="1.2" />

                        <text x="10" y="16" fill="#000000" fontSize="11" fontFamily="monospace" fontWeight="bold">
                          PROGETTO ESECUTIVO // VILLA MODERNA A SBALZO
                        </text>
                        <text x="10" y="38" fill="#111111" fontSize="10" fontFamily="monospace" fontWeight="bold">
                          TAVOLA 01: PIANTA PIANO TERRA E PISCINA
                        </text>
                        <text x="10" y="47" fill="#4b5563" fontSize="8.5" fontFamily="monospace">
                          FORMATO DWG CLASSICO BIANCO &amp; NERO • SCALA 1:100
                        </text>

                        <text x="10" y="70" fill="#111111" fontSize="9" fontFamily="monospace">
                          SUPERFICIE: 285.00 m²
                        </text>
                        <text x="10" y="85" fill="#111111" fontSize="9" fontFamily="monospace">
                          DATA: 2026 // REV. 04
                        </text>

                        <text x="180" y="70" fill="#000000" fontSize="9" fontFamily="monospace" fontWeight="bold">
                          CONFORME BIM LOD 350
                        </text>
                        <text x="180" y="85" fill="#059669" fontSize="8.5" fontFamily="monospace" fontWeight="bold">
                          ✓ QUOTE VERIFICATE
                        </text>
                      </g>
                    </svg>

                    {/* Animated Scanning Line during CAD phase */}
                    {isPlaying && (
                      <div
                        className="absolute inset-y-0 w-0.5 bg-stone-900 shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-none transition-all duration-75"
                        style={{
                          left: `${((currentTime % 5) / 5) * 100}%`,
                          opacity: 0.7,
                        }}
                      >
                        <div className="absolute top-4 left-2 px-2 py-0.5 rounded bg-black text-white text-[10px] font-mono whitespace-nowrap shadow">
                          LINEA DI SEZIONE / RILIEVO CAD IN CORSO...
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* ========================================================================= */}
                {/* 2. FASE BIM 3D: Modello Bianco con Linee Nascoste (Revit Hidden Line)    */}
                {/* ========================================================================= */}
                <div
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out bg-[#ffffff] ${
                    activeStage === 'bim3d' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  <div className="relative w-full h-full flex items-center justify-center bg-white overflow-hidden">
                    {/* The REAL 3D BIM model of the villa, processed with the Revit Hidden-Line filter */}
                    <img
                      src={VILLA_BIM_CLAY_IMAGE}
                      alt="Modello 3D BIM Autodesk Revit Hidden Line Bianco Villa Moderna"
                      referrerPolicy="no-referrer"
                      style={{ filter: 'url(#revitHiddenLineFilter) contrast(150%)' }}
                      className="w-full h-full object-cover select-none"
                    />

                    {/* Vector Overlay: Revit Elevation Level Datums & ViewCube HUD */}
                    <div className="absolute inset-0 pointer-events-none p-4 sm:p-6 flex flex-col justify-between">
                      {/* Top HUD: Revit Style Interface Banner */}
                      <div className="flex items-start justify-between">
                        <div className="bg-white/95 border border-stone-800 p-2.5 rounded shadow-md font-mono text-[11px] text-stone-900">
                          <div className="font-bold flex items-center gap-1.5">
                            <Box className="w-3.5 h-3.5 text-blue-700" />
                            <span>AUTODESK REVIT 2026 // MODELLO BIM LOD 350</span>
                          </div>
                          <div className="text-[10px] text-blue-700 font-bold mt-0.5">
                            VISUAL STYLE: HIDDEN LINE (BIANCO CON LINEE NASCOSTE)
                          </div>
                          <div className="text-[9.5px] text-stone-600 mt-0.5">
                            VOLUMETRIA: 920.4 m³ • SUP: 285 m² • ZERO RENDERING
                          </div>
                        </div>

                        {/* Revit ViewCube in corner */}
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-stone-100/90 border border-stone-400 rounded shadow-md flex items-center justify-center font-mono text-[10px] font-bold text-stone-700">
                          <div className="text-center leading-tight">
                            <div>TOP</div>
                            <div className="text-[9px] text-stone-500">ISOMETRIC</div>
                            <div>FRONT</div>
                          </div>
                        </div>
                      </div>

                      {/* Elevation Level Indicators */}
                      <div className="space-y-2 font-mono text-[10.5px] text-stone-900 bg-white/90 p-3 rounded border border-stone-300 max-w-sm shadow">
                        <div className="flex items-center gap-2">
                          <span className="text-blue-700 font-bold">▽ LIVELLO COPERTURA:</span>
                          <span className="font-bold">+3.80 m (Sbalzo 3.20m)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-blue-700 font-bold">▽ LIVELLO 00 LIVING:</span>
                          <span className="font-bold">±0.00 m (Vetrata 14.50m)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-blue-700 font-bold">▽ LIVELLO PISCINA:</span>
                          <span className="font-bold">-1.45 m (Fondo Vasca c.a.)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ========================================================================= */}
                {/* 3. FASE RENDER: Rendering Fotorealistico 4K della Medesima Villa          */}
                {/* ========================================================================= */}
                <div
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    activeStage === 'render' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  <img
                    src={activeRenderImage}
                    alt="Rendering Fotorealistico Villa Moderna 4K"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-all duration-700"
                  />

                  {/* Contrast Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                  {/* Render Metadata Callouts */}
                  <div className="absolute top-6 left-6 font-mono text-xs pointer-events-none hidden sm:block">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-black/80 backdrop-blur-md border border-emerald-400/60 text-emerald-300 rounded-lg shadow-xl">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                      <span>FOTOREALISMO 4K // MEDESIMA VILLA CON MATERIALI PBR E LUCI</span>
                    </div>
                  </div>

                  {/* Callout Badges pointing to identical CAD/BIM components */}
                  <div className="absolute bottom-8 left-6 sm:left-10 font-mono text-xs flex flex-wrap gap-2.5 pointer-events-none">
                    <div className="px-3 py-1.5 rounded-lg bg-black/85 border border-emerald-500/50 text-emerald-300 backdrop-blur-md shadow-lg flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Coerenza Geometrica CAD &lt;-&gt; BIM &lt;-&gt; RENDER: 100%</span>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-black/85 border border-cyan-500/40 text-cyan-300 backdrop-blur-md shadow-lg">
                      Piscina a Sfioro 12.00x4.00m con Riflessi Fisici
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-black/85 border border-white/20 text-white backdrop-blur-md shadow-lg hidden md:block">
                      Sbalzo Copertura 3.20m con Spot LED Incassati
                    </div>
                  </div>
                </div>

                {/* Hotspot Interactive Markers Overlay across active stage */}
                {showHotspots && (
                  <div className="absolute inset-0 pointer-events-auto">
                    {COHERENCE_HOTSPOTS.map((hotspot) => {
                      const coord =
                        activeStage === 'cad2d'
                          ? hotspot.cadCoord
                          : activeStage === 'bim3d'
                          ? hotspot.bimCoord
                          : hotspot.renderCoord;

                      const isSelected = selectedHotspot === hotspot.id;

                      return (
                        <button
                          key={hotspot.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            audioSystem.playClick(850);
                            setSelectedHotspot(isSelected ? null : hotspot.id);
                          }}
                          style={{ left: `${coord.x}%`, top: `${coord.y}%` }}
                          className={`absolute -translate-x-1/2 -translate-y-1/2 group z-30 transition-transform ${
                            isSelected ? 'scale-125' : 'hover:scale-110'
                          }`}
                          title={hotspot.name}
                        >
                          <span className="relative flex h-6 w-6 items-center justify-center">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-500 border-2 border-white shadow-lg text-[9px] font-bold text-slate-950 items-center justify-center">
                              •
                            </span>
                          </span>

                          {/* Tooltip on Hover / Select */}
                          {isSelected && (
                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-64 p-2.5 rounded-lg bg-black/95 border border-cyan-400 text-white font-mono text-[11px] shadow-2xl z-40 text-left pointer-events-none">
                              <div className="font-bold text-cyan-300">{hotspot.name}</div>
                              <div className="text-[10px] text-stone-300 mt-1 leading-snug">{hotspot.description}</div>
                              <div className="text-[9.5px] text-emerald-400 font-semibold mt-1.5 border-t border-white/10 pt-1">
                                {hotspot.specs}
                              </div>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {/* ------------------------------------------------------------- */}
            {/* VIEWPORT MODE B: INTERACTIVE SPLIT COMPARISON SLIDER          */}
            {/* ------------------------------------------------------------- */}
            {isCompareMode && (
              <div className="relative w-full h-full select-none cursor-ew-resize">
                {/* Left Side: Classic B&W CAD Plan */}
                <div
                  className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-cyan-400 z-10 bg-[#fdfdfd]"
                  style={{ width: `${compareSplit}%` }}
                >
                  <div className="relative w-[1000px] sm:w-[1300px] h-full p-6 flex items-center justify-center">
                    <div className="absolute top-4 left-4 z-20 px-2.5 py-1 rounded bg-black text-white font-mono text-xs font-bold shadow-lg border border-stone-300">
                      1. PIANTA 2D CAD CLASSICA (B&amp;N)
                    </div>
                    <div className="text-center font-mono text-xs text-stone-700">
                      [ PIANTA ESECUTIVA AUTOCAD IN BIANCO E NERO // ALLINEAMENTO STRUTTURALE ]
                    </div>
                  </div>
                </div>

                {/* Right Side: 3D Photorealistic Render */}
                <div className="absolute inset-0">
                  <img
                    src={activeRenderImage}
                    alt="Rendering Villa Moderna"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 z-20 px-2.5 py-1 rounded bg-emerald-950/90 border border-emerald-400 text-emerald-300 font-mono text-xs font-bold shadow-lg">
                    3. RENDERING FOTOREALISTICO 4K
                  </div>
                </div>

                {/* Interactive Drag Handle Divider */}
                <div
                  className="absolute inset-y-0 z-30 flex items-center justify-center pointer-events-none"
                  style={{ left: `${compareSplit}%`, transform: 'translateX(-50%)' }}
                >
                  <div className="w-8 h-8 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shadow-[0_0_20px_#00f0ff] border-2 border-white">
                    <Sliders className="w-4 h-4" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* =============================================================== */}
          {/* VIDEO TIMELINE BAR & PLAYBACK CONTROLS                          */}
          {/* =============================================================== */}
          <div className="p-4 sm:p-5 bg-black/90 border-t border-white/10 backdrop-blur-md">
            {/* Timeline Progress Slider */}
            <div className="relative mb-4">
              <input
                type="range"
                min="0"
                max={totalDuration}
                step="0.05"
                value={currentTime}
                onChange={handleScrubberChange}
                aria-label="Timeline avanzamento video"
                className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />

              {/* Stage Step Markers on the timeline */}
              <div className="flex justify-between items-center text-[10px] font-mono text-white/50 mt-1.5 px-0.5">
                <button
                  onClick={() => handleJumpToStage('cad2d')}
                  className={`hover:text-cyan-400 transition ${activeStage === 'cad2d' ? 'text-white font-bold' : ''}`}
                >
                  00:00 • 1. PIANTA CAD B&amp;N
                </button>
                <button
                  onClick={() => handleJumpToStage('bim3d')}
                  className={`hover:text-blue-400 transition ${activeStage === 'bim3d' ? 'text-blue-300 font-bold' : ''}`}
                >
                  00:05 • 2. BIM BIANCO+LINEE
                </button>
                <button
                  onClick={() => handleJumpToStage('render')}
                  className={`hover:text-emerald-400 transition ${activeStage === 'render' ? 'text-emerald-300 font-bold' : ''}`}
                >
                  00:10 • 3. RENDER 4K FINALE
                </button>
                <span>00:15 [FINE]</span>
              </div>
            </div>

            {/* Playback Controls Row */}
            <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
              <div className="flex items-center gap-3">
                {/* Play/Pause Button */}
                <button
                  onClick={handleTogglePlay}
                  className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-2 transition shadow-[0_0_15px_rgba(6,182,212,0.4)] active:scale-95"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-current" />
                      <span>PAUSA</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>AVVIA VIDEO</span>
                    </>
                  )}
                </button>

                {/* Restart Loop */}
                <button
                  onClick={handleRestart}
                  title="Ricomincia dall'inizio"
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-stone-300 hover:text-white transition active:scale-95"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Timecode display */}
                <div className="px-3 py-1.5 rounded-lg bg-stone-900 border border-white/10 text-white font-bold text-xs tracking-wider">
                  <span>00:{String(Math.floor(currentTime)).padStart(2, '0')}</span>
                  <span className="text-white/40"> / 00:15</span>
                </div>
              </div>

              {/* Stage Direct Buttons */}
              <div className="hidden lg:flex items-center gap-2">
                <span className="text-[11px] text-white/40 mr-1">VAI A:</span>
                <button
                  onClick={() => handleJumpToStage('cad2d')}
                  className={`px-2.5 py-1 rounded text-[11px] border transition ${
                    activeStage === 'cad2d'
                      ? 'bg-white text-slate-950 border-white font-bold'
                      : 'border-white/10 text-stone-400 hover:text-white'
                  }`}
                >
                  1. Pianta CAD B&amp;N
                </button>
                <button
                  onClick={() => handleJumpToStage('bim3d')}
                  className={`px-2.5 py-1 rounded text-[11px] border transition ${
                    activeStage === 'bim3d'
                      ? 'bg-blue-600 text-white border-blue-400 font-bold'
                      : 'border-white/10 text-stone-400 hover:text-white'
                  }`}
                >
                  2. BIM Bianco con Linee
                </button>
                <button
                  onClick={() => handleJumpToStage('render')}
                  className={`px-2.5 py-1 rounded text-[11px] border transition ${
                    activeStage === 'render'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold'
                      : 'border-white/10 text-stone-400 hover:text-white'
                  }`}
                >
                  3. Render 4K Finale
                </button>
              </div>

              {/* Speed Selectors */}
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="text-white/40 mr-1">VELOCITÀ:</span>
                {[0.5, 1, 2].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => handleSpeedChange(spd)}
                    className={`px-2 py-0.5 rounded border transition ${
                      playbackSpeed === spd
                        ? 'bg-cyan-400 text-slate-950 font-bold border-cyan-400'
                        : 'border-white/10 text-stone-400 hover:text-white'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ARCHITECTURAL COHERENCE & TECHNICAL SPECIFICATION CARDS                   */}
        {/* ========================================================================= */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
          {STAGES.map((stage) => {
            const isCurrent = activeStage === stage.id;
            return (
              <div
                key={stage.id}
                onClick={() => handleJumpToStage(stage.id)}
                className={`p-5 rounded-xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-stone-900/95 border-cyan-400 shadow-[0_10px_30px_rgba(6,182,212,0.15)] ring-1 ring-cyan-400/40'
                    : 'bg-stone-950/50 border-white/10 hover:border-white/20 opacity-70 hover:opacity-100'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3 font-mono text-xs">
                    <span className="font-bold text-white tracking-wider flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span>FASE {stage.number}</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-stone-300 truncate max-w-[160px]">
                      {stage.software.split('//')[0]}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white mb-2 font-sans tracking-tight">
                    {stage.name}
                  </h3>

                  <p className="text-stone-300 text-xs leading-relaxed font-sans mb-4">
                    {stage.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 space-y-1.5 font-mono text-[11px] text-stone-300">
                  {stage.bulletSpecs.map((spec, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

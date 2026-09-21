import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  Layers,
  Split,
  Maximize2,
  CheckCircle2,
  ArrowLeftRight,
  Info,
  Sparkles,
  Zap,
} from 'lucide-react';
import { audioSystem } from '../utils/audioSynthesizer';

interface CadBimCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CadBimCompareModal: React.FC<CadBimCompareModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50); // 0 - 100%
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (relativeX / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleMove(e.clientX);
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches[0]) {
        handleMove(e.touches[0].clientX);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMove]);

  if (!isOpen) return null;

  return (
    <div
      id="cad-bim-compare-modal-backdrop"
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md"
    >
      <div
        className="absolute inset-0"
        onClick={() => {
          audioSystem.playClick(500);
          onClose();
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col w-full max-w-5xl h-[90vh] max-h-[820px] rounded-none border border-white/20 bg-stone-950/95 shadow-2xl backdrop-blur-2xl text-stone-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Architectural corner marks */}
        <div className="pointer-events-none absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-amber-400 z-40" />
        <div className="pointer-events-none absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-amber-400 z-40" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-amber-400 z-40" />
        <div className="pointer-events-none absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-amber-400 z-40" />

        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/10 bg-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-none bg-amber-400/10 border border-amber-400/40 text-amber-400 font-bold">
              <Split className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
                  Confronto Split-Screen: CAD 2D vs BIM 3D Parametrico
                </h2>
                <span className="rounded-none bg-sky-400/15 px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider text-sky-400 border border-sky-400/30">
                  DIGITAL TWIN
                </span>
              </div>
              <p className="text-xs text-stone-400 hidden xs:block font-light">
                Trascina il cursore orizzontale per confrontare la tavola DWG 2D con il modello parametrico Revit 5D
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              audioSystem.playClick(500);
              onClose();
            }}
            className="flex h-8 w-8 items-center justify-center rounded-none border border-white/10 bg-white/5 text-stone-400 hover:border-amber-400/50 hover:text-white transition-all"
            title="Chiudi comparatore"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Comparison Viewer Canvas */}
        <div className="relative flex-1 bg-stone-900 select-none overflow-hidden" ref={containerRef}>
          {/* RIGHT SIDE LAYER: BIM 3D REFINED PARAMETRIC VIEW */}
          <div className="absolute inset-0 bg-[#0d131f] flex items-center justify-center overflow-hidden">
            {/* Architectural BIM 3D Graphic Canvas */}
            <svg
              viewBox="0 0 1000 650"
              className="w-full h-full object-contain pointer-events-none p-4"
            >
              {/* Background isometric grid */}
              <defs>
                <linearGradient id="bimRoofGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#047857" stopOpacity="0.9" />
                </linearGradient>
                <linearGradient id="bimWallGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e2e8f0" />
                  <stop offset="100%" stopColor="#94a3b8" />
                </linearGradient>
                <linearGradient id="bimGlassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0.3" />
                </linearGradient>
              </defs>

              {/* 3D Axonometric BIM Model Render */}
              <g transform="translate(180, 40) scale(0.9)">
                {/* Foundation Ground Slab */}
                <polygon points="400,420 750,260 450,140 100,300" fill="#334155" stroke="#475569" strokeWidth="2" />
                <polygon points="100,300 400,420 400,445 100,325" fill="#1e293b" />
                <polygon points="400,420 750,260 750,285 400,445" fill="#0f172a" />

                {/* BIM Structural Columns */}
                {[[130, 290], [250, 340], [370, 390], [250, 240], [450, 160], [600, 220]].map(([px, py], i) => (
                  <g key={i}>
                    <rect x={px} y={py - 160} width="20" height="160" fill="#64748b" stroke="#334155" />
                    <polygon points={`${px},${py - 160} ${px + 12},${py - 170} ${px + 32},${py - 170} ${px + 20},${py - 160}`} fill="#94a3b8" />
                  </g>
                ))}

                {/* BIM Multilayer Walls */}
                <polygon points="120,290 400,410 400,240 120,120" fill="url(#bimWallGrad)" stroke="#64748b" strokeWidth="2" />
                <polygon points="400,410 730,260 730,90 400,240" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />

                {/* Glazed Curtain Wall Facade */}
                <polygon points="150,280 380,380 380,250 150,150" fill="url(#bimGlassGrad)" stroke="#38bdf8" strokeWidth="1.5" />
                {/* Mullions / Montanti Facciata */}
                <line x1="220" y1="230" x2="220" y2="330" stroke="#0284c7" strokeWidth="2" />
                <line x1="300" y1="200" x2="300" y2="300" stroke="#0284c7" strokeWidth="2" />

                {/* Roof Slab with Insulated Layers */}
                <polygon points="400,220 750,60 450,-50 100,100" fill="url(#bimRoofGrad)" stroke="#059669" strokeWidth="3" />
                <polygon points="100,100 400,220 400,238 100,118" fill="#065f46" />
                <polygon points="400,220 750,60 750,78 400,238" fill="#047857" />

                {/* BIM Smart Parameter Callouts */}
                <g transform="translate(420, 180)">
                  <rect x="0" y="0" width="220" height="74" rx="0" fill="#020617" fillOpacity="0.9" stroke="#38bdf8" strokeWidth="1.5" />
                  <text x="12" y="20" fill="#38bdf8" fontSize="11" fontWeight="bold" fontFamily="monospace">IFCWALL_EXT_LOD400</text>
                  <text x="12" y="38" fill="#e2e8f0" fontSize="10" fontFamily="sans-serif">Spessore: 46 cm • U: 0.14 W/m²K</text>
                  <text x="12" y="54" fill="#34d399" fontSize="10" fontFamily="monospace" fontWeight="bold">Computo 5D: € 22.400 (WBS 02)</text>
                </g>
              </g>
            </svg>

            {/* BIM Badge */}
            <div className="absolute top-4 right-4 rounded-none bg-stone-950/90 border border-amber-400/60 px-3 py-2 text-amber-300 backdrop-blur-md font-mono">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span>MODELLO BIM 3D PARAMETRICO (Revit)</span>
              </div>
              <p className="text-[10px] text-stone-400 font-sans mt-0.5">Dati integrati, stratigrafie, computo 5D automatico</p>
            </div>
          </div>

          {/* LEFT SIDE LAYER: 2D CAD DWG VECTOR DRAWING (CLIPPED BY SLIDER) */}
          <div
            className="absolute inset-y-0 left-0 bg-[#161c28] overflow-hidden border-r-2 border-amber-400"
            style={{ width: `${sliderPosition}%` }}
          >
            <div
              className="absolute inset-y-0 left-0 w-full flex items-center justify-center overflow-hidden"
              style={{ width: containerRef.current?.clientWidth || '100%' }}
            >
              {/* CAD 2D Technical Blueprint Vector Graphics */}
              <svg
                viewBox="0 0 1000 650"
                className="w-full h-full object-contain pointer-events-none p-4"
              >
                {/* 2D CAD Blueprint Hatching Patterns */}
                <defs>
                  <pattern id="cadGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#253248" strokeWidth="0.8" />
                  </pattern>
                  <pattern id="wallHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="0" y2="8" stroke="#ef4444" strokeWidth="1" />
                  </pattern>
                </defs>

                <rect width="100%" height="100%" fill="url(#cadGrid)" />

                {/* 2D CAD Plan View Drawing with Dimensions */}
                <g transform="translate(180, 100)">
                  {/* Outer Wall Perimeters 2D */}
                  <rect x="50" y="50" width="560" height="380" fill="none" stroke="#f59e0b" strokeWidth="3" />
                  <rect x="75" y="75" width="510" height="330" fill="none" stroke="#f59e0b" strokeWidth="1.5" />

                  {/* Inner Partitions 2D */}
                  <line x1="260" y1="75" x2="260" y2="405" stroke="#ef4444" strokeWidth="3" />
                  <line x1="280" y1="75" x2="280" y2="405" stroke="#ef4444" strokeWidth="1.5" />

                  <line x1="280" y1="240" x2="585" y2="240" stroke="#ef4444" strokeWidth="3" />
                  <line x1="280" y1="260" x2="585" y2="260" stroke="#ef4444" strokeWidth="1.5" />

                  {/* CAD Doors Arc Swing */}
                  <path d="M 260 140 A 50 50 0 0 1 210 190" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 2" />
                  <line x1="260" y1="140" x2="260" y2="190" stroke="#38bdf8" strokeWidth="2" />

                  <path d="M 400 240 A 50 50 0 0 1 450 190" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 2" />
                  <line x1="400" y1="240" x2="450" y2="240" stroke="#38bdf8" strokeWidth="2" />

                  {/* CAD Quotes / Dimensions */}
                  <g stroke="#38bdf8" strokeWidth="1">
                    <line x1="50" y1="25" x2="610" y2="25" />
                    <line x1="50" y1="15" x2="50" y2="35" />
                    <line x1="610" y1="15" x2="610" y2="35" />
                    <text x="310" y="20" fill="#38bdf8" fontSize="12" textAnchor="middle" fontFamily="monospace">14.00 m (QUOTA ESTERNA)</text>

                    <line x1="25" y1="50" x2="25" y2="430" />
                    <line x1="15" y1="50" x2="35" y2="50" />
                    <line x1="15" y1="430" x2="35" y2="430" />
                    <text x="20" y="245" fill="#38bdf8" fontSize="12" textAnchor="middle" transform="rotate(-90 20 245)" fontFamily="monospace">9.50 m</text>
                  </g>

                  {/* CAD Room Labels */}
                  <text x="140" y="220" fill="#e2e8f0" fontSize="13" fontFamily="monospace">LOCALE 01 (38.2 m²)</text>
                  <text x="420" y="150" fill="#e2e8f0" fontSize="13" fontFamily="monospace">LOCALE 02 (45.0 m²)</text>
                  <text x="420" y="320" fill="#e2e8f0" fontSize="13" fontFamily="monospace">LOCALE 03 (32.8 m²)</text>
                </g>
              </svg>

              {/* CAD Badge */}
              <div className="absolute top-4 left-4 rounded-none bg-stone-950/90 border border-rose-500/60 px-3 py-2 text-rose-300 backdrop-blur-md font-mono">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                  <Layers className="h-4 w-4 text-rose-400" />
                  <span>DISEGNO CAD 2D TRADIZIONALE (.DWG)</span>
                </div>
                <p className="text-[10px] text-stone-400 font-sans mt-0.5">Linee, tratteggi geometrici, nessun computo collegato</p>
              </div>
            </div>
          </div>

          {/* SLIDER DIVIDER DRAG HANDLE */}
          <div
            style={{ left: `${sliderPosition}%` }}
            className="absolute top-0 bottom-0 -ml-4 w-8 flex flex-col items-center justify-center cursor-ew-resize z-30 group"
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
          >
            {/* Center line */}
            <div className="w-0.5 h-full bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.8)]" />

            {/* Squared Drag Handle */}
            <div className="absolute top-1/2 -translate-y-1/2 h-9 w-9 rounded-none bg-amber-400 text-stone-950 font-bold shadow-xl border-2 border-stone-950 flex items-center justify-center transition-transform group-hover:scale-105 active:scale-95">
              <ArrowLeftRight className="h-4 w-4" />
            </div>

            <div className="absolute top-4 -translate-x-1/2 pointer-events-none whitespace-nowrap">
              <span className="px-2 py-0.5 rounded-none bg-stone-950 border border-amber-400 text-[10px] font-mono text-amber-300 uppercase">
                {Math.round(sliderPosition)}% BIM
              </span>
            </div>
          </div>
        </div>

        {/* Comparison Key Takeaways Footer */}
        <div className="px-4 sm:px-6 py-3 bg-stone-950 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="flex items-start gap-2.5">
            <div className="h-6 w-6 rounded-none bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center shrink-0 mt-0.5 font-mono font-bold">
              01
            </div>
            <div>
              <div className="font-bold text-white font-mono uppercase text-[11px]">Sincronizzazione Automatica</div>
              <p className="text-[11px] text-stone-400 font-light mt-0.5">Nel CAD ogni vista va ridisegnata a mano. Nel BIM il modello genera tutto in tempo reale.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="h-6 w-6 rounded-none bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0 mt-0.5 font-mono font-bold">
              02
            </div>
            <div>
              <div className="font-bold text-white font-mono uppercase text-[11px]">Computo 5D Integrato</div>
              <p className="text-[11px] text-stone-400 font-light mt-0.5">Dai muri CAD le aree richiedono formule manuali. In Revit il Quantity Takeoff è istantaneo al 100%.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="h-6 w-6 rounded-none bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5 font-mono font-bold">
              03
            </div>
            <div>
              <div className="font-bold text-white font-mono uppercase text-[11px]">Zero Errori di Cantiere</div>
              <p className="text-[11px] text-stone-400 font-light mt-0.5">La Clash Detection rileva le interferenze tra travi e impianti prima di posare la prima pietra.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

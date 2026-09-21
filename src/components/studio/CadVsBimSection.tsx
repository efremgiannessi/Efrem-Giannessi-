import React, { useState, useRef } from 'react';
import {
  Split,
  ArrowRightLeft,
  Maximize2,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Layers,
} from 'lucide-react';
import { audioSystem } from '../../utils/audioSynthesizer';

interface CadVsBimSectionProps {
  onOpenFullModal: () => void;
}

export const CadVsBimSection: React.FC<CadVsBimSectionProps> = ({
  onOpenFullModal,
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDragging = useRef<boolean>(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateSlider(e.clientX);
    audioSystem.playClick(600);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    updateSlider(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging.current) {
      isDragging.current = false;
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Safe ignore
      }
    }
  };

  const updateSlider = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    const percentage = Math.max(5, Math.min(95, (relativeX / rect.width) * 100));
    setSliderPosition(percentage);
  };

  return (
    <section id="cadvsbim" className="py-20 border-b border-white/10 bg-stone-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-amber-400 mb-2">
              <Split className="h-4 w-4" />
              <span>EVOLUZIONE DIGITALE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold uppercase text-white tracking-tight">
              Confronto Interattivo: CAD 2D vs BIM 5D
            </h2>
            <p className="text-sm sm:text-base text-stone-300 font-light mt-2 max-w-2xl">
              Trascina il cursore per confrontare una tradizionale planimetria bidimensionale a linee con lo stesso nodo costruttivo risolto in modello parametrico 3D con dati di capitolato e computo associati.
            </p>
          </div>

          <button
            onClick={() => {
              audioSystem.playClick(600);
              onOpenFullModal();
            }}
            className="flex items-center gap-2 px-4 py-2.5 border border-amber-400/40 bg-amber-400/10 hover:bg-amber-400 hover:text-stone-950 text-amber-400 font-mono text-xs uppercase tracking-wider font-semibold transition-all shrink-0"
          >
            <Maximize2 className="h-4 w-4" />
            <span>Apri Modale Ingrandita</span>
          </button>
        </div>

        {/* Embedded Interactive Comparison Slider */}
        <div className="border border-white/15 bg-stone-900/40 p-4 sm:p-6 mb-8 relative">
          <div className="pointer-events-none absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-amber-400 z-20" />
          <div className="pointer-events-none absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-amber-400 z-20" />
          <div className="pointer-events-none absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-amber-400 z-20" />
          <div className="pointer-events-none absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-amber-400 z-20" />

          <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="relative w-full aspect-[16/9] max-h-[480px] overflow-hidden select-none cursor-ew-resize border border-white/10"
          >
            {/* Background Layer: 3D BIM Model */}
            <img
              src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1920&q=85"
              alt="Modello Parametrico BIM 3D"
              className="absolute inset-0 h-full w-full object-cover filter brightness-90"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-4 right-4 bg-stone-950/90 border border-emerald-400/60 px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-emerald-400 shadow-lg backdrop-blur-md">
              BIM 5D: Modello Parametrico Integrato
            </div>

            {/* Foreground Layer (Clipped): 2D Vector CAD */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <img
                src="https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1920&q=85"
                alt="Disegno CAD 2D Tradizionale"
                className="absolute inset-0 h-full w-full object-cover filter grayscale contrast-125"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 bg-stone-950/90 border border-rose-500/60 px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-rose-400 shadow-lg backdrop-blur-md">
                CAD 2D: Linee Vettoriali Statiche
              </div>
            </div>

            {/* Divider Line & Square Handle */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.8)] pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center bg-amber-400 text-stone-950 shadow-xl border border-stone-950">
                <ArrowRightLeft className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Slider Subtitle info */}
          <div className="flex items-center justify-between mt-3 font-mono text-[10px] text-stone-400 uppercase tracking-wider px-1">
            <span>← Trascina per CAD 2D</span>
            <span className="text-amber-400 font-bold">{Math.round(sliderPosition)}% SPLIT</span>
            <span>Trascina per BIM 5D →</span>
          </div>
        </div>

        {/* Feature Comparison Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
          {/* CAD 2D Limits */}
          <div className="border border-rose-500/30 bg-stone-950 p-5 space-y-3">
            <div className="flex items-center gap-2 text-rose-400 font-bold uppercase tracking-wider pb-2 border-b border-rose-500/20">
              <AlertTriangle className="h-4 w-4" />
              <span>I Limiti del Flusso CAD 2D Tradizionale</span>
            </div>
            <ul className="space-y-2 text-stone-400">
              <li className="flex items-start gap-2">
                <span className="text-rose-500">✕</span>
                <span>Planimetrie, sezioni e prospetti disconnessi: se cambia una quota, occorre ridisegnare tutto a mano.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500">✕</span>
                <span>Computo metrico calcolato con righello su PDF: margine di errore umano medio del 15-20%.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500">✕</span>
                <span>Interferenze tra travi e tubi scoperte solo in cantiere con maestranze ferme e varianti onerose.</span>
              </li>
            </ul>
          </div>

          {/* BIM 5D Advantages */}
          <div className="border border-emerald-500/30 bg-stone-950 p-5 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider pb-2 border-b border-emerald-500/20">
              <CheckCircle2 className="h-4 w-4" />
              <span>La Garanzia del Metodo BIM 5D Studio Giannessi</span>
            </div>
            <ul className="space-y-2 text-stone-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span>Database unico parametrico: modificando una finestra nel 3D si aggiornano automaticamente tutte le tavole.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span>Quantity Takeoff (QTO) esatto collegato al tariffario: certezza dei costi di costruzione al millesimo.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span>Clash Detection interdisciplinare con standard OpenBIM IFC prima di posare il primo mattone.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

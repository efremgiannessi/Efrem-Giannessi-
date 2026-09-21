import React, { useState, useRef } from 'react';
import {
  Sparkles,
  ArrowRightLeft,
  Maximize2,
  TrendingUp,
  Clock,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { audioSystem } from '../../utils/audioSynthesizer';

interface VirtualStagingSectionProps {
  onOpenFullModal: () => void;
}

export const VirtualStagingSection: React.FC<VirtualStagingSectionProps> = ({
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
    <section id="staging" className="py-20 border-b border-white/10 bg-stone-900/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-amber-400 mb-2">
              <Sparkles className="h-4 w-4" />
              <span>VALORIZZAZIONE IMMOBILIARE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold uppercase text-white tracking-tight">
              Virtual Staging 3D & Fotorealismo
            </h2>
            <p className="text-sm sm:text-base text-stone-300 font-light mt-2 max-w-2xl">
              Dallo stato grezzo al cantiere finito: visualizzazioni tridimensionali fotorealistiche con materiali PBR, studio illuminotecnico naturale ed arredi su misura per accelerare le vendite e chiarire ogni dettaglio prima della posa.
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
            <span>Apri Virtual Staging Completo</span>
          </button>
        </div>

        {/* Embedded Slider Box */}
        <div className="border border-white/15 bg-stone-950 p-4 sm:p-6 mb-8 relative">
          <div className="pointer-events-none absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-amber-400 z-20" />
          <div className="pointer-events-none absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-amber-400 z-20" />
          <div className="pointer-events-none absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-amber-400 z-20" />
          <div className="pointer-events-none absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-amber-400 z-20" />

          <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="relative w-full aspect-[16/9] max-h-[460px] overflow-hidden select-none cursor-ew-resize border border-white/10"
          >
            {/* Background: AFTER (Staged) */}
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=85"
              alt="Virtual Staging 3D Dopo"
              className="absolute inset-0 h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-4 right-4 bg-stone-950/90 border border-amber-400/60 px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-amber-300 shadow-lg backdrop-blur-md">
              DOPO: Virtual Staging 3D Fotorealistico
            </div>

            {/* Foreground: BEFORE (Raw / Grezzo) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <img
                src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1920&q=85"
                alt="Stato Grezzo Prima"
                className="absolute inset-0 h-full w-full object-cover filter grayscale contrast-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 bg-stone-950/90 border border-rose-500/60 px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-rose-300 shadow-lg backdrop-blur-md">
                PRIMA: Stato Grezzo / Cantiere
              </div>
            </div>

            {/* Split Cursor Line */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.8)] pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center bg-amber-400 text-stone-950 shadow-xl border border-stone-950">
                <ArrowRightLeft className="h-4 w-4" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3 font-mono text-[10px] text-stone-400 uppercase tracking-wider px-1">
            <span>← Trascina a sinistra per RENDER COMPLETO</span>
            <span className="text-amber-400 font-bold">{Math.round(sliderPosition)}%</span>
            <span>Trascina a destra per STATO GREZZO →</span>
          </div>
        </div>

        {/* 3 Impact Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
          <div className="border border-white/10 bg-stone-950 p-4">
            <span className="text-[10px] text-amber-400 uppercase tracking-widest block mb-1">ACCELERAZIONE COMMERCIALE</span>
            <span className="text-xl font-bold text-white block">+65% Vendite su Carta</span>
            <p className="text-stone-400 font-sans mt-1 text-xs">
              Gli acquirenti comprendono immediatamente i volumi, la luce naturale e il potenziale degli spazi.
            </p>
          </div>

          <div className="border border-white/10 bg-stone-950 p-4">
            <span className="text-[10px] text-amber-400 uppercase tracking-widest block mb-1">ZERO VARIANTI D'ARREDO</span>
            <span className="text-xl font-bold text-white block">Quote Esatte al mm</span>
            <p className="text-stone-400 font-sans mt-1 text-xs">
              Ogni mobile modellato rispetta le aperture, le prese impiantistiche e le tolleranze di cantiere.
            </p>
          </div>

          <div className="border border-white/10 bg-stone-950 p-4">
            <span className="text-[10px] text-amber-400 uppercase tracking-widest block mb-1">INTERATTIVITÀ TOTALE</span>
            <span className="text-xl font-bold text-white block">360° & VR Ready</span>
            <p className="text-stone-400 font-sans mt-1 text-xs">
              Esplorazione sferica navigabile da smartphone, tablet o visore immersivo prima della realizzazione.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

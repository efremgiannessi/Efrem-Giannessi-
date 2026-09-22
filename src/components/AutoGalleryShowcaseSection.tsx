import React, { useState, useEffect } from 'react';
import { GalleryMediaItem } from '../data/galleriaAutoShowcase';
import { useLiveGalleries } from '../hooks/useLiveGalleries';
import { Layers, Camera, Play, Sparkles, RefreshCw } from 'lucide-react';

interface AutoGalleryCardProps {
  title: string;
  subtitle: string;
  categoryBadge: string;
  accentColor: 'cyan' | 'amber';
  items: GalleryMediaItem[];
  intervalMs?: number;
  idPrefix: string;
}

const AutoGalleryCard: React.FC<AutoGalleryCardProps> = ({
  title,
  subtitle,
  categoryBadge,
  accentColor,
  items,
  intervalMs = 3000,
  idPrefix,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const total = items.length;

  // Safe index within bounds
  const safeIndex = total > 0 ? currentIndex % total : 0;

  // Colors based on accent
  const borderAccent = accentColor === 'cyan' ? 'border-cyan-500/30 hover:border-cyan-400/50' : 'border-amber-500/30 hover:border-amber-400/50';
  const textAccent = accentColor === 'cyan' ? 'text-cyan-400' : 'text-amber-400';
  const badgeBg = accentColor === 'cyan' ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300' : 'bg-amber-500/10 border-amber-500/40 text-amber-300';
  const barBg = accentColor === 'cyan' ? 'bg-cyan-400' : 'bg-amber-400';
  const glowShadow = accentColor === 'cyan' ? 'shadow-[0_0_30px_rgba(6,182,212,0.12)]' : 'shadow-[0_0_30px_rgba(245,158,11,0.12)]';

  // Automatic slide interval with smooth progress bar
  useEffect(() => {
    if (total === 0) return;

    const stepMs = 50;
    const increment = (stepMs / intervalMs) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((idx) => (idx + 1) % total);
          return 0;
        }
        return prev + increment;
      });
    }, stepMs);

    return () => clearInterval(timer);
  }, [total, intervalMs]);

  // Preload adjacent images
  useEffect(() => {
    if (total === 0) return;
    const nextIdx = (safeIndex + 1) % total;
    const nextNextIdx = (safeIndex + 2) % total;
    if (items[nextIdx]?.src) {
      const img1 = new Image();
      img1.src = items[nextIdx].src;
    }
    if (items[nextNextIdx]?.src) {
      const img2 = new Image();
      img2.src = items[nextNextIdx].src;
    }
  }, [safeIndex, items, total]);

  const currentItem = items[safeIndex];

  return (
    <div
      id={`${idPrefix}-card`}
      className={`relative flex flex-col bg-stone-950/70 backdrop-blur-md border ${borderAccent} ${glowShadow} rounded-none transition-all duration-500 overflow-hidden select-none cursor-default shadow-[0_15px_40px_rgba(0,0,0,0.6)]`}
    >
      {/* Top Header Information */}
      <div className="flex items-center justify-between px-5 py-4 bg-stone-950/80 border-b border-white/10 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className={`p-1.5 border ${badgeBg}`}>
            {accentColor === 'cyan' ? (
              <Layers className="w-4 h-4 text-cyan-400" />
            ) : (
              <Camera className="w-4 h-4 text-amber-400" />
            )}
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide uppercase font-mono flex items-center gap-2">
              {title}
            </h3>
            <p className="text-[11px] text-white/50 font-mono tracking-wider">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Status indicator & live dynamic counter */}
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${barBg}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${barBg}`}></span>
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-white/70">
              AUTO-LOOP
            </span>
          </div>
          <div className="font-mono text-xs text-white font-bold tracking-widest">
            <span className={textAccent}>
              {String(safeIndex + 1).padStart(2, '0')}
            </span>
            <span className="text-white/30"> / {total}</span>
          </div>
        </div>
      </div>

      {/* Main Auto-Scrolling Viewport (NOT clickable, strictly presentation) */}
      <div className="relative aspect-[16/10] w-full bg-black overflow-hidden pointer-events-none">
        {/* Render stacked active and next for ultra-smooth crossfade */}
        {items.map((item, idx) => {
          // Render only within a sliding window of +/- 1 to optimize DOM and memory
          const isCurrent = idx === safeIndex;
          const isPrev = idx === (safeIndex - 1 + total) % total;
          if (!isCurrent && !isPrev) return null;

          return (
            <img
              key={item.id}
              src={item.src}
              alt={`${title} - ${item.name}`}
              referrerPolicy="no-referrer"
              loading={idx === 0 ? 'eager' : 'lazy'}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                isCurrent ? 'opacity-100 scale-100' : 'opacity-0 scale-102'
              }`}
            />
          );
        })}

        {/* Subtle cinematic gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-transparent to-black/30 pointer-events-none" />

        {/* Badge in image overlay */}
        <div className="absolute top-3 left-3 pointer-events-none">
          <span className={`px-2.5 py-1 text-[10px] font-mono font-bold tracking-widest uppercase border backdrop-blur-md ${badgeBg}`}>
            {categoryBadge}
          </span>
        </div>

        {/* Current Asset Info in overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white/90 pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-black/70 backdrop-blur-sm border border-white/10 font-mono text-[11px] text-white/90">
              {currentItem?.name || 'Archivio'}
            </span>
            <span className="text-[10px] font-mono text-white/50 hidden sm:inline-block">
              // SCORRIMENTO ATTIVO
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-black/70 backdrop-blur-sm border border-white/10 text-[10px] font-mono text-white/60">
            <Play className={`w-2.5 h-2.5 fill-current ${textAccent}`} />
            <span>CONTINUO</span>
          </div>
        </div>
      </div>

      {/* Dynamic Slide Progress Bar */}
      <div className="w-full h-1 bg-stone-900 overflow-hidden">
        <div
          className={`h-full transition-all duration-75 ease-linear ${barBg}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Infinite Auto-Scrolling Thumbnails Strip underneath */}
      <div className="relative py-2.5 px-3 bg-stone-900/60 border-t border-white/10 overflow-hidden pointer-events-none">
        <div className="flex items-center gap-2 w-max animate-marquee">
          {/* Loop over thumbnails twice for seamless marquee */}
          {[...items.slice(0, 16), ...items.slice(0, 16)].map((item, i) => {
            const isSelected = i % 16 === safeIndex % 16;
            return (
              <div
                key={`${item.id}-strip-${i}`}
                className={`relative h-10 w-16 flex-shrink-0 overflow-hidden border transition-all duration-300 ${
                  isSelected
                    ? accentColor === 'cyan'
                      ? 'border-cyan-400 ring-1 ring-cyan-400/50 opacity-100 scale-105 z-10'
                      : 'border-amber-400 ring-1 ring-amber-400/50 opacity-100 scale-105 z-10'
                    : 'border-white/10 opacity-35'
                }`}
              >
                <img
                  src={item.thumbSrc}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Details with live count */}
      <div className="flex items-center justify-between px-5 py-3 bg-stone-950 border-t border-white/10 font-mono text-[11px] text-white/40">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-white/30" />
          {total} Immagini in rotazione continua
        </span>
        <span className="tracking-widest uppercase">
          ARCHIVIO PROTETTO
        </span>
      </div>
    </div>
  );
};

export const AutoGalleryShowcaseSection: React.FC = () => {
  const { rendering, fotografia, renderingCount, photoCount, isLive, isSyncing } = useLiveGalleries();

  return (
    <section
      id="galleria-showcase"
      className="py-24 px-6 md:px-16 select-none relative z-10 border-t border-white/10 text-white overflow-hidden bg-transparent"
    >
      {/* Background Subtle Tech Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370f_1px,transparent_1px),linear-gradient(to_bottom,#1f29370f_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-white/15 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 mb-3 text-xs font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 uppercase tracking-widest">
              <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400 animate-pulse'}`} />
              ARCHIVIO AUTOMATICO // {renderingCount + photoCount} SCATTI {isLive ? '(SYNC ATTIVO)' : ''}
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight uppercase text-white font-mono">
              GALLERIA <span className="text-cyan-400">RENDERING</span> &amp; <span className="text-amber-400">FOTOGRAFIA</span>
            </h2>
          </div>

          <div className="flex flex-col md:items-end gap-1 font-mono text-xs text-white/50 max-w-md md:text-right">
            <span>
              Scorrimento automatico e continuo ad alta definizione delle collezioni complete di rendering fotorealistici e scatti fotografici sincronizzati in tempo reale con le cartelle Google Drive.
            </span>
            {isSyncing && (
              <span className="flex items-center gap-1 text-[11px] text-cyan-400 mt-1">
                <RefreshCw className="w-3 h-3 animate-spin" /> Controllo aggiornamenti Drive in corso...
              </span>
            )}
          </div>
        </div>

        {/* Exactly Two Showcase Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Card 1: Galleria Rendering */}
          <AutoGalleryCard
            idPrefix="rendering-auto-gallery"
            title="Galleria Rendering"
            subtitle="Modellazione 3D & ArchViz Fotorealistico"
            categoryBadge="RENDERING 3D"
            accentColor="cyan"
            items={rendering}
            intervalMs={2800}
          />

          {/* Card 2: Galleria Fotografia */}
          <AutoGalleryCard
            idPrefix="photo-auto-gallery"
            title="Galleria Fotografia"
            subtitle="Fotografia Architettonica & Dettagli di Cantiere"
            categoryBadge="FOTOGRAFIA"
            accentColor="amber"
            items={fotografia}
            intervalMs={3200}
          />
        </div>

        {/* Minimalist Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-stone-950/80 border border-white/10 font-mono text-center">
          <div>
            <span className="block text-[10px] uppercase text-white/40 tracking-wider">Rendering</span>
            <span className="text-lg font-bold text-cyan-400">{renderingCount} immagini</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase text-white/40 tracking-wider">Fotografie</span>
            <span className="text-lg font-bold text-amber-400">{photoCount} scatti</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase text-white/40 tracking-wider">Sincronizzazione</span>
            <span className="text-lg font-bold text-emerald-400 flex items-center justify-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Tempo Reale
            </span>
          </div>
          <div>
            <span className="block text-[10px] uppercase text-white/40 tracking-wider">Visualizzazione</span>
            <span className="text-lg font-bold text-white">Auto-Play Continuo</span>
          </div>
        </div>
      </div>
    </section>
  );
};

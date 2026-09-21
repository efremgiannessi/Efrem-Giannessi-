import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  Layers,
  Split,
  Building2,
  Sparkles,
  Maximize2,
  Cpu,
  CheckCircle2,
} from 'lucide-react';
import { ARCHITECTURAL_PROJECTS, ArchitecturalProject } from '../../data/projectsData';
import { audioSystem } from '../../utils/audioSynthesizer';

interface ActiveTheoryFlowCarouselProps {
  onSelectProject: (projectId: string) => void;
  onOpenBimViewer: () => void;
  onOpenCadCompare: () => void;
  onOpenVirtualStaging: () => void;
  onIndexChange?: (index: number) => void;
}

export const ActiveTheoryFlowCarousel: React.FC<ActiveTheoryFlowCarouselProps> = ({
  onSelectProject,
  onOpenBimViewer,
  onOpenCadCompare,
  onOpenVirtualStaging,
  onIndexChange,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStartX, setDragStartX] = useState<number>(0);
  const [tilt, setTilt] = useState<{ rx: number; ry: number }>({ rx: 0, ry: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  const total = ARCHITECTURAL_PROJECTS.length;
  const project = ARCHITECTURAL_PROJECTS[currentIndex];

  const goTo = useCallback(
    (index: number) => {
      if (index === currentIndex) return;
      audioSystem.playCardSlide();
      const nextIdx = (index + total) % total;
      setCurrentIndex(nextIdx);
      if (onIndexChange) onIndexChange(nextIdx + 1);
    },
    [currentIndex, total, onIndexChange]
  );

  const goNext = useCallback(() => goTo(currentIndex + 1), [goTo, currentIndex]);
  const goPrev = useCallback(() => goTo(currentIndex - 1), [goTo, currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [goNext, goPrev]);

  // 3D Perspective Tilt on Mouse Movement
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    const ry = ((x - cx) / cx) * 8; // Max 8 deg rotateY
    const rx = -((y - cy) / cy) * 6; // Max 6 deg rotateX
    setTilt({ rx, ry });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0 });
  };

  // Touch / Drag Dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    const diff = e.clientX - dragStartX;
    if (diff < -50) goNext();
    else if (diff > 50) goPrev();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setDragStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = e.changedTouches[0].clientX - dragStartX;
    if (diff < -50) goNext();
    else if (diff > 50) goPrev();
  };

  return (
    <div
      ref={containerRef}
      id="active-theory-flow-stage"
      className="relative w-full min-h-[750px] lg:min-h-[820px] flex flex-col justify-between py-8 px-4 sm:px-8 select-none overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      data-cursor="drag"
      data-cursor-label="DRAG"
    >
      {/* 1. Top HUD Stage Header */}
      <div className="flex items-center justify-between z-20 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest font-semibold">
            ACTIVE THEORY // SHOWCASE STAGE
          </span>
          <span className="text-white/20">•</span>
          <span className="font-mono text-xs text-white/50 uppercase tracking-wider hidden sm:inline">
            FLOW INTERACTION MODE
          </span>
        </div>

        {/* Index Selector Pills [ 01 ] [ 02 ] ... */}
        <div className="flex items-center gap-1">
          {ARCHITECTURAL_PROJECTS.map((p, idx) => (
            <button
              key={p.id}
              onClick={(e) => {
                e.stopPropagation();
                goTo(idx);
              }}
              onMouseEnter={() => audioSystem.playTechHover()}
              className={`font-mono text-xs px-2.5 py-1 transition-all border ${
                idx === currentIndex
                  ? 'border-cyan-400 bg-cyan-950/60 text-cyan-300 font-bold shadow-[0_0_10px_rgba(0,240,255,0.25)]'
                  : 'border-white/10 bg-black/40 text-white/40 hover:border-white/30 hover:text-white'
              }`}
            >
              [{String(idx + 1).padStart(2, '0')}]
            </button>
          ))}
        </div>
      </div>

      {/* 2. Main 3D Card Stage */}
      <div
        className="relative my-auto w-full max-w-6xl mx-auto transition-transform duration-300 ease-out py-6"
        style={{
          perspective: '1200px',
        }}
      >
        <div
          className="relative bg-stone-950/80 border border-white/15 backdrop-blur-xl overflow-hidden shadow-2xl transition-transform duration-200 ease-out"
          style={{
            transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Subtle Scanlines Texture */}
          <div
            className="absolute inset-0 pointer-events-none z-10 opacity-20"
            style={{
              backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.5) 50%)',
              backgroundSize: '100% 4px',
            }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
            {/* Left Col: High-Res Project Cover Image with Active Theory Shader Vignette */}
            <div className="lg:col-span-7 relative h-[360px] lg:h-auto overflow-hidden group">
              <img
                src={project.coverImage}
                alt={project.title}
                className="w-full h-full object-cover grayscale-[25%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                loading="eager"
              />

              {/* Dark Gradient Bleed */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-stone-950" />

              {/* Top Image Badge */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                <span className="px-2.5 py-1 bg-black/80 border border-cyan-400/40 text-cyan-300 font-mono text-[10px] uppercase tracking-widest backdrop-blur-md">
                  {project.lod}
                </span>
                <span className="px-2.5 py-1 bg-black/80 border border-amber-400/40 text-amber-300 font-mono text-[10px] uppercase tracking-widest backdrop-blur-md">
                  {project.categoryLabel}
                </span>
              </div>

              {/* Bottom Quick-Action Image Trigger */}
              <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    audioSystem.playClick(600);
                    onSelectProject(project.id);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-black/90 border border-white/20 text-white hover:border-cyan-400 hover:text-cyan-300 font-mono text-xs uppercase tracking-wider transition-all backdrop-blur-md"
                >
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Dossier Completo</span>
                </button>
              </div>
            </div>

            {/* Right Col: Active Theory Typography & Engineering Metadata */}
            <div className="lg:col-span-5 p-6 lg:p-8 flex flex-col justify-between relative z-20 bg-stone-950/70">
              {/* Top Tech Readout */}
              <div>
                <div className="flex items-center justify-between text-white/40 font-mono text-[10px] uppercase tracking-widest mb-3">
                  <span>LOC: {project.location}</span>
                  <span className="text-cyan-400 font-bold">ANNO {project.year}</span>
                </div>

                {/* Monumental Headline */}
                <h3 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold uppercase text-white tracking-tight leading-none mb-3">
                  {project.title}
                </h3>

                <p className="text-cyan-400/90 font-mono text-xs uppercase tracking-wider mb-4 font-medium">
                  {project.subtitle}
                </p>

                <p className="text-stone-300 font-light text-sm leading-relaxed mb-6 line-clamp-3">
                  {project.summary}
                </p>

                {/* Technical Specifications Matrix */}
                <div className="grid grid-cols-2 gap-3 py-4 border-y border-white/10 font-mono text-xs mb-6">
                  <div>
                    <span className="text-white/40 uppercase block text-[10px]">Superficie Lorda</span>
                    <span className="text-white font-bold text-sm">{project.areaM2} m²</span>
                  </div>
                  <div>
                    <span className="text-white/40 uppercase block text-[10px]">Valore di Commessa</span>
                    <span className="text-amber-400 font-bold text-sm">{project.estimatedValueEur}</span>
                  </div>
                  <div>
                    <span className="text-white/40 uppercase block text-[10px]">Elementi IFC Parametrici</span>
                    <span className="text-cyan-300 font-semibold">{project.bimData.elementsCount.toLocaleString('it-IT')}</span>
                  </div>
                  <div>
                    <span className="text-white/40 uppercase block text-[10px]">Scostamento Computo 5D</span>
                    <span className="text-emerald-400 font-semibold">{project.bimData.qtoAccuracy}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Hub */}
              <div className="flex flex-col gap-2 pt-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    id="carousel-open-case-study"
                    onClick={(e) => {
                      e.stopPropagation();
                      audioSystem.playClick(600);
                      onSelectProject(project.id);
                    }}
                    onMouseEnter={() => audioSystem.playTechHover()}
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-cyan-400 text-stone-950 font-mono text-xs font-bold uppercase tracking-wider hover:bg-cyan-300 transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Case Study</span>
                  </button>

                  <button
                    id="carousel-open-bim-viewer"
                    onClick={(e) => {
                      e.stopPropagation();
                      audioSystem.playClick(700);
                      onOpenBimViewer();
                    }}
                    onMouseEnter={() => audioSystem.playTechHover()}
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-stone-900 border border-white/20 text-white hover:border-cyan-400 hover:text-cyan-300 font-mono text-xs uppercase tracking-wider transition-all"
                  >
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Modello 3D</span>
                  </button>
                </div>

                {project.hasCadCompare && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      audioSystem.playClick(500);
                      onOpenCadCompare();
                    }}
                    onMouseEnter={() => audioSystem.playTechHover()}
                    className="flex items-center justify-center gap-2 py-2 px-3 bg-stone-950 border border-white/10 text-stone-300 hover:border-amber-400 hover:text-amber-400 font-mono text-[11px] uppercase tracking-wider transition-all"
                  >
                    <Split className="w-3 h-3 text-amber-400" />
                    <span>Confronto CAD 2D vs BIM 5D</span>
                  </button>
                )}

                {project.hasVirtualStaging && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      audioSystem.playClick(500);
                      onOpenVirtualStaging();
                    }}
                    onMouseEnter={() => audioSystem.playTechHover()}
                    className="flex items-center justify-center gap-2 py-2 px-3 bg-stone-950 border border-white/10 text-stone-300 hover:border-violet-400 hover:text-violet-300 font-mono text-[11px] uppercase tracking-wider transition-all"
                  >
                    <Sparkles className="w-3 h-3 text-violet-400" />
                    <span>Staging Fotorealistico 3D</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Controls & Navigation Arrows */}
      <div className="flex items-center justify-between z-20 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2 text-white/50 font-mono text-xs">
          <span>PROJECT</span>
          <span className="text-white font-bold text-sm">
            {String(currentIndex + 1).padStart(2, '0')}
          </span>
          <span>/</span>
          <span>{String(total).padStart(2, '0')}</span>
        </div>

        {/* Big Navigation Arrows */}
        <div className="flex items-center gap-2">
          <button
            id="flow-carousel-prev-btn"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            onMouseEnter={() => audioSystem.playTechHover()}
            className="flex items-center justify-center w-12 h-12 bg-black/70 border border-white/20 text-white hover:border-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30 transition-all backdrop-blur-md"
            aria-label="Progetto Precedente"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <button
            id="flow-carousel-next-btn"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            onMouseEnter={() => audioSystem.playTechHover()}
            className="flex items-center justify-center w-12 h-12 bg-black/70 border border-white/20 text-white hover:border-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30 transition-all backdrop-blur-md"
            aria-label="Progetto Successivo"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Layers,
  Calculator,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Compass,
  CheckCircle2,
  FileCode2,
  Eye,
  Building2,
  Maximize2,
  Cpu,
} from 'lucide-react';
import { ARCHITECTURAL_PROJECTS } from '../../data/projectsData';
import { audioSystem } from '../../utils/audioSynthesizer';

interface HeroSectionProps {
  onOpenBimViewer: () => void;
  onOpenEstimatorModal: () => void;
  onOpenAuditModal: () => void;
  onOpen360Tour: () => void;
  onSelectProject: (projectId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenBimViewer,
  onOpenEstimatorModal,
  onOpenAuditModal,
  onOpen360Tour,
  onSelectProject,
}) => {
  const [activeHeroIndex, setActiveHeroIndex] = useState<number>(0);
  const heroProjects = ARCHITECTURAL_PROJECTS.slice(0, 4);
  const currentProject = heroProjects[activeHeroIndex];

  return (
    <section
      id="hero-section"
      className="relative pt-24 sm:pt-32 pb-16 sm:pb-24 border-b border-white/10 bg-black/80 overflow-hidden"
    >
      {/* Active Theory Atmospheric Lighting Accents */}
      <div className="pointer-events-none absolute -top-40 right-1/4 w-[600px] h-[600px] bg-cyan-500/10 blur-[150px] rounded-full" />
      <div className="pointer-events-none absolute bottom-0 left-10 w-[500px] h-[500px] bg-purple-600/10 blur-[160px] rounded-full" />
      <div className="pointer-events-none absolute top-1/2 right-10 w-[400px] h-[400px] bg-amber-500/5 blur-[120px] rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Active Theory Telemetry Eyebrow */}
        <div className="flex flex-wrap items-center gap-2 mb-8 font-mono text-xs">
          <div className="flex items-center gap-2 px-3 py-1 bg-cyan-950/40 border border-cyan-400/50 text-cyan-300 font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(0,240,255,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>ACTIVE THEORY // ARCHITECTURE ENGINE</span>
          </div>
          <span className="text-white/30 hidden sm:inline">/</span>
          <span className="text-white/60 uppercase tracking-wider hidden sm:inline">
            EFREM GIANNESSI ARCHITETTO & BIM MANAGER
          </span>
          <span className="text-white/30 hidden md:inline">/</span>
          <span className="text-amber-400/90 font-semibold tracking-wider uppercase hidden md:inline">
            ISO 19650 & UNI 11337 COMPLIANT
          </span>
        </div>

        {/* Monumental Active Theory Headline Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          {/* Left Column: Monumental Typographic Manifest */}
          <div className="lg:col-span-7">
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black uppercase text-white tracking-tight leading-[0.92] mb-6">
              Architettura <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-cyan-400">
                Parametrica
              </span> <br />
              & Ingegneria BIM 5D
            </h1>

            <p className="text-stone-300 text-base sm:text-lg font-light leading-relaxed max-w-2xl mb-8">
              Studio professionale di <strong className="text-white font-semibold">Efrem Giannessi</strong>. Progettazione integrata ad altissima precisione, automazione algoritmica con Autodesk Revit (Python & C# SDK), estrazione istantanea di computi metrici WBS a zero varianti e rendering fotorealistico immersivo a 360°.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#work"
                onClick={() => audioSystem.playClick(600)}
                onMouseEnter={() => audioSystem.playTechHover()}
                className="flex items-center gap-2 px-6 py-3.5 bg-cyan-400 hover:bg-cyan-300 text-stone-950 font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,240,255,0.35)]"
              >
                <span>Esplora le Opere [ 06 ]</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                id="hero-open-360-btn"
                onClick={() => {
                  audioSystem.playClick(600);
                  onOpen360Tour();
                }}
                onMouseEnter={() => audioSystem.playTechHover()}
                className="flex items-center gap-2 px-6 py-3.5 bg-stone-900 border border-cyan-400/40 text-cyan-300 hover:border-cyan-400 hover:bg-cyan-950/50 font-mono text-xs uppercase tracking-wider transition-all backdrop-blur-md"
              >
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>Tour Studio 360°</span>
              </button>

              <button
                id="hero-open-bim-btn"
                onClick={() => {
                  audioSystem.playClick(700);
                  onOpenBimViewer();
                }}
                onMouseEnter={() => audioSystem.playTechHover()}
                className="flex items-center gap-2 px-5 py-3.5 bg-stone-950 border border-white/15 text-white/80 hover:border-white/40 hover:text-white font-mono text-xs uppercase tracking-wider transition-all"
              >
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Ispettore 3D</span>
              </button>
            </div>
          </div>

          {/* Right Column: Active Theory Interactive Project Telemetry Card */}
          <div className="lg:col-span-5">
            <div className="relative bg-stone-950/80 border border-white/15 backdrop-blur-xl p-5 shadow-2xl overflow-hidden group">
              {/* Top Card Telemetry Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10 font-mono text-xs mb-4">
                <div className="flex items-center gap-2 text-cyan-400 font-semibold">
                  <span className="w-2 h-2 bg-cyan-400" />
                  <span>OPERA SPOTLIGHT</span>
                </div>
                <div className="text-white/40 text-[10px]">
                  [ 0{activeHeroIndex + 1} / 0{heroProjects.length} ]
                </div>
              </div>

              {/* Main Media with Zoom */}
              <div
                className="relative h-60 w-full overflow-hidden border border-white/10 mb-4 cursor-pointer"
                onClick={() => {
                  audioSystem.playClick(600);
                  onSelectProject(currentProject.id);
                }}
              >
                <img
                  src={currentProject.coverImage}
                  alt={currentProject.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-70" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2 py-0.5 bg-black/80 font-mono text-[9px] text-cyan-300 border border-cyan-400/40 uppercase">
                    {currentProject.lod}
                  </span>
                  <span className="px-2 py-0.5 bg-black/80 font-mono text-[9px] text-amber-300 border border-amber-400/40 uppercase">
                    {currentProject.categoryLabel}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between font-mono text-xs text-white">
                  <span className="font-sans font-bold text-base uppercase">{currentProject.title}</span>
                  <span className="text-cyan-400">{currentProject.year}</span>
                </div>
              </div>

              {/* Mini Selector Ribbon for Quick Switching */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {heroProjects.map((proj, idx) => (
                  <button
                    key={proj.id}
                    onClick={() => {
                      audioSystem.playCardSlide();
                      setActiveHeroIndex(idx);
                    }}
                    onMouseEnter={() => audioSystem.playTechHover()}
                    className={`relative h-12 overflow-hidden border transition-all ${
                      idx === activeHeroIndex
                        ? 'border-cyan-400 ring-1 ring-cyan-400'
                        : 'border-white/10 opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img src={proj.coverImage} alt={proj.title} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Card Footer Quick Link */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10 font-mono text-xs">
                <span className="text-white/40">SCALABILITÀ QTO: {currentProject.bimData.qtoAccuracy}</span>
                <button
                  onClick={() => {
                    audioSystem.playClick(600);
                    onSelectProject(currentProject.id);
                  }}
                  className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 uppercase tracking-wider font-semibold"
                >
                  <span>Dossier</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars Active Theory Technical Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-stone-950/60 border border-white/10 hover:border-cyan-400/60 transition-all duration-300">
            <div className="font-mono text-xs text-cyan-400 mb-2">[ 01 / STANDARD ]</div>
            <h3 className="font-sans font-bold text-white text-base uppercase mb-1">
              Modellazione LOD 400-500
            </h3>
            <p className="text-stone-400 text-xs font-light leading-relaxed">
              Geometrie costruttive esecutive, stratigrafie nodali, certificazione di conformità norma UNI 11337 e capitolati ISO 19650.
            </p>
          </div>

          <div className="p-5 bg-stone-950/60 border border-white/10 hover:border-amber-400/60 transition-all duration-300">
            <div className="font-mono text-xs text-amber-400 mb-2">[ 02 / COMPUTO 5D ]</div>
            <h3 className="font-sans font-bold text-white text-base uppercase mb-1">
              Zero Varianti di Costo
            </h3>
            <p className="text-stone-400 text-xs font-light leading-relaxed">
              Quantity Takeoff dinamico: ogni metro cubo di calcestruzzo e superficie di involucro è associato direttamente ai prezzari regionali.
            </p>
          </div>

          <div className="p-5 bg-stone-950/60 border border-white/10 hover:border-cyan-400/60 transition-all duration-300">
            <div className="font-mono text-xs text-cyan-400 mb-2">[ 03 / AUTOMAZIONE ]</div>
            <h3 className="font-sans font-bold text-white text-base uppercase mb-1">
              pyRevit & C# Revit SDK
            </h3>
            <p className="text-stone-400 text-xs font-light leading-relaxed">
              Sviluppo custom di plugin per il Ribbon di Revit, script di clash detection istantanea ed estrazione massiva dei parametri IFC.
            </p>
          </div>

          <div className="p-5 bg-stone-950/60 border border-white/10 hover:border-purple-400/60 transition-all duration-300">
            <div className="font-mono text-xs text-purple-400 mb-2">[ 04 / INTERATTIVITÀ ]</div>
            <h3 className="font-sans font-bold text-white text-base uppercase mb-1">
              Esperienza Immersiva 360°
            </h3>
            <p className="text-stone-400 text-xs font-light leading-relaxed">
              Piattaforma virtuale per il sopralluogo in tempo reale dello studio, audit guidati, sincronizzazione meteo e rendering fotorealistico.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

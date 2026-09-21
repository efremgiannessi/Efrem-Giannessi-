import React from 'react';
import { ArrowDownRight, Layers, Terminal, Sparkles, Camera, Code2 } from 'lucide-react';
import { audioSystem } from '../utils/audioSynthesizer';

interface ActiveTheoryHeroProps {
  onExploreProjects: () => void;
  onOpenRevitModal: () => void;
  onOpenAuditModal: () => void;
  onScrollToRendering?: () => void;
  onScrollToPyRevit?: () => void;
}

export const ActiveTheoryHero: React.FC<ActiveTheoryHeroProps> = ({
  onExploreProjects,
  onOpenRevitModal,
  onOpenAuditModal,
  onScrollToRendering,
  onScrollToPyRevit,
}) => {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-between pt-32 pb-16 px-6 md:px-16 select-none"
    >
      {/* Precision Corner Marks */}
      <div className="absolute top-28 left-6 w-3 h-3 border-t-2 border-l-2 border-cyan-400/60 pointer-events-none" />
      <div className="absolute top-28 right-6 w-3 h-3 border-t-2 border-r-2 border-cyan-400/60 pointer-events-none" />

      {/* Header Telemetry line */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 font-mono text-xs text-white/50">
        <div className="flex items-center gap-3">
          <span className="text-cyan-400 font-bold uppercase tracking-widest">
            [ AT // ARCHITECTURAL KINETIC ENGINE ]
          </span>
          <span className="text-white/20">/</span>
          <span>LAT 43.9575° N, LON 10.2312° E</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-white/40">
          <span>PRECISIONE COMPUTO: 99.8%</span>
          <span>•</span>
          <span>STANDARD: UNI 11337 / ISO 19650</span>
        </div>
      </div>

      {/* Main Monumental Typography */}
      <div className="my-auto py-12 max-w-6xl">
        <div className="font-mono text-xs text-cyan-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>EFREM GIANNESSI // BIM 5D & COMPUTATIONAL DESIGN</span>
        </div>

        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white uppercase leading-[0.95] mb-6">
          SPAZI REALI.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-stone-400">
            CONTROLLO 5D.
          </span>
        </h1>

        <p className="max-w-2xl text-stone-300 text-base md:text-lg leading-relaxed font-sans font-light mb-8">
          Modellazione BIM avanzata con Revit per edilizia residenziale, commerciale e industriale,
          redazione di computi metrici estimativi per prefabbricati e infrastrutture complesse,
          contrattualistica, coordinamento di team e gestione acquisti.
        </p>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-4 font-mono text-xs uppercase tracking-wider">
          <button
            onClick={() => {
              audioSystem.playClick(600);
              onExploreProjects();
            }}
            className="flex items-center gap-2.5 px-6 py-3.5 bg-cyan-400 hover:bg-cyan-300 text-stone-950 font-bold transition-all shadow-[0_0_20px_rgba(0,240,255,0.35)] group"
          >
            <Layers className="w-4 h-4" />
            <span>PROFILO PROFESSIONALE</span>
            <ArrowDownRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
          </button>

          <button
            onClick={() => {
              audioSystem.playClick(650);
              onOpenRevitModal();
            }}
            className="flex items-center gap-2 px-5 py-3.5 border border-white/20 hover:border-cyan-400 text-white hover:text-cyan-300 transition-all"
          >
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>COMPETENZE TECNICHE</span>
          </button>

          <button
            onClick={() => {
              audioSystem.playClick(700);
              if (onScrollToRendering) onScrollToRendering();
            }}
            className="flex items-center gap-2 px-5 py-3.5 border border-white/20 hover:border-cyan-400 text-white hover:text-cyan-300 transition-all"
          >
            <Camera className="w-4 h-4 text-cyan-400" />
            <span>REALIZZAZIONE RENDERING</span>
          </button>

          <button
            onClick={() => {
              audioSystem.playClick(750);
              if (onScrollToPyRevit) onScrollToPyRevit();
            }}
            className="flex items-center gap-2 px-5 py-3.5 border border-purple-400/60 bg-purple-950/30 hover:bg-purple-900/50 text-purple-200 transition-all font-mono shadow-[0_0_15px_rgba(168,85,247,0.25)]"
          >
            <Code2 className="w-4 h-4 text-purple-400" />
            <span>pyREVIT & PYTHON</span>
          </button>

          <button
            onClick={() => {
              audioSystem.playClick(800);
              onOpenAuditModal();
            }}
            className="px-5 py-3.5 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-cyan-400 text-white hover:text-cyan-300 transition-all"
          >
            CONTATTAMI
          </button>
        </div>
      </div>

      {/* Bottom KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-white/10 font-mono text-xs">
        <div>
          <span className="block text-white/40 text-[10px] uppercase">
            MODELLAZIONE BIM
          </span>
          <span className="text-xl font-bold text-cyan-400">REVIT 3D</span>
          <span className="block text-white/50 text-[11px]">Residenziale, Commerciale, Industriale</span>
        </div>

        <div>
          <span className="block text-white/40 text-[10px] uppercase">
            COMPUTI & STIME
          </span>
          <span className="text-xl font-bold text-white">CHIAVI IN MANO</span>
          <span className="block text-white/50 text-[11px]">Prefabbricati & Infrastrutture</span>
        </div>

        <div>
          <span className="block text-white/40 text-[10px] uppercase">
            COORDINAMENTO
          </span>
          <span className="text-xl font-bold text-amber-400">LEADERSHIP</span>
          <span className="block text-white/50 text-[11px]">Agenti, Collaboratori & Contratti</span>
        </div>

        <div>
          <span className="block text-white/40 text-[10px] uppercase">
            TOOL OPERATIVI
          </span>
          <span className="text-xl font-bold text-purple-400">ERP & BI</span>
          <span className="block text-white/50 text-[11px]">AutoCAD, Twinmotion, Office 365</span>
        </div>
      </div>
    </section>
  );
};

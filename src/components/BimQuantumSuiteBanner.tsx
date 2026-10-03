import React from 'react';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import { audioSystem } from '../utils/audioSynthesizer';
import { SuiteTab } from './BimQuantumSuiteSection';

interface BimQuantumSuiteBannerProps {
  onOpenSuite: (tabId?: SuiteTab) => void;
}

export const BimQuantumSuiteBanner: React.FC<BimQuantumSuiteBannerProps> = ({ onOpenSuite }) => {
  const handleOpen = () => {
    audioSystem.playBootBeep(1000);
    onOpenSuite();
  };

  return (
    <div className="relative rounded-2xl bg-[#090d16] border border-cyan-500/40 p-6 sm:p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden">
      {/* Subtle Structural Technical Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f0ff06_1px,transparent_1px),linear-gradient(to_bottom,#00f0ff06_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="max-w-2xl">
          {/* Header Tag with Access Lock */}
          <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs mb-3">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-300 font-bold">
              <Lock className="w-3 h-3 text-amber-400" />
              <span>ACCESSO RISERVATO • PASSWORD RICHIESTA</span>
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-stone-300 text-[10px] border border-slate-700 font-mono">
              LOD 400 • NTC 2018
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight font-sans">
            Suite Esecutiva di Ingegneria Prefabbricata &amp; pyRevit
          </h3>

          <p className="text-stone-300 text-sm md:text-base mt-2.5 leading-relaxed font-sans">
            Ambiente di lavoro riservato di ingegneria strutturale e modellazione esecutiva specialistica.
            L'accesso è protetto da chiave di sicurezza fornita via email previa richiesta a <strong>EfremGiannessi@gmail.com</strong>.
          </p>
        </div>

        {/* Action Button */}
        <div className="shrink-0 flex flex-col items-stretch sm:items-end">
          <button
            onClick={handleOpen}
            className="px-7 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(6,182,212,0.3)] hover:shadow-[0_0_35px_rgba(6,182,212,0.5)] active:scale-95"
          >
            <Lock className="w-4 h-4" />
            <span>Accedi con Password</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <div className="text-[11px] font-mono text-stone-400 mt-2 flex items-center gap-1.5 justify-center sm:justify-end">
            <Mail className="w-3 h-3 text-cyan-400" />
            <span>Password su richiesta email</span>
          </div>
        </div>
      </div>
    </div>
  );
};

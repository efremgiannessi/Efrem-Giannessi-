import React from 'react';
import {
  Compass,
  Award,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Building2,
  HardHat,
  Monitor,
  Terminal,
} from 'lucide-react';
import { audioSystem } from '../../utils/audioSynthesizer';

interface AboutStudioSectionProps {
  onOpen360Tour: () => void;
  onOpenRevitConsole: () => void;
}

export const AboutStudioSection: React.FC<AboutStudioSectionProps> = ({
  onOpen360Tour,
  onOpenRevitConsole,
}) => {
  return (
    <section id="studio" className="py-20 border-b border-white/10 bg-black/80 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-cyan-400 mb-2">
            <Building2 className="h-4 w-4" />
            <span>ACTIVE THEORY // STUDIO & MANIFESTO</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase text-white tracking-tight">
            Efrem Giannessi
          </h2>
          <p className="text-sm sm:text-base text-stone-300 font-light mt-2 leading-relaxed">
            Studio professionale specializzato in architettura integrata, digitalizzazione edilizia, computo industriale e sviluppo software per Autodesk Revit, con piena operatività su tutto il territorio nazionale.
          </p>
        </div>

        {/* Bio & Philosophy Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
          {/* Main profile text */}
          <div className="lg:col-span-7 border border-white/15 bg-stone-950 p-6 sm:p-8 flex flex-col justify-between relative">
            <div className="pointer-events-none absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-amber-400" />
            
            <div className="space-y-4 text-stone-300 font-light leading-relaxed text-sm">
              <p>
                <strong className="text-white font-semibold">Efrem Giannessi</strong> opera all'intersezione tra la concretezza costruttiva del cantiere italiano e la frontiera più avanzata dell'ingegneria digitale. L'approccio dello studio supera la tradizionale frammentazione tra chi disegna, chi computa e chi costruisce.
              </p>
              <p>
                Grazie all’implementazione sistematica del metodo <strong className="text-amber-400 font-mono font-semibold">BIM 5D</strong> e allo sviluppo di estensioni personalizzate in ambiente <strong className="text-amber-300 font-mono font-semibold">pyRevit & C#</strong>, ogni elemento del progetto possiede identità geometrica, specifiche prestazionali e costo esatto.
              </p>
              <p>
                Lo studio assiste committenze private, società immobiliari e general contractor su commesse residenziali di pregio, complessi direzionali, rigenerazioni di archeologia industriale e piattaforme logistiche complesse.
              </p>

              <div className="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs text-stone-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>Standard UNI 11337 & ISO 19650</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>Interoperabilità OpenBIM IFC4</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>CDE Cloud protetto proprietario</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>Sopralluoghi e cantieri in tutta Italia</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hardware & Technology Spec Box */}
          <div className="lg:col-span-5 border border-white/15 bg-stone-950 p-6 sm:p-8 flex flex-col justify-between font-mono relative">
            <div className="pointer-events-none absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-amber-400" />
            
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs uppercase tracking-wider pb-3 border-b border-white/10 mb-4 font-bold">
                <Cpu className="h-4 w-4" />
                <span>Dotazione Tecnica & Certificazioni</span>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase">Authoring BIM Principale</span>
                  <span className="font-bold text-white text-sm">Autodesk Revit 2022 - 2026</span>
                  <span className="text-stone-400 text-[11px] block font-sans">Licenze commerciali professionali costantemente aggiornate.</span>
                </div>

                <div>
                  <span className="text-stone-400 block text-[10px] uppercase">Ambiente di Sviluppo & API</span>
                  <span className="font-bold text-white text-sm">C# (.NET 8) • pyRevit • Python • Dynamo</span>
                  <span className="text-stone-400 text-[11px] block font-sans">SDK Revit nativo per add-in custom e automazione computi.</span>
                </div>

                <div>
                  <span className="text-stone-400 block text-[10px] uppercase">Hardware di Calcolo & Mesh 3D</span>
                  <span className="font-bold text-white text-sm">Workstation Multi-GPU Path-Tracing</span>
                  <span className="text-stone-400 text-[11px] block font-sans">Elaborazione rapida nuvole di punti Scan-to-BIM e render 8K.</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 mt-6">
              <button
                onClick={() => {
                  audioSystem.playClick(500);
                  onOpenRevitConsole();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 border border-amber-400/40 bg-amber-400/10 hover:bg-amber-400 hover:text-stone-950 text-amber-400 text-xs uppercase tracking-wider transition-all font-semibold"
              >
                <Terminal className="h-3.5 w-3.5" />
                <span>Testa il Plugin pyRevit dello Studio</span>
              </button>
            </div>
          </div>
        </div>

        {/* 360 Virtual Tour Banner Card */}
        <div className="border border-white/20 bg-stone-950 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="pointer-events-none absolute -left-10 -bottom-10 w-64 h-64 bg-amber-500/5 blur-[80px]" />

          <div className="flex items-center gap-4 relative z-10">
            <div className="flex h-12 w-12 items-center justify-center border border-amber-400/40 bg-amber-400/10 text-amber-400 shrink-0">
              <Compass className="h-6 w-6" />
            </div>
            <div>
              <span className="font-mono text-[10px] text-amber-400 uppercase tracking-widest block">
                ESPERIENZA IMMERSIVA
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wide">
                Vuoi Esplorare lo Studio in 360°?
              </h3>
              <p className="text-xs text-stone-400 max-w-xl mt-1">
                Accedi alla modalità Virtual Tour a 360 gradi per navigare tra le postazioni operative di modellazione BIM, sviluppo software, computo industriale e workstation di rendering.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              audioSystem.playClick(600);
              onOpen360Tour();
            }}
            className="shrink-0 w-full md:w-auto flex items-center justify-center gap-2 py-3 px-6 bg-amber-400 hover:bg-amber-300 text-stone-950 font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-xl relative z-10"
          >
            <Compass className="h-4 w-4" />
            <span>Avvia Virtual Tour 360° Studio</span>
          </button>
        </div>
      </div>
    </section>
  );
};

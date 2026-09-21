import React from 'react';
import {
  Layers,
  Calculator,
  Cpu,
  Compass,
  CheckCircle2,
  FileCode,
  ShieldAlert,
} from 'lucide-react';
import { audioSystem } from '../utils/audioSynthesizer';

interface ActiveTheoryBimPillarsProps {
  onOpenRevitModal: () => void;
  onOpenAuditModal: () => void;
}

export const ActiveTheoryBimPillars: React.FC<ActiveTheoryBimPillarsProps> = ({
  onOpenRevitModal,
  onOpenAuditModal,
}) => {
  const pillars = [
    {
      code: '01',
      title: 'MODELLAZIONE LOD 400 - 500',
      tag: 'ESECUTIVO & FABBRICAZIONE',
      icon: <Layers className="w-5 h-5 text-cyan-400" />,
      desc: 'Ogni componente costruttivo viene dettagliato con stratigrafie reali, tolleranze di posa e armature. Il modello non è una mera rappresentazione visiva, ma il gemello digitale esecutivo da cui derivare i piani di officina.',
      metric: '42.850+ ELEMENTI IFC',
      submetric: 'Zero clash irrisolti pre-getto',
    },
    {
      code: '02',
      title: 'COMPUTO METRICO 5D WBS',
      tag: 'ZERO VARIANTI DI SPESA',
      icon: <Calculator className="w-5 h-5 text-amber-400" />,
      desc: 'Collegamento algoritmico istantaneo tra le quantità geometriche di Revit e i prezzari regionali ufficiali (Toscana, Lombardia, DEI). Le variazioni di progetto aggiornano in tempo reale il quadro economico.',
      metric: '< 0.4% SCOSTAMENTO',
      submetric: 'Media su commesse realizzate',
    },
    {
      code: '03',
      title: 'AUTOMAZIONE pyREVIT & C# SDK',
      tag: 'ALGORITHMIC ARCHITECTURE',
      icon: <Cpu className="w-5 h-5 text-purple-400" />,
      desc: 'Sviluppo di plugin proprietari su misura per automatizzare la compilazione delle schede infissi, il controllo delle interferenze tra impianti e la verifica automatizzata dei parametri UNI 11337.',
      metric: '-70% TEMPO VERIFICA',
      submetric: 'Controllo conformità istantaneo',
      action: {
        label: 'TESTA SCRIPT pyREVIT',
        onClick: onOpenRevitModal,
      },
    },
    {
      code: '04',
      title: 'COMMON DATA ENVIRONMENT (CDE)',
      tag: 'ISO 19650 WORKFLOW',
      icon: <Compass className="w-5 h-5 text-emerald-400" />,
      desc: 'Gestione condivisa di modelli IFC, verbali e cronoprogramma 4D su ambienti di condivisione dati certificati, garantendo tracciabilità totale con committenza e impresa costruttrice.',
      metric: '100% TRACCIABILITÀ',
      submetric: 'Stati WIP, SHARED, PUBLISHED',
    },
  ];

  return (
    <section id="methodology" className="py-24 px-6 md:px-16 select-none relative z-10">
      {/* Section Header */}
      <div className="flex flex-wrap items-end justify-between gap-6 mb-16 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 uppercase tracking-widest mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>PROTOCOLLI TECNICI & INGEGNERIA DI PROGETTO</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight">
            METODOLOGIA BIM 5D
          </h2>
        </div>

        <div className="font-mono text-xs text-white/50 text-right max-w-sm">
          Il controllo totale del processo edilizio: riduzione radicale dei costi
          imprevisti e certezza dei tempi attraverso l'ingegnerizzazione preventiva.
        </div>
      </div>

      {/* 4 Technical Pillar Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {pillars.map((item, idx) => (
          <div
            key={idx}
            onMouseEnter={() => audioSystem.playTechHover()}
            className="p-8 bg-stone-950/40 backdrop-blur-[1px] border border-white/15 hover:border-cyan-400 transition-all relative flex flex-col justify-between group shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
          >
            {/* Top Bar */}
            <div>
              <div className="flex items-center justify-between font-mono text-xs mb-6">
                <span className="text-cyan-400 font-bold uppercase tracking-widest">
                  [ PILLAR {item.code} ]
                </span>
                <span className="px-2 py-0.5 border border-white/10 bg-black/60 text-white/50 text-[10px] uppercase">
                  {item.tag}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 border border-white/10 bg-black/60 group-hover:border-cyan-400 transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold uppercase text-white group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h3>
              </div>

              <p className="text-stone-300 font-sans text-sm font-light leading-relaxed mb-6">
                {item.desc}
              </p>
            </div>

            {/* Bottom Metrics and Action */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 font-mono">
              <div>
                <span className="block text-cyan-400 font-bold text-lg">
                  {item.metric}
                </span>
                <span className="block text-white/40 text-[11px] uppercase">
                  {item.submetric}
                </span>
              </div>

              {item.action && (
                <button
                  onClick={() => {
                    audioSystem.playClick(750);
                    item.action!.onClick();
                  }}
                  className="px-4 py-2 bg-purple-950/60 border border-purple-400 text-purple-300 hover:bg-purple-900/80 text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(168,85,247,0.25)]"
                >
                  {item.action.label}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Direct Contact CTA Banner */}
      <div className="mt-12 p-8 bg-stone-950/30 backdrop-blur-[2px] border border-cyan-400/40 flex flex-wrap items-center justify-between gap-6 shadow-[0_0_30px_rgba(0,240,255,0.1)]">
        <div>
          <div className="font-mono text-xs text-cyan-400 uppercase tracking-widest mb-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>COLLABORAZIONI & CONSULENZE SPECIALISTICHE</span>
          </div>
          <h4 className="text-2xl font-black uppercase text-white">
            HAI UN PROGETTO O VUOI AVVIARE UNA COLLABORAZIONE?
          </h4>
          <p className="text-stone-300 text-sm font-sans font-light mt-1 max-w-xl">
            Scrivimi per discutere requisiti tecnici, consulenze BIM 5D, stime di costo WBS
            o sviluppo di script e add-in Revit personalizzati.
          </p>
        </div>

        <button
          onClick={() => {
            audioSystem.playClick(850);
            onOpenAuditModal();
          }}
          className="px-6 py-3.5 bg-cyan-400 hover:bg-cyan-300 text-stone-950 font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)]"
        >
          CONTATTA EFREM GIANNESSI
        </button>
      </div>
    </section>
  );
};

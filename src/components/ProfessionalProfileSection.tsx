import React from 'react';
import {
  FileText,
  Layers,
  Calculator,
  FileCheck2,
  Users,
  Truck,
  ArrowUpRight,
} from 'lucide-react';
import { audioSystem } from '../utils/audioSynthesizer';

interface ProfessionalProfileSectionProps {
  onContactClick: () => void;
}

export const ProfessionalProfileSection: React.FC<ProfessionalProfileSectionProps> = ({
  onContactClick,
}) => {
  const profileModules = [
    {
      code: 'MOD // 01',
      title: 'Proposte Commerciali e Negoziali',
      icon: <FileText className="w-5 h-5 text-cyan-400" />,
      description:
        'Elaborazione e presentazione di proposte personalizzate per soddisfare le esigenze del cliente.',
      tag: 'BUSINESS & NEGOTIATION',
    },
    {
      code: 'MOD // 02',
      title: 'Modellazione BIM con Revit',
      icon: <Layers className="w-5 h-5 text-purple-400" />,
      description:
        'Utilizzo avanzato di Revit per la progettazione di edifici e strutture in ambito residenziale, commerciale e industriale. Creazione di modelli tridimensionali parametrici e gestione delle informazioni di progetto, incluse proprietà dei materiali, prestazioni energetiche, normative di sicurezza e fasi di costruzione.',
      tag: 'BIM AUTHORING LOD 100-500',
      highlight: true,
    },
    {
      code: 'MOD // 03',
      title: 'Computi Metrici Estimativi & Stime Industriali',
      icon: <Calculator className="w-5 h-5 text-amber-400" />,
      description:
        'Competenza specialistica nella redazione di computi metrici estimativi per prefabbricati industriali, analisi puntuale dei costi di produzione e coordinamento delle opere complementari per la consegna dell’edificio "chiavi in mano".',
      tag: 'BIM 5D // COST CONTROL & FIT-OUT',
    },
    {
      code: 'MOD // 04',
      title: 'Contrattualistica',
      icon: <FileCheck2 className="w-5 h-5 text-emerald-400" />,
      description:
        'Redazione di contratti chiari e conformi alla normativa vigente.',
      tag: 'LEGAL & COMPLIANCE',
    },
    {
      code: 'MOD // 05',
      title: 'Coordinamento e Leadership',
      icon: <Users className="w-5 h-5 text-blue-400" />,
      description:
        'Capacità di coordinare agenti e collaboratori, assicurando il raggiungimento degli obiettivi aziendali e la gestione di commesse con studi tecnici e clienti, garantendo qualità e soddisfazione del servizio.',
      tag: 'PROJECT MANAGEMENT & TEAM',
    },
    {
      code: 'MOD // 06',
      title: 'Gestione Acquisti e Fornitori',
      icon: <Truck className="w-5 h-5 text-rose-400" />,
      description:
        'Ottimizzazione dei costi e dei tempi di consegna attraverso un’efficace gestione dei processi di acquisto.',
      tag: 'PROCUREMENT & SUPPLY CHAIN',
    },
  ];

  return (
    <section id="profilo" className="py-24 px-6 md:px-16 select-none relative z-10 border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-6 mb-16 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 uppercase tracking-widest mb-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>CURRICULUM & ESPERIENZA // EFREM GIANNESSI</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight">
              PROFILO PROFESSIONALE
            </h2>
          </div>

          <div className="font-mono text-xs text-white/50 text-left md:text-right max-w-md">
            Competenze integrate tra progettazione tecnica, gestione economica,
            relazioni commerciali e coordinamento di commessa.
          </div>
        </div>

        {/* 6 Modular Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profileModules.map((item) => (
            <div
              key={item.code}
              onMouseEnter={() => audioSystem.playTechHover()}
              className={`p-6 bg-stone-950/40 backdrop-blur-[2px] border transition-all flex flex-col justify-between group shadow-[0_6px_25px_rgba(0,0,0,0.5)] ${
                item.highlight
                  ? 'border-cyan-400/50 hover:border-cyan-400 bg-stone-950/60 lg:col-span-2'
                  : 'border-white/10 hover:border-cyan-400'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs text-cyan-400 font-bold tracking-wider">
                    {item.code}
                  </span>
                  <div className="p-2 border border-white/10 bg-white/5 group-hover:border-cyan-400/50 transition-colors">
                    {item.icon}
                  </div>
                </div>

                <div className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-1.5">
                  {item.tag}
                </div>

                <h3 className="font-mono text-base md:text-lg font-bold text-white mb-3 tracking-wide">
                  {item.title}
                </h3>

                <p className="font-sans text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-5 mt-6 border-t border-white/10 flex items-center justify-between font-mono text-[11px] text-white/40 group-hover:text-cyan-400 transition-colors">
                <span className="uppercase tracking-wider">Competenza Verificata</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

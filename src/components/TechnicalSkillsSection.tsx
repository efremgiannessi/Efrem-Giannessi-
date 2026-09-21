import React from 'react';
import {
  Cpu,
  Database,
  Terminal,
  BarChart2,
  FolderArchive,
  CheckCircle,
} from 'lucide-react';
import { audioSystem } from '../utils/audioSynthesizer';

export const TechnicalSkillsSection: React.FC = () => {
  const technicalModules = [
    {
      code: 'TECH // 01',
      title: 'Progettazione e Software Avanzati',
      icon: <Cpu className="w-5 h-5 text-cyan-400" />,
      description:
        'Solida esperienza nella progettazione di strutture edili e architettoniche, sia per edilizia pubblica che privata. Utilizzo di software come AutoCAD, Revit e Twinmotion per disegno tecnico, calcolo strutturale, modellazione BIM e rendering.',
      badges: ['AutoCAD', 'Autodesk Revit', 'Twinmotion', 'BIM & Rendering', 'Calcolo Strutturale'],
      highlight: true,
    },
    {
      code: 'TECH // 02',
      title: 'Gestionali Aziendali',
      icon: <Database className="w-5 h-5 text-purple-400" />,
      description:
        'Competenza nell’uso di ERP per la gestione amministrativa e contabile dei progetti.',
      badges: ['Sistemi ERP', 'Contabilità di Progetto', 'Controllo Commessa'],
    },
    {
      code: 'TECH // 03',
      title: 'Sistemi Operativi e Strumenti Office',
      icon: <Terminal className="w-5 h-5 text-emerald-400" />,
      description:
        'Ottima padronanza di Windows e Linux. Utilizzo avanzato di Office 365 (Word, Excel, PowerPoint, OneNote, Outlook, Teams) per la creazione e gestione di documenti, fogli di calcolo, presentazioni e newsletter online, con funzionalità di collaborazione in tempo reale.',
      badges: ['Windows', 'Linux', 'Office 365', 'Excel Avanzato', 'Teams & Real-time Collab'],
      highlight: true,
    },
    {
      code: 'TECH // 04',
      title: 'Analisi Dati e Business Intelligence',
      icon: <BarChart2 className="w-5 h-5 text-amber-400" />,
      description:
        'Esperienza nell’uso di strumenti per l’analisi dei dati e la creazione di listini prezzi basati su analisi di mercato e benchmarking.',
      badges: ['Data Analysis', 'Market Benchmarking', 'Listini Prezzi'],
    },
    {
      code: 'TECH // 05',
      title: 'Protocollo e Archiviazione Documentale',
      icon: <FolderArchive className="w-5 h-5 text-blue-400" />,
      description:
        'Conoscenza delle procedure di protocollo e gestione documentale in contesti aziendali strutturati.',
      badges: ['Protocollo Aziendale', 'Archiviazione Digitale', 'Workflows'],
    },
  ];

  return (
    <section id="competenze" className="py-24 px-6 md:px-16 select-none relative z-10 border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-6 mb-16 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 uppercase tracking-widest mb-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>STACK SOFTWARE & STRUMENTI OPERATIVI</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight">
              COMPETENZE TECNICHE
            </h2>
          </div>

          <div className="font-mono text-xs text-white/50 text-left md:text-right max-w-md">
            Padroneggiamento di tool di authoring tridimensionale, ambienti operativi,
            applicativi gestionali ERP e analisi dati di mercato.
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {technicalModules.map((item) => (
            <div
              key={item.code}
              onMouseEnter={() => audioSystem.playTechHover()}
              className={`p-6 bg-stone-950/40 backdrop-blur-[2px] border transition-all flex flex-col justify-between group shadow-[0_6px_25px_rgba(0,0,0,0.5)] ${
                item.highlight
                  ? 'border-cyan-400/40 hover:border-cyan-400 lg:col-span-2'
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

                <h3 className="font-mono text-base md:text-lg font-bold text-white mb-3 tracking-wide">
                  {item.title}
                </h3>

                <p className="font-sans text-xs sm:text-sm text-stone-300 font-light leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              {/* Tool / Software Badges */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap gap-2">
                {item.badges.map((b) => (
                  <span
                    key={b}
                    className="px-2.5 py-1 bg-white/5 border border-white/10 text-white/70 font-mono text-[10px] uppercase tracking-wider group-hover:border-cyan-400/30 transition-colors"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

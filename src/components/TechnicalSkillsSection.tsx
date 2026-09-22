import React from 'react';
import {
  Cpu,
  Database,
  Terminal,
  BarChart2,
  FolderArchive,
  Calculator,
  TrendingUp,
  HardHat,
  Boxes,
} from 'lucide-react';
import { audioSystem } from '../utils/audioSynthesizer';

export const TechnicalSkillsSection: React.FC = () => {
  const technicalModules = [
    {
      code: 'TECH // 01',
      title: 'Progettazione e Software Avanzati',
      icon: <Cpu className="w-5 h-5 text-cyan-400" />,
      description:
        'Solida esperienza nella progettazione di strutture edili, civili e industriali. Modellazione parametrica BIM in Autodesk Revit, disegno esecutivo con AutoCAD e visualizzazione architettonica fotorealistica con Twinmotion.',
      badges: ['AutoCAD', 'Autodesk Revit', 'Twinmotion', 'BIM LOD 100-400', 'Calcolo Strutturale'],
      highlight: true,
    },
    {
      code: 'TECH // 02',
      title: 'Computi Metrici Industriali & BIM 5D QTO',
      icon: <Calculator className="w-5 h-5 text-cyan-300" />,
      description:
        'Elaborazione specialistica di Computi Metrici Estimativi (CME) esecutivi e quadri economici per complessi industriali, poli logistici e strutture prefabbricate pesanti in c.a.p. e acciaio. Integrazione avanzata nei flussi BIM 5D: estrazione automatica e bidirezionale delle quantità da Autodesk Revit (Quantity Takeoff - QTO) per l’azzeramento delle discrepanze geometriche, strutturazione gerarchica della WBS (UNI 8290), applicazione rigorosa dei Prezzari DEI e Regionali, redazione di Capitolati Speciali d’Appalto (CSA) e gestione delle perizie di variante in corso d’opera.',
      bullets: [
        'Quantity Takeoff Parametrico (BIM 5D): Estrazione automatica e bidirezionale dei quantitativi da Revit (volumi di getto, pannelli a taglio termico, armature e carpenterie metalliche).',
        'Armonizzazione Tariffari Ufficiali: Strutturazione WBS gerarchica, applicazione integrata di Prezzari DEI (Edilizia & Impianti) e Tariffari Regionali OO.PP.',
        'Contrattualistica Esecutiva: Redazione di Capitolati Speciali d’Appalto (CSA), Elenco Prezzi Unitari (EPU) e perizie di variante con analisi di congruità economica.',
      ],
      badges: ['BIM 5D QTO', 'Prezzari DEI & OO.PP.', 'WBS UNI 8290', 'Capitolati CSA', 'Analisi Congruità Prezzi', 'Perizie di Variante'],
      highlight: true,
    },
    {
      code: 'TECH // 03',
      title: 'Analisi e Controllo dei Costi di Produzione',
      icon: <TrendingUp className="w-5 h-5 text-amber-400" />,
      description:
        'Cost engineering industriale applicato a stabilimento e cantiere. Analisi dei prezzi unitari (APU), scomposizione dei costi diretti/indiretti, budgeting di commessa, scouting materie prime e controllo degli scostamenti (Variance Analysis).',
      badges: ['Analisi Prezzi Unitari (APU)', 'Cost Control', 'Budgeting Industriale', 'Benchmarking Fornitori'],
    },
    {
      code: 'TECH // 04',
      title: 'Completamenti con Opere Complementari',
      icon: <HardHat className="w-5 h-5 text-emerald-400" />,
      description:
        'Gestione e computazione delle opere di finitura e completamento chiavi in mano: pavimentazioni industriali elicotterate o in resina, compartimentazioni REI, baie di carico sigillanti, chiusure sandwich e viabilità esterna con sottoservizi.',
      badges: ['Pavimentazioni Industriali', 'Compartimentazioni REI', 'Baie di Carico', 'Opere Esterne & Viabilità', 'Turnkey Fit-Out'],
    },
    {
      code: 'TECH // 05',
      title: 'Gestionali Aziendali ERP & Controllo Commessa',
      icon: <Database className="w-5 h-5 text-purple-400" />,
      description:
        'Competenza nell’uso di ERP aziendali strutturati per la contabilità industriale di progetto, la tracciabilità delle commesse, gli stati di avanzamento lavori (SAL) e la gestione amministrativa degli appalti.',
      badges: ['Sistemi ERP', 'Contabilità di Commessa', 'Monitoraggio SAL', 'Controllo Amministrativo'],
    },
    {
      code: 'TECH // 06',
      title: 'Sistemi Operativi, Office 365 & Data Analytics',
      icon: <Terminal className="w-5 h-5 text-emerald-400" />,
      description:
        'Padronanza di ambienti Windows e Linux. Utilizzo avanzato di Office 365 con particolare eccellenza in Microsoft Excel per la modellazione economica avanzata, analisi dati di mercato, benchmarking competitivo e flussi di lavoro collaborativi.',
      badges: ['Excel Avanzato', 'Office 365', 'Data Analytics', 'Windows / Linux', 'Teams Collab'],
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
            Padroneggiamento di tool di authoring tridimensionale, computi metrici BIM 5D,
            cost engineering di produzione e coordinamento delle opere di completamento.
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

                <p className="font-sans text-xs sm:text-sm text-stone-300 font-light leading-relaxed mb-4">
                  {item.description}
                </p>

                {item.bullets && item.bullets.length > 0 && (
                  <ul className="mb-6 space-y-2 border-l border-cyan-400/30 pl-3">
                    {item.bullets.map((bullet, bIdx) => (
                      <li
                        key={bIdx}
                        className="text-xs text-stone-300 font-sans leading-relaxed flex items-start gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
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

import React, { useState } from 'react';
import {
  Calculator,
  TrendingUp,
  Boxes,
  Building2,
  FileSpreadsheet,
  Coins,
  ShieldCheck,
  CheckCircle2,
  BarChart3,
  Layers,
  ArrowRight,
  HardHat,
  Cpu,
  Receipt,
  FileCheck,
  Scale,
} from 'lucide-react';
import { audioSystem } from '../utils/audioSynthesizer';

export const IndustrialQuantityCostingSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'computi' | 'costi' | 'opere'>('computi');
  const [activeWbsIndex, setActiveWbsIndex] = useState<number>(0);

  const pillars = [
    {
      id: 'computi',
      badge: 'BIM 5D // QUANTITY TAKEOFF',
      title: 'Computi Metrici Estimativi Industriali',
      shortTitle: 'Computi Metrici',
      icon: <Calculator className="w-5 h-5 text-cyan-400" />,
      color: 'cyan',
      headline:
        'Redazione analitica di computi metrici estimativi per edilizia industriale, civile e logistica con estrazione parametrica da modelli BIM.',
      description:
        'Sviluppo di computi metrici estimativi ad alto grado di dettaglio (LOD 300–400) integrati nei flussi BIM 5D. Le quantità dimensionali (volumi di getto, superfici di pannelli prefabbricati, tonnellaggi di carpenteria metallica e sviluppi lineari) vengono collegate bidirezionalmente agli elementi di Revit. Strutturazione rigorosa della WBS (Work Breakdown Structure) secondo gli standard normativi e applicazione mirata dei tariffari ufficiali.',
      deliverables: [
        'Estrazione parametrica bidirezionale da modelli BIM Revit (QTO)',
        'Scomposizione gerarchica WBS per macro-capitoli, lotti funzionali e SAL',
        'Integrazione prezzari ufficiali DEI (Edilizia & Impianti), Prezzari Regionali e Listini Fornitori',
        'Redazione di Capitolati Speciali d’Appalto (CSA), Elenco Prezzi Unitari e Quadri di Spesa',
        'Gestione perizie di variante tecnica ed economica in corso d’opera',
      ],
      tags: ['BIM 5D QTO', 'Prezzari DEI & Regionali', 'WBS Gerarchica', 'Capitolati Speciali (CSA)', 'Varianti in Corso d’Opera'],
    },
    {
      id: 'costi',
      badge: 'COST ENGINEERING // CONTROLLO COMMESSA',
      title: 'Analisi e Controllo dei Costi di Produzione',
      shortTitle: 'Costi di Produzione',
      icon: <TrendingUp className="w-5 h-5 text-amber-400" />,
      color: 'amber',
      headline:
        'Cost engineering industriale: analisi prezzi unitari (APU), scomposizione costi diretti/indiretti e monitoraggio del budget di commessa.',
      description:
        'Approccio rigoroso all’ingegneria economica di commessa, dalla formulazione del preventivo competitivo alla consuntivazione finale. Calcolo puntuale dei costi di stabilimento (costi orari manodopera, incidenza ammortamento linee produttive, materie prime, scarti e logistica di trasporto) e dei costi di cantiere. Implementazione di matrici di confronto per gare di subappalto e monitoraggio continuo dello scostamento budget/consuntivo (Variance Analysis).',
      deliverables: [
        'Analisi dei Prezzi Unitari (APU) con scomposizione analitica (materiali, manodopera, noli, spese generali 13-15% e utile d’impresa 10%)',
        'Elaborazione del Budget Preventivo di Commessa e cash-flow previsionale',
        'Benchmarking e scouting economico su forniture strategiche (acciaio, armature, calcestruzzi speciali)',
        'Analisi degli scostamenti tra stima iniziale, costo di produzione industriale e costo effettivo di posa',
        'Negoziazione economica con fornitori di carpenteria e prefabbricati pesanti',
      ],
      tags: ['Analisi Prezzi Unitari (APU)', 'Cost Control di Commessa', 'Budgeting Industriale', 'Benchmarking Fornitori', 'Variance Analysis'],
    },
    {
      id: 'opere',
      badge: 'COMPLETAMENTI // FIT-OUT CHIAVI IN MANO',
      title: 'Completamenti & Opere Complementari',
      shortTitle: 'Opere Complementari',
      icon: <HardHat className="w-5 h-5 text-emerald-400" />,
      color: 'emerald',
      headline:
        'Pianificazione, computazione e coordinamento delle opere di completamento architettonico, funzionale ed esterno per la consegna chiavi in mano.',
      description:
        'Un edificio industriale non si esaurisce nella struttura portante: il reale valore operativo risiede nella qualità delle opere complementari e di finitura. Gestione tecnica e contrattuale di tutti i pacchetti di completamento: pavimentazioni industriali ad alta resistenza al carico, compartimentazioni tagliafuoco certificate REI, serramenti industriali, baie di carico sigillanti, sistemazioni esterne di viabilità pesante e gestione delle acque meteoriche.',
      deliverables: [
        'Pavimentazioni industriali: calcestruzzi fibrorinforzati, trattamenti al quarzo elicotterati e rivestimenti in resina epossidica/poliuretanica',
        'Chiusure e baie logistiche: portoni sezionali motorizzati, pedane di carico elettroidrauliche e sigillanti isotermici',
        'Compartimentazioni e sicurezza antincendio: pareti e controsoffitti REI, barriere tagliafuoco ed evacuatori di fumo e calore (EFC)',
        'Opere complementari esterne: piazzali di manovra autotreni, pavimentazioni drenanti, vasche di laminazione acque meteoriche e recinzioni antiscavalcamento',
        'Coordinamento multidisciplinare per il collaudo tecnico e la consegna dell’opera “chiavi in mano”',
      ],
      tags: ['Pavimentazioni Industriali', 'Baie di Carico Isotermiche', 'Compartimentazioni REI', 'Opere Esterne & Piazzali', 'Turnkey Handover'],
    },
  ];

  const wbsItems = [
    {
      code: 'WBS 01',
      title: 'Opere di Fondazione & Strutture Prefabbricate',
      category: 'STRUTTURE // c.a.v. & c.a.p.',
      metricScope: 'Pilastri prefabbricati, travi alari a doppia pendenza, tegoli TT e fondazioni a plinto con bicchiere incorporato.',
      unitCostNote: 'Analisi da modello parametrico Revit LOD 350 con incidenza del ferro di armatura e armature lente/tese.',
      standardSource: 'Prezzario DEI Edilizia & Schede di Produzione Stabilimento',
      percentage: '38%',
    },
    {
      code: 'WBS 02',
      title: 'Involucro Edilizio & Chiusure Termoisolanti',
      category: 'INVOLUCRO // EFFICIENZA ENERGETICA',
      metricScope: 'Pannelli di tamponamento prefabbricati a taglio termico, lucernari continui in policarbonato, manti impermeabili sintetici in TPO/PVC.',
      unitCostNote: 'Verifica trasmittanza termica U ≤ 0.22 W/m²K con calcolo dei ponti termici e accessori di fissaggio strutturale antisismico.',
      standardSource: 'Prezzari Regionali OO.PP. & Listini Produttori Pannelli Sandwich',
      percentage: '22%',
    },
    {
      code: 'WBS 03',
      title: 'Completamenti Interni & Pavimentazioni Speciali',
      category: 'FIT-OUT // FINITURE RESISTENTI',
      metricScope: 'Pavimentazione industriale monolitica sp. 20 cm fibrorinforzata con pasta di quarzo, giunti di dilatazione a profilo sinusoidale e sigillature poliuretaniche.',
      unitCostNote: 'Portata utile di progetto 80 kN/mq distribuito e 100 kN su impronta piedino scaffalatura automatica.',
      standardSource: 'Linee Guida CNR DT 211 & Capitolato Speciale Prestazionale',
      percentage: '18%',
    },
    {
      code: 'WBS 04',
      title: 'Opere Complementari Esterne & Viabilità Logistica',
      category: 'SISTEMAZIONI // INFRASTRUTTURE',
      metricScope: 'Sottofondi stradali stabilizzati a calce/cemento, conglomerato bituminoso ad alto modulo, sottoservizi fognari e vasche di prima pioggia.',
      unitCostNote: 'Dimensionamento per carichi pesanti asse 13t con pendenze di scolo e cordolature perimetrali in granito.',
      standardSource: 'Tariffario Regionale Viabilità & Infrastrutture',
      percentage: '22%',
    },
  ];

  const activePillar = pillars.find((p) => p.id === activeTab) || pillars[0];

  return (
    <section
      id="computi-costi"
      className="py-24 px-6 md:px-16 select-none relative z-10 border-t border-white/10 bg-[#050508]/60 backdrop-blur-[3px]"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-6 mb-16 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 uppercase tracking-widest mb-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>ECONOMIA DEL PROGETTO & GESTIONE OPERE</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight">
              COMPUTI METRICI INDUSTRIALI, COSTI E OPERE COMPLEMENTARI
            </h2>
          </div>

          <div className="font-mono text-xs text-white/50 text-left md:text-right max-w-md">
            Dalla scomposizione parametrica BIM 5D all’analisi dei prezzi di fabbricazione, fino al
            coordinamento di tutte le opere di finitura per la consegna dell’edificio chiavi in mano.
          </div>
        </div>

        {/* 3 Strategic Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {pillars.map((pillar) => {
            const isSelected = activeTab === pillar.id;
            return (
              <button
                key={pillar.id}
                onClick={() => {
                  audioSystem.playClick(600);
                  setActiveTab(pillar.id as any);
                }}
                onMouseEnter={() => audioSystem.playTechHover()}
                className={`p-5 text-left border transition-all flex flex-col justify-between group cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'bg-stone-900/90 border-cyan-400 shadow-[0_0_25px_rgba(0,240,255,0.18)]'
                    : 'bg-stone-950/40 border-white/10 hover:border-white/30 hover:bg-stone-900/40'
                }`}
              >
                {/* Active Indicator Bar */}
                {isSelected && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-cyan-300 to-amber-400" />
                )}

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[10px] text-cyan-400 font-bold tracking-wider">
                      {pillar.badge}
                    </span>
                    <div
                      className={`p-2 border transition-colors ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-950/50'
                          : 'border-white/10 bg-white/5 group-hover:border-white/30'
                      }`}
                    >
                      {pillar.icon}
                    </div>
                  </div>

                  <h3 className="font-mono text-base font-bold text-white mb-2 tracking-wide uppercase">
                    {pillar.title}
                  </h3>

                  <p className="font-sans text-xs text-stone-400 font-light leading-relaxed line-clamp-2">
                    {pillar.headline}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
                  <span className={isSelected ? 'text-cyan-300 font-bold' : 'text-white/40'}>
                    {isSelected ? 'MODULO ATTIVO' : 'SELEZIONA DETTAGLIO'}
                  </span>
                  <ArrowRight
                    className={`w-3.5 h-3.5 transition-transform ${
                      isSelected ? 'text-cyan-400 translate-x-1' : 'text-white/40 group-hover:translate-x-1'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Pillar Deep-Dive Focus Panel */}
        <div className="p-6 md:p-8 bg-stone-950/70 border border-cyan-400/50 backdrop-blur-md mb-12 shadow-[0_10px_35px_rgba(0,0,0,0.6)]">
          <div className="flex flex-col lg:flex-row gap-8 justify-between items-start">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 bg-cyan-400/10 border border-cyan-400/40 text-cyan-300 font-mono text-[10px] uppercase tracking-wider">
                  {activePillar.badge}
                </span>
                <span className="font-mono text-xs text-white/40">// SPECIFICA TECNICA OPERATIVA</span>
              </div>

              <h3 className="text-xl md:text-2xl font-bold uppercase text-white tracking-wide">
                {activePillar.title}
              </h3>

              <p className="font-sans text-sm md:text-base text-stone-200 font-normal leading-relaxed">
                {activePillar.headline}
              </p>

              <p className="font-sans text-xs md:text-sm text-stone-400 font-light leading-relaxed">
                {activePillar.description}
              </p>

              {/* Tags Strip */}
              <div className="flex flex-wrap gap-2 pt-2">
                {activePillar.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 bg-white/5 border border-white/10 text-cyan-200/80 font-mono text-[10px] uppercase tracking-wider"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Structured Deliverables Checklist */}
            <div className="w-full lg:w-96 bg-black/60 border border-white/10 p-5 shrink-0 space-y-3">
              <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  AMBITI DI APPLICAZIONE & OUTPUT
                </h4>
              </div>

              <ul className="space-y-2.5">
                {activePillar.deliverables.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-stone-300 font-sans">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* WBS Simulation & Breakdown Matrix */}
        <div className="border border-white/10 bg-stone-950/50 backdrop-blur-sm">
          {/* Header of WBS Matrix */}
          <div className="p-4 md:px-6 border-b border-white/10 bg-stone-900/60 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Boxes className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs md:text-sm font-bold uppercase tracking-wider text-white font-mono">
                STRUTTURAZIONE WBS DI COMMESSA INDUSTRIALE // QUADRO COMPARATIVO
              </h4>
            </div>
            <div className="font-mono text-[11px] text-white/50">
              Ripartizione pesi economici e standard di riferimento
            </div>
          </div>

          {/* Interactive WBS Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {wbsItems.map((item, idx) => {
              const isSelected = activeWbsIndex === idx;
              return (
                <div
                  key={item.code}
                  onClick={() => {
                    audioSystem.playClick(500 + idx * 50);
                    setActiveWbsIndex(idx);
                  }}
                  onMouseEnter={() => audioSystem.playTechHover()}
                  className={`p-5 flex flex-col justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-cyan-950/30 border-b-2 border-b-cyan-400'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-cyan-400">{item.code}</span>
                      <span className="font-mono text-xs font-bold text-amber-300 bg-amber-950/40 border border-amber-400/30 px-1.5 py-0.5">
                        {item.percentage}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-white/40 block mb-1.5 uppercase tracking-wider">
                      {item.category}
                    </span>

                    <h5 className="font-mono text-xs font-bold text-white mb-2 leading-snug">
                      {item.title}
                    </h5>

                    <p className="font-sans text-[11px] text-stone-300 font-light leading-relaxed mb-3">
                      {item.metricScope}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 space-y-1.5 text-[10px] font-mono text-white/60">
                    <div>
                      <span className="text-white/40">FONTE: </span>
                      <span className="text-stone-300">{item.standardSource}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* WBS Highlight Footer Banner */}
          <div className="p-4 md:px-6 bg-stone-900/40 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono text-stone-300">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                Controllo di affidabilità economico-costruttiva con scostamento medio inferiore al{' '}
                <strong className="text-cyan-300">±2.5%</strong> tra preventivo BIM e consuntivo di cantiere.
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[11px] text-emerald-400 uppercase tracking-widest font-bold">
                COMPLIANCE PREZZARI REGIONALI & DEI
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

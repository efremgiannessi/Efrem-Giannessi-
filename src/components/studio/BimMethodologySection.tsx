import React from 'react';
import {
  Layers,
  Box,
  TrendingDown,
  Clock,
  Euro,
  FileCheck2,
  CheckCircle2,
  Maximize2,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { audioSystem } from '../../utils/audioSynthesizer';

interface BimMethodologySectionProps {
  onOpenBimViewer: () => void;
  onOpenEstimatorModal: () => void;
}

export const BimMethodologySection: React.FC<BimMethodologySectionProps> = ({
  onOpenBimViewer,
  onOpenEstimatorModal,
}) => {
  const pillars = [
    {
      num: '01',
      title: 'Modellazione 3D Parametrica & Famiglie RFA',
      tag: 'Geometria Intelligente',
      description: 'Ogni muro, pilastro, serramento o strato isolante non è una semplice linea CAD, ma un oggetto parametrico arricchito con proprietà termiche, acustiche, codici WBS e volumi esatti.',
      bullets: [
        'Famiglie parametriche su misura per nodi costruttivi critici',
        'Stratigrafie murarie complete con mappatura spessori e trasmittanze (U)',
        'Livelli di dettaglio da LOD 200 (autorizzativo) a LOD 500 (as-built manutentivo)',
      ],
    },
    {
      num: '02',
      title: 'Integrazione 4D Tempi & 5D Costi di Costruzione',
      tag: 'Quantity Takeoff Real-Time',
      description: 'Il cuore economico del nostro studio: l’estrazione automatica delle quantità (QTO) collegata direttamente ai prezzari regionali e DEI. Ogni modifica progettuale aggiorna il computo metrico all’istante.',
      bullets: [
        'Eliminazione degli errori umani di trascrizione e misurazione manuale',
        'Analisi dei nuovi prezzi unitari e simulazione avanzamento lavori (SAL)',
        'Stima preventiva ad alta affidabilità con scostamento medio inferiore allo 0.5%',
      ],
    },
    {
      num: '03',
      title: 'Clash Detection & Coordinamento OpenBIM',
      tag: 'Interoperabilità IFC / BCF',
      description: 'Sovrapposizione e federazione dei modelli architettonici, strutturali e degli impianti meccanici/elettrici. Risoluzione dei conflitti nello spazio virtuale prima di inviare le squadre in cantiere.',
      bullets: [
        'Flussi di lavoro basati su standard aperti IFC4 e reportistica BCF',
        'Azzeramento dei fermi cantiere dovuti a interferenze tra tubazioni e travi',
        'Piattaforma CDE (Common Data Environment) per condivisione continua con la committenza',
      ],
    },
  ];

  return (
    <section id="bim" className="py-20 border-b border-white/10 bg-black/70 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-cyan-400 mb-2">
            <Layers className="h-4 w-4" />
            <span>ACTIVE THEORY // METODOLOGIA ARCHITETTONICA</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase text-white tracking-tight">
            Il Processo BIM 5D Integrato
          </h2>
          <p className="text-sm sm:text-base text-stone-300 font-light mt-3 leading-relaxed">
            Trasformiamo la complessità del processo edilizio in un modello digitale unico, controllabile e condiviso. Dallo studio preliminare alla direzione lavori, ogni scelta è validata dal punto di vista geometrico, temporale ed economico.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {pillars.map((pillar) => (
            <div
              key={pillar.num}
              onMouseEnter={() => audioSystem.playTechHover()}
              className="border border-white/15 bg-stone-950/80 backdrop-blur-md p-6 flex flex-col justify-between relative group hover:border-cyan-400/80 transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,240,255,0.12)]"
            >
              <div className="pointer-events-none absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-400/60 group-hover:border-cyan-400" />
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4 font-mono">
                  <span className="text-2xl font-bold text-cyan-400">{pillar.num}</span>
                  <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider bg-cyan-950/40 border border-cyan-400/30 text-cyan-300 font-semibold">
                    {pillar.tag}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white uppercase mb-3 group-hover:text-cyan-300 transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-xs text-stone-300 font-light leading-relaxed mb-4">
                  {pillar.description}
                </p>

                <div className="space-y-2 font-mono text-[11px] text-stone-400 pt-3 border-t border-white/10">
                  {pillar.bullets.map((b, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive 3D Model Banner Feature */}
        <div className="border border-cyan-400/30 bg-stone-950/90 backdrop-blur-xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-[0_0_30px_rgba(0,240,255,0.15)]">
          <div className="pointer-events-none absolute -right-10 -bottom-10 w-80 h-80 bg-cyan-500/10 blur-[80px]" />
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="flex h-12 w-12 items-center justify-center border border-cyan-400/50 bg-cyan-950/40 text-cyan-400 shrink-0">
              <Box className="h-6 w-6" />
            </div>
            <div>
              <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest block font-semibold">
                LAB R&D // SIMULATORE INTERATTIVO DI STUDIO
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wide">
                Esamina il Modello BIM 3D con Piani di Sezione & Dati IFC
              </h3>
              <p className="text-xs text-stone-400 max-w-xl mt-1">
                Visualizza un edificio parametrico reale: ruota nello spazio tridimensionale, seziona i solai, isola pilastri portanti e visualizza i parametri fisici ed economici di ciascun componente.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full md:w-auto relative z-10 font-mono text-xs">
            <button
              onClick={() => {
                audioSystem.playClick(600);
                onOpenBimViewer();
              }}
              onMouseEnter={() => audioSystem.playTechHover()}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-cyan-400 hover:bg-cyan-300 text-stone-950 font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)]"
            >
              <Maximize2 className="h-4 w-4" />
              <span>Avvia Ispettore BIM 3D</span>
            </button>
            <button
              onClick={() => {
                audioSystem.playClick(500);
                onOpenEstimatorModal();
              }}
              onMouseEnter={() => audioSystem.playTechHover()}
              className="flex-1 md:flex-none px-4 py-3 border border-white/15 bg-white/5 hover:border-amber-400 hover:text-amber-300 text-stone-200 uppercase tracking-wider transition-all"
            >
              <span>Calcola Stima 5D</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

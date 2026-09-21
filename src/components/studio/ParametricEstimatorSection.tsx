import React, { useState } from 'react';
import {
  Calculator,
  Euro,
  Clock,
  TrendingDown,
  Building2,
  CheckCircle2,
  Send,
  Layers,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { audioSystem } from '../../utils/audioSynthesizer';

interface ParametricEstimatorSectionProps {
  onOpenAuditWithQuote: (quoteSummary: string) => void;
}

export const ParametricEstimatorSection: React.FC<ParametricEstimatorSectionProps> = ({
  onOpenAuditWithQuote,
}) => {
  const [buildingType, setBuildingType] = useState<'residenziale' | 'commerciale' | 'industriale' | 'recupero'>('residenziale');
  const [areaM2, setAreaM2] = useState<number>(1200);
  const [lod, setLod] = useState<'LOD_200' | 'LOD_300' | 'LOD_400' | 'LOD_500'>('LOD_400');
  const [includeArch, setIncludeArch] = useState<boolean>(true);
  const [includeStruct, setIncludeStruct] = useState<boolean>(true);
  const [includeMEP, setIncludeMEP] = useState<boolean>(true);
  const [include5DCost, setInclude5DCost] = useState<boolean>(true);
  const [includeClashDetection, setIncludeClashDetection] = useState<boolean>(true);

  // Economic parameters based on Italian construction benchmarks
  const baseRatePerM2 = {
    residenziale: 1550,
    commerciale: 1950,
    industriale: 1150,
    recupero: 1800,
  }[buildingType];

  const estimatedConstructionCost = areaM2 * baseRatePerM2;

  const lodMultiplier = {
    LOD_200: 0.012,
    LOD_300: 0.021,
    LOD_400: 0.032,
    LOD_500: 0.044,
  }[lod];

  let disciplineFactor = 0;
  if (includeArch) disciplineFactor += 0.45;
  if (includeStruct) disciplineFactor += 0.25;
  if (includeMEP) disciplineFactor += 0.30;
  if (disciplineFactor === 0) disciplineFactor = 0.2;

  let serviceMultiplier = 1.0;
  if (include5DCost) serviceMultiplier += 0.18;
  if (includeClashDetection) serviceMultiplier += 0.14;

  const estimatedBimFee = Math.round(
    estimatedConstructionCost * lodMultiplier * disciplineFactor * serviceMultiplier
  );

  const estimatedWeeks = Math.max(
    2,
    Math.round((areaM2 / 600) * (lod === 'LOD_500' ? 2.2 : lod === 'LOD_400' ? 1.6 : 1.0))
  );

  const estimatedSavings = Math.round(estimatedConstructionCost * 0.075);

  const handleRequestQuote = () => {
    audioSystem.playClick(700);
    const summary = `Preventivo Parametrico BIM 5D: Tipologia ${buildingType.toUpperCase()}, Superficie: ${areaM2} m², Livello: ${lod}, Opere stimate: € ${estimatedConstructionCost.toLocaleString()}, Onorario indicativo BIM: € ${estimatedBimFee.toLocaleString()}, Tempi: ~${estimatedWeeks} settimane.`;
    onOpenAuditWithQuote(summary);
  };

  return (
    <section id="preventivatore" className="py-20 border-b border-white/10 bg-stone-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-amber-400 mb-2">
            <Calculator className="h-4 w-4" />
            <span>CONFIGURATORE ECONOMICO LIVE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold uppercase text-white tracking-tight">
            Calcolatore Parametrico BIM 5D & Tempi
          </h2>
          <p className="text-sm sm:text-base text-stone-300 font-light mt-2 leading-relaxed">
            Stima in tempo reale il costo di costruzione parametrico, l'onorario professionale per la modellazione e computo BIM 5D, e i risparmi previsti dall'azzeramento delle varianti di cantiere.
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Form */}
          <div className="lg:col-span-7 border border-white/15 bg-stone-900/40 p-6 space-y-6 relative">
            <div className="pointer-events-none absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-amber-400 z-20" />
            <div className="pointer-events-none absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-amber-400 z-20" />

            {/* 1. Building Typology */}
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-stone-300 mb-2 font-semibold">
                1. Tipologia dell'Intervento
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
                {(
                  [
                    { id: 'residenziale', label: 'Residenziale' },
                    { id: 'commerciale', label: 'Terziario' },
                    { id: 'industriale', label: 'Industriale' },
                    { id: 'recupero', label: 'Recupero' },
                  ] as const
                ).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      audioSystem.playClick(450);
                      setBuildingType(t.id);
                    }}
                    className={`py-2 px-3 border uppercase tracking-wider transition-all text-center ${
                      buildingType === t.id
                        ? 'bg-amber-400 text-stone-950 border-amber-400 font-bold'
                        : 'bg-stone-950 border-white/10 text-stone-400 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Area Slider */}
            <div>
              <div className="flex items-center justify-between font-mono text-xs mb-2">
                <span className="uppercase tracking-wider text-stone-300 font-semibold">
                  2. Superficie Lorda di Progetto (SLP)
                </span>
                <span className="text-amber-400 font-bold text-sm">{areaM2.toLocaleString()} m²</span>
              </div>
              <input
                type="range"
                min={100}
                max={10000}
                step={50}
                value={areaM2}
                onChange={(e) => setAreaM2(Number(e.target.value))}
                className="w-full h-1.5 bg-stone-800 accent-amber-400 rounded-none cursor-pointer"
              />
              <div className="flex justify-between font-mono text-[10px] text-stone-500 mt-1">
                <span>100 m² (Piccola Scala)</span>
                <span>2.500 m²</span>
                <span>5.000 m²</span>
                <span>10.000 m² (Grande Opera)</span>
              </div>
            </div>

            {/* 3. LOD Selection */}
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-stone-300 mb-2 font-semibold">
                3. Livello di Sviluppo Informativo (LOD - ISO 19650)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
                {(
                  [
                    { id: 'LOD_200', label: 'LOD 200', desc: 'Fattibilità' },
                    { id: 'LOD_300', label: 'LOD 300', desc: 'Autorizzativo' },
                    { id: 'LOD_400', label: 'LOD 400', desc: 'Esecutivo 5D' },
                    { id: 'LOD_500', label: 'LOD 500', desc: 'As-Built' },
                  ] as const
                ).map((l) => (
                  <button
                    key={l.id}
                    onClick={() => {
                      audioSystem.playClick(500);
                      setLod(l.id);
                    }}
                    className={`p-2 border text-center transition-all ${
                      lod === l.id
                        ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-bold'
                        : 'bg-stone-950 border-white/10 text-stone-400 hover:border-white/20'
                    }`}
                  >
                    <div className="font-bold">{l.label}</div>
                    <div className="text-[10px] text-stone-400">{l.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Disciplines & Extra services */}
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-stone-300 mb-2 font-semibold">
                4. Discipline & Servizi Inclusi
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
                <button
                  onClick={() => setIncludeArch(!includeArch)}
                  className={`flex items-center gap-2 p-2.5 border text-left transition-all ${
                    includeArch
                      ? 'border-amber-400/60 bg-amber-400/10 text-stone-200'
                      : 'border-white/10 bg-stone-950 text-stone-500'
                  }`}
                >
                  <CheckCircle2 className={`h-4 w-4 ${includeArch ? 'text-amber-400' : 'text-stone-600'}`} />
                  <span>Modello Architettonico Completo</span>
                </button>

                <button
                  onClick={() => setIncludeStruct(!includeStruct)}
                  className={`flex items-center gap-2 p-2.5 border text-left transition-all ${
                    includeStruct
                      ? 'border-amber-400/60 bg-amber-400/10 text-stone-200'
                      : 'border-white/10 bg-stone-950 text-stone-500'
                  }`}
                >
                  <CheckCircle2 className={`h-4 w-4 ${includeStruct ? 'text-amber-400' : 'text-stone-600'}`} />
                  <span>Modello Strutturale (C.A. / Acciaio)</span>
                </button>

                <button
                  onClick={() => setIncludeMEP(!includeMEP)}
                  className={`flex items-center gap-2 p-2.5 border text-left transition-all ${
                    includeMEP
                      ? 'border-amber-400/60 bg-amber-400/10 text-stone-200'
                      : 'border-white/10 bg-stone-950 text-stone-500'
                  }`}
                >
                  <CheckCircle2 className={`h-4 w-4 ${includeMEP ? 'text-amber-400' : 'text-stone-600'}`} />
                  <span>Modello Impianti MEP Meccanici</span>
                </button>

                <button
                  onClick={() => setInclude5DCost(!include5DCost)}
                  className={`flex items-center gap-2 p-2.5 border text-left transition-all ${
                    include5DCost
                      ? 'border-emerald-400/60 bg-emerald-400/10 text-stone-200'
                      : 'border-white/10 bg-stone-950 text-stone-500'
                  }`}
                >
                  <CheckCircle2 className={`h-4 w-4 ${include5DCost ? 'text-emerald-400' : 'text-stone-600'}`} />
                  <span>Computo Metrico 5D Dinamico</span>
                </button>

                <button
                  onClick={() => setIncludeClashDetection(!includeClashDetection)}
                  className={`flex items-center gap-2 p-2.5 border text-left transition-all sm:col-span-2 ${
                    includeClashDetection
                      ? 'border-sky-400/60 bg-sky-400/10 text-stone-200'
                      : 'border-white/10 bg-stone-950 text-stone-500'
                  }`}
                >
                  <CheckCircle2 className={`h-4 w-4 ${includeClashDetection ? 'text-sky-400' : 'text-stone-600'}`} />
                  <span>Clash Detection Interdisciplinare & Report BCF</span>
                </button>
              </div>
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="lg:col-span-5 border border-amber-400/40 bg-stone-950 p-6 sm:p-7 relative space-y-6">
            <div className="pointer-events-none absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-400" />
            <div className="pointer-events-none absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-400" />

            <div className="border-b border-white/10 pb-4">
              <span className="font-mono text-[10px] uppercase tracking-widest text-amber-400 block">
                QUADRO ECONOMICO PARAMETRICO
              </span>
              <h3 className="text-xl font-bold text-white uppercase tracking-wide">
                Riepilogo Stima di Commessa
              </h3>
            </div>

            {/* Big Metrics */}
            <div className="space-y-4 font-mono">
              <div className="p-4 bg-stone-900/80 border border-white/10">
                <span className="text-stone-400 text-xs block uppercase">Stima Costo Opere Edili</span>
                <span className="text-2xl sm:text-3xl font-bold text-white block mt-1">
                  € {estimatedConstructionCost.toLocaleString()}
                </span>
                <span className="text-[10px] text-stone-500 block mt-0.5">
                  Calcolato su {areaM2} m² @ {baseRatePerM2} €/m²
                </span>
              </div>

              <div className="p-4 bg-amber-400/10 border border-amber-400/40">
                <div className="flex items-center justify-between">
                  <span className="text-amber-400 text-xs uppercase font-bold">Onorario Modellazione & BIM 5D</span>
                  <span className="px-2 py-0.5 text-[10px] bg-amber-400/20 text-amber-300 font-bold uppercase">
                    {lod}
                  </span>
                </div>
                <span className="text-2xl sm:text-3xl font-extrabold text-amber-300 block mt-1">
                  € {estimatedBimFee.toLocaleString()}
                </span>
                <span className="text-[10px] text-stone-400 block mt-0.5">
                  Include elaborati esecutivi, abachi e file IFC OpenBIM
                </span>
              </div>
            </div>

            {/* Key benefits row */}
            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3 bg-stone-900/60 border border-white/10">
                <div className="flex items-center gap-1.5 text-stone-400 text-[10px] uppercase">
                  <Clock className="h-3.5 w-3.5 text-sky-400" />
                  <span>Tempi Consegna</span>
                </div>
                <span className="text-base font-bold text-white block mt-1">
                  ~{estimatedWeeks} Settimane
                </span>
              </div>

              <div className="p-3 bg-stone-900/60 border border-white/10">
                <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] uppercase">
                  <TrendingDown className="h-3.5 w-3.5" />
                  <span>Risparmio da Varianti</span>
                </div>
                <span className="text-base font-bold text-emerald-400 block mt-1">
                  ~€ {estimatedSavings.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-2">
              <button
                onClick={handleRequestQuote}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-amber-400 hover:bg-amber-300 text-stone-950 font-mono text-xs uppercase tracking-widest font-extrabold transition-all shadow-xl"
              >
                <span>Richiedi Proposta con questi Parametri</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <p className="text-[10px] text-stone-500 text-center font-mono mt-2">
                Nessun impegno • Riscontro tecnico personalizzato entro 24 ore
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

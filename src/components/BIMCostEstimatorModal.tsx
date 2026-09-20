import React, { useState, useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calculator,
  X,
  Building2,
  Layers,
  Sparkles,
  TrendingDown,
  Clock,
  Euro,
  FileSpreadsheet,
  CheckCircle2,
  HelpCircle,
  Download,
  Mail,
  Share2,
} from 'lucide-react';
import { audioSystem } from '../utils/audioSynthesizer';

interface BIMCostEstimatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenContactWithQuote?: (summaryText: string) => void;
}

export const BIMCostEstimatorModal: React.FC<BIMCostEstimatorModalProps> = ({
  isOpen,
  onClose,
  onOpenContactWithQuote,
}) => {
  const [buildingType, setBuildingType] = useState<'residenziale' | 'industriale' | 'commerciale' | 'infrastruttura'>('residenziale');
  const [areaM2, setAreaM2] = useState<number>(1200);
  const [lod, setLod] = useState<'LOD_200' | 'LOD_300' | 'LOD_400' | 'LOD_500'>('LOD_400');
  const [includeArch, setIncludeArch] = useState<boolean>(true);
  const [includeStruct, setIncludeStruct] = useState<boolean>(true);
  const [includeMEP, setIncludeMEP] = useState<boolean>(true);
  const [include5DCost, setInclude5DCost] = useState<boolean>(true);
  const [includeClashDetection, setIncludeClashDetection] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const inputId = useId();

  if (!isOpen) return null;

  // Calculation parameters based on Italian market and BIM standards (UNI 11337 / ISO 19650)
  const baseRatePerM2 = {
    residenziale: 1450, // Stima costo costruzione standard €/m²
    commerciale: 1850,
    industriale: 1100,
    infrastruttura: 2200,
  }[buildingType];

  const estimatedConstructionCost = areaM2 * baseRatePerM2;

  // BIM Modeling & 5D Engineering service fee estimate
  const lodMultiplier = {
    LOD_200: 0.012,
    LOD_300: 0.021,
    LOD_400: 0.032,
    LOD_500: 0.044,
  }[lod];

  let disciplineFactor = 0;
  if (includeArch) disciplineFactor += 0.38;
  if (includeStruct) disciplineFactor += 0.32;
  if (includeMEP) disciplineFactor += 0.30;
  if (disciplineFactor === 0) disciplineFactor = 0.38;

  let serviceMultiplier = 1.0;
  if (include5DCost) serviceMultiplier += 0.22;
  if (includeClashDetection) serviceMultiplier += 0.18;

  const estimatedBIMService = Math.round(estimatedConstructionCost * lodMultiplier * disciplineFactor * serviceMultiplier);
  const estimatedDays = Math.max(10, Math.round(Math.sqrt(areaM2) * (lod === 'LOD_500' ? 1.8 : lod === 'LOD_400' ? 1.4 : 1.0) * (disciplineFactor + 0.3)));
  
  // Clash detection savings estimate (typically 3% to 7% of total construction budget saved on field rework)
  const estimatedClashSavings = Math.round(estimatedConstructionCost * 0.048);
  const netROI = Math.round(((estimatedClashSavings - estimatedBIMService) / estimatedBIMService) * 100);

  const quoteSummary = `PREVENTIVO PARAMETRICO BIM 5D - STUDIO EFREM GIANNESSI
------------------------------------------------------------
Tipologia Edificio: ${buildingType.toUpperCase()}
Superficie Calpestabile: ${areaM2} m²
Livello di Dettaglio: ${lod.replace('_', ' ')}
Discipline: ${[includeArch ? 'Architettonico' : '', includeStruct ? 'Strutturale' : '', includeMEP ? 'Impianti MEP' : ''].filter(Boolean).join(', ')}
Servizi Inclusi: Computo 5D (${include5DCost ? 'Sì' : 'No'}), Clash Detection (${includeClashDetection ? 'Sì' : 'No'})

Stima Valore Opere (Cantiere): € ${estimatedConstructionCost.toLocaleString('it-IT')}
Onorario Stimato Modellazione BIM 5D: € ${estimatedBIMService.toLocaleString('it-IT')}
Tempo Stimato Consegna: ~${estimatedDays} giorni lavorativi
Risparmio Stimato Rework in Cantiere: € ${estimatedClashSavings.toLocaleString('it-IT')} (ROI stimato: +${netROI}%)
------------------------------------------------------------
Richiesta preventivo ufficiale a: EfremGiannessi@gmail.com`;

  const handleCopyQuote = () => {
    audioSystem.playClick(750);
    navigator.clipboard.writeText(quoteSummary).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }).catch(() => {});
  };

  const handleSendToEmail = () => {
    audioSystem.playClick(800);
    if (onOpenContactWithQuote) {
      onOpenContactWithQuote(quoteSummary);
      onClose();
    } else {
      const subject = encodeURIComponent(`Richiesta Preventivo BIM 5D - ${buildingType.toUpperCase()} ${areaM2}m²`);
      const body = encodeURIComponent(quoteSummary);
      window.location.href = `mailto:EfremGiannessi@gmail.com?subject=${subject}&body=${body}`;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cost-estimator-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-4xl rounded-3xl border border-white/20 bg-stone-950/95 p-5 sm:p-7 shadow-2xl backdrop-blur-2xl text-stone-100 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-stone-950 font-black shadow-lg shadow-amber-500/30">
              <Calculator className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="cost-estimator-title" className="text-base sm:text-lg font-bold text-white tracking-wide">
                  Calcolatore & Preventivatore BIM 5D
                </h2>
                <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-400/40">
                  UNI 11337 / ISO 19650
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Stima parametrica preliminare dei tempi, onorari di modellazione e risparmio di cantiere
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              audioSystem.playClick(500);
              onClose();
            }}
            className="rounded-xl p-2 text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Chiudi calcolatore"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body: Grid 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 py-4 overflow-y-auto min-h-0">
          {/* Left Column: Parametric Inputs (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Building Type */}
            <div>
              <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block mb-2">
                Tipologia Opera
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'residenziale', label: 'Residenziale', icon: '🏡' },
                  { id: 'commerciale', label: 'Terziario', icon: '🏢' },
                  { id: 'industriale', label: 'Industriale', icon: '🏭' },
                  { id: 'infrastruttura', label: 'Infrastrutt.', icon: '🌉' },
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => {
                      audioSystem.playClick(620);
                      setBuildingType(type.id as typeof buildingType);
                    }}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition-all ${
                      buildingType === type.id
                        ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-bold shadow-md'
                        : 'bg-white/5 border-white/10 text-stone-400 hover:bg-white/10 hover:text-stone-200'
                    }`}
                  >
                    <span className="text-lg mb-1">{type.icon}</span>
                    <span>{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Area m2 Slider */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5">
              <div className="flex items-center justify-between mb-2">
                <label htmlFor={`${inputId}-area`} className="text-xs font-semibold text-white">
                  Superficie Lorda di Progetto
                </label>
                <span className="font-mono text-sm font-bold text-amber-300 bg-amber-400/10 px-2.5 py-0.5 rounded-lg border border-amber-400/30">
                  {areaM2.toLocaleString('it-IT')} m²
                </span>
              </div>
              <input
                id={`${inputId}-area`}
                type="range"
                min="100"
                max="10000"
                step="50"
                value={areaM2}
                onChange={(e) => setAreaM2(Number(e.target.value))}
                className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[10px] text-stone-500 font-mono mt-1">
                <span>100 m² (Piccolo)</span>
                <span>2.500 m²</span>
                <span>5.000 m²</span>
                <span>10.000 m² (Complesso)</span>
              </div>
            </div>

            {/* Level of Development (LOD) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block">
                  Livello di Dettaglio (LOD UNI 11337)
                </label>
                <span className="text-[10px] text-stone-400">Accuratezza geometrica & informativa</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'LOD_200', title: 'LOD 200', desc: 'Fattibilità / Masse' },
                  { id: 'LOD_300', title: 'LOD 300', desc: 'Progetto Definitivo' },
                  { id: 'LOD_400', title: 'LOD 400', desc: 'Esecutivo / Cantiere' },
                  { id: 'LOD_500', title: 'LOD 500', desc: 'As-Built / Facility' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      audioSystem.playClick(650);
                      setLod(item.id as typeof lod);
                    }}
                    className={`flex flex-col text-left p-2.5 rounded-xl border transition-all ${
                      lod === item.id
                        ? 'bg-amber-400/20 border-amber-400 text-amber-300 shadow-md'
                        : 'bg-white/5 border-white/10 text-stone-400 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-xs font-bold text-white">{item.title}</span>
                    <span className="text-[10px] text-stone-400 mt-0.5">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Disciplines & Services Checkboxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 space-y-2">
                <span className="text-xs font-bold text-stone-200 block mb-1">Discipline Coinvolte</span>
                <label className="flex items-center gap-2 text-xs text-stone-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeArch}
                    onChange={(e) => setIncludeArch(e.target.checked)}
                    className="rounded accent-amber-400 h-4 w-4"
                  />
                  <span>Modellazione Architettonica</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-stone-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeStruct}
                    onChange={(e) => setIncludeStruct(e.target.checked)}
                    className="rounded accent-amber-400 h-4 w-4"
                  />
                  <span>Modellazione Strutturale</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-stone-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeMEP}
                    onChange={(e) => setIncludeMEP(e.target.checked)}
                    className="rounded accent-amber-400 h-4 w-4"
                  />
                  <span>Impianti MEP (Mecc./Elettr./Idrico)</span>
                </label>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-3 space-y-2">
                <span className="text-xs font-bold text-stone-200 block mb-1">Moduli Speciali</span>
                <label className="flex items-center gap-2 text-xs text-stone-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={include5DCost}
                    onChange={(e) => setInclude5DCost(e.target.checked)}
                    className="rounded accent-amber-400 h-4 w-4"
                  />
                  <span>Computo 5D & WBS Dinamica</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-stone-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeClashDetection}
                    onChange={(e) => setIncludeClashDetection(e.target.checked)}
                    className="rounded accent-amber-400 h-4 w-4"
                  />
                  <span>Clash Detection & BCF Report</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Calculated ROI & Quotation Summary (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-amber-400/30 bg-gradient-to-b from-amber-500/10 via-stone-950 to-stone-950 p-4 sm:p-5">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Stima Economica Parametrica
                </span>
                <span className="text-[10px] font-mono text-stone-400">Aggiornato 2026</span>
              </div>

              <div className="mt-4 space-y-3">
                {/* Construction cost */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-400">Valore Stimato Costruzione Opere:</span>
                  <span className="font-mono font-bold text-stone-200">
                    € {estimatedConstructionCost.toLocaleString('it-IT')}
                  </span>
                </div>

                {/* BIM Service Estimate */}
                <div className="rounded-xl bg-amber-500/15 border border-amber-400/40 p-3">
                  <div className="text-[11px] font-semibold text-amber-300 mb-0.5">
                    Onorario Stimato Ingegneria BIM 5D
                  </div>
                  <div className="text-2xl font-black font-mono text-white">
                    € {estimatedBIMService.toLocaleString('it-IT')}
                  </div>
                  <div className="text-[10px] text-amber-200/80 mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>Consegna stimata: <strong>~{estimatedDays} giorni lavorativi</strong></span>
                  </div>
                </div>

                {/* ROI / Clash Detection Savings */}
                <div className="rounded-xl bg-emerald-500/15 border border-emerald-500/40 p-3">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-300 mb-0.5">
                    <span>Risparmio Risoluzione Interferenze</span>
                    <span className="bg-emerald-400 text-stone-950 text-[9px] font-bold px-1.5 py-0.2 rounded font-mono">
                      ROI +{netROI}%
                    </span>
                  </div>
                  <div className="text-xl font-black font-mono text-emerald-300">
                    € {estimatedClashSavings.toLocaleString('it-IT')}
                  </div>
                  <p className="text-[10px] text-emerald-200/80 mt-1 leading-tight">
                    La clash detection preventiva elimina fino al 90% delle varianti impreviste e ritardi in cantiere.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 pt-3 border-t border-white/10 space-y-2">
              <button
                type="button"
                id="btn-send-quote-email"
                onClick={handleSendToEmail}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-bold py-2.5 px-4 text-xs shadow-lg shadow-amber-500/30 transition-all active:scale-98"
              >
                <Mail className="h-4 w-4" />
                <span>Invia a Efrem Giannessi per Preventivo Ufficiale</span>
              </button>

              <button
                type="button"
                id="btn-copy-quote-summary"
                onClick={handleCopyQuote}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white py-2 px-3 text-xs font-semibold transition-all"
              >
                {isCopied ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Copiato negli Appunti!</span>
                  </>
                ) : (
                  <>
                    <Download className="h-3.5 w-3.5 text-stone-400" />
                    <span>Copia Scheda Sintesi Computo</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

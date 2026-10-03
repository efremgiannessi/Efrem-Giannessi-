import React from 'react';
import { 
  Smartphone, Building2, Calculator, Layers, FileSpreadsheet, 
  Sparkles, ArrowUpRight, HardHat, TrendingUp, ShieldCheck, Play,
  Cpu, CheckCircle2, Box
} from 'lucide-react';
import { audioSystem } from '../utils/audioSynthesizer';

interface BudgetCostPrecastSectionProps {
  onOpenMobileApp: () => void;
}

export const BudgetCostPrecastSection: React.FC<BudgetCostPrecastSectionProps> = ({
  onOpenMobileApp,
}) => {
  const handleLaunchClick = () => {
    audioSystem.playClick(850);
    onOpenMobileApp();
  };

  return (
    <section id="budget-cost-precast" className="relative py-16 md:py-24 px-6 md:px-12 border-t border-white/10 bg-[#07080c] overflow-hidden">
      {/* Background Ambience Glows */}
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Grid Overlay Texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2.5 font-mono text-xs text-cyan-400 uppercase tracking-widest mb-3">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
              <span>APPLICAZIONE PARAMETRICA MOBILE // STANDALONE APP</span>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase font-sans">
              Budget Cost <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">Precast</span>
            </h2>
            <p className="text-stone-400 max-w-2xl mt-4 text-sm md:text-base leading-relaxed">
              Software dedicato per la stima economica parametrica e il computo metrico estimativo 
              di strutture prefabbricate industriali in cemento armato (C.A.V. / C.A.P.). 
              Clicca per avviare il simulatore in modalità schermo smartphone Android interattivo.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleLaunchClick}
              onMouseEnter={() => audioSystem.playTechHover()}
              className="group relative inline-flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-stone-950 font-mono text-xs md:text-sm font-bold tracking-wider uppercase transition-all duration-300 hover:shadow-[0_0_35px_rgba(0,240,255,0.45)] hover:scale-[1.02] active:scale-[0.98] rounded-xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <Smartphone className="w-5 h-5 text-stone-950 animate-bounce" />
              <span className="relative z-10">Apri su Schermo Android</span>
              <ArrowUpRight className="w-4 h-4 text-stone-950 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Feature Grid with Interactive Smartphone Mockup */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Interactive Android Mockup Preview Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div 
              onClick={handleLaunchClick}
              onMouseEnter={() => audioSystem.playTechHover()}
              className="group relative cursor-pointer w-full max-w-[340px] transition-all duration-500 hover:-translate-y-2 select-none"
            >
              {/* Outer Glow on Hover */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-[44px] blur-lg opacity-40 group-hover:opacity-100 transition duration-500 group-hover:duration-200" />

              {/* Realistic Android Phone Mockup Frame */}
              <div className="relative bg-[#0d0e12] border-[5px] border-[#22242c] rounded-[40px] shadow-2xl overflow-hidden p-3.5">
                {/* Physical Phone Speaker & Camera Notch */}
                <div className="h-5 flex items-center justify-between px-3 text-[10px] text-stone-400 font-mono mb-2">
                  <span>12:45</span>
                  <div className="w-2.5 h-2.5 rounded-full bg-black ring-1 ring-stone-700 mx-auto" />
                  <span className="text-cyan-400 font-bold">5G 94%</span>
                </div>

                {/* Inner App Snapshot UI */}
                <div className="bg-slate-900 rounded-2xl p-3 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                        <Building2 className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-white leading-tight">Budget Cost Precast</div>
                        <div className="text-[9px] text-cyan-400 font-mono">MODALITÀ ANDROID</div>
                      </div>
                    </div>
                    <div className="text-[9px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
                      ATTIVO
                    </div>
                  </div>

                  {/* Mini KPI Cards */}
                  <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                    <div className="bg-slate-800/90 p-2 rounded-lg border border-slate-700/60">
                      <div className="text-[8px] text-slate-400">Totale Generale</div>
                      <div className="text-sm font-bold text-amber-400 font-mono">€ 425.436</div>
                    </div>
                    <div className="bg-slate-800/90 p-2 rounded-lg border border-slate-700/60">
                      <div className="text-[8px] text-slate-400">Incidenza / m²</div>
                      <div className="text-sm font-bold text-blue-400 font-mono">€ 244.5</div>
                    </div>
                  </div>

                  {/* Mini Items List Preview */}
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">
                      Voci Computo Metrico C.A.:
                    </div>
                    {[
                      { code: "PREF.01.04", name: "Plinti a bicchiere prefabbricati", cost: "€ 41.160" },
                      { code: "PREF.02.01", name: "Pilastri c.a.v. con pluviale", cost: "€ 59.160" },
                      { code: "PREF.02.03", name: "Travi boomerang c.a.p. L=24m", cost: "€ 33.600" },
                      { code: "PREF.02.07", name: "Tegoli TT di copertura c.a.p.", cost: "€ 87.696" },
                    ].map((row, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[9px] bg-slate-800/50 p-1.5 rounded border border-slate-700/40">
                        <span className="text-slate-300 truncate max-w-[140px]">{row.name}</span>
                        <span className="font-mono text-emerald-400 font-semibold">{row.cost}</span>
                      </div>
                    ))}
                  </div>

                  {/* Interactive Tap-to-Launch Overlay on Card */}
                  <div className="pt-2">
                    <div className="w-full py-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg text-white font-mono text-center text-[10px] font-bold tracking-wider uppercase shadow-md flex items-center justify-center gap-1.5 group-hover:scale-[1.02] transition-transform">
                      <Play className="w-3 h-3 fill-current text-white" />
                      <span>Tocca per Avviare Pop Up</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Gesture Pill Bar */}
                <div className="h-4 flex items-center justify-center mt-2">
                  <div className="w-20 h-1 bg-stone-600 rounded-full" />
                </div>
              </div>

              {/* Click floating badge */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-cyan-950/90 text-cyan-300 border border-cyan-400/80 px-3 py-1 rounded-full text-[10px] font-mono tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.4)] whitespace-nowrap">
                <Smartphone className="w-3 h-3 text-cyan-400 animate-pulse" />
                <span>CLICCA PER APRIRE L'APP POP UP</span>
              </div>
            </div>
          </div>

          {/* Right Column: Features and Architecture */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
              <h3 className="text-lg md:text-xl font-bold text-white mb-3 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-cyan-400" />
                <span>Architettura Parametrica & Funzionalità Chiave</span>
              </h3>
              <p className="text-xs md:text-sm text-stone-300 leading-relaxed mb-6">
                <strong>Budget Cost Precast</strong> unisce le formule dell'ingegneria strutturale 
                dei prefabbricati con l'analisi dei costi di cantiere, consentendo a tecnici, 
                imprese e committenti di stimare in tempo reale il budget per capannoni e poli logistici.
              </p>

              {/* 4 Detailed Feature Blocks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-stone-950/70 border border-stone-800 rounded-xl">
                  <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold mb-1.5">
                    <Box className="w-4 h-4" />
                    <span>Dimensionamento Parametrico</span>
                  </div>
                  <p className="text-stone-400 text-xs leading-relaxed">
                    Calcolo automatico di superficie, volume, numero di pilastri a bicchiere, 
                    travi boomerang e pannelli di tamponamento variando lunghezza, campate e passo.
                  </p>
                </div>

                <div className="p-4 bg-stone-950/70 border border-stone-800 rounded-xl">
                  <div className="flex items-center gap-2 text-blue-400 font-mono text-xs font-bold mb-1.5">
                    <Calculator className="w-4 h-4" />
                    <span>Prezzario C.A. Integrato</span>
                  </div>
                  <p className="text-stone-400 text-xs leading-relaxed">
                    Database prezzi unitari aggiornato con voci per scavi, plinti, pilastri c.a.v., 
                    coperture TT, manti in TPO, pavimentazioni al quarzo e serramenti industriali.
                  </p>
                </div>

                <div className="p-4 bg-stone-950/70 border border-stone-800 rounded-xl">
                  <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold mb-1.5">
                    <HardHat className="w-4 h-4" />
                    <span>Noli Autogru & Montaggio</span>
                  </div>
                  <p className="text-stone-400 text-xs leading-relaxed">
                    Stima automatizzata dei giorni di noleggio a caldo di autogru 200t e delle 
                    squadre specializzate di montatori in base alla massa e al numero di conci.
                  </p>
                </div>

                <div className="p-4 bg-stone-950/70 border border-stone-800 rounded-xl">
                  <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold mb-1.5">
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Export CSV & Quadro Economico</span>
                  </div>
                  <p className="text-stone-400 text-xs leading-relaxed">
                    Ripartizione automatica di oneri di sicurezza, spese tecniche e IVA, con 
                    esportazione con un clic in formato CSV compatibile con Microsoft Excel.
                  </p>
                </div>
              </div>

              {/* Bottom CTA trigger */}
              <div className="mt-6 pt-5 border-t border-stone-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-mono text-stone-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Compatibile con tutti i browser su desktop, tablet e smartphone</span>
                </div>

                <button
                  onClick={handleLaunchClick}
                  className="inline-flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 underline underline-offset-4 transition"
                >
                  <span>Apri il programma in pop up Android</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

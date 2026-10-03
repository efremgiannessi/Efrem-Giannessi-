import React, { useState, useMemo } from 'react';
import { 
  Building2, Calculator, Plus, Trash2, Download, Share2, 
  ChevronDown, ChevronUp, FileSpreadsheet, HardHat, Layers, ShieldCheck,
  Check, RefreshCw, AlertCircle, Sliders, DollarSign, Box, CheckCircle2,
  PieChart, ArrowRight, X
} from 'lucide-react';
import { audioSystem } from '../utils/audioSynthesizer';

// Categorie standard dell'ingegneria dei prefabbricati
export const CATEGORIES = [
  "01. Scavi, Fondazioni e Sottostrutture",
  "02. Strutture Prefabbricate in C.A.V. / C.A.P.",
  "03. Tamponamenti e Serramenti Industriali",
  "04. Coperture, Impermeabilizzazioni e Lucernari",
  "05. Pavimentazione Industriale e Opere Esterne",
  "06. Noli Autogru, Montaggi e Sicurezza Cantiere",
  "07. Spese Tecniche, Collaudi e Pratiche Sismiche"
];

// Prezzario di Riferimento Prefabbricati C.A.
export const PRICE_BOOK = [
  { code: "PREF.01.02", cat: CATEGORIES[0], desc: "Scavo a sezione obbligata per plinti a bicchiere e cordoli", unit: "m³", price: 14.50 },
  { code: "PREF.01.03", cat: CATEGORIES[0], desc: "Calcestruzzo magrone di sottofondazione C16/20 sp. 10 cm", unit: "m³", price: 115.00 },
  { code: "PREF.01.04", cat: CATEGORIES[0], desc: "Plinto a bicchiere prefabbricato in calcestruzzo C30/37", unit: "cad", price: 980.00 },
  { code: "PREF.01.06", cat: CATEGORIES[0], desc: "Cordoli e travi di collegamento antisismico tra plinti", unit: "m", price: 85.00 },
  { code: "PREF.02.01", cat: CATEGORIES[1], desc: "Pilastro prefabbricato c.a.v. 50x50 cm con pluviale integrato", unit: "m", price: 145.00 },
  { code: "PREF.02.02", cat: CATEGORIES[1], desc: "Pilastro c.a.v. 60x60 cm con mensole carroponte 5t/10t", unit: "m", price: 210.00 },
  { code: "PREF.02.03", cat: CATEGORIES[1], desc: "Trave a doppia pendenza a boomerang c.a.p. L=18-24m", unit: "cad", price: 4800.00 },
  { code: "PREF.02.07", cat: CATEGORIES[1], desc: "Tegoli alari / TT di copertura prefabbricati c.a.p. autoportanti", unit: "m²", price: 58.00 },
  { code: "PREF.03.01", cat: CATEGORIES[2], desc: "Pannello sandwich c.a. verticale sp. 20 cm graniglia lavata", unit: "m²", price: 88.00 },
  { code: "PREF.03.03", cat: CATEGORIES[2], desc: "Portone sezionale industriale motorizzato 4.00 x 4.50 m", unit: "cad", price: 3600.00 },
  { code: "PREF.04.01", cat: CATEGORIES[3], desc: "Manto sintetico impermeabilizzante TPO/FPO su isolante PIR 100mm", unit: "m²", price: 38.00 },
  { code: "PREF.04.03", cat: CATEGORIES[3], desc: "Lucernario zenitale centinato in policarbonato alveolare UV 16mm", unit: "m²", price: 95.00 },
  { code: "PREF.05.01", cat: CATEGORIES[4], desc: "Pavimento industriale in calcestruzzo al quarzo sp. 18 cm", unit: "m²", price: 36.50 },
  { code: "PREF.06.01", cat: CATEGORIES[5], desc: "Nolo a caldo autogru 200t per varo travi e pilastri prefabbricati", unit: "giorno", price: 2200.00 },
  { code: "PREF.06.02", cat: CATEGORIES[5], desc: "Squadra specializzata montaggio prefabbricati c.a.", unit: "giorno", price: 1600.00 },
  { code: "PREF.07.01", cat: CATEGORIES[6], desc: "Progettazione strutturale e calcoli sismici NTC 2018 al Genio Civile", unit: "a corpo", price: 6500.00 }
];

export interface ComputoItem {
  id: number;
  cat: string;
  code: string;
  desc: string;
  formula: string;
  qta: number;
  unit: string;
  prezzo: number;
}

export function BudgetCostPrecastApp({ isMobileFrame = false }: { isMobileFrame?: boolean }) {
  // Parametri Cantiere
  const [cantiere, setCantiere] = useState({
    nome: "Capannone Industriale Cavenago",
    committente: "Logistica Brianza Srl",
    lunghezza: 60,
    larghezza: 24,
    altezza: 8.5,
    campate: 1,
    passo: 10,
    carroponte: false,
    sicurezzaPerc: 3.0,
    tecnichePerc: 5.0,
    ivaPerc: 10.0
  });

  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBookItem, setSelectedBookItem] = useState(PRICE_BOOK[0].code);
  const [newItemQty, setNewItemQty] = useState<number>(1);
  const [copiedAlert, setCopiedAlert] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("TUTTE");

  // Calcolo Parametrico Struttura
  const superficie = cantiere.lunghezza * cantiere.larghezza;
  const volume = superficie * cantiere.altezza;
  const passi = Math.max(1, Math.round(cantiere.lunghezza / cantiere.passo));
  const numPilastri = (passi + 1) * (cantiere.campate + 1) + (cantiere.campate * 4);
  const numTravi = (passi + 1) * cantiere.campate;
  const supCopertura = superficie * 1.05;
  const perimetro = 2 * (cantiere.lunghezza + cantiere.larghezza);
  const supPannelli = perimetro * (cantiere.altezza + 1.2) * 0.92;
  const giorniGru = Math.max(3, Math.ceil((numPilastri + numTravi + supCopertura / 25) / 10));

  // Generatore voci basato sui parametri correnti
  const generateInitialVoci = (): ComputoItem[] => [
    { id: 1, cat: CATEGORIES[0], code: "PREF.01.02", desc: "Scavo per plinti a bicchiere", formula: `${numPilastri} plinti x 14.5 m³`, qta: Math.round(numPilastri * 14.5), unit: "m³", prezzo: 14.50 },
    { id: 2, cat: CATEGORIES[0], code: "PREF.01.04", desc: "Plinti a bicchiere prefabbricati c.a.", formula: `${numPilastri} pilastri`, qta: numPilastri, unit: "cad", prezzo: 980.00 },
    { id: 3, cat: CATEGORIES[1], code: "PREF.02.01", desc: cantiere.carroponte ? "Pilastro c.a.v. con mensole carroponte" : "Pilastro c.a.v. 50x50 cm con pluviale integrato", formula: `${numPilastri} pilastri x ${(cantiere.altezza + 1.2).toFixed(1)}m`, qta: Math.round(numPilastri * (cantiere.altezza + 1.2)), unit: "m", prezzo: cantiere.carroponte ? 210.00 : 145.00 },
    { id: 4, cat: CATEGORIES[1], code: "PREF.02.03", desc: `Travi boomerang c.a.p. campata L=${(cantiere.larghezza / cantiere.campate).toFixed(0)}m`, formula: `${numTravi} campate`, qta: numTravi, unit: "cad", prezzo: 4800.00 },
    { id: 5, cat: CATEGORIES[1], code: "PREF.02.07", desc: "Tegoli alari / TT di copertura prefabbricati", formula: `${supCopertura.toFixed(0)} m²`, qta: Math.round(supCopertura), unit: "m²", prezzo: 58.00 },
    { id: 6, cat: CATEGORIES[2], code: "PREF.03.01", desc: "Pannelli sandwich c.a. verticali graniglia", formula: `${supPannelli.toFixed(0)} m²`, qta: Math.round(supPannelli), unit: "m²", prezzo: 88.00 },
    { id: 7, cat: CATEGORIES[3], code: "PREF.04.01", desc: "Impermeabilizzazione TPO con isolamento 100mm", formula: `${supCopertura.toFixed(0)} m²`, qta: Math.round(supCopertura), unit: "m²", prezzo: 38.00 },
    { id: 8, cat: CATEGORIES[4], code: "PREF.05.01", desc: "Pavimento industriale elicotterata al quarzo", formula: `${superficie} m² calpestabili`, qta: Math.round(superficie), unit: "m²", prezzo: 36.50 },
    { id: 9, cat: CATEGORIES[5], code: "PREF.06.01", desc: "Nolo autogru 200t con operatore", formula: `${giorniGru} giorni stimati`, qta: giorniGru, unit: "giorno", prezzo: 2200.00 },
    { id: 10, cat: CATEGORIES[6], code: "PREF.07.01", desc: "Progettazione strutturale e calcoli sismici NTC", formula: "A corpo per deposito sismico", qta: 1, unit: "a corpo", prezzo: 6500.00 }
  ];

  // Voci di Computo Iniziali
  const [voci, setVoci] = useState<ComputoItem[]>(generateInitialVoci);

  // Calcoli Economici
  const totaleNetto = useMemo(() => voci.reduce((sum, v) => sum + (v.qta * v.prezzo), 0), [voci]);
  const oneriSicurezza = totaleNetto * (cantiere.sicurezzaPerc / 100);
  const speseTecniche = totaleNetto * (cantiere.tecnichePerc / 100);
  const imponibile = totaleNetto + oneriSicurezza + speseTecniche;
  const iva = imponibile * (cantiere.ivaPerc / 100);
  const totaleGenerale = imponibile + iva;
  const costoMq = superficie > 0 ? totaleNetto / superficie : 0;

  // Breakdown per categoria per grafici/percentuali
  const categoryBreakdown = useMemo(() => {
    return CATEGORIES.map((cat, idx) => {
      const items = voci.filter(v => v.cat === cat);
      const total = items.reduce((s, v) => s + (v.qta * v.prezzo), 0);
      const pct = totaleNetto > 0 ? (total / totaleNetto) * 100 : 0;
      return { cat, total, pct, count: items.length, color: ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1'][idx % 7] };
    });
  }, [voci, totaleNetto]);

  // Ricalcola voci parametriche automatiche
  const handleRecalculate = () => {
    audioSystem.playClick(680);
    setVoci(generateInitialVoci());
  };

  // Modifica quantità
  const handleUpdateQuantity = (id: number, val: number) => {
    const q = isNaN(val) ? 0 : Math.max(0, val);
    setVoci(prev => prev.map(v => v.id === id ? { ...v, qta: q } : v));
  };

  // Modifica prezzo
  const handleUpdatePrice = (id: number, val: number) => {
    const p = isNaN(val) ? 0 : Math.max(0, val);
    setVoci(prev => prev.map(v => v.id === id ? { ...v, prezzo: p } : v));
  };

  // Elimina voce
  const handleDeleteItem = (id: number) => {
    audioSystem.playClick(400);
    setVoci(prev => prev.filter(v => v.id !== id));
  };

  // Aggiungi nuova voce da elenco
  const handleAddItem = () => {
    const item = PRICE_BOOK.find(b => b.code === selectedBookItem);
    if (!item) return;

    audioSystem.playClick(820);
    const newEntry: ComputoItem = {
      id: Date.now(),
      cat: item.cat,
      code: item.code,
      desc: item.desc,
      formula: `Q.tà inserita a computo: ${newItemQty} ${item.unit}`,
      qta: Number(newItemQty) || 1,
      unit: item.unit,
      prezzo: item.price
    };

    setVoci(prev => [...prev, newEntry]);
    setShowAddModal(false);
    setNewItemQty(1);
  };

  // Esportazione CSV per Excel
  const esportaCsv = () => {
    audioSystem.playClick(900);
    let csv = "Categoria;Codice;Descrizione;Formula;Quantita;Unita;PrezzoUnitario;ImportoTotale\n";
    voci.forEach(v => {
      csv += `"${v.cat}";"${v.code}";"${v.desc}";"${v.formula}";${v.qta};"${v.unit}";${v.prezzo};${(v.qta * v.prezzo).toFixed(2)}\n`;
    });
    csv += `\n;;;TOTALE NETTO LAVORI;;;;"${totaleNetto.toFixed(2)}"\n`;
    csv += `;;;Oneri Sicurezza (${cantiere.sicurezzaPerc}%);;;;"${oneriSicurezza.toFixed(2)}"\n`;
    csv += `;;;Spese Tecniche e Pratiche (${cantiere.tecnichePerc}%);;;;"${speseTecniche.toFixed(2)}"\n`;
    csv += `;;;IMPONIBILE DI APPALTO;;;;"${imponibile.toFixed(2)}"\n`;
    csv += `;;;IVA (${cantiere.ivaPerc}%);;;;"${iva.toFixed(2)}"\n`;
    csv += `;;;TOTALE GENERALE (IVA INCL.);;;;"${totaleGenerale.toFixed(2)}"\n`;

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Computo_${cantiere.nome.replace(/\s+/g, "_")}.csv`;
    link.click();
  };

  // Condivisione o copia riepilogo
  const handleShareSummary = () => {
    audioSystem.playClick(720);
    const text = `COMPUTO PREFABBRICATI C.A. - BUDGET COST PRECAST
Cantiere: ${cantiere.nome}
Committente: ${cantiere.committente}
Dimensioni: ${cantiere.lunghezza}m x ${cantiere.larghezza}m x H ${cantiere.altezza}m (${superficie.toLocaleString('it-IT')} m² - ${volume.toLocaleString('it-IT')} m³)
Elementi: ${numPilastri} Pilastri | ${numTravi} Travi Boomerang | ${giorniGru} gg Autogru

• Netto Lavori: € ${totaleNetto.toLocaleString('it-IT', { maximumFractionDigits: 0 })}
• Oneri Sicurezza (${cantiere.sicurezzaPerc}%): € ${oneriSicurezza.toLocaleString('it-IT', { maximumFractionDigits: 0 })}
• Spese Tecniche (${cantiere.tecnichePerc}%): € ${speseTecniche.toLocaleString('it-IT', { maximumFractionDigits: 0 })}
• TOTALE GENERALE (IVA ${cantiere.ivaPerc}% incl.): € ${totaleGenerale.toLocaleString('it-IT', { maximumFractionDigits: 0 })}
• Incidenza Parametrica: € ${costoMq.toFixed(1)} / m² (${(costoMq / cantiere.altezza).toFixed(1)} €/m³)

Software Budget Cost Precast`;

    navigator.clipboard.writeText(text).then(() => {
      setCopiedAlert(true);
      setTimeout(() => setCopiedAlert(false), 2500);
    });
  };

  const toggleCategory = (cat: string) => {
    audioSystem.playClick(500);
    setCollapsedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const filteredCategories = filterCategory === "TUTTE" 
    ? CATEGORIES 
    : CATEGORIES.filter(c => c === filterCategory);

  return (
    <div className={`min-h-full bg-slate-900 text-slate-100 font-sans ${isMobileFrame ? 'p-3 text-xs' : 'p-4 md:p-8 text-sm'} select-text`}>
      {/* Top Navbar */}
      <header className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-4 mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20 text-white shrink-0">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                Budget Cost Precast
              </h1>
              <span className="hidden sm:inline-block bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-mono px-2 py-0.5 rounded font-semibold">
                PREFABBRICATI C.A.
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Stima costi industriali & opere complementari (C.A.V. / C.A.P.)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleShareSummary}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg text-xs font-semibold transition border border-slate-700 shadow"
            title="Copia riepilogo negli appunti"
          >
            {copiedAlert ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span className="hidden sm:inline">Condividi</span>
          </button>
          <button 
            onClick={esportaCsv} 
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition shadow shadow-emerald-950/40 text-white"
          >
            <FileSpreadsheet className="w-4 h-4" /> 
            <span>Esporta Excel / CSV</span>
          </button>
        </div>
      </header>

      {copiedAlert && (
        <div className="mb-4 py-2 px-3 bg-emerald-950/80 border border-emerald-500/60 rounded-xl text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Riepilogo preventivo copiato negli appunti con successo!</span>
        </div>
      )}

      {/* KPI Cards Row (Exact Match to ComputoPrefabbricatiWebApp) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-xl shadow-sm">
          <span className="text-xs text-slate-400 block truncate">Totale Generale (IVA incl.)</span>
          <div className="text-xl md:text-2xl font-bold text-amber-400 mt-1 font-sans">
            € {totaleGenerale.toLocaleString('it-IT', { maximumFractionDigits: 0 })}
          </div>
          <span className="text-xs text-emerald-400 font-medium block mt-1 truncate">
            Netto lavori: € {totaleNetto.toLocaleString('it-IT', { maximumFractionDigits: 0 })}
          </span>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-xl shadow-sm">
          <span className="text-xs text-slate-400 block truncate">Incidenza Parametrica</span>
          <div className="text-xl md:text-2xl font-bold text-blue-400 mt-1 font-sans">
            € {costoMq.toFixed(1)} / m²
          </div>
          <span className="text-xs text-slate-400 block mt-1 truncate">
            {(costoMq / (cantiere.altezza || 1)).toFixed(1)} €/m³ v.p.p.
          </span>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-xl shadow-sm">
          <span className="text-xs text-slate-400 block truncate">Superficie Coperta</span>
          <div className="text-xl md:text-2xl font-bold text-slate-100 mt-1 font-sans">
            {superficie.toLocaleString('it-IT')} m²
          </div>
          <span className="text-xs text-slate-400 block mt-1 truncate">
            {cantiere.lunghezza} x {cantiere.larghezza} m (H {cantiere.altezza}m)
          </span>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-xl shadow-sm">
          <span className="text-xs text-slate-400 block truncate">Elementi Strutturali</span>
          <div className="text-xl md:text-2xl font-bold text-cyan-400 mt-1 font-sans">
            {numPilastri} Pil / {numTravi} Trv
          </div>
          <span className="text-xs text-slate-400 block mt-1 truncate">
            ~{giorniGru} gg gru • {passi} passi
          </span>
        </div>
      </div>

      {/* Main Grid: Parameters on Left, Computo & Summary on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Parametri Cantiere */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card Parametri Cantiere */}
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 md:p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/60 mb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-white text-sm">Parametri Cantiere</h3>
              </div>
              <button
                onClick={handleRecalculate}
                title="Ricalcola le quantità in base ai parametri geometrici"
                className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-medium transition"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Ricalcola</span>
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Nome Cantiere / Opera</label>
                <input
                  type="text"
                  value={cantiere.nome}
                  onChange={e => setCantiere({ ...cantiere, nome: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-cyan-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Committente</label>
                <input
                  type="text"
                  value={cantiere.committente}
                  onChange={e => setCantiere({ ...cantiere, committente: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-cyan-400 outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Lunghezza (m)</label>
                  <input
                    type="number"
                    min="6"
                    step="1"
                    value={cantiere.lunghezza}
                    onChange={e => setCantiere({ ...cantiere, lunghezza: Math.max(1, parseFloat(e.target.value) || 0) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-cyan-300 font-mono focus:border-cyan-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Larghezza (m)</label>
                  <input
                    type="number"
                    min="6"
                    step="1"
                    value={cantiere.larghezza}
                    onChange={e => setCantiere({ ...cantiere, larghezza: Math.max(1, parseFloat(e.target.value) || 0) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-cyan-300 font-mono focus:border-cyan-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Altezza (m)</label>
                  <input
                    type="number"
                    min="4"
                    step="0.5"
                    value={cantiere.altezza}
                    onChange={e => setCantiere({ ...cantiere, altezza: Math.max(1, parseFloat(e.target.value) || 0) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-cyan-300 font-mono focus:border-cyan-400 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Campate</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={cantiere.campate}
                    onChange={e => setCantiere({ ...cantiere, campate: Math.max(1, parseInt(e.target.value) || 1) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono focus:border-cyan-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Passo Pilastri (m)</label>
                  <input
                    type="number"
                    min="4"
                    max="20"
                    step="0.5"
                    value={cantiere.passo}
                    onChange={e => setCantiere({ ...cantiere, passo: Math.max(1, parseFloat(e.target.value) || 1) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono focus:border-cyan-400 outline-none"
                  />
                </div>
              </div>

              {/* Checkbox Carroponte */}
              <label className="flex items-center gap-2 p-2 bg-slate-900/60 rounded-lg border border-slate-700/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cantiere.carroponte}
                  onChange={e => setCantiere({ ...cantiere, carroponte: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-0 focus:outline-none"
                />
                <span className="text-slate-300 font-medium">Predisposizione Carroponte (Mensole 5t/10t)</span>
              </label>

              {/* Parametri Economici */}
              <div className="pt-2 border-t border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Oneri Sicurezza:</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="15"
                      step="0.5"
                      value={cantiere.sicurezzaPerc}
                      onChange={e => setCantiere({ ...cantiere, sicurezzaPerc: parseFloat(e.target.value) || 0 })}
                      className="w-14 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-right font-mono text-white focus:border-cyan-400 outline-none"
                    />
                    <span className="text-slate-400">%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Spese Tecniche & Collaudi:</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="20"
                      step="0.5"
                      value={cantiere.tecnichePerc}
                      onChange={e => setCantiere({ ...cantiere, tecnichePerc: parseFloat(e.target.value) || 0 })}
                      className="w-14 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-right font-mono text-white focus:border-cyan-400 outline-none"
                    />
                    <span className="text-slate-400">%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Aliquota IVA:</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="25"
                      step="1"
                      value={cantiere.ivaPerc}
                      onChange={e => setCantiere({ ...cantiere, ivaPerc: parseFloat(e.target.value) || 0 })}
                      className="w-14 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-right font-mono text-amber-300 focus:border-cyan-400 outline-none"
                    />
                    <span className="text-slate-400">%</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleRecalculate}
                className="w-full mt-2 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2 shadow"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Aggiorna Computo da Parametri
              </button>
            </div>
          </div>

          {/* Ripartizione Spesa per Categorie */}
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 md:p-5 shadow-sm">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-cyan-400" />
              <span>Incidenza per Capitolo</span>
            </h4>

            <div className="space-y-2.5">
              {categoryBreakdown.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300 truncate max-w-[200px]" title={item.cat}>
                      {item.cat.split('. ')[1] || item.cat}
                    </span>
                    <span className="font-mono font-semibold text-slate-200">
                      {item.pct.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-700/60 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, item.pct)}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Voci di Computo & Quadro Economico */}
        <div className="lg:col-span-8 space-y-6">
          {/* Header Barra Computo */}
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-400" />
              <div>
                <h3 className="font-bold text-white text-sm md:text-base leading-tight">
                  Voci di Computo Metrico
                </h3>
                <span className="text-xs text-slate-400">
                  {voci.length} voci registrate a sistema
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Filtro per categoria */}
              <select
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:border-cyan-400 outline-none"
              >
                <option value="TUTTE">Tutte le Categorie ({CATEGORIES.length})</option>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>
                    {c.substring(0, 32)}...
                  </option>
                ))}
              </select>

              <button
                onClick={() => {
                  audioSystem.playClick(650);
                  setShowAddModal(true);
                }}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Aggiungi Voce</span>
              </button>
            </div>
          </div>

          {/* Voci Grouped By Category (Collapsible Accordions) */}
          <div className="space-y-4">
            {filteredCategories.map(category => {
              const catVoci = voci.filter(v => v.cat === category);
              if (catVoci.length === 0) return null;

              const catTotal = catVoci.reduce((sum, v) => sum + (v.qta * v.prezzo), 0);
              const isCollapsed = !!collapsedCategories[category];

              return (
                <div key={category} className="bg-slate-800/90 border border-slate-700/70 rounded-xl overflow-hidden shadow-sm">
                  {/* Category Banner */}
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full px-4 py-3 bg-slate-800 hover:bg-slate-750 flex items-center justify-between transition text-left border-b border-slate-700/40"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      {isCollapsed ? (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronUp className="w-4 h-4 text-cyan-400 shrink-0" />
                      )}
                      <span className="font-bold text-xs sm:text-sm text-slate-200 truncate">
                        {category}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs sm:text-sm font-mono font-bold text-emerald-400">
                        € {catTotal.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      <span className="text-[10px] text-slate-400 bg-slate-700/70 px-2 py-0.5 rounded font-mono">
                        {catVoci.length} voci
                      </span>
                    </div>
                  </button>

                  {/* Voci Items List */}
                  {!isCollapsed && (
                    <div className="divide-y divide-slate-700/50">
                      {catVoci.map(v => {
                        const itemTotal = v.qta * v.prezzo;
                        return (
                          <div key={v.id} className="p-3.5 hover:bg-slate-750/40 transition">
                            <div className="flex items-start justify-between gap-3 mb-1.5">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-[10px] font-mono bg-blue-950/80 text-blue-300 border border-blue-800/40 px-2 py-0.5 rounded font-semibold">
                                    {v.code}
                                  </span>
                                  <span className="text-xs sm:text-sm font-semibold text-white">
                                    {v.desc}
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-400 font-mono italic">
                                  Formula: {v.formula}
                                </div>
                              </div>

                              <button
                                onClick={() => handleDeleteItem(v.id)}
                                title="Rimuovi voce dal computo"
                                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-950/40 rounded transition shrink-0"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Responsive Quantity & Price Row */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 mt-1 border-t border-slate-700/40 text-xs">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-slate-400 text-[11px]">Quantità:</span>
                                  <input
                                    type="number"
                                    min="0"
                                    step="any"
                                    value={v.qta}
                                    onChange={e => handleUpdateQuantity(v.id, parseFloat(e.target.value))}
                                    className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-cyan-300 font-mono text-right focus:border-cyan-400 outline-none"
                                  />
                                  <span className="text-slate-400 font-mono">{v.unit}</span>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  <span className="text-slate-400 text-[11px]">Prezzo:</span>
                                  <input
                                    type="number"
                                    min="0"
                                    step="any"
                                    value={v.prezzo}
                                    onChange={e => handleUpdatePrice(v.id, parseFloat(e.target.value))}
                                    className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 font-mono text-right focus:border-cyan-400 outline-none"
                                  />
                                  <span className="text-slate-400">€</span>
                                </div>
                              </div>

                              <div className="text-right">
                                <span className="text-slate-400 text-[10px] mr-2">Importo Totale:</span>
                                <span className="text-xs sm:text-sm font-bold font-mono text-white">
                                  € {itemTotal.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quadro Economico Riassuntivo (Exact Structure) */}
          <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-5 shadow-lg">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase tracking-wider mb-4 pb-3 border-b border-slate-700">
              <ShieldCheck className="w-5 h-5" />
              <span>Quadro Economico e Spesa Complessiva di Progetto</span>
            </div>

            <div className="space-y-2 text-xs sm:text-sm font-mono">
              <div className="flex justify-between text-slate-300 py-1">
                <span>A. Totale Netto Lavori Strutture & Finiture:</span>
                <span className="font-semibold text-white">
                  € {totaleNetto.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between text-slate-400 text-xs py-0.5">
                <span>B. Oneri della Sicurezza non soggetti a ribasso ({cantiere.sicurezzaPerc}%):</span>
                <span>
                  € {oneriSicurezza.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between text-slate-400 text-xs py-0.5">
                <span>C. Spese Tecniche, Collaudi e Deposito Sismico ({cantiere.tecnichePerc}%):</span>
                <span>
                  € {speseTecniche.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between text-cyan-300 pt-2 border-t border-slate-700 font-semibold">
                <span>Totale Imponibile Appalto (A + B + C):</span>
                <span>
                  € {imponibile.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between text-slate-400 text-xs py-0.5">
                <span>D. I.V.A. di Legge ({cantiere.ivaPerc}%):</span>
                <span>
                  € {iva.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between text-amber-400 pt-3 border-t-2 border-slate-700 text-base sm:text-lg font-black">
                <span>TOTALE GENERALE COMMESSA (IVA INCLUSA):</span>
                <span>
                  € {totaleGenerale.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Aggiungi Voce da Prezzario */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-400" />
                Aggiungi Voce da Prezzario Prefabbricati
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Seleziona Voce da Listino</label>
                <select
                  value={selectedBookItem}
                  onChange={e => setSelectedBookItem(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-white focus:border-cyan-400 outline-none"
                >
                  {PRICE_BOOK.map(b => (
                    <option key={b.code} value={b.code}>
                      [{b.code}] {b.desc} (€{b.price}/{b.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Quantità da computare</label>
                <input
                  type="number"
                  min="0.1"
                  step="any"
                  value={newItemQty}
                  onChange={e => setNewItemQty(parseFloat(e.target.value) || 1)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-cyan-400 outline-none"
                />
              </div>

              {/* Dettaglio voce selezionata */}
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-xs">
                {(() => {
                  const sel = PRICE_BOOK.find(b => b.code === selectedBookItem);
                  if (!sel) return null;
                  return (
                    <div className="space-y-1.5">
                      <div className="text-[10px] text-cyan-400 font-mono uppercase">{sel.cat}</div>
                      <div className="text-white font-medium">{sel.desc}</div>
                      <div className="flex justify-between text-slate-300 font-mono pt-1 border-t border-slate-700">
                        <span>Prezzo unitario: €{sel.price.toFixed(2)} / {sel.unit}</span>
                        <span className="text-emerald-400 font-bold">
                          Totale: €{(sel.price * newItemQty).toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white text-xs transition"
                >
                  Annulla
                </button>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition shadow"
                >
                  Inserisci nel Computo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

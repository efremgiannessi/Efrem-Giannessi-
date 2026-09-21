import React, { useState } from 'react';
import {
  Terminal,
  Code2,
  Cpu,
  Layers,
  Play,
  Copy,
  Check,
  Workflow,
  Sparkles,
  FileCode,
  FolderTree,
  ExternalLink,
} from 'lucide-react';
import { audioSystem } from '../utils/audioSynthesizer';

interface PyRevitPythonSectionProps {
  onOpenTerminalModal: () => void;
}

export const PyRevitPythonSection: React.FC<PyRevitPythonSectionProps> = ({
  onOpenTerminalModal,
}) => {
  const [selectedScript, setSelectedScript] = useState<'qto' | 'clash' | 'ribbon'>('qto');
  const [copied, setCopied] = useState(false);

  const scriptsData = {
    qto: {
      id: 'qto',
      filename: 'AutoQTO_QuantitiesExtractor.py',
      title: 'Estrazione Automatica Quantità (QTO 5D)',
      category: 'ESTRAZIONE DATI & PREZZARI',
      description:
        'Scansiona le stratigrafie murarie, pavimenti e solai in Revit, estraendo volumi netti, superfici e computi metrici WBS con associazione automatica a codici prezzario regionale.',
      code: `import clr
clr.AddReference('RevitAPI')
clr.AddReference('RevitServices')
from Autodesk.Revit.DB import *
from pyrevit import revit, script

doc = revit.doc
output = script.get_output()

# Raccoglie tutti i muri di progetto
collector = FilteredElementCollector(doc)\\
    .OfCategory(BuiltInCategory.OST_Walls)\\
    .WhereElementIsNotElementType()

output.print_md("### 📊 ESTRAZIONE AUTOMATICA QUANTITÀ STRATIGRAFICHE")
tot_volume = 0.0
tot_surface = 0.0

for wall in collector:
    wall_type = doc.GetElement(wall.GetTypeId())
    volume_param = wall.get_Parameter(BuiltInParameter.HOST_VOLUME_COMPUTED)
    area_param = wall.get_Parameter(BuiltInParameter.HOST_AREA_COMPUTED)
    
    vol_m3 = volume_param.AsDouble() * 0.0283168 if volume_param else 0.0
    area_m2 = area_param.AsDouble() * 0.092903 if area_param else 0.0
    
    tot_volume += vol_m3
    tot_surface += area_m2

output.print_md("**Totale Calcestruzzo / Murature:** \`{:.2f} m³\`".format(tot_volume))
output.print_md("**Superficie Intonaci / Finiture:** \`{:.2f} m²\`".format(tot_surface))
output.print_md("✅ Esportazione tabella computo pronta per importazione ERP.")`,
    },
    clash: {
      id: 'clash',
      filename: 'ClashMatrix_Auditor.py',
      title: 'Auditing Geometrico & Clash Detection',
      category: 'QUALITÀ & CONTROLLO BIM',
      description:
        'Individua in tempo reale le interferenze geometriche tra condotte/tubazioni MEP e strutture in c.a., catalogando le coordinate dei punti di collisione e generando il report BCF.',
      code: `import clr
clr.AddReference('RevitAPI')
from Autodesk.Revit.DB import *
from pyrevit import revit, script

doc = revit.doc
output = script.get_output()

# Selezione elementi strutturali e tubazioni MEP
walls = FilteredElementCollector(doc).OfCategory(BuiltInCategory.OST_Walls).WhereElementIsNotElementType().ToElements()
pipes = FilteredElementCollector(doc).OfCategory(BuiltInCategory.OST_PipeCurves).WhereElementIsNotElementType().ToElements()

output.print_md("### ⚡ ANALISI INTERSEZIONI MEP <-> STRUTTURA")
clashes = 0

for pipe in pipes:
    bb = pipe.get_BoundingBox(doc.ActiveView)
    if not bb: continue
    outline = Outline(bb.Min, bb.Max)
    filter_box = BoundingBoxIntersectsFilter(outline)
    
    colliding = FilteredElementCollector(doc).OfCategory(BuiltInCategory.OST_Walls).WherePasses(filter_box).ToElements()
    for w in colliding:
        clashes += 1
        output.print_md("⚠️ **Clash #{:02d}**: Tubo Id \`{}\` interseca Parete Id \`{}\`".format(clashes, pipe.Id, w.Id))

output.print_md("**Audit concluso**: {} interferenze rilevate.".format(clashes))`,
    },
    ribbon: {
      id: 'ribbon',
      filename: 'ExtensionManifest_Ribbon.py',
      title: 'Creazione Ribbon & Toolbar Personalizzata',
      category: 'UI/UX AUTODESK REVIT',
      description:
        'Strutturazione di estensioni native pyRevit (.extension): definizione di tab dedicate, pannelli personalizzati, menu a tendina e pulsanti con icone vettoriali per i collaboratori dello studio.',
      code: `# Struttura Directory Extension pyRevit:
# EfremGiannessi.extension/
# └── EfremTools.tab/
#     ├── Computi.panel/
#     │   └── CalcolaQTO.pushbutton/
#     │       ├── bundle.yaml
#     │       ├── icon.png
#     │       └── script.py
#     └── QualitaBIM.panel/
#         └── AuditClash.pushbutton/
#             ├── bundle.yaml
#             └── script.py

# bundle.yaml esempio:
title: "Calcola QTO WBS"
tooltip: "Estrae quantità metriche e le collega al listino prezzi regionale"
author: "Efrem Giannessi"
min_revit_ver: 2022
max_revit_ver: 2026`,
    },
  };

  const current = scriptsData[selectedScript];

  const handleCopyCode = () => {
    audioSystem.playChime();
    navigator.clipboard.writeText(current.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const capabilities = [
    {
      icon: <Terminal className="w-5 h-5 text-cyan-400" />,
      title: 'Automazioni Revit API con Python',
      description:
        'Sviluppo di script su misura per interagire direttamente con il database di Autodesk Revit: manipolazione elementi, calcolo parametri e aggiornamento automatico dei dati di commessa.',
      tag: 'REVIT API // CPYTHON & IRONPYTHON',
    },
    {
      icon: <FolderTree className="w-5 h-5 text-purple-400" />,
      title: 'Estensioni e Ribbon Toolbar Custom',
      description:
        'Creazione di pacchetti estensione (.extension) con pulsanti, tab, menu a tendina e icone dedicate nella barra superiore di Revit per ottimizzare i flussi di lavoro di studi e team.',
      tag: 'UI AUTOMATION & PYREVIT TOOLBARS',
    },
    {
      icon: <Workflow className="w-5 h-5 text-emerald-400" />,
      title: 'Batch Processing & Quality Check (BIM Audit)',
      description:
        'Routine automatizzate per il controllo qualità dei modelli: verifica clash, rinomina massiva viste e tavole, controllo parametri di sicurezza e validazione conformità WBS.',
      tag: 'QUALITY AUDIT & BATCH TASKS',
    },
    {
      icon: <Cpu className="w-5 h-5 text-amber-400" />,
      title: 'Integrazione Dati, Excel ed ERP',
      description:
        'Ponti informativi bidirezionali tra geometrie Revit e gestionali aziendali: esportazione di computi metrici istantanei e aggiornamento automatico di listini prezzi in formato JSON/CSV/XLSX.',
      tag: 'DATA PIPELINE & ERP SYNC',
    },
  ];

  return (
    <section
      id="pyrevit-python"
      className="py-24 px-6 md:px-16 select-none relative z-10 border-t border-white/10"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-6 mb-16 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-purple-400 uppercase tracking-widest mb-2">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span>AUTOMAZIONE REVIT SDK // CODICE & SCRIPTING AVANZATO</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight">
              SVILUPPO APPLICAZIONI pyREVIT CON PYTHON
            </h2>
          </div>

          <div className="font-mono text-xs text-white/50 text-left md:text-right max-w-md">
            Sviluppo di script, tool personalizzati ed estensioni native pyRevit in Python
            per automatizzare la progettazione BIM, i computi metrici e il controllo qualità.
          </div>
        </div>

        {/* Interactive Code IDE / Script Showcase */}
        <div className="bg-stone-950/80 border border-purple-500/30 backdrop-blur-md overflow-hidden mb-12 shadow-[0_15px_45px_rgba(0,0,0,0.7)]">
          {/* Top Bar of the Code Box */}
          <div className="p-4 md:px-6 bg-black/60 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <span className="text-white/40">|</span>
              <span className="text-purple-400 font-bold">{current.filename}</span>
              <span className="px-2 py-0.5 bg-purple-950/60 border border-purple-400/40 text-[10px] text-purple-300">
                Python 3 / IronPython
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Copy Code Button */}
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/15 text-white/80 hover:text-white transition-colors"
                title="Copia frammento di codice"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[11px]">{copied ? 'Copiato!' : 'Copia Script'}</span>
              </button>

              {/* Launch Simulator Button */}
              <button
                onClick={() => {
                  audioSystem.playClick(850);
                  onOpenTerminalModal();
                }}
                className="flex items-center gap-2 px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)]"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span className="text-[11px] uppercase tracking-wider">Simula Esecuzione</span>
              </button>
            </div>
          </div>

          {/* Script Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10 bg-black/40 border-b border-white/10 font-mono text-xs">
            {(Object.keys(scriptsData) as Array<keyof typeof scriptsData>).map((key) => {
              const item = scriptsData[key];
              const isSelected = selectedScript === key;
              return (
                <button
                  key={key}
                  onClick={() => {
                    audioSystem.playClick(680);
                    setSelectedScript(key);
                  }}
                  className={`p-4 text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-purple-950/30 border-l-2 md:border-l-0 md:border-t-2 border-purple-400'
                      : 'hover:bg-white/5 opacity-60 hover:opacity-100'
                  }`}
                >
                  <span className="text-[10px] text-purple-400 uppercase tracking-widest block mb-1">
                    {item.category}
                  </span>
                  <h4 className="font-bold text-white text-sm">{item.title}</h4>
                </button>
              );
            })}
          </div>

          {/* Script Code Viewer */}
          <div className="p-6 bg-[#0a0a0f] overflow-x-auto text-xs font-mono leading-relaxed border-b border-white/10">
            <pre className="text-purple-200/90 font-mono">
              <code>{current.code}</code>
            </pre>
          </div>

          {/* Script Metadata Footer */}
          <div className="p-4 md:px-6 bg-black/50 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <div className="text-white/60 font-sans text-xs max-w-xl">
              <strong className="text-purple-300 font-mono">FUNZIONE: </strong>
              {current.description}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 bg-white/5 border border-white/10 text-white/60 text-[10px]">
                Autodesk Revit API
              </span>
              <span className="px-2.5 py-1 bg-white/5 border border-white/10 text-white/60 text-[10px]">
                pyRevit Core
              </span>
              <span className="px-2.5 py-1 bg-purple-950/40 border border-purple-400/30 text-purple-300 text-[10px]">
                WPF / XAML Ready
              </span>
            </div>
          </div>
        </div>

        {/* 4 Pillars of pyRevit Application Development */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {capabilities.map((cap, idx) => (
            <div
              key={idx}
              onMouseEnter={() => audioSystem.playTechHover()}
              className="p-6 bg-stone-950/40 border border-white/10 hover:border-purple-400 transition-all group backdrop-blur-[2px] shadow-[0_6px_25px_rgba(0,0,0,0.5)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[10px] text-purple-400 uppercase tracking-widest font-bold">
                    {cap.tag}
                  </span>
                  <div className="p-2 border border-white/10 bg-white/5 group-hover:border-purple-400/50 transition-colors">
                    {cap.icon}
                  </div>
                </div>

                <h3 className="font-mono text-base font-bold text-white mb-2 tracking-wide">
                  {cap.title}
                </h3>

                <p className="font-sans text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
                  {cap.description}
                </p>
              </div>

              <div className="pt-4 mt-6 border-t border-white/10 flex items-center justify-between font-mono text-[11px] text-white/40 group-hover:text-purple-300 transition-colors">
                <span>Algoritmo Verificato</span>
                <span className="text-purple-400">100% Revit Native</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

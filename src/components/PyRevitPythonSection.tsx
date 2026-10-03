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
        'Scansiona le stratigrafie murarie e i solai Revit, estraendo volumi e superfici associati a prezzari regionali.',
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

tot_volume = 0.0
tot_surface = 0.0

for wall in collector:
    volume_param = wall.get_Parameter(BuiltInParameter.HOST_VOLUME_COMPUTED)
    area_param = wall.get_Parameter(BuiltInParameter.HOST_AREA_COMPUTED)
    vol_m3 = volume_param.AsDouble() * 0.0283168 if volume_param else 0.0
    area_m2 = area_param.AsDouble() * 0.092903 if area_param else 0.0
    tot_volume += vol_m3
    tot_surface += area_m2

output.print_md("**Totale Murature / C.A.:** \`{:.2f} m³\`".format(tot_volume))
output.print_md("**Superficie Finiture:** \`{:.2f} m²\`".format(tot_surface))`,
    },
    clash: {
      id: 'clash',
      filename: 'ClashMatrix_Auditor.py',
      title: 'Auditing Geometrico & Clash Detection',
      category: 'QUALITÀ & CONTROLLO BIM',
      description:
        'Rileva interferenze geometriche tra tubazioni MEP e strutture in c.a. con catalogazione punti di collisione.',
      code: `import clr
clr.AddReference('RevitAPI')
from Autodesk.Revit.DB import *
from pyrevit import revit, script

doc = revit.doc
output = script.get_output()

walls = FilteredElementCollector(doc).OfCategory(BuiltInCategory.OST_Walls).WhereElementIsNotElementType().ToElements()
pipes = FilteredElementCollector(doc).OfCategory(BuiltInCategory.OST_PipeCurves).WhereElementIsNotElementType().ToElements()

clashes = 0
for pipe in pipes:
    bb = pipe.get_BoundingBox(doc.ActiveView)
    if not bb: continue
    outline = Outline(bb.Min, bb.Max)
    filter_box = BoundingBoxIntersectsFilter(outline)
    colliding = FilteredElementCollector(doc).OfCategory(BuiltInCategory.OST_Walls).WherePasses(filter_box).ToElements()
    for w in colliding:
        clashes += 1
        output.print_md("⚠️ **Clash #{:02d}**: Tubo \`{}\` interseca Muro \`{}\`".format(clashes, pipe.Id, w.Id))

output.print_md("Audit concluso: {} interferenze.".format(clashes))`,
    },
    ribbon: {
      id: 'ribbon',
      filename: 'ExtensionManifest_Ribbon.py',
      title: 'Creazione Ribbon & Toolbar Personalizzata',
      category: 'UI/UX AUTODESK REVIT',
      description:
        'Definizione di tab, pannelli personalizzati, menu e pulsanti vettoriali nativi per pyRevit.',
      code: `# Struttura Directory Extension pyRevit:
# EfremGiannessi.extension/
# └── EfremTools.tab/
#     ├── Computi.panel/
#     │   └── CalcolaQTO.pushbutton/
#     │       ├── bundle.yaml
#     │       └── script.py
#     └── QualitaBIM.panel/
#         └── AuditClash.pushbutton/

# bundle.yaml:
title: "Calcola QTO WBS"
tooltip: "Estrae quantità metriche e le collega al listino prezzi"
author: "Efrem Giannessi"
min_revit_ver: 2022`,
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
      icon: <Terminal className="w-4 h-4 text-cyan-400" />,
      title: 'Revit API & Python',
      description: 'Script su misura per manipolazione elementi e aggiornamento parametri di commessa.',
      tag: 'REVIT API',
    },
    {
      icon: <FolderTree className="w-4 h-4 text-purple-400" />,
      title: 'Toolbar & Ribbon',
      description: 'Pacchetti estensione (.extension) con tab, pulsanti e icone personalizzate in Revit.',
      tag: 'UI PYREVIT',
    },
    {
      icon: <Workflow className="w-4 h-4 text-emerald-400" />,
      title: 'BIM Audit & Batch',
      description: 'Controllo clash, rinomina massiva viste e validazione conformità parametri.',
      tag: 'BATCH AUDIT',
    },
    {
      icon: <Cpu className="w-4 h-4 text-amber-400" />,
      title: 'Export ERP & Excel',
      description: 'Ponti dati bidirezionali per esportazione computi e listini prezzi JSON/CSV/XLSX.',
      tag: 'ERP PIPELINE',
    },
  ];

  return (
    <section
      id="pyrevit-python"
      className="py-12 md:py-16 px-4 sm:px-6 md:px-12 select-none relative z-10 border-t border-white/10"
    >
      <div className="max-w-6xl mx-auto">
        {/* Compact Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-purple-400 uppercase tracking-widest mb-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span>AUTOMAZIONE REVIT SDK // CODICE &amp; SCRIPTING</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase text-white tracking-tight font-sans">
              Sviluppo Programmi pyRevit &amp; Python
            </h2>
          </div>

          <div className="font-mono text-xs text-white/50 max-w-sm sm:text-right">
            Script, estensioni native e automazioni Revit API per computi metrici e audit BIM.
          </div>
        </div>

        {/* Compact Interactive Code IDE */}
        <div className="bg-stone-950/80 border border-purple-500/30 backdrop-blur-md overflow-hidden mb-6 shadow-[0_10px_35px_rgba(0,0,0,0.6)] rounded-lg">
          {/* Top Bar of the Code Box */}
          <div className="p-3 px-4 md:px-5 bg-black/60 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <span className="text-white/30 text-xs">|</span>
              <span className="text-purple-400 font-bold">{current.filename}</span>
              <span className="px-2 py-0.5 bg-purple-950/60 border border-purple-400/40 text-[10px] text-purple-300 rounded">
                Python 3 / IronPython
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/15 text-white/80 hover:text-white transition-colors text-[11px] rounded"
                title="Copia frammento di codice"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiato' : 'Copia'}</span>
              </button>

              <button
                onClick={() => {
                  audioSystem.playClick(850);
                  onOpenTerminalModal();
                }}
                className="flex items-center gap-1.5 px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow-[0_0_12px_rgba(168,85,247,0.3)] text-[11px] uppercase tracking-wider rounded active:scale-95"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Simula Script</span>
              </button>
            </div>
          </div>

          {/* Compact Script Selector Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10 bg-black/40 border-b border-white/10 font-mono text-xs">
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
                  className={`p-2.5 px-4 text-left transition-all flex flex-col justify-center ${
                    isSelected
                      ? 'bg-purple-950/40 border-l-2 sm:border-l-0 sm:border-t-2 border-purple-400 text-white'
                      : 'hover:bg-white/5 opacity-60 hover:opacity-100 text-stone-300'
                  }`}
                >
                  <span className="text-[9px] text-purple-400 uppercase tracking-widest font-semibold">
                    {item.category}
                  </span>
                  <span className="font-bold text-xs truncate mt-0.5">{item.title}</span>
                </button>
              );
            })}
          </div>

          {/* Compact Scrollable Code Viewer (max-h-56) */}
          <div className="p-4 bg-[#09090f] overflow-x-auto max-h-56 overflow-y-auto text-[11px] font-mono leading-relaxed border-b border-white/10 scrollbar-thin">
            <pre className="text-purple-200/90 font-mono">
              <code>{current.code}</code>
            </pre>
          </div>

          {/* Compact Script Metadata Footer */}
          <div className="p-2.5 px-4 bg-black/50 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
            <div className="text-white/70 font-sans text-xs flex items-center gap-1.5">
              <strong className="text-purple-300 font-mono text-[11px]">FUNZIONE:</strong>
              <span>{current.description}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-white/60 text-[10px] rounded">
                Revit API
              </span>
              <span className="px-2 py-0.5 bg-purple-950/40 border border-purple-400/30 text-purple-300 text-[10px] rounded">
                pyRevit Core
              </span>
            </div>
          </div>
        </div>

        {/* Compact 4 Pillars of pyRevit Application Development (4 columns on lg) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {capabilities.map((cap, idx) => (
            <div
              key={idx}
              onMouseEnter={() => audioSystem.playTechHover()}
              className="p-3.5 bg-stone-950/40 border border-white/10 hover:border-purple-400/60 transition-all group backdrop-blur-[2px] rounded-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[9px] text-purple-400 uppercase tracking-wider font-bold">
                    {cap.tag}
                  </span>
                  <div className="p-1.5 border border-white/10 bg-white/5 group-hover:border-purple-400/40 transition-colors rounded">
                    {cap.icon}
                  </div>
                </div>

                <h3 className="font-mono text-xs font-bold text-white mb-1 tracking-wide">
                  {cap.title}
                </h3>

                <p className="font-sans text-[11px] text-stone-300 leading-relaxed font-light">
                  {cap.description}
                </p>
              </div>

              <div className="pt-2 mt-3 border-t border-white/10 flex items-center justify-between font-mono text-[10px] text-white/40">
                <span>Verificato</span>
                <span className="text-purple-400">Revit Native</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

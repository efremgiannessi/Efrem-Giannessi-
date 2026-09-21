import React, { useState } from 'react';
import {
  Code2,
  Terminal,
  Play,
  Copy,
  Check,
  Zap,
  Layers,
  Sparkles,
  Maximize2,
  FileCode2,
} from 'lucide-react';
import { audioSystem } from '../../utils/audioSynthesizer';

interface RevitAutomationSectionProps {
  onOpenRevitConsole: () => void;
}

const SAMPLE_SCRIPTS = [
  {
    id: 'pyrevit-qto',
    title: 'pyRevit: Estrazione Automatica Computo 5D',
    lang: 'Python (pyRevit / Revit API)',
    badge: 'pyRevit Extension',
    filename: 'script.py',
    code: `# pyRevit Custom Extension by Efrem Giannessi
from pyrevit import revit, DB, forms
import csv

doc = revit.doc
collector = DB.FilteredElementCollector(doc)\\
              .OfCategory(DB.BuiltInCategory.OST_Walls)\\
              .WhereElementIsNotElementType()

wall_data = []
for wall in collector:
    vol_param = wall.get_Parameter(DB.BuiltInParameter.HOST_VOLUME_COMPUTED)
    vol_m3 = vol_param.AsDouble() * 0.0283168 if vol_param else 0.0
    type_name = doc.GetElement(wall.GetTypeId()).get_Parameter(DB.BuiltInParameter.ALL_MODEL_TYPE_NAME).AsString()
    wbs = wall.LookupParameter("WBS_Codice")
    wbs_val = wbs.AsString() if wbs else "WBS_NON_ASSEGNATA"
    wall_data.append([wall.Id.ToString(), type_name, round(vol_m3, 3), wbs_val])

forms.alert("Estratte {} pareti con volumi e codici WBS pronti per il computo metrico.".format(len(wall_data)))
`,
  },
  {
    id: 'csharp-plugin',
    title: 'C# / .NET: Add-in Ribbon Esportatore IFC & BCF',
    lang: 'C# (.NET 8 / Revit API)',
    badge: 'C# Add-in Nativo',
    filename: 'ExportBimCommand.cs',
    code: `// C# Add-in for Autodesk Revit Ribbon by Efrem Giannessi
using System;
using Autodesk.Revit.UI;
using Autodesk.Revit.DB;
using Autodesk.Revit.Attributes;

[Transaction(TransactionMode.Manual)]
[Regeneration(RegenerationOption.Manual)]
public class ExportBimCommand : IExternalCommand
{
    public Result Execute(ExternalCommandData commandData, ref string message, ElementSet elements)
    {
        UIDocument uidoc = commandData.Application.ActiveUIDocument;
        Document doc = uidoc.Document;

        using (Transaction t = new Transaction(doc, "Validazione Parametri IFC"))
        {
            t.Start();
            var validator = new GiannessiBimAuditor(doc);
            var results = validator.RunAudit(LODStandard.LOD400);
            t.Commit();

            TaskDialog.Show("Studio Giannessi BIM Suite", 
                $"Audit completato con successo: {results.ValidCount} elementi conformi ISO 19650.");
        }
        return Result.Succeeded;
    }
}`,
  },
  {
    id: 'dynamo-batch',
    title: 'Dynamo Visual Logic: Rinomina Massiva e Quote Altimetriche',
    lang: 'Dynamo & Python Node',
    badge: 'Visual Programming',
    filename: 'BatchLevels.dyn',
    code: `# Dynamo Python Node - Batch Elevation Sync
import clr
clr.AddReference('RevitAPI')
from Autodesk.Revit.DB import *

doc = IN[0]
levels = FilteredElementCollector(doc).OfClass(Level).ToElements()

updated = []
for lvl in levels:
    name = lvl.Name
    elev_m = round(lvl.Elevation * 0.3048, 2)
    new_name = "QUOTA_{:+06.2f}m - {}".format(elev_m, name)
    updated.append(new_name)

OUT = updated`,
  },
];

export const RevitAutomationSection: React.FC<RevitAutomationSectionProps> = ({
  onOpenRevitConsole,
}) => {
  const [activeScriptId, setActiveScriptId] = useState<string>('pyrevit-qto');
  const [copied, setCopied] = useState<boolean>(false);

  const currentScript = SAMPLE_SCRIPTS.find((s) => s.id === activeScriptId) || SAMPLE_SCRIPTS[0];

  const handleCopy = () => {
    audioSystem.playClick(700);
    navigator.clipboard.writeText(currentScript.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="revit" className="py-20 border-b border-white/10 bg-black/80 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-cyan-400 mb-2">
              <Code2 className="h-4 w-4" />
              <span>ACTIVE THEORY // LAB EXPERIMENTS & REVIT API</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold uppercase text-white tracking-tight">
              pyRevit, Python & Add-in C#
            </h2>
            <p className="text-sm sm:text-base text-stone-300 font-light mt-2 max-w-2xl">
              Non solo modellazione: creiamo software su misura per Autodesk Revit. Plugin compilati in C# per la barra multifunzione, script pyRevit per il controllo qualità e automazioni che riducono i tempi di calcolo del 90%.
            </p>
          </div>

          <button
            onClick={() => {
              audioSystem.playClick(600);
              onOpenRevitConsole();
            }}
            onMouseEnter={() => audioSystem.playTechHover()}
            className="flex items-center gap-2 px-5 py-3 bg-cyan-400 hover:bg-cyan-300 text-stone-950 font-mono text-xs uppercase tracking-wider font-bold transition-all shrink-0 shadow-[0_0_15px_rgba(0,240,255,0.3)]"
          >
            <Terminal className="h-4 w-4" />
            <span>Apri Console Interattiva pyRevit</span>
          </button>
        </div>

        {/* Code Showcase Terminal Window */}
        <div className="border border-cyan-400/40 bg-stone-950/90 backdrop-blur-xl relative overflow-hidden shadow-[0_0_30px_rgba(0,240,255,0.1)]">
          {/* Architectural corner marks */}
          <div className="pointer-events-none absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-400 z-20" />
          <div className="pointer-events-none absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-400 z-20" />
          <div className="pointer-events-none absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-cyan-400 z-20" />
          <div className="pointer-events-none absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-cyan-400 z-20" />

          {/* Terminal Window Header Bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-stone-950/80 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-rose-500/80"></span>
              <span className="w-2.5 h-2.5 bg-amber-400/80"></span>
              <span className="w-2.5 h-2.5 bg-emerald-400/80"></span>
              <span className="ml-2 text-stone-400 text-[11px]">
                STUDIO GIANNESSI // REVIT API ENGINE
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] text-stone-400 hover:text-white border border-white/10 hover:border-white/20 bg-white/5 transition-all"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? 'Copiato' : 'Copia Codice'}</span>
              </button>

              <button
                onClick={() => {
                  audioSystem.playClick(600);
                  onOpenRevitConsole();
                }}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] text-amber-400 border border-amber-400/30 bg-amber-400/10 hover:bg-amber-400 hover:text-stone-950 transition-all font-semibold"
              >
                <Play className="h-3 w-3 fill-current" />
                <span>Simula Script</span>
              </button>
            </div>
          </div>

          {/* Script Selector Tabs */}
          <div className="flex flex-wrap items-center border-b border-white/10 bg-stone-950/40 px-2 pt-2 font-mono text-xs">
            {SAMPLE_SCRIPTS.map((script) => (
              <button
                key={script.id}
                onClick={() => {
                  audioSystem.playClick(450);
                  setActiveScriptId(script.id);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 border-t border-x -mb-px transition-all ${
                  activeScriptId === script.id
                    ? 'bg-stone-900 text-amber-300 border-white/20 border-b-stone-900 font-bold'
                    : 'bg-transparent text-stone-400 border-transparent hover:text-stone-200'
                }`}
              >
                <FileCode2 className="h-3.5 w-3.5" />
                <span>{script.filename}</span>
                <span className="text-[10px] text-stone-500 hidden sm:inline">({script.badge})</span>
              </button>
            ))}
          </div>

          {/* Code Viewer Body */}
          <div className="p-4 sm:p-6 overflow-x-auto font-mono text-xs leading-relaxed bg-stone-950/90 text-stone-200 min-h-[260px]">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5 text-[11px] text-stone-400">
              <span className="text-amber-400 font-semibold">{currentScript.title}</span>
              <span className="text-stone-400">{currentScript.lang}</span>
            </div>
            <pre className="text-stone-300">
              <code>{currentScript.code}</code>
            </pre>
          </div>

          {/* Footer Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/10 border-t border-white/10 font-mono text-xs">
            <div className="bg-stone-950 p-3.5">
              <span className="text-amber-400 block text-[10px] uppercase font-bold">Integrazione Ribbon</span>
              <span className="text-white mt-0.5 block text-xs">Pulsanti e pannelli personalizzati in Revit UI</span>
            </div>
            <div className="bg-stone-950 p-3.5">
              <span className="text-amber-400 block text-[10px] uppercase font-bold">Estrazione Massiva</span>
              <span className="text-white mt-0.5 block text-xs">Da 3 settimane di computo a 4 ore di calcolo</span>
            </div>
            <div className="bg-stone-950 p-3.5">
              <span className="text-amber-400 block text-[10px] uppercase font-bold">Distribuzione Studio</span>
              <span className="text-white mt-0.5 block text-xs">Pacchetti pyRevit distribuiti istantaneamente al team</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

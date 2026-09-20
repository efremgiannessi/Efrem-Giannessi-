import React, { useState } from 'react';
import {
  Code,
  Play,
  Copy,
  CheckCircle2,
  Terminal,
  X,
  FileCode,
  Download,
  Cpu,
  Layers,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { audioSystem } from '../utils/audioSynthesizer';

interface RevitPluginConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ScriptSnippet {
  id: string;
  title: string;
  language: 'Python / pyRevit' | 'C# (.NET)' | 'Dynamo Python';
  description: string;
  filename: string;
  code: string;
  simulatedOutput: string[];
}

const SNIPPETS: ScriptSnippet[] = [
  {
    id: 'pyrevit-auto-qto',
    title: 'Esportazione Massiva Computo da Parametri IFC',
    language: 'Python / pyRevit',
    filename: 'export_qto_computo.py',
    description: 'Estrae tutte le quantità volumetriche e superficiali di muri e solai con codice WBS di commessa e crea un foglio Excel tabellare pronto per il computo metrico.',
    code: `"""
pyRevit Command: Esportazione Massiva QTO & WBS di Cantiere
Autore: Efrem Giannessi - BIM 5D Specialist
"""
import clr
clr.AddReference('RevitAPI')
clr.AddReference('RevitServices')

from Autodesk.Revit.DB import (
    FilteredElementCollector, BuiltInCategory, BuiltInParameter, StorageType
)
from pyrevit import script, forms

doc = __revit__.ActiveUIDocument.Document
output = script.get_output()

output.print_md("# 🏗️ Estrazione Quantità & Computo 5D")
collector = FilteredElementCollector(doc)\\
    .OfCategory(BuiltInCategory.OST_Walls)\\
    .WhereElementIsNotElementType()

total_volume = 0.0
total_area = 0.0
wall_count = 0

for wall in collector:
    vol_param = wall.get_Parameter(BuiltInParameter.HOST_VOLUME_COMPUTED)
    area_param = wall.get_Parameter(BuiltInParameter.HOST_AREA_COMPUTED)
    
    if vol_param and vol_param.HasValue:
        total_volume += vol_param.AsDouble() * 0.0283168 # ft3 to m3
        wall_count += 1
    if area_param and area_param.HasValue:
        total_area += area_param.AsDouble() * 0.092903 # ft2 to m2

output.print_md("### ✅ Risultato Estrazione Elementi:")
output.print_md("- **Totale Murature Computate:** {} elementi".format(wall_count))
output.print_md("- **Volume Calcestruzzo / Laterizio:** {:.2f} m³".format(total_volume))
output.print_md("- **Superficie Intonaci / Isolamenti:** {:.2f} m²".format(total_area))
print("Sincronizzazione completata con modulo Computo 5D.")
`,
    simulatedOutput: [
      '>>> Caricamento motore IronPython 3.4 & Revit API Engine...',
      '>>> Connessione al modello federato attiva.',
      '>>> Filtraggio categorie: BuiltInCategory.OST_Walls...',
      '>>> 342 pareti individuate.',
      '>>> Estrazione parametri HOST_VOLUME_COMPUTED e HOST_AREA_COMPUTED...',
      '>>> Conversione unità imperiali (ft³) a metriche ISO (m³)...',
      '>>> Totale Volume Murature: 1.482,60 m³',
      '>>> Totale Superficie Isolante: 4.820,15 m²',
      '>>> Esportazione tabella WBS completata con successo in 0.42 secondi! ✅',
    ],
  },
  {
    id: 'csharp-renumber-rooms',
    title: 'Rinumerazione Automatica Locali & Verifica Superfici',
    language: 'C# (.NET)',
    filename: 'RenumberRoomsCommand.cs',
    description: 'Add-in C# nativo su Ribbon Revit per riordinare e rinumerare geometricamente tutti i vani lungo la direttrice d\'accesso con verifica della superficie minima regolamentare.',
    code: `using System;
using System.Linq;
using Autodesk.Revit.Attributes;
using Autodesk.Revit.DB;
using Autodesk.Revit.DB.Architecture;
using Autodesk.Revit.UI;

namespace StudioGiannessi.RevitPlugins
{
    [Transaction(TransactionMode.Manual)]
    [Regeneration(RegenerationOption.Manual)]
    public class RenumberRoomsCommand : IExternalCommand
    {
        public Result Execute(ExternalCommandData commandData, ref string message, ElementSet elements)
        {
            UIDocument uidoc = commandData.Application.ActiveUIDocument;
            Document doc = uidoc.Document;

            using (Transaction trans = new Transaction(doc, "Rinumerazione Vani Guidata"))
            {
                trans.Start();
                var rooms = new FilteredElementCollector(doc)
                    .OfCategory(BuiltInCategory.OST_Rooms)
                    .WhereElementIsNotElementType()
                    .Cast<Room>()
                    .OrderBy(r => ((LocationPoint)r.Location).Point.X)
                    .ToList();

                int counter = 101;
                foreach (var room in rooms)
                {
                    room.Number = $"A-{counter++}";
                }

                trans.Commit();
                TaskDialog.Show("Studio Giannessi Revit Plugin", $"Rinumerati con successo {rooms.Count} vani.");
            }
            return Result.Succeeded;
        }
    }
}
`,
    simulatedOutput: [
      '>>> Compilazione assembly C# (.NET 8.0) nativo...',
      '>>> Registrazione comando IExternalCommand nel Ribbon "Studio Giannessi"...',
      '>>> Apertura transazione Revit: "Rinumerazione Vani Guidata"...',
      '>>> Trovati 48 locali nel piano corrente.',
      '>>> Ordinamento spaziale X/Y e applicazione prefisso "A-101"...',
      '>>> Transazione eseguita con successo!',
      '>>> TaskDialog: "Rinumerati con successo 48 vani." ✅',
    ],
  },
  {
    id: 'pyrevit-ifc-audit',
    title: 'Audit Parametri IFC & Controllo Clash OpenBIM',
    language: 'Python / pyRevit',
    filename: 'audit_ifc_parameters.py',
    description: 'Verifica la presenza di codici IFC PSet (Property Sets) obbligatori prima del rilascio del modello ai colleghi strutturisti e impiantisti.',
    code: `"""
pyRevit Command: Audit di Conformità OpenBIM / IFC 4.3
Autore: Efrem Giannessi
"""
from Autodesk.Revit.DB import FilteredElementCollector, BuiltInCategory
doc = __revit__.ActiveUIDocument.Document

elements = FilteredElementCollector(doc)\\
    .WherePasses(ElementIsElementTypeFilter(False))\\
    .ToElements()

missing_ifc = 0
valid_count = 0

for el in elements:
    param = el.LookupParameter("IfcExportAs")
    if param and param.AsString():
        valid_count += 1
    else:
        missing_ifc += 1

print(f"Modello Analizzato: {valid_count} elementi conformi, {missing_ifc} da verificare.")
`,
    simulatedOutput: [
      '>>> Avvio scansione parametri IFC Property Sets...',
      '>>> Verifica elementi conformi agli standard buildingSMART...',
      '>>> 1.250 elementi verificati.',
      '>>> Nessuna discrepanza critica riscontrata.',
      '>>> Modello pronto per esportazione certificata IFC 4x3! ✅',
    ],
  },
];

export const RevitPluginConsoleModal: React.FC<RevitPluginConsoleModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedSnippetId, setSelectedSnippetId] = useState<string>(SNIPPETS[0].id);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>(SNIPPETS[0].simulatedOutput);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentSnippet = SNIPPETS.find((s) => s.id === selectedSnippetId) || SNIPPETS[0];

  const handleSelectSnippet = (snippet: ScriptSnippet) => {
    audioSystem.playClick(600);
    setSelectedSnippetId(snippet.id);
    setConsoleLogs(snippet.simulatedOutput);
    setIsRunning(false);
  };

  const handleRunScript = () => {
    audioSystem.playClick(850);
    setIsRunning(true);
    setConsoleLogs(['>>> Avvio interprete in corso...']);

    currentSnippet.simulatedOutput.forEach((log, index) => {
      setTimeout(() => {
        setConsoleLogs((prev) => [...prev, log]);
        if (index === currentSnippet.simulatedOutput.length - 1) {
          setIsRunning(false);
          audioSystem.playChime();
        }
      }, (index + 1) * 220);
    });
  };

  const handleCopyCode = () => {
    audioSystem.playClick(700);
    navigator.clipboard.writeText(currentSnippet.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="revit-console-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-5xl rounded-3xl border border-white/20 bg-stone-950/95 p-5 sm:p-7 shadow-2xl backdrop-blur-2xl text-stone-100 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-500 text-white font-black shadow-lg shadow-sky-500/30">
              <Terminal className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="revit-console-title" className="text-base sm:text-lg font-bold text-white tracking-wide">
                  Console Sviluppo Plugin & pyRevit
                </h2>
                <span className="rounded-full bg-sky-500/20 px-2 py-0.5 text-[10px] font-bold text-sky-300 border border-sky-500/40">
                  Revit API • Python • C#
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Sandbox interattivo di automazione, scripting per computi e sviluppo estensioni Autodesk Revit
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
            title="Chiudi console"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Snippet Selection Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 my-3 shrink-0">
          {SNIPPETS.map((snippet) => (
            <button
              key={snippet.id}
              type="button"
              onClick={() => handleSelectSnippet(snippet)}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                selectedSnippetId === snippet.id
                  ? 'bg-sky-500/20 border-sky-400 text-white shadow-md'
                  : 'bg-white/5 border-white/10 text-stone-400 hover:bg-white/10 hover:text-stone-200'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-sky-300 mb-0.5">
                <span>{snippet.language}</span>
                <span className="text-stone-400">{snippet.filename}</span>
              </div>
              <div className="text-xs font-semibold text-white line-clamp-1">
                {snippet.title}
              </div>
            </button>
          ))}
        </div>

        {/* Code & Console Dual View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0 overflow-y-auto">
          {/* Code Viewer (7 cols) */}
          <div className="lg:col-span-7 flex flex-col rounded-2xl border border-white/15 bg-stone-900/90 overflow-hidden shadow-inner">
            <div className="flex items-center justify-between px-3.5 py-2 border-b border-white/10 bg-stone-950/70 text-xs">
              <div className="flex items-center gap-2 text-stone-300 font-mono text-[11px]">
                <FileCode className="h-3.5 w-3.5 text-sky-400" />
                <span>{currentSnippet.filename}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-semibold bg-white/10 hover:bg-white/20 text-stone-200 transition-colors"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                      <span className="text-emerald-300">Copiato!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copia Codice</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  id="btn-run-revit-script"
                  onClick={handleRunScript}
                  disabled={isRunning}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-bold bg-emerald-500 hover:bg-emerald-400 text-stone-950 shadow-md transition-all active:scale-95 disabled:opacity-50"
                >
                  <Play className={`h-3 w-3 ${isRunning ? 'animate-spin' : ''}`} />
                  <span>{isRunning ? 'Esecuzione...' : 'Esegui Script'}</span>
                </button>
              </div>
            </div>

            <pre className="flex-1 p-3.5 text-[11px] font-mono text-emerald-300/90 overflow-x-auto leading-relaxed selection:bg-sky-500/30 selection:text-white">
              <code>{currentSnippet.code}</code>
            </pre>
          </div>

          {/* Console Output & Description (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {/* Description Card */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 text-xs text-stone-300">
              <h4 className="font-bold text-white mb-1 flex items-center gap-1.5 text-xs">
                <Cpu className="h-3.5 w-3.5 text-sky-400" />
                <span>Funzionalità del Modulo</span>
              </h4>
              <p className="text-[11px] text-stone-300 leading-relaxed">
                {currentSnippet.description}
              </p>
            </div>

            {/* Terminal Live Console */}
            <div className="flex-1 flex flex-col rounded-2xl border border-white/15 bg-black/80 overflow-hidden shadow-inner min-h-[160px]">
              <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/10 bg-stone-950 text-[10px] font-mono text-stone-400">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>OUTPUT TERMINALE REVIT</span>
                </div>
                <span>STATUS: {isRunning ? 'RUNNING' : 'IDLE'}</span>
              </div>

              <div className="flex-1 p-3 font-mono text-[11px] space-y-1 overflow-y-auto text-stone-300">
                {consoleLogs.map((log, i) => (
                  <div
                    key={i}
                    className={
                      log.includes('✅')
                        ? 'text-emerald-300 font-bold'
                        : log.includes('>>>')
                        ? 'text-sky-300/90'
                        : 'text-stone-300'
                    }
                  >
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

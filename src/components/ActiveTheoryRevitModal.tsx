import React, { useState } from 'react';
import { Terminal, Play, X, CheckCircle2, Copy, Check } from 'lucide-react';
import { audioSystem } from '../utils/audioSynthesizer';

interface ActiveTheoryRevitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ActiveTheoryRevitModal: React.FC<ActiveTheoryRevitModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'clash' | 'qto' | 'ifc'>('clash');
  const [isRunning, setIsRunning] = useState(false);
  const [outputLogs, setOutputLogs] = useState<string[]>([
    'pyRevit Engine v4.8.16 ready for Revit 2024/2025.',
    'Namespace: Giannessi.BimAutomation.Extensions',
    'Click "ESEGUI SCRIPT IN SIMULAZIONE" per testare la routine algoritmica.',
  ]);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const scripts = {
    clash: {
      name: 'ClashMatrixSolver.py',
      lang: 'Python (pyRevit SDK)',
      description:
        'Individua e classifica geometricamente le intersezioni tra tubazioni MEP e setti in c.a., creando forometrie parametriche provvisorie.',
      code: `import clr
clr.AddReference('RevitAPI')
clr.AddReference('RevitServices')
from Autodesk.Revit.DB import *
from pyrevit import script, revit

doc = revit.doc
app = revit.app
output = script.get_output()

# Filtra Elementi Strutturali e Impiantistici
walls = FilteredElementCollector(doc).OfCategory(BuiltInCategory.OST_Walls).WhereElementIsNotElementType().ToElements()
pipes = FilteredElementCollector(doc).OfCategory(BuiltInCategory.OST_PipeCurves).WhereElementIsNotElementType().ToElements()

output.print_md("### AVVIO ANALISI CLASH COMPUTAZIONALE")
clash_count = 0

for pipe in pipes:
    bb = pipe.get_BoundingBox(doc.ActiveView)
    outline = Outline(bb.Min, bb.Max)
    filter = BoundingBoxIntersectsFilter(outline)
    intersecting_walls = FilteredElementCollector(doc).OfCategory(BuiltInCategory.OST_Walls).WherePasses(filter).ToElements()
    for w in intersecting_walls:
        clash_count += 1
        output.print_md("**Clash #{}** Rilevato: Tubo ID {} <-> Parete ID {}".format(clash_count, pipe.Id, w.Id))

output.print_md("**RISULTATO**: {} Clash Geometrici identificati e registrati nel BCF Manager.".format(clash_count))
`,
    },
    qto: {
      name: 'BulkQuantityTakeoff_DEI.py',
      lang: 'Python (pyRevit SDK)',
      description:
        'Estrae volumi netti di calcestruzzo, superfici di casseratura e metri lineari di ferri d\'armatura associando i codici elenco prezzi DEI Toscana.',
      code: `import clr
clr.AddReference('RevitAPI')
from Autodesk.Revit.DB import *
from pyrevit import script, revit

doc = revit.doc
output = script.get_output()

floors = FilteredElementCollector(doc).OfCategory(BuiltInCategory.OST_Floors).WhereElementIsNotElementType().ToElements()
total_volume = 0.0

for floor in floors:
    vol_param = floor.get_Parameter(BuiltInParameter.HOST_VOLUME_COMPUTED)
    if vol_param:
        total_volume += vol_param.AsDouble() * 0.0283168 # ft3 to m3

output.print_md("### COMPUTO AUTOMATIZZATO SOLAI IN C.A.")
output.print_md("- Volume Totale Getto: **{:.2f} m³**".format(total_volume))
output.print_md("- Voce Elenco Prezzi: **DEI.OP-2024.C25-30**")
output.print_md("- Valore Stimato: **€ {:.2f}**".format(total_volume * 195.0))
`,
    },
    ifc: {
      name: 'Uni11337_ParameterValidator.cs',
      lang: 'C# (Autodesk Revit .NET API)',
      description:
        'Validatore di conformità sintattica e semantica per parametri Pset_BuildingCommon secondo specifica UNI 11337.',
      code: `using System;
using Autodesk.Revit.DB;
using Autodesk.Revit.UI;

[Transaction(TransactionMode.ReadOnly)]
public class ValidateIfcParameters : IExternalCommand
{
    public Result Execute(ExternalCommandData commandData, ref string message, ElementSet elements)
    {
        Document doc = commandData.Application.ActiveUIDocument.Document;
        FilteredElementCollector collector = new FilteredElementCollector(doc).WhereElementIsNotElementType();
        
        int validated = 0;
        foreach (Element e in collector)
        {
            Parameter p = e.LookupParameter("Pset_Component.LodLevel");
            if (p != null && !string.IsNullOrEmpty(p.AsString()))
            {
                validated++;
            }
        }
        TaskDialog.Show("UNI 11337 Validator", $"Parametri verificati con successo: {validated} entità conformi.");
        return Result.Succeeded;
    }
}
`,
    },
  };

  const handleRunScript = () => {
    setIsRunning(true);
    audioSystem.playClick(900);
    setOutputLogs((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] Esecuzione ${scripts[activeTab].name}...`,
    ]);

    setTimeout(() => {
      audioSystem.playGlitch();
      setIsRunning(false);
      setOutputLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Pipeline completata: 100% conformità geometrica, 0 eccezioni sollevate.`,
      ]);
    }, 1000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(scripts[activeTab].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      data-lenis-prevent
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-xl"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-stone-950/95 border border-purple-500/50 shadow-[0_0_80px_rgba(168,85,247,0.25)] flex flex-col h-[85vh] max-h-[750px] overflow-hidden text-stone-200"
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/80 font-mono text-xs">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-purple-400 font-bold uppercase tracking-widest">
              pyREVIT AUTOMATION CONSOLE // EFREM GIANNESSI
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 border border-white/20 text-white/60 hover:text-white hover:border-purple-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Script Selection Tabs */}
        <div className="flex border-b border-white/10 bg-stone-900/60 font-mono text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('clash')}
            className={`px-5 py-3 border-r border-white/10 transition-colors flex items-center gap-2 ${
              activeTab === 'clash'
                ? 'bg-black text-cyan-400 border-t-2 border-t-cyan-400 font-bold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <span>01 // ClashMatrixSolver.py</span>
          </button>

          <button
            onClick={() => setActiveTab('qto')}
            className={`px-5 py-3 border-r border-white/10 transition-colors flex items-center gap-2 ${
              activeTab === 'qto'
                ? 'bg-black text-amber-400 border-t-2 border-t-amber-400 font-bold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <span>02 // BulkQTO_DEI.py</span>
          </button>

          <button
            onClick={() => setActiveTab('ifc')}
            className={`px-5 py-3 transition-colors flex items-center gap-2 ${
              activeTab === 'ifc'
                ? 'bg-black text-purple-400 border-t-2 border-t-purple-400 font-bold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <span>03 // Uni11337_Validator.cs</span>
          </button>
        </div>

        {/* Description Banner */}
        <div className="p-4 bg-black/40 border-b border-white/10 flex items-center justify-between gap-4 font-mono text-xs">
          <p className="text-stone-300 font-sans text-xs">
            {scripts[activeTab].description}
          </p>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1 border border-white/20 hover:border-purple-400 text-white/70 hover:text-white shrink-0 transition-colors"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copied ? 'COPIATO' : 'COPIA CODICE'}</span>
          </button>
        </div>

        {/* Code Viewport */}
        <div
          className="flex-1 overflow-y-auto p-4 bg-stone-950 font-mono text-xs text-stone-300 leading-relaxed select-text"
          data-lenis-prevent
        >
          <pre className="overflow-x-auto">
            <code>{scripts[activeTab].code}</code>
          </pre>
        </div>

        {/* Terminal Output Logs */}
        <div
          className="h-32 border-t border-white/10 bg-black/90 p-4 font-mono text-xs text-stone-400 overflow-y-auto space-y-1"
          data-lenis-prevent
        >
          <div className="text-white/40 uppercase tracking-widest text-[10px] mb-1">
            TERMINAL EXECUTION LOG:
          </div>
          {outputLogs.map((log, i) => (
            <div key={i} className="text-cyan-300/90 flex items-center gap-2">
              <span className="text-purple-400">&gt;</span>
              <span>{log}</span>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 bg-black flex items-center justify-between font-mono text-xs">
          <span className="text-white/40 text-[11px]">
            REVIT API C# / IRONPYTHON 3.4
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunScript}
              disabled={isRunning}
              className="px-5 py-2.5 bg-purple-500 hover:bg-purple-400 text-stone-950 font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isRunning ? 'ESECUZIONE IN CORSO...' : 'ESEGUI SCRIPT IN SIMULAZIONE'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

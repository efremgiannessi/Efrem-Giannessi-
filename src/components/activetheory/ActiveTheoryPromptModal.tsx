import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Sparkles,
  ArrowRight,
  X,
  Layers,
  Terminal,
  Calculator,
  Compass,
  Building2,
  CheckCircle2,
  CornerDownLeft,
  Cpu,
} from 'lucide-react';
import { ARCHITECTURAL_PROJECTS } from '../../data/projectsData';
import { audioSystem } from '../../utils/audioSynthesizer';

interface ActiveTheoryPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject: (projectId: string) => void;
  onOpenBimViewer: () => void;
  onOpen360Tour: () => void;
  onOpenEstimatorModal: () => void;
  onOpenRevitConsole: () => void;
  onOpenAuditModal: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  actions?: {
    label: string;
    action: () => void;
    icon?: React.ReactNode;
  }[];
}

export const ActiveTheoryPromptModal: React.FC<ActiveTheoryPromptModalProps> = ({
  isOpen,
  onClose,
  onSelectProject,
  onOpenBimViewer,
  onOpen360Tour,
  onOpenEstimatorModal,
  onOpenRevitConsole,
  onOpenAuditModal,
}) => {
  const [query, setQuery] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'ACTIVE THEORY // AI NAVIGATOR ARCHITETTURALE. Sono l\'assistente algoritmico dello studio Efrem Giannessi. Chiedimi dettagli sui progetti BIM 5D, stime di costo WBS, automazioni pyRevit o avvia direttamente le esperienze interattive.',
      actions: [
        {
          label: 'Opera Flagship: Zenith Tower (LOD 500)',
          action: () => {
            onSelectProject('zenith-tower');
            onClose();
          },
          icon: <Building2 className="w-3.5 h-3.5 text-cyan-400" />,
        },
        {
          label: 'Avvia Modello 3D WebGL',
          action: () => {
            onOpenBimViewer();
            onClose();
          },
          icon: <Layers className="w-3.5 h-3.5 text-cyan-400" />,
        },
        {
          label: 'Tour Studio 360° Immersivo',
          action: () => {
            onOpen360Tour();
            onClose();
          },
          icon: <Compass className="w-3.5 h-3.5 text-amber-400" />,
        },
        {
          label: 'Console Script pyRevit',
          action: () => {
            onOpenRevitConsole();
            onClose();
          },
          icon: <Terminal className="w-3.5 h-3.5 text-purple-400" />,
        },
      ],
    },
  ]);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const q = (textToSend || query).trim();
    if (!q) return;

    audioSystem.playClick(700);

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: q,
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuery('');

    // Algorithmic technical response generator
    setTimeout(() => {
      audioSystem.playGlitch();
      const lower = q.toLowerCase();

      let answerText = '';
      let replyActions: Message['actions'] = [];

      if (lower.includes('costo') || lower.includes('prezzo') || lower.includes('stima') || lower.includes('preventivo') || lower.includes('m2') || lower.includes('mq')) {
        answerText =
          'Il computo metrico 5D dello studio è associato direttamente ai prezzari regionali (Toscana, Lombardia, DEI) tramite Quantity Takeoff algoritmico su Revit. Per nuove costruzioni residenziali di pregio il costo oscilla tra 1.850 e 2.450 €/m², mentre per uffici direzionali ad alta efficienza (Leed Platinum) tra 2.100 e 2.800 €/m². Vuoi calcolare una stima parametrica istantanea per la tua commessa?';
        replyActions = [
          {
            label: 'Apri Calcolatore Parametrico 5D',
            action: () => {
              onOpenEstimatorModal();
              onClose();
            },
            icon: <Calculator className="w-3.5 h-3.5 text-amber-400" />,
          },
          {
            label: 'Prenota Audit con Efrem Giannessi',
            action: () => {
              onOpenAuditModal();
              onClose();
            },
            icon: <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />,
          },
        ];
      } else if (lower.includes('revit') || lower.includes('python') || lower.includes('c#') || lower.includes('plugin') || lower.includes('script') || lower.includes('pyrevit')) {
        answerText =
          'Lo studio sviluppa add-in compilati nativi per Autodesk Revit (API .NET / C#) e suite pyRevit con interfaccia personalizzata su Ribbon. Tra i plugin più usati: Clash Matrix Solver istantaneo, Bulk QTO Exporter a Excel/Primavera, e IFC Parameter Sync conforme a UNI 11337.';
        replyActions = [
          {
            label: 'Avvia Terminale Script pyRevit',
            action: () => {
              onOpenRevitConsole();
              onClose();
            },
            icon: <Terminal className="w-3.5 h-3.5 text-purple-400" />,
          },
        ];
      } else if (lower.includes('zenith') || lower.includes('torre') || lower.includes('lod 500') || lower.includes('uffici')) {
        answerText =
          'Zenith Tower Business Center (Milano, 2024): 18.400 m², valore commessa € 42.500.000, classe energetica A4+. 42.850 elementi IFC modellati con 0 interferenze irrisolte. È il nostro case study di punta a standard LOD 500.';
        replyActions = [
          {
            label: 'Visualizza Case Study Zenith Tower',
            action: () => {
              onSelectProject('zenith-tower');
              onClose();
            },
            icon: <Building2 className="w-3.5 h-3.5 text-cyan-400" />,
          },
        ];
      } else if (lower.includes('360') || lower.includes('tour') || lower.includes('studio') || lower.includes('ufficio') || lower.includes('visita')) {
        answerText =
          'La nostra sede è completamente digitalizzata con un tour virtuale a 360° interattivo che integra stazioni di lavoro CAD/BIM, VR Oculus Meta Quest 3, sincronizzazione meteo-luminosa in tempo reale e mini-mappa radar.';
        replyActions = [
          {
            label: 'Entra nel Tour Studio 360°',
            action: () => {
              onOpen360Tour();
              onClose();
            },
            icon: <Compass className="w-3.5 h-3.5 text-amber-400" />,
          },
        ];
      } else if (lower.includes('3d') || lower.includes('modello') || lower.includes('webgl') || lower.includes('ifc')) {
        answerText =
          'L\'ispettore BIM 3D proprietario WebGL ti consente di orbitare attorno al fabbricato, attivare piani di sezione cartesiani (X, Y, Z), isolare livelli strutturali e ispezionare parametri IFC in tempo reale.';
        replyActions = [
          {
            label: 'Apri Ispettore BIM 3D',
            action: () => {
              onOpenBimViewer();
              onClose();
            },
            icon: <Layers className="w-3.5 h-3.5 text-cyan-400" />,
          },
        ];
      } else {
        answerText = `Richiesta telemetrica acquisita: "${q}". Lo studio di Efrem Giannessi applica la metodologia BIM 5D a norma ISO 19650 su tutte le fasi progettuali: fattibilità, esecutivo LOD 400-500, computo metrico estimativo WBS e direzione lavori digitalizzata.`;
        replyActions = [
          {
            label: 'Esplora Tutte le Opere [ 06 ]',
            action: () => {
              const el = document.getElementById('work');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              onClose();
            },
            icon: <Building2 className="w-3.5 h-3.5 text-cyan-400" />,
          },
          {
            label: 'Richiedi Audit di Commessa',
            action: () => {
              onOpenAuditModal();
              onClose();
            },
            icon: <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />,
          },
        ];
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: answerText,
          actions: replyActions,
        },
      ]);
    }, 400);
  };

  const quickPrompts = [
    'Mostrami il progetto LOD 500',
    'Costo medio al m² e stima 5D',
    'Sviluppo plugin pyRevit & C#',
    'Apri Tour Studio 360°',
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-stone-950/98 border border-cyan-400/50 shadow-[0_0_60px_rgba(0,240,255,0.25)] flex flex-col h-[80vh] max-h-[700px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Active Theory Signature Corner Marks */}
        <div className="pointer-events-none absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400 z-20" />
        <div className="pointer-events-none absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400 z-20" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400 z-20" />
        <div className="pointer-events-none absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400 z-20" />

        {/* Modal Terminal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-black/70 shrink-0">
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-cyan-400 font-bold uppercase tracking-widest">
              ACTIVE THEORY // AI NAVIGATOR & COMMAND PALETTE
            </span>
            <span className="text-white/30 hidden sm:inline">•</span>
            <span className="text-white/50 text-[11px] hidden sm:inline">EFREM GIANNESSI ARCHITECTURE</span>
          </div>

          <button
            onClick={() => {
              audioSystem.playClick(400);
              onClose();
            }}
            onMouseEnter={() => audioSystem.playTechHover()}
            className="p-1.5 border border-white/20 text-white/60 hover:text-white hover:border-cyan-400 transition-colors"
            aria-label="Chiudi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Conversation Stream */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 font-mono text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${
                m.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div className="flex items-center gap-2 mb-1 text-[10px] text-white/40 uppercase">
                <span>{m.sender === 'user' ? '[ USER ]' : '[ AT // ARCHITECTURE AGENT ]'}</span>
              </div>
              <div
                className={`p-3.5 max-w-[88%] ${
                  m.sender === 'user'
                    ? 'bg-cyan-950/60 border border-cyan-400/50 text-cyan-200'
                    : 'bg-stone-900/80 border border-white/15 text-stone-200 leading-relaxed font-sans text-sm'
                }`}
              >
                <p>{m.text}</p>

                {m.actions && m.actions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap gap-2">
                    {m.actions.map((act, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          audioSystem.playClick(600);
                          act.action();
                        }}
                        onMouseEnter={() => audioSystem.playTechHover()}
                        className="flex items-center gap-2 px-3 py-1.5 bg-black/80 hover:bg-cyan-950/60 border border-white/20 hover:border-cyan-400 text-white font-mono text-xs uppercase tracking-wider transition-all"
                      >
                        {act.icon}
                        <span>{act.label}</span>
                        <ArrowRight className="w-3 h-3 text-white/40" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-5 py-2 border-t border-white/10 bg-stone-950 flex gap-2 overflow-x-auto shrink-0">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              onMouseEnter={() => audioSystem.playTechHover()}
              className="px-2.5 py-1 border border-white/10 hover:border-cyan-400/60 bg-black/60 text-white/60 hover:text-cyan-300 font-mono text-[11px] uppercase tracking-wider shrink-0 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-white/10 bg-black flex items-center gap-3 shrink-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              placeholder="Chiedi qualsiasi cosa sul portfolio, BIM 5D, stime o pyRevit..."
              className="w-full bg-stone-950 border border-white/20 focus:border-cyan-400 pl-10 pr-4 py-2.5 font-mono text-xs text-white placeholder:text-white/40 outline-none transition-colors"
            />
          </div>

          <button
            onClick={() => handleSend()}
            onMouseEnter={() => audioSystem.playTechHover()}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-stone-950 font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] shrink-0"
          >
            <span>Invia</span>
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

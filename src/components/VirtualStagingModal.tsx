import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Split,
  Eye,
  Sliders,
  Maximize2,
  Check,
  Palette,
  Sun,
  Home,
  Layers,
  ArrowRightLeft,
} from 'lucide-react';
import { audioSystem } from '../utils/audioSynthesizer';

interface VirtualStagingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface StagingProject {
  id: string;
  title: string;
  zone: string;
  style: string;
  description: string;
  // Unfurnished / Raw construction image
  beforeImage: string;
  // Photorealistic rendered & virtually staged image
  afterImage: string;
  details: string[];
}

const STAGING_PROJECTS: StagingProject[] = [
  {
    id: 'living-loft',
    title: 'Open Space Living & Dining Contemporaneo',
    zone: 'Residenziale di Pregio',
    style: 'Minimalista Caldo & Rovere Naturale',
    description: 'Riqualificazione visiva di uno spazio grezzo al rustico: inserimento di parquet a spina ungherese, cucina a isola in quarzite, faretti a binario magnetico e pareti attrezzate.',
    beforeImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1920&q=90',
    afterImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1920&q=90',
    details: [
      'Texture PBR fotorealistiche per legni e marmi',
      'Studio della luce naturale da vetrate a tutta altezza',
      'Arredi di design con dimensioni conformi al rilievo',
    ],
  },
  {
    id: 'master-bedroom',
    title: 'Camera Padronale con Boiserie & Cabina Armadio',
    zone: 'Appartamento Attico',
    style: 'Lusso Materico & Tonalità Neutre',
    description: 'Virtual staging di un ambiente non arredato: boiserie cannettata retroilluminata, illuminazione d\'accento serale soffusa e testata letto tessile imbottita.',
    beforeImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1920&q=90',
    afterImage: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1920&q=90',
    details: [
      'Simulazione luce LED perimetrale dimmerabile',
      'Accostamento cromatico studiato per valorizzare gli spazi',
      'Aumento dell\'impatto commerciale per vendite su carta',
    ],
  },
  {
    id: 'executive-office',
    title: 'Ufficio Direzionale & Sala Riunioni',
    zone: 'Direzionale Terziario',
    style: 'Industrial Chic & Vetrate Acustiche',
    description: 'Allestimento virtuale per immobile commerciale: pareti vetrate con profili neri opachi, tavolo riunioni in noce canaletto e pavimentazione in microcemento.',
    beforeImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=90',
    afterImage: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=1920&q=90',
    details: [
      'Integrazione elementi BIM con arredi certificati',
      'Verifica acustica e illuminotecnica virtuale',
      'Presentazione interattiva per investitori immobiliari',
    ],
  },
];

export const VirtualStagingModal: React.FC<VirtualStagingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(STAGING_PROJECTS[0].id);
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0-100
  const [isDragging, setIsDragging] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentProject = STAGING_PROJECTS.find((p) => p.id === selectedProjectId) || STAGING_PROJECTS[0];

  const handleSliderMove = (clientX: number, rect: DOMRect) => {
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    handleSliderMove(e.clientX, rect);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    handleSliderMove(e.clientX, rect);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="virtual-staging-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-5xl rounded-3xl border border-white/20 bg-stone-950/95 p-5 sm:p-7 shadow-2xl backdrop-blur-2xl text-stone-100 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-fuchsia-500 to-amber-400 text-stone-950 font-black shadow-lg shadow-fuchsia-500/30">
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="virtual-staging-title" className="text-base sm:text-lg font-bold text-white tracking-wide">
                  Virtual Staging & Rendering Fotorealistico
                </h2>
                <span className="rounded-full bg-fuchsia-500/20 px-2 py-0.5 text-[10px] font-bold text-fuchsia-300 border border-fuchsia-500/40">
                  Prima / Dopo Interattivo
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Confronto interattivo in tempo reale tra stato grezzo / non arredato e allestimento architettonico 3D fotorealistico
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
            title="Chiudi Virtual Staging"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Project Selector Pills */}
        <div className="flex flex-wrap items-center gap-2 my-3 shrink-0">
          {STAGING_PROJECTS.map((project) => (
            <button
              key={project.id}
              type="button"
              onClick={() => {
                audioSystem.playClick(620);
                setSelectedProjectId(project.id);
                setSliderPosition(50);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                selectedProjectId === project.id
                  ? 'bg-fuchsia-500/20 border-fuchsia-400 text-fuchsia-200 shadow-md'
                  : 'bg-white/5 border-white/10 text-stone-400 hover:bg-white/10 hover:text-stone-200'
              }`}
            >
              <span>{project.title}</span>
            </button>
          ))}
        </div>

        {/* Interactive Split Slider Container */}
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
          <div
            className="relative w-full aspect-[16/9] max-h-[440px] rounded-2xl overflow-hidden select-none cursor-ew-resize border border-white/20 shadow-2xl"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            {/* Background Layer: "AFTER" (Rendered & Staged) */}
            <img
              src={currentProject.afterImage}
              alt="Virtual Staging Render Fotorealistico"
              className="absolute inset-0 h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-4 right-4 rounded-xl bg-fuchsia-500/80 px-3 py-1 text-xs font-bold text-white shadow-lg backdrop-blur-md">
              DOPO (Virtual Staging 3D)
            </div>

            {/* Foreground Layer with Clip-path: "BEFORE" (Raw / Unfurnished) */}
            <div
              className="absolute inset-0 h-full w-full overflow-hidden pointer-events-none"
              style={{
                clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
              }}
            >
              <img
                src={currentProject.beforeImage}
                alt="Stato Rustico / Non Arredato"
                className="absolute inset-0 h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 rounded-xl bg-stone-900/80 px-3 py-1 text-xs font-bold text-amber-300 shadow-lg backdrop-blur-md">
                PRIMA (Stato Grezzo)
              </div>
            </div>

            {/* Vertical Divider Handle Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-stone-950 shadow-xl ring-4 ring-black/40">
                <ArrowRightLeft className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Slider Position Hint */}
          <div className="flex items-center justify-between mt-2 text-[11px] text-stone-400 font-mono px-1">
            <span>← Trascina a sinistra per vedere il RENDER COMPLETO</span>
            <span>Trascina a destra per vedere lo STATO GREZZO →</span>
          </div>

          {/* Project Details Footer */}
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/10 text-xs">
            <div className="rounded-xl bg-white/5 p-3 border border-white/5">
              <span className="text-stone-400 block text-[10px] uppercase font-bold">Stile & Moodboard</span>
              <span className="font-semibold text-white mt-0.5 block">{currentProject.style}</span>
            </div>
            <div className="rounded-xl bg-white/5 p-3 border border-white/5">
              <span className="text-stone-400 block text-[10px] uppercase font-bold">Destinazione</span>
              <span className="font-semibold text-white mt-0.5 block">{currentProject.zone}</span>
            </div>
            <div className="rounded-xl bg-white/5 p-3 border border-white/5">
              <span className="text-stone-400 block text-[10px] uppercase font-bold">Beneficio per la Committenza</span>
              <span className="font-semibold text-emerald-300 mt-0.5 block">Accelerazione vendite su carta del +65%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

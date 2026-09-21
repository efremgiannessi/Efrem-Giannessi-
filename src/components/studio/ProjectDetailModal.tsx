import React, { useState } from 'react';
import {
  X,
  Layers,
  Split,
  Sparkles,
  Building2,
  Calendar,
  MapPin,
  Maximize2,
  CheckCircle2,
  FileText,
  ShieldCheck,
  ArrowRight,
  Eye,
  Check,
} from 'lucide-react';
import { ArchitecturalProject } from '../../data/projectsData';
import { audioSystem } from '../../utils/audioSynthesizer';

interface ProjectDetailModalProps {
  project: ArchitecturalProject | null;
  onClose: () => void;
  onOpenBimViewer: () => void;
  onOpenCadCompare: () => void;
  onOpenVirtualStaging: () => void;
  onRequestQuoteForProject: (projectTitle: string) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onOpenBimViewer,
  onOpenCadCompare,
  onOpenVirtualStaging,
  onRequestQuoteForProject,
}) => {
  if (!project) return null;

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const allImages = [project.coverImage, ...(project.galleryImages || [])];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl rounded-none border border-cyan-400/40 bg-stone-950/98 p-5 sm:p-7 shadow-[0_0_50px_rgba(0,240,255,0.2)] text-stone-100 max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Active Theory Corner Marks */}
        <div className="pointer-events-none absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400 z-20" />
        <div className="pointer-events-none absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400 z-20" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400 z-20" />
        <div className="pointer-events-none absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400 z-20" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="px-2 py-0.5 bg-cyan-950/50 text-cyan-300 font-bold uppercase tracking-wider border border-cyan-400/40">
                {project.lod}
              </span>
              <span className="text-amber-400 uppercase tracking-wider">
                {project.categoryLabel}
              </span>
              <span className="text-white/30">•</span>
              <span className="text-white/50">{project.year} • {project.location}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-1">
              {project.title}
            </h2>
            <p className="text-cyan-400/80 font-mono text-xs uppercase tracking-wider mt-0.5">
              {project.subtitle}
            </p>
          </div>

          <button
            id="close-case-study-btn"
            onClick={() => {
              audioSystem.playClick(400);
              onClose();
            }}
            onMouseEnter={() => audioSystem.playTechHover()}
            className="p-2 border border-white/20 text-white/60 hover:text-white hover:border-cyan-400 hover:bg-cyan-950/30 transition-all"
            aria-label="Chiudi Case Study"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto py-5 pr-1 space-y-6 flex-1 text-sm font-light">
          {/* Main Visual Carousel Showcase */}
          <div className="space-y-3">
            <div className="relative h-64 sm:h-96 w-full overflow-hidden border border-white/15 bg-black">
              <img
                src={allImages[activeImageIndex]}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 font-mono text-xs bg-black/80 border border-white/20 px-2.5 py-1 text-white">
                FOTO [{activeImageIndex + 1} / {allImages.length}]
              </div>
            </div>

            {/* Thumbnail Selectors */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      audioSystem.playTechHover();
                      setActiveImageIndex(i);
                    }}
                    className={`relative w-20 h-14 shrink-0 overflow-hidden border transition-all ${
                      i === activeImageIndex
                        ? 'border-cyan-400 ring-1 ring-cyan-400'
                        : 'border-white/10 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="anteprima" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Interactive Tools Launcher Hub */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => {
                audioSystem.playClick(700);
                onOpenBimViewer();
              }}
              onMouseEnter={() => audioSystem.playTechHover()}
              className="flex items-center justify-center gap-2 p-3 bg-stone-900 border border-cyan-400/40 text-cyan-300 hover:border-cyan-400 hover:bg-cyan-950/40 font-mono text-xs uppercase tracking-wider transition-all"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Modello 3D BIM WebGL</span>
            </button>

            {project.hasCadCompare && (
              <button
                onClick={() => {
                  audioSystem.playClick(600);
                  onOpenCadCompare();
                }}
                onMouseEnter={() => audioSystem.playTechHover()}
                className="flex items-center justify-center gap-2 p-3 bg-stone-900 border border-amber-400/40 text-amber-300 hover:border-amber-400 hover:bg-amber-950/40 font-mono text-xs uppercase tracking-wider transition-all"
              >
                <Split className="w-4 h-4 text-amber-400" />
                <span>Confronto CAD vs BIM 5D</span>
              </button>
            )}

            {project.hasVirtualStaging && (
              <button
                onClick={() => {
                  audioSystem.playClick(600);
                  onOpenVirtualStaging();
                }}
                onMouseEnter={() => audioSystem.playTechHover()}
                className="flex items-center justify-center gap-2 p-3 bg-stone-900 border border-purple-400/40 text-purple-300 hover:border-purple-400 hover:bg-purple-950/40 font-mono text-xs uppercase tracking-wider transition-all"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Virtual Staging 3D</span>
              </button>
            )}
          </div>

          {/* Project Summary & Narrative */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-4">
              <h3 className="font-mono text-xs text-white/50 uppercase tracking-wider border-b border-white/10 pb-2">
                RELAZIONE TECNICA & OBIETTIVI DI COMMESSA
              </h3>
              <p className="text-stone-300 text-sm leading-relaxed">
                {project.description}
              </p>

              <div className="space-y-2 pt-2">
                <span className="font-mono text-xs text-cyan-400 uppercase tracking-wider block font-semibold">
                  Caratteristiche Chiave Eseguite:
                </span>
                <ul className="space-y-1.5">
                  {project.highlights.map((hl, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-stone-300 text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Technical Specifications Matrix */}
            <div className="lg:col-span-4 p-4 bg-black/60 border border-white/10 space-y-3 font-mono text-xs">
              <h4 className="text-white/40 uppercase tracking-widest text-[10px] pb-1 border-b border-white/10">
                PARAMETRI IFC & BIM
              </h4>

              <div>
                <span className="text-white/40 text-[10px] block uppercase">Superficie Lorda:</span>
                <span className="text-white font-bold">{project.areaM2} m²</span>
              </div>

              <div>
                <span className="text-white/40 text-[10px] block uppercase">Valore Stimato:</span>
                <span className="text-amber-400 font-bold">{project.estimatedValueEur}</span>
              </div>

              <div>
                <span className="text-white/40 text-[10px] block uppercase">Elementi IFC nel Modello:</span>
                <span className="text-cyan-300 font-bold">{project.bimData.elementsCount.toLocaleString('it-IT')} elementi</span>
              </div>

              <div>
                <span className="text-white/40 text-[10px] block uppercase">Interferenze (Clash):</span>
                <span className="text-emerald-400 font-bold">{project.bimData.clashResolved} risolte su {project.bimData.clashDetected} (100%)</span>
              </div>

              <div>
                <span className="text-white/40 text-[10px] block uppercase">Precisione Computo QTO:</span>
                <span className="text-white font-bold">{project.bimData.qtoAccuracy}</span>
              </div>

              <div>
                <span className="text-white/40 text-[10px] block uppercase">Involucro & Energia:</span>
                <span className="text-white">{project.specs.envelope} ({project.specs.energyClass})</span>
              </div>

              <div>
                <span className="text-white/40 text-[10px] block uppercase">Software & Standard:</span>
                <span className="text-white">{project.specs.software} • {project.specs.standard}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="font-mono text-xs text-white/50">
            Commessa gestita con protocollo CDE in Cloud conforme a ISO 19650
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                audioSystem.playClick(600);
                onRequestQuoteForProject(project.title);
                onClose();
              }}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-stone-950 font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)]"
            >
              <span>Richiedi Commessa Simile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
  X,
  Building2,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Maximize2,
  FileSpreadsheet,
  ArrowRight,
} from 'lucide-react';
import { ArchitecturalProject } from '../data/projectsData';
import { audioSystem } from '../utils/audioSynthesizer';

interface ActiveTheoryModalProps {
  project: ArchitecturalProject | null;
  onClose: () => void;
  onRequestAudit: (projectTitle: string) => void;
}

export const ActiveTheoryModal: React.FC<ActiveTheoryModalProps> = ({
  project,
  onClose,
  onRequestAudit,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (project && modalRef.current && contentRef.current) {
      audioSystem.playClick(900);
      gsap.fromTo(
        modalRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.35, ease: 'power2.out' }
      );
      gsap.fromTo(
        contentRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out', delay: 0.1 }
      );
    }
  }, [project]);

  if (!project) return null;

  const handleClose = () => {
    audioSystem.playClick(500);
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: onClose,
      });
    } else {
      onClose();
    }
  };

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      data-lenis-prevent
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-xl"
      onClick={handleClose}
    >
      <div
        ref={contentRef}
        className="relative w-full max-w-5xl max-h-[90vh] bg-stone-950/95 border border-cyan-400/40 shadow-[0_0_80px_rgba(0,240,255,0.25)] flex flex-col overflow-hidden text-stone-200"
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent
      >
        {/* Active Theory Signature Corner Marks */}
        <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-cyan-400 z-20 pointer-events-none" />
        <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-cyan-400 z-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-cyan-400 z-20 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-cyan-400 z-20 pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/60 shrink-0 font-mono text-xs">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-cyan-400 font-bold uppercase tracking-widest">
              DOSSIER ARCHITETTONICO BIM // {project.lod}
            </span>
            <span className="text-white/30">•</span>
            <span className="text-white/60 uppercase">{project.categoryLabel}</span>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 border border-white/20 text-white/60 hover:text-white hover:border-cyan-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div
          className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8"
          data-lenis-prevent
        >
          {/* Main Visual Header */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="relative aspect-[16/10] bg-black border border-white/20 overflow-hidden group">
              <img
                src={project.coverImage}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-3 left-3 px-2 py-1 bg-black/80 font-mono text-[10px] text-cyan-400 uppercase tracking-widest border border-cyan-400/40">
                LIVE ASSET // LOD 400-500
              </div>
            </div>

            <div>
              <span className="font-mono text-xs text-white/40 uppercase tracking-widest block mb-1">
                {project.location} • Anno {project.year}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight mb-2">
                {project.title}
              </h2>
              <p className="text-cyan-400 font-mono text-sm uppercase tracking-wider mb-4">
                {project.subtitle}
              </p>
              <p className="text-stone-300 font-sans leading-relaxed text-sm">
                {project.summary}
              </p>

              <div className="mt-6 flex flex-wrap gap-4 font-mono text-xs">
                <div className="px-3 py-2 bg-stone-900 border border-white/10">
                  <span className="text-white/40 block text-[10px]">VALORE COMMESSA</span>
                  <span className="text-amber-400 font-bold text-sm">
                    {project.estimatedValueEur}
                  </span>
                </div>
                <div className="px-3 py-2 bg-stone-900 border border-white/10">
                  <span className="text-white/40 block text-[10px]">SUPERFICIE</span>
                  <span className="text-white font-bold text-sm">{project.areaM2} m²</span>
                </div>
                <div className="px-3 py-2 bg-stone-900 border border-white/10">
                  <span className="text-white/40 block text-[10px]">ELEMENTI MODELLATI</span>
                  <span className="text-cyan-400 font-bold text-sm">
                    {project.bimData.elementsCount.toLocaleString()} IFC
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specs & BIM Data Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/10">
            {/* Architectural Highlights */}
            <div className="space-y-4">
              <h3 className="font-mono text-xs text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>SPECIFICHE ESECUTIVE & CANTIERE</span>
              </h3>
              <p className="text-stone-300 text-sm leading-relaxed font-sans font-light">
                {project.description}
              </p>

              <div className="space-y-2 pt-2">
                {project.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-stone-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Matrix Parameters Table */}
            <div className="space-y-4">
              <h3 className="font-mono text-xs text-amber-400 uppercase tracking-widest flex items-center gap-2">
                <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" />
                <span>PARAMETRI IFC & CLASH DETECTION</span>
              </h3>

              <div className="border border-white/10 divide-y divide-white/10 font-mono text-xs bg-stone-900/50">
                <div className="p-3 flex justify-between">
                  <span className="text-white/40">Struttura Portante:</span>
                  <span className="text-white">{project.specs.structure}</span>
                </div>
                <div className="p-3 flex justify-between">
                  <span className="text-white/40">Involucro Edilizio:</span>
                  <span className="text-white">{project.specs.envelope}</span>
                </div>
                <div className="p-3 flex justify-between">
                  <span className="text-white/40">Classe Energetica:</span>
                  <span className="text-emerald-400 font-bold">{project.specs.energyClass}</span>
                </div>
                <div className="p-3 flex justify-between">
                  <span className="text-white/40">Software Authoring:</span>
                  <span className="text-purple-300">{project.specs.software}</span>
                </div>
                <div className="p-3 flex justify-between">
                  <span className="text-white/40">Standard di Riferimento:</span>
                  <span className="text-cyan-300">{project.specs.standard}</span>
                </div>
                <div className="p-3 flex justify-between">
                  <span className="text-white/40">Clash Risolti Prima del Getto:</span>
                  <span className="text-emerald-400 font-bold">
                    {project.bimData.clashResolved} / {project.bimData.clashDetected} (100%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Gallery */}
          {project.galleryImages && project.galleryImages.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-white/10">
              <h3 className="font-mono text-xs text-white/50 uppercase tracking-widest">
                GALLERIA DI CANTIERE & RENDER ESECUTIVI
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {project.galleryImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="aspect-video bg-black border border-white/15 overflow-hidden group"
                  >
                    <img
                      src={img}
                      alt={`${project.title} vista ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-white/10 bg-black/80 flex flex-wrap items-center justify-between gap-4 shrink-0 font-mono text-xs">
          <span className="text-white/40 text-[11px]">
            EFREM GIANNESSI // BIM 5D & COMPUTATIONAL DESIGN
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 border border-white/20 text-white/60 hover:text-white transition-colors"
            >
              CHIUDI
            </button>
            <button
              onClick={() => {
                onRequestAudit(project.title);
                handleClose();
              }}
              className="px-5 py-2 bg-cyan-400 hover:bg-cyan-300 text-stone-950 font-bold flex items-center gap-2 uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)]"
            >
              <span>CONTATTA PER QUESTO PROGETTO</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

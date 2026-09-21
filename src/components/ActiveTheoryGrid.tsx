import React, { useEffect, useRef } from 'react';
import { ARCHITECTURAL_PROJECTS, ArchitecturalProject } from '../data/projectsData';
import { SceneManager } from '../webgl/SceneManager';
import { ArrowUpRight, CheckCircle2, Layers, Building2, Ruler } from 'lucide-react';
import { audioSystem } from '../utils/audioSynthesizer';

interface ActiveTheoryGridProps {
  sceneManager: SceneManager | null;
  onSelectProject: (project: ArchitecturalProject) => void;
}

export const ActiveTheoryGrid: React.FC<ActiveTheoryGridProps> = ({
  sceneManager,
  onSelectProject,
}) => {
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Register DOM element bounds and textures to WebGL 3D planes
  useEffect(() => {
    if (!sceneManager) return;

    ARCHITECTURAL_PROJECTS.forEach((proj) => {
      const el = cardRefs.current.get(proj.id);
      if (el) {
        sceneManager.registerProject({
          id: proj.id,
          element: el,
          textureUrl: proj.coverImage,
        });
      }
    });

    const handleResize = () => {
      sceneManager.updateProjectBounds();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sceneManager]);

  const handleMouseEnter = (projId: string) => {
    audioSystem.playTechHover();
    if (sceneManager) {
      sceneManager.setProjectHover(projId, true);
    }
  };

  const handleMouseLeave = (projId: string) => {
    if (sceneManager) {
      sceneManager.setProjectHover(projId, false);
    }
  };

  const handleClick = (proj: ArchitecturalProject) => {
    audioSystem.playClick(800);
    onSelectProject(proj);
  };

  return (
    <section id="projects" className="py-24 px-6 md:px-16 select-none relative z-10">
      {/* Section Header */}
      <div className="flex flex-wrap items-end justify-between gap-6 mb-16 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 uppercase tracking-widest mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>OPERE ARCHITETTONICHE & DOSSIER BIM 5D</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight">
            PROGETTI SELEZIONATI [ 06 ]
          </h2>
        </div>

        <div className="font-mono text-xs text-white/50 text-right max-w-sm">
          Rendering sincronizzato su canvas Three.js con distorsione GLSL fluida,
          rilevazione clash ISO 19650 e computo metrico analitico.
        </div>
      </div>

      {/* Grid Layout (2-column on desktop with high-contrast active theory cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {ARCHITECTURAL_PROJECTS.map((proj, idx) => (
          <div
            key={proj.id}
            onClick={() => handleClick(proj)}
            onMouseEnter={() => handleMouseEnter(proj.id)}
            onMouseLeave={() => handleMouseLeave(proj.id)}
            className="group cursor-pointer flex flex-col bg-stone-950/40 backdrop-blur-[1px] border border-white/15 hover:border-cyan-400 transition-all p-6 relative overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
          >
            {/* Corner Tech Marks */}
            <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-400/80 pointer-events-none" />
            <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-400/80 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-cyan-400/80 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-cyan-400/80 pointer-events-none" />

            {/* Top Bar: Code & Category */}
            <div className="flex items-center justify-between font-mono text-xs mb-4 text-white/60">
              <span className="text-cyan-400 font-bold uppercase tracking-widest">
                [ 0{idx + 1} // {proj.lod} ]
              </span>
              <span className="uppercase tracking-wider text-stone-400">
                {proj.categoryLabel}
              </span>
            </div>

            {/* 3D WebGL Target Anchor Container */}
            {/* This container has opacity-0 image because Three.js draws the 3D plane right over it with custom shaders */}
            <div
              ref={(el) => {
                if (el) cardRefs.current.set(proj.id, el);
              }}
              className="relative w-full aspect-[16/10] bg-black/80 overflow-hidden mb-6 border border-white/10 group-hover:border-cyan-400/50 transition-colors"
            >
              {/* Fallback image if WebGL is initializing, otherwise smoothly blended */}
              <img
                src={proj.coverImage}
                alt={proj.title}
                className="w-full h-full object-cover opacity-30 group-hover:opacity-10 transition-opacity duration-700"
              />

              {/* Holographic Watermark on Hover */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="px-4 py-2 bg-black/80 border border-cyan-400 font-mono text-xs text-cyan-300 uppercase tracking-widest flex items-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.4)]">
                  <span>DISPLACEMENT ACTIVE</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Telemetric badges in corners */}
              <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/80 border border-white/10 font-mono text-[10px] text-white/70 uppercase">
                {proj.location}
              </div>
              <div className="absolute bottom-3 right-3 px-2 py-1 bg-cyan-950/80 border border-cyan-400/50 font-mono text-[10px] text-cyan-300 uppercase font-bold">
                {proj.estimatedValueEur}
              </div>
            </div>

            {/* Project Title & Subtitle */}
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h3 className="text-2xl font-bold uppercase text-white group-hover:text-cyan-300 transition-colors">
                  {proj.title}
                </h3>
                <p className="text-stone-400 font-sans text-sm font-light mt-1">
                  {proj.subtitle}
                </p>
              </div>

              <div className="w-8 h-8 rounded-none border border-white/20 flex items-center justify-center text-white/50 group-hover:text-stone-950 group-hover:bg-cyan-400 group-hover:border-cyan-400 transition-all shrink-0">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            {/* Project Metric Highlights */}
            <div className="mt-auto pt-4 border-t border-white/10 grid grid-cols-3 gap-2 font-mono text-xs text-white/70">
              <div>
                <span className="block text-white/40 text-[10px] uppercase">SUPERFICIE</span>
                <span className="text-white font-bold">{proj.areaM2} m²</span>
              </div>
              <div>
                <span className="block text-white/40 text-[10px] uppercase">CLASH RISOLTI</span>
                <span className="text-emerald-400 font-bold">
                  {proj.bimData.clashResolved} / {proj.bimData.clashDetected}
                </span>
              </div>
              <div>
                <span className="block text-white/40 text-[10px] uppercase">ACCURATEZZA QTO</span>
                <span className="text-cyan-400 font-bold">{proj.bimData.qtoAccuracy}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

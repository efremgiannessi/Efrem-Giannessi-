import React, { useState } from 'react';
import {
  Building2,
  Layers,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  Sparkles,
  Split,
  Eye,
  LayoutGrid,
  Maximize2,
  List,
} from 'lucide-react';
import { ARCHITECTURAL_PROJECTS, ArchitecturalProject } from '../../data/projectsData';
import { audioSystem } from '../../utils/audioSynthesizer';
import { ActiveTheoryFlowCarousel } from '../activetheory/ActiveTheoryFlowCarousel';
import { ActiveTheoryIndexTable } from '../activetheory/ActiveTheoryIndexTable';

interface ProjectsGalleryProps {
  onSelectProject: (projectId: string) => void;
  onOpenBimViewer: () => void;
  onOpenCadCompare: () => void;
  onOpenVirtualStaging: () => void;
}

type ViewMode = 'flow' | 'grid' | 'index';
type FilterCategory = 'all' | 'residenziale' | 'terziario' | 'industriale' | 'recupero' | 'staging';

export const ProjectsGallery: React.FC<ProjectsGalleryProps> = ({
  onSelectProject,
  onOpenBimViewer,
  onOpenCadCompare,
  onOpenVirtualStaging,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('flow');
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');

  const filterOptions: { label: string; value: FilterCategory }[] = [
    { label: 'Tutte le Opere', value: 'all' },
    { label: 'Residenziale', value: 'residenziale' },
    { label: 'Direzionale & Terziario', value: 'terziario' },
    { label: 'Recupero & Rigenerazione', value: 'recupero' },
    { label: 'Industriale & Logistica', value: 'industriale' },
    { label: 'Virtual Staging 3D', value: 'staging' },
  ];

  const filteredProjects = activeFilter === 'all'
    ? ARCHITECTURAL_PROJECTS
    : ARCHITECTURAL_PROJECTS.filter((p) => p.category === activeFilter);

  return (
    <section id="work" className="py-20 border-b border-white/10 bg-stone-950/90 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Active Theory Section Header with Mode Selector */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-cyan-400 mb-2">
              <span className="w-2 h-2 bg-cyan-400"></span>
              <span>ACTIVE THEORY // PORTFOLIO DI COMMESSA</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold uppercase text-white tracking-tight">
              Opere & Modelli BIM 5D
            </h2>
            <p className="text-sm sm:text-base text-stone-400 font-light mt-2 max-w-2xl">
              Architettura parametrica, gestione integrata del ciclo di vita edilizio e sviluppo software applicato: esplora le commesse dello studio attraverso le 3 modalità di visualizzazione Active Theory.
            </p>
          </div>

          {/* Active Theory View Switcher: FLOW / GRID / INDEX */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
              VIEWPORT MODE:
            </span>
            <div className="inline-flex p-1 bg-black/60 border border-white/15 backdrop-blur-md">
              <button
                id="viewmode-flow-btn"
                onClick={() => {
                  audioSystem.playClick(600);
                  setViewMode('flow');
                }}
                onMouseEnter={() => audioSystem.playTechHover()}
                className={`flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-all ${
                  viewMode === 'flow'
                    ? 'bg-cyan-400 text-stone-950 font-bold shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Flow 3D</span>
              </button>

              <button
                id="viewmode-grid-btn"
                onClick={() => {
                  audioSystem.playClick(600);
                  setViewMode('grid');
                }}
                onMouseEnter={() => audioSystem.playTechHover()}
                className={`flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-all ${
                  viewMode === 'grid'
                    ? 'bg-cyan-400 text-stone-950 font-bold shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid</span>
              </button>

              <button
                id="viewmode-index-btn"
                onClick={() => {
                  audioSystem.playClick(600);
                  setViewMode('index');
                }}
                onMouseEnter={() => audioSystem.playTechHover()}
                className={`flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-all ${
                  viewMode === 'index'
                    ? 'bg-cyan-400 text-stone-950 font-bold shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Index Table</span>
              </button>
            </div>
          </div>
        </div>

        {/* 1. FLOW 3D MODE (Active Theory Signature Experience) */}
        {viewMode === 'flow' && (
          <div className="w-full">
            <ActiveTheoryFlowCarousel
              onSelectProject={onSelectProject}
              onOpenBimViewer={onOpenBimViewer}
              onOpenCadCompare={onOpenCadCompare}
              onOpenVirtualStaging={onOpenVirtualStaging}
            />
          </div>
        )}

        {/* 2. GRID MODE (Editorial Bento Grid with Filter Pills) */}
        {viewMode === 'grid' && (
          <div>
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs mb-8">
              {filterOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    audioSystem.playClick(500);
                    setActiveFilter(opt.value);
                  }}
                  onMouseEnter={() => audioSystem.playTechHover()}
                  className={`px-3 py-1.5 border uppercase tracking-wider transition-all ${
                    activeFilter === opt.value
                      ? 'bg-cyan-400 text-stone-950 border-cyan-400 font-bold shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                      : 'bg-black/50 border-white/10 text-stone-400 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, idx) => (
                <div
                  key={project.id}
                  id={`project-card-${project.id}`}
                  onClick={() => {
                    audioSystem.playClick(600);
                    onSelectProject(project.id);
                  }}
                  onMouseEnter={() => audioSystem.playTechHover()}
                  className="group bg-stone-950/80 border border-white/10 hover:border-cyan-400/80 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer hover:shadow-[0_0_30px_rgba(0,240,255,0.15)]"
                >
                  {/* Card Media Preview */}
                  <div className="relative h-64 w-full overflow-hidden bg-stone-900">
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-80" />

                    {/* Badge Overlay */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 bg-black/80 border border-cyan-400/40 text-cyan-300 font-mono text-[10px] uppercase">
                        {project.lod}
                      </span>
                      <span className="px-2 py-0.5 bg-black/80 border border-amber-400/40 text-amber-300 font-mono text-[10px] uppercase">
                        {project.categoryLabel}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3 font-mono text-[11px] text-white/80 bg-black/80 px-2 py-0.5 border border-white/10">
                      {project.year} • {project.location}
                    </div>
                  </div>

                  {/* Card Content & Telemetry */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-sans font-bold text-lg text-white group-hover:text-cyan-300 transition-colors uppercase tracking-tight">
                          {project.title}
                        </h3>
                        <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0" />
                      </div>
                      <p className="font-mono text-xs text-cyan-400/80 uppercase mb-3">
                        {project.subtitle}
                      </p>
                      <p className="text-stone-300 text-xs font-light leading-relaxed line-clamp-2 mb-4">
                        {project.summary}
                      </p>
                    </div>

                    {/* Technical Parameters */}
                    <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-2 font-mono text-[11px] text-stone-400">
                      <div>
                        <span className="text-white/40 block text-[9px] uppercase">Superficie</span>
                        <span className="text-white font-semibold">{project.areaM2} m²</span>
                      </div>
                      <div>
                        <span className="text-white/40 block text-[9px] uppercase">Computo 5D</span>
                        <span className="text-emerald-400 font-semibold">{project.bimData.qtoAccuracy}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="px-5 py-3 bg-black/40 border-t border-white/5 flex items-center justify-between font-mono text-xs text-white/50 group-hover:text-cyan-300 transition-colors">
                    <span>APRI DOSSIER TECNICO</span>
                    <span>[ 0{idx + 1} ]</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. INDEX TABLE MODE */}
        {viewMode === 'index' && (
          <ActiveTheoryIndexTable
            onSelectProject={onSelectProject}
            onOpenBimViewer={onOpenBimViewer}
          />
        )}
      </div>
    </section>
  );
};

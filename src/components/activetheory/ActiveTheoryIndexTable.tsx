import React, { useState } from 'react';
import { ARCHITECTURAL_PROJECTS, ArchitecturalProject } from '../../data/projectsData';
import { audioSystem } from '../../utils/audioSynthesizer';
import { ArrowUpRight, Eye, Layers } from 'lucide-react';

interface ActiveTheoryIndexTableProps {
  onSelectProject: (projectId: string) => void;
  onOpenBimViewer: () => void;
}

export const ActiveTheoryIndexTable: React.FC<ActiveTheoryIndexTableProps> = ({
  onSelectProject,
  onOpenBimViewer,
}) => {
  const [hoveredProject, setHoveredProject] = useState<ArchitecturalProject | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div
      id="active-theory-index-table-container"
      className="relative w-full overflow-x-auto py-6"
      onMouseMove={handleMouseMove}
    >
      <table className="w-full text-left border-collapse font-mono text-xs">
        <thead>
          <tr className="border-b border-white/20 text-white/40 uppercase tracking-widest text-[10px]">
            <th className="py-4 px-4">#</th>
            <th className="py-4 px-4">Opera / Progetto</th>
            <th className="py-4 px-4">Tipologia</th>
            <th className="py-4 px-4">Standard & LOD</th>
            <th className="py-4 px-4">Location</th>
            <th className="py-4 px-4">Area m²</th>
            <th className="py-4 px-4">Anno</th>
            <th className="py-4 px-4 text-right">Azione</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {ARCHITECTURAL_PROJECTS.map((proj, idx) => (
            <tr
              key={proj.id}
              onClick={() => {
                audioSystem.playClick(600);
                onSelectProject(proj.id);
              }}
              onMouseEnter={() => {
                audioSystem.playTechHover();
                setHoveredProject(proj);
              }}
              onMouseLeave={() => setHoveredProject(null)}
              className="group hover:bg-cyan-950/20 cursor-pointer transition-colors"
            >
              <td className="py-5 px-4 text-cyan-400 font-bold">
                [{String(idx + 1).padStart(2, '0')}]
              </td>
              <td className="py-5 px-4 font-sans font-bold text-sm sm:text-base text-white group-hover:text-cyan-300 transition-colors">
                <div className="flex items-center gap-2">
                  <span>{proj.title}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400" />
                </div>
                <div className="font-mono text-[10px] text-white/40 font-normal uppercase mt-0.5">
                  {proj.subtitle}
                </div>
              </td>
              <td className="py-5 px-4 text-amber-300 uppercase tracking-wider text-[11px]">
                {proj.categoryLabel}
              </td>
              <td className="py-5 px-4 text-white/80">
                <span className="px-2 py-0.5 border border-cyan-400/30 bg-cyan-950/40 text-cyan-300 text-[10px] uppercase">
                  {proj.lod}
                </span>
              </td>
              <td className="py-5 px-4 text-white/60">
                {proj.location}
              </td>
              <td className="py-5 px-4 text-white font-semibold">
                {proj.areaM2} m²
              </td>
              <td className="py-5 px-4 text-white/60">
                {proj.year}
              </td>
              <td className="py-5 px-4 text-right">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    audioSystem.playClick(600);
                    onSelectProject(proj.id);
                  }}
                  className="px-3 py-1 border border-white/20 text-white/80 group-hover:border-cyan-400 group-hover:text-cyan-300 group-hover:bg-cyan-950/40 uppercase tracking-wider text-[10px] transition-all"
                >
                  Case Study
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Floating Holographic Hover Card (Active Theory Signature Index Feature) */}
      {hoveredProject && (
        <div
          id="index-hover-hologram"
          className="fixed pointer-events-none z-50 w-72 bg-stone-950/95 border border-cyan-400/60 p-3 shadow-[0_0_30px_rgba(0,240,255,0.25)] backdrop-blur-xl transition-opacity duration-150 animate-in fade-in zoom-in-95"
          style={{
            left: `${mousePos.x + 20}px`,
            top: `${mousePos.y - 120}px`,
          }}
        >
          <div className="relative h-36 w-full overflow-hidden mb-2 border border-white/10">
            <img
              src={hoveredProject.coverImage}
              alt={hoveredProject.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/80 font-mono text-[9px] text-cyan-300 border border-cyan-400/40 uppercase">
              {hoveredProject.lod}
            </div>
            <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 font-mono text-[9px] text-amber-300 border border-amber-400/40 uppercase">
              {hoveredProject.estimatedValueEur}
            </div>
          </div>
          <div className="font-sans font-bold text-white text-xs uppercase mb-1">
            {hoveredProject.title}
          </div>
          <div className="font-mono text-[9px] text-white/50 uppercase mb-2">
            IFC: {hoveredProject.bimData.elementsCount.toLocaleString('it-IT')} ELEMENTI • {hoveredProject.bimData.qtoAccuracy}
          </div>
          <div className="text-[10px] font-mono text-cyan-400 flex items-center justify-between pt-1 border-t border-white/10">
            <span>CLICCA PER APRIRE</span>
            <span>[ + ]</span>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SmoothScroll } from '../webgl/SmoothScroll';
import { audioSystem } from '../utils/audioSynthesizer';

export interface SectionMeta {
  id: string;
  name: string;
  shortName: string;
  category: string;
}

export const SECTIONS_CONFIG: SectionMeta[] = [
  { id: 'hero', name: 'Inizio // Visione & BIM', shortName: 'INIZIO', category: 'INTRO' },
  { id: 'profilo', name: 'Profilo Professionale', shortName: 'PROFILO', category: 'ESPERIENZA' },
  { id: 'competenze', name: 'Competenze Tecniche', shortName: 'COMPETENZE', category: 'SKILLS' },
  { id: 'certificazioni', name: 'Formazione e Certificazioni', shortName: 'CERTIFICAZIONI', category: 'COMPLIANCE' },
  { id: 'rendering', name: 'Realizzazione Rendering', shortName: 'RENDERING', category: 'ARCHVIZ' },
  { id: 'pyrevit-python', name: 'Sviluppo pyRevit & Python', shortName: 'pyREVIT', category: 'DEV & SDK' },
  { id: 'virtual-staging', name: 'Virtual Staging (Prima & Dopo)', shortName: 'STAGING', category: 'INTERIORS' },
  { id: 'galleria-showcase', name: 'Galleria Rendering & Fotografia', shortName: 'ARCHIVIO', category: 'ARCHIVIO' },
  { id: 'contact', name: 'Contatto Diretto', shortName: 'CONTATTO', category: 'COMMISSIONI' },
];

interface ReadingProgressBarProps {
  scroller?: SmoothScroll | null;
  onScrollToSection?: (sectionId: string) => void;
}

export const ReadingProgressBar: React.FC<ReadingProgressBarProps> = ({
  scroller,
  onScrollToSection,
}) => {
  const [progress, setProgress] = useState<number>(0);
  const [activeSectionId, setActiveSectionId] = useState<string>('hero');
  const [sectionOffsets, setSectionOffsets] = useState<{ id: string; pct: number }[]>([]);
  const [hoveredTick, setHoveredTick] = useState<SectionMeta | null>(null);
  const rafId = useRef<number | null>(null);

  // Measure section positions relative to maximum scroll distance
  const updateOffsets = useCallback(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const content = document.getElementById('smooth-content');
    const contentHeight = content ? content.offsetHeight : 0;
    const docHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
      contentHeight
    );
    const maxScroll = Math.max(1, docHeight - window.innerHeight);

    const offsets = SECTIONS_CONFIG.map((sec) => {
      const el = document.getElementById(sec.id);
      if (!el) return { id: sec.id, pct: 0 };
      const top = el.offsetTop;
      const pct = Math.min(100, Math.max(0, (top / maxScroll) * 100));
      return { id: sec.id, pct };
    });

    setSectionOffsets(offsets);
  }, []);

  // Compute active section and current scroll progress
  const updateProgressAndSection = useCallback(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const scrollY = window.scrollY || window.pageYOffset || 0;
    const content = document.getElementById('smooth-content');
    const contentHeight = content ? content.offsetHeight : 0;
    const docHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
      contentHeight
    );
    const maxScroll = Math.max(1, docHeight - window.innerHeight);

    // Calculate percentage
    const currentPct = Math.min(100, Math.max(0, (scrollY / maxScroll) * 100));
    setProgress(currentPct);

    // Determine current section in view
    // At near-bottom, default to the last section
    if (scrollY + window.innerHeight >= docHeight - 80) {
      setActiveSectionId('contact');
      return;
    }

    // Otherwise find section closest to viewport focus line (top 35%)
    const focusLine = scrollY + window.innerHeight * 0.35;
    let currentId = 'hero';

    for (let i = 0; i < SECTIONS_CONFIG.length; i++) {
      const sec = SECTIONS_CONFIG[i];
      const el = document.getElementById(sec.id);
      if (el) {
        if (focusLine >= el.offsetTop) {
          currentId = sec.id;
        }
      }
    }

    setActiveSectionId(currentId);
  }, []);

  // Listen to both native events and smooth scroll updates
  useEffect(() => {
    updateOffsets();
    updateProgressAndSection();

    const handleScroll = () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
      rafId.current = requestAnimationFrame(() => {
        updateProgressAndSection();
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', () => {
      updateOffsets();
      updateProgressAndSection();
    });

    if (scroller) {
      scroller.onUpdate(() => {
        handleScroll();
      });
    }

    // Re-check after 800ms when images/fonts finish loading
    const timer = setTimeout(() => {
      updateOffsets();
      updateProgressAndSection();
    }, 800);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
      clearTimeout(timer);
    };
  }, [scroller, updateOffsets, updateProgressAndSection]);

  const handleTickClick = (secId: string, index: number) => {
    audioSystem.playClick(580 + index * 45);
    if (onScrollToSection) {
      onScrollToSection(secId);
    } else {
      const el = document.getElementById(secId);
      if (el) {
        window.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
      }
    }
  };

  const activeSection =
    SECTIONS_CONFIG.find((s) => s.id === activeSectionId) || SECTIONS_CONFIG[0];

  return (
    <>
      {/* 1. Sottile Barra di Progresso Fissata in Cima allo Schermo (2.5px) */}
      <div
        id="reading-progress-track"
        className="fixed top-0 left-0 w-full h-[2.5px] z-50 bg-stone-900/60 backdrop-blur-[1px] select-none pointer-events-auto"
        role="progressbar"
        aria-label="Progresso di lettura della pagina"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {/* Dynamic Gradient Fill */}
        <div
          id="reading-progress-bar"
          className="h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-purple-400 relative transition-[width] duration-75 ease-out shadow-[0_0_12px_rgba(0,240,255,0.85)]"
          style={{ width: `${progress}%` }}
        >
          {/* Glowing Leading Head / Particle */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_8px_#00f0ff] ring-2 ring-cyan-400/40" />
        </div>

        {/* Section Checkpoint Tick Markers Along the Top Edge */}
        {sectionOffsets.map((item, idx) => {
          const config = SECTIONS_CONFIG[idx];
          const isPassed = progress >= item.pct;
          const isActive = activeSectionId === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleTickClick(item.id, idx)}
              onMouseEnter={() => {
                audioSystem.playTechHover();
                setHoveredTick(config);
              }}
              onMouseLeave={() => setHoveredTick(null)}
              style={{ left: `${item.pct}%` }}
              title={`${config.name} (${Math.round(item.pct)}%)`}
              className="absolute top-0 -translate-x-1/2 h-full w-2.5 flex items-center justify-center group focus:outline-none cursor-pointer"
            >
              {/* Tick Line */}
              <span
                className={`w-[1.5px] transition-all duration-200 ${
                  isActive
                    ? 'h-3.5 bg-cyan-300 shadow-[0_0_8px_rgba(0,240,255,0.9)]'
                    : isPassed
                    ? 'h-2 bg-white/70 group-hover:h-3 group-hover:bg-cyan-400'
                    : 'h-1.5 bg-white/20 group-hover:h-2.5 group-hover:bg-white/60'
                }`}
              />
            </button>
          );
        })}

        {/* Floating Tooltip When Hovering Over a Section Tick */}
        {hoveredTick && (
          <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-1 bg-stone-950/95 border border-cyan-400/60 shadow-[0_4px_20px_rgba(0,0,0,0.8)] backdrop-blur-md flex items-center gap-2 font-mono text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-white/50 uppercase text-[10px]">{hoveredTick.category} //</span>
              <span className="text-cyan-300 font-bold tracking-wide uppercase">
                {hoveredTick.name}
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

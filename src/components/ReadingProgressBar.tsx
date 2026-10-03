import React, { useState, useEffect, useRef, useCallback } from 'react';
import { audioSystem } from '../utils/audioSynthesizer';
import { SmoothScroll } from '../webgl/SmoothScroll';

interface SectionMeta {
  id: string;
  name: string;
  shortName: string;
  category: string;
}

export const SECTIONS_CONFIG: SectionMeta[] = [
  { id: 'hero', name: 'Inizio / Identità', shortName: 'TOP', category: 'INTRO' },
  { id: 'profilo', name: 'Profilo & Filosofia', shortName: 'PROFILO', category: 'BIO' },
  { id: 'competenze', name: 'Competenze & Metodo', shortName: 'SKILLS', category: 'METODO' },
  { id: 'opere-selezionate', name: 'Opere & Modelli 3D', shortName: 'OPERE', category: 'PROGETTI' },
  { id: 'virtual-staging', name: 'Virtual Staging (Prima & Dopo)', shortName: 'STAGING', category: 'INTERIORS' },
  { id: 'galleria-showcase', name: 'Galleria Rendering & Fotografia', shortName: 'ARCHIVIO', category: 'ARCHIVIO' },
  { id: 'youtube-playlist', name: 'Video Revit Precast Manager', shortName: 'VIDEO YT', category: 'TUTORIAL' },
  { id: 'progetti-revit', name: 'Progetti Revit // Modelli 3D', shortName: 'PROGETTI REVIT', category: 'MODELLI' },
  { id: 'contact', name: 'Contatto Diretto', shortName: 'CONTATTO', category: 'COMMISSIONI' },
  { id: 'budget-cost-precast', name: 'Budget Cost Precast', shortName: 'PRECAST APP', category: 'SOFTWARE' },
  { id: 'bim-suite-access', name: 'BIM Quantum Lab // Suite Epica', shortName: 'BIM LAB', category: 'SUITE' },
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

  const progressBarRef = useRef<HTMLDivElement>(null);
  const cachedMaxScrollRef = useRef<number>(1);
  const cachedDocHeightRef = useRef<number>(1);
  const sectionTopsRef = useRef<{ id: string; top: number }[]>([]);
  const activeSectionIdRef = useRef<string>('hero');
  const rafId = useRef<number | null>(null);

  // Measure and cache positions only on resize or initial load (Zero layout thrashing during scroll)
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
    cachedMaxScrollRef.current = maxScroll;
    cachedDocHeightRef.current = docHeight;

    const tops: { id: string; top: number }[] = [];
    const offsets = SECTIONS_CONFIG.map((sec) => {
      const el = document.getElementById(sec.id);
      if (!el) {
        tops.push({ id: sec.id, top: 0 });
        return { id: sec.id, pct: 0 };
      }
      const top = el.offsetTop;
      tops.push({ id: sec.id, top });
      const pct = Math.min(100, Math.max(0, (top / maxScroll) * 100));
      return { id: sec.id, pct };
    });

    sectionTopsRef.current = tops;
    setSectionOffsets(offsets);
  }, []);

  // Compute active section and current scroll progress using cached measurements
  const updateProgressAndSection = useCallback(() => {
    if (typeof window === 'undefined') return;

    const scrollY = window.scrollY || window.pageYOffset || 0;
    const maxScroll = cachedMaxScrollRef.current;
    const docHeight = cachedDocHeightRef.current;

    // Calculate percentage
    const currentPct = Math.min(100, Math.max(0, (scrollY / maxScroll) * 100));

    // Update progress bar width directly for zero-latency 120fps smoothness
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${currentPct}%`;
    }

    // Determine current section in view
    let currentId = 'hero';
    if (scrollY + window.innerHeight >= docHeight - 80) {
      currentId = 'contact';
    } else {
      const focusLine = scrollY + window.innerHeight * 0.35;
      const tops = sectionTopsRef.current;
      for (let i = 0; i < tops.length; i++) {
        if (focusLine >= tops[i].top) {
          currentId = tops[i].id;
        }
      }
    }

    if (currentId !== activeSectionIdRef.current) {
      activeSectionIdRef.current = currentId;
      setActiveSectionId(currentId);
    }
  }, []);

  // Listen to native scroll with lightweight RAF throttling
  useEffect(() => {
    updateOffsets();
    updateProgressAndSection();

    const handleScroll = () => {
      if (rafId.current !== null) return;
      rafId.current = requestAnimationFrame(() => {
        rafId.current = null;
        updateProgressAndSection();
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', () => {
      updateOffsets();
      updateProgressAndSection();
    }, { passive: true });

    if (scroller) {
      scroller.onUpdate(() => {
        handleScroll();
      });
    }

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

  const handleTickClick = (sectionId: string, idx: number) => {
    audioSystem.playClick(600 + idx * 40);
    if (onScrollToSection) {
      onScrollToSection(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
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
          ref={progressBarRef}
          id="reading-progress-bar"
          className="h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-purple-400 relative shadow-[0_0_12px_rgba(0,240,255,0.85)]"
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
          <div
            className="absolute top-4 -translate-x-1/2 px-2.5 py-1 bg-stone-950/95 border border-cyan-400/80 shadow-[0_4px_20px_rgba(0,0,0,0.8)] backdrop-blur-md pointer-events-none font-mono text-[10px] text-white whitespace-nowrap animate-in fade-in zoom-in-95 duration-150 flex items-center gap-2"
            style={{
              left: `${
                sectionOffsets.find((s) => s.id === hoveredTick.id)?.pct || 50
              }%`,
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="font-bold text-cyan-300">
              [{hoveredTick.shortName}]
            </span>
            <span>{hoveredTick.name}</span>
          </div>
        )}
      </div>

      {/* 2. Compact Minimal HUD Badge Top Right */}
      <div className="fixed top-3 right-4 z-40 hidden lg:flex items-center gap-2 px-2.5 py-1 bg-stone-950/70 backdrop-blur-md border border-white/10 font-mono text-[10px] text-white/70 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        <span className="text-white/40 uppercase">{activeSection.category}</span>
        <span>•</span>
        <span className="text-cyan-300 font-bold">{activeSection.shortName}</span>
      </div>
    </>
  );
};

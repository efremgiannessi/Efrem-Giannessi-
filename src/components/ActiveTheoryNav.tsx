import React, { useState, useEffect, useCallback } from 'react';
import { audioSystem } from '../utils/audioSynthesizer';
import { SECTIONS_CONFIG } from './ReadingProgressBar';
import { GraphicTheme } from '../webgl/SceneManager';
import { Shuffle } from 'lucide-react';

interface ActiveTheoryNavProps {
  onScrollToSection?: (id: string) => void;
  onRandomTheme?: () => void;
  activeTheme?: GraphicTheme;
  // Optional legacy props kept for backwards compatibility
  onOpenRevitModal?: () => void;
  onOpenAuditModal?: () => void;
  onCycleTheme?: () => void;
  onSelectTheme?: (index: number) => void;
}

export const ActiveTheoryNav: React.FC<ActiveTheoryNavProps> = ({
  onScrollToSection,
  onRandomTheme,
  activeTheme,
}) => {
  const [progress, setProgress] = useState<number>(0);
  const [activeSectionId, setActiveSectionId] = useState<string>('hero');

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

    const currentPct = Math.min(100, Math.max(0, (scrollY / maxScroll) * 100));
    setProgress(currentPct);

    if (scrollY + window.innerHeight >= docHeight - 80) {
      setActiveSectionId('contact');
      return;
    }

    const focusLine = scrollY + window.innerHeight * 0.35;
    let currentId = 'hero';

    for (let i = 0; i < SECTIONS_CONFIG.length; i++) {
      const sec = SECTIONS_CONFIG[i];
      const el = document.getElementById(sec.id);
      if (el && focusLine >= el.offsetTop) {
        currentId = sec.id;
      }
    }

    setActiveSectionId(currentId);
  }, []);

  useEffect(() => {
    updateProgressAndSection();

    let rafId: number | null = null;
    const handleScroll = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateProgressAndSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [updateProgressAndSection]);

  const handleClickName = () => {
    audioSystem.playClick(520);
    if (onScrollToSection) {
      onScrollToSection('hero');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const activeSection =
    SECTIONS_CONFIG.find((s) => s.id === activeSectionId) || SECTIONS_CONFIG[0];

  return (
    <header className="fixed top-0 left-0 w-full z-40 px-6 md:px-12 py-4 md:py-5 flex items-center justify-between border-b border-white/10 bg-[#050508]/85 backdrop-blur-md transition-all select-none">
      {/* Nome e status navigazione */}
      <button
        onClick={handleClickName}
        onMouseEnter={() => audioSystem.playTechHover()}
        className="flex items-center gap-3 group text-left transition-all"
        title="Torna all'inizio"
      >
        <span className="w-2 h-2 rounded-full bg-cyan-400 group-hover:scale-125 transition-transform animate-pulse shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
        <span className="text-sm sm:text-base font-black tracking-widest font-mono text-stone-100 group-hover:text-cyan-400 transition-colors uppercase">
          EFREM GIANNESSI
        </span>
      </button>

      {/* Sezione Attuale & Telemetria di Lettura */}
      <div className="flex items-center gap-3">
        {/* Badge Sezione Attiva & % */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-white/40 text-[10px] uppercase hidden sm:inline">SEZIONE //</span>
          <div className="px-2.5 py-1 bg-white/5 border border-white/10 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_rgba(0,240,255,0.8)]" />
            <span className="text-cyan-300 font-bold uppercase tracking-wider text-[10px] sm:text-[11px]">
              {activeSection.shortName}
            </span>
          </div>

          <div className="px-2 py-1 bg-black/60 border border-white/10 text-[10px] sm:text-[11px] text-white/80 font-mono">
            <span className="text-cyan-400 font-bold">{Math.round(progress)}</span>%
          </div>
        </div>

        {/* Pulsante Cambio Rapido Effetto Sfondo Random */}
        {onRandomTheme && (
          <button
            onClick={() => {
              audioSystem.playClick(680);
              onRandomTheme();
            }}
            onMouseEnter={() => audioSystem.playTechHover()}
            title="Genera e applica un effetto di sfondo 3D casuale"
            className="flex items-center gap-1.5 px-2.5 py-1 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-400/60 hover:border-cyan-300 text-cyan-300 hover:text-white text-[10px] sm:text-[11px] font-bold font-mono tracking-wider transition-all cursor-pointer shadow-[0_0_8px_rgba(0,240,255,0.2)]"
          >
            <Shuffle className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span className="hidden sm:inline">RANDOM FX</span>
            {activeTheme && (
              <span className="text-white/50 text-[9px] hidden md:inline">
                [{activeTheme.code}]
              </span>
            )}
          </button>
        )}

        {/* Quick-Jump Section Indicators (Desktop) */}
        <div className="hidden lg:flex items-center gap-1.5 pl-3 border-l border-white/10">
          {SECTIONS_CONFIG.map((sec, idx) => (
            <button
              key={sec.id}
              onClick={() => {
                audioSystem.playClick(600 + idx * 35);
                if (onScrollToSection) onScrollToSection(sec.id);
              }}
              onMouseEnter={() => audioSystem.playTechHover()}
              title={`${sec.name}`}
              className="py-1 px-0.5 group focus:outline-none cursor-pointer"
            >
              <div
                className={`h-1.5 transition-all duration-300 rounded-xs ${
                  activeSectionId === sec.id
                    ? 'w-5 bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.8)]'
                    : 'w-1.5 bg-white/20 group-hover:bg-white/60'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Sottile linea di progresso integrata sul bordo inferiore dell'header */}
      <div className="absolute bottom-0 left-0 w-full h-[1.5px] bg-white/5 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-purple-400 transition-[width] duration-75 ease-out shadow-[0_0_8px_rgba(0,240,255,0.6)]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </header>
  );
};


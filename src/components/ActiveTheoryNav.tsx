import React from 'react';
import { audioSystem } from '../utils/audioSynthesizer';

interface ActiveTheoryNavProps {
  onScrollToSection?: (id: string) => void;
  // Optional legacy props kept for backwards compatibility
  onOpenRevitModal?: () => void;
  onOpenAuditModal?: () => void;
  activeTheme?: unknown;
  onCycleTheme?: () => void;
  onSelectTheme?: (index: number) => void;
}

export const ActiveTheoryNav: React.FC<ActiveTheoryNavProps> = ({
  onScrollToSection,
}) => {
  const handleClickName = () => {
    audioSystem.playClick(520);
    if (onScrollToSection) {
      onScrollToSection('hero');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-40 px-6 md:px-12 py-5 flex items-center justify-between border-b border-white/10 bg-[#050508]/80 backdrop-blur-md transition-all select-none">
      {/* Solo il nome nella barra di navigazione in alto */}
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
    </header>
  );
};

import React from 'react';
import { motion } from 'motion/react';
import { OfficeStation } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { audioSystem } from '../utils/audioSynthesizer';

interface EmojiNavigationDockProps {
  stations: OfficeStation[];
  activeStationId: string;
  onSelectStation: (station: OfficeStation) => void;
  onNextStation: () => void;
  onPrevStation: () => void;
}

export const EmojiNavigationDock: React.FC<EmojiNavigationDockProps> = ({
  stations,
  activeStationId,
  onSelectStation,
  onNextStation,
  onPrevStation,
}) => {
  return (
    <nav
      aria-label="Navigazione postazioni ufficio con emoji"
      className="fixed bottom-3 sm:bottom-5 left-0 right-0 z-30 flex flex-col items-center justify-center px-2 sm:px-4 pb-safe pointer-events-none"
    >
      {/* Squared Architectural Dock Container */}
      <div
        id="emoji-dock-container"
        className="pointer-events-auto relative flex max-w-[98vw] sm:max-w-4xl items-center gap-1 sm:gap-2 rounded-none sm:rounded-sm border border-white/15 bg-stone-950/90 p-1 sm:p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl transition-all"
      >
        {/* Architectural Corner accents */}
        <div className="absolute -top-px -left-px w-2 h-2 border-t border-l border-amber-400/80 pointer-events-none" />
        <div className="absolute -top-px -right-px w-2 h-2 border-t border-r border-amber-400/80 pointer-events-none" />
        <div className="absolute -bottom-px -left-px w-2 h-2 border-b border-l border-amber-400/80 pointer-events-none" />
        <div className="absolute -bottom-px -right-px w-2 h-2 border-b border-r border-amber-400/80 pointer-events-none" />

        {/* Quick Prev Button */}
        <button
          type="button"
          id="btn-prev-station"
          onClick={() => {
            audioSystem.playClick(480);
            onPrevStation();
          }}
          title="Postazione precedente"
          className="flex h-9 w-8 sm:h-11 sm:w-9 shrink-0 items-center justify-center rounded-none sm:rounded-sm text-stone-400 hover:bg-white/10 hover:text-white transition-colors border border-white/5 hover:border-white/20 focus:outline-none focus:ring-1 focus:ring-amber-400 active:scale-95"
        >
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>

        {/* Stations Emoji List */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-0.5 px-0.5">
          {stations.map((station, index) => {
            const isActive = station.id === activeStationId;
            const stationCode = `0${index + 1}`;

            return (
              <button
                key={station.id}
                type="button"
                id={`dock-station-${station.id}`}
                onClick={() => {
                  if (!isActive) {
                    audioSystem.playClick(520 + index * 50);
                    onSelectStation(station);
                  }
                }}
                className={`group relative flex flex-col items-center justify-center rounded-none sm:rounded-sm px-2.5 py-1.5 sm:px-3.5 sm:py-2 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-amber-400 ${
                  isActive
                    ? 'bg-stone-900/90 text-white shadow-md border border-amber-400/80'
                    : 'text-stone-300 hover:bg-white/5 hover:text-white border border-white/5 hover:border-white/15'
                }`}
              >
                {/* Active Indicator Top Line */}
                {isActive && (
                  <motion.div
                    layoutId="activeDockIndicator"
                    className="absolute top-0 left-0 right-0 h-0.5 bg-amber-400"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}

                {/* Index Code */}
                <span className="font-mono text-[9px] tracking-widest text-stone-400 mb-0.5">
                  {stationCode}
                </span>

                {/* Emoji */}
                <span
                  className={`relative text-xl sm:text-2xl transition-transform duration-200 group-hover:scale-110 select-none ${
                    isActive ? 'scale-105 drop-shadow-[0_2px_8px_rgba(251,191,36,0.4)]' : ''
                  }`}
                >
                  {station.emoji}
                </span>

                {/* Short Label */}
                <span className="relative mt-1 text-[11px] sm:text-xs font-semibold tracking-wide whitespace-nowrap">
                  {station.shortName}
                </span>

                {/* Active Status Badge */}
                {isActive && (
                  <span className="mt-1 inline-block h-1 w-3 rounded-none bg-amber-400" />
                )}

                {/* Tooltip with Tagline */}
                <div className="pointer-events-none absolute bottom-full mb-3 hidden -translate-x-1/2 left-1/2 sm:group-hover:flex flex-col items-center whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50">
                  <div className="rounded-none sm:rounded-sm border border-white/15 bg-stone-950/95 px-3 py-1.5 text-xs text-stone-200 shadow-2xl backdrop-blur-md">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-amber-400">{stationCode}</span>
                      <p className="font-semibold text-white tracking-wide">{station.name}</p>
                    </div>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-stone-400 mt-0.5">{station.category}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Quick Next Button */}
        <button
          type="button"
          id="btn-next-station"
          onClick={() => {
            audioSystem.playClick(620);
            onNextStation();
          }}
          title="Postazione successiva"
          className="flex h-9 w-8 sm:h-11 sm:w-9 shrink-0 items-center justify-center rounded-none sm:rounded-sm text-stone-400 hover:bg-white/10 hover:text-white transition-colors border border-white/5 hover:border-white/20 focus:outline-none focus:ring-1 focus:ring-amber-400 active:scale-95"
        >
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </div>

      {/* Micro helper text underneath */}
      <div className="mt-1.5 flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-stone-400 uppercase">
        <span className="inline-block w-1.5 h-1.5 bg-amber-400" />
        <span>NAVIGAZIONE ARCHITETTURA // SELEZIONA POSTAZIONE PER SPOSTARTI</span>
      </div>
    </nav>
  );
};

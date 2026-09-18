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
      className="fixed bottom-3 sm:bottom-6 left-0 right-0 z-30 flex flex-col items-center justify-center px-2 sm:px-4 pb-safe pointer-events-none"
    >
      {/* Dock Container */}
      <div
        id="emoji-dock-container"
        className="pointer-events-auto relative flex max-w-[96vw] sm:max-w-4xl items-center gap-1 sm:gap-3 rounded-2xl sm:rounded-3xl border border-white/20 bg-stone-950/85 p-1.5 sm:p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl transition-all"
      >
        {/* Quick Prev Button */}
        <button
          type="button"
          id="btn-prev-station"
          onClick={() => {
            audioSystem.playClick(480);
            onPrevStation();
          }}
          title="Postazione precedente"
          className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl text-stone-400 hover:bg-white/10 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 active:scale-95"
        >
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>

        {/* Stations Emoji List */}
        <div className="flex items-center gap-1 sm:gap-2.5 overflow-x-auto no-scrollbar py-0.5 px-0.5">
          {stations.map((station, index) => {
            const isActive = station.id === activeStationId;

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
                className={`group relative flex flex-col items-center justify-center rounded-2xl px-2.5 py-1.5 sm:px-4 sm:py-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400/80 ${
                  isActive
                    ? 'bg-gradient-to-b from-white/20 to-white/5 text-white shadow-lg shadow-amber-500/10 scale-105 border border-amber-400/40'
                    : 'text-stone-300 hover:bg-white/10 hover:text-white hover:scale-105 border border-transparent'
                }`}
              >
                {/* Active Indicator Ring */}
                {isActive && (
                  <motion.div
                    layoutId="activeDockIndicator"
                    className="absolute inset-0 rounded-2xl bg-amber-500/15 border border-amber-400/60"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}

                {/* Emoji with bounce on hover */}
                <span
                  className={`relative text-2xl sm:text-3xl transition-transform duration-300 group-hover:scale-120 select-none ${
                    isActive ? 'scale-110 drop-shadow-[0_4px_12px_rgba(251,191,36,0.5)]' : ''
                  }`}
                >
                  {station.emoji}
                </span>

                {/* Short Label */}
                <span className="relative mt-1 text-[11px] sm:text-xs font-medium tracking-wide whitespace-nowrap">
                  {station.shortName}
                </span>

                {/* Micro Dot on Active */}
                {isActive && (
                  <span className="relative mt-0.5 h-1 w-1 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
                )}

                {/* Tooltip with Tagline */}
                <div className="pointer-events-none absolute bottom-full mb-3 hidden -translate-x-1/2 left-1/2 sm:group-hover:flex flex-col items-center whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="rounded-xl border border-white/20 bg-stone-900/95 px-3 py-1.5 text-xs text-stone-200 shadow-xl backdrop-blur-md">
                    <p className="font-semibold text-white">{station.name}</p>
                    <p className="text-[10px] text-amber-300">{station.category}</p>
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
          className="flex h-11 w-11 items-center justify-center rounded-2xl text-stone-400 hover:bg-white/10 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Micro helper text underneath */}
      <p className="mt-2 text-[11px] font-medium tracking-wide text-white/60 drop-shadow">
        Clicca sulle <span className="text-amber-300 font-semibold">emoji</span> per spostarti tra le stanze e le postazioni dell'ufficio
      </p>
    </nav>
  );
};

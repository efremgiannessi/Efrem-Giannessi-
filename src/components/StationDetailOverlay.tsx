import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { OfficeStation } from '../types';
import { Sparkles, Users, Info, ChevronUp, ChevronDown, CheckCircle2, Bookmark } from 'lucide-react';
import { audioSystem } from '../utils/audioSynthesizer';

interface StationDetailOverlayProps {
  station: OfficeStation;
  onExploreHotspots: () => void;
}

export const StationDetailOverlay: React.FC<StationDetailOverlayProps> = ({
  station,
  onExploreHotspots,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [bookingToast, setBookingToast] = useState<string | null>(null);

  const handleBooking = () => {
    audioSystem.playClick(750);
    setBookingToast(`Postazione "${station.shortName}" riservata per te!`);
    setTimeout(() => setBookingToast(null), 3000);
  };

  return (
    <aside
      aria-label="Dettagli postazione attiva"
      className="fixed top-20 left-6 z-20 max-w-sm sm:max-w-md pointer-events-auto"
    >
      <motion.div
        key={station.id}
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="overflow-hidden rounded-3xl border border-white/20 bg-stone-950/85 p-5 shadow-[0_15px_35px_rgba(0,0,0,0.5)] backdrop-blur-xl text-white"
      >
        {/* Header with Emoji & Title */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-3xl shadow-inner">
              {station.emoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase text-amber-300 border border-amber-500/30">
                  {station.category}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-stone-300">
                  <Users className="h-3 w-3 text-stone-400" />
                  {station.capacity}
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white mt-0.5">
                {station.name}
              </h1>
            </div>
          </div>

          {/* Minimize/Expand Toggle */}
          <button
            type="button"
            id="toggle-details-card"
            onClick={() => {
              audioSystem.playClick(500);
              setIsExpanded(!isExpanded);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-stone-300 hover:bg-white/20 hover:text-white transition-colors"
            title={isExpanded ? 'Riduci scheda' : 'Espandi scheda'}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>

        {/* Collapsible Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-3.5 space-y-3"
            >
              <p className="text-xs text-stone-300 leading-relaxed">
                {station.description}
              </p>

              {/* Equipment Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {station.features.map((feature) => (
                  <span
                    key={feature}
                    className="inline-flex items-center gap-1 rounded-lg bg-white/5 px-2.5 py-1 text-[11px] text-stone-300 border border-white/10"
                  >
                    <Sparkles className="h-2.5 w-2.5 text-amber-400" />
                    {feature}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  id="btn-reserve-station"
                  onClick={handleBooking}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-3.5 py-2 text-xs font-semibold text-stone-950 shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition-all active:scale-98"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Prenota Postazione
                </button>

                <button
                  type="button"
                  id="btn-inspect-hotspots"
                  onClick={() => {
                    audioSystem.playClick(650);
                    onExploreHotspots();
                  }}
                  className="flex items-center justify-center gap-1 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-medium text-white hover:bg-white/20 transition-colors"
                  title="Esplora punti interattivi"
                >
                  <Info className="h-3.5 w-3.5 text-amber-400" />
                  Punti Interattivi ({station.hotspots.length})
                </button>

                <button
                  type="button"
                  id="btn-bookmark-station"
                  onClick={() => {
                    audioSystem.playClick(600);
                    setIsBookmarked(!isBookmarked);
                  }}
                  className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-colors ${
                    isBookmarked
                      ? 'border-amber-400 bg-amber-500/20 text-amber-400'
                      : 'border-white/20 bg-white/5 text-stone-300 hover:bg-white/15 hover:text-white'
                  }`}
                  title={isBookmarked ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
                >
                  <Bookmark className="h-4 w-4" />
                </button>
              </div>

              {/* Feedback toast */}
              {bookingToast && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl bg-emerald-500/20 border border-emerald-500/40 p-2 text-center text-xs font-medium text-emerald-300"
                >
                  {bookingToast}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </aside>
  );
};

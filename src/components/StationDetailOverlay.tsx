import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { OfficeStation, LightingMode } from '../types';
import {
  Sparkles,
  Users,
  Info,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  Bookmark,
  Box,
  Split,
  Compass,
  Clock,
  Sun,
  Sunset,
  Moon,
  Calculator,
} from 'lucide-react';
import { audioSystem } from '../utils/audioSynthesizer';

interface StationDetailOverlayProps {
  station: OfficeStation;
  onExploreHotspots: () => void;
  onOpenBIMViewer: () => void;
  onOpenCadCompare: () => void;
  is360Mode: boolean;
  onToggle360Mode: () => void;
  lightingMode?: LightingMode;
  isAutoSync?: boolean;
  localTimeStr?: string;
  onOpenTimeSyncModal?: () => void;
  onOpenBookingModal?: () => void;
  onOpenBIMEstimator?: () => void;
  onOpenVirtualStaging?: () => void;
}

export const StationDetailOverlay: React.FC<StationDetailOverlayProps> = ({
  station,
  onExploreHotspots,
  onOpenBIMViewer,
  onOpenCadCompare,
  is360Mode,
  onToggle360Mode,
  lightingMode = 'day',
  isAutoSync = true,
  localTimeStr,
  onOpenTimeSyncModal,
  onOpenBookingModal,
  onOpenBIMEstimator,
  onOpenVirtualStaging,
}) => {
  // On mobile (screen width < 640px) default to collapsed to maximize video view
  const [isExpanded, setIsExpanded] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 640;
    }
    return true;
  });
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
      className="fixed top-16 sm:top-20 left-3 sm:left-6 z-20 w-[calc(100%-1.5rem)] sm:w-auto max-w-sm sm:max-w-md pointer-events-auto"
    >
      <motion.div
        key={station.id}
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="overflow-hidden rounded-2xl sm:rounded-3xl border border-white/20 bg-stone-950/90 p-3.5 sm:p-5 shadow-[0_15px_35px_rgba(0,0,0,0.6)] backdrop-blur-xl text-white"
      >
        {/* Header with Emoji & Title */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-3xl shadow-inner">
              {station.emoji}
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase text-amber-300 border border-amber-500/30">
                  {station.category}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-stone-300">
                  <Users className="h-3 w-3 text-stone-400" />
                  {station.capacity}
                </span>
                {localTimeStr && (
                  <button
                    type="button"
                    onClick={() => {
                      audioSystem.playClick(600);
                      onOpenTimeSyncModal?.();
                    }}
                    className="flex items-center gap-1 text-[10px] text-stone-300 rounded-full bg-white/10 px-2 py-0.5 hover:bg-white/15 hover:text-white transition-colors border border-white/10"
                    title="Orario locale sincronizzato. Clicca per configurare."
                  >
                    {lightingMode === 'day' && <Sun className="h-2.5 w-2.5 text-amber-400" />}
                    {lightingMode === 'sunset' && <Sunset className="h-2.5 w-2.5 text-amber-500" />}
                    {lightingMode === 'night' && <Moon className="h-2.5 w-2.5 text-indigo-400" />}
                    <span className="font-mono font-medium">{localTimeStr}</span>
                  </button>
                )}
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

              {/* Master BIM & 360 Tools Action Bar */}
              <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-white/10 mt-1">
                <button
                  type="button"
                  id="btn-open-3d-bim-viewer"
                  onClick={() => {
                    audioSystem.playClick(700);
                    onOpenBIMViewer();
                  }}
                  className="flex items-center justify-center gap-1 rounded-xl bg-amber-400/20 border border-amber-400/40 px-2 py-1.5 text-[11px] font-semibold text-amber-300 hover:bg-amber-400/30 transition-all active:scale-98"
                  title="Apri Modello 3D BIM Interattivo WebGL"
                >
                  <Box className="h-3.5 w-3.5 text-amber-400" />
                  <span>BIM 3D</span>
                </button>

                <button
                  type="button"
                  id="btn-open-cad-bim-compare"
                  onClick={() => {
                    audioSystem.playClick(700);
                    onOpenCadCompare();
                  }}
                  className="flex items-center justify-center gap-1 rounded-xl bg-sky-500/20 border border-sky-400/40 px-2 py-1.5 text-[11px] font-semibold text-sky-300 hover:bg-sky-500/30 transition-all active:scale-98"
                  title="Confronta CAD 2D e BIM 3D con Split-Screen"
                >
                  <Split className="h-3.5 w-3.5 text-sky-400" />
                  <span>CAD/BIM</span>
                </button>

                <button
                  type="button"
                  id="btn-toggle-station-360"
                  onClick={() => {
                    audioSystem.playClick(720);
                    onToggle360Mode();
                  }}
                  className={`flex items-center justify-center gap-1 rounded-xl border px-2 py-1.5 text-[11px] font-semibold transition-all active:scale-98 ${
                    is360Mode
                      ? 'bg-amber-400 text-stone-950 font-bold border-amber-300 shadow-md'
                      : 'bg-white/10 border-white/20 text-stone-200 hover:bg-white/20 hover:text-white'
                  }`}
                  title="Attiva Foto a 360° Interattiva e Mobile"
                >
                  <Compass className={`h-3.5 w-3.5 ${is360Mode ? 'text-stone-950' : 'text-amber-400'}`} />
                  <span>{is360Mode ? '360° ON' : 'Foto 360°'}</span>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  id="btn-request-consultation"
                  onClick={() => {
                    audioSystem.playClick(750);
                    if (onOpenBookingModal) {
                      onOpenBookingModal();
                    } else {
                      window.location.href = "mailto:EfremGiannessi@gmail.com?subject=Richiesta%20Informazioni%20Progetto%20BIM%20e%20Computo";
                    }
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-3.5 py-2 text-xs font-semibold text-stone-950 shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition-all active:scale-98"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Richiedi Info / Audit
                </button>

                {onOpenBIMEstimator && (station.id === 'bim-hub' || station.id === 'computo-hub') && (
                  <button
                    type="button"
                    id="btn-station-open-estimator"
                    onClick={() => {
                      audioSystem.playClick(700);
                      onOpenBIMEstimator();
                    }}
                    className="flex items-center justify-center gap-1 rounded-xl border border-amber-400/40 bg-amber-500/20 px-2.5 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/30 transition-colors"
                    title="Calcola Preventivo Parametrico BIM 5D"
                  >
                    <Calculator className="h-3.5 w-3.5" />
                    <span>Preventivo 5D</span>
                  </button>
                )}

                {onOpenVirtualStaging && (station.id === 'rendering-hub' || station.id === 'revit-design-hub') && (
                  <button
                    type="button"
                    id="btn-station-open-staging"
                    onClick={() => {
                      audioSystem.playClick(700);
                      onOpenVirtualStaging();
                    }}
                    className="flex items-center justify-center gap-1 rounded-xl border border-fuchsia-400/40 bg-fuchsia-500/20 px-2.5 py-2 text-xs font-semibold text-fuchsia-300 hover:bg-fuchsia-500/30 transition-colors"
                    title="Apri Virtual Staging & Rendering Fotorealistico"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Staging</span>
                  </button>
                )}

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
                  Punti ({station.hotspots.length})
                </button>

                <button
                  type="button"
                  id="btn-bookmark-station"
                  onClick={() => {
                    audioSystem.playClick(600);
                    setIsBookmarked(!isBookmarked);
                  }}
                  className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-colors shrink-0 ${
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

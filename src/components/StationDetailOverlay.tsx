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
      className="fixed top-14 sm:top-18 left-2 sm:left-6 z-20 w-[calc(100%-1rem)] sm:w-auto max-w-sm sm:max-w-md pointer-events-auto"
    >
      <motion.div
        key={station.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-none sm:rounded-sm border border-white/15 bg-stone-950/92 p-3 sm:p-4.5 shadow-[0_12px_40px_rgba(0,0,0,0.75)] backdrop-blur-xl text-white"
      >
        {/* Subtle Architectural Corner Marks */}
        <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-amber-400/80 pointer-events-none" />
        <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-amber-400/80 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-amber-400/80 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-amber-400/80 pointer-events-none" />

        {/* Technical Top Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3 font-mono text-[10px] uppercase tracking-wider text-stone-400">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 bg-amber-400" />
            <span className="text-white font-semibold">BIM SPEC SHEET</span>
            <span className="text-stone-500">//</span>
            <span className="text-amber-400">{station.id}</span>
          </div>
          {localTimeStr && (
            <button
              type="button"
              onClick={() => {
                audioSystem.playClick(600);
                onOpenTimeSyncModal?.();
              }}
              className="flex items-center gap-1 text-stone-300 hover:text-white transition-colors"
              title="Orario sincronizzato"
            >
              {lightingMode === 'day' && <Sun className="h-3 w-3 text-amber-400" />}
              {lightingMode === 'sunset' && <Sunset className="h-3 w-3 text-amber-500" />}
              {lightingMode === 'night' && <Moon className="h-3 w-3 text-indigo-400" />}
              <span>{localTimeStr}</span>
            </button>
          )}
        </div>

        {/* Header with Emoji & Title */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Squared Emoji Block */}
            <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-none border border-white/15 bg-stone-900/80 text-2xl sm:text-3xl shadow-sm">
              {station.emoji}
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="rounded-none bg-amber-500/15 px-2 py-0.5 font-mono text-[10px] font-bold tracking-wider uppercase text-amber-300 border border-amber-400/40">
                  {station.category}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-stone-300 font-mono">
                  <Users className="h-3 w-3 text-stone-400" />
                  CAP: {station.capacity}
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white mt-1">
                {station.name}
              </h1>
            </div>
          </div>

          {/* Squared Minimize/Expand Toggle */}
          <button
            type="button"
            id="toggle-details-card"
            onClick={() => {
              audioSystem.playClick(500);
              setIsExpanded(!isExpanded);
            }}
            className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-none border border-white/15 bg-stone-900/80 text-stone-300 hover:border-white/30 hover:text-white transition-colors"
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
              transition={{ duration: 0.25 }}
              className="mt-3 space-y-3"
            >
              <p className="text-xs text-stone-300 leading-relaxed font-normal">
                {station.description}
              </p>

              {/* Equipment Tags - Squared */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {station.features.map((feature) => (
                  <span
                    key={feature}
                    className="inline-flex items-center gap-1 rounded-none bg-stone-900/80 px-2 py-0.5 font-mono text-[10px] text-stone-300 border border-white/10"
                  >
                    <Sparkles className="h-2.5 w-2.5 text-amber-400" />
                    {feature}
                  </span>
                ))}
              </div>

              {/* Master BIM & 360 Tools Action Bar - Squared */}
              <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-white/10 mt-1">
                <button
                  type="button"
                  id="btn-open-3d-bim-viewer"
                  onClick={() => {
                    audioSystem.playClick(700);
                    onOpenBIMViewer();
                  }}
                  className="flex items-center justify-center gap-1 rounded-none bg-amber-500/15 border border-amber-400/50 px-2 py-1.5 font-mono text-[11px] font-semibold text-amber-300 hover:bg-amber-500/25 transition-all active:scale-98"
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
                  className="flex items-center justify-center gap-1 rounded-none bg-sky-500/15 border border-sky-400/50 px-2 py-1.5 font-mono text-[11px] font-semibold text-sky-300 hover:bg-sky-500/25 transition-all active:scale-98"
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
                  className={`flex items-center justify-center gap-1 rounded-none border px-2 py-1.5 font-mono text-[11px] font-semibold transition-all active:scale-98 ${
                    is360Mode
                      ? 'bg-amber-400 text-stone-950 font-bold border-amber-300 shadow-sm'
                      : 'bg-stone-900/80 border-white/15 text-stone-200 hover:border-white/30 hover:text-white'
                  }`}
                  title="Attiva Foto a 360° Interattiva e Mobile"
                >
                  <Compass className={`h-3.5 w-3.5 ${is360Mode ? 'text-stone-950' : 'text-amber-400'}`} />
                  <span>{is360Mode ? '360° ON' : 'FOTO 360°'}</span>
                </button>
              </div>

              {/* Action Buttons - Squared */}
              <div className="flex items-center gap-1.5 pt-1">
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
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-none bg-amber-400 px-3 py-2 text-xs font-bold text-stone-950 shadow-md hover:bg-amber-300 transition-all border border-amber-300 active:scale-98"
                >
                  <CheckCircle2 className="h-4 w-4 text-stone-950" />
                  RICHIEDI AUDIT
                </button>

                {onOpenBIMEstimator && (station.id === 'bim-hub' || station.id === 'computo-hub') && (
                  <button
                    type="button"
                    id="btn-station-open-estimator"
                    onClick={() => {
                      audioSystem.playClick(700);
                      onOpenBIMEstimator();
                    }}
                    className="flex items-center justify-center gap-1 rounded-none border border-amber-400/40 bg-amber-500/15 px-2.5 py-2 font-mono text-xs font-semibold text-amber-300 hover:bg-amber-500/25 transition-colors"
                    title="Calcola Preventivo Parametrico BIM 5D"
                  >
                    <Calculator className="h-3.5 w-3.5" />
                    <span>5D</span>
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
                    className="flex items-center justify-center gap-1 rounded-none border border-fuchsia-400/40 bg-fuchsia-500/15 px-2.5 py-2 font-mono text-xs font-semibold text-fuchsia-300 hover:bg-fuchsia-500/25 transition-colors"
                    title="Apri Virtual Staging & Rendering Fotorealistico"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>STAGING</span>
                  </button>
                )}

                <button
                  type="button"
                  id="btn-inspect-hotspots"
                  onClick={() => {
                    audioSystem.playClick(650);
                    onExploreHotspots();
                  }}
                  className="flex items-center justify-center gap-1 rounded-none border border-white/15 bg-stone-900/80 px-2.5 py-2 font-mono text-xs font-medium text-white hover:border-white/30 transition-colors"
                  title="Esplora punti interattivi"
                >
                  <Info className="h-3.5 w-3.5 text-amber-400" />
                  <span>({station.hotspots.length})</span>
                </button>

                <button
                  type="button"
                  id="btn-bookmark-station"
                  onClick={() => {
                    audioSystem.playClick(600);
                    setIsBookmarked(!isBookmarked);
                  }}
                  className={`flex h-8 w-8 items-center justify-center rounded-none border transition-colors shrink-0 ${
                    isBookmarked
                      ? 'border-amber-400 bg-amber-500/20 text-amber-400'
                      : 'border-white/15 bg-stone-900/80 text-stone-300 hover:border-white/30 hover:text-white'
                  }`}
                  title={isBookmarked ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
                >
                  <Bookmark className="h-4 w-4" />
                </button>
              </div>

              {/* Feedback toast */}
              {bookingToast && (
                <motion.div
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-none bg-emerald-500/15 border border-emerald-500/40 p-2 text-center font-mono text-xs text-emerald-300"
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

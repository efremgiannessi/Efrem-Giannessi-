import React, { useState } from 'react';
import { LightingMode } from '../types';
import {
  Volume2,
  VolumeX,
  Sun,
  Sunset,
  Moon,
  Play,
  Pause,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  Github,
  Sparkles,
} from 'lucide-react';
import { audioSystem } from '../utils/audioSynthesizer';

interface TopControlsProps {
  lightingMode: LightingMode;
  onSelectLightingMode: (mode: LightingMode) => void;
  isAutoTouring: boolean;
  onToggleAutoTour: () => void;
  showHotspots: boolean;
  onToggleShowHotspots: () => void;
  onOpenGitHubModal: () => void;
}

export const TopControls: React.FC<TopControlsProps> = ({
  lightingMode,
  onSelectLightingMode,
  isAutoTouring,
  onToggleAutoTour,
  showHotspots,
  onToggleShowHotspots,
  onOpenGitHubModal,
}) => {
  const [isMuted, setIsMuted] = useState<boolean>(audioSystem.getMuted());
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const handleToggleMute = () => {
    const newMuteState = audioSystem.toggleMute();
    setIsMuted(newMuteState);
    if (!newMuteState) {
      audioSystem.playClick(700);
    }
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(() => {
        // Fallback or permission blocked in iframe
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(() => {});
    }
  };

  return (
    <header
      aria-label="Controlli vista ufficio"
      className="fixed top-4 left-0 right-0 z-30 flex items-center justify-between px-4 sm:px-6 pointer-events-none"
    >
      {/* Brand & Title */}
      <div className="flex items-center gap-3 pointer-events-auto rounded-2xl border border-white/15 bg-stone-950/80 px-3.5 py-2 shadow-xl backdrop-blur-xl">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-stone-950 font-black text-sm shadow-md">
          🏢
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              Modern Office
            </span>
            <span className="rounded-full bg-amber-500/20 px-1.5 py-0.2 text-[9px] font-bold text-amber-300 border border-amber-500/30">
              360° LIVE
            </span>
          </div>
          <p className="text-[10px] text-stone-400">Tour Interattivo con Video & Emoji</p>
        </div>
      </div>

      {/* Center/Right Control Bar */}
      <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto rounded-2xl border border-white/15 bg-stone-950/80 p-1.5 shadow-xl backdrop-blur-xl">
        {/* Lighting Mode Selector */}
        <div className="flex items-center rounded-xl bg-white/5 p-0.5 border border-white/10">
          <button
            type="button"
            id="lighting-day"
            onClick={() => {
              audioSystem.playClick(600);
              onSelectLightingMode('day');
            }}
            title="Luce Giorno"
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs transition-all ${
              lightingMode === 'day'
                ? 'bg-amber-400 text-stone-950 shadow font-semibold'
                : 'text-stone-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Sun className="h-4 w-4" />
          </button>
          <button
            type="button"
            id="lighting-sunset"
            onClick={() => {
              audioSystem.playClick(550);
              onSelectLightingMode('sunset');
            }}
            title="Luce Tramonto"
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs transition-all ${
              lightingMode === 'sunset'
                ? 'bg-amber-600 text-white shadow font-semibold'
                : 'text-stone-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Sunset className="h-4 w-4" />
          </button>
          <button
            type="button"
            id="lighting-night"
            onClick={() => {
              audioSystem.playClick(500);
              onSelectLightingMode('night');
            }}
            title="Luce Notte"
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs transition-all ${
              lightingMode === 'night'
                ? 'bg-indigo-600 text-white shadow font-semibold'
                : 'text-stone-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Moon className="h-4 w-4" />
          </button>
        </div>

        {/* Auto-Tour Toggle */}
        <button
          type="button"
          id="btn-toggle-autotour"
          onClick={() => {
            audioSystem.playClick(650);
            onToggleAutoTour();
          }}
          className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-medium transition-all ${
            isAutoTouring
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm animate-pulse'
              : 'text-stone-300 hover:bg-white/10 hover:text-white border border-transparent'
          }`}
          title={isAutoTouring ? 'Pausa tour automatico' : 'Avvia tour automatico stanze'}
        >
          {isAutoTouring ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          <span className="hidden md:inline">Auto-Tour</span>
        </button>

        {/* Hotspots visibility toggle */}
        <button
          type="button"
          id="btn-toggle-hotspots"
          onClick={() => {
            audioSystem.playClick(580);
            onToggleShowHotspots();
          }}
          className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all ${
            showHotspots
              ? 'text-amber-400 bg-amber-500/15'
              : 'text-stone-400 hover:text-white hover:bg-white/10'
          }`}
          title={showHotspots ? 'Nascondi punti interattivi' : 'Mostra punti interattivi'}
        >
          {showHotspots ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </button>

        {/* Sound Ambience Toggle */}
        <button
          type="button"
          id="btn-toggle-sound"
          onClick={handleToggleMute}
          className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all ${
            !isMuted
              ? 'text-emerald-400 bg-emerald-500/15'
              : 'text-stone-400 hover:text-white hover:bg-white/10'
          }`}
          title={isMuted ? 'Attiva audio ed effetti sonori' : 'Silenzia audio'}
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>

        {/* Fullscreen button */}
        <button
          type="button"
          id="btn-toggle-fullscreen"
          onClick={handleToggleFullscreen}
          className="flex h-8 w-8 items-center justify-center rounded-xl text-stone-300 hover:bg-white/10 hover:text-white transition-all"
          title={isFullscreen ? 'Esci da schermo intero' : 'Schermo intero'}
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </button>

        {/* Publish to GitHub Guide Button */}
        <button
          type="button"
          id="btn-open-github"
          onClick={() => {
            audioSystem.playClick(800);
            onOpenGitHubModal();
          }}
          className="flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all"
          title="Istruzioni per pubblicare su GitHub"
        >
          <Github className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Pubblica su GitHub</span>
        </button>
      </div>
    </header>
  );
};

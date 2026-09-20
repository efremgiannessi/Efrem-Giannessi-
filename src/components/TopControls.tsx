import React, { useState, useRef, useEffect } from 'react';
import { LightingMode, WeatherIntensity, TransitionStyle } from '../types';
import { TimeSyncInfo } from '../utils/timeSync';
import {
  Volume2,
  Volume1,
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
  Map,
  Sliders,
  Box,
  Split,
  Headphones,
  Compass,
  Clock,
  Wind,
  Calculator,
  Terminal,
  Presentation,
  Mail,
  CloudRain,
} from 'lucide-react';
import { audioSystem } from '../utils/audioSynthesizer';

interface TopControlsProps {
  lightingMode: LightingMode;
  onSelectLightingMode: (mode: LightingMode) => void;
  isAutoTouring: boolean;
  onToggleAutoTour: () => void;
  showHotspots: boolean;
  onToggleShowHotspots: () => void;
  showMiniMap: boolean;
  onToggleMiniMap: () => void;
  onOpenGitHubModal: () => void;
  onOpenBIMViewer: () => void;
  onOpenCadCompare: () => void;
  is360Mode: boolean;
  onToggle360Mode: () => void;
  isAutoSync?: boolean;
  onToggleAutoSync?: (active: boolean) => void;
  onOpenTimeSyncModal?: () => void;
  timeInfo?: TimeSyncInfo;
  weatherIntensity?: WeatherIntensity;
  onToggleWeatherIntensity?: () => void;
  onOpenBIMEstimator?: () => void;
  onOpenRevitConsole?: () => void;
  onOpenVirtualStaging?: () => void;
  onTogglePitchMode?: () => void;
  isPitchMode?: boolean;
  onOpenBookingModal?: () => void;
  isRainAudioActive?: boolean;
  onToggleRainAudio?: () => void;
  transitionStyle?: TransitionStyle;
  onSelectTransitionStyle?: (style: TransitionStyle) => void;
}

export const TopControls: React.FC<TopControlsProps> = ({
  lightingMode,
  onSelectLightingMode,
  isAutoTouring,
  onToggleAutoTour,
  showHotspots,
  onToggleShowHotspots,
  showMiniMap,
  onToggleMiniMap,
  onOpenGitHubModal,
  onOpenBIMViewer,
  onOpenCadCompare,
  is360Mode,
  onToggle360Mode,
  isAutoSync = true,
  onToggleAutoSync,
  onOpenTimeSyncModal,
  timeInfo,
  weatherIntensity = 'subtle',
  onToggleWeatherIntensity,
  onOpenBIMEstimator,
  onOpenRevitConsole,
  onOpenVirtualStaging,
  onTogglePitchMode,
  isPitchMode = false,
  onOpenBookingModal,
  isRainAudioActive = false,
  onToggleRainAudio,
  transitionStyle = 'motion-blur',
  onSelectTransitionStyle,
}) => {
  const [isMuted, setIsMuted] = useState<boolean>(audioSystem.getMuted());
  const [masterVolume, setMasterVolume] = useState<number>(
    Math.round(audioSystem.getMasterVolume() * 100)
  );
  const [isVolumePopoverOpen, setIsVolumePopoverOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const volumeContainerRef = useRef<HTMLDivElement>(null);

  // Close volume popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        volumeContainerRef.current &&
        !volumeContainerRef.current.contains(e.target as Node)
      ) {
        setIsVolumePopoverOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleMute = () => {
    const newMuteState = audioSystem.toggleMute();
    setIsMuted(newMuteState);
    if (!newMuteState) {
      if (masterVolume === 0) {
        setMasterVolume(65);
        audioSystem.setMasterVolume(0.65);
      }
      audioSystem.playClick(700);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setMasterVolume(newVol);
    audioSystem.setMasterVolume(newVol / 100);
    setIsMuted(audioSystem.getMuted());
  };

  const getVolumeIcon = () => {
    if (isMuted || masterVolume === 0) {
      return <VolumeX className="h-4 w-4 text-rose-400" />;
    }
    if (masterVolume < 50) {
      return <Volume1 className="h-4 w-4 text-emerald-400" />;
    }
    return <Volume2 className="h-4 w-4 text-emerald-400" />;
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
      className="fixed top-2 sm:top-4 left-0 right-0 z-30 flex items-center justify-between px-2 sm:px-6 pt-safe pointer-events-none gap-1.5"
    >
      {/* Brand & Title */}
      <div
        className="flex items-center gap-2 sm:gap-3 pointer-events-auto rounded-xl sm:rounded-2xl border border-white/15 bg-stone-950/85 px-2.5 sm:px-3.5 py-1.5 sm:py-2 shadow-xl backdrop-blur-xl"
      >
        <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-stone-950 font-black text-xs sm:text-sm shadow-md">
          EG
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white">
              Efrem Giannessi
            </span>
            <span className="hidden xs:inline rounded-full bg-amber-500/20 px-1.5 py-0.2 text-[8px] sm:text-[9px] font-bold text-amber-300 border border-amber-500/30">
              BIM 5D • 360°
            </span>
          </div>
          <p className="hidden sm:block text-[10px] text-stone-400">Progettazione BIM 5D • Computo Industriale • Rendering</p>
        </div>
      </div>

      {/* Center/Right Control Bar */}
      <div className="flex items-center gap-1 sm:gap-2 pointer-events-auto rounded-xl sm:rounded-2xl border border-white/15 bg-stone-950/85 p-1 sm:p-1.5 shadow-xl backdrop-blur-xl">
        {/* Lighting Mode Selector & Real-Time Sync */}
        <div className="flex items-center rounded-lg sm:rounded-xl bg-white/5 p-0.5 border border-white/10">
          <button
            type="button"
            id="lighting-day"
            onClick={() => {
              audioSystem.playClick(600);
              onSelectLightingMode('day');
            }}
            title="Luce Giorno (07:00 - 18:00)"
            className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-md sm:rounded-lg text-xs transition-all ${
              lightingMode === 'day'
                ? 'bg-amber-400 text-stone-950 shadow font-semibold'
                : 'text-stone-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Sun className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
          <button
            type="button"
            id="lighting-sunset"
            onClick={() => {
              audioSystem.playClick(550);
              onSelectLightingMode('sunset');
            }}
            title="Luce Tramonto / Golden Hour (18:00 - 21:00)"
            className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-md sm:rounded-lg text-xs transition-all ${
              lightingMode === 'sunset'
                ? 'bg-amber-600 text-white shadow font-semibold'
                : 'text-stone-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Sunset className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
          <button
            type="button"
            id="lighting-night"
            onClick={() => {
              audioSystem.playClick(500);
              onSelectLightingMode('night');
            }}
            title="Luce Notte (21:00 - 07:00)"
            className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-md sm:rounded-lg text-xs transition-all ${
              lightingMode === 'night'
                ? 'bg-indigo-600 text-white shadow font-semibold'
                : 'text-stone-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Moon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>

          {/* Global Light-Time Synchronization Button */}
          {timeInfo && (
            <>
              <div className="h-4 w-[1px] bg-white/15 mx-1" />
              <button
                type="button"
                id="btn-time-sync-auto"
                onClick={() => {
                  audioSystem.playClick(650);
                  if (onOpenTimeSyncModal) {
                    onOpenTimeSyncModal();
                  } else if (onToggleAutoSync) {
                    onToggleAutoSync(!isAutoSync);
                  }
                }}
                className={`flex items-center gap-1 rounded-md sm:rounded-lg px-1.5 sm:px-2 py-1 text-xs font-semibold transition-all ${
                  isAutoSync
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-white/10'
                }`}
                title={`Sincronizzazione Oraria Globale: ${isAutoSync ? 'ATTIVA' : 'MANUALE'} (${timeInfo.localTimeStr} • ${timeInfo.periodTitle}). Clicca per aprire il pannello orario.`}
              >
                <Clock className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${isAutoSync ? 'text-emerald-400 animate-pulse' : 'text-stone-400'}`} />
                <span className="font-mono text-[11px] sm:text-xs font-bold">{timeInfo.localTimeStr}</span>
                <span
                  className={`hidden md:inline rounded px-1 py-0.2 text-[9px] font-bold uppercase tracking-wider ${
                    isAutoSync ? 'bg-emerald-400 text-stone-950' : 'bg-white/10 text-stone-400'
                  }`}
                >
                  {isAutoSync ? 'Auto' : 'Man'}
                </span>
              </button>
            </>
          )}
        </div>

        {/* Dynamic Weather Particle & Volumetric Ray Toggle */}
        <button
          type="button"
          id="btn-toggle-weather-particles"
          onClick={() => {
            audioSystem.playClick(weatherIntensity === 'off' ? 700 : 550);
            onToggleWeatherIntensity?.();
          }}
          className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-all active:scale-95 ${
            weatherIntensity === 'vivid'
              ? 'bg-amber-500/25 text-amber-300 border border-amber-400/50 shadow-md shadow-amber-500/20'
              : weatherIntensity === 'subtle'
              ? 'bg-white/10 text-stone-200 hover:bg-white/20 hover:text-white border border-white/15'
              : 'bg-white/5 text-stone-500 hover:text-stone-300 border border-white/5'
          }`}
          title={`Particelle & Raggi Dinamici: ${
            weatherIntensity === 'vivid'
              ? 'INTENSO'
              : weatherIntensity === 'subtle'
              ? 'SOTTILE (Attivo)'
              : 'DISATTIVATO'
          } (${
            lightingMode === 'day'
              ? 'Polvere solare fluttuante & fasci zenitali'
              : lightingMode === 'sunset'
              ? 'Raggi radenti ambrati & pulviscolo dorato'
              : 'Nebbia notturna blu & particelle stellari'
          }). Clicca per commutare (Sottile / Intenso / Off).`}
        >
          <Sparkles
            className={`h-3.5 w-3.5 ${
              weatherIntensity === 'vivid'
                ? 'text-amber-300 animate-pulse'
                : weatherIntensity === 'subtle'
                ? 'text-amber-400'
                : 'text-stone-500'
            }`}
          />
          <span className="hidden xl:inline">
            {weatherIntensity === 'off' ? 'Meteo Off' : 'Meteo'}
          </span>
          <span
            className={`rounded px-1 py-0.2 text-[9px] font-bold uppercase tracking-wider ${
              weatherIntensity === 'vivid'
                ? 'bg-amber-400 text-stone-950'
                : weatherIntensity === 'subtle'
                ? 'bg-white/15 text-stone-300'
                : 'bg-white/5 text-stone-500'
            }`}
          >
            {weatherIntensity === 'vivid' ? 'Vivid' : weatherIntensity === 'subtle' ? 'On' : 'Off'}
          </span>
        </button>

        {/* 360 Interactive Panorama Sphere Mode Toggle */}
        <button
          type="button"
          id="btn-toggle-360-mode"
          onClick={() => {
            audioSystem.playClick(720);
            onToggle360Mode();
          }}
          className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-all active:scale-95 ${
            is360Mode
              ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-stone-950 font-bold shadow-lg shadow-amber-500/30 ring-2 ring-amber-300'
              : 'bg-white/10 text-stone-300 hover:bg-white/20 hover:text-white border border-white/15'
          }`}
          title={is360Mode ? 'Passa alla visuale standard' : 'Attiva Tour Immersivo a 360° Sferico'}
        >
          <Compass className={`h-3.5 w-3.5 ${is360Mode ? 'text-stone-950 animate-spin' : 'text-amber-400'}`} />
          <span className="font-bold">360°</span>
        </button>

        {/* Guided Audio Tour Toggle */}
        <button
          type="button"
          id="btn-toggle-autotour"
          onClick={() => {
            audioSystem.playClick(650);
            onToggleAutoTour();
          }}
          className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-medium transition-all ${
            isAutoTouring
              ? 'bg-amber-400 text-stone-950 font-bold shadow-md ring-2 ring-amber-300 animate-pulse'
              : 'text-stone-300 hover:bg-white/10 hover:text-white border border-white/10'
          }`}
          title={isAutoTouring ? 'Pausa Audio Tour Guidato' : 'Avvia Audio Tour Guidato con Voce Narrante'}
        >
          {isAutoTouring ? (
            <Headphones className="h-3.5 w-3.5 text-stone-950 animate-bounce" />
          ) : (
            <Play className="h-3.5 w-3.5 text-amber-400" />
          )}
          <span className="hidden md:inline">Audio Tour</span>
        </button>

        {/* BIM 3D WebGL Quick Trigger */}
        <button
          type="button"
          id="btn-top-open-bim-viewer"
          onClick={() => {
            audioSystem.playClick(700);
            onOpenBIMViewer();
          }}
          className="hidden sm:flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 transition-all active:scale-95"
          title="Apri Modello 3D BIM Interattivo WebGL"
        >
          <Box className="h-3.5 w-3.5 text-amber-400" />
          <span className="hidden lg:inline">BIM 3D</span>
        </button>

        {/* CAD vs BIM Split-Screen Quick Trigger */}
        <button
          type="button"
          id="btn-top-open-cad-compare"
          onClick={() => {
            audioSystem.playClick(700);
            onOpenCadCompare();
          }}
          className="hidden sm:flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold bg-sky-500/15 border border-sky-500/30 text-sky-300 hover:bg-sky-500/25 transition-all active:scale-95"
          title="Confronta DWG 2D e BIM 3D Split-Screen"
        >
          <Split className="h-3.5 w-3.5 text-sky-400" />
          <span className="hidden lg:inline">CAD / BIM</span>
        </button>

        {/* BIM 5D Parametric Cost & ROI Estimator Button */}
        {onOpenBIMEstimator && (
          <button
            type="button"
            id="btn-top-open-bim-estimator"
            onClick={() => {
              audioSystem.playClick(720);
              onOpenBIMEstimator();
            }}
            className="hidden md:flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 transition-all active:scale-95"
            title="Calcola Preventivo e ROI BIM 5D Parametrico"
          >
            <Calculator className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden xl:inline">Preventivo 5D</span>
          </button>
        )}

        {/* Revit Plugin / pyRevit Scripting Console */}
        {onOpenRevitConsole && (
          <button
            type="button"
            id="btn-top-open-revit-console"
            onClick={() => {
              audioSystem.playClick(700);
              onOpenRevitConsole();
            }}
            className="hidden lg:flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/25 transition-all active:scale-95"
            title="Console Scripting pyRevit e C# Add-in"
          >
            <Terminal className="h-3.5 w-3.5 text-indigo-400" />
            <span className="hidden xl:inline">Console Revit</span>
          </button>
        )}

        {/* Virtual Staging & Photorealistic Rendering */}
        {onOpenVirtualStaging && (
          <button
            type="button"
            id="btn-top-open-virtual-staging"
            onClick={() => {
              audioSystem.playClick(720);
              onOpenVirtualStaging();
            }}
            className="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold bg-fuchsia-500/15 border border-fuchsia-500/30 text-fuchsia-300 hover:bg-fuchsia-500/25 transition-all active:scale-95"
            title="Virtual Staging 3D e Rendering Fotorealistico Prima/Dopo"
          >
            <Sparkles className="h-3.5 w-3.5 text-fuchsia-400" />
            <span className="hidden sm:inline">Virtual Staging</span>
          </button>
        )}

        {/* Live Pitch Meeting Mode Toggle */}
        {onTogglePitchMode && (
          <button
            type="button"
            id="btn-top-toggle-pitch-mode"
            onClick={() => {
              audioSystem.playClick(650);
              onTogglePitchMode();
            }}
            className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-all active:scale-95 ${
              isPitchMode
                ? 'bg-rose-500 text-white font-bold shadow-lg shadow-rose-500/30 ring-2 ring-rose-400'
                : 'text-stone-300 hover:bg-white/10 hover:text-white border border-white/15'
            }`}
            title={isPitchMode ? 'Disattiva modalità Pitch Meeting' : 'Attiva Laser Pointer e Annotazioni Live per Presentazioni'}
          >
            <Presentation className={`h-3.5 w-3.5 ${isPitchMode ? 'text-white animate-pulse' : 'text-rose-400'}`} />
            <span className="hidden sm:inline">Pitch Mode</span>
          </button>
        )}

        {/* Ambient Rain / Weather Audio Soundscape Toggle */}
        {onToggleRainAudio && (
          <button
            type="button"
            id="btn-top-toggle-rain-soundscape"
            onClick={() => {
              audioSystem.playClick(600);
              onToggleRainAudio();
            }}
            className={`flex items-center gap-1 rounded-xl px-2 py-1.5 text-xs font-semibold transition-all active:scale-95 ${
              isRainAudioActive
                ? 'bg-sky-500/30 text-sky-200 border border-sky-400/50 shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-white/10'
            }`}
            title={isRainAudioActive ? 'Disattiva pioggia acustica rilassante sui vetri' : 'Attiva soundscape pioggia e brezza naturale'}
          >
            <CloudRain className={`h-3.5 w-3.5 ${isRainAudioActive ? 'text-sky-300 animate-pulse' : 'text-stone-400'}`} />
            <span className="hidden xl:inline text-[11px]">Audio Pioggia</span>
          </button>
        )}

        {/* Direct Audit / Contact Booking Button */}
        {onOpenBookingModal && (
          <button
            type="button"
            id="btn-top-open-booking-modal"
            onClick={() => {
              audioSystem.playClick(750);
              onOpenBookingModal();
            }}
            className="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-400 text-stone-950 shadow-md shadow-amber-500/20 hover:from-amber-400 hover:to-amber-300 transition-all active:scale-95"
            title="Richiedi Consulenza o Audit BIM a Efrem Giannessi"
          >
            <Mail className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Richiedi Audit</span>
          </button>
        )}

        {/* Transition FX Style Switcher */}
        {onSelectTransitionStyle && (
          <button
            type="button"
            id="btn-toggle-transition-style"
            onClick={() => {
              audioSystem.playClick(680);
              const styles: TransitionStyle[] = ['motion-blur', 'cross-dissolve', 'warp-zoom'];
              const nextIndex = (styles.indexOf(transitionStyle) + 1) % styles.length;
              onSelectTransitionStyle(styles[nextIndex]);
            }}
            className="flex items-center gap-1 rounded-xl px-2 py-1.5 text-xs font-semibold text-amber-300 bg-amber-500/15 border border-amber-400/30 hover:bg-amber-500/25 transition-all active:scale-95"
            title={`Effetto Transizione: ${transitionStyle}. Clicca per alternare (Motion Blur / Cross Dissolve / Warp Zoom)`}
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden xl:inline capitalize text-[11px]">{transitionStyle.replace('-', ' ')}</span>
          </button>
        )}

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

        {/* Overlay Mini-Map Planimetria Toggle */}
        <button
          type="button"
          id="btn-toggle-minimap"
          onClick={() => {
            audioSystem.playClick(620);
            onToggleMiniMap();
          }}
          className={`flex items-center gap-1.5 rounded-xl px-2.5 sm:px-3 py-1.5 text-xs font-medium transition-all ${
            showMiniMap
              ? 'bg-amber-400 text-stone-950 font-bold shadow-lg shadow-amber-500/25 ring-2 ring-amber-300'
              : 'bg-white/10 text-stone-200 hover:bg-white/20 hover:text-white border border-white/20'
          }`}
          title={showMiniMap ? 'Nascondi mini-mappa planimetria (M)' : 'Mostra mini-mappa planimetria (M)'}
        >
          <Map className={`h-3.5 w-3.5 ${showMiniMap ? 'text-stone-950' : 'text-amber-400'}`} />
          <span className="inline font-semibold">Mappa</span>
          <span
            className={`hidden sm:inline-block rounded px-1 text-[9px] font-mono ${
              showMiniMap ? 'bg-stone-950/20 text-stone-900' : 'bg-white/15 text-stone-400'
            }`}
          >
            M
          </span>
        </button>

        {/* Master Volume & Mute Toggle Control */}
        <div
          ref={volumeContainerRef}
          className="relative flex items-center"
        >
          <div className="flex items-center rounded-xl bg-white/10 border border-white/15 p-0.5 shadow-sm transition-all hover:border-white/30">
            {/* Quick Mute Toggle Button */}
            <button
              type="button"
              id="btn-toggle-sound-mute"
              onClick={handleToggleMute}
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                isMuted || masterVolume === 0
                  ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 ring-1 ring-rose-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 ring-1 ring-emerald-500/40'
              }`}
              title={
                isMuted || masterVolume === 0
                  ? 'Audio Silenziato • Clicca per riattivare suono e ambiente ufficio'
                  : 'Silenzia Audio Subito • Clicca per silenziare ambiente ufficio'
              }
            >
              {getVolumeIcon()}
            </button>

            {/* Desktop Direct Master Volume Slider with Label */}
            <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5">
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                aria-label="Volume Master Ambiente Ufficio"
                value={isMuted ? 0 : masterVolume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-16 h-1.5 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-400 focus:outline-none"
              />
              <span className="w-8 text-[10px] font-mono text-stone-300 select-none text-right">
                {isMuted || masterVolume === 0 ? 'MUTO' : `${masterVolume}%`}
              </span>
            </div>

            {/* Mobile / Small Screen Volume Popover Toggle */}
            <button
              type="button"
              id="btn-volume-slider-toggle"
              onClick={() => setIsVolumePopoverOpen((prev) => !prev)}
              className={`lg:hidden flex h-8 w-6 items-center justify-center transition-colors ${
                isVolumePopoverOpen ? 'text-amber-400' : 'text-stone-400 hover:text-white'
              }`}
              title="Regola livello volume master"
            >
              <Sliders className="h-3 w-3" />
            </button>
          </div>

          {/* Master Volume Floating Popover (presets & detailed volume adjustment) */}
          {isVolumePopoverOpen && (
            <div
              id="master-volume-popover"
              className="absolute top-full right-0 mt-2 z-50 w-56 rounded-2xl border border-white/20 bg-stone-950/95 p-3.5 shadow-2xl backdrop-blur-xl text-stone-100 animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  {getVolumeIcon()}
                  <span className="text-xs font-bold text-white tracking-wide">
                    Volume Master
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleToggleMute}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase transition-all ${
                    isMuted || masterVolume === 0
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {isMuted || masterVolume === 0 ? 'Silenziato' : 'Attivo'}
                </button>
              </div>

              {/* Slider inside Popover */}
              <div className="py-2">
                <div className="flex items-center justify-between text-[10px] text-stone-400 mb-1">
                  <span>Livello sonoro studio</span>
                  <span className="font-mono text-amber-300 font-bold">
                    {isMuted || masterVolume === 0 ? '0%' : `${masterVolume}%`}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  aria-label="Controllo volume master"
                  value={isMuted ? 0 : masterVolume}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>

              {/* Quick presets buttons */}
              <div className="grid grid-cols-4 gap-1.5 mt-2 pt-2 border-t border-white/10 text-[10px]">
                <button
                  type="button"
                  onClick={() => {
                    handleToggleMute();
                  }}
                  className={`py-1 rounded text-center font-medium transition-colors ${
                    isMuted ? 'bg-rose-500 text-white font-bold' : 'bg-white/5 hover:bg-white/10 text-stone-300'
                  }`}
                >
                  Muto
                </button>
                <button
                  type="button"
                  onClick={() => handleVolumeChange(30)}
                  className={`py-1 rounded text-center font-medium transition-colors ${
                    !isMuted && masterVolume === 30
                      ? 'bg-amber-400 text-stone-950 font-bold'
                      : 'bg-white/5 hover:bg-white/10 text-stone-300'
                  }`}
                >
                  30%
                </button>
                <button
                  type="button"
                  onClick={() => handleVolumeChange(65)}
                  className={`py-1 rounded text-center font-medium transition-colors ${
                    !isMuted && masterVolume === 65
                      ? 'bg-amber-400 text-stone-950 font-bold'
                      : 'bg-white/5 hover:bg-white/10 text-stone-300'
                  }`}
                >
                  65%
                </button>
                <button
                  type="button"
                  onClick={() => handleVolumeChange(100)}
                  className={`py-1 rounded text-center font-medium transition-colors ${
                    !isMuted && masterVolume === 100
                      ? 'bg-amber-400 text-stone-950 font-bold'
                      : 'bg-white/5 hover:bg-white/10 text-stone-300'
                  }`}
                >
                  100%
                </button>
              </div>

              <p className="mt-2.5 text-[9px] text-stone-400 text-center">
                Silenzia o regola istantaneamente l'ambiente acustico dello studio
              </p>
            </div>
          )}
        </div>

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

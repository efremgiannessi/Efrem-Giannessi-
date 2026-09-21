import React from 'react';
import {
  Clock,
  Sun,
  Sunset,
  Moon,
  Sparkles,
  RefreshCw,
  Check,
  X,
  Sliders,
  Globe,
  Zap,
  Wind,
  CloudRain,
  Volume2,
} from 'lucide-react';
import { TimeSyncInfo } from '../utils/timeSync';
import { LightingMode, WeatherIntensity } from '../types';
import { audioSystem } from '../utils/audioSynthesizer';

interface LightTimeSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  timeInfo: TimeSyncInfo;
  isAutoSync: boolean;
  onToggleAutoSync: (active: boolean) => void;
  onSyncNow: () => void;
  onSelectMode: (mode: LightingMode) => void;
  simulatedHour: number | null;
  onSetSimulatedHour: (hour: number | null) => void;
  currentLightingMode: LightingMode;
  weatherIntensity?: WeatherIntensity;
  onSetWeatherIntensity?: (intensity: WeatherIntensity) => void;
  isRainAudioActive?: boolean;
  onToggleRainAudio?: () => void;
}

export const LightTimeSyncModal: React.FC<LightTimeSyncModalProps> = ({
  isOpen,
  onClose,
  timeInfo,
  isAutoSync,
  onToggleAutoSync,
  onSyncNow,
  onSelectMode,
  simulatedHour,
  onSetSimulatedHour,
  currentLightingMode,
  weatherIntensity = 'subtle',
  onSetWeatherIntensity,
  isRainAudioActive = false,
  onToggleRainAudio,
}) => {
  if (!isOpen) return null;

  const currentHour = simulatedHour !== null ? simulatedHour : timeInfo.hours;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    audioSystem.playClick(500 + val * 15);
    onSetSimulatedHour(val);
  };

  const handleResetRealTime = () => {
    audioSystem.playClick(750);
    onSetSimulatedHour(null);
    onSyncNow();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="light-sync-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-none border border-white/15 bg-stone-950/95 p-4 sm:p-6 text-stone-100 shadow-2xl backdrop-blur-xl"
      >
        {/* Architectural corner marks */}
        <div className="pointer-events-none absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-amber-400" />
        <div className="pointer-events-none absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-amber-400" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-amber-400" />
        <div className="pointer-events-none absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-amber-400" />

        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-3 sm:pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-none bg-amber-400/10 border border-amber-400/40 text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h2 id="light-sync-title" className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>Sincronizzazione Oraria Globale</span>
                <span className="rounded-none bg-emerald-500/15 border border-emerald-500/40 px-2 py-0.2 font-mono text-[9px] font-bold uppercase tracking-wider text-emerald-300">
                  {isAutoSync ? 'Attiva' : 'Manuale'}
                </span>
              </h2>
              <p className="text-[11px] sm:text-xs text-stone-400 font-light">
                Regolazione automatica della luce dello studio in base all&apos;orario locale
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              audioSystem.playClick(600);
              onClose();
            }}
            className="rounded-none border border-white/10 bg-white/5 p-1.5 text-stone-400 hover:border-amber-400 hover:text-white transition-all"
            title="Chiudi"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Live Digital Clock & Status Display */}
        <div className="my-4 rounded-none border border-white/10 bg-stone-900/60 p-3 sm:p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-stone-400 font-mono text-xs mb-1">
            <Globe className="h-3.5 w-3.5 text-amber-400" />
            <span>FUSO: <strong className="text-stone-200 uppercase">{timeInfo.timeZone}</strong></span>
          </div>

          <div className="flex items-baseline justify-center gap-1 font-mono text-3xl sm:text-4xl font-black text-white tracking-wider">
            <span>{timeInfo.localTimeStr}</span>
            <span className="text-xs sm:text-sm text-stone-400 font-normal">
              :{String(new Date().getSeconds()).padStart(2, '0')}
            </span>
            {simulatedHour !== null && (
              <span className="ml-2 rounded-none bg-amber-400/20 border border-amber-400/40 px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase text-amber-300">
                SIMULATA
              </span>
            )}
          </div>

          <div className="mt-2 flex items-center justify-center gap-2 font-mono">
            <span
              className={`inline-flex items-center gap-1.5 rounded-none px-2.5 py-0.5 text-[11px] font-bold uppercase border ${
                currentLightingMode === 'day'
                  ? 'bg-amber-400 border-amber-300 text-stone-950'
                  : currentLightingMode === 'sunset'
                  ? 'bg-amber-600 border-amber-500 text-white'
                  : 'bg-indigo-600 border-indigo-500 text-white'
              }`}
            >
              {currentLightingMode === 'day' && <Sun className="h-3 w-3" />}
              {currentLightingMode === 'sunset' && <Sunset className="h-3 w-3" />}
              {currentLightingMode === 'night' && <Moon className="h-3 w-3" />}
              <span>{timeInfo.periodTitle}</span>
            </span>

            <span className="text-xs text-stone-400">[{timeInfo.periodSchedule}]</span>
          </div>

          <p className="mt-2 text-xs text-stone-300 italic">{timeInfo.description}</p>

          <div className="mt-3 text-[11px] text-stone-400 border-t border-white/5 pt-2 flex items-center justify-center gap-1 font-mono">
            <Sparkles className="h-3 w-3 text-amber-400" />
            <span>
              PROSSIMO CAMBIO: <strong>{timeInfo.nextTransition.label.toUpperCase()}</strong> TRA{' '}
              <strong className="text-amber-300">{timeInfo.nextTransition.remainingTimeFormatted}</strong> ({timeInfo.nextTransition.targetHourStr})
            </span>
          </div>
        </div>

        {/* Global Auto-Sync Toggle & Quick Sync Button */}
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-none border border-white/10 bg-white/5 p-3">
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-none border ${isAutoSync ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-stone-800 border-white/10 text-stone-400'}`}>
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-white font-mono uppercase">Sincronizzazione Automatica</p>
                <p className="text-[10px] sm:text-[11px] text-stone-400">
                  Cambia luce in tempo reale al variare dell&apos;ora reale del computer
                </p>
              </div>
            </div>

            <button
              type="button"
              id="btn-toggle-auto-sync-status"
              onClick={() => {
                audioSystem.playClick(isAutoSync ? 500 : 700);
                onToggleAutoSync(!isAutoSync);
              }}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-none border border-white/20 transition-colors duration-200 ease-in-out focus:outline-none ${
                isAutoSync ? 'bg-amber-400 border-amber-300' : 'bg-stone-800'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-none bg-stone-950 border border-white/20 shadow-lg ring-0 transition duration-200 ease-in-out ${
                  isAutoSync ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Quick Real-Time Sync Action */}
          <div className="flex items-center gap-2 font-mono">
            <button
              type="button"
              id="btn-sync-realtime-now"
              onClick={handleResetRealTime}
              className="flex-1 flex items-center justify-center gap-2 rounded-none bg-amber-400 border border-amber-300 px-3 py-2 text-xs font-bold uppercase tracking-wider text-stone-950 hover:bg-amber-300 transition-all active:scale-98 shadow-md"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Sincronizza ora esatta ({new Date().getHours().toString().padStart(2, '0')}:{new Date().getMinutes().toString().padStart(2, '0')})</span>
            </button>

            {simulatedHour !== null && (
              <button
                type="button"
                onClick={handleResetRealTime}
                className="rounded-none border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-stone-200 hover:bg-white/20 transition-all"
              >
                Ripristina
              </button>
            )}
          </div>

          {/* Manual Modes Quick Buttons */}
          <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
            <button
              type="button"
              id="btn-modal-select-day"
              onClick={() => {
                audioSystem.playClick(650);
                onSelectMode('day');
              }}
              className={`flex flex-col items-center justify-center gap-1 rounded-none p-2.5 transition-all border ${
                currentLightingMode === 'day'
                  ? 'bg-amber-400/20 border-amber-400/80 text-amber-300 font-bold shadow-sm'
                  : 'bg-white/5 border-white/10 text-stone-300 hover:border-amber-400/40 hover:bg-white/10'
              }`}
            >
              <Sun className="h-4 w-4 text-amber-400" />
              <span>GIORNO [07–18]</span>
            </button>

            <button
              type="button"
              id="btn-modal-select-sunset"
              onClick={() => {
                audioSystem.playClick(600);
                onSelectMode('sunset');
              }}
              className={`flex flex-col items-center justify-center gap-1 rounded-none p-2.5 transition-all border ${
                currentLightingMode === 'sunset'
                  ? 'bg-amber-600/30 border-amber-500/80 text-amber-300 font-bold shadow-sm'
                  : 'bg-white/5 border-white/10 text-stone-300 hover:border-amber-400/40 hover:bg-white/10'
              }`}
            >
              <Sunset className="h-4 w-4 text-amber-500" />
              <span>TRAMONTO [18–21]</span>
            </button>

            <button
              type="button"
              id="btn-modal-select-night"
              onClick={() => {
                audioSystem.playClick(550);
                onSelectMode('night');
              }}
              className={`flex flex-col items-center justify-center gap-1 rounded-none p-2.5 transition-all border ${
                currentLightingMode === 'night'
                  ? 'bg-indigo-600/30 border-indigo-400/80 text-indigo-300 font-bold shadow-sm'
                  : 'bg-white/5 border-white/10 text-stone-300 hover:border-amber-400/40 hover:bg-white/10'
              }`}
            >
              <Moon className="h-4 w-4 text-indigo-400" />
              <span>NOTTE [21–07]</span>
            </button>
          </div>

          {/* Interactive 24-Hour Day/Night Solar Scrubber */}
          <div className="rounded-none border border-white/10 bg-white/5 p-3 mt-2">
            <div className="flex items-center justify-between text-xs mb-1 font-mono">
              <span className="flex items-center gap-1 text-stone-300 font-medium">
                <Sliders className="h-3.5 w-3.5 text-amber-400" />
                <span className="uppercase">Simulatore Arco Solare 24H:</span>
              </span>
              <span className="font-bold text-amber-300">
                {String(currentHour).padStart(2, '0')}:00
              </span>
            </div>

            {/* Visual gradient bar representing day/sunset/night spectrum */}
            <div className="relative h-2 w-full rounded-none overflow-hidden my-2 flex shadow-inner border border-white/15">
              <div className="h-full w-[29.1%] bg-indigo-950 border-r border-white/10" title="Notte (00:00 - 07:00)" />
              <div className="h-full w-[45.8%] bg-amber-400 border-r border-white/10" title="Giorno (07:00 - 18:00)" />
              <div className="h-full w-[12.5%] bg-amber-600 border-r border-white/10" title="Tramonto (18:00 - 21:00)" />
              <div className="h-full w-[12.5%] bg-indigo-950" title="Notte (21:00 - 24:00)" />
            </div>

            <input
              type="range"
              min="0"
              max="23"
              value={currentHour}
              onChange={handleSliderChange}
              className="w-full accent-amber-400 cursor-pointer"
            />

            <div className="flex justify-between font-mono text-[9px] text-stone-400 mt-1 uppercase">
              <span>00:00 (Notte)</span>
              <span>07:00 (Giorno)</span>
              <span>18:00 (Tramonto)</span>
              <span>21:00 (Notte)</span>
            </div>
          </div>

          {/* Dynamic Weather Particle & Atmospheric Volumetric Ray Section */}
          <div className="rounded-none border border-white/10 bg-white/5 p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-none border border-amber-400/40 bg-amber-400/10 text-amber-400">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-mono font-semibold text-white uppercase tracking-wider">
                    Particelle & Raggi Atmosferici
                  </h4>
                  <p className="text-[10px] text-stone-400 font-light">
                    Sincronizzati in tempo reale con l&apos;illuminazione solare dello studio
                  </p>
                </div>
              </div>

              <span
                className={`rounded-none px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider border ${
                  weatherIntensity === 'vivid'
                    ? 'bg-amber-400 text-stone-950 border-amber-300'
                    : weatherIntensity === 'subtle'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-stone-800 text-stone-400 border-white/10'
                }`}
              >
                {weatherIntensity === 'vivid' ? 'Intenso' : weatherIntensity === 'subtle' ? 'Sottile' : 'Spento'}
              </span>
            </div>

            {/* Dynamic Weather description for active mode */}
            <div className="rounded-none bg-stone-950/80 p-2.5 border border-white/10 text-[11px] mb-2.5 font-light">
              {currentLightingMode === 'day' && (
                <p className="text-amber-200/90 flex items-start gap-1.5">
                  <Sun className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="font-mono font-bold">ATMOSFERA DIURNA:</strong> Fasci di luce solare zenitale a 41°, pulviscolo dorato in sospensione e riflessi chiari su pareti e workstation.
                  </span>
                </p>
              )}
              {currentLightingMode === 'sunset' && (
                <p className="text-amber-300/90 flex items-start gap-1.5">
                  <Sunset className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="font-mono font-bold">ATMOSFERA TRAMONTO:</strong> Raggi caldi radenti ambrati a 71°, particelle terracotta e alone crepuscolare diffuso.
                  </span>
                </p>
              )}
              {currentLightingMode === 'night' && (
                <p className="text-indigo-200/90 flex items-start gap-1.5">
                  <Moon className="h-3.5 w-3.5 text-indigo-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="font-mono font-bold">ATMOSFERA NOTTURNA:</strong> Luce notturna ciano-blu, micro-particelle cristalline e fasci lunari dai lucernari.
                  </span>
                </p>
              )}
            </div>

            {/* Intensity Level Controls */}
            {onSetWeatherIntensity && (
              <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                <button
                  type="button"
                  id="btn-weather-subtle"
                  onClick={() => {
                    audioSystem.playClick(600);
                    onSetWeatherIntensity('subtle');
                  }}
                  className={`flex items-center justify-center gap-1 rounded-none py-1.5 uppercase tracking-wider font-semibold transition-all border ${
                    weatherIntensity === 'subtle'
                      ? 'bg-amber-400/20 border-amber-400/80 text-amber-300 shadow-sm'
                      : 'bg-white/5 border-white/10 text-stone-300 hover:border-amber-400/40 hover:bg-white/10'
                  }`}
                >
                  <span>Sottile</span>
                  {weatherIntensity === 'subtle' && <Check className="h-3 w-3 text-amber-400" />}
                </button>

                <button
                  type="button"
                  id="btn-weather-vivid"
                  onClick={() => {
                    audioSystem.playClick(650);
                    onSetWeatherIntensity('vivid');
                  }}
                  className={`flex items-center justify-center gap-1 rounded-none py-1.5 uppercase tracking-wider font-semibold transition-all border ${
                    weatherIntensity === 'vivid'
                      ? 'bg-amber-400 text-stone-950 border-amber-300 font-bold shadow-md'
                      : 'bg-white/5 border-white/10 text-stone-300 hover:border-amber-400/40 hover:bg-white/10'
                  }`}
                >
                  <span>Intenso</span>
                  {weatherIntensity === 'vivid' && <Check className="h-3 w-3 text-stone-950" />}
                </button>

                <button
                  type="button"
                  id="btn-weather-off"
                  onClick={() => {
                    audioSystem.playClick(450);
                    onSetWeatherIntensity('off');
                  }}
                  className={`flex items-center justify-center gap-1 rounded-none py-1.5 uppercase tracking-wider font-semibold transition-all border ${
                    weatherIntensity === 'off'
                      ? 'bg-red-500/20 border-red-500/60 text-red-300'
                      : 'bg-white/5 border-white/10 text-stone-400 hover:bg-white/10'
                  }`}
                >
                  <span>Disattiva</span>
                  {weatherIntensity === 'off' && <Check className="h-3 w-3 text-red-400" />}
                </button>
              </div>
            )}

            {/* Weather Audio Soundscape Toggle */}
            {onToggleRainAudio && (
              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CloudRain className={`h-4 w-4 ${isRainAudioActive ? 'text-sky-300' : 'text-stone-400'}`} />
                  <div>
                    <span className="text-xs font-mono font-medium text-white block uppercase">
                      Soundscape Pioggia sui Vetri
                    </span>
                    <span className="text-[10px] text-stone-400 font-light">
                      Sintetizzatore acustico procedurale a banda passante
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  id="btn-modal-toggle-rain-soundscape"
                  onClick={() => {
                    audioSystem.playClick(600);
                    onToggleRainAudio();
                  }}
                  className={`px-2.5 py-1 rounded-none font-mono text-xs uppercase tracking-wider font-semibold transition-all border ${
                    isRainAudioActive
                      ? 'bg-sky-500/30 text-sky-200 border-sky-400/60 shadow-sm'
                      : 'bg-white/5 border-white/15 text-stone-300 hover:border-amber-400/40 hover:bg-white/10'
                  }`}
                >
                  {isRainAudioActive ? 'Attivo' : 'Attiva'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { GraphicTheme, GRAPHIC_THEMES } from '../webgl/SceneManager';
import { audioSystem } from '../utils/audioSynthesizer';
import {
  Shuffle,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Eye,
  Check,
} from 'lucide-react';

const PATTERN_DESCRIPTIONS: Record<number, string> = {
  0: 'ONDA PERLIN // FLUID OCEAN',
  1: 'MATRICE TRON // RETICOLO BIM',
  2: 'VORTICE RADIALE // SHOCKWAVE',
  3: 'TERRAZZAMENTI // ISOIPSE 5D',
  4: 'CRISTALLO VORONOI // DIAMOND',
  5: 'DOPPIA ELICA // QUANTUM HELIX',
  6: 'RADAR & SONAR // CRIMSON PULSE',
  7: 'FAGLIA TETTONICA // GLITCH MATRIX',
  8: 'CRESTE EOLICHE // DUNA SUPERSONICA',
  9: 'WARP TUNNEL // SINGOLARITÀ',
  10: 'TRALICCIO SPAZIALE // TITANIUM',
  11: 'PLASMA CELESTE // AURORA BOREALIS',
  12: 'LIDAR POINT CLOUD // SCANNER 3D',
  13: 'FACCIATA PARAMETRICA // LOUVERS',
  14: 'TENSEGRITÀ & SPAZIALE // TRUSS',
  15: 'ISOIPSE ALTIMETRICHE // DTM 3D',
  16: 'TESSERATTO 4D // HYPERCUBE FOLD',
  17: 'CANOPY VORONOI // BIO CELLULAR',
};

interface BackgroundEffectsHUDProps {
  currentTheme: GraphicTheme;
  onRandomTheme: () => void;
  onCycleTheme: () => void;
  onSelectTheme: (index: number) => void;
}

export const BackgroundEffectsHUD: React.FC<BackgroundEffectsHUDProps> = ({
  currentTheme,
  onRandomTheme,
  onCycleTheme,
  onSelectTheme,
}) => {
  const [isOpenList, setIsOpenList] = useState<boolean>(false);
  const [isAutoRandom, setIsAutoRandom] = useState<boolean>(false);
  const [autoTimerProgress, setAutoTimerProgress] = useState<number>(0);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const autoIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-minimize after 10 seconds of inactivity when open
  useEffect(() => {
    if (isMinimized || isOpenList || isHovered) return;

    const timer = setTimeout(() => {
      setIsMinimized(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, [isMinimized, isOpenList, isHovered]);

  // Auto-Random morphing timer (triggers every 14 seconds when active)
  useEffect(() => {
    if (!isAutoRandom) {
      if (autoIntervalRef.current) clearInterval(autoIntervalRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      setAutoTimerProgress(0);
      return;
    }

    const DURATION = 14000;
    const STEP = 100;
    let elapsed = 0;

    progressIntervalRef.current = setInterval(() => {
      elapsed += STEP;
      const pct = Math.min(100, (elapsed / DURATION) * 100);
      setAutoTimerProgress(pct);

      if (elapsed >= DURATION) {
        elapsed = 0;
        setAutoTimerProgress(0);
        onRandomTheme();
      }
    }, STEP);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isAutoRandom, onRandomTheme]);

  const handleRandomClick = () => {
    audioSystem.playClick(680);
    onRandomTheme();
    // Reset auto-timer elapsed if auto mode is on
    setAutoTimerProgress(0);
  };

  const handleCycleClick = () => {
    audioSystem.playClick(580);
    onCycleTheme();
    setAutoTimerProgress(0);
  };

  const handleToggleAuto = () => {
    audioSystem.playClick(isAutoRandom ? 450 : 720);
    setIsAutoRandom((prev) => !prev);
    setAutoTimerProgress(0);
  };

  const patternDesc =
    PATTERN_DESCRIPTIONS[currentTheme.patternMode] || 'PARAMETRIC WAVE PATTERN';

  const accentHex = `#${currentTheme.accentColor.getHexString()}`;
  const highlightHex = `#${currentTheme.highlightColor.getHexString()}`;

  return (
    <aside
      aria-label="Controlli ed effetti di sfondo 3D"
      className="fixed bottom-6 left-6 z-40 font-mono select-none"
    >
      {/* 1. Modal / Drawer containing all 12 Background Effects */}
      {isOpenList && (
        <div className="mb-3 w-80 sm:w-96 max-h-[68vh] overflow-y-auto bg-stone-950/95 border border-cyan-400/50 shadow-[0_10px_40px_rgba(0,0,0,0.9)] backdrop-blur-xl p-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-stone-200 tracking-wider">
                18 EFFETTI MATEMATICI 3D
              </span>
            </div>
            <button
              onClick={() => {
                audioSystem.playClick(440);
                setIsOpenList(false);
              }}
              className="text-stone-400 hover:text-stone-100 p-1 text-xs"
              title="Chiudi elenco"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 gap-1.5">
            {GRAPHIC_THEMES.map((theme, idx) => {
              const isSelected = theme.id === currentTheme.id;
              const themeAccent = `#${theme.accentColor.getHexString()}`;
              const themeHighlight = `#${theme.highlightColor.getHexString()}`;

              return (
                <button
                  key={theme.id}
                  onClick={() => {
                    audioSystem.playClick(600 + idx * 25);
                    onSelectTheme(idx);
                    setIsOpenList(false);
                  }}
                  onMouseEnter={() => audioSystem.playTechHover()}
                  className={`p-2.5 text-left border flex items-center justify-between transition-all group ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-400/80 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                      : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-white/40 font-bold">
                      {theme.code}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-white/20"
                        style={{
                          backgroundColor: themeAccent,
                          boxShadow: `0 0 8px ${themeAccent}`,
                        }}
                      />
                      <span
                        className="w-2 h-2 rounded-full border border-white/20"
                        style={{ backgroundColor: themeHighlight }}
                      />
                    </div>
                    <div>
                      <div
                        className={`text-xs font-bold tracking-wider ${
                          isSelected
                            ? 'text-cyan-300'
                            : 'text-stone-200 group-hover:text-white'
                        }`}
                      >
                        {theme.name}
                      </div>
                      <div className="text-[10px] text-stone-400">
                        {PATTERN_DESCRIPTIONS[theme.patternMode]}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="flex items-center gap-1 text-[10px] text-cyan-400 font-bold">
                      <Check className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">ATTIVO</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Minimized Floating Button */}
      {isMinimized ? (
        <button
          onClick={() => {
            audioSystem.playClick(520);
            setIsMinimized(false);
          }}
          className="flex items-center gap-2.5 px-3.5 py-2.5 bg-stone-950/95 border border-cyan-400/60 shadow-[0_4px_24px_rgba(0,0,0,0.85)] backdrop-blur-md hover:border-cyan-300 hover:bg-stone-900 transition-all text-left group"
          title="Espandi controlli effetti sfondo 3D"
        >
          <span
            className="w-2.5 h-2.5 rounded-full animate-pulse"
            style={{
              backgroundColor: accentHex,
              boxShadow: `0 0 10px ${accentHex}`,
            }}
          />
          <div className="flex flex-col">
            <span className="text-[9px] text-cyan-400 font-bold tracking-widest uppercase">
              SFONDO 3D
            </span>
            <span className="text-xs text-stone-200 font-bold tracking-wider">
              {currentTheme.code} {currentTheme.name}
            </span>
          </div>
          <ChevronUp className="w-4 h-4 text-cyan-400 group-hover:-translate-y-0.5 transition-transform ml-1" />
        </button>
      ) : (
        /* 3. Full HUD Controller Box */
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="w-72 sm:w-80 bg-stone-950/92 border border-cyan-400/50 shadow-[0_8px_32px_rgba(0,0,0,0.85)] backdrop-blur-xl p-3.5 transition-all"
        >
          {/* Top Bar: Title & Minimize */}
          <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-white/10 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                EFFETTI SFONDO 3D
              </span>
              <span className="text-[10px] text-white/40">// HUD</span>
            </div>
            <button
              onClick={() => {
                audioSystem.playClick(440);
                setIsMinimized(true);
              }}
              className="text-stone-400 hover:text-stone-200 p-0.5"
              title="Riduci a icona"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Current Active Effect Card */}
          <div className="p-2.5 bg-black/60 border border-white/10 mb-3 relative overflow-hidden">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full animate-pulse shrink-0"
                  style={{
                    backgroundColor: accentHex,
                    boxShadow: `0 0 10px ${accentHex}`,
                  }}
                />
                <span className="text-xs font-black text-white tracking-widest uppercase">
                  {currentTheme.code} {currentTheme.name}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: accentHex }}
                  title="Accent Color"
                />
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: highlightHex }}
                  title="Highlight Color"
                />
              </div>
            </div>

            <div className="text-[10px] text-cyan-300/80 uppercase tracking-wide">
              {patternDesc}
            </div>

            {/* Auto-timer visual progress track */}
            {isAutoRandom && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/10">
                <div
                  className="h-full bg-cyan-400 transition-all duration-100 ease-linear shadow-[0_0_6px_#00f0ff]"
                  style={{ width: `${autoTimerProgress}%` }}
                />
              </div>
            )}
          </div>

          {/* Action Buttons Grid */}
          <div className="grid grid-cols-2 gap-2 mb-2">
            {/* 1. RANDOM EFFECT BUTTON */}
            <button
              onClick={handleRandomClick}
              onMouseEnter={() => audioSystem.playTechHover()}
              className="px-3 py-2 bg-cyan-500/20 hover:bg-cyan-500/35 active:scale-98 border border-cyan-400/80 hover:border-cyan-300 text-cyan-300 hover:text-white flex items-center justify-center gap-2 text-xs font-bold transition-all shadow-[0_0_12px_rgba(0,240,255,0.25)]"
              title="Applica un effetto grafico casuale"
            >
              <Shuffle className="w-3.5 h-3.5 animate-pulse" />
              <span>RANDOM FX</span>
            </button>

            {/* 2. NEXT CYCLE BUTTON */}
            <button
              onClick={handleCycleClick}
              onMouseEnter={() => audioSystem.playTechHover()}
              className="px-3 py-2 bg-white/5 hover:bg-white/15 active:scale-98 border border-white/15 hover:border-white/30 text-stone-200 hover:text-white flex items-center justify-center gap-1.5 text-xs font-bold transition-all"
              title="Passa al prossimo effetto in sequenza"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>PROSSIMO</span>
            </button>
          </div>

          {/* Secondary Controls (Auto-Random & View All) */}
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            {/* Auto-Random Toggle */}
            <button
              onClick={handleToggleAuto}
              onMouseEnter={() => audioSystem.playTechHover()}
              className={`p-1.5 border flex items-center justify-center gap-1.5 transition-all ${
                isAutoRandom
                  ? 'bg-emerald-950/40 border-emerald-400/80 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                  : 'bg-white/5 border-white/10 text-stone-400 hover:text-stone-200'
              }`}
              title="Attiva/Disattiva cambio automatico casuale ogni 14s"
            >
              <RefreshCw
                className={`w-3 h-3 ${isAutoRandom ? 'animate-spin' : ''}`}
              />
              <span>AUTO: {isAutoRandom ? 'ATTIVO (14s)' : 'OFF'}</span>
            </button>

            {/* All 12 Effects Drawer Button */}
            <button
              onClick={() => {
                audioSystem.playClick(520);
                setIsOpenList((prev) => !prev);
              }}
              onMouseEnter={() => audioSystem.playTechHover()}
              className={`p-1.5 border flex items-center justify-center gap-1.5 transition-all ${
                isOpenList
                  ? 'bg-cyan-950/50 border-cyan-400 text-cyan-300'
                  : 'bg-white/5 border-white/10 text-stone-300 hover:border-white/25 hover:text-white'
              }`}
              title="Visualizza e seleziona tra tutti i 12 effetti matematici"
            >
              <Layers className="w-3 h-3 text-cyan-400" />
              <span>TUTTI (12)</span>
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

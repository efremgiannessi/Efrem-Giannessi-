import { useState, useEffect, useCallback, useRef } from 'react';
import { LightingMode, WeatherIntensity } from '../types';
import { getTimeSyncInfo, getLightingModeForDate, TimeSyncInfo } from '../utils/timeSync';
import { audioSystem } from '../utils/audioSynthesizer';

const STORAGE_KEY = 'eg_studio_time_sync_active';
const WEATHER_STORAGE_KEY = 'eg_studio_weather_intensity';

export interface UseLightTimeSyncReturn {
  lightingMode: LightingMode;
  setLightingMode: (mode: LightingMode) => void;
  isAutoSync: boolean;
  setIsAutoSync: (active: boolean) => void;
  timeInfo: TimeSyncInfo;
  manualSelectMode: (mode: LightingMode) => void;
  syncNow: () => void;
  simulatedHour: number | null;
  setSimulatedHour: (hour: number | null) => void;
  lastSyncMessage: string | null;
  clearSyncMessage: () => void;
  weatherIntensity: WeatherIntensity;
  setWeatherIntensity: (intensity: WeatherIntensity) => void;
  toggleWeatherIntensity: () => void;
}

export function useLightTimeSync(): UseLightTimeSyncReturn {
  // Initialize auto-sync preference (default: true)
  const [isAutoSync, setIsAutoSyncState] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        return stored === 'true';
      }
    } catch {
      // ignore
    }
    return true;
  });

  // Weather particle and atmospheric volumetric ray intensity
  const [weatherIntensity, setWeatherIntensityState] = useState<WeatherIntensity>(() => {
    try {
      const stored = localStorage.getItem(WEATHER_STORAGE_KEY);
      if (stored === 'subtle' || stored === 'vivid' || stored === 'off') {
        return stored;
      }
    } catch {
      // ignore
    }
    return 'subtle';
  });

  // Simulated hour for testing/scrubbing (null = real live time)
  const [simulatedHour, setSimulatedHourState] = useState<number | null>(null);

  // Compute current date object (either real or simulated)
  const computeCurrentDate = useCallback(() => {
    const d = new Date();
    if (simulatedHour !== null) {
      d.setHours(simulatedHour, 0, 0, 0);
    }
    return d;
  }, [simulatedHour]);

  // Real-time time info
  const [timeInfo, setTimeInfo] = useState<TimeSyncInfo>(() =>
    getTimeSyncInfo(computeCurrentDate())
  );

  // Lighting mode state: initialize directly from local time if auto-sync is active
  const [lightingMode, setLightingModeState] = useState<LightingMode>(() => {
    const info = getTimeSyncInfo(new Date());
    return info.mode;
  });

  // Notification message for UI toast
  const [lastSyncMessage, setLastSyncMessage] = useState<string | null>(() => {
    const initial = getTimeSyncInfo(new Date());
    return `Sincronizzato: ${initial.localTimeStr} (${initial.periodTitle})`;
  });

  const prevModeRef = useRef<LightingMode>(lightingMode);

  // Persistence for auto-sync setting
  const setIsAutoSync = useCallback((val: boolean) => {
    setIsAutoSyncState(val);
    try {
      localStorage.setItem(STORAGE_KEY, String(val));
    } catch {
      // ignore
    }
  }, []);

  // Update time info and trigger automatic mode adjustment if auto-sync is on
  useEffect(() => {
    const checkAndUpdate = () => {
      const currentDate = computeCurrentDate();
      const updatedInfo = getTimeSyncInfo(currentDate);
      setTimeInfo(updatedInfo);

      if (isAutoSync) {
        const detectedMode = updatedInfo.mode;
        if (detectedMode !== prevModeRef.current) {
          prevModeRef.current = detectedMode;
          setLightingModeState(detectedMode);
          audioSystem.playChime();
          setLastSyncMessage(
            `Transizione Oraria: ${updatedInfo.localTimeStr} • Attivata ${updatedInfo.periodTitle}`
          );
        }
      }
    };

    // Run check immediately
    checkAndUpdate();

    // Check every 5 seconds for responsive local clock and exact transitions
    const interval = setInterval(checkAndUpdate, 5000);
    return () => clearInterval(interval);
  }, [isAutoSync, computeCurrentDate]);

  // When user clicks a manual lighting button (Day / Sunset / Night)
  const manualSelectMode = useCallback((mode: LightingMode) => {
    setIsAutoSync(false);
    setSimulatedHourState(null);
    setLightingModeState(mode);
    prevModeRef.current = mode;
    const label = mode === 'day' ? 'Giorno' : mode === 'sunset' ? 'Tramonto' : 'Notte';
    setLastSyncMessage(`Modalità Manuale: ${label} (Sincronizzazione automatica disattivata)`);
  }, [setIsAutoSync]);

  // Immediate snap back to current local time and reactivate auto-sync
  const syncNow = useCallback(() => {
    setIsAutoSync(true);
    setSimulatedHourState(null);
    const now = new Date();
    const info = getTimeSyncInfo(now);
    setTimeInfo(info);
    setLightingModeState(info.mode);
    prevModeRef.current = info.mode;
    audioSystem.playClick(750);
    setLastSyncMessage(`Sincronizzato all'ora locale: ${info.localTimeStr} (${info.periodTitle})`);
  }, [setIsAutoSync]);

  // Set simulated hour for previewing different times of day
  const setSimulatedHour = useCallback((hour: number | null) => {
    setSimulatedHourState(hour);
    if (hour !== null) {
      setIsAutoSync(true);
      const testDate = new Date();
      testDate.setHours(hour, 0, 0, 0);
      const newMode = getLightingModeForDate(testDate);
      const info = getTimeSyncInfo(testDate);
      setTimeInfo(info);
      setLightingModeState(newMode);
      prevModeRef.current = newMode;
      setLastSyncMessage(`Simulazione Ore ${String(hour).padStart(2, '0')}:00: ${info.periodTitle}`);
    }
  }, [setIsAutoSync]);

  const clearSyncMessage = useCallback(() => {
    setLastSyncMessage(null);
  }, []);

  const setWeatherIntensity = useCallback((intensity: WeatherIntensity) => {
    setWeatherIntensityState(intensity);
    try {
      localStorage.setItem(WEATHER_STORAGE_KEY, intensity);
    } catch {
      // ignore
    }
  }, []);

  const toggleWeatherIntensity = useCallback(() => {
    setWeatherIntensityState((prev) => {
      const next: WeatherIntensity = prev === 'subtle' ? 'vivid' : prev === 'vivid' ? 'off' : 'subtle';
      try {
        localStorage.setItem(WEATHER_STORAGE_KEY, next);
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  return {
    lightingMode,
    setLightingMode: setLightingModeState,
    isAutoSync,
    setIsAutoSync,
    timeInfo,
    manualSelectMode,
    syncNow,
    simulatedHour,
    setSimulatedHour,
    lastSyncMessage,
    clearSyncMessage,
    weatherIntensity,
    setWeatherIntensity,
    toggleWeatherIntensity,
  };
}

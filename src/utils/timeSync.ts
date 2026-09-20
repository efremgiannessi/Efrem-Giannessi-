import { LightingMode } from '../types';

export interface TimeSyncInfo {
  mode: LightingMode;
  localTimeStr: string;
  secondsTimeStr: string;
  hours: number;
  minutes: number;
  periodTitle: string;
  periodSchedule: string;
  description: string;
  timeZone: string;
  nextTransition: {
    mode: LightingMode;
    label: string;
    targetHourStr: string;
    remainingMinutes: number;
    remainingTimeFormatted: string;
  };
}

/**
 * Determines lighting mode based on current local hour (0-23):
 * - Day (Luce Diurna): 07:00 - 17:59 (7 AM - 5:59 PM)
 * - Sunset (Golden Hour / Tramonto): 18:00 - 20:59 (6 PM - 8:59 PM)
 * - Night (Atmosfera Notturna): 21:00 - 06:59 (9 PM - 6:59 AM)
 */
export function getLightingModeForDate(date: Date = new Date()): LightingMode {
  const hour = date.getHours();
  if (hour >= 7 && hour < 18) {
    return 'day';
  }
  if (hour >= 18 && hour < 21) {
    return 'sunset';
  }
  return 'night';
}

/**
 * Returns comprehensive time synchronization metadata for user local time
 */
export function getTimeSyncInfo(date: Date = new Date()): TimeSyncInfo {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const mode = getLightingModeForDate(date);

  const localTimeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  const secondsTimeStr = `${localTimeStr}:${String(seconds).padStart(2, '0')}`;

  let periodTitle = 'Luce Diurna';
  let periodSchedule = '07:00 – 18:00';
  let description = 'Luce naturale da sud-ovest con riflessi diurni sulle vetrate.';

  if (mode === 'sunset') {
    periodTitle = 'Tramonto / Golden Hour';
    periodSchedule = '18:00 – 21:00';
    description = 'Tonalità calde dorate radenti sulle pareti e sulla città.';
  } else if (mode === 'night') {
    periodTitle = 'Atmosfera Notturna';
    periodSchedule = '21:00 – 07:00';
    description = 'Illuminazione tecnica da studio, contrasti accentuati e skyline notturno.';
  }

  // Calculate next transition
  let nextTargetHour = 18;
  let nextMode: LightingMode = 'sunset';
  let nextLabel = 'Tramonto';

  if (mode === 'day') {
    nextTargetHour = 18;
    nextMode = 'sunset';
    nextLabel = 'Tramonto';
  } else if (mode === 'sunset') {
    nextTargetHour = 21;
    nextMode = 'night';
    nextLabel = 'Notte';
  } else {
    // night
    nextTargetHour = 7;
    nextMode = 'day';
    nextLabel = 'Luce Diurna';
  }

  // Calculate remaining minutes until nextTargetHour:00
  let diffMinutes = 0;
  if (nextTargetHour > hours) {
    diffMinutes = (nextTargetHour - hours) * 60 - minutes;
  } else {
    // cross midnight
    diffMinutes = (24 - hours + nextTargetHour) * 60 - minutes;
  }
  if (diffMinutes < 0) diffMinutes = 0;

  const remHours = Math.floor(diffMinutes / 60);
  const remMins = diffMinutes % 60;
  const remainingTimeFormatted =
    remHours > 0 ? `${remHours}h ${remMins}m` : `${remMins} min`;

  let timeZone = 'Ora Locale';
  try {
    timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Ora Locale';
  } catch {
    // fallback
  }

  return {
    mode,
    localTimeStr,
    secondsTimeStr,
    hours,
    minutes,
    periodTitle,
    periodSchedule,
    description,
    timeZone,
    nextTransition: {
      mode: nextMode,
      label: nextLabel,
      targetHourStr: `${String(nextTargetHour).padStart(2, '0')}:00`,
      remainingMinutes: diffMinutes,
      remainingTimeFormatted,
    },
  };
}

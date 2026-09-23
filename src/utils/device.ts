/**
 * Utility for robust mobile & touch device detection
 */
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia('(pointer: coarse)').matches ||
    window.innerWidth <= 768
  );
};

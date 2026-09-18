export type LightingMode = 'day' | 'sunset' | 'night';

export interface Hotspot {
  id: string;
  title: string;
  emoji: string;
  description: string;
  x: number; // percentage from left (0 - 100)
  y: number; // percentage from top (0 - 100)
  actionLabel?: string;
  badge?: string;
}

export interface OfficeStation {
  id: string;
  name: string;
  shortName: string;
  emoji: string;
  tagline: string;
  description: string;
  category: string;
  capacity: string;
  features: string[];
  equipment: string[];
  hotspots: Hotspot[];
  // Background images / visuals for each lighting mode (high-res modern architecture photography)
  backgrounds: {
    day: string;
    sunset: string;
    night: string;
  };
  ambientSound: 'quiet-office' | 'keyboard-typing' | 'coffee-chatter' | 'conference-room' | 'rooftop-breeze' | 'creative-music';
  cameraAngle: {
    panX: number;
    panY: number;
    zoom: number;
    rotationZ: number;
  };
}

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
  linkUrl?: string;
  detailBullets?: string[];
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
  // Video background for interactive video tour (MP4 format)
  videoUrl: string;
  // Background images / visuals for fallback or lighting mode
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

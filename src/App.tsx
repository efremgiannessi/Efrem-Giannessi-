/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { OFFICE_STATIONS } from './data/officeStations';
import { OfficeStation, LightingMode, Hotspot } from './types';
import { OfficeVideoCanvas } from './components/OfficeVideoCanvas';
import { EmojiNavigationDock } from './components/EmojiNavigationDock';
import { FlyingEmojiTransition } from './components/FlyingEmojiTransition';
import { StationDetailOverlay } from './components/StationDetailOverlay';
import { TopControls } from './components/TopControls';
import { HotspotModal } from './components/HotspotModal';
import { GitHubPublishModal } from './components/GitHubPublishModal';
import { audioSystem } from './utils/audioSynthesizer';

export default function App() {
  const [currentStationIndex, setCurrentStationIndex] = useState<number>(0);
  const [lightingMode, setLightingMode] = useState<LightingMode>('day');
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [transitionDirection, setTransitionDirection] = useState<'left' | 'right' | 'direct'>('direct');
  const [flyingEmoji, setFlyingEmoji] = useState<{ emoji: string; name: string } | null>(null);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [showHotspots, setShowHotspots] = useState<boolean>(true);
  const [isAutoTouring, setIsAutoTouring] = useState<boolean>(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState<boolean>(false);

  const currentStation = OFFICE_STATIONS[currentStationIndex];
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Switch station with animated flying emoji and camera travel
  const navigateToStation = useCallback(
    (newIndex: number) => {
      if (newIndex === currentStationIndex || isTransitioning) return;

      const direction: 'left' | 'right' = newIndex > currentStationIndex ? 'right' : 'left';
      setTransitionDirection(direction);
      setIsTransitioning(true);

      const targetStation = OFFICE_STATIONS[newIndex];
      setFlyingEmoji({ emoji: targetStation.emoji, name: targetStation.name });

      // Audio feedback
      audioSystem.playTransitionWhoosh();
      audioSystem.updateStationAmbience(targetStation.ambientSound);

      // Change station
      setCurrentStationIndex(newIndex);

      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }

      transitionTimeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
        setFlyingEmoji(null);
      }, 950);
    },
    [currentStationIndex, isTransitioning]
  );

  const handleNextStation = useCallback(() => {
    const nextIdx = (currentStationIndex + 1) % OFFICE_STATIONS.length;
    navigateToStation(nextIdx);
  }, [currentStationIndex, navigateToStation]);

  const handlePrevStation = useCallback(() => {
    const prevIdx = (currentStationIndex - 1 + OFFICE_STATIONS.length) % OFFICE_STATIONS.length;
    navigateToStation(prevIdx);
  }, [currentStationIndex, navigateToStation]);

  // Keyboard navigation (Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNextStation();
      } else if (e.key === 'ArrowLeft') {
        handlePrevStation();
      } else if (e.key === 'Escape') {
        setSelectedHotspot(null);
        setIsGitHubModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextStation, handlePrevStation]);

  // Auto-tour timer
  useEffect(() => {
    if (!isAutoTouring) return;

    const interval = setInterval(() => {
      handleNextStation();
    }, 8500);

    return () => clearInterval(interval);
  }, [isAutoTouring, handleNextStation]);

  // Open first hotspot on demand
  const handleExploreHotspots = () => {
    if (currentStation.hotspots.length > 0) {
      audioSystem.playHotspotPing();
      setSelectedHotspot(currentStation.hotspots[0]);
    }
  };

  const handleSelectHotspot = (hotspot: Hotspot) => {
    audioSystem.playHotspotPing();
    setSelectedHotspot(hotspot);
  };

  return (
    <main
      id="modern-office-tour-app"
      className="relative h-[100dvh] w-[100dvw] overflow-hidden bg-stone-950 font-sans text-stone-100"
    >
      {/* 1. Fullscreen Interactive Video / Parallax Canvas */}
      <OfficeVideoCanvas
        currentStation={currentStation}
        lightingMode={lightingMode}
        isTransitioning={isTransitioning}
        transitionDirection={transitionDirection}
        onSelectHotspot={handleSelectHotspot}
        showHotspots={showHotspots}
      />

      {/* 2. Flying Emoji Traveling Transition */}
      <FlyingEmojiTransition
        emoji={flyingEmoji?.emoji || null}
        stationName={flyingEmoji?.name || null}
        direction={transitionDirection}
      />

      {/* 3. Top Control Bar (Lighting, Sound, Auto-Tour, Fullscreen, GitHub) */}
      <TopControls
        lightingMode={lightingMode}
        onSelectLightingMode={setLightingMode}
        isAutoTouring={isAutoTouring}
        onToggleAutoTour={() => setIsAutoTouring(!isAutoTouring)}
        showHotspots={showHotspots}
        onToggleShowHotspots={() => setShowHotspots(!showHotspots)}
        onOpenGitHubModal={() => setIsGitHubModalOpen(true)}
      />

      {/* 4. Active Station Information Card */}
      <StationDetailOverlay
        station={currentStation}
        onExploreHotspots={handleExploreHotspots}
      />

      {/* 5. Bottom Emoji Navigation Dock */}
      <EmojiNavigationDock
        stations={OFFICE_STATIONS}
        activeStationId={currentStation.id}
        onSelectStation={(station) => {
          const idx = OFFICE_STATIONS.findIndex((s) => s.id === station.id);
          if (idx !== -1) navigateToStation(idx);
        }}
        onNextStation={handleNextStation}
        onPrevStation={handlePrevStation}
      />

      {/* 6. Hotspot Inspector Modal */}
      <HotspotModal
        hotspot={selectedHotspot}
        onClose={() => setSelectedHotspot(null)}
      />

      {/* 7. GitHub Deploy Modal Guide */}
      <GitHubPublishModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
      />
    </main>
  );
}

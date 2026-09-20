/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { OFFICE_STATIONS } from './data/officeStations';
import { OfficeStation, LightingMode, Hotspot, TransitionStyle } from './types';
import { OfficeVideoCanvas } from './components/OfficeVideoCanvas';
import { Office360Viewer } from './components/Office360Viewer';
import { EmojiNavigationDock } from './components/EmojiNavigationDock';
import { FlyingEmojiTransition } from './components/FlyingEmojiTransition';
import { StationDetailOverlay } from './components/StationDetailOverlay';
import { TopControls } from './components/TopControls';
import { HotspotModal } from './components/HotspotModal';
import { GitHubPublishModal } from './components/GitHubPublishModal';
import { OfficeMiniMap } from './components/OfficeMiniMap';
import { BIMViewerModal } from './components/BIMViewerModal';
import { CadBimCompareModal } from './components/CadBimCompareModal';
import { GuidedTourController } from './components/GuidedTourController';
import { LightTimeSyncModal } from './components/LightTimeSyncModal';
import { LightTimeToast } from './components/LightTimeToast';
import { WeatherAtmosphereOverlay } from './components/WeatherAtmosphereOverlay';
import { BIMCostEstimatorModal } from './components/BIMCostEstimatorModal';
import { RevitPluginConsoleModal } from './components/RevitPluginConsoleModal';
import { VirtualStagingModal } from './components/VirtualStagingModal';
import { LivePitchMeetingOverlay } from './components/LivePitchMeetingOverlay';
import { DirectAuditBookingModal } from './components/DirectAuditBookingModal';
import { useLightTimeSync } from './hooks/useLightTimeSync';
import { audioSystem } from './utils/audioSynthesizer';

export default function App() {
  const [currentStationIndex, setCurrentStationIndex] = useState<number>(0);
  const {
    lightingMode,
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
  } = useLightTimeSync();
  const [isTimeSyncModalOpen, setIsTimeSyncModalOpen] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [transitionDirection, setTransitionDirection] = useState<'left' | 'right' | 'direct'>('direct');
  const [flyingEmoji, setFlyingEmoji] = useState<{ emoji: string; name: string } | null>(null);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [showHotspots, setShowHotspots] = useState<boolean>(true);
  const [showMiniMap, setShowMiniMap] = useState<boolean>(true);
  const [isAutoTouring, setIsAutoTouring] = useState<boolean>(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState<boolean>(false);
  const [isBIMViewerOpen, setIsBIMViewerOpen] = useState<boolean>(false);
  const [isCadCompareOpen, setIsCadCompareOpen] = useState<boolean>(false);
  const [is360Mode, setIs360Mode] = useState<boolean>(false);
  const [isBIMEstimatorOpen, setIsBIMEstimatorOpen] = useState<boolean>(false);
  const [isRevitConsoleOpen, setIsRevitConsoleOpen] = useState<boolean>(false);
  const [isVirtualStagingOpen, setIsVirtualStagingOpen] = useState<boolean>(false);
  const [isPitchMode, setIsPitchMode] = useState<boolean>(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [quoteMessageForBooking, setQuoteMessageForBooking] = useState<string>('');
  const [isRainAudioActive, setIsRainAudioActive] = useState<boolean>(false);
  const [transitionStyle, setTransitionStyle] = useState<TransitionStyle>('motion-blur');

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

  // Keyboard navigation (Arrow keys, M for mini-map, Escape to close overlays)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'ArrowRight') {
        handleNextStation();
      } else if (e.key === 'ArrowLeft') {
        handlePrevStation();
      } else if (e.key.toLowerCase() === 'm') {
        setShowMiniMap((prev) => !prev);
      } else if (e.key === 'Escape') {
        setSelectedHotspot(null);
        setIsGitHubModalOpen(false);
        setShowMiniMap(false);
        setIsBIMViewerOpen(false);
        setIsCadCompareOpen(false);
        setIsBIMEstimatorOpen(false);
        setIsRevitConsoleOpen(false);
        setIsVirtualStagingOpen(false);
        setIsPitchMode(false);
        setIsBookingModalOpen(false);
        setIsTimeSyncModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextStation, handlePrevStation]);

  const handleToggleRainAudio = useCallback(() => {
    const newState = audioSystem.toggleRainSoundscape();
    setIsRainAudioActive(newState);
  }, []);

  // Guided tour station transitions are synchronized with GuidedTourController
  // allowing narration audio & visual countdown to complete seamlessly.

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
      {/* 1. Fullscreen Interactive 360° Sphere Viewer OR Parallax Video Canvas */}
      {is360Mode ? (
        <Office360Viewer
          currentStation={currentStation}
          lightingMode={lightingMode}
          onSelectHotspot={handleSelectHotspot}
          showHotspots={showHotspots}
          onOpenBIMViewer={() => setIsBIMViewerOpen(true)}
          onOpenCadCompare={() => setIsCadCompareOpen(true)}
          onToggle360Mode={() => setIs360Mode(false)}
          isTransitioning={isTransitioning}
          transitionDirection={transitionDirection}
          transitionStyle={transitionStyle}
          onSelectTransitionStyle={setTransitionStyle}
        />
      ) : (
        <OfficeVideoCanvas
          currentStation={currentStation}
          lightingMode={lightingMode}
          isTransitioning={isTransitioning}
          transitionDirection={transitionDirection}
          onSelectHotspot={handleSelectHotspot}
          showHotspots={showHotspots}
          transitionStyle={transitionStyle}
          onSelectTransitionStyle={setTransitionStyle}
        />
      )}

      {/* 1b. Dynamic Weather Particle & Atmospheric Volumetric Ray Overlay */}
      <WeatherAtmosphereOverlay
        lightingMode={lightingMode}
        intensity={weatherIntensity}
      />

      {/* 2. Flying Emoji Traveling Transition */}
      <FlyingEmojiTransition
        emoji={flyingEmoji?.emoji || null}
        stationName={flyingEmoji?.name || null}
        direction={transitionDirection}
      />

      {/* 3. Top Control Bar (Lighting, Sound, Auto-Tour, Fullscreen, Mini-Map, GitHub, BIM, CAD, 360, Time Sync, Weather, Estimator, Console, Staging, Pitch, Rain, Booking) */}
      <TopControls
        lightingMode={lightingMode}
        onSelectLightingMode={manualSelectMode}
        isAutoTouring={isAutoTouring}
        onToggleAutoTour={() => setIsAutoTouring(!isAutoTouring)}
        showHotspots={showHotspots}
        onToggleShowHotspots={() => setShowHotspots(!showHotspots)}
        showMiniMap={showMiniMap}
        onToggleMiniMap={() => setShowMiniMap((prev) => !prev)}
        onOpenGitHubModal={() => setIsGitHubModalOpen(true)}
        onOpenBIMViewer={() => setIsBIMViewerOpen(true)}
        onOpenCadCompare={() => setIsCadCompareOpen(true)}
        is360Mode={is360Mode}
        onToggle360Mode={() => setIs360Mode((prev) => !prev)}
        isAutoSync={isAutoSync}
        onToggleAutoSync={setIsAutoSync}
        onOpenTimeSyncModal={() => setIsTimeSyncModalOpen(true)}
        timeInfo={timeInfo}
        weatherIntensity={weatherIntensity}
        onToggleWeatherIntensity={toggleWeatherIntensity}
        onOpenBIMEstimator={() => setIsBIMEstimatorOpen(true)}
        onOpenRevitConsole={() => setIsRevitConsoleOpen(true)}
        onOpenVirtualStaging={() => setIsVirtualStagingOpen(true)}
        onTogglePitchMode={() => setIsPitchMode((prev) => !prev)}
        isPitchMode={isPitchMode}
        onOpenBookingModal={() => {
          setQuoteMessageForBooking('');
          setIsBookingModalOpen(true);
        }}
        isRainAudioActive={isRainAudioActive}
        onToggleRainAudio={handleToggleRainAudio}
      />

      {/* 4. Active Station Information Card */}
      <StationDetailOverlay
        station={currentStation}
        onExploreHotspots={handleExploreHotspots}
        onOpenBIMViewer={() => setIsBIMViewerOpen(true)}
        onOpenCadCompare={() => setIsCadCompareOpen(true)}
        is360Mode={is360Mode}
        onToggle360Mode={() => setIs360Mode((prev) => !prev)}
        lightingMode={lightingMode}
        isAutoSync={isAutoSync}
        localTimeStr={timeInfo.localTimeStr}
        onOpenTimeSyncModal={() => setIsTimeSyncModalOpen(true)}
        onOpenBookingModal={() => {
          setQuoteMessageForBooking('');
          setIsBookingModalOpen(true);
        }}
        onOpenBIMEstimator={() => setIsBIMEstimatorOpen(true)}
        onOpenVirtualStaging={() => setIsVirtualStagingOpen(true)}
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

      {/* 6. Guided Tour Live Controller with Audio Guide Voice */}
      <GuidedTourController
        isActive={isAutoTouring}
        currentStationId={currentStation.id}
        stationName={currentStation.name}
        stationEmoji={currentStation.emoji}
        onStopTour={() => setIsAutoTouring(false)}
        onNextStation={handleNextStation}
      />

      {/* 7. Architectural Mini-Map Overlay (Quick Jump Navigator) */}
      <OfficeMiniMap
        isOpen={showMiniMap}
        onClose={() => setShowMiniMap(false)}
        stations={OFFICE_STATIONS}
        currentStationIndex={currentStationIndex}
        onSelectStation={(idx) => {
          navigateToStation(idx);
        }}
      />

      {/* 8. Hotspot Inspector Modal */}
      <HotspotModal
        hotspot={selectedHotspot}
        onClose={() => setSelectedHotspot(null)}
      />

      {/* 9. Interactive 3D WebGL BIM & IFC Inspector Modal */}
      <BIMViewerModal
        isOpen={isBIMViewerOpen}
        onClose={() => setIsBIMViewerOpen(false)}
        stationName={currentStation.shortName}
      />

      {/* 10. Split-Screen CAD 2D vs BIM 3D Comparison Modal */}
      <CadBimCompareModal
        isOpen={isCadCompareOpen}
        onClose={() => setIsCadCompareOpen(false)}
      />

      {/* 11. GitHub Deploy Modal Guide */}
      <GitHubPublishModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
      />

      {/* 12. Global Light-Time Synchronization Modal */}
      <LightTimeSyncModal
        isOpen={isTimeSyncModalOpen}
        onClose={() => setIsTimeSyncModalOpen(false)}
        timeInfo={timeInfo}
        isAutoSync={isAutoSync}
        onToggleAutoSync={setIsAutoSync}
        onSyncNow={syncNow}
        onSelectMode={manualSelectMode}
        simulatedHour={simulatedHour}
        onSetSimulatedHour={setSimulatedHour}
        currentLightingMode={lightingMode}
        weatherIntensity={weatherIntensity}
        onSetWeatherIntensity={setWeatherIntensity}
        isRainAudioActive={isRainAudioActive}
        onToggleRainAudio={handleToggleRainAudio}
      />

      {/* 13. Light-Time Sync Dynamic Toast Notification */}
      <LightTimeToast
        message={lastSyncMessage}
        mode={lightingMode}
        onDismiss={clearSyncMessage}
        onOpenModal={() => setIsTimeSyncModalOpen(true)}
      />

      {/* 14. BIM 5D Parametric Cost & ROI Estimator Modal */}
      <BIMCostEstimatorModal
        isOpen={isBIMEstimatorOpen}
        onClose={() => setIsBIMEstimatorOpen(false)}
        onOpenContactWithQuote={(quoteSummary) => {
          setIsBIMEstimatorOpen(false);
          setQuoteMessageForBooking(quoteSummary);
          setIsBookingModalOpen(true);
        }}
      />

      {/* 15. Revit Plugin & Scripting Sandbox Console Modal */}
      <RevitPluginConsoleModal
        isOpen={isRevitConsoleOpen}
        onClose={() => setIsRevitConsoleOpen(false)}
      />

      {/* 16. Virtual Staging & Photorealistic Rendering Comparison Modal */}
      <VirtualStagingModal
        isOpen={isVirtualStagingOpen}
        onClose={() => setIsVirtualStagingOpen(false)}
      />

      {/* 17. Live Pitch Meeting & Presenter Overlay (Laser Pointer, Pen, Drawing) */}
      <LivePitchMeetingOverlay
        isActive={isPitchMode}
        onClose={() => setIsPitchMode(false)}
        currentStationName={currentStation.name}
        onNextStation={handleNextStation}
        onPrevStation={handlePrevStation}
      />

      {/* 18. Direct BIM Audit & Consultation Booking Form Modal */}
      <DirectAuditBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setQuoteMessageForBooking('');
        }}
        initialMessage={quoteMessageForBooking}
      />
    </main>
  );
}

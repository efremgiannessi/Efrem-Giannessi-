import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import {
  Compass,
  RotateCcw,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Move,
  Play,
  Pause,
  Layers,
  Crosshair,
} from 'lucide-react';
import { OfficeStation, LightingMode, Hotspot, TransitionStyle } from '../types';
import { audioSystem } from '../utils/audioSynthesizer';
import { MotionBlurStreaks } from './MotionBlurStreaks';

interface Office360ViewerProps {
  currentStation: OfficeStation;
  lightingMode: LightingMode;
  onSelectHotspot: (hotspot: Hotspot) => void;
  showHotspots: boolean;
  onOpenBIMViewer?: () => void;
  onOpenCadCompare?: () => void;
  onToggle360Mode?: () => void;
  isTransitioning?: boolean;
  transitionDirection?: 'left' | 'right' | 'direct';
  transitionStyle?: TransitionStyle;
  onSelectTransitionStyle?: (style: TransitionStyle) => void;
}

export const Office360Viewer: React.FC<Office360ViewerProps> = ({
  currentStation,
  lightingMode,
  onSelectHotspot,
  showHotspots,
  onOpenBIMViewer,
  onOpenCadCompare,
  onToggle360Mode,
  isTransitioning = false,
  transitionDirection = 'direct',
  transitionStyle = 'motion-blur',
  onSelectTransitionStyle,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sphereMeshRef = useRef<THREE.Mesh | null>(null);
  const textureLoaderRef = useRef<THREE.TextureLoader | null>(null);

  // Interaction & Camera orientation state
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const touchDistanceRef = useRef<number | null>(null);

  // Spherical camera angles (Euler: lon = yaw, lat = pitch)
  const lonRef = useRef<number>(180);
  const latRef = useRef<number>(0);
  const targetLonRef = useRef<number>(180);
  const targetLatRef = useRef<number>(0);
  const fovRef = useRef<number>(75);
  const targetFovRef = useRef<number>(75);

  // Auto-rotation toggle
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [hudHeading, setHudHeading] = useState<number>(0);
  const [hudPitch, setHudPitch] = useState<number>(0);
  const [currentZoomPercent, setCurrentZoomPercent] = useState<number>(100);
  const [isLoadingTexture, setIsLoadingTexture] = useState<boolean>(true);
  const [projectedHotspots, setProjectedHotspots] = useState<
    { hotspot: Hotspot; screenX: number; screenY: number; visible: boolean }[]
  >([]);

  // 360 Panorama URL selection based on station & lighting mode
  const currentPanoramaUrl =
    currentStation.panorama360?.[lightingMode] || currentStation.backgrounds[lightingMode];

  // Helper to convert 2D Hotspot (x%, y%) into 3D Coordinates inside the architectural panorama
  const getHotspot3DVector = useCallback((xPercent: number, yPercent: number, radius = 480) => {
    // Distribute hotspots azimuthally across the cylinder arc
    const theta = (xPercent / 100) * Math.PI * 2 - Math.PI;
    const x = radius * Math.sin(theta);
    const z = radius * Math.cos(theta);
    const y = ((50 - yPercent) / 100) * 380;

    return new THREE.Vector3(x, y, z);
  }, []);

  // Initialize Three.js 360 Panorama Viewport
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera (inside the architectural cylinder)
    const camera = new THREE.PerspectiveCamera(fovRef.current, width / height, 1, 1100);
    cameraRef.current = camera;

    // 3. Renderer with antialiasing and high precision
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = lightingMode === 'sunset' ? 1.1 : lightingMode === 'night' ? 0.85 : 1.0;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // 4. Inverted Architectural Cylinder Geometry for 360 Panoramic Projection
    // Scale on X is inverted (-1) so texture faces inwards towards the camera
    // Using a cylinder preserves 100% straight vertical architectural lines and prevents polar pinching
    const cylRadius = 500;
    const cylHeight = 650;
    const geometry = new THREE.CylinderGeometry(cylRadius, cylRadius, cylHeight, 64, 16, true);
    geometry.scale(-1, 1, 1);

    // Ceiling and Floor caps with clean dark architectural ambient fill
    const capGeometry = new THREE.CircleGeometry(cylRadius, 64);
    const capMaterial = new THREE.MeshBasicMaterial({
      color: lightingMode === 'night' ? 0x0a0a0c : lightingMode === 'sunset' ? 0x18120e : 0x141418,
      side: THREE.DoubleSide,
    });
    const topCap = new THREE.Mesh(capGeometry, capMaterial);
    topCap.rotation.x = Math.PI / 2;
    topCap.position.y = cylHeight / 2;
    scene.add(topCap);

    const bottomCap = new THREE.Mesh(capGeometry, capMaterial);
    bottomCap.rotation.x = Math.PI / 2;
    bottomCap.position.y = -cylHeight / 2;
    scene.add(bottomCap);

    const textureLoader = new THREE.TextureLoader();
    textureLoaderRef.current = textureLoader;

    setIsLoadingTexture(true);
    const texture = textureLoader.load(
      currentPanoramaUrl,
      () => {
        setIsLoadingTexture(false);
      },
      undefined,
      () => {
        // Fallback gracefully
        setIsLoadingTexture(false);
      }
    );
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.FrontSide,
    });

    const sphereMesh = new THREE.Mesh(geometry, material);
    scene.add(sphereMesh);
    sphereMeshRef.current = sphereMesh;

    // 5. Ambient light & subtle tint
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    // 6. Resize Observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // 7. Render Loop with Smooth Damping Interpolation
    let animId: number;
    let frameCount = 0;

    const animate = () => {
      // Auto-rotation when not dragging
      if (isAutoRotating && !isDraggingRef.current) {
        targetLonRef.current += 0.08;
      }

      // Smooth damping interpolation for camera angles
      lonRef.current += (targetLonRef.current - lonRef.current) * 0.1;
      latRef.current += (targetLatRef.current - latRef.current) * 0.1;
      fovRef.current += (targetFovRef.current - fovRef.current) * 0.1;

      // Constrain latitude between -85 and 85 degrees
      latRef.current = Math.max(-85, Math.min(85, latRef.current));
      targetLatRef.current = Math.max(-85, Math.min(85, targetLatRef.current));

      // Constrain FOV between 30 (high zoom) and 95 (wide angle)
      fovRef.current = Math.max(30, Math.min(95, fovRef.current));
      targetFovRef.current = Math.max(30, Math.min(95, targetFovRef.current));

      camera.fov = fovRef.current;
      camera.updateProjectionMatrix();

      // Convert Lon/Lat to Cartesian coordinates on target vector
      const phi = THREE.MathUtils.degToRad(90 - latRef.current);
      const theta = THREE.MathUtils.degToRad(lonRef.current);

      const targetX = 500 * Math.sin(phi) * Math.cos(theta);
      const targetY = 500 * Math.cos(phi);
      const targetZ = 500 * Math.sin(phi) * Math.sin(theta);

      camera.lookAt(targetX, targetY, targetZ);
      renderer.render(scene, camera);

      // Throttled computation of projected 2D Hotspot screen positions
      frameCount++;
      if (frameCount % 2 === 0 && currentStation.hotspots) {
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        const camDir = new THREE.Vector3();
        camera.getWorldDirection(camDir);

        const updatedProjections = currentStation.hotspots.map((hotspot) => {
          const pos3D = getHotspot3DVector(hotspot.x, hotspot.y);
          const screenPos = pos3D.clone().project(camera);

          // Dot product to check if hotspot is in front of camera
          const dot = pos3D.clone().normalize().dot(camDir);
          const isFront = dot > 0.35 && screenPos.z < 1;

          const screenX = screenPos.x * halfWidth + halfWidth;
          const screenY = -screenPos.y * halfHeight + halfHeight;

          return {
            hotspot,
            screenX,
            screenY,
            visible: isFront && screenX >= -50 && screenX <= width + 50 && screenY >= -50 && screenY <= height + 50,
          };
        });

        setProjectedHotspots(updatedProjections);

        // Telemetry updates
        const headingDeg = Math.round(((lonRef.current % 360) + 360) % 360);
        setHudHeading(headingDeg);
        setHudPitch(Math.round(latRef.current));
        setCurrentZoomPercent(Math.round(((75 / fovRef.current) * 100)));
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, [currentStation.id]);

  // Handle Texture Update on station or lighting mode change
  useEffect(() => {
    if (!sphereMeshRef.current || !textureLoaderRef.current) return;
    setIsLoadingTexture(true);

    const texture = textureLoaderRef.current.load(
      currentPanoramaUrl,
      () => {
        setIsLoadingTexture(false);
      },
      undefined,
      () => {
        setIsLoadingTexture(false);
      }
    );
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;

    const mat = sphereMeshRef.current.material as THREE.MeshBasicMaterial;
    if (mat.map) mat.map.dispose();
    mat.map = texture;
    mat.needsUpdate = true;

    if (rendererRef.current) {
      rendererRef.current.toneMappingExposure =
        lightingMode === 'sunset' ? 1.15 : lightingMode === 'night' ? 0.8 : 1.0;
    }
  }, [currentPanoramaUrl, lightingMode]);

  // Mouse & Drag Handlers for 360 rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Left click only
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    setIsAutoRotating(false);
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    targetLonRef.current -= deltaX * 0.18;
    targetLatRef.current += deltaY * 0.18;

    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Mouse Wheel Zoom (FOV change)
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY * 0.04;
    targetFovRef.current = Math.max(30, Math.min(95, targetFovRef.current + zoomDelta));
  };

  // Touch handlers for Mobile 360 exploration & Pinch-to-Zoom
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsAutoRotating(false);
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      previousMousePositionRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    } else if (e.touches.length === 2) {
      isDraggingRef.current = false;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchDistanceRef.current = Math.sqrt(dx * dx + dy * dy);
    }
  };

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDraggingRef.current) {
      const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
      const deltaY = e.touches[0].clientY - previousMousePositionRef.current.y;

      targetLonRef.current -= deltaX * 0.22;
      targetLatRef.current += deltaY * 0.22;

      previousMousePositionRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    } else if (e.touches.length === 2 && touchDistanceRef.current !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const newDistance = Math.sqrt(dx * dx + dy * dy);
      const pinchDelta = (touchDistanceRef.current - newDistance) * 0.12;

      targetFovRef.current = Math.max(30, Math.min(95, targetFovRef.current + pinchDelta));
      touchDistanceRef.current = newDistance;
    }
  }, []);

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    touchDistanceRef.current = null;
  };

  // Reset View to Initial Angle
  const handleResetView = () => {
    targetLonRef.current = 180;
    targetLatRef.current = 0;
    targetFovRef.current = 75;
  };

  // Zoom In / Out Buttons
  const handleZoomIn = () => {
    targetFovRef.current = Math.max(30, targetFovRef.current - 12);
  };

  const handleZoomOut = () => {
    targetFovRef.current = Math.min(95, targetFovRef.current + 12);
  };

  return (
    <div
      id="office-360-viewport"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative h-full w-full select-none overflow-hidden bg-stone-950 cursor-grab active:cursor-grabbing"
    >
      {/* Dynamic Motion Blur / Cross-Dissolve Overlay Streaks */}
      <MotionBlurStreaks
        isTransitioning={isTransitioning || isLoadingTexture}
        direction={transitionDirection}
        transitionStyle={transitionStyle}
      />

      {/* 1. Three.js WebGL 360 Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 h-full w-full" />

      {/* 2. Loading Spinner Overlay */}
      {isLoadingTexture && (
        <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
          <div className="relative flex h-14 w-14 items-center justify-center">
            <span className="absolute inset-0 animate-ping rounded-full bg-amber-400/30 duration-1000" />
            <div className="h-10 w-10 animate-spin rounded-full border-3 border-amber-400/30 border-t-amber-400" />
          </div>
          <p className="mt-3 text-xs font-mono font-semibold tracking-wider text-amber-300">
            CARICAMENTO PANORAMA 360°...
          </p>
        </div>
      )}

      {/* 3. Interactive Floating Hotspots in 3D Space */}
      {showHotspots && (
        <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
          {projectedHotspots.map(({ hotspot, screenX, screenY, visible }) => {
            if (!visible) return null;

            return (
              <div
                key={`hotspot-360-${hotspot.id}`}
                style={{
                  transform: `translate3d(${screenX}px, ${screenY}px, 0)`,
                  left: 0,
                  top: 0,
                }}
                className="pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 group z-20"
              >
                {/* Clickable Pulse Hotspot Pin */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectHotspot(hotspot);
                  }}
                  className="relative flex h-12 w-12 items-center justify-center rounded-full border border-amber-400/60 bg-stone-900/90 shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-125 hover:border-amber-300 hover:bg-amber-400 hover:text-stone-950"
                  title={hotspot.title}
                >
                  <span className="absolute -inset-2 animate-ping rounded-full bg-amber-400/35 duration-1000" />
                  <span className="absolute -inset-3.5 animate-pulse rounded-full bg-amber-300/15" />
                  <span className="relative text-2xl transition-transform duration-300 group-hover:rotate-12">
                    {hotspot.emoji}
                  </span>
                </button>

                {/* Coordinate & Badge Label */}
                <div className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-1.5 opacity-80 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  <span className="font-mono text-[9px] font-semibold text-amber-300/95 bg-black/80 px-2 py-0.5 rounded-full border border-amber-400/40 shadow-sm">
                    {hotspot.badge || 'PUNTO 360°'}
                  </span>
                </div>

                {/* Rich Tooltip on Hover */}
                <div className="pointer-events-none absolute bottom-full left-1/2 mb-3 -translate-x-1/2 opacity-0 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 z-30">
                  <div className="flex flex-col items-center whitespace-nowrap rounded-xl border border-amber-400/40 bg-stone-900/95 px-3.5 py-2 text-xs text-white shadow-2xl backdrop-blur-md">
                    <div className="flex items-center gap-2 font-semibold text-amber-300">
                      <span className="text-base">{hotspot.emoji}</span>
                      <span className="tracking-wide">{hotspot.title}</span>
                    </div>
                    {hotspot.badge && (
                      <span className="mt-0.5 text-[10px] font-medium text-stone-300">
                        {hotspot.badge} • Clicca per scheda tecnica
                      </span>
                    )}
                    <div className="absolute -bottom-1 h-2 w-2 rotate-45 border-r border-b border-amber-400/40 bg-stone-900/95" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Quick Mode Switcher Pill (Top Center) */}
      <div className="absolute top-16 sm:top-20 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 rounded-full border border-white/20 bg-stone-950/85 p-1 backdrop-blur-xl shadow-2xl">
        {onToggle360Mode && (
          <button
            type="button"
            id="btn-switch-to-hd-photo"
            onClick={() => {
              audioSystem.playClick(650);
              onToggle360Mode();
            }}
            className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-stone-300 hover:text-white hover:bg-white/15 transition-all active:scale-95"
            title="Passa alla vista fotografica 4K ad alta risoluzione senza distorsione"
          >
            <span>📷</span>
            <span>Foto HD Naturale</span>
          </button>
        )}
        <div className="flex items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-stone-950 shadow-md">
          <span>🌐</span>
          <span>Panorama 360°</span>
        </div>
      </div>

      {/* 5. Top Right Real-Time 360° Compass & Telemetry */}
      <div className="pointer-events-none absolute top-16 sm:top-20 right-3 sm:right-6 z-20 flex flex-col items-end text-right">
        <div className="flex items-center gap-2 rounded-full border border-amber-400/30 bg-stone-950/80 px-3 py-1.5 backdrop-blur-md shadow-xl">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-amber-300 font-mono">
            360° VR SPHERE
          </span>
          <span className="h-3 w-[1px] bg-white/20" />
          <div className="flex items-center gap-1 font-mono text-[10px] sm:text-[11px] text-white">
            <Compass className="h-3 w-3 text-amber-400" />
            <span>{hudHeading}°</span>
            <span className="text-stone-400">/</span>
            <span>{hudPitch}°</span>
          </div>
        </div>
        <p className="mt-1 text-[9px] sm:text-[11px] text-stone-300 hidden xs:block font-medium">
          Trascina per guardare in ogni direzione • Rotellina per lo zoom
        </p>
      </div>

      {/* 5. 360 Floating Navigational Toolset (Bottom Right) */}
      <div className="absolute bottom-20 sm:bottom-24 right-3 sm:right-6 z-30 flex items-center gap-2 rounded-2xl border border-white/15 bg-stone-950/85 p-2 text-white shadow-2xl backdrop-blur-xl">
        {/* Auto-Rotation Toggle */}
        <button
          type="button"
          id="btn-360-toggle-autorotate"
          onClick={() => setIsAutoRotating(!isAutoRotating)}
          className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all ${
            isAutoRotating
              ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
              : 'bg-white/10 text-stone-300 hover:bg-white/20 hover:text-white'
          }`}
          title={isAutoRotating ? 'Pausa rotazione automatica' : 'Avvia rotazione automatica 360°'}
        >
          {isAutoRotating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
        </button>

        {/* Reset Camera View */}
        <button
          type="button"
          id="btn-360-reset-view"
          onClick={handleResetView}
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-stone-300 hover:bg-white/20 hover:text-white transition-colors"
          title="Ripristina Inquadratura Iniziale"
        >
          <RotateCcw className="h-4 w-4" />
        </button>

        {/* Zoom In */}
        <button
          type="button"
          id="btn-360-zoom-in"
          onClick={handleZoomIn}
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-stone-300 hover:bg-white/20 hover:text-white transition-colors"
          title="Zoom Avanti (+)"
        >
          <ZoomIn className="h-4 w-4" />
        </button>

        {/* Zoom Out */}
        <button
          type="button"
          id="btn-360-zoom-out"
          onClick={handleZoomOut}
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-stone-300 hover:bg-white/20 hover:text-white transition-colors"
          title="Zoom Indietro (-)"
        >
          <ZoomOut className="h-4 w-4" />
        </button>

        {/* Zoom level readout */}
        <span className="hidden sm:inline-block px-1.5 text-[11px] font-mono text-amber-300 font-semibold">
          {currentZoomPercent}%
        </span>

        {/* Transition FX Switcher */}
        {onSelectTransitionStyle && (
          <button
            type="button"
            onClick={() => {
              const styles: TransitionStyle[] = ['motion-blur', 'cross-dissolve', 'warp-zoom'];
              const nextIndex = (styles.indexOf(transitionStyle) + 1) % styles.length;
              onSelectTransitionStyle(styles[nextIndex]);
            }}
            className="flex items-center gap-1 rounded-xl bg-amber-500/15 border border-amber-400/30 px-2 py-1 text-[10px] font-mono font-bold text-amber-300 hover:bg-amber-500/25 transition-colors"
            title="Cambia Effetto Transizione Sfondo (Motion Blur / Cross Dissolve / Warp Zoom)"
          >
            <Sparkles className="h-3 w-3 text-amber-400" />
            <span className="capitalize hidden md:inline">{transitionStyle.replace('-', ' ')}</span>
          </button>
        )}
      </div>

      {/* 6. Subtle Vignette & Viewfinder Border for Cinematic Realism */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.6)_100%)]" />

      {/* Crosshair Center Anchor for VR orientation */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-25">
        <div className="relative h-6 w-6">
          <span className="absolute top-1/2 left-0 w-2 h-[1px] bg-white -translate-y-1/2" />
          <span className="absolute top-1/2 right-0 w-2 h-[1px] bg-white -translate-y-1/2" />
          <span className="absolute left-1/2 top-0 h-2 w-[1px] bg-white -translate-x-1/2" />
          <span className="absolute left-1/2 bottom-0 h-2 w-[1px] bg-white -translate-x-1/2" />
        </div>
      </div>
    </div>
  );
};

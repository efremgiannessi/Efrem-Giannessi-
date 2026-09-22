import React, { useState, useEffect, useRef } from 'react';
import { audioSystem } from '../utils/audioSynthesizer';
import {
  Volume2,
  VolumeX,
  FastForward,
  Cpu,
  Layers,
  Sparkles,
  Maximize2,
  Box,
  Building2,
  Globe2,
  Radio,
  Crosshair,
  Activity
} from 'lucide-react';

interface ActiveTheorySplashScreenProps {
  onComplete: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  baseAlpha: number;
  hue: number;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}

interface WarpLine {
  angle: number;
  dist: number;
  speed: number;
  length: number;
  color: string;
}

type HologramMode = 'hypercube' | 'tower' | 'dome';

const HOLOGRAM_MODES: { id: HologramMode; name: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'hypercube', name: 'TESSERATTO 4D', icon: Box },
  { id: 'tower', name: 'TORRE BIM 5D', icon: Building2 },
  { id: 'dome', name: 'CUPOLA GEODETICA', icon: Globe2 },
];

export const ActiveTheorySplashScreen: React.FC<ActiveTheorySplashScreenProps> = ({
  onComplete,
}) => {
  const [progress, setProgress] = useState<number>(0);
  const [stageText, setStageText] = useState<string>('INIZIALIZZAZIONE KERNEL BIM...');
  const [isWarpingOut, setIsWarpingOut] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(audioSystem.getMuted());
  const [hologramMode, setHologramMode] = useState<HologramMode>('hypercube');
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeFrequencyKey, setActiveFrequencyKey] = useState<string | null>(null);
  const [glitchActive, setGlitchActive] = useState<boolean>(false);
  const [dimensions, setDimensions] = useState<{ w: number; h: number }>({
    w: typeof window !== 'undefined' ? window.innerWidth : 1920,
    h: typeof window !== 'undefined' ? window.innerHeight : 1080,
  });

  // Decoded text effect state
  const [decodedFirst, setDecodedFirst] = useState<string>('EFREM');
  const [decodedLast, setDecodedLast] = useState<string>('GIANNESSI');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const shockwavesRef = useRef<Shockwave[]>([]);
  const warpLinesRef = useRef<WarpLine[]>([]);
  const hasTriggeredRumbleRef = useRef<boolean>(false);
  const lastMilestoneRef = useRef<number>(0);

  // Trigger Matrix glyph scramble
  const triggerMatrixScramble = () => {
    const chars = '01ABCDEFΩΣΔΨ789X#*/><{}';
    const targetFirst = 'EFREM';
    const targetLast = 'GIANNESSI';
    let step = 0;

    const interval = setInterval(() => {
      step++;
      setDecodedFirst(
        targetFirst
          .split('')
          .map((ch, idx) =>
            idx < step / 2 ? ch : chars[Math.floor(Math.random() * chars.length)]
          )
          .join('')
      );
      setDecodedLast(
        targetLast
          .split('')
          .map((ch, idx) =>
            idx < step / 2 ? ch : chars[Math.floor(Math.random() * chars.length)]
          )
          .join('')
      );

      if (step >= 24) {
        setDecodedFirst(targetFirst);
        setDecodedLast(targetLast);
        clearInterval(interval);
      }
    }, 45);
  };

  // Initialize particles & audio on mount
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        w: window.innerWidth,
        h: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);

    // Initial mouse center position
    setMousePos({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

    // Create 100 floating architectural cybernetic particles
    const pts: Particle[] = [];
    for (let i = 0; i < 110; i++) {
      pts.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.9,
        vy: (Math.random() - 0.5) * 0.9,
        size: Math.random() * 2.5 + 0.8,
        alpha: Math.random() * 0.7 + 0.3,
        baseAlpha: Math.random() * 0.6 + 0.2,
        hue: Math.random() > 0.25 ? 186 : 38, // Cyan and Gold highlights
      });
    }
    particlesRef.current = pts;

    // Create 120 radial Warp Lines for hyperspace exit
    const wLines: WarpLine[] = [];
    for (let i = 0; i < 130; i++) {
      wLines.push({
        angle: Math.random() * Math.PI * 2,
        dist: Math.random() * 200 + 40,
        speed: Math.random() * 8 + 6,
        length: Math.random() * 60 + 20,
        color: Math.random() > 0.3 ? '#00f0ff' : '#ffffff',
      });
    }
    warpLinesRef.current = wLines;

    // Trigger initial cinematic rumble audio
    const timer = setTimeout(() => {
      if (!hasTriggeredRumbleRef.current) {
        hasTriggeredRumbleRef.current = true;
        audioSystem.playIntroRumble();
      }
    }, 200);

    // Trigger initial Matrix title decoder
    triggerMatrixScramble();

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  // Smooth Progress & Staged Boot Sequence
  useEffect(() => {
    let currentPct = 0;
    const interval = setInterval(() => {
      const increment =
        currentPct < 25 ? 1.8 : currentPct < 65 ? 2.3 : currentPct < 85 ? 1.4 : 0.9;
      currentPct = Math.min(100, currentPct + increment);
      setProgress(Math.round(currentPct));

      if (currentPct >= 25 && lastMilestoneRef.current < 25) {
        lastMilestoneRef.current = 25;
        audioSystem.playBootBeep(1200);
        setStageText('CARICAMENTO 18 THEMI LIQUIDI & SHADER GLSL...');
      } else if (currentPct >= 50 && lastMilestoneRef.current < 50) {
        lastMilestoneRef.current = 50;
        audioSystem.playBootBeep(1600);
        audioSystem.playLaserScan();
        setStageText('SINCRONIZZAZIONE BIM 5D / ISO 19650 COMPUTATIONAL MODELS...');
      } else if (currentPct >= 75 && lastMilestoneRef.current < 75) {
        lastMilestoneRef.current = 75;
        audioSystem.playBootBeep(2100);
        setStageText('CALIBRAZIONE TERRENO DINAMICO & ARCHIVIO PROGETTI...');
      } else if (currentPct >= 100 && lastMilestoneRef.current < 100) {
        lastMilestoneRef.current = 100;
        audioSystem.playChime();
        setStageText('SISTEMA ATTIVO // PRONTO PER L\'ESPLORAZIONE');
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval);
  }, []);

  // Spawn Shockwave on click
  const spawnShockwave = (x: number, y: number) => {
    audioSystem.playShockwave();
    shockwavesRef.current.push({
      x,
      y,
      radius: 10,
      maxRadius: Math.max(dimensions.w, dimensions.h) * 0.55,
      alpha: 0.9,
      color: Math.random() > 0.3 ? '#00f0ff' : '#fbbf24',
    });

    // Particle impulse repulsion
    particlesRef.current.forEach((pt) => {
      const dx = pt.x - x;
      const dy = pt.y - y;
      const dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));
      if (dist < 260) {
        const force = (260 - dist) / 260;
        pt.vx += (dx / dist) * force * 12;
        pt.vy += (dy / dist) * force * 12;
      }
    });
  };

  // Canvas Rendering Loop with Multiple 3D Holograms, Equalizer, LiDAR reticle, and Warp Lines
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const render = () => {
      time += 0.016;
      ctx.clearRect(0, 0, dimensions.w, dimensions.h);

      const centerX = dimensions.w / 2;
      const centerY = dimensions.h / 2;

      // 1. Perspective Cybernetic Grid Horizon
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.06)';
      ctx.lineWidth = 1;
      const floorY = centerY + 180;
      for (let x = -dimensions.w; x < dimensions.w * 2; x += 110) {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - 60);
        ctx.lineTo(x, dimensions.h);
        ctx.stroke();
      }
      for (let y = floorY; y < dimensions.h; y += 38) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(dimensions.w, y);
        ctx.stroke();
      }
      ctx.restore();

      // 2. Audio-Visualizer Radial Frequency Spectrum Ring around Hologram
      ctx.save();
      ctx.translate(centerX, centerY - 20);
      const eqBarsCount = 48;
      const baseRadius = 220;
      for (let i = 0; i < eqBarsCount; i++) {
        const angle = (i / eqBarsCount) * Math.PI * 2;
        // Harmonic acoustic bar heights based on math oscillation
        const barHeight =
          12 +
          Math.sin(time * 4 + i * 0.4) * 14 +
          Math.cos(time * 2.5 + i * 0.8) * 10;
        const innerX = Math.cos(angle) * baseRadius;
        const innerY = Math.sin(angle) * baseRadius;
        const outerX = Math.cos(angle) * (baseRadius + Math.max(3, barHeight));
        const outerY = Math.sin(angle) * (baseRadius + Math.max(3, barHeight));

        ctx.beginPath();
        ctx.strokeStyle =
          i % 4 === 0
            ? 'rgba(251, 191, 36, 0.6)'
            : 'rgba(0, 240, 255, 0.4)';
        ctx.lineWidth = 2;
        ctx.moveTo(innerX, innerY);
        ctx.lineTo(outerX, outerY);
        ctx.stroke();

        // Tip glowing dot
        ctx.beginPath();
        ctx.fillStyle = i % 4 === 0 ? '#fbbf24' : '#00f0ff';
        ctx.arc(outerX, outerY, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 3. Central 3D Interactive Morphing Hologram
      ctx.save();
      ctx.translate(centerX, centerY - 20);

      const mx = (mousePos.x - centerX) / dimensions.w;
      const my = (mousePos.y - centerY) / dimensions.h;
      const rotY = time * 0.6 + mx * 1.6;
      const rotX = Math.sin(time * 0.4) * 0.3 + my * 1.3;

      // Projector function
      const projectPoint = (v: { x: number; y: number; z: number }) => {
        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);
        const x1 = v.x * cosY + v.z * sinY;
        const z1 = -v.x * sinY + v.z * cosY;

        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);
        const y2 = v.y * cosX - z1 * sinX;
        const z2 = v.y * sinX + z1 * cosX;

        const fov = 500;
        const scale = fov / (fov + z2 + 320);
        return { x: x1 * scale, y: y2 * scale, scale, z: z2 };
      };

      if (hologramMode === 'hypercube') {
        // Mode 1: 4D Nested Tesseract
        const sizeOuter = isWarpingOut ? 160 + time * 650 : 135 + Math.sin(time * 2) * 6;
        const sizeInner = sizeOuter * 0.52;

        const outerVerts = [
          { x: -sizeOuter, y: -sizeOuter, z: -sizeOuter },
          { x: sizeOuter, y: -sizeOuter, z: -sizeOuter },
          { x: sizeOuter, y: sizeOuter, z: -sizeOuter },
          { x: -sizeOuter, y: sizeOuter, z: -sizeOuter },
          { x: -sizeOuter, y: -sizeOuter, z: sizeOuter },
          { x: sizeOuter, y: -sizeOuter, z: sizeOuter },
          { x: sizeOuter, y: sizeOuter, z: sizeOuter },
          { x: -sizeOuter, y: sizeOuter, z: sizeOuter },
        ];

        const innerVerts = [
          { x: -sizeInner, y: -sizeInner, z: -sizeInner },
          { x: sizeInner, y: -sizeInner, z: -sizeInner },
          { x: sizeInner, y: sizeInner, z: -sizeInner },
          { x: -sizeInner, y: sizeInner, z: -sizeInner },
          { x: -sizeInner, y: -sizeInner, z: sizeInner },
          { x: sizeInner, y: -sizeInner, z: sizeInner },
          { x: sizeInner, y: sizeInner, z: sizeInner },
          { x: -sizeInner, y: sizeInner, z: sizeInner },
        ];

        const projOuter = outerVerts.map(projectPoint);
        const projInner = innerVerts.map(projectPoint);

        const cubeEdges = [
          [0, 1], [1, 2], [2, 3], [3, 0],
          [4, 5], [5, 6], [6, 7], [7, 4],
          [0, 4], [1, 5], [2, 6], [3, 7],
        ];

        // Draw Outer Cube
        cubeEdges.forEach(([i1, i2]) => {
          const p1 = projOuter[i1];
          const p2 = projOuter[i2];
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 240, 255, ${isWarpingOut ? 0.9 : 0.65})`;
          ctx.lineWidth = isWarpingOut ? 3.5 : 1.5;
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        });

        // Draw Inner Cube
        cubeEdges.forEach(([i1, i2]) => {
          const p1 = projInner[i1];
          const p2 = projInner[i2];
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(251, 191, 36, 0.7)';
          ctx.lineWidth = 1.2;
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        });

        // Connect 4D hyper-edges (outer to inner)
        for (let i = 0; i < 8; i++) {
          const p1 = projOuter[i];
          const p2 = projInner[i];
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
          ctx.setLineDash([3, 4]);
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Draw Nodes
        projOuter.concat(projInner).forEach((p, idx) => {
          ctx.beginPath();
          ctx.fillStyle = idx < 8 ? '#00f0ff' : '#fbbf24';
          ctx.shadowColor = '#00f0ff';
          ctx.shadowBlur = 10;
          ctx.arc(p.x, p.y, 3 * p.scale, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      } else if (hologramMode === 'tower') {
        // Mode 2: Parametric Architectural BIM Skyscraper Tower
        const floorCount = 5;
        const towerHeight = 220;
        const towerWidth = 90;

        for (let fl = 0; fl < floorCount; fl++) {
          const y = -towerHeight / 2 + (fl / (floorCount - 1)) * towerHeight;
          const w = towerWidth * (1 - fl * 0.12);
          const slabVerts = [
            { x: -w, y, z: -w },
            { x: w, y, z: -w },
            { x: w, y, z: w },
            { x: -w, y, z: w },
          ];
          const projSlab = slabVerts.map(projectPoint);

          ctx.beginPath();
          ctx.strokeStyle = fl === floorCount - 1 ? '#fbbf24' : 'rgba(0, 240, 255, 0.7)';
          ctx.lineWidth = 1.5;
          ctx.moveTo(projSlab[0].x, projSlab[0].y);
          for (let i = 1; i < 4; i++) ctx.lineTo(projSlab[i].x, projSlab[i].y);
          ctx.closePath();
          ctx.stroke();

          // Nodes
          projSlab.forEach((p) => {
            ctx.beginPath();
            ctx.fillStyle = '#00f0ff';
            ctx.arc(p.x, p.y, 2.5 * p.scale, 0, Math.PI * 2);
            ctx.fill();
          });
        }

        // Vertical corner structural columns
        const bottomY = towerHeight / 2;
        const topY = -towerHeight / 2;
        const colPoints = [
          [-towerWidth, -towerWidth],
          [towerWidth, -towerWidth],
          [towerWidth, towerWidth],
          [-towerWidth, towerWidth],
        ];

        colPoints.forEach(([cx, cz], idx) => {
          const topW = 1 - 4 * 0.12;
          const pBot = projectPoint({ x: cx, y: bottomY, z: cz });
          const pTop = projectPoint({ x: cx * topW, y: topY, z: cz * topW });

          ctx.beginPath();
          ctx.strokeStyle = 'rgba(0, 240, 255, 0.45)';
          ctx.lineWidth = 1.5;
          ctx.moveTo(pBot.x, pBot.y);
          ctx.lineTo(pTop.x, pTop.y);
          ctx.stroke();
        });

        // Architectural spire antenna
        const spireBase = projectPoint({ x: 0, y: topY, z: 0 });
        const spireTip = projectPoint({ x: 0, y: topY - 70, z: 0 });
        ctx.beginPath();
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.moveTo(spireBase.x, spireBase.y);
        ctx.lineTo(spireTip.x, spireTip.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = '#fbbf24';
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 12;
        ctx.arc(spireTip.x, spireTip.y, 4 * spireTip.scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      } else {
        // Mode 3: Geodesic Dome Network
        const radius = 130;
        const latitudeBands = 4;
        const longitudePoints = 8;
        const domeVerts: { x: number; y: number; z: number }[] = [];

        for (let lat = 0; lat <= latitudeBands; lat++) {
          const theta = (lat / latitudeBands) * (Math.PI / 2);
          const y = -Math.cos(theta) * radius + 50;
          const r = Math.sin(theta) * radius;

          for (let lon = 0; lon < longitudePoints; lon++) {
            const phi = (lon / longitudePoints) * Math.PI * 2;
            const x = Math.cos(phi) * r;
            const z = Math.sin(phi) * r;
            domeVerts.push({ x, y, z });
          }
        }

        const projDome = domeVerts.map(projectPoint);

        // Connect longitude & latitude struts
        for (let lat = 0; lat < latitudeBands; lat++) {
          for (let lon = 0; lon < longitudePoints; lon++) {
            const curr = lat * longitudePoints + lon;
            const nextLon = lat * longitudePoints + ((lon + 1) % longitudePoints);
            const nextLat = (lat + 1) * longitudePoints + lon;

            const p1 = projDome[curr];
            const p2 = projDome[nextLon];
            const p3 = projDome[nextLat];

            ctx.beginPath();
            ctx.strokeStyle = 'rgba(0, 240, 255, 0.5)';
            ctx.lineWidth = 1.2;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p3.x, p3.y);
            ctx.stroke();
          }
        }

        projDome.forEach((p, idx) => {
          ctx.beginPath();
          ctx.fillStyle = idx % 2 === 0 ? '#00f0ff' : '#fbbf24';
          ctx.arc(p.x, p.y, 2.5 * p.scale, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      ctx.restore();

      // 4. Moving Kinetic Laser Scanline
      const scanY = (time * 180) % dimensions.h;
      ctx.save();
      const laserGrad = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 10);
      laserGrad.addColorStop(0, 'rgba(0, 240, 255, 0)');
      laserGrad.addColorStop(0.7, 'rgba(0, 240, 255, 0.18)');
      laserGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');
      ctx.fillStyle = laserGrad;
      ctx.fillRect(0, scanY - 30, dimensions.w, 40);

      ctx.strokeStyle = 'rgba(0, 240, 255, 0.45)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(dimensions.w, scanY);
      ctx.stroke();
      ctx.restore();

      // 5. Interactive Shockwaves
      for (let sIdx = shockwavesRef.current.length - 1; sIdx >= 0; sIdx--) {
        const sw = shockwavesRef.current[sIdx];
        sw.radius += 18;
        sw.alpha *= 0.94;

        ctx.save();
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = sw.color;
        ctx.globalAlpha = Math.max(0, sw.alpha);
        ctx.lineWidth = 2.5;
        ctx.shadowColor = sw.color;
        ctx.shadowBlur = 16;
        ctx.stroke();
        ctx.restore();

        if (sw.radius >= sw.maxRadius || sw.alpha <= 0.02) {
          shockwavesRef.current.splice(sIdx, 1);
        }
      }

      // 6. Constellation Ambient Particles with Drag Deceleration
      particlesRef.current.forEach((pt) => {
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.vx *= 0.985;
        pt.vy *= 0.985;

        // Soft bounce / wrap
        if (pt.x < 0) pt.x = dimensions.w;
        if (pt.x > dimensions.w) pt.x = 0;
        if (pt.y < 0) pt.y = dimensions.h;
        if (pt.y > dimensions.h) pt.y = 0;

        ctx.beginPath();
        ctx.fillStyle = `hsla(${pt.hue}, 90%, 65%, ${pt.alpha})`;
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 7. Interactive LiDAR Target Reticle tracking Mouse
      ctx.save();
      const reticleAngle = time * 2;
      const rSize = 22;

      ctx.translate(mousePos.x, mousePos.y);

      // Rotating dashed ring
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.6)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.arc(0, 0, rSize, reticleAngle, reticleAngle + Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Center crosshair
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.8)';
      ctx.moveTo(-7, 0);
      ctx.lineTo(7, 0);
      ctx.moveTo(0, -7);
      ctx.lineTo(0, 7);
      ctx.stroke();

      // Precision coordinates tag beside cursor
      ctx.font = '9px monospace';
      ctx.fillStyle = 'rgba(0, 240, 255, 0.8)';
      const distFromCenter = Math.hypot(mousePos.x - centerX, mousePos.y - centerY);
      ctx.fillText(
        `X:${Math.round(mousePos.x)} Y:${Math.round(mousePos.y)} | ${(distFromCenter * 0.04).toFixed(1)}m`,
        rSize + 8,
        4
      );

      ctx.restore();

      // 8. Hyperspace Warp Lines during Exit
      if (isWarpingOut) {
        ctx.save();
        ctx.translate(centerX, centerY - 20);

        warpLinesRef.current.forEach((wl) => {
          wl.dist += wl.speed * 2.5;
          wl.speed *= 1.08;
          wl.length += 3;

          const x1 = Math.cos(wl.angle) * wl.dist;
          const y1 = Math.sin(wl.angle) * wl.dist;
          const x2 = Math.cos(wl.angle) * (wl.dist + wl.length);
          const y2 = Math.sin(wl.angle) * (wl.dist + wl.length);

          ctx.beginPath();
          ctx.strokeStyle = wl.color;
          ctx.lineWidth = 2.5;
          ctx.shadowColor = '#00f0ff';
          ctx.shadowBlur = 14;
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        });

        // Flash of central light
        const flashGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 420);
        flashGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
        flashGrad.addColorStop(0.3, 'rgba(0, 240, 255, 0.6)');
        flashGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');
        ctx.fillStyle = flashGrad;
        ctx.beginPath();
        ctx.arc(0, 0, 420, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [dimensions, mousePos, isWarpingOut, hologramMode]);

  // Track mouse coordinates for 3D parallax
  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  // Canvas Click spawns Shockwave
  const handleCanvasClick = (e: React.MouseEvent) => {
    spawnShockwave(e.clientX, e.clientY);
  };

  // Launch Warp-Out & Enter Experience
  const handleEnterExperience = () => {
    if (isWarpingOut) return;
    setIsWarpingOut(true);
    audioSystem.playWarpOut();

    setTimeout(() => {
      onComplete();
    }, 950);
  };

  // Toggle audio
  const handleToggleAudio = () => {
    const next = audioSystem.toggleMute();
    setIsAudioMuted(next);
  };

  // Interactive Frequency Key Press
  const handleFrequencyKey = (key: string, freq: number) => {
    setActiveFrequencyKey(key);
    audioSystem.playTelemetryArp(freq);
    setTimeout(() => setActiveFrequencyKey(null), 350);
  };

  return (
    <div
      id="active-theory-splash-screen"
      onMouseMove={handleMouseMove}
      onClick={handleCanvasClick}
      className={`fixed inset-0 z-[9999] bg-stone-950 text-white overflow-hidden select-none transition-all duration-1000 ${
        isWarpingOut
          ? 'scale-110 opacity-0 pointer-events-none filter blur-sm'
          : 'scale-100 opacity-100'
      }`}
    >
      {/* Dynamic Interactive WebGL/Canvas Animation Layer */}
      <canvas
        ref={canvasRef}
        width={dimensions.w}
        height={dimensions.h}
        className="absolute inset-0 w-full h-full block pointer-events-none"
      />

      {/* Futuristic CRT / Scanline CRT texture */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.35)_50%)] bg-[length:100%_4px] pointer-events-none z-10 opacity-30" />

      {/* Cybernetic Ambient Vignette */}
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none z-10 opacity-70" />

      {/* 4 Corner Sci-Fi Target Reticles */}
      <div className="absolute top-6 left-6 z-20 font-mono text-[10px] text-cyan-400/80 flex items-center gap-2 pointer-events-none">
        <span className="w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-400 inline-block" />
        <span className="tracking-widest">SYS_COORD // LAT: 43.7696° N · LON: 11.2558° E [FIRENZE]</span>
      </div>

      <div className="absolute top-6 right-6 z-20 font-mono text-[10px] text-cyan-400/80 flex items-center gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleToggleAudio();
          }}
          className="px-2.5 py-1 border border-white/20 hover:border-cyan-400 bg-stone-900/80 text-white hover:text-cyan-300 flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_0_8px_rgba(0,0,0,0.6)]"
          title="Attiva / Disattiva Audio Procedurale"
        >
          {isAudioMuted ? (
            <>
              <VolumeX className="w-3.5 h-3.5 text-stone-400" />
              <span>AUDIO: MUTO</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span className="text-cyan-300">AUDIO: ATTIVO</span>
            </>
          )}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleEnterExperience();
          }}
          className="px-3 py-1 border border-cyan-400/50 hover:border-cyan-400 bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 font-mono text-[10px] uppercase tracking-widest flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.2)]"
        >
          <span>SALTA INTRO</span>
          <FastForward className="w-3 h-3" />
        </button>
        <span className="w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-400 inline-block" />
      </div>

      <div className="absolute bottom-6 left-6 z-20 font-mono text-[10px] text-white/40 flex items-center gap-2 pointer-events-none">
        <span className="w-2.5 h-2.5 border-b-2 border-l-2 border-cyan-400 inline-block" />
        <span>BIM PROTOCOL: ISO 19650 / UNI 11337 · LOD 500</span>
      </div>

      <div className="absolute bottom-6 right-6 z-20 font-mono text-[10px] text-white/40 flex items-center gap-2 pointer-events-none">
        <span>ACTIVE THEORY ARCHITECTURAL ENGINE v3.4</span>
        <span className="w-2.5 h-2.5 border-b-2 border-r-2 border-cyan-400 inline-block" />
      </div>

      {/* Floating Hologram Mode Switcher (Tesseratto 4D / Torre BIM / Cupola) */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-stone-950/80 border border-white/15 p-1 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.8)]">
        {HOLOGRAM_MODES.map((m) => {
          const Icon = m.icon;
          const isActive = hologramMode === m.id;
          return (
            <button
              key={m.id}
              onClick={(e) => {
                e.stopPropagation();
                audioSystem.playClick(600);
                setHologramMode(m.id);
              }}
              onMouseEnter={() => audioSystem.playTechHover()}
              className={`px-2.5 py-1 flex items-center gap-1.5 font-mono text-[10px] tracking-wider transition-all cursor-pointer ${
                isActive
                  ? 'bg-cyan-400 text-stone-950 font-bold shadow-[0_0_12px_rgba(0,240,255,0.5)]'
                  : 'text-stone-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{m.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Monumental Centerpiece */}
      <div className="relative z-30 h-full flex flex-col items-center justify-between py-12 px-6 text-center pointer-events-auto">
        {/* Top Header Identity */}
        <div className="mt-14 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-950/40 border border-cyan-400/40 font-mono text-[10px] tracking-widest text-cyan-300 uppercase mb-3 shadow-[0_0_20px_rgba(0,240,255,0.25)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>KINETIC 3D ARCHITECTURAL COMPUTING</span>
          </div>
          <h2 className="text-xs md:text-sm font-mono tracking-[0.35em] text-white/70 uppercase">
            BIM SPECIALIST · COMPUTATIONAL DESIGN · 3D VISUALIZATION
          </h2>
        </div>

        {/* Center Name & Monumental Typography */}
        <div className="my-auto flex flex-col items-center">
          {/* Decorative Top Horizontal HUD Line */}
          <div className="flex items-center gap-4 mb-4 text-cyan-400/70 font-mono text-xs">
            <div className="w-16 md:w-32 h-[1px] bg-gradient-to-r from-transparent to-cyan-400" />
            <div className="flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 animate-spin" />
              <span className="tracking-widest">AUTODESK REVIT & PYTHON ARCHITECTURE</span>
            </div>
            <div className="w-16 md:w-32 h-[1px] bg-gradient-to-l from-transparent to-cyan-400" />
          </div>

          {/* Matrix Glitch Decrypted Title */}
          <h1
            onMouseEnter={() => {
              triggerMatrixScramble();
              audioSystem.playGlitch();
            }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter text-white font-mono drop-shadow-[0_0_45px_rgba(0,240,255,0.45)] relative cursor-crosshair group"
            title="Clicca o passa sopra per decodificare"
          >
            <span className="relative inline-block group-hover:scale-[1.02] transition-transform">
              {decodedFirst}
            </span>{' '}
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-cyan-400 group-hover:scale-[1.02] transition-transform">
              {decodedLast}
            </span>
          </h1>

          <div className="mt-5 max-w-xl text-stone-300 text-xs sm:text-sm font-sans tracking-wide leading-relaxed">
            Metamorfosi tridimensionale interattiva · 18 temi procedurali in tempo reale · Scripting pyRevit avanzato e computi parametrici BIM 5D.
          </div>

          {/* 3 Interactive Telemetry Frequency Chips */}
          <div className="mt-5 flex items-center justify-center gap-2 font-mono text-[10px]">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleFrequencyKey('revit', 523.25);
              }}
              onMouseEnter={() => audioSystem.playTechHover()}
              className={`px-2.5 py-1 border transition-all cursor-pointer ${
                activeFrequencyKey === 'revit'
                  ? 'bg-cyan-400 text-stone-950 font-bold border-cyan-400'
                  : 'bg-stone-900/90 border-white/20 text-cyan-300 hover:border-cyan-400'
              }`}
            >
              <Radio className="w-3 h-3 inline mr-1" />
              <span>BIM // 4.2 kHz</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleFrequencyKey('python', 659.25);
              }}
              onMouseEnter={() => audioSystem.playTechHover()}
              className={`px-2.5 py-1 border transition-all cursor-pointer ${
                activeFrequencyKey === 'python'
                  ? 'bg-amber-400 text-stone-950 font-bold border-amber-400'
                  : 'bg-stone-900/90 border-white/20 text-amber-300 hover:border-amber-400'
              }`}
            >
              <Activity className="w-3 h-3 inline mr-1" />
              <span>PYTHON // 6.8 kHz</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleFrequencyKey('lidar', 880.0);
              }}
              onMouseEnter={() => audioSystem.playTechHover()}
              className={`px-2.5 py-1 border transition-all cursor-pointer ${
                activeFrequencyKey === 'lidar'
                  ? 'bg-cyan-400 text-stone-950 font-bold border-cyan-400'
                  : 'bg-stone-900/90 border-white/20 text-cyan-300 hover:border-cyan-400'
              }`}
            >
              <Crosshair className="w-3 h-3 inline mr-1" />
              <span>LiDAR // 9.4 kHz</span>
            </button>
          </div>

          {/* Interactive Enter / Launch Button or Progress Indicator */}
          <div className="mt-8 flex flex-col items-center gap-4">
            {progress >= 100 ? (
              <button
                id="btn-enter-portfolio"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEnterExperience();
                }}
                className="group relative px-10 py-4 bg-cyan-400 hover:bg-cyan-300 text-stone-950 font-mono font-black text-sm uppercase tracking-[0.25em] flex items-center gap-3 transition-all duration-300 shadow-[0_0_40px_rgba(0,240,255,0.7)] hover:shadow-[0_0_60px_rgba(0,240,255,0.9)] cursor-pointer hover:scale-105 active:scale-95"
              >
                {/* Corner decorative notch borders */}
                <span className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-white" />
                <span className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-white" />
                <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-white" />
                <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-white" />

                <Sparkles className="w-5 h-5 text-stone-950 group-hover:rotate-45 transition-transform" />
                <span>INIZIALIZZA ESPERIENZA // ENTRA NEL SITO</span>
                <Maximize2 className="w-4 h-4 ml-1" />
              </button>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-3 font-mono text-cyan-400 text-xs uppercase tracking-widest">
                  <span className="w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  <span>CARICAMENTO RISORSE GRAFICHE // {progress}%</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Progress Bar & Telemetry Diagnostics */}
        <div className="w-full max-w-2xl mb-2">
          {/* Progress Bar Container */}
          <div className="w-full bg-stone-900/90 border border-white/15 h-3 p-0.5 relative overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.8)]">
            <div
              className="h-full bg-gradient-to-r from-cyan-600 via-cyan-400 to-amber-300 transition-all duration-150 relative"
              style={{ width: `${progress}%` }}
            >
              {/* Highlight leading tip */}
              <div className="absolute right-0 top-0 bottom-0 w-2 bg-white shadow-[0_0_10px_#fff]" />
            </div>
          </div>

          {/* Staged Diagnostics Text */}
          <div className="flex items-center justify-between mt-2.5 font-mono text-[10px] text-white/60">
            <div className="flex items-center gap-2 text-cyan-400">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="tracking-wider">{stageText}</span>
            </div>
            <div className="font-bold text-white tracking-widest">{progress}% COMPLETO</div>
          </div>
        </div>
      </div>
    </div>
  );
};

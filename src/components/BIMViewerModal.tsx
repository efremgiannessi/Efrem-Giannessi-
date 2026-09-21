import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  X,
  RotateCcw,
  Box,
  Layers,
  Eye,
  Maximize2,
  Info,
  CheckCircle2,
  ChevronRight,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { audioSystem } from '../utils/audioSynthesizer';

export interface BIMElementProperty {
  id: string;
  name: string;
  category: string;
  lod: string;
  material: string;
  dimensions: string;
  volumeM3: number;
  costEstimateEur: number;
  transmittanceU?: string;
  wbsCode: string;
}

const SAMPLE_BIM_ELEMENTS: Record<string, BIMElementProperty> = {
  slab_ground: {
    id: 'IFCSLAB_001',
    name: 'Platea di Fondazione & Sottofondo Coibentato',
    category: 'IfcSlab (Fondazione)',
    lod: 'LOD 400',
    material: 'Calcestruzzo Armato C28/35 + EPS 12cm',
    dimensions: '14.00 x 9.00 x 0.40 m',
    volumeM3: 50.4,
    costEstimateEur: 16800,
    transmittanceU: '0.18 W/m²K',
    wbsCode: 'WBS 01.02.01',
  },
  walls_perimeter: {
    id: 'IFCWALL_EXT_002',
    name: 'Parete Perimetrale Parametrica Multistrato',
    category: 'IfcWallStandardCase',
    lod: 'LOD 350',
    material: 'Laterizio Porizzato 30cm + Lana di Roccia 14cm + Finitura Silossanica',
    dimensions: 'H: 3.30m, Spessore: 46cm',
    volumeM3: 38.2,
    costEstimateEur: 22400,
    transmittanceU: '0.14 W/m²K',
    wbsCode: 'WBS 02.01.03',
  },
  columns_structure: {
    id: 'IFCCOLUMN_003',
    name: 'Pilastri Strutturali Portanti C.A.',
    category: 'IfcColumn',
    lod: 'LOD 400',
    material: 'Calcestruzzo C32/40 con gabbie acciaio B450C',
    dimensions: '6x Sezione 35x35 cm, H: 3.30m',
    volumeM3: 2.42,
    costEstimateEur: 3850,
    wbsCode: 'WBS 01.03.02',
  },
  beams_first_floor: {
    id: 'IFCBEAM_004',
    name: 'Travi Ribassate & Rompitratta 5D',
    category: 'IfcBeam',
    lod: 'LOD 350',
    material: 'Calcestruzzo Armato ad alta prestazione',
    dimensions: 'L: 14.00m, Sezione 30x50 cm',
    volumeM3: 4.2,
    costEstimateEur: 4900,
    wbsCode: 'WBS 01.04.01',
  },
  curtain_wall: {
    id: 'IFCWINDOW_CURTAIN_005',
    name: 'Facciata Continua Vetrata Schüco FWS 50',
    category: 'IfcCurtainWall',
    lod: 'LOD 400',
    material: 'Alluminio a Taglio Termico + Vetro Triplo Basso Emissivo 44.2/16/4/16/44.2',
    dimensions: 'L: 6.80m, H: 3.00m',
    volumeM3: 1.15,
    costEstimateEur: 14200,
    transmittanceU: '0.78 W/m²K',
    wbsCode: 'WBS 03.02.04',
  },
  roof_slab: {
    id: 'IFCROOF_006',
    name: 'Solaio di Copertura Piana Coibentata & Verde Estensivo',
    category: 'IfcRoof',
    lod: 'LOD 400',
    material: 'Solaio Latero-Cemento + Barriera Vapore + PIR 16cm + Manto EPDM',
    dimensions: '14.00 x 9.00 x 0.32 m',
    volumeM3: 40.32,
    costEstimateEur: 18900,
    transmittanceU: '0.12 W/m²K',
    wbsCode: 'WBS 02.04.02',
  },
};

interface BIMViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  stationName: string;
}

export const BIMViewerModal: React.FC<BIMViewerModalProps> = ({
  isOpen,
  onClose,
  stationName,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedElementKey, setSelectedElementKey] = useState<string>('walls_perimeter');
  const [activeTab, setActiveTab] = useState<'model' | 'properties' | 'qto'>('model');
  const [displayMode, setDisplayMode] = useState<'shaded' | 'wireframe' | 'xray'>('shaded');
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [sectionCut, setSectionCut] = useState<boolean>(false);

  // References to three.js objects for dynamic updates
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const meshesMapRef = useRef<Record<string, THREE.Mesh>>({});
  const sectionClipPlaneRef = useRef<THREE.Plane | null>(null);

  useEffect(() => {
    if (!isOpen || !mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0f1115);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    cameraRef.current = camera;
    camera.position.set(16, 12, 18);
    camera.lookAt(0, 2, 0);

    // 3. Renderer with local clipping enabled
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.localClippingEnabled = true;
    renderer.shadowMap.enabled = true;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lighting setup (Architectural Studio Lighting)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xfff4e5, 1.4);
    dirLight1.position.set(15, 25, 15);
    dirLight1.castShadow = true;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x90b0e0, 0.7);
    dirLight2.position.set(-15, 10, -10);
    scene.add(dirLight2);

    // 5. Grid Helper & Origin Axes
    const grid = new THREE.GridHelper(26, 26, 0xf59e0b, 0x27272a);
    grid.position.y = -0.01;
    scene.add(grid);

    // 6. Section Clipping Plane
    const clipPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 3.5);
    sectionClipPlaneRef.current = clipPlane;

    // 7. Parametric Architectural BIM Meshes
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const meshes: Record<string, THREE.Mesh> = {};

    // Foundation Slab
    const slabGeo = new THREE.BoxGeometry(14, 0.4, 9);
    const slabMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.8,
      metalness: 0.1,
    });
    const slabMesh = new THREE.Mesh(slabGeo, slabMat);
    slabMesh.position.set(0, 0.2, 0);
    slabMesh.userData = { key: 'slab_ground' };
    rootGroup.add(slabMesh);
    meshes.slab_ground = slabMesh;

    // Columns
    const colGeo = new THREE.BoxGeometry(0.35, 3.2, 0.35);
    const colMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.6,
      metalness: 0.2,
    });
    const colGroup = new THREE.Group();
    const colPositions = [
      [-6.5, -4],
      [0, -4],
      [6.5, -4],
      [-6.5, 4],
      [0, 4],
      [6.5, 4],
    ];
    colPositions.forEach(([cx, cz]) => {
      const col = new THREE.Mesh(colGeo, colMat);
      col.position.set(cx, 1.6 + 0.4, cz);
      colGroup.add(col);
    });
    colGroup.userData = { key: 'columns_structure' };
    rootGroup.add(colGroup);
    // Treat first column for selection
    meshes.columns_structure = colGroup.children[0] as THREE.Mesh;

    // Exterior Perimeter Walls
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xd4d4d8,
      roughness: 0.4,
      metalness: 0.05,
    });

    // Back wall
    const backWallGeo = new THREE.BoxGeometry(14, 3.2, 0.4);
    const backWall = new THREE.Mesh(backWallGeo, wallMat);
    backWall.position.set(0, 2.0, -4.3);
    backWall.userData = { key: 'walls_perimeter' };
    rootGroup.add(backWall);

    // Left wall
    const leftWallGeo = new THREE.BoxGeometry(0.4, 3.2, 8.6);
    const leftWall = new THREE.Mesh(leftWallGeo, wallMat);
    leftWall.position.set(-6.8, 2.0, 0);
    leftWall.userData = { key: 'walls_perimeter' };
    rootGroup.add(leftWall);

    // Right wall
    const rightWallGeo = new THREE.BoxGeometry(0.4, 3.2, 8.6);
    const rightWall = new THREE.Mesh(rightWallGeo, wallMat);
    rightWall.position.set(6.8, 2.0, 0);
    rightWall.userData = { key: 'walls_perimeter' };
    rootGroup.add(rightWall);
    meshes.walls_perimeter = backWall;

    // Curtain Wall (Glass Facade at Front)
    const glassGeo = new THREE.BoxGeometry(13.6, 3.0, 0.15);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.45,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.7,
      ior: 1.5,
    });
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    glassMesh.position.set(0, 1.9, 4.3);
    glassMesh.userData = { key: 'curtain_wall' };
    rootGroup.add(glassMesh);
    meshes.curtain_wall = glassMesh;

    // Beams
    const beamGeo = new THREE.BoxGeometry(14, 0.45, 0.35);
    const beamMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 });
    const beamFront = new THREE.Mesh(beamGeo, beamMat);
    beamFront.position.set(0, 3.4, 4.3);
    const beamBack = new THREE.Mesh(beamGeo, beamMat);
    beamBack.position.set(0, 3.4, -4.3);
    rootGroup.add(beamFront);
    rootGroup.add(beamBack);
    meshes.beams_first_floor = beamFront;

    // Roof Slab
    const roofGeo = new THREE.BoxGeometry(14.4, 0.35, 9.4);
    const roofMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.7,
      metalness: 0.05,
    });
    const roofMesh = new THREE.Mesh(roofGeo, roofMat);
    roofMesh.position.set(0, 3.8, 0);
    roofMesh.userData = { key: 'roof_slab' };
    rootGroup.add(roofMesh);
    meshes.roof_slab = roofMesh;

    meshesMapRef.current = meshes;

    // 8. Simple Orbit Controls (Drag to rotate, wheel to zoom)
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let sphericalTheta = Math.PI / 4;
    let sphericalPhi = Math.PI / 3;
    let sphericalRadius = 24;

    const updateCameraPosition = () => {
      camera.position.x = sphericalRadius * Math.sin(sphericalPhi) * Math.sin(sphericalTheta);
      camera.position.y = sphericalRadius * Math.cos(sphericalPhi);
      camera.position.z = sphericalRadius * Math.sin(sphericalPhi) * Math.cos(sphericalTheta);
      camera.lookAt(0, 1.8, 0);
    };
    updateCameraPosition();

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouseX;
      const dy = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      sphericalTheta -= dx * 0.008;
      sphericalPhi = Math.max(0.1, Math.min(Math.PI / 2.05, sphericalPhi - dy * 0.008));
      updateCameraPosition();
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      sphericalRadius = Math.max(8, Math.min(45, sphericalRadius + e.deltaY * 0.02));
      updateCameraPosition();
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (isRotating && !isDragging) {
        sphericalTheta += delta * 0.25;
        updateCameraPosition();
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      renderer.dispose();
      container.innerHTML = '';
    };
  }, [isOpen, isRotating]);

  // Handle Display Mode & Clipping Toggle
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((mat) => {
          if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
            mat.wireframe = displayMode === 'wireframe';
            if (displayMode === 'xray') {
              mat.transparent = true;
              mat.opacity = 0.35;
            } else if (displayMode === 'shaded' && child.userData?.key !== 'curtain_wall') {
              mat.transparent = false;
              mat.opacity = 1.0;
            }

            if (sectionCut && sectionClipPlaneRef.current) {
              mat.clippingPlanes = [sectionClipPlaneRef.current];
              mat.clipShadows = true;
            } else {
              mat.clippingPlanes = [];
            }
            mat.needsUpdate = true;
          }
        });
      }
    });
  }, [displayMode, sectionCut]);

  if (!isOpen) return null;

  const currentProperty = SAMPLE_BIM_ELEMENTS[selectedElementKey] || SAMPLE_BIM_ELEMENTS.walls_perimeter;

  // Total Model 5D Cost
  const totalBIMCost = Object.values(SAMPLE_BIM_ELEMENTS).reduce((acc, el) => acc + el.costEstimateEur, 0);
  const totalBIMVolume = Object.values(SAMPLE_BIM_ELEMENTS).reduce((acc, el) => acc + el.volumeM3, 0);

  return (
    <div
      id="bim-viewer-modal-backdrop"
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md"
    >
      <div
        className="absolute inset-0"
        onClick={() => {
          audioSystem.playClick(500);
          onClose();
        }}
        aria-hidden="true"
      />

      {/* Main Window */}
      <div className="relative z-10 flex flex-col w-full max-w-5xl h-[90vh] max-h-[820px] rounded-none border border-white/20 bg-stone-950/95 shadow-2xl backdrop-blur-2xl text-stone-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Architectural corner marks */}
        <div className="pointer-events-none absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-amber-400 z-20" />
        <div className="pointer-events-none absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-amber-400 z-20" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-amber-400 z-20" />
        <div className="pointer-events-none absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-amber-400 z-20" />

        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/10 bg-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-none bg-amber-400/10 border border-amber-400/40 text-amber-400 font-bold">
              <Box className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
                  Viewer Parametrico BIM 3D & Ispezione IFC
                </h2>
                <span className="rounded-none bg-amber-400/10 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-amber-300 border border-amber-400/30">
                  OPENBIM IFC 4.3
                </span>
              </div>
              <p className="text-xs text-stone-400 hidden xs:block font-light">
                Modello federato di commessa • Selezione elementi, stratigrafie, computo 5D e sezione dinamica
              </p>
            </div>
          </div>

          <button
            type="button"
            id="btn-close-bim-viewer"
            onClick={() => {
              audioSystem.playClick(500);
              onClose();
            }}
            className="flex h-8 w-8 items-center justify-center rounded-none border border-white/10 bg-white/5 text-stone-400 hover:border-amber-400/50 hover:text-white transition-all"
            title="Chiudi viewer BIM"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* View Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-6 py-2 border-b border-white/10 bg-stone-900/60 font-mono text-xs shrink-0">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => {
                audioSystem.playClick(550);
                setDisplayMode('shaded');
              }}
              className={`px-2.5 py-1 rounded-none text-[11px] uppercase tracking-wider font-semibold transition-all border ${
                displayMode === 'shaded'
                  ? 'bg-amber-400 text-stone-950 font-bold border-amber-300 shadow-sm'
                  : 'bg-white/5 border-white/10 text-stone-300 hover:border-amber-400/40 hover:bg-white/10'
              }`}
            >
              Solido
            </button>
            <button
              type="button"
              onClick={() => {
                audioSystem.playClick(550);
                setDisplayMode('wireframe');
              }}
              className={`px-2.5 py-1 rounded-none text-[11px] uppercase tracking-wider font-semibold transition-all border ${
                displayMode === 'wireframe'
                  ? 'bg-amber-400 text-stone-950 font-bold border-amber-300 shadow-sm'
                  : 'bg-white/5 border-white/10 text-stone-300 hover:border-amber-400/40 hover:bg-white/10'
              }`}
            >
              Wireframe CAD
            </button>
            <button
              type="button"
              onClick={() => {
                audioSystem.playClick(550);
                setDisplayMode('xray');
              }}
              className={`px-2.5 py-1 rounded-none text-[11px] uppercase tracking-wider font-semibold transition-all border ${
                displayMode === 'xray'
                  ? 'bg-amber-400 text-stone-950 font-bold border-amber-300 shadow-sm'
                  : 'bg-white/5 border-white/10 text-stone-300 hover:border-amber-400/40 hover:bg-white/10'
              }`}
            >
              Trasparenza X-Ray
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                audioSystem.playClick(600);
                setSectionCut(!sectionCut);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-none text-[11px] uppercase tracking-wider font-semibold transition-all border ${
                sectionCut
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/60 font-bold'
                  : 'bg-white/5 text-stone-300 hover:border-white/20 border-white/10'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Sezione [{sectionCut ? 'ON' : 'OFF'}]</span>
            </button>

            <button
              type="button"
              onClick={() => {
                audioSystem.playClick(500);
                setIsRotating(!isRotating);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-none text-[11px] uppercase tracking-wider font-semibold border ${
                isRotating
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-white/5 text-stone-400 border-white/10 hover:border-white/20'
              }`}
            >
              <RotateCcw className={`h-3.5 w-3.5 ${isRotating ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Rotazione</span>
            </button>
          </div>
        </div>

        {/* Content Body: 3D Canvas (Left) + IFC Properties Inspector (Right) */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          {/* Three.js Canvas Container */}
          <div className="relative flex-1 bg-stone-950 min-h-[280px] lg:min-h-0">
            <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

            {/* In-canvas Guidance Overlay */}
            <div className="absolute top-3 left-3 pointer-events-none flex flex-col gap-1">
              <span className="rounded-none bg-stone-900/90 px-2 py-1 text-[10px] font-mono text-stone-300 border border-white/15 backdrop-blur-md">
                TRASCINA: RUOTA CAMERA • ROTELLA: ZOOM
              </span>
            </div>

            {/* Element Quick Switcher in Canvas Footer */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 overflow-x-auto p-1.5 rounded-none bg-stone-950/90 border border-white/15 backdrop-blur-lg font-mono">
              <span className="text-[10px] text-amber-400 font-bold px-2 shrink-0 uppercase">
                IFC ELEMENTI:
              </span>
              <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar">
                {Object.entries(SAMPLE_BIM_ELEMENTS).map(([key, item]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      audioSystem.playClick(650);
                      setSelectedElementKey(key);
                    }}
                    className={`shrink-0 px-2 py-0.5 rounded-none text-[10px] uppercase tracking-wider font-semibold transition-all border ${
                      selectedElementKey === key
                        ? 'bg-amber-400 text-stone-950 border-amber-300 font-bold shadow-sm'
                        : 'bg-white/5 border-white/10 text-stone-300 hover:border-amber-400/40 hover:bg-white/10'
                    }`}
                  >
                    {item.name.split(' ')[0]} {item.name.split(' ')[1]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: BIM Properties & 5D Quantity Takeoff Inspector */}
          <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-white/10 bg-stone-900/50 flex flex-col overflow-hidden">
            {/* Inspector Navigation Tabs */}
            <div className="flex border-b border-white/10 bg-white/5 font-mono text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('properties')}
                className={`flex-1 py-2 font-bold uppercase tracking-wider text-center transition-all ${
                  activeTab === 'properties' || activeTab === 'model'
                    ? 'text-amber-400 border-b-2 border-amber-400 bg-white/5'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                Proprietà IFC
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('qto')}
                className={`flex-1 py-2 font-bold uppercase tracking-wider text-center transition-all ${
                  activeTab === 'qto'
                    ? 'text-amber-400 border-b-2 border-amber-400 bg-white/5'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                Computo 5D & QTO
              </button>
            </div>

            {/* Inspector Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 custom-scrollbar text-xs">
              {activeTab === 'qto' ? (
                /* 5D Quantity Takeoff Tab */
                <div className="space-y-4">
                  <div className="rounded-none bg-amber-400/10 border border-amber-400/30 p-3.5 font-mono">
                    <span className="text-[10px] text-amber-400 uppercase tracking-wider font-bold block mb-1">
                      QUADRO ECONOMICO BIM 5D
                    </span>
                    <div className="flex items-baseline justify-between">
                      <span className="text-xl font-black text-white">
                        € {totalBIMCost.toLocaleString('it-IT')}
                      </span>
                      <span className="text-stone-400 text-[11px]">
                        Vol. tot: {totalBIMVolume.toFixed(1)} m³
                      </span>
                    </div>
                  </div>

                  <h4 className="font-bold text-white uppercase tracking-wider text-[10px] font-mono text-stone-300">
                    Scomposizione WBS e Analisi Prezzi
                  </h4>

                  <div className="space-y-2 font-mono">
                    {Object.entries(SAMPLE_BIM_ELEMENTS).map(([k, item]) => (
                      <div
                        key={k}
                        className={`p-2.5 rounded-none border transition-all cursor-pointer ${
                          selectedElementKey === k
                            ? 'bg-amber-400/15 border-amber-400 text-stone-100 shadow-sm'
                            : 'bg-white/5 border-white/10 hover:border-white/20'
                        }`}
                        onClick={() => {
                          audioSystem.playClick(600);
                          setSelectedElementKey(k);
                        }}
                      >
                        <div className="flex items-center justify-between text-[10px] text-amber-400 mb-0.5">
                          <span>{item.wbsCode}</span>
                          <span className="text-emerald-400 font-bold">
                            € {item.costEstimateEur.toLocaleString('it-IT')}
                          </span>
                        </div>
                        <div className="font-medium text-white truncate font-sans">{item.name}</div>
                        <div className="text-[10px] text-stone-400 mt-0.5">
                          Vol: {item.volumeM3} m³ • {item.lod}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Parametric IFC Element Properties Tab */
                <div className="space-y-3.5">
                  <div className="border-b border-white/10 pb-2.5 font-mono">
                    <div className="flex items-center justify-between text-[10px] text-amber-400 mb-1">
                      <span>{currentProperty.id}</span>
                      <span className="rounded-none bg-amber-400/15 px-1.5 py-0.2 text-amber-300 border border-amber-400/30">
                        {currentProperty.lod}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white font-sans">{currentProperty.name}</h3>
                    <p className="text-[10px] text-stone-400 mt-0.5 font-mono uppercase">{currentProperty.category}</p>
                  </div>

                  {/* Properties Table */}
                  <div className="space-y-2">
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-stone-400">Codice WBS:</span>
                      <span className="font-mono text-stone-200 font-semibold">{currentProperty.wbsCode}</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-stone-400">Materiale Parametrico:</span>
                      <span className="text-stone-200 text-right max-w-[180px] truncate" title={currentProperty.material}>
                        {currentProperty.material}
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-stone-400">Dimensioni:</span>
                      <span className="font-mono text-stone-200">{currentProperty.dimensions}</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-stone-400">Volume Computato:</span>
                      <span className="font-mono text-amber-300 font-bold">{currentProperty.volumeM3} m³</span>
                    </div>

                    {currentProperty.transmittanceU && (
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-stone-400">Trasmittanza (U):</span>
                        <span className="font-mono text-emerald-400 font-semibold">{currentProperty.transmittanceU}</span>
                      </div>
                    )}

                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-stone-400">Stima Costo:</span>
                      <span className="font-mono text-emerald-400 font-bold">
                        € {currentProperty.costEstimateEur.toLocaleString('it-IT')}
                      </span>
                    </div>
                  </div>

                  {/* OpenBIM Certification Callout */}
                  <div className="rounded-none bg-stone-900 border border-white/10 p-3 mt-4">
                    <div className="flex items-center gap-1.5 text-amber-400 font-mono font-semibold text-[10px] uppercase mb-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Conformità IFC & UNI 11337</span>
                    </div>
                    <p className="text-[10px] text-stone-400 leading-relaxed font-light">
                      I dati geometrici ed informativi sono completamente federati ed esportabili in formato IFC aperto compatibile con qualsiasi software di computo e modellazione.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-stone-950 border-t border-white/10 flex items-center justify-between font-mono text-[10px]">
              <span className="text-stone-400 uppercase">STANZA: {stationName}</span>
              <a
                href="mailto:EfremGiannessi@gmail.com?subject=Richiesta%20Modello%20BIM%20IFC"
                className="text-amber-400 hover:text-amber-300 font-bold uppercase flex items-center gap-0.5"
              >
                <span>Richiedi IFC</span>
                <ChevronRight className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

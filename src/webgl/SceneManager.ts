import * as THREE from 'three';
import gsap from 'gsap';
import {
  wireframeTerrainVertexShader,
  wireframeTerrainFragmentShader,
} from './shaders/wireframeTerrain';
import {
  projectPlaneVertexShader,
  projectPlaneFragmentShader,
} from './shaders/projectPlane';
import { audioSystem } from '../utils/audioSynthesizer';
import { isMobileDevice } from '../utils/device';

export interface ProjectPlaneData {
  id: string;
  element: HTMLElement;
  textureUrl: string;
}

export interface GraphicTheme {
  id: string;
  name: string;
  code: string;
  patternMode: number;
  baseColor: THREE.Color;
  accentColor: THREE.Color;
  highlightColor: THREE.Color;
  particleColors: [THREE.Color, THREE.Color];
}

export const GRAPHIC_THEMES: GraphicTheme[] = [
  {
    id: 'cyber-cyan',
    name: 'CYBER CYAN',
    code: '01',
    patternMode: 0, // 01: Organic Undulating Perlin Wave (Deep Cyber Sea)
    baseColor: new THREE.Color(0x06182c),
    accentColor: new THREE.Color(0x00f0ff),
    highlightColor: new THREE.Color(0xf59e0b),
    particleColors: [new THREE.Color(0x00f0ff), new THREE.Color(0xf59e0b)],
  },
  {
    id: 'emerald-matrix',
    name: 'EMERALD MATRIX',
    code: '02',
    patternMode: 1, // 02: Cartesian Pulse Matrix (Tron / BIM Structural Grid)
    baseColor: new THREE.Color(0x022014),
    accentColor: new THREE.Color(0x10b981),
    highlightColor: new THREE.Color(0x34d399),
    particleColors: [new THREE.Color(0x10b981), new THREE.Color(0x6ee7b7)],
  },
  {
    id: 'solar-flare',
    name: 'SOLAR FLARE',
    code: '03',
    patternMode: 2, // 03: Kinetic Radial Vortex & Sonic Shockwave
    baseColor: new THREE.Color(0x240d04),
    accentColor: new THREE.Color(0xf97316),
    highlightColor: new THREE.Color(0xfacc15),
    particleColors: [new THREE.Color(0xf97316), new THREE.Color(0xfde047)],
  },
  {
    id: 'hyper-violet',
    name: 'HYPER VIOLET',
    code: '04',
    patternMode: 3, // 04: Parametric Stepped Terraces (BIM 5D Contours)
    baseColor: new THREE.Color(0x180628),
    accentColor: new THREE.Color(0xa855f7),
    highlightColor: new THREE.Color(0xec4899),
    particleColors: [new THREE.Color(0xa855f7), new THREE.Color(0xf472b6)],
  },
  {
    id: 'ice-platinum',
    name: 'ICE PLATINUM',
    code: '05',
    patternMode: 4, // 05: Voronoi Crystalline Geodesic Lattice (Diamond Facets)
    baseColor: new THREE.Color(0x06070a),
    accentColor: new THREE.Color(0xf1f5f9),
    highlightColor: new THREE.Color(0x38bdf8),
    particleColors: [new THREE.Color(0xf8fafc), new THREE.Color(0x38bdf8)],
  },
  {
    id: 'quantum-helix',
    name: 'QUANTUM HELIX',
    code: '06',
    patternMode: 5, // 06: Quantum Double Helix Ribbon Interference
    baseColor: new THREE.Color(0x090822),
    accentColor: new THREE.Color(0x6366f1),
    highlightColor: new THREE.Color(0x84cc16),
    particleColors: [new THREE.Color(0x6366f1), new THREE.Color(0xa3e635)],
  },
  {
    id: 'crimson-sonar',
    name: 'CRIMSON SONAR',
    code: '07',
    patternMode: 6, // 07: High-Frequency Radar & Sonar Concentric Pulsar
    baseColor: new THREE.Color(0x220308),
    accentColor: new THREE.Color(0xf43f5e),
    highlightColor: new THREE.Color(0xfda4af),
    particleColors: [new THREE.Color(0xf43f5e), new THREE.Color(0xfb7185)],
  },
  {
    id: 'digital-tectonic',
    name: 'DIGITAL TECTONIC',
    code: '08',
    patternMode: 7, // 08: Digital Tectonic Faults & Glitch Matrix
    baseColor: new THREE.Color(0x041026),
    accentColor: new THREE.Color(0x2563eb),
    highlightColor: new THREE.Color(0xfacc15),
    particleColors: [new THREE.Color(0x3b82f6), new THREE.Color(0xfde047)],
  },
  {
    id: 'dune-aerodynamics',
    name: 'DUNE AERODYNAMICS',
    code: '09',
    patternMode: 8, // 09: Sand Dune Supersonic Airflow Crests
    baseColor: new THREE.Color(0x1e1205),
    accentColor: new THREE.Color(0xd97706),
    highlightColor: new THREE.Color(0xfef08a),
    particleColors: [new THREE.Color(0xd97706), new THREE.Color(0xfef08a)],
  },
  {
    id: 'event-horizon',
    name: 'EVENT HORIZON',
    code: '10',
    patternMode: 9, // 10: Hyperspace Warp Tunnel & Singularity Lens
    baseColor: new THREE.Color(0x020307),
    accentColor: new THREE.Color(0x06b6d4),
    highlightColor: new THREE.Color(0xffffff),
    particleColors: [new THREE.Color(0x06b6d4), new THREE.Color(0xffffff)],
  },
  {
    id: 'titanium-truss',
    name: 'TITANIUM TRUSS',
    code: '11',
    patternMode: 10, // 11: Parametric Tri-Axial Space-Frame Geodesic Truss
    baseColor: new THREE.Color(0x0f172a),
    accentColor: new THREE.Color(0xcbd5e1),
    highlightColor: new THREE.Color(0x14b8a6),
    particleColors: [new THREE.Color(0x94a3b8), new THREE.Color(0x14b8a6)],
  },
  {
    id: 'aurora-plasma',
    name: 'AURORA PLASMA',
    code: '12',
    patternMode: 11, // 12: Aurora Borealis Flowing Celestial Plasma
    baseColor: new THREE.Color(0x021a16),
    accentColor: new THREE.Color(0x2dd4bf),
    highlightColor: new THREE.Color(0xc084fc),
    particleColors: [new THREE.Color(0x2dd4bf), new THREE.Color(0xc084fc)],
  },
  {
    id: 'lidar-survey',
    name: 'LIDAR POINT CLOUD',
    code: '13',
    patternMode: 12, // 13: Laser Scanner 3D & Dense Topographic Survey
    baseColor: new THREE.Color(0x011b0e),
    accentColor: new THREE.Color(0x10e88a),
    highlightColor: new THREE.Color(0xf59e0b),
    particleColors: [new THREE.Color(0x10e88a), new THREE.Color(0xf59e0b)],
  },
  {
    id: 'parametric-ribbon',
    name: 'PARAMETRIC RIBBON',
    code: '14',
    patternMode: 13, // 14: Kinetic Façade Louvers & Twisted Aluminum Fins
    baseColor: new THREE.Color(0x1a1205),
    accentColor: new THREE.Color(0xfbbf24),
    highlightColor: new THREE.Color(0xf8fafc),
    particleColors: [new THREE.Color(0xfbbf24), new THREE.Color(0xe2e8f0)],
  },
  {
    id: 'tensegrity-truss',
    name: 'TENSEGRITY FRAME',
    code: '15',
    patternMode: 14, // 15: Structural Steel Truss, Cable Equilibrium & Nodes
    baseColor: new THREE.Color(0x071329),
    accentColor: new THREE.Color(0x38bdf8),
    highlightColor: new THREE.Color(0xf97316),
    particleColors: [new THREE.Color(0x38bdf8), new THREE.Color(0xf97316)],
  },
  {
    id: 'contour-topography',
    name: 'CONTOUR DTM',
    code: '16',
    patternMode: 15, // 16: Altimetric Isoipse & Digital Terrain Elevation Map
    baseColor: new THREE.Color(0x0c1b14),
    accentColor: new THREE.Color(0x86efac),
    highlightColor: new THREE.Color(0xfde047),
    particleColors: [new THREE.Color(0x86efac), new THREE.Color(0xfde047)],
  },
  {
    id: 'tesseract-4d',
    name: 'TESSERACT 4D',
    code: '17',
    patternMode: 16, // 17: Non-Euclidean 4D Hypercube Inversion & Fold
    baseColor: new THREE.Color(0x0a0524),
    accentColor: new THREE.Color(0x818cf8),
    highlightColor: new THREE.Color(0x22d3ee),
    particleColors: [new THREE.Color(0x818cf8), new THREE.Color(0x22d3ee)],
  },
  {
    id: 'bionic-voronoi',
    name: 'BIONIC VORONOI',
    code: '18',
    patternMode: 17, // 18: Generative Bionic Cellular ETFE Canopy
    baseColor: new THREE.Color(0x03181d),
    accentColor: new THREE.Color(0x2dd4bf),
    highlightColor: new THREE.Color(0xd946ef),
    particleColors: [new THREE.Color(0x2dd4bf), new THREE.Color(0xd946ef)],
  },
];

export class SceneManager {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private clock: THREE.Clock;

  // Background Wireframe Terrain
  private terrainMesh!: THREE.Mesh;
  private terrainMaterial!: THREE.ShaderMaterial;

  // Ambient Floating Particles
  private particlesMesh!: THREE.Points;
  private particlePositions!: Float32Array;
  private particleColors!: Float32Array;

  // Graphic Theme State & Morphing
  public currentThemeIndex: number = 0;
  private isMorphingTheme: boolean = false;
  public lastEdge: 'top' | 'bottom' | 'middle' = 'top';
  public onThemeChange?: (theme: GraphicTheme, trigger: 'bottom' | 'top' | 'middle' | 'manual') => void;

  // Dimensions, Scroll & Device State
  public isMobile: boolean = false;
  private width: number;
  private height: number;
  private lastWidth: number = 0;
  private lastHeight: number = 0;
  private scrollY: number = 0;
  private scrollVelocity: number = 0;
  private isDestroyed: boolean = false;

  // Interactive Project WebGL Meshes (with cached layout bounds to prevent DOM reflow during scroll)
  private projectPlanes: Map<
    string,
    {
      mesh: THREE.Mesh;
      material: THREE.ShaderMaterial;
      element: HTMLElement;
      docTop: number;
      left: number;
      width: number;
      height: number;
    }
  > = new Map();

  // Mouse & Ripple state
  private mouse = new THREE.Vector2(0.5, 0.5);
  private targetMouse = new THREE.Vector2(0.5, 0.5);
  private ripples: { x: number; y: number; progress: number }[] = [
    { x: 0.5, y: 0.5, progress: 0 },
    { x: 0.5, y: 0.5, progress: 0 },
    { x: 0.5, y: 0.5, progress: 0 },
    { x: 0.5, y: 0.5, progress: 0 },
    { x: 0.5, y: 0.5, progress: 0 },
  ];
  private nextRippleIndex = 0;

  constructor(container: HTMLElement) {
    this.container = container;
    this.isMobile = isMobileDevice();
    this.width = container.clientWidth || window.innerWidth;
    this.height = container.clientHeight || window.innerHeight;
    this.lastWidth = this.width;
    this.lastHeight = this.height;
    this.clock = new THREE.Clock();

    // 1. Three.js Scene & Camera setup
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x050508, 0.007);

    this.camera = new THREE.PerspectiveCamera(
      45,
      this.width / this.height,
      0.1,
      1000
    );
    this.camera.position.z = 40;

    // 2. WebGL Renderer with High Precision & Anti-aliasing
    // On mobile: clamp DPR to max 1.5 to eliminate GPU fillrate bottlenecks and micro-stutters
    this.renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(this.width, this.height);
    const maxDpr = this.isMobile ? 1.5 : 2.0;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
    this.renderer.setClearColor(0x050508, 1);
    this.container.appendChild(this.renderer.domElement);

    // 3. Initialize scene objects
    this.initTerrain();
    this.initParticles();
    this.bindEvents();
  }

  // 1. Undulating Wireframe Plane with Multi-Graphic Pattern Morphing
  private initTerrain() {
    // Mobile geometry uses optimized vertex density (65x45 vs 110x75) for 60/120fps fluid rasterization
    const segX = this.isMobile ? 65 : 110;
    const segY = this.isMobile ? 45 : 75;
    const geometry = new THREE.PlaneGeometry(120, 80, segX, segY);

    const ripplesUniform: THREE.Vector3[] = this.ripples.map(
      (r) => new THREE.Vector3(r.x, r.y, r.progress)
    );

    const currentTheme = GRAPHIC_THEMES[this.currentThemeIndex];

    this.terrainMaterial = new THREE.ShaderMaterial({
      vertexShader: wireframeTerrainVertexShader,
      fragmentShader: wireframeTerrainFragmentShader,
      wireframe: true,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: this.mouse },
        uResolution: { value: new THREE.Vector2(this.width, this.height) },
        uScrollVelocity: { value: 0 },
        uScrollY: { value: 0 },
        uRipples: { value: ripplesUniform },
        uPatternMode: { value: currentTheme.patternMode },
        uNextPatternMode: { value: currentTheme.patternMode },
        uPatternMorph: { value: 0 },
        uColorBase: { value: currentTheme.baseColor.clone() },
        uColorAccent: { value: currentTheme.accentColor.clone() },
        uColorHighlight: { value: currentTheme.highlightColor.clone() },
      },
    });

    this.terrainMesh = new THREE.Mesh(geometry, this.terrainMaterial);
    this.terrainMesh.position.z = -8;
    this.terrainMesh.rotation.x = -0.32; // Gentle tilted perspective
    this.scene.add(this.terrainMesh);
  }

  // 2. Floating Cybernetic Particles Field
  private initParticles() {
    const particleCount = this.isMobile ? 450 : 1000;
    const geometry = new THREE.BufferGeometry();
    this.particlePositions = new Float32Array(particleCount * 3);
    this.particleColors = new Float32Array(particleCount * 3);

    const currentTheme = GRAPHIC_THEMES[this.currentThemeIndex];
    const c1 = currentTheme.particleColors[0];
    const c2 = currentTheme.particleColors[1];

    for (let i = 0; i < particleCount; i++) {
      this.particlePositions[i * 3] = (Math.random() - 0.5) * 115;
      this.particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 90;
      this.particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 40;

      const mixed = Math.random() > 0.65 ? c2 : c1;
      this.particleColors[i * 3] = mixed.r;
      this.particleColors[i * 3 + 1] = mixed.g;
      this.particleColors[i * 3 + 2] = mixed.b;
    }

    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(this.particlePositions, 3)
    );
    geometry.setAttribute(
      'color',
      new THREE.BufferAttribute(this.particleColors, 3)
    );

    const material = new THREE.PointsMaterial({
      size: 0.38,
      vertexColors: true,
      transparent: true,
      opacity: 0.92,
      blending: THREE.AdditiveBlending,
    });

    this.particlesMesh = new THREE.Points(geometry, material);
    this.scene.add(this.particlesMesh);
  }

  // Trigger edge morphing with debounce and strict transition state
  public triggerEdge(edge: 'bottom' | 'top' | 'middle') {
    if (this.lastEdge !== edge) {
      this.lastEdge = edge;
      this.cycleGraphicTheme(edge);
    }
  }

  // Select a specific theme by index (manual selection from HUD modal or dropdown)
  public selectThemeByIndex(index: number) {
    if (index < 0 || index >= GRAPHIC_THEMES.length) return;
    if (index === this.currentThemeIndex) return;
    this.applyThemeByIndex(index, 'manual');
  }

  // Cycle to the Next Graphic Theme on Arrival (Bottom, Top, or Middle)
  public cycleGraphicTheme(trigger: 'bottom' | 'top' | 'middle' | 'manual') {
    const nextIndex = (this.currentThemeIndex + 1) % GRAPHIC_THEMES.length;
    this.applyThemeByIndex(nextIndex, trigger);
  }

  // Randomize Graphic Theme among all available regimes
  public randomGraphicTheme(trigger: 'bottom' | 'top' | 'middle' | 'manual' = 'manual') {
    let nextIndex = Math.floor(Math.random() * GRAPHIC_THEMES.length);
    if (GRAPHIC_THEMES.length > 1 && nextIndex === this.currentThemeIndex) {
      nextIndex =
        (this.currentThemeIndex + 1 + Math.floor(Math.random() * (GRAPHIC_THEMES.length - 1))) %
        GRAPHIC_THEMES.length;
    }
    this.applyThemeByIndex(nextIndex, trigger);
    return GRAPHIC_THEMES[nextIndex];
  }

  // Apply Theme with Smooth GSAP Morphing Transition
  public applyThemeByIndex(nextIndex: number, trigger: 'bottom' | 'top' | 'middle' | 'manual') {
    if (this.isMorphingTheme) return;
    this.isMorphingTheme = true;

    // Safety timeout: ensure lock is always released even under rapid interruptions
    setTimeout(() => {
      this.isMorphingTheme = false;
    }, 1800);

    const nextTheme = GRAPHIC_THEMES[nextIndex];

    // Play subtle high-tech acoustic chirp
    audioSystem.playGlitch();

    // Prepare shader uniforms for morph
    this.terrainMaterial.uniforms.uNextPatternMode.value = nextTheme.patternMode;

    const morphObj = {
      progress: 0,
      baseR: this.terrainMaterial.uniforms.uColorBase.value.r,
      baseG: this.terrainMaterial.uniforms.uColorBase.value.g,
      baseB: this.terrainMaterial.uniforms.uColorBase.value.b,
      accentR: this.terrainMaterial.uniforms.uColorAccent.value.r,
      accentG: this.terrainMaterial.uniforms.uColorAccent.value.g,
      accentB: this.terrainMaterial.uniforms.uColorAccent.value.b,
      highlightR: this.terrainMaterial.uniforms.uColorHighlight.value.r,
      highlightG: this.terrainMaterial.uniforms.uColorHighlight.value.g,
      highlightB: this.terrainMaterial.uniforms.uColorHighlight.value.b,
    };

    gsap.to(morphObj, {
      progress: 1,
      baseR: nextTheme.baseColor.r,
      baseG: nextTheme.baseColor.g,
      baseB: nextTheme.baseColor.b,
      accentR: nextTheme.accentColor.r,
      accentG: nextTheme.accentColor.g,
      accentB: nextTheme.accentColor.b,
      highlightR: nextTheme.highlightColor.r,
      highlightG: nextTheme.highlightColor.g,
      highlightB: nextTheme.highlightColor.b,
      duration: 1.6,
      ease: 'power2.inOut',
      onUpdate: () => {
        this.terrainMaterial.uniforms.uPatternMorph.value = morphObj.progress;
        this.terrainMaterial.uniforms.uColorBase.value.setRGB(
          morphObj.baseR,
          morphObj.baseG,
          morphObj.baseB
        );
        this.terrainMaterial.uniforms.uColorAccent.value.setRGB(
          morphObj.accentR,
          morphObj.accentG,
          morphObj.accentB
        );
        this.terrainMaterial.uniforms.uColorHighlight.value.setRGB(
          morphObj.highlightR,
          morphObj.highlightG,
          morphObj.highlightB
        );
      },
      onComplete: () => {
        this.terrainMaterial.uniforms.uPatternMode.value = nextTheme.patternMode;
        this.terrainMaterial.uniforms.uPatternMorph.value = 0;
        this.currentThemeIndex = nextIndex;
        this.isMorphingTheme = false;

        // Update particle colors smoothly
        const c1 = nextTheme.particleColors[0];
        const c2 = nextTheme.particleColors[1];
        const colorsAttr = this.particlesMesh.geometry.attributes.color;
        for (let i = 0; i < colorsAttr.count; i++) {
          const mixed = Math.random() > 0.65 ? c2 : c1;
          colorsAttr.setXYZ(i, mixed.r, mixed.g, mixed.b);
        }
        colorsAttr.needsUpdate = true;
      },
    });

    // Notify listeners (UI HUD notification)
    if (this.onThemeChange) {
      this.onThemeChange(nextTheme, trigger);
    }
  }

  // 3. Register DOM Project Elements to 3D WebGL Planes
  public registerProject(data: ProjectPlaneData) {
    const loader = new THREE.TextureLoader();
    loader.load(data.textureUrl, (texture) => {
      if (this.isDestroyed) return;
      texture.generateMipmaps = true;
      texture.minFilter = THREE.LinearMipmapLinearFilter;

      const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);

      const ripplesUniform: THREE.Vector3[] = this.ripples.map(
        (r) => new THREE.Vector3(r.x, r.y, r.progress)
      );

      const material = new THREE.ShaderMaterial({
        vertexShader: projectPlaneVertexShader,
        fragmentShader: projectPlaneFragmentShader,
        transparent: true,
        uniforms: {
          uTexture: { value: texture },
          uTime: { value: 0 },
          uHover: { value: 0 },
          uScrollVelocity: { value: 0 },
          uMouse: { value: this.mouse },
          uRipples: { value: ripplesUniform },
          uOpacity: { value: 1 },
        },
      });

      const mesh = new THREE.Mesh(geometry, material);
      this.scene.add(mesh);

      const rect = data.element.getBoundingClientRect();
      const curScrollY = typeof window !== 'undefined' ? window.scrollY || 0 : 0;

      this.projectPlanes.set(data.id, {
        mesh,
        material,
        element: data.element,
        docTop: rect.top + curScrollY,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });

      this.updateProjectBounds();
    });
  }

  // Measure DOM layout positions once on resize/orientation change (never inside per-frame scroll)
  public measureProjectBounds() {
    if (typeof window === 'undefined') return;
    const curScrollY = window.scrollY || 0;

    this.projectPlanes.forEach((item) => {
      const rect = item.element.getBoundingClientRect();
      item.docTop = rect.top + curScrollY;
      item.left = rect.left;
      item.width = rect.width;
      item.height = rect.height;
    });
  }

  // Set Hover State on Project with GSAP Smooth Wave Distortion
  public setProjectHover(id: string, isHovered: boolean) {
    const item = this.projectPlanes.get(id);
    if (!item) return;

    gsap.to(item.material.uniforms.uHover, {
      value: isHovered ? 1 : 0,
      duration: 0.8,
      ease: 'power2.out',
    });

    gsap.to(item.mesh.scale, {
      x: isHovered ? 1.05 : 1,
      y: isHovered ? 1.05 : 1,
      duration: 0.8,
      ease: 'power2.out',
    });
  }

  // Sync DOM Elements Bounding Box to 3D World Coordinates (Zero DOM layout queries during scroll)
  public updateProjectBounds() {
    const fovInRadians = (this.camera.fov * Math.PI) / 180;
    const viewHeight = 2 * Math.tan(fovInRadians / 2) * this.camera.position.z;
    const viewWidth = viewHeight * this.camera.aspect;

    this.projectPlanes.forEach((item) => {
      const width3D = (item.width / this.width) * viewWidth;
      const height3D = (item.height / this.height) * viewHeight;
      item.mesh.scale.set(width3D, height3D, 1);

      const currentViewportTop = item.docTop - this.scrollY;
      const x3D = ((item.left + item.width / 2) / this.width - 0.5) * viewWidth;
      const y3D = -((currentViewportTop + item.height / 2) / this.height - 0.5) * viewHeight;

      item.mesh.position.set(x3D, y3D, 2);
    });
  }

  // Mouse & Touch Tracking
  private bindEvents() {
    const updatePointerPos = (clientX: number, clientY: number) => {
      this.targetMouse.x = clientX / this.width;
      this.targetMouse.y = 1.0 - clientY / this.height;
    };

    window.addEventListener('mousemove', (e) => {
      updatePointerPos(e.clientX, e.clientY);
    });

    const triggerRipple = (clientX: number, clientY: number) => {
      const rx = clientX / this.width;
      const ry = 1.0 - clientY / this.height;

      const ripple = this.ripples[this.nextRippleIndex];
      ripple.x = rx;
      ripple.y = ry;
      ripple.progress = 0.01;

      gsap.to(ripple, {
        progress: 1,
        duration: 1.4,
        ease: 'power2.out',
      });

      this.nextRippleIndex = (this.nextRippleIndex + 1) % this.ripples.length;
    };

    // Concentric Click Ripples
    window.addEventListener('click', (e) => {
      triggerRipple(e.clientX, e.clientY);
    });

    if (this.isMobile) {
      window.addEventListener(
        ('touchstart'),
        (e) => {
          if (e.touches && e.touches.length > 0) {
            updatePointerPos(e.touches[0].clientX, e.touches[0].clientY);
          }
        },
        { passive: true }
      );
    }

    window.addEventListener('resize', () => {
      this.onResize();
    });
  }

  public onResize() {
    const newWidth = this.container.clientWidth || window.innerWidth;
    const newHeight = this.container.clientHeight || window.innerHeight;

    if (this.isMobile) {
      // ANTI-FLICKER: On mobile devices, the URL address bar expands and collapses during
      // active scrolling, firing resize events with slight height changes (<130px) while
      // the screen width is unchanged. Re-allocating the WebGL buffer via setSize causes
      // a severe black flash / frame flicker. We prevent buffer recreation during toolbar shifts.
      const widthDiff = Math.abs(newWidth - this.lastWidth);
      const heightDiff = Math.abs(newHeight - this.lastHeight);

      if (widthDiff < 5 && heightDiff < 140) {
        // Just smoothly adjust camera aspect ratio without reallocating WebGL canvas
        this.camera.aspect = newWidth / newHeight;
        this.camera.updateProjectionMatrix();
        return;
      }
    }

    this.width = newWidth;
    this.height = newHeight;
    this.lastWidth = newWidth;
    this.lastHeight = newHeight;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
    const maxDpr = this.isMobile ? 1.5 : 2.0;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));

    this.terrainMaterial.uniforms.uResolution.value.set(
      this.width,
      this.height
    );

    this.measureProjectBounds();
    this.updateProjectBounds();
  }

  // Update with Smooth Inertia Scroll & Continuous Edge Graphic Theme Morphing
  public setScroll(scrollY: number, velocity: number, maxScroll?: number) {
    this.scrollY = scrollY;
    this.scrollVelocity = velocity;

    // Perspective bending based on velocity:
    // On mobile devices, clamp velocity and dampen tilt angle to prevent jarring shake/pitch
    const clampedVelocity = this.isMobile
      ? Math.max(-10, Math.min(10, velocity))
      : velocity;

    this.camera.position.y = -scrollY * 0.025;
    this.camera.rotation.x = this.isMobile
      ? clampedVelocity * 0.002
      : velocity * 0.008;

    // Keep terrain mesh and particles attached to camera Y so effects cover the full page to the very bottom
    if (this.terrainMesh) {
      this.terrainMesh.position.y = this.camera.position.y;
    }
    if (this.particlesMesh) {
      this.particlesMesh.position.y = this.camera.position.y;
    }
    if (this.terrainMaterial) {
      this.terrainMaterial.uniforms.uScrollY.value = scrollY;
    }

    // EDGE DETECTION: Trigger visual morph when reaching bottom and returning to top
    if (maxScroll && maxScroll > 100) {
      const progress = scrollY / maxScroll;

      // On mobile devices, use stricter thresholds to prevent rapid theme churn during touch momentum flicks
      const bottomThreshold = this.isMobile ? 0.94 : 0.82;
      const topThreshold = this.isMobile ? 0.06 : 0.18;
      const pxThreshold = this.isMobile ? 120 : 260;

      // 1. Arrived at Bottom
      if (progress >= bottomThreshold || scrollY >= maxScroll - pxThreshold) {
        this.triggerEdge('bottom');
      }
      // 2. Returned to Top
      else if (progress <= topThreshold || scrollY <= pxThreshold) {
        this.triggerEdge('top');
      }
    }

    this.updateProjectBounds();
  }

  // Main WebGL Render Loop
  public render() {
    if (this.isDestroyed) return;

    const elapsedTime = this.clock.getElapsedTime();

    // Smooth lerp mouse
    this.mouse.lerp(this.targetMouse, 0.08);

    // Update Terrain Shader Uniforms
    if (this.terrainMaterial) {
      this.terrainMaterial.uniforms.uTime.value = elapsedTime;
      this.terrainMaterial.uniforms.uMouse.value = this.mouse;
      this.terrainMaterial.uniforms.uScrollVelocity.value = this.scrollVelocity;

      const ripplesUniform: THREE.Vector3[] = this.ripples.map(
        (r) => new THREE.Vector3(r.x, r.y, r.progress)
      );
      this.terrainMaterial.uniforms.uRipples.value = ripplesUniform;
    }

    // Slowly rotate ambient particles
    if (this.particlesMesh) {
      this.particlesMesh.rotation.y = elapsedTime * 0.03;
      this.particlesMesh.rotation.x = elapsedTime * 0.015;
    }

    // Update Project Planes Uniforms
    this.projectPlanes.forEach((item) => {
      item.material.uniforms.uTime.value = elapsedTime;
      item.material.uniforms.uMouse.value = this.mouse;
      item.material.uniforms.uScrollVelocity.value = this.scrollVelocity;
    });

    this.renderer.render(this.scene, this.camera);
  }

  public destroy() {
    this.isDestroyed = true;
    if (this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
    this.renderer.dispose();
  }
}

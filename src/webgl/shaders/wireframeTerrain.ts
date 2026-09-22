// Three.js GLSL Custom Vertex & Fragment Shaders for Interactive Wireframe Terrain
// Features: 12 Distinct Mathematical Waveform Regimes, Smooth Pattern Morphing,
// Concentric Click Ripples, Mouse Dynamic Proximity & Inertia Velocity Bending.

export const wireframeTerrainVertexShader = `
uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform float uScrollVelocity;
uniform float uScrollY;
uniform vec3 uRipples[5]; // x, y, progress

// Dynamic Pattern Morphing Uniforms (0 to 11 for 12 distinct graphic styles)
uniform float uPatternMode;
uniform float uNextPatternMode;
uniform float uPatternMorph; // 0.0 to 1.0

varying vec2 vUv;
varying float vElevation;
varying float vDistToMouse;

// 2D Simplex Noise by Ian McEwan, Ashima Arts
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187,
                      0.366025403784439,
                     -0.577350269189626,
                      0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// Calculate elevation for 12 geometrically distinct graphic regimes
float getPatternElevation(float mode, vec3 pos, float waveY, float time) {
  if (mode < 0.5) {
    // 01: Organic Undulating Perlin Wave (Deep Cyber Sea / Fluid Currents)
    float n1 = snoise(vec2(pos.x * 0.035 + time * 0.12, waveY * 0.035 - time * 0.08));
    float n2 = snoise(vec2(pos.x * 0.07 - time * 0.2, waveY * 0.07 + time * 0.15)) * 0.5;
    return (n1 + n2) * 7.5;
  } else if (mode < 1.5) {
    // 02: Cartesian Pulse Matrix (Tron / BIM Structural Wireframe Grid)
    float pulse = sin(pos.x * 0.18 + time * 1.2) * cos(waveY * 0.18 - time * 0.8) * 6.2;
    float diagonal = sin((pos.x + waveY) * 0.12 + time * 0.5) * 2.8;
    return pulse + diagonal;
  } else if (mode < 2.5) {
    // 03: Kinetic Radial Vortex & Sonic Shockwave (Solar Flare Accretion)
    float dist = length(vec2(pos.x, waveY * 0.8));
    float wave = sin(dist * 0.16 - time * 2.4) * 6.5;
    float spiral = sin(atan(waveY, pos.x) * 4.0 + time * 1.8) * 3.2;
    return wave + spiral;
  } else if (mode < 3.5) {
    // 04: Parametric Stepped Terraces (BIM 5D Topography & Architectural Contours)
    float baseWave = snoise(vec2(pos.x * 0.04 + time * 0.08, waveY * 0.04 - time * 0.06)) * 7.8;
    float terrace = floor(baseWave * 1.6) / 1.6;
    float fineSteps = sin(pos.x * 0.25 + waveY * 0.25 - time * 1.2) * 1.5;
    return terrace + fineSteps;
  } else if (mode < 4.5) {
    // 05: Voronoi Crystalline Geodesic Lattice (Ice Platinum / Faceted Diamonds)
    float facet1 = abs(sin(pos.x * 0.14 + time * 0.4) * cos(waveY * 0.14 - time * 0.4));
    float facet2 = abs(cos(pos.x * 0.22 - time * 0.3) * sin(waveY * 0.22 + time * 0.3));
    float ridges = (facet1 + facet2 * 0.7) * 9.0 - 2.8;
    return ridges;
  } else if (mode < 5.5) {
    // 06: Quantum Double Helix Ribbon Interference (Intertwined Waveforms)
    float h1 = sin(pos.x * 0.12 + sin(waveY * 0.08 + time * 0.8) * 3.5);
    float h2 = cos(waveY * 0.14 + sin(pos.x * 0.08 - time * 0.8) * 3.5);
    float helix = (h1 + h2) * 5.2;
    return helix;
  } else if (mode < 6.5) {
    // 07: High-Frequency Radar & Sonar Sweep (Sonar Ping Concentric Pulsar)
    float dist = length(vec2(pos.x * 1.2, waveY));
    float ping = sin(dist * 0.38 - time * 3.2) * exp(-dist * 0.018) * 8.0;
    float sweep = sin(atan(waveY, pos.x) * 8.0 - time * 2.5) * 2.8;
    return ping + sweep;
  } else if (mode < 7.5) {
    // 08: Digital Tectonic Faults & Glitch Matrix (Segmented Cyber Displacements)
    float blockX = floor(pos.x * 0.1 + time * 0.1);
    float blockY = floor(waveY * 0.1 - time * 0.1);
    float noiseBlock = snoise(vec2(blockX, blockY)) * 6.5;
    float glitchStripe = sin(waveY * 0.6 - time * 4.0) * step(0.65, fract(sin(pos.x * 12.0) * 43758.5453)) * 4.2;
    return noiseBlock + glitchStripe;
  } else if (mode < 8.5) {
    // 09: Sand Dune Fluid Aerodynamics (Wind-Sculpted Supersonic Airflow)
    float wind = sin(pos.x * 0.06 + waveY * 0.1 + time * 0.5);
    float duneCrest = pow(max(0.0, wind), 2.8) * 8.5;
    float rippleDune = sin(pos.x * 0.3 - waveY * 0.1 - time * 1.2) * 1.3;
    return duneCrest + rippleDune - 2.5;
  } else if (mode < 9.5) {
    // 10: Hyperspace Warp Tunnel (Curved Spacetime Singularity / Event Horizon)
    float dist = length(vec2(pos.x * 0.7, waveY));
    float tunnel = -12.0 / (dist * 0.12 + 1.2) + 6.0;
    float warpLines = sin(atan(waveY, pos.x * 0.7) * 12.0 + time * 2.0) * 1.8;
    float speedPulsing = sin(dist * 0.3 - time * 4.0) * 2.2;
    return tunnel + warpLines + speedPulsing;
  } else if (mode < 10.5) {
    // 11: Parametric Tri-Axial Space-Frame (Titanium Geodesic Truss)
    float a1 = sin(pos.x * 0.16 + time * 0.8);
    float a2 = sin((pos.x * 0.08 + waveY * 0.138) - time * 0.7);
    float a3 = sin((-pos.x * 0.08 + waveY * 0.138) + time * 0.6);
    return (a1 + a2 + a3) * 2.6;
  } else if (mode < 11.5) {
    // 12: Aurora Borealis Flowing Plasma Ribbons (Celestial Northern Lights)
    float flow1 = snoise(vec2(pos.x * 0.02 + time * 0.25, waveY * 0.04 - time * 0.15));
    float flow2 = snoise(vec2(pos.x * 0.05 - time * 0.35, waveY * 0.02 + time * 0.2));
    float ribbon = sin(flow1 * 4.0 + waveY * 0.08) * 5.2 + flow2 * 3.0;
    return ribbon;
  } else if (mode < 12.5) {
    // 13: LiDAR Point Cloud (Laser Scanner 3D Topographic Survey)
    float scanY = fract(waveY * 0.04 + time * 0.35);
    float scanBeam = exp(-pow(scanY - 0.5, 2.0) * 90.0) * 8.5;
    float pointPillar = step(0.74, fract(sin(dot(floor(pos.xy * 0.16), vec2(12.9898, 78.233))) * 43758.5453)) * 6.5;
    float terrainGrid = snoise(pos.xy * 0.035) * 2.2;
    return scanBeam + pointPillar + terrainGrid;
  } else if (mode < 13.5) {
    // 14: Parametric Ribbon Façade (Kinetic Twisted Louvers)
    float ribbonX = sin(pos.x * 0.28 + time * 1.3);
    float twist = sin(waveY * 0.08 + time * 0.7) * cos(pos.x * 0.14 - time * 0.5);
    float louver = ribbonX * twist * 8.2;
    float finDepth = sin(pos.x * 0.52 + waveY * 0.12) * 2.4;
    return louver + finDepth;
  } else if (mode < 14.5) {
    // 15: Tensegrity & Space-Frame (Structural Node Equilibrium)
    float cable1 = abs(sin(pos.x * 0.18 + waveY * 0.18 + time * 0.55));
    float cable2 = abs(cos(-pos.x * 0.18 + waveY * 0.18 - time * 0.55));
    float struts = min(cable1, cable2);
    float nodePulse = pow(sin(pos.x * 0.09) * cos(waveY * 0.09) * 0.5 + 0.5, 5.0) * 9.0;
    return (1.0 - struts) * 6.0 + nodePulse - 2.0;
  } else if (mode < 15.5) {
    // 16: Contour Topography // Isoipse DTM (Digital Terrain Model)
    float dtm = snoise(vec2(pos.x * 0.03 + time * 0.04, waveY * 0.03 - time * 0.03)) * 8.5;
    float isoContour = floor(dtm * 1.7) / 1.7;
    float contourRidge = sin(isoContour * 3.14159) * 1.5;
    return isoContour + contourRidge;
  } else if (mode < 16.5) {
    // 17: Tesseract 4D (Hypercube Spatial Inversion & Non-Euclidean Fold)
    float theta = time * 0.75;
    float u = pos.x * 0.11 * cos(theta) - waveY * 0.11 * sin(theta);
    float v = pos.x * 0.11 * sin(theta) + waveY * 0.11 * cos(theta);
    float hyperEdge = (sin(u * 2.4) * sin(v * 2.4) + cos(u * 4.8) * cos(v * 4.8) * 0.5) * 5.8;
    float fold = sin(sqrt(u * u + v * v) * 2.8 - time * 1.8) * 3.2;
    return hyperEdge + fold;
  } else {
    // 18: Bionic Voronoi Canopy (Generative Cellular ETFE Membrane)
    vec2 cell = fract(vec2(pos.x * 0.075, waveY * 0.075 + time * 0.09)) - 0.5;
    float cellDist = length(cell);
    float membrane = (1.0 - smoothstep(0.02, 0.42, cellDist)) * 7.5;
    float breathing = sin(time * 1.4 + pos.x * 0.05) * 2.2;
    return membrane + breathing - 1.8;
  }
}

void main() {
  vUv = uv;
  vec3 pos = position;

  // Continuous infinite scrolling wave coordinates
  float waveY = pos.y - uScrollY * 0.015;

  // Interpolate between current and next pattern
  float elevCurrent = getPatternElevation(uPatternMode, pos, waveY, uTime);
  float elevNext = getPatternElevation(uNextPatternMode, pos, waveY, uTime);
  float elevation = mix(elevCurrent, elevNext, uPatternMorph);

  // Inertial scroll velocity bending
  elevation += sin(pos.y * 0.06 + uTime) * abs(uScrollVelocity) * 3.0;

  // Mouse cursor proximity distortion
  vec2 mouseWorld = (uMouse - 0.5) * vec2(80.0, 50.0);
  float distToMouse = length(pos.xy - mouseWorld);
  vDistToMouse = distToMouse;
  float mouseRepel = smoothstep(22.0, 0.0, distToMouse);
  elevation += mouseRepel * 6.0;

  // Concentric click ripples
  for(int i = 0; i < 5; i++) {
    if(uRipples[i].z > 0.0 && uRipples[i].z < 1.0) {
      vec2 rippleCenter = (uRipples[i].xy - 0.5) * vec2(80.0, 50.0);
      float d = length(pos.xy - rippleCenter);
      float waveDist = uRipples[i].z * 45.0;
      float waveWidth = 5.0;
      float diff = abs(d - waveDist);
      if(diff < waveWidth) {
        float waveAmp = (1.0 - uRipples[i].z) * (1.0 - diff / waveWidth) * 5.0;
        elevation += sin(diff * 1.5) * waveAmp;
      }
    }
  }

  pos.z += elevation;
  vElevation = elevation;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

export const wireframeTerrainFragmentShader = `
uniform float uTime;
uniform vec3 uColorBase;
uniform vec3 uColorAccent;
uniform vec3 uColorHighlight;
uniform float uScrollVelocity;

varying vec2 vUv;
varying float vElevation;
varying float vDistToMouse;

void main() {
  // Smooth subtle edge fade
  float alphaX = smoothstep(0.0, 0.06, vUv.x) * smoothstep(1.0, 0.94, vUv.x);
  float alphaY = smoothstep(0.0, 0.04, vUv.y) * smoothstep(1.0, 0.96, vUv.y);
  float edgeFade = alphaX * alphaY;

  // Color mix based on elevation and mouse proximity
  float elevFactor = smoothstep(-3.5, 6.5, vElevation);
  vec3 color = mix(uColorBase, uColorAccent, elevFactor);

  // Mouse glow - enhanced radiance
  float mouseGlow = smoothstep(22.0, 0.0, vDistToMouse) * 0.85;
  color += uColorAccent * mouseGlow;

  // Secondary highlights on wave crests
  if(vElevation > 2.0) {
    color = mix(color, uColorHighlight, (vElevation - 2.0) * 0.45);
  }

  // Pulsing grid line brightness - boosted visibility and clarity
  float pulse = sin(uTime * 1.5 + vUv.x * 12.0) * 0.15 + 0.95;
  float alpha = (0.55 + elevFactor * 0.45 + abs(uScrollVelocity) * 0.4) * edgeFade * pulse;

  gl_FragColor = vec4(color, alpha);
}
`;

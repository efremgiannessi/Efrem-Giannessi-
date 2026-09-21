// WebGL Project Plane Shader with Liquid Hover Distortion, Ripple Wave and Chromatic Aberration
export const projectPlaneVertexShader = `
uniform float uTime;
uniform float uHover;
uniform vec2 uMouse;
uniform float uScrollVelocity;
uniform vec3 uRipples[5];

varying vec2 vUv;
varying vec3 vPosition;
varying float vHoverDistort;

void main() {
  vUv = uv;
  vec3 pos = position;

  // Liquid curvature distortion on hover
  float distToCenter = length(uv - vec2(0.5));
  float hoverWave = sin(distToCenter * 12.0 - uTime * 3.0) * uHover * 0.08;
  pos.z += hoverWave;
  vHoverDistort = hoverWave;

  // Inertial scroll tilt
  pos.y += sin(uv.x * 3.14159) * uScrollVelocity * 0.15;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  vPosition = pos;
}
`;

export const projectPlaneFragmentShader = `
uniform sampler2D uTexture;
uniform float uHover;
uniform float uTime;
uniform float uScrollVelocity;
uniform vec2 uMouse;
uniform vec3 uRipples[5];
uniform float uOpacity;

varying vec2 vUv;
varying vec3 vPosition;
varying float vHoverDistort;

// Simplex pseudo noise
vec2 liquidDistort(vec2 uv, float time, float factor) {
  float x = sin(uv.y * 10.0 + time * 2.0) * factor * 0.03;
  float y = cos(uv.x * 10.0 + time * 2.0) * factor * 0.03;
  return vec2(x, y);
}

void main() {
  vec2 uv = vUv;

  // Apply liquid hover distortion
  vec2 distortion = liquidDistort(uv, uTime, uHover);
  uv += distortion;

  // Mouse ripple propagation on image
  for(int i = 0; i < 5; i++) {
    if(uRipples[i].z > 0.0 && uRipples[i].z < 1.0) {
      vec2 rCenter = uRipples[i].xy;
      float d = distance(vUv, rCenter);
      float targetR = uRipples[i].z * 1.2;
      float diff = abs(d - targetR);
      if(diff < 0.15) {
        float factor = (1.0 - uRipples[i].z) * (1.0 - diff / 0.15) * 0.04;
        vec2 dir = normalize(vUv - rCenter + 0.0001);
        uv += dir * factor;
      }
    }
  }

  // Chromatic Aberration on rapid movement or hover
  float aberration = (abs(uScrollVelocity) * 0.025 + uHover * 0.015);
  
  float r = texture2D(uTexture, uv + vec2(aberration, 0.0)).r;
  float g = texture2D(uTexture, uv).g;
  float b = texture2D(uTexture, uv - vec2(aberration, 0.0)).b;
  vec3 col = vec3(r, g, b);

  // Active Theory Contrast & Neon Tinting
  col = mix(col, col * 1.15, uHover);
  // Add subtle cyan highlight along edges when hovering
  float edge = smoothstep(0.48, 0.5, abs(vUv.x - 0.5)) + smoothstep(0.48, 0.5, abs(vUv.y - 0.5));
  col += vec3(0.0, 0.9, 1.0) * edge * uHover * 0.4;

  gl_FragColor = vec4(col, uOpacity);
}
`;

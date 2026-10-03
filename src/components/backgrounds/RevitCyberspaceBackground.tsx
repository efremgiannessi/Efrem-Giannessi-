import React, { useEffect, useRef } from 'react';

export const RevitCyberspaceBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.offsetWidth || 1200;
    let height = canvas.offsetHeight || 800;
    canvas.width = width;
    canvas.height = height;

    const handleResize = () => {
      if (!canvas) return;
      if (canvas.offsetWidth > 0 && canvas.offsetHeight > 0) {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
      }
    };

    window.addEventListener('resize', handleResize);

    // 3D Wireframe Precast Models
    interface WireframeStructure {
      cxPct: number;
      cyPct: number;
      cz: number;
      w: number;
      h: number;
      d: number;
      rotX: number;
      rotY: number;
      rotZ: number;
      speedRotX: number;
      speedRotY: number;
      color: string;
      glowColor: string;
      label: string;
    }

    const structures: WireframeStructure[] = [
      {
        cxPct: 0.12,
        cyPct: 0.38,
        cz: 280,
        w: 90,
        h: 220,
        d: 90,
        rotX: 0.3,
        rotY: 0.5,
        rotZ: 0.1,
        speedRotX: 0.005,
        speedRotY: 0.007,
        color: '#00f0ff',
        glowColor: 'rgba(0, 240, 255, 0.8)',
        label: 'PILASTRO CAV 60x60',
      },
      {
        cxPct: 0.88,
        cyPct: 0.32,
        cz: 300,
        w: 240,
        h: 70,
        d: 70,
        rotX: -0.25,
        rotY: -0.5,
        rotZ: 0.15,
        speedRotX: 0.006,
        speedRotY: -0.004,
        color: '#818cf8',
        glowColor: 'rgba(129, 140, 248, 0.8)',
        label: 'TRAVE I-BEAM L=24m',
      },
      {
        cxPct: 0.5,
        cyPct: 0.8,
        cz: 350,
        w: 140,
        h: 180,
        d: 140,
        rotX: 0.45,
        rotY: 0.3,
        rotZ: -0.2,
        speedRotX: -0.004,
        speedRotY: 0.005,
        color: '#f43f5e',
        glowColor: 'rgba(244, 63, 94, 0.8)',
        label: 'NODO SISMICO C.A.P.',
      },
      {
        cxPct: 0.75,
        cyPct: 0.78,
        cz: 380,
        w: 120,
        h: 60,
        d: 120,
        rotX: 0.2,
        rotY: 0.6,
        rotZ: 0.1,
        speedRotX: 0.003,
        speedRotY: 0.006,
        color: '#fbbf24',
        glowColor: 'rgba(251, 191, 36, 0.8)',
        label: 'TEGOLO DOPPIA T',
      },
    ];

    // Floating Cyberspace HUD Markers
    interface HudNode {
      xPct: number;
      yPct: number;
      text: string;
      code: string;
      pulseOffset: number;
    }

    const hudNodes: HudNode[] = [
      { xPct: 0.22, yPct: 0.18, text: 'ASSE GRIGLIA A-01', code: 'X: 18.40m Y: 32.10m', pulseOffset: 0 },
      { xPct: 0.82, yPct: 0.15, text: 'LIVELLO ESTRADOSSO +14.20m', code: 'CARICO MAX 450 kN', pulseOffset: 1.5 },
      { xPct: 0.18, yPct: 0.72, text: 'ARMATURA POST-TESA B450C', code: 'fyk = 450 N/mm²', pulseOffset: 3.0 },
      { xPct: 0.82, yPct: 0.68, text: 'TOLLERANZA ESECUTIVA ±2mm', code: 'ISO 22057 BIM READY', pulseOffset: 4.5 },
    ];

    let scanY = 0;
    let time = 0;
    const fov = 420;

    const project3D = (x: number, y: number, z: number, cx: number, cy: number) => {
      const denom = fov + z;
      const scale = denom !== 0 ? fov / denom : 1;
      return {
        x: cx + x * scale,
        y: cy + y * scale,
        scale,
      };
    };

    const render = () => {
      if (canvas.offsetWidth > 0 && canvas.offsetHeight > 0) {
        if (canvas.width !== canvas.offsetWidth || canvas.height !== canvas.offsetHeight) {
          width = canvas.width = canvas.offsetWidth;
          height = canvas.height = canvas.offsetHeight;
        }
      }

      if (!width || !height || width <= 0 || height <= 0 || !Number.isFinite(width) || !Number.isFinite(height)) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      // 1. Ambient Volumetric Glow Nebulae
      const rad1 = ctx.createRadialGradient(width * 0.15, height * 0.4, 20, width * 0.15, height * 0.4, width * 0.5);
      rad1.addColorStop(0, 'rgba(0, 240, 255, 0.22)');
      rad1.addColorStop(0.5, 'rgba(6, 182, 212, 0.08)');
      rad1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = rad1;
      ctx.fillRect(0, 0, width, height);

      const rad2 = ctx.createRadialGradient(width * 0.85, height * 0.35, 20, width * 0.85, height * 0.35, width * 0.55);
      rad2.addColorStop(0, 'rgba(168, 85, 247, 0.2)');
      rad2.addColorStop(0.6, 'rgba(99, 102, 241, 0.07)');
      rad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = rad2;
      ctx.fillRect(0, 0, width, height);

      // 2. Dual Cyberspace Perspective Grids (Luminous Floor & Ceiling)
      const horizonY = height * 0.52;
      const gridSpacing = 42;
      const speedOffset = (time * 36) % gridSpacing;

      ctx.save();
      // Floor Grid
      for (let z = 1; z <= 20; z++) {
        const pz = (z * gridSpacing - speedOffset) + 40;
        if (pz <= 0) continue;
        const py = horizonY + (fov * 85) / pz;
        if (py > height || !Number.isFinite(py)) continue;

        const alpha = Math.min(0.35, Math.max(0, (py - horizonY) / (height - horizonY) * 0.35));
        ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
        ctx.lineWidth = z === 1 || z === 6 || z === 12 ? 2 : 1;
        ctx.beginPath();
        ctx.moveTo(0, py);
        ctx.lineTo(width, py);
        ctx.stroke();
      }

      // Ceiling Grid (Inverted Cyber Sky)
      for (let z = 1; z <= 15; z++) {
        const pz = (z * gridSpacing - speedOffset) + 40;
        if (pz <= 0) continue;
        const py = horizonY - (fov * 70) / pz;
        if (py < 0 || !Number.isFinite(py)) continue;

        const alpha = Math.min(0.2, Math.max(0, (horizonY - py) / horizonY * 0.2));
        ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, py);
        ctx.lineTo(width, py);
        ctx.stroke();
      }

      // Radial Perspective Vanishing Lines (Floor & Ceiling)
      const centerVx = width * 0.5;
      for (let vx = -width * 0.9; vx <= width * 1.9; vx += 65) {
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.12)';
        ctx.lineWidth = 1;
        // down to floor
        ctx.beginPath();
        ctx.moveTo(centerVx, horizonY);
        ctx.lineTo(vx, height);
        ctx.stroke();

        // up to ceiling
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.08)';
        ctx.beginPath();
        ctx.moveTo(centerVx, horizonY);
        ctx.lineTo(vx, 0);
        ctx.stroke();
      }
      ctx.restore();

      // 3. 3D Rotating Wireframe BIM Precast Models (Glowing & Luminous)
      structures.forEach((box) => {
        box.rotX += box.speedRotX;
        box.rotY += box.speedRotY;

        const cx = width * box.cxPct;
        const cy = height * box.cyPct;

        const hw = box.w / 2;
        const hh = box.h / 2;
        const hd = box.d / 2;

        const rawVertices = [
          [-hw, -hh, -hd],
          [hw, -hh, -hd],
          [hw, hh, -hd],
          [-hw, hh, -hd],
          [-hw, -hh, hd],
          [hw, -hh, hd],
          [hw, hh, hd],
          [-hw, hh, hd],
        ];

        const cosX = Math.cos(box.rotX);
        const sinX = Math.sin(box.rotX);
        const cosY = Math.cos(box.rotY);
        const sinY = Math.sin(box.rotY);

        const projected = rawVertices.map(([vx, vy, vz]) => {
          const x1 = vx * cosY + vz * sinY;
          const z1 = -vx * sinY + vz * cosY;
          const y2 = vy * cosX - z1 * sinX;
          const z2 = vy * sinX + z1 * cosX;
          return project3D(x1, y2, z2 + box.cz, cx, cy);
        });

        const edges = [
          [0, 1], [1, 2], [2, 3], [3, 0],
          [4, 5], [5, 6], [6, 7], [7, 4],
          [0, 4], [1, 5], [2, 6], [3, 7],
        ];

        // Draw with rich neon bloom
        ctx.save();
        ctx.strokeStyle = box.color;
        ctx.shadowColor = box.glowColor;
        ctx.shadowBlur = 18;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        edges.forEach(([i1, i2]) => {
          if (projected[i1] && projected[i2]) {
            ctx.moveTo(projected[i1].x, projected[i1].y);
            ctx.lineTo(projected[i2].x, projected[i2].y);
          }
        });
        ctx.stroke();

        // Glowing Vertex Spheres
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 12;
        projected.forEach((p) => {
          if (Number.isFinite(p.x) && Number.isFinite(p.y)) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3 * p.scale, 0, Math.PI * 2);
            ctx.fill();
          }
        });

        // Small Floating 3D Label
        const topNode = projected[0];
        if (topNode && Number.isFinite(topNode.x) && Number.isFinite(topNode.y)) {
          ctx.fillStyle = box.color;
          ctx.font = '10px monospace';
          ctx.fillText(`▶ ${box.label}`, topNode.x - 20, topNode.y - 12);
        }

        ctx.restore();
      });

      // 4. Floating Holographic HUD Telemetry Nodes
      hudNodes.forEach((node) => {
        const nx = width * node.xPct;
        const ny = height * node.yPct;
        const pulse = Math.sin(time * 3 + node.pulseOffset) * 0.5 + 0.5;

        ctx.save();
        ctx.translate(nx, ny);

        // Crosshair reticle
        ctx.strokeStyle = `rgba(0, 240, 255, ${0.4 + pulse * 0.5})`;
        ctx.shadowColor = 'rgba(0, 240, 255, 0.8)';
        ctx.shadowBlur = 8;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(0, 0, 14, 0, Math.PI * 2);
        ctx.moveTo(-20, 0); ctx.lineTo(20, 0);
        ctx.moveTo(0, -20); ctx.lineTo(0, 20);
        ctx.stroke();

        // Center blinking photon
        ctx.fillStyle = `rgba(255, 255, 255, ${0.7 + pulse * 0.3})`;
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();

        // Label box
        ctx.fillStyle = 'rgba(0, 240, 255, 0.85)';
        ctx.font = 'bold 9px monospace';
        ctx.fillText(node.text, 26, -4);

        ctx.fillStyle = 'rgba(226, 232, 240, 0.7)';
        ctx.font = '8px monospace';
        ctx.fillText(node.code, 26, 8);

        ctx.restore();
      });

      // 5. Sweeping Laser Hologram Scanner Curtain
      if (height > 0 && Number.isFinite(height)) {
        const safeScan = Number.isFinite(scanY) ? scanY : 0;
        scanY = (safeScan + 1.8) % height;
      } else {
        scanY = 0;
      }

      const gradTop = Math.max(0, scanY - 50);
      const gradBottom = Math.max(gradTop + 1, scanY + 15);

      if (Number.isFinite(gradTop) && Number.isFinite(gradBottom)) {
        ctx.save();
        const laserGrad = ctx.createLinearGradient(0, gradTop, 0, gradBottom);
        laserGrad.addColorStop(0, 'rgba(0, 240, 255, 0)');
        laserGrad.addColorStop(0.7, 'rgba(0, 240, 255, 0.16)');
        laserGrad.addColorStop(1, 'rgba(0, 240, 255, 0.38)');

        ctx.fillStyle = laserGrad;
        ctx.fillRect(0, gradTop, width, Math.max(1, gradBottom - gradTop));

        // Intense Beam line
        ctx.strokeStyle = '#ffffff';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 16;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, scanY);
        ctx.lineTo(width, scanY);
        ctx.stroke();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {/* 3D Wireframe & Cyberspace Perspective Canvas */}
      <canvas 
        ref={canvasRef} 
        className="w-full h-full block" 
      />

      {/* Futuristic Engineering Floating HUD Glyphs */}
      <div className="absolute top-10 left-8 font-mono text-[10px] text-cyan-400/60 tracking-widest hidden md:flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping shadow-[0_0_12px_rgba(0,240,255,1)]" />
        <span>CYBERSPACE BIM 3D // PARAMETRIC VECTOR MATRIX [ACTIVE]</span>
      </div>

      <div className="absolute bottom-12 right-8 font-mono text-[10px] text-fuchsia-400/60 tracking-widest hidden md:block">
        STRUCTURAL PRECAST C.A.P. // σ = 45 MPa • SPAN L=24.0m • REVIT API
      </div>

      {/* Subtle Top & Bottom Edge Fade to blend with sections */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050609]/40 via-transparent to-[#050609]/60 pointer-events-none" />
    </div>
  );
};

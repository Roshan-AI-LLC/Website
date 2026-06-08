/**
 * Segment 5's glass box. A solid black cube turns to glass, revealing a small
 * 3D concept graph inside: teal nodes connected by glowing edges with a signal
 * pulse travelling along them, on a slow orbit. The box is CSS 3D; the graph
 * nodes/edges are projected to 2D in JS (matching the cube's rotation +
 * perspective) so edges track the rotation and we can depth-cue near/far.
 */
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, FONTS } from '../theme';

const SIZE = 380;
const PERSP = 1400;
const CX = 960;
const CY = 540;

type Node = { x: number; y: number; z: number; label: string };
const NODES: Node[] = [
  { x: 0, y: -8, z: 0, label: 'HFrEF' }, // hub
  { x: -122, y: -96, z: 84, label: 'orthopnea' },
  { x: 116, y: -60, z: -96, label: 'edema' },
  { x: -74, y: 96, z: -70, label: 'BNP' },
  { x: 100, y: 110, z: 96, label: 'dyspnea' },
  { x: -138, y: 44, z: 120, label: 'congestion' },
];
const EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [0, 5],
  [1, 5],
  [2, 4],
];

function project(n: { x: number; y: number; z: number }, rxDeg: number, ryDeg: number) {
  const rx = (rxDeg * Math.PI) / 180;
  const ry = (ryDeg * Math.PI) / 180;
  const x1 = n.x * Math.cos(ry) + n.z * Math.sin(ry);
  const z1 = -n.x * Math.sin(ry) + n.z * Math.cos(ry);
  const y1 = n.y;
  const y2 = y1 * Math.cos(rx) - z1 * Math.sin(rx);
  const z2 = y1 * Math.sin(rx) + z1 * Math.cos(rx);
  const scale = PERSP / (PERSP - z2);
  return { sx: x1 * scale, sy: y2 * scale, z: z2, scale };
}

const Face: React.FC<{ transform: string; reveal: number }> = ({ transform, reveal }) => {
  const bgAlpha = interpolate(reveal, [0, 1], [0.98, 0.04]);
  const borderAlpha = interpolate(reveal, [0, 1], [0.08, 0.6]);
  return (
    <div
      style={{
        position: 'absolute',
        width: SIZE,
        height: SIZE,
        left: '50%',
        top: '50%',
        marginLeft: -SIZE / 2,
        marginTop: -SIZE / 2,
        transform,
        background: `linear-gradient(135deg, rgba(255,255,255,${0.05 * reveal}) 0%, rgba(78,205,196,${0.04 * reveal}) 42%, rgba(8,10,14,${bgAlpha}) 100%)`,
        border: `1px solid rgba(78,205,196,${borderAlpha})`,
        boxShadow: `inset 0 0 60px -16px rgba(78,205,196,${reveal * 0.6}), 0 0 0 1px rgba(78,205,196,${reveal * 0.12})`,
        backdropFilter: reveal > 0.4 ? 'blur(1px)' : undefined,
      }}
    />
  );
};

export const Cube3D: React.FC<{ appearAt?: number }> = ({ appearAt = 0 }) => {
  const frame = useCurrentFrame();
  const local = frame - appearAt;

  const rotY = local * 0.45;
  const rotX = -22 + Math.sin(local * 0.02) * 5;
  const reveal = interpolate(local, [25, 80], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const h = SIZE / 2;
  const faces = [
    `translateZ(${h}px)`,
    `rotateY(180deg) translateZ(${h}px)`,
    `rotateY(90deg) translateZ(${h}px)`,
    `rotateY(-90deg) translateZ(${h}px)`,
    `rotateX(90deg) translateZ(${h}px)`,
    `rotateX(-90deg) translateZ(${h}px)`,
  ];

  const projected = NODES.map((n) => project(n, rotX, rotY));
  const depthT = (z: number) => interpolate(z, [-150, 150], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // One-time light sweep across the glass as it turns transparent.
  const sweepX = interpolate(local, [30, 76], [-70, 130], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const sweepOpacity = interpolate(local, [30, 40, 70, 78], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      {/* CSS-3D glass box */}
      <div style={{ perspective: PERSP }}>
        <div
          style={{
            position: 'relative',
            width: SIZE,
            height: SIZE,
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          }}
        >
          {faces.map((t, i) => (
            <Face key={i} transform={t} reveal={reveal} />
          ))}
        </div>
      </div>

      {/* Light sweep (screen space) */}
      <div
        style={{
          position: 'absolute',
          left: CX,
          top: CY,
          width: SIZE * 1.7,
          height: SIZE * 1.7,
          transform: 'translate(-50%, -50%)',
          overflow: 'hidden',
          borderRadius: 28,
          opacity: sweepOpacity * 0.9,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: '-25%',
            background: 'linear-gradient(115deg, transparent 45%, rgba(255,255,255,0.18) 50%, transparent 55%)',
            transform: `translateX(${sweepX}%)`,
          }}
        />
      </div>

      {/* Concept graph: edges (projected to 2D, depth-cued) */}
      <AbsoluteFill style={{ pointerEvents: 'none' }}>
        <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0 }}>
          {EDGES.map(([a, b], i) => {
            const pa = projected[a];
            const pb = projected[b];
            const appear = interpolate(local, [55, 85], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            const d = (depthT(pa.z) + depthT(pb.z)) / 2;
            const x1 = CX + pa.sx;
            const y1 = CY + pa.sy;
            const x2 = CX + pb.sx;
            const y2 = CY + pb.sy;
            // travelling signal pulse
            const t = ((local * 0.015 + i * 0.27) % 1 + 1) % 1;
            const px = x1 + (x2 - x1) * t;
            const py = y1 + (y2 - y1) * t;
            return (
              <g key={i}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={COLORS.accent}
                  strokeWidth={1.2 + d}
                  strokeOpacity={appear * (0.12 + 0.32 * d)}
                />
                {appear > 0.9 && (
                  <circle cx={px} cy={py} r={2 + 2 * d} fill={COLORS.accentStrong} opacity={0.5 + 0.4 * d} />
                )}
              </g>
            );
          })}
        </svg>

        {/* Nodes + labels (depth-cued) */}
        {NODES.map((n, i) => {
          const p = projected[i];
          const d = depthT(p.z);
          const appear = interpolate(local, [45 + i * 4, 75 + i * 4], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const pulse = 0.7 + 0.3 * Math.sin(local * 0.12 + i);
          const r = (7 + 4 * d) * p.scale;
          const bright = 0.55 + 0.45 * d;
          return (
            <div
              key={n.label}
              style={{
                position: 'absolute',
                left: CX + p.sx,
                top: CY + p.sy,
                transform: 'translate(-50%, -50%)',
                opacity: appear,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <div
                style={{
                  width: r * 2,
                  height: r * 2,
                  borderRadius: '50%',
                  background: COLORS.accentStrong,
                  opacity: bright,
                  boxShadow: `0 0 ${16 * pulse * bright}px ${5 * pulse}px rgba(78,205,196,${0.7 * bright})`,
                }}
              />
              <div
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 14 * p.scale,
                  color: COLORS.textSecondary,
                  opacity: 0.35 + 0.65 * d,
                  whiteSpace: 'nowrap',
                }}
              >
                {n.label}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

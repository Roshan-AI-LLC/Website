/**
 * Segment 4's "glass box": a solid black cube that becomes a transparent
 * glass cube revealing teal concept nodes inside, on a slow continuous
 * orbit (CSS 3D, transform-style: preserve-3d). `reveal` (0→1) drives the
 * black→glass transition and the appearance of the inner nodes.
 */
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, FONTS } from '../theme';

const SIZE = 380;

// Inner concept nodes, scattered in the cube's local 3D space.
const NODES: { x: number; y: number; z: number; label: string }[] = [
  { x: -90, y: -70, z: 60, label: 'orthopnea' },
  { x: 80, y: -40, z: -70, label: 'edema' },
  { x: -50, y: 60, z: -50, label: 'BNP' },
  { x: 70, y: 80, z: 70, label: 'dyspnea' },
  { x: 0, y: -10, z: 0, label: 'HFrEF' },
  { x: -100, y: 30, z: 90, label: 'congestion' },
];

const Face: React.FC<{ transform: string; reveal: number }> = ({ transform, reveal }) => {
  const bgAlpha = interpolate(reveal, [0, 1], [0.98, 0.05]);
  const borderAlpha = interpolate(reveal, [0, 1], [0.08, 0.5]);
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
        background: `rgba(10, 12, 16, ${bgAlpha})`,
        border: `1px solid rgba(78, 205, 196, ${borderAlpha})`,
        boxShadow: `inset 0 0 60px -20px rgba(78,205,196,${reveal * 0.5})`,
        backdropFilter: reveal > 0.4 ? 'blur(2px)' : undefined,
      }}
    />
  );
};

export const Cube3D: React.FC<{ appearAt?: number }> = ({ appearAt = 0 }) => {
  const frame = useCurrentFrame();
  const local = frame - appearAt;

  // Slow continuous orbit.
  const rotY = local * 0.45;
  const rotX = -22 + Math.sin(local * 0.02) * 5;

  // Glass reveal ramps in after a beat, then holds.
  const reveal = interpolate(local, [25, 80], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const h = SIZE / 2;
  const faces = [
    `translateZ(${h}px)`,
    `rotateY(180deg) translateZ(${h}px)`,
    `rotateY(90deg) translateZ(${h}px)`,
    `rotateY(-90deg) translateZ(${h}px)`,
    `rotateX(90deg) translateZ(${h}px)`,
    `rotateX(-90deg) translateZ(${h}px)`,
  ];

  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ perspective: 1400 }}>
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

          {/* Inner concept nodes */}
          {NODES.map((n, i) => {
            const pulse = 0.7 + 0.3 * Math.sin(local * 0.12 + i);
            const nodeOpacity = interpolate(local, [45 + i * 4, 75 + i * 4], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            return (
              <div
                key={n.label}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: `translate(-50%, -50%) translate3d(${n.x}px, ${n.y}px, ${n.z}px) rotateY(${-rotY}deg) rotateX(${-rotX}deg)`,
                  opacity: nodeOpacity,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    background: COLORS.accentStrong,
                    boxShadow: `0 0 ${18 * pulse}px ${6 * pulse}px ${COLORS.accent}`,
                  }}
                />
                <div
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 15,
                    color: COLORS.textSecondary,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {n.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

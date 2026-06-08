/**
 * The ShifaMind logo with a living connectome: the brand mark plus an overlay
 * of teal nodes that twinkle and edges that softly draw/glow on the networked
 * (navy) right hemisphere - so the mark reads as "thinking" on the reveal and
 * closing, instead of a frozen SVG.
 */
import { interpolate, useCurrentFrame } from 'remotion';
import { COLORS } from '../theme';
import { Logo } from './Logo';

// Node positions in the logo's 1024 viewBox, over the right hemisphere.
const NODES: [number, number][] = [
  [546, 256],
  [602, 300],
  [560, 358],
  [612, 404],
  [533, 418],
  [586, 456],
  [630, 352],
];
const EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [0, 4],
  [4, 5],
  [3, 6],
  [2, 5],
];

export const LogoMark: React.FC<{ size?: number; appearAt?: number }> = ({
  size = 200,
  appearAt = 0,
}) => {
  const frame = useCurrentFrame();
  const local = frame - appearAt;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <Logo size={size} />
      <svg
        width={size}
        height={size}
        viewBox="0 0 1024 1024"
        style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}
      >
        {EDGES.map(([a, b], i) => {
          const reveal = interpolate(local, [24 + i * 4, 46 + i * 4], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const flow = 0.35 + 0.35 * Math.sin(local * 0.12 + i * 1.3);
          const [x1, y1] = NODES[a];
          const [x2, y2] = NODES[b];
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={COLORS.accentStrong}
              strokeWidth={2}
              strokeOpacity={reveal * (0.25 + flow * 0.5)}
            />
          );
        })}
        {NODES.map(([x, y], i) => {
          const appear = interpolate(local, [12 + i * 3, 26 + i * 3], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const tw = 0.6 + 0.4 * Math.sin(local * 0.16 + i * 1.7);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={5.5 * appear}
              fill={COLORS.accentStrong}
              opacity={appear}
              style={{ filter: `drop-shadow(0 0 ${5 * tw}px ${COLORS.accent})` }}
            />
          );
        })}
      </svg>
    </div>
  );
};

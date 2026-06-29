/**
 * The 160-concept constellation. A faint, depth-cued cloud of ambient concept
 * nodes (so "160 concepts" reads literally) with a handful of NAMED concepts
 * that ignite teal and label themselves. Shared by the GlassBox reveal ("open
 * the box, see the concepts") and the Architecture bottleneck.
 *
 * Deterministic: ambient positions come from a seeded PRNG so they're identical
 * every frame. The named/lit nodes are passed in by the caller (real concept
 * labels + screen positions) so the visual stays concrete, never abstract.
 */
import { interpolate, useCurrentFrame } from 'remotion';
import { COLORS, FONTS } from '../theme';

export type LitNode = { x: number; y: number; label: string };

// mulberry32 — small deterministic PRNG.
const prng = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

type Ambient = { x: number; y: number; depth: number; size: number; phase: number };

export const ConceptConstellation: React.FC<{
  total?: number;
  region: { cx: number; cy: number; rx: number; ry: number };
  lit: LitNode[];
  appearAt?: number;
  igniteAt?: number;
  seed?: number;
  labelPlacement?: 'right' | 'top';
}> = ({ total = 160, region, lit, appearAt = 0, igniteAt, seed = 42, labelPlacement = 'right' }) => {
  const frame = useCurrentFrame();
  const local = frame - appearAt;
  const ignite = igniteAt ?? appearAt + 24;

  const r = prng(seed);
  const ambientCount = Math.max(0, total - lit.length);
  const ambient: Ambient[] = [];
  for (let i = 0; i < ambientCount; i++) {
    const ang = r() * Math.PI * 2;
    const rad = Math.pow(r(), 0.62);
    const depth = r();
    ambient.push({
      x: region.cx + Math.cos(ang) * rad * region.rx,
      y: region.cy + Math.sin(ang) * rad * region.ry,
      depth,
      size: 1.3 + depth * 2.6,
      phase: r() * Math.PI * 2,
    });
  }

  const cloudIn = interpolate(local, [0, 34], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {/* Ambient concepts: faint, twinkling, depth-cued. */}
      <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0 }}>
        {ambient.map((n, i) => {
          const tw = 0.55 + 0.45 * Math.sin(frame * 0.05 + n.phase);
          const op = cloudIn * (0.1 + 0.28 * n.depth) * tw;
          return <circle key={i} cx={n.x} cy={n.y} r={n.size} fill={COLORS.accent} opacity={op} />;
        })}
      </svg>

      {/* Lit concepts: ignite + label. */}
      {lit.map((n, i) => {
        const ia = ignite + i * 4;
        const fire = interpolate(frame, [ia, ia + 16], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const pulse = 0.7 + 0.3 * Math.sin(frame * 0.12 + i);
        const radius = 4 + fire * 4;
        const labelStyle: React.CSSProperties =
          labelPlacement === 'top'
            ? { left: n.x, top: n.y - 26, transform: 'translateX(-50%)', textAlign: 'center' }
            : { left: n.x + 18, top: n.y - 9 };
        return (
          <div key={n.label}>
            <div
              style={{
                position: 'absolute',
                left: n.x,
                top: n.y,
                width: radius * 2,
                height: radius * 2,
                transform: 'translate(-50%, -50%)',
                borderRadius: '50%',
                background: COLORS.accentStrong,
                opacity: fire,
                boxShadow: `0 0 ${14 * pulse * fire}px ${5 * pulse}px rgba(78,205,196,${0.7 * fire})`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                opacity: fire,
                fontFamily: FONTS.mono,
                fontSize: 16,
                color: COLORS.accent,
                whiteSpace: 'nowrap',
                ...labelStyle,
              }}
            >
              {n.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/**
 * The platform reveal: ShifaMind is one layer of a 5-layer stack
 * (Ingestion → Models → Reasoning → APIs → Surface) that assembles bottom-up.
 * Lands the investor/recruiter beat — this is infrastructure, not a feature —
 * with "ShifaMind is the first." The Reasoning layer (the concept bottleneck)
 * is highlighted as the shared spine every future product runs on.
 *
 * Self-timed from `appearAt`.
 */
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, FONTS } from '../theme';
import { SPRING_SOFT } from '../motion';

const LAYERS = [
  { name: 'Ingestion', note: 'clinical text in' },
  { name: 'Models', note: 'BioClinical ModernBERT · concept bottleneck' },
  { name: 'Reasoning', note: 'the concept bottleneck every product runs on', spine: true },
  { name: 'APIs', note: 'predict · explain · discuss' },
  { name: 'Surface', note: 'ShifaMind, and what comes next' },
];

const Layer: React.FC<{ index: number; appearAt: number }> = ({ index, appearAt }) => {
  const l = LAYERS[index];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Assemble bottom-up: last layer in the array appears first.
  const order = LAYERS.length - 1 - index;
  const local = frame - appearAt - order * 8;
  const s = spring({ frame: local, fps, config: SPRING_SOFT });
  const opacity = interpolate(local, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const x = interpolate(s, [0, 1], [index % 2 === 0 ? -60 : 60, 0]);

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${x}px)`,
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        padding: '20px 30px',
        borderRadius: 14,
        background: l.spine ? COLORS.accentSoft : COLORS.glass,
        border: `1px solid ${l.spine ? COLORS.borderTeal : COLORS.borderSubtle}`,
        boxShadow: l.spine ? `0 0 40px -14px ${COLORS.accent}` : undefined,
      }}
    >
      <div
        style={{
          width: 200,
          fontFamily: FONTS.display,
          fontSize: 32,
          fontWeight: 700,
          color: l.spine ? COLORS.accent : COLORS.textPrimary,
          letterSpacing: '-0.01em',
        }}
      >
        {l.name}
      </div>
      <div style={{ fontFamily: FONTS.mono, fontSize: 18, color: COLORS.textMuted }}>{l.note}</div>
    </div>
  );
};

export const PlatformStack: React.FC<{ appearAt?: number }> = ({ appearAt = 0 }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: 920 }}>
      {LAYERS.map((l, i) => (
        <Layer key={l.name} index={i} appearAt={appearAt} />
      ))}
    </div>
  );
};

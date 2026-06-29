/**
 * "The receipts" — the three interpretability metrics counting up as exhibits.
 * These are the film's unfakeable flex: numbers a general LLM can't produce
 * because they measure the concept bottleneck itself. Shared by both cuts.
 */
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, FONTS } from '../theme';
import { METRICS } from '../data/metrics';
import { SPRING, STAGGER } from '../motion';

const Tile: React.FC<{ index: number; appearAt: number }> = ({ index, appearAt }) => {
  const m = METRICS[index];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - appearAt - index * (STAGGER * 3);
  const s = spring({ frame: local, fps, config: SPRING });
  const opacity = interpolate(local, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const value = interpolate(s, [0, 1], [0, m.shifamind]);
  const y = interpolate(s, [0, 1], [22, 0]);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px)`,
        flex: 1,
        padding: '34px 30px',
        borderRadius: 20,
        background: COLORS.glass,
        border: `1px solid ${COLORS.borderTeal}`,
        boxShadow: `0 0 0 1px ${COLORS.accentSofter}, 0 24px 60px -40px ${COLORS.accent}`,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontFamily: FONTS.mono,
          fontSize: 18,
          letterSpacing: '0.18em',
          color: COLORS.accent,
        }}
      >
        {m.key}
      </div>
      <div
        style={{
          marginTop: 12,
          fontFamily: FONTS.display,
          fontSize: 76,
          fontWeight: 700,
          color: COLORS.textPrimary,
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '-0.02em',
        }}
      >
        {value.toFixed(m.decimals)}
      </div>
      <div style={{ marginTop: 8, fontSize: 20, color: COLORS.textSecondary }}>{m.name}</div>
    </div>
  );
};

export const Receipts: React.FC<{ appearAt?: number }> = ({ appearAt = 0 }) => {
  return (
    <div style={{ display: 'flex', gap: 28 }}>
      {METRICS.map((m, i) => (
        <Tile key={m.key} index={i} appearAt={appearAt} />
      ))}
    </div>
  );
};

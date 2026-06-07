/**
 * Animated concept-activation bar, recreating DemoBlock's ConceptBar as a
 * frame-driven element: snake-case label, a teal gradient fill that grows to
 * the activation level, and a counting numeric readout.
 */
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, FONTS } from '../theme';

export const ConceptBar: React.FC<{
  label: string;
  activation: number;
  appearAt?: number;
}> = ({ label, activation, appearAt = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - appearAt;

  const grow = spring({
    frame: local,
    fps,
    config: { damping: 22, stiffness: 120, mass: 0.8 },
  });
  const fillPct = interpolate(grow, [0, 1], [0, activation * 100]);
  const value = interpolate(grow, [0, 1], [0, activation]);
  const opacity = interpolate(local, [0, 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, opacity }}>
      <div
        style={{
          width: 270,
          fontFamily: FONTS.mono,
          fontSize: 22,
          color: COLORS.textSecondary,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {label}
      </div>
      <div
        style={{
          position: 'relative',
          height: 12,
          flex: 1,
          borderRadius: 999,
          border: `1px solid ${COLORS.borderSubtle}`,
          background: COLORS.glass,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${fillPct}%`,
            borderRadius: 999,
            background: `linear-gradient(90deg, ${COLORS.accentSoft}, ${COLORS.accent})`,
            boxShadow: `0 0 16px -2px ${COLORS.accent}`,
          }}
        />
      </div>
      <div
        style={{
          width: 64,
          textAlign: 'right',
          fontFamily: FONTS.mono,
          fontSize: 22,
          color: COLORS.accent,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value.toFixed(2)}
      </div>
    </div>
  );
};

/**
 * Persistent HUD chrome, on screen for the WHOLE film — a thin always-present
 * frame that signals "one continuous piece." Corner ticks, plus a bottom footer
 * holding a live pulse-dot + wordmark on the left and a progress rail filling
 * the rest. Deliberately lives along the bottom so it never collides with the
 * segment headlines at the top. Subtle on purpose.
 *
 * Rendered once at the top level of Full / Glass (not in standalone previews).
 * `chapters` is accepted for compatibility but no longer drawn (the page
 * counter was removed).
 */
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, FONTS } from '../theme';

export type Chapter = { label: string; start: number };

const Tick: React.FC<{ pos: React.CSSProperties }> = ({ pos }) => (
  <div style={{ position: 'absolute', width: 22, height: 22, ...pos }} />
);

export const Hud: React.FC<{ chapters?: Chapter[]; total: number; tone?: string }> = ({
  total,
  tone = COLORS.accent,
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [0, total], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const pulse = 0.4 + 0.6 * Math.abs(Math.sin(frame * 0.07));
  const hudO = interpolate(frame, [0, 18, total - 18, total], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const edge = `1px solid ${COLORS.borderStrong}`;

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity: hudO * 0.85 }}>
      {/* Corner ticks */}
      <Tick pos={{ top: 40, left: 40, borderTop: edge, borderLeft: edge }} />
      <Tick pos={{ top: 40, right: 40, borderTop: edge, borderRight: edge }} />
      <Tick pos={{ bottom: 40, left: 40, borderBottom: edge, borderLeft: edge }} />
      <Tick pos={{ bottom: 40, right: 40, borderBottom: edge, borderRight: edge }} />

      {/* Bottom footer: wordmark + progress rail */}
      <div
        style={{
          position: 'absolute',
          left: 72,
          right: 72,
          bottom: 54,
          display: 'flex',
          alignItems: 'center',
          gap: 20,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 11,
            fontFamily: FONTS.mono,
            fontSize: 16,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: COLORS.textMuted,
            whiteSpace: 'nowrap',
          }}
        >
          <span
            style={{
              width: 9,
              height: 9,
              borderRadius: '50%',
              background: tone,
              opacity: pulse,
              boxShadow: `0 0 10px ${tone}`,
            }}
          />
          ShifaMind
        </div>
        <div style={{ position: 'relative', flex: 1, height: 2 }}>
          <div style={{ position: 'absolute', inset: 0, background: COLORS.borderSubtle }} />
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: `${progress * 100}%`,
              background: `linear-gradient(90deg, ${tone}66, ${tone})`,
              boxShadow: `0 0 10px ${tone}`,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

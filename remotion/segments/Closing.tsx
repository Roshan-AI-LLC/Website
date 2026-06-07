/**
 * Segment 10 · SIGN-OFF / CTA. Logo over the glow, a teal divider draws in,
 * then the debut call to action. [All audiences: where to go next]
 *
 * Sound slot: the signature tone resolves and decays to silence.
 */
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, FONTS } from '../theme';
import { TealGlow } from '../components/TealGlow';
import { Logo } from '../components/Logo';

export const Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoIn = spring({ frame, fps, config: { damping: 18, stiffness: 110, mass: 0.8 } });
  const scale = interpolate(logoIn, [0, 1], [0.7, 1]);
  const logoOpacity = interpolate(frame, [0, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const glow = interpolate(frame, [0, 30], [0, 0.5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const dividerW = interpolate(frame, [34, 60], [0, 360], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const ctaOpacity = interpolate(frame, [62, 82], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const subOpacity = interpolate(frame, [82, 100], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <TealGlow x="50%" y="42%" size={900} opacity={glow} />

      <div style={{ opacity: logoOpacity, transform: `scale(${scale})` }}>
        <Logo size={150} />
      </div>

      <div
        style={{
          opacity: logoOpacity,
          marginTop: 20,
          fontFamily: FONTS.display,
          fontSize: 44,
          fontWeight: 600,
          color: COLORS.textPrimary,
          letterSpacing: '-0.01em',
        }}
      >
        ShifaMind{' '}
        <span style={{ color: COLORS.textMuted, fontWeight: 400, fontSize: 28 }}>by Roshan AI</span>
      </div>

      <div
        style={{
          width: dividerW,
          height: 2,
          marginTop: 34,
          background: `linear-gradient(90deg, transparent, ${COLORS.accent}, transparent)`,
          boxShadow: `0 0 12px ${COLORS.accent}`,
        }}
      />

      <div
        style={{
          opacity: ctaOpacity,
          marginTop: 32,
          fontFamily: FONTS.display,
          fontSize: 50,
          fontWeight: 600,
          color: COLORS.accent,
          letterSpacing: '0.01em',
          textShadow: `0 0 50px ${COLORS.accentSoft}`,
        }}
      >
        roshan-ai.com
      </div>

      <div
        style={{
          opacity: subOpacity,
          marginTop: 18,
          fontFamily: FONTS.mono,
          fontSize: 22,
          letterSpacing: '0.06em',
          color: COLORS.textSecondary,
        }}
      >
        Read the paper · Request access
      </div>
    </AbsoluteFill>
  );
};

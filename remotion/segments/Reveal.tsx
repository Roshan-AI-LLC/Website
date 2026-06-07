/**
 * Segment 4 · REVEAL. ShifaMind resolves over the glow: interpretable AND
 * state-of-the-art, framed as the flagship of the Roshan AI platform.
 * [All audiences: the turn]
 *
 * Sound slot: the signature impact + a held tone on the logo.
 */
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { COLORS, FONTS } from '../theme';
import { RevealText } from '../components/RevealText';
import { TealGlow } from '../components/TealGlow';
import { Logo } from '../components/Logo';

export const Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoIn = spring({ frame, fps, config: { damping: 16, stiffness: 120, mass: 0.8 } });
  const scale = interpolate(logoIn, [0, 1], [0.55, 1]);
  const logoOpacity = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const glow = interpolate(frame, [0, 26], [0, 0.6], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <TealGlow x="50%" y="40%" size={820} opacity={glow} />

      <div style={{ opacity: logoOpacity, transform: `scale(${scale})` }}>
        <Logo size={200} />
      </div>

      <RevealText
        appearAt={18}
        style={{
          fontFamily: FONTS.display,
          fontSize: 100,
          fontWeight: 700,
          color: COLORS.textPrimary,
          letterSpacing: '-0.02em',
          marginTop: 14,
        }}
      >
        ShifaMind
      </RevealText>

      <RevealText
        appearAt={34}
        style={{
          fontFamily: FONTS.body,
          fontSize: 38,
          color: COLORS.textPrimary,
          marginTop: 18,
        }}
      >
        Concept-grounded clinical coding.
      </RevealText>

      <RevealText
        appearAt={50}
        style={{
          fontFamily: FONTS.body,
          fontSize: 30,
          color: COLORS.accent,
          marginTop: 10,
          fontWeight: 500,
        }}
      >
        Interpretable. And state-of-the-art.
      </RevealText>

      <RevealText
        appearAt={84}
        style={{
          fontFamily: FONTS.mono,
          fontSize: 19,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: COLORS.textMuted,
          marginTop: 40,
          paddingLeft: '0.22em',
        }}
      >
        Flagship model · Roshan AI platform
      </RevealText>
    </AbsoluteFill>
  );
};

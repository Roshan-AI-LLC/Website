/**
 * Segment 3 · REVEAL - the logo resolves at center over a teal glow, with
 * the name and tagline beneath.
 */
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { COLORS, FONTS } from '../theme';
import { Stage } from '../components/Stage';
import { TealGlow } from '../components/TealGlow';
import { RevealText } from '../components/RevealText';
import { Logo } from '../components/Logo';

export const Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoIn = spring({ frame, fps, config: { damping: 18, stiffness: 110, mass: 0.8 } });
  const scale = interpolate(logoIn, [0, 1], [0.6, 1]);
  const logoOpacity = interpolate(frame, [0, 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const glowOpacity = interpolate(frame, [0, 30], [0, 0.55], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <Stage>
      <TealGlow x="50%" y="42%" size={900} opacity={glowOpacity} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            opacity: logoOpacity,
            transform: `scale(${scale})`,
            marginBottom: 8,
          }}
        >
          <Logo size={230} />
        </div>

        <RevealText
          appearAt={22}
          style={{
            fontFamily: FONTS.display,
            fontSize: 96,
            fontWeight: 700,
            color: COLORS.textPrimary,
            letterSpacing: '-0.02em',
            marginTop: 10,
          }}
        >
          ShifaMind
        </RevealText>

        <RevealText
          appearAt={40}
          style={{
            fontFamily: FONTS.body,
            fontSize: 36,
            color: COLORS.textSecondary,
            marginTop: 18,
          }}
        >
          Concept-grounded clinical coding.
        </RevealText>
      </AbsoluteFill>
    </Stage>
  );
};

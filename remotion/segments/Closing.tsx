/**
 * Segment 8 · CLOSING - logo over a teal glow, a thin teal divider draws
 * in, then the URL.
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
import { Logo } from '../components/Logo';

export const Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoIn = spring({ frame, fps, config: { damping: 18, stiffness: 110, mass: 0.8 } });
  const scale = interpolate(logoIn, [0, 1], [0.7, 1]);
  const logoOpacity = interpolate(frame, [0, 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const glow = interpolate(frame, [0, 30], [0, 0.5], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const dividerW = interpolate(frame, [34, 60], [0, 340], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const urlOpacity = interpolate(frame, [64, 84], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <Stage>
      <TealGlow x="50%" y="44%" size={950} opacity={glow} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ opacity: logoOpacity, transform: `scale(${scale})` }}>
          <Logo size={180} />
        </div>

        <div
          style={{
            width: dividerW,
            height: 2,
            marginTop: 40,
            background: `linear-gradient(90deg, transparent, ${COLORS.accent}, transparent)`,
            boxShadow: `0 0 12px ${COLORS.accent}`,
          }}
        />

        <div
          style={{
            opacity: urlOpacity,
            marginTop: 34,
            fontFamily: FONTS.display,
            fontSize: 48,
            fontWeight: 600,
            color: COLORS.accent,
            letterSpacing: '0.01em',
            textShadow: `0 0 50px ${COLORS.accentSoft}`,
          }}
        >
          roshan-ai.com
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

/**
 * Segment 3 · THE FALSE CHOICE. Frontier LLMs are powerful but opaque;
 * research models are interpretable but inaccurate. Until now you had to
 * pick one. [Researchers + investors: frames the white space]
 *
 * Sound slot: two soft impacts as the panels land, a beat before the verdict.
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

const Panel: React.FC<{
  appearAt: number;
  fromX: number;
  label: string;
  head: string;
  sub: string;
}> = ({ appearAt, fromX, label, head, sub }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - appearAt;
  const s = spring({ frame: local, fps, config: { damping: 22, stiffness: 90, mass: 0.9 } });
  const opacity = interpolate(local, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const x = interpolate(s, [0, 1], [fromX, 0]);

  return (
    <div
      style={{
        flex: 1,
        opacity,
        transform: `translateX(${x}px)`,
        padding: '48px 46px',
        borderRadius: 24,
        background: COLORS.glass,
        border: `1px solid ${COLORS.borderSubtle}`,
        height: 430,
      }}
    >
      <div
        style={{
          fontFamily: FONTS.mono,
          fontSize: 20,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: COLORS.textMuted,
        }}
      >
        {label}
      </div>
      <div
        style={{
          marginTop: 40,
          fontFamily: FONTS.display,
          fontSize: 44,
          fontWeight: 600,
          color: COLORS.textPrimary,
          letterSpacing: '-0.02em',
          lineHeight: 1.12,
        }}
      >
        {head}
      </div>
      <div style={{ marginTop: 22, fontSize: 28, color: COLORS.textSecondary, lineHeight: 1.4 }}>
        {sub}
      </div>
    </div>
  );
};

export const Gap: React.FC = () => {
  return (
    <AbsoluteFill style={{ justifyContent: 'center', padding: '0 120px' }}>
      <RevealText
        appearAt={2}
        style={{
          fontFamily: FONTS.mono,
          fontSize: 20,
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: COLORS.textMuted,
          textAlign: 'center',
          marginBottom: 40,
          paddingLeft: '0.32em',
        }}
      >
        The trade-off
      </RevealText>

      <div style={{ display: 'flex', gap: 48 }}>
        <Panel
          appearAt={6}
          fromX={-40}
          label="Frontier LLMs"
          head="Powerful, but a black box."
          sub="No explainability. No audit trail."
        />
        <Panel
          appearAt={20}
          fromX={40}
          label="Research models"
          head="Interpretable, but inaccurate."
          sub="Not deployable in production."
        />
      </div>

      <RevealText
        appearAt={60}
        style={{
          marginTop: 56,
          textAlign: 'center',
          fontFamily: FONTS.display,
          fontSize: 54,
          fontWeight: 700,
          color: COLORS.textPrimary,
          letterSpacing: '-0.02em',
        }}
      >
        You had to choose. No one delivered <span style={{ color: COLORS.accent }}>both</span>.
      </RevealText>
    </AbsoluteFill>
  );
};

/**
 * Segment 2 · THE GAP — two glass panels reveal sequentially, then the
 * verdict line beneath: no system delivers both.
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

const Panel: React.FC<{
  appearAt: number;
  fromX: number;
  label: string;
  lines: string[];
}> = ({ appearAt, fromX, label, lines }) => {
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
        padding: '46px 44px',
        borderRadius: 24,
        background: COLORS.glass,
        border: `1px solid ${COLORS.borderSubtle}`,
        height: 420,
      }}
    >
      <div
        style={{
          fontFamily: FONTS.mono,
          fontSize: 20,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: COLORS.accent,
        }}
      >
        {label}
      </div>
      <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div
          style={{
            fontFamily: FONTS.display,
            fontSize: 42,
            fontWeight: 600,
            color: COLORS.textPrimary,
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
          }}
        >
          {lines[0]}
        </div>
        <div style={{ fontSize: 28, color: COLORS.textSecondary, lineHeight: 1.4 }}>
          {lines[1]}
        </div>
      </div>
    </div>
  );
};

export const Gap: React.FC = () => {
  return (
    <Stage>
      <TealGlow x="50%" y="50%" size={1200} opacity={0.1} />
      <AbsoluteFill style={{ justifyContent: 'center', padding: '0 120px' }}>
        <div style={{ display: 'flex', gap: 48 }}>
          <Panel
            appearAt={6}
            fromX={-40}
            label="Frontier LLMs"
            lines={['Powerful — but a black box.', 'No explainability. No audit trail.']}
          />
          <Panel
            appearAt={34}
            fromX={40}
            label="Research models"
            lines={['Interpretable — but inaccurate.', 'Not deployable in production.']}
          />
        </div>

        <RevealText
          appearAt={92}
          style={{
            marginTop: 60,
            textAlign: 'center',
            fontFamily: FONTS.display,
            fontSize: 56,
            fontWeight: 700,
            color: COLORS.textPrimary,
            letterSpacing: '-0.02em',
          }}
        >
          No system delivers <span style={{ color: COLORS.accent }}>both</span>.
        </RevealText>
      </AbsoluteFill>
    </Stage>
  );
};

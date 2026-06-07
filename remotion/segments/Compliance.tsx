/**
 * Segment 7 · COMPLIANCE / DEPLOYMENT - four deployment guarantees reveal
 * as compact glass cards.
 */
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { COLORS, FONTS } from '../theme';
import { TealGlow } from '../components/TealGlow';
import { RevealText } from '../components/RevealText';

const POINTS = [
  { big: 'Compact', title: 'by design', body: 'A base-size clinical encoder, not a frontier-scale LLM.' },
  { big: 'On-prem', title: 'deployment', body: 'Runs fully on-premise. Minimal compute.' },
  { big: 'HIPAA', title: 'ready', body: 'Your data never trains our models.' },
  { big: 'Traceable', title: 'end to end', body: 'Every prediction tied to its concept evidence.' },
];

const Card: React.FC<{ index: number }> = ({ index }) => {
  const p = POINTS[index];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - 16 - index * 14;
  const s = spring({ frame: local, fps, config: { damping: 22, stiffness: 100, mass: 0.8 } });
  const opacity = interpolate(local, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const y = interpolate(s, [0, 1], [26, 0]);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px)`,
        padding: '40px 44px',
        borderRadius: 22,
        background: COLORS.glass,
        border: `1px solid ${COLORS.borderSubtle}`,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
        <span
          style={{
            fontFamily: FONTS.display,
            fontSize: 56,
            fontWeight: 700,
            color: COLORS.accent,
            letterSpacing: '-0.02em',
          }}
        >
          {p.big}
        </span>
        <span style={{ fontFamily: FONTS.mono, fontSize: 22, color: COLORS.textMuted }}>
          {p.title}
        </span>
      </div>
      <div style={{ fontSize: 28, color: COLORS.textSecondary, lineHeight: 1.35 }}>
        {p.body}
      </div>
    </div>
  );
};

export const Compliance: React.FC = () => {
  return (
    <AbsoluteFill>
      <TealGlow x="50%" y="50%" size={1200} opacity={0.1} />
      <AbsoluteFill style={{ padding: '90px 120px', justifyContent: 'center' }}>
        <RevealText
          appearAt={4}
          style={{
            fontFamily: FONTS.display,
            fontSize: 52,
            fontWeight: 700,
            color: COLORS.textPrimary,
            letterSpacing: '-0.02em',
            marginBottom: 44,
          }}
        >
          Built to deploy in the real world.
        </RevealText>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 32,
          }}
        >
          {POINTS.map((_, i) => (
            <Card key={POINTS[i].big} index={i} />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

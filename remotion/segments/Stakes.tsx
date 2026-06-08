/**
 * Segment · STAKES ("why now"). Three cited facts, with the figures counting
 * up as each row lands. Every number carries an on-screen source.
 * [Investors + all: urgency]
 */
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, FONTS } from '../theme';
import { RevealText } from '../components/RevealText';

type Stat = {
  prefix?: string;
  to?: number;
  suffix?: string;
  text?: string; // non-numeric (no count-up)
  rest: string;
  src: string;
};

const STATS: Stat[] = [
  { prefix: '$', to: 262, suffix: 'B', rest: 'in U.S. medical claims were denied in 2024.', src: 'Change Healthcare' },
  { to: 30, suffix: '%', rest: 'gap in the certified medical-coding workforce.', src: 'American Medical Association' },
  { text: 'Aug 2026', rest: "the EU AI Act's high-risk rules take effect.", src: 'European Commission' },
];

const Row: React.FC<{ index: number }> = ({ index }) => {
  const s = STATS[index];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const appearAt = 12 + index * 28;
  const sp = spring({ frame: frame - appearAt, fps, config: { damping: 26, stiffness: 70, mass: 1 } });

  const big =
    s.text ?? `${s.prefix ?? ''}${Math.round(interpolate(sp, [0, 1], [0, s.to ?? 0]))}${s.suffix ?? ''}`;

  return (
    <RevealText appearAt={appearAt} y={24}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
        <div
          style={{
            width: 420,
            textAlign: 'right',
            fontFamily: FONTS.display,
            fontSize: 76,
            fontWeight: 700,
            color: COLORS.accent,
            letterSpacing: '-0.03em',
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
            textShadow: `0 0 50px ${COLORS.accentSoft}`,
          }}
        >
          {big}
        </div>
        <div style={{ width: 2, height: 78, background: COLORS.borderTeal }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontFamily: FONTS.body, fontSize: 36, color: COLORS.textPrimary, lineHeight: 1.2 }}>
            {s.rest}
          </div>
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 17,
              letterSpacing: '0.06em',
              color: COLORS.textMuted,
            }}
          >
            Source: {s.src}
          </div>
        </div>
      </div>
    </RevealText>
  );
};

export const Stakes: React.FC = () => {
  return (
    <AbsoluteFill style={{ justifyContent: 'center', padding: '0 200px' }}>
      <RevealText
        appearAt={4}
        style={{
          fontFamily: FONTS.mono,
          fontSize: 20,
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: COLORS.textMuted,
          marginBottom: 60,
          paddingLeft: '0.32em',
        }}
      >
        Why now
      </RevealText>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 46 }}>
        {STATS.map((_, i) => (
          <Row key={i} index={i} />
        ))}
      </div>

      <RevealText
        appearAt={132}
        style={{
          marginTop: 72,
          fontFamily: FONTS.display,
          fontSize: 54,
          fontWeight: 700,
          color: COLORS.textPrimary,
          letterSpacing: '-0.02em',
        }}
      >
        Explainability isn't optional anymore.{' '}
        <span style={{ color: COLORS.accent }}>It's the law.</span>
      </RevealText>
    </AbsoluteFill>
  );
};

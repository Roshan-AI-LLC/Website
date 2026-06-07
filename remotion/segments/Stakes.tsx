/**
 * Segment 2 · STAKES. Why this matters now: denials, the coder shortage, and
 * the regulatory turn. Lands the "explainability is the law" tailwind.
 * [Investors: market + regulation. All: urgency]
 *
 * Sound slot: a tick on each stat row, a swell under the closing law line.
 */
import { AbsoluteFill } from 'remotion';
import { COLORS, FONTS } from '../theme';
import { RevealText } from '../components/RevealText';

const STATS: { big: string; rest: string }[] = [
  { big: '12%', rest: 'of medical claims are denied.' },
  { big: '30%', rest: 'shortage of certified clinical coders.' },
  { big: 'Aug 2026', rest: 'the EU AI Act makes healthcare AI high-risk.' },
];

const Row: React.FC<{ index: number }> = ({ index }) => {
  const s = STATS[index];
  return (
    <RevealText appearAt={10 + index * 30} y={26}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 34 }}>
        <div
          style={{
            minWidth: 320,
            textAlign: 'right',
            fontFamily: FONTS.display,
            fontSize: 84,
            fontWeight: 700,
            color: COLORS.accent,
            letterSpacing: '-0.03em',
            lineHeight: 1,
            textShadow: `0 0 60px ${COLORS.accentSoft}`,
          }}
        >
          {s.big}
        </div>
        <div
          style={{
            fontFamily: FONTS.body,
            fontSize: 38,
            color: COLORS.textSecondary,
            lineHeight: 1.2,
          }}
        >
          {s.rest}
        </div>
      </div>
    </RevealText>
  );
};

export const Stakes: React.FC = () => {
  return (
    <AbsoluteFill style={{ justifyContent: 'center', padding: '0 150px' }}>
      <RevealText
        appearAt={4}
        style={{
          fontFamily: FONTS.mono,
          fontSize: 20,
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: COLORS.textMuted,
          marginBottom: 56,
          paddingLeft: '0.32em',
        }}
      >
        Why now
      </RevealText>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
        {STATS.map((_, i) => (
          <Row key={i} index={i} />
        ))}
      </div>

      <RevealText
        appearAt={130}
        style={{
          marginTop: 70,
          fontFamily: FONTS.display,
          fontSize: 56,
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

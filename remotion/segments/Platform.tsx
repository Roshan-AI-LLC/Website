/**
 * Segment 9 · THE PLATFORM. ShifaMind is the flagship, not the whole company:
 * the Roshan AI platform is one concept-reasoning layer powering many clinical
 * models. [Investors: this is a company, not a feature]
 *
 * Sound slot: rising tones as each product node lights, a low bed on the bar.
 */
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, FONTS } from '../theme';
import { RevealText } from '../components/RevealText';

const PRODUCTS = [
  { name: 'ShifaMind', desc: 'Clinical coding', active: true },
  { name: 'NabzGraph', desc: 'ICU knowledge graphs', active: false },
  { name: 'In development', desc: 'More clinical reasoning', dashed: true },
];

const Node: React.FC<{ index: number }> = ({ index }) => {
  const p = PRODUCTS[index];
  const frame = useCurrentFrame();
  const appearAt = 30 + index * 16;
  const o = interpolate(frame, [appearAt, appearAt + 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const y = interpolate(frame, [appearAt, appearAt + 16], [22, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        flex: 1,
        opacity: o,
        transform: `translateY(${y}px)`,
        padding: '32px 30px',
        borderRadius: 18,
        background: p.active ? COLORS.accentSoft : COLORS.glass,
        border: p.dashed
          ? `1px dashed ${COLORS.borderStrong}`
          : `1px solid ${p.active ? COLORS.borderTeal : COLORS.borderSubtle}`,
        boxShadow: p.active ? `0 0 40px -10px ${COLORS.accent}` : undefined,
      }}
    >
      <div
        style={{
          fontFamily: FONTS.display,
          fontSize: 36,
          fontWeight: 600,
          letterSpacing: '-0.02em',
          color: p.active ? COLORS.accent : COLORS.textPrimary,
        }}
      >
        {p.name}
      </div>
      <div style={{ marginTop: 8, fontSize: 23, color: COLORS.textMuted }}>{p.desc}</div>
    </div>
  );
};

export const Platform: React.FC = () => {
  const frame = useCurrentFrame();
  const barW = interpolate(frame, [78, 104], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ justifyContent: 'center', padding: '0 140px' }}>
      <RevealText
        appearAt={2}
        style={{
          fontFamily: FONTS.mono,
          fontSize: 20,
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: COLORS.textMuted,
          marginBottom: 18,
          paddingLeft: '0.32em',
        }}
      >
        The platform
      </RevealText>
      <RevealText
        appearAt={8}
        style={{
          fontFamily: FONTS.display,
          fontSize: 60,
          fontWeight: 700,
          color: COLORS.textPrimary,
          letterSpacing: '-0.02em',
          marginBottom: 44,
        }}
      >
        ShifaMind is just the first.
      </RevealText>

      <div style={{ display: 'flex', gap: 28 }}>
        {PRODUCTS.map((_, i) => (
          <Node key={i} index={i} />
        ))}
      </div>

      {/* Platform bar */}
      <div
        style={{
          marginTop: 26,
          height: 76,
          borderRadius: 16,
          background: `linear-gradient(90deg, ${COLORS.accentSofter}, ${COLORS.accentSoft})`,
          border: `1px solid ${COLORS.borderTeal}`,
          width: `${barW}%`,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 30,
        }}
      >
        <span
          style={{
            whiteSpace: 'nowrap',
            fontFamily: FONTS.mono,
            fontSize: 24,
            letterSpacing: '0.04em',
            color: COLORS.accent,
            opacity: interpolate(frame, [96, 112], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          Roshan AI platform · one concept-reasoning layer
        </span>
      </div>

      <RevealText
        appearAt={118}
        style={{
          marginTop: 28,
          fontFamily: FONTS.body,
          fontSize: 28,
          color: COLORS.textSecondary,
          textAlign: 'center',
        }}
      >
        Same contract. Same audit trail. Every model explainable by construction.
      </RevealText>
    </AbsoluteFill>
  );
};

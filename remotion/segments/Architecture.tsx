/**
 * Segment 5 · HOW IT WORKS (the MCB). The signature credibility beat: a note
 * on the left, the 160-concept bottleneck in the middle, ICD-10 codes on the
 * right, with animated connectors showing that ALL prediction signal is
 * forced through the concept layer. Names the architecture.
 * [Researchers: novelty. Clinicians: trust by construction]
 *
 * Sound slot: a soft "flow" whoosh as the connectors travel, a tick as each
 * code resolves.
 */
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, FONTS } from '../theme';
import { RevealText } from '../components/RevealText';

// Anchor geometry in the 1920x1080 space.
const NOTE = { right: 560, ys: [470, 560, 650] };
const CONCEPTS: { label: string; y: number }[] = [
  { label: 'orthopnea', y: 372 },
  { label: 'lower_extremity_edema', y: 444 },
  { label: 'bnp_elevation', y: 516 },
  { label: 'dyspnea', y: 588 },
  { label: 'pulmonary_congestion', y: 660 },
  { label: 'weight_gain', y: 732 },
];
const CONCEPT_LEFT = 812;
const CONCEPT_RIGHT = 1092;
const CODES: { code: string; y: number }[] = [
  { code: 'I50.23', y: 470 },
  { code: 'J91.8', y: 575 },
  { code: 'I10', y: 660 },
];
const CODE_LEFT = 1440;

// note phrase -> concept indices
const A_LINKS: [number, number][] = [
  [0, 0], [0, 1], [1, 2], [1, 3], [2, 4], [2, 5],
];
// concept index -> code index (everything routes through concepts first)
const B_LINKS: [number, number][] = [
  [0, 0], [1, 0], [2, 0], [3, 1], [4, 1], [5, 2],
];

const Connector: React.FC<{
  x1: number; y1: number; x2: number; y2: number; appearAt: number;
}> = ({ x1, y1, x2, y2, appearAt }) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [appearAt, appearAt + 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const dx = (x2 - x1) * 0.5;
  const d = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
  // Traveling pulse, only after the line is drawn.
  const pulseOffset = -((frame * 0.018) % 1);

  return (
    <>
      <path
        d={d}
        pathLength={1}
        fill="none"
        stroke={COLORS.accent}
        strokeWidth={1.5}
        strokeOpacity={0.28}
        strokeDasharray={1}
        strokeDashoffset={1 - draw}
      />
      {draw >= 1 && (
        <path
          d={d}
          pathLength={1}
          fill="none"
          stroke={COLORS.accentStrong}
          strokeWidth={2.5}
          strokeOpacity={0.9}
          strokeDasharray="0.1 0.9"
          strokeDashoffset={pulseOffset}
        />
      )}
    </>
  );
};

const Pill: React.FC<{ label: string; y: number; appearAt: number }> = ({
  label,
  y,
  appearAt,
}) => {
  const frame = useCurrentFrame();
  const a = interpolate(frame, [appearAt, appearAt + 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        position: 'absolute',
        left: CONCEPT_LEFT,
        top: y,
        width: CONCEPT_RIGHT - CONCEPT_LEFT,
        height: 50,
        transform: 'translateY(-50%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        fontFamily: FONTS.mono,
        fontSize: 19,
        color: `rgba(255,255,255,${0.5 + 0.44 * a})`,
        background: `rgba(78,205,196,${0.05 + 0.12 * a})`,
        border: `1px solid rgba(78,205,196,${0.18 + 0.32 * a})`,
        boxShadow: a > 0.6 ? `0 0 22px -6px ${COLORS.accent}` : undefined,
        opacity: interpolate(frame, [appearAt - 6, appearAt + 4], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        }),
      }}
    >
      {label}
    </div>
  );
};

const CodeChip: React.FC<{ code: string; y: number; appearAt: number; primary?: boolean }> = ({
  code,
  y,
  appearAt,
  primary,
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [appearAt, appearAt + 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const x = interpolate(frame, [appearAt, appearAt + 14], [16, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        position: 'absolute',
        left: CODE_LEFT,
        top: y,
        transform: `translateY(-50%) translateX(${x}px)`,
        opacity: o,
        display: 'flex',
        alignItems: 'center',
        padding: primary ? '12px 22px' : '9px 18px',
        borderRadius: 12,
        fontFamily: FONTS.mono,
        fontSize: primary ? 34 : 26,
        fontWeight: 600,
        color: COLORS.accent,
        background: COLORS.accentSoft,
        border: `1px solid ${primary ? COLORS.borderTeal : 'rgba(78,205,196,0.25)'}`,
        boxShadow: primary ? `0 0 30px -8px ${COLORS.accent}` : undefined,
      }}
    >
      {code}
    </div>
  );
};

export const Architecture: React.FC = () => {
  const frame = useCurrentFrame();
  const bracketO = interpolate(frame, [40, 70], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      {/* Headline */}
      <div style={{ position: 'absolute', top: 70, left: 130, right: 130 }}>
        <RevealText
          appearAt={2}
          style={{
            fontFamily: FONTS.mono,
            fontSize: 20,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: COLORS.accent,
            paddingLeft: '0.3em',
          }}
        >
          How it works
        </RevealText>
        <RevealText
          appearAt={8}
          style={{
            marginTop: 12,
            fontFamily: FONTS.display,
            fontSize: 50,
            fontWeight: 700,
            color: COLORS.textPrimary,
            letterSpacing: '-0.02em',
          }}
        >
          Every prediction flows through a concept bottleneck.
        </RevealText>
      </div>

      {/* Connectors (behind nodes) */}
      <AbsoluteFill>
        <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0 }}>
          {A_LINKS.map(([n, c], i) => (
            <Connector
              key={`a${i}`}
              x1={NOTE.right}
              y1={NOTE.ys[n]}
              x2={CONCEPT_LEFT}
              y2={CONCEPTS[c].y}
              appearAt={42 + i * 5}
            />
          ))}
          {B_LINKS.map(([c, cd], i) => (
            <Connector
              key={`b${i}`}
              x1={CONCEPT_RIGHT}
              y1={CONCEPTS[c].y}
              x2={CODE_LEFT}
              y2={CODES[cd].y}
              appearAt={96 + i * 5}
            />
          ))}
        </svg>
      </AbsoluteFill>

      {/* Note card */}
      <div
        style={{
          position: 'absolute',
          left: 130,
          top: 360,
          width: 430,
          height: 360,
          opacity: interpolate(frame, [10, 24], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          transform: `translateY(${interpolate(frame, [10, 26], [16, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}px)`,
          padding: 28,
          borderRadius: 18,
          background: COLORS.glass,
          border: `1px solid ${COLORS.borderSubtle}`,
        }}
      >
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 15,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: COLORS.textMuted,
            }}
          >
            clinical note
          </div>
          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 13 }}>
            {[
              { t: 'progressive dyspnea, orthopnea', hot: true },
              { t: 'bilateral lower-extremity edema', hot: true },
              { t: 'BNP 1850, markedly elevated', hot: true },
              { t: 'started IV furosemide 80 mg', hot: false },
            ].map((row, i) => (
              <div
                key={i}
                style={{
                  fontSize: 19,
                  lineHeight: 1.3,
                  padding: '6px 10px',
                  borderRadius: 7,
                  color: row.hot ? COLORS.textPrimary : COLORS.textMuted,
                  background: row.hot
                    ? `rgba(78,205,196,${interpolate(frame, [30 + i * 8, 44 + i * 8], [0, 0.16], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})`
                    : 'transparent',
                }}
              >
                {row.t}
              </div>
            ))}
          </div>
        </div>

      {/* Bottleneck bracket + concept pills */}
      <div
        style={{
          position: 'absolute',
          left: 790,
          top: 330,
          width: 324,
          height: 470,
          borderRadius: 20,
          border: `1px dashed rgba(78,205,196,${0.35 * bracketO})`,
          background: `rgba(78,205,196,${0.03 * bracketO})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 790,
          top: 296,
          width: 324,
          textAlign: 'center',
          fontFamily: FONTS.mono,
          fontSize: 17,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: COLORS.accent,
          opacity: bracketO,
        }}
      >
        MCB · 160 concepts
      </div>
      {CONCEPTS.map((c, i) => (
        <Pill key={c.label} label={c.label} y={c.y} appearAt={48 + i * 5} />
      ))}

      {/* Codes */}
      {CODES.map((c, i) => (
        <CodeChip key={c.code} code={c.code} y={c.y} appearAt={104 + i * 8} primary={i === 0} />
      ))}
      <div
        style={{
          position: 'absolute',
          left: CODE_LEFT,
          top: 360,
          fontFamily: FONTS.mono,
          fontSize: 15,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: COLORS.textMuted,
          opacity: interpolate(frame, [100, 116], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}
      >
        ICD-10 codes
      </div>

      {/* Closing lines */}
      <div style={{ position: 'absolute', bottom: 86, left: 130, right: 130 }}>
        <RevealText
          appearAt={150}
          style={{
            fontFamily: FONTS.display,
            fontSize: 38,
            fontWeight: 600,
            color: COLORS.textPrimary,
            letterSpacing: '-0.015em',
          }}
        >
          Multiplicative Concept Bottleneck (MCB).{' '}
          <span style={{ color: COLORS.textSecondary, fontWeight: 400 }}>
            160 clinical concepts. The same ones a doctor names out loud.
          </span>
        </RevealText>
        <RevealText
          appearAt={172}
          style={{
            marginTop: 14,
            fontFamily: FONTS.display,
            fontSize: 34,
            fontWeight: 600,
            color: COLORS.accent,
            letterSpacing: '-0.015em',
          }}
        >
          No code without the evidence. Explainability by construction.
        </RevealText>
      </div>
    </AbsoluteFill>
  );
};

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
import { ConceptConstellation, type LitNode } from '../components/ConceptConstellation';

// Bottleneck rendering. true = the 160-concept constellation with the 6 named
// concepts igniting (matches the GlassBox look). Set to false to revert to the
// original labeled pill column.
const USE_DOTS: boolean = true;

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
// Center column for the dot bottleneck (lit concepts sit here).
const LIT_X = (CONCEPT_LEFT + CONCEPT_RIGHT) / 2;
// Connector endpoints depend on the bottleneck style: connect to the dot column
// in 'dots' mode, or to the pill column edges in 'pills' mode.
const A_END_X = USE_DOTS ? LIT_X - 12 : CONCEPT_LEFT;
const B_START_X = USE_DOTS ? LIT_X + 12 : CONCEPT_RIGHT;
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

// A competitor "ghost path" that tries to shortcut from the note straight to a
// code, skipping the concept layer — and is blocked at the bottleneck. Makes
// "every prediction MUST flow through concepts" visible rather than asserted.
const GhostPath: React.FC = () => {
  const frame = useCurrentFrame();
  const GATE_X = 786;
  const Y = 565;
  const draw = interpolate(frame, [58, 74], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const blocked = interpolate(frame, [74, 86], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fade = interpolate(frame, [96, 116], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  if (frame < 56 || fade <= 0) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: fade, pointerEvents: 'none' }}>
      <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0 }}>
        <line
          x1={NOTE.right}
          y1={Y}
          x2={GATE_X}
          y2={Y}
          stroke="rgba(255,255,255,0.5)"
          strokeWidth={2}
          strokeDasharray="6 7"
          pathLength={1}
          strokeDashoffset={1 - draw}
        />
        {/* blocked burst at the gate */}
        <circle cx={GATE_X} cy={Y} r={6 + blocked * 26} fill="none" stroke="rgba(255,255,255,0.5)" strokeOpacity={1 - blocked} strokeWidth={2} />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: GATE_X - 150,
          top: Y - 64,
          width: 150,
          textAlign: 'right',
          opacity: blocked,
          fontFamily: FONTS.mono,
          fontSize: 16,
          letterSpacing: '0.1em',
          color: COLORS.textMuted,
        }}
      >
        ✕ no shortcut
      </div>
    </div>
  );
};

export const Architecture: React.FC = () => {
  const frame = useCurrentFrame();
  const bracketO = interpolate(frame, [30, 54], [0, 1], {
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
              x2={A_END_X}
              y2={CONCEPTS[c].y}
              appearAt={32 + i * 4}
            />
          ))}
          {B_LINKS.map(([c, cd], i) => (
            <Connector
              key={`b${i}`}
              x1={B_START_X}
              y1={CONCEPTS[c].y}
              x2={CODE_LEFT}
              y2={CODES[cd].y}
              appearAt={70 + i * 4}
            />
          ))}
        </svg>
      </AbsoluteFill>

      <GhostPath />

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
                    ? `rgba(78,205,196,${interpolate(frame, [22 + i * 6, 34 + i * 6], [0, 0.16], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})`
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
        MCB · concepts
      </div>
      {!USE_DOTS ? (
        CONCEPTS.map((c, i) => <Pill key={c.label} label={c.label} y={c.y} appearAt={36 + i * 4} />)
      ) : (
        <ConceptConstellation
          region={{ cx: LIT_X, cy: 565, rx: 150, ry: 230 }}
          lit={CONCEPTS.map((c): LitNode => ({ x: LIT_X, y: c.y, label: c.label }))}
          appearAt={20}
          igniteAt={36}
          seed={7}
          labelPlacement="top"
        />
      )}

      {/* Codes */}
      {CODES.map((c, i) => (
        <CodeChip key={c.code} code={c.code} y={c.y} appearAt={78 + i * 6} primary={i === 0} />
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
          opacity: interpolate(frame, [76, 90], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}
      >
        ICD-10 codes
      </div>

      {/* Closing lines */}
      <div style={{ position: 'absolute', bottom: 112, left: 130, right: 130 }}>
        <RevealText
          appearAt={112}
          style={{
            fontFamily: FONTS.display,
            fontSize: 38,
            fontWeight: 600,
            color: COLORS.textPrimary,
            letterSpacing: '-0.015em',
          }}
        >
          Multiplicative Concept Bottleneck (MCB).
        </RevealText>
        <RevealText
          appearAt={132}
          style={{
            marginTop: 14,
            fontFamily: FONTS.display,
            fontSize: 34,
            fontWeight: 600,
            color: COLORS.accent,
            letterSpacing: '-0.015em',
          }}
        >
          Interpretability, enforced. Not bolted on.
        </RevealText>
      </div>
    </AbsoluteFill>
  );
};

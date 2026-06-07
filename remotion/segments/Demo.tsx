/**
 * Segment 5 · DEMO — the core. A timed recreation of DemoBlock using the
 * cardiology scenario: the clinical note (left) with evidence phrases
 * highlighting in teal sequentially, concept activation bars growing in
 * (right), and the ICD-10 code card resolving with its confidence.
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
import { ConceptBar } from '../components/ConceptBar';
import { CODE, CONCEPTS, EVIDENCE_PHRASES, NOTE } from '../data/scenario';

// Local frame at which each evidence phrase lights up.
const PHRASE_APPEAR: Record<string, number> = {
  [EVIDENCE_PHRASES[0]]: 70,
  [EVIDENCE_PHRASES[1]]: 100,
  [EVIDENCE_PHRASES[2]]: 130,
};

const CONCEPTS_START = 165;
const CODE_START = 255;

type Part = { text: string; phrase: string | null };

function splitByPhrases(text: string, phrases: readonly string[]): Part[] {
  const escaped = phrases
    .slice()
    .map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .sort((a, b) => b.length - a.length);
  const re = new RegExp(`(${escaped.join('|')})`, 'gi');

  const out: Part[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push({ text: text.slice(last, m.index), phrase: null });
    // Map the matched (possibly different-cased) text back to its canonical phrase.
    const canonical = phrases.find((p) => p.toLowerCase() === m![0].toLowerCase()) ?? null;
    out.push({ text: m[0], phrase: canonical });
    last = m.index + m[0].length;
    if (m[0].length === 0) re.lastIndex++;
  }
  if (last < text.length) out.push({ text: text.slice(last), phrase: null });
  return out;
}

const Highlight: React.FC<{ part: Part }> = ({ part }) => {
  const frame = useCurrentFrame();
  if (!part.phrase) return <span>{part.text}</span>;

  const appear = PHRASE_APPEAR[part.phrase] ?? 0;
  const a = interpolate(frame, [appear, appear + 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <span
      style={{
        background: `rgba(78, 205, 196, ${0.16 * a})`,
        color: `rgba(255,255,255,${0.66 + 0.28 * a})`,
        borderRadius: 5,
        padding: '2px 5px',
        fontWeight: 500,
        boxShadow: a > 0.5 ? `inset 0 -2px 0 ${COLORS.accent}` : undefined,
      }}
    >
      {part.text}
    </span>
  );
};

const Caption: React.FC<{ start: number; end: number; children: React.ReactNode }> = ({
  start,
  end,
  children,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [start, start + 12, end - 12, end],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const y = interpolate(frame, [start, start + 14], [12, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 56,
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity,
        transform: `translateY(${y}px)`,
        fontFamily: FONTS.body,
        fontSize: 30,
        color: COLORS.textSecondary,
      }}
    >
      {children}
    </div>
  );
};

const CodeCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - CODE_START;
  const s = spring({ frame: local, fps, config: { damping: 20, stiffness: 140, mass: 0.7 } });
  const opacity = interpolate(local, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const conf = interpolate(s, [0, 1], [0, CODE.confidence]);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${interpolate(s, [0, 1], [18, 0])}px)`,
        marginTop: 28,
        padding: 24,
        borderRadius: 18,
        background: COLORS.glass,
        border: `1px solid ${COLORS.borderTeal}`,
        boxShadow: `0 0 0 1px ${COLORS.accentSofter}, 0 24px 60px -36px ${COLORS.accent}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span
          style={{
            fontFamily: FONTS.mono,
            fontSize: 30,
            fontWeight: 600,
            color: COLORS.accent,
            background: COLORS.accentSoft,
            borderRadius: 8,
            padding: '4px 12px',
          }}
        >
          {CODE.code}
        </span>
        <span
          style={{
            marginLeft: 'auto',
            fontFamily: FONTS.mono,
            fontSize: 26,
            color: COLORS.accent,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {conf.toFixed(2)}
        </span>
      </div>
      <div
        style={{
          marginTop: 14,
          fontSize: 26,
          fontWeight: 600,
          color: COLORS.textPrimary,
          lineHeight: 1.3,
        }}
      >
        {CODE.description}
      </div>
    </div>
  );
};

export const Demo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const panelIn = spring({ frame, fps, config: { damping: 22, stiffness: 90, mass: 0.9 } });
  const leftX = interpolate(panelIn, [0, 1], [-40, 0]);
  const rightX = interpolate(panelIn, [0, 1], [40, 0]);
  const panelsOpacity = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <Stage>
      <TealGlow x="50%" y="55%" size={1400} opacity={0.12} />

      <AbsoluteFill style={{ padding: '70px 90px 0' }}>
        <div
          style={{
            fontFamily: FONTS.display,
            fontSize: 30,
            fontWeight: 600,
            color: COLORS.textPrimary,
            letterSpacing: '-0.01em',
          }}
        >
          ShifaMind <span style={{ color: COLORS.textMuted, fontWeight: 400 }}>· live coding</span>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 40,
            marginTop: 34,
            opacity: panelsOpacity,
          }}
        >
          {/* Note panel */}
          <div
            style={{
              flex: 1.08,
              transform: `translateX(${leftX}px)`,
              padding: 34,
              borderRadius: 22,
              background: COLORS.glass,
              border: `1px solid ${COLORS.borderSubtle}`,
              height: 760,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontFamily: FONTS.mono,
                fontSize: 16,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: COLORS.textMuted,
              }}
            >
              <span>clinical note</span>
              <span>{NOTE.length} sections</span>
            </div>
            <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 18 }}>
              {NOTE.map((section) => {
                const parts = splitByPhrases(section.text, EVIDENCE_PHRASES);
                return (
                  <div key={section.heading}>
                    <div
                      style={{
                        fontSize: 21,
                        fontWeight: 600,
                        color: COLORS.textPrimary,
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {section.heading}
                    </div>
                    <div
                      style={{
                        marginTop: 5,
                        fontSize: 20,
                        lineHeight: 1.55,
                        color: COLORS.textSecondary,
                      }}
                    >
                      {parts.map((p, i) => (
                        <Highlight key={i} part={p} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Results panel */}
          <div
            style={{
              flex: 1,
              transform: `translateX(${rightX}px)`,
              padding: 34,
              borderRadius: 22,
              background: COLORS.glass,
              border: `1px solid ${COLORS.borderSubtle}`,
              height: 760,
            }}
          >
            <div
              style={{
                fontFamily: FONTS.mono,
                fontSize: 16,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: COLORS.textMuted,
              }}
            >
              activated concepts
            </div>
            <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 22 }}>
              {CONCEPTS.map((c, i) => (
                <ConceptBar
                  key={c.label}
                  label={c.label}
                  activation={c.activation}
                  appearAt={CONCEPTS_START + i * 16}
                />
              ))}
            </div>

            <CodeCard />
          </div>
        </div>
      </AbsoluteFill>

      <Caption start={10} end={92}>
        A real clinical note goes in.
      </Caption>
      <Caption start={96} end={246}>
        ShifaMind grounds its reading in named clinical concepts.
      </Caption>
      <Caption start={262} end={420}>
        And returns ICD-10 codes — each backed by the evidence behind it.
      </Caption>
    </Stage>
  );
};

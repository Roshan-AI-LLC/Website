/**
 * Segment · DEMO. The product, live. A real cardiology note sits on the left;
 * the HUD cursor glides in and clicks "Predict codes," which triggers the
 * evidence highlights, the concept activation bars, and the resolved ICD-10
 * code, each grounded in the note. [Clinicians: see it work]
 *
 * Absolute geometry so the cursor lands exactly on the button.
 * Sound slot: a soft UI click on PREDICT, ticks as concepts fill.
 */
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, FONTS } from '../theme';
import { ConceptBar } from '../components/ConceptBar';
import { Cursor } from '../components/Cursor';
import { CODE, CONCEPTS, EVIDENCE_PHRASES, NOTE } from '../data/scenario';

// Layout geometry (1920x1080).
const LEFT = { x: 90, y: 168, w: 880, h: 838 };
const RIGHT = { x: 1000, y: 168, w: 830, h: 838 };
const BTN = { cx: RIGHT.x + RIGHT.w / 2, cy: RIGHT.y + 430, w: 320, h: 76 };

// Timeline.
const CLICK = 80;
const PHRASE_APPEAR: Record<string, number> = {
  [EVIDENCE_PHRASES[0]]: CLICK + 26,
  [EVIDENCE_PHRASES[1]]: CLICK + 52,
  [EVIDENCE_PHRASES[2]]: CLICK + 78,
};
const CONCEPTS_START = CLICK + 96;
const CODE_START = CLICK + 180;

const cubicInOut = Easing.bezier(0.65, 0, 0.35, 1);

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

const Caption: React.FC<{ start: number; end: number; children: React.ReactNode }> = ({ start, end, children }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [start, start + 12, end - 12, end], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const y = interpolate(frame, [start, start + 14], [12, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 44,
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
  const opacity = interpolate(local, [0, 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const conf = interpolate(s, [0, 1], [0, CODE.confidence]);
  return (
    <div
      style={{
        opacity,
        transform: `translateY(${interpolate(s, [0, 1], [18, 0])}px)`,
        marginTop: 26,
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
      <div style={{ marginTop: 14, fontSize: 26, fontWeight: 600, color: COLORS.textPrimary, lineHeight: 1.3 }}>
        {CODE.description}
      </div>
    </div>
  );
};

export const Demo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const panelIn = spring({ frame, fps, config: { damping: 22, stiffness: 90, mass: 0.9 } });
  const panelsOpacity = interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const idleOpacity = interpolate(frame, [CLICK, CLICK + 12], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const resultsOpacity = interpolate(frame, [CLICK + 14, CLICK + 28], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Cursor path: glide to the button, press, then drift away and fade out.
  // Tip aims at the left of the button so the chevron body reads clearly.
  const targetX = BTN.cx - 64;
  const targetY = BTN.cy - 2;
  let cx: number;
  let cy: number;
  if (frame < 90) {
    cx = interpolate(frame, [10, 70], [1800, targetX], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: cubicInOut });
    cy = interpolate(frame, [10, 70], [1030, targetY], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: cubicInOut });
  } else {
    cx = interpolate(frame, [90, 124], [targetX, 1760], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: cubicInOut });
    cy = interpolate(frame, [90, 124], [targetY, 1010], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: cubicInOut });
  }
  const cursorHover = interpolate(frame, [54, 68, 92, 102], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cursorPress = interpolate(frame, [74, CLICK, 88], [0, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cursorOpacity = interpolate(frame, [4, 16, 112, 126], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Button press + click ripple.
  const btnPress = interpolate(frame, [74, CLICK, 88], [0, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const ripple = interpolate(frame, [CLICK, CLICK + 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill>
      {/* Title */}
      <div
        style={{
          position: 'absolute',
          left: LEFT.x,
          top: 76,
          fontFamily: FONTS.display,
          fontSize: 30,
          fontWeight: 600,
          color: COLORS.textPrimary,
          letterSpacing: '-0.01em',
        }}
      >
        ShifaMind <span style={{ color: COLORS.textMuted, fontWeight: 400 }}>· live coding</span>
      </div>

      {/* Note panel */}
      <div
        style={{
          position: 'absolute',
          left: LEFT.x,
          top: LEFT.y,
          width: LEFT.w,
          height: LEFT.h,
          opacity: panelsOpacity,
          transform: `translateX(${interpolate(panelIn, [0, 1], [-40, 0])}px)`,
          padding: 34,
          borderRadius: 22,
          background: COLORS.glass,
          border: `1px solid ${COLORS.borderSubtle}`,
          boxSizing: 'border-box',
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
        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {NOTE.map((section) => {
            const parts = splitByPhrases(section.text, EVIDENCE_PHRASES);
            return (
              <div key={section.heading}>
                <div style={{ fontSize: 21, fontWeight: 600, color: COLORS.textPrimary, letterSpacing: '-0.01em' }}>
                  {section.heading}
                </div>
                <div style={{ marginTop: 5, fontSize: 20, lineHeight: 1.5, color: COLORS.textSecondary }}>
                  {parts.map((p, i) => (
                    <Highlight key={i} part={p} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right panel */}
      <div
        style={{
          position: 'absolute',
          left: RIGHT.x,
          top: RIGHT.y,
          width: RIGHT.w,
          height: RIGHT.h,
          opacity: panelsOpacity,
          transform: `translateX(${interpolate(panelIn, [0, 1], [40, 0])}px)`,
          padding: 34,
          borderRadius: 22,
          background: COLORS.glass,
          border: `1px solid ${COLORS.borderSubtle}`,
          boxSizing: 'border-box',
        }}
      >
        {/* Idle CTA */}
        <div style={{ position: 'absolute', inset: 0, opacity: idleOpacity, pointerEvents: 'none' }}>
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 224,
              textAlign: 'center',
              fontFamily: FONTS.display,
              fontSize: 40,
              fontWeight: 600,
              color: COLORS.textPrimary,
            }}
          >
            Let's code this note.
          </div>
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 292,
              textAlign: 'center',
              fontSize: 24,
              color: COLORS.textSecondary,
            }}
          >
            Concept-grounded ICD-10 coding.
          </div>
          {/* Predict button (center at BTN.cx, BTN.cy in frame space) */}
          <div
            style={{
              position: 'absolute',
              left: RIGHT.w / 2 - BTN.w / 2,
              top: BTN.cy - RIGHT.y - BTN.h / 2,
              width: BTN.w,
              height: BTN.h,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              borderRadius: 999,
              fontFamily: FONTS.body,
              fontSize: 26,
              fontWeight: 600,
              color: COLORS.bg,
              background: `linear-gradient(135deg, ${COLORS.accentStrong}, ${COLORS.accent})`,
              boxShadow: `0 0 ${22 + 10 * cursorHover}px -8px ${COLORS.accent}`,
              transform: `scale(${1 - 0.05 * btnPress})`,
            }}
          >
            <span style={{ fontSize: 22 }}>✦</span> Predict codes
          </div>
        </div>

        {/* Click ripple */}
        {ripple > 0 && ripple < 1 && (
          <div
            style={{
              position: 'absolute',
              left: BTN.cx - RIGHT.x,
              top: BTN.cy - RIGHT.y,
              width: 0,
              height: 0,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: 40 + ripple * 320,
                height: 40 + ripple * 320,
                transform: 'translate(-50%, -50%)',
                borderRadius: '50%',
                border: `2px solid ${COLORS.accent}`,
                opacity: (1 - ripple) * 0.6,
              }}
            />
          </div>
        )}

        {/* Results */}
        <div style={{ position: 'absolute', inset: 0, padding: 34, opacity: resultsOpacity, boxSizing: 'border-box' }}>
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
              <ConceptBar key={c.label} label={c.label} activation={c.activation} appearAt={CONCEPTS_START + i * 16} />
            ))}
          </div>
          <CodeCard />
        </div>
      </div>

      <Caption start={12} end={CLICK - 2}>
        A real clinical note goes in.
      </Caption>
      <Caption start={CLICK + 20} end={CODE_START - 6}>
        ShifaMind grounds its reading in named clinical concepts.
      </Caption>
      <Caption start={CODE_START + 2} end={420}>
        And returns ICD-10 codes, each backed by the evidence.
      </Caption>

      {/* HUD cursor on top */}
      <Cursor x={cx} y={cy} hover={cursorHover} press={cursorPress} opacity={cursorOpacity} scale={2.1} />
    </AbsoluteFill>
  );
};

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

// Layout geometry (1920x1080). Panels end at y=910 so the caption band
// (bottom 88, clear of the YouTube/LinkedIn scrubber band) never overlaps them.
const LEFT = { x: 90, y: 140, w: 880, h: 770 };
const RIGHT = { x: 1000, y: 140, w: 830, h: 770 };
const BTN = { cx: RIGHT.x + RIGHT.w / 2, cy: RIGHT.y + 396, w: 320, h: 76 };

// Timeline.
const CLICK = 56;
const PHRASE_APPEAR: Record<string, number> = {
  [EVIDENCE_PHRASES[0]]: CLICK + 18,
  [EVIDENCE_PHRASES[1]]: CLICK + 34,
  [EVIDENCE_PHRASES[2]]: CLICK + 50,
};
const CONCEPTS_START = CLICK + 62;
const CODE_START = CLICK + 116;

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
        bottom: 88,
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity,
        transform: `translateY(${y}px)`,
        fontFamily: FONTS.body,
        fontSize: 32,
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

const SkeletonCard: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const shimmer = (((frame - delay) * 2.2) % 220) - 60;
  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 14,
        border: `1px solid ${COLORS.borderSubtle}`,
        background: COLORS.glass,
        padding: 18,
      }}
    >
      <div style={{ width: 64, height: 14, borderRadius: 6, background: COLORS.accentSoft }} />
      <div style={{ marginTop: 12, width: '72%', height: 12, borderRadius: 6, background: 'rgba(255,255,255,0.08)' }} />
      <div style={{ marginTop: 8, width: '46%', height: 12, borderRadius: 6, background: 'rgba(255,255,255,0.06)' }} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.07) 50%, transparent 60%)',
          transform: `translateX(${shimmer}%)`,
        }}
      />
    </div>
  );
};

export const Demo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const panelIn = spring({ frame, fps, config: { damping: 22, stiffness: 90, mass: 0.9 } });
  const panelsOpacity = interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const idleOpacity = interpolate(frame, [CLICK, CLICK + 12], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // After the click: a brief "analyzing" beat (note scan + skeleton), then results.
  const PREDICT_IN = CLICK + 10; // 90
  const PREDICT_OUT = CONCEPTS_START - 14; // ~162
  const predictingOpacity = interpolate(
    frame,
    [PREDICT_IN, PREDICT_IN + 10, PREDICT_OUT - 10, PREDICT_OUT],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const resultsOpacity = interpolate(frame, [PREDICT_OUT - 4, PREDICT_OUT + 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  // Scan line sweeping down the note while predicting.
  const scanY = interpolate(frame, [PREDICT_IN, PREDICT_OUT], [0, LEFT.h], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const scanOpacity = interpolate(
    frame,
    [PREDICT_IN, PREDICT_IN + 8, PREDICT_OUT - 10, PREDICT_OUT],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // Cursor path: glide to the button, press, then drift away and fade out.
  // Tip aims at the left of the button so the chevron body reads clearly.
  const targetX = BTN.cx - 64;
  const targetY = BTN.cy - 2;
  let cx: number;
  let cy: number;
  if (frame < 64) {
    cx = interpolate(frame, [8, 46], [1800, targetX], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: cubicInOut });
    cy = interpolate(frame, [8, 46], [1030, targetY], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: cubicInOut });
  } else {
    cx = interpolate(frame, [64, 94], [targetX, 1760], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: cubicInOut });
    cy = interpolate(frame, [64, 94], [targetY, 1010], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: cubicInOut });
  }
  const cursorHover = interpolate(frame, [34, 46, 66, 76], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cursorPress = interpolate(frame, [50, CLICK, 64], [0, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cursorOpacity = interpolate(frame, [4, 14, 86, 100], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Button press + click ripple.
  const btnPress = interpolate(frame, [50, CLICK, 64], [0, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
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
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {NOTE.map((section) => {
            const parts = splitByPhrases(section.text, EVIDENCE_PHRASES);
            return (
              <div key={section.heading}>
                <div style={{ fontSize: 20, fontWeight: 600, color: COLORS.textPrimary, letterSpacing: '-0.01em' }}>
                  {section.heading}
                </div>
                <div style={{ marginTop: 5, fontSize: 19, lineHeight: 1.45, color: COLORS.textSecondary }}>
                  {parts.map((p, i) => (
                    <Highlight key={i} part={p} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Scan line while predicting */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: scanY,
            height: 80,
            transform: 'translateY(-78px)',
            background: `linear-gradient(180deg, transparent, ${COLORS.accentSofter})`,
            opacity: scanOpacity,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: scanY,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${COLORS.accent}, transparent)`,
            boxShadow: `0 0 18px ${COLORS.accent}`,
            opacity: scanOpacity,
            pointerEvents: 'none',
          }}
        />
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

        {/* Predicting / analyzing */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            padding: 34,
            opacity: predictingOpacity,
            boxSizing: 'border-box',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              fontFamily: FONTS.mono,
              fontSize: 16,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: COLORS.accent,
            }}
          >
            <span
              style={{
                width: 9,
                height: 9,
                borderRadius: '50%',
                background: COLORS.accent,
                opacity: 0.5 + 0.5 * Math.sin(frame * 0.32),
                boxShadow: `0 0 10px ${COLORS.accent}`,
              }}
            />
            Assigning codes
          </div>
          <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 18 }}>
            {[0, 1, 2].map((i) => (
              <SkeletonCard key={i} delay={i * 6} />
            ))}
          </div>
        </div>

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
              <ConceptBar key={c.label} label={c.label} activation={c.activation} appearAt={CONCEPTS_START + i * 12} />
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
      <Caption start={CODE_START + 2} end={294}>
        And returns ICD-10 codes, each backed by the evidence.
      </Caption>

      {/* HUD cursor on top */}
      <Cursor x={cx} y={cy} hover={cursorHover} press={cursorPress} opacity={cursorOpacity} scale={2.1} />
    </AbsoluteFill>
  );
};

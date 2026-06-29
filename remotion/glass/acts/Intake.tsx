/**
 * ACT 1 — INTAKE [Predict].
 * Inside ShifaMind. The warm note (its words first appeared in Act 0) docks at
 * centre as a glass panel. A teal ScanLine sweeps top→bottom; as it passes each
 * EVIDENCE_PHRASE, the phrase ignites warm→teal (the handoff: a person's words
 * become the system's evidence). The three lit phrases then lift off as teal
 * particles and fly FORWARD (toward Act 2's lattice).
 */
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, FONTS } from '../../theme';
import { NOTE, EVIDENCE_PHRASES } from '../../data/scenario';
import { ScanLine } from '../../components/ScanLine';
import { ramp } from '../shared';

// Which note lines contain an evidence phrase (for warm→teal ignition).
const EVIDENCE_IN = (text: string): string | null => {
  for (const p of EVIDENCE_PHRASES) {
    if (text.toLowerCase().includes(p.toLowerCase().slice(0, 12))) return p;
  }
  return null;
};

const PANEL = { x: 560, y: 150, w: 800, h: 780 };

export const Intake: React.FC = () => {
  const frame = useCurrentFrame();

  // Panel docks (grows from the warm point at centre) over 0..30.
  const dock = ramp(frame, 0, 34);
  const scanP = ramp(frame, 40, 150);
  // Lift-off of lit phrases as particles, after the scan completes.
  const lift = ramp(frame, 158, 250);

  const panelScale = interpolate(dock, [0, 1], [0.2, 1]);
  const panelO = dock;

  return (
    <AbsoluteFill>
      {/* Docked note panel */}
      <div
        style={{
          position: 'absolute',
          left: PANEL.x,
          top: PANEL.y,
          width: PANEL.w,
          height: PANEL.h,
          transform: `scale(${panelScale})`,
          transformOrigin: 'center',
          opacity: panelO,
          borderRadius: 22,
          background: COLORS.glass,
          border: `1px solid ${COLORS.borderStrong}`,
          boxShadow: `0 40px 120px -60px ${COLORS.accent}`,
          overflow: 'hidden',
          padding: '40px 46px',
        }}
      >
        {/* faint header */}
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 16,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: COLORS.textMuted,
            marginBottom: 22,
          }}
        >
          intake · clinical note
        </div>

        {NOTE.map((sec, i) => {
          const ev = EVIDENCE_IN(sec.text);
          // The y-fraction of this block (approx) decides when the scan hits it.
          const blockFrac = (i + 0.5) / NOTE.length;
          const passed = scanP > blockFrac;
          const ignite = ev
            ? interpolate(scanP, [blockFrac - 0.04, blockFrac + 0.05], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              })
            : 0;
          // Lit phrase lifts off (translate up + fade in panel) as particles fly.
          const phraseLift = ev ? lift : 0;
          return (
            <div key={i} style={{ marginBottom: 18, opacity: passed ? 1 : 0.5 }}>
              <div
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 13,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: COLORS.textMuted,
                  marginBottom: 5,
                }}
              >
                {sec.heading}
              </div>
              <div
                style={{
                  fontFamily: FONTS.body,
                  fontSize: 19,
                  lineHeight: 1.5,
                  color: ev
                    ? `rgba(${igniteRGB(ignite)})`
                    : COLORS.textSecondary,
                  transform: ev ? `translateY(${-30 * phraseLift}px)` : undefined,
                  opacity: ev ? 1 - phraseLift * 0.7 : 1,
                  textShadow: ev && ignite > 0.3 ? `0 0 18px ${COLORS.accent}` : undefined,
                  background:
                    ev && ignite > 0.3
                      ? `linear-gradient(90deg, ${COLORS.accentSofter}, transparent)`
                      : undefined,
                  borderRadius: 8,
                  padding: ev ? '4px 8px' : undefined,
                  marginLeft: ev ? -8 : 0,
                }}
              >
                {sec.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* Teal scan line, clipped to the panel region */}
      <div
        style={{
          position: 'absolute',
          left: PANEL.x,
          top: PANEL.y,
          width: PANEL.w,
          height: PANEL.h,
          opacity: scanP > 0 && scanP < 1 ? 1 : 0,
        }}
      >
        <ScanLine progress={scanP} axis="y" glow={120} />
      </div>

      {/* Lit phrases lifting off as teal particles, flying forward */}
      <Particles lift={lift} />
    </AbsoluteFill>
  );
};

/** Lit evidence as bright teal chips that fly up + toward the viewer. */
const Particles: React.FC<{ lift: number }> = ({ lift }) => {
  const chips = EVIDENCE_PHRASES;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {chips.map((c, i) => {
        const x = 760 + i * 200;
        const y = interpolate(lift, [0, 1], [620, 200]);
        const scale = interpolate(lift, [0, 1], [1, 1.9]);
        const o = interpolate(lift, [0, 0.15, 0.85, 1], [0, 1, 1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return (
          <div
            key={c}
            style={{
              position: 'absolute',
              left: x,
              top: y + i * 14,
              transform: `translate(-50%, -50%) scale(${scale})`,
              opacity: o,
              fontFamily: FONTS.mono,
              fontSize: 17,
              color: COLORS.accentStrong,
              background: COLORS.accentSoft,
              border: `1px solid ${COLORS.borderTeal}`,
              borderRadius: 8,
              padding: '6px 12px',
              boxShadow: `0 0 26px -4px ${COLORS.accent}`,
              whiteSpace: 'nowrap',
            }}
          >
            {c.length > 22 ? c.slice(0, 20) + '…' : c}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** Lerp warm(human) → teal(accent) as ignite goes 0→1, returns "r,g,b". */
function igniteRGB(t: number): string {
  // human #f3c79a -> accentStrong #7de8e1
  const a = [0xf3, 0xc7, 0x9a];
  const b = [0x7d, 0xe8, 0xe1];
  const m = a.map((v, i) => Math.round(v + (b[i] - v) * t));
  return `${m[0]},${m[1]},${m[2]}`;
}

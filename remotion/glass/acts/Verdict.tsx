/**
 * ACT 3 — THE VERDICT [Explain].
 * Lit concepts converge and resolve into CODE.code (I50.23). Confidence
 * (CODE.confidence) counts up. The code is visibly HELD UP by the CONCEPTS that
 * voted (orbiting evidence chips with activation readouts). Then a fast
 * multi-specialty flash using SPECIALTIES: J44.1 and I21.4 resolve in ~1s each
 * with their own lit concepts. Hero: "Cardiology · Pulmonology · the ED".
 */
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, FONTS } from '../../theme';
import { CODE, CONCEPTS } from '../../data/scenario';
import { SPECIALTIES } from '../../data/scenarios';
import { SPRING } from '../../motion';
import { Hero } from '../Hero';

const CX = 960;
const CY = 460;

export const Verdict: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1 (0..150): the cardiology verdict resolves + concepts orbit.
  // Phase 2 (150..330): multi-specialty flash (J44.1, I21.4).
  const resolve = spring({ frame: frame - 10, fps, config: SPRING });
  const conf = interpolate(
    spring({ frame: frame - 24, fps, config: { damping: 24, stiffness: 90, mass: 1 } }),
    [0, 1],
    [0, CODE.confidence],
  );

  const phase1O = interpolate(frame, [130, 150], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      {/* PHASE 1 — primary verdict */}
      <AbsoluteFill style={{ opacity: phase1O }}>
        {/* Orbiting concept chips that "vote" */}
        {CONCEPTS.map((c, i) => {
          const ang = (i / CONCEPTS.length) * Math.PI * 2 - Math.PI / 2;
          const orbit = interpolate(resolve, [0, 1], [260, 300]);
          const wob = Math.sin(frame * 0.05 + i) * 8;
          const x = CX + Math.cos(ang) * (orbit + wob) * 1.4;
          const y = CY + Math.sin(ang) * (orbit + wob);
          const appear = interpolate(frame, [20 + i * 6, 36 + i * 6], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <div key={c.label}>
              <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                <line
                  x1={CX}
                  y1={CY}
                  x2={x}
                  y2={y}
                  stroke={COLORS.accent}
                  strokeOpacity={0.3 * appear}
                  strokeWidth={1.2}
                />
              </svg>
              <div
                style={{
                  position: 'absolute',
                  left: x,
                  top: y,
                  transform: 'translate(-50%,-50%)',
                  opacity: appear,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontFamily: FONTS.mono,
                  fontSize: 18,
                  color: COLORS.accentStrong,
                  background: COLORS.accentSoft,
                  border: `1px solid ${COLORS.borderTeal}`,
                  borderRadius: 9,
                  padding: '7px 13px',
                  whiteSpace: 'nowrap',
                }}
              >
                {c.label}
                <span style={{ color: COLORS.accent, fontVariantNumeric: 'tabular-nums' }}>
                  {c.activation.toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}

        {/* The resolved code at centre, held up by the concepts */}
        <div
          style={{
            position: 'absolute',
            left: CX,
            top: CY,
            transform: `translate(-50%,-50%) scale(${interpolate(resolve, [0, 1], [0.5, 1])})`,
            opacity: resolve,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontFamily: FONTS.display,
              fontSize: 150,
              fontWeight: 700,
              color: COLORS.textPrimary,
              letterSpacing: '-0.03em',
              textShadow: `0 0 60px ${COLORS.accentSoft}`,
            }}
          >
            {CODE.code}
          </div>
          <div style={{ fontFamily: FONTS.body, fontSize: 26, color: COLORS.textSecondary, marginTop: 4 }}>
            {CODE.description}
          </div>
          <div
            style={{
              marginTop: 18,
              fontFamily: FONTS.mono,
              fontSize: 30,
              color: COLORS.accent,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            confidence {conf.toFixed(2)}
          </div>
        </div>
      </AbsoluteFill>

      {/* PHASE 2 — multi-specialty flash */}
      {SPECIALTIES.slice(1).map((s, i) => (
        <SpecFlash key={s.code} scenario={s} appearAt={150 + i * 90} />
      ))}

      <Hero text="Cardiology · Pulmonology · the ED" appearAt={262} bottom={150} size={46} />
    </AbsoluteFill>
  );
};

const SpecFlash: React.FC<{
  scenario: (typeof SPECIALTIES)[number];
  appearAt: number;
}> = ({ scenario, appearAt }) => {
  const frame = useCurrentFrame();
  const local = frame - appearAt;
  const o = interpolate(local, [0, 12, 60, 78], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const pop = interpolate(local, [0, 16], [0.7, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{ opacity: o, alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', transform: `scale(${pop})` }}>
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 22,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: COLORS.accent,
            marginBottom: 14,
          }}
        >
          {scenario.specialty}
        </div>
        <div
          style={{
            fontFamily: FONTS.display,
            fontSize: 120,
            fontWeight: 700,
            color: COLORS.textPrimary,
            letterSpacing: '-0.03em',
          }}
        >
          {scenario.code}
        </div>
        <div style={{ fontFamily: FONTS.body, fontSize: 24, color: COLORS.textSecondary, marginTop: 6 }}>
          {scenario.desc}
        </div>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 22 }}>
          {scenario.concepts.map((c, j) => {
            const ci = interpolate(local, [14 + j * 6, 26 + j * 6], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            return (
              <div
                key={c.label}
                style={{
                  opacity: ci,
                  fontFamily: FONTS.mono,
                  fontSize: 17,
                  color: COLORS.accentStrong,
                  background: COLORS.accentSoft,
                  border: `1px solid ${COLORS.borderTeal}`,
                  borderRadius: 8,
                  padding: '6px 12px',
                }}
              >
                {c.label} {c.activation.toFixed(2)}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

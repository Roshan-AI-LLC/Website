/**
 * ACT 7 — DEPLOY + PLATFORM [Platform].
 * The machine compresses into a compact unit that drops behind a hospital's
 * walls; data stays inside. Labels: "Compact · On-prem · HIPAA · your data never
 * leaves". Then the PlatformStack assembles with "ShifaMind is the first."
 */
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, FONTS } from '../../theme';
import { PlatformStack } from '../../components/PlatformStack';
import { SPRING_SOFT } from '../../motion';
import { ramp } from '../shared';
import { Hero } from '../Hero';

const LABELS = ['Compact', 'On-prem', 'HIPAA', 'your data never leaves'];

export const Platform: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1 (0..150): the unit drops behind hospital walls.
  // Phase 2 (150..end): the platform stack.
  const drop = spring({ frame: frame - 14, fps, config: SPRING_SOFT });
  const unitY = interpolate(drop, [0, 1], [-340, 0]);
  const unitScale = interpolate(
    spring({ frame: frame - 40, fps, config: { damping: 26, stiffness: 70, mass: 1.1 } }),
    [0, 1],
    [1, 0.46],
  );
  const phase1O = interpolate(frame, [130, 150], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const phase2O = ramp(frame, 150, 174);

  return (
    <AbsoluteFill>
      {/* PHASE 1 — drop behind the walls */}
      <AbsoluteFill style={{ opacity: phase1O, alignItems: 'center', justifyContent: 'center' }}>
        {/* Hospital wall frame (data stays inside) */}
        <div
          style={{
            position: 'absolute',
            width: 760,
            height: 520,
            borderRadius: 22,
            border: `1px solid ${COLORS.borderStrong}`,
            background: 'rgba(255,255,255,0.015)',
            boxShadow: `inset 0 0 90px -30px ${COLORS.accent}`,
            opacity: ramp(frame, 6, 26),
          }}
        />
        {/* "data stays inside" perimeter glow */}
        <div
          style={{
            position: 'absolute',
            width: 760,
            height: 520,
            borderRadius: 22,
            boxShadow: `0 0 0 2px ${COLORS.accentSofter}`,
            opacity: ramp(frame, 50, 80) * 0.8,
          }}
        />

        {/* The compact unit dropping in */}
        <div
          style={{
            transform: `translateY(${unitY}px) scale(${unitScale})`,
            width: 280,
            height: 280,
            borderRadius: 20,
            background: `linear-gradient(135deg, ${COLORS.glassStrong}, ${COLORS.accentSofter})`,
            border: `1px solid ${COLORS.borderTeal}`,
            boxShadow: `0 0 70px -10px ${COLORS.accent}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: FONTS.display,
            fontSize: 34,
            fontWeight: 700,
            color: COLORS.accent,
            letterSpacing: '0.04em',
          }}
        >
          ShifaMind
        </div>

        {/* Labels */}
        <div
          style={{
            position: 'absolute',
            bottom: 230,
            display: 'flex',
            gap: 18,
          }}
        >
          {LABELS.map((l, i) => {
            const o = ramp(frame, 56 + i * 8, 56 + i * 8 + 14);
            return (
              <div
                key={l}
                style={{
                  opacity: o,
                  fontFamily: FONTS.mono,
                  fontSize: 18,
                  letterSpacing: '0.1em',
                  color: COLORS.textSecondary,
                  border: `1px solid ${COLORS.borderSubtle}`,
                  borderRadius: 999,
                  padding: '7px 16px',
                  background: COLORS.glass,
                }}
              >
                {l}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      {/* PHASE 2 — platform stack */}
      <AbsoluteFill style={{ opacity: phase2O, alignItems: 'center', justifyContent: 'center' }}>
        <PlatformStack appearAt={158} />
      </AbsoluteFill>

      <Hero text="ShifaMind is the first." appearAt={272} bottom={140} />
    </AbsoluteFill>
  );
};

/**
 * Post-context payoff: a coded claim travels to the payer's audit gate. Because
 * every ShifaMind code carries its concept evidence, the gate opens GREEN — the
 * denial that would otherwise happen doesn't. A faint red "DENIED" ghost (the
 * evidence-less alternative) dissolves behind it. This is the beat that makes
 * the film land for founders + investors: reasons become revenue.
 *
 * Self-timed from `appearAt`. ~3s.
 */
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, FONTS } from '../theme';
import { EASE } from '../motion';

const GREEN = '#5fd39a';
const RED = '#e0667a';

export const AuditGate: React.FC<{ appearAt?: number }> = ({ appearAt = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - appearAt;

  // Claim card slides from left toward the gate.
  const travel = interpolate(local, [6, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  const cardX = interpolate(travel, [0, 1], [-220, 0]);

  // Gate verdict resolves at the end of travel.
  const verdict = spring({ frame: local - 42, fps, config: { damping: 18, stiffness: 120, mass: 0.7 } });
  const approveO = interpolate(local, [44, 56], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  // Red "denied" ghost (the alternative) rises then dissolves before approval.
  const ghostO = interpolate(local, [10, 22, 40, 50], [0, 0.5, 0.5, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 60,
        }}
      >
        {/* Claim card carrying its evidence */}
        <div
          style={{
            transform: `translateX(${cardX}px)`,
            width: 320,
            padding: 26,
            borderRadius: 18,
            background: COLORS.glass,
            border: `1px solid ${COLORS.borderTeal}`,
          }}
        >
          <div style={{ fontFamily: FONTS.mono, fontSize: 15, letterSpacing: '0.14em', textTransform: 'uppercase', color: COLORS.textMuted }}>
            claim · I50.23
          </div>
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {['orthopnea', 'bnp_elevation', 'edema'].map((c) => (
              <div
                key={c}
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 16,
                  color: COLORS.accent,
                  background: COLORS.accentSoft,
                  borderRadius: 7,
                  padding: '5px 10px',
                }}
              >
                ✓ {c}
              </div>
            ))}
          </div>
        </div>

        {/* The audit gate */}
        <div style={{ position: 'relative', width: 280, height: 200 }}>
          {/* red denied ghost */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: ghostO,
              borderRadius: 18,
              border: `1px solid ${RED}`,
              background: 'rgba(224,102,122,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: FONTS.mono,
              fontSize: 22,
              letterSpacing: '0.16em',
              color: RED,
              filter: `blur(${(1 - approveO) * 0}px)`,
            }}
          >
            DENIED
          </div>
          {/* green approved */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: approveO,
              transform: `scale(${interpolate(verdict, [0, 1], [0.9, 1])})`,
              borderRadius: 18,
              border: `1px solid ${GREEN}`,
              background: 'rgba(95,211,154,0.1)',
              boxShadow: `0 0 50px -10px ${GREEN}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              color: GREEN,
            }}
          >
            <div style={{ fontSize: 44 }}>✓</div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 22, letterSpacing: '0.16em' }}>APPROVED</div>
          </div>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 150,
          textAlign: 'center',
          opacity: approveO,
          fontFamily: FONTS.display,
          fontSize: 40,
          fontWeight: 600,
          color: COLORS.textPrimary,
          letterSpacing: '-0.02em',
        }}
      >
        The denial that doesn't happen.
      </div>
    </div>
  );
};

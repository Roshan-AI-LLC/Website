/**
 * The Accuracy × Interpretability quadrant — the benchmark's punchline and the
 * reason adding LAAT (0.711) next to ShifaMind (0.712) HELPS instead of hurts.
 *
 * Story told by the animation: every model first appears on the bottom axis at
 * its accuracy (x). Then each rises to its interpretability (y). The accurate
 * black-box models (LAAT, GKI-ICD) barely lift — they stay bottom-right. Only
 * ShifaMind climbs into the top-right "accurate AND auditable" zone, alone.
 *
 * Self-timed from `appearAt`: axes draw → dots seed on the x-axis → dots rise.
 */
import { interpolate, useCurrentFrame } from 'remotion';
import { COLORS, FONTS } from '../theme';
import { COMPETITORS, Y_MAX } from '../data/benchmark';
import { EASE } from '../motion';

const PLOT = { x: 470, y: 150, w: 980, h: 660 };

export const Quadrant: React.FC<{ appearAt?: number }> = ({ appearAt = 0 }) => {
  const frame = useCurrentFrame();
  const local = frame - appearAt;

  const axisDraw = interpolate(local, [0, 22], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  // Shaded "good" zone (top-right) fades in once dots have risen.
  const zoneO = interpolate(local, [70, 92], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const px = (accuracy: number) => PLOT.x + (accuracy / Y_MAX) * PLOT.w;
  const py = (interp: number) => PLOT.y + (1 - interp) * PLOT.h;

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {/* Top-right "accurate AND auditable" zone */}
      <div
        style={{
          position: 'absolute',
          left: px(0.55),
          top: PLOT.y,
          width: PLOT.x + PLOT.w - px(0.55),
          height: py(0.6) - PLOT.y,
          background: `linear-gradient(135deg, ${COLORS.accentSofter}, transparent)`,
          border: `1px dashed rgba(78,205,196,${0.3 * zoneO})`,
          borderRadius: 16,
          opacity: zoneO,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: px(0.55) + 20,
          top: PLOT.y + 18,
          opacity: zoneO,
          fontFamily: FONTS.mono,
          fontSize: 18,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: COLORS.accent,
        }}
      >
        accurate · auditable
      </div>

      {/* Axes */}
      <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0 }}>
        <line
          x1={PLOT.x}
          y1={PLOT.y}
          x2={PLOT.x}
          y2={PLOT.y + PLOT.h}
          stroke={COLORS.borderStrong}
          strokeWidth={1.5}
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - axisDraw}
        />
        <line
          x1={PLOT.x}
          y1={PLOT.y + PLOT.h}
          x2={PLOT.x + PLOT.w}
          y2={PLOT.y + PLOT.h}
          stroke={COLORS.borderStrong}
          strokeWidth={1.5}
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - axisDraw}
        />
      </svg>

      {/* Axis labels */}
      <div
        style={{
          position: 'absolute',
          left: PLOT.x,
          top: PLOT.y + PLOT.h + 24,
          width: PLOT.w,
          textAlign: 'center',
          opacity: axisDraw,
          fontFamily: FONTS.mono,
          fontSize: 20,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: COLORS.textMuted,
        }}
      >
        Accuracy · Macro-F1 →
      </div>
      <div
        style={{
          position: 'absolute',
          left: PLOT.x - 56,
          top: PLOT.y + PLOT.h / 2,
          transform: 'rotate(-90deg)',
          transformOrigin: 'left center',
          opacity: axisDraw,
          fontFamily: FONTS.mono,
          fontSize: 20,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: COLORS.textMuted,
          whiteSpace: 'nowrap',
        }}
      >
        Interpretability ↑
      </div>

      {/* Dots */}
      {COMPETITORS.map((c, i) => {
        const seed = interpolate(local, [20 + i * 3, 34 + i * 3], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const rise = interpolate(local, [40 + i * 3, 74 + i * 3], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: EASE,
        });
        const x = px(c.value);
        const yBase = PLOT.y + PLOT.h; // on the accuracy axis
        const yTarget = py(c.interp);
        const y = yBase + (yTarget - yBase) * rise;
        const r = c.ours ? 16 : 11;
        const labelO = interpolate(local, [30 + i * 3, 44 + i * 3], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return (
          <div
            key={c.label}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              transform: 'translate(-50%, -50%)',
              opacity: seed,
            }}
          >
            <div
              style={{
                width: r * 2,
                height: r * 2,
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                background: c.ours ? COLORS.accent : 'rgba(255,255,255,0.5)',
                boxShadow: c.ours
                  ? `0 0 ${20 + 14 * rise}px ${COLORS.accent}`
                  : 'none',
                border: c.ours ? 'none' : `1px solid ${COLORS.borderStrong}`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 18,
                top: -10,
                opacity: labelO,
                whiteSpace: 'nowrap',
                fontFamily: FONTS.mono,
                fontSize: c.ours ? 22 : 17,
                fontWeight: c.ours ? 700 : 400,
                color: c.ours ? COLORS.accent : COLORS.textMuted,
              }}
            >
              {c.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

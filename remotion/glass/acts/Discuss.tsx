/**
 * ACT 4 — DISCUSS [Interrogate].
 * A clinician query types in: "why not pneumonia?" The model responds by DIMMING
 * a pneumonia path and BRIGHTENING the heart-failure evidence — the reasoning is
 * interrogable, not a black box. Short.
 */
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, FONTS } from '../../theme';
import { CONCEPTS } from '../../data/scenario';
import { ramp } from '../shared';

const QUERY = 'why not pneumonia?';

const PNEUMONIA = [
  { label: 'productive_cough', activation: 0.31 },
  { label: 'fever', activation: 0.18 },
  { label: 'focal_consolidation', activation: 0.12 },
];

export const Discuss: React.FC = () => {
  const frame = useCurrentFrame();

  // Query types in 6..50.
  const typed = Math.floor(interpolate(frame, [10, 56], [0, QUERY.length], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  }));
  const caret = Math.sin(frame * 0.3) > 0;

  // Response: dim pneumonia, brighten HF after the query lands.
  const respond = ramp(frame, 70, 150);
  const pneumoDim = interpolate(respond, [0, 1], [1, 0.18], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const hfBright = interpolate(respond, [0, 1], [0.55, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      {/* Query bar */}
      <div
        style={{
          position: 'absolute',
          top: 250,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '18px 28px',
          borderRadius: 14,
          background: COLORS.glass,
          border: `1px solid ${COLORS.borderStrong}`,
          opacity: ramp(frame, 4, 16),
        }}
      >
        <span style={{ fontFamily: FONTS.mono, fontSize: 20, color: COLORS.accent }}>›</span>
        <span style={{ fontFamily: FONTS.mono, fontSize: 26, color: COLORS.textPrimary }}>
          {QUERY.slice(0, typed)}
          <span style={{ opacity: typed < QUERY.length && caret ? 1 : 0, color: COLORS.accent }}>▎</span>
        </span>
      </div>

      {/* Two columns: pneumonia (dimming) vs heart failure (brightening) */}
      <div style={{ display: 'flex', gap: 120, marginTop: 60 }}>
        {/* Pneumonia — rejected */}
        <Column
          title="pneumonia"
          subtitle="ruled out"
          accent={COLORS.textMuted}
          items={PNEUMONIA}
          dim={pneumoDim}
          struck={respond}
        />
        {/* Heart failure — supported */}
        <Column
          title="heart failure"
          subtitle="supported"
          accent={COLORS.accent}
          items={[...CONCEPTS]}
          dim={hfBright}
          struck={0}
        />
      </div>
    </AbsoluteFill>
  );
};

const Column: React.FC<{
  title: string;
  subtitle: string;
  accent: string;
  items: readonly { label: string; activation: number }[];
  dim: number;
  struck: number;
}> = ({ title, subtitle, accent, items, dim, struck }) => {
  return (
    <div style={{ width: 420, opacity: dim }}>
      <div
        style={{
          fontFamily: FONTS.mono,
          fontSize: 16,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: accent,
          marginBottom: 4,
        }}
      >
        {subtitle}
      </div>
      <div
        style={{
          fontFamily: FONTS.display,
          fontSize: 40,
          fontWeight: 600,
          color: COLORS.textPrimary,
          marginBottom: 22,
          letterSpacing: '-0.02em',
          position: 'relative',
          display: 'inline-block',
        }}
      >
        {title}
        {/* strike-through on rejection */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: '52%',
            height: 2,
            width: `${100 * struck}%`,
            background: COLORS.textMuted,
          }}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.slice(0, 3).map((it) => (
          <div
            key={it.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              fontFamily: FONTS.mono,
              fontSize: 20,
              color: accent,
            }}
          >
            <div
              style={{
                flex: 1,
                height: 8,
                borderRadius: 999,
                background: COLORS.glass,
                overflow: 'hidden',
                border: `1px solid ${COLORS.borderSubtle}`,
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${it.activation * 100}%`,
                  background:
                    accent === COLORS.accent
                      ? `linear-gradient(90deg, ${COLORS.accentSoft}, ${COLORS.accent})`
                      : COLORS.borderStrong,
                  boxShadow: accent === COLORS.accent ? `0 0 14px -2px ${COLORS.accent}` : undefined,
                }}
              />
            </div>
            <span style={{ width: 180, color: COLORS.textSecondary }}>{it.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

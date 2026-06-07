/**
 * Segment 6 · BENCHMARK - animated bar chart, bars rising from zero, using
 * the real BenchmarkChart data and competitor brand marks. ShifaMind teal
 * and tallest.
 */
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { COLORS, FONTS } from '../theme';
import { TealGlow } from '../components/TealGlow';
import { RevealText } from '../components/RevealText';
import { COMPETITORS, Y_MAX, Y_TICKS } from '../data/benchmark';

const CHART_H = 560;
const BARS_START = 24;

// A single bar, anchored to the chart's zero baseline. Its value label
// floats just above the bar top. Marks/names are rendered separately in the
// label row below the axis (so they never eat into the bar's measured height).
const Bar: React.FC<{ index: number }> = ({ index }) => {
  const c = COMPETITORS[index];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - BARS_START - index * 7;
  const s = spring({ frame: local, fps, config: { damping: 20, stiffness: 90, mass: 0.9 } });

  const targetPct = (c.value / Y_MAX) * 100;
  const heightPct = interpolate(s, [0, 1], [0, targetPct]);
  const value = interpolate(s, [0, 1], [0, c.value]);
  const labelOpacity = interpolate(local, [6, 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      {/* Value label, pinned just above the bar top. */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: `${heightPct}%`,
          marginBottom: 10,
          textAlign: 'center',
          opacity: labelOpacity,
          fontFamily: FONTS.mono,
          fontSize: 24,
          fontVariantNumeric: 'tabular-nums',
          fontWeight: c.ours ? 700 : 400,
          color: c.ours ? COLORS.accent : COLORS.textSecondary,
        }}
      >
        {value.toFixed(3)}
      </div>
      {/* The bar, growing up from the baseline. */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 104,
          height: `${heightPct}%`,
          borderRadius: 8,
          background: c.ours
            ? `linear-gradient(180deg, ${COLORS.accentStrong}, ${COLORS.accent})`
            : 'rgba(255,255,255,0.12)',
          border: c.ours ? 'none' : `1px solid ${COLORS.borderSubtle}`,
          boxShadow: c.ours
            ? `0 6px ${44 + 18 * (0.5 + 0.5 * Math.sin(frame * 0.12))}px -6px ${COLORS.accent}`
            : undefined,
        }}
      />
    </div>
  );
};

// Brand mark + name for one column, in the label row beneath the axis.
const ColumnLabel: React.FC<{ index: number }> = ({ index }) => {
  const c = COMPETITORS[index];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div
        style={{
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {c.ours ? (
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 4,
              background: COLORS.accent,
              boxShadow: `0 0 14px ${COLORS.accent}`,
            }}
          />
        ) : (
          c.mark
        )}
      </div>
      <div
        style={{
          fontSize: 18,
          textAlign: 'center',
          color: c.ours ? COLORS.textPrimary : COLORS.textMuted,
          fontWeight: c.ours ? 600 : 400,
        }}
      >
        {c.label}
      </div>
    </div>
  );
};

const Delta: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [118, 138], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const y = interpolate(frame, [118, 138], [14, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        position: 'absolute',
        top: 18,
        right: 0,
        width: 230,
        textAlign: 'center',
        opacity: o,
        transform: `translateY(${y}px)`,
      }}
    >
      <div
        style={{
          fontFamily: FONTS.display,
          fontSize: 52,
          fontWeight: 700,
          color: COLORS.accent,
          letterSpacing: '-0.02em',
          textShadow: `0 0 50px ${COLORS.accentSoft}`,
        }}
      >
        +64%
      </div>
      <div style={{ marginTop: 2, fontSize: 18, color: COLORS.textSecondary }}>
        vs the best frontier LLM
      </div>
    </div>
  );
};

export const Benchmark: React.FC = () => {
  return (
    <AbsoluteFill>
      <TealGlow x="78%" y="40%" size={900} opacity={0.12} />
      <AbsoluteFill style={{ padding: '64px 110px' }}>
        <RevealText
          appearAt={4}
          style={{
            fontFamily: FONTS.mono,
            fontSize: 18,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: COLORS.accent,
          }}
        >
          Benchmarks · MIMIC-IV top-50
        </RevealText>
        <RevealText
          appearAt={10}
          style={{
            marginTop: 10,
            fontFamily: FONTS.display,
            fontSize: 52,
            fontWeight: 700,
            color: COLORS.textPrimary,
            letterSpacing: '-0.02em',
          }}
        >
          Macro-F1, higher is better
        </RevealText>

        <div style={{ marginTop: 30 }}>
          <div style={{ display: 'flex', gap: 18, height: CHART_H }}>
            {/* Y axis */}
            <div
              style={{
                position: 'relative',
                width: 46,
                height: CHART_H,
                fontFamily: FONTS.mono,
                fontSize: 16,
                color: COLORS.textMuted,
              }}
            >
              {Y_TICKS.map((t) => (
                <div
                  key={t}
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: `${(1 - t / Y_MAX) * 100}%`,
                    transform: 'translateY(-50%)',
                  }}
                >
                  {t.toFixed(1)}
                </div>
              ))}
            </div>

            {/* Plot area: gridlines + bars anchored to the zero baseline. */}
            <div style={{ position: 'relative', flex: 1, height: CHART_H }}>
              {Y_TICKS.map((t) => (
                <div
                  key={t}
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: `${(1 - t / Y_MAX) * 100}%`,
                    height: 1,
                    background: t === 0 ? COLORS.borderStrong : COLORS.borderSubtle,
                  }}
                />
              ))}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(6, 1fr)',
                  gap: 20,
                }}
              >
                {COMPETITORS.map((_, i) => (
                  <Bar key={COMPETITORS[i].label} index={i} />
                ))}
              </div>
              <Delta />
            </div>
          </div>

          {/* Label row, aligned under the bars (offset past the Y axis). */}
          <div style={{ display: 'flex', gap: 18, marginTop: 16 }}>
            <div style={{ width: 46 }} />
            <div
              style={{
                flex: 1,
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: 20,
              }}
            >
              {COMPETITORS.map((_, i) => (
                <ColumnLabel key={COMPETITORS[i].label} index={i} />
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 40 }}>
          <RevealText
            appearAt={120}
            style={{
              marginTop: 26,
              fontFamily: FONTS.display,
              fontSize: 40,
              fontWeight: 600,
              color: COLORS.textPrimary,
              letterSpacing: '-0.02em',
            }}
          >
            Ranked <span style={{ color: COLORS.accent }}>#1</span> on MIMIC-IV top-50.
            <span style={{ color: COLORS.textSecondary, fontWeight: 400, fontSize: 30 }}>
              {'   '}Beats every frontier LLM, and the best published clinical model.
            </span>
          </RevealText>

          <RevealText appearAt={150}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 18px',
                borderRadius: 999,
                whiteSpace: 'nowrap',
                background: COLORS.glass,
                border: `1px solid ${COLORS.borderSubtle}`,
                fontFamily: FONTS.mono,
                fontSize: 20,
                color: COLORS.textSecondary,
              }}
            >
              <span style={{ color: COLORS.accent }}>↗</span> Read the paper · arXiv
            </div>
          </RevealText>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

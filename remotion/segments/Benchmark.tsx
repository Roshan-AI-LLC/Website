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
import { BarChart3, IceCream2, Network } from 'lucide-react';
import { COLORS, FONTS } from '../theme';
import { TealGlow } from '../components/TealGlow';
import { RevealText } from '../components/RevealText';
import { COMPETITORS, Y_MAX, Y_TICKS, type Competitor } from '../data/benchmark';
import { AnthropicMark, GoogleMark, OpenAIMark } from '../data/brand-marks';

// Resolve a competitor's mark from its brand/icon discriminator. Kept here (a
// segment, automatic JSX runtime) rather than in the data module.
const CompetitorMark: React.FC<{ c: Competitor }> = ({ c }) => {
  const muted = 'rgba(255,255,255,0.66)';
  if (c.brand === 'anthropic') return <AnthropicMark size={28} />;
  if (c.brand === 'google') return <GoogleMark size={28} />;
  if (c.brand === 'openai') return <OpenAIMark size={28} />;
  if (c.icon === 'cbm') return <IceCream2 size={28} strokeWidth={1.7} color={muted} />;
  if (c.icon === 'gki') return <BarChart3 size={28} strokeWidth={1.8} color={muted} />;
  if (c.icon === 'laat') return <Network size={28} strokeWidth={1.7} color={muted} />;
  return null;
};

const CHART_H = 560;
const BARS_START = 16;

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
          width: 88,
          height: `${heightPct}%`,
          borderRadius: 8,
          overflow: 'hidden',
          background: c.ours
            ? `linear-gradient(180deg, ${COLORS.accentStrong}, ${COLORS.accent})`
            : 'rgba(255,255,255,0.12)',
          border: c.ours ? 'none' : `1px solid ${COLORS.borderSubtle}`,
          boxShadow: c.ours ? `0 6px 48px -8px ${COLORS.accent}` : undefined,
        }}
      >
        {/* Brighter top-edge highlight as the bar settles. */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: c.ours ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.25)',
            opacity: interpolate(s, [0.6, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}
        />
        {/* One-time sheen sweeping up the winning bar after it settles. */}
        {c.ours && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              height: '60%',
              bottom: `${interpolate(frame, [72, 100], [-60, 130], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}%`,
              background:
                'linear-gradient(0deg, transparent, rgba(255,255,255,0.55), transparent)',
              opacity: interpolate(frame, [72, 76, 96, 100], [0, 1, 1, 0], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
            }}
          />
        )}
      </div>
    </div>
  );
};

// Horizontal gridlines that draw in left-to-right.
const GridLines: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      {Y_TICKS.map((t, i) => {
        const draw = interpolate(frame, [2 + i * 2, 22 + i * 2], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return (
          <div
            key={t}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: `${(1 - t / Y_MAX) * 100}%`,
              height: 1,
              background: t === 0 ? COLORS.borderStrong : COLORS.borderSubtle,
              transform: `scaleX(${draw})`,
              transformOrigin: 'left',
            }}
          />
        );
      })}
    </>
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
          <CompetitorMark c={c} />
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
              <GridLines />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  gap: 20,
                }}
              >
                {COMPETITORS.map((_, i) => (
                  <Bar key={COMPETITORS[i].label} index={i} />
                ))}
              </div>
            </div>
          </div>

          {/* Label row, aligned under the bars (offset past the Y axis). */}
          <div style={{ display: 'flex', gap: 18, marginTop: 16 }}>
            <div style={{ width: 46 }} />
            <div
              style={{
                flex: 1,
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: 20,
              }}
            >
              {COMPETITORS.map((_, i) => (
                <ColumnLabel key={COMPETITORS[i].label} index={i} />
              ))}
            </div>
          </div>
        </div>

        <RevealText
          appearAt={92}
          style={{
            marginTop: 30,
            fontFamily: FONTS.display,
            fontSize: 40,
            fontWeight: 600,
            color: COLORS.textPrimary,
            letterSpacing: '-0.02em',
          }}
        >
          The highest Macro-F1.
          <span style={{ color: COLORS.textSecondary, fontWeight: 400, fontSize: 32 }}>
            {'   '}0.712 on MIMIC-IV top-50.
          </span>
        </RevealText>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

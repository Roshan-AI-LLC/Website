/**
 * Segment 6 · BENCHMARK — animated bar chart, bars rising from zero, using
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
import { Stage } from '../components/Stage';
import { TealGlow } from '../components/TealGlow';
import { RevealText } from '../components/RevealText';
import { COMPETITORS, Y_MAX, Y_TICKS } from '../data/benchmark';

const CHART_H = 560;
const BARS_START = 24;

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
    <div
      style={{
        flex: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}
    >
      <div
        style={{
          opacity: labelOpacity,
          marginBottom: 10,
          fontFamily: FONTS.mono,
          fontSize: 22,
          fontVariantNumeric: 'tabular-nums',
          fontWeight: c.ours ? 700 : 400,
          color: c.ours ? COLORS.accent : COLORS.textSecondary,
        }}
      >
        {value.toFixed(3)}
      </div>
      <div
        style={{
          width: 96,
          height: `${heightPct}%`,
          borderRadius: 8,
          background: c.ours
            ? `linear-gradient(180deg, ${COLORS.accentStrong}, ${COLORS.accent})`
            : 'rgba(255,255,255,0.12)',
          border: c.ours ? 'none' : `1px solid ${COLORS.borderSubtle}`,
          boxShadow: c.ours ? `0 6px 40px -6px ${COLORS.accent}` : undefined,
        }}
      />
      <div
        style={{
          height: 40,
          marginTop: 16,
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
          marginTop: 8,
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
    <Stage>
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
          Macro-F1 — higher is better
        </RevealText>

        <div style={{ display: 'flex', gap: 18, marginTop: 30, height: CHART_H }}>
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

          {/* Plot area */}
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
                display: 'flex',
                alignItems: 'stretch',
                gap: 20,
                paddingTop: 40,
              }}
            >
              {COMPETITORS.map((_, i) => (
                <Bar key={COMPETITORS[i].label} index={i} />
              ))}
            </div>
          </div>
        </div>

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
          <span style={{ color: COLORS.textSecondary, fontWeight: 400, fontSize: 32 }}>
            {'   '}Macro-F1 0.712 — over 60% above the best frontier LLM.
          </span>
        </RevealText>
      </AbsoluteFill>
    </Stage>
  );
};

/**
 * Segment · PROOF (interpretability, measured). The rigorous version: the three
 * interpretability metrics from the paper, ShifaMind (MCB) vs a capacity-matched
 * Vanilla CBM that shares the same backbone — the only apples-to-apples
 * interpretability comparison the paper makes (non-overlapping bootstrap 95%
 * CIs). No cross-LLM interpretability claims; those numbers don't exist.
 *
 * CSTPR 0.704 vs 0.147 · CIM 1.314 vs 0.645 · CCR 0.836 vs 0.361.
 */
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { COLORS, FONTS } from '../theme';
import { RevealText } from '../components/RevealText';
import { METRICS } from '../data/metrics';
import { SPRING } from '../motion';

const ROW_W = 1360;

const ValueBar: React.FC<{
  label: string;
  value: number;
  max: number;
  decimals: number;
  ours: boolean;
  appearAt: number;
}> = ({ label, value, max, decimals, ours, appearAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - appearAt;
  const s = spring({ frame: local, fps, config: SPRING });
  const fillPct = interpolate(s, [0, 1], [0, (value / max) * 100]);
  const shown = interpolate(s, [0, 1], [0, value]);
  const opacity = interpolate(local, [0, 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18, opacity }}>
      <div
        style={{
          width: 156,
          fontFamily: FONTS.mono,
          fontSize: 18,
          color: ours ? COLORS.textPrimary : COLORS.textMuted,
          textAlign: 'right',
        }}
      >
        {label}
      </div>
      <div
        style={{
          position: 'relative',
          flex: 1,
          height: 26,
          borderRadius: 8,
          background: COLORS.glass,
          border: `1px solid ${COLORS.borderSubtle}`,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${fillPct}%`,
            borderRadius: 8,
            background: ours
              ? `linear-gradient(90deg, ${COLORS.accentStrong}, ${COLORS.accent})`
              : 'rgba(255,255,255,0.18)',
            boxShadow: ours ? `0 0 22px -4px ${COLORS.accent}` : undefined,
          }}
        />
      </div>
      <div
        style={{
          width: 92,
          textAlign: 'right',
          fontFamily: FONTS.mono,
          fontSize: 22,
          fontWeight: ours ? 700 : 400,
          color: ours ? COLORS.accent : COLORS.textMuted,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {shown.toFixed(decimals)}
      </div>
    </div>
  );
};

const MetricGroup: React.FC<{ index: number }> = ({ index }) => {
  const m = METRICS[index];
  const appearAt = 26 + index * 22;
  return (
    <div style={{ width: ROW_W }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 14 }}>
        <span
          style={{
            fontFamily: FONTS.display,
            fontSize: 30,
            fontWeight: 700,
            color: COLORS.textPrimary,
            letterSpacing: '-0.01em',
          }}
        >
          {m.key}
        </span>
        <span style={{ fontFamily: FONTS.body, fontSize: 20, color: COLORS.textMuted }}>{m.name}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <ValueBar label="ShifaMind" value={m.shifamind} max={m.max} decimals={m.decimals} ours appearAt={appearAt} />
        <ValueBar label="Vanilla CBM" value={m.vanilla} max={m.max} decimals={m.decimals} ours={false} appearAt={appearAt + 6} />
      </div>
    </div>
  );
};

export const Proof: React.FC = () => {
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', top: 76, left: 130, right: 130 }}>
        <RevealText
          appearAt={2}
          style={{
            fontFamily: FONTS.mono,
            fontSize: 18,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: COLORS.accent,
          }}
        >
          Interpretability, measured
        </RevealText>
        <RevealText
          appearAt={8}
          style={{
            marginTop: 10,
            fontFamily: FONTS.display,
            fontSize: 48,
            fontWeight: 700,
            color: COLORS.textPrimary,
            letterSpacing: '-0.02em',
          }}
        >
          Evaluation metrics as proof of interpretability.
        </RevealText>
      </div>

      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40, marginTop: 40 }}>
          {METRICS.map((m, i) => (
            <MetricGroup key={m.key} index={i} />
          ))}
        </div>
      </AbsoluteFill>

      <div style={{ position: 'absolute', bottom: 92, left: 130, right: 130 }}>
        <RevealText
          appearAt={96}
          style={{
            fontFamily: FONTS.body,
            fontSize: 24,
            color: COLORS.textSecondary,
          }}
        >
          ShifaMind (MCB) vs. a capacity-matched Vanilla CBM, same backbone. Non-overlapping 95% CIs.
        </RevealText>
      </div>
    </AbsoluteFill>
  );
};

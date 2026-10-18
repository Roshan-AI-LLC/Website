/**
 * Demo alarms for the /products/nabz/sentry triage demo.
 *
 * ILLUSTRATIVE DATA. Every alarm is hand-curated for the demo: the waveforms
 * are synthetic, there is no live inference, and no probability or
 * ground-truth label below is a result from the paper. The suppress
 * thresholds come from the ranges the paper reports (nabzPapers.ts); the keep
 * threshold is a stand-in. The structure follows the NabzSentry model:
 *
 *   Inputs   four waveform slots: ECG lead 1, ECG lead 2, arterial pressure
 *            (ABP) and pleth (PPG), a 10 s window at 250 Hz as in the paper's
 *            official-split arm. An unavailable slot is zeroed and masked
 *            out; the model decides from the channels that are present.
 *   Output   p, the probability that the VT alarm is genuine.
 *   Policy   suppress if p <= the suppress threshold, keep if p >= the keep
 *            threshold (keep wins any overlap), defer to a clinician
 *            otherwise.
 *   Budget   the certified limit on the share of suppressed alarms that are
 *            genuine, across all alarms, not per alarm. A looser budget admits
 *            a higher suppress threshold, so the same alarm can move from
 *            defer to suppress. The demo shows that move on a false alarm
 *            only: no genuine alarm here is ever suppressed.
 *
 * Waveforms come from a deterministic generator below (pure functions, a
 * seeded PRNG, no Math.random), so the prerendered HTML and the client render
 * draw the same traces.
 */

import { NABZSENTRY } from './nabzPapers';

export type Channel = 'ECG1' | 'ECG2' | 'ABP' | 'PPG';
export type Decision = 'keep' | 'suppress' | 'defer';

/** The four slots, in the model's order. */
export const CHANNELS: readonly { key: Channel; label: string }[] = [
  { key: 'ECG1', label: 'ECG 1' },
  { key: 'ECG2', label: 'ECG 2' },
  { key: 'ABP', label: 'ABP' },
  { key: 'PPG', label: 'Pleth' },
];

export type Budget = {
  /** Error budget, percent of suppressed alarms allowed to be genuine. */
  pct: number;
  /** Suppress when p is at or below this. */
  suppressBelow: number;
  /** Keep when p is at or above this. */
  keepAbove: number;
};

/**
 * Suppress thresholds, tied to NABZSENTRY.suppressThresholdRange. At the
 * looser budget the paper's selected threshold sits at the top of the grid;
 * the demo uses the low end of that reported range. At the certified budget
 * the paper reports a range rather than one value, so the demo picks an
 * illustrative point inside it, checked below so a change to the paper data
 * cannot leave the demo outside the reported range.
 */
const SUPPRESS_AT_BUDGET = 0.05;
const SUPPRESS_AT_LOOSE_BUDGET = NABZSENTRY.suppressThresholdRange.looseBudget[0];
{
  const [lo, hi] = NABZSENTRY.suppressThresholdRange.budget;
  if (SUPPRESS_AT_BUDGET < lo || SUPPRESS_AT_BUDGET > hi) {
    throw new Error(
      `nabzsentryScenarios: suppress threshold ${SUPPRESS_AT_BUDGET} lies outside the paper's ${NABZSENTRY.budgetPct}% range ${lo}-${hi}.`,
    );
  }
}

/**
 * ILLUSTRATIVE keep threshold. The paper fixes it to retain at least 95% of
 * true alarms but does not report its value, and it carries no guarantee.
 */
const KEEP_ABOVE = 0.5;

export const BUDGETS: readonly Budget[] = [
  { pct: NABZSENTRY.budgetPct, suppressBelow: SUPPRESS_AT_BUDGET, keepAbove: KEEP_ABOVE },
  { pct: NABZSENTRY.looseBudgetPct, suppressBelow: SUPPRESS_AT_LOOSE_BUDGET, keepAbove: KEEP_ABOVE },
];

/** Three-way policy. Keep wins any overlap with suppress. */
export function decide(p: number, budget: Budget): Decision {
  if (p >= budget.keepAbove) return 'keep';
  if (p <= budget.suppressBelow) return 'suppress';
  return 'defer';
}

/** The rhythm under every channel, so each pulse follows its ECG beat. */
export type Rhythm = {
  /** Sinus rate, bpm. */
  hr: number;
  /**
   * Ventricular tachycardia from `onset` (seconds) to `end`, or to the
   * window end when `end` is omitted.
   */
  vt?: { onset: number; hr: number; end?: number };
};

export type WaveSpec =
  | {
      kind: 'ecg';
      /** Complex size, display units (about 0-1). */
      gain: number;
      /** VT complex polarity on this lead. */
      vtPolarity?: 1 | -1;
      /** White-noise SD, display units. */
      noise?: number;
      /** Baseline-wander amplitude, display units. */
      wander?: number;
      /** A motion-artifact burst (seconds) that mimics a fast rhythm. */
      burst?: { from: number; to: number; amp: number };
    }
  | {
      kind: 'abp' | 'ppg';
      /** Pulse size, display units (about 0-1). */
      gain: number;
    };

export type ChannelSpec = { available: true; wave: WaveSpec } | { available: false };

export type Scenario = {
  id: 'fast' | 'noisy' | 'wander' | 'degraded' | 'no-pleth';
  /** Tab label: what the monitor shows, not the verdict. */
  label: string;
  /** One line describing the synthetic signals. */
  subLabel: string;
  /** Hand-curated ground truth, revealed only after Sentry runs. */
  truth: { genuine: boolean; label: string };
  rhythm: Rhythm;
  channels: Record<Channel, ChannelSpec>;
  /** Illustrative true-alarm probability. */
  p: number;
};

const clean = (gain: number, vtPolarity: 1 | -1 = 1): ChannelSpec => ({
  available: true,
  wave: { kind: 'ecg', gain, vtPolarity, noise: 0.008, wander: 0.03 },
});
const pulse = (kind: 'abp' | 'ppg', gain = 1): ChannelSpec => ({ available: true, wave: { kind, gain } });
const ABSENT: ChannelSpec = { available: false };

export const SCENARIOS: Scenario[] = [
  {
    // True VT: wide fast complexes on both leads; the pulses shrink and go
    // irregular as output falls. Kept at both budgets.
    id: 'fast',
    label: 'Fast rhythm',
    subLabel: 'Both leads fast and wide; pulses fading.',
    truth: { genuine: true, label: 'True VT' },
    rhythm: { hr: 84, vt: { onset: 3.2, hr: 176 } },
    channels: { ECG1: clean(0.88, 1), ECG2: clean(0.68, -1), ABP: pulse('abp'), PPG: pulse('ppg') },
    p: 0.97,
  },
  {
    // Motion artifact: a burst on lead 1 mimics VT; lead 2 stays sinus and
    // both pulses stay regular. Suppressed at both budgets.
    id: 'noisy',
    label: 'Noisy lead',
    subLabel: 'Burst on lead 1; lead 2 and pulses steady.',
    truth: { genuine: false, label: 'False alarm' },
    rhythm: { hr: 76 },
    channels: {
      ECG1: {
        available: true,
        wave: { kind: 'ecg', gain: 0.82, noise: 0.01, wander: 0.04, burst: { from: 2.8, to: 8.1, amp: 0.8 } },
      },
      ECG2: clean(0.7),
      ABP: pulse('abp'),
      PPG: pulse('ppg'),
    },
    p: 0.02,
  },
  {
    // False alarm on all four channels: both leads drift and blur enough to
    // trip the VT detector, while both pulses stay steady. Uncertain enough
    // to defer at 5%; the looser 10% budget suppresses it. This is the
    // demo's budget flip, kept on a false alarm on purpose.
    id: 'wander',
    label: 'Wandering baseline',
    subLabel: 'Both leads drift and blur; pulses steady.',
    truth: { genuine: false, label: 'False alarm' },
    rhythm: { hr: 92 },
    channels: {
      ECG1: {
        available: true,
        wave: { kind: 'ecg', gain: 0.78, noise: 0.03, wander: 0.34, burst: { from: 3.6, to: 6.4, amp: 0.32 } },
      },
      ECG2: { available: true, wave: { kind: 'ecg', gain: 0.62, noise: 0.03, wander: 0.3 } },
      ABP: pulse('abp'),
      PPG: pulse('ppg'),
    },
    p: 0.22,
  },
  {
    // Degraded signal: faint, noisy ECG and no usable pulsatile channel.
    // Deferred at both budgets: the paper reports that this stratum (no
    // pulse channel) is where the marginal guarantee is exceeded, so the
    // demo never suppresses it. p sits between the 10% suppress threshold
    // and the keep threshold.
    id: 'degraded',
    label: 'Degraded signal',
    subLabel: 'Faint, noisy ECG; no pressure or pleth.',
    truth: { genuine: false, label: 'False alarm' },
    rhythm: { hr: 102 },
    channels: {
      ECG1: { available: true, wave: { kind: 'ecg', gain: 0.38, noise: 0.06, wander: 0.28 } },
      ECG2: { available: true, wave: { kind: 'ecg', gain: 0.28, noise: 0.08, wander: 0.24 } },
      ABP: ABSENT,
      PPG: ABSENT,
    },
    p: 0.44,
  },
  {
    // Missing pleth: clean sinus and a steady arterial pulse; the pleth slot
    // is masked and Sentry decides from the other three. Suppressed at both.
    id: 'no-pleth',
    label: 'Missing pleth',
    subLabel: 'Clean ECG and arterial line; pleth off.',
    truth: { genuine: false, label: 'False alarm' },
    rhythm: { hr: 72 },
    channels: { ECG1: clean(0.9), ECG2: clean(0.7), ABP: pulse('abp'), PPG: ABSENT },
    p: 0.04,
  },
];

// Two rules the demo must never break, checked at load so a later edit to a
// probability fails the build instead of shipping:
//   - a genuine alarm is never suppressed, at any budget;
//   - an alarm with no usable pulse channel is never suppressed: the paper
//     reports that stratum is where the budget is exceeded.
for (const s of SCENARIOS) {
  const suppressed = BUDGETS.some((b) => decide(s.p, b) === 'suppress');
  if (suppressed && s.truth.genuine) {
    throw new Error(`nabzsentryScenarios: "${s.id}" is a genuine alarm and must not be suppressed.`);
  }
  const noPulse = !s.channels.ABP.available && !s.channels.PPG.available;
  if (suppressed && noPulse) {
    throw new Error(`nabzsentryScenarios: "${s.id}" has no pulse channel and must not be suppressed.`);
  }
}

// ─────────────────────────────────────────────── Deterministic waveforms

/** Window length, seconds: the paper's 10 s official-split window. */
const WINDOW_S = 10;
/** Generation rate, Hz: VTaC's 250 Hz (2,500 samples per slot). */
const FS = 250;
/** Min-max decimation buckets: two points each, 400 points per channel. */
const BUCKETS = 200;

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** mulberry32: a small seeded PRNG, uniform in [0, 1). */
function prng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Approximately standard normal (sum of four uniforms). */
function normal(rand: () => number): number {
  return (rand() + rand() + rand() + rand() - 2) * 1.732;
}

const gauss = (x: number, mu: number, sd: number) => Math.exp(-((x - mu) ** 2) / (2 * sd * sd));
/** Asymmetric bump: rises with SD `up`, falls with SD `down`. */
const bump = (x: number, mu: number, up: number, down: number) => gauss(x, mu, x < mu ? up : down);
const smoothstep = (x: number) => {
  const c = Math.min(1, Math.max(0, x));
  return c * c * (3 - 2 * c);
};

/** P-QRS-T around an R peak at tau = 0 (seconds). */
function sinusComplex(tau: number): number {
  return (
    0.12 * gauss(tau, -0.16, 0.025) -
    0.1 * gauss(tau, -0.03, 0.009) +
    gauss(tau, 0, 0.011) -
    0.28 * gauss(tau, 0.028, 0.011) +
    0.3 * gauss(tau, 0.25, 0.05)
  );
}

/** A wide, monomorphic ventricular complex: no P wave, broad QRS. */
function vtComplex(tau: number): number {
  return 0.95 * bump(tau, 0, 0.035, 0.05) - 0.62 * gauss(tau, 0.13, 0.05);
}

/** Arterial pulse after an R peak: upstroke, dicrotic notch, runoff. */
function abpPulse(tau: number): number {
  const s = tau - 0.16;
  return (
    bump(s, 0.1, 0.045, 0.13) +
    0.3 * gauss(s, 0.33, 0.06) -
    0.07 * gauss(s, 0.26, 0.02) +
    0.3 * bump(s, 0.15, 0.06, 0.4)
  );
}

/** Pleth pulse: later and smoother than the arterial one. */
function ppgPulse(tau: number): number {
  const s = tau - 0.24;
  return bump(s, 0.17, 0.07, 0.2) + 0.2 * gauss(s, 0.42, 0.07);
}

type Beat = { t: number; vt: boolean; size: number };

/** Beat times across the window (and a little before, so tails carry in). */
function beatSchedule(rhythm: Rhythm, rand: () => number): Beat[] {
  const beats: Beat[] = [];
  let t = -1.2 + rand() * 0.3;
  while (t < WINDOW_S + 0.3) {
    const vt = rhythm.vt !== undefined && t >= rhythm.vt.onset && t < (rhythm.vt.end ?? Infinity);
    // VT: faster, a touch irregular, and the pulse it makes is small and
    // varies beat to beat.
    const rr = vt && rhythm.vt ? (60 / rhythm.vt.hr) * (0.94 + rand() * 0.12) : (60 / rhythm.hr) * (0.97 + rand() * 0.06);
    const size = vt ? 0.1 + rand() * 0.3 : 0.95 + rand() * 0.08;
    beats.push({ t, vt, size });
    t += rr;
  }
  return beats;
}

function sample(spec: WaveSpec, beats: Beat[], t: number): number {
  let v = 0;
  for (const b of beats) {
    const tau = t - b.t;
    if (tau < -0.4 || tau > 1.2) continue;
    if (spec.kind === 'ecg') {
      v += b.vt ? (spec.vtPolarity ?? 1) * spec.gain * vtComplex(tau) : spec.gain * sinusComplex(tau);
    } else if (spec.kind === 'abp') {
      v += b.size * abpPulse(tau);
    } else {
      v += b.size * ppgPulse(tau);
    }
  }
  // Display units: roughly [-1, 1], baseline placed per signal kind.
  if (spec.kind === 'ecg') return v - 0.12;
  return spec.gain * v * 1.15 - 0.8;
}

/** Min-max decimation, in time order, so peaks and noise bands survive. */
function decimate(xs: Float64Array, buckets: number): number[] {
  const out: number[] = [];
  const size = xs.length / buckets;
  for (let b = 0; b < buckets; b++) {
    const from = Math.floor(b * size);
    const to = Math.floor((b + 1) * size);
    let lo = from;
    let hi = from;
    for (let i = from; i < to; i++) {
      if (xs[i] < xs[lo]) lo = i;
      if (xs[i] > xs[hi]) hi = i;
    }
    const first = Math.min(lo, hi);
    const second = Math.max(lo, hi);
    out.push(round(xs[first]), round(xs[second]));
  }
  return out;
}

const round = (v: number) => Math.round(Math.max(-1, Math.min(1, v)) * 1000) / 1000;

function channelTrace(spec: WaveSpec, beats: Beat[], seed: number): number[] {
  const rand = prng(seed);
  const n = WINDOW_S * FS;
  const xs = new Float64Array(n);
  const phase = rand() * Math.PI * 2;
  // Low-passed noise drives the artifact burst's irregular swings.
  let slow = 0;
  for (let i = 0; i < n; i++) {
    const t = i / FS;
    let v = sample(spec, beats, t);
    if (spec.kind === 'ecg') {
      const wander = spec.wander ?? 0;
      v += wander * (Math.sin(2 * Math.PI * 0.27 * t + phase) + 0.5 * Math.sin(2 * Math.PI * 0.61 * t + 2 * phase));
      v += (spec.noise ?? 0) * normal(rand);
      slow = 0.92 * slow + 0.08 * normal(rand);
      if (spec.burst) {
        const { from, to, amp } = spec.burst;
        const env = smoothstep((t - from) / 0.35) * (1 - smoothstep((t - (to - 0.35)) / 0.35));
        if (env > 0) {
          v +=
            amp *
            env *
            (0.7 * Math.sin(2 * Math.PI * 3.1 * t + phase) +
              0.35 * Math.sin(2 * Math.PI * 5.6 * t + 3 * phase) +
              1.6 * slow +
              0.08 * normal(rand));
        }
      }
    } else {
      v += 0.006 * normal(rand);
    }
    xs[i] = v;
  }
  return decimate(xs, BUCKETS);
}

/**
 * Display traces for a scenario: one array per channel, values in [-1, 1]
 * evenly spaced across WINDOW_S, or null where the channel is absent.
 */
export function traces(scenario: Scenario): Record<Channel, number[] | null> {
  const beats = beatSchedule(scenario.rhythm, prng(hashString(scenario.id)));
  const out = {} as Record<Channel, number[] | null>;
  for (const { key } of CHANNELS) {
    const spec = scenario.channels[key];
    out[key] = spec.available ? channelTrace(spec.wave, beats, hashString(`${scenario.id}:${key}`)) : null;
  }
  return out;
}

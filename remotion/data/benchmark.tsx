/**
 * Benchmark data, ported from src/components/BenchmarkChart.tsx and extended.
 * Macro-F1 on MIMIC-IV top-50, ordered low → high for visual ascent,
 * ShifaMind last and highlighted.
 *
 * Pure data — NO JSX here (the mark for each row is resolved in the segment via
 * the `brand`/`icon` discriminator). Keeping JSX out of the data module avoids
 * the classic-vs-automatic JSX-runtime ambiguity that otherwise bit the bundle.
 *
 * Two additions vs the website chart:
 *  - LAAT (0.711), the prior specialized SOTA, sits just below ShifaMind so the
 *    story becomes "we match the best dedicated model — and we're the only one
 *    you can audit," rather than a height contest it would visually tie.
 *  - `interp`: a QUALITATIVE 0..1 position on the interpretability axis (does
 *    the model produce verifiable clinical-concept evidence?). Editorial
 *    positioning for the Accuracy×Interpretability quadrant, NOT a measured
 *    metric — tune freely. Concept-bottleneck models score high; LLMs low.
 */
export type Competitor = {
  label: string;
  value: number;
  /** Qualitative interpretability position, 0..1 (see file header). */
  interp: number;
  /** Competitor brand mark to draw, if any. */
  brand?: 'anthropic' | 'google' | 'openai';
  /** Neutral lucide glyph to draw, if any. */
  icon?: 'cbm' | 'gki' | 'laat';
  ours?: boolean;
};

export const COMPETITORS: Competitor[] = [
  { label: 'Vanilla CBM', value: 0.164, interp: 0.6, icon: 'cbm' },
  { label: 'Claude 4.6', value: 0.343, interp: 0.16, brand: 'anthropic' },
  { label: 'GPT-5.4', value: 0.417, interp: 0.16, brand: 'openai' },
  { label: 'Gemini 2.5 Pro', value: 0.435, interp: 0.18, brand: 'google' },
  { label: 'GKI-ICD', value: 0.649, interp: 0.12, icon: 'gki' },
  { label: 'LAAT', value: 0.711, interp: 0.28, icon: 'laat' },
  { label: 'ShifaMind', value: 0.712, interp: 0.92, ours: true },
];

export const Y_MAX = 0.8;
export const Y_TICKS = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];

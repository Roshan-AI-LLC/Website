/**
 * Every ShifaMind figure the site shows, in one place. Source: the full-code
 * paper (MIMIC-IV, full ICD-10 code space, held-out test set). Components
 * import from here so no number is typed in the UI.
 *
 * GoM-ICD is deliberately absent from the leaderboard: it is a three-model
 * ensemble with thresholds tuned on the test split, not a fair single-model
 * comparison. Do not add it back.
 */

export const TASK = {
  codes: 7_940,
  concepts: 16_227,
  /** Concepts routed into slots per note. */
  routedPerNote: 384,
  /** Sub-word tokens of note the encoder reads. */
  contextTokens: 6_144,
  encoder: 'BioClinical ModernBERT',
} as const;

export type BenchmarkRow = {
  model: string;
  aucMicro: number;
  aucMacro: number;
  f1Micro: number;
  f1Macro: number;
  ours?: boolean;
};

/** Table 1 of the paper, percent, best first. */
export const BENCHMARK_ROWS: BenchmarkRow[] = [
  { model: 'ShifaMind', aucMicro: 99.2, aucMacro: 96.7, f1Micro: 60.6, f1Macro: 26.8, ours: true },
  { model: 'PLM-ICD', aucMicro: 99.2, aucMacro: 96.6, f1Micro: 58.5, f1Macro: 21.1 },
  { model: 'LAAT', aucMicro: 99.0, aucMacro: 95.4, f1Micro: 57.9, f1Macro: 20.3 },
  { model: 'MultiResCNN', aucMicro: 99.0, aucMacro: 94.5, f1Micro: 56.9, f1Macro: 21.1 },
  { model: 'CAML', aucMicro: 98.5, aucMacro: 91.1, f1Micro: 55.4, f1Macro: 16.0 },
  { model: 'Bi-GRU', aucMicro: 98.3, aucMacro: 92.4, f1Micro: 50.1, f1Macro: 10.6 },
  { model: 'CNN', aucMicro: 97.5, aucMacro: 87.9, f1Micro: 47.2, f1Macro: 8.0 },
];

export const SHIFAMIND = BENCHMARK_ROWS.find((r) => r.ours)!;

/**
 * Table 4: measured on the same gates and contributions that make the
 * prediction, not on a separate explanation head.
 */
export const INTERPRETABILITY = {
  /** Gate against assertion labels. */
  conceptAuroc: 0.999,
  /** Probability kept with only the top concepts, against a random pick. */
  sufficiency: { model: 0.98, random: 0.26 },
  /** Mean gate on affirmed versus negated mentions. */
  meanGate: { affirmed: 0.998, negated: 0.013 },
  /** Micro-F1 with the model's own gates versus gates set to the assertion labels (a coder confirming each concept). */
  intervention: { ownGates: 60.8, assertionLabels: 60.8 },
  /** Pairs where one seed's strongest concept is in another seed's top 5, percent. */
  seedStability: 95,
} as const;

/** Formats a figure the way the paper prints it. */
export function pct(value: number, decimals = 1): string {
  return value.toFixed(decimals);
}

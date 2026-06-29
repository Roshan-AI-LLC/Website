/**
 * Interpretability metrics, taken directly from the ShifaMind paper (Figure 3 /
 * abstract). The ONLY rigorous interpretability comparison in the paper is
 * SHIFAMIND (MCB) vs a capacity-matched Vanilla CBM that shares the same
 * backbone, context length, and training setup — so the comparison isolates the
 * effect of the bottleneck form. Reported with non-overlapping bootstrap 95%
 * confidence intervals over 1,000 test-set resamples.
 *
 * These metrics are defined only for concept-bottleneck models, so they are NOT
 * compared against LLMs / LAAT / GKI-ICD (those don't produce concept
 * activations). No fabricated cross-model interpretability numbers here.
 */
export type Metric = {
  key: string;
  /** Full metric name. */
  name: string;
  shifamind: number;
  vanilla: number;
  /** Axis max for the bar (CSTPR/CCR are rates in [0,1]; CIM is a
   *  gradient-norm sensitivity, scale-free and interpreted comparatively). */
  max: number;
  decimals: number;
};

export const METRICS: Metric[] = [
  { key: 'CSTPR', name: 'Concept-Supported True Positive Rate', shifamind: 0.704, vanilla: 0.147, max: 1, decimals: 3 },
  { key: 'CIM', name: 'Concept Influence Magnitude', shifamind: 1.314, vanilla: 0.645, max: 1.5, decimals: 3 },
  { key: 'CCR', name: 'Concept-Conditioned Recall', shifamind: 0.836, vanilla: 0.361, max: 1, decimals: 3 },
];

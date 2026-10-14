/**
 * Every Nabz figure the site shows, in one place, from the two preprints.
 * Components import from here so no number is typed in the UI.
 *
 *   NabzGraph:  "Feedback-Robust AI for Patient Knowledge Graphs"
 *   NabzSentry: "Certified AI Triage of ICU Alarms"
 */

export const NABZGRAPH_PAPER_URL = 'https://arxiv.org/abs/2609.33248';
export const NABZSENTRY_PAPER_URL = 'https://arxiv.org/abs/2609.12365';

/**
 * NabzGraph. Surgical cohort: VitalDB (single centre, anesthesia records with
 * drug and ventilator actions). ICU cohort: MIMIC-IV Waveform Database.
 */
export const NABZGRAPH = {
  data: {
    surgicalCases: 3_442,
    surgicalHours: 12_653,
    actionEvents: 171_758,
    icuRecords: 167,
  },
  /** The benchmark of relations whose sign is fixed in advance by physics, pharmacology or practice. */
  bench: { relations: 29, responses: 19, policies: 10, estimators: 12 },
  /**
   * False concept-level relation instances per patient graph when the real
   * streams are replaced by null streams (surgical cohort). Ours vs the
   * correlational construction (lagged cross-correlation, co-occurrence,
   * Granger).
   */
  falseRelations: {
    ours: { transplant: 0.057, shift: 0.103 },
    correlational: { transplant: 12.4, shift: 10.07 },
  },
  /** Every relation edge carries pointers to the events behind it. */
  evidence: { edgesWithPointers: 191_490, edgesTotal: 191_490, pointersAudited: 12_346 },
  /** Mean surgical-cohort graph. */
  graph: { relationInstances: 35.7, signStable: 20.4, nodes: 28.14, edges: 58.05 },
  /** Concept heads on held-out ICU patients: mean AUROC against the monitor reference. */
  conceptAuroc: { ours: 0.962, ruleSupervised: 0.865, ruleDetector: 0.785, concepts: 7 },
  /** Beat-level couplings: pulse-arrival-time vs systolic-pressure slope. */
  beat: { patSbpNegativePct: 94.3, cases: 2_884, earlyLateCorrelation: 0.67 },
  /** Slow drug/ventilator responses that are patient-specific: none of 11. */
  slowResponsesPatientSpecific: { passed: 0, tested: 11 },
} as const;

/** Relation types a NabzGraph edge can carry. */
export const RELATION_TYPES = [
  {
    key: 'response',
    name: 'Response',
    example: 'Propofol ↑ → MAP ↓',
    line: 'What a drug or ventilator change does to the patient.',
  },
  {
    key: 'policy',
    name: 'Policy',
    example: 'Rising MAP → remifentanil ↑',
    line: 'What the clinician does in response to the patient.',
  },
  {
    key: 'association',
    name: 'Association',
    example: 'Hypotension ↔ bradycardia',
    line: 'Findings that travel together, with no causal claim.',
  },
  {
    key: 'mechanistic',
    name: 'Mechanistic',
    example: 'Pulse arrival time ↔ systolic pressure',
    line: 'Beat-by-beat couplings, tested per patient.',
  },
] as const;

/**
 * NabzGraph concept definitions: the rule each concept applies to a 30-s
 * window and its SNOMED CT code where it has one. From the paper's vital-concept
 * table (thresholds, codes) and beat-concept table (PPV > 13%; PAT measured
 * against the patient's own baseline). Capnography and beat concepts carry no
 * SNOMED code.
 */
export const NABZGRAPH_CONCEPTS = {
  tachycardia: { rule: 'HR > 100 bpm', snomed: '3424008' },
  tachycardiaPpg: { rule: 'Pulse rate > 100 bpm', snomed: '3424008' },
  bradycardia: { rule: 'HR < 60 bpm', snomed: '48867003' },
  tachypnea: { rule: 'RR > 20 /min', snomed: '271823003' },
  bradypnea: { rule: 'RR < 12 /min', snomed: '86684002' },
  hypotension: { rule: 'MAP < 65 mmHg', snomed: '45007003' },
  hypertension: { rule: 'MAP > 105 mmHg', snomed: '24184005' },
  hypercapnia: { rule: 'EtCO2 > 45 mmHg' },
  hypocapnia: { rule: 'EtCO2 < 30 mmHg' },
  highPpv: { rule: 'PPV > 13%' },
  prolongedPat: { rule: 'PAT above own baseline' },
} as const;

/**
 * NabzSentry, on the public VTaC benchmark of expert-adjudicated
 * ventricular-tachycardia alarms. Official test split, 3 seeds.
 */
export const NABZSENTRY = {
  data: { alarms: 5_037, falsePct: 71, testAlarms: 482, testGenuine: 137 },
  /** Certified operating point: at most 5% of suppressed alarms genuine, 95% confidence. */
  budgetPct: 5,
  /** The looser budget the paper also certifies on the official split. */
  looseBudgetPct: 10,
  /**
   * Where the selected suppression threshold (a true-alarm probability) lands
   * on the official split: between 0.01 and 0.08 at the 5% budget, at the top
   * of the grid (0.39-0.40) at 10%. The keep threshold is not reported.
   */
  suppressThresholdRange: { budget: [0.01, 0.08], looseBudget: [0.39, 0.4] },
  confidencePct: 95,
  seedsCertified: { certified: 3, of: 3 },
  falseAlarmsSuppressedPct: 74.8,
  genuineSilencedPct: 1.5,
  /** Discrimination, on par with the strongest published system. */
  auroc: 0.953,
  challengeScore: 83.33,
  candidatePolicies: 885,
  parametersM: 14.89,
  /** Waveform slots: two ECG leads, arterial pressure, pleth. */
  channels: 4,
} as const;

/** Formats a figure the way the papers print it. */
export function fmt(value: number, decimals = 1): string {
  return value.toFixed(decimals);
}

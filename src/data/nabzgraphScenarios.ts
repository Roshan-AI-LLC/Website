/**
 * Demo scenarios for the /products/nabzgraph interactive knowledge graph.
 *
 * All data is hand-curated for the demo. No live inference. The concept nodes,
 * persistence tiers, edge types, and statistics are clinically reasonable but
 * the "graphs" are prerendered, not produced by NabzGraph from real signals.
 *
 * Concepts stay within NabzGraph's 7-concept bottleneck vocabulary
 * (tachycardia/bradycardia on ECG, tachycardia on PPG, tachypnea/bradypnea on
 * RESP, hypotension/hypertension on ABP). A node is a (concept, tier) pair, so
 * one patient activates several nodes across the four modalities.
 *
 * Node and edge coordinates live in a fixed 640x400 canvas space; the demo
 * renders edges in an SVG with that viewBox and positions node chips as a
 * percentage of the same space, so the two layers stay aligned at any width.
 */

/** Sensor modality a concept is derived from. */
export type Modality = 'ECG' | 'PPG' | 'ABP' | 'RESP';

/**
 * Persistence tier, classified per concept from how long it stays active.
 *   TRANSIENT:  isolated, short-lived activations
 *   EPISODIC:   recurring bouts across the stay
 *   PERSISTENT: active across most of the stay
 */
export type Tier = 'TRANSIENT' | 'EPISODIC' | 'PERSISTENT';

/** A single 30s signal window that activated a concept node. */
export type SignalWindow = {
  /** Clock label for the window, e.g. "04:12". */
  t: string;
  /** Concept activation probability for this window, 0 to 1. */
  prob: number;
};

export type ConceptNode = {
  id: string;
  /** SNOMED-grounded concept name. */
  label: string;
  /** SNOMED CT concept id (illustrative). */
  snomed: string;
  modality: Modality;
  tier: Tier;
  /** Mean concept activation probability across activating windows, 0 to 1. */
  activation: number;
  /** Number of 30s windows that activated this concept. */
  windowCount: number;
  /** Position in the 640x400 canvas. */
  x: number;
  y: number;
  /** Representative activating windows shown in the evidence panel. */
  windows: SignalWindow[];
  /** Plain-language note on what the signal evidence shows. */
  evidence: string;
  /** Hourly activation density across the stay (0 to 1), drives the timeline. */
  density: number[];
};

/**
 * Edge type, each derived from a measurable property of the signal evidence
 * rather than imposed by an ontology:
 *   TEMPORAL:  lagged cross-correlation of concept activation series
 *   CO_OCCURS: Jaccard overlap of the two concepts' source-window sets
 *   GRANGER:   Granger causality on the underlying signal features
 */
export type EdgeType = 'TEMPORAL' | 'CO_OCCURS' | 'GRANGER';

export type GraphEdge = {
  id: string;
  type: EdgeType;
  source: string;
  target: string;
  /** Directed for TEMPORAL/GRANGER; undirected for CO_OCCURS. */
  directed: boolean;
  /** Short relation verb shown on hover, e.g. "precedes". */
  relation: string;
  /** Statistical evidence behind the edge, shown in the tooltip. */
  stat: { label: string; value: string }[];
};

export type Scenario = {
  id: 'sepsis' | 'respiratory' | 'haemodynamic' | 'drug';
  /** Short tab label. */
  label: string;
  /** Sub-label shown under the tabs when active. */
  subLabel: string;
  /** One-line clinical framing for the graph. */
  summary: string;
  nodes: ConceptNode[];
  edges: GraphEdge[];
};

// Hourly density helper keeps the literals below readable.
const d = (...v: number[]) => v;

export const SCENARIOS: Scenario[] = [
  // ───────────────────────────────────────────────── Sepsis progression
  {
    id: 'sepsis',
    label: 'Sepsis',
    subLabel: 'Early-warning trajectory, pneumonia admission',
    summary:
      'Tachycardia and tachypnea both precede hypotension, which decays into a peri-arrest bradycardia. The temporal chain is visible hours before the MAP alarm threshold is breached.',
    nodes: [
      {
        id: 'tachy_ecg',
        label: 'tachycardia',
        snomed: '3424008',
        modality: 'ECG',
        tier: 'EPISODIC',
        activation: 0.82,
        windowCount: 64,
        x: 150,
        y: 95,
        windows: [
          { t: '03:30', prob: 0.74 },
          { t: '04:00', prob: 0.86 },
          { t: '04:30', prob: 0.83 },
          { t: '06:10', prob: 0.79 },
        ],
        evidence:
          'ECG-derived heart rate sustained above 100 bpm in recurring bouts from hour 3 onward.',
        density: d(0, 0, 0.2, 0.6, 0.8, 0.7, 0.75, 0.7, 0.6, 0.5, 0.4, 0.35),
      },
      {
        id: 'tachy_ppg',
        label: 'tachycardia_ppg',
        snomed: '3424008',
        modality: 'PPG',
        tier: 'EPISODIC',
        activation: 0.74,
        windowCount: 47,
        x: 150,
        y: 255,
        windows: [
          { t: '04:05', prob: 0.69 },
          { t: '04:35', prob: 0.78 },
          { t: '06:15', prob: 0.72 },
        ],
        evidence:
          'PPG-derived pulse rate corroborates the ECG tachycardia across overlapping windows.',
        density: d(0, 0, 0.15, 0.5, 0.62, 0.55, 0.6, 0.52, 0.45, 0.4, 0.3, 0.25),
      },
      {
        id: 'tachypnea',
        label: 'tachypnea',
        snomed: '271823003',
        modality: 'RESP',
        tier: 'EPISODIC',
        activation: 0.78,
        windowCount: 55,
        x: 320,
        y: 330,
        windows: [
          { t: '03:50', prob: 0.72 },
          { t: '04:40', prob: 0.81 },
          { t: '05:30', prob: 0.79 },
        ],
        evidence:
          'Respiration rate above 22/min, climbing in step with the rising heart rate.',
        density: d(0, 0.1, 0.35, 0.65, 0.78, 0.72, 0.7, 0.6, 0.5, 0.42, 0.32, 0.25),
      },
      {
        id: 'htn_early',
        label: 'hypertension',
        snomed: '38341003',
        modality: 'ABP',
        tier: 'TRANSIENT',
        activation: 0.6,
        windowCount: 7,
        x: 340,
        y: 80,
        windows: [
          { t: '02:40', prob: 0.58 },
          { t: '03:10', prob: 0.62 },
        ],
        evidence:
          'A brief early pressor phase before the haemodynamic collapse, two short windows only.',
        density: d(0.2, 0.35, 0.3, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      },
      {
        id: 'hypo_abp',
        label: 'hypotension',
        snomed: '45007003',
        modality: 'ABP',
        tier: 'PERSISTENT',
        activation: 0.88,
        windowCount: 96,
        x: 505,
        y: 150,
        windows: [
          { t: '04:20', prob: 0.62 },
          { t: '06:40', prob: 0.81 },
          { t: '08:00', prob: 0.9 },
          { t: '09:30', prob: 0.92 },
        ],
        evidence:
          'Arterial MAP drifts below 65 mmHg from hour 6, becoming persistent by hour 8.',
        density: d(0, 0, 0, 0.2, 0.4, 0.5, 0.7, 0.85, 0.9, 0.92, 0.9, 0.88),
      },
      {
        id: 'brady_late',
        label: 'bradycardia',
        snomed: '48867003',
        modality: 'ECG',
        tier: 'TRANSIENT',
        activation: 0.64,
        windowCount: 9,
        x: 520,
        y: 315,
        windows: [
          { t: '09:50', prob: 0.61 },
          { t: '10:20', prob: 0.67 },
        ],
        evidence:
          'A late peri-arrest bradycardia emerging once hypotension is sustained.',
        density: d(0, 0, 0, 0, 0, 0, 0, 0, 0, 0.4, 0.55, 0.5),
      },
    ],
    edges: [
      {
        id: 's_tachy_hypo',
        type: 'TEMPORAL',
        source: 'tachy_ecg',
        target: 'hypo_abp',
        directed: true,
        relation: 'precedes',
        stat: [
          { label: 'lag', value: '~18 min' },
          { label: 'cross-corr', value: '0.71' },
        ],
      },
      {
        id: 's_tachy_cooccur',
        type: 'CO_OCCURS',
        source: 'tachy_ecg',
        target: 'tachy_ppg',
        directed: false,
        relation: 'co-occurs with',
        stat: [{ label: 'Jaccard', value: '0.82' }],
      },
      {
        id: 's_tachypnea_hypo',
        type: 'TEMPORAL',
        source: 'tachypnea',
        target: 'hypo_abp',
        directed: true,
        relation: 'precedes',
        stat: [
          { label: 'lag', value: '~25 min' },
          { label: 'cross-corr', value: '0.58' },
        ],
      },
      {
        id: 's_tachypnea_ppg',
        type: 'CO_OCCURS',
        source: 'tachypnea',
        target: 'tachy_ppg',
        directed: false,
        relation: 'co-occurs with',
        stat: [{ label: 'Jaccard', value: '0.61' }],
      },
      {
        id: 's_resp_granger',
        type: 'GRANGER',
        source: 'tachypnea',
        target: 'tachy_ecg',
        directed: true,
        relation: 'Granger-causes',
        stat: [
          { label: 'p-value', value: '0.004' },
          { label: 'direction', value: 'RESP to ECG' },
        ],
      },
      {
        id: 's_hypo_brady',
        type: 'TEMPORAL',
        source: 'hypo_abp',
        target: 'brady_late',
        directed: true,
        relation: 'precedes',
        stat: [
          { label: 'lag', value: '~30 min' },
          { label: 'cross-corr', value: '0.49' },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────── Respiratory decompensation
  {
    id: 'respiratory',
    label: 'Respiratory',
    subLabel: 'Post-surgical decompensation, driver identification',
    summary:
      'A Granger edge runs RESP to ECG: the respiratory pattern is driving the heart-rate elevation. The causal direction a simple alarm cannot give.',
    nodes: [
      {
        id: 'tachypnea',
        label: 'tachypnea',
        snomed: '271823003',
        modality: 'RESP',
        tier: 'EPISODIC',
        activation: 0.8,
        windowCount: 58,
        x: 160,
        y: 140,
        windows: [
          { t: '12:10', prob: 0.77 },
          { t: '12:40', prob: 0.82 },
          { t: '13:20', prob: 0.84 },
          { t: '14:05', prob: 0.79 },
        ],
        evidence:
          'Respiration rate above 22/min in recurring bouts, with rising effort across the afternoon.',
        density: d(0, 0, 0.3, 0.7, 0.8, 0.78, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2),
      },
      {
        id: 'tachy_ppg_r',
        label: 'tachycardia_ppg',
        snomed: '3424008',
        modality: 'PPG',
        tier: 'EPISODIC',
        activation: 0.76,
        windowCount: 52,
        x: 480,
        y: 110,
        windows: [
          { t: '12:15', prob: 0.72 },
          { t: '12:45', prob: 0.78 },
          { t: '13:25', prob: 0.8 },
        ],
        evidence:
          'PPG pulse rate elevated, tracking the respiratory bouts window for window.',
        density: d(0, 0, 0.25, 0.65, 0.75, 0.72, 0.65, 0.55, 0.45, 0.35, 0.25, 0.18),
      },
      {
        id: 'tachy_ecg_r',
        label: 'tachycardia',
        snomed: '3424008',
        modality: 'ECG',
        tier: 'EPISODIC',
        activation: 0.73,
        windowCount: 49,
        x: 450,
        y: 295,
        windows: [
          { t: '12:25', prob: 0.68 },
          { t: '13:00', prob: 0.75 },
          { t: '13:35', prob: 0.77 },
        ],
        evidence:
          'ECG heart rate elevation follows the respiratory pattern with a short lag.',
        density: d(0, 0, 0.15, 0.5, 0.68, 0.7, 0.66, 0.58, 0.48, 0.38, 0.28, 0.2),
      },
      {
        id: 'htn_r',
        label: 'hypertension',
        snomed: '38341003',
        modality: 'ABP',
        tier: 'EPISODIC',
        activation: 0.67,
        windowCount: 33,
        x: 195,
        y: 315,
        windows: [
          { t: '12:50', prob: 0.63 },
          { t: '13:30', prob: 0.7 },
          { t: '14:10', prob: 0.66 },
        ],
        evidence:
          'A sympathetic pressor response co-occurring with the respiratory distress.',
        density: d(0, 0, 0.1, 0.4, 0.6, 0.62, 0.55, 0.45, 0.38, 0.3, 0.22, 0.15),
      },
      {
        id: 'hypo_r',
        label: 'hypotension',
        snomed: '45007003',
        modality: 'ABP',
        tier: 'TRANSIENT',
        activation: 0.56,
        windowCount: 6,
        x: 540,
        y: 215,
        windows: [
          { t: '14:30', prob: 0.54 },
          { t: '15:00', prob: 0.59 },
        ],
        evidence:
          'A short late pressure dip as the work of breathing exhausts the patient.',
        density: d(0, 0, 0, 0, 0, 0, 0, 0, 0.3, 0.45, 0.2, 0),
      },
    ],
    edges: [
      {
        id: 'r_cooccur',
        type: 'CO_OCCURS',
        source: 'tachypnea',
        target: 'tachy_ppg_r',
        directed: false,
        relation: 'co-occurs with',
        stat: [{ label: 'Jaccard', value: '0.78' }],
      },
      {
        id: 'r_granger',
        type: 'GRANGER',
        source: 'tachypnea',
        target: 'tachy_ecg_r',
        directed: true,
        relation: 'Granger-causes',
        stat: [
          { label: 'p-value', value: '0.003' },
          { label: 'direction', value: 'RESP to ECG' },
        ],
      },
      {
        id: 'r_ppg_ecg',
        type: 'CO_OCCURS',
        source: 'tachy_ppg_r',
        target: 'tachy_ecg_r',
        directed: false,
        relation: 'co-occurs with',
        stat: [{ label: 'Jaccard', value: '0.86' }],
      },
      {
        id: 'r_resp_htn',
        type: 'TEMPORAL',
        source: 'tachypnea',
        target: 'htn_r',
        directed: true,
        relation: 'precedes',
        stat: [
          { label: 'lag', value: '~6 min' },
          { label: 'cross-corr', value: '0.52' },
        ],
      },
      {
        id: 'r_htn_ecg',
        type: 'CO_OCCURS',
        source: 'htn_r',
        target: 'tachy_ecg_r',
        directed: false,
        relation: 'co-occurs with',
        stat: [{ label: 'Jaccard', value: '0.44' }],
      },
      {
        id: 'r_ecg_hypo',
        type: 'TEMPORAL',
        source: 'tachy_ecg_r',
        target: 'hypo_r',
        directed: true,
        relation: 'precedes',
        stat: [
          { label: 'lag', value: '~22 min' },
          { label: 'cross-corr', value: '0.41' },
        ],
      },
    ],
  },

  // ──────────────────────────────────── Haemodynamic: chronic vs acute
  {
    id: 'haemodynamic',
    label: 'Haemodynamic',
    subLabel: 'Baseline hypertension vs anaesthesia washout',
    summary:
      'Hypertension is PERSISTENT; hypotension is TRANSIENT across three isolated episodes. The tier distinction rules out new instability without chart review.',
    nodes: [
      {
        id: 'htn',
        label: 'hypertension',
        snomed: '38341003',
        modality: 'ABP',
        tier: 'PERSISTENT',
        activation: 0.85,
        windowCount: 188,
        x: 180,
        y: 120,
        windows: [
          { t: '00:30', prob: 0.83 },
          { t: '04:00', prob: 0.86 },
          { t: '10:00', prob: 0.84 },
          { t: '16:00', prob: 0.87 },
        ],
        evidence:
          'Arterial pressure above baseline across more than 70% of the stay, consistent with chronic hypertension.',
        density: d(0.8, 0.82, 0.85, 0.83, 0.8, 0.84, 0.86, 0.82, 0.8, 0.85, 0.83, 0.81),
      },
      {
        id: 'tachy_h',
        label: 'tachycardia',
        snomed: '3424008',
        modality: 'ECG',
        tier: 'EPISODIC',
        activation: 0.69,
        windowCount: 44,
        x: 320,
        y: 300,
        windows: [
          { t: '02:10', prob: 0.66 },
          { t: '08:20', prob: 0.71 },
          { t: '14:40', prob: 0.7 },
        ],
        evidence:
          'Heart-rate elevation in recurring bouts, loosely tracking the pressure peaks.',
        density: d(0.2, 0.4, 0.5, 0.3, 0.25, 0.45, 0.5, 0.35, 0.3, 0.5, 0.45, 0.3),
      },
      {
        id: 'tachy_ppg_h',
        label: 'tachycardia_ppg',
        snomed: '3424008',
        modality: 'PPG',
        tier: 'EPISODIC',
        activation: 0.64,
        windowCount: 38,
        x: 150,
        y: 305,
        windows: [
          { t: '02:15', prob: 0.62 },
          { t: '08:25', prob: 0.67 },
          { t: '14:45', prob: 0.65 },
        ],
        evidence:
          'PPG pulse rate mirrors the ECG bouts, confirming true tachycardia over artefact.',
        density: d(0.18, 0.36, 0.45, 0.28, 0.22, 0.42, 0.46, 0.32, 0.27, 0.46, 0.42, 0.28),
      },
      {
        id: 'hypo_t',
        label: 'hypotension',
        snomed: '45007003',
        modality: 'ABP',
        tier: 'TRANSIENT',
        activation: 0.58,
        windowCount: 6,
        x: 495,
        y: 145,
        windows: [
          { t: '01:05', prob: 0.55 },
          { t: '07:30', prob: 0.6 },
          { t: '12:50', prob: 0.59 },
        ],
        evidence:
          'Three short isolated dips, each under two windows, consistent with anaesthesia washout.',
        density: d(0.3, 0, 0, 0, 0, 0, 0.3, 0, 0, 0, 0.25, 0),
      },
      {
        id: 'brady_h',
        label: 'bradycardia',
        snomed: '48867003',
        modality: 'ECG',
        tier: 'TRANSIENT',
        activation: 0.55,
        windowCount: 5,
        x: 490,
        y: 320,
        windows: [
          { t: '01:10', prob: 0.53 },
          { t: '07:35', prob: 0.58 },
        ],
        evidence:
          'A vagal bradycardia coinciding with each washout dip, not a sustained rhythm change.',
        density: d(0.28, 0, 0, 0, 0, 0, 0.26, 0, 0, 0, 0, 0),
      },
    ],
    edges: [
      {
        id: 'h_htn_tachy',
        type: 'CO_OCCURS',
        source: 'htn',
        target: 'tachy_h',
        directed: false,
        relation: 'co-occurs with',
        stat: [{ label: 'Jaccard', value: '0.34' }],
      },
      {
        id: 'h_tachy_ppg',
        type: 'CO_OCCURS',
        source: 'tachy_h',
        target: 'tachy_ppg_h',
        directed: false,
        relation: 'co-occurs with',
        stat: [{ label: 'Jaccard', value: '0.80' }],
      },
      {
        id: 'h_hypo_tachy',
        type: 'TEMPORAL',
        source: 'hypo_t',
        target: 'tachy_h',
        directed: true,
        relation: 'precedes',
        stat: [
          { label: 'lag', value: '~4 min' },
          { label: 'cross-corr', value: '0.29' },
        ],
      },
      {
        id: 'h_hypo_brady',
        type: 'TEMPORAL',
        source: 'hypo_t',
        target: 'brady_h',
        directed: true,
        relation: 'precedes',
        stat: [
          { label: 'lag', value: '~3 min' },
          { label: 'cross-corr', value: '0.31' },
        ],
      },
      {
        id: 'h_hypo_brady_cooccur',
        type: 'CO_OCCURS',
        source: 'hypo_t',
        target: 'brady_h',
        directed: false,
        relation: 'co-occurs with',
        stat: [{ label: 'Jaccard', value: '0.66' }],
      },
    ],
  },

  // ──────────────────────────────────────────── Drug response monitoring
  {
    id: 'drug',
    label: 'Drug response',
    subLabel: 'Metoprolol for tachycardia, 6h post-dose',
    summary:
      'Six hours post-dose, tachycardia has downgraded from persistent to episodic and a transient bradycardia plus pressure dip mark the pharmacologic effect, quantified without manual trend review.',
    nodes: [
      {
        id: 'tachy_dr',
        label: 'tachycardia',
        snomed: '3424008',
        modality: 'ECG',
        tier: 'EPISODIC',
        activation: 0.7,
        windowCount: 51,
        x: 195,
        y: 110,
        windows: [
          { t: '06:00', prob: 0.88 },
          { t: '08:00', prob: 0.74 },
          { t: '11:00', prob: 0.62 },
        ],
        evidence:
          'Heart rate elevated at admission, then fewer activating windows at lower probability after the dose.',
        density: d(0.9, 0.88, 0.8, 0.7, 0.55, 0.45, 0.4, 0.35, 0.3, 0.28, 0.25, 0.22),
      },
      {
        id: 'tachy_ppg_dr',
        label: 'tachycardia_ppg',
        snomed: '3424008',
        modality: 'PPG',
        tier: 'EPISODIC',
        activation: 0.66,
        windowCount: 43,
        x: 185,
        y: 280,
        windows: [
          { t: '06:05', prob: 0.85 },
          { t: '08:05', prob: 0.7 },
          { t: '11:05', prob: 0.58 },
        ],
        evidence:
          'PPG pulse rate tracks the same downtrend, confirming the falling heart rate is real.',
        density: d(0.86, 0.84, 0.76, 0.66, 0.5, 0.42, 0.38, 0.32, 0.28, 0.26, 0.23, 0.2),
      },
      {
        id: 'htn_dr',
        label: 'hypertension',
        snomed: '38341003',
        modality: 'ABP',
        tier: 'EPISODIC',
        activation: 0.68,
        windowCount: 39,
        x: 440,
        y: 105,
        windows: [
          { t: '06:10', prob: 0.72 },
          { t: '07:40', prob: 0.66 },
          { t: '09:30', prob: 0.6 },
        ],
        evidence:
          'Pre-treatment pressor state that softens as the beta-blockade takes effect.',
        density: d(0.7, 0.68, 0.62, 0.55, 0.45, 0.38, 0.32, 0.28, 0.24, 0.2, 0.18, 0.15),
      },
      {
        id: 'brady_dr',
        label: 'bradycardia',
        snomed: '48867003',
        modality: 'ECG',
        tier: 'TRANSIENT',
        activation: 0.6,
        windowCount: 8,
        x: 470,
        y: 290,
        windows: [
          { t: '10:40', prob: 0.58 },
          { t: '11:20', prob: 0.63 },
        ],
        evidence:
          'A short over-suppression dip below 60 bpm at peak drug level, two windows only.',
        density: d(0, 0, 0, 0, 0, 0, 0, 0, 0, 0.4, 0.55, 0.35),
      },
      {
        id: 'hypo_dr',
        label: 'hypotension',
        snomed: '45007003',
        modality: 'ABP',
        tier: 'TRANSIENT',
        activation: 0.57,
        windowCount: 7,
        x: 545,
        y: 185,
        windows: [
          { t: '10:50', prob: 0.55 },
          { t: '11:30', prob: 0.6 },
        ],
        evidence:
          'A transient pressure dip alongside the bradycardia, the expected pharmacologic nadir.',
        density: d(0, 0, 0, 0, 0, 0, 0, 0, 0.2, 0.45, 0.5, 0.3),
      },
    ],
    edges: [
      {
        id: 'd_tachy_ppg',
        type: 'CO_OCCURS',
        source: 'tachy_dr',
        target: 'tachy_ppg_dr',
        directed: false,
        relation: 'co-occurs with',
        stat: [{ label: 'Jaccard', value: '0.79' }],
      },
      {
        id: 'd_tachy_htn',
        type: 'CO_OCCURS',
        source: 'tachy_dr',
        target: 'htn_dr',
        directed: false,
        relation: 'co-occurs with',
        stat: [{ label: 'Jaccard', value: '0.42' }],
      },
      {
        id: 'd_tachy_brady',
        type: 'TEMPORAL',
        source: 'tachy_dr',
        target: 'brady_dr',
        directed: true,
        relation: 'downtrends to',
        stat: [
          { label: 'lag', value: '~4.5 h' },
          { label: 'cross-corr', value: '0.47' },
        ],
      },
      {
        id: 'd_htn_hypo',
        type: 'TEMPORAL',
        source: 'htn_dr',
        target: 'hypo_dr',
        directed: true,
        relation: 'precedes',
        stat: [
          { label: 'lag', value: '~40 min' },
          { label: 'cross-corr', value: '0.45' },
        ],
      },
      {
        id: 'd_brady_hypo',
        type: 'CO_OCCURS',
        source: 'brady_dr',
        target: 'hypo_dr',
        directed: false,
        relation: 'co-occurs with',
        stat: [{ label: 'Jaccard', value: '0.50' }],
      },
    ],
  },
];

/** Canvas dimensions the node/edge coordinates are authored against. */
export const CANVAS = { w: 640, h: 400 } as const;

/** Visual treatment per persistence tier. */
export const TIER_META: Record<
  Tier,
  { label: string; /** accent mix %, drives node brightness */ mix: number }
> = {
  PERSISTENT: { label: 'Persistent', mix: 100 },
  EPISODIC: { label: 'Episodic', mix: 62 },
  TRANSIENT: { label: 'Transient', mix: 34 },
};

/** Visual treatment per edge type. */
export const EDGE_META: Record<
  EdgeType,
  { label: string; dashed: boolean; width: number }
> = {
  TEMPORAL: { label: 'Temporal', dashed: true, width: 1.6 },
  CO_OCCURS: { label: 'Co-occurs', dashed: false, width: 1.6 },
  GRANGER: { label: 'Granger', dashed: false, width: 2.6 },
};

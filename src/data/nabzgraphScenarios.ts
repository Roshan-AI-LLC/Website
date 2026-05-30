/**
 * Demo scenarios for the /products/nabzgraph interactive knowledge graph.
 *
 * All data is hand-curated for the demo. No live inference. The concept nodes,
 * persistence tiers, edge types, and statistics are clinically reasonable but
 * the "graphs" are prerendered, not produced by NabzGraph from real signals.
 *
 * Node + edge coordinates live in a fixed 640×400 canvas space; the demo
 * renders edges in an SVG with that viewBox and positions node chips as a
 * percentage of the same space, so the two layers stay aligned at any width.
 */

/** Sensor modality a concept is derived from. */
export type Modality = 'ECG' | 'PPG' | 'ABP' | 'RESP';

/**
 * Persistence tier, classified per concept from how long it stays active.
 *   TRANSIENT  — isolated, short-lived activations
 *   EPISODIC   — recurring bouts across the stay
 *   PERSISTENT — active across most of the stay
 */
export type Tier = 'TRANSIENT' | 'EPISODIC' | 'PERSISTENT';

/** A single 30s signal window that activated a concept node. */
export type SignalWindow = {
  /** Clock label for the window, e.g. "04:12". */
  t: string;
  /** Concept activation probability for this window, 0–1. */
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
  /** Mean concept activation probability across activating windows, 0–1. */
  activation: number;
  /** Number of 30s windows that activated this concept. */
  windowCount: number;
  /** Position in the 640×400 canvas. */
  x: number;
  y: number;
  /** Representative activating windows shown in the evidence panel. */
  windows: SignalWindow[];
  /** Plain-language note on what the signal evidence shows. */
  evidence: string;
  /** Hourly activation density across the stay (0–1), drives the timeline. */
  density: number[];
};

/**
 * Edge type, each derived from a *measurable* property of the underlying
 * signal evidence rather than imposed by an ontology:
 *   TEMPORAL  — lagged cross-correlation of concept activation series
 *   CO_OCCURS — Jaccard overlap of the two concepts' source-window sets
 *   GRANGER   — Granger causality on the underlying signal features
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
  id: 'sepsis' | 'respiratory' | 'haemodynamic';
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
    subLabel: 'Early-warning trajectory · pneumonia admission',
    summary:
      'Tachycardia precedes hypotension by ~18 min. The temporal edge makes the trajectory visible 4 h before the MAP alarm threshold is breached.',
    nodes: [
      {
        id: 'tachy_ecg',
        label: 'tachycardia',
        snomed: '3424008',
        modality: 'ECG',
        tier: 'EPISODIC',
        activation: 0.82,
        windowCount: 64,
        x: 170,
        y: 120,
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
        activation: 0.71,
        windowCount: 41,
        x: 330,
        y: 300,
        windows: [
          { t: '04:05', prob: 0.69 },
          { t: '04:35', prob: 0.74 },
          { t: '06:15', prob: 0.7 },
        ],
        evidence:
          'PPG-derived pulse rate corroborates the ECG tachycardia across overlapping windows.',
        density: d(0, 0, 0.1, 0.4, 0.6, 0.55, 0.6, 0.5, 0.45, 0.4, 0.3, 0.25),
      },
      {
        id: 'hypo_abp',
        label: 'hypotension',
        snomed: '45007003',
        modality: 'ABP',
        tier: 'PERSISTENT',
        activation: 0.88,
        windowCount: 96,
        x: 480,
        y: 135,
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
    ],
    edges: [
      {
        id: 'e_tachy_hypo',
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
        id: 'e_tachy_cooccur',
        type: 'CO_OCCURS',
        source: 'tachy_ecg',
        target: 'tachy_ppg',
        directed: false,
        relation: 'co-occurs with',
        stat: [{ label: 'Jaccard', value: '0.64' }],
      },
    ],
  },

  // ───────────────────────────────────────────── Respiratory decompensation
  {
    id: 'respiratory',
    label: 'Respiratory',
    subLabel: 'Post-surgical decompensation · driver identification',
    summary:
      'A Granger edge runs RESP → ECG: the respiratory pattern is driving the heart-rate elevation. The causal direction a simple alarm cannot give.',
    nodes: [
      {
        id: 'tachypnea',
        label: 'tachypnea',
        snomed: '271823003',
        modality: 'RESP',
        tier: 'EPISODIC',
        activation: 0.8,
        windowCount: 58,
        x: 175,
        y: 150,
        windows: [
          { t: '12:10', prob: 0.77 },
          { t: '12:40', prob: 0.82 },
          { t: '13:20', prob: 0.84 },
          { t: '14:05', prob: 0.79 },
        ],
        evidence:
          'Respiration rate above 22/min in recurring bouts; rising effort across the afternoon.',
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
        x: 470,
        y: 120,
        windows: [
          { t: '12:15', prob: 0.72 },
          { t: '12:45', prob: 0.78 },
          { t: '13:25', prob: 0.8 },
        ],
        evidence:
          'PPG pulse rate elevated, tracking the respiratory bouts window-for-window.',
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
        x: 430,
        y: 305,
        windows: [
          { t: '12:25', prob: 0.68 },
          { t: '13:00', prob: 0.75 },
          { t: '13:35', prob: 0.77 },
        ],
        evidence:
          'ECG heart rate elevation follows the respiratory pattern with a short lag.',
        density: d(0, 0, 0.15, 0.5, 0.68, 0.7, 0.66, 0.58, 0.48, 0.38, 0.28, 0.2),
      },
    ],
    edges: [
      {
        id: 'e_resp_cooccur',
        type: 'CO_OCCURS',
        source: 'tachypnea',
        target: 'tachy_ppg_r',
        directed: false,
        relation: 'co-occurs with',
        stat: [{ label: 'Jaccard', value: '0.78' }],
      },
      {
        id: 'e_resp_granger',
        type: 'GRANGER',
        source: 'tachypnea',
        target: 'tachy_ecg_r',
        directed: true,
        relation: 'Granger-causes',
        stat: [
          { label: 'p-value', value: '0.003' },
          { label: 'direction', value: 'RESP → ECG' },
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
      'Hypertension is PERSISTENT; hypotension is TRANSIENT — three isolated episodes. The tier distinction rules out new instability without chart review.',
    nodes: [
      {
        id: 'htn',
        label: 'hypertension',
        snomed: '38341003',
        modality: 'ABP',
        tier: 'PERSISTENT',
        activation: 0.85,
        windowCount: 188,
        x: 195,
        y: 140,
        windows: [
          { t: '00:30', prob: 0.83 },
          { t: '04:00', prob: 0.86 },
          { t: '10:00', prob: 0.84 },
          { t: '16:00', prob: 0.87 },
        ],
        evidence:
          'Arterial pressure above baseline across >70% of the stay — consistent chronic hypertension.',
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
        x: 300,
        y: 305,
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
        id: 'hypo_t',
        label: 'hypotension',
        snomed: '45007003',
        modality: 'ABP',
        tier: 'TRANSIENT',
        activation: 0.58,
        windowCount: 6,
        x: 480,
        y: 150,
        windows: [
          { t: '01:05', prob: 0.55 },
          { t: '07:30', prob: 0.6 },
          { t: '12:50', prob: 0.59 },
        ],
        evidence:
          'Three short isolated dips, each under two windows — consistent with anaesthesia washout.',
        density: d(0.3, 0, 0, 0, 0, 0, 0.3, 0, 0, 0, 0.25, 0),
      },
    ],
    edges: [
      {
        id: 'e_htn_tachy',
        type: 'CO_OCCURS',
        source: 'htn',
        target: 'tachy_h',
        directed: false,
        relation: 'co-occurs with',
        stat: [{ label: 'Jaccard', value: '0.31' }],
      },
      {
        id: 'e_hypo_tachy',
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

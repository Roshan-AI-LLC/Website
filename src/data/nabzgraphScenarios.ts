/**
 * Demo scenarios for the /products/nabzgraph interactive knowledge graph.
 *
 * All data is hand-curated for the demo. No live inference. The concept nodes,
 * persistence tiers, edge types, and statistics are clinically reasonable but
 * the "graphs" are prerendered, not produced by NabzGraph from real signals.
 * Node and edge counts mirror what the real pipeline produces on a
 * MIMIC-IV-WDB stay: around a dozen nodes and a dense, Granger-dominant web.
 *
 * Concepts stay within NabzGraph's 7-concept bottleneck vocabulary
 * (tachycardia/bradycardia on ECG, tachycardia on PPG, tachypnea/bradypnea on
 * RESP, hypotension/hypertension on ABP). Node identity is a (concept, tier)
 * pair, so one concept can appear as several nodes across persistence tiers,
 * which is what fills out the graph. Each scenario uses at most five distinct
 * concepts so the grid stays readable in the demo card.
 *
 * Node positions are NOT authored here. GraphDemoBlock lays nodes out on a
 * deterministic grid: a column per concept (grouped by modality) and a row per
 * persistence tier, matching the real dashboard's layout. The CANVAS box below
 * is only the SVG viewBox the edge layer is drawn against.
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
  /** Position in the canvas, assigned at render time by the grid layout. */
  x?: number;
  y?: number;
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

// Compact factories so the dense literals below stay readable.
const d = (...v: number[]) => v;
const w = (t: string, prob: number): SignalWindow => ({ t, prob });

const n = (
  id: string,
  label: string,
  snomed: string,
  modality: Modality,
  tier: Tier,
  activation: number,
  windowCount: number,
  windows: SignalWindow[],
  evidence: string,
  density: number[],
): ConceptNode => ({ id, label, snomed, modality, tier, activation, windowCount, windows, evidence, density });

const gr = (id: string, s: string, t: string, p: string, dir: string): GraphEdge => ({
  id, type: 'GRANGER', source: s, target: t, directed: true, relation: 'Granger-causes',
  stat: [{ label: 'p', value: p }, { label: 'dir', value: dir }],
});
const co = (id: string, s: string, t: string, j: string): GraphEdge => ({
  id, type: 'CO_OCCURS', source: s, target: t, directed: false, relation: 'co-occurs with',
  stat: [{ label: 'Jaccard', value: j }],
});
const te = (id: string, s: string, t: string, lag: string, cc: string, rel = 'precedes'): GraphEdge => ({
  id, type: 'TEMPORAL', source: s, target: t, directed: true, relation: rel,
  stat: [{ label: 'lag', value: lag }, { label: 'cross-corr', value: cc }],
});

// SNOMED shorthands
const SN = {
  tachy: '3424008',
  brady: '48867003',
  tachypnea: '271823003',
  bradypnea: '426813001',
  hypo: '45007003',
  hyper: '38341003',
};

export const SCENARIOS: Scenario[] = [
  // ───────────────────────────────────────────────── Sepsis progression
  {
    id: 'sepsis',
    label: 'Sepsis',
    subLabel: 'Early-warning trajectory, pneumonia admission',
    summary:
      'Tachycardia and tachypnea escalate across tiers and both precede a persistent hypotension that decays into a peri-arrest bradycardia. The Granger web exposes the respiratory driver hours before the MAP alarm fires.',
    nodes: [
      n('s_tac_t', 'tachycardia', SN.tachy, 'ECG', 'TRANSIENT', 0.71, 8,
        [w('02:40', 0.68), w('03:05', 0.74)], 'Early isolated HR spikes above 100 bpm.',
        d(0.3, 0.5, 0.4, 0, 0, 0, 0, 0, 0, 0, 0, 0)),
      n('s_tac_e', 'tachycardia', SN.tachy, 'ECG', 'EPISODIC', 0.82, 64,
        [w('03:30', 0.74), w('04:30', 0.86)], 'Recurring tachycardia bouts from hour 3 onward.',
        d(0, 0.2, 0.5, 0.7, 0.8, 0.7, 0.65, 0.6, 0.5, 0.4, 0.35, 0.3)),
      n('s_tac_p', 'tachycardia', SN.tachy, 'ECG', 'PERSISTENT', 0.86, 121,
        [w('05:00', 0.85), w('07:00', 0.88)], 'HR sustained above 100 bpm across most of the deterioration.',
        d(0, 0, 0.3, 0.6, 0.85, 0.86, 0.85, 0.8, 0.78, 0.72, 0.6, 0.5)),
      n('s_bra_t', 'bradycardia', SN.brady, 'ECG', 'TRANSIENT', 0.64, 9,
        [w('09:50', 0.61), w('10:20', 0.67)], 'Late peri-arrest bradycardia once hypotension is sustained.',
        d(0, 0, 0, 0, 0, 0, 0, 0, 0, 0.4, 0.55, 0.5)),
      n('s_tpp_e', 'tachycardia_ppg', SN.tachy, 'PPG', 'EPISODIC', 0.76, 47,
        [w('04:05', 0.69), w('06:15', 0.78)], 'PPG pulse rate corroborates the ECG tachycardia.',
        d(0, 0.15, 0.45, 0.6, 0.62, 0.58, 0.55, 0.5, 0.45, 0.4, 0.3, 0.25)),
      n('s_tpp_p', 'tachycardia_ppg', SN.tachy, 'PPG', 'PERSISTENT', 0.8, 104,
        [w('05:10', 0.79), w('07:20', 0.82)], 'Sustained PPG tachycardia tracks the ECG persistently.',
        d(0, 0, 0.25, 0.55, 0.78, 0.8, 0.78, 0.74, 0.7, 0.64, 0.55, 0.45)),
      n('s_hyp_e', 'hypotension', SN.hypo, 'ABP', 'EPISODIC', 0.74, 41,
        [w('05:40', 0.66), w('06:40', 0.78)], 'MAP dipping below 65 mmHg in lengthening bouts.',
        d(0, 0, 0, 0.2, 0.45, 0.6, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2)),
      n('s_hyp_p', 'hypotension', SN.hypo, 'ABP', 'PERSISTENT', 0.88, 96,
        [w('08:00', 0.9), w('09:30', 0.92)], 'MAP persistently below 65 mmHg from hour 8.',
        d(0, 0, 0, 0.1, 0.3, 0.5, 0.7, 0.85, 0.9, 0.92, 0.9, 0.88)),
      n('s_tpn_t', 'tachypnea', SN.tachypnea, 'RESP', 'TRANSIENT', 0.66, 7,
        [w('02:55', 0.63), w('03:20', 0.7)], 'First respiratory bouts above 22 per minute.',
        d(0.2, 0.4, 0.45, 0, 0, 0, 0, 0, 0, 0, 0, 0)),
      n('s_tpn_e', 'tachypnea', SN.tachypnea, 'RESP', 'EPISODIC', 0.78, 55,
        [w('03:50', 0.72), w('05:30', 0.79)], 'Respiration rate climbing in step with heart rate.',
        d(0, 0.25, 0.55, 0.7, 0.78, 0.72, 0.68, 0.6, 0.5, 0.42, 0.32, 0.25)),
      n('s_tpn_p', 'tachypnea', SN.tachypnea, 'RESP', 'PERSISTENT', 0.83, 112,
        [w('04:40', 0.81), w('06:50', 0.84)], 'Sustained tachypnea, the earliest persistent driver.',
        d(0, 0.1, 0.5, 0.78, 0.83, 0.82, 0.8, 0.75, 0.68, 0.6, 0.5, 0.4)),
    ],
    edges: [
      co('s_co1', 's_tac_e', 's_tpp_e', '0.82'),
      co('s_co2', 's_tac_p', 's_tpp_p', '0.86'),
      co('s_co3', 's_tac_e', 's_tpn_e', '0.61'),
      co('s_co4', 's_tpp_e', 's_tpn_e', '0.58'),
      co('s_co5', 's_tac_p', 's_tpn_p', '0.64'),
      co('s_co6', 's_tpn_p', 's_hyp_p', '0.49'),
      gr('s_gr1', 's_tpn_e', 's_tac_e', '0.004', 'RESP→ECG'),
      gr('s_gr2', 's_tpn_p', 's_tac_p', '0.002', 'RESP→ECG'),
      gr('s_gr3', 's_tpn_e', 's_tpp_e', '0.006', 'RESP→PPG'),
      gr('s_gr4', 's_tpn_p', 's_hyp_p', '0.003', 'RESP→ABP'),
      gr('s_gr5', 's_tac_p', 's_hyp_p', '0.005', 'ECG→ABP'),
      gr('s_gr6', 's_tac_e', 's_hyp_e', '0.009', 'ECG→ABP'),
      gr('s_gr7', 's_tpp_p', 's_hyp_p', '0.011', 'PPG→ABP'),
      gr('s_gr8', 's_hyp_p', 's_bra_t', '0.007', 'ABP→ECG'),
      gr('s_gr9', 's_tpn_p', 's_hyp_e', '0.008', 'RESP→ABP'),
      te('s_te1', 's_tac_t', 's_tac_e', '~20 min', '0.7', 'escalates to'),
      te('s_te2', 's_tac_e', 's_tac_p', '~35 min', '0.66', 'escalates to'),
      te('s_te3', 's_tpn_t', 's_tpn_e', '~18 min', '0.68', 'escalates to'),
      te('s_te4', 's_tpn_e', 's_tpn_p', '~30 min', '0.71', 'escalates to'),
      te('s_te5', 's_tac_e', 's_hyp_p', '~18 min', '0.71'),
      te('s_te6', 's_tpn_e', 's_hyp_p', '~25 min', '0.58'),
      te('s_te7', 's_hyp_e', 's_hyp_p', '~50 min', '0.62', 'deepens to'),
      te('s_te8', 's_hyp_p', 's_bra_t', '~30 min', '0.49'),
    ],
  },

  // ───────────────────────────────────────────── Respiratory decompensation
  {
    id: 'respiratory',
    label: 'Respiratory',
    subLabel: 'Post-surgical decompensation, driver identification',
    summary:
      'A fan of Granger edges runs RESP to ECG and RESP to PPG: the respiratory pattern is driving the heart-rate elevation across every tier. The causal direction a threshold alarm cannot give.',
    nodes: [
      n('r_tac_t', 'tachycardia', SN.tachy, 'ECG', 'TRANSIENT', 0.69, 9,
        [w('11:50', 0.66), w('12:05', 0.71)], 'First HR spikes as the respiratory effort begins.',
        d(0.3, 0.5, 0.4, 0, 0, 0, 0, 0, 0, 0, 0, 0)),
      n('r_tac_e', 'tachycardia', SN.tachy, 'ECG', 'EPISODIC', 0.73, 49,
        [w('12:25', 0.68), w('13:35', 0.77)], 'ECG heart rate elevation follows respiration with a short lag.',
        d(0, 0.15, 0.5, 0.68, 0.7, 0.66, 0.58, 0.48, 0.38, 0.28, 0.2, 0.14)),
      n('r_tac_p', 'tachycardia', SN.tachy, 'ECG', 'PERSISTENT', 0.77, 96,
        [w('13:00', 0.76), w('14:20', 0.79)], 'Sustained sinus tachycardia, secondary to the respiratory load.',
        d(0, 0.2, 0.6, 0.77, 0.76, 0.7, 0.6, 0.5, 0.4, 0.32, 0.24, 0.18)),
      n('r_tpp_e', 'tachycardia_ppg', SN.tachy, 'PPG', 'EPISODIC', 0.76, 52,
        [w('12:15', 0.72), w('13:25', 0.8)], 'PPG pulse rate elevated, tracking the respiratory bouts.',
        d(0, 0.25, 0.65, 0.75, 0.72, 0.65, 0.55, 0.45, 0.35, 0.25, 0.18, 0.12)),
      n('r_tpp_p', 'tachycardia_ppg', SN.tachy, 'PPG', 'PERSISTENT', 0.79, 101,
        [w('12:50', 0.78), w('14:10', 0.81)], 'Sustained PPG tachycardia follows the respiratory pattern.',
        d(0, 0.3, 0.7, 0.79, 0.78, 0.72, 0.62, 0.52, 0.42, 0.34, 0.26, 0.2)),
      n('r_hyp_t', 'hypotension', SN.hypo, 'ABP', 'TRANSIENT', 0.56, 6,
        [w('14:30', 0.54), w('15:00', 0.59)], 'Short late pressure dip as the work of breathing exhausts the patient.',
        d(0, 0, 0, 0, 0, 0, 0, 0, 0.3, 0.45, 0.2, 0)),
      n('r_htn_e', 'hypertension', SN.hyper, 'ABP', 'EPISODIC', 0.67, 33,
        [w('12:50', 0.63), w('14:10', 0.7)], 'Sympathetic pressor response to the respiratory distress.',
        d(0, 0.1, 0.4, 0.6, 0.62, 0.55, 0.45, 0.38, 0.3, 0.22, 0.15, 0.1)),
      n('r_htn_p', 'hypertension', SN.hyper, 'ABP', 'PERSISTENT', 0.72, 88,
        [w('13:10', 0.71), w('14:30', 0.74)], 'Sustained pressure elevation through the distress window.',
        d(0, 0.2, 0.55, 0.7, 0.72, 0.66, 0.56, 0.46, 0.36, 0.28, 0.2, 0.14)),
      n('r_tpn_t', 'tachypnea', SN.tachypnea, 'RESP', 'TRANSIENT', 0.65, 8,
        [w('11:40', 0.62), w('12:00', 0.69)], 'Opening respiratory bouts before the pattern sets in.',
        d(0.35, 0.5, 0.4, 0, 0, 0, 0, 0, 0, 0, 0, 0)),
      n('r_tpn_e', 'tachypnea', SN.tachypnea, 'RESP', 'EPISODIC', 0.8, 58,
        [w('12:10', 0.77), w('13:20', 0.84)], 'Respiration above 22 per minute in recurring bouts.',
        d(0, 0.3, 0.7, 0.8, 0.78, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.15)),
      n('r_tpn_p', 'tachypnea', SN.tachypnea, 'RESP', 'PERSISTENT', 0.85, 119,
        [w('12:40', 0.82), w('14:05', 0.86)], 'Sustained high respiratory rate, the primary driver.',
        d(0, 0.4, 0.78, 0.85, 0.84, 0.78, 0.7, 0.6, 0.5, 0.4, 0.32, 0.25)),
    ],
    edges: [
      gr('r_gr1', 'r_tpn_e', 'r_tac_e', '0.003', 'RESP→ECG'),
      gr('r_gr2', 'r_tpn_p', 'r_tac_p', '0.002', 'RESP→ECG'),
      gr('r_gr3', 'r_tpn_e', 'r_tpp_e', '0.004', 'RESP→PPG'),
      gr('r_gr4', 'r_tpn_p', 'r_tpp_p', '0.003', 'RESP→PPG'),
      gr('r_gr5', 'r_tpn_p', 'r_htn_p', '0.01', 'RESP→ABP'),
      gr('r_gr6', 'r_tpn_e', 'r_htn_e', '0.014', 'RESP→ABP'),
      gr('r_gr7', 'r_tac_p', 'r_htn_p', '0.02', 'ECG→ABP'),
      gr('r_gr8', 'r_tpn_p', 'r_hyp_t', '0.03', 'RESP→ABP'),
      co('r_co1', 'r_tpn_e', 'r_tpp_e', '0.78'),
      co('r_co2', 'r_tpn_p', 'r_tpp_p', '0.81'),
      co('r_co3', 'r_tpp_e', 'r_tac_e', '0.86'),
      co('r_co4', 'r_tpp_p', 'r_tac_p', '0.84'),
      co('r_co5', 'r_htn_e', 'r_tac_e', '0.44'),
      co('r_co6', 'r_htn_p', 'r_tac_p', '0.47'),
      te('r_te1', 'r_tac_t', 'r_tac_e', '~16 min', '0.66', 'escalates to'),
      te('r_te2', 'r_tpn_t', 'r_tpn_e', '~14 min', '0.67', 'escalates to'),
      te('r_te3', 'r_tpn_e', 'r_tpn_p', '~24 min', '0.72', 'escalates to'),
      te('r_te4', 'r_tac_e', 'r_tac_p', '~28 min', '0.69', 'escalates to'),
      te('r_te5', 'r_tpn_e', 'r_htn_e', '~6 min', '0.52'),
      te('r_te6', 'r_htn_p', 'r_hyp_t', '~3.2 h', '0.4', 'gives way to'),
      te('r_te7', 'r_tac_e', 'r_hyp_t', '~22 min', '0.41'),
    ],
  },

  // ──────────────────────────────────── Haemodynamic: chronic vs acute
  {
    id: 'haemodynamic',
    label: 'Haemodynamic',
    subLabel: 'Baseline hypertension vs anaesthesia washout',
    summary:
      'Hypertension is PERSISTENT across the whole stay; hypotension and bradycardia appear only as TRANSIENT washout episodes. The tier structure rules out new instability without a chart review.',
    nodes: [
      n('h_tac_e', 'tachycardia', SN.tachy, 'ECG', 'EPISODIC', 0.69, 44,
        [w('02:10', 0.66), w('14:40', 0.7)], 'Heart-rate bouts loosely tracking the pressure peaks.',
        d(0.2, 0.4, 0.5, 0.3, 0.25, 0.45, 0.5, 0.35, 0.3, 0.5, 0.45, 0.3)),
      n('h_tac_p', 'tachycardia', SN.tachy, 'ECG', 'PERSISTENT', 0.72, 96,
        [w('03:00', 0.71), w('15:00', 0.73)], 'A persistent mild tachycardia accompanying the hypertension.',
        d(0.5, 0.55, 0.6, 0.5, 0.48, 0.58, 0.6, 0.52, 0.5, 0.6, 0.55, 0.5)),
      n('h_bra_t', 'bradycardia', SN.brady, 'ECG', 'TRANSIENT', 0.55, 5,
        [w('01:10', 0.53), w('07:35', 0.58)], 'A vagal bradycardia coinciding with each washout dip.',
        d(0.28, 0, 0, 0, 0, 0, 0.26, 0, 0, 0, 0, 0)),
      n('h_tpp_e', 'tachycardia_ppg', SN.tachy, 'PPG', 'EPISODIC', 0.64, 38,
        [w('02:15', 0.62), w('14:45', 0.65)], 'PPG pulse rate mirrors the ECG bouts, confirming true tachycardia.',
        d(0.18, 0.36, 0.45, 0.28, 0.22, 0.42, 0.46, 0.32, 0.27, 0.46, 0.42, 0.28)),
      n('h_tpp_p', 'tachycardia_ppg', SN.tachy, 'PPG', 'PERSISTENT', 0.68, 90,
        [w('03:05', 0.67), w('15:05', 0.69)], 'Sustained PPG tachycardia confirms the ECG persistence.',
        d(0.46, 0.5, 0.56, 0.46, 0.44, 0.54, 0.56, 0.48, 0.46, 0.56, 0.52, 0.46)),
      n('h_hyp_t', 'hypotension', SN.hypo, 'ABP', 'TRANSIENT', 0.58, 6,
        [w('01:05', 0.55), w('12:50', 0.59)], 'Three short isolated dips, each under two windows, anaesthesia washout.',
        d(0.3, 0, 0, 0, 0, 0, 0.3, 0, 0, 0, 0.25, 0)),
      n('h_hyp_e', 'hypotension', SN.hypo, 'ABP', 'EPISODIC', 0.6, 14,
        [w('07:25', 0.58), w('07:55', 0.62)], 'One slightly longer dip mid-stay, still self-limiting.',
        d(0, 0, 0, 0, 0, 0, 0.4, 0.45, 0.2, 0, 0, 0)),
      n('h_htn_e', 'hypertension', SN.hyper, 'ABP', 'EPISODIC', 0.78, 52,
        [w('04:00', 0.8), w('14:40', 0.79)], 'Pressure surges layered on the chronic baseline.',
        d(0.4, 0.6, 0.5, 0.45, 0.5, 0.62, 0.58, 0.5, 0.45, 0.6, 0.55, 0.48)),
      n('h_htn_p', 'hypertension', SN.hyper, 'ABP', 'PERSISTENT', 0.85, 188,
        [w('00:30', 0.83), w('16:00', 0.87)], 'Arterial pressure above baseline over 70% of the stay, chronic hypertension.',
        d(0.8, 0.82, 0.85, 0.83, 0.8, 0.84, 0.86, 0.82, 0.8, 0.85, 0.83, 0.81)),
    ],
    edges: [
      co('h_co1', 'h_htn_p', 'h_tac_p', '0.4'),
      co('h_co2', 'h_htn_e', 'h_tac_e', '0.36'),
      co('h_co3', 'h_tac_e', 'h_tpp_e', '0.8'),
      co('h_co4', 'h_tac_p', 'h_tpp_p', '0.83'),
      co('h_co5', 'h_hyp_t', 'h_bra_t', '0.66'),
      gr('h_gr1', 'h_htn_p', 'h_tac_p', '0.03', 'ABP→ECG'),
      gr('h_gr2', 'h_htn_e', 'h_tac_e', '0.04', 'ABP→ECG'),
      gr('h_gr3', 'h_tac_p', 'h_tpp_p', '0.006', 'ECG→PPG'),
      gr('h_gr4', 'h_tac_e', 'h_tpp_e', '0.009', 'ECG→PPG'),
      gr('h_gr5', 'h_hyp_t', 'h_bra_t', '0.02', 'ABP→ECG'),
      te('h_te1', 'h_htn_e', 'h_htn_p', '~1.5 h', '0.5', 'sustains as'),
      te('h_te2', 'h_hyp_t', 'h_tac_e', '~4 min', '0.29'),
      te('h_te3', 'h_hyp_t', 'h_bra_t', '~3 min', '0.31'),
      te('h_te4', 'h_hyp_e', 'h_tac_e', '~5 min', '0.33'),
      te('h_te5', 'h_tac_e', 'h_tac_p', '~2 h', '0.55', 'sustains as'),
      te('h_te6', 'h_hyp_t', 'h_hyp_e', '~6 h', '0.3', 'recurs as'),
    ],
  },

  // ──────────────────────────────────────────── Drug response monitoring
  {
    id: 'drug',
    label: 'Drug response',
    subLabel: 'Metoprolol for tachycardia, 6h post-dose',
    summary:
      'Six hours post-dose the persistent tachycardia has downgraded to episodic, hypertension is softening, and a transient bradycardia plus pressure dip mark the pharmacologic nadir, quantified without manual trend review.',
    nodes: [
      n('d_tac_t', 'tachycardia', SN.tachy, 'ECG', 'TRANSIENT', 0.66, 7,
        [w('05:40', 0.64), w('05:55', 0.69)], 'Pre-dose HR spikes at admission.',
        d(0.7, 0.6, 0.3, 0, 0, 0, 0, 0, 0, 0, 0, 0)),
      n('d_tac_e', 'tachycardia', SN.tachy, 'ECG', 'EPISODIC', 0.7, 51,
        [w('08:00', 0.74), w('11:00', 0.62)], 'Downgraded to episodic bouts after the dose takes effect.',
        d(0.2, 0.3, 0.45, 0.6, 0.55, 0.45, 0.4, 0.35, 0.3, 0.28, 0.25, 0.22)),
      n('d_tac_p', 'tachycardia', SN.tachy, 'ECG', 'PERSISTENT', 0.84, 118,
        [w('06:00', 0.88), w('07:00', 0.83)], 'Persistent tachycardia at admission, pre-treatment.',
        d(0.9, 0.88, 0.8, 0.6, 0.4, 0.3, 0.25, 0.2, 0.18, 0.16, 0.14, 0.12)),
      n('d_brady_t', 'bradycardia', SN.brady, 'ECG', 'TRANSIENT', 0.6, 8,
        [w('10:40', 0.58), w('11:20', 0.63)], 'Short over-suppression below 60 bpm at peak drug level.',
        d(0, 0, 0, 0, 0, 0, 0, 0, 0, 0.4, 0.55, 0.35)),
      n('d_brady_e', 'bradycardia', SN.brady, 'ECG', 'EPISODIC', 0.62, 18,
        [w('10:30', 0.6), w('12:00', 0.64)], 'Recurring relative bradycardia as the heart rate settles low.',
        d(0, 0, 0, 0, 0, 0, 0.2, 0.3, 0.4, 0.5, 0.55, 0.45)),
      n('d_tpp_e', 'tachycardia_ppg', SN.tachy, 'PPG', 'EPISODIC', 0.66, 43,
        [w('08:05', 0.7), w('11:05', 0.58)], 'PPG pulse rate tracks the same downtrend, confirming the fall is real.',
        d(0.2, 0.28, 0.42, 0.55, 0.5, 0.42, 0.38, 0.32, 0.28, 0.26, 0.23, 0.2)),
      n('d_tpp_p', 'tachycardia_ppg', SN.tachy, 'PPG', 'PERSISTENT', 0.8, 102,
        [w('06:05', 0.85), w('07:05', 0.79)], 'PPG confirms the pre-dose persistent tachycardia.',
        d(0.86, 0.84, 0.76, 0.58, 0.4, 0.3, 0.26, 0.22, 0.2, 0.18, 0.16, 0.14)),
      n('d_hyp_t', 'hypotension', SN.hypo, 'ABP', 'TRANSIENT', 0.57, 7,
        [w('10:50', 0.55), w('11:30', 0.6)], 'Transient pressure dip alongside the bradycardia, the expected nadir.',
        d(0, 0, 0, 0, 0, 0, 0, 0, 0.2, 0.45, 0.5, 0.3)),
      n('d_htn_e', 'hypertension', SN.hyper, 'ABP', 'EPISODIC', 0.68, 39,
        [w('06:10', 0.72), w('09:30', 0.6)], 'Pre-treatment pressor state that softens as beta-blockade takes hold.',
        d(0.7, 0.68, 0.62, 0.5, 0.42, 0.36, 0.3, 0.26, 0.22, 0.2, 0.18, 0.15)),
      n('d_htn_p', 'hypertension', SN.hyper, 'ABP', 'PERSISTENT', 0.74, 90,
        [w('06:15', 0.76), w('07:30', 0.72)], 'Sustained early hypertension before the drug effect.',
        d(0.76, 0.74, 0.66, 0.52, 0.42, 0.34, 0.28, 0.24, 0.2, 0.18, 0.16, 0.14)),
    ],
    edges: [
      co('d_co1', 'd_tac_p', 'd_tpp_p', '0.85'),
      co('d_co2', 'd_tac_e', 'd_tpp_e', '0.79'),
      co('d_co3', 'd_tac_p', 'd_htn_p', '0.42'),
      co('d_co4', 'd_tac_e', 'd_htn_e', '0.38'),
      co('d_co5', 'd_brady_t', 'd_hyp_t', '0.5'),
      co('d_co6', 'd_brady_e', 'd_brady_t', '0.6'),
      gr('d_gr1', 'd_tac_p', 'd_tpp_p', '0.005', 'ECG→PPG'),
      gr('d_gr2', 'd_tac_e', 'd_tpp_e', '0.008', 'ECG→PPG'),
      gr('d_gr3', 'd_htn_p', 'd_tac_p', '0.02', 'ABP→ECG'),
      gr('d_gr4', 'd_brady_e', 'd_hyp_t', '0.03', 'ECG→ABP'),
      te('d_te1', 'd_tac_t', 'd_tac_p', '~25 min', '0.5', 'sustains as'),
      te('d_te2', 'd_tac_p', 'd_tac_e', '~4.5 h', '0.47', 'downtrends to'),
      te('d_te3', 'd_tpp_p', 'd_tpp_e', '~4.5 h', '0.45', 'downtrends to'),
      te('d_te4', 'd_htn_p', 'd_htn_e', '~3 h', '0.5', 'softens to'),
      te('d_te5', 'd_tac_e', 'd_brady_t', '~5 h', '0.43', 'overshoots to'),
      te('d_te6', 'd_htn_e', 'd_hyp_t', '~40 min', '0.45'),
      te('d_te7', 'd_brady_e', 'd_brady_t', '~1 h', '0.52', 'deepens to'),
    ],
  },
];

/** Canvas dimensions the edge-layer viewBox is drawn against. */
export const CANVAS = { w: 760, h: 470 } as const;

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
  TEMPORAL: { label: 'Temporal', dashed: true, width: 1.3 },
  CO_OCCURS: { label: 'Co-occurs', dashed: false, width: 1.3 },
  GRANGER: { label: 'Granger', dashed: false, width: 1.8 },
};

/** Canonical column order (concept grouped by modality) for the grid layout. */
export const CONCEPT_COLUMN_ORDER: string[] = [
  'tachycardia',
  'bradycardia',
  'tachycardia_ppg',
  'hypotension',
  'hypertension',
  'tachypnea',
  'bradypnea',
];

/** Row order for the grid layout (top to bottom). */
export const TIER_ROW_ORDER: Tier[] = ['TRANSIENT', 'EPISODIC', 'PERSISTENT'];

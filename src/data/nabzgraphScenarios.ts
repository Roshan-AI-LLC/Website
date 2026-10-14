/**
 * Demo scenarios for the /products/nabz/graph interactive patient graph.
 *
 * ILLUSTRATIVE DATA. Every scenario is hand-curated for the demo: no live
 * inference, and no number below (episode counts, readings, doses, signs,
 * lags, pointer counts) is a result from the paper. Paper figures live in
 * nabzPapers.ts. The structure, though, follows the NabzGraph model:
 *
 *   Nodes
 *     concept:  a finding x persistence tier (transient / episodic /
 *               persistent), with the episodes that activated it. Vital
 *               concepts are thresholds on a monitor numeric (e.g.
 *               hypotension: MAP < 65 mmHg); beat concepts (prolonged PAT,
 *               high PPV) are computed from the beat series.
 *     action:   a drug target or rate, or a ventilator setting, with its
 *               time-stamped changes.
 *     variable: a vital (MAP, HR, EtCO2) or a beat-level series (SBP, PAT,
 *               R-R interval, respiration).
 *
 *   Edges (typed relations, each pointing to the events behind it)
 *     RESPONSE:    action -> vital. What a change does. (The paper's
 *                  concept-level responses fail their pre-specified sign
 *                  checks, so the demo shows no action -> concept response.)
 *     POLICY:      vital or concept -> action. What the clinician does.
 *     ASSOCIATION: concept <-> concept on different vitals, no causal claim.
 *     MECHANISTIC: beat-level couplings, tested per patient. Respiration ->
 *                  SBP and respiration -> R-R are directed; PAT <-> SBP is not.
 *
 *   Every concept-level relation shown, and its sign, is one the paper
 *   reports as sign-stable (e.g. hypotension -> phenylephrine up; tachycardia
 *   <-> hypotension is negative on the ICU records).
 *
 * Surgical scenarios mirror the VitalDB graphs (actions, vitals, beat level);
 * the ICU scenario mirrors the MIMIC-IV-WDB graphs, which have no action
 * records and no beat layer, so it carries association relations only.
 *
 * Layout is deterministic (see layoutScenario): column groups left to right,
 * [Concepts] [Actions] [Variables | Beat level]. One column per concept, in
 * the order the concept first appears in `nodes`, with one row per tier.
 * Action and variable nodes sit at their authored `row` (0 = top tier row,
 * 2 = bottom). Beat-level nodes sit in one of two lanes inside a shaded band.
 * Phones use the portrait canvas: the same layout turned a quarter, so the
 * groups run top to bottom and the tiers left to right.
 */

import { NABZGRAPH_CONCEPTS, RELATION_TYPES } from './nabzPapers';

type ConceptDef = keyof typeof NABZGRAPH_CONCEPTS;

/** Source signal, drives the synthesized waveform in the evidence panel. */
export type Modality = 'ECG' | 'PPG' | 'ABP' | 'RESP' | 'CO2';

/**
 * Persistence tier of a concept's episodes.
 *   TRANSIENT:  short episodes
 *   EPISODIC:   mid-length bouts
 *   PERSISTENT: long episodes
 */
export type Tier = 'TRANSIENT' | 'EPISODIC' | 'PERSISTENT';

/** One episode a concept node points to: its start time and a reading. */
export type Episode = {
  /** Clock label, e.g. "08:42". */
  t: string;
  /** Short reading from the episode, e.g. "MAP 58". */
  v: string;
};

/** One recorded change of an action. */
export type ActionChange = {
  /** Clock label of the change. */
  t: string;
  /** New value, in the action's unit. */
  to: number;
};

type NodeBase = {
  id: string;
  /** Display name, kept short for the canvas. */
  label: string;
  /** Small tag drawn above the node (source vital, DRUG / VENT, or unit). */
  tag: string;
  /** One short line for the evidence panel. */
  note: string;
  /** Position in the canvas, assigned by layoutScenario. */
  x?: number;
  y?: number;
};

export type ConceptNode = NodeBase & {
  kind: 'concept';
  level: 'vital' | 'beat';
  /** The rule the concept applies to a window, e.g. "MAP < 65 mmHg". */
  rule: string;
  /** SNOMED CT id where the concept has one. */
  snomed?: string;
  modality: Modality;
  tier: Tier;
  /** Episodes in this tier, and the 30-s windows they span. */
  episodes: number;
  windows: number;
  /** Representative episodes shown as evidence. */
  spans: Episode[];
  /** Activity across the record (0 to 1 per bucket), drives the timeline. */
  density: number[];
  /** Beat-level lane (beat concepts only). */
  lane?: 0 | 1;
};

export type ActionNode = NodeBase & {
  kind: 'action';
  family: 'drug' | 'ventilator';
  /** What is set, e.g. "Target" or "Set rate". */
  setting: string;
  unit: string;
  /** Value in force at the start of the record. */
  start: number;
  changes: ActionChange[];
  row: number;
};

export type VariableNode = NodeBase & {
  kind: 'variable';
  level: 'vital' | 'beat';
  /** Full name, e.g. "Mean arterial pressure". */
  name: string;
  modality: Modality;
  row: number;
  /** Beat-level lane (beat variables only). */
  lane?: 0 | 1;
};

export type GraphNode = ConceptNode | ActionNode | VariableNode;

export type EdgeType = 'RESPONSE' | 'POLICY' | 'ASSOCIATION' | 'MECHANISTIC';

export type GraphEdge = {
  id: string;
  type: EdgeType;
  source: string;
  target: string;
  directed: boolean;
  /** Readable relation, e.g. "Propofol ↑ → MAP ↓". */
  phrase: string;
  /** Short stats for the tooltip, e.g. sign and lag. */
  stat: { label: string; value: string }[];
  /** Events (episode pairs, action events or beat epochs) the edge points to. */
  pointers: number;
};

export type Scenario = {
  id: 'anesthesia' | 'ventilation' | 'vasopressor' | 'icu';
  /** Short tab label. */
  label: string;
  /** Sub-label shown under the tabs when active. */
  subLabel: string;
  /** Record clock: first label and length, for the timeline and dose tracks. */
  clock: { start: string; hours: number; unit: 'case' | 'stay' };
  /** Node selected once the graph is built. */
  focus: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
};

// ───────────────────────────────────────────── Compact factories

const ep = (t: string, v: string): Episode => ({ t, v });
const ch = (t: string, to: number): ActionChange => ({ t, to });

const concept = (
  id: string,
  label: string,
  def: ConceptDef,
  tag: string,
  modality: Modality,
  tier: Tier,
  episodes: number,
  windows: number,
  spans: Episode[],
  note: string,
  density: number[],
  extra: { level?: 'vital' | 'beat'; lane?: 0 | 1 } = {},
): ConceptNode => {
  const definition: { rule: string; snomed?: string } = NABZGRAPH_CONCEPTS[def];
  return {
    kind: 'concept',
    id,
    label,
    rule: definition.rule,
    snomed: definition.snomed,
    tag,
    modality,
    tier,
    episodes,
    windows,
    spans,
    note,
    density,
    level: extra.level ?? 'vital',
    lane: extra.lane,
  };
};

const action = (
  id: string,
  label: string,
  family: 'drug' | 'ventilator',
  setting: string,
  unit: string,
  start: number,
  changes: ActionChange[],
  row: number,
  note: string,
): ActionNode => ({
  kind: 'action',
  id,
  label,
  tag: family === 'drug' ? 'DRUG' : 'VENT',
  family,
  setting,
  unit,
  start,
  changes,
  row,
  note,
});

const variable = (
  id: string,
  label: string,
  name: string,
  unit: string,
  modality: Modality,
  row: number,
  note: string,
  extra: { level?: 'vital' | 'beat'; lane?: 0 | 1 } = {},
): VariableNode => ({
  kind: 'variable',
  id,
  label,
  tag: unit,
  name,
  modality,
  row,
  note,
  level: extra.level ?? 'vital',
  lane: extra.lane,
});

const response = (id: string, s: string, t: string, phrase: string, sign: string, lag: string, pointers: number): GraphEdge => ({
  id, type: 'RESPONSE', source: s, target: t, directed: true, phrase,
  stat: [{ label: 'sign', value: sign }, { label: 'lag', value: lag }], pointers,
});
const policy = (id: string, s: string, t: string, phrase: string, sign: string, lag: string, pointers: number): GraphEdge => ({
  id, type: 'POLICY', source: s, target: t, directed: true, phrase,
  stat: [{ label: 'sign', value: sign }, { label: 'lag', value: lag }], pointers,
});
const association = (
  id: string, s: string, t: string, phrase: string, sign: string, lag: string, pointers: number,
): GraphEdge => ({
  id, type: 'ASSOCIATION', source: s, target: t, directed: false, phrase,
  stat: [{ label: 'sign', value: sign }, { label: 'lag', value: lag }], pointers,
});
const mechanistic = (
  id: string, s: string, t: string, phrase: string, directed: boolean, sign: string | null, pointers: number,
): GraphEdge => ({
  id, type: 'MECHANISTIC', source: s, target: t, directed, phrase,
  stat: [
    ...(sign ? [{ label: 'sign', value: sign }] : []),
    { label: 'tested', value: 'per patient' },
  ],
  pointers,
});

const d = (...v: number[]) => v;

// ───────────────────────────────────────────────────── Scenarios

export const SCENARIOS: Scenario[] = [
  // ─────────────────────────────── Anesthesia: drugs titrated to MAP and HR
  {
    id: 'anesthesia',
    label: 'Anesthesia',
    subLabel: 'Surgical case · propofol and remifentanil titrated to MAP and HR',
    clock: { start: '08:00', hours: 3, unit: 'case' },
    focus: 'a_remi',
    nodes: [
      concept('a_bra_t', 'Bradycardia', 'bradycardia', 'HR', 'ECG', 'TRANSIENT', 3, 4,
        [ep('08:16', 'HR 52'), ep('10:02', 'HR 56')], 'Brief slowing after induction.',
        d(0.5, 0, 0, 0, 0, 0, 0, 0, 0.35, 0, 0, 0)),
      concept('a_hyp_t', 'Hypotension', 'hypotension', 'MAP', 'ABP', 'TRANSIENT', 5, 6,
        [ep('08:14', 'MAP 61'), ep('08:33', 'MAP 59'), ep('10:05', 'MAP 62')], 'Short dips after induction.',
        d(0.55, 0.4, 0, 0, 0, 0, 0, 0, 0.3, 0, 0, 0)),
      concept('a_hyp_e', 'Hypotension', 'hypotension', 'MAP', 'ABP', 'EPISODIC', 4, 14,
        [ep('08:52', 'MAP 57'), ep('09:21', 'MAP 60'), ep('10:40', 'MAP 62')], 'Longer bouts; both drugs come down.',
        d(0, 0, 0.3, 0.65, 0.5, 0.2, 0, 0, 0, 0, 0.4, 0.3)),
      concept('a_tac_t', 'Tachycardia', 'tachycardia', 'HR', 'ECG', 'TRANSIENT', 4, 6,
        [ep('08:21', 'HR 112'), ep('08:47', 'HR 106')], 'Surges at laryngoscopy and incision.',
        d(0.3, 0.6, 0.45, 0.3, 0, 0, 0, 0, 0, 0, 0, 0)),
      concept('a_tac_p', 'Tachycardia', 'tachycardia', 'HR', 'ECG', 'PERSISTENT', 1, 38,
        [ep('09:05', 'HR 109'), ep('09:24', 'HR 104')], 'Sustained during the stimulating phase.',
        d(0, 0, 0, 0, 0.55, 0.8, 0.7, 0.4, 0, 0, 0, 0)),
      action('a_prop', 'Propofol', 'drug', 'Target', 'µg/mL', 4.0,
        [ch('08:30', 3.5), ch('08:55', 3.0), ch('09:40', 3.5), ch('10:35', 3.0)], 0.5,
        'Lowered as MAP falls.'),
      action('a_remi', 'Remifentanil', 'drug', 'Target', 'ng/mL', 2.0,
        [ch('08:24', 3.0), ch('08:50', 2.5), ch('09:08', 3.5), ch('09:42', 3.0), ch('10:15', 2.5)], 1.5,
        'Raised as HR or MAP climbs.'),
      variable('a_map', 'MAP', 'Mean arterial pressure', 'mmHg', 'ABP', 0.5,
        'Moves both ways: cause and trigger.'),
      variable('a_hr', 'HR', 'Heart rate', 'bpm', 'ECG', 1.5,
        'Drives remifentanil and responds to it.'),
    ],
    edges: [
      response('a_r1', 'a_remi', 'a_hr', 'Remifentanil ↑ → HR ↓', '−', '~2 min', 14),
      response('a_r2', 'a_remi', 'a_map', 'Remifentanil ↑ → MAP ↓', '−', '~2 min', 12),
      response('a_r3', 'a_prop', 'a_map', 'Propofol ↑ → MAP ↓', '−', '~2 min', 9),
      policy('a_p1', 'a_map', 'a_remi', 'Rising MAP → remifentanil ↑', '+', '~1 min', 11),
      policy('a_p2', 'a_hr', 'a_remi', 'Rising HR → remifentanil ↑', '+', '~1 min', 8),
      policy('a_p3', 'a_map', 'a_prop', 'Falling MAP → propofol ↓', '+', '~1 min', 6),
      policy('a_p4', 'a_tac_t', 'a_remi', 'Tachycardia → remifentanil ↑', '+', '~5 min', 7),
      policy('a_p5', 'a_tac_p', 'a_remi', 'Tachycardia → remifentanil ↑', '+', '~5 min', 6),
      policy('a_p6', 'a_hyp_e', 'a_prop', 'Hypotension → propofol ↓', '+', '~4 min', 4),
      policy('a_p7', 'a_hyp_e', 'a_remi', 'Hypotension → remifentanil ↓', '+', '~4 min', 5),
      association('a_a1', 'a_hyp_t', 'a_bra_t', 'Hypotension ↔ bradycardia', '+', '~3 min', 4),
      association('a_a2', 'a_hyp_e', 'a_bra_t', 'Hypotension ↔ bradycardia', '+', '~3 min', 3),
    ],
  },

  // ─────────────────────── Ventilation: settings, EtCO2 and the beat level
  {
    id: 'ventilation',
    label: 'Ventilation',
    subLabel: 'Surgical case · ventilator set to EtCO2, with beat-level couplings',
    clock: { start: '13:00', hours: 4, unit: 'case' },
    focus: 'v_rate',
    nodes: [
      concept('v_hcp_e', 'Hypercapnia', 'hypercapnia', 'EtCO2', 'CO2', 'EPISODIC', 3, 16,
        [ep('13:42', 'EtCO2 49'), ep('15:10', 'EtCO2 47')], 'High EtCO2 in bouts.',
        d(0, 0, 0.5, 0.6, 0.2, 0, 0.45, 0.3, 0, 0, 0, 0)),
      concept('v_hpc_t', 'Hypocapnia', 'hypocapnia', 'EtCO2', 'CO2', 'TRANSIENT', 4, 7,
        [ep('13:18', 'EtCO2 28'), ep('14:25', 'EtCO2 29')], 'Short dips that bring the rate down.',
        d(0.4, 0.3, 0, 0, 0.35, 0.2, 0, 0, 0, 0, 0, 0)),
      concept('v_hpc_p', 'Hypocapnia', 'hypocapnia', 'EtCO2', 'CO2', 'PERSISTENT', 1, 52,
        [ep('15:48', 'EtCO2 27'), ep('16:20', 'EtCO2 28')], 'Low EtCO2 through the last hour.',
        d(0, 0, 0, 0, 0, 0, 0, 0, 0.5, 0.8, 0.85, 0.7)),
      action('v_rate', 'Vent rate', 'ventilator', 'Set rate', '/min', 12,
        [ch('13:22', 11), ch('13:46', 13), ch('14:28', 12), ch('15:14', 14), ch('16:05', 12)], 0.5,
        'Stepped up as EtCO2 climbs.'),
      action('v_vt', 'Tidal volume', 'ventilator', 'Set volume', 'mL', 450,
        [ch('13:50', 500), ch('15:30', 450)], 1.5,
        'Raised once, then brought back.'),
      variable('v_etco2', 'EtCO2', 'End-tidal CO2', 'mmHg', 'CO2', 1,
        'Set by the ventilator, and setting it.'),
      concept('v_pat_t', 'Prolonged PAT', 'prolongedPat', 'BEAT', 'PPG', 'TRANSIENT', 2, 5,
        [ep('14:52', 'PAT +26 ms'), ep('16:12', 'PAT +23 ms')], 'Slower pulse arrival than usual.',
        d(0, 0, 0, 0, 0, 0.4, 0, 0, 0, 0, 0.3, 0), { level: 'beat', lane: 0 }),
      variable('v_resp', 'Respiration', 'Respiratory phase', 'phase', 'CO2', 1,
        'Each breath, from the capnogram.', { level: 'beat', lane: 0 }),
      concept('v_ppv_p', 'High PPV', 'highPpv', 'BEAT', 'ABP', 'PERSISTENT', 1, 41,
        [ep('15:36', 'PPV 15%'), ep('16:02', 'PPV 14%')], 'Pulse pressure swings with each breath.',
        d(0, 0, 0, 0, 0, 0, 0, 0.45, 0.75, 0.8, 0.6, 0.3), { level: 'beat', lane: 0 }),
      variable('v_rri', 'R-R', 'R-R interval', 'ms', 'ECG', 0.25,
        'Beat-to-beat heart period.', { level: 'beat', lane: 1 }),
      variable('v_sbp', 'SBP', 'Systolic pressure, per beat', 'mmHg', 'ABP', 1,
        'Rises and falls with each breath.', { level: 'beat', lane: 1 }),
      variable('v_pat', 'PAT', 'Pulse arrival time', 'ms', 'PPG', 1.75,
        'Shortens as systolic pressure rises.', { level: 'beat', lane: 1 }),
    ],
    edges: [
      response('v_r1', 'v_rate', 'v_etco2', 'Ventilator rate ↑ → EtCO2 ↓', '−', '~1 min', 15),
      response('v_r2', 'v_vt', 'v_etco2', 'Tidal volume ↑ → EtCO2 ↓', '−', '~1 min', 6),
      policy('v_p1', 'v_etco2', 'v_rate', 'Rising EtCO2 → rate ↑', '+', '~1 min', 12),
      policy('v_p2', 'v_etco2', 'v_vt', 'Rising EtCO2 → tidal volume ↑', '+', '~1 min', 5),
      policy('v_p3', 'v_hcp_e', 'v_rate', 'Hypercapnia → rate ↑', '+', '~4 min', 5),
      policy('v_p4', 'v_hpc_p', 'v_rate', 'Hypocapnia → rate ↓', '+', '~5 min', 3),
      policy('v_p5', 'v_hpc_t', 'v_rate', 'Hypocapnia → rate ↓', '+', '~3 min', 4),
      mechanistic('v_m1', 'v_resp', 'v_sbp', 'Respiration → SBP', true, null, 38),
      mechanistic('v_m2', 'v_resp', 'v_rri', 'Respiration → R-R interval', true, null, 36),
      mechanistic('v_m3', 'v_pat', 'v_sbp', 'PAT ↔ SBP', false, '−', 29),
    ],
  },

  // ──────────────────────────── Vasopressor: phenylephrine for low MAP
  {
    id: 'vasopressor',
    label: 'Vasopressor',
    subLabel: 'Surgical case · phenylephrine started for low MAP',
    clock: { start: '10:00', hours: 3, unit: 'case' },
    focus: 'p_phe',
    nodes: [
      concept('p_hyp_t', 'Hypotension', 'hypotension', 'MAP', 'ABP', 'TRANSIENT', 3, 4,
        [ep('10:12', 'MAP 63'), ep('12:20', 'MAP 62')], 'Brief dips before the infusion.',
        d(0.4, 0, 0, 0, 0, 0, 0, 0, 0, 0.3, 0, 0)),
      concept('p_hyp_e', 'Hypotension', 'hypotension', 'MAP', 'ABP', 'EPISODIC', 3, 12,
        [ep('10:31', 'MAP 58'), ep('11:44', 'MAP 60')], 'Bouts that bring phenylephrine on.',
        d(0, 0.5, 0.6, 0, 0, 0, 0.45, 0.3, 0, 0, 0, 0)),
      concept('p_hyp_p', 'Hypotension', 'hypotension', 'MAP', 'ABP', 'PERSISTENT', 1, 31,
        [ep('10:52', 'MAP 55'), ep('11:06', 'MAP 57')], 'Sustained low MAP before the infusion.',
        d(0, 0, 0.4, 0.85, 0.7, 0.2, 0, 0, 0, 0, 0, 0)),
      concept('p_bra_t', 'Bradycardia', 'bradycardia', 'HR', 'ECG', 'TRANSIENT', 3, 5,
        [ep('11:22', 'HR 54'), ep('12:05', 'HR 57')], 'Brief slowing alongside low MAP.',
        d(0, 0, 0, 0, 0, 0.45, 0, 0, 0.3, 0, 0, 0)),
      concept('p_htn_t', 'Hypertension', 'hypertension', 'MAP', 'ABP', 'TRANSIENT', 2, 3,
        [ep('11:20', 'MAP 108'), ep('12:03', 'MAP 106')], 'Brief overshoots; the dose comes down.',
        d(0, 0, 0, 0, 0, 0.5, 0, 0, 0.35, 0, 0, 0)),
      action('p_phe', 'Phenylephrine', 'drug', 'Infusion', 'µg/min', 0,
        [ch('10:36', 25), ch('10:58', 50), ch('11:24', 30), ch('11:48', 40), ch('12:08', 20)], 0.5,
        'Started and stepped with MAP.'),
      action('p_prop', 'Propofol', 'drug', 'Target', 'µg/mL', 3.5,
        [ch('10:40', 3.0), ch('12:15', 3.5)], 1.5,
        'Eased while MAP is low.'),
      variable('p_map', 'MAP', 'Mean arterial pressure', 'mmHg', 'ABP', 0.5,
        'Raised by phenylephrine, and its trigger.'),
      variable('p_hr', 'HR', 'Heart rate', 'bpm', 'ECG', 1.5,
        'Falls as pressure rises.'),
    ],
    edges: [
      response('p_r1', 'p_phe', 'p_map', 'Phenylephrine ↑ → MAP ↑', '+', '~2 min', 10),
      response('p_r2', 'p_phe', 'p_hr', 'Phenylephrine ↑ → HR ↓', '−', '~2 min', 7),
      response('p_r3', 'p_prop', 'p_map', 'Propofol ↑ → MAP ↓', '−', '~2 min', 4),
      policy('p_p1', 'p_map', 'p_phe', 'Falling MAP → phenylephrine ↑', '−', '~1 min', 9),
      policy('p_p2', 'p_map', 'p_prop', 'Falling MAP → propofol ↓', '+', '~1 min', 5),
      policy('p_p3', 'p_hyp_e', 'p_phe', 'Hypotension → phenylephrine ↑', '+', '~3 min', 6),
      policy('p_p4', 'p_hyp_p', 'p_phe', 'Hypotension → phenylephrine ↑', '+', '~3 min', 4),
      policy('p_p5', 'p_htn_t', 'p_phe', 'Hypertension → phenylephrine ↓', '+', '~3 min', 3),
      association('p_a1', 'p_hyp_t', 'p_bra_t', 'Hypotension ↔ bradycardia', '+', '~3 min', 3),
      association('p_a2', 'p_hyp_e', 'p_bra_t', 'Hypotension ↔ bradycardia', '+', '~3 min', 3),
    ],
  },

  // ───────────────────────────── ICU stay: waveforms only, associations
  {
    id: 'icu',
    label: 'ICU stay',
    subLabel: 'ICU record · waveforms only, no action records',
    clock: { start: '20:00', hours: 12, unit: 'stay' },
    focus: 'i_tac_p',
    nodes: [
      concept('i_tpg_e', 'Tachycardia', 'tachycardiaPpg', 'PPG', 'PPG', 'EPISODIC', 6, 44,
        [ep('22:15', 'PR 116'), ep('01:40', 'PR 112')], 'Pulse rate from the pleth.',
        d(0, 0.2, 0.5, 0.6, 0.4, 0.3, 0.5, 0.45, 0.3, 0.2, 0.1, 0)),
      concept('i_tpn_t', 'Tachypnea', 'tachypnea', 'RESP', 'RESP', 'TRANSIENT', 9, 12,
        [ep('20:40', 'RR 26'), ep('21:05', 'RR 24')], 'First short bouts of fast breathing.',
        d(0.4, 0.5, 0.2, 0, 0, 0, 0, 0, 0, 0, 0, 0)),
      concept('i_tpn_e', 'Tachypnea', 'tachypnea', 'RESP', 'RESP', 'EPISODIC', 7, 58,
        [ep('22:10', 'RR 27'), ep('00:30', 'RR 25')], 'Recurring bouts through the night.',
        d(0, 0.3, 0.55, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0, 0)),
      concept('i_tpn_p', 'Tachypnea', 'tachypnea', 'RESP', 'RESP', 'PERSISTENT', 2, 160,
        [ep('23:20', 'RR 28'), ep('02:50', 'RR 26')], 'Fast breathing for hours at a time.',
        d(0, 0, 0.3, 0.75, 0.85, 0.8, 0.75, 0.6, 0.4, 0.2, 0.1, 0)),
      concept('i_tac_e', 'Tachycardia', 'tachycardia', 'ECG', 'ECG', 'EPISODIC', 8, 63,
        [ep('22:20', 'HR 118'), ep('01:45', 'HR 113')], 'Bouts that travel with fast breathing.',
        d(0, 0.25, 0.5, 0.65, 0.5, 0.4, 0.5, 0.4, 0.3, 0.2, 0.1, 0)),
      concept('i_tac_p', 'Tachycardia', 'tachycardia', 'ECG', 'ECG', 'PERSISTENT', 2, 142,
        [ep('23:30', 'HR 121'), ep('03:10', 'HR 117')], 'Fast heart rate for hours.',
        d(0, 0, 0.2, 0.7, 0.85, 0.85, 0.8, 0.7, 0.5, 0.3, 0.15, 0)),
      concept('i_hyp_e', 'Hypotension', 'hypotension', 'ABP', 'ABP', 'EPISODIC', 5, 37,
        [ep('00:50', 'MAP 61'), ep('03:40', 'MAP 59')], 'Low MAP in bouts.',
        d(0, 0, 0, 0, 0.3, 0.5, 0.45, 0.6, 0.5, 0.3, 0.2, 0.1)),
      concept('i_hyp_p', 'Hypotension', 'hypotension', 'ABP', 'ABP', 'PERSISTENT', 1, 96,
        [ep('04:30', 'MAP 58'), ep('06:10', 'MAP 57')], 'Low MAP through the early morning.',
        d(0, 0, 0, 0, 0, 0, 0.2, 0.5, 0.8, 0.9, 0.85, 0.7)),
      concept('i_bra_t', 'Bradycardia', 'bradycardia', 'ECG', 'ECG', 'TRANSIENT', 4, 5,
        [ep('05:15', 'HR 54'), ep('06:40', 'HR 52')], 'Late, brief slowing.',
        d(0, 0, 0, 0, 0, 0, 0, 0, 0, 0.35, 0.4, 0.3)),
    ],
    edges: [
      association('i_a1', 'i_tpg_e', 'i_tpn_e', 'Tachycardia ↔ tachypnea', '+', '~4 min', 9),
      association('i_a2', 'i_tpn_t', 'i_tac_e', 'Tachypnea ↔ tachycardia', '+', '~5 min', 5),
      association('i_a3', 'i_tpn_e', 'i_tac_e', 'Tachypnea ↔ tachycardia', '+', '~4 min', 14),
      association('i_a4', 'i_tpn_p', 'i_tac_p', 'Tachypnea ↔ tachycardia', '+', '~6 min', 11),
      association('i_a5', 'i_tac_e', 'i_hyp_e', 'Tachycardia ↔ hypotension', '−', '~8 min', 7),
      association('i_a6', 'i_tac_p', 'i_hyp_p', 'Tachycardia ↔ hypotension', '−', '~9 min', 6),
      association('i_a7', 'i_hyp_e', 'i_bra_t', 'Hypotension ↔ bradycardia', '+', '~5 min', 4),
      association('i_a8', 'i_hyp_p', 'i_bra_t', 'Hypotension ↔ bradycardia', '+', '~6 min', 3),
    ],
  },
];

// ───────────────────────────────────────────────────── Visual meta

/**
 * Canvas orientation. Landscape from sm up; portrait on phones, where the
 * landscape canvas renders ~320px wide and its labels shrink to ~6px.
 */
export type Orientation = 'landscape' | 'portrait';

/**
 * Canvas dimensions the SVG viewBox is drawn against, per orientation. The
 * demo container's Tailwind aspect classes (aspect-[760/470],
 * max-sm:aspect-[410/680]) mirror these numbers; change both together.
 */
export const CANVAS: Record<Orientation, { w: number; h: number }> = {
  landscape: { w: 760, h: 470 },
  portrait: { w: 410, h: 680 },
};

/** Visual treatment per persistence tier. */
export const TIER_META: Record<Tier, { label: string; short: string }> = {
  PERSISTENT: { label: 'Persistent', short: 'P' },
  EPISODIC: { label: 'Episodic', short: 'E' },
  TRANSIENT: { label: 'Transient', short: 'T' },
};

const relationType = (key: (typeof RELATION_TYPES)[number]['key']) =>
  RELATION_TYPES.find((r) => r.key === key)!;

/**
 * Visual treatment per relation type: solid, dashed, dotted, thick. All in
 * the .theme-nabz cyan family. Labels and one-liners come from nabzPapers.
 */
export const EDGE_META: Record<
  EdgeType,
  {
    label: string;
    line: string;
    stroke: string;
    width: number;
    dash?: string;
    opacity: number;
    glow: boolean;
  }
> = {
  RESPONSE: {
    label: relationType('response').name,
    line: relationType('response').line,
    stroke: 'var(--accent-strong)',
    width: 1.8,
    opacity: 0.85,
    glow: false,
  },
  POLICY: {
    label: relationType('policy').name,
    line: relationType('policy').line,
    stroke: 'var(--accent)',
    width: 1.6,
    dash: '6 4',
    opacity: 0.8,
    glow: false,
  },
  ASSOCIATION: {
    label: relationType('association').name,
    line: relationType('association').line,
    stroke: 'var(--accent)',
    width: 2.2,
    dash: '0.1 5',
    opacity: 0.7,
    glow: false,
  },
  MECHANISTIC: {
    label: relationType('mechanistic').name,
    line: relationType('mechanistic').line,
    stroke: 'var(--color-iris-500)',
    width: 3,
    opacity: 0.75,
    glow: true,
  },
};

/** Legend and filter order. */
export const EDGE_ORDER: EdgeType[] = ['RESPONSE', 'POLICY', 'ASSOCIATION', 'MECHANISTIC'];

// ───────────────────────────────────────────────────── Layout

/** Row order for concept tiers (top to bottom). */
export const TIER_ROW_ORDER: Tier[] = ['TRANSIENT', 'EPISODIC', 'PERSISTENT'];

/**
 * Spacing per orientation. The column axis runs along x in landscape and
 * along y in portrait; the row (tier) axis is the other one.
 *   margin / groupGap: column-axis inset at each end, and the extra gap
 *                      between column groups.
 *   rowStart / rowStep: row-axis position of row 0, and the step per row.
 *   bandPad:           how far the beat-level band reaches past its lanes.
 */
const AXES: Record<
  Orientation,
  { margin: number; groupGap: number; rowStart: number; rowStep: number; bandPad: number }
> = {
  landscape: { margin: 72, groupGap: 28, rowStart: 120, rowStep: 120, bandPad: 56 },
  portrait: { margin: 60, groupGap: 20, rowStart: 84, rowStep: 115, bandPad: 48 },
};

export type ScenarioLayout = {
  nodes: GraphNode[];
  /** Group headers; portrait headers run vertically down the left edge. */
  headers: { label: string; x: number; y: number; vertical: boolean }[];
  /** Shaded beat-level band, when the scenario has beat-level nodes. */
  band: { x: number; y: number; width: number; height: number } | null;
};

/**
 * Deterministic column layout: [Concepts] [Actions] [Variables | Beat level].
 * Returns positioned copies of the nodes plus the group headers.
 */
export function layoutScenario(scenario: Scenario, orientation: Orientation = 'landscape'): ScenarioLayout {
  const canvas = CANVAS[orientation];
  const axes = AXES[orientation];
  const portrait = orientation === 'portrait';
  /** Length of the column axis. */
  const length = portrait ? canvas.h : canvas.w;
  /** Row-axis position of a row index (0 = transient row, 2 = persistent; fractions allowed). */
  const rowPos = (row: number) => axes.rowStart + row * axes.rowStep;
  /** Canvas point for a column-axis and a row-axis position. */
  const place = (col: number, row: number) => (portrait ? { x: row, y: col } : { x: col, y: row });

  type Column = { key: string; group: 'concepts' | 'actions' | 'variables'; beat: boolean };
  const columns: Column[] = [];
  const addColumn = (col: Column) => {
    if (!columns.some((c) => c.key === col.key)) columns.push(col);
  };

  const columnKey = (n: GraphNode): string => {
    if (n.kind === 'action') return 'action';
    if (n.level === 'beat') return `beat-${n.lane ?? 0}`;
    if (n.kind === 'variable') return 'variable';
    return `concept-${n.label}-${n.tag}`;
  };

  // Concepts first, in order of appearance; then actions, vitals, beat lanes.
  scenario.nodes.forEach((n) => {
    if (n.kind === 'concept' && n.level === 'vital') {
      addColumn({ key: columnKey(n), group: 'concepts', beat: false });
    }
  });
  if (scenario.nodes.some((n) => n.kind === 'action')) {
    addColumn({ key: 'action', group: 'actions', beat: false });
  }
  if (scenario.nodes.some((n) => n.kind === 'variable' && n.level === 'vital')) {
    addColumn({ key: 'variable', group: 'variables', beat: false });
  }
  ([0, 1] as const).forEach((lane) => {
    if (scenario.nodes.some((n) => n.kind !== 'action' && n.level === 'beat' && (n.lane ?? 0) === lane)) {
      addColumn({ key: `beat-${lane}`, group: 'variables', beat: true });
    }
  });

  const groupBreaks = columns.reduce(
    (count, c, i) => (i > 0 && c.group !== columns[i - 1].group ? count + 1 : count),
    0,
  );
  const span = length - 2 * axes.margin - groupBreaks * axes.groupGap;
  const step = columns.length > 1 ? span / (columns.length - 1) : 0;

  /** Column-axis position of each column. */
  const colPos = new Map<string, number>();
  let p = columns.length > 1 ? axes.margin : length / 2;
  columns.forEach((c, i) => {
    if (i > 0) p += step + (c.group !== columns[i - 1].group ? axes.groupGap : 0);
    colPos.set(c.key, p);
  });

  const nodes = scenario.nodes.map((n) => {
    const col = colPos.get(columnKey(n)) ?? length / 2;
    const row = rowPos(n.kind === 'concept' ? TIER_ROW_ORDER.indexOf(n.tier) : n.row);
    return { ...n, ...place(col, row) };
  });

  const mean = (ps: number[]) => ps.reduce((a, b) => a + b, 0) / ps.length;
  const posOf = (pred: (c: Column) => boolean) =>
    columns.filter(pred).map((c) => colPos.get(c.key)!);

  // Landscape: headers centred over their group, near the top edge.
  // Portrait: turned to run down the left edge, beside their group.
  const headers: ScenarioLayout['headers'] = [];
  const addHeader = (label: string, ps: number[]) => {
    if (!ps.length) return;
    const at = mean(ps);
    headers.push(portrait ? { label, x: 18, y: at, vertical: true } : { label, x: at, y: 38, vertical: false });
  };
  addHeader('Concepts', posOf((c) => c.group === 'concepts'));
  addHeader('Actions', posOf((c) => c.group === 'actions'));
  addHeader('Variables', posOf((c) => c.group === 'variables' && !c.beat));
  const beatPs = posOf((c) => c.beat);
  addHeader('Beat level', beatPs);

  let band: ScenarioLayout['band'] = null;
  if (beatPs.length) {
    const p0 = Math.min(...beatPs) - axes.bandPad;
    const p1 = Math.max(...beatPs) + axes.bandPad;
    band = portrait
      ? { x: 6, y: p0, width: canvas.w - 12, height: Math.min(p1, canvas.h - 6) - p0 }
      : { x: p0, y: 14, width: p1 - p0, height: canvas.h - 28 };
  }

  return { nodes, headers, band };
}

// ───────────────────────────────────────────────────── Shapes and edge routing

/** Concept circle radius per tier. */
export const CONCEPT_R: Record<Tier, number> = { PERSISTENT: 24, EPISODIC: 18, TRANSIENT: 13 };
/** Action rounded square: half side. */
export const ACTION_HALF = 16;
/** Variable ellipse radii. */
export const VARIABLE_R = { rx: 23, ry: 13 } as const;

/** Half height of a node's shape (for labels above and below it). */
export function nodeHalfHeight(n: GraphNode): number {
  if (n.kind === 'concept') return CONCEPT_R[n.tier];
  if (n.kind === 'action') return ACTION_HALF;
  return VARIABLE_R.ry;
}

/** Distance from a node's centre to its outline along unit vector (ux, uy). */
export function nodeBoundary(n: GraphNode, ux: number, uy: number): number {
  if (n.kind === 'concept') return CONCEPT_R[n.tier];
  if (n.kind === 'action') {
    const ax = Math.abs(ux);
    const ay = Math.abs(uy);
    return Math.min(ax > 1e-6 ? ACTION_HALF / ax : Infinity, ay > 1e-6 ? ACTION_HALF / ay : Infinity);
  }
  const { rx, ry } = VARIABLE_R;
  return (rx * ry) / Math.sqrt((ry * ux) ** 2 + (rx * uy) ** 2);
}

/**
 * Quadratic edge from outline to outline. The bend grows with length so long
 * edges arc clear of the nodes between their ends; opposite edges between the
 * same two nodes (a response and a policy) bend apart into a lens.
 */
export function edgeGeometry(
  source: GraphNode,
  target: GraphNode,
): { d: string; mid: { x: number; y: number }; p0: { x: number; y: number }; c: { x: number; y: number }; p2: { x: number; y: number } } {
  const sx = source.x ?? 0;
  const sy = source.y ?? 0;
  const tx = target.x ?? 0;
  const ty = target.y ?? 0;
  const len = Math.hypot(tx - sx, ty - sy) || 1;
  const ux = (tx - sx) / len;
  const uy = (ty - sy) / len;
  const bend = Math.max(18, Math.min(64, len * 0.14));
  const c = { x: (sx + tx) / 2 - uy * bend, y: (sy + ty) / 2 + ux * bend };

  const unit = (dx: number, dy: number) => {
    const l = Math.hypot(dx, dy) || 1;
    return { x: dx / l, y: dy / l };
  };
  const a = unit(c.x - sx, c.y - sy);
  const b = unit(tx - c.x, ty - c.y);
  const gap = 3;
  const rs = nodeBoundary(source, a.x, a.y) + gap;
  const rt = nodeBoundary(target, b.x, b.y) + gap;
  const p0 = { x: sx + a.x * rs, y: sy + a.y * rs };
  const p2 = { x: tx - b.x * rt, y: ty - b.y * rt };
  const mid = { x: 0.25 * p0.x + 0.5 * c.x + 0.25 * p2.x, y: 0.25 * p0.y + 0.5 * c.y + 0.25 * p2.y };
  const f = (v: number) => v.toFixed(1);
  return {
    d: `M ${f(p0.x)},${f(p0.y)} Q ${f(c.x)},${f(c.y)} ${f(p2.x)},${f(p2.y)}`,
    mid,
    p0,
    c,
    p2,
  };
}

/** Minutes since the record's first clock label, for a "hh:mm" label. */
export function minutesFrom(start: string, t: string): number {
  const toMin = (s: string) => {
    const [h, m] = s.split(':').map(Number);
    return h * 60 + m;
  };
  const diff = toMin(t) - toMin(start);
  return diff < 0 ? diff + 24 * 60 : diff;
}

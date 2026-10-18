import { useEffect, useMemo, useRef, useState } from 'react';
import type { ElementType, KeyboardEvent, MutableRefObject } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BellOff, BellRing, HelpCircle, Play, RotateCcw, SignalHigh, Waves } from 'lucide-react';
import {
  BUDGETS,
  CHANNELS,
  SCENARIOS,
  decide,
  traces,
  type Budget,
  type Decision,
  type Scenario,
} from '../../data/nabzsentryScenarios';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Interactive NabzSentry demo. Illustrative, hand-curated alarms (see
 * nabzsentryScenarios.ts): synthetic waveforms on the model's four slots,
 * an illustrative true-alarm probability, and the three-way policy at two
 * error budgets. Pick an alarm, run Sentry, then switch the budget: the
 * decision follows it live.
 */

type DemoState = 'idle' | 'scanning' | 'results';
/** Where focus goes once the next state has rendered. */
type FocusTarget = 'decision' | 'run' | null;
type FocusRef = MutableRefObject<FocusTarget>;

const SCAN_MS = 1800;
/** Reduced motion: no sweep, just a short pause before the result. */
const SCAN_MS_REDUCED = 350;
const EASE = [0.22, 1, 0.36, 1] as const;
/** Trace viewBox height; values in [-1, 1] fill 84% of it. */
const VIEW_H = 100;
const TAB_ID = (id: Scenario['id']) => `ns-demo-tab-${id}`;
const PANEL_ID = 'ns-demo-panel';

const DECISIONS: Record<Decision, { icon: ElementType; name: string }> = {
  keep: { icon: SignalHigh, name: 'Keep' },
  suppress: { icon: BellOff, name: 'Suppress' },
  defer: { icon: HelpCircle, name: 'Defer' },
};

function reasonFor(decision: Decision, budget: Budget): string {
  if (decision === 'keep') return 'Likely real. It reaches the clinician.';
  if (decision === 'suppress') return `Likely false. Suppressed at the ${budget.pct}% budget.`;
  return `Too uncertain at ${budget.pct}%. A clinician reviews it.`;
}

/** "All 4" or "2 of 4": the channels the model reads for this alarm. */
function channelCount(scenario: Scenario): string {
  const used = CHANNELS.filter((c) => scenario.channels[c.key].available).length;
  return used === CHANNELS.length ? `All ${used}` : `${used} of ${CHANNELS.length}`;
}

const pct = (v: number) => `${v * 100}%`;

/**
 * Callback ref that takes focus when `focusNext` names this target, so focus
 * lands on the new control once AnimatePresence has mounted it.
 */
function claimFocus(focusNext: FocusRef, target: Exclude<FocusTarget, null>) {
  return (el: HTMLElement | null) => {
    if (el && focusNext.current === target) {
      focusNext.current = null;
      el.focus({ preventScroll: true });
    }
  };
}

// ─────────────────────────────────────────────────────── Root component

export function SentryDemoBlock() {
  const [scenarioId, setScenarioId] = useState<Scenario['id']>(SCENARIOS[0].id);
  const [budgetPct, setBudgetPct] = useState<number>(BUDGETS[0].pct);
  const [state, setState] = useState<DemoState>('idle');
  // Traces fade in on a tab change, never on the first (prerendered) paint.
  const [switched, setSwitched] = useState(false);
  const timerRef = useRef<number | null>(null);
  const focusNext = useRef<FocusTarget>(null);
  const reduced = useReducedMotion();

  const scenario = SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[0];
  const budget = BUDGETS.find((b) => b.pct === budgetPct) ?? BUDGETS[0];

  const clearTimer = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  useEffect(() => clearTimer, []);

  const handleSelect = (id: Scenario['id']) => {
    clearTimer();
    focusNext.current = null;
    setScenarioId(id);
    setState('idle');
    setSwitched(true);
  };

  const handleRun = () => {
    clearTimer();
    // The Run button unmounts; focus moves to the decision when it appears.
    focusNext.current = 'decision';
    setState('scanning');
    timerRef.current = window.setTimeout(() => setState('results'), reduced ? SCAN_MS_REDUCED : SCAN_MS);
  };

  const handleReset = () => {
    clearTimer();
    focusNext.current = 'run';
    setState('idle');
  };

  // One persistent live region, so the first decision is announced too.
  let status = '';
  if (state === 'scanning') status = `Reading ${channelCount(scenario).toLowerCase()} channels.`;
  if (state === 'results') {
    const decision = decide(scenario.p, budget);
    status = `${DECISIONS[decision].name}. ${reasonFor(decision, budget)} Ground truth: ${scenario.truth.label}.`;
  }

  return (
    <div className="glass relative overflow-hidden rounded-2xl sm:rounded-3xl">
      <TabBar activeId={scenarioId} onSelect={handleSelect} subLabel={scenario.subLabel} reduced={reduced} />

      <p aria-live="polite" className="sr-only">
        {status}
      </p>

      <div
        id={PANEL_ID}
        role="tabpanel"
        aria-labelledby={TAB_ID(scenarioId)}
        className="grid gap-0 lg:grid-cols-[1.45fr_1fr]"
      >
        <div className="flex flex-col border-b border-subtle p-3 sm:p-6 lg:border-b-0 lg:border-r">
          <WaveformPanel scenario={scenario} scanning={state === 'scanning'} fadeIn={switched} reduced={reduced} />
        </div>
        <div className="flex flex-col p-4 sm:p-6">
          <TriagePane
            scenario={scenario}
            state={state}
            budget={budget}
            onBudget={setBudgetPct}
            onRun={handleRun}
            onReset={handleReset}
            focusNext={focusNext}
            reduced={reduced}
          />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────── Tabs

function TabBar({
  activeId,
  onSelect,
  subLabel,
  reduced,
}: {
  activeId: Scenario['id'];
  onSelect: (id: Scenario['id']) => void;
  subLabel: string;
  reduced: boolean;
}) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const choose = (index: number, el: HTMLButtonElement | null, move: boolean) => {
    onSelect(SCENARIOS[index].id);
    if (!el) return;
    if (move) el.focus({ preventScroll: true });
    // Phones: the row scrolls sideways; bring a clipped tab fully into view
    // (the row's scroll-padding keeps the gutter).
    el.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: reduced ? 'auto' : 'smooth' });
  };

  // Arrow keys, Home and End move between alarms (roving focus).
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const n = SCENARIOS.length;
    const focused = tabRefs.current.indexOf(e.target as HTMLButtonElement);
    const i = focused >= 0 ? focused : SCENARIOS.findIndex((s) => s.id === activeId);
    let next: number;
    if (e.key === 'ArrowRight') next = (i + 1) % n;
    else if (e.key === 'ArrowLeft') next = (i - 1 + n) % n;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = n - 1;
    else return;
    e.preventDefault();
    choose(next, tabRefs.current[next], true);
  };

  return (
    <div className="border-b border-subtle">
      <div
        role="tablist"
        aria-label="Alarms"
        onKeyDown={onKeyDown}
        className="flex flex-nowrap items-center gap-1 overflow-x-auto scroll-px-3 px-3 pt-3 no-scrollbar sm:flex-wrap sm:scroll-px-6 sm:px-6 sm:pt-4"
      >
        {SCENARIOS.map((s, index) => {
          const active = s.id === activeId;
          // Phones: min-h-10 keeps each tab a 40px tap target.
          return (
            <button
              key={s.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              id={TAB_ID(s.id)}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={PANEL_ID}
              tabIndex={active ? 0 : -1}
              onClick={(e) => choose(index, e.currentTarget, false)}
              className="relative min-h-10 shrink-0 rounded-full px-3 py-1.5 text-[0.78rem] font-medium transition-colors sm:min-h-auto sm:px-4 sm:text-[0.84rem]"
              style={{ color: active ? 'var(--text-primary)' : 'var(--text-secondary)' }}
            >
              {active && (
                <motion.span
                  layoutId="ns-demo-tab-bg"
                  className="absolute inset-0 -z-0 rounded-full"
                  style={{ background: 'var(--accent-soft)' }}
                  transition={{ duration: reduced ? 0 : 0.35, ease: EASE }}
                />
              )}
              <span className="relative">{s.label}</span>
            </button>
          );
        })}
      </div>
      {/* Phones: the sub-label drops its eyebrow so it stays on one line. */}
      <div className="flex items-center gap-2 px-6 pb-3 pt-2 text-[0.76rem] text-muted sm:px-8">
        <span className="hidden font-mono uppercase tracking-[0.14em] sm:inline">alarm</span>
        <span aria-hidden className="hidden sm:inline">
          ·
        </span>
        <span>{subLabel}</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────── Waveforms

function WaveformPanel({
  scenario,
  scanning,
  fadeIn,
  reduced,
}: {
  scenario: Scenario;
  scanning: boolean;
  fadeIn: boolean;
  reduced: boolean;
}) {
  const data = useMemo(() => traces(scenario), [scenario]);

  // Desktop: the panel fills its column and the rows share the height, so
  // the traces grow with the triage pane instead of leaving a gap below.
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between gap-3 whitespace-nowrap font-mono text-[0.72rem] uppercase tracking-[0.08em] text-muted sm:tracking-[0.14em]">
        <span className="inline-flex items-center gap-2">
          <BellRing size={12} className="text-accent" />
          Alarm · VT
        </span>
        <span>Illustrative</span>
      </div>

      <div
        className="relative mt-3 flex flex-1 flex-col overflow-hidden rounded-2xl border border-subtle"
        style={{
          background:
            'radial-gradient(ellipse 110% 80% at 50% 50%, color-mix(in oklab, var(--accent) 6%, transparent), transparent 70%)',
        }}
      >
        <div className="flex flex-1 flex-col divide-y divide-[color:var(--border-subtle)]">
          {CHANNELS.map((c) => (
            <ChannelRow
              key={c.key}
              label={c.label}
              points={data[c.key]}
              traceKey={`${scenario.id}:${c.key}`}
              fadeIn={fadeIn && !reduced}
            />
          ))}
        </div>

        {/* Scan sweep over the traces (the label gutter stays still). */}
        <AnimatePresence>
          {scanning && !reduced && (
            <motion.div
              key="sweep"
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-[3.25rem] right-0 sm:left-[3.75rem]"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <motion.div
                className="absolute inset-y-0 left-0"
                style={{
                  borderRight: '1.5px solid var(--accent)',
                  background:
                    'linear-gradient(90deg, transparent, color-mix(in oklab, var(--accent) 14%, transparent))',
                }}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: SCAN_MS / 1000, ease: 'linear' }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function tracePoints(points: number[]): string {
  return points.map((v, i) => `${i},${(VIEW_H / 2 - v * VIEW_H * 0.42).toFixed(1)}`).join(' ');
}

function ChannelRow({
  label,
  points,
  traceKey,
  fadeIn,
}: {
  label: string;
  points: number[] | null;
  traceKey: string;
  fadeIn: boolean;
}) {
  const d = useMemo(() => (points ? tracePoints(points) : ''), [points]);
  const w = points ? points.length - 1 : 100;

  return (
    <div className="grid h-[3.25rem] grid-cols-[3.25rem_minmax(0,1fr)] items-center sm:h-16 sm:grid-cols-[3.75rem_minmax(0,1fr)] lg:h-auto lg:min-h-16 lg:flex-1">
      <span
        className={`pl-3 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.06em] sm:pl-4 ${
          points ? 'text-secondary' : 'text-muted'
        }`}
      >
        {label}
      </span>
      <div className="relative h-full">
        <svg
          viewBox={`0 0 ${w} ${VIEW_H}`}
          preserveAspectRatio="none"
          aria-hidden
          className="absolute inset-0 h-full w-full"
        >
          {points ? (
            <motion.polyline
              key={traceKey}
              points={d}
              fill="none"
              stroke="var(--accent)"
              strokeWidth={1.4}
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              initial={fadeIn ? { opacity: 0 } : false}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, ease: EASE }}
            />
          ) : (
            <line
              x1={0}
              y1={VIEW_H / 2}
              x2={w}
              y2={VIEW_H / 2}
              stroke="var(--text-muted)"
              strokeOpacity={0.55}
              strokeWidth={1.2}
              strokeDasharray="5 6"
              vectorEffect="non-scaling-stroke"
            />
          )}
        </svg>
        {!points && (
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full border border-subtle bg-glass-strong px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.1em] text-muted">
            absent
          </span>
        )}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────── Triage pane

function TriagePane({
  scenario,
  state,
  budget,
  onBudget,
  onRun,
  onReset,
  focusNext,
  reduced,
}: {
  scenario: Scenario;
  state: DemoState;
  budget: Budget;
  onBudget: (pct: number) => void;
  onRun: () => void;
  onReset: () => void;
  focusNext: FocusRef;
  reduced: boolean;
}) {
  const fade = { duration: reduced ? 0 : 0.3, ease: EASE };
  // The hidden sizing copy below never takes focus.
  const noFocus = useRef<FocusTarget>(null);

  return (
    <div className="flex flex-1 flex-col">
      <BudgetControl budget={budget} onChange={onBudget} reduced={reduced} />

      <div className="mt-4 grid flex-1 border-t border-subtle pt-4 sm:mt-5 sm:pt-5">
        {/* Desktop: an invisible copy of the results shares the cell and
            reserves their height, so the card keeps one height whether idle,
            scanning or showing results. visibility:hidden keeps it out of the
            tab order and the accessibility tree. */}
        <div aria-hidden className="invisible hidden [grid-area:1/1] lg:flex lg:flex-col">
          <Results scenario={scenario} budget={budget} onReset={() => {}} focusNext={noFocus} reduced />
        </div>

        <div className="flex flex-col [grid-area:1/1]">
          <AnimatePresence mode="wait" initial={false}>
            {state === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={fade}
                className="flex flex-1 flex-col items-center justify-center py-1 text-center sm:py-6"
              >
                <h3 className="font-display text-[1.25rem] font-semibold tracking-[-0.015em] sm:text-[1.5rem]">
                  Triage this alarm
                </h3>
                <p className="mt-1.5 hidden text-[0.88rem] text-secondary sm:block">Keep, suppress or defer.</p>
                <button
                  ref={claimFocus(focusNext, 'run')}
                  type="button"
                  onClick={onRun}
                  className="btn-primary group mt-4 inline-flex min-h-10 items-center gap-2 rounded-full px-5 py-2.5 text-[0.92rem] font-semibold transition will-change-transform hover:-translate-y-0.5 sm:mt-5"
                >
                  <Play size={14} strokeWidth={2.2} />
                  Run Sentry
                </button>
              </motion.div>
            )}

            {state === 'scanning' && (
              <motion.div
                key="scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={fade}
                className="flex flex-1 flex-col"
              >
                <div className="flex items-center gap-2 text-[0.74rem] font-semibold uppercase tracking-[0.14em] text-accent">
                  <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-current" />
                  Reading {channelCount(scenario).toLowerCase()} channels
                </div>
                <div className="relative mt-5 h-3 overflow-hidden rounded-full" style={{ background: 'var(--border-subtle)' }}>
                  <div className="shimmer pointer-events-none absolute inset-0" />
                </div>
                <div className="relative mt-5 h-9 w-32 overflow-hidden rounded-full" style={{ background: 'var(--accent-soft)' }}>
                  <div className="shimmer pointer-events-none absolute inset-0" />
                </div>
                <div className="mt-3 h-3 w-[70%] rounded-md" style={{ background: 'var(--border-subtle)' }} />
              </motion.div>
            )}

            {state === 'results' && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={fade}
                className="flex flex-1 flex-col"
              >
                <Results scenario={scenario} budget={budget} onReset={onReset} focusNext={focusNext} reduced={reduced} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function BudgetControl({
  budget,
  onChange,
  reduced,
}: {
  budget: Budget;
  onChange: (pct: number) => void;
  reduced: boolean;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <span id="ns-demo-budget-label" className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-muted">
          Error budget
        </span>
        {/* A two-option setting, not tabs: pressed-state buttons, as in the
            NabzGraph demo. */}
        <div
          role="group"
          aria-labelledby="ns-demo-budget-label"
          title="Limit on the share of suppressed alarms that are genuine"
          className="inline-flex rounded-full border border-subtle bg-glass p-0.5"
        >
          {BUDGETS.map((b) => {
            const active = b.pct === budget.pct;
            return (
              <button
                key={b.pct}
                type="button"
                aria-pressed={active}
                onClick={() => onChange(b.pct)}
                className={`relative min-h-10 min-w-[3.5rem] rounded-full px-3 font-mono text-[0.8rem] font-semibold transition-colors ${
                  active ? 'text-accent' : 'text-muted hover:text-secondary'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="ns-demo-budget"
                    className="absolute inset-0 rounded-full bg-accent-soft"
                    transition={{ duration: reduced ? 0 : 0.3, ease: EASE }}
                  />
                )}
                <span className="relative">{b.pct}%</span>
              </button>
            );
          })}
        </div>
      </div>
      {/* The thresholds are illustrative (the keep value is a stand-in).
          Phones: the line wraps between phrases, never inside one. */}
      <div className="mt-2 flex flex-wrap gap-x-1.5 font-mono text-[0.72rem] text-muted">
        <span>Illustrative ·</span>
        <span className="whitespace-nowrap">suppress below {budget.suppressBelow.toFixed(2)} ·</span>
        <span className="whitespace-nowrap">keep above {budget.keepAbove.toFixed(2)}</span>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────── Results

function Results({
  scenario,
  budget,
  onReset,
  focusNext,
  reduced,
}: {
  scenario: Scenario;
  budget: Budget;
  onReset: () => void;
  focusNext: FocusRef;
  reduced: boolean;
}) {
  const decision = decide(scenario.p, budget);
  const { icon: Icon, name } = DECISIONS[decision];

  return (
    <>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-muted">
          True-alarm probability
        </span>
        <span className="font-mono text-[1.3rem] font-semibold tracking-tight text-accent">
          {scenario.p.toFixed(2)}
        </span>
      </div>

      <ProbabilityBar p={scenario.p} budget={budget} decision={decision} reduced={reduced} />

      <div className="mt-4">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={decision}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: reduced ? 0 : 0.25, ease: EASE }}
          >
            <span
              ref={claimFocus(focusNext, 'decision')}
              tabIndex={-1}
              className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[0.92rem] font-semibold text-accent focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[color:var(--accent)]"
              style={{
                background: 'var(--accent-soft)',
                boxShadow: '0 0 0 1px color-mix(in oklab, var(--accent) 40%, transparent)',
              }}
            >
              <Icon size={16} strokeWidth={2} />
              {name}
            </span>
            <p className="mt-2 text-[0.86rem] leading-relaxed text-secondary">{reasonFor(decision, budget)}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-subtle pt-3">
        <span className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-muted">Channels read</span>
        <span className="inline-flex items-center gap-1.5 font-mono text-[0.72rem] text-secondary">
          <Waves size={12} className="text-accent" />
          {channelCount(scenario)}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-subtle bg-glass px-3 py-2">
        <span className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-muted">Ground truth</span>
        <span className="text-[0.86rem] font-semibold text-primary">{scenario.truth.label}</span>
      </div>

      <div className="mt-auto pt-4">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex h-10 items-center gap-1.5 rounded-full border border-subtle bg-glass px-3 text-[0.8rem] text-secondary transition hover:border-strong hover:text-primary sm:h-9"
        >
          <RotateCcw size={13} />
          Reset
        </button>
      </div>
    </>
  );
}

/**
 * 0-1 probability track: the three zones the budget's thresholds cut (the
 * zone the alarm lands in filled, the outer zones tinted so a narrow one
 * stays visible), threshold ticks drawn over the pin, and a pin at p. Zones
 * slide when the budget changes.
 */
function ProbabilityBar({
  p,
  budget,
  decision,
  reduced,
}: {
  p: number;
  budget: Budget;
  decision: Decision;
  reduced: boolean;
}) {
  const s = budget.suppressBelow;
  const k = budget.keepAbove;
  const zones: { key: Decision; from: number; to: number }[] = [
    { key: 'suppress', from: 0, to: s },
    { key: 'defer', from: s, to: k },
    { key: 'keep', from: k, to: 1 },
  ];
  const slide = { duration: reduced ? 0 : 0.5, ease: EASE };
  // The Defer label sits mid-zone, held clear of the Suppress and Keep labels
  // at the ends.
  const deferAt = Math.min(0.7, Math.max(0.3, (s + k) / 2));
  const zoneFill = (key: Decision) => {
    if (key === decision) return 'color-mix(in oklab, var(--accent) 45%, transparent)';
    return key === 'defer' ? 'transparent' : 'color-mix(in oklab, var(--accent) 14%, transparent)';
  };

  return (
    <div className="mt-3">
      <div className="relative h-5">
        <div
          className="absolute inset-x-0 top-1/2 h-2.5 -translate-y-1/2 overflow-hidden rounded-full"
          style={{ background: 'color-mix(in oklab, var(--text-primary) 7%, transparent)' }}
        >
          {zones.map((z) => (
            <motion.div
              key={z.key}
              className="absolute inset-y-0"
              initial={false}
              animate={{ left: pct(z.from), width: pct(z.to - z.from) }}
              transition={slide}
              style={{ background: zoneFill(z.key) }}
            />
          ))}
        </div>
        {/* The alarm's p */}
        <motion.span
          aria-hidden
          className="absolute top-1/2 h-4 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: 'var(--accent-strong)', boxShadow: '0 0 0 2px var(--bg-base)' }}
          initial={reduced ? false : { left: '0%' }}
          animate={{ left: pct(p) }}
          transition={{ duration: reduced ? 0 : 0.7, ease: EASE }}
        />
        {/* Threshold ticks: after the pin so they paint over it, and taller
            than it so a threshold next to p stays visible. */}
        {[s, k].map((v, i) => (
          <motion.span
            key={i}
            aria-hidden
            className="absolute -top-0.5 h-6 w-px -translate-x-1/2"
            style={{ background: 'var(--text-secondary)', opacity: 0.7 }}
            initial={false}
            animate={{ left: pct(v) }}
            transition={slide}
          />
        ))}
      </div>

      <div className="relative mt-1.5 h-4 text-[0.7rem]">
        <span className="absolute left-0 top-0">
          <ZoneLabel active={decision === 'suppress'}>Suppress</ZoneLabel>
        </span>
        <motion.span
          className="absolute top-0 -translate-x-1/2"
          initial={false}
          animate={{ left: pct(deferAt) }}
          transition={slide}
        >
          <ZoneLabel active={decision === 'defer'}>Defer</ZoneLabel>
        </motion.span>
        <span className="absolute right-0 top-0">
          <ZoneLabel active={decision === 'keep'}>Keep</ZoneLabel>
        </span>
      </div>
    </div>
  );
}

function ZoneLabel({ active, children }: { active: boolean; children: string }) {
  return (
    <span className={`whitespace-nowrap ${active ? 'font-semibold text-accent' : 'text-muted'}`}>{children}</span>
  );
}

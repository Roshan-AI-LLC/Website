import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Check, ChevronDown, CircleDot, FileText, Network } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SCENARIOS } from '../../data/shifamindScenarios';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { SectionLabel } from '../SectionLabel';

type StageId = 'note' | 'concepts' | 'output';

const EASE = [0.22, 1, 0.36, 1] as const;

const STAGE_TITLE_CLASS =
  'max-w-sm font-display text-[1.15rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:mt-3 sm:text-[2rem]';

const stages: {
  id: StageId;
  label: string;
  kicker: string;
  title: string;
}[] = [
  {
    id: 'note',
    label: 'Clinical note',
    kicker: '01 · input',
    title: 'Start with the note.',
  },
  {
    id: 'concepts',
    label: 'Concept evidence',
    kicker: '02 · grounding',
    title: 'Find the clinical concepts.',
  },
  {
    id: 'output',
    label: 'Ranked output',
    kicker: '03 · prediction',
    title: 'Return the code, with its evidence.',
  },
];

export function ShifaMindProof() {
  const [activeStage, setActiveStage] = useState<StageId>('note');
  const reducedMotion = useReducedMotion();
  const scenario = SCENARIOS[0];
  const primaryCode = scenario.codes[0];
  const activeIndex = stages.findIndex((stage) => stage.id === activeStage);
  const stage = stages[activeIndex] ?? stages[0];

  return (
    <section id="evidence-field" className="mobile-native-section relative py-14 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <SectionLabel>Evidence field</SectionLabel>
          <h2 className="mt-3 text-balance font-display text-[1.5rem] font-semibold leading-[1.08] tracking-[-0.04em] sm:mt-4 sm:text-[3rem]">
            See the evidence behind{' '}
            <span className="gradient-text">the output.</span>
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: reducedMotion ? 0 : 0.6, ease: EASE }}
          className="glass relative mt-6 overflow-hidden rounded-2xl sm:mt-12 sm:rounded-[2rem]"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-36 top-0 h-72 w-72 rounded-full opacity-60 blur-3xl"
            style={{
              background:
                'radial-gradient(circle, color-mix(in oklab, var(--accent) 24%, transparent), transparent 68%)',
            }}
          />

          {/* Phones: the trace label row is hidden and the stage tabs lead the card. */}
          <div className="relative border-b border-subtle px-2.5 py-2.5 sm:px-6 sm:py-5">
            <div className="hidden items-center justify-between gap-3 sm:flex sm:flex-row sm:justify-between">
              <div className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-secondary">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-soft text-accent">
                  <Network size={14} strokeWidth={2} />
                </span>
                ShifaMind proof trace
              </div>
              <span className="hidden w-fit items-center gap-1.5 rounded-full border border-subtle bg-glass-strong px-2.5 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.12em] text-muted sm:inline-flex">
                <CircleDot size={11} className="text-accent" />
                Interactive example
              </span>
            </div>

            <div
              className="grid grid-cols-3 gap-1 rounded-xl border border-subtle bg-glass p-1 sm:mt-4 sm:rounded-2xl"
              role="tablist"
              aria-label="ShifaMind proof stages"
            >
              {stages.map((item, index) => {
                const active = item.id === activeStage;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-controls="shifamind-proof-panel"
                    id={`shifamind-stage-${item.id}`}
                    onClick={() => setActiveStage(item.id)}
                    className="relative min-h-10 min-w-0 rounded-lg px-1.5 py-1.5 text-center transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--accent)] sm:min-h-auto sm:rounded-xl sm:px-3 sm:py-2.5 sm:text-left"
                    style={{ color: active ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                  >
                    {active && (
                      <motion.span
                        layoutId="shifamind-proof-active-stage"
                        className="absolute inset-0 rounded-xl border border-subtle bg-glass-strong"
                        transition={{ duration: reducedMotion ? 0 : 0.28, ease: EASE }}
                      />
                    )}
                    {/* Phones: no step number, and the label wraps instead of truncating. */}
                    <span className="relative hidden truncate text-[0.54rem] font-semibold uppercase tracking-[0.08em] text-muted sm:block sm:text-[0.64rem]">
                      0{index + 1}
                    </span>
                    <span className="relative block text-[0.72rem] font-semibold leading-tight sm:mt-0.5 sm:truncate sm:text-[0.82rem] sm:leading-[inherit]">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative grid lg:grid-cols-[0.88fr_1.12fr]">
            <div
              id="shifamind-proof-panel"
              role="tabpanel"
              aria-labelledby={`shifamind-stage-${activeStage}`}
              className="grid grid-cols-1 border-b border-subtle p-4 sm:block sm:p-7 lg:border-b-0 lg:border-r lg:p-8"
            >
              {/* Phones: invisible copies of every stage share the panel's one
                  grid cell, so it holds the tallest stage's height and the
                  card below stays put on each tab change. Gone from sm up. */}
              {stages.map((item) => (
                <div key={item.id} aria-hidden className="invisible col-start-1 row-start-1 sm:hidden">
                  <div className={STAGE_TITLE_CLASS}>{item.title}</div>
                  <StageDetail
                    stage={item.id}
                    evidence={primaryCode.evidence}
                    concepts={primaryCode.concepts}
                    code={primaryCode}
                  />
                </div>
              ))}
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeStage}
                  initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: reducedMotion ? 0 : 0.28, ease: EASE }}
                  className="col-start-1 row-start-1"
                >
                  <div className="hidden text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-accent sm:block">
                    {stage.kicker}
                  </div>
                  <h3 className={STAGE_TITLE_CLASS}>
                    {stage.title}
                  </h3>

                  {/* Shown on every screen: on phones the stage detail is the
                      open view and the console below is the collapsed one. */}
                  <StageDetail
                    stage={activeStage}
                    evidence={primaryCode.evidence}
                    concepts={primaryCode.concepts}
                    code={primaryCode}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="min-w-0 px-4 py-3 sm:p-7 lg:p-8">
              <div className="hidden sm:block">
                <EvidenceField activeIndex={activeIndex} reducedMotion={reducedMotion} />
              </div>
              {/* Phones: the console collapses behind its own name; it still
                  follows the active stage when opened. */}
              <details className="group sm:hidden">
                <summary className="flex min-h-10 cursor-pointer list-none items-center justify-between gap-3 rounded-xl border border-subtle bg-glass px-3 text-[0.74rem] font-semibold text-accent [&::-webkit-details-marker]:hidden">
                  Clinical reasoning console
                  <ChevronDown size={15} className="shrink-0 transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <div className="pt-2.5">
                  <EvidenceField activeIndex={activeIndex} reducedMotion={reducedMotion} compact />
                </div>
              </details>
            </div>
          </div>

          {/* Phones: just the disclaimer; the hero and benchmark already link to ShifaMind. */}
          <div className="relative flex flex-col gap-2 border-t border-subtle px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-5">
            <p className="max-w-2xl text-[0.72rem] leading-relaxed text-muted sm:text-[0.72rem]">
              Illustrative example. No patient data.
            </p>
            <Link
              to="/products/shifamind"
              className="group hidden shrink-0 items-center gap-1.5 text-[0.8rem] font-semibold text-accent transition hover:text-primary sm:inline-flex"
            >
              Explore ShifaMind
              <ArrowUpRight
                size={14}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function StageDetail({
  stage,
  evidence,
  concepts,
  code,
}: {
  stage: StageId;
  evidence: string[];
  concepts: { label: string; activation: number }[];
  code: { code: string; description: string; confidence: number };
}) {
  if (stage === 'note') {
    return (
      <div className="mt-3 rounded-xl border border-subtle bg-elev p-3 sm:mt-7 sm:rounded-2xl sm:p-5">
        <div className="flex items-center justify-between gap-3 text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-muted">
          <span className="inline-flex items-center gap-1.5">
            <FileText size={12} />
            Clinical note excerpt
          </span>
          <span>Example</span>
        </div>
        <p className="mt-2 text-[0.84rem] leading-relaxed text-secondary sm:mt-4 sm:text-[0.9rem]">
          “{evidence[0]},” with “{evidence[1]}” and “{evidence[2]}” captured
          as clinically relevant signals.
        </p>
      </div>
    );
  }

  if (stage === 'concepts') {
    return (
      <div className="mt-3 sm:mt-7">
        <div className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-muted">
          Activated clinical concepts
        </div>
        <div className="mt-2 grid grid-cols-2 gap-1.5 sm:mt-3 sm:gap-2">
          {concepts.slice(0, 4).map((concept) => (
            <div
              key={concept.label}
              className="rounded-xl border border-subtle bg-glass-strong px-2.5 py-2 sm:px-3 sm:py-2.5"
            >
              {/* Phones: long names wrap instead of truncating; truncation
                  returns at sm. */}
              <div className="font-mono text-[0.68rem] leading-snug text-secondary sm:truncate sm:leading-[inherit]">
                {concept.label.replace(/_/g, ' ')}
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[color:var(--border-subtle)]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${concept.activation * 100}%` }}
                  transition={{ duration: 0.65, ease: EASE }}
                  className="h-full rounded-full bg-[color:var(--accent)]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
      <div className="mt-3 rounded-xl border border-subtle bg-glass-strong p-3 sm:mt-7 sm:rounded-2xl sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-muted">
            Highest-ranked output
          </div>
          <div className="mt-2.5 inline-flex rounded-lg bg-accent-soft px-2.5 py-1 font-mono text-[0.84rem] font-semibold text-accent sm:mt-3 sm:text-[0.9rem]">
            {code.code}
          </div>
          <div className="mt-2 text-[0.86rem] font-semibold leading-snug text-primary sm:text-[0.94rem]">
            {code.description}
          </div>
        </div>
        <div className="shrink-0 text-right">
          <div className="font-display text-[1.3rem] font-semibold tracking-[-0.03em] text-accent sm:text-[1.5rem]">
            {Math.round(code.confidence * 100)}%
          </div>
          <div className="text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-muted">
            confidence
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 border-t border-subtle pt-3 text-[0.7rem] font-medium text-secondary sm:mt-4 sm:text-[0.76rem]">
        <Check size={14} className="text-accent" strokeWidth={2.5} />
        Evidence stays linked to the code.
      </div>
    </div>
  );
}

/**
 * `compact` is the phone copy inside the console <details>: no outer frame,
 * no title bar (the summary already names it) and no stage strip (the tabs
 * above already show progress).
 */
function EvidenceField({
  activeIndex,
  reducedMotion,
  compact = false,
}: {
  activeIndex: number;
  reducedMotion: boolean;
  compact?: boolean;
}) {
  const conceptsActive = activeIndex >= 1;
  const outputActive = activeIndex >= 2;
  const duration = reducedMotion ? 0 : 0.35;

  return (
    <div
      className={
        compact
          ? 'relative'
          : 'relative overflow-hidden rounded-2xl border border-subtle bg-elev p-2.5 sm:rounded-3xl sm:p-4'
      }
    >
      {!compact && (
        <div className="flex items-center justify-between gap-2 rounded-xl border border-subtle bg-glass-strong px-2.5 py-2 sm:px-3 sm:py-2.5">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent-soft text-accent">
              <Network size={13} strokeWidth={2} />
            </span>
            <div>
              <div className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-muted">
                Evidence field
              </div>
              <div className="mt-0.5 text-[0.72rem] font-semibold text-secondary">
                Clinical reasoning console
              </div>
            </div>
          </div>
          <span className="rounded-md border border-subtle px-1.5 py-1 font-mono text-[0.56rem] text-accent sm:px-2 sm:text-[0.6rem]">
            TRACE 24.08
          </span>
        </div>
      )}

      <div
        className={`grid gap-2.5 md:grid-cols-[0.86fr_1.14fr] sm:gap-3 ${compact ? '' : 'mt-2.5 sm:mt-3'}`}
      >
        <motion.div
          initial={false}
          animate={{ opacity: 1, borderColor: activeIndex === 0 ? 'var(--accent)' : 'var(--border-subtle)' }}
          transition={{ duration, ease: EASE }}
          className="rounded-xl border bg-glass p-3 sm:p-4"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.13em] text-secondary">
              <FileText size={12} className="text-accent" />
              Source note
            </div>
            <span className="font-mono text-[0.6rem] text-muted">01 / 03</span>
          </div>
          <div className="mt-3 border-l-2 border-[color:var(--accent)] pl-3 sm:mt-4">
            <div className="text-[0.67rem] font-semibold uppercase tracking-[0.12em] text-muted">HPI excerpt</div>
            <p className="mt-2 text-[0.76rem] leading-relaxed text-secondary sm:text-[0.82rem]">
              Progressive dyspnea and orthopnea, with bilateral lower-extremity edema and elevated BNP.
            </p>
          </div>
          <div className="mt-3 flex items-center gap-2 border-t border-subtle pt-2.5 text-[0.64rem] text-muted sm:mt-4 sm:pt-3 sm:text-[0.67rem]">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
            3 supporting signals detected
          </div>
        </motion.div>

        <div className="rounded-xl border border-subtle bg-glass p-3 sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="text-[0.62rem] font-semibold uppercase tracking-[0.13em] text-secondary">
              Reasoning trace
            </div>
            <span className="font-mono text-[0.6rem] text-muted">02 → 03</span>
          </div>

          <div className="mt-2.5 space-y-1.5 sm:mt-3 sm:space-y-2">
            <TraceRow label="orthopnea" value="0.93" active={conceptsActive} delay={0} duration={duration} />
            <TraceRow label="BNP elevation" value="0.90" active={conceptsActive} delay={0.05} duration={duration} />
            <TraceRow label="lower-extremity edema" value="0.91" active={conceptsActive} delay={0.1} duration={duration} />
          </div>

          <motion.div
            initial={false}
            animate={{ opacity: outputActive ? 1 : 0.38, y: outputActive ? 0 : 3 }}
            transition={{ duration, delay: reducedMotion ? 0 : 0.1, ease: EASE }}
            className="mt-3 grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-lg border border-subtle bg-elev p-2.5 sm:mt-4 sm:gap-3 sm:p-3"
            style={outputActive ? { borderColor: 'color-mix(in oklab, var(--accent) 52%, var(--border-subtle))' } : undefined}
          >
            <div className="rounded-md bg-accent-soft px-2 py-1 font-mono text-[0.75rem] font-semibold text-accent">
              I50.23
            </div>
            <div className="min-w-0">
              <div className="truncate text-[0.76rem] font-semibold text-primary">Ranked output</div>
              <div className="mt-0.5 truncate text-[0.64rem] text-muted">Evidence retained · confidence 94%</div>
            </div>
            <Check size={15} className="text-accent" strokeWidth={2.4} />
          </motion.div>
        </div>
      </div>

      {!compact && (
        <div className="mt-2.5 grid grid-cols-3 gap-1.5 border-t border-subtle pt-2.5 sm:mt-3 sm:gap-2 sm:pt-3">
          {['Ingest note', 'Ground concepts', 'Return evidence'].map((label, index) => (
            <div key={label} className="min-w-0 rounded-lg bg-glass px-1.5 py-1.5 text-center sm:px-2 sm:py-2">
              <div className={`mx-auto h-1 w-8 rounded-full ${activeIndex >= index ? 'bg-accent' : 'bg-[color:var(--border-subtle)]'}`} />
              <div className="mt-1.5 truncate text-[0.56rem] font-semibold uppercase tracking-[0.08em] text-muted sm:text-[0.6rem]">
                {label}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TraceRow({
  label,
  value,
  active,
  delay,
  duration,
}: {
  label: string;
  value: string;
  active: boolean;
  delay: number;
  duration: number;
}) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: active ? 1 : 0.34 }}
      transition={{ duration, delay, ease: EASE }}
      className="grid grid-cols-[8px_minmax(0,1fr)_32px] items-center gap-2 rounded-lg border border-subtle bg-elev px-2 py-1.5 sm:grid-cols-[8px_minmax(0,1fr)_34px] sm:px-2.5 sm:py-2"
    >
      <span className="h-2 w-2 rounded-sm" style={{ background: active ? 'var(--accent)' : 'var(--border-strong)' }} />
      <span className="truncate font-mono text-[0.66rem] text-secondary">{label}</span>
      <span className="text-right font-mono text-[0.64rem] text-accent">{value}</span>
    </motion.div>
  );
}

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, RotateCcw, Sparkles, ArrowUpRight } from 'lucide-react';
import {
  SCENARIOS,
  type CodePrediction,
  type Scenario,
} from '../../data/shifamindScenarios';
import { PLATFORM_URL } from '../../lib/config';

type DemoState = 'idle' | 'predicting' | 'results';

const PREDICT_DURATION_MS = 2400;
const EASE = [0.22, 1, 0.36, 1] as const;

export function DemoBlock() {
  const [scenarioId, setScenarioId] = useState<Scenario['id']>('cardiology');
  const [state, setState] = useState<DemoState>('idle');
  const [activeCode, setActiveCode] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  const scenario = SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[0];

  useEffect(() => {
    setState('idle');
    setActiveCode(null);
    if (timerRef.current) window.clearTimeout(timerRef.current);
  }, [scenarioId]);

  useEffect(
    () => () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    },
    [],
  );

  const handlePredict = () => {
    setState('predicting');
    timerRef.current = window.setTimeout(() => {
      setState('results');
      setActiveCode(scenario.codes[0]?.code ?? null);
    }, PREDICT_DURATION_MS);
  };

  const handleReset = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setState('idle');
    setActiveCode(null);
  };

  return (
    <div className="glass relative overflow-hidden rounded-3xl">
      <TabBar
        scenarios={SCENARIOS}
        activeId={scenarioId}
        onSelect={setScenarioId}
        subLabel={scenario.subLabel}
      />

      <div className="grid gap-0 lg:grid-cols-[1.05fr_1fr]">
        <div className="border-b border-subtle p-6 sm:p-8 lg:border-b-0 lg:border-r">
          <NoteView scenario={scenario} state={state} activeCode={activeCode} />
        </div>
        <div className="p-6 sm:p-8">
          <ResultsPane
            scenario={scenario}
            state={state}
            activeCode={activeCode}
            onSelectCode={setActiveCode}
            onPredict={handlePredict}
            onReset={handleReset}
          />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────── Tabs

function TabBar({
  scenarios,
  activeId,
  onSelect,
  subLabel,
}: {
  scenarios: Scenario[];
  activeId: Scenario['id'];
  onSelect: (id: Scenario['id']) => void;
  subLabel: string;
}) {
  return (
    <div className="border-b border-subtle">
      <div className="flex flex-wrap items-center gap-1 px-4 pt-4 sm:px-6">
        {scenarios.map((s) => {
          const active = s.id === activeId;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelect(s.id)}
              className="relative rounded-full px-4 py-1.5 text-[0.84rem] font-medium transition-colors"
              style={{
                color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
              }}
            >
              {active && (
                <motion.span
                  layoutId="demo-tab-bg"
                  className="absolute inset-0 -z-0 rounded-full"
                  style={{ background: 'var(--accent-soft)' }}
                  transition={{ duration: 0.35, ease: EASE }}
                />
              )}
              <span className="relative">{s.label}</span>
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-2 px-6 pb-3 pt-2 text-[0.76rem] text-muted sm:px-8">
        <span className="font-mono uppercase tracking-[0.14em]">scenario</span>
        <span aria-hidden>·</span>
        <span>{subLabel}</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────── Note view

function NoteView({
  scenario,
  state,
  activeCode,
}: {
  scenario: Scenario;
  state: DemoState;
  activeCode: string | null;
}) {
  // Collect highlight phrases by state:
  //   predicting → all phrases across all codes (animated reveal)
  //   results    → phrases for the active code only
  const highlightPhrases = useMemo(() => {
    if (state === 'idle') return [];
    if (state === 'predicting') {
      const all = scenario.codes.flatMap((c) => c.evidence);
      return Array.from(new Set(all));
    }
    const active = scenario.codes.find((c) => c.code === activeCode);
    return active?.evidence ?? [];
  }, [scenario, state, activeCode]);

  return (
    <div>
      <div className="flex items-center justify-between text-[0.72rem] uppercase tracking-[0.14em] text-muted">
        <span className="inline-flex items-center gap-2 font-mono">
          <span>clinical note</span>
        </span>
        <span>{scenario.note.length} sections</span>
      </div>

      <div className="mt-5 space-y-5">
        {scenario.note.map((section) => (
          <div key={section.heading}>
            <h4
              className={`text-[0.94rem] font-semibold tracking-[-0.01em] transition-colors duration-300 ${
                state === 'predicting' ? 'text-muted' : 'text-primary'
              }`}
            >
              {section.heading}
            </h4>
            <p
              className={`mt-1.5 text-[0.92rem] leading-relaxed transition-colors duration-300 ${
                state === 'predicting' ? 'text-muted' : 'text-secondary'
              }`}
            >
              <HighlightedText
                text={section.text}
                phrases={highlightPhrases}
                state={state}
              />
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function HighlightedText({
  text,
  phrases,
  state,
}: {
  text: string;
  phrases: string[];
  state: DemoState;
}) {
  const parts = useMemo(() => splitByPhrases(text, phrases), [text, phrases]);

  return (
    <>
      {parts.map((part, i) => {
        if (!part.match) return <span key={i}>{part.text}</span>;

        const isResult = state === 'results';
        return (
          <motion.span
            key={`${i}-${state}`}
            initial={{ backgroundColor: 'transparent' }}
            animate={{
              backgroundColor: 'var(--accent-soft)',
              color: 'var(--text-primary)',
            }}
            transition={{
              duration: 0.35,
              ease: EASE,
              delay: state === 'predicting' ? 0.15 + i * 0.04 : 0,
            }}
            className="rounded px-1 py-0.5 font-medium"
          >
            {isResult && (
              <Check
                size={12}
                strokeWidth={2.6}
                className="mr-1 inline-block text-accent"
              />
            )}
            {part.text}
          </motion.span>
        );
      })}
    </>
  );
}

function splitByPhrases(
  text: string,
  phrases: string[],
): { text: string; match: boolean }[] {
  if (phrases.length === 0) return [{ text, match: false }];

  const escaped = phrases
    .map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .sort((a, b) => b.length - a.length); // longest-first to prevent overlaps
  const re = new RegExp(`(${escaped.join('|')})`, 'gi');

  const out: { text: string; match: boolean }[] = [];
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > lastIndex) {
      out.push({ text: text.slice(lastIndex, m.index), match: false });
    }
    out.push({ text: m[0], match: true });
    lastIndex = m.index + m[0].length;
    if (m[0].length === 0) re.lastIndex++; // safety
  }
  if (lastIndex < text.length) {
    out.push({ text: text.slice(lastIndex), match: false });
  }
  return out;
}

// ─────────────────────────────────────────────────────────── Results pane

function ResultsPane({
  scenario,
  state,
  activeCode,
  onSelectCode,
  onPredict,
  onReset,
}: {
  scenario: Scenario;
  state: DemoState;
  activeCode: string | null;
  onSelectCode: (code: string) => void;
  onPredict: () => void;
  onReset: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <AnimatePresence mode="wait">
        {state === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="flex flex-1 flex-col items-center justify-center py-10 text-center"
          >
            <h3 className="font-display text-[1.4rem] font-semibold tracking-[-0.015em] sm:text-[1.6rem]">
              Let's code this note
            </h3>
            <p className="mt-2 max-w-xs text-[0.88rem] text-secondary">
              with ShifaMind, concept-grounded ICD-10 coding.
            </p>
            <button
              type="button"
              onClick={onPredict}
              className="group mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[0.92rem] font-semibold transition will-change-transform hover:-translate-y-0.5"
              style={{
                background:
                  'linear-gradient(135deg, var(--accent) 0%, var(--color-iris-500) 100%)',
                boxShadow: 'var(--shadow-glow)',
                color: 'var(--on-accent)',
              }}
            >
              <Sparkles size={14} strokeWidth={2.2} />
              Predict codes
            </button>
          </motion.div>
        )}

        {state === 'predicting' && (
          <motion.div
            key="predicting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-1 flex-col py-4"
          >
            <div className="flex items-center gap-2 text-[0.78rem] uppercase tracking-[0.14em] text-accent">
              <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-current" />
              Assigning codes
            </div>

            <div className="mt-5 space-y-3">
              {scenario.codes.slice(0, 3).map((_, i) => (
                <SkeletonCard key={i} delay={i * 0.12} />
              ))}
            </div>
          </motion.div>
        )}

        {state === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="flex flex-1 flex-col"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-[0.94rem] font-semibold text-primary">
                Ready to submit
              </h3>
              <span className="font-mono text-[0.74rem] text-muted">
                {scenario.codes.length} codes
              </span>
            </div>

            <div className="mt-4 space-y-2.5">
              {scenario.codes.map((code, i) => (
                <CodeCard
                  key={code.code}
                  code={code}
                  active={code.code === activeCode}
                  onSelect={() => onSelectCode(code.code)}
                  delay={i * 0.06}
                />
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between gap-3 border-t border-subtle pt-4">
              <button
                type="button"
                onClick={onReset}
                aria-label="Reset demo"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-subtle bg-glass text-secondary transition hover:border-strong hover:text-primary"
              >
                <RotateCcw size={14} />
              </button>
              <a
                href={PLATFORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-5 py-2.5 text-[0.88rem] font-semibold transition will-change-transform hover:-translate-y-0.5"
                style={{
                  background:
                    'linear-gradient(135deg, var(--accent) 0%, var(--color-iris-500) 100%)',
                  boxShadow: 'var(--shadow-glow)',
                  color: 'var(--on-accent)',
                }}
              >
                Try with your note
                <ArrowUpRight
                  size={14}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </div>
            <p className="mt-2 text-center text-[0.74rem] text-muted">
              Unlock the full coder in the ShifaMind platform.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SkeletonCard({ delay }: { delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: EASE }}
      className="relative overflow-hidden rounded-2xl border border-subtle bg-glass p-4"
    >
      <div className="h-3 w-14 rounded-md" style={{ background: 'var(--accent-soft)' }} />
      <div className="mt-3 h-3 w-[70%] rounded-md bg-glass" style={{ background: 'var(--border-subtle)' }} />
      <div className="mt-2 h-3 w-[40%] rounded-md" style={{ background: 'var(--border-subtle)' }} />
      <div className="shimmer pointer-events-none absolute inset-0" />
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────── Code card

function CodeCard({
  code,
  active,
  onSelect,
  delay,
}: {
  code: CodePrediction;
  active: boolean;
  onSelect: () => void;
  delay: number;
}) {
  const [showAlts, setShowAlts] = useState(false);

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: EASE }}
      className={`block w-full overflow-hidden rounded-2xl border text-left transition ${
        active
          ? 'border-strong bg-glass'
          : 'border-subtle bg-glass hover:border-strong'
      }`}
      style={
        active
          ? {
              boxShadow:
                '0 0 0 1px var(--accent), 0 8px 24px -16px color-mix(in oklab, var(--accent) 80%, transparent)',
            }
          : undefined
      }
    >
      <div className="p-4">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center rounded-md px-2 py-0.5 font-mono text-[0.78rem] font-semibold"
            style={{
              background: 'var(--accent-soft)',
              color: 'var(--accent)',
            }}
          >
            {code.code}
          </span>
          <span className="font-mono text-[0.7rem] text-muted">
            {Math.round(code.confidence * 100)}%
          </span>
        </div>

        <div className="mt-2 text-[0.92rem] font-semibold leading-snug text-primary">
          {code.description}
        </div>

        {code.alternatives.length > 0 && (
          <div className="mt-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowAlts((v) => !v);
              }}
              className="inline-flex items-center gap-1 text-[0.78rem] text-secondary transition hover:text-primary"
            >
              <ChevronDown
                size={12}
                className={`transition-transform ${showAlts ? 'rotate-180' : ''}`}
              />
              {code.alternatives.length}{' '}
              {code.alternatives.length === 1 ? 'alternative' : 'alternatives'}
            </button>
            <AnimatePresence initial={false}>
              {showAlts && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="mt-2 space-y-1 overflow-hidden"
                >
                  {code.alternatives.map((alt) => (
                    <li
                      key={alt.code}
                      className="flex items-baseline gap-2 text-[0.8rem]"
                    >
                      <span className="font-mono text-secondary">{alt.code}</span>
                      <span className="text-muted">{alt.description}</span>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AnimatePresence initial={false}>
        {active && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden border-t border-subtle"
          >
            <div className="p-4">
              <div className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-secondary">
                Activated concepts
              </div>
              <div className="mt-2 space-y-1.5">
                {code.concepts.map((c, i) => (
                  <ConceptBar
                    key={c.label}
                    label={c.label}
                    activation={c.activation}
                    delay={i * 0.04}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

function ConceptBar({
  label,
  activation,
  delay,
}: {
  label: string;
  activation: number;
  delay: number;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-28 truncate font-mono text-[0.74rem] text-secondary">
        {label}
      </div>
      <div className="relative h-2 flex-1 overflow-hidden rounded-full border border-subtle bg-glass">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${activation * 100}%` }}
          transition={{ duration: 0.8, delay, ease: EASE }}
          className="h-full rounded-full"
          style={{
            background:
              'linear-gradient(90deg, color-mix(in oklab, var(--accent) 40%, transparent), var(--accent))',
          }}
        />
      </div>
      <div className="w-9 text-right font-mono text-[0.7rem] text-accent">
        {activation.toFixed(2)}
      </div>
    </div>
  );
}

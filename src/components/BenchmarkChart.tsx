import { motion } from 'framer-motion';
import { ArrowUpRight, Trophy } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BENCHMARK_ROWS, SHIFAMIND, TASK, pct, type BenchmarkRow } from '../data/shifamindPaper';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * The ShifaMind benchmark card, shared by the home page and the ShifaMind
 * page. The headline is AUROC; the leaderboard is a bar chart over F1 with a
 * metric toggle. Every figure comes from src/data/shifamindPaper.ts.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

const METRICS = [
  { key: 'f1Macro', label: 'Macro-F1' },
  { key: 'f1Micro', label: 'Micro-F1' },
] as const;
type MetricKey = (typeof METRICS)[number]['key'];

/** Top models shown per metric. The two oldest baselines add rows, not information. */
const ROWS_SHOWN = 5;

export function BenchmarkChart({ productLink = false }: { productLink?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.65, ease: EASE }}
      className="glass relative overflow-hidden rounded-2xl sm:rounded-[2rem]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-12 h-80 w-80 rounded-full opacity-55 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklab, var(--accent) 22%, transparent), transparent 68%)',
        }}
      />

      <div className="relative grid lg:grid-cols-[0.9fr_1.1fr]">
        <div className="border-b border-subtle p-4 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
          <div className="inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-accent">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-soft">
              <Trophy size={14} strokeWidth={2.1} />
            </span>
            Benchmark
          </div>

          <h2 className="mt-3 max-w-md text-balance font-display text-[1.5rem] font-semibold leading-[1.08] tracking-[-0.04em] sm:mt-5 sm:text-[2.7rem]">
            Accuracy you can <span className="gradient-text">audit.</span>
          </h2>

          <p className="mt-2 max-w-sm text-[0.86rem] leading-relaxed text-secondary sm:mt-4 sm:text-[0.96rem]">
            Every ICD-10 code, every prediction traced to clinical concepts.
          </p>

          <div className="mt-4 rounded-2xl border border-subtle bg-glass-strong p-3.5 sm:mt-8 sm:p-6">
            <div className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-muted">
              Accuracy · {TASK.codes.toLocaleString('en-US')} codes
            </div>
            <div className="mt-2 grid grid-cols-2 gap-4 sm:mt-3 sm:gap-6">
              <Headline value={pct(SHIFAMIND.aucMicro)} label="Micro-AUROC" />
              <Headline value={pct(SHIFAMIND.aucMacro)} label="Macro-AUROC" />
            </div>
          </div>

          {productLink && (
            <Link
              to="/products/shifamind"
              className="group mt-2 inline-flex min-h-10 items-center gap-1.5 text-[0.84rem] font-semibold text-accent transition hover:text-primary sm:mt-7 sm:min-h-auto"
            >
              Explore ShifaMind
              <ArrowUpRight
                size={14}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          )}
        </div>

        <Leaderboard />
      </div>
    </motion.div>
  );
}

function Leaderboard() {
  const [metric, setMetric] = useState<MetricKey>('f1Macro');
  const reduced = useReducedMotion();

  const value = (row: BenchmarkRow) => row[metric];
  const rows = [...BENCHMARK_ROWS].sort((a, b) => value(b) - value(a)).slice(0, ROWS_SHOWN);
  // Axis starts at zero; ShifaMind fills 90% of the track so it never touches the value column.
  const axisMax = value(SHIFAMIND) / 0.9;
  const runnerUp = Math.max(...BENCHMARK_ROWS.filter((r) => !r.ours).map(value));
  const lead = value(SHIFAMIND) - runnerUp;
  const label = METRICS.find((m) => m.key === metric)!.label;

  return (
    <div className="flex flex-col justify-center p-4 sm:p-8 lg:p-10">
      <div className="flex items-center justify-between gap-3">
        <div className="whitespace-nowrap text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-muted">
          <span className="hidden sm:inline">MIMIC-IV </span>Leaderboard
        </div>
        {/* The metric buttons are 40px tall on phones for touch. */}
        <div
          role="tablist"
          aria-label="Leaderboard metric"
          className="inline-flex rounded-full border border-subtle bg-glass p-0.5"
        >
          {METRICS.map((m) => {
            const active = m.key === metric;
            return (
              <button
                key={m.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setMetric(m.key)}
                className={`relative min-h-10 whitespace-nowrap rounded-full px-2.5 py-1 text-[0.72rem] font-semibold transition-colors sm:min-h-auto sm:px-3 sm:text-[0.68rem] ${
                  active ? 'text-accent' : 'text-muted hover:text-secondary'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="leaderboard-metric"
                    className="absolute inset-0 rounded-full bg-accent-soft"
                    transition={{ duration: reduced ? 0 : 0.3, ease: EASE }}
                  />
                )}
                <span className="relative">{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Phones: slimmer bars and tighter rows; every model and value stays. */}
      <div className="mt-4 space-y-1.5 sm:mt-7 sm:space-y-2.5">
        {rows.map((row) => {
          const width = `${(value(row) / axisMax) * 100}%`;
          return (
            <motion.div
              key={row.model}
              layout={!reduced}
              transition={{ duration: 0.45, ease: EASE }}
              className="grid grid-cols-[minmax(0,1fr)_3rem] items-center gap-3"
            >
              <div
                className="relative h-7 overflow-hidden rounded-lg sm:h-10"
                style={{ background: 'color-mix(in oklab, var(--text-primary) 5%, transparent)' }}
              >
                {/* Real width from the first render, so SSR and the label colour are right
                    without JS; it only animates when the metric changes. */}
                <motion.div
                  initial={false}
                  animate={{ width }}
                  transition={{ duration: reduced ? 0 : 0.6, ease: EASE }}
                  className="absolute inset-y-0 left-0 rounded-lg"
                  style={{
                    background: row.ours
                      ? 'linear-gradient(90deg, var(--accent), color-mix(in oklab, var(--accent) 70%, var(--color-iris-500)))'
                      : 'color-mix(in oklab, var(--text-primary) 13%, transparent)',
                    boxShadow: row.ours ? 'var(--shadow-glow)' : undefined,
                  }}
                />
                <span
                  className={`absolute inset-y-0 left-3 flex items-center whitespace-nowrap text-[0.82rem] sm:text-[0.86rem] ${
                    row.ours ? 'font-semibold' : 'font-medium text-secondary'
                  }`}
                  style={row.ours ? { color: 'var(--btn-primary-fg)' } : undefined}
                >
                  {row.model}
                </span>
              </div>
              <span
                className={`text-right font-display text-[0.95rem] font-semibold tabular-nums ${
                  row.ours ? 'text-accent' : 'text-secondary'
                }`}
              >
                {pct(value(row))}
              </span>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-3 text-[0.8rem] text-secondary sm:mt-6">
        <span className="font-display text-[1rem] font-semibold text-accent">
          +{pct(lead)}
        </span>{' '}
        {label} over the next best model
      </div>
    </div>
  );
}

function Headline({ value, label }: { value: string; label: string }) {
  return (
    <div className="min-w-0">
      <div className="font-display text-[2.1rem] font-semibold leading-none tracking-[-0.05em] text-primary sm:text-[3.4rem]">
        {value}
      </div>
      <div className="mt-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-accent sm:mt-2">
        {label}
      </div>
    </div>
  );
}

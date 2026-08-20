import { motion } from 'framer-motion';
import { ArrowUpRight, FileText, ShieldCheck, Trophy } from 'lucide-react';

const PAPER_URL = 'https://arxiv.org/abs/2605.08482';
const Y_MAX = 0.8;

const benchmarks = [
  { label: 'Vanilla CBM', value: 0.164 },
  { label: 'Claude 4.6', value: 0.343 },
  { label: 'GPT-5.4', value: 0.417 },
  { label: 'Gemini 2.5 Pro', value: 0.435 },
  { label: 'GKI-ICD', value: 0.649 },
  { label: 'ShifaMind', value: 0.712, ours: true },
];

const EASE = [0.22, 1, 0.36, 1] as const;
const mobileBenchmarks = [benchmarks[5], benchmarks[4], benchmarks[3]];

export function BenchmarkChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.65, ease: EASE }}
      className="glass relative overflow-hidden rounded-[1.75rem] sm:rounded-[2rem]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-12 h-80 w-80 rounded-full opacity-55 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklab, var(--accent) 22%, transparent), transparent 68%)',
        }}
      />

      <div className="relative grid lg:grid-cols-[0.84fr_1.16fr]">
        <div className="border-b border-subtle p-5 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
          <div className="inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-accent">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-soft">
              <Trophy size={14} strokeWidth={2.1} />
            </span>
            Benchmark signal
          </div>
          <h2 className="mt-4 max-w-md text-balance font-display text-[1.85rem] font-semibold leading-[1.08] tracking-[-0.04em] sm:mt-5 sm:text-[2.7rem]">
            A performance lead built for{' '}
            <span className="gradient-text">clinical trust.</span>
          </h2>
          <p className="mt-3 max-w-md text-[0.9rem] leading-relaxed text-secondary sm:mt-4 sm:text-[0.96rem]">
            ShifaMind pairs the top Macro-F1 in this comparison with
            concept-mediated evidence that can be inspected alongside every
            prediction.
          </p>

          <div className="mt-6 rounded-2xl border border-subtle bg-glass-strong p-4 sm:mt-8 sm:p-6">
            <div className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-muted">
              MIMIC-IV top-50 · Macro-F1
            </div>
            <div className="mt-3 flex items-end gap-3">
              <div className="font-display text-[3.2rem] font-semibold leading-none tracking-[-0.06em] text-primary sm:text-[4.25rem]">
                0.712
              </div>
              <div className="pb-1 text-[0.74rem] font-semibold uppercase tracking-[0.12em] text-accent">
                Higher is better
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:gap-3">
            <Metric label="Lead over GKI-ICD" value="+0.063" />
            <Metric label="Evidence on every output" value="By design" />
          </div>

          <a
            href={PAPER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-5 inline-flex min-h-10 items-center gap-1.5 rounded-full border border-subtle bg-glass px-4 py-2 text-[0.8rem] font-semibold text-secondary transition hover:border-strong hover:text-primary sm:mt-7 sm:text-[0.82rem]"
          >
            <FileText size={14} />
            Read the paper
            <ArrowUpRight
              size={13}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
        </div>

        <div className="p-5 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-secondary">
                <ShieldCheck size={14} className="text-accent" strokeWidth={2.2} />
                Full scorecard
              </div>
              <h3 className="mt-1.5 font-display text-[1.25rem] font-semibold tracking-[-0.025em] sm:mt-2 sm:text-[1.65rem]">
                Six models. One clear leader.
              </h3>
            </div>
            <span className="rounded-full border border-subtle bg-glass px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-muted">
              Same evaluation
            </span>
          </div>

          <div className="mt-5 space-y-2.5 sm:mt-8 sm:space-y-4">
            <div className="hidden space-y-4 sm:block">
              {benchmarks.map((benchmark, index) => (
                <BenchmarkRow key={benchmark.label} benchmark={benchmark} delay={index * 0.06} />
              ))}
            </div>
            <div className="space-y-2.5 sm:hidden">
              {mobileBenchmarks.map((benchmark, index) => (
                <BenchmarkRow key={benchmark.label} benchmark={benchmark} delay={index * 0.06} />
              ))}
              <details className="group rounded-xl border border-subtle bg-glass px-3 py-2.5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[0.74rem] font-semibold text-secondary [&::-webkit-details-marker]:hidden">
                  View all six models
                  <span className="text-accent transition-transform duration-200 group-open:rotate-45">+</span>
                </summary>
                <div className="mt-3 space-y-2.5 border-t border-subtle pt-3">
                  {benchmarks.slice(0, 3).map((benchmark, index) => (
                    <BenchmarkRow key={benchmark.label} benchmark={benchmark} delay={index * 0.04} />
                  ))}
                </div>
              </details>
            </div>
          </div>

          <div className="mt-8 hidden rounded-2xl border border-subtle bg-elev p-4 sm:flex sm:items-start sm:gap-3 sm:p-5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
              <ShieldCheck size={14} strokeWidth={2.2} />
            </span>
            <p className="mt-3 text-[0.82rem] leading-relaxed text-secondary sm:mt-0">
              ShifaMind is the only architecture in this comparison designed to
              return clinical concepts and supporting evidence alongside a ranked
              output.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-subtle bg-glass px-2.5 py-2.5 sm:px-3 sm:py-3">
      <div className="font-display text-[0.96rem] font-semibold tracking-[-0.02em] text-primary sm:text-[1.05rem]">
        {value}
      </div>
      <div className="mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-muted">
        {label}
      </div>
    </div>
  );
}

function BenchmarkRow({
  benchmark,
  delay,
}: {
  benchmark: (typeof benchmarks)[number];
  delay: number;
}) {
  const width = `${(benchmark.value / Y_MAX) * 100}%`;

  return (
    <div className="grid grid-cols-[minmax(76px,0.6fr)_minmax(0,1fr)_44px] items-center gap-3 sm:grid-cols-[112px_minmax(0,1fr)_48px] sm:gap-4">
      <div
        className={`truncate text-[0.68rem] font-semibold sm:text-[0.8rem] ${
          benchmark.ours ? 'text-primary' : 'text-secondary'
        }`}
      >
        {benchmark.label}
      </div>
      <div className="h-2.5 overflow-hidden rounded-full border border-subtle bg-glass sm:h-3">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.8, delay, ease: EASE }}
          className="h-full rounded-full"
          style={{
            background: benchmark.ours
              ? 'linear-gradient(90deg, color-mix(in oklab, var(--accent) 56%, white), var(--accent))'
              : 'color-mix(in oklab, var(--text-secondary) 22%, transparent)',
            boxShadow: benchmark.ours
              ? '0 0 16px -3px color-mix(in oklab, var(--accent) 75%, transparent)'
              : undefined,
          }}
        />
      </div>
      <div
        className={`text-right font-mono text-[0.74rem] tabular-nums sm:text-[0.8rem] ${
          benchmark.ours ? 'font-semibold text-accent' : 'text-secondary'
        }`}
      >
        {benchmark.value.toFixed(3)}
      </div>
    </div>
  );
}

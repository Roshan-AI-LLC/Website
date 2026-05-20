import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

type Tone = 'ours' | 'clinical' | 'clinical-alt' | 'llm' | 'baseline';

type Bar = {
  label: string;
  value: number;
  tone: Tone;
};

const bars: Bar[] = [
  { label: 'ShifaMind', value: 0.7122, tone: 'ours' },
  { label: 'LAAT', value: 0.7114, tone: 'clinical' },
  { label: 'GKI-ICD', value: 0.6485, tone: 'clinical-alt' },
  { label: 'Gemini 2.5 Pro', value: 0.4349, tone: 'llm' },
  { label: 'GPT-5.4', value: 0.4169, tone: 'llm' },
  { label: 'Claude 4.6', value: 0.3426, tone: 'llm' },
  { label: 'Vanilla CBM', value: 0.164, tone: 'baseline' },
];

function barBackground(tone: Tone): string {
  switch (tone) {
    case 'ours':
      return 'linear-gradient(90deg, var(--color-brand-600), var(--color-brand-300))';
    case 'clinical':
      return 'linear-gradient(90deg, var(--color-brand-500), var(--color-brand-200))';
    case 'clinical-alt':
      return 'linear-gradient(90deg, var(--color-violet-600), var(--color-violet-400))';
    case 'llm':
      return 'linear-gradient(90deg, color-mix(in oklab, var(--text-secondary) 18%, transparent), color-mix(in oklab, var(--text-secondary) 32%, transparent))';
    case 'baseline':
      return 'linear-gradient(90deg, color-mix(in oklab, var(--text-secondary) 10%, transparent), color-mix(in oklab, var(--text-secondary) 18%, transparent))';
  }
}

export function BenchmarkChart() {
  const max = Math.max(...bars.map((b) => b.value));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="glass relative overflow-hidden rounded-3xl p-6 sm:p-8"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-mono text-[0.74rem] uppercase tracking-[0.18em] text-secondary sm:text-[0.82rem]">
            Diagnostic F1 (Top-50 ICD-10)
          </div>
          <div className="mt-1.5 text-[0.82rem] text-muted">
            Macro-averaged · tuned threshold
          </div>
        </div>
        <span
          className="inline-flex items-center rounded-full px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent"
          style={{
            background: 'var(--accent-soft)',
            border: '1px solid color-mix(in oklab, var(--accent) 30%, transparent)',
          }}
        >
          MIMIC-IV
        </span>
      </div>

      {/* Rows */}
      <div className="mt-7 space-y-2.5 sm:space-y-3">
        {bars.map((bar, i) => (
          <BarRow
            key={bar.label}
            bar={bar}
            widthPct={(bar.value / max) * 100}
            delay={i * 0.07}
          />
        ))}
      </div>

      {/* Caption */}
      <div className="mt-7 flex items-start gap-2 border-t border-subtle pt-5 text-[0.86rem] font-light leading-relaxed text-secondary">
        <Info size={14} className="mt-0.5 flex-shrink-0 text-muted" />
        <p>
          ShifaMind beats every general-purpose LLM tested and matches the best
          clinical specialist baseline.
        </p>
      </div>
    </motion.div>
  );
}

function BarRow({
  bar,
  widthPct,
  delay,
}: {
  bar: Bar;
  widthPct: number;
  delay: number;
}) {
  const isOurs = bar.tone === 'ours';
  return (
    <div className="grid grid-cols-[110px_1fr_56px] items-center gap-2.5 sm:grid-cols-[160px_1fr_72px] sm:gap-4">
      <div className="flex flex-wrap items-baseline gap-1.5">
        <span
          className={
            isOurs
              ? 'text-[0.92rem] font-semibold text-primary'
              : 'text-[0.92rem] text-secondary'
          }
        >
          {bar.label}
        </span>
        {isOurs && (
          <span
            className="rounded px-1.5 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.14em]"
            style={{
              background: 'var(--accent-soft)',
              color: 'var(--accent)',
            }}
          >
            Ours
          </span>
        )}
      </div>

      <div
        className="relative h-7 overflow-hidden rounded-md border border-subtle bg-glass sm:h-8"
        role="img"
        aria-label={`${bar.label}: F1 ${bar.value.toFixed(4)}`}
      >
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${widthPct}%` }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 1.05, delay, ease: [0.22, 1, 0.36, 1] }}
          className="h-full"
          style={{ background: barBackground(bar.tone) }}
        />
      </div>

      <div
        className={`text-right font-mono text-[0.86rem] sm:text-[0.92rem] ${
          isOurs ? 'text-accent' : 'text-secondary'
        }`}
      >
        {bar.value.toFixed(4)}
      </div>
    </div>
  );
}

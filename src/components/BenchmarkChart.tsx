import { motion } from 'framer-motion';
import { ArrowUpRight, BarChart3, FileText, IceCream2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { AnthropicMark, GoogleMark, OpenAIMark } from './brand-marks';
import { ShifaMindLogo } from './ShifaMindLogo';

const PAPER_URL = 'https://arxiv.org/abs/2605.08482';

type Competitor = {
  /** Short display name, shown under the brand mark */
  label: string;
  /** Macro-F1 on MIMIC-IV top-50 (paper Table 1) */
  value: number;
  /** Brand mark or thematic icon */
  mark: ReactNode;
  /** Whether this is ShifaMind (highlighted) */
  ours?: boolean;
};

// Ordered low → high for visual ascent, ShifaMind last and highlighted.
// LAAT (0.711) is dropped: it's the old clinical specialist baseline and the
// 0.001 lead reads as a tie. The story we want to tell is "beats every
// frontier LLM AND the latest published clinical model (GKI-ICD) AND the
// capacity-matched architectural baseline (Vanilla CBM)".
const competitors: Competitor[] = [
  {
    label: 'Vanilla CBM',
    value: 0.164,
    mark: <IceCream2 size={18} strokeWidth={1.7} />,
  },
  {
    label: 'Claude 4.6',
    value: 0.343,
    mark: <AnthropicMark size={18} />,
  },
  {
    label: 'GPT-5.4',
    value: 0.417,
    mark: <OpenAIMark size={18} />,
  },
  {
    label: 'Gemini 2.5 Pro',
    value: 0.435,
    mark: <GoogleMark size={18} />,
  },
  {
    label: 'GKI-ICD',
    value: 0.649,
    mark: <BarChart3 size={18} strokeWidth={1.8} />,
  },
  {
    label: 'ShifaMind',
    value: 0.712,
    mark: <ShifaMindLogo size={22} />,
    ours: true,
  },
];

const Y_MAX = 0.8;
const Y_TICKS = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];

export function BenchmarkChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="glass relative overflow-hidden rounded-3xl p-6 sm:p-9"
    >
      <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-14">
        <ChartPanel />
        <CalloutStack />
      </div>
    </motion.div>
  );
}

function ChartPanel() {
  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-[1.2rem] font-semibold tracking-[-0.015em] sm:text-[1.4rem]">
            Accuracy comparison
          </h3>
          <div className="mt-1 text-[0.82rem] text-muted">
            Macro-F1 on MIMIC-IV top-50 (higher is better)
          </div>
        </div>
        <span
          className="inline-flex items-center rounded-full px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-accent"
          style={{
            background: 'var(--accent-soft)',
            border: '1px solid color-mix(in oklab, var(--accent) 30%, transparent)',
          }}
        >
          MIMIC-IV
        </span>
      </div>

      <div className="mt-7 grid grid-cols-[28px_1fr] gap-x-3 sm:gap-x-4">
        <YAxis />
        <div>
          <Bars />
          <LabelRow />
        </div>
      </div>
    </div>
  );
}

function YAxis() {
  return (
    <div className="relative h-64 font-mono text-[0.7rem] text-muted">
      {Y_TICKS.slice()
        .reverse()
        .map((tick) => (
          <div
            key={tick}
            className="absolute right-0 -translate-y-1/2 tabular-nums"
            style={{ top: `${(1 - tick / Y_MAX) * 100}%` }}
          >
            {tick.toFixed(1)}
          </div>
        ))}
    </div>
  );
}

function Bars() {
  return (
    <div className="relative h-64">
      {/* Horizontal gridlines */}
      {Y_TICKS.map((tick) => (
        <div
          key={tick}
          aria-hidden
          className="absolute inset-x-0 h-px"
          style={{
            top: `${(1 - tick / Y_MAX) * 100}%`,
            background:
              tick === 0
                ? 'var(--border-strong)'
                : 'var(--border-subtle)',
          }}
        />
      ))}

      {/* Bars */}
      <div className="relative grid h-full grid-cols-6 items-end gap-2 sm:gap-3">
        {competitors.map((c, i) => (
          <BarColumn key={c.label} competitor={c} delay={i * 0.08} />
        ))}
      </div>
    </div>
  );
}

function BarColumn({
  competitor,
  delay,
}: {
  competitor: Competitor;
  delay: number;
}) {
  const heightPct = (competitor.value / Y_MAX) * 100;
  const isOurs = competitor.ours;

  return (
    <div className="relative flex h-full flex-col items-center justify-end">
      {/* Value label above the bar */}
      <div
        className={`absolute font-mono text-[0.72rem] tabular-nums sm:text-[0.78rem] ${
          isOurs ? 'font-semibold text-accent' : 'text-secondary'
        }`}
        style={{
          bottom: `calc(${heightPct}% + 6px)`,
        }}
      >
        {competitor.value.toFixed(3)}
      </div>

      {/* The bar itself */}
      <motion.div
        initial={{ height: 0 }}
        whileInView={{ height: `${heightPct}%` }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 1.0, delay, ease: [0.22, 1, 0.36, 1] }}
        className={`w-full max-w-[56px] rounded-md ${
          isOurs ? '' : 'border border-subtle'
        }`}
        style={{
          background: isOurs
            ? 'linear-gradient(180deg, color-mix(in oklab, var(--accent) 95%, white), var(--accent))'
            : 'color-mix(in oklab, var(--text-secondary) 12%, transparent)',
          boxShadow: isOurs
            ? '0 4px 18px -4px color-mix(in oklab, var(--accent) 50%, transparent)'
            : undefined,
        }}
        aria-label={`${competitor.label}: Macro-F1 ${competitor.value.toFixed(3)}`}
      />
    </div>
  );
}

function LabelRow() {
  return (
    <div className="mt-4 grid grid-cols-6 gap-2 sm:gap-3">
      {competitors.map((c) => (
        <div
          key={c.label}
          className="flex flex-col items-center gap-1.5 text-center"
        >
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-md ${
              c.ours ? '' : 'text-secondary'
            }`}
          >
            {c.mark}
          </div>
          <div
            className={`text-[0.66rem] leading-tight sm:text-[0.72rem] ${
              c.ours ? 'font-semibold text-primary' : 'text-muted'
            }`}
          >
            {c.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function CalloutStack() {
  return (
    <div className="flex flex-col">
      <div className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-secondary">
        Benchmarks
      </div>

      <h2 className="mt-3 text-balance font-display text-[1.6rem] font-semibold leading-[1.08] tracking-[-0.025em] sm:text-[2rem]">
        Ranked <span className="gradient-text">#1</span> on automated medical coding.
      </h2>

      <p className="mt-3 text-[0.92rem] font-light leading-relaxed text-secondary">
        Highest Macro-F1 across frontier general-purpose LLMs and the latest
        published clinical-coding work.
      </p>

      <Divider />
      <Callout
        big="0.712"
        title="Macro-F1, highest in class."
        body={
          <>
            Beating Anthropic (0.343), OpenAI (0.417), and Google (0.435) on
            the same MIMIC-IV top-50 ICD-10 evaluation.
          </>
        }
      />

      <Divider />
      <Callout
        big=">60%"
        title="Improvement vs. the best general-purpose LLM."
        body={
          <>
            Frontier models stretch into healthcare; ShifaMind is built for it.
            Same evaluation, ~0.28 absolute Macro-F1 lead.
          </>
        }
      />

      <Divider />
      <Callout
        big="#1"
        title="Concept-grounded by construction."
        body={
          <>
            The only architecture in the comparison that produces verifiable
            clinical-concept evidence alongside every prediction.
          </>
        }
      />

      <div className="mt-7">
        <a
          href={PAPER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-subtle bg-glass px-3.5 py-1.5 text-[0.8rem] font-medium text-secondary transition hover:border-strong hover:text-primary"
        >
          <FileText size={13} />
          Read the paper
          <ArrowUpRight size={12} />
        </a>
      </div>
    </div>
  );
}

function Divider() {
  return <div className="my-5 h-px bg-[color:var(--border-subtle)]" />;
}

function Callout({
  big,
  title,
  body,
}: {
  big: string;
  title: ReactNode;
  body: ReactNode;
}) {
  return (
    <div>
      <div className="font-display text-[2rem] font-semibold leading-none tracking-[-0.025em] text-primary sm:text-[2.4rem]">
        {big}
      </div>
      <div className="mt-2 text-[0.92rem] font-semibold text-primary">
        {title}
      </div>
      <p className="mt-1 text-[0.86rem] font-light leading-relaxed text-secondary">
        {body}
      </p>
    </div>
  );
}

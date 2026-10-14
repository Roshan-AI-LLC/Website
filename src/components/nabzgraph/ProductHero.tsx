import { ArrowUpRight, FileText, Stethoscope } from 'lucide-react';
import { fmt, NABZGRAPH, NABZGRAPH_PAPER_URL } from '../../data/nabzPapers';
import { SectionLabel } from '../SectionLabel';

const { data, evidence, falseRelations } = NABZGRAPH;
const evidencePct = Math.round((evidence.edgesWithPointers / evidence.edgesTotal) * 100);

export function ProductHero() {
  return (
    <section className="relative isolate overflow-hidden pt-[5.5rem] pb-8 sm:pt-40 sm:pb-16">
      <div className="pointer-events-none absolute inset-x-0 top-12 -z-[5] flex justify-center">
        <div className="aurora h-[420px] w-[1100px] max-w-full opacity-60" />
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Phones: the status sits beside the eyebrow, as on the Sentry
            hero; from sm it is the chip after the two buttons. */}
        <div className="enter-fade-up flex flex-wrap items-center gap-x-2 gap-y-1">
          <SectionLabel tone="muted">NabzGraph · A Roshan AI product</SectionLabel>
          <span className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-accent sm:hidden">
            Preprint
          </span>
        </div>

        <h1 className="enter-fade-up enter-d-1 mt-4 max-w-4xl text-balance font-display text-[2rem] font-bold leading-[1.06] tracking-[-0.035em] sm:mt-6 sm:text-[3rem] lg:text-[3.5rem]">
          Patient graphs that{' '}
          <span className="gradient-text">know who acted.</span>
        </h1>

        <p className="enter-fade-up enter-d-2 mt-3 max-w-2xl text-pretty text-[0.9rem] leading-relaxed text-secondary sm:mt-6 sm:text-[1.1rem]">
          Typed relations keep a drug&rsquo;s effect apart from the
          clinician&rsquo;s decision, and every edge points to its evidence.
        </p>

        {/* Phones: the two buttons share one row of a 2-col grid (leading
            icons dropped so both labels fit at 360px); the status chip is
            shown from sm only (phones see it beside the eyebrow). */}
        <div className="enter-fade-up enter-d-3 mt-5 grid grid-cols-2 gap-2 sm:mt-8 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
          <a
            href="/contact"
            className="btn-primary group inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-3 py-3 text-[0.88rem] font-semibold transition will-change-transform hover:-translate-y-0.5 sm:col-auto sm:px-5 sm:text-[0.92rem]"
          >
            <Stethoscope size={14} className="hidden sm:block" />
            Book a demo
            <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
          <a
            href={NABZGRAPH_PAPER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border border-subtle bg-glass px-3 py-3 text-[0.78rem] font-medium text-secondary backdrop-blur transition hover:border-strong hover:text-primary sm:gap-2 sm:px-5 sm:text-[0.92rem]"
          >
            <FileText size={14} className="hidden sm:block" />
            Read the paper
          </a>
          <span className="hidden min-h-9 items-center justify-center gap-1.5 rounded-full border border-subtle bg-glass px-3 py-2 text-[0.8rem] font-medium text-muted sm:inline-flex">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
            Preprint
          </span>
        </div>

        <div className="enter-fade-up enter-d-4 mt-6 grid max-w-3xl grid-cols-3 overflow-hidden rounded-2xl border border-subtle bg-glass sm:mt-12">
          <Stat
            value={fmt(falseRelations.ours.transplant, 2)}
            label="False concept links / graph"
            sub={`vs ${fmt(falseRelations.correlational.transplant)} correlational`}
          />
          <Stat
            value={data.surgicalCases.toLocaleString('en-US')}
            label="Surgical cases"
            sub={`+ ${data.icuRecords} ICU records`}
          />
          <Stat
            value={`${evidencePct}%`}
            label="Edges with evidence"
            sub="Each tied to its events"
          />
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label, sub }: { value: string; label: string; sub: string }) {
  return (
    // Divider colour: `.border-subtle` is a plain class Tailwind cannot put
    // under a variant, so `[&:not(:first-child)]:border-subtle` never applied
    // and the line fell back to currentColor. Phones get the hairline here;
    // the desktop divider is left as it renders today.
    <div className="min-w-0 px-2 py-3 sm:px-5 sm:py-4 [&:not(:first-child)]:border-l [&:not(:first-child)]:border-[color:var(--border-subtle)]">
      <div className="font-mono text-[1.05rem] font-semibold tracking-tight text-accent sm:text-[1.55rem]">
        {value}
      </div>
      {/* Label and caption wrap rather than truncate at every width (as on
          the Sentry hero): the captions qualify the numbers, and the
          concept-level label no longer fits one line at sm. */}
      <div className="mt-1 text-[0.62rem] font-medium uppercase tracking-[0.05em] text-secondary sm:text-[0.74rem] sm:tracking-[0.07em]">
        {label}
      </div>
      <div className="mt-0.5 text-[0.72rem] text-muted sm:text-[0.7rem]">{sub}</div>
    </div>
  );
}

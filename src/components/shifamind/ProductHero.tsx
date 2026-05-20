import { ArrowUpRight, FileText, Stethoscope } from 'lucide-react';
import { ShifaMindLogo } from '../ShifaMindLogo';
import { PLATFORM_URL } from '../../lib/config';

const PAPER_URL = 'https://arxiv.org/abs/2605.08482';

export function ProductHero() {
  return (
    <section className="relative isolate overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-20">
      <div className="pointer-events-none absolute inset-x-0 top-12 -z-[5] flex justify-center">
        <div className="aurora h-[420px] w-[1100px] max-w-full opacity-60" />
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="enter-fade-up inline-flex items-center gap-2 rounded-full border border-subtle bg-glass px-3 py-1 text-[0.74rem] font-medium uppercase tracking-[0.14em] text-secondary backdrop-blur">
          <ShifaMindLogo size={14} />
          ShifaMind · A Roshan AI product
        </div>

        <h1 className="enter-fade-up enter-d-1 mt-6 max-w-4xl text-balance font-display text-[2.2rem] font-bold leading-[1.05] tracking-[-0.03em] sm:text-[3rem] lg:text-[3.5rem]">
          Concept-grounded ICD-10 coding{' '}
          <span className="gradient-text">for clinicians and coders.</span>
        </h1>

        <p className="enter-fade-up enter-d-2 mt-6 max-w-2xl text-pretty text-[1.02rem] font-light leading-relaxed text-secondary sm:text-[1.1rem]">
          ShifaMind reads a clinical note and returns ranked ICD-10 codes with
          the concept evidence behind each one. Interpretability is enforced
          architecturally, not bolted on after training.
        </p>

        <div className="enter-fade-up enter-d-3 mt-8 flex flex-wrap items-center gap-3">
          <a
            href={PLATFORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full px-5 py-3 text-[0.92rem] font-semibold transition will-change-transform hover:-translate-y-0.5"
            style={{
              background:
                'linear-gradient(135deg, var(--accent) 0%, var(--color-iris-500) 100%)',
              boxShadow: 'var(--shadow-glow)',
              color: 'var(--on-accent)',
            }}
          >
            Try ShifaMind
            <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-subtle bg-glass px-5 py-3 text-[0.92rem] font-medium text-secondary backdrop-blur transition hover:border-strong hover:text-primary"
          >
            <Stethoscope size={14} />
            Book a demo
          </a>
          <a
            href={PAPER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-subtle bg-glass px-5 py-3 text-[0.92rem] font-medium text-secondary backdrop-blur transition hover:border-strong hover:text-primary"
          >
            <FileText size={14} />
            Read the paper
          </a>
        </div>

        <div className="enter-fade-up enter-d-4 mt-12 grid max-w-3xl grid-cols-3 gap-3 sm:gap-4">
          <Stat value="0.71" label="Macro-F1" sub="50-code MIMIC-IV" />
          <Stat value="160" label="Clinical concepts" sub="Grounded vocabulary" />
          <Stat value="113K" label="Linked admissions" sub="MIMIC-IV labeled corpus" />
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label, sub }: { value: string; label: string; sub: string }) {
  return (
    <div className="glass rounded-2xl p-4 sm:p-5">
      <div className="font-mono text-[1.3rem] font-semibold tracking-tight text-accent sm:text-[1.55rem]">
        {value}
      </div>
      <div className="mt-1 text-[0.74rem] font-medium uppercase tracking-[0.08em] text-secondary">
        {label}
      </div>
      <div className="mt-0.5 text-[0.7rem] text-muted">{sub}</div>
    </div>
  );
}

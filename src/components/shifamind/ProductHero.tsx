import { ArrowUpRight, FileText, Stethoscope } from 'lucide-react';
import { PLATFORM_URL } from '../../lib/config';
import { VideoBlock } from './VideoBlock';

const PAPER_URL = 'https://arxiv.org/abs/2605.08482';

export function ProductHero() {
  return (
    <section className="relative isolate overflow-hidden pt-[5.5rem] pb-10 sm:pt-40 sm:pb-16">
      <div className="pointer-events-none absolute inset-x-0 top-12 -z-[5] flex justify-center">
        <div className="aurora h-[420px] w-[1100px] max-w-full opacity-60" />
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid items-center gap-7 sm:gap-10 lg:grid-cols-[1fr_0.92fr] lg:gap-12">
          <div>
            <div className="enter-fade-up inline-flex items-center gap-2 rounded-full border border-subtle bg-glass px-3 py-1 text-[0.74rem] font-medium uppercase tracking-[0.14em] text-secondary backdrop-blur">
              ShifaMind · A Roshan AI product
            </div>

            <h1 className="enter-fade-up enter-d-1 mt-4 text-balance font-display text-[2rem] font-bold leading-[1.06] tracking-[-0.035em] sm:mt-6 sm:text-[3rem] lg:text-[3.2rem]">
              Concept-grounded ICD-10 coding{' '}
              <span className="gradient-text">for clinicians and coders.</span>
            </h1>

            <p className="enter-fade-up enter-d-2 mt-4 max-w-2xl text-pretty text-[0.94rem] leading-relaxed text-secondary sm:mt-6 sm:text-[1.1rem]">
              ShifaMind reads a clinical note and returns ranked ICD-10 codes
              with the concept evidence behind each one. Interpretability is
              enforced architecturally, not bolted on after training.
            </p>

            <div className="enter-fade-up enter-d-3 mt-6 grid grid-cols-2 gap-2 sm:mt-8 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
              <a
                href={PLATFORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group col-span-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-3 text-[0.88rem] font-semibold transition will-change-transform hover:-translate-y-0.5 sm:col-auto sm:text-[0.92rem]"
                style={{
                  background:
                    'linear-gradient(135deg, var(--accent) 0%, var(--color-iris-500) 100%)',
                  boxShadow: 'var(--shadow-glow)',
                  color: 'var(--on-accent)',
                }}
              >
                Try ShifaMind
                <ArrowUpRight
                  size={15}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
              <a
                href="/contact"
                className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border border-subtle bg-glass px-3 py-3 text-[0.78rem] font-medium text-secondary backdrop-blur transition hover:border-strong hover:text-primary sm:gap-2 sm:px-5 sm:text-[0.92rem]"
              >
                <Stethoscope size={14} />
                Book a demo
              </a>
              <a
                href={PAPER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border border-subtle bg-glass px-3 py-3 text-[0.78rem] font-medium text-secondary backdrop-blur transition hover:border-strong hover:text-primary sm:gap-2 sm:px-5 sm:text-[0.92rem]"
              >
                <FileText size={14} />
                Read the paper
              </a>
            </div>
          </div>

          <div className="enter-fade-up enter-d-3">
            <VideoBlock />
          </div>
        </div>

        <div className="enter-fade-up enter-d-4 mt-8 grid max-w-3xl grid-cols-3 overflow-hidden rounded-2xl border border-subtle bg-glass sm:mt-12">
          <Stat value="0.71" label="Macro-F1" sub="50-code MIMIC-IV" />
          <Stat
            value="160"
            label="Clinical concepts"
            sub="Grounded vocabulary"
          />
          <Stat
            value="113K"
            label="Linked admissions"
            sub="MIMIC-IV labeled corpus"
          />
        </div>
      </div>
    </section>
  );
}

function Stat({
  value,
  label,
  sub,
}: {
  value: string;
  label: string;
  sub: string;
}) {
  return (
    <div className="min-w-0 px-2.5 py-3 sm:px-5 sm:py-4 [&:not(:first-child)]:border-l [&:not(:first-child)]:border-subtle">
      <div className="font-mono text-[1.05rem] font-semibold tracking-tight text-accent sm:text-[1.55rem]">
        {value}
      </div>
      <div className="mt-1 truncate text-[0.58rem] font-medium uppercase tracking-[0.07em] text-secondary sm:text-[0.74rem]">
        {label}
      </div>
      <div className="mt-0.5 truncate text-[0.58rem] text-muted sm:text-[0.7rem]">{sub}</div>
    </div>
  );
}

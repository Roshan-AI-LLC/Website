import { ArrowRight, ArrowUpRight, Check, FileText, Network } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CompanyMark } from './CompanyMark';

const proofPoints = [
  { value: '0.712', label: 'Macro-F1' },
  { value: '#1', label: 'on MIMIC-IV' },
  { value: 'Evidence', label: 'on every output' },
];

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden pt-[5.5rem] pb-7 sm:pt-32 sm:pb-12 lg:pt-36"
    >
      <div className="pointer-events-none absolute inset-x-0 top-8 -z-[5] flex justify-center">
        <div className="aurora h-[400px] w-[1000px] max-w-full opacity-70 sm:h-[460px] sm:w-[1200px]" />
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid items-center gap-7 sm:gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div className="min-w-0">
            <Link
              to="/products/shifamind"
              className="enter-fade-up group inline-flex items-center gap-2 rounded-full border border-subtle bg-glass px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-secondary backdrop-blur transition hover:border-strong hover:text-primary"
            >
              <span className="relative inline-flex h-1.5 w-1.5">
                <span
                  className="absolute inset-0 rounded-full"
                  style={{ background: 'var(--accent)' }}
                />
                <span
                  className="absolute inset-0 animate-ping rounded-full"
                  style={{ background: 'var(--accent)', opacity: 0.4 }}
                />
              </span>
              ShifaMind is live
              <ArrowRight
                size={12}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>

            <div className="mt-4 text-[0.66rem] font-semibold uppercase tracking-[0.15em] text-secondary sm:mt-6 sm:text-[0.7rem]">
              AI infrastructure for clinical reasoning
            </div>
            <h1 className="enter-fade-up enter-d-1 mt-2.5 max-w-2xl text-balance font-display text-[2.15rem] font-bold leading-[1.03] tracking-[-0.045em] sm:mt-4 sm:text-[3.3rem] lg:text-[4rem]">
              Clinical AI you can{' '}
              <span className="gradient-text">verify.</span>
            </h1>

            <p className="enter-fade-up enter-d-2 mt-4 max-w-xl text-pretty text-[0.96rem] leading-relaxed text-secondary sm:mt-6 sm:text-[1.1rem]">
              Roshan AI builds clinical-grade models that surface the concepts and
              evidence behind every prediction. ShifaMind turns clinical reasoning
              into a defensible coding workflow.
            </p>

            <div className="enter-fade-up enter-d-3 mt-6 grid gap-2.5 sm:mt-8 sm:flex sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-3">
              <Link
                to="/products/shifamind"
                className="group inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-[0.92rem] font-semibold transition will-change-transform hover:-translate-y-0.5 active:scale-[0.98] sm:w-auto"
                style={{
                  background:
                    'linear-gradient(135deg, var(--accent) 0%, var(--color-iris-500) 100%)',
                  boxShadow: 'var(--shadow-glow)',
                  color: 'var(--on-accent)',
                }}
              >
                Explore ShifaMind
                <ArrowUpRight
                  size={15}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>

              <a
                href="#benchmark"
                className="group inline-flex min-h-9 w-fit items-center gap-1.5 rounded-full border border-transparent bg-transparent px-0 text-[0.8rem] font-semibold text-secondary transition hover:text-primary sm:min-h-11 sm:w-auto sm:text-[0.84rem]"
              >
                View benchmark
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </a>
            </div>

            <div
              className="enter-fade-up enter-d-4 mt-6 grid grid-cols-3 overflow-hidden rounded-2xl border border-subtle bg-glass sm:mt-8 sm:max-w-xl"
              aria-label="Roshan AI proof points"
            >
              {proofPoints.map((proof, index) => (
                <div
                  key={proof.value}
                  className={`min-w-0 px-2 py-2.5 sm:px-4 sm:py-3 ${
                    index > 0 ? 'border-l border-subtle' : ''
                  }`}
                >
                  <div className="truncate font-display text-[0.92rem] font-semibold tracking-[-0.025em] text-primary sm:text-[1.1rem]">
                    {proof.value}
                  </div>
                  <div className="mt-0.5 text-[0.54rem] font-semibold uppercase tracking-[0.08em] text-muted sm:text-[0.66rem]">
                    {proof.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="enter-fade-up enter-d-3 relative mx-auto w-full max-w-[430px] lg:max-w-none">
            <InferencePreview />
          </div>
        </div>
      </div>
    </section>
  );
}

function InferencePreview() {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-10 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklab, var(--accent) 22%, transparent), transparent 66%)',
        }}
      />

      <div className="glass relative overflow-hidden rounded-[1.5rem] p-3.5 sm:rounded-[2rem] sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-secondary">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent-soft text-accent">
              <Network size={13} strokeWidth={2} />
            </span>
            Evidence flow
          </div>
          <span className="rounded-full border border-subtle px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.13em] text-accent">
            ShifaMind
          </span>
        </div>

        <div className="mt-4 rounded-2xl border border-subtle bg-elev p-3.5 sm:mt-6 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-muted">
              Clinical note
            </div>
            <FileText size={14} className="text-muted" strokeWidth={1.8} />
          </div>
          <p className="mt-2.5 max-w-[17rem] text-[0.82rem] leading-relaxed text-secondary sm:text-[0.94rem]">
            Relevant clinical signals are surfaced, grounded in the source note,
            and carried forward as verifiable evidence.
          </p>
        </div>

        <div className="relative mx-3 h-5 sm:mx-5 sm:h-7">
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[color:var(--border-strong)]" />
          <div
            className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4 ring-[color:var(--bg-glass)]"
            style={{ background: 'var(--accent)' }}
          />
        </div>

        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
          {['Clinical concepts', 'Source evidence', 'Ranked output'].map((step, index) => (
            <div
              key={step}
              className="block min-w-0 rounded-xl border border-subtle bg-glass-strong px-2 py-2 sm:px-3 sm:py-3"
            >
              <span
                className="flex h-5 w-5 items-center justify-center rounded-full text-[0.62rem] font-bold"
                style={{
                  background: index === 2 ? 'var(--accent)' : 'var(--accent-soft)',
                  color: index === 2 ? 'var(--on-accent)' : 'var(--accent)',
                }}
              >
                {index + 1}
              </span>
              <span className="mt-1.5 block min-w-0 text-[0.58rem] font-semibold leading-tight text-secondary sm:mt-2 sm:text-[0.72rem]">
                {step}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-subtle px-3 py-2.5 sm:mt-5">
          <div className="flex items-center gap-2 text-[0.76rem] font-medium text-secondary">
            <Check size={14} className="text-accent" strokeWidth={2.4} />
            Every prediction retains its evidence trail.
          </div>
          <CompanyMark className="h-7 w-7 shrink-0 opacity-80" />
        </div>
      </div>
    </div>
  );
}

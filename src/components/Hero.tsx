import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Hero right-hand visual.
 *   'proof' renders one real note-to-code trace.
 *   'none'  drops it and the hero becomes a single centred column.
 * Change this one value to switch. Nothing else needs to move.
 */
const HERO_VISUAL: 'proof' | 'none' = 'proof';

const proofPoints = [
  { value: '0.712', label: 'Macro-F1' },
  { value: '#1', label: 'on MIMIC-IV' },
  { value: 'Evidence', label: 'on every output' },
];

export function Hero() {
  const withVisual = HERO_VISUAL === 'proof';

  return (
    <section
      id="top"
      className="relative isolate overflow-hidden pt-[5.5rem] pb-7 sm:pt-32 sm:pb-12 lg:pt-36"
    >
      <div className="pointer-events-none absolute inset-x-0 top-8 -z-[5] flex justify-center">
        <div className="aurora h-[400px] w-[1000px] max-w-full opacity-70 sm:h-[460px] sm:w-[1200px]" />
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div
          className={
            withVisual
              ? 'grid items-center gap-7 sm:gap-9 md:grid-cols-[1.05fr_0.95fr] md:gap-8 lg:gap-14'
              : ''
          }
        >
          <div className={withVisual ? 'min-w-0' : 'min-w-0 max-w-3xl'}>
            <Link
              to="/products/shifamind"
              className="enter-fade-up group inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-secondary transition hover:text-primary"
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

            <h1
              className={`enter-fade-up enter-d-1 mt-2.5 text-balance font-display font-bold leading-[1.03] tracking-[-0.045em] sm:mt-4 ${
                withVisual
                  ? 'max-w-2xl text-[2.15rem] sm:text-[3.3rem] md:text-[2.6rem] lg:text-[4rem]'
                  : 'max-w-3xl text-[2.4rem] sm:text-[3.8rem] lg:text-[4.75rem]'
              }`}
            >
              Clinical AI you can{' '}
              <span className="gradient-text">verify.</span>
            </h1>

            <p className="enter-fade-up enter-d-2 mt-4 max-w-xl text-pretty text-[0.96rem] leading-relaxed text-secondary sm:mt-6 sm:text-[1.1rem]">
              Roshan AI builds clinical-grade models that surface the concepts
              and evidence behind every prediction.
            </p>

            <div className="enter-fade-up enter-d-3 mt-6 grid gap-2.5 sm:mt-8 sm:flex sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-3">
              <Link
                to="/products/shifamind"
                className="btn-primary group inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-[0.92rem] font-semibold transition will-change-transform hover:-translate-y-0.5 active:scale-[0.98] sm:w-auto"
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

          {withVisual && (
            <div className="enter-fade-up enter-d-3 relative w-full max-w-xl md:max-w-none">
              <NoteTrace />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/**
 * One trace, start to finish: a note fragment, the span that fired, the concept
 * it grounded, and the code that came out. Synthetic text, labelled as such.
 */
function NoteTrace() {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-4 rounded-full opacity-40 blur-3xl sm:-inset-10 sm:opacity-50"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklab, var(--accent) 20%, transparent), transparent 68%)',
        }}
      />

      <div className="glass relative overflow-hidden rounded-[1.5rem] p-5 sm:rounded-[2rem] sm:p-7">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-accent">
            ShifaMind
          </span>
          <span className="text-[0.6rem] font-medium uppercase tracking-[0.12em] text-muted">
            Synthetic note
          </span>
        </div>

        <p className="mt-5 text-[0.92rem] leading-[1.75] text-secondary sm:mt-6 sm:text-[1rem]">
          Progressive dyspnea on exertion over three weeks with bilateral lower
          extremity edema. Echocardiogram demonstrates{' '}
          <mark
            className="rounded px-1 py-0.5 font-medium"
            style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
          >
            reduced ejection fraction at 30%
          </mark>
          .
        </p>

        <div className="mt-5 border-t border-subtle pt-5 sm:mt-6 sm:pt-6">
          <Row label="Concept">
            <span className="text-primary">Reduced ejection fraction</span>
            <span className="ml-2 text-[0.72rem] text-muted">affirmed</span>
          </Row>

          <Row label="Code" className="mt-3.5">
            <span className="font-mono text-primary">I50.22</span>
            <span className="mt-0.5 block text-[0.78rem] leading-snug text-secondary">
              Chronic systolic (congestive) heart failure
            </span>
          </Row>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  children,
  className = '',
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-[4.5rem_1fr] items-start gap-3 ${className}`}>
      <span className="pt-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-muted">
        {label}
      </span>
      <span className="min-w-0 text-[0.88rem] font-medium sm:text-[0.92rem]">
        {children}
      </span>
    </div>
  );
}

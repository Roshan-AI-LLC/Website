import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CompanyMark } from './CompanyMark';

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28"
    >
      <div className="pointer-events-none absolute inset-x-0 top-12 -z-[5] flex justify-center">
        <div className="aurora h-[460px] w-[1200px] max-w-full opacity-70" />
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <Link
              to="/products/shifamind"
              className="enter-fade-up group inline-flex items-center gap-2 rounded-full border border-subtle bg-glass px-3 py-1 text-[0.74rem] font-medium uppercase tracking-[0.14em] text-secondary backdrop-blur transition hover:border-strong hover:text-primary"
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
              ShifaMind is live · concept-grounded ICD-10 coding
              <ArrowRight
                size={12}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>

            <h1 className="enter-fade-up enter-d-1 mt-6 text-balance font-display text-[2.2rem] font-bold leading-[1.05] tracking-[-0.03em] sm:text-[3rem] lg:text-[3.6rem]">
              AI infrastructure for{' '}
              <span className="gradient-text">clinical reasoning.</span>
            </h1>

            <p className="enter-fade-up enter-d-2 mt-6 max-w-xl text-pretty text-[1.02rem] font-light leading-relaxed text-secondary sm:text-[1.1rem]">
              Roshan AI builds clinical-grade models that explain themselves.
              The same concepts a doctor reaches for, surfaced as verifiable
              evidence on every prediction. ShifaMind is the first product on
              the platform.
            </p>

            <div className="enter-fade-up enter-d-3 mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/products/shifamind"
                className="group inline-flex items-center gap-2 rounded-full px-5 py-3 text-[0.92rem] font-semibold transition will-change-transform hover:-translate-y-0.5"
                style={{
                  background:
                    'linear-gradient(135deg, var(--accent) 0%, var(--color-iris-500) 100%)',
                  boxShadow: 'var(--shadow-glow)',
                  color: 'var(--on-accent)',
                }}
              >
                See ShifaMind
                <ArrowUpRight
                  size={15}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>

              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-subtle bg-glass px-5 py-3 text-[0.92rem] font-medium text-secondary backdrop-blur transition hover:border-strong hover:text-primary"
              >
                Talk to us
              </Link>
            </div>
          </div>

          <div className="enter-fade-up enter-d-3 relative flex items-center justify-center">
            <div
              aria-hidden
              className="pointer-events-none absolute h-80 w-80 rounded-full"
              style={{
                background:
                  'radial-gradient(circle, color-mix(in oklab, var(--accent) 35%, transparent), transparent 70%)',
                filter: 'blur(34px)',
                opacity: 0.55,
              }}
            />
            <CompanyMark className="relative h-auto w-full max-w-[380px]" />
          </div>
        </div>
      </div>
    </section>
  );
}

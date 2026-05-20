import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

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
            <motion.a
              {...fadeUp}
              href="/products/shifamind"
              className="group inline-flex items-center gap-2 rounded-full border border-subtle bg-glass px-3 py-1 text-[0.74rem] font-medium uppercase tracking-[0.14em] text-secondary backdrop-blur transition hover:border-strong hover:text-primary"
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
              ShifaMind is live — concept-grounded ICD-10 coding
              <ArrowRight
                size={12}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </motion.a>

            <motion.h1
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.05 }}
              className="mt-6 text-balance font-display text-[2.2rem] font-bold leading-[1.05] tracking-[-0.03em] sm:text-[3rem] lg:text-[3.6rem]"
            >
              AI infrastructure for{' '}
              <span className="gradient-text">clinical reasoning.</span>
            </motion.h1>

            <motion.p
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.12 }}
              className="mt-6 max-w-xl text-pretty text-[1.02rem] font-light leading-relaxed text-secondary sm:text-[1.1rem]"
            >
              Roshan AI builds clinical-grade models that explain themselves — the
              same concepts a doctor reaches for, surfaced as verifiable evidence
              on every prediction. ShifaMind is the first product on the
              platform.
            </motion.p>

            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.18 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
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
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
            className="relative"
          >
            <PlatformStack />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function PlatformStack() {
  const layers = [
    {
      title: 'Products',
      body: 'ShifaMind · future products',
      tone: 'accent' as const,
    },
    {
      title: 'Reasoning',
      body: 'Concepts · explanations · evidence',
    },
    {
      title: 'Models',
      body: 'Clinical encoders · concept bottlenecks · decoders',
    },
    {
      title: 'Ingestion',
      body: 'Notes · structured records · imaging',
    },
  ];

  return (
    <div className="relative">
      <div className="space-y-2">
        {layers.map((l, i) => (
          <motion.div
            key={l.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.25 + i * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="glass relative overflow-hidden rounded-2xl px-5 py-4 sm:px-6"
            style={
              l.tone === 'accent'
                ? {
                    borderColor: 'color-mix(in oklab, var(--accent) 35%, transparent)',
                    background:
                      'linear-gradient(135deg, color-mix(in oklab, var(--accent) 14%, transparent), var(--bg-glass))',
                  }
                : undefined
            }
          >
            <div className="flex items-baseline justify-between gap-3">
              <div className="text-[0.92rem] font-semibold tracking-[-0.01em] text-primary">
                {l.title}
              </div>
              <div className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
                Layer 0{layers.length - i}
              </div>
            </div>
            <div className="mt-1 text-[0.84rem] font-light text-secondary">
              {l.body}
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-1"
              style={{
                background:
                  l.tone === 'accent'
                    ? 'var(--accent)'
                    : 'color-mix(in oklab, var(--accent) 30%, transparent)',
              }}
            />
          </motion.div>
        ))}
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 h-72 w-72 rounded-full"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklab, var(--accent) 35%, transparent), transparent 70%)',
          filter: 'blur(20px)',
          opacity: 0.5,
        }}
      />
    </div>
  );
}

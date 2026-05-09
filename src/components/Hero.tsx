import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden pt-32 pb-24 sm:pt-40 sm:pb-28"
    >
      {/* Aurora layer behind hero */}
      <div className="pointer-events-none absolute inset-x-0 top-12 -z-[5] flex justify-center">
        <div className="aurora h-[420px] w-[1100px] max-w-full opacity-70" />
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.a
          {...fadeUp}
          href="#shifamind"
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
          ShifaMind v2.1 is live
          <ArrowRight
            size={12}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </motion.a>

        <motion.h1
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.05 }}
          className="mt-6 max-w-4xl text-balance font-sans text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.04em] sm:text-[4rem] lg:text-[4.6rem]"
        >
          Production AI for the
          <br className="hidden sm:block" />{' '}
          <span className="gradient-text">real world.</span>
        </motion.h1>

        <motion.p
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.12 }}
          className="mt-6 max-w-xl text-pretty text-[1.02rem] font-light leading-relaxed text-secondary sm:text-[1.1rem]"
        >
          Roshan AI builds research-grade systems that ship. Our flagship product,{' '}
          <span className="text-primary">ShifaMind</span>, brings interpretable
          clinical reasoning to healthcare — accuracy that matches the state of
          the art, with explanations clinicians can verify.
        </motion.p>

        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.18 }}
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          <a
            href="https://shifamind.me"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full px-5 py-3 text-[0.92rem] font-medium text-white transition will-change-transform hover:-translate-y-0.5"
            style={{
              background:
                'linear-gradient(135deg, var(--accent) 0%, var(--color-iris-500) 100%)',
              boxShadow: 'var(--shadow-glow)',
            }}
          >
            Try ShifaMind
            <ArrowRight
              size={15}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </a>

          <a
            href="#shifamind"
            className="inline-flex items-center gap-2 rounded-full border border-subtle bg-glass px-5 py-3 text-[0.92rem] font-medium text-secondary backdrop-blur transition hover:border-strong hover:text-primary"
          >
            <Sparkles size={14} />
            See how it works
          </a>
        </motion.div>

        <HeroStats />
      </div>
    </section>
  );
}

function HeroStats() {
  const stats = [
    { v: '0.7122', k: 'Diagnostic F1', s: '50-code MIMIC-IV' },
    { v: '115K', k: 'Clinical Notes', s: 'Discharge summaries' },
    { v: '111', k: 'Clinical Concepts', s: 'Grounded explanations' },
    { v: '0.704', k: 'CSTPR Score', s: 'Concept-truth recall' },
  ];
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
      }}
      className="mt-14 grid grid-cols-2 gap-3 sm:mt-20 sm:grid-cols-4"
    >
      {stats.map((s) => (
        <motion.div
          key={s.k}
          variants={{
            hidden: { opacity: 0, y: 16 },
            show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
          }}
          className="glass relative overflow-hidden rounded-2xl p-5 transition hover:border-strong"
          data-cursor="hover"
        >
          <div className="font-mono text-[1.55rem] font-semibold tracking-tight text-accent sm:text-[1.8rem]">
            {s.v}
          </div>
          <div className="mt-1 text-[0.78rem] font-medium uppercase tracking-[0.08em] text-secondary">
            {s.k}
          </div>
          <div className="mt-0.5 text-[0.74rem] text-muted">{s.s}</div>
          <div
            className="absolute inset-0 -z-10 opacity-0 transition-opacity group-hover:opacity-100"
            style={{
              background:
                'radial-gradient(circle at 50% 0%, var(--accent-soft), transparent 70%)',
            }}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}

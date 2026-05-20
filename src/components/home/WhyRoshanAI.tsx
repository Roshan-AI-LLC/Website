import { motion } from 'framer-motion';
import { Brain, Plug, Eye, ShieldCheck } from 'lucide-react';
import type { ElementType } from 'react';

const pillars: { icon: ElementType; title: string; desc: string }[] = [
  {
    icon: Brain,
    title: 'Clinical-grade reasoning',
    desc: 'Models trained on real clinical data and structured against the concepts a doctor uses. Not a general-purpose LLM stretched into healthcare.',
  },
  {
    icon: Plug,
    title: 'Built for integration',
    desc: 'API-first from day one. Drop predictions, evidence, and concepts into existing workflows (EHR, coding tools, dashboards) without custom integration work.',
  },
  {
    icon: Eye,
    title: 'Evidence on every prediction',
    desc: 'Each output carries the activated clinical concepts and the verbatim phrases in the note that produced it. Every prediction is defensible.',
  },
  {
    icon: ShieldCheck,
    title: 'Compliance posture',
    desc: 'HIPAA-ready deployments, encryption everywhere, audit trails on every inference, and a strict no-training-on-customer-data default.',
  },
];

export function WhyRoshanAI() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-subtle bg-accent-soft px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
          Why Roshan AI
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-3 max-w-3xl text-balance font-display text-[1.8rem] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[2.4rem]"
        >
          Clinical AI that{' '}
          <span className="gradient-text">earns the trust to be deployed.</span>
        </motion.h2>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.55,
                delay: i * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="glass relative overflow-hidden rounded-3xl p-6 sm:p-7"
            >
              <div
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl"
                style={{
                  background: 'var(--accent-soft)',
                  color: 'var(--accent)',
                }}
              >
                <p.icon size={20} strokeWidth={1.7} />
              </div>
              <h3 className="mt-5 text-[1.15rem] font-semibold tracking-[-0.015em]">
                {p.title}
              </h3>
              <p className="mt-2 text-[0.92rem] font-light leading-relaxed text-secondary">
                {p.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

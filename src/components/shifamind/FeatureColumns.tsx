import { motion } from 'framer-motion';
import { Brain, MessageSquare, Target } from 'lucide-react';
import type { ElementType } from 'react';

const features: { icon: ElementType; title: string; desc: string }[] = [
  {
    icon: Target,
    title: 'Predict',
    desc: 'Ranked ICD-10 codes from free-text discharge summaries. Each code carries a confidence and a list of alternatives the model considered.',
  },
  {
    icon: Brain,
    title: 'Explain',
    desc: 'Concept activation shows why each code was assigned: the same clinical concepts a coder would reach for, surfaced as verifiable evidence.',
  },
  {
    icon: MessageSquare,
    title: 'Discuss',
    desc: 'Grounded chat lets clinicians and coders interrogate any prediction in context of the note. No off-topic generation, no hallucinated concepts.',
  },
];

export function FeatureColumns() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionEyebrow>What ShifaMind does</SectionEyebrow>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-3 max-w-3xl text-balance font-display text-[1.8rem] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[2.4rem]"
        >
          Three primitives, designed to be{' '}
          <span className="gradient-text">defended.</span>
        </motion.h2>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.55,
                delay: i * 0.08,
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
                <f.icon size={20} strokeWidth={1.7} />
              </div>
              <h3 className="mt-5 text-[1.2rem] font-semibold tracking-[-0.015em]">
                {f.title}
              </h3>
              <p className="mt-2 text-[0.92rem] font-light leading-relaxed text-secondary">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-subtle bg-accent-soft px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent">
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </div>
  );
}

import { motion } from 'framer-motion';
import { Brain, MessageSquare, Target } from 'lucide-react';
import type { ElementType } from 'react';
import { SectionLabel } from '../SectionLabel';

const features: { icon: ElementType; title: string; desc: string }[] = [
  {
    icon: Target,
    title: 'Predict',
    desc: 'Ranked ICD-10 codes with confidence.',
  },
  {
    icon: Brain,
    title: 'Explain',
    desc: 'The concepts behind every code.',
  },
  {
    icon: MessageSquare,
    title: 'Discuss',
    desc: 'Ask follow-ups, answered from the note.',
  },
];

export function FeatureColumns() {
  return (
    <section className="mobile-native-section relative py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <div>
            <SectionEyebrow>What ShifaMind does</SectionEyebrow>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-3 max-w-2xl text-balance font-display text-[1.4rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[2.25rem]"
            >
              Three primitives, designed to be{' '}
              <span className="gradient-text">defended.</span>
            </motion.h2>
          </div>
        </div>

        {/* Phones: one divided list instead of a swipe rail, so all three read
            at a glance; step numbers return at sm and the columns at md. */}
        <div className="glass mt-4 overflow-hidden rounded-2xl sm:mt-9 sm:rounded-3xl">
          <div className="grid divide-y divide-[color:var(--border-subtle)] md:grid-cols-3 md:divide-x md:divide-y-0">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.45, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  className="flex gap-3 px-4 py-2.5 sm:px-5 sm:py-5 md:block"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent sm:h-9 sm:w-9">
                    <Icon size={17} strokeWidth={1.8} />
                  </span>
                  <div className="min-w-0 md:mt-4">
                    <div className="flex items-center gap-2">
                      <span className="hidden font-mono text-[0.62rem] font-semibold tracking-[0.12em] text-muted sm:inline">0{index + 1}</span>
                      <h3 className="text-[0.92rem] font-semibold leading-snug tracking-[-0.01em] sm:text-[0.98rem] sm:leading-[inherit]">{feature.title}</h3>
                    </div>
                    <p className="mt-0.5 text-[0.8rem] leading-snug text-secondary sm:mt-1 sm:text-[0.84rem] sm:leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <SectionLabel>{children}</SectionLabel>
  );
}

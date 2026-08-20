import { motion } from 'framer-motion';
import { Clock, Network, Radio } from 'lucide-react';
import type { ElementType } from 'react';

const features: { icon: ElementType; title: string; desc: string }[] = [
  {
    icon: Network,
    title: 'Graph view',
    desc: 'Patient-specific concepts, persistence tiers, and measured edge types in one view.',
  },
  {
    icon: Radio,
    title: 'Signal evidence',
    desc: 'Open the exact waveform windows that activated any concept node.',
  },
  {
    icon: Clock,
    title: 'Patient timeline',
    desc: 'Trace concept density across the ICU stay and jump to a moment in time.',
  },
];

export function FeatureColumns() {
  return (
    <section className="mobile-native-section relative py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-subtle bg-accent-soft px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-accent">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
              The dashboard
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-3 max-w-3xl text-balance font-display text-[1.65rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[2.25rem]"
            >
              Three panels, one{' '}
              <span className="gradient-text">reasoning chain.</span>
            </motion.h2>
          </div>
          <p className="max-w-sm text-[0.84rem] leading-relaxed text-secondary sm:text-right sm:text-[0.9rem]">
            Move from clinical structure to the source signals that substantiate it.
          </p>
        </div>

        <div className="glass mt-7 overflow-hidden rounded-2xl sm:mt-9 sm:rounded-3xl">
          <div className="mobile-snap-rail grid divide-y divide-[color:var(--border-subtle)] md:grid-cols-3 md:divide-x md:divide-y-0">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.45, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  className="flex gap-3 px-4 py-4 sm:px-5 sm:py-5 md:block"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                    <Icon size={17} strokeWidth={1.8} />
                  </span>
                  <div className="min-w-0 md:mt-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[0.62rem] font-semibold tracking-[0.12em] text-muted">0{index + 1}</span>
                      <h3 className="text-[0.98rem] font-semibold tracking-[-0.01em]">{feature.title}</h3>
                    </div>
                    <p className="mt-1 text-[0.8rem] leading-relaxed text-secondary sm:text-[0.84rem]">{feature.desc}</p>
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

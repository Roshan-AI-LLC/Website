import { motion } from 'framer-motion';
import { Clock, FileSearch, Network } from 'lucide-react';
import type { ElementType } from 'react';
import { SectionLabel } from '../SectionLabel';

const features: { icon: ElementType; title: string; desc: string }[] = [
  {
    icon: Network,
    title: 'Graph view',
    desc: 'Concept, action and beat nodes, joined by typed relations.',
  },
  {
    icon: FileSearch,
    title: 'Evidence',
    desc: 'Open the episodes, actions or beats behind any edge.',
  },
  {
    icon: Clock,
    title: 'Patient timeline',
    desc: 'Concept episodes and clinician actions across the case.',
  },
];

export function FeatureColumns() {
  return (
    <section className="mobile-native-section relative py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div>
            <SectionLabel>The dashboard</SectionLabel>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-2 max-w-3xl text-balance font-display text-[1.5rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:mt-3 sm:text-[2.25rem]"
            >
              Three panels, one{' '}
              <span className="gradient-text">reasoning chain.</span>
            </motion.h2>
          </div>
          {/* Phones: hidden, the rows carry the section (as in EdgeTypes and
              Metrics); the line returns at sm. */}
          <p className="hidden max-w-sm text-[0.84rem] leading-relaxed text-secondary sm:block sm:text-right sm:text-[0.9rem]">
            From the graph down to the events behind each edge.
          </p>
        </div>

        {/* Phones: one card of divided rows (icon tile, title, line); step
            numbers hidden. BreadthGrid keeps this page's one swipe rail. */}
        <div className="glass mt-4 overflow-hidden rounded-2xl sm:mt-9 sm:rounded-3xl">
          <div className="grid divide-y divide-[color:var(--border-subtle)] md:grid-cols-3 md:divide-x md:divide-y-0">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 10 }}
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
                      <h3 className="text-[0.92rem] font-semibold tracking-[-0.01em] sm:text-[0.98rem]">{feature.title}</h3>
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

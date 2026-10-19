import { motion } from 'framer-motion';
import { SectionLabel } from '../SectionLabel';
import { INTERPRETABILITY, TASK, pct } from '../../data/shifamindPaper';

/**
 * Interpretability at a glance. The first three tiles hold by construction;
 * the rest are measured on the coder itself. Every figure comes from
 * src/data/shifamindPaper.ts.
 */
const stats: { value: string; label: string; note?: string }[] = [
  { value: '100%', label: 'Logit attributable', note: 'By construction' },
  { value: '0', label: 'Unexplained remainder', note: 'Exact decomposition' },
  { value: TASK.concepts.toLocaleString('en-US'), label: 'Clinical concepts' },
  { value: pct(INTERPRETABILITY.conceptAuroc, 3), label: 'Concept AUROC' },
  {
    value: pct(INTERPRETABILITY.sufficiency.model, 2),
    label: 'Sufficiency',
    note: `vs ${pct(INTERPRETABILITY.sufficiency.random, 2)} random`,
  },
  {
    value: pct(INTERPRETABILITY.meanGate.negated, 3),
    label: 'Negation gate',
    note: `${pct(INTERPRETABILITY.meanGate.affirmed, 3)} when affirmed`,
  },
  {
    value: pct(INTERPRETABILITY.intervention.ownGates - INTERPRETABILITY.intervention.assertionLabels),
    label: 'F1 lost to overrides',
    note: 'Gates set by a coder',
  },
  { value: `${INTERPRETABILITY.seedStability}%`, label: 'Seed stability' },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export function InterpretabilityMetrics() {
  return (
    <section className="mobile-native-section relative py-14 sm:py-20">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <SectionLabel>Interpretability</SectionLabel>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mt-3 max-w-2xl text-balance font-display text-[1.4rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[2.25rem]"
        >
          Every code, <span className="gradient-text">fully explained.</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: EASE }}
          className="glass mt-4 overflow-hidden rounded-2xl sm:mt-9 sm:rounded-3xl"
        >
          {/* A 1px gap over the border colour draws the cell lines. Phones get
              tighter cells and smaller figures so all eight sit in four short
              rows (px-3 also keeps most labels on one line at 390px). */}
          <div className="grid grid-cols-2 gap-px bg-[color:var(--border-subtle)] lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="min-w-0 bg-glass px-3 py-2.5 sm:px-5 sm:py-6">
                <div className="font-display text-[1.25rem] font-semibold leading-none tracking-[-0.03em] text-primary sm:text-[2rem]">
                  {stat.value}
                </div>
                <div className="mt-1 text-[0.64rem] font-semibold uppercase leading-snug tracking-[0.12em] text-accent sm:mt-2 sm:leading-[inherit]">
                  {stat.label}
                </div>
                {stat.note && (
                  <div className="mt-0.5 text-[0.72rem] leading-snug text-muted sm:mt-1 sm:leading-[inherit]">{stat.note}</div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

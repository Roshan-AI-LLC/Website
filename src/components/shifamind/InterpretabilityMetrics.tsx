import { motion } from 'framer-motion';

const metrics = [
  {
    code: 'CSTPR',
    value: '0.704',
    name: 'Concept-supported true positives',
    desc: 'Correct diagnoses that also carry relevant activated concept evidence.',
  },
  {
    code: 'CIM',
    value: '1.314',
    name: 'Concept influence magnitude',
    desc: 'How much the concept-grounded representation contributes at the prediction boundary.',
  },
  {
    code: 'CCR',
    value: '0.836',
    name: 'Concept-conditioned recall',
    desc: 'Recall when the relevant clinical concept is present in the case.',
  },
];

export function InterpretabilityMetrics() {
  return (
    <section className="relative py-14 sm:py-20">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end sm:gap-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-subtle bg-accent-soft px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-accent">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
              Interpretability
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-3 max-w-2xl text-balance font-display text-[1.65rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[2.25rem]"
            >
              Metrics general LLMs{' '}
              <span className="gradient-text">cannot produce.</span>
            </motion.h2>
          </div>
          <p className="max-w-sm text-[0.84rem] leading-relaxed text-secondary sm:text-right sm:text-[0.9rem]">
            The concept layer is evaluated alongside the final code, not inferred afterward.
          </p>
        </div>

        <div className="glass mt-7 overflow-hidden rounded-2xl sm:mt-9 sm:rounded-3xl">
          <div className="hidden grid-cols-[76px_96px_1fr] gap-4 border-b border-subtle px-5 py-3 text-[0.62rem] font-semibold uppercase tracking-[0.13em] text-muted sm:grid">
            <span>Metric</span>
            <span>Score</span>
            <span>What it measures</span>
          </div>
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.code}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-2 border-b border-subtle px-4 py-4 last:border-b-0 sm:grid-cols-[76px_96px_1fr] sm:items-start sm:gap-4 sm:px-5"
            >
              <div className="font-mono text-[0.74rem] font-semibold uppercase tracking-[0.14em] text-accent">
                {metric.code}
              </div>
              <div className="font-mono text-[1.2rem] font-semibold tracking-tight text-primary sm:text-[1.35rem]">
                {metric.value}
              </div>
              <div className="sm:pt-0.5">
                <div className="text-[0.88rem] font-semibold text-primary">{metric.name}</div>
                <p className="mt-1 text-[0.78rem] leading-relaxed text-secondary sm:text-[0.84rem]">
                  {metric.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

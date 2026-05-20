import { motion } from 'framer-motion';

const metrics = [
  {
    code: 'CSTPR',
    value: '0.704',
    name: 'Concept-truth precision and recall',
    desc: 'Of every concept the model activated, how often it was correct, and of every truly-present concept, how often the model caught it.',
  },
  {
    code: 'CIM',
    value: '1.314',
    name: 'Concept influence metric',
    desc: 'Causal strength of each concept on the predicted code. The bigger the number, the more the concept actually moves the prediction.',
  },
  {
    code: 'CCR',
    value: '0.836',
    name: 'Concept-conditioned recall',
    desc: 'Diagnosis recall when the right concepts are activated. Tests whether the bottleneck actually carries the signal a code needs.',
  },
];

export function InterpretabilityMetrics() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="grid items-end gap-6 lg:grid-cols-[1fr_auto] lg:gap-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-subtle bg-accent-soft px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
              Interpretability
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-3 max-w-2xl text-balance font-display text-[1.8rem] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[2.4rem]"
            >
              Metrics general LLMs can't produce.
            </motion.h2>
          </div>
          <p className="max-w-sm text-[0.94rem] font-light leading-relaxed text-secondary lg:text-right">
            ShifaMind exposes the concept layer to evaluation, not just the
            final code. Three metrics quantify how honest the explanations are.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {metrics.map((m, i) => (
            <motion.div
              key={m.code}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.55,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="glass rounded-3xl p-6"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-accent">
                  {m.code}
                </span>
                <span className="font-mono text-[1.8rem] font-semibold tracking-tight text-accent sm:text-[2rem]">
                  {m.value}
                </span>
              </div>
              <h3 className="mt-4 text-[1rem] font-semibold tracking-[-0.01em]">
                {m.name}
              </h3>
              <p className="mt-2 text-[0.88rem] font-light leading-relaxed text-secondary">
                {m.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

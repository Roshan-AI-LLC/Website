import { motion } from 'framer-motion';
import { BenchmarkChart } from '../BenchmarkChart';

export function Proof() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="grid items-end gap-6 lg:grid-cols-[1fr_auto] lg:gap-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-subtle bg-accent-soft px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
              Benchmarks
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-3 max-w-2xl text-balance font-display text-[1.8rem] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[2.4rem]"
            >
              Better than the LLMs.{' '}
              <span className="gradient-text">
                Equal to the best clinical specialist.
              </span>
            </motion.h2>
          </div>
          <p className="max-w-sm text-[0.94rem] font-light leading-relaxed text-secondary lg:text-right">
            Same evaluation, same test set, same metric. ShifaMind on top,
            because clinical-grade reasoning isn't a prompt. It's an
            architecture.
          </p>
        </div>

        <div className="mt-10">
          <BenchmarkChart />
        </div>
      </div>
    </section>
  );
}

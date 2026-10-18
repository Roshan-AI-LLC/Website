import { motion } from 'framer-motion';
import { FIX } from '../../../data/homeCopy';
import { EASE } from './ui';

/**
 * Below md: the steps as compact rows in one card (number, title, line,
 * stat). No visuals and no pinning, so the section stays one short scroll.
 */
export function PhoneSteps() {
  return (
    <motion.ol
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, ease: EASE }}
      className="glass mt-6 overflow-hidden rounded-2xl sm:mt-10"
    >
      {FIX.steps.map((step, i) => (
        <li key={step.key} className={`flex gap-3 px-4 py-3 ${i ? 'border-t border-subtle' : ''}`}>
          <span className="w-5 shrink-0 pt-[3px] font-mono text-[0.68rem] font-semibold text-accent">
            {String(i + 1).padStart(2, '0')}
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-[0.98rem] font-semibold leading-snug tracking-[-0.015em] text-primary">
              {step.title}
            </h3>
            <p className="mt-1 text-pretty text-[0.82rem] leading-[1.45] text-secondary">{step.line}</p>
            <p className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="font-display text-[0.98rem] font-semibold leading-none tracking-[-0.02em] text-accent">
                {step.statValue}
              </span>
              <span className="text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-muted">
                {step.statLabel}
              </span>
            </p>
          </div>
        </li>
      ))}
    </motion.ol>
  );
}

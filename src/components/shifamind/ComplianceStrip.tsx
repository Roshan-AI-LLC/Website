import { motion } from 'framer-motion';
import { Eye, FileLock, Lock, ShieldCheck } from 'lucide-react';
import type { ElementType } from 'react';
import { SectionLabel } from '../SectionLabel';

const items: { icon: ElementType; title: string; detail: string }[] = [
  { icon: ShieldCheck, title: 'HIPAA-ready', detail: 'BAA-eligible deployments' },
  { icon: Lock, title: 'Encrypted', detail: 'TLS 1.3 · AES-256' },
  { icon: Eye, title: 'Auditable', detail: 'Concepts and evidence logged' },
  { icon: FileLock, title: 'Your data stays yours', detail: 'No training without opt-in' },
];

export function ComplianceStrip() {
  return (
    <section className="mobile-native-section relative py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div>
            <SectionLabel>Security & compliance</SectionLabel>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-3 max-w-2xl text-balance font-display text-[1.5rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[2rem]"
            >
              Clinical AI you can deploy{' '}
              <span className="gradient-text">with confidence.</span>
            </motion.h2>
          </div>
          {/* Phones: the heading carries the section; this side line returns at sm. */}
          <p className="hidden max-w-sm text-[0.84rem] leading-relaxed text-secondary sm:block sm:text-right sm:text-[0.9rem]">
            Enterprise safeguards designed for sensitive clinical workflows.
          </p>
        </div>

        {/* Phones: a 2x2 grid of peer tiles (lines drawn by a 1px gap over the
            border colour) instead of a swipe rail; sm restores the divided row. */}
        <div className="glass mt-5 overflow-hidden rounded-2xl sm:mt-9 sm:rounded-3xl">
          <div className="grid grid-cols-2 gap-px divide-[color:var(--border-subtle)] bg-[color:var(--border-subtle)] sm:grid-cols-2 sm:gap-0 sm:divide-x sm:divide-y-0 sm:bg-transparent lg:grid-cols-4">
            {items.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.42, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-start gap-2.5 bg-[color:var(--bg-glass)] px-3.5 py-3 sm:block sm:bg-transparent sm:px-5 sm:py-5"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent sm:h-8 sm:w-8 sm:rounded-xl">
                    <Icon size={15} strokeWidth={1.9} />
                  </span>
                  <div className="min-w-0 sm:mt-3">
                    <div className="text-[0.86rem] font-semibold text-primary">{item.title}</div>
                    <div className="mt-0.5 text-[0.72rem] leading-snug text-secondary sm:leading-relaxed">{item.detail}</div>
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

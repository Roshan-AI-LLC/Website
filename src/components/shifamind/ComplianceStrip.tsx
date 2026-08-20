import { motion } from 'framer-motion';
import { Eye, FileLock, Lock, ShieldCheck } from 'lucide-react';
import type { ElementType } from 'react';

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
            <div className="inline-flex items-center gap-2 rounded-full border border-subtle bg-accent-soft px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-accent">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
              Security & compliance
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-3 max-w-2xl text-balance font-display text-[1.55rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[2rem]"
            >
              Clinical AI you can deploy{' '}
              <span className="gradient-text">with confidence.</span>
            </motion.h2>
          </div>
          <p className="max-w-sm text-[0.84rem] leading-relaxed text-secondary sm:text-right sm:text-[0.9rem]">
            Enterprise safeguards designed for sensitive clinical workflows.
          </p>
        </div>

        <div className="glass mt-7 overflow-hidden rounded-2xl sm:mt-9 sm:rounded-3xl">
          <div className="mobile-snap-rail grid divide-y divide-[color:var(--border-subtle)] sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
            {items.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.42, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center gap-3 px-4 py-4 sm:block sm:px-5 sm:py-5"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                    <Icon size={15} strokeWidth={1.9} />
                  </span>
                  <div className="min-w-0 sm:mt-3">
                    <div className="text-[0.86rem] font-semibold text-primary">{item.title}</div>
                    <div className="mt-0.5 text-[0.72rem] leading-relaxed text-secondary">{item.detail}</div>
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

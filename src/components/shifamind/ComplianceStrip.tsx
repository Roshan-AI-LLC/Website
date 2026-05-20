import { motion } from 'framer-motion';
import { Lock, ShieldCheck, FileLock, Eye } from 'lucide-react';
import type { ElementType } from 'react';

const items: { icon: ElementType; title: string; desc: string }[] = [
  {
    icon: ShieldCheck,
    title: 'HIPAA-ready',
    desc: 'BAA-eligible deployments. PHI never leaves the customer perimeter without explicit consent.',
  },
  {
    icon: Lock,
    title: 'Encryption everywhere',
    desc: 'TLS 1.3 in transit. AES-256 at rest. Customer-managed keys available on enterprise plans.',
  },
  {
    icon: Eye,
    title: 'Auditable by design',
    desc: 'Every prediction logs its activated concepts and evidence. No opaque inference.',
  },
  {
    icon: FileLock,
    title: 'No training on customer data',
    desc: 'Customer notes are never used to train base models. Opt-in only, contract-bound.',
  },
];

export function ComplianceStrip() {
  return (
    <section className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-subtle bg-accent-soft px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
          Security & compliance
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-3 max-w-2xl text-balance font-display text-[1.6rem] font-semibold leading-[1.1] tracking-[-0.02em] sm:text-[2rem]"
        >
          Clinical AI you can deploy without holding your breath.
        </motion.h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.5,
                delay: i * 0.07,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="glass rounded-2xl p-5"
            >
              <div
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl"
                style={{
                  background: 'var(--accent-soft)',
                  color: 'var(--accent)',
                }}
              >
                <it.icon size={16} strokeWidth={1.8} />
              </div>
              <h3 className="mt-4 text-[1rem] font-semibold tracking-[-0.01em]">
                {it.title}
              </h3>
              <p className="mt-1.5 text-[0.86rem] font-light leading-relaxed text-secondary">
                {it.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

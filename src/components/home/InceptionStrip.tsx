import { motion } from 'framer-motion';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import { InceptionBadge, NvidiaLegalLine } from '../InceptionBadge';

const proofItems = [
  { value: '0.712', label: 'Macro-F1' },
  { value: '#1', label: 'automated coding' },
  { value: 'Evidence-first', label: 'by design' },
];

export function InceptionStrip() {
  return (
    <section className="relative pb-10 pt-1 sm:pb-14 sm:pt-2">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="glass overflow-hidden rounded-2xl"
        >
          <div className="grid divide-y divide-[color:var(--border-subtle)] sm:grid-cols-[1.1fr_0.9fr] sm:divide-x sm:divide-y-0">
            <div className="p-4 sm:p-5">
              <div className="flex items-center gap-2 text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-secondary">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent-soft text-accent">
                  <ShieldCheck size={14} strokeWidth={2} />
                </span>
                Verified performance
              </div>
              <div className="mt-4 grid grid-cols-3 divide-x divide-[color:var(--border-subtle)]">
                {proofItems.map((item) => (
                  <div key={item.value} className="min-w-0 px-2 first:pl-0 last:pr-0 sm:px-3">
                    <div className="truncate font-display text-[1rem] font-semibold tracking-[-0.025em] text-primary sm:text-[1.15rem]">
                      {item.value}
                    </div>
                    <div className="mt-0.5 text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-muted sm:text-[0.62rem]">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
              <a
                href="#benchmark"
                className="mt-4 inline-flex items-center gap-1 text-[0.78rem] font-semibold text-accent transition hover:text-primary"
              >
                See the benchmark
                <ArrowUpRight size={13} />
              </a>
            </div>

            <div className="flex items-center gap-3 p-4 sm:p-5">
              <InceptionBadge width={110} className="shrink-0" />
              <div className="min-w-0">
                <div className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-secondary">
                  NVIDIA Inception
                </div>
                <p className="mt-1 text-[0.78rem] leading-relaxed text-secondary sm:text-[0.82rem]">
                  A member of NVIDIA&apos;s startup program as Roshan AI scales
                  clinical-grade infrastructure.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <NvidiaLegalLine className="mt-2 text-pretty text-[0.6rem] leading-relaxed text-muted opacity-60" />
      </div>
    </section>
  );
}

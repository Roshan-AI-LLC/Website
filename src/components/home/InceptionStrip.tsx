import { motion } from 'framer-motion';
import { InceptionBadge } from '../InceptionBadge';

export function InceptionStrip() {
  return (
    <section className="relative pt-2 pb-12 sm:pt-4 sm:pb-14">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="glass flex flex-col items-start gap-5 rounded-2xl p-5 sm:flex-row sm:items-center sm:gap-7 sm:p-6"
        >
          <InceptionBadge width={160} className="shrink-0" />

          <div className="min-w-0">
            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-secondary">
              Program membership
            </div>
            <p className="mt-2 text-pretty text-[0.92rem] font-light leading-relaxed text-secondary">
              Roshan AI is a member of the NVIDIA Inception program. It gives our
              clinical models access to NVIDIA's accelerated computing stack,
              engineering resources, and go-to-market network as we scale.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

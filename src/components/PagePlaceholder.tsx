import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  status?: string;
};

export function PagePlaceholder({
  eyebrow = 'Roshan AI',
  title,
  description,
  status = 'In progress',
}: Props) {
  return (
    <section className="relative isolate overflow-hidden pt-40 pb-24 sm:pt-48 sm:pb-32">
      <div className="pointer-events-none absolute inset-x-0 top-12 -z-[5] flex justify-center">
        <div className="aurora h-[420px] w-[1100px] max-w-full opacity-40" />
      </div>

      <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-subtle bg-accent-soft px-3 py-1 text-[0.74rem] font-semibold uppercase tracking-[0.14em] text-accent">
            <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-current" />
            {status}
          </div>

          <p className="mt-6 text-[0.78rem] font-medium uppercase tracking-[0.16em] text-secondary">
            {eyebrow}
          </p>

          <h1 className="mt-3 text-balance font-display text-[2.2rem] font-semibold leading-[1.05] tracking-[-0.025em] sm:text-[3rem]">
            {title}
          </h1>

          {description && (
            <p className="mx-auto mt-5 max-w-xl text-[1rem] font-light leading-relaxed text-secondary">
              {description}
            </p>
          )}

          <Link
            to="/"
            className="mt-10 inline-flex items-center gap-1.5 rounded-full border border-subtle bg-glass px-5 py-2.5 text-[0.88rem] font-medium text-secondary backdrop-blur transition hover:border-strong hover:text-primary"
          >
            <ArrowLeft size={14} />
            Back to home
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

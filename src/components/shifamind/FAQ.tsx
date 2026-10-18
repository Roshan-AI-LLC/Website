import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { SectionLabel } from '../SectionLabel';
import { SHIFAMIND, TASK, pct } from '../../data/shifamindPaper';

const items: { q: string; a: string }[] = [
  {
    q: 'How is ShifaMind different from a general-purpose LLM?',
    a: 'An LLM explains itself after the fact. ShifaMind can only reach a code through named clinical concepts, so the explanation is the computation.',
  },
  {
    q: 'Does ShifaMind replace coders?',
    a: 'No. It proposes codes with evidence; your coders accept, edit or reject.',
  },
  {
    q: 'What models power it?',
    a: `A ${TASK.encoder} encoder reading up to ${TASK.contextTokens.toLocaleString('en-US')} tokens, feeding a concept layer of ${TASK.concepts.toLocaleString('en-US')} clinical concepts.`,
  },
  {
    q: 'How do you handle PHI?',
    a: 'BAA-eligible deployments keep PHI inside your perimeter, with encryption, audit logs, and no training on your data without your opt-in.',
  },
  {
    q: 'Can I try it on my own notes?',
    a: 'Access is by request. Email us and we will set you up. API access is by request too.',
  },
  {
    q: 'How accurate is it?',
    a: `Across all ${TASK.codes.toLocaleString('en-US')} ICD-10 codes on MIMIC-IV: ${pct(SHIFAMIND.aucMicro)} micro-AUROC, ${pct(SHIFAMIND.aucMacro)} macro-AUROC, ${pct(SHIFAMIND.f1Micro)} micro-F1.`,
  },
];

export function FAQ() {
  return (
    <section className="mobile-native-section relative py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <SectionLabel>FAQ</SectionLabel>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-3 font-display text-[1.5rem] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[2.4rem]"
        >
          Questions we get a lot.
        </motion.h2>

        <div className="mt-5 divide-y divide-[color:var(--border-subtle)] border-y border-subtle sm:mt-10">
          {items.map((it, i) => (
            <FAQItem key={i} q={it.q} a={it.a} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        // Phones: shorter rows (still 48px+ tall) so all six questions fit on
        // about one screen; sm restores the roomier desktop rhythm.
        className="flex w-full items-start justify-between gap-4 py-3 text-left transition hover:opacity-90 sm:py-5"
        aria-expanded={open}
      >
        <span className="text-[0.94rem] font-medium leading-snug text-primary sm:text-[1rem]">
          {q}
        </span>
        <span
          className={`mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-subtle text-secondary transition sm:h-7 sm:w-7 ${
            open ? 'rotate-45 border-strong text-accent' : ''
          }`}
        >
          <Plus size={14} />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-4 pr-8 text-[0.88rem] font-light leading-relaxed text-secondary sm:pb-5 sm:pr-10 sm:text-[0.94rem]">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { NABZGRAPH } from '../../data/nabzPapers';
import { SectionLabel } from '../SectionLabel';

const { data } = NABZGRAPH;

// Two short sentences at most per answer.
const items: { q: string; a: string }[] = [
  {
    q: 'How is NabzGraph different from a monitoring alarm?',
    a: 'An alarm flags one threshold on one channel. NabzGraph builds a patient graph of concepts, clinician actions and typed relations, each tied to its evidence.',
  },
  {
    q: 'Why typed relations?',
    a: 'Clinicians adjust drugs and ventilation in response to the vitals, so plain correlation mixes a drug\u2019s effect with the clinician\u2019s decision. Typing every relation keeps the two apart.',
  },
  {
    q: 'How do you keep false relations out?',
    a: 'Each relation is pooled across patients and kept only if it beats negative controls. Beat-level couplings are tested per patient, against surrogate signals.',
  },
  {
    q: 'Is it a diagnosis system?',
    a: 'No. Concepts are signal findings such as low blood pressure, and the graphs are research artifacts, not validated for clinical use.',
  },
  {
    q: 'What data is it built on?',
    a: `${data.surgicalCases.toLocaleString('en-US')} VitalDB surgical cases with drug and ventilator actions, and ${data.icuRecords} MIMIC-IV ICU records. ICU graphs carry associations only, since those records have no action streams.`,
  },
  {
    q: 'Is it real-time?',
    a: 'Not yet. It works on recorded cases today; real-time streaming is on the roadmap.',
  },
];

export function FAQ() {
  return (
    <section className="relative py-10 sm:py-28">
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
        className="flex w-full items-start justify-between gap-4 py-3.5 text-left transition hover:opacity-90 sm:py-5"
        aria-expanded={open}
      >
        <span className="text-[0.92rem] font-medium leading-snug text-primary sm:text-[1rem]">{q}</span>
        <span
          className={`mt-0.5 inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-subtle text-secondary transition ${
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
            <p className="pb-4 pr-2 text-[0.86rem] font-light leading-relaxed text-secondary sm:pb-5 sm:pr-10 sm:text-[0.94rem]">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

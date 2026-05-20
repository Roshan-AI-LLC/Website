import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';

const items: { q: string; a: string }[] = [
  {
    q: 'How is ShifaMind different from a general-purpose LLM?',
    a: 'General LLMs generate codes from a single forward pass over the note. ShifaMind uses a concept-bottleneck model: the network must first activate human-readable clinical concepts (edema, BNP elevation, ST depression) before it can produce a code. That bottleneck makes every prediction explainable by construction, not by post-hoc rationalization.',
  },
  {
    q: 'Does ShifaMind replace coders?',
    a: 'No. ShifaMind is built for clinician- and coder-in-the-loop workflows. The model proposes ranked codes with grounded evidence; the human accepts, edits, or rejects. The fastest path to ROI is reducing the time coders spend on the unambiguous codes so they can focus on the hard ones.',
  },
  {
    q: 'What models power it?',
    a: 'Phase 1 uses BioClinicalBERT as the encoder, paired with a learned concept layer (111 grounded clinical concepts) and a code prediction head. Concepts are supervised against MIMIC-IV discharge summaries. We are evaluating larger backbone models for Phase 2.',
  },
  {
    q: 'How do you handle PHI?',
    a: 'BAA-eligible deployments keep PHI inside the customer perimeter. We support customer-managed encryption keys, audit logging on every prediction, and a strict no-training-on-customer-data default. Opt-in research data sharing exists for partners who want it; it is contract-bound and never the default.',
  },
  {
    q: 'Can I try it on my own notes?',
    a: 'Yes. The ShifaMind platform accepts pasted notes today for clinicians and researchers evaluating the system. API access for production integration is gated; reach out via the contact form to start that conversation.',
  },
  {
    q: 'What benchmark do you report on?',
    a: 'Our headline number is F1 = 0.71 on the 50-code MIMIC-IV held-out set, which matches the standard interpretable-ICD-coding benchmark. We also report a Concept-Truth Precision-Recall (CSTPR) score that measures whether the model activates the right concepts for the right reasons, a metric general LLMs cannot produce.',
  },
];

export function FAQ() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-subtle bg-accent-soft px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
          FAQ
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-3 font-display text-[1.8rem] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[2.4rem]"
        >
          Questions we get a lot.
        </motion.h2>

        <div className="mt-10 divide-y divide-[color:var(--border-subtle)] border-y border-subtle">
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
        className="flex w-full items-start justify-between gap-4 py-5 text-left transition hover:opacity-90"
        aria-expanded={open}
      >
        <span className="text-[1rem] font-medium leading-snug text-primary">
          {q}
        </span>
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
            <p className="pb-5 pr-10 text-[0.94rem] font-light leading-relaxed text-secondary">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

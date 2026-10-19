import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Plus } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Head } from 'vite-react-ssg';
import { FAQ, FAQ_HEAD } from '../../data/homeCopy';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { CONTACT_EMAIL } from '../../lib/config';
import { SectionHead } from './SectionHead';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * FAQPage structured data, built from the same copy the accordion shows so the
 * two can never drift. `<` is escaped so no answer can close the script tag.
 */
const FAQ_JSON_LD = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}).replace(/</g, '\\u003c');

/**
 * Home FAQ. Desktop: the header (and a contact link) stays pinned on the left
 * while the questions scroll on the right. Phones and tablets: one column with
 * the contact link sharing the header row, and compact 48px rows.
 *
 * All answers start closed and one opens at a time, so the list stays short
 * on a phone.
 * Visual language matches the ShifaMind page FAQ: hairlines, a ringed plus
 * that turns into an x.
 */
export function HomeFAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const reduced = useReducedMotion();

  return (
    <section id="faq" className="mobile-native-section relative scroll-mt-24 py-16 sm:py-28">
      <Head>
        <script type="application/ld+json">{FAQ_JSON_LD}</script>
      </Head>

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-4 sm:gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-1 lg:sticky lg:top-28 lg:block lg:self-start">
            <SectionHead lead={FAQ_HEAD.h2} className="min-w-0" />
            <Link
              to="/contact"
              className="group -mb-2 inline-flex min-h-11 items-center gap-1.5 rounded-md text-[0.86rem] font-semibold text-accent transition-colors hover:text-primary sm:-mb-1 lg:mt-7 lg:mb-0"
            >
              {FAQ_HEAD.contact}
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.06 }}
            className="min-w-0 divide-y divide-[color:var(--border-subtle)] border-y border-subtle"
          >
            {FAQ.map((item, i) => (
              <FAQRow
                key={item.q}
                index={i}
                q={item.q}
                a={item.a}
                open={open === i}
                reduced={reduced}
                onToggle={() => setOpen((cur) => (cur === i ? null : i))}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FAQRow({
  index,
  q,
  a,
  open,
  reduced,
  onToggle,
}: {
  index: number;
  q: string;
  a: string;
  open: boolean;
  reduced: boolean;
  onToggle: () => void;
}) {
  const qId = `faq-q-${index}`;
  const aId = `faq-a-${index}`;

  return (
    <div>
      <h3 className="m-0">
        <button
          id={qId}
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={open ? aId : undefined}
          className="group flex min-h-12 w-full items-start justify-between gap-4 rounded-md py-3 text-left sm:gap-8 sm:py-5"
        >
          <span className="min-w-0 text-pretty text-[0.94rem] font-medium leading-snug tracking-[-0.01em] text-primary sm:text-[1.05rem]">
            {q}
          </span>
          <span
            aria-hidden
            className={`-mt-px inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition duration-300 ease-spring sm:-mt-0.5 sm:h-7 sm:w-7 ${
              open
                ? 'rotate-45 border-transparent bg-accent-soft text-accent'
                : 'border-subtle text-secondary group-hover:border-strong group-hover:text-primary'
            }`}
          >
            <Plus size={14} strokeWidth={2} />
          </span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            id={aId}
            role="region"
            aria-labelledby={qId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.35, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="max-w-[60ch] pb-4 pr-10 text-[0.88rem] font-light leading-relaxed text-secondary sm:pb-6 sm:pr-16 sm:text-[0.96rem]">
              <Answer text={a} />
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Answer text, with the contact address turned into a mailto link. */
function Answer({ text }: { text: string }) {
  const at = text.indexOf(CONTACT_EMAIL);
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <a
        href={`mailto:${CONTACT_EMAIL}`}
        className="font-normal text-accent underline underline-offset-2 hover:text-primary"
      >
        {CONTACT_EMAIL}
      </a>
      {text.slice(at + CONTACT_EMAIL.length)}
    </>
  );
}

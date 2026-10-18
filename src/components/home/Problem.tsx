import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { PROBLEM } from '../../data/homeCopy';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { SectionHead } from './SectionHead';
import { PROBLEM_ART } from './problem/ProblemArt';

const EASE = [0.22, 1, 0.36, 1] as const;
type Card = (typeof PROBLEM.cards)[number];

/** Faint inner panel the illustrations sit on. */
const PANEL = { background: 'color-mix(in oklab, var(--text-primary) 2.5%, transparent)' };

/**
 * The problem: three ways black-box coding fails, each with a small looping
 * illustration, then the bridge line into the fix.
 *
 * md+: three cards. Below md: one card with three compact rows (mini
 * illustration left, title and line right) so the section stays short.
 * Illustrations loop only while on screen and hold still under reduced motion.
 */
export function Problem() {
  const reduced = useReducedMotion();

  return (
    <section id="problem" className="mobile-native-section relative scroll-mt-24 py-16 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHead
          align="center"
          eyebrow={PROBLEM.eyebrow}
          lead={PROBLEM.h2.lead}
          accent={PROBLEM.h2.accent}
          line={PROBLEM.line}
        />

        <motion.ul
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: EASE }}
          className="glass mx-auto mt-6 max-w-xl overflow-hidden rounded-2xl sm:mt-10 md:hidden"
        >
          {PROBLEM.cards.map((card, i) => (
            <CompactRow key={card.key} card={card} first={i === 0} reduced={reduced} />
          ))}
        </motion.ul>

        <ul className="mt-14 hidden grid-cols-3 gap-5 md:grid lg:mt-16 lg:gap-6">
          {PROBLEM.cards.map((card, i) => (
            <ProblemCard key={card.key} card={card} index={i} reduced={reduced} />
          ))}
        </ul>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mx-auto mt-5 max-w-xl text-balance text-center font-display text-[1.05rem] font-medium leading-snug tracking-[-0.02em] text-muted sm:mt-16 sm:text-[1.4rem]"
        >
          {PROBLEM.bridge}
        </motion.p>
      </div>

      {/* A thread from the bridge line down into the fix band. */}
      <span
        aria-hidden
        className="absolute bottom-0 left-1/2 hidden h-16 w-px -translate-x-1/2 sm:block"
        style={{
          background:
            'linear-gradient(to bottom, transparent, color-mix(in oklab, var(--accent) 65%, transparent))',
        }}
      />
    </section>
  );
}

function ProblemCard({ card, index, reduced }: { card: Card; index: number; reduced: boolean }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref);
  const Art = PROBLEM_ART[card.key];

  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: EASE, delay: index * 0.08 }}
      className="glass flex min-w-0 flex-col rounded-2xl p-4 lg:p-6"
    >
      <div
        className="flex h-[130px] items-center justify-center overflow-hidden rounded-xl border border-subtle px-1 lg:px-2"
        style={PANEL}
      >
        <Art variant="card" play={inView && !reduced} />
      </div>
      <h3 className="mt-5 text-balance font-display text-[1.12rem] font-semibold leading-snug tracking-[-0.02em] text-primary lg:text-[1.2rem]">
        {card.title}
      </h3>
      <p className="mt-2 text-pretty text-[0.92rem] leading-relaxed text-secondary">{card.line}</p>
    </motion.li>
  );
}

function CompactRow({ card, first, reduced }: { card: Card; first: boolean; reduced: boolean }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref);
  const Art = PROBLEM_ART[card.key];

  return (
    <li ref={ref} className={`flex items-center gap-4 px-4 py-3.5 sm:px-5 ${first ? '' : 'border-t border-subtle'}`}>
      <div className="grid h-16 w-16 shrink-0 place-items-center rounded-xl border border-subtle" style={PANEL}>
        <Art variant="mini" play={inView && !reduced} />
      </div>
      <div className="min-w-0">
        <h3 className="font-display text-[0.98rem] font-semibold leading-snug tracking-[-0.015em] text-primary">
          {card.title}
        </h3>
        <p className="mt-0.5 text-pretty text-[0.82rem] leading-[1.45] text-secondary">{card.line}</p>
      </div>
    </li>
  );
}

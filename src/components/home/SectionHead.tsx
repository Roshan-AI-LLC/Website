import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { SectionLabel } from '../SectionLabel';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The one header every home section uses: label, headline, one line. Keeping
 * it in one component keeps the type scale identical from section to section.
 *
 * `accent` is the tail of the headline, painted with the gradient.
 */
export function SectionHead({
  eyebrow,
  lead,
  accent,
  line,
  align = 'left',
  className = '',
}: {
  eyebrow?: string;
  lead: ReactNode;
  accent?: ReactNode;
  line?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
}) {
  const centred = align === 'center';
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: EASE }}
      className={`${centred ? 'mx-auto text-center' : ''} max-w-3xl ${className}`}
    >
      {eyebrow && <SectionLabel>{eyebrow}</SectionLabel>}
      <h2
        className={`${eyebrow ? 'mt-3 sm:mt-4' : ''} text-balance font-display text-[1.7rem] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-[2.75rem] lg:text-[3.25rem] ${
          centred ? 'mx-auto' : ''
        }`}
      >
        {lead}
        {accent && (
          <>
            {' '}
            <span className="gradient-text">{accent}</span>
          </>
        )}
      </h2>
      {line && (
        <p
          className={`mt-3 max-w-xl text-pretty text-[0.92rem] leading-relaxed text-secondary sm:mt-5 sm:text-[1.05rem] ${
            centred ? 'mx-auto' : ''
          }`}
        >
          {line}
        </p>
      )}
    </motion.div>
  );
}

import type { ReactNode } from 'react';

/**
 * The one section label used across the site.
 *
 * Deliberately has no container: no pill, no border, no background, no dot.
 * A pill has geometry to break (it wraps badly at narrow widths, the dot
 * drifts off the text baseline, and the padding fights long labels). Plain
 * letterspaced type has none of that and reads as editorial instead of
 * generated. Change it here and every section on the site follows.
 *
 * tone "accent" marks a section. tone "muted" is for context lines that sit
 * above a page title and should not compete with it.
 */
export function SectionLabel({
  children,
  tone = 'accent',
  className = '',
}: {
  children: ReactNode;
  tone?: 'accent' | 'muted';
  className?: string;
}) {
  return (
    <div
      className={`text-[0.7rem] font-semibold uppercase tracking-[0.16em] ${
        tone === 'accent' ? 'text-accent' : 'text-secondary'
      } ${className}`}
    >
      {children}
    </div>
  );
}

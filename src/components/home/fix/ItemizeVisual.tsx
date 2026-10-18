import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { FIX } from '../../../data/homeCopy';
import { CODES, I5023_PARTS, cents } from './story';
import { CodeChip, EASE, Num, ink, mix, useTimeline, useTween, type VisualProps } from './ui';

/**
 * Itemize step: I50.23's score bar builds from named concept segments, a
 * receipt line per segment, and the running total lands exactly on the
 * score: 0.41 + 0.22 + 0.17 + 0.14 = 0.94, nothing left over.
 *
 * Phases: blank, one per segment, total (rest frame).
 */
const TIMES = [400, 520, 520, 520, 520, 3000] as const;
const REST = TIMES.length - 1;
const SEGMENT = [100, 72, 50, 32].map((p) => mix('--accent', p));
const EXPLAINED = FIX.steps.find((s) => s.key === 'itemize')?.statValue ?? '100%';

export function ItemizeVisual({ play, reduced }: VisualProps) {
  const { phase, instant } = useTimeline(TIMES, { play, reduced, rest: REST });
  const shown = (i: number) => phase > i;
  const done = phase >= REST;
  const running = I5023_PARTS.reduce((sum, p, i) => (shown(i) ? sum + p.cents : sum), 0);
  const total = useTween(running / 100, instant, 0.5);
  const seg = { duration: instant ? 0 : 0.55, ease: EASE };

  return (
    <div>
      <div className="flex min-w-0 items-center gap-2.5">
        <CodeChip code={CODES.i5023.code} />
        <span className="truncate text-[12px] text-secondary @md:text-[13.5px]">{CODES.i5023.name}</span>
      </div>

      {/* Score bar on a 0 to 1 track, one segment per concept. */}
      <div
        className="mt-4 flex h-3 gap-[2px] overflow-hidden rounded-full @md:mt-5 @md:h-3.5"
        style={{ background: ink(8) }}
      >
        {I5023_PARTS.map((p, i) => (
          <motion.div
            key={p.concept}
            className="h-full shrink-0"
            style={{ width: `${p.cents}%`, background: SEGMENT[i], originX: 0 }}
            initial={false}
            animate={{ scaleX: shown(i) ? 1 : 0 }}
            transition={seg}
          />
        ))}
      </div>

      <ul className="mt-4 space-y-2 @md:mt-5 @md:space-y-2.5">
        {I5023_PARTS.map((p, i) => (
          <motion.li
            key={p.concept}
            className="flex items-baseline gap-2.5 text-[12px] @md:text-[13.5px]"
            initial={false}
            animate={{ opacity: shown(i) ? 1 : 0, x: shown(i) ? 0 : -6 }}
            transition={seg}
          >
            <span className="h-2 w-2 shrink-0 translate-y-[-1px] rounded-[2px]" style={{ background: SEGMENT[i] }} />
            <span className="shrink-0 text-secondary">{p.concept}</span>
            <span className="min-w-4 flex-1 translate-y-[-3px] border-b border-dotted border-strong" />
            <span className="shrink-0 font-mono text-primary tabular-nums">{cents(p.cents)}</span>
          </motion.li>
        ))}
      </ul>

      <div className="mt-3.5 flex items-center gap-3 border-t border-dashed border-strong pt-3.5 @md:mt-4 @md:pt-4">
        <motion.span
          className="inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-accent @md:h-7 @md:text-[11px]"
          style={{ background: 'var(--accent-soft)' }}
          initial={false}
          animate={{ opacity: done ? 1 : 0, scale: done ? 1 : 0.9 }}
          transition={{ duration: instant ? 0 : 0.4, ease: EASE }}
        >
          <Check size={12} strokeWidth={2.5} aria-hidden />
          {EXPLAINED} explained
        </motion.span>
        <span className="ml-auto flex items-baseline gap-2 font-display text-[1.25rem] font-semibold leading-none tracking-[-0.02em] text-primary @md:text-[1.5rem]">
          <span className="text-muted">=</span>
          <Num mv={total} decimals={2} />
        </span>
      </div>
    </div>
  );
}

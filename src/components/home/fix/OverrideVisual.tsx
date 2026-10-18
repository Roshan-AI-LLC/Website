import { motion } from 'framer-motion';
import { MousePointer2 } from 'lucide-react';
import { CODES, I5022_CENTS, I5023_CENTS, J918_CENTS, J918_NEGATED_CENTS, cents } from './story';
import { CodeChip, EASE, Micro, Num, Tag, WARM, ink, mix, useTimeline, useTween, warm, type VisualProps } from './ui';

/**
 * Override step: a coder marks "pleural effusion" negated. J91.8, which
 * leaned on it, drops (0.81 to 0.08, exactly its 0.73 contribution) and
 * stops being coded; I50.23 does not use that concept and stays put.
 *
 * Phases: idle, cursor to Negated, click and hold (rest frame), cursor to
 * Affirmed, click; then it loops from "cursor to Negated".
 */
const TIMES = [1000, 850, 2700, 750, 1600] as const;
const REST = 2;
const LOOP_FROM = 1;

/** Cursor tip positions, as fractions of the toggle box. */
const CURSOR = {
  rest: { left: '30%', top: '230%' },
  negated: { left: '74%', top: '58%' },
  affirmed: { left: '26%', top: '58%' },
} as const;

export function OverrideVisual({ play, reduced }: VisualProps) {
  const { phase, instant } = useTimeline(TIMES, { play, reduced, rest: REST, loopFrom: LOOP_FROM });
  const negated = phase === 2 || phase === 3;
  const at = phase === 0 ? 'rest' : phase <= 2 ? 'negated' : 'affirmed';
  const clicking = !instant && (phase === 2 || phase === 4);

  const j918 = useTween((negated ? J918_NEGATED_CENTS : J918_CENTS.affirmed) / 100, instant, 0.9);
  const i5023 = useTween(I5023_CENTS / 100, instant);
  const i5022 = useTween(I5022_CENTS / 100, instant);

  return (
    <div>
      <Micro>Concept</Micro>
      <div
        className="mt-2 flex items-center gap-3 rounded-xl border border-subtle px-3.5 py-2.5 @md:px-4 @md:py-3"
        style={{ background: ink(3) }}
      >
        <span
          className="h-2 w-2 shrink-0 rounded-full transition-colors duration-500"
          style={{ background: negated ? WARM : 'var(--accent)' }}
        />
        <span className="min-w-0 truncate text-[12.5px] text-primary @md:text-[14px]">pleural effusion</span>

        {/* Segmented toggle, with the scripted cursor positioned against it. */}
        <div
          className="relative ml-auto grid shrink-0 grid-cols-2 rounded-lg border border-subtle p-0.5 text-[11px] font-medium @md:text-[12px]"
          style={{ background: ink(4) }}
        >
          <motion.span
            aria-hidden
            className="absolute inset-y-0.5 left-0.5 w-[calc(50%-2px)] rounded-md transition-[background-color] duration-500"
            style={{ background: negated ? warm(18) : 'var(--accent-soft)' }}
            initial={false}
            animate={{ x: negated ? '100%' : '0%' }}
            transition={{ duration: instant ? 0 : 0.35, ease: EASE }}
          />
          <span
            className="relative px-2.5 py-1.5 text-center transition-colors duration-500 @md:px-3"
            style={{ color: negated ? 'var(--text-muted)' : 'var(--accent)' }}
          >
            Affirmed
          </span>
          <span
            className="relative px-2.5 py-1.5 text-center transition-colors duration-500 @md:px-3"
            style={{ color: negated ? WARM : 'var(--text-muted)' }}
          >
            Negated
          </span>

          <motion.span
            aria-hidden
            className="pointer-events-none absolute z-[2] -ml-[3px] -mt-[3px]"
            initial={false}
            animate={CURSOR[at]}
            transition={{ duration: instant ? 0 : 0.75, ease: EASE }}
          >
            {clicking && (
              <motion.span
                key={phase}
                className="absolute -left-2 -top-2 h-4 w-4 rounded-full"
                style={{ background: negated ? warm(45) : mix('--accent', 45) }}
                initial={{ scale: 0.3, opacity: 0.9 }}
                animate={{ scale: 2.4, opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            )}
            <motion.span
              className="relative block"
              initial={false}
              animate={clicking ? { scale: [1, 0.82, 1] } : { scale: 1 }}
              transition={{ duration: 0.28 }}
            >
              <MousePointer2
                size={18}
                strokeWidth={1.6}
                style={{ fill: 'var(--text-primary)', color: 'var(--bg-base)' }}
              />
            </motion.span>
          </motion.span>
        </div>
      </div>

      <Micro className="mt-4 block @md:mt-5">Codes</Micro>
      <ul className="mt-2 overflow-hidden rounded-xl border border-subtle">
        <CodeRow
          code={CODES.j918.code}
          name={CODES.j918.name}
          score={j918}
          coded={!negated}
          delta={negated ? `−${cents(J918_CENTS.effusion)}` : null}
        />
        <CodeRow code={CODES.i5023.code} name={CODES.i5023.name} score={i5023} coded />
        <CodeRow code={CODES.i5022.code} name={CODES.i5022.name} score={i5022} coded={false} />
      </ul>
    </div>
  );
}

function CodeRow({
  code,
  name,
  score,
  coded,
  delta = null,
}: {
  code: string;
  name: string;
  score: ReturnType<typeof useTween>;
  coded: boolean;
  delta?: string | null;
}) {
  return (
    <li
      className="flex items-center gap-2.5 border-subtle px-3 py-2 transition-opacity duration-500 [&:not(:first-child)]:border-t @md:gap-3 @md:px-4 @md:py-2.5"
      style={{ opacity: coded ? 1 : 0.55 }}
    >
      <CodeChip code={code} dim={!coded} />
      <span className="min-w-0 flex-1 truncate text-[11.5px] text-secondary @md:text-[12.5px]">{name}</span>
      <span
        className="hidden font-mono text-[10.5px] transition-opacity duration-500 @sm:inline @md:text-[11px]"
        style={{ color: WARM, opacity: delta ? 1 : 0 }}
      >
        {delta ?? '−0.00'}
      </span>
      <Num mv={score} decimals={2} className="w-9 shrink-0 text-right font-mono text-[12px] text-primary @md:text-[13px]" />
      <Tag tone={coded ? 'accent' : 'muted'} className="w-[4.9rem] justify-center">
        {coded ? 'Coded' : 'Not coded'}
      </Tag>
    </li>
  );
}

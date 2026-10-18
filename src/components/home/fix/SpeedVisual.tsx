import { motion } from 'framer-motion';
import { SPEED } from '../../../data/homeCopy';
import { EASE, ink, mix, useTimeline, type VisualProps } from './ui';

/**
 * Speed step: two bars race. ShifaMind's (one note) fills almost at once; the
 * human coder's (one inpatient chart, a different unit, so each row names it)
 * keeps going. The bars show the order of magnitude, not a
 * scale; the times printed beside them are the measured figures (SPEED in
 * homeCopy.ts). Renders nothing until SPEED is filled in.
 *
 * Phases: empty, race, done (rest frame).
 */
const TIMES = [350, 3200, 2600] as const;
const REST = TIMES.length - 1;

export function SpeedVisual({ play, reduced }: VisualProps) {
  const { phase, instant } = useTimeline(TIMES, { play, reduced, rest: REST });
  if (!SPEED) return null;
  const racing = phase >= 1;
  const done = phase >= REST;

  const rows = [
    // ShifaMind's time appears as its bar lands; the coder's when the race ends.
    { who: 'ShifaMind · one note', time: SPEED.model, fill: 'var(--accent)', duration: 0.45, shown: racing, delay: 0.45 },
    { who: 'Human coder · one inpatient chart', time: SPEED.human, fill: ink(28), duration: 2.9, shown: done, delay: 0 },
  ];

  return (
    <div>
      <ul className="space-y-4 @md:space-y-5">
        {rows.map((r) => (
          <li key={r.who}>
            <div className="flex items-baseline justify-between gap-3 text-[12px] @md:text-[13.5px]">
              <span className="text-secondary">{r.who}</span>
              <motion.span
                className="font-mono font-semibold text-primary tabular-nums"
                initial={false}
                animate={{ opacity: r.shown ? 1 : 0 }}
                transition={{ duration: instant ? 0 : 0.3, delay: instant || !r.shown ? 0 : r.delay }}
              >
                {r.time}
              </motion.span>
            </div>
            <div className="mt-2 h-3 overflow-hidden rounded-full" style={{ background: ink(8) }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: r.fill, originX: 0 }}
                initial={false}
                animate={{ scaleX: racing ? 1 : 0 }}
                // Snaps empty when the race resets, so every loop replays from zero.
                transition={{ duration: instant || !racing ? 0 : r.duration, ease: r.duration > 1 ? 'linear' : EASE }}
              />
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-5 flex flex-wrap gap-2 @md:mt-6">
        {[`${SPEED.params} parameters`, SPEED.hardware].map((t) => (
          <span
            key={t}
            className="inline-flex h-7 items-center rounded-full px-3 font-mono text-[11px] text-secondary"
            style={{ background: mix('--accent', 8), border: `1px solid ${mix('--accent', 25)}` }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

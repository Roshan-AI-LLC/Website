import { motion, useTransform, type MotionValue } from 'framer-motion';
import { FIX } from '../../../data/homeCopy';
import { EASE } from './ui';

const N = FIX.steps.length;
type Step = (typeof FIX.steps)[number];

/**
 * The steps as a vertical stepper. The active step is lit and expanded
 * (its line and stat); the rest are dimmed titles. The rail between nodes
 * fills with `progress` (0 to 1 across all steps), so on desktop it tracks
 * scroll within each step.
 */
export function StepList({
  active,
  progress,
  onSelect,
  reduced,
}: {
  active: number;
  progress: MotionValue<number>;
  onSelect: (index: number) => void;
  reduced: boolean;
}) {
  return (
    <ol className="relative min-w-0">
      {FIX.steps.map((step, i) => (
        <StepRow
          key={step.key}
          step={step}
          index={i}
          active={i === active}
          done={i < active}
          progress={progress}
          onSelect={onSelect}
          reduced={reduced}
        />
      ))}
    </ol>
  );
}

function StepRow({
  step,
  index,
  active,
  done,
  progress,
  onSelect,
  reduced,
}: {
  step: Step;
  index: number;
  active: boolean;
  done: boolean;
  progress: MotionValue<number>;
  onSelect: (index: number) => void;
  reduced: boolean;
}) {
  const fill = useTransform(progress, (v) => Math.min(1, Math.max(0, v * N - index)));
  const panelId = `fix-step-${step.key}`;
  const num = String(index + 1).padStart(2, '0');
  const last = index === N - 1;

  return (
    <li className="relative">
      {/* Rail segment from this node down to the next one. */}
      <span
        aria-hidden
        className={`absolute left-[13px] top-[42px] w-px ${last ? 'bottom-2' : '-bottom-[10px]'}`}
        style={{ background: 'var(--border-strong)' }}
      >
        <motion.span
          className="absolute inset-0 origin-top"
          style={{ scaleY: fill, background: 'var(--accent)' }}
        />
      </span>

      <button
        type="button"
        onClick={() => onSelect(index)}
        aria-expanded={active}
        aria-controls={panelId}
        aria-current={active ? 'step' : undefined}
        className="group flex w-full cursor-pointer items-start gap-4 rounded-xl py-2.5 pr-2 text-left"
      >
        <span
          className="relative z-[1] mt-[2px] grid h-7 w-7 shrink-0 place-items-center rounded-full border font-mono text-[10px] font-semibold transition-[background-color,border-color,color,box-shadow] duration-500"
          style={{
            borderColor: active || done ? 'var(--accent)' : 'var(--border-strong)',
            background: active ? 'var(--accent-soft)' : done ? 'var(--accent)' : 'var(--bg-base)',
            color: active ? 'var(--accent)' : done ? 'var(--on-accent)' : 'var(--text-muted)',
            boxShadow: active ? '0 0 0 4px color-mix(in oklab, var(--accent) 12%, transparent)' : 'none',
          }}
        >
          {num}
        </span>
        <span
          className={`min-w-0 flex-1 transition-opacity duration-500 ${
            active ? 'opacity-100' : 'opacity-40 group-hover:opacity-75'
          }`}
        >
          <span
            className={`block font-mono text-[10.5px] font-semibold uppercase tracking-[0.18em] ${
              active ? 'text-accent' : 'text-muted'
            }`}
          >
            {step.tag}
          </span>
          <span className="mt-1 block text-balance font-display text-[1.15rem] font-semibold leading-tight tracking-[-0.025em] text-primary lg:text-[1.3rem]">
            {step.title}
          </span>
        </span>
      </button>

      <motion.div
        id={panelId}
        aria-hidden={!active}
        className="overflow-hidden pl-11"
        initial={false}
        animate={{ height: active ? 'auto' : 0, opacity: active ? 1 : 0 }}
        transition={{ duration: reduced ? 0 : 0.5, ease: EASE }}
      >
        <p className="max-w-md text-pretty text-[0.92rem] leading-relaxed text-secondary lg:text-[0.98rem]">
          {step.line}
        </p>
        <div className="flex items-baseline gap-3 pb-4 pt-3.5">
          <span className="font-display text-[1.75rem] font-semibold leading-none tracking-[-0.035em] text-accent lg:text-[2rem]">
            {step.statValue}
          </span>
          <span className="text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-muted">
            {step.statLabel}
          </span>
        </div>
      </motion.div>
    </li>
  );
}

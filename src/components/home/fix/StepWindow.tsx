import { AnimatePresence, motion } from 'framer-motion';
import { forwardRef, type ComponentType } from 'react';
import { FIX } from '../../../data/homeCopy';
import { ItemizeVisual } from './ItemizeVisual';
import { OnPremVisual } from './OnPremVisual';
import { OverrideVisual } from './OverrideVisual';
import { SpeedVisual } from './SpeedVisual';
import { EASE, ink, type VisualProps } from './ui';

type StepKey = (typeof FIX.steps)[number]['key'];

const VISUALS: Record<StepKey, ComponentType<VisualProps>> = {
  onprem: OnPremVisual,
  itemize: ItemizeVisual,
  override: OverrideVisual,
  speed: SpeedVisual,
};

/**
 * Body height: 400px on roomy screens, shrinking with the viewport so the
 * pinned stage still fits a 1366x768 laptop (about 657px of viewport), never
 * below 300px.
 */
const BODY_STYLE = {
  height: 'clamp(300px, calc(100svh - 300px), 400px)',
  // A faint dot canvas, so the window reads as a product surface on the band.
  backgroundImage: `radial-gradient(circle at 1px 1px, ${ink(6)} 1px, transparent 0)`,
  backgroundSize: '18px 18px',
};

/** macOS window controls: close, minimise, zoom. */
const TRAFFIC_LIGHTS = ['#ff5f57', '#febc2e', '#28c840'] as const;

/**
 * The product-window frame the active step's visual plays in. Only the active
 * visual is mounted; switching steps crossfades bodies.
 */
export const StepWindow = forwardRef<
  HTMLDivElement,
  { active: number; play: boolean; reduced: boolean }
>(function StepWindow({ active, play, reduced }, ref) {
  const step = FIX.steps[active];
  const Visual = VISUALS[step.key];

  return (
    <div ref={ref} className="relative isolate min-w-0">
      <div
        className="overflow-hidden rounded-2xl border border-subtle"
        style={{ background: 'var(--bg-elev)', boxShadow: 'var(--window-shadow)' }}
      >
        <div className="flex h-10 items-center gap-3 border-b border-subtle px-4" style={{ background: ink(2.5) }}>
          <span aria-hidden className="flex gap-2">
            {TRAFFIC_LIGHTS.map((c) => (
              <span
                key={c}
                className="h-3 w-3 rounded-full"
                style={{ background: c, boxShadow: 'inset 0 0 0 0.5px rgba(0, 0, 0, 0.25)' }}
              />
            ))}
          </span>
          <span className="min-w-0 truncate font-mono text-[11px] text-muted">
            shifamind · {step.tag.toLowerCase()}
          </span>
          <span className="ml-auto shrink-0 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            Illustrative
          </span>
        </div>

        {/* Decorative: the step text beside the window carries the meaning. */}
        <div aria-hidden className="relative" style={BODY_STYLE}>
          <AnimatePresence initial={false}>
            <motion.div
              key={step.key}
              className="absolute inset-0 flex flex-col justify-center px-5 py-4 @container lg:px-7"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: reduced ? 0 : 0.45, ease: EASE }}
            >
              <Visual play={play} reduced={reduced} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
});

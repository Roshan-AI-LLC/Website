/**
 * Composition registry. Exposes the assembled `Full` piece plus every
 * segment as its own composition for isolated preview/render.
 */
import { Composition } from 'remotion';
import './load-fonts';
import { DURATIONS, HEIGHT, FPS, TOTAL_FRAMES, WIDTH } from './timeline';
import { Full } from './Full';
import { Problem } from './segments/Problem';
import { Gap } from './segments/Gap';
import { Reveal } from './segments/Reveal';
import { GlassBox } from './segments/GlassBox';
import { Demo } from './segments/Demo';
import { Benchmark } from './segments/Benchmark';
import { Compliance } from './segments/Compliance';
import { Closing } from './segments/Closing';

const base = { width: WIDTH, height: HEIGHT, fps: FPS } as const;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="Full" component={Full} durationInFrames={TOTAL_FRAMES} {...base} />

      <Composition id="Problem" component={Problem} durationInFrames={DURATIONS.problem} {...base} />
      <Composition id="Gap" component={Gap} durationInFrames={DURATIONS.gap} {...base} />
      <Composition id="Reveal" component={Reveal} durationInFrames={DURATIONS.reveal} {...base} />
      <Composition id="GlassBox" component={GlassBox} durationInFrames={DURATIONS.glassbox} {...base} />
      <Composition id="Demo" component={Demo} durationInFrames={DURATIONS.demo} {...base} />
      <Composition id="Benchmark" component={Benchmark} durationInFrames={DURATIONS.benchmark} {...base} />
      <Composition id="Compliance" component={Compliance} durationInFrames={DURATIONS.compliance} {...base} />
      <Composition id="Closing" component={Closing} durationInFrames={DURATIONS.closing} {...base} />
    </>
  );
};

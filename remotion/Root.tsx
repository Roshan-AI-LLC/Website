/**
 * Composition registry. Exposes the assembled `Full` cut plus every segment
 * on its own (wrapped in the shared Backdrop) for isolated preview / render.
 */
import { AbsoluteFill, Composition } from 'remotion';
import './load-fonts';
import { COLORS } from './theme';
import { DURATIONS, HEIGHT, FPS, TOTAL_FRAMES, WIDTH } from './timeline';
import { Backdrop } from './components/Backdrop';
import { Full } from './Full';
import { Hook } from './segments/Hook';
import { Stakes } from './segments/Stakes';
import { Gap } from './segments/Gap';
import { Reveal } from './segments/Reveal';
import { GlassBox } from './segments/GlassBox';
import { Architecture } from './segments/Architecture';
import { Demo } from './segments/Demo';
import { Benchmark } from './segments/Benchmark';
import { Compliance } from './segments/Compliance';
import { Closing } from './segments/Closing';

const base = { width: WIDTH, height: HEIGHT, fps: FPS } as const;

// Wrap a content-only segment in the shared backdrop for standalone preview.
const onBackdrop =
  (Comp: React.FC): React.FC =>
  () => (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <Backdrop />
      <Comp />
    </AbsoluteFill>
  );

const HookS = onBackdrop(Hook);
const StakesS = onBackdrop(Stakes);
const GapS = onBackdrop(Gap);
const RevealS = onBackdrop(Reveal);
const GlassBoxS = onBackdrop(GlassBox);
const ArchitectureS = onBackdrop(Architecture);
const DemoS = onBackdrop(Demo);
const BenchmarkS = onBackdrop(Benchmark);
const DeploymentS = onBackdrop(Compliance);
const ClosingS = onBackdrop(Closing);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="Full" component={Full} durationInFrames={TOTAL_FRAMES} {...base} />

      <Composition id="Hook" component={HookS} durationInFrames={DURATIONS.hook} {...base} />
      <Composition id="Stakes" component={StakesS} durationInFrames={DURATIONS.stakes} {...base} />
      <Composition id="Gap" component={GapS} durationInFrames={DURATIONS.gap} {...base} />
      <Composition id="Reveal" component={RevealS} durationInFrames={DURATIONS.reveal} {...base} />
      <Composition id="GlassBox" component={GlassBoxS} durationInFrames={DURATIONS.glassbox} {...base} />
      <Composition id="Architecture" component={ArchitectureS} durationInFrames={DURATIONS.architecture} {...base} />
      <Composition id="Demo" component={DemoS} durationInFrames={DURATIONS.demo} {...base} />
      <Composition id="Benchmark" component={BenchmarkS} durationInFrames={DURATIONS.benchmark} {...base} />
      <Composition id="Deployment" component={DeploymentS} durationInFrames={DURATIONS.deployment} {...base} />
      <Composition id="Closing" component={ClosingS} durationInFrames={DURATIONS.closing} {...base} />
    </>
  );
};

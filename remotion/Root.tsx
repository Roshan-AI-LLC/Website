/**
 * Composition registry. Exposes two assembled cuts — `Full` (TRACE, evolved
 * from the original) and `Glass` (the from-scratch continuous-camera cut) —
 * plus every TRACE segment on its own (wrapped in the shared Backdrop) for
 * isolated preview / render.
 */
import { AbsoluteFill, Composition } from 'remotion';
import './load-fonts';
import { COLORS } from './theme';
import { DURATIONS, HEIGHT, FPS, TOTAL_FRAMES, WIDTH } from './timeline';
import { Backdrop } from './components/Backdrop';
import { Grain } from './components/Grain';
import { Full } from './Full';
import { Glass, GLASS_DURATION } from './glass/Glass';
import { ColdOpen } from './segments/ColdOpen';
import { Reveal } from './segments/Reveal';
import { GlassBox } from './segments/GlassBox';
import { Architecture } from './segments/Architecture';
import { Demo } from './segments/Demo';
import { Benchmark } from './segments/Benchmark';
import { Proof } from './segments/Proof';
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
      <Grain />
    </AbsoluteFill>
  );

const ColdOpenS = onBackdrop(ColdOpen);
const RevealS = onBackdrop(Reveal);
const GlassBoxS = onBackdrop(GlassBox);
const ArchitectureS = onBackdrop(Architecture);
const DemoS = onBackdrop(Demo);
const BenchmarkS = onBackdrop(Benchmark);
const ProofS = onBackdrop(Proof);
const DeploymentS = onBackdrop(Compliance);
const ClosingS = onBackdrop(Closing);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="Full" component={Full} durationInFrames={TOTAL_FRAMES} {...base} />
      <Composition id="Glass" component={Glass} durationInFrames={GLASS_DURATION} {...base} />

      <Composition id="ColdOpen" component={ColdOpenS} durationInFrames={DURATIONS.coldopen} {...base} />
      <Composition id="Reveal" component={RevealS} durationInFrames={DURATIONS.reveal} {...base} />
      <Composition id="GlassBox" component={GlassBoxS} durationInFrames={DURATIONS.glassbox} {...base} />
      <Composition id="Architecture" component={ArchitectureS} durationInFrames={DURATIONS.architecture} {...base} />
      <Composition id="Demo" component={DemoS} durationInFrames={DURATIONS.demo} {...base} />
      <Composition id="Benchmark" component={BenchmarkS} durationInFrames={DURATIONS.benchmark} {...base} />
      <Composition id="Proof" component={ProofS} durationInFrames={DURATIONS.proof} {...base} />
      <Composition id="Deployment" component={DeploymentS} durationInFrames={DURATIONS.deployment} {...base} />
      <Composition id="Closing" component={ClosingS} durationInFrames={DURATIONS.closing} {...base} />
    </>
  );
};

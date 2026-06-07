/**
 * The full cinematic cut. A persistent Backdrop sits behind a TransitionSeries
 * of content-only segments that cross-fade into each other, so the whole
 * ~65s piece reads as one continuous film over a single living canvas.
 */
import { Fragment } from 'react';
import { AbsoluteFill } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { COLORS } from './theme';
import { DURATIONS, TRANSITION } from './timeline';
import { Backdrop } from './components/Backdrop';
import { Hook } from './segments/Hook';
import { Stakes } from './segments/Stakes';
import { Gap } from './segments/Gap';
import { Reveal } from './segments/Reveal';
import { Architecture } from './segments/Architecture';
import { Demo } from './segments/Demo';
import { Benchmark } from './segments/Benchmark';
import { Compliance } from './segments/Compliance';
import { Platform } from './segments/Platform';
import { Closing } from './segments/Closing';

const timing = () => linearTiming({ durationInFrames: TRANSITION });

const SEGMENTS: { key: string; component: React.FC; duration: number }[] = [
  { key: 'hook', component: Hook, duration: DURATIONS.hook },
  { key: 'stakes', component: Stakes, duration: DURATIONS.stakes },
  { key: 'gap', component: Gap, duration: DURATIONS.gap },
  { key: 'reveal', component: Reveal, duration: DURATIONS.reveal },
  { key: 'architecture', component: Architecture, duration: DURATIONS.architecture },
  { key: 'demo', component: Demo, duration: DURATIONS.demo },
  { key: 'benchmark', component: Benchmark, duration: DURATIONS.benchmark },
  { key: 'deployment', component: Compliance, duration: DURATIONS.deployment },
  { key: 'platform', component: Platform, duration: DURATIONS.platform },
  { key: 'closing', component: Closing, duration: DURATIONS.closing },
];

export const Full: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <Backdrop />
      <TransitionSeries>
        {SEGMENTS.map((seg, i) => {
          const Comp = seg.component;
          return (
            <Fragment key={seg.key}>
              {i > 0 && (
                <TransitionSeries.Transition presentation={fade()} timing={timing()} />
              )}
              <TransitionSeries.Sequence durationInFrames={seg.duration}>
                <Comp />
              </TransitionSeries.Sequence>
            </Fragment>
          );
        })}
      </TransitionSeries>
    </AbsoluteFill>
  );
};

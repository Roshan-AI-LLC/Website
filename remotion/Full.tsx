/**
 * The full cinematic cut. A persistent Backdrop sits behind a Series of
 * content-only segments; each segment fades its content in/out over the
 * backdrop (see components/Segment.tsx), so the ~75s piece reads as one
 * continuous film with no cross-segment overlap.
 */
import { AbsoluteFill, Series } from 'remotion';
import { COLORS } from './theme';
import { DURATIONS } from './timeline';
import { Backdrop } from './components/Backdrop';
import { Segment } from './components/Segment';
import { Hook } from './segments/Hook';
import { Stakes } from './segments/Stakes';
import { Gap } from './segments/Gap';
import { Reveal } from './segments/Reveal';
import { GlassBox } from './segments/GlassBox';
import { Architecture } from './segments/Architecture';
import { Demo } from './segments/Demo';
import { Benchmark } from './segments/Benchmark';
import { Compliance } from './segments/Compliance';
import { Platform } from './segments/Platform';
import { Closing } from './segments/Closing';

const SEGMENTS: { key: string; component: React.FC; duration: number }[] = [
  { key: 'hook', component: Hook, duration: DURATIONS.hook },
  { key: 'stakes', component: Stakes, duration: DURATIONS.stakes },
  { key: 'gap', component: Gap, duration: DURATIONS.gap },
  { key: 'reveal', component: Reveal, duration: DURATIONS.reveal },
  { key: 'glassbox', component: GlassBox, duration: DURATIONS.glassbox },
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
      <Series>
        {SEGMENTS.map((seg) => {
          const Comp = seg.component;
          return (
            <Series.Sequence key={seg.key} durationInFrames={seg.duration}>
              <Segment>
                <Comp />
              </Segment>
            </Series.Sequence>
          );
        })}
      </Series>
    </AbsoluteFill>
  );
};

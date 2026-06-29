/**
 * TRACE — the full cut, evolved from the original. A persistent Backdrop and a
 * persistent Hud sit behind/over a Series of content-only segments. Each
 * segment fades its content in/out (see components/Segment.tsx) and the
 * through-line is composed so the shared element (the point, the logo, the box's
 * nodes, the concept column, the bars) sits at the same place across each seam,
 * so the piece reads as one continuous journey of one clinical note.
 */
import { AbsoluteFill, Series } from 'remotion';
import { COLORS } from './theme';
import { DURATIONS, TOTAL_FRAMES } from './timeline';
import { Backdrop } from './components/Backdrop';
import { Grain } from './components/Grain';
import { Hud } from './components/Hud';
import { Segment } from './components/Segment';
import { ColdOpen } from './segments/ColdOpen';
import { Reveal } from './segments/Reveal';
import { GlassBox } from './segments/GlassBox';
import { Architecture } from './segments/Architecture';
import { Demo } from './segments/Demo';
import { Benchmark } from './segments/Benchmark';
import { Proof } from './segments/Proof';
import { Compliance } from './segments/Compliance';
import { Closing } from './segments/Closing';

const SEGMENTS: { key: string; component: React.FC; duration: number }[] = [
  { key: 'coldopen', component: ColdOpen, duration: DURATIONS.coldopen },
  { key: 'reveal', component: Reveal, duration: DURATIONS.reveal },
  { key: 'glassbox', component: GlassBox, duration: DURATIONS.glassbox },
  { key: 'architecture', component: Architecture, duration: DURATIONS.architecture },
  { key: 'demo', component: Demo, duration: DURATIONS.demo },
  { key: 'benchmark', component: Benchmark, duration: DURATIONS.benchmark },
  { key: 'proof', component: Proof, duration: DURATIONS.proof },
  { key: 'deployment', component: Compliance, duration: DURATIONS.deployment },
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
      <Hud total={TOTAL_FRAMES} />
      <Grain />
    </AbsoluteFill>
  );
};

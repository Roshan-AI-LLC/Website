/**
 * The full ~57s piece: all eight segments played back-to-back via Series.
 * Each segment fades from/to black (via Stage) so the cuts read as one
 * continuous render over a constant black + dot-grid canvas.
 */
import { AbsoluteFill, Series } from 'remotion';
import { COLORS } from './theme';
import { DURATIONS } from './timeline';
import { Problem } from './segments/Problem';
import { Gap } from './segments/Gap';
import { Reveal } from './segments/Reveal';
import { GlassBox } from './segments/GlassBox';
import { Demo } from './segments/Demo';
import { Benchmark } from './segments/Benchmark';
import { Compliance } from './segments/Compliance';
import { Closing } from './segments/Closing';

export const Full: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <Series>
        <Series.Sequence durationInFrames={DURATIONS.problem}>
          <Problem />
        </Series.Sequence>
        <Series.Sequence durationInFrames={DURATIONS.gap}>
          <Gap />
        </Series.Sequence>
        <Series.Sequence durationInFrames={DURATIONS.reveal}>
          <Reveal />
        </Series.Sequence>
        <Series.Sequence durationInFrames={DURATIONS.glassbox}>
          <GlassBox />
        </Series.Sequence>
        <Series.Sequence durationInFrames={DURATIONS.demo}>
          <Demo />
        </Series.Sequence>
        <Series.Sequence durationInFrames={DURATIONS.benchmark}>
          <Benchmark />
        </Series.Sequence>
        <Series.Sequence durationInFrames={DURATIONS.compliance}>
          <Compliance />
        </Series.Sequence>
        <Series.Sequence durationInFrames={DURATIONS.closing}>
          <Closing />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};

/**
 * GLASS — "One note, end to end."
 *
 * A from-scratch cinematic cut assembled as ONE unbroken flight: there are no
 * hard cuts to black. A single top-level "camera" wrapper (translate + a slow
 * perpetual forward scale push, both driven by the absolute frame) makes us
 * appear to travel deeper into the system. The eight+ acts are stacked as
 * AbsoluteFills and cross-dissolved over OVERLAPPING windows so each fades in a
 * few frames before the previous fades out. Match-cut elements (the warm point
 * → docked note; the convergence gate → resolved code; the single prediction →
 * a data point; the field returning teal) sit at shared screen positions across
 * the seams so they morph rather than pop.
 *
 * Two-color story: teal = ShifaMind's reasoning; warm COLORS.human = the human
 * thread (the patient, their words, the people downstream). The arc runs
 * warm→teal, and at the very end a warm point and a teal point merge into the
 * Roshan AI mark.
 *
 * Each act is authored against a LOCAL timeline starting at 0; a Remotion
 * Sequence re-bases useCurrentFrame() per act, and the cross-dissolve opacity is
 * driven by the absolute frame so the seams overlap cleanly.
 *
 * Exports (registered by the orchestrator): Glass, GLASS_DURATION, GLASS_CHAPTERS.
 */
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from 'remotion';
import { COLORS, FONTS } from '../theme';
import { Backdrop } from '../components/Backdrop';
import { Grain } from '../components/Grain';
import { Hud } from '../components/Hud';
import { TealGlow } from '../components/TealGlow';

import { ACTS, CHAPTERS, GLASS_TOTAL, actOpacity } from './shared';
import { Field } from './acts/Field';
import { Intake } from './acts/Intake';
import { GlassBox } from './acts/GlassBox';
import { Verdict } from './acts/Verdict';
import { Discuss } from './acts/Discuss';
import { Proof } from './acts/Proof';
import { Downstream } from './acts/Downstream';
import { Platform } from './acts/Platform';
import { SignOff } from './acts/SignOff';

export const GLASS_DURATION = GLASS_TOTAL;

export const GLASS_CHAPTERS: { label: string; start: number }[] = CHAPTERS;

/**
 * One act, mounted across its window via a Sequence (so its children read a
 * local frame starting at 0), cross-dissolved by an opacity layer that is driven
 * by the ABSOLUTE frame — letting neighbouring acts overlap at the seams.
 */
const Act: React.FC<{
  win: { start: number; end: number };
  fadeFrames?: number;
  children: React.ReactNode;
}> = ({ win, fadeFrames = 22, children }) => {
  return (
    <Sequence from={win.start} durationInFrames={win.end - win.start} layout="none">
      <Dissolve win={win} fadeFrames={fadeFrames}>
        {children}
      </Dissolve>
    </Sequence>
  );
};

/** Absolute-frame cross-dissolve wrapper (reconstructs absolute frame). */
const Dissolve: React.FC<{
  win: { start: number; end: number };
  fadeFrames: number;
  children: React.ReactNode;
}> = ({ win, fadeFrames, children }) => {
  // Inside the Sequence, useCurrentFrame() is local (0 at win.start). Add the
  // start back to drive the dissolve on the absolute timeline.
  const local = useCurrentFrame();
  const absolute = local + win.start;
  const opacity = actOpacity(absolute, win, fadeFrames);
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

export const Glass: React.FC = () => {
  const frame = useCurrentFrame();

  // The continuous camera: a gentle perpetual forward push (scale up across the
  // whole film) plus tiny low-frequency drift so the canvas never feels static.
  const push = interpolate(frame, [0, GLASS_TOTAL], [1.0, 1.08], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const driftX = Math.sin(frame * 0.0016) * 10;
  const driftY = Math.cos(frame * 0.0013) * 8;

  // Ambient tone runs warm→teal across the opening, then settles teal.
  const warmth = interpolate(frame, [0, 360, 660], [1, 0.5, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, fontFamily: FONTS.body }}>
      {/* Persistent atmosphere behind everything */}
      <Backdrop />
      {/* A faint warm glow during the human opening, fading to teal */}
      {warmth > 0.01 && (
        <TealGlow size={1700} y="46%" opacity={0.14 * warmth} color={COLORS.human} />
      )}

      {/* The camera — everything inside travels forward together */}
      <AbsoluteFill
        style={{
          transform: `translate(${driftX}px, ${driftY}px) scale(${push})`,
          transformOrigin: '50% 48%',
        }}
      >
        <Act win={ACTS.field}>
          <Field />
        </Act>
        <Act win={ACTS.intake}>
          <Intake />
        </Act>
        <Act win={ACTS.glass}>
          <GlassBox />
        </Act>
        <Act win={ACTS.verdict}>
          <Verdict />
        </Act>
        <Act win={ACTS.discuss}>
          <Discuss />
        </Act>
        <Act win={ACTS.proof}>
          <Proof />
        </Act>
        <Act win={ACTS.downstream}>
          <Downstream />
        </Act>
        <Act win={ACTS.platform}>
          <Platform />
        </Act>
        <Act win={ACTS.signoff}>
          <SignOff />
        </Act>
      </AbsoluteFill>

      {/* Persistent HUD chrome + grain, above content, outside the camera */}
      <Hud chapters={GLASS_CHAPTERS} total={GLASS_DURATION} />
      <Grain />
    </AbsoluteFill>
  );
};

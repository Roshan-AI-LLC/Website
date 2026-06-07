/**
 * Timeline budget for the full piece. 30fps. Durations are tuned for a
 * continuous flow rather than the spec's exact second counts (the spec
 * explicitly allows adjusting timing); the closing in particular is given
 * room to breathe. Each value is the segment's length in frames.
 */
export const FPS = 30;

export const DURATIONS = {
  problem: 7 * FPS, // 0–7s
  gap: 7 * FPS, // two-panel reveal
  reveal: 4.5 * FPS, // logo resolve
  glassbox: 7 * FPS, // explainability cube
  demo: 14 * FPS, // the core demo
  benchmark: 7 * FPS, // animated bar chart
  compliance: 6.5 * FPS, // four deployment points
  closing: 4 * FPS, // logo + url, room to breathe
} as const;

export const TOTAL_FRAMES = Object.values(DURATIONS).reduce((a, b) => a + b, 0);

export const WIDTH = 1920;
export const HEIGHT = 1080;

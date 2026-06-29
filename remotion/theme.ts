/**
 * Brand tokens, mirrored from the website's `html.dark` block in
 * src/index.css. Background is always pure black; teal #4ecdc4 is the
 * only accent. Kept as plain constants so every segment shares one source
 * of truth and the piece reads as one continuous design.
 */
export const COLORS = {
  bg: '#000000',
  accent: '#4ecdc4',
  accentStrong: '#7de8e1',
  accentSoft: 'rgba(78, 205, 196, 0.14)',
  accentSofter: 'rgba(78, 205, 196, 0.08)',
  glass: 'rgba(255, 255, 255, 0.045)',
  glassStrong: 'rgba(255, 255, 255, 0.07)',
  borderSubtle: 'rgba(255, 255, 255, 0.07)',
  borderStrong: 'rgba(255, 255, 255, 0.13)',
  borderTeal: 'rgba(78, 205, 196, 0.45)',
  textPrimary: 'rgba(255, 255, 255, 0.94)',
  textSecondary: 'rgba(255, 255, 255, 0.66)',
  textMuted: 'rgba(255, 255, 255, 0.5)',
  grid: 'rgba(255, 255, 255, 0.04)',
  // Logo fills + the favicon's teal layer. We use the navy "light mode"
  // foreground (#0b1120) rather than the cream dark-theme one: on the teal
  // glow the dark hemisphere lets the connectome lines read with far more
  // contrast, which looks more premium than a flat cream fill.
  logoFg: '#0b1120',
  logoTeal: '#5ECFC1',

  // Warm "human" accent — used ONLY for the patient/person thread in the GLASS
  // cut (the heartbeat, the words a person says, the people paid + treated
  // downstream). Teal is the system; this warm tone is the human the system
  // serves. Deployed sparingly so the contrast stays meaningful.
  human: '#f3c79a',
  humanStrong: '#ffdcb0',
  humanSoft: 'rgba(243, 199, 154, 0.14)',
} as const;

export const FONTS = {
  display: '"Tomorrow", sans-serif',
  body: '"Inter", sans-serif',
  mono: 'ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace',
} as const;

/** Shared spring easing, matching the site's --ease-spring cubic-bezier. */
export const EASE_SPRING = [0.22, 1, 0.36, 1] as const;

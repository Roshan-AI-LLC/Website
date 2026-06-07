# ShifaMind launch film (Remotion)

The debut film for ShifaMind, the flagship model of the Roshan AI platform.
~75 seconds, 1920×1080 / 30fps, animated entirely from scratch. No video
recordings or new assets - it reuses the website's brand tokens, fonts, logo,
demo data, and benchmark numbers.

It's built to land for every part of the audience: investors (cited market +
regulatory pressure, #1 benchmark, efficiency, platform), clinicians (a real
note, "see the reasoning," trust by construction), and researchers (the MCB
architecture, 160 concepts, highest Macro-F1 of every model evaluated).

This project is fully isolated from the Vite website build: it lives in
`remotion/`, has its own `tsconfig.json`, and is not part of `src/`, so the
website's `tsc -b` / SSG build never touches it.

## Story / compositions

`Full` is the assembled film. Each segment is also registered on its own for
isolated preview / render.

| id             | beat                                                   | audience |
| -------------- | ------------------------------------------------------ | -------- |
| `Full`         | the whole film (11 segments)                           | -        |
| `Hook`         | cold open: "Medicine needs reasons."                   | all      |
| `Stakes`       | cited facts: $262B denied, 30% coder gap, EU AI Act    | investors|
| `Gap`          | frontier LLMs vs research models: the false choice     | research |
| `Reveal`       | ShifaMind: interpretable AND state-of-the-art; flagship| all      |
| `GlassBox`     | black box → glass box (concept nodes revealed)         | all      |
| `Architecture` | the MCB - note → 160 concepts → ICD-10, by construction | research/clinical |
| `Demo`         | HUD cursor clicks Predict; a real note is coded live   | clinical |
| `Benchmark`    | MIMIC-IV top-50 Macro-F1, ShifaMind #1                 | investors/research |
| `Deployment`   | compact, on-prem, HIPAA, traceable                     | hospitals|
| `Platform`     | ShifaMind is just the first; the Roshan AI platform    | investors|
| `Closing`      | sign-off + roshan-ai.com                               | all      |

Continuity & transitions: a single `Backdrop` (dot grid + drifting teal glow)
sits behind the whole piece; segments are content-only and play back-to-back
in a `Series`. Each segment gets a designed "lift and settle" by
`components/Segment.tsx` - content rises and sharpens into place on entry,
then lifts, softens (blur) and recedes on exit, on eased curves. Only one
segment is ever visible (it settles to the backdrop before the next rises),
so there's no ghosted cross-fade, but the canvas stays continuous.

The demo uses a frame-driven recreation of the website's HUD cursor
(`components/Cursor.tsx`): it glides in, the hex frame blooms as it hovers the
Predict button, then it clicks to trigger the prediction.

Sound: the timing sits on a steady pulse with marked "sound slots" in each
segment's header comment, so subtle sound design (no music bed, no VO) can be
dropped onto the beats later.

## Facts on screen

Every figure is sourced and kept defensible:

- `$262B` of U.S. medical claims denied in 2024 - Change Healthcare.
- `30%` gap in the certified medical-coding workforce - American Medical Association.
- EU AI Act high-risk obligations apply from 2 Aug 2026 - European Commission.
- Benchmark numbers (Macro-F1, MIMIC-IV top-50) from `BenchmarkChart.tsx`.
- The model is described as compact (built on a base-size clinical encoder,
  BioClinical ModernBERT-base) rather than with a hard parameter count, which
  the repo does not state. Add the paper's exact total to `Deployment` if you
  want a number on screen.

## Preview & render

```bash
# Interactive studio
npx remotion studio

# Render the full film (normal terminal)
npx remotion render Full out/shifamind.mp4

# Render via the Node API - recommended for CI / non-interactive shells,
# where the CLI progress bar can crash (String.repeat(-1) on a zero-width
# terminal). Same composition id + output path.
node remotion/render.mjs Full out/shifamind.mp4
```

`out/` is gitignored - render artifacts are not committed.

### Rendering without Chrome download access

Remotion downloads its own Chrome Headless Shell on first render. If that's
blocked, point it at an existing Chromium **headless shell** (the full
`chrome` binary won't work - it removed the old headless mode Remotion uses):

```bash
# CLI
npx remotion render Full out/shifamind.mp4 \
  --browser-executable=/path/to/chromium_headless_shell/headless_shell

# Node API
REMOTION_BROWSER=/path/to/headless_shell node remotion/render.mjs
```

## Notes

- Fonts (Tomorrow + Inter) load from the website's `public/fonts` via
  `load-fonts.ts`, under a `delayRender` with `retries` so a stalled font
  fetch on a recycled render worker is retried rather than failing.
- All brand values live in `theme.ts` (mirrored from `src/index.css`'s
  `html.dark` block). Background is always pure black; teal `#4ecdc4` is the
  only accent. The logo uses the navy "light-mode" foreground so its
  connectome lines read against the glow. Competitor brand marks keep their
  original colors.
- Demo + architecture content come from the cardiology scenario in
  `src/data/shifamindScenarios.ts`; benchmark numbers and brand marks from
  `src/components/BenchmarkChart.tsx` and `src/components/brand-marks.tsx`;
  architecture language (MCB, 160 concepts) from the Platform page.

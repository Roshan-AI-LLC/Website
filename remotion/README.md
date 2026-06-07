# ShifaMind launch film (Remotion)

The debut film for ShifaMind, the flagship model of the Roshan AI platform.
~66 seconds, 1920×1080 / 30fps, animated entirely from scratch. No video
recordings or new assets - it reuses the website's brand tokens, fonts, logo,
demo data, and benchmark numbers.

It's built to land for every part of the audience: investors (market,
regulation, #1 benchmark, efficiency, platform), clinicians (real note,
"see the reasoning," trust by construction), and researchers (the MCB
architecture, 160 concepts, beats frontier LLMs and the best published
clinical model, arXiv).

This project is fully isolated from the Vite website build: it lives in
`remotion/`, has its own `tsconfig.json`, and is not part of `src/`, so the
website's `tsc -b` / SSG build never touches it.

## Story / compositions

`Full` is the assembled film. Each segment is also registered on its own for
isolated preview / render.

| id             | beat                                                   | audience |
| -------------- | ------------------------------------------------------ | -------- |
| `Full`         | the whole film (all 10 segments, cross-faded)          | -        |
| `Hook`         | cold open: "AI that can't explain itself…"             | all      |
| `Stakes`       | denials, coder shortage, EU AI Act → "it's the law"    | investors|
| `Gap`          | frontier LLMs vs research models: the false choice     | research |
| `Reveal`       | ShifaMind: interpretable AND state-of-the-art; flagship| all      |
| `Architecture` | the MCB - note → 160 concepts → ICD-10, by construction | research/clinical |
| `Demo`         | a real cardiology note coded live                      | clinical |
| `Benchmark`    | MIMIC-IV top-50 Macro-F1, +64% delta, arXiv badge      | investors/research |
| `Deployment`   | 119M params, on-prem, HIPAA, traceable                 | hospitals|
| `Platform`     | ShifaMind is just the first; the Roshan AI platform    | investors|
| `Closing`      | sign-off + CTA (paper · access · roshan-ai.com)        | all      |

Continuity: a single `Backdrop` (dot grid + drifting teal glow) sits behind
the whole piece; segments are content-only and cross-fade over it via
`@remotion/transitions`, so it reads as one film.

Sound: the timing is laid out on a steady pulse with marked "sound slots" in
each segment's header comment, so subtle sound design (no music bed, no VO)
can be dropped onto the beats later.

## Preview & render

```bash
# Interactive studio
npx remotion studio

# Render the full film (normal terminal)
npx remotion render Full out/shifamind.mp4

# Render via the Node API - recommended for CI / non-interactive shells,
# where the CLI progress bar can crash (String.repeat(-1) on a zero-width
# terminal). Takes the same composition id + output path.
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

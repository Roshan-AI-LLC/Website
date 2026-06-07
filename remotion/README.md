# ShifaMind launch video (Remotion)

A single ~57-second motion piece for ShifaMind, animated entirely from
scratch at 1920×1080 / 30fps. No video recordings or new assets — it reuses
the website's brand tokens, fonts, logo, demo data, and benchmark numbers.

This project is fully isolated from the Vite website build: it lives in
`remotion/`, has its own `tsconfig.json`, and is not part of `src/`, so the
website's `tsc -b` / SSG build never touches it.

## Compositions

`Full` is the assembled piece. Each segment is also registered on its own
for isolated preview / render:

| id           | segment                                  |
| ------------ | ---------------------------------------- |
| `Full`       | the whole video (all 8 segments)         |
| `Problem`    | 1 · denial rate / coder shortage / EU AI Act |
| `Gap`        | 2 · frontier LLMs vs. research models    |
| `Reveal`     | 3 · logo + tagline                       |
| `GlassBox`   | 4 · black box → glass cube (concept nodes) |
| `Demo`       | 5 · live coding of the cardiology note   |
| `Benchmark`  | 6 · MIMIC-IV top-50 Macro-F1 bar chart   |
| `Compliance` | 7 · deployment / compliance points       |
| `Closing`    | 8 · logo + roshan-ai.com                 |

## Preview & render

```bash
# Interactive studio
npx remotion studio

# Render the full video
npx remotion render Full out/shifamind.mp4

# Render a single segment
npx remotion render Demo out/demo.mp4
```

`out/` is gitignored — render artifacts are not committed.

### Rendering in a sandbox without Chrome download access

Remotion downloads its own Chrome Headless Shell on first render. If that
download is blocked, point it at an existing Chromium **headless shell**
binary (the full `chrome` binary won't work — it has removed the old
headless mode Remotion uses):

```bash
npx remotion render Full out/shifamind.mp4 \
  --browser-executable=/path/to/chromium_headless_shell/headless_shell
```

## Notes

- Fonts (Tomorrow + Inter) are loaded from the website's `public/fonts`
  via `load-fonts.ts`, under a `delayRender` with `retries` so a stalled
  font fetch on a recycled render worker is retried rather than failing the
  render.
- All brand values live in `theme.ts` (mirrored from `src/index.css`'s
  `html.dark` block). Background is always pure black; teal `#4ecdc4` is the
  only accent. Competitor brand marks keep their original colors.
- Demo content comes from the cardiology scenario in
  `src/data/shifamindScenarios.ts`; benchmark numbers and brand marks from
  `src/components/BenchmarkChart.tsx` and `src/components/brand-marks.tsx`.

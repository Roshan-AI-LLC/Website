# ShifaMind launch film (Remotion)

The debut film for ShifaMind, the flagship model of the Roshan AI platform.
Animated entirely from scratch — no video recordings. It reuses the website's
brand tokens, fonts, logo, demo data, and benchmark numbers.

There are **two cuts**, both 1920×1080 / 30fps, sharing one foundation
(`theme.ts`, `motion.ts`, `data/*`, and the components in `components/`):

| id      | name  | length | approach |
| ------- | ----- | ------ | -------- |
| `Full`  | TRACE | ~72.5s | evolves the original segment-based film |
| `Glass` | GLASS | ~106s  | from-scratch, one continuous-camera flight |

Both tell **one note's journey** — a single clinical note followed from the
night it's written (pre-context) through ShifaMind's reasoning to the insurance
denial it prevents (post-context) — and are built to land for every audience
(clinicians, researchers, founders, investors, recruiters), with minimal text:
the story is shown via animation and counting numbers, not paragraphs.

This project is isolated from the Vite website build: it lives in `remotion/`,
has its own `tsconfig.json`, and is not part of `src/`.

## Shared foundation

- `motion.ts` — the ONE motion signature (springs, stagger, easing, 100bpm beat
  grid). Every segment imports from here so the whole piece moves as one hand.
- `theme.ts` — brand tokens. Teal `#4ecdc4` is the system; the warm `human`
  tone is used only for the patient thread in GLASS.
- `components/Hud.tsx` — persistent HUD chrome (corner ticks, live pulse-dot +
  wordmark, running chapter label, progress rail), on screen the whole film.
- `components/ScanLine.tsx` — the signature scan/reading + transition primitive.
- `components/Quadrant.tsx` — Accuracy × Interpretability scatter (the LAAT
  reframe: ShifaMind rises alone into the "accurate AND auditable" corner).
- `components/Receipts.tsx` — the interpretability metrics (CSTPR/CIM/CCR)
  counting up — numbers a general LLM can't produce.
- `components/AuditGate.tsx` — the post-context payoff: a coded, evidenced claim
  clears the payer's audit gate (the denial that doesn't happen).
- `components/PlatformStack.tsx` — the 5-layer platform reveal ("ShifaMind is
  the first").
- `data/benchmark.tsx` (pure data, incl. LAAT 0.711), `data/metrics.ts`,
  `data/scenario.ts` (the cardiology note), `data/scenarios.ts` (multi-specialty).

## TRACE (`Full`)

Eleven content-only segments play back-to-back in a `Series` over one persistent
`Backdrop` + `Hud`; each does a "lift and settle" (`components/Segment.tsx`) and
the through-line element is composed to sit at the same place across each seam:

`ColdOpen` (the problem; a note is born → condense to a point) → `Reveal`
(blooms into the logo; "explains itself") → `GlassBox` (evidence streams into
the box) → `Architecture` (the MCB; the shortcut "ghost path" is blocked) →
`Demo` (cursor clicks Predict; note → concepts → code) → `Breadth` (works across
cardiology/pulmonology/ED + you can interrogate it) → `Benchmark` (bars, LAAT
added) → `Proof` (the quadrant + the receipts) → `Downstream` (the denial that
doesn't happen) → `Compliance` (compact/on-prem/HIPAA + the platform stack) →
`Closing` (sign-off + roshan-ai.com).

Each segment is also registered standalone (wrapped in the backdrop) for
isolated preview.

## GLASS (`glass/`)

A from-scratch continuous-camera cut: one unbroken forward flight (a camera
wrapper with a perpetual scale push), acts cross-dissolved over overlapping
windows with shared match-cut anchors at the seams, and a two-color story (warm
human → teal system). Nine acts: `Field` (a galaxy of denied claims → fall into
one person) → `Intake` → `GlassBox` (the bottleneck) → `Verdict` → `Discuss` →
`Proof` → `Downstream` → `Platform` → `SignOff`. Assembled in `glass/Glass.tsx`
(timings/chapters in `glass/shared.ts`).

## Preview & render

```bash
# Interactive studio (both cuts + all segments show up in the sidebar)
npx remotion studio

# Render each cut (Node API — reliable in any shell). Output is 4K (2x scale).
node remotion/render.mjs Full  out/trace.mp4
node remotion/render.mjs Glass out/glass.mp4

# Or render both at once:
bash remotion/finalize.sh
```

Both cuts are **silent** by design — score them in your editor. `out/` is
gitignored. (`make-audio.py` is a stale score for an earlier edit; ignore it
until you want to regenerate audio against the current boundaries.)

### Rendering without Chrome download access

Remotion downloads its own Chrome Headless Shell on first render. If blocked,
point it at an existing Chromium **headless shell**:

```bash
node remotion/render.mjs Full out/trace.mp4 \
  # CLI form: npx remotion render Full out/trace.mp4 --browser-executable=/path/to/headless_shell
REMOTION_BROWSER=/path/to/headless_shell node remotion/render.mjs Glass out/glass.mp4
```

## Notes

- Fonts (Tomorrow + Inter) load from embedded base64 (`fonts-embedded.ts`) via
  `load-fonts.ts`, so renders don't depend on a network fetch.
- All brand values live in `theme.ts` (mirrored from `src/index.css`). Keep JSX
  OUT of `data/*` modules — store data + a discriminator and render marks in the
  segments (a data-module JSX element flips the JSX runtime to classic and
  breaks the bundle).
- The benchmark's `interp` axis values are an editorial qualitative positioning
  for the quadrant, not measured metrics — tune in `data/benchmark.tsx`.

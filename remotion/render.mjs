/**
 * Programmatic renderer for the ShifaMind film.
 *
 * Why this exists: the Remotion CLI's progress bar crashes in a zero-width,
 * non-TTY shell (String.repeat(-1) in makeProgressBar). The Node API takes
 * its own onProgress callback, so it renders reliably anywhere (CI, web
 * sessions, etc). On a normal terminal `npx remotion render Full out/...`
 * works fine too.
 *
 * Usage:
 *   node remotion/render.mjs [compositionId] [outFile]
 *   REMOTION_BROWSER=/path/to/headless_shell node remotion/render.mjs
 */
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'node:path';

const id = process.argv[2] ?? 'Full';
const outputLocation = process.argv[3] ?? 'out/shifamind.mp4';
const browserExecutable = process.env.REMOTION_BROWSER || null;

console.log(`Bundling…`);
const serveUrl = await bundle({
  entryPoint: path.resolve('remotion/index.ts'),
});

console.log(`Selecting composition "${id}"…`);
const composition = await selectComposition({ serveUrl, id, browserExecutable });

let last = -5;
await renderMedia({
  serveUrl,
  composition,
  codec: 'h264',
  crf: 18,
  outputLocation,
  browserExecutable,
  // Per-frame delayRender budget; font loading also self-retries (see
  // load-fonts.ts) so a stalled fetch on a recycled worker recovers.
  timeoutInMilliseconds: 60000,
  onProgress: ({ progress }) => {
    const pct = Math.round(progress * 100);
    if (pct >= last + 5) {
      last = pct;
      console.log(`  ${pct}%`);
    }
  },
});

console.log(`Done → ${outputLocation}`);

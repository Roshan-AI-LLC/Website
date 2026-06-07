/**
 * Loads the self-hosted brand faces (Tomorrow + Inter) straight from the
 * website's public/fonts directory, so the video matches the site exactly
 * and renders fully offline.
 *
 * Loaded by hand (FontFace API) under a single delayRender we control. The
 * key for reliable rendering is `retries`: if a render worker reloads its
 * page mid-render and a font fetch stalls, Remotion re-renders that frame
 * (re-evaluating this module) instead of wedging on an uncleared
 * delayRender. Note: a wall-clock setTimeout safety does NOT work here -
 * Remotion mocks timers to the composition clock during frame capture.
 */
import { continueRender, delayRender, staticFile } from 'remotion';

type FaceDef = { family: string; url: string; weight: string };

const FACES: FaceDef[] = [
  { family: 'Tomorrow', url: 'fonts/Tomorrow/Tomorrow-Regular.ttf', weight: '400' },
  { family: 'Tomorrow', url: 'fonts/Tomorrow/Tomorrow-Medium.ttf', weight: '500' },
  { family: 'Tomorrow', url: 'fonts/Tomorrow/Tomorrow-SemiBold.ttf', weight: '600' },
  { family: 'Tomorrow', url: 'fonts/Tomorrow/Tomorrow-Bold.ttf', weight: '700' },
  { family: 'Inter', url: 'fonts/Inter/Inter-VariableFont_opsz,wght.ttf', weight: '100 900' },
];

// Only runs in the browser bundle Remotion renders in.
if (typeof document !== 'undefined' && typeof FontFace !== 'undefined') {
  const handle = delayRender('Loading brand fonts', {
    timeoutInMilliseconds: 10000,
    retries: 6,
  });

  Promise.all(
    FACES.map(async (f) => {
      const face = new FontFace(f.family, `url('${staticFile(f.url)}') format('truetype')`, {
        weight: f.weight,
        display: 'block',
      });
      await face.load();
      (document.fonts as FontFaceSet).add(face);
    }),
  )
    .then(() => continueRender(handle))
    .catch((err) => {
      // Last resort: fall back to system fonts rather than failing the render.
      // eslint-disable-next-line no-console
      console.error('Font load failed, falling back to system fonts:', err);
      continueRender(handle);
    });
}

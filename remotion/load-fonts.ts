/**
 * Loads the brand faces (Tomorrow + Inter) from embedded base64 data URIs
 * (see fonts-embedded.ts). Because there's no network fetch, FontFace
 * resolves instantly and reliably on every render-worker page reload - which
 * eliminates the "Loading brand fonts" delayRender timeouts we hit under
 * concurrency, and therefore the retries + CLI progress-bar crash they caused.
 */
import { continueRender, delayRender } from 'remotion';
import {
  INTER_VAR,
  TOMORROW_400,
  TOMORROW_500,
  TOMORROW_600,
  TOMORROW_700,
} from './fonts-embedded';

const FACES: [string, string, string][] = [
  ['Tomorrow', TOMORROW_400, '400'],
  ['Tomorrow', TOMORROW_500, '500'],
  ['Tomorrow', TOMORROW_600, '600'],
  ['Tomorrow', TOMORROW_700, '700'],
  ['Inter', INTER_VAR, '100 900'],
];

if (typeof document !== 'undefined' && typeof FontFace !== 'undefined') {
  const handle = delayRender('Loading brand fonts', {
    timeoutInMilliseconds: 30000,
    retries: 2,
  });

  Promise.all(
    FACES.map(async ([family, src, weight]) => {
      const face = new FontFace(family, `url(${src}) format('truetype')`, {
        weight,
        display: 'block',
      });
      await face.load();
      (document.fonts as FontFaceSet).add(face);
    }),
  )
    .then(() => continueRender(handle))
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error('Font load failed, falling back to system fonts:', err);
      continueRender(handle);
    });
}

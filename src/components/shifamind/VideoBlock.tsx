import { useState } from 'react';
import { Play } from 'lucide-react';
import { SHIFAMIND_DEMO_VIDEO_ID } from '../../lib/config';

const TITLE = 'ShifaMind product walkthrough';

/**
 * Click-to-play YouTube facade: we render the poster frame only and swap in the
 * iframe on first interaction, so the player script (and its cookies) never load
 * for visitors who don't press play.
 */
export function VideoBlock() {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="glass relative aspect-video overflow-hidden rounded-2xl sm:rounded-3xl">
      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${SHIFAMIND_DEMO_VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`}
          title={TITLE}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play video: ${TITLE}`}
          className="group absolute inset-0 h-full w-full"
        >
          <img
            src={`https://i.ytimg.com/vi/${SHIFAMIND_DEMO_VIDEO_ID}/maxresdefault.jpg`}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          />
          <span
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, transparent 45%, color-mix(in oklab, #05100d 80%, transparent) 100%)',
            }}
          />
          {/* Bottom-left rather than centred: the poster frame is a title card
              with a centred wordmark, which a centred button would sit on top of.
              Phones: a smaller button tucked into the corner and no text label
              (the whole poster is the button, and its aria-label names it), so
              it clears the poster's tagline. */}
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-3 sm:bottom-6 sm:left-6">
            <span
              className="btn-primary inline-flex h-10 w-10 items-center justify-center rounded-full transition will-change-transform group-hover:scale-105 sm:h-12 sm:w-12"
            >
              <Play
                size={18}
                strokeWidth={2.2}
                className="ml-0.5"
                fill="currentColor"
              />
            </span>
            <span className="hidden text-[0.86rem] font-semibold text-white/90 sm:inline">
              Watch the walkthrough
            </span>
          </span>
        </button>
      )}
    </div>
  );
}

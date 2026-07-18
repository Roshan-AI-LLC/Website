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
    <div className="glass relative aspect-video overflow-hidden rounded-3xl">
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
                'linear-gradient(180deg, transparent 30%, color-mix(in oklab, #05100d 70%, transparent) 100%)',
            }}
          />
          <span
            className="absolute left-1/2 top-1/2 inline-flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition will-change-transform group-hover:scale-105"
            style={{
              background:
                'linear-gradient(135deg, var(--accent) 0%, var(--color-iris-500) 100%)',
              boxShadow: 'var(--shadow-glow)',
              color: 'var(--on-accent)',
            }}
          >
            <Play size={22} strokeWidth={2.2} className="ml-0.5" fill="currentColor" />
          </span>
        </button>
      )}
    </div>
  );
}

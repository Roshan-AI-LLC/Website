/**
 * NVIDIA Inception program badge.
 *
 * Usage rules baked in here. Do not "improve" them:
 *   - The SVG is NVIDIA's original artwork, unmodified. Never recolor it,
 *     never restretch it (width only, height auto), never alter its text.
 *   - The badge ships with its own white plate and black keyline, so it is
 *     rendered inside a white container that supplies the required clear
 *     space on both the cream and pure-black themes.
 *   - Minimum legible size is 110px wide. Do not go below it.
 *   - Never render it larger than the Roshan AI mark it sits beside.
 *   - Any page that shows this badge must also carry the NVIDIA legal line
 *     (see <NvidiaLegalLine /> below), which lives in the site footer.
 */

const BADGE_SRC = '/badges/nvidia-inception-badge-rgb.svg';
const INCEPTION_URL = 'https://www.nvidia.com/en-us/startups/';

type Props = {
  /** Rendered badge width in px. Kept >= 110 for legibility. */
  width?: number;
  className?: string;
  /** Wrap in a link to the NVIDIA Inception page. */
  link?: boolean;
};

export function InceptionBadge({
  width = 200,
  className = '',
  link = true,
}: Props) {
  const w = Math.max(110, width);
  // Clear space: ~7% of badge width on every side, per the badge guidelines.
  const pad = Math.round(w * 0.07);

  const img = (
    <span
      className="inline-flex rounded-lg"
      style={{
        background: '#ffffff',
        padding: `${pad}px`,
        boxShadow: '0 1px 2px rgba(11, 17, 32, 0.06), 0 8px 24px -14px rgba(11, 17, 32, 0.35)',
      }}
    >
      <img
        src={BADGE_SRC}
        alt="NVIDIA Inception Program badge"
        width={w}
        height={Math.round((w * 216) / 500.4288)}
        loading="lazy"
        decoding="async"
        style={{ width: w, height: 'auto', display: 'block' }}
      />
    </span>
  );

  if (!link) return <span className={className}>{img}</span>;

  return (
    <a
      href={INCEPTION_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Roshan AI is a member of the NVIDIA Inception program"
      className={`inline-flex transition-transform will-change-transform hover:-translate-y-0.5 ${className}`}
    >
      {img}
    </a>
  );
}

/**
 * Required NVIDIA legal attribution. Must appear anywhere the NVIDIA name,
 * logo, or a trademarked NVIDIA product is referenced. Trademarks listed
 * alphabetically after "the NVIDIA logo".
 */
export function NvidiaLegalLine({ className = '' }: { className?: string }) {
  return (
    <p className={className}>
      © {new Date().getFullYear()} NVIDIA, the NVIDIA logo, and NVIDIA
      Inception are trademarks and/or registered trademarks of NVIDIA
      Corporation in the U.S. and other countries.
    </p>
  );
}

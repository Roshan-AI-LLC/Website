/**
 * Claude Startups membership mark.
 *
 * Usage rules baked in here. Do not "improve" them:
 *   - Anthropic ships no member badge, and its logos need written permission,
 *     so this is text only, set in the site's own type. Never add the Claude
 *     or Anthropic logo.
 *   - It shares the NVIDIA Inception badge's footprint (same white plate, same
 *     aspect, same clear space at a given width), so the two sit as a matched
 *     pair. Pass the same `width` to both.
 *   - Copy says "member of", never "backed by", "partnered with" or "endorsed by".
 *   - The Anthropic trademark line lives in the site footer, on every page.
 */

const PROGRAM_URL = 'https://claude.com/programs/startups';

/** NVIDIA badge artwork aspect (216 / 500.4288), so both plates match. */
const ASPECT = 216 / 500.4288;

type Props = {
  /** Content width in px, as for InceptionBadge. */
  width?: number;
  className?: string;
  /** Wrap in a link to the program page. */
  link?: boolean;
};

export function ClaudeStartupsMark({ width = 200, className = '', link = true }: Props) {
  const w = Math.max(110, width);
  const h = Math.round(w * ASPECT);
  const pad = Math.round(w * 0.07);
  const fontSize = Math.round(w * 0.155);

  const plate = (
    <span
      className="inline-flex rounded-lg"
      style={{
        background: '#ffffff',
        padding: `${pad}px`,
        boxShadow: '0 1px 2px rgba(11, 17, 32, 0.06), 0 8px 24px -14px rgba(11, 17, 32, 0.35)',
      }}
    >
      <span
        className="flex flex-col items-center justify-center font-display leading-none tracking-[-0.02em]"
        style={{ width: w, height: h, fontSize, color: '#0b1120' }}
      >
        <span className="font-semibold">Claude</span>
        <span className="mt-[0.18em] font-medium" style={{ color: 'rgba(11, 17, 32, 0.62)' }}>
          Startups
        </span>
      </span>
    </span>
  );

  if (!link) return <span className={className}>{plate}</span>;

  return (
    <a
      href={PROGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Roshan AI is a member of Claude Startups, Anthropic's program for early-stage founders"
      className={`inline-flex transition-transform will-change-transform hover:-translate-y-0.5 ${className}`}
    >
      {plate}
    </a>
  );
}

/** Trademark attribution for the Claude and Anthropic names. Rendered in the footer. */
export function AnthropicLegalLine({ className = '' }: { className?: string }) {
  return (
    <p className={className}>
      Claude and Anthropic are trademarks of Anthropic, PBC. Membership in
      Claude Startups does not imply endorsement by Anthropic.
    </p>
  );
}

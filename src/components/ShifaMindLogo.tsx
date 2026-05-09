type Props = {
  size?: number;
  className?: string;
  /** Render as a chip with the wordmark next to the mark */
  withWordmark?: boolean;
};

/**
 * ShifaMind brand mark. Designed as a chamfered teal tile with a stylized
 * white S. Drop a real logo into /public/shifamind-logo.svg to override the
 * file-based usages; this component remains the inline source of truth.
 */
export function ShifaMindLogo({ size = 28, className = '', withWordmark = false }: Props) {
  const radius = Math.round(size * 0.25);

  const mark = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      role="img"
      aria-label="ShifaMind"
    >
      <rect width="32" height="32" rx={radius / (size / 32)} fill="#4ecdc4" />
      <path
        d="M22 11.5 C22 9 20 8 17.5 8 L13 8 C10.5 8 9 9.5 9 11.5 C9 13.5 10.5 15 13 15 L19 15 C21.5 15 23 16.5 23 19 C23 22 21 24 18 24 L13 24 C10.5 24 9 22.5 9 20.5"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  if (!withWordmark) return mark;

  return (
    <span className="inline-flex items-center gap-2 align-middle">
      {mark}
      <span
        className="font-semibold tracking-tight"
        style={{ fontSize: size * 0.65, lineHeight: 1, letterSpacing: '-0.02em' }}
      >
        ShifaMind
      </span>
    </span>
  );
}

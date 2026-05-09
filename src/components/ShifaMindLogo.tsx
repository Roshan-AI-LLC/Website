type Props = {
  size?: number;
  className?: string;
  /** Render with the wordmark next to the mark */
  withWordmark?: boolean;
  /** Round the mark to soften the corners. Defaults to a small radius. */
  rounded?: boolean;
};

/**
 * Renders the ShifaMind brand mark from /public/shifamind-logo.svg, so dropping
 * a new file at that path updates every usage automatically. Optionally pairs
 * the mark with the ShifaMind wordmark.
 */
export function ShifaMindLogo({
  size = 28,
  className = '',
  withWordmark = false,
  rounded = true,
}: Props) {
  const radius = rounded ? Math.round(size * 0.2) : 0;

  const mark = (
    <img
      src="/shifamind-logo.svg"
      alt="ShifaMind"
      width={size}
      height={size}
      decoding="async"
      loading="eager"
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        objectFit: 'cover',
        display: 'block',
      }}
    />
  );

  if (!withWordmark) return mark;

  return (
    <span className="inline-flex items-center gap-2 align-middle">
      {mark}
      <span
        className="font-semibold tracking-tight"
        style={{
          fontSize: size * 0.65,
          lineHeight: 1,
          letterSpacing: '-0.02em',
        }}
      >
        ShifaMind
      </span>
    </span>
  );
}

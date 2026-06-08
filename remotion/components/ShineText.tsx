/**
 * A single specular sheen that sweeps across text once, clipped to the letter
 * shapes (background-clip: text). Premium when subtle - used on the ShifaMind
 * wordmark as it resolves.
 */
import type { CSSProperties } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export const ShineText: React.FC<{
  children: string;
  appearAt: number;
  duration?: number;
  style?: CSSProperties;
}> = ({ children, appearAt, duration = 36, style }) => {
  const frame = useCurrentFrame();
  const local = frame - appearAt;
  const pos = interpolate(local, [0, duration], [-130, 230], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const active = local >= 0 && local <= duration;

  return (
    <div style={{ position: 'relative', display: 'inline-block', ...style }}>
      <span>{children}</span>
      {active && (
        <span
          aria-hidden
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            color: 'transparent',
            whiteSpace: 'pre',
            backgroundImage:
              'linear-gradient(105deg, transparent 42%, rgba(255,255,255,0.92) 50%, transparent 58%)',
            backgroundSize: '220% 100%',
            backgroundPositionX: `${pos}%`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
          }}
        >
          {children}
        </span>
      )}
    </div>
  );
};

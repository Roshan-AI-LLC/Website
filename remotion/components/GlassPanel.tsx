/**
 * Glass panel matching the site's `.glass` surface: faint white fill,
 * hairline border (optionally teal), rounded. A thin style primitive — pass
 * any extra style overrides.
 */
import type { CSSProperties } from 'react';
import { COLORS } from '../theme';

export const GlassPanel: React.FC<{
  children?: React.ReactNode;
  style?: CSSProperties;
  /** Use a teal hairline border instead of the neutral one. */
  teal?: boolean;
  radius?: number;
}> = ({ children, style, teal = false, radius = 24 }) => {
  return (
    <div
      style={{
        background: COLORS.glass,
        border: `1px solid ${teal ? COLORS.borderTeal : COLORS.borderSubtle}`,
        borderRadius: radius,
        backdropFilter: 'blur(8px)',
        boxShadow: teal
          ? `0 0 0 1px ${COLORS.accentSofter}, 0 30px 80px -40px ${COLORS.accent}`
          : '0 30px 80px -50px rgba(0,0,0,0.9)',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

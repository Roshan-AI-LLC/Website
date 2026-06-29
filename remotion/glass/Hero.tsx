/**
 * The film's single text primitive. Hero lines are the ONLY real copy in GLASS
 * (chapter labels live in the Hud). One rise-in, one settle, optional warm tint
 * for the human thread. Positioned by the caller; defaults to lower-third.
 */
import { useCurrentFrame } from 'remotion';
import { COLORS, FONTS } from '../theme';
import { riseIn } from '../motion';

export const Hero: React.FC<{
  text: string;
  appearAt: number;
  /** lower-third by default; pass to override vertical placement. */
  bottom?: number;
  top?: number;
  size?: number;
  /** warm = the human thread; default teal-leaning white. */
  warm?: boolean;
  mono?: boolean;
  /** hold then fade out; if omitted, stays. */
  fadeOutAt?: number;
}> = ({ text, appearAt, bottom = 168, top, size = 52, warm = false, mono = false, fadeOutAt }) => {
  const frame = useCurrentFrame();
  const local = frame - appearAt;
  const { opacity, y } = riseIn(local, 26, 16);
  const out = fadeOutAt !== undefined && frame > fadeOutAt
    ? Math.max(0, 1 - (frame - fadeOutAt) / 16)
    : 1;

  const color = warm ? COLORS.humanStrong : COLORS.textPrimary;

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        ...(top !== undefined ? { top } : { bottom }),
        textAlign: 'center',
        opacity: opacity * out,
        transform: `translateY(${y}px)`,
        fontFamily: mono ? FONTS.mono : FONTS.display,
        fontSize: size,
        fontWeight: mono ? 400 : 600,
        letterSpacing: mono ? '0.04em' : '-0.02em',
        color,
        textShadow: warm
          ? `0 0 34px ${COLORS.humanSoft}`
          : `0 0 30px ${COLORS.accentSofter}`,
        padding: '0 120px',
      }}
    >
      {text}
    </div>
  );
};

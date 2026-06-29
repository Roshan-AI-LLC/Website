/**
 * Segment 1 · COLD OPEN. Replaces the old Hook + Stakes + Gap (14s) with a
 * single 5.5s kinetic-type sequence. Four fast beats, words slamming in one
 * by one, ending on the thesis. Built to stop a scroll in the first seconds.
 *
 * Beats (frames @30fps, 210 total):
 *   0-44    "$262B in claims denied last year."     (source: Change Healthcare)
 *   46-90   "The fix? A black box."
 *   92-136  "Medicine doesn't just need predictions."
 *   138-210 "It needs reasons."                      (held, teal, ring pulse)
 */
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { COLORS, FONTS } from '../theme';
import { softGlow } from './../components/TealGlow';

type Beat = {
  at: number;
  out: number; // frame the beat starts exiting (last beat never exits)
  words: { t: string; accent?: boolean }[];
  size: number;
  source?: string;
};

const BEATS: Beat[] = [
  {
    at: 0,
    out: 44,
    size: 110,
    words: [
      { t: '$262B', accent: true },
      { t: 'in' },
      { t: 'claims' },
      { t: 'denied' },
      { t: 'last' },
      { t: 'year.' },
    ],
    source: 'Change Healthcare · 2024',
  },
  {
    at: 46,
    out: 90,
    size: 100,
    words: [
      { t: 'The' },
      { t: 'fix?' },
      { t: 'A' },
      { t: 'black', accent: true },
      { t: 'box.', accent: true },
    ],
  },
  {
    at: 92,
    out: 136,
    size: 78,
    words: [
      { t: 'Medicine' },
      { t: "doesn't" },
      { t: 'just' },
      { t: 'need' },
      { t: 'predictions.' },
    ],
  },
  {
    at: 138,
    out: 9999,
    size: 124,
    words: [{ t: 'It' }, { t: 'needs' }, { t: 'reasons.', accent: true }],
  },
];

const WORD_STAGGER = 4;

const Word: React.FC<{ word: Beat['words'][number]; appearAt: number; size: number }> = ({
  word,
  appearAt,
  size,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - appearAt;
  const s = spring({ frame: local, fps, config: { damping: 16, stiffness: 240, mass: 0.5 } });
  const opacity = interpolate(local, [0, 4], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const scale = interpolate(s, [0, 1], [1.22, 1]);
  return (
    <span
      style={{
        display: 'inline-block',
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: '50% 80%',
        color: word.accent ? COLORS.accent : COLORS.textPrimary,
        textShadow: word.accent ? `0 0 70px ${COLORS.accentSoft}` : undefined,
        fontSize: size,
        marginRight: size * 0.26,
      }}
    >
      {word.t}
    </span>
  );
};

const BeatLine: React.FC<{ beat: Beat }> = ({ beat }) => {
  const frame = useCurrentFrame();
  if (frame < beat.at - 2) return null;

  // Fast exit: lift + blur out over 8 frames.
  const exitP = interpolate(frame, [beat.out, beat.out + 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });
  if (exitP >= 1) return null;

  const sourceO = beat.source
    ? interpolate(frame, [beat.at + 16, beat.at + 24], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 1 - exitP,
        transform: `translateY(${exitP * -36}px) scale(${1 + exitP * 0.04})`,
        filter: exitP > 0.05 ? `blur(${exitP * 10}px)` : undefined,
      }}
    >
      <div
        style={{
          textAlign: 'center',
          padding: '0 140px',
          fontFamily: FONTS.display,
          fontWeight: 700,
          letterSpacing: '-0.025em',
          lineHeight: 1.12,
        }}
      >
        {beat.words.map((w, i) => (
          <Word key={i} word={w} appearAt={beat.at + i * WORD_STAGGER} size={beat.size} />
        ))}
      </div>
      {beat.source && (
        <div
          style={{
            position: 'absolute',
            bottom: 150,
            left: 0,
            right: 0,
            textAlign: 'center',
            opacity: sourceO,
            fontFamily: FONTS.mono,
            fontSize: 19,
            letterSpacing: '0.1em',
            color: COLORS.textMuted,
          }}
        >
          Source: {beat.source}
        </div>
      )}
    </AbsoluteFill>
  );
};

export const ColdOpen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Thesis beat: glow + expanding ring under "It needs reasons."
  const FINAL = BEATS[3].at;
  const pulse = spring({ frame: frame - FINAL, fps, config: { damping: 200, stiffness: 40, mass: 1 } });
  const glow = interpolate(pulse, [0, 1], [0, 0.55]);
  const ring = interpolate(pulse, [0, 1], [0, 1]);

  // Tiny brand kicker, persistent from beat 3 onward.
  const kickerO = interpolate(frame, [BEATS[2].at, BEATS[2].at + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Everything condenses to a single point that the Reveal blooms the logo from.
  const condense = interpolate(frame, [214, 250], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });

  return (
    <AbsoluteFill>
      {frame >= FINAL && (
        <>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 1100,
              height: 820,
              transform: 'translate(-50%, -50%)',
              background: softGlow(COLORS.accent),
              opacity: glow * 0.6,
              filter: 'blur(90px)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 8 + ring * 560,
              height: 8 + ring * 560,
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              border: `1px solid rgba(78,205,196,${0.25 * (1 - ring)})`,
            }}
          />
        </>
      )}

      <div
        style={{
          position: 'absolute',
          top: 108,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: kickerO,
          fontFamily: FONTS.mono,
          fontSize: 21,
          letterSpacing: '0.42em',
          textTransform: 'uppercase',
          color: COLORS.accent,
          paddingLeft: '0.42em',
        }}
      >
        Roshan AI
      </div>

      {BEATS.map((b, i) => (
        <BeatLine key={i} beat={b} />
      ))}

      {/* Condense to a single point (handed to Reveal). */}
      {condense > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 10 + condense * 26,
            height: 10 + condense * 26,
            borderRadius: '50%',
            background: COLORS.accentStrong,
            opacity: condense,
            boxShadow: `0 0 ${30 + condense * 80}px ${condense * 26}px ${COLORS.accentSoft}`,
          }}
        />
      )}
    </AbsoluteFill>
  );
};

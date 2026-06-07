/**
 * Frame-driven recreation of the website's HUD cursor
 * (src/components/Cursor.tsx): a sharp white chevron with a teal stroke and
 * glow, plus a slow-rotating teal hex frame and a counter-rotating inner
 * accent that bloom on hover. Driven by numeric `hover` / `press` (0..1) so
 * the state changes animate smoothly from the timeline.
 *
 * The chevron tip sits exactly at (x, y).
 */
import { useCurrentFrame } from 'remotion';

const TEAL = '#4ecdc4';

const TICKS: [number, number, number, number][] = [
  [20, 3, 0, -2.5],
  [35, 11.5, 2.2, -1.3],
  [35, 28.5, 2.2, 1.3],
  [20, 37, 0, 2.5],
  [5, 28.5, -2.2, 1.3],
  [5, 11.5, -2.2, -1.3],
];

export const Cursor: React.FC<{
  x: number;
  y: number;
  hover?: number;
  press?: number;
  opacity?: number;
  scale?: number;
}> = ({ x, y, hover = 0, press = 0, opacity = 1, scale = 1.9 }) => {
  const frame = useCurrentFrame();
  const spin = (frame / (6 * 30)) * 360; // 6s / rev
  const spinRev = -(frame / (4 * 30)) * 360; // 4s / rev, reversed
  const arrowScale = 1 + 0.18 * hover - 0.18 * press;

  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`,
        opacity,
        pointerEvents: 'none',
      }}
    >
      <div style={{ transform: `scale(${scale})`, transformOrigin: '0 0' }}>
        {/* Outer rotating hex frame */}
        <div
          style={{
            position: 'absolute',
            left: -22,
            top: -22,
            width: 44,
            height: 44,
            opacity: hover,
            transform: `scale(${0.55 + 0.45 * hover})`,
            transformOrigin: 'center',
          }}
        >
          <svg
            width="44"
            height="44"
            viewBox="0 0 40 40"
            style={{
              display: 'block',
              transform: `rotate(${spin}deg)`,
              transformOrigin: '20px 20px',
              filter: `drop-shadow(0 0 6px ${TEAL})`,
            }}
          >
            <polygon
              points="20,3 35,11.5 35,28.5 20,37 5,28.5 5,11.5"
              fill="none"
              stroke={TEAL}
              strokeOpacity="0.85"
              strokeWidth="1.1"
              strokeLinejoin="miter"
            />
            {TICKS.map(([px, py, dx, dy], i) => (
              <line
                key={i}
                x1={px}
                y1={py}
                x2={px + dx}
                y2={py + dy}
                stroke={TEAL}
                strokeOpacity="0.95"
                strokeWidth="1.4"
                strokeLinecap="square"
              />
            ))}
          </svg>
        </div>

        {/* Counter-rotating inner accent */}
        <div
          style={{
            position: 'absolute',
            left: -10,
            top: -10,
            width: 20,
            height: 20,
            opacity: 0.85 * hover,
            transform: `scale(${0.6 + 0.4 * hover})`,
            transformOrigin: 'center',
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            style={{ display: 'block', transform: `rotate(${spinRev}deg)`, transformOrigin: '10px 10px' }}
          >
            <path d="M2 6 L4 4 L8 4" fill="none" stroke={TEAL} strokeWidth="1" strokeOpacity="0.7" />
            <path d="M18 14 L16 16 L12 16" fill="none" stroke={TEAL} strokeWidth="1" strokeOpacity="0.7" />
          </svg>
        </div>

        {/* Main chevron, tip at (0,0) */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            transform: `scale(${arrowScale})`,
            transformOrigin: '0 0',
            filter:
              hover > 0.3
                ? `drop-shadow(0 0 8px ${TEAL}) drop-shadow(0 0 2px rgba(255,255,255,0.5))`
                : `drop-shadow(0 0 5px rgba(78,205,196,0.5))`,
          }}
        >
          <path
            d="M0 0 L15 9 L9 10.2 L7 16 Z"
            fill="#fff"
            stroke={TEAL}
            strokeWidth="1"
            strokeLinejoin="miter"
            strokeLinecap="square"
          />
          <path d="M2 1.6 L11 7" stroke={TEAL} strokeOpacity="0.9" strokeWidth="0.9" fill="none" strokeLinecap="square" />
        </svg>
      </div>
    </div>
  );
};

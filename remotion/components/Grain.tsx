/**
 * Animated fine grain, layered ABOVE all content. Purpose: dithering. The
 * film is full of huge, very dark soft gradients; at 8-bit those quantize
 * into visible concentric rings. A static overlay-blend grain can't fix that
 * (overlay ~= no-op on near-black, and the encoder smooths static texture
 * away). This one uses screen blend (adds a few luma levels exactly where
 * the rings live - in the shadows) and jitters position every frame so h264
 * is forced to keep it. Reads as subtle film grain.
 */
import { AbsoluteFill, useCurrentFrame } from 'remotion';

const GRAIN =
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E` +
  `%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E` +
  `%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E` +
  `%3Crect width='256' height='256' filter='url(%23n)'/%3E%3C/svg%3E")`;

// Pseudo-random tile offsets, cycled per frame.
const OFFSETS: [number, number][] = [
  [0, 0], [97, 41], [23, 163], [181, 89], [59, 211], [139, 17], [211, 127], [37, 73],
];

export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const [ox, oy] = OFFSETS[frame % OFFSETS.length];
  return (
    <AbsoluteFill
      style={{
        backgroundImage: GRAIN,
        backgroundRepeat: 'repeat',
        backgroundPosition: `${ox}px ${oy}px`,
        opacity: 0.032,
        mixBlendMode: 'screen',
        pointerEvents: 'none',
      }}
    />
  );
};

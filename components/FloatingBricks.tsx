import type { CSSProperties } from 'react';
import type { BrickColor } from '@/data/profile';

type Brick = {
  color: BrickColor;
  block: string; // pixel block texture used in the night theme
  x: string;
  y: string;
  w: number;
  h: number;
  r: number;
  dur: number;
  depth: number;
};

const BRICKS: Brick[] = [
  { color: 'yellow', block: 'mc-gold', x: '2%', y: '10%', w: 70, h: 38, r: -14, dur: 4.2, depth: 18 },
  { color: 'green', block: 'mc-grass', x: '84%', y: '4%', w: 52, h: 32, r: 12, dur: 3.6, depth: 26 },
  { color: 'red', block: 'mc-redstone', x: '88%', y: '62%', w: 44, h: 28, r: -8, dur: 4.8, depth: 14 },
  { color: 'blue', block: 'mc-diamond', x: '-2%', y: '70%', w: 58, h: 34, r: 10, dur: 3.9, depth: 22 },
  { color: 'yellow', block: 'mc-planks', x: '60%', y: '-2%', w: 36, h: 24, r: 20, dur: 5.2, depth: 30 },
];

/**
 * Tilted toy bricks that drop in, bob, and drift with the pointer (--mx/--my).
 * In the night theme each one is a pixel block instead.
 */
export function FloatingBricks() {
  return (
    <div className="bs-floaters" aria-hidden="true">
      {BRICKS.map((b, i) => (
        <div
          key={i}
          className="bs-floater"
          style={
            {
              '--x': b.x,
              '--y': b.y,
              '--d': b.depth,
            } as CSSProperties
          }
        >
          <div className="bs-floater-inner" style={{ '--i': i, '--dur': `${b.dur}s` } as CSSProperties}>
            <div
              className={`bs-brick bs-brick--${b.color} bs-day`}
              style={{ '--w': `${b.w}px`, '--h': `${b.h}px`, '--r': `${b.r}deg` } as CSSProperties}
            />
            <div
              className="bs-cube bs-night"
              style={{ '--s': `${Math.round(b.h * 1.25)}px`, '--r': `${b.r}deg`, backgroundImage: `url(/textures/${b.block}.svg)` } as CSSProperties}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

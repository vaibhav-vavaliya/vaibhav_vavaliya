import type { CSSProperties } from 'react';
import { profile } from '@/data/profile';

const HEART = ['.RR.RR.', 'RWRRRRR', 'RRRRRRD', '.RRRRD.', '..RRD..', '...D...'];
const COLOR: Record<string, string> = { R: '#ff3b3b', W: '#ffc2c2', D: '#b3141a' };

/** One pixel heart, beating. */
export function PixelHeart() {
  return (
    <svg className="bs-heart-px" viewBox="0 0 7 6" shapeRendering="crispEdges" aria-hidden="true">
      {HEART.flatMap((row, y) =>
        [...row].map((k, x) => (COLOR[k] ? <rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill={COLOR[k]} /> : null)),
      )}
    </svg>
  );
}

/** The availability chip: one heart and the status from profile.ts. */
export function StatusChip({ className = '', style }: { className?: string; style?: CSSProperties }) {
  return (
    <span className={`bs-chip bs-status ${className}`} style={style}>
      <PixelHeart />
      {profile.status}
    </span>
  );
}

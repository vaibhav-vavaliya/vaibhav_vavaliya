'use client';

import { useState } from 'react';
import { unlock } from './Achievements';

const FUR = '#f6efe2';
const PATCH = '#f0a35e';
const DARK = '#3a3a42';
const FACE = '#2a2321';

/** Cache, a calico cat lounging on the top edge of a card with its tail hanging over the front. */
export function CatPeek() {
  const [hi, setHi] = useState(false);

  const press = () => {
    setHi(true);
    unlock('Found Cache, the third cat');
    window.setTimeout(() => setHi(false), 2200);
  };

  return (
    <button type="button" className="bs-catpeek" onClick={press} aria-label="Cache the cat: say hi">
      <svg viewBox="0 0 140 80" aria-hidden="true">
        {/* tail hanging over the card's front edge */}
        <g className="bs-tail">
          <rect x={22} y={58} width={9} height={40} rx={4.5} fill={DARK} />
        </g>
        <rect x={24} y={48} width={84} height={24} rx={12} fill={FUR} />
        <rect x={40} y={48} width={22} height={12} rx={6} fill={PATCH} />
        <rect x={70} y={56} width={16} height={10} rx={5} fill={DARK} />
        {/* paws over the edge */}
        <rect x={86} y={66} width={12} height={12} rx={5} fill={FUR} />
        <rect x={100} y={66} width={12} height={12} rx={5} fill={FUR} />
        <g className="bs-catpeek-head">
          <polygon points="92,32 98,14 108,30" fill={PATCH} />
          <polygon points="114,30 124,14 130,32" fill={DARK} />
          <rect x={88} y={24} width={46} height={38} rx={13} fill={FUR} />
          <rect x={88} y={24} width={20} height={16} rx={8} fill={PATCH} />
          <rect className="bs-avatar-eye" x={98} y={40} width={5} height={7} rx={2.5} fill={FACE} />
          <rect className="bs-avatar-eye" x={118} y={40} width={5} height={7} rx={2.5} fill={FACE} />
          <rect x={108} y={49} width={6} height={4} rx={2} fill="#e5787a" />
        </g>
        {hi && (
          <g>
            <rect x={0} y={0} width={64} height={22} rx={7} fill="var(--bg-100)" stroke="var(--line)" strokeWidth={2} />
            <text x={10} y={15} className="bs-room-bubble-text">
              mew!
            </text>
          </g>
        )}
      </svg>
    </button>
  );
}

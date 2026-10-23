'use client';

import { useEffect, useState, type CSSProperties } from 'react';

const COLORS = ['var(--blue)', 'var(--green)', 'var(--yellow)', 'var(--red)'];
const EVENT = 'bs-confetti';

type Piece = { id: number; style: CSSProperties };

/** Fire a burst of brick confetti from a point on screen. */
export function fireConfetti(x: number, y: number) {
  if (typeof window === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { x, y } }));
}

/** Fire confetti from the centre of an element (e.g. the button that was clicked). */
export function fireConfettiFrom(el: Element | null) {
  if (!el) return;
  const box = el.getBoundingClientRect();
  fireConfetti(box.left + box.width / 2, box.top + box.height / 2);
}

export function Confetti() {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    let seq = 0;
    const onFire = (e: Event) => {
      const { x, y } = (e as CustomEvent<{ x: number; y: number }>).detail;
      const burst: Piece[] = Array.from({ length: 32 }, () => {
        const angle = Math.random() * Math.PI * 2;
        const dist = 90 + Math.random() * 170;
        return {
          id: ++seq,
          style: {
            '--x0': `${x}px`,
            '--y0': `${y}px`,
            '--dx': `${Math.cos(angle) * dist}px`,
            '--dy': `${Math.sin(angle) * dist + 120}px`,
            '--rot': `${Math.round(Math.random() * 720 - 360)}deg`,
            '--s': `${8 + Math.random() * 8}px`,
            '--c': COLORS[Math.floor(Math.random() * COLORS.length)],
          } as CSSProperties,
        };
      });
      const ids = new Set(burst.map((p) => p.id));
      setPieces((prev) => [...prev, ...burst]);
      window.setTimeout(() => setPieces((prev) => prev.filter((p) => !ids.has(p.id))), 1200);
    };
    window.addEventListener(EVENT, onFire);
    return () => window.removeEventListener(EVENT, onFire);
  }, []);

  if (!pieces.length) return null;
  return (
    <div className="bs-confetti" aria-hidden="true">
      {pieces.map((p) => (
        <i key={p.id} style={p.style} />
      ))}
    </div>
  );
}

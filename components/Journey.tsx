'use client';

import { useEffect, type CSSProperties } from 'react';
import { useInView } from '@/hooks/useReveal';
import { unlock } from './Achievements';
import type { Role } from '@/data/profile';

/** A path of blocks, one per role. The track draws in, then each block drops onto it. */
export function Journey({ roles }: { roles: Role[] }) {
  const { ref, inView } = useInView<HTMLOListElement>(0.25);

  useEffect(() => {
    if (!inView) return;
    const t = window.setTimeout(() => unlock('Explorer: found the journey'), roles.length * 260 + 600);
    return () => window.clearTimeout(t);
  }, [inView, roles.length]);

  return (
    <ol ref={ref} className={`bs-journey${inView ? ' is-in' : ''}`} style={{ '--steps': roles.length } as CSSProperties}>
      <li className="bs-journey-track" aria-hidden="true">
        <span />
      </li>
      {roles.map((r, n) => (
        <li key={r.title + r.place} className="bs-step" style={{ '--i': n } as CSSProperties}>
          <div className={`bs-step-block bs-fill-${r.color}`} aria-hidden="true">
            {roles.length - n}
          </div>
          <div className="bs-step-card bs-block">
            <span className="bs-meta">{r.period}</span>
            <h3>{r.title}</h3>
            <span className="bs-meta">{r.place}</span>
            <p>{r.note}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

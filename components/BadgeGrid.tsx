import type { CSSProperties } from 'react';
import type { Badge } from '@/data/profile';

const TIER_LABEL = { gold: 'Gold', silver: 'Silver', bronze: 'Bronze', locked: 'Locked' } as const;
const TIER_LORE = {
  gold: 'Daily driver. Shipped to production.',
  silver: 'Used it in real builds.',
  bronze: 'Built a few things with it.',
  locked: 'Learning this one now.',
} as const;

export function BadgeGrid({ badges }: { badges: Badge[] }) {
  return (
    <div className="bs-badge-tray" data-reveal>
      <ul className="bs-badges">
        {badges.map((b, n) => (
          <li key={b.name} className="bs-pop" style={{ '--i': n } as CSSProperties}>
            <div className={`bs-badge${b.tier === 'locked' ? ' bs-badge--locked' : ''}`} tabIndex={0}>
              <span className={`bs-tooltip bs-tooltip--${b.tier}`} role="tooltip">
                <b>{b.name}</b>
                {TIER_LORE[b.tier]}
                <em>{b.tier === 'locked' ? 'Currently mining…' : `${TIER_LABEL[b.tier]} tier`}</em>
              </span>
              <span className={`bs-gem bs-gem--${b.tier}`} aria-hidden="true">
                <span>{b.code}</span>
              </span>
              <span>
                <span className="bs-badge-name">{b.name}</span>
                <span className="bs-meta">{b.tier === 'locked' ? 'Locked · learning' : TIER_LABEL[b.tier]}</span>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BadgeLegend() {
  const items = [
    ['Gold', 'var(--yellow)'],
    ['Silver', '#c9ced8'],
    ['Bronze', '#e0a06a'],
    ['Locked', 'var(--bg-200)'],
  ];
  return (
    <div className="bs-legend bs-meta" aria-hidden="true">
      {items.map(([label, c]) => (
        <span key={label}>
          <i style={{ '--c': c } as CSSProperties} />
          {label}
        </span>
      ))}
    </div>
  );
}

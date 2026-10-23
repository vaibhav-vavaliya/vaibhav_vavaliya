import type { CSSProperties } from 'react';

type Props = { level: number; progress: number; label: string; next: string };

/** A segmented experience bar with the level number floating above it. */
export function XpBar({ level, progress, label, next }: Props) {
  return (
    <div
      className="bs-xp bs-snap"
      style={{ '--i': 7, '--xp': `${progress}%` } as CSSProperties}
      role="meter"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
      aria-label={`Level ${level}, ${progress}% to the next level`}
    >
      <span className="bs-xp-level" aria-hidden="true">
        {level}
      </span>
      <div className="bs-xp-bar" aria-hidden="true">
        <div className="bs-xp-fill" />
      </div>
      <div className="bs-xp-meta bs-meta" aria-hidden="true">
        <span>{label}</span>
        <span>{next}</span>
      </div>
    </div>
  );
}

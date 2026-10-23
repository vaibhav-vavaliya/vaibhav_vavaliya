'use client';

import { useEffect, useState } from 'react';
import { Trophy } from '@phosphor-icons/react/dist/ssr/Trophy';

const EVENT = 'bs-achievement';
const SEEN_KEY = 'bs-achievements';

type Toast = { id: number; title: string; leaving?: boolean };

function seen(): string[] {
  try {
    return JSON.parse(sessionStorage.getItem(SEEN_KEY) || '[]');
  } catch {
    return [];
  }
}

/** Unlock an achievement. Each one only pops once per visit. */
export function unlock(title: string) {
  if (typeof window === 'undefined') return;
  const list = seen();
  if (list.includes(title)) return;
  try {
    sessionStorage.setItem(SEEN_KEY, JSON.stringify([...list, title]));
  } catch {
    /* ignore: it may just pop again */
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: title }));
}

/** Pixel "achievement unlocked" toasts that slide in from the right. */
export function Achievements() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    let seq = 0;
    const onUnlock = (e: Event) => {
      const id = ++seq;
      setToasts((t) => [...t, { id, title: (e as CustomEvent<string>).detail }]);
      window.setTimeout(() => setToasts((t) => t.map((x) => (x.id === id ? { ...x, leaving: true } : x))), 3600);
      window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3950);
    };
    window.addEventListener(EVENT, onUnlock);
    return () => window.removeEventListener(EVENT, onUnlock);
  }, []);

  return (
    <div className="bs-toasts" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`bs-toast${t.leaving ? ' is-leaving' : ''}`}>
          <span className="bs-toast-icon" aria-hidden="true">
            <Trophy size={22} weight="fill" />
          </span>
          <span>
            <span className="bs-toast-title">Achievement unlocked!</span>
            <span className="bs-toast-text">{t.title}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

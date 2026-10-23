'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { ArrowFatLineUp } from '@phosphor-icons/react/dist/ssr/ArrowFatLineUp';
import { unlock } from './Achievements';

/** "Back to spawn": appears after you scroll, fills up green with your progress down the page. */
export function ScrollTop() {
  const [progress, setProgress] = useState(0);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
      setShown(window.scrollY > 600);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const toTop = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    unlock('Back to spawn');
  };

  return (
    <>
      <button
        type="button"
        className={`bs-top${shown ? ' is-shown' : ''}`}
        onClick={toTop}
        aria-label="Back to top"
        tabIndex={shown ? 0 : -1}
        style={{ '--progress': `${progress}%` } as CSSProperties}
      >
        <span className="bs-top-fill" aria-hidden="true" />
        <ArrowFatLineUp size={22} weight="fill" />
      </button>
      <span className="bs-top-tip" aria-hidden="true">
        Back to spawn · {Math.round(progress)}%
      </span>
    </>
  );
}

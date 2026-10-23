'use client';

import { useEffect, useState } from 'react';
import { Moon } from '@phosphor-icons/react/dist/ssr/Moon';
import { Sun } from '@phosphor-icons/react/dist/ssr/Sun';
import { BlockButton } from './BlockButton';
import { unlock } from './Achievements';

type Theme = 'ivory' | 'night';
const KEY = 'bs-theme';

function readStored(): Theme | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'ivory' || v === 'night' ? v : null;
  } catch {
    return null;
  }
}

const CHANGE = 'bs-theme-change';

/** Switch theme from anywhere (e.g. the window in the Base room); remembers the choice. */
export function applyTheme(next: Theme) {
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem(KEY, next);
  } catch {
    /* private mode: the choice just won't persist */
  }
  window.dispatchEvent(new CustomEvent(CHANGE, { detail: next }));
  if (next === 'night') unlock('Night mode: into the bricks');
}

export function currentTheme(): Theme {
  return document.documentElement.dataset.theme === 'night' ? 'night' : 'ivory';
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(currentTheme());
    const onChange = (e: Event) => setTheme((e as CustomEvent<Theme>).detail);
    window.addEventListener(CHANGE, onChange);

    // Keep following the device until the visitor picks a theme themselves.
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onSystem = () => {
      if (readStored()) return;
      const next: Theme = mq.matches ? 'night' : 'ivory';
      document.documentElement.dataset.theme = next;
      setTheme(next);
    };
    mq.addEventListener('change', onSystem);
    return () => {
      mq.removeEventListener('change', onSystem);
      window.removeEventListener(CHANGE, onChange);
    };
  }, []);

  const toggle = () => applyTheme(theme === 'night' ? 'ivory' : 'night');

  const label = theme === 'night' ? 'Switch to light theme' : 'Switch to black-brick theme';
  return (
    <BlockButton
      size="sm"
      iconOnly
      onClick={toggle}
      aria-label={label}
      title={label}
      icon={theme === 'night' ? <Sun size={20} weight="fill" /> : <Moon size={20} weight="fill" />}
    />
  );
}

/** Runs in <head> before paint: stored choice wins, otherwise follow the device. */
export const themeScript = `(function(){try{var d=document.documentElement;d.classList.add('js');var t=localStorage.getItem('${KEY}');if(t!=='ivory'&&t!=='night'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'night':'ivory'}d.dataset.theme=t}catch(e){document.documentElement.classList.add('js')}})();`;

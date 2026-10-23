'use client';

import { useEffect } from 'react';
import { unlock } from './Achievements';

/**
 * Discourages casual peeking: blocks the usual devtools / view-source shortcuts and the
 * right-click menu (except in form fields, so pasting still works). This is only a
 * deterrent. Browsers always let people open devtools from their own menus.
 */
export function DevtoolsGuard() {
  useEffect(() => {
    const caught = () => unlock('Curious one: no peeking!');

    const onKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const ctrlShift = e.ctrlKey && e.shiftKey && ['i', 'j', 'c', 'k'].includes(key);
      const macCmdOpt = e.metaKey && e.altKey && ['i', 'j', 'c', 'u'].includes(key);
      const viewSource = (e.ctrlKey || e.metaKey) && !e.shiftKey && key === 'u';
      if (e.key === 'F12' || ctrlShift || macCmdOpt || viewSource) {
        e.preventDefault();
        e.stopPropagation();
        caught();
      }
    };

    const onContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('input, textarea, [contenteditable="true"]')) return;
      e.preventDefault();
      caught();
    };

    window.addEventListener('keydown', onKey, { capture: true });
    window.addEventListener('contextmenu', onContextMenu);
    return () => {
      window.removeEventListener('keydown', onKey, { capture: true });
      window.removeEventListener('contextmenu', onContextMenu);
    };
  }, []);

  return null;
}

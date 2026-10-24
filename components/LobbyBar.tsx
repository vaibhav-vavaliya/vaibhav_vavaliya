'use client';

import { useEffect, useState } from 'react';
import { ChatCircleDots } from '@phosphor-icons/react/dist/ssr/ChatCircleDots';
import { List } from '@phosphor-icons/react/dist/ssr/List';
import { X } from '@phosphor-icons/react/dist/ssr/X';
import { nav, profile } from '@/data/profile';
import { ByteFace } from './Cats';
import { BlockButton } from './BlockButton';
import { ThemeToggle } from './ThemeToggle';

export function LobbyBar() {
  const [active, setActive] = useState('home');
  const [open, setOpen] = useState(false);

  // Highlight the tab for whichever section is in the middle of the screen.
  useEffect(() => {
    const sections = nav
      .map((n) => document.getElementById(n.id))
      .filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // The mobile menu closes on Escape or a tap anywhere outside the bar.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onDown = (e: PointerEvent) => {
      if (!(e.target as Element).closest('.bs-lobby-wrap')) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [open]);

  const tabs = (onClick?: () => void) =>
    nav.map((n) => (
      <li key={n.id}>
        <a
          className="bs-tab"
          href={`#${n.id}`}
          aria-current={active === n.id ? 'true' : undefined}
          onClick={onClick}
        >
          {n.label}
        </a>
      </li>
    ));

  return (
    <div className="bs-lobby-wrap">
      <div className="bs-container">
        <header className="bs-block">
          <nav className="bs-lobby" aria-label="Main">
            <a className="bs-brand" href="#home" aria-label={`${profile.fullName}, home`}>
              <span className="bs-monogram" aria-hidden="true">
                <ByteFace />
              </span>
              <span className="bs-brand-name" aria-hidden="true">
                {profile.name.toLowerCase()}
                <span className="bs-dot-blue">.</span>
              </span>
            </a>
            <ul className="bs-tabs">{tabs()}</ul>
            <div className="bs-lobby-end">
              <ThemeToggle />
              <BlockButton
                variant="red"
                size="sm"
                href="#message"
                aria-label="Send a message"
                icon={<ChatCircleDots size={20} weight="fill" />}
              >
                <span className="bs-lobby-msg-label">Message</span>
              </BlockButton>
              <BlockButton
                className="bs-menu-btn"
                size="sm"
                iconOnly
                aria-expanded={open}
                aria-controls="bs-mobile-menu"
                aria-label={open ? 'Close menu' : 'Open menu'}
                onClick={() => setOpen((o) => !o)}
                icon={open ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
              />
            </div>
          </nav>
        </header>
        <div id="bs-mobile-menu" className="bs-mobile-menu bs-block" hidden={!open}>
          <ul>{tabs(() => setOpen(false))}</ul>
        </div>
      </div>
    </div>
  );
}

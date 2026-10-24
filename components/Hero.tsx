'use client';

import { useRef, type CSSProperties, type MouseEvent } from 'react';
import { ArrowDown } from '@phosphor-icons/react/dist/ssr/ArrowDown';
import { Play } from '@phosphor-icons/react/dist/ssr/Play';
import { User } from '@phosphor-icons/react/dist/ssr/User';
import { builds, profile } from '@/data/profile';
import { AvatarCard } from './AvatarCard';
import { BlockButton } from './BlockButton';
import { fireConfettiFrom } from './Confetti';
import { unlock } from './Achievements';
import { StatusChip } from './StatusChip';
import { XpBar } from './XpBar';

const i = (n: number) => ({ '--i': n }) as CSSProperties;

export function Hero() {
  const played = useRef(false);
  // The big Play opens the first build that has a public link.
  const best = builds.find((b) => b.href);

  // First press of the big Play gets a confetti burst before the demo opens.
  const onPlay = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!played.current) {
      played.current = true;
      fireConfettiFrom(e.currentTarget);
      unlock('Pressed play');
    }
  };

  return (
    <section id="home" className="bs-container bs-hero" aria-labelledby="hero-name">
      <div>
        <StatusChip className="bs-snap" style={i(0)} />
        {/* Full name in the h1: the strongest on-page signal for searches of the name */}
        <h1 id="hero-name" className="bs-hero-name bs-snap" style={i(1)}>
          {profile.fullName}
          <span className="bs-dot-blue">.</span>
        </h1>
        <p className="bs-hero-tagline bs-snap" style={i(2)}>
          {profile.tagline}
        </p>
        <div className="bs-btn-row bs-snap" style={i(3)}>
          <BlockButton
            variant="green"
            size="lg"
            href={best?.href ?? '#builds'}
            {...(best?.href ? { target: '_blank', rel: 'noreferrer' } : {})}
            onClick={onPlay}
            icon={<Play size={20} weight="fill" />}
          >
            Play my best build
          </BlockButton>
          <BlockButton variant="blue" size="lg" href="#builds" icon={<ArrowDown size={20} weight="bold" />}>
            See my builds
          </BlockButton>
          <BlockButton size="lg" href="#about" icon={<User size={20} weight="fill" />}>
            About me
          </BlockButton>
        </div>
        <ul className="bs-stats" aria-label="Quick stats">
          {profile.stats.map((s, n) => (
            <li key={s.label} className="bs-stat bs-snap" style={i(4 + n)}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </li>
          ))}
        </ul>
        <XpBar {...profile.xp} />
      </div>
      <AvatarCard />
    </section>
  );
}

'use client';

import { useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import { ArrowDown } from '@phosphor-icons/react/dist/ssr/ArrowDown';
import { Play } from '@phosphor-icons/react/dist/ssr/Play';
import { User } from '@phosphor-icons/react/dist/ssr/User';
import { profile } from '@/data/profile';
import { AvatarCard } from './AvatarCard';
import { BossFight } from './BossFight';
import { BlockButton } from './BlockButton';
import { fireConfettiFrom } from './Confetti';
import { unlock } from './Achievements';
import { StatusChip } from './StatusChip';
import { XpBar } from './XpBar';

const i = (n: number) => ({ '--i': n }) as CSSProperties;

export function Hero() {
  const played = useRef(false);
  const [game, setGame] = useState(false);

  // The big Play starts the boss fight; the first press also gets a confetti burst.
  const onPlay = (e: MouseEvent<HTMLButtonElement>) => {
    if (!played.current) {
      played.current = true;
      fireConfettiFrom(e.currentTarget);
      unlock('Pressed play');
    }
    setGame(true);
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
            onClick={onPlay}
            aria-haspopup="dialog"
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
      <BossFight open={game} onClose={() => setGame(false)} />
    </section>
  );
}

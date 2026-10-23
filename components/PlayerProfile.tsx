import type { CSSProperties } from 'react';
import { DownloadSimple } from '@phosphor-icons/react/dist/ssr/DownloadSimple';
import { Handshake } from '@phosphor-icons/react/dist/ssr/Handshake';
import { MapPin } from '@phosphor-icons/react/dist/ssr/MapPin';
import { Buildings } from '@phosphor-icons/react/dist/ssr/Buildings';
import { Translate } from '@phosphor-icons/react/dist/ssr/Translate';
import { about, profile } from '@/data/profile';
import { AvatarFigure } from './Avatar';
import { BlockButton } from './BlockButton';
import { ByteSleep, PixelSleep } from './Cats';
import { StatusChip } from './StatusChip';

/** One attribute as a 10-segment stat bar that fills in when the section scrolls into view. */
function StatBar({ label, value, index }: { label: string; value: number; index: number }) {
  return (
    <li className="bs-attr">
      <span className="bs-attr-label">{label}</span>
      <span className="bs-attr-bar" role="meter" aria-valuemin={0} aria-valuemax={10} aria-valuenow={value} aria-label={`${label}: ${value} out of 10`}>
        {Array.from({ length: 10 }, (_, k) => (
          <i key={k} className={k < value ? 'is-on' : undefined} style={{ '--k': k + index * 2 } as CSSProperties} />
        ))}
      </span>
      <span className="bs-attr-value bs-pixel">{value}</span>
    </li>
  );
}

/** The About section as a player profile: character card on the left, story and quest log on the right. */
export function PlayerProfile() {
  return (
    <div className="bs-profile bs-block bs-reveal" data-reveal>
      <aside className="bs-profile-card" aria-label="Player card">
        <div className="bs-portrait">
          <div className="bs-orb" aria-hidden="true" />
          <div className="bs-stage-floor" />
          <div className="bs-portrait-fig">
            <AvatarFigure />
          </div>
          {/* Byte asleep at the avatar's feet: rounded by day, pixel by night */}
          <div className="bs-portrait-cat" aria-hidden="true">
            <span className="bs-portrait-zzz">
              <i>z</i>
              <i>z</i>
              <i>Z</i>
            </span>
            <div className="bs-day">
              <ByteSleep />
            </div>
            <div className="bs-night">
              <PixelSleep />
            </div>
          </div>
        </div>
        <span className="bs-player-tag bs-pixel">Player 1</span>
        <p className="bs-profile-name">{profile.fullName}</p>
        <dl className="bs-sheet">
          <div>
            <dt>Class</dt>
            <dd>{about.className}</dd>
          </div>
          <div>
            <dt>Level</dt>
            <dd>{about.level}</dd>
          </div>
        </dl>
        <ul className="bs-attrs">
          {about.attributes.map((a, i) => (
            <StatBar key={a.label} {...a} index={i} />
          ))}
        </ul>
      </aside>

      <div className="bs-profile-main">
        <StatusChip />
        <h3 className="bs-profile-hi">
          Hi, I&apos;m {profile.name}
          <span className="bs-dot-blue">.</span>
        </h3>
        {about.paragraphs.map((p) => (
          <p key={p.slice(0, 24)} className="bs-profile-text">
            {p}
          </p>
        ))}

        <div className="bs-tiles">
          <div className="bs-tile">
            <span className="bs-tile-label bs-pixel">
              <MapPin size={16} weight="fill" /> Spawn point
            </span>
            <strong>{profile.location}</strong>
          </div>
          <div className="bs-tile">
            <span className="bs-tile-label bs-pixel">
              <Buildings size={16} weight="fill" /> Last guild
            </span>
            <strong>{about.guild.name}</strong>
            <span className="bs-meta">{about.guild.note}</span>
          </div>
          <div className="bs-tile">
            <span className="bs-tile-label bs-pixel">
              <Translate size={16} weight="bold" /> Languages
            </span>
            <span className="bs-lang">
              {profile.spoken.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </span>
          </div>
        </div>

        <div className="bs-quests">
          <p className="bs-quests-title bs-pixel">Quest log</p>
          <ul>
            {about.quests.map((q) => (
              <li key={q.title} className="bs-quest">
                <span className="bs-quest-gem" aria-hidden="true" />
                <span>
                  <span className="bs-quest-kind bs-pixel">{q.kind}</span>
                  <strong>{q.title}</strong>
                </span>
                <span className="bs-quest-state">{q.state}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bs-btn-row">
          <BlockButton variant="yellow" href={profile.cvUrl} download icon={<DownloadSimple size={20} weight="fill" />}>
            Grab my CV
          </BlockButton>
          <BlockButton variant="blue" href="#message" icon={<Handshake size={20} weight="fill" />}>
            Hire me
          </BlockButton>
        </div>
      </div>
    </div>
  );
}

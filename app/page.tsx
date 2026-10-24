import { DownloadSimple } from '@phosphor-icons/react/dist/ssr/DownloadSimple';
import { EnvelopeSimple } from '@phosphor-icons/react/dist/ssr/EnvelopeSimple';
import { GithubLogo } from '@phosphor-icons/react/dist/ssr/GithubLogo';
import { LinkedinLogo } from '@phosphor-icons/react/dist/ssr/LinkedinLogo';
import { badges, builds, experience, journey, profile } from '@/data/profile';
import { Achievements } from '@/components/Achievements';
import { BadgeGrid, BadgeLegend } from '@/components/BadgeGrid';
import { BlockButton } from '@/components/BlockButton';
import { BaseRoom } from '@/components/BaseRoom';
import { CatPeek } from '@/components/CatPeek';
import { ChatBuddy } from '@/components/ChatBuddy';
import { Confetti } from '@/components/Confetti';
import { DevtoolsGuard } from '@/components/DevtoolsGuard';
import { ExperienceCard } from '@/components/ExperienceCard';
import { ExperienceLog } from '@/components/ExperienceLog';
import { Hero } from '@/components/Hero';
import { Journey } from '@/components/Journey';
import { LobbyBar } from '@/components/LobbyBar';
import { MessageForm } from '@/components/MessageForm';
import { PlayerProfile } from '@/components/PlayerProfile';
import { RevealObserver } from '@/components/RevealObserver';
import { ScrollTop } from '@/components/ScrollTop';
import { StructuredData } from '@/components/StructuredData';

function SectionHead({ id, eyebrow, title, aside }: { id: string; eyebrow: string; title: string; aside?: React.ReactNode }) {
  return (
    <div className="bs-section-head bs-reveal" data-reveal>
      <div>
        <p className="bs-eyebrow">{eyebrow}</p>
        <h2 id={`${id}-title`} className="bs-h2">
          {title}
          <span className="bs-dot-blue">.</span>
        </h2>
      </div>
      {aside}
    </div>
  );
}

export default function HomeScreen() {
  const year = new Date().getFullYear();
  const linkIcon = (label: string) =>
    label === 'GitHub' ? <GithubLogo size={20} weight="fill" /> : <LinkedinLogo size={20} weight="fill" />;

  return (
    <>
      <StructuredData />
      <a className="bs-skip" href="#main">
        Skip to content
      </a>
      <LobbyBar />
      <main id="main">
        <Hero />

        <section id="about" className="bs-container bs-section" aria-labelledby="about-title">
          <SectionHead id="about" eyebrow="Player info" title="About" />
          <PlayerProfile />
        </section>

        <section id="experience" className="bs-container bs-section" aria-labelledby="experience-title">
          <SectionHead
            id="experience"
            eyebrow="Guild history"
            title="Experience"
            aside={<span className="bs-meta">{experience.length === 1 ? '1 role' : `${experience.length} roles`}</span>}
          />
          <ExperienceLog jobs={experience} />
        </section>

        <section id="base" className="bs-container bs-section" aria-labelledby="base-title">
          <SectionHead
            id="base"
            eyebrow="Home base"
            title="Base"
            aside={<span className="bs-meta">Meet Byte, Null and Cache</span>}
          />
          <div className="bs-reveal" data-reveal>
            <BaseRoom />
          </div>
        </section>

        <section id="builds" className="bs-container bs-section" aria-labelledby="builds-title">
          <SectionHead
            id="builds"
            eyebrow="Projects"
            title="Builds"
            aside={<span className="bs-meta">{builds.length} builds</span>}
          />
          {builds.length ? (
            <ul
              className="bs-builds"
              style={{ listStyle: 'none', margin: 0, padding: 0, '--cols': Math.min(builds.length, 4) } as React.CSSProperties}
            >
              {builds.map((b, n) => (
                <ExperienceCard key={b.title} build={b} index={n} />
              ))}
            </ul>
          ) : (
            <p className="bs-empty bs-block">Nothing built here yet. Check back soon!</p>
          )}
        </section>

        <section id="badges" className="bs-container bs-section" aria-labelledby="badges-title">
          <SectionHead id="badges" eyebrow="Skills earned" title="Badges" aside={<BadgeLegend />} />
          <BadgeGrid badges={badges} />
        </section>

        <section id="journey" className="bs-container bs-section" aria-labelledby="journey-title">
          <SectionHead id="journey" eyebrow="Levels cleared" title="Journey" />
          <Journey roles={journey} />
        </section>

        <section id="message" className="bs-container bs-section" aria-labelledby="message-title">
          <div className="bs-message bs-block bs-reveal" data-reveal>
            <CatPeek />
            <div className="bs-message-copy">
              <p className="bs-eyebrow">Party up</p>
              <h2 id="message-title" className="bs-h2">
                Message<span className="bs-dot-blue">.</span>
              </h2>
              <p>Got a build in mind, or just want to say hi? Drop a message and I&apos;ll get back to you.</p>
              <div className="bs-btn-row">
                <BlockButton variant="yellow" href={profile.cvUrl} download icon={<DownloadSimple size={20} weight="fill" />}>
                  Grab my CV
                </BlockButton>
                <BlockButton href={`mailto:${profile.email}`} icon={<EnvelopeSimple size={20} weight="fill" />}>
                  Email me
                </BlockButton>
              </div>
            </div>
            <MessageForm />
          </div>
        </section>
      </main>

      <div className="bs-wall" aria-hidden="true" />
      <footer className="bs-footer-band">
        <div className="bs-container bs-footer">
        <div className="bs-footer-inner">
          <span className="bs-meta">
            © {year} {profile.fullName}. Built brick by brick.
          </span>
          <div className="bs-footer-links">
            {profile.links.map((l) => (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
                {linkIcon(l.label)}
                {l.label}
              </a>
            ))}
          </div>
        </div>
        </div>
      </footer>

      <Confetti />
      <Achievements />
      <ChatBuddy />
      <ScrollTop />
      <DevtoolsGuard />
      <RevealObserver />
    </>
  );
}

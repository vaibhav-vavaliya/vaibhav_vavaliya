'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { PaperPlaneTilt } from '@phosphor-icons/react/dist/ssr/PaperPlaneTilt';
import { X } from '@phosphor-icons/react/dist/ssr/X';
import { badges, builds, journey, profile } from '@/data/profile';
import { unlock } from './Achievements';
import { ByteFace, ByteSit, ByteWalk } from './Cats';

// Byte, the ginger cat from the Base room, answers questions about the portfolio.
// Everything is matched from data/profile.ts, so answers stay in sync with the site.

type Action = { label: string; href: string; external?: boolean };
type Msg = { from: 'byte' | 'you'; text: string; actions?: Action[] };

const CAT_W = 96; // roaming sprite width in px
const ROAM_SPEED = 70; // px per second

const CHIPS = ['Who is Vaibhav?', 'Show builds', 'Skills', 'How to hire?', 'Tell a joke'];

const JOKES = [
  'Why do programmers prefer dark mode? Because light attracts bugs.',
  'I said the query was slow. An index got added. Now I nap faster.',
  "There are 10 kinds of cats: ones that understand binary and ones that don't.",
  "A SQL query walks into a bar, sees two tables and asks: 'Can I join you?'",
];

// Short words match whole words only, so "hi" doesn't fire on "this".
const has = (q: string, words: string[]) =>
  words.some((w) => (w.length < 4 ? new RegExp(`\\b${w}\\b`).test(q) : q.includes(w)));

function answer(raw: string): Msg {
  const q = raw.toLowerCase();

  if (has(q, ['build', 'project', 'portfolio', 'made', 'work on', 'demo'])) {
    return {
      from: 'byte',
      text: `${builds.length} builds so far: ${builds.map((b) => `${b.title} (${b.stack}, ${b.kind.toLowerCase()})`).join('; ')}.`,
      actions: [
        { label: 'See the builds', href: '#builds' },
        { label: 'GitHub', href: profile.github, external: true },
      ],
    };
  }
  if (has(q, ['skill', 'stack', 'tech', 'language', 'badge', 'know', 'python', 'tool'])) {
    const tier = (t: string) => badges.filter((b) => b.tier === t).map((b) => b.name).join(', ');
    const learning = tier('locked');
    return {
      from: 'byte',
      text: `Gold tier (strongest): ${tier('gold')}. Silver (used on real projects): ${tier('silver')}. Bronze: ${tier('bronze')}.${learning ? ` Currently learning: ${learning}.` : ''} Speaks ${profile.spoken.join(', ')}.`,
      actions: [{ label: 'See all badges', href: '#badges' }],
    };
  }
  if (has(q, ['experience', 'job', 'journey', 'career', 'company', 'history', 'education', 'study'])) {
    return {
      from: 'byte',
      text: `${journey.map((r) => `${r.title}, ${r.place} (${r.period})`).join('. ')}. At Visionite Tech: ${journey[1].note}`,
      actions: [
        { label: 'See the experience', href: '#experience' },
        { label: 'See the journey', href: '#journey' },
      ],
    };
  }
  if (has(q, ['hire', 'contact', 'email', 'reach', 'available', 'freelance', 'work with', 'talk'])) {
    return {
      from: 'byte',
      text: `Yes! ${profile.name} is still alive and open to new builds. Send a message below or email ${profile.email}. Replies usually land within a day.`,
      actions: [{ label: 'Send a message', href: '#message' }, { label: 'Email', href: `mailto:${profile.email}`, external: true }],
    };
  }
  if (has(q, ['cv', 'resume', 'résumé'])) {
    return { from: 'byte', text: 'Here you go, fresh from the printer (I sat on it, sorry).', actions: [{ label: 'Grab the CV', href: profile.cvUrl, external: true }] };
  }
  if (has(q, ['where', 'location', 'based', 'live', 'country', 'city', 'surat'])) {
    return { from: 'byte', text: `${profile.name} is based in ${profile.location}. I live on the monitor in the Base.` };
  }
  if (has(q, ['joke', 'funny', 'laugh'])) {
    return { from: 'byte', text: JOKES[Math.floor(Math.random() * JOKES.length)] };
  }
  if (has(q, ['cat', 'byte', 'meow', 'pet', 'null', 'cache', 'kitty'])) {
    unlock('Made friends with Byte');
    return { from: 'byte', text: 'Mrrrp! I am Byte. My siblings are Null (rug napper) and Cache (always hiding on the message card). Pets are accepted at all times.', actions: [{ label: 'Visit the Base', href: '#base' }] };
  }
  if (has(q, ['who', 'about', 'vaibhav', 'yourself', 'introduce', 'what do'])) {
    return { from: 'byte', text: `${profile.fullName}: ${profile.tagline}`, actions: [{ label: 'Read the About', href: '#about' }] };
  }
  if (has(q, ['hi', 'hello', 'hey', 'yo', 'sup'])) {
    return { from: 'byte', text: `Hey there! Ask me about ${profile.name}'s builds, skills, journey, or how to hire.` };
  }
  if (has(q, ['thank', 'thx', 'cool', 'nice', 'great'])) {
    return { from: 'byte', text: 'Purr. Anytime!' };
  }
  return {
    from: 'byte',
    text: "Mrrp? I'm a cat, so I only know a few things. Try asking about builds, skills, experience, the CV, or how to hire.",
  };
}

export function ChatBuddy() {
  const [open, setOpen] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState('');
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: 'byte', text: `Hi! I'm Byte, ${profile.name}'s cat. Ask me anything about ${profile.name}, or tap a question below.` },
  ]);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timers = useRef<number[]>([]);

  // Roaming: Byte walks along the bottom of the screen, sits a while, then wanders again.
  const [x, setX] = useState<number | null>(null);
  const [facing, setFacing] = useState<1 | -1>(-1);
  const [walking, setWalking] = useState(false);
  const [dur, setDur] = useState(0);
  const xRef = useRef(0);
  const openRef = useRef(false);
  const roamTimer = useRef(0);

  const walkTo = (target: number, then: () => void) => {
    const dist = Math.abs(target - xRef.current);
    if (dist < 4) return then();
    const seconds = dist / ROAM_SPEED;
    setFacing(target > xRef.current ? 1 : -1);
    setDur(seconds);
    setWalking(true);
    xRef.current = target;
    setX(target);
    roamTimer.current = window.setTimeout(() => {
      setWalking(false);
      then();
    }, seconds * 1000);
  };

  const corner = () => window.innerWidth - CAT_W - 16;

  const wander = () => {
    if (openRef.current) return;
    const min = 72; // stay clear of the bottom-left corner
    const max = corner();
    const target = min + Math.random() * Math.max(0, max - min);
    walkTo(target, () => {
      roamTimer.current = window.setTimeout(wander, 2500 + Math.random() * 4500);
    });
  };

  useEffect(() => {
    xRef.current = corner();
    setX(xRef.current);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduced) roamTimer.current = window.setTimeout(wander, 6000);
    const onResize = () => {
      const clamped = Math.min(xRef.current, corner());
      if (clamped !== xRef.current) {
        clearTimeout(roamTimer.current);
        setWalking(false);
        setDur(0);
        xRef.current = clamped;
        setX(clamped);
        if (!reduced && !openRef.current) roamTimer.current = window.setTimeout(wander, 2000);
      }
    };
    window.addEventListener('resize', onResize);
    return () => {
      clearTimeout(roamTimer.current);
      window.removeEventListener('resize', onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Opening the chat calls Byte back to the corner; closing lets Byte roam again.
  useEffect(() => {
    openRef.current = open;
    if (x === null) return;
    clearTimeout(roamTimer.current);
    if (open) {
      walkTo(corner(), () => setFacing(-1));
    } else if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      roamTimer.current = window.setTimeout(wander, 3000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // A little nudge a few seconds after the page loads.
  useEffect(() => {
    const t = window.setTimeout(() => setTeaser(true), 4000);
    const hide = window.setTimeout(() => setTeaser(false), 12000);
    return () => {
      clearTimeout(t);
      clearTimeout(hide);
      timers.current.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [msgs, typing]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const ask = (text: string) => {
    const q = text.trim();
    if (!q || typing) return;
    setMsgs((m) => [...m, { from: 'you', text: q }]);
    setInput('');
    setTyping(true);
    unlock('Chatted with Byte');
    timers.current.push(
      window.setTimeout(() => {
        setTyping(false);
        setMsgs((m) => [...m, answer(q)]);
      }, 650 + Math.random() * 500),
    );
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    ask(input);
  };

  return (
    <div className="bs-buddy">
      {open && (
        <section className="bs-buddy-panel bs-block" role="dialog" aria-label="Chat with Byte the cat">
          <header className="bs-buddy-head">
            <span className="bs-buddy-face">
              <ByteFace />
            </span>
            <span>
              <strong>Byte</strong>
              <span className="bs-meta bs-buddy-status">
                <span className="bs-dot" aria-hidden="true" /> Online · purrs back fast
              </span>
            </span>
            <button type="button" className="bs-btn bs-btn--plain bs-btn--sm bs-btn--icon" onClick={() => setOpen(false)} aria-label="Close chat">
              <X size={18} weight="bold" />
            </button>
          </header>

          <div className="bs-buddy-log" ref={listRef} aria-live="polite">
            {msgs.map((m, i) => (
              <div key={i} className={`bs-buddy-msg bs-buddy-msg--${m.from}`}>
                <p>{m.text}</p>
                {m.actions && (
                  <div className="bs-buddy-actions">
                    {m.actions.map((a) => (
                      <a
                        key={a.label}
                        className="bs-btn bs-btn--blue bs-btn--sm"
                        href={a.href}
                        {...(a.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                      >
                        {a.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {typing && (
              <div className="bs-buddy-msg bs-buddy-msg--byte">
                <span className="bs-chat-typing" aria-label="Byte is typing">
                  <i />
                  <i />
                  <i />
                </span>
              </div>
            )}
          </div>

          <div className="bs-buddy-chips">
            {CHIPS.map((c) => (
              <button key={c} type="button" className="bs-buddy-chip" onClick={() => ask(c)}>
                {c}
              </button>
            ))}
          </div>

          <form className="bs-buddy-form" onSubmit={onSubmit}>
            <input
              ref={inputRef}
              className="bs-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Byte anything…"
              aria-label="Message Byte"
              maxLength={200}
            />
            <button type="submit" className="bs-btn bs-btn--blue bs-btn--sm bs-btn--icon" aria-label="Send">
              <PaperPlaneTilt size={18} weight="fill" />
            </button>
          </form>
        </section>
      )}

      {x !== null && (
        <div
          className="bs-roam"
          style={{ transform: `translateX(${x}px)`, transitionDuration: `${dur}s` }}
        >
          {teaser && !open && (
            <button
              type="button"
              className={`bs-buddy-teaser${x < window.innerWidth / 2 ? ' bs-buddy-teaser--left' : ''}`}
              onClick={() => setOpen(true)}
            >
              Psst! Ask me about {profile.name}
            </button>
          )}
          <button
            type="button"
            className={`bs-buddy-btn${walking ? ' is-walking' : ''}`}
            onClick={() => {
              setOpen((o) => !o);
              setTeaser(false);
            }}
            aria-expanded={open}
            aria-label={open ? 'Close chat with Byte' : 'Chat with Byte, the portfolio cat'}
          >
            <span className="bs-roam-sprite" style={{ transform: `scaleX(${facing})` }}>
              {walking ? <ByteWalk /> : <ByteSit happy={open} />}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

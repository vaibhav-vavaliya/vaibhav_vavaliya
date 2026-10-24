'use client';

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { useInView } from '@/hooks/useReveal';
import { unlock } from './Achievements';
import { fireConfettiFrom } from './Confetti';
import { applyTheme, currentTheme } from './ThemeToggle';

// The code the monitor types out. Colours are fixed: the screen is always dark.
const CODE = [
  { text: "@Get('patients')", color: '#ffd23f' },
  { text: '@Roles(Role.Doctor)', color: '#ffd23f' },
  { text: 'async findAll(@Req() req) {', color: '#8fb4ff' },
  { text: '  return this.cura.list()', color: '#6fd36a' },
  { text: '// JWT + RBAC: ok', color: '#7a8399' },
];
const TOTAL = CODE.reduce((n, l) => n + l.text.length, 0);
const CHAR_W = 6; // monospace advance at 10px

const DUCK_TIPS = ['Did you read the error?', 'Is it cached?', 'Log the input.', "It's DNS. Probably."];

const BYTE = 'var(--cat-fur)'; // ginger by day, white by night
const BYTE_STRIPE = 'var(--cat-stripe)';
const NULL_CAT = '#6f737e';
const NULL_DARK = '#565a64';
const CAT_FACE = '#2a2321';

type Counts = { pets: number; naps: number; coffees: number; deploys: number };

// Plant growth: stem height (px above the pot) per stage. Stage 3 is full bloom.
const STEM = [12, 28, 44, 58];
const STEM_MAX = STEM[STEM.length - 1];
const BLOOM = STEM.length - 1;
const POT_TOP = 214;
const PETAL = '#ff7aa8';
const PETAL_EDGE = '#e85d8f';
const PETAL_INNER = '#ffc2d6';
const LEAF = '#4cb847';
const LEAF_NEW = '#5cc957';

/** A focusable, clickable part of the scene. */
function Hit({
  label,
  onPress,
  children,
  className = '',
}: {
  label: string;
  onPress: (el: SVGGElement) => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <g
      className={`bs-hit ${className}`}
      role="button"
      tabIndex={0}
      aria-label={label}
      onClick={(e) => onPress(e.currentTarget)}
      onKeyDown={(e: KeyboardEvent<SVGGElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onPress(e.currentTarget);
        }
      }}
    >
      {children}
    </g>
  );
}

/** Speech bubble. The pointer sits under the bubble, or on a side edge for things beside it. */
function Bubble({ x, y, text, tail = 'bottom' }: { x: number; y: number; text: string; tail?: 'bottom' | 'left' | 'right' }) {
  // Sized to the text: the pixel font is roughly 7px per character at 13px.
  const w = Math.round(text.length * 7.2 + 30);
  const pointer =
    tail === 'left'
      ? `M${x + 1} ${y + 8} l-9 5 l9 5 z`
      : tail === 'right'
        ? `M${x + w - 1} ${y + 8} l9 5 l-9 5 z`
        : `M${x + 16} ${y + 25} l7 9 l5 -9 z`;
  return (
    <g className={`bs-room-bubble bs-room-bubble--${tail}`} aria-hidden="true">
      <path d={pointer} fill="var(--bg-100)" stroke="var(--line)" strokeWidth={2} strokeLinejoin="round" />
      <rect x={x} y={y} width={w} height={26} rx={8} fill="var(--bg-100)" stroke="var(--line)" strokeWidth={2} />
      <path d={pointer} fill="var(--bg-100)" />
      <text x={x + 10} y={y + 17} className="bs-room-bubble-text">
        {text}
      </text>
    </g>
  );
}

/** Rounded rect with a solid darker bottom face, like everything else on the site. */
function Block({ x, y, w, h, r, fill, edge, depth = 4 }: { x: number; y: number; w: number; h: number; r: number; fill: string; edge: string; depth?: number }) {
  return (
    <>
      <rect x={x} y={y + depth} width={w} height={h} rx={r} fill={edge} />
      <rect x={x} y={y} width={w} height={h} rx={r} fill={fill} />
    </>
  );
}

export function BaseRoom() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const timers = useRef<number[]>([]);
  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));

  const [typed, setTyped] = useState(0);
  const [deploy, setDeploy] = useState<'idle' | 'run' | 'done'>('idle');
  const [purring, setPurring] = useState(false);
  const [nullAwake, setNullAwake] = useState(false);
  const [quack, setQuack] = useState<string | null>(null);
  const [server, setServer] = useState(false);
  const [lamp, setLamp] = useState(true);
  const [plant, setPlant] = useState(0);
  const [wiggle, setWiggle] = useState(0);
  const [wiggling, setWiggling] = useState(false);
  const [sip, setSip] = useState(false);
  const [counts, setCounts] = useState<Counts>({ pets: 0, naps: 0, coffees: 0, deploys: 0 });
  const [now, setNow] = useState<Date | null>(null);
  const [said, setSaid] = useState('');

  const bump = (k: keyof Counts) => setCounts((c) => ({ ...c, [k]: c[k] + 1 }));

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Real clock on the wall.
  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // The monitor types its code once the room scrolls into view.
  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTyped(TOTAL);
      return;
    }
    const id = window.setInterval(() => {
      setTyped((t) => {
        if (t >= TOTAL) {
          clearInterval(id);
          return t;
        }
        return t + 1;
      });
    }, 55);
    return () => clearInterval(id);
  }, [inView]);

  const pressMonitor = (el: SVGGElement) => {
    if (deploy !== 'idle') return;
    setDeploy('run');
    setSaid('Deploying…');
    bump('deploys');
    later(() => {
      setDeploy('done');
      setSaid('Deployed. It is live.');
      fireConfettiFrom(el);
      unlock('Shipped to prod');
    }, 2200);
    later(() => setDeploy('idle'), 5200);
  };

  const pressByte = () => {
    setPurring(true);
    setSaid('Byte purrs.');
    bump('pets');
    unlock('Cat whisperer: petted Byte');
    later(() => setPurring(false), 2400);
  };

  const pressNull = () => {
    if (nullAwake) return;
    setNullAwake(true);
    setSaid('Null wakes up: mrrp?');
    bump('naps');
    unlock('Woke up Null');
    later(() => setNullAwake(false), 3200);
  };

  const pressDuck = () => {
    const tip = DUCK_TIPS[Math.floor(Math.random() * DUCK_TIPS.length)];
    setQuack(tip);
    setSaid(`The duck says: quack. ${tip}`);
    unlock('Rubber duck debugging');
    later(() => setQuack((q) => (q === tip ? null : q)), 2600);
  };

  const pressMug = () => {
    setSip(true);
    bump('coffees');
    setSaid('Coffee refilled.');
    if (counts.coffees + 1 >= 3) unlock('Caffeinated: 3 coffees');
    later(() => setSip(false), 1400);
  };

  // Seedling → taller with leaves → bud → bloom. Once bloomed, clicks make it wiggle and sparkle.
  const pressPlant = () => {
    setWiggling(true);
    later(() => setWiggling(false), 600);
    if (plant >= BLOOM) {
      setWiggle((w) => w + 1);
      setSaid('The flower wiggles happily.');
      return;
    }
    const next = plant + 1;
    setPlant(next);
    setSaid(['', 'The plant grew taller.', 'A bud appeared.', 'The flower bloomed!'][next]);
    if (next === BLOOM) {
      setWiggle((w) => w + 1);
      unlock('Green thumb');
    }
  };

  const pressServer = () => {
    setServer(true);
    setSaid('Server api-01: uptime 99.9%.');
    later(() => setServer(false), 2400);
  };

  const pressWindow = () => {
    const next = currentTheme() === 'night' ? 'ivory' : 'night';
    applyTheme(next);
    setSaid(next === 'night' ? 'Night falls.' : 'Good morning.');
    unlock('Day and night');
  };

  const pressLamp = () => {
    setLamp((l) => !l);
    setSaid(lamp ? 'Lamp off.' : 'Lamp on.');
  };

  // Typed code, line by line.
  let left = typed;
  let cursor = { x: 352, y: 142 };
  const lines = CODE.map((l, i) => {
    const shown = l.text.slice(0, Math.max(0, Math.min(l.text.length, left)));
    if (left > 0) cursor = { x: 352 + shown.length * CHAR_W, y: 142 + i * 15 };
    left -= l.text.length;
    return { ...l, shown };
  });

  const minutes = now ? now.getMinutes() + now.getSeconds() / 60 : 10;
  const hours = now ? (now.getHours() % 12) + minutes / 60 : 10;
  const seconds = now ? now.getSeconds() : 0;

  return (
    <div ref={ref} className="bs-room bs-block">
      <div className="bs-avatar-studs" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <svg className="bs-room-svg" viewBox="0 0 800 460" role="group" aria-label="My base: a desk with a computer, three cats, a rubber duck, coffee, a plant, a lamp and a window">
        <defs>
          <linearGradient id="room-sky-day" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7cc8ff" />
            <stop offset="1" stopColor="#d8f0ff" />
          </linearGradient>
          <linearGradient id="room-sky-night" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#070b1c" />
            <stop offset="1" stopColor="#1d2a52" />
          </linearGradient>
          <pattern id="room-bricks" patternUnits="userSpaceOnUse" width="96" height="96">
            <image href="/textures/black-bricks.svg" width="96" height="96" style={{ imageRendering: 'pixelated' }} />
          </pattern>
          <clipPath id="room-glass">
            <rect x={72} y={52} width={166} height={126} rx={6} />
          </clipPath>
        </defs>

        {/* Wall + floor */}
        <rect width={800} height={332} fill="var(--room-wall)" />
        <rect className="bs-night" width={800} height={332} fill="url(#room-bricks)" opacity={0.9} />
        <rect y={322} width={800} height={12} fill="var(--room-trim)" />
        <rect y={334} width={800} height={126} fill="var(--room-floor)" />
        {[366, 398, 430].map((y, i) => (
          <g key={y} stroke="var(--room-floor-line)" strokeWidth={3}>
            <line x1={0} y1={y} x2={800} y2={y} />
            {Array.from({ length: 5 }, (_, k) => {
              const x = k * 180 + (i % 2 ? 90 : 0) + 40;
              return <line key={k} x1={x} y1={y - 32} x2={x} y2={y} />;
            })}
          </g>
        ))}

        {/* Window: day or night to match the theme; click to switch */}
        <Hit label="Window: switch between day and night" onPress={pressWindow}>
          <Block x={60} y={40} w={190} h={150} r={12} fill="var(--bg-100)" edge="var(--edge)" />
          <g clipPath="url(#room-glass)">
            <g className="bs-day">
              <rect x={72} y={52} width={166} height={126} fill="url(#room-sky-day)" />
              <circle cx={206} cy={86} r={15} fill="#ffd23f" />
              <g className="bs-cloud" fill="#ffffff">
                <rect x={90} y={74} width={44} height={14} rx={7} />
                <rect x={102} y={66} width={24} height={14} rx={7} />
              </g>
              <ellipse cx={120} cy={186} rx={90} ry={30} fill="#4cb847" />
              <ellipse cx={220} cy={190} rx={80} ry={26} fill="#3d9a39" />
            </g>
            <g className="bs-night">
              <rect x={72} y={52} width={166} height={126} fill="url(#room-sky-night)" />
              <circle cx={206} cy={84} r={14} fill="#f3eedb" />
              <circle cx={201} cy={80} r={3} fill="#d9d2b9" />
              <circle cx={210} cy={90} r={2} fill="#d9d2b9" />
              {[
                [92, 70],
                [130, 62],
                [160, 96],
                [104, 112],
                [176, 66],
              ].map(([x, y], i) => (
                <rect key={i} className="bs-star" x={x} y={y} width={4} height={4} fill="#ffffff" style={{ animationDelay: `${i * 0.4}s` }} />
              ))}
              <ellipse cx={120} cy={186} rx={90} ry={30} fill="#1b3a2a" />
              <ellipse cx={220} cy={190} rx={80} ry={26} fill="#15301f" />
            </g>
          </g>
          <rect x={153} y={52} width={4} height={126} fill="var(--bg-100)" />
          <rect x={72} y={113} width={166} height={4} fill="var(--bg-100)" />
          <rect x={52} y={190} width={206} height={10} rx={4} fill="var(--bg-100)" stroke="var(--line)" strokeWidth={1.5} />
        </Hit>

        {/* Shelf: books, toy bricks, a trophy */}
        <g aria-hidden="true" transform="translate(-30 0)">
          <rect x={300} y={110} width={170} height={8} rx={3} fill="var(--room-desk)" />
          <rect x={300} y={116} width={170} height={4} rx={2} fill="var(--room-desk-edge)" />
          <rect x={312} y={72} width={14} height={38} rx={3} fill="var(--blue)" />
          <rect x={328} y={78} width={12} height={32} rx={3} fill="var(--red)" />
          <rect x={342} y={70} width={16} height={40} rx={3} fill="var(--yellow)" />
          <rect x={362} y={80} width={12} height={30} rx={3} fill="var(--green)" transform="rotate(12 368 110)" />
          <Block x={392} y={96} w={30} h={14} r={4} fill="var(--blue)" edge="var(--blue-edge)" depth={0} />
          <rect x={396} y={91} width={8} height={6} rx={2} fill="var(--blue)" />
          <rect x={410} y={91} width={8} height={6} rx={2} fill="var(--blue)" />
          <Block x={396} y={82} w={22} h={12} r={4} fill="var(--green)" edge="var(--green-edge)" depth={0} />
          <path d="M436 76 h26 v10 a13 13 0 0 1 -26 0 z" fill="var(--yellow)" />
          <rect x={445} y={98} width={8} height={6} fill="var(--yellow-edge)" />
          <rect x={440} y={104} width={18} height={6} rx={2} fill="var(--yellow-edge)" />
        </g>

        {/* Clock: real time */}
        <g aria-label={now ? `Clock: ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Clock'} role="img">
          <circle cx={610} cy={82} r={32} fill="var(--bg-100)" stroke="var(--line)" strokeWidth={4} />
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x={608.5} y={54} width={3} height={6} rx={1} fill="var(--ink-muted)" transform={`rotate(${i * 30} 610 82)`} />
          ))}
          <line x1={610} y1={82} x2={610} y2={64} stroke="var(--ink)" strokeWidth={4} strokeLinecap="round" transform={`rotate(${hours * 30} 610 82)`} />
          <line x1={610} y1={82} x2={610} y2={58} stroke="var(--ink)" strokeWidth={3} strokeLinecap="round" transform={`rotate(${minutes * 6} 610 82)`} />
          <line x1={610} y1={86} x2={610} y2={56} stroke="var(--red)" strokeWidth={1.5} transform={`rotate(${seconds * 6} 610 82)`} />
          <circle cx={610} cy={82} r={3} fill="var(--ink)" />
        </g>

        {/* Lamp + its light */}
        <polygon className={`bs-glow${lamp ? ' is-on' : ''}`} points="252,192 282,180 340,248 190,248" fill="#ffe9a3" />
        <Hit label={lamp ? 'Desk lamp: turn off' : 'Desk lamp: turn on'} onPress={pressLamp}>
          <ellipse cx={200} cy={246} rx={22} ry={5} fill="var(--ink-muted)" />
          <path d="M200 244 L214 196 L248 176" stroke="var(--ink-muted)" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <polygon points="238,168 272,158 284,186 252,196" fill="var(--yellow)" stroke="var(--yellow-edge)" strokeWidth={3} strokeLinejoin="round" />
        </Hit>

        {/* Desk */}
        <rect x={170} y={262} width={14} height={72} rx={4} fill="var(--room-desk-edge)" />
        <Block x={150} y={248} w={540} h={16} r={5} fill="var(--room-desk)" edge="var(--room-desk-edge)" depth={5} />

        {/* Server tower under the desk */}
        <Hit label="Server api-01: show uptime" onPress={pressServer}>
          <rect x={590} y={270} width={84} height={64} rx={8} fill="#2b2f3a" />
          <rect x={590} y={270} width={84} height={6} rx={3} fill="#3a3f4d" />
          {[0, 1, 2].map((k) => (
            <rect key={k} x={600} y={296 + k * 10} width={64} height={4} rx={2} fill="#1c1f27" />
          ))}
          {[0, 1, 2].map((k) => (
            <circle key={k} className="bs-led" cx={604 + k * 12} cy={285} r={3.5} fill={k === 2 ? '#ffd23f' : '#4cff7a'} style={{ animationDelay: `${k * 0.37}s` }} />
          ))}
          <text x={636} y={289} className="bs-room-label">
            api-01
          </text>
        </Hit>
        {/* left of the tower so it has room to grow on phones without leaving the room */}
        {server && <Bubble x={466} y={289} text="uptime 99.9%" tail="right" />}

        {/* Monitor: types code; click to deploy */}
        <Hit label="Computer: deploy the code" onPress={pressMonitor}>
          <rect x={428} y={238} width={24} height={12} fill="#23252b" />
          <rect x={410} y={246} width={60} height={5} rx={2} fill="#23252b" />
          <rect x={330} y={112} width={220} height={132} rx={12} fill="#23252b" />
          <rect x={342} y={124} width={196} height={104} rx={6} fill="#0e1320" />
          {deploy === 'idle' ? (
            <g className="bs-room-code">
              {lines.map((l, i) => (
                <text key={i} x={352} y={142 + i * 15} fill={l.color} xmlSpace="preserve">
                  {l.shown}
                </text>
              ))}
              <rect className="bs-caret" x={cursor.x + 1} y={cursor.y - 9} width={6} height={11} fill="#e6e6ea" />
            </g>
          ) : (
            <g className="bs-room-code">
              <text x={352} y={142} fill="#e6e6ea">
                $ git push origin main
              </text>
              <text x={352} y={157} fill="#8fb4ff">
                {'> building image…'}
              </text>
              <rect x={352} y={168} width={176} height={10} rx={3} fill="#1c2436" />
              <rect className="bs-progress" x={352} y={168} width={176} height={10} rx={3} fill="#4cb847" />
              {deploy === 'done' && (
                <text x={352} y={200} fill="#6fd36a">
                  ✓ live in 2.2s
                </text>
              )}
            </g>
          )}
        </Hit>

        {/* Byte: ginger cat napping on the monitor, tail draped down the right edge */}
        <Hit className="bs-cat" label="Byte the cat, napping on the monitor: pet" onPress={pressByte}>
          <g className="bs-tail">
            <rect x={541} y={100} width={9} height={54} rx={4.5} fill={BYTE} />
            <rect x={541} y={142} width={9} height={12} rx={4.5} fill={BYTE_STRIPE} />
          </g>
          <g className="bs-breathe">
            <rect x={468} y={90} width={82} height={26} rx={13} fill={BYTE} />
            <rect x={500} y={90} width={6} height={12} rx={3} fill={BYTE_STRIPE} />
            <rect x={516} y={90} width={6} height={12} rx={3} fill={BYTE_STRIPE} />
            <rect x={532} y={90} width={6} height={12} rx={3} fill={BYTE_STRIPE} />
          </g>
          <polygon points="448,82 454,64 464,80" fill={BYTE} />
          <polygon points="466,80 476,64 482,82" fill={BYTE} />
          <rect x={444} y={76} width={40} height={34} rx={11} fill={BYTE} />
          <path d="M452 93 q4 4 8 0 M468 93 q4 4 8 0" stroke="var(--cat-line)" strokeWidth={2.5} strokeLinecap="round" fill="none" />
          <rect x={461} y={98} width={6} height={4} rx={2} fill="#e5787a" />
        </Hit>
        {purring && (
          <g aria-hidden="true">
            {[0, 1, 2].map((k) => (
              <path key={k} className="bs-heart" style={{ animationDelay: `${k * 0.25}s` }} transform={`translate(${452 + k * 16} 62)`} d="M0 3 a3 3 0 0 1 6 0 a3 3 0 0 1 6 0 q0 5 -6 9 q-6 -4 -6 -9 z" fill="var(--red)" />
            ))}
            <Bubble x={556} y={50} text="purr~" />
          </g>
        )}

        {/* Keyboard + mouse */}
        <g aria-hidden="true">
          <rect x={366} y={238} width={124} height={10} rx={3} fill="var(--bg-100)" stroke="var(--line)" strokeWidth={1.5} />
          {Array.from({ length: 10 }, (_, k) => (
            <rect key={k} x={372 + k * 11.5} y={241} width={8} height={3} rx={1} fill="var(--line)" />
          ))}
          <ellipse cx={514} cy={244} rx={9} ry={5} fill="var(--bg-100)" stroke="var(--line)" strokeWidth={1.5} />
        </g>

        {/* Rubber duck */}
        <Hit label="Rubber duck: ask for debugging help" onPress={pressDuck}>
          <ellipse cx={292} cy={238} rx={17} ry={10} fill="#ffd23f" />
          <circle cx={302} cy={222} r={9} fill="#ffd23f" />
          <polygon points="309,221 318,224 309,227" fill="#ff8c2b" />
          <circle cx={304} cy={219} r={1.8} fill={CAT_FACE} />
          <path d="M282 236 q8 -6 14 0" stroke="#e6b62a" strokeWidth={2} fill="none" />
        </Hit>
        {quack && <Bubble x={226} y={186} text={`Quack! ${quack}`} />}

        {/* Coffee */}
        <Hit label="Coffee mug: refill" onPress={pressMug}>
          <g className={sip ? 'bs-steam is-fresh' : 'bs-steam'}>
            <path d="M566 206 q-5 -7 0 -14 q5 -7 0 -14" />
            <path d="M576 206 q-5 -7 0 -14 q5 -7 0 -14" />
            <path d="M586 206 q-5 -7 0 -14 q5 -7 0 -14" />
          </g>
          <path d="M592 222 h6 a9 9 0 0 1 0 18 h-6" stroke="var(--bg-100)" strokeWidth={5} fill="none" />
          <rect x={560} y={212} width={34} height={36} rx={6} fill="var(--bg-100)" stroke="var(--line)" strokeWidth={1.5} />
          <rect x={560} y={224} width={34} height={7} fill="var(--blue)" />
        </Hit>

        {/* Plant: click the pot and it grows, buds, then blooms */}
        <Hit label={plant >= BLOOM ? 'Flower pot: the flower has bloomed' : 'Flower pot: water it to make it grow'} onPress={pressPlant}>
          {/* stem stretches up from the pot */}
          <rect
            className="bs-stem"
            x={659}
            y={POT_TOP - STEM_MAX}
            width={4}
            height={STEM_MAX}
            rx={2}
            fill="#2f8a2b"
            style={{ transform: `scaleY(${STEM[plant] / STEM_MAX})` }}
          />
          {/* seedling leaves */}
          <ellipse cx={652} cy={207} rx={8} ry={4} fill={LEAF} transform="rotate(-30 652 207)" />
          <ellipse cx={670} cy={205} rx={8} ry={4} fill={LEAF} transform="rotate(30 670 205)" />
          {plant >= 1 && (
            <g className="bs-sprout">
              <ellipse cx={649} cy={194} rx={12} ry={6} fill={LEAF} transform="rotate(-30 649 194)" />
              <ellipse cx={673} cy={190} rx={12} ry={6} fill={LEAF} transform="rotate(30 673 190)" />
            </g>
          )}
          {plant >= 2 && (
            <g className="bs-sprout">
              <ellipse cx={650} cy={178} rx={11} ry={5} fill={LEAF_NEW} transform="rotate(-35 650 178)" />
              <ellipse cx={672} cy={174} rx={11} ry={5} fill={LEAF_NEW} transform="rotate(35 672 174)" />
            </g>
          )}
          {/* bud / flower rides on top of the stem */}
          <g className="bs-flower" style={{ transform: `translateY(${STEM_MAX - STEM[plant]}px)` }}>
            <g className={wiggling ? 'bs-wiggle' : undefined}>
              {plant === 2 && (
                <g className="bs-sprout">
                  <path d="M661 142 c7 4 8 14 0 18 c-8 -4 -7 -14 0 -18 z" fill={PETAL} />
                  <path d="M652 158 q4 -7 9 -2 q5 -5 9 2 q-9 5 -18 0 z" fill={LEAF} />
                </g>
              )}
              {plant >= BLOOM && (
                <g className="bs-bloom">
                  {/* outer petals: 8 teardrops around the centre */}
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
                    <path
                      key={a}
                      d="M661 154 c-6 -4 -7 -14 0 -19 c7 5 6 15 0 19 z"
                      fill={PETAL}
                      stroke={PETAL_EDGE}
                      strokeWidth={1}
                      transform={`rotate(${a} 661 154)`}
                    />
                  ))}
                  {/* inner petals, offset half a step */}
                  {[22.5, 112.5, 202.5, 292.5].map((a) => (
                    <path key={a} d="M661 154 c-4 -3 -4 -9 0 -12 c4 3 4 9 0 12 z" fill={PETAL_INNER} transform={`rotate(${a} 661 154)`} />
                  ))}
                  <circle cx={661} cy={154} r={5.5} fill="#ffb020" stroke="#e08a00" strokeWidth={1} />
                  <circle cx={659} cy={153} r={1} fill="#c46f00" />
                  <circle cx={663} cy={152.5} r={1} fill="#c46f00" />
                  <circle cx={661} cy={156.5} r={1} fill="#c46f00" />
                </g>
              )}
            </g>
            {plant >= BLOOM && wiggle > 0 && (
              <g key={`s${wiggle}`} aria-hidden="true">
                {[
                  [640, 140],
                  [682, 136],
                  [664, 124],
                ].map(([x, y], i) => (
                  <path
                    key={i}
                    className="bs-sparkle"
                    style={{ animationDelay: `${i * 0.12}s` }}
                    d={`M${x} ${y - 6} l2 4 l4 2 l-4 2 l-2 4 l-2 -4 l-4 -2 l4 -2 z`}
                    fill="#ffd23f"
                  />
                ))}
              </g>
            )}
          </g>
          <Block x={644} y={POT_TOP} w={34} h={34} r={6} fill="#d9813f" edge="#a85f2a" depth={0} />
          <rect x={640} y={POT_TOP - 2} width={42} height={8} rx={3} fill="#e8935a" />
        </Hit>

        {/* Rug */}
        <ellipse cx={300} cy={404} rx={124} ry={26} fill="var(--room-rug)" />
        <ellipse cx={300} cy={404} rx={104} ry={18} fill="none" stroke="var(--room-rug-line)" strokeWidth={4} />

        {/* Null: grey cat asleep on the rug; click to wake */}
        <Hit label={nullAwake ? 'Null the cat, awake' : 'Null the cat, asleep on the rug: wake up'} onPress={pressNull}>
          {nullAwake ? (
            <g>
              <g className="bs-tail bs-tail--fast">
                <rect x={322} y={352} width={9} height={40} rx={4.5} fill={NULL_DARK} />
              </g>
              <rect x={276} y={338} width={50} height={56} rx={18} fill={NULL_CAT} />
              <rect x={290} y={352} width={22} height={30} rx={10} fill="#9fa3ad" />
              <polygon points="280,316 286,296 298,312" fill={NULL_CAT} />
              <polygon points="304,312 316,296 322,316" fill={NULL_CAT} />
              <rect x={274} y={306} width={54} height={40} rx={13} fill={NULL_CAT} />
              <circle cx={290} cy={324} r={5} fill="#ffd23f" />
              <circle cx={312} cy={324} r={5} fill="#ffd23f" />
              <rect x={289} y={320} width={2.5} height={8} rx={1} fill={CAT_FACE} />
              <rect x={311} y={320} width={2.5} height={8} rx={1} fill={CAT_FACE} />
              <rect x={298} y={332} width={6} height={4} rx={2} fill="#e5787a" />
            </g>
          ) : (
            <g>
              <path d="M342 392 q22 -2 14 -22" stroke={NULL_DARK} strokeWidth={9} strokeLinecap="round" fill="none" />
              <g className="bs-breathe">
                <ellipse cx={302} cy={386} rx={48} ry={20} fill={NULL_CAT} />
              </g>
              <polygon points="248,372 252,354 264,368" fill={NULL_CAT} />
              <polygon points="266,366 278,352 282,370" fill={NULL_CAT} />
              <rect x={244} y={364} width={40} height={32} rx={11} fill={NULL_CAT} />
              <path d="M252 381 q4 3 8 0 M268 381 q4 3 8 0" stroke={CAT_FACE} strokeWidth={2.5} strokeLinecap="round" fill="none" />
              <g className="bs-zzz" aria-hidden="true">
                <text x={282} y={346}>z</text>
                <text x={294} y={334} style={{ animationDelay: '0.6s' }}>
                  z
                </text>
                <text x={308} y={320} style={{ animationDelay: '1.2s' }}>
                  Z
                </text>
              </g>
            </g>
          )}
        </Hit>
        {nullAwake && <Bubble x={334} y={286} text="mrrp?" />}
      </svg>

      <div className="bs-room-foot">
        <p className="bs-meta">Click the cats, the PC, the duck, the coffee, the plant, the lamp or the window.</p>
        <ul className="bs-room-stats bs-pixel" aria-label="Base stats">
          <li>Byte pets: {counts.pets}</li>
          <li>Null wake-ups: {counts.naps}</li>
          <li>Coffees: {counts.coffees}</li>
          <li>Deploys: {counts.deploys}</li>
        </ul>
      </div>
      <p className="bs-sr" role="status" aria-live="polite">
        {said}
      </p>
    </div>
  );
}

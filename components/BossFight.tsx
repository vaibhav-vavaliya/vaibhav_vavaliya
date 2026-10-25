'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { ArrowCounterClockwise } from '@phosphor-icons/react/dist/ssr/ArrowCounterClockwise';
import { ArrowDown } from '@phosphor-icons/react/dist/ssr/ArrowDown';
import { Camera } from '@phosphor-icons/react/dist/ssr/Camera';
import { Check } from '@phosphor-icons/react/dist/ssr/Check';
import { GithubLogo } from '@phosphor-icons/react/dist/ssr/GithubLogo';
import { Heart } from '@phosphor-icons/react/dist/ssr/Heart';
import { Microphone } from '@phosphor-icons/react/dist/ssr/Microphone';
import { ShieldCheck } from '@phosphor-icons/react/dist/ssr/ShieldCheck';
import { Siren } from '@phosphor-icons/react/dist/ssr/Siren';
import { Thermometer } from '@phosphor-icons/react/dist/ssr/Thermometer';
import { WifiHigh } from '@phosphor-icons/react/dist/ssr/WifiHigh';
import { X } from '@phosphor-icons/react/dist/ssr/X';
import { builds } from '@/data/profile';
import { BlockButton } from './BlockButton';
import { fireConfettiFrom } from './Confetti';
import { unlock } from './Achievements';

type Sensor = 'radar' | 'thermal' | 'camera' | 'audio';

const SENSORS: { id: Sensor; name: string; icon: ReactNode }[] = [
  { id: 'radar', name: 'Radar', icon: <WifiHigh size={22} weight="bold" /> },
  { id: 'thermal', name: 'Thermal', icon: <Thermometer size={22} weight="bold" /> },
  { id: 'camera', name: 'Camera', icon: <Camera size={22} weight="bold" /> },
  { id: 'audio', name: 'Audio', icon: <Microphone size={22} weight="bold" /> },
];

// One sensor flags, the other three tell the truth. Half the alarms are real, half are noise.
type Round = { flag: Sensor; alert: string; real: boolean; readings: Partial<Record<Sensor, string>>; why: string };

const ROUNDS: Round[] = [
  {
    flag: 'camera',
    alert: 'Heart rate 142!',
    real: false,
    readings: { radar: 'HR 76, steady rhythm', thermal: '36.8 °C, normal', audio: 'Quiet room, no distress' },
    why: 'The patient rolled over and the camera misread the motion. Radar says the heart is fine.',
  },
  {
    flag: 'radar',
    alert: 'Breathing 6 / min!',
    real: true,
    readings: { thermal: 'Breath plume fading', camera: 'Chest barely rising', audio: 'Shallow, irregular breaths' },
    why: 'A second sensor agrees that breathing is dropping. That is a real alarm.',
  },
  {
    flag: 'thermal',
    alert: 'Temperature 39.4 °C!',
    real: true,
    readings: { radar: 'HR 118 and climbing', camera: 'Flushed skin, sweating', audio: 'Shivering, teeth chattering' },
    why: 'Fever confirmed by a second sensor. Call the nurse.',
  },
  {
    flag: 'audio',
    alert: 'Loud cry detected!',
    real: false,
    readings: { radar: 'HR 72, breathing 14 / min', thermal: '36.6 °C, normal', camera: 'Asleep, TV is on' },
    why: 'It was the TV. Every other sensor says the patient is resting.',
  },
  {
    flag: 'thermal',
    alert: 'Temperature 34.1 °C!',
    real: false,
    readings: { radar: 'HR 70, breathing 13 / min', camera: 'Blanket pulled over the chest', audio: 'Snoring softly' },
    why: 'A blanket was blocking the thermal view. Nothing else agrees.',
  },
  {
    flag: 'audio',
    alert: 'Gasping sounds!',
    real: true,
    readings: { radar: 'Breathing 28 / min, ragged', thermal: 'Breath plume fast and short', camera: 'Sitting up, clutching chest' },
    why: 'Respiratory distress, confirmed by a second sensor. Raise it.',
  },
  {
    flag: 'camera',
    alert: 'No movement for 10 min!',
    real: false,
    readings: { radar: 'Breathing 12 / min, steady', thermal: '36.7 °C, normal', audio: 'Slow, even breathing' },
    why: 'Just a deep sleep. Radar can see the breathing the camera can’t.',
  },
  {
    flag: 'radar',
    alert: 'Heart rate 38!',
    real: true,
    readings: { thermal: 'Skin cooling fast', camera: 'Pale, not responding', audio: 'No voice response' },
    why: 'Slow heart rate and an unresponsive patient. That is a real emergency.',
  },
];

const BOSS_HP = 5;
const LIVES = 3;

type Phase = 'intro' | 'play' | 'win' | 'lose';
type Result = { ok: boolean; text: string };

function shuffle<T>(list: T[]): T[] {
  const out = [...list];
  for (let n = out.length - 1; n > 0; n--) {
    const k = Math.floor(Math.random() * (n + 1));
    [out[n], out[k]] = [out[k], out[n]];
  }
  return out;
}

const sensorName = (id: Sensor) => SENSORS.find((s) => s.id === id)!.name;

/** "Boss: The False Alarm": a short game about Pulse Guardian's rule of confirming every alarm with a second sensor. */
export function BossFight({ open, onClose }: { open: boolean; onClose: () => void }) {
  const build = builds[0];
  const panelRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const [phase, setPhase] = useState<Phase>('intro');
  const [deck, setDeck] = useState<Round[]>(ROUNDS);
  const [turn, setTurn] = useState(0);
  const [hp, setHp] = useState(BOSS_HP);
  const [lives, setLives] = useState(LIVES);
  const [checked, setChecked] = useState<Sensor | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [hit, setHit] = useState<'boss' | 'you' | null>(null);

  const round = deck[turn % deck.length];

  const start = () => {
    setDeck(shuffle(ROUNDS));
    setTurn(0);
    setHp(BOSS_HP);
    setLives(LIVES);
    setChecked(null);
    setResult(null);
    setPhase('play');
  };

  // Lock page scroll, close on Escape, keep Tab inside the dialog, and hand focus back on close.
  useEffect(() => {
    if (!open) return;
    const back = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    titleRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return closeRef.current();
      if (e.key !== 'Tab' || !panelRef.current) return;
      const items = panelRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]');
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === titleRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      back?.focus({ preventScroll: true });
    };
  }, [open]);

  // Each fresh open starts at the intro screen.
  useEffect(() => {
    if (open) setPhase('intro');
  }, [open]);

  useEffect(() => {
    if (result) panelRef.current?.querySelector<HTMLElement>('.bs-boss-next')?.focus();
  }, [result]);

  useEffect(() => {
    if (!hit) return;
    const t = window.setTimeout(() => setHit(null), 450);
    return () => window.clearTimeout(t);
  }, [hit]);

  useEffect(() => {
    if (phase === 'win') {
      fireConfettiFrom(titleRef.current);
      unlock('Beat the False Alarm');
    }
    if (phase === 'win' || phase === 'lose') titleRef.current?.focus();
  }, [phase]);

  if (!open) return null;

  const decide = (raise: boolean) => {
    if (result) return;
    let ok: boolean;
    let text: string;
    if (!checked) {
      ok = false;
      text = `You made the call on one sensor. Pulse Guardian always checks a second one first. (It was ${round.real ? 'real' : 'a false alarm'}.)`;
    } else {
      ok = raise === round.real;
      text = `${ok ? 'Right call.' : round.real ? 'Missed a real alarm.' : 'False alarm raised.'} ${round.why}`;
    }
    setResult({ ok, text });
    setHit(ok ? 'boss' : 'you');
    if (ok) setHp((h) => h - 1);
    else setLives((l) => l - 1);
  };

  const next = () => {
    if (hp <= 0) return setPhase('win');
    if (lives <= 0) return setPhase('lose');
    setTurn((t) => t + 1);
    setChecked(null);
    setResult(null);
  };

  const links = (
    <div className="bs-btn-row bs-boss-links">
      {build.href && (
        <BlockButton variant="green" href={build.href} target="_blank" rel="noreferrer" icon={<GithubLogo size={18} weight="fill" />}>
          View source
        </BlockButton>
      )}
      <BlockButton
        variant="blue"
        href="#builds"
        onClick={onClose}
        icon={<ArrowDown size={18} weight="bold" />}
      >
        See all builds
      </BlockButton>
    </div>
  );

  return createPortal(
    <div className="bs-boss" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={panelRef} className="bs-boss-panel bs-block" role="dialog" aria-modal="true" aria-labelledby="boss-title">
        <header className="bs-boss-head">
          <span className="bs-pixel bs-boss-eyebrow">Level 1 · {build.title}</span>
          <BlockButton size="sm" iconOnly onClick={onClose} aria-label="Close game" icon={<X size={18} weight="bold" />} />
        </header>

        {phase === 'intro' && (
          <div className="bs-boss-screen">
            <h2 id="boss-title" ref={titleRef} tabIndex={-1} className="bs-boss-title">
              Boss: The False Alarm
            </h2>
            <p>
              Hospital monitors cry wolf so often that nurses stop listening. That is <strong>alarm fatigue</strong>, and
              it is the boss. {build.title} beats it with one rule: <strong>never trust a single sensor</strong>.
            </p>
            <ol className="bs-boss-rules">
              <li>A sensor flags an alert.</li>
              <li>Check a <em>different</em> sensor.</li>
              <li>Raise the alarm if it agrees, dismiss it if it doesn’t.</li>
            </ol>
            <p className="bs-meta">
              {BOSS_HP} right calls win. {LIVES} wrong calls lose.
            </p>
            <BlockButton variant="green" size="lg" onClick={start} icon={<Siren size={20} weight="fill" />}>
              Start the fight
            </BlockButton>
          </div>
        )}

        {phase === 'play' && (
          <div className="bs-boss-screen">
            <h2 id="boss-title" ref={titleRef} tabIndex={-1} className="bs-sr">
              Boss: The False Alarm, round {turn + 1}
            </h2>
            <div className="bs-boss-bars">
              <div className={`bs-boss-hp${hit === 'boss' ? ' is-hit' : ''}`}>
                <span className="bs-pixel">Alarm Fatigue</span>
                <span
                  className="bs-boss-meter"
                  role="meter"
                  aria-label="Boss health"
                  aria-valuemin={0}
                  aria-valuemax={BOSS_HP}
                  aria-valuenow={hp}
                  style={{ '--hp': hp / BOSS_HP } as CSSProperties}
                >
                  <i />
                </span>
              </div>
              <div className={`bs-boss-lives${hit === 'you' ? ' is-hit' : ''}`} aria-label={`${lives} of ${LIVES} lives left`}>
                {Array.from({ length: LIVES }, (_, n) => (
                  <Heart key={n} size={22} weight={n < lives ? 'fill' : 'regular'} className={n < lives ? '' : 'is-lost'} aria-hidden="true" />
                ))}
              </div>
            </div>

            <div className="bs-boss-monitor" aria-label="Patient monitor">
              <div className="bs-boss-monitor-top bs-pixel">
                <span>Bed 4 · Ward B</span>
                <span>Round {turn + 1}</span>
              </div>
              <svg className="bs-boss-ecg" viewBox="0 0 200 40" preserveAspectRatio="none" aria-hidden="true">
                <path d="M0 20 H30 L36 20 L40 6 L45 34 L50 20 H90 L96 20 L100 6 L105 34 L110 20 H150 L156 20 L160 6 L165 34 L170 20 H200" />
              </svg>
              <p className="bs-boss-alert">
                <Siren size={20} weight="fill" aria-hidden="true" /> {sensorName(round.flag)}: {round.alert}
              </p>
            </div>

            <div className="bs-boss-sensors" role="group" aria-label="Check a second sensor">
              {SENSORS.map((s) => {
                const flagged = s.id === round.flag;
                const isChecked = s.id === checked;
                const state = flagged ? 'is-flagged' : isChecked ? (round.real ? 'is-agree' : 'is-disagree') : '';
                return (
                  <button
                    key={s.id}
                    type="button"
                    className={`bs-boss-sensor ${state}`}
                    disabled={flagged || !!checked || !!result}
                    onClick={() => setChecked(s.id)}
                  >
                    <span className="bs-boss-sensor-name">
                      {s.icon} {s.name}
                    </span>
                    <span className="bs-boss-sensor-read">
                      {flagged ? 'Flagged the alert' : isChecked ? round.readings[s.id] : checked ? '·' : 'Tap to check'}
                    </span>
                  </button>
                );
              })}
            </div>

            <div aria-live="polite">
              {checked && !result && (
                <p className="bs-boss-hint">
                  {sensorName(checked)} {round.real ? 'agrees' : 'disagrees'}. Your call.
                </p>
              )}
              {result && (
                <p className={`bs-boss-result ${result.ok ? 'is-ok' : 'is-bad'}`}>
                  {result.ok ? <Check size={18} weight="bold" aria-hidden="true" /> : <X size={18} weight="bold" aria-hidden="true" />} {result.text}
                </p>
              )}
            </div>

            {result ? (
              <BlockButton className="bs-boss-next" variant="blue" onClick={next}>
                {hp <= 0 ? 'Finish him' : lives <= 0 ? 'See result' : 'Next alert'}
              </BlockButton>
            ) : (
              <div className="bs-btn-row">
                <BlockButton variant="red" onClick={() => decide(true)} icon={<Siren size={18} weight="fill" />}>
                  Raise alarm
                </BlockButton>
                <BlockButton onClick={() => decide(false)} icon={<ShieldCheck size={18} weight="fill" />}>
                  Dismiss
                </BlockButton>
              </div>
            )}
          </div>
        )}

        {phase === 'win' && (
          <div className="bs-boss-screen">
            <h2 id="boss-title" ref={titleRef} tabIndex={-1} className="bs-boss-title">
              Boss defeated!
            </h2>
            <p>
              You beat alarm fatigue with {lives} {lives === 1 ? 'life' : 'lives'} left. That is how {build.title} works:
              it reads vitals from radar, thermal, camera and audio on the bedside device, and it alarms only when a second
              sensor confirms.
            </p>
            <p className="bs-meta">{build.stack}</p>
            {links}
          </div>
        )}

        {phase === 'lose' && (
          <div className="bs-boss-screen">
            <h2 id="boss-title" ref={titleRef} tabIndex={-1} className="bs-boss-title">
              Game over
            </h2>
            <p>
              The false alarms won this round. The trick: always check a <em>different</em> sensor before you decide. Then
              trust it.
            </p>
            <div className="bs-btn-row">
              <BlockButton variant="yellow" onClick={start} icon={<ArrowCounterClockwise size={18} weight="bold" />}>
                Retry
              </BlockButton>
            </div>
            {links}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

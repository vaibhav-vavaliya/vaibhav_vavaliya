'use client';

import { useRef, useState, type FormEvent } from 'react';
import { ArrowCounterClockwise } from '@phosphor-icons/react/dist/ssr/ArrowCounterClockwise';
import { PaperPlaneTilt } from '@phosphor-icons/react/dist/ssr/PaperPlaneTilt';
import { profile } from '@/data/profile';
import { BlockButton } from './BlockButton';
import { fireConfettiFrom } from './Confetti';
import { unlock } from './Achievements';

/**
 * Static sites have no server, so sending opens the visitor's mail app with the
 * message filled in. Swap the body of onSubmit for Formspree/Resend later if wanted.
 */
export function MessageForm() {
  const [sent, setSent] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get('name') ?? '');
    const email = String(data.get('email') ?? '');
    const message = String(data.get('message') ?? '');
    const subject = encodeURIComponent(`Hello from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    fireConfettiFrom(formRef.current?.querySelector('button[type="submit"]') ?? null);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setSent(true);
    unlock('Party up: message sent');
  };

  if (sent) {
    return (
      <div className="bs-form-done" role="status">
        <p>Message delivered! I&apos;ll reply within a day.</p>
        <BlockButton size="sm" onClick={() => setSent(false)} icon={<ArrowCounterClockwise size={20} weight="bold" />}>
          Send another
        </BlockButton>
      </div>
    );
  }

  return (
    <form ref={formRef} className="bs-form" onSubmit={onSubmit}>
      <div className="bs-field">
        <label htmlFor="f-name">Your name</label>
        <input id="f-name" name="name" className="bs-input" required autoComplete="name" />
      </div>
      <div className="bs-field">
        <label htmlFor="f-email">Email</label>
        <input id="f-email" name="email" type="email" className="bs-input" required autoComplete="email" />
      </div>
      <div className="bs-field">
        <label htmlFor="f-message">What should we build?</label>
        <textarea id="f-message" name="message" className="bs-input" required />
      </div>
      <div>
        <BlockButton type="submit" variant="blue" icon={<PaperPlaneTilt size={20} weight="fill" />}>
          Send a message
        </BlockButton>
      </div>
    </form>
  );
}

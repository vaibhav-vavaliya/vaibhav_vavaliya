'use client';

import { useRef } from 'react';
import { useTilt } from '@/hooks/useTilt';
import { profile } from '@/data/profile';
import { AvatarFigure } from './Avatar';
import { FloatingBricks } from './FloatingBricks';
import { StatusChip } from './StatusChip';

export function AvatarCard() {
  const wrapRef = useRef<HTMLDivElement>(null);
  useTilt(wrapRef);

  return (
    <div className="bs-stage-wrap" ref={wrapRef}>
      <FloatingBricks />
      <div className="bs-avatar-slot bs-snap" style={{ ['--i' as string]: 4 }}>
      <div className="bs-avatar-card bs-block">
        {/* Speech bubble that pops up on hover while the avatar waves */}
        <p className="bs-avatar-say">
          {profile.greeting.lead}{' '}
          <span className="bs-beeps">
            {profile.greeting.beeps.map((w, i) => (
              <span key={i} style={{ ['--i' as string]: i }}>
                {w}
              </span>
            ))}
          </span>
        </p>
        <div className="bs-avatar-studs" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <div className="bs-stage">
          <div className="bs-orb" aria-hidden="true" />
          <div className="bs-stage-floor" />
          <div className="bs-stage-shadow" />
          <div className="bs-avatar-figure">
            <AvatarFigure />
          </div>
        </div>
        <div className="bs-avatar-meta">
          <div>
            <p className="bs-avatar-name">{profile.fullName}</p>
            <p className="bs-avatar-handle bs-meta">{profile.handle}</p>
          </div>
          <StatusChip />
        </div>
      </div>
      </div>
    </div>
  );
}

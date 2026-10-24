import type { CSSProperties } from 'react';
import { Briefcase } from '@phosphor-icons/react/dist/ssr/Briefcase';
import type { Job } from '@/data/profile';

/** Work history as guild cards: the company block and job sheet on the left, quests completed on the right. */
export function ExperienceLog({ jobs }: { jobs: Job[] }) {
  return (
    <ol className="bs-exp-list">
      {jobs.map((job, n) => (
        <li key={job.company + job.period} className="bs-exp bs-block bs-reveal" data-reveal style={{ '--i': n } as CSSProperties}>
          <div className="bs-exp-side">
            <div className="bs-exp-head">
              <span className={`bs-exp-logo bs-fill-${job.color}`} aria-hidden="true">
                {job.initials}
              </span>
              <span className="bs-player-tag bs-pixel">
                <Briefcase size={14} weight="fill" /> {job.type}
              </span>
            </div>
            <h3 className="bs-exp-role">{job.role}</h3>
            <p className="bs-exp-company">{job.company}</p>
            <dl className="bs-sheet">
              <div>
                <dt>When</dt>
                <dd>{job.period}</dd>
              </div>
              <div>
                <dt>Time</dt>
                <dd>{job.length}</dd>
              </div>
              <div>
                <dt>Where</dt>
                <dd>{job.location}</dd>
              </div>
            </dl>
          </div>

          <div className="bs-exp-main">
            <p className="bs-quests-title bs-pixel">Quests completed</p>
            <ul className="bs-exp-points">
              {job.points.map((p) => (
                <li key={p.title} className="bs-exp-point">
                  <span className="bs-quest-gem" aria-hidden="true" />
                  <span>
                    <strong>{p.title}</strong>
                    <span>{p.detail}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="bs-exp-stack" aria-label="Tech used">
              <span className="bs-tile-label bs-pixel">Loadout</span>
              <span className="bs-lang">
                {job.stack.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </span>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

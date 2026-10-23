import type { CSSProperties } from 'react';
import { Play } from '@phosphor-icons/react/dist/ssr/Play';
import { Code } from '@phosphor-icons/react/dist/ssr/Code';
import { Tag } from '@phosphor-icons/react/dist/ssr/Tag';
import type { Build, BrickColor } from '@/data/profile';
import { BlockButton } from './BlockButton';

const FILL: Record<BrickColor, [string, string]> = {
  blue: ['var(--blue)', 'var(--blue-edge)'],
  green: ['var(--green)', 'var(--green-edge)'],
  yellow: ['var(--yellow)', 'var(--yellow-edge)'],
  red: ['var(--red)', 'var(--red-edge)'],
};

function Studs({ x, y, n, color }: { x: number; y: number; n: number; color: string }) {
  return (
    <>
      {Array.from({ length: n }, (_, k) => (
        <rect key={k} x={x + 8 + k * 26} y={y - 8} width={16} height={10} rx={4} fill={color} />
      ))}
    </>
  );
}

function Brick({ x, y, w, h, color, className }: { x: number; y: number; w: number; h: number; color: BrickColor; className: string }) {
  const [fill, edge] = FILL[color];
  return (
    <g className={`bs-thumb-brick ${className}`}>
      <rect x={x} y={y + 6} width={w} height={h} rx={10} fill={edge} />
      <rect x={x} y={y} width={w} height={h} rx={10} fill={fill} />
      <Studs x={x} y={y} n={Math.floor((w - 8) / 26)} color={fill} />
    </g>
  );
}

/** A block-built thumbnail, different per build thanks to its palette. */
function Thumb({ palette }: { palette: Build['palette'] }) {
  const [a, b, c] = palette;
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect x="0" y="160" width="320" height="40" fill="var(--bg-200)" />
      <Brick className="bs-thumb-brick--a" x={40} y={108} w={140} h={50} color={a} />
      <Brick className="bs-thumb-brick--c" x={186} y={108} w={90} h={50} color={c} />
      <Brick className="bs-thumb-brick--b" x={84} y={54} w={112} h={48} color={b} />
      <Brick className="bs-thumb-brick--a" x={202} y={58} w={60} h={44} color={a} />
    </svg>
  );
}

export function ExperienceCard({ build, index }: { build: Build; index: number }) {
  return (
    <li className="bs-reveal" data-reveal style={{ '--i': index } as CSSProperties}>
      <article className="bs-card bs-block" style={{ height: '100%' }}>
        <div className="bs-thumb">
          <Thumb palette={build.palette} />
          {build.isNew && <span className="bs-tag-new">New</span>}
        </div>
        <h3 className="bs-card-title">{build.title}</h3>
        <div className="bs-card-rating bs-meta">
          <span>
            <Code size={16} weight="bold" /> {build.stack}
          </span>
          <span>
            <Tag size={16} weight="fill" /> {build.kind}
          </span>
        </div>
        <p className="bs-card-blurb">{build.blurb}</p>
        <div className="bs-card-foot">
          <div className="bs-card-stats bs-meta">
            <span>{build.stats[0]}</span>
            <span>{build.stats[1]}</span>
          </div>
          {build.href ? (
            <BlockButton
              variant="blue"
              size="sm"
              href={build.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`Play ${build.title} (opens the project in a new tab)`}
              icon={<Play size={20} weight="fill" />}
            >
              Play
            </BlockButton>
          ) : (
            <span className="bs-card-status bs-pixel">{build.kind === 'In progress' ? 'Building…' : 'Private'}</span>
          )}
        </div>
      </article>
    </li>
  );
}

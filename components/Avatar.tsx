import type { CSSProperties } from 'react';

// Original blocky character. Fixed skin, hair and trouser colours so it reads the
// same in both themes; the hoodie is the primary blue brick.
const SKIN = '#e6b089';
const SKIN_EDGE = '#c38966';
const HAIR = '#2b2420';
const HAIR_EDGE = '#17120f';
const PANTS = '#3a4258';
const PANTS_EDGE = '#262c3d';
const SHOE = '#fffdf6';
const SHOE_EDGE = '#cfc6b0';
const EYE = '#1b1f2a';

type BlockProps = { x: number; y: number; w: number; h: number; r: number; fill: string; edge: string; depth?: number };

/** A rounded rect with a solid darker bottom face: the Blockstead "plastic" look. */
function Block({ x, y, w, h, r, fill, edge, depth = 5 }: BlockProps) {
  return (
    <>
      <rect x={x} y={y + depth} width={w} height={h} rx={r} fill={edge} />
      <rect x={x} y={y} width={w} height={h} rx={r} fill={fill} />
    </>
  );
}

function Face({ eyeShift }: { eyeShift?: boolean }) {
  const eyeStyle: CSSProperties | undefined = eyeShift
    ? { transform: 'translate(calc(var(--mx, 0) * 4px), calc(var(--my, 0) * 3px))' }
    : undefined;
  return (
    <>
      {/* hair block + fringe */}
      <Block x={46} y={6} w={108} h={34} r={14} fill={HAIR} edge={HAIR_EDGE} depth={4} />
      <Block x={50} y={20} w={100} h={84} r={18} fill={SKIN} edge={SKIN_EDGE} />
      <rect x={50} y={20} width={100} height={22} rx={10} fill={HAIR} />
      <rect x={118} y={20} width={32} height={32} rx={10} fill={HAIR} />
      {/* top stud */}
      <rect x={86} y={-2} width={28} height={12} rx={5} fill={HAIR} />
      <g style={eyeStyle}>
        <rect className="bs-avatar-eye" x={72} y={54} width={11} height={16} rx={5} fill={EYE} />
        <rect className="bs-avatar-eye" x={117} y={54} width={11} height={16} rx={5} fill={EYE} />
      </g>
      {/* cheeks + smile */}
      <rect x={62} y={74} width={14} height={7} rx={3.5} fill="#e08f78" opacity={0.6} />
      <rect x={124} y={74} width={14} height={7} rx={3.5} fill="#e08f78" opacity={0.6} />
      <path d="M86 80 Q100 92 114 80" stroke={EYE} strokeWidth={5} strokeLinecap="round" fill="none" />
    </>
  );
}

/** Full body (light theme). The head and eyes follow --mx/--my set by useTilt on an ancestor. */
function SoftFigure() {
  const headStyle: CSSProperties = {
    transform: 'translate(calc(var(--mx, 0) * 6px), calc(var(--my, 0) * 4px)) rotate(calc(var(--mx, 0) * 4deg))',
    transformBox: 'fill-box',
    transformOrigin: '50% 100%',
    transition: 'transform 200ms ease-out',
  };
  return (
    <svg viewBox="0 -6 200 270" role="img" aria-label="A blocky character waving hello">
      {/* legs */}
      <Block x={58} y={190} w={38} h={52} r={10} fill={PANTS} edge={PANTS_EDGE} />
      <Block x={104} y={190} w={38} h={52} r={10} fill={PANTS} edge={PANTS_EDGE} />
      <Block x={54} y={236} w={44} h={16} r={8} fill={SHOE} edge={SHOE_EDGE} depth={4} />
      <Block x={102} y={236} w={44} h={16} r={8} fill={SHOE} edge={SHOE_EDGE} depth={4} />

      {/* left arm (viewer's left) */}
      <g>
        <Block x={14} y={112} w={30} h={70} r={13} fill="var(--tee)" edge="var(--tee-edge)" />
        <Block x={16} y={170} w={26} h={22} r={10} fill={SKIN} edge={SKIN_EDGE} depth={3} />
      </g>

      {/* torso: hoodie with a yellow brick badge */}
      <Block x={44} y={106} w={112} h={92} r={16} fill="var(--tee)" edge="var(--tee-edge)" />
      <rect x={76} y={106} width={48} height={14} rx={7} fill="var(--tee-edge)" />
      <Block x={80} y={134} w={40} h={26} r={7} fill="var(--yellow)" edge="var(--yellow-edge)" depth={4} />
      <rect x={85} y={128} width={10} height={7} rx={3} fill="var(--yellow)" />
      <rect x={105} y={128} width={10} height={7} rx={3} fill="var(--yellow)" />
      <text
        x={100}
        y={153}
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontWeight={700}
        fontSize={17}
        fill="#1b1f2a"
      >
        V
      </text>

      {/* right arm waves */}
      <g className="bs-avatar-arm-wave">
        <Block x={156} y={112} w={30} h={70} r={13} fill="var(--tee)" edge="var(--tee-edge)" />
        <Block x={158} y={170} w={26} h={22} r={10} fill={SKIN} edge={SKIN_EDGE} depth={3} />
      </g>

      <g style={headStyle}>
        <Face eyeShift />
      </g>
    </svg>
  );
}

// ---------- Pixel avatar (night theme): square voxel proportions, drawn from pixel grids ----------

const PX: Record<string, string> = {
  H: '#2b2420', // hair
  h: '#3d332c', // hair highlight
  S: '#e6b089', // skin
  s: '#c98f6c', // skin shade
  W: '#ffffff', // eye white
  E: '#3a2a20', // pupil
  M: '#9a5a45', // mouth
  C: 'var(--tee)', // top: black by day, off-white by night
  c: 'var(--tee-edge)', // top shade
  Y: '#ffc83d', // badge
  P: '#2f3546', // trousers
  p: '#232836', // trousers shade
  G: '#e8e8e8', // shoe
  g: '#bdbdbd', // shoe shade
};

// 8x8 head, 8x12 torso, 4x12 arms and legs.
const HEAD = ['HHHHHHHH', 'HHhHHHhH', 'HSSSSSSH', 'SSSSSSSS', 'SWESSEWS', 'SSSssSSS', 'SSsMMsSS', 'sSSSSSSs'];
const TORSO = ['CCSSSSCC', 'CCCSSCCC', 'CCCCCCCC', 'CCYCCYCC', 'CCYCCYCC', 'CCCYYCCC', 'CCCCCCCC', 'CcccccCC', 'CCCCCCCC', 'CCCCCCCC', 'cccccccc', 'cccccccc'];
const ARM = [...Array(9).fill('CCCc'), 'SSSs', 'SSSs', 'SSss'];
const LEG_L = [...Array(10).fill('PPPp'), 'GGGg', 'GGGg'];
const LEG_R = [...Array(10).fill('pPPP'), 'gGGG', 'gGGG'];

function Pixels({ grid, x, y }: { grid: string[]; x: number; y: number }) {
  return (
    <>
      {grid.flatMap((row, r) =>
        [...row].map((k, c) => <rect key={`${r}-${c}`} x={x + c} y={y + r} width={1.02} height={1.02} fill={PX[k]} />),
      )}
    </>
  );
}

/** The 8x8 pixel head; a skin-coloured strip flashes over the eyes to blink. */
function PixelHead({ x, y }: { x: number; y: number }) {
  return (
    <>
      <Pixels grid={HEAD} x={x} y={y} />
      <rect className="bs-pixel-blink" x={x + 1} y={y + 4} width={6} height={1.02} fill={PX.S} />
    </>
  );
}

function PixelFigure() {
  const headStyle: CSSProperties = {
    transform: 'translate(calc(var(--mx, 0) * 0.5px), calc(var(--my, 0) * 0.35px))',
    transition: 'transform 200ms ease-out',
  };
  return (
    <svg className="bs-avatar-pixel" viewBox="-1 -1 18 34" shapeRendering="crispEdges" role="img" aria-label="A pixel-block character waving hello">
      <Pixels grid={LEG_L} x={4} y={20} />
      <Pixels grid={LEG_R} x={8} y={20} />
      <Pixels grid={ARM} x={0} y={8} />
      <Pixels grid={TORSO} x={4} y={8} />
      <g className="bs-avatar-arm-wave">
        <Pixels grid={ARM.map((r) => [...r].reverse().join(''))} x={12} y={8} />
      </g>
      <g style={headStyle}>
        <PixelHead x={4} y={0} />
      </g>
    </svg>
  );
}

/** Full avatar: the rounded block character by day, a pixel-block character by night. */
export function AvatarFigure() {
  return (
    <>
      <div className="bs-day">
        <SoftFigure />
      </div>
      <div className="bs-night">
        <PixelFigure />
      </div>
    </>
  );
}

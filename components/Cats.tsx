// Byte the cat (ginger by day, white by night): face, sitting, walking and sleeping, plus a pixel sleeper for the night theme.

export type CatPalette = { fur: string; stripe: string; belly: string; eye: string };

/** Byte follows the theme through the --cat-* tokens. */
export const BYTE: CatPalette = {
  fur: 'var(--cat-fur)',
  stripe: 'var(--cat-stripe)',
  belly: 'var(--cat-belly)',
  eye: 'var(--cat-eye)',
};

/**
 * Byte the cat's face: used for the logo and the chat header.
 * Colours come from the --cat-* tokens: ginger by day, white with golden eyes by night.
 */
export function ByteFace() {
  return (
    <svg className="bs-cat" viewBox="16 0 50 50" aria-hidden="true">
      <polygon points="22,20 26,4 36,16" fill="var(--cat-fur)" />
      <polygon points="46,16 56,4 60,20" fill="var(--cat-fur)" />
      <polygon points="25,16 27,9 32,15" fill="var(--cat-ear)" />
      <polygon points="50,15 55,9 57,16" fill="var(--cat-ear)" />
      <rect x={20} y={12} width={42} height={34} rx={12} fill="var(--cat-fur)" />
      <rect x={28} y={12} width={6} height={8} rx={3} fill="var(--cat-stripe)" />
      <rect x={38} y={12} width={6} height={8} rx={3} fill="var(--cat-stripe)" />
      <rect x={48} y={12} width={6} height={8} rx={3} fill="var(--cat-stripe)" />
      <rect className="bs-avatar-eye" x={30} y={25} width={5} height={8} rx={2.5} fill="var(--cat-eye)" />
      <rect className="bs-avatar-eye" x={47} y={25} width={5} height={8} rx={2.5} fill="var(--cat-eye)" />
      <rect x={38} y={34} width={6} height={4} rx={2} fill="#e5787a" />
      <path d="M37 39 q4 3 8 0" stroke="var(--cat-line)" strokeWidth={1.6} strokeLinecap="round" fill="none" />
    </svg>
  );
}

/** A cat sitting, facing you. Byte by default; pass a palette for the other cats. */
export function ByteSit({ happy = false, palette = BYTE }: { happy?: boolean; palette?: CatPalette }) {
  const { fur, stripe, belly, eye } = palette;
  return (
    <svg className="bs-cat" viewBox="0 0 80 74" aria-hidden="true">
      <ellipse cx={41} cy={69} rx={26} ry={4} fill="#000000" opacity={0.15} />
      <g className="bs-tail">
        <rect x={56} y={42} width={8} height={26} rx={4} fill={fur} />
      </g>
      <rect x={24} y={38} width={34} height={30} rx={12} fill={fur} />
      <rect x={32} y={46} width={18} height={20} rx={8} fill={belly} />
      <polygon points="22,20 26,4 36,16" fill={fur} />
      <polygon points="46,16 56,4 60,20" fill={fur} />
      <rect x={20} y={12} width={42} height={34} rx={12} fill={fur} />
      <rect x={28} y={12} width={6} height={9} rx={3} fill={stripe} />
      <rect x={38} y={12} width={6} height={9} rx={3} fill={stripe} />
      <rect x={48} y={12} width={6} height={9} rx={3} fill={stripe} />
      {happy ? (
        <path d="M28 30 q4 -5 8 0 M46 30 q4 -5 8 0" stroke={eye} strokeWidth={2.5} strokeLinecap="round" fill="none" />
      ) : (
        <>
          <rect className="bs-avatar-eye" x={30} y={25} width={5} height={8} rx={2.5} fill={eye} />
          <rect className="bs-avatar-eye" x={47} y={25} width={5} height={8} rx={2.5} fill={eye} />
        </>
      )}
      <rect x={38} y={34} width={6} height={4} rx={2} fill="#e5787a" />
    </svg>
  );
}

/** Byte walking, side view facing right (flipped with CSS to walk left). */
export function ByteWalk() {
  return (
    <svg className="bs-cat" viewBox="0 0 100 74" aria-hidden="true">
      <ellipse cx={50} cy={69} rx={34} ry={4} fill="#000000" opacity={0.15} />
      <path className="bs-walk-tail" d="M20 34 q-14 -6 -12 -26" stroke="var(--cat-fur)" strokeWidth={8} strokeLinecap="round" fill="none" />
      {/* far legs (darker) */}
      <rect className="bs-leg bs-leg--b" x={26} y={42} width={9} height={24} rx={4.5} fill="var(--cat-stripe)" />
      <rect className="bs-leg bs-leg--a" x={62} y={42} width={9} height={24} rx={4.5} fill="var(--cat-stripe)" />
      <g className="bs-walk-body">
        <rect x={16} y={26} width={60} height={26} rx={13} fill="var(--cat-fur)" />
        <rect x={32} y={26} width={6} height={11} rx={3} fill="var(--cat-stripe)" />
        <rect x={44} y={26} width={6} height={11} rx={3} fill="var(--cat-stripe)" />
        <rect x={56} y={26} width={6} height={11} rx={3} fill="var(--cat-stripe)" />
        <polygon points="66,14 70,0 80,12" fill="var(--cat-fur)" />
        <polygon points="82,12 90,0 95,15" fill="var(--cat-fur)" />
        <rect x={62} y={8} width={36} height={32} rx={11} fill="var(--cat-fur)" />
        <rect className="bs-avatar-eye" x={84} y={18} width={5} height={8} rx={2.5} fill="var(--cat-eye)" />
        <rect x={93} y={28} width={5} height={4} rx={2} fill="#e5787a" />
        <rect x={74} y={28} width={8} height={4} rx={2} fill="var(--cat-cheek)" opacity={0.7} />
      </g>
      {/* near legs */}
      <rect className="bs-leg bs-leg--a" x={20} y={42} width={10} height={25} rx={5} fill="var(--cat-fur)" />
      <rect className="bs-leg bs-leg--b" x={56} y={42} width={10} height={25} rx={5} fill="var(--cat-fur)" />
    </svg>
  );
}

/** Byte lying down asleep (like Cache on the message card), head on the right. */
export function ByteSleep() {
  return (
    <svg className="bs-cat" viewBox="0 0 120 60" aria-hidden="true">
      <ellipse cx={62} cy={56} rx={50} ry={3.5} fill="#000000" opacity={0.15} />
      {/* tail curled around the front */}
      <path d="M20 50 q-14 -2 -10 -14" stroke="var(--cat-stripe)" strokeWidth={8} strokeLinecap="round" fill="none" />
      <g className="bs-breathe">
        <rect x={14} y={30} width={74} height={24} rx={12} fill="var(--cat-fur)" />
        <rect x={30} y={30} width={6} height={10} rx={3} fill="var(--cat-stripe)" />
        <rect x={44} y={30} width={6} height={10} rx={3} fill="var(--cat-stripe)" />
        <rect x={58} y={30} width={6} height={10} rx={3} fill="var(--cat-stripe)" />
      </g>
      {/* front paws tucked in */}
      <rect x={78} y={46} width={14} height={9} rx={4.5} fill="var(--cat-fur)" />
      <rect x={94} y={46} width={14} height={9} rx={4.5} fill="var(--cat-fur)" />
      <polygon points="80,22 86,6 95,20" fill="var(--cat-fur)" />
      <polygon points="100,20 110,6 114,24" fill="var(--cat-fur)" />
      <polygon points="83,19 86,11 91,18" fill="var(--cat-ear)" />
      <polygon points="103,18 108,11 111,20" fill="var(--cat-ear)" />
      <rect x={76} y={16} width={42} height={34} rx={12} fill="var(--cat-fur)" />
      <path d="M84 32 q4 4 8 0 M102 32 q4 4 8 0" stroke="var(--cat-line)" strokeWidth={2.4} strokeLinecap="round" fill="none" />
      <rect x={94} y={38} width={6} height={4} rx={2} fill="#e5787a" />
    </svg>
  );
}

// 14x7 pixel cat lying down asleep, head on the right:
// F fur, S stripe, L closed eye, N nose, T tail.
const PIXEL_SLEEP = [
  '.........F...F',
  '.........FFFFF',
  '.........FLFLF',
  '..FFFFFFFFFNFF',
  '.FFSFSFSFFFFFF',
  'TFFFFFFFFFFFFF',
  'TT.FF.....FF..',
];

/** Minecraft-style pixel version of the sleeping cat, for the night theme. */
export function PixelSleep() {
  const col: Record<string, string> = {
    F: 'var(--cat-fur)',
    S: 'var(--cat-stripe)',
    L: 'var(--cat-line)',
    N: '#e5787a',
    T: 'var(--cat-stripe)',
  };
  return (
    <svg className="bs-pixel-cat" viewBox="0 0 14 7" shapeRendering="crispEdges" aria-hidden="true">
      {PIXEL_SLEEP.flatMap((row, y) =>
        [...row].map((k, x) => (col[k] ? <rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill={col[k]} /> : null)),
      )}
    </svg>
  );
}

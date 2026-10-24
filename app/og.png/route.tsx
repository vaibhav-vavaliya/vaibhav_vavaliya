import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { profile } from '@/data/profile';

// Built once at export time into out/og.png, the social preview card for shared links.
// A route named og.png (rather than opengraph-image) keeps the .png extension, so hosts
// serve it as an image. The .woff fonts here are only read at build time.
export const dynamic = 'force-static';

const OG_SIZE = { width: 1200, height: 630 };

const BRICKS = [
  { x: 800, y: 330, w: 230, h: 84, c: '#335fff', e: '#1f3fbf' },
  { x: 1038, y: 330, w: 112, h: 84, c: '#d13a30', e: '#93241c' },
  { x: 852, y: 228, w: 186, h: 84, c: '#00b06f', e: '#00804f' },
  { x: 1046, y: 236, w: 84, h: 76, c: '#ffc83d', e: '#d99a12' },
];

function Brick({ x, y, w, h, c, e }: (typeof BRICKS)[number]) {
  const studs = Math.floor((w - 16) / 38);
  return (
    <div style={{ position: 'absolute', left: x, top: y - 12, width: w, height: h + 24, display: 'flex' }}>
      {Array.from({ length: studs }, (_, k) => (
        <div key={k} style={{ position: 'absolute', left: 14 + k * 38, top: 0, width: 26, height: 16, borderRadius: 7, background: c }} />
      ))}
      <div style={{ position: 'absolute', left: 0, top: 24, width: w, height: h, borderRadius: 16, background: e }} />
      <div style={{ position: 'absolute', left: 0, top: 12, width: w, height: h, borderRadius: 16, background: c }} />
    </div>
  );
}

export async function GET() {
  const fonts = join(process.cwd(), 'app', 'fonts');
  const [fredoka, nunito] = await Promise.all([readFile(join(fonts, 'fredoka-700.woff')), readFile(join(fonts, 'nunito-700.woff'))]);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          background: '#f2f4f5',
          backgroundImage: 'radial-gradient(circle at center, #191b1d12 0 5px, transparent 5.5px)',
          backgroundSize: '32px 32px',
          fontFamily: 'Nunito',
          color: '#191b1d',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', padding: '70px 80px' }}>
          <div
            style={{
              display: 'flex',
              alignSelf: 'flex-start',
              padding: '6px 18px',
              borderRadius: 10,
              background: '#ffffff',
              border: '2px solid #dfe2e6',
              boxShadow: '0 4px 0 0 #cfd3d8',
              fontSize: 26,
              color: '#007a4b',
            }}
          >
            Portfolio
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: 26, fontFamily: 'Fredoka', fontSize: 118, lineHeight: 0.95, letterSpacing: -2 }}>
            <span>Vaibhav</span>
            <span style={{ display: 'flex' }}>
              Vavaliya<span style={{ color: '#335fff' }}>.</span>
            </span>
          </div>
          <div style={{ display: 'flex', marginTop: 30, fontFamily: 'Fredoka', fontSize: 42 }}>Full Stack & Backend Developer</div>
          <div style={{ display: 'flex', marginTop: 12, fontSize: 28, color: '#5f6670' }}>NestJS · Node.js · Django · Docker · Kubernetes</div>
        </div>
        {BRICKS.map((b, k) => (
          <Brick key={k} {...b} />
        ))}
        <div style={{ position: 'absolute', left: 80, bottom: 52, display: 'flex', gap: 18, fontSize: 26, color: '#5f6670' }}>
          <span style={{ color: '#335fff' }}>{profile.siteUrl.replace('https://', '')}</span>
          <span>·</span>
          <span>Surat, India</span>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: 'Fredoka', data: fredoka, weight: 700, style: 'normal' },
        { name: 'Nunito', data: nunito, weight: 700, style: 'normal' },
      ],
    },
  );
}

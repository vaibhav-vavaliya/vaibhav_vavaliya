import type { Metadata, Viewport } from 'next';
import { Fredoka, Nunito, Pixelify_Sans } from 'next/font/google';
import { themeScript } from '@/components/ThemeToggle';
import { profile } from '@/data/profile';
import './tokens.css';
import './blockstead.css';

const fredoka = Fredoka({ subsets: ['latin'], weight: ['600', '700'], variable: '--font-fredoka' });
const nunito = Nunito({ subsets: ['latin'], weight: ['500', '700', '800'], variable: '--font-nunito' });
const pixelify = Pixelify_Sans({ subsets: ['latin'], weight: ['500'], variable: '--font-pixelify' });

export const metadata: Metadata = {
  title: `${profile.fullName} · ${profile.role}`,
  description: profile.tagline,
  // Bump ?v= whenever the icon changes so browsers drop their cached copy.
  icons: { icon: '/favicon.svg?v=byte3' },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f2f4f5' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fredoka.variable} ${nunito.variable} ${pixelify.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bs-root bs-baseplate">{children}</body>
    </html>
  );
}

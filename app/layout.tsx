import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { themeScript } from '@/components/ThemeToggle';
import { profile } from '@/data/profile';
import './tokens.css';
import './blockstead.css';

// Google Fonts (latin subset) kept in the repo so builds never depend on fetching them.
const fredoka = localFont({ src: './fonts/fredoka-latin.woff2', weight: '300 700', variable: '--font-fredoka' });
const nunito = localFont({ src: './fonts/nunito-latin.woff2', weight: '200 1000', variable: '--font-nunito' });
const pixelify = localFont({ src: './fonts/pixelify-sans-latin.woff2', weight: '400 700', variable: '--font-pixelify' });

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

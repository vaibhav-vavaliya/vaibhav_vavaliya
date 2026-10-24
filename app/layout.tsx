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

const title = `${profile.fullName} · Full Stack & Backend Developer`;
// Social preview card, generated at build time by app/og.png/route.tsx.
const ogImage = { url: '/og.png', width: 1200, height: 630, alt: title, type: 'image/png' };
const description = `${profile.fullName} is a full stack and backend developer from Surat, India. Explore Vaibhav's projects, experience and skills: REST APIs, JWT role-based auth, NestJS, Node.js, Django, Docker and Kubernetes.`;

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: { default: title, template: `%s · ${profile.fullName}` },
  description,
  applicationName: profile.fullName,
  authors: [{ name: profile.fullName, url: profile.siteUrl }],
  creator: profile.fullName,
  publisher: profile.fullName,
  keywords: [
    profile.fullName,
    profile.name,
    'Vaibhav Vavaliya portfolio',
    'Vaibhav Vavaliya developer',
    'full stack developer',
    'backend developer',
    'Surat',
    'Gujarat',
    'India',
    'NestJS',
    'Node.js',
    'Django',
    'REST API',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'profile',
    url: '/',
    siteName: profile.fullName,
    title,
    description,
    locale: 'en_US',
    firstName: 'Vaibhav',
    lastName: 'Vavaliya',
    username: 'vaibhav-vavaliya',
    images: [ogImage],
  },
  twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  category: 'technology',
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

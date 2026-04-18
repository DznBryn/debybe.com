import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_LANDING_URL ?? 'https://debybe.com'),
  title: {
    default: 'Brian Demorcy — Senior Full-Stack JavaScript Engineer',
    template: '%s · Brian Demorcy',
  },
  description:
    'Senior Full-Stack JavaScript Engineer focused on scalable frontend architecture, micro-frontends, and TypeScript-first systems with React, Next.js, Remix, and Hydrogen.',
  openGraph: {
    type: 'website',
    title: 'Brian Demorcy',
    description:
      'Senior Full-Stack JavaScript Engineer — scalable frontend architecture, micro-frontends, headless commerce.',
    url: '/',
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0b',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}

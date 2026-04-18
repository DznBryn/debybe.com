import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Nav } from '@debybe/ui';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BLOG_URL ?? 'https://blog.debybe.com'),
  title: {
    default: 'debybe blog',
    template: '%s · debybe blog',
  },
  description:
    'Notes on systems design, AI in production, reliability, and the practical edges of engineering.',
  alternates: {
    types: {
      'application/rss+xml': '/rss.xml',
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0b',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body>
        <Nav active="blog" />
        {children}
      </body>
    </html>
  );
}

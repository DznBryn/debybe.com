import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

import ClientProvider from '@/components/ClientProvider';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Debybe & Co LLC',
	description: 'Frontend Engineer/Software Engineer based in the USA. We build custom software solutions for businesses of all sizes. Headless CMS, E-commerce, and more.',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<ClientProvider>{children}</ClientProvider>
			</body>
		</html>
	);
}

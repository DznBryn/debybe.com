'use client';
import Footer from './Footer';
import { InputProvider } from './InputContext';
import StickyBadge from './StickyBadge';

export default function ClientProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<InputProvider>
			{children}
			<Footer />
			<StickyBadge />
		</InputProvider>
	);
}

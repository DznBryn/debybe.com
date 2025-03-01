import React from 'react';
import Link from 'next/link';

interface NavItemProps {
    href: string;
    children: React.ReactNode;
    target?: string;
}

const NavItem: React.FC<NavItemProps> = ({ href, children, target }) => {
    return (
			<li>
				<Link
					href={href}
					target={target}
					className='bg-white border-2 border-red-950 hover:bg-red-950 text-red-950 hover:text-white py-4 px-6 rounded-full transition duration-300 font-semibold'>
					{children}
				</Link>
			</li>
		);
};

export default NavItem; 
import React, { useState } from 'react';
import NavItem from './NavItem';

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
			<nav className='text-white p-4 w-full max-w-xl'>
				<div className='flex items-center w-full justify-center'>
					<button onClick={toggleMenu} className='md:hidden'>
						<div className='w-8 h-1 border rounded-full bg-red-950 mb-1'></div>
						<div className='w-8 h-1 border rounded-full bg-red-950 mb-1'></div>
						<div className='w-8 h-1 border rounded-full bg-red-950'></div>
					</button>
					<ul
						className={`hidden justify-between space-x-4 w-full md:flex md:space-x-4 `}>
						<NavItem href='/apps/todo'>Projects</NavItem>
						<NavItem href='/about'>About</NavItem>
						<NavItem href='/services'>Services</NavItem>
						<NavItem href='/contact'>Contact</NavItem>
					</ul>
				</div>

				{isOpen && (
					<div className='fixed inset-0 bg-white bg-opacity-95 flex flex-col items-center justify-center z-50'>
						<button
							onClick={toggleMenu}
							className='absolute top-4 right-4 text-red-950 text-2xl'>
							X
						</button>
						<ul className='flex flex-col justify-center items-center space-y-16'>
							<NavItem href='/apps/todo'>Projects</NavItem>
							<NavItem href='/about'>About</NavItem>
							<NavItem href='/services'>Services</NavItem>
							<NavItem href='/contact'>Contact</NavItem>
						</ul>
					</div>
				)}
			</nav>
		);
};

export default Navbar; 
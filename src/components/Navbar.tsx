import React from 'react';
import NavItem from './NavItem';

const Navbar: React.FC = () => {
    return (
        <nav className="text-white p-4 w-full max-w-xl">
            <ul className="flex justify-between space-x-4 w-full">
                <NavItem href="/apps/todo">Projects</NavItem>
                <NavItem href="/about">About</NavItem>
                <NavItem href="/services">Services</NavItem>
                <NavItem href="/contact">Contact</NavItem>
            </ul>
        </nav>
    );
};

export default Navbar; 
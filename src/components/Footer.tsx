'use client';

import React from 'react';

const Footer: React.FC = () => {
	const currentYear = new Date().getFullYear(); // Get the current year

	return (
		<footer className="fixed bottom-0 left-0 w-full bg-gray-200 text-center p-4">
			<p>© {currentYear} Debybe & Co LLC. All rights reserved.</p>
			{/* Add footer links or other footer content here */}
		</footer>
	);
};

export default Footer;

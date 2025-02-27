import React from 'react';
import '../styles/AnimatedText.css';

interface AnimatedTextProps {
	content: string;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ content }) => {
	return (
		<div className='flex flex-col gap-4 p-2'>
      <h1 className='text-6xl font-bold animate-pulse text-red-950 max-w-72 sm:max-w-full'>
			{content.split('').map((char, index) => (
				<span key={index} className='char' style={{ animationDelay: `${index * 100}ms` }}>
					{char === ' ' ? '\u00A0' : char}
				</span>
			))}
		</h1>
    </div>
	);
};

export default AnimatedText;

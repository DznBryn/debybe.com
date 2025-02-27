'use client';

import React from 'react';
import Image from 'next/image';
import { FaGithubAlt } from 'react-icons/fa';

const StickyBadge: React.FC = () => {
	const githubProfile = {
		name: 'Bryan D.',
		image: 'https://avatars.githubusercontent.com/u/12739841?v=4',
		url: 'https://github.com/DznBryn/',
	};

	return (
		<div className='fixed right-8 bottom-16 z-50'>
			<div className='flex items-center bg-white p-3 rounded shadow-md gap-2'>
				<a
					href={githubProfile.url}
					target='_blank'
					rel='noopener noreferrer'
					className='ml-2  hover:underline flex items-center gap-2'>
					<Image
						src={githubProfile.image}
						alt={githubProfile.name}
						width={40}
						height={40}
						className='rounded-full'
					/>
					<FaGithubAlt className='text-red-950' size={25} />
					<span className=''>{githubProfile.name}</span>
				</a>
			</div>
		</div>
	);
};

export default StickyBadge;

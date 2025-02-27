'use client';
import React from 'react';
import TaskForm from './TaskForm';
import { TaskProvider, useTaskContext } from '@/context';
import TaskList from './TaskList';
import { MAX_LOCAL_STORAGE_SIZE } from '@/conts';

const Todo: React.FC = () => {
	return (
		<TaskProvider>
			<main className='p-6'>
				<header className='flex gap-4 mb-4'>
					<h1 className='text-3xl font-bold'>Todo List App</h1>
					<MemoryStatus />
				</header>
				<section className='flex flex-col sm:flex-row'>
					<div className='py-2 min-w-80 order-2 sm:order-1'>
						<TaskList />
					</div>
					<div className='py-2 px-4 w-full order-1 sm:order-2'>
						<TaskForm />
					</div>
				</section>
			</main>
		</TaskProvider>
	);
};

const MemoryStatus: React.FC = () => {
	const { usedLocalStorage } = useTaskContext();

	return (
		<div className='flex flex-col gap-1'>
			<p className={`text-xs m-0 p-0 ${usedLocalStorage >= MAX_LOCAL_STORAGE_SIZE ? 'text-red-500' : 'text-gray-400'}`}>
				Used: {usedLocalStorage} bytes
			</p>
			<p className='text-xs m-0 p-0 text-gray-400'>
				Total Storage: {MAX_LOCAL_STORAGE_SIZE} bytes
			</p>
		</div>
	);
};

export default Todo;

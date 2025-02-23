'use client';
import React from 'react';
import TaskForm from './TaskForm';
import { TaskProvider, useTaskContext } from '@/context';
import TaskList from './TaskList';
import { MAX_LOCAL_STORAGE_SIZE } from '@/conts';

export function Home() {
	return (
		<div className='p-6'>
			<TaskProvider>
				<div className='flex gap-4'>
					<h1 className='text-3xl mb-4 font-bold'>Todo List App</h1>
					<MemoryStatus />
				</div>
				<div className='flex flex-col sm:flex-row'>
					<div className='py-2 min-w-80 order-2 sm:order-1'>
						<TaskList />
					</div>
					<div className='py-2 px-4 w-full order-1 sm:order-2'>
						<TaskForm />
					</div>
				</div>
			</TaskProvider>
		</div>
	);
}

const MemoryStatus = () => {
	const { usedLocalStorage } = useTaskContext();
	return (
		<div className='flex flex-col gap-1'>
			<p
				className={`${
					usedLocalStorage >= MAX_LOCAL_STORAGE_SIZE
						? 'text-red-500'
						: 'text-gray-400'
				} text-xs m-0 p-0`}>
				Used: {usedLocalStorage} bytes
			</p>
			<p className='text-xs m-0 p-0 text-gray-400'>
				Total Storage: {MAX_LOCAL_STORAGE_SIZE} bytes
			</p>
		</div>
	);
};

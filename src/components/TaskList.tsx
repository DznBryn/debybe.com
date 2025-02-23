import { useTaskContext } from '@/context';
import TaskItem from './TaskItem';

const TaskList = () => {
	const { tasks } = useTaskContext();

	return (
		<div className='flex flex-col gap-4'>
			<div className='flex flex-col gap-2'>
				<div className='flex justify-between bg-gray-100 p-2 h-full'>
					<h3 className='text-lg font-bold'>Active</h3>
				</div>
				{Array.from(tasks).filter((task) => !task.done).length > 0 ? (
					<ul className=' overflow-auto max-h-96'>
						{Array.from(tasks)
							.filter((task) => !task.done)
							.map((task) => (
								<li key={task.id}>
									<TaskItem task={task} />
								</li>
							))}
					</ul>
				) : (
					<p>No active tasks</p>
				)}
			</div>
			<div className='flex flex-col gap-2'>
				<div className='flex justify-between bg-gray-100 p-2 h-full'>
					<h3 className='text-lg font-bold'>Completed</h3>
				</div>
				{Array.from(tasks).filter((task) => task.done).length > 0 ? (
					<ul className='overflow-auto max-h-96'>
						{Array.from(tasks)
							.filter((task) => task.done)
							.map((task) => (
								<li key={task.id}>
									<TaskItem task={task} />
								</li>
							))}
					</ul>
				) : (
					<p>No completed tasks</p>
				)}
			</div>
		</div>
	);
};

export default TaskList;

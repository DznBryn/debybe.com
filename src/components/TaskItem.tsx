import { useTaskContext } from '@/context';
import { Task } from '@/interfaces/Task';

const TaskItem = ({ task }: { task: Task }) => {
	const { setSelectedTask } = useTaskContext();
	const getDate =
		task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate);


	return (
		<div className='py-2 border-b border-gray-300'>
			<h2 className='text-lg font-bold cursor-pointer' onClick={() => setSelectedTask(task)}>
				{task.title}
			</h2>
			<div>
				<p className='text-sm'>Due Date: {getDate.toLocaleDateString()}</p>
				<p className='text-sm'>Status: {task.done ? 'Done' : 'Pending'}</p>
			</div>
		</div>
	);
};

export default TaskItem;

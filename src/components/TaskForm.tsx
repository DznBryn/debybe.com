'use client';
import { useTaskContext } from '@/context';
import { MAX_LOCAL_STORAGE_SIZE } from '@/conts';
import { Task, TaskProps } from '@/interfaces/Task';
import { getLocalStorageSize } from '@/utils';
import { validate } from 'class-validator';
import { useEffect, useState } from 'react';

const TaskForm: React.FC = () => {
	const context = useTaskContext();
	const {
		setTasks,
		selectedTask,
		tasks,
		setSelectedTask,
		setUsedLocalStorage,
	} = context;
	const [toggle, setToggle] = useState(selectedTask ? true : false);
	const initalState = {
		title: '',
		description: '',
		dueDate: new Date(),
		done: false,
	};
	const [state, setState] = useState<TaskProps | Task>(
		selectedTask ?? initalState
	);

	const submitHandler = async (e: React.FormEvent, formAction: string) => {
		e.preventDefault();
		if (formAction === 'DELETE_TASK') {
			const updatedTasks = tasks.filter(
				(task: Task) => task.id !== (state as Task).id
			);
			setTasks(updatedTasks);
			setSelectedTask(null);
			setToggle(false);
			return;
		}
		if (selectedTask && selectedTask?.id === (state as Task).id) {
			const updateSelectedTask = selectedTask.update(state as Task);
			const updatedTasks = tasks.map((task: Task) => {
				if (task.id === selectedTask.id) {
					return updateSelectedTask;
				}
				return task;
			});
			setTasks(updatedTasks);
			setSelectedTask(null);
			setToggle(false);
		} else {
			const taskObject = new Task(state);
			validate(taskObject).then((errors) => {
				if (errors.length > 0) {
					console.log(errors);
					return;
				} else {
					console.log('Task is valid', taskObject);
					console.log(`LocalStorage - ${getLocalStorageSize()} bytes`);
					setUsedLocalStorage(getLocalStorageSize());
					if (getLocalStorageSize() > MAX_LOCAL_STORAGE_SIZE) {
						alert(
							'Local Storage is full. Please delete some tasks to add new ones.'
						);
						return;
					}
					setTasks([taskObject, ...tasks]);
					setToggle(false);
				}
			});
		}
	};

	const cancelHandler = () => {
		setSelectedTask(null);
		setState(initalState);
		setToggle(false);
	};

	useEffect(() => {
		if (selectedTask) {
			const item = {
				...selectedTask,
				dueDate:
					selectedTask.dueDate instanceof Date
						? selectedTask.dueDate
						: new Date(selectedTask.dueDate),
			};
			setState(item);
			setToggle(true);
		}
	}, [selectedTask]);

	return toggle ? (
		<form className=''>
			<div className='flex flex-col mb-2 gap-2'>
				<label htmlFor='title'>Title</label>
				<input
					type='text'
					id='title'
					className='w-full border border-gray-300 rounded-md p-2'
					onChange={(e) => setState({ ...state, title: e.target.value })}
					value={state.title}
				/>
			</div>
			<div className='flex flex-col mb-2 gap-2'>
				<label htmlFor='description'>Description</label>
				<textarea
					id='description'
					className='w-full min-h-40 border border-gray-300 rounded-md p-2'
					onChange={(e) => setState({ ...state, description: e.target.value })}
					value={state.description}
				/>
			</div>
			<div className='flex flex-col mb-2 gap-2 w-full max-w-60'>
				<label htmlFor='dueDate'>Due Date</label>
				<input
					className='border border-gray-300 rounded-md p-2'
					type='date'
					id='dueDate'
					onChange={(e) =>
						setState({ ...state, dueDate: new Date(e.target.value) })
					}
					value={state.dueDate.toISOString().split('T')[0]}
				/>
			</div>
			{selectedTask && (
				<div className='flex flex-col mb-2 gap-2'>
					<label htmlFor='done'>Status</label>
					<select
						className='border border-gray-300 rounded-md p-2'
						onChange={(e) =>
							setState({ ...state, done: e.target.value === 'true' })
						}
						value={state.done.toString()}>
						<option value='true'>Done</option>
						<option value='false'>Pending</option>
					</select>
				</div>
			)}
			<div className='flex flex-row gap-6'>
				<button
					className='bg-green-500 text-white p-2 px-4 font-bold rounded-md'
					onClick={(event) =>
						submitHandler(event, selectedTask ? 'UPDATE_TASK' : 'CREATE_TASK')
					}
					type='submit'>
					{selectedTask ? 'Update Task' : 'Create Task'}
				</button>
				{selectedTask && (
					<button
						className='bg-red-500 text-white p-2 px-4 font-bold rounded-md'
						onClick={(event) => submitHandler(event, 'DELETE_TASK')}
						type='submit'>
						{'Delete Task'}
					</button>
				)}
				<button
					className='bg-slate-400 text-white p-2 px-4 font-bold rounded-md'
					onClick={cancelHandler}>
					{'Cancel'}
				</button>
			</div>
		</form>
	) : (
		<div className='w-full h-full flex justify-center items-center'>
			<button
				className='bg-blue-500 text-white p-2 px-4 font-bold rounded-md max-h-12'
				onClick={() => setToggle(true)}>
				Add New Task
			</button>
		</div>
	);
};

export default TaskForm;

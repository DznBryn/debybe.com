import { Task } from '@/interfaces/Task';
import { getLocalStorageSize } from '@/utils';
import { validate } from 'class-validator';
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react';

type TaskContextType = {
	tasks: Task[];
	selectedTask: Task | null;
	setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
	setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>;
	updateTask: (task: Task) => void;
	setUsedLocalStorage: React.Dispatch<React.SetStateAction<number>>;
	usedLocalStorage: number;
};

export const TaskContext = createContext<TaskContextType | undefined>(
	undefined
);

export const useTaskContext = () => {
	const context = useContext(TaskContext);
	if (!context) {
		throw new Error('useTaskContext must be used within a TaskProvider');
	}
	return context;
};

export const TaskProvider = ({ children }: { children: ReactNode }) => {
	const [tasks, setTasks] = useState<Task[]>(() => {
		if (typeof window !== 'undefined') {
			const tasks = localStorage.getItem('tasks');
			if (tasks) {
				const savedTasks = JSON.parse(tasks);
				return Array.from(savedTasks as Task[]).map(
					(task: Task) => new Task(task)
				);
			}
		}
		return [];
	});

	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const [usedLocalStorage, setUsedLocalStorage] = useState<number>(0);

	const updateTask = (task: Task) => {
		validate(task).then((errors) => {
			if (errors.length > 0) {
				console.log(errors);
				return;
			} else {
				console.log('Task is valid', task);
				const updatedTasks = tasks.map((t: Task) => {
					if (t.id === task.id) {
						return task;
					}
					return t;
				});
				setTasks(updatedTasks);
				setSelectedTask(null);
			}
		});
	};

	useEffect(() => {
		if (typeof window !== 'undefined') {
      localStorage.setItem('tasks', JSON.stringify(tasks));
			setUsedLocalStorage(getLocalStorageSize());
    }
	}, [tasks]);

	return (
		<TaskContext.Provider
			value={{
				tasks,
				selectedTask,
				setTasks,
				setSelectedTask,
				updateTask,
				usedLocalStorage,
				setUsedLocalStorage,
			}}>
			{children}
		</TaskContext.Provider>
	);
};

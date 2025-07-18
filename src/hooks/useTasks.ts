import { useState, useMemo } from 'react';
import { Task, TaskFilter, TaskStats } from '@/types/task';

const defaultCategories = ['Work', 'Personal', 'Shopping', 'Health', 'Study'];

// Sample data for demonstration
const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'Design new landing page',
    description: 'Create a modern, responsive landing page for the new product launch',
    priority: 'high',
    category: 'Work',
    dueDate: new Date('2024-07-25'),
    completed: false,
    createdAt: new Date('2024-07-15'),
    updatedAt: new Date('2024-07-15'),
  },
  {
    id: '2',
    title: 'Buy groceries',
    description: 'Milk, bread, eggs, vegetables',
    priority: 'medium',
    category: 'Shopping',
    dueDate: new Date('2024-07-20'),
    completed: true,
    createdAt: new Date('2024-07-18'),
    updatedAt: new Date('2024-07-19'),
  },
  {
    id: '3',
    title: 'Prepare presentation',
    description: 'Quarterly review presentation for the team meeting',
    priority: 'high',
    category: 'Work',
    dueDate: new Date('2024-07-22'),
    completed: false,
    createdAt: new Date('2024-07-16'),
    updatedAt: new Date('2024-07-16'),
  },
  {
    id: '4',
    title: 'Schedule doctor appointment',
    priority: 'low',
    category: 'Health',
    completed: false,
    createdAt: new Date('2024-07-17'),
    updatedAt: new Date('2024-07-17'),
  },
];

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [filters, setFilters] = useState<TaskFilter>({});

  const categories = useMemo(() => {
    const taskCategories = Array.from(new Set(tasks.map(task => task.category)));
    return Array.from(new Set([...defaultCategories, ...taskCategories]));
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase()) &&
          !task.description?.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.category && task.category !== filters.category) {
        return false;
      }
      if (filters.priority && task.priority !== filters.priority) {
        return false;
      }
      if (filters.completed !== undefined && task.completed !== filters.completed) {
        return false;
      }
      return true;
    });
  }, [tasks, filters]);

  const stats = useMemo((): TaskStats => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = tasks.filter(task => !task.completed).length;
    const overdue = tasks.filter(task => 
      !task.completed && 
      task.dueDate && 
      new Date(task.dueDate) < new Date()
    ).length;

    return { total, completed, pending, overdue };
  }, [tasks]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = (id: string, taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, ...taskData, updatedAt: new Date() }
        : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const toggleTaskComplete = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, completed: !task.completed, updatedAt: new Date() }
        : task
    ));
  };

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    categories,
    filters,
    stats,
    setFilters,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
  };
}
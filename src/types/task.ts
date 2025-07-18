export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  dueDate?: Date;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskFilter {
  category?: string;
  priority?: Task['priority'];
  completed?: boolean;
  search?: string;
}

export type TaskStats = {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
};
import { useState } from 'react';
import { Calendar, Clock, Edit3, Trash2, Check } from 'lucide-react';
import { Task } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onToggleComplete, onEdit, onDelete }: TaskCardProps) {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleToggleComplete = async () => {
    setIsCompleting(true);
    setTimeout(() => {
      onToggleComplete(task.id);
      setIsCompleting(false);
    }, 500);
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-low';
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <div 
      className={`gradient-card rounded-lg p-4 transition-all duration-300 hover:shadow-lg ${
        task.completed ? 'opacity-75' : ''
      } ${getPriorityColor(task.priority)} animate-task-enter ${
        isCompleting ? 'animate-task-complete' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={task.completed}
          onCheckedChange={handleToggleComplete}
          className="mt-1"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className={`font-semibold ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
              {task.title}
            </h3>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(task)}
                className="h-8 w-8 p-0"
              >
                <Edit3 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(task.id)}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {task.description && (
            <p className={`text-sm text-muted-foreground mb-3 ${
              task.completed ? 'line-through' : ''
            }`}>
              {task.description}
            </p>
          )}
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <Badge variant="secondary" className="capitalize">
              {task.category}
            </Badge>
            <Badge 
              variant={task.priority === 'high' ? 'destructive' : 
                     task.priority === 'medium' ? 'default' : 'secondary'}
              className="capitalize"
            >
              {task.priority}
            </Badge>
          </div>
          
          {task.dueDate && (
            <div className={`flex items-center gap-1 text-xs ${
              isOverdue ? 'text-destructive' : 'text-muted-foreground'
            }`}>
              <Calendar className="h-3 w-3" />
              <span>Due {format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
              {isOverdue && (
                <Badge variant="destructive" className="ml-2 text-xs">
                  Overdue
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
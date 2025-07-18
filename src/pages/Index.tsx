import { useState } from 'react';
import { Plus, CheckSquare } from 'lucide-react';
import { Task } from '@/types/task';
import { useTasks } from '@/hooks/useTasks';
import { TaskCard } from '@/components/TaskCard';
import { TaskForm } from '@/components/TaskForm';
import { TaskFilters } from '@/components/TaskFilters';
import { TaskStats } from '@/components/TaskStats';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import heroImage from '@/assets/hero-image.jpg';

const Index = () => {
  const {
    tasks,
    categories,
    filters,
    stats,
    setFilters,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
  } = useTasks();

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { toast } = useToast();

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
      toast({
        title: "Task updated",
        description: "Your task has been successfully updated.",
      });
    } else {
      addTask(taskData);
      toast({
        title: "Task created",
        description: "Your new task has been added to the list.",
      });
    }
    handleCloseForm();
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
    toast({
      title: "Task deleted",
      description: "The task has been removed from your list.",
      variant: "destructive",
    });
  };

  const handleToggleComplete = (id: string) => {
    const task = tasks.find(t => t.id === id);
    toggleTaskComplete(id);
    toast({
      title: task?.completed ? "Task reopened" : "Task completed",
      description: task?.completed ? "Task marked as pending." : "Great job! Task marked as complete.",
    });
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative gradient-primary">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center text-primary-foreground">
              <div className="flex items-center justify-center gap-3 mb-4">
                <CheckSquare className="h-12 w-12" />
                <h1 className="text-4xl md:text-6xl font-bold">TaskMaster</h1>
              </div>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Organize your work and life, finally.
              </p>
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => setShowForm(true)}
                className="text-primary shadow-lg"
              >
                <Plus className="mr-2 h-5 w-5" />
                Create Your First Task
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="mb-8">
          <TaskStats stats={stats} />
        </div>

        {/* Filters */}
        <div className="mb-6">
          <TaskFilters
            filters={filters}
            onFiltersChange={setFilters}
            categories={categories}
          />
        </div>

        {/* Task Form */}
        {showForm && (
          <div className="mb-6">
            <TaskForm
              task={editingTask || undefined}
              onSave={handleSaveTask}
              onCancel={handleCloseForm}
              categories={categories}
            />
          </div>
        )}

        {/* Tasks Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            Your Tasks ({tasks.length})
          </h2>
          {!showForm && (
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          )}
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <CheckSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No tasks found</h3>
              <p className="text-muted-foreground mb-4">
                {Object.keys(filters).length > 0 && Object.values(filters).some(v => v !== undefined && v !== '')
                  ? "Try adjusting your filters or create a new task."
                  : "Get started by creating your first task!"}
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Task
              </Button>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;

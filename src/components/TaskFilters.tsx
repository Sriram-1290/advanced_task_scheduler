import { Search, Filter, X } from 'lucide-react';
import { Task, TaskFilter } from '@/types/task';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TaskFiltersProps {
  filters: TaskFilter;
  onFiltersChange: (filters: TaskFilter) => void;
  categories: string[];
}

export function TaskFilters({ filters, onFiltersChange, categories }: TaskFiltersProps) {
  const updateFilter = (key: keyof TaskFilter, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== ''
  );

  return (
    <div className="gradient-card rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <h3 className="font-medium">Filters</h3>
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={filters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={filters.category || 'all'} onValueChange={(value) => 
          updateFilter('category', value === 'all' ? undefined : value)
        }>
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.priority || 'all'} onValueChange={(value) => 
          updateFilter('priority', value === 'all' ? undefined : value as Task['priority'])
        }>
          <SelectTrigger>
            <SelectValue placeholder="All Priorities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        <Select value={
          filters.completed === undefined ? 'all' : 
          filters.completed ? 'completed' : 'pending'
        } onValueChange={(value) => 
          updateFilter('completed', 
            value === 'all' ? undefined : 
            value === 'completed' ? true : false
          )
        }>
          <SelectTrigger>
            <SelectValue placeholder="All Tasks" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tasks</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="secondary" className="gap-1">
              Search: {filters.search}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilter('search', '')}
              />
            </Badge>
          )}
          {filters.category && (
            <Badge variant="secondary" className="gap-1">
              Category: {filters.category}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilter('category', undefined)}
              />
            </Badge>
          )}
          {filters.priority && (
            <Badge variant="secondary" className="gap-1">
              Priority: {filters.priority}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilter('priority', undefined)}
              />
            </Badge>
          )}
          {filters.completed !== undefined && (
            <Badge variant="secondary" className="gap-1">
              Status: {filters.completed ? 'Completed' : 'Pending'}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilter('completed', undefined)}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
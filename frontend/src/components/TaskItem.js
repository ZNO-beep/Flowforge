import React from 'react';
import { Trash2, CheckCircle, Circle } from 'lucide-react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { cn } from '../lib/utils';

function TaskItem({ task, onDelete, onToggleComplete }) {
  return (
    <div className={cn(
      "flex items-center justify-between p-4 rounded-lg border bg-card",
      task.completed && "bg-muted"
    )}>
      <div className="flex items-center gap-3 flex-1">
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => onToggleComplete(task.id)}
        />
        <div className="flex-1">
          <h3 className={cn(
            "text-lg font-medium",
            task.completed && "line-through text-muted-foreground"
          )}>
            {task.title}
          </h3>
          {task.description && (
            <p className={cn(
              "text-sm text-muted-foreground",
              task.completed && "line-through"
            )}>
              {task.description}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onToggleComplete(task.id)}
        >
          {task.completed ? (
            <CheckCircle className="h-5 w-5 text-primary" />
          ) : (
            <Circle className="h-5 w-5" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(task.id)}
        >
          <Trash2 className="h-5 w-5 text-destructive" />
        </Button>
      </div>
    </div>
  );
}

export default TaskItem; 
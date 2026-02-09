import { Component, inject, input, output } from '@angular/core';
import { ADD } from '../../util/icons';
import { TaskCard } from '../task-card/task-card';
import { TaskService } from '../../services/tasks/task.service';

@Component({
  selector: 'app-kanban-column',
  imports: [TaskCard],
  template: `
    <div
      class="sticky flex items-center justify-between bg-background rounded-t-lg p-4 border-b border-border"
    >
      <div class="flex items-center space-x-2">
        <h2 class="font-semibold text-foreground">{{ title() }}</h2>
        <span class="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
          {{ tasks()?.length || 0 }}
        </span>
      </div>
      @if (onAddClick) {
        <button
          (click)="onAddClick.emit(title())"
          class="text-foreground/40 hover:text-foreground/50 cursor-pointer"
        >
          {{ ADD }}
        </button>
      }
    </div>

    <div
      class="grow p-4 space-y-3"
      (dragover)="onDragOver($event)"
      (drop)="onDragDrop($event, title())"
    >
      @for (task of tasks(); track task.Id) {
        <div draggable="true" (dragstart)="onDragStart($event, task.Id!)">
          <app-task-card [task]="task" />
        </div>
      }

      @if (!tasks()?.length) {
        <div class="text-center py-16 text-muted-foreground">
          <p class="text-sm">No tasks yet</p>
          <button
            (click)="onAddClick.emit(title())"
            class="text-primary hover:text-primary-dark text-sm mt-1"
          >
            Add your first task
          </button>
        </div>
      }
    </div>
  `,
  styles: ``,
})
export class KanbanColumn {
  taskService = inject(TaskService)
  tasks = input<Task[]>();
  title = input.required<string>();
  ADD = ADD;
  onAddClick = output<string>();

  onDragStart = (event: Event, taskId: string) => {
    const e = event as DragEvent;
    e.dataTransfer?.setData('text/plain', taskId);
  };

  onDragOver = (e: Event) => {
    e.preventDefault();
  };

  onDragDrop = async(event: Event, targetStatus: string) => {
    event.preventDefault();

    const e = event as DragEvent;
    const taskId = e.dataTransfer?.getData('text/plain');
    if(taskId)
     await this.taskService.changeStatus(taskId, targetStatus)
  };
}

import { Component, computed, inject, linkedSignal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { KanbanColumn } from '../../components/kanban-column/kanban-column';
import { TaskService } from '../../services/tasks/task.service';
import { sortDsc } from '../../util/common';
import { NEW } from '../../util/constants';

@Component({
  selector: 'app-dashboard',
  imports: [KanbanColumn, RouterOutlet],
  template: `
    <!-- Mobile: pick a single status to view -->
    <div class="sm:hidden w-full shrink-0">
      <select
        (change)="onStatusChange($event)"
        class="w-full px-3 py-2 border border-muted-foreground/30 rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-transparent"
      >
        @for (group of groups(); track group) {
          <option [value]="group" [selected]="group === selectedStatus()">
            {{ group }} ({{ groupedTasks()[group]?.length || 0 }})
          </option>
        }
      </select>
    </div>

    <!-- Desktop: all columns side by side with horizontal scroll. Mobile: only the selected column -->
    <div class="flex-1 min-h-0 w-full flex flex-row gap-4 overflow-auto">
      @for (group of groups(); track group) {
        <app-kanban-column
          [title]="group"
          [tasks]="groupedTasks()[group]"
          (onAddClick)="onAddClick($event)"
          [class]="columnClass(group)"
        />
      }
    </div>

    <router-outlet />
  `,
  //:host { display: contents; } -> angular trick: then browser treats like the selector doesn't exists
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export class Dashboard {
  taskService = inject(TaskService);
  router = inject(Router);

  groups = computed(() => {
    const ARCHIVE = this.taskService.config()['Workflow Statuses']['ARCHIVE_STATUS'];
    return this.taskService.config().Statuses.filter((status) => status != ARCHIVE);
  });

  selectedStatus = linkedSignal<string>(() => this.groups()[0]);

  tasks = computed(() => this.taskService.tasks());

  groupedTasks = computed(() =>
    this.tasks()
      .sort(sortDsc)
      .reduce(
        (pre, cur) => {
          if (!pre[cur.Status]) {
            pre[cur.Status] = [];
          }

          pre[cur.Status].push(cur);

          return pre;
        },
        {} as Record<string, Task[]>,
      ),
  );

  onAddClick(status: string) {
    this.router.navigate(['', NEW], { queryParams: { status } });
  }

  onStatusChange(event: Event) {
    this.selectedStatus.set((event.target as HTMLSelectElement).value);
  }

  columnClass(group: string) {
    const visibility = this.selectedStatus() === group ? 'flex' : 'hidden sm:flex';
    return `${visibility} flex-col h-fit w-full sm:w-80 sm:shrink-0 rounded-lg border border-border`;
  }
}

export default Dashboard;

import { Component, computed, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { KanbanColumn } from '../../components/kanban-column/kanban-column';
import { TaskService } from '../../services/tasks/task.service';
import { sortDsc } from '../../util/common';
import { NEW } from '../../util/constants';

@Component({
  selector: 'app-dashboard',
  imports: [KanbanColumn, RouterOutlet],
  template: `
    @for (group of groups(); track group) {
      <app-kanban-column
        [title]="group"
        [tasks]="groupedTasks()[group]"
        (onAddClick)="onAddClick($event)"
        class="flex flex-col h-fit shrink-0 w-80 rounded-lg border border-border"
      />
    }
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
}

export default Dashboard;

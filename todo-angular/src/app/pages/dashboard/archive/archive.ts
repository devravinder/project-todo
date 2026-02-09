import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ResolveFn, Router } from '@angular/router';
import { KanbanColumn } from '../../../components/kanban-column/kanban-column';
import { Modal } from '../../../components/modal/modal';
import { TaskService } from '../../../services/tasks/task.service';

export const archiveTasksResolver: ResolveFn<{ tasks: Task[]; status: string }> = () => {
  const taskService = inject(TaskService);
  const status = taskService.config()['Workflow Statuses']['ARCHIVE_STATUS'];
  return { tasks: taskService.getTasksByStatus(status), status };
};

@Component({
  selector: 'app-archive',
  imports: [Modal, KanbanColumn],
  template: `
    <app-modal [isOpen]="true" (onClose)="goToParent()" class="absolute">
      <app-kanban-column
        [title]="archiveData().status"
        [tasks]="archiveData().tasks"
        class="flex flex-col h-fit min-h-[80vh] shrink-0 w-80 rounded-lg border border-border"
      />
    </app-modal>
  `,
  styles: ``,
})
export class Archive {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  data = toSignal(this.route.data);
  archiveData = computed(() => this.data()!['data'] as { tasks: Task[]; status: string });
  goToParent() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}

export default Archive;

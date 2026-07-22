import { Component, computed, inject } from '@angular/core';
import { SettingsForm } from '../../../components/settings-form/settings-form';
import { Modal } from '../../../components/modal/modal';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../../services/tasks/task.service';
import { clearDataWithPrompt } from '../../../util/db';

@Component({
  selector: 'app-settings',
  imports: [SettingsForm, Modal],
  template: `
    <app-modal [isOpen]="true" (onClose)="goToParent()" title="Settings" class="absolute">
      <app-settings-form
        [data]="formData()"
        (onCancel)="goToParent()"
        (onSave)="onSubmit($event)"
      />

      <div class="w-full flex flex-col gap-2 p-4 px-6 border-t border-border">
        <h3 class="text-sm font-semibold text-red-500">Danger Zone</h3>
        <p class="text-xs text-muted-foreground">
          Removes every project (local folder and browser storage) and all browser-stored
          tasks, then restarts the app. Files on disk (todo.md / todo.json) are not deleted.
        </p>
        <button
          type="button"
          (click)="onResetClick()"
          class="self-start cursor-pointer px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
        >
          Reset App Data
        </button>
      </div>
    </app-modal>
  `,
  styles: ``,
})
export class Settings {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  taskSerive = inject(TaskService);

  formData = computed(() => this.taskSerive.config());

  goToParent() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  async onSubmit({ value, changes }: { value: TodoConfig; changes: Change[] }) {
    this.taskSerive.onConfigChange(value, changes);
    this.goToParent();
  }

  async onResetClick() {
    await clearDataWithPrompt(
      'This removes every project and all browser-stored tasks, then restarts the app.\n\n' +
        'Do you want to continue?',
    );
  }
}

export default Settings;

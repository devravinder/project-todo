import { Component, inject, input, linkedSignal, output, signal } from '@angular/core';
import { ProjectService } from '../../services/project/project.service';
import { FileHandleService } from '../../services/util/file-handle/file-handle.service';
import { form, FormField } from '@angular/forms/signals';
import { ADD, MINUS } from '../../util/icons';

export interface ProjectFormData {
  activeProjectId: string;
  projects: Project[];
}

@Component({
  selector: 'app-project-form',
  imports: [FormField],
  template: `
    <!-- project-form.component.html -->
    <div class="flex-1 h-full w-full flex flex-col justify-between">
        <div class="flex-1 min-w-sm overflow-auto flex flex-col gap-4 p-4 px-3">
            <!-- Active Project Selection -->
              <div class="w-full flex flex-col gap-2 px-1">
                <label for="activeProjectId" class="block text-sm font-medium text-foreground/80">
                  Active Project
                </label>
                <div class="w-full flex flex-row gap-2">
                  <select
                    id="activeProjectId"
                    [formField]="form.activeProjectId"
                    class="w-full px-3 py-2 border border-muted-foreground/30 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-transparent"
                  >
                    @for (project of formData().projects; track project.id) {
                      <option [value]="project.id">
                        {{ project.name }}
                      </option>
                    }
                  </select>

                  <button
                    (click)="onNewProjectClick()"
                    [disabled]="isOpening()"
                    type="button"
                    class="px-4 py-2 bg-primary cursor-pointer disabled:cursor-not-allowed text-accent-foreground rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-none"
                  >
                    @if (isOpening()) {
                      <span class="animate-spin inline-block">{{ADD}}</span>
                    } @else {
                      <span>{{ADD}}</span>
                    }
                  </button>
                </div>
              </div>

            <!-- Error Message -->
            <div class="flex flex-row justify-center items-center">
              @if (error()) {
                <span class="text-red-500 text-sm w-fit px-4">{{ error() }}</span>
              } @else {
                <span>&nbsp;&nbsp;&nbsp;</span>
              }
            </div>

            <!-- Projects List -->
            <div>
              
              <div class="w-full flex flex-col gap-1 max-h-72 overflow-y-auto">
                <label for="projects" class="block text-sm font-medium text-foreground/80 px-1">
                  Projects
                </label>
                @for (project of formData().projects; track project.id; let i = $index) {
                  <div class="flex flex-row gap-2 p-1">
                    <input
                      [formField]="form.projects[i].name"
                      type="text"
                      (keydown)="onKeyDown($event)"
                      class="w-full px-3 py-2 border border-muted-foreground/30 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-transparent"
                    />
                    <button
                      type="button"
                      [disabled]="isActiveProject(project.id)"
                      (click)="onDeleteProject(i)"
                      class="cursor-pointer px-4 py-2 text-red-500 disabled:cursor-not-allowed disabled:bg-muted-foreground bg-red-200 hover:bg-red-300 rounded-lg"
                    >
                      {{MINUS}}
                    </button>
                  </div>
                } @empty {
                  <div class="text-center py-8 text-muted">
                    <p class="text-sm">No projects configured</p>
                  </div>
                }
              </div>
            </div>
        </div>

      <!-- Form Actions -->
      <div class="flex gap-4 p-4 px-6 items-end justify-between border-t border-border">
        <div class="flex flex-row gap-4">
          <button
            type="button"
            (click)="handleCancel()"
            class="cursor-pointer px-4 py-2 bg-secondary-dark text-muted-foreground rounded-md hover:bg-secondary-darker"
          >
            Cancel
          </button>
        </div>
        <div class="flex flex-row gap-4">
          <button
            type="button"
            (click)="handleReset()"
            class="cursor-pointer px-4 py-2 bg-secondary-dark text-muted-foreground rounded-md hover:bg-secondary-darker"
          >
            Reset
          </button>
          <button
            type="button"
            (click)="handleSubmit()"
            class="cursor-pointer px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  `,
   styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export class ProjectForm {

  ADD = ADD
  MINUS = MINUS
  // Inputs/Outputs
  data = input.required<ProjectFormData>();
  readonly formData = linkedSignal(() => this.data());
  onCancel = output<void>();
  onSave = output<ProjectFormData>();

  protected readonly form = form<ProjectFormData>(this.formData);

  // Services
  private projectService = inject(ProjectService);
  private fileHandler = inject(FileHandleService);

  // State
  error = signal('');
  isOpening = signal(false);

  async onNewProjectClick() {
    this.error.set('');
    this.isOpening.set(true);

    try {
      const fileHandleResult = await this.fileHandler.openFolder();

      if ('handle' in fileHandleResult) {
        const currentProjects = this.formData().projects;
        let isExists = false;

        for (const item of currentProjects) {
          if (item.fileHandle && (await item.fileHandle.isSameEntry(fileHandleResult.handle))) {
            isExists = true;
            break;
          }
        }

        if (isExists) {
          this.error.set('Already exists');
          return;
        }

        const newProject = this.projectService.getSampleNewProject(
          fileHandleResult.handle,
          fileHandleResult.path,
        );
        this.form.projects().value.update((pre) => [...pre, newProject]);
      }
    } catch (err) {
      console.error('Failed to open folder', err);
    } finally {
      this.isOpening.set(false);
    }
  }

  async onDeleteProject(index: number) {
    const project = this.formData().projects.at(index);
    await this.projectService.deleteProject(project!.id);

    this.form.projects().value.update((pre) => pre.filter((_, i) => i !== index));
  }

  isActiveProject(projectId: string): boolean {
    return this.form.activeProjectId().value() === projectId;
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }

  handleCancel() {
    this.onCancel.emit();
  }

  handleReset() {
    this.form().reset(this.data());
    this.error.set('');
  }

  handleSubmit() {
    const value = this.form().value();
    this.onSave.emit(value);
  }
}

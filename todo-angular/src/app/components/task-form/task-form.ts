import { NgClass } from '@angular/common';
import { Component, computed, inject, input, linkedSignal, output } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import dayjs from 'dayjs';
import { TaskService } from '../../services/tasks/task.service';
import { FORM_DATE_FORMAT } from '../../util/constants';
import { ADD, CHECK, CLOSE } from '../../util/icons';

interface SubTask {
  text: string;
  completed: boolean;
}
type FormData = Required<
  Omit<Task, 'Subtasks' | 'dueDate'> & {
    Subtasks: SubTask[];
    dueDate: string;
  }
>;

const parseSubtasksFromMarkdown = (subtasks?: string[]): SubTask[] => {
  return subtasks?.length
    ? subtasks.map((task) => {
        const completed = task.startsWith('[x]');
        const text = task.replace(/^\[[ x]\]\s*/, '');
        return { text, completed };
      })
    : [];
};

const toFormData = (task: Task): FormData => {
  const { Subtasks, dueDate, Tags, ...rest } = task;
  return {
    // all undefined files
    Id: '',
    Description: '',
    AssignedTo: '',
    startedDate: '',
    completedDate: '',
    lastModifiedDate: '',
    Category: '',
    Notes: '',

    ...rest,

    // modified
    Tags: Tags?.length ? Tags : [],
    dueDate: dueDate ? dayjs(dueDate).format(FORM_DATE_FORMAT) : dueDate,
    Subtasks: parseSubtasksFromMarkdown(Subtasks),
  };
};

const toData = (formData: FormData): Task => {
  const { Subtasks, dueDate, ...rest } = formData;
  return {
    ...rest,
    dueDate: new Date(dueDate),
    Subtasks: convertSubtasksToMarkdown(Subtasks),
  };
};

const convertSubtasksToMarkdown = (subTasks?: SubTask[]): string[] => {
  return subTasks?.length
    ? subTasks.map((task) => `[${task.completed ? 'x' : ' '}] ${task.text}`)
    : [];
};

@Component({
  selector: 'app-task-form',
  imports: [FormField, NgClass],
  template: `
    <div class="max-w-4xl mx-auto p-6">
      <div class="space-y-6">
        <!-- Title -->
        <div>
          <label for="title" class="block text-sm font-medium text-foreground/80 mb-2">Title</label>
          <input
            id="title"
            [formField]="taskForm.Title"
            type="text"
            class="w-full px-3 py-2 border border-muted-foreground/30 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-transparent"
            placeholder="Task title"
          />
        </div>

        <!-- Description -->
        <div>
          <label for="description" class="block text-sm font-medium text-foreground/80 mb-2"
            >Description</label
          >
          <textarea
            id="description"
            [formField]="taskForm.Description"
            rows="3"
            class="w-full px-3 py-2 border border-muted-foreground/30 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-transparent"
          ></textarea>
        </div>

        <!-- Grid: Priority, Category, AssignedTo, Due Date -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-foreground/80 mb-2">Priority</label>
            <select
              [formField]="taskForm.Priority"
              class="w-full px-3 py-2 border border-muted-foreground/30 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-transparent"
            >
              @for (p of priorities(); track p) {
                <option [value]="p">{{ p }}</option>
              }
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground/80 mb-2">Category</label>
            <select
              [formField]="taskForm.Category"
              class="w-full px-3 py-2 border border-muted-foreground/30 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-transparent"
            >
              <option value="">Unassigned</option>
              @for (c of categories(); track c) {
                <option [value]="c">{{ c }}</option>
              }
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground/80 mb-2">Assigned To</label>
            <select
              [formField]="taskForm.AssignedTo"
              class="w-full px-3 py-2 border border-muted-foreground/30 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-transparent"
            >
              <option value="">Unassigned</option>
              @for (u of users(); track u) {
                <option [value]="u">{{ u }}</option>
              }
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground/80 mb-2">Due Date</label>
            <input
              [formField]="taskForm.dueDate"
              type="date"
              class="w-full px-3 py-2 border border-muted-foreground/30 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-transparent"
            />
          </div>
        </div>

        <!-- Status -->
        <div>
          <label class="block text-sm font-medium text-foreground/80 mb-2">Status</label>
          <select
            [formField]="taskForm.Status"
            class="w-full px-3 py-2 border border-muted-foreground/30 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-transparent"
          >
            @for (s of statuses(); track s) {
              <option [value]="s">{{ s }}</option>
            }
          </select>
        </div>

        <!-- Tags (multi-select toggle buttons) -->
        <div>
          <label class="block text-sm font-medium text-foreground/80 mb-2">Tags</label>
          <div class="flex flex-wrap gap-2">
            @for (tag of tags(); track tag) {
              <button
                type="button"
                (click)="toggleTag(tag)"
                [ngClass]="
                  formData().Tags.includes(tag)
                    ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
                    : ' bg-slate-50 border-muted-foreground/30 text-slate-600 hover:bg-slate-100'
                "
                class="px-3 py-1 text-sm rounded-full border transition-colors"
              >
                {{ tag }}
              </button>
            }
          </div>
        </div>

        <!-- Subtasks -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <label class="block text-sm font-medium text-foreground/80">Subtasks</label>
            <button
              type="button"
              (click)="addSubtask()"
              class="inline-flex items-center px-3 py-1 text-sm bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/70"
            >
              {{ ADD }} Add Subtask
            </button>
          </div>
          <div class="space-y-2">
            @for (subtask of formData().Subtasks; let i = $index; track $index) {
              <div class="flex items-center gap-2 p-2 rounded-md">
                <button
                  (click)="toggleSubtask(i)"
                  type="button"
                  class="w-5 h-5 rounded border-2 flex items-center justify-center border-muted-foreground/30"
                  [ngClass]="subtask.completed ? 'text-primary' : 'hover:border-primary'"
                >
                  <!-- all are same => subtask = formData().Subtasks[i] = taskForm.Subtasks().value()[i] -->
                  @if (subtask.completed) {
                    {{ CHECK }}
                  }
                </button>
                <input
                  type="text"
                  [formField]="taskForm.Subtasks[i].text"
                  placeholder="Enter subtask..."
                  class="flex-1 px-3 py-2 border border-muted-foreground/30 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-transparent"
                />
                <button
                  (click)="removeSubtask(i)"
                  type="button"
                  class="text-slate-400 text-xl hover:text-red-600"
                >
                  {{ CLOSE }}
                </button>
              </div>
            }
          </div>
        </div>

        <!-- Notes -->
        <div>
          <label for="notes" class="block text-sm font-medium text-foreground/80 mb-2">Notes</label>
          <textarea
            id="notes"
            [formField]="taskForm.Notes"
            rows="4"
            class="w-full px-3 py-2 border border-muted-foreground/30 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-transparent"
          ></textarea>
        </div>

        <!-- Actions -->
        <div class="flex gap-4 pt-6 items-end justify-between">
          <div class="flex gap-4">
            @if (isEdit()) {
              <button
                type="button"
                (click)="onDelete.emit(data().Id!)"
                class="px-4 py-2 text-red-500 bg-red-100 rounded-lg hover:bg-red-200"
              >
                Delete
              </button>
            }
            <button
              type="button"
              (click)="onCancel.emit()"
              class="px-4 py-2 bg-secondary-dark text-foreground/80 rounded-md hover:bg-secondary-darker"
            >
              Cancel
            </button>
          </div>

          <div class="flex gap-4">
            <button
              type="button"
              (click)="onReset()"
              class="px-4 py-2 bg-secondary-dark text-foreground/80 rounded-md hover:bg-secondary-darker"
            >
              Reset
            </button>
            <button
              type="submit"
              (click)="onSubmitInternal()"
              class="px-4 py-2  text-accent rounded-md bg-primary hover:bg-primary-dark disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class TaskForm {
  ADD = ADD;
  CHECK = CHECK;
  CLOSE = CLOSE;
  taskService = inject(TaskService);

  readonly data = input.required<Task>();
  readonly formData = linkedSignal({
    source: this.data,
    computation: (domainModel) => toFormData(domainModel),
  });

  protected readonly taskForm = form(this.formData);

  onSubmit = output<Task>();
  onCancel = output<void>();
  onDelete = output<string>();

  // Config signals (could come from service)
  priorities = computed(() => this.taskService.config().Priorities);
  categories = computed(() => this.taskService.config().Categories);
  statuses = computed(() => this.taskService.config().Statuses);
  users = computed(() => this.taskService.config().Users);
  tags = computed(() => this.taskService.config().Tags);

  isEdit = computed(() => this.data().Id);

  addSubtask() {
    this.taskForm.Subtasks().value.update((pre) => [...pre, { text: '', completed: false }]);
  }

  removeSubtask(index: number) {
    this.taskForm.Subtasks().value.update((pre) => pre.filter((_, i) => i != index));
  }

  toggleSubtask(index: number) {
    this.taskForm
      .Subtasks()
      .value.update((pre) =>
        pre.map((ele, i) => (i == index ? { ...ele, completed: !ele.completed } : ele)),
      );
  }

  toggleTag(tag: string) {
    const isExits = this.formData().Tags.includes(tag);

    this.taskForm
      .Tags()
      .value.update((pre) => (isExits ? pre.filter((t) => t != tag) : [...pre, tag]));
  }

  onReset() {
    this.taskForm().reset(toFormData(this.data()));
  }

  onSubmitInternal() {
    //  if (this.taskForm.invalid) return;
    const value = this.formData();
    const task = toData(value);
    this.onSubmit.emit(task);
  }
}

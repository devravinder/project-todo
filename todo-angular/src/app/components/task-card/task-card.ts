import { NgStyle } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DateFormatterPipe } from '../../pipes/date-formatter/date-formatter-pipe';
import { TaskService } from '../../services/tasks/task.service';
import { CALENDER, CLOCK, EDIT, USER } from '../../util/icons';

@Component({
  selector: 'app-task-card',
  imports: [DateFormatterPipe, NgStyle, RouterLink],
  template: `
    <div
      [routerLink]="['',task().Id]"
      class="cursor-pointer flex flex-col gap-6 bg-card rounded-lg border border-border p-4 hover:shadow-md dark:hover:shadow-muted transition-shadow"
    >
      <div class="flex flex-col gap-1">
        <div class="flex flex-row justify-between">
          <span class="text-xs text-muted-foreground line-clamp-1"> #{{ task().Id }} </span>
          <button class="cursor-pointer text-xs">{{ EDIT }}</button>
        </div>
        <h3 class="font-medium text-foreground/90 text-md leading-tight line-clamp-1 flex-1">
          {{ task().Title }}
        </h3>
      </div>

      <p class="text-sm text-muted-foreground line-clamp-3">
        {{ task().Description }}
      </p>

      <div class="flex flex-col gap-4">
        <div class="flex flex-wrap gap-1">
          @if (task().Priority) {
            <span
              class="text-xs py-1 px-2 rounded-md bg-emerald-100"
              [ngStyle]="taskPriorityStyles()"
            >
              {{ task().Priority }}
            </span>
          }

          @if (task().AssignedTo) {
            <span class="text-xs py-1 px-2 rounded-md bg-purple-200  text-purple-600">
              {{ USER }}@{{ task().AssignedTo }}
            </span>
          }

          @if (task().Category) {
            <span class="text-xs py-1 px-2 rounded-md bg-sky-200  text-sky-600">
              {{ task().Category }}
            </span>
          }

          @if (task().Tags && Array.isArray(task().Tags)) {
            @for (tag of task().Tags!.slice(0, 3); track tag) {
              <span
                class="inline-flex items-center px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded"
              >
                {{ tag }}
              </span>
            }
            @if (task().Tags!.length > 3) {
              <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground">
                +{{ task().Tags!.length - 3 }}
              </span>
            }
          }
        </div>

        @if (totalSubtasks()) {
          <div class="flex flex-row items-center gap-2">
            <div class="flex-1 bg-muted-foreground/30 rounded-full h-1">
              <div
                [ngStyle]="subTaskStyles()"
                class="bg-primary h-full rounded-full transition-all"
              ></div>
            </div>
            <span class="text-xs text-muted-foreground">
              {{ completedSubtasks() }}/{{ totalSubtasks() }}
            </span>
          </div>
        }

        <div class="flex items-center justify-between text-xs text-muted-foreground">
          <div class="flex items-center">
            {{ CALENDER }} {{ task().createdDate | dateFormatter }}
          </div>
          @if (task().completedDate) {
            <div class="flex items-center text-orange-600">
              {{ CLOCK }}{{ task().completedDate | dateFormatter }}
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class TaskCard {
  router = inject(Router);
  taskService = inject(TaskService);
  task = input.required<Task>();
  USER = USER;
  CALENDER = CALENDER;
  CLOCK = CLOCK;
  EDIT = EDIT;

  Array = Array

  totalSubtasks = computed(() => this.task().Subtasks?.length || 0);
  completedSubtasks = computed(() =>
    this.totalSubtasks()
      ? (this.task().Subtasks || []).filter((st) => st.includes('[x] ')).length
      : 0,
  );

  subTaskStyles = computed(() =>
    this.totalSubtasks()
      ? { width: `${(this.completedSubtasks() / this.totalSubtasks()) * 100}%` }
      : {},
  );

  taskPriorityStyles = computed(() => ({
    backgroundColor:
      this.taskService.config()['Priority Colors'][this.task().Priority]?.['bg-color'],
    color: this.taskService.config()['Priority Colors'][this.task().Priority]?.['text-color'],
  }));
}

import { effect, inject, Injectable, signal } from '@angular/core';
import { getId } from '../../util/common';
import { defaultConfig } from '../../util/constants';
import { ProjectService } from '../project/project.service';
import { readFromStore, writeToStore } from '../../util/syncStore';

const SideEffectKey: Partial<{
  [K in keyof TodoConfig]: keyof Task | undefined;
}> = {
  Categories: 'Category',
  Priorities: 'Priority',
  Statuses: 'Status',
  Users: 'AssignedTo',
};

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  projectService = inject(ProjectService);
  tasks = signal<Task[]>([]);
  config = signal<TodoConfig>(defaultConfig);

  constructor() {
    effect(() => {
      this.onActiveProjectChange(this.projectService.activeProject());
    });
    effect(() => {
      this.onDataChange(this.tasks(), this.config());
    });
  }

  private async onActiveProjectChange(project?: Project) {
    if (project) await this.readProjectData(project);
  }

  private async onDataChange(tasks: Task[], config: TodoConfig) {
    const activeProject = this.projectService.activeProject();

    if (activeProject && tasks.length) {
      await writeToStore(tasks, config, activeProject?.fileHandle, activeProject?.type);
    }
  }

  readProjectData = async (project: Project) => {
    const result = await readFromStore(project.fileHandle, project.type);
    if ('data' in result) {
      const { tasks, config } = result.data;
      this.tasks.set(tasks);
      this.config.set(config);
    } else {
      this.projectService.onProjectFileError(result.error, project);
    }
  };

  getSampleNewTask = (status?: string): Task => {
    return {
      Title: '',
      Status: status || this.config()['Workflow Statuses']['CREATE_STATUS'],
      Description: '',
      Notes: '',
      Priority: this.config().Priorities[this.config().Priorities.length - 1],
      createdDate: new Date(),
      dueDate: new Date(),
      lastModifiedDate: new Date(),
      Tags: [],
      Subtasks: [],
    };
  };

  addTask = (task: Task) => {
    this.tasks.update((prev) => [
      ...prev,
      {
        ...task,
        Id: getId(4),
        createdDate: new Date(),
      },
    ]);
  };

  editTask = (id: string, task: Partial<Task>) => {
    const old = this.tasks().find((task) => task.Id === id);

    if (old) {
      const { Status: targetStatus } = task;
      const { Status: currentStatus } = old;

      // Update timestamps based on status
      if (targetStatus !== currentStatus) {
        switch (targetStatus) {
          case this.config()['Workflow Statuses']['START_STATUS']: {
            task.startedDate = new Date();
            break;
          }

          case this.config()['Workflow Statuses']['END_STATUS']: {
            task.completedDate = new Date();
            break;
          }
        }
      }

      this.tasks.update((pre) =>
        pre.map((old) => (id === old.Id ? { ...old, ...task, lastModifiedDate: new Date() } : old)),
      );
    }
  };

  changeStatus = (id: string, status: string) => {
    this.editTask(id, { Status: status });
  };

  deleteTask = (taskId: string) => {
    this.tasks.update((prev) => prev.filter((task) => task.Id !== taskId));
  };

  updateTaskField = <K extends keyof Task, V extends Task[K]>(
    key: K,
    from: V,
    to: V,
    tasks: Task[],
  ) => {
    tasks.forEach((old) => {
      if (old[key] === from) {
        old[key] = to!;
      }
    });
  };

  handleSideEffects = (sideEffects: Change[]) => {
    const currentTasks = [...this.tasks()];
    for (const { key, oldValue, newValue, type } of sideEffects) {
      if (key in SideEffectKey && type === 'UPDATE') {
        this.updateTaskField(
          SideEffectKey[key as keyof TodoConfig]!,
          oldValue as string,
          newValue as string,
          currentTasks,
        );
        // for DELETE & ADD, we do nothing
      }
    }

    this.tasks.set(currentTasks);
  };

  onConfigChange = (value: TodoConfig, sideEffects: Change[]) => {
    this.handleSideEffects(sideEffects);
    this.config.set(value);
  };

  getTask(id: string) {
    return this.tasks().find((task) => task.Id === id);
  }

  getTasksByStatus(status: string) {
    return this.tasks().filter((task) => task.Status === status);
  }
}

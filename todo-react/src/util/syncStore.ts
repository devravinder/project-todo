import { fileStorageAdapter } from "./storage/file-storage.adapter";
import { memoryStorageAdapter } from "./storage/memory-storage.adapter";
import type { FileReadResult, StorageAdapter } from "./storage/storage.types";

export type { FileError, FileReadResult } from "./storage/storage.types";

const getAdapter = (project: Project): StorageAdapter =>
  project.env === "MEMORY" ? memoryStorageAdapter : fileStorageAdapter;

export const readFromStore = (project: Project): Promise<FileReadResult> =>
  getAdapter(project).read(project);

export const writeToStore = (
  tasks: Task[],
  config: TodoConfig,
  project: Project
): Promise<void> => getAdapter(project).write(tasks, config, project);

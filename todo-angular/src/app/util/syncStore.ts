import { fileStorageAdapter } from './storage/file-storage.adapter';
import { memoryStorageAdapter } from './storage/memory-storage.adapter';
import { StorageAdapter } from './storage/storage.types';

const getAdapter = (project: Project): StorageAdapter =>
  project.env === 'MEMORY' ? memoryStorageAdapter : fileStorageAdapter;

export const readFromStore = (project: Project): Promise<FileReadResult> =>
  getAdapter(project).read(project);

export const writeToStore = (
  tasks: Task[],
  config: TodoConfig,
  project: Project,
): Promise<void> => getAdapter(project).write(tasks, config, project);

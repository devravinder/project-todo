import { defaultConfig } from '../constants';
import db from '../db';
import { StorageAdapter } from './storage.types';

const read = async (project: Project): Promise<FileReadResult> => {
  const record = await db.taskData.get(project.id);

  return { data: { tasks: record?.tasks ?? [], config: record?.config ?? defaultConfig } };
};

const write = async (tasks: Task[], config: TodoConfig, project: Project): Promise<void> => {
  await db.taskData.put({ projectId: project.id, tasks, config });
};

export const memoryStorageAdapter: StorageAdapter = { read, write };

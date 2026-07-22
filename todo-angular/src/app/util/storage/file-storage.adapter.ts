import { defaultConfig } from '../constants';
import { toAppData, toStoreData } from '../converter';
import { FileHandler } from '../FileHandler';
import { MarkdownParser } from '../MarkdownParser';
import { StorageAdapter } from './storage.types';

const MD_COMMENT = `
---
To view this file in Kanban dashboard open this file(file parent folder) with [Task Manager](https://todo.paravartech.com/)
`;

const read = async (project: Project): Promise<FileReadResult> => {
  try {
    const content = await FileHandler.read(project.fileHandle!);

    if (!content) return { data: { config: defaultConfig, tasks: [] } };

    const storeData = (
      project.type === 'md' ? MarkdownParser.toJson(content) : JSON.parse(content)
    ) as StoreData;

    const data = toAppData(storeData);

    return { data };
  } catch (err) {
    // File might be deleted
    const error = err as FileError;
    return { error };
  }
};

const write = async (tasks: Task[], config: TodoConfig, project: Project): Promise<void> => {
  const storeData = toStoreData(tasks, config);

  const content =
    project.type === 'md'
      ? MarkdownParser.toMarkdown(storeData as unknown as JSONObject)
      : JSON.stringify(storeData, null, 2);

  await FileHandler.write(project.fileHandle!, content + MD_COMMENT);
};

export const fileStorageAdapter: StorageAdapter = { read, write };

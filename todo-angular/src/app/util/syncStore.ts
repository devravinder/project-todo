import { defaultConfig } from "./constants";
import {
  toAppData,
  toStoreData,
} from "./converter";
import { FileHandler } from "./FileHandler";
import { MarkdownParser } from "./MarkdownParser";

const MD_COMMENT = `
---
To view this file in Kanban dashboard open this file(file parent folder) with [Task Manager](https://todo.paravartech.com/)
`;

export const writeToStore = async (
  tasks: Task[],
  config: TodoConfig,
  fileHandle: FileSystemFileHandle,
  format: FileFormat
) => {
  const storeData = toStoreData(tasks, config);

  const content =
    format === "md"
      ? MarkdownParser.toMarkdown(storeData as unknown as JSONObject)
      : JSON.stringify(storeData, null, 2);

  await FileHandler.write(fileHandle, content + MD_COMMENT);
};

export const readFromStore = async (
  fileHandle: FileSystemFileHandle,
  format: FileFormat
): Promise<FileReadResult> => {
  try {
    const content = await FileHandler.read(fileHandle);

    if (!content) return { data: { config: defaultConfig, tasks: [] } };

    const storeData = (
      format === "md" ? MarkdownParser.toJson(content) : JSON.parse(content)
    ) as StoreData;

    const data = toAppData(storeData);

    return { data };
  } catch (err) {
    // File might be deleted
    const error = err as FileError;
    return { error };
  }
};

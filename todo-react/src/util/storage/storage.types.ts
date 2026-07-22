import type { AppData } from "../converter";

export type FileError = {
  name:
    | "AbortError"
    | "NotFoundError"
    | "BrowserNotSupports"
    | "NotAllowedError";
  message: string;
};

export type FileReadResult = { data: AppData } | { error: FileError };

export interface StorageAdapter {
  read(project: Project): Promise<FileReadResult>;
  write(tasks: Task[], config: TodoConfig, project: Project): Promise<void>;
}

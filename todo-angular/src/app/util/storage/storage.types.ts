export interface StorageAdapter {
  read(project: Project): Promise<FileReadResult>;
  write(tasks: Task[], config: TodoConfig, project: Project): Promise<void>;
}

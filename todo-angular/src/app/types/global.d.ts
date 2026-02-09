import { ID_TITLE_DELIMETER, TASKS_KEY, CONFIG_KEY } from "../util/constants";

type ID_TITLE_DELIMETER = typeof ID_TITLE_DELIMETER;

declare global {
  interface Window {
    showDirectoryPicker(options?: {
      id?: string;
      mode?: 'read' | 'readwrite';
      startIn?: 'desktop' | 'documents' | 'downloads' | 'music' | 'pictures' | 'videos';
    }): Promise<FileSystemDirectoryHandle>;
  }

  interface FileSystemDirectoryHandle {
    entries(): AsyncIterableIterator<[string, FileSystemHandle]>;
  }

  interface FileError {
    name: 'AbortError' | 'NotFoundError' | 'BrowserNotSupports' | 'NotAllowedError';
    message: string;
  }

  type FileHandleResult =
    | {
        handle: FileSystemFileHandle;
        path: string;
      }
    | { error: FileError };

  type FileReadResult =
    | {
        data: AppData;
      }
    | { error: FileError };

  type StoreTasks = Record<
    string,
    Record<`${Task['Id']}${ID_TITLE_DELIMETER}${Task['Title']}`, Task>
  >;

  type StoreData = {
    Todo: {
      [TASKS_KEY]: StoreTasks;
      [CONFIG_KEY]: TodoConfig;
    };
  };

  type AppData = { tasks: Task[]; config: TodoConfig };

  interface Project {
    id: string;
    name: string;
    fileHandle: FileSystemFileHandle;
    lastAccessed: number;
    env: 'CLOUD' | 'LOCAL';
    type: FileFormat;
    sessionId?: string;
    path?: string;
  }
  interface Task {
    Id?: string;
    Title: string;
    Description?: string;
    Priority: string;
    AssignedTo?: string;
    createdDate: string | Date;
    startedDate?: string | Date;
    dueDate: string | Date;
    completedDate?: string | Date;
    lastModifiedDate?: string | Date;
    Tags?: string[];
    Subtasks?: string[];
    Notes?: string;
    Status: string;
    Category?: string;
  }

  interface Color {
    'text-color': string;
    'bg-color': string;
  }
  interface TodoConfig {
    Statuses: string[];
    'Workflow Statuses': {
      CREATE_STATUS: string;
      START_STATUS: string;
      END_STATUS: string;
      ARCHIVE_STATUS: string;
    };
    Categories: string[];
    Users: string[];
    Priorities: string[];
    'Priority Colors': Record<string, Color>;
    Tags: string[];
  }
  type Change = {
    key: string;
    oldValue?: unknown;
    newValue?: unknown;
    type: 'ADD' | 'UPDATE' | 'DELETE';
  };
  type FileFormat = 'md' | 'json';

  type SideEffect = (change: Change) => void;

  type ArrayKeys<T> = {
    [K in keyof T]: T[K] extends string[] ? K : never;
  }[keyof T];

  type JSONObject = {
    [key: string]: string | string[] | JSONObject;
  };
  type NonStringKeysWithUndefined<T> = {
    [K in keyof T]: NonNullable<T[K]> extends string | string[] ? never : K;
  }[keyof T];

  type NonStringKeys<T> = Exclude<NonStringKeysWithUndefined<T>, undefined>;
}

export {};

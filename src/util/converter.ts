import dayjs from "dayjs";
import { DB_DATE_FORMAT } from "./constants";

const ID_TITLE_DELIMETER = " | " as const;
type ID_TITLE_DELIMETER = typeof ID_TITLE_DELIMETER;

type StoreTasks = Record<
  string,
  Record<`${Task["Id"]}${ID_TITLE_DELIMETER}${Task["Title"]}`, Task>
>;
export type StoreData = {
  Todo: {
    Tasks: StoreTasks;
    "⚙️ Configuration": TodoConfig;
  };
};

type TaskNonStringKeys = NonStringKeys<Task>;

export const serializers: Required<{
  [K in TaskNonStringKeys]: (v: Task[K]) => string;
}> = {
  dueDate: (v) => dayjs(v).format(DB_DATE_FORMAT),
  createdDate: (v) => dayjs(v).format(DB_DATE_FORMAT),
  startedDate: (v) => dayjs(v).format(DB_DATE_FORMAT),
  completedDate: (v) => dayjs(v).format(DB_DATE_FORMAT),
  lastModifiedDate: (v) => dayjs(v).format(DB_DATE_FORMAT),
};

export const deSerializers: Required<{
  [K in TaskNonStringKeys]: (v: Task[K]) => Task[K];
}> = {
  dueDate: (v) => dayjs(v).toDate(),
  createdDate: (v) => dayjs(v).toDate(),
  startedDate: (v) => dayjs(v).toDate(),
  completedDate: (v) => dayjs(v).toDate(),
  lastModifiedDate: (v) => dayjs(v).toDate(),
};

const serializeTask = (task: Task) => {
  const modified = (Object.keys(serializers) as TaskNonStringKeys[]).reduce(
    (pre, key) => {
      if (key in serializers && task[key]) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (pre as any)[key] = serializers[key]?.(task[key] as any);
      }

      return pre;
    },
    {} as Task
  );

  return { ...task, ...modified };
};

const deSerializeTask = (task: Task) => {
  const modified = (Object.keys(deSerializers) as TaskNonStringKeys[]).reduce(
    (pre, key) => {
      if (key in deSerializers && task[key]) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (pre as any)[key] = deSerializers[key]?.(task[key] as any);
      }

      return pre;
    },
    {} as Task
  );

  return { ...task, ...modified };
};

export type AppData = { tasks: Task[]; config: TodoConfig };
export const toStoreData = (tasks: Task[], config: TodoConfig) => {
  const data: StoreData = {
    Todo: {
      "⚙️ Configuration": config,
      Tasks: {},
    },
  };

  data.Todo.Tasks = tasks.reduce((pre, task) => {
    if (!pre[task.Status]) pre[task.Status] = {};

    pre[task.Status][`${task.Id}${ID_TITLE_DELIMETER}${task.Title}`] =
      serializeTask(task);

    return pre;
  }, {} as StoreTasks);

  return data;
};

export const toAppData = (data: StoreData) => {
  const nonSerialized: Task[] = [];

  Object.keys(data?.Todo?.Tasks || {}).reduce((pre, status) => {
    pre.push(...Object.values(data.Todo.Tasks[status]));
    return pre;
  }, nonSerialized);

  const tasks = nonSerialized.map(deSerializeTask);
  return { tasks, config: data.Todo["⚙️ Configuration"] };
};

export const sortDsc = (f: Task, s: Task) =>
  (s.lastModifiedDate?.getTime() || 0) - (f.lastModifiedDate?.getTime() || 0);

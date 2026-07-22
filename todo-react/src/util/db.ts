import Dexie, { type EntityTable } from "dexie";

export const DB_NAME = "todo";

class AppDB extends Dexie {
  projects!: EntityTable<Project, "id">;
  taskData!: EntityTable<StoredTaskData, "projectId">;

  constructor() {
    super(DB_NAME);

    this.version(1).stores({
      projects: "id,lastAccessed",
      taskData: "projectId",
    });
  }
}

export const db = new AppDB();

export const clearData = async (reload: boolean = true) => {
  await Dexie.delete(DB_NAME);
  if (reload) window.location.reload();
};

export const clearDataWithPrompt = async (message: string) => {
  const reset = window.confirm(message);

  if (reset) {
    await clearData();
  }
};

export default db;

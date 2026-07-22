import { Dexie, type EntityTable } from 'dexie';

import { DB_NAME } from './constants';

class AppDB extends Dexie {
  projects!: EntityTable<Project, 'id'>;
  taskData!: EntityTable<StoredTaskData, 'projectId'>;

  constructor() {
    super(DB_NAME);

    this.version(1).stores({
      projects: 'id',
    });

    this.version(2)
      .stores({
        projects: 'id,lastAccessed',
      })
      .upgrade(async (tx) => {
        console.log('Upgrading to v2 → clearing old data');

        await Promise.all([tx.table('projects').clear()]);
      });

    this.version(3).stores({
      projects: 'id,lastAccessed',
      taskData: 'projectId',
    });
  }
}

const db = new AppDB();

export const clearData = async (reload: boolean = true) => {
  await Dexie.delete(DB_NAME);
  if (reload) window.location.reload(); // recreate with latest version
};

export const clearDataWithPrompt = async (message: string) => {
  const reset = window.confirm(message);

  if (reset) {
    await clearData();
  }
};

//=====
export async function initDB() {
  console.log('initializeDb');
  try {
    await db.open();
  } catch (error: any) {
    console.error('DB upgrade failed:', error);

    if (error?.name === 'UpgradeError') {
      await clearDataWithPrompt(
        'Database upgrade failed.\n' +
          'Old data is incompatible.\n\n' +
          'Do you want to reset database?',
      );
    }
  }
}

export default db;

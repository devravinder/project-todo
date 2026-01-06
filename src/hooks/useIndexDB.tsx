import { useRef } from "react";

type StoreConfig = {
  name: string; // like db instance (eg: public, uttara )
  keyPath?: string; // like collection (table)
  autoIncrement?: boolean; // id increament type
};

type DBConfig = {
  name: string;
  version: number;
  stores: StoreConfig[];
};

export function useIndexedDB<T>(config: DBConfig) {
  const dbRef = useRef<IDBDatabase | null>(null);

  // Open / Init DB
  const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(config.name, config.version);

      request.onupgradeneeded = () => {
        const db = request.result;

        config.stores.forEach((store) => {
          if (!db.objectStoreNames.contains(store.name)) {
            db.createObjectStore(store.name, {
              keyPath: store.keyPath,
              autoIncrement: store.autoIncrement,
            });
          }
        });
      };

      request.onsuccess = () => {
        dbRef.current = request.result;
        resolve(request.result);
      };

      request.onerror = () => reject(request.error);
    });
  };

  const getStore = async (
    storeName: string,
    mode: IDBTransactionMode = "readonly"
  ) => {
    const db = dbRef.current ?? (await openDB());
    return db.transaction(storeName, mode).objectStore(storeName);
  };

  // CREATE / UPDATE
  const put = async (store: string, value: T, key?: IDBValidKey) => {
    const storeRef = await getStore(store, "readwrite");
    return new Promise<IDBValidKey>((resolve, reject) => {
      const req = key ? storeRef.put(value, key) : storeRef.put(value);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  };

  // READ ONE
  const get = async <R = T>(store: string, key: IDBValidKey) => {
    const storeRef = await getStore(store);
    return new Promise<R | undefined>((resolve, reject) => {
      const req = storeRef.get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  };

  // READ ALL
  const getAll = async <R = T>(store: string) => {
    const storeRef = await getStore(store);
    return new Promise<R[]>((resolve, reject) => {
      const req = storeRef.getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  };

  // DELETE
  const remove = async (store: string, key: IDBValidKey) => {
    const storeRef = await getStore(store, "readwrite");
    return new Promise<void>((resolve, reject) => {
      const req = storeRef.delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  };

  // CLEAR STORE
  const clear = async (store: string) => {
    const storeRef = await getStore(store, "readwrite");
    return new Promise<void>((resolve, reject) => {
      const req = storeRef.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  };

  return {
    openDB,
    put,
    get,
    getAll,
    remove,
    clear,
  };
}

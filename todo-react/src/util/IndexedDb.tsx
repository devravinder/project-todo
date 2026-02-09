import type { useIndexedDB } from "../hooks/useIndexDB";
import type { Project } from "../hooks/state-hooks/useProject";

  type DB<T> = ReturnType< typeof useIndexedDB<T>>

  const addProject = async (db:DB<Project>, storeName:string ,data: Project) => db.put(storeName, data);

  const getProjects = async (db:DB<Project>, storeName:string) => db.getAll(storeName);

  const getProject = async (db:DB<Project>, storeName:string, id: string) => db.get(storeName, id);

  const deleteProject = async (db:DB<Project>, storeName:string,id: string) => db.remove(storeName, id);

  const updateProject = async (db:DB<Project>, storeName:string, project: Project) => db.put(storeName, project);

  export const IndexedDb = {
    addProject, getProject, deleteProject, updateProject, getProjects
  }
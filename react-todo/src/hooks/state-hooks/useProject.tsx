/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";
import Welcome from "../../components/Welcome";
import type { AppData } from "../../util/converter";
import {
  readFromStore,
  writeToStore,
  type FileError,
  type FileReadResult,
} from "../../util/syncStore";
import { useIndexedDB } from "../useIndexDB";
import { useSessionId } from "../useSessionId";
import { IndexedDb } from "../../util/IndexedDb";
import type { FileHandleResult } from "../../util/FileHandler";
import Loading from "../../components/Loading";

type ProjectContextType = {
  activeProject: Project;
  appData: AppData;
  updateProjectData: (
    project: Project,
    tasks: Task[],
    config: TodoConfig
  ) => Promise<void>;
  getSampleNewProject: (fileHandle: FileSystemFileHandle) => Project;
  getProjects: () => Promise<Project[]>;
  switchActiveProject: (project: Project) => void;
  updateProject: (project: Project) => Promise<IDBValidKey>;
  deleteProject: (id: string) => Promise<void>
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export type Project = {
  id: string;
  name: string;
  fileHandle: FileSystemFileHandle;
  lastAccessed: number;
  env: "CLOUD" | "LOCAL";
  type: FileFormat;
  sessionId?: string;
};

const DB_NAME = "todo-db";
const STORE_INSTANCE_NAME = "projects";
const ID_KEY_NAME = "id";

export const ProjectContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [activeProject, setActiveProject] = useState<Project>();
  const [initialLoading, setInitialLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [appData, setAppData] = useState<AppData>();
  const [fileError, setFileError] = useState<FileError>();

  const sessionId = useSessionId();

  const db = useIndexedDB<Project>({
    name: DB_NAME,
    version: 1,
    stores: [
      {
        name: STORE_INSTANCE_NAME,
        keyPath: ID_KEY_NAME,
      },
    ],
  });

  const updateProjectData = async (
    project: Project,
    tasks: Task[],
    config: TodoConfig
  ) => {
    await writeToStore(tasks, config, project.fileHandle, project.type);
  };

  const getSampleNewProject = (fileHandle: FileSystemFileHandle) => {
    const id = crypto.randomUUID();
    const project: Project = {
      id,
      name: `Todo-${id.slice(0,3)}`,
      type: fileHandle.name.includes(".md") ? "md" : "json",
      fileHandle,
      env: "LOCAL",
      lastAccessed: new Date().getTime() - 1,
    };
    return project;
  };

  const getProjects = async () =>
    IndexedDb.getProjects(db, STORE_INSTANCE_NAME);

  const updateProject = async (project: Project) =>
    IndexedDb.updateProject(db, STORE_INSTANCE_NAME, project);


  const deleteProject=async(id:string)=>IndexedDb.deleteProject(db,STORE_INSTANCE_NAME,id)

  const readProjectData = async (project: Project): Promise<FileReadResult> => {
    const data = await readFromStore(project.fileHandle, project.type);
    return data;
  };

  const onNewProjectSelect = async (fileHandle: FileSystemFileHandle) => {
    const project: Project = {
      ...getSampleNewProject(fileHandle),
      id: sessionId,
      sessionId,
      lastAccessed: new Date().getTime()
    };
    await IndexedDb.addProject(db, STORE_INSTANCE_NAME, project);
    setActiveProject(project);
  };

  const onProjectFileError = useCallback(
    async (error?: FileError, project?: Project) => {
      setFileError(error);
      if (
        project &&
        (error?.name === "NotFoundError" || error?.name === "NotAllowedError")
      ) {
        await IndexedDb.deleteProject(db, STORE_INSTANCE_NAME, project.id);
      }
    },
    [setFileError, db]
  );

  const switchActiveProject=async(project:Project)=>{

        project.lastAccessed = new Date().getTime()
        setActiveProject(pre=>({...pre, ...project}));
        await updateProject(project);
  }


  const onGetStarted = (fileHandleResult: FileHandleResult) => {
    setFileError(undefined);
    if ("handle" in fileHandleResult)
      onNewProjectSelect(fileHandleResult.handle);
    else onProjectFileError(fileHandleResult.error);
  };

  
  useEffect(() => {
    const syncState = async (project: Project) => {
      setLoading(true);
      const result = await readProjectData(project);
      if ("data" in result) {
        setAppData(result.data);
      }
      else {
        onProjectFileError(result.error, project);
      }
      setLoading(false);
    };
    if (activeProject) syncState(activeProject);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProject]);

  useLayoutEffect(() => {
    const getLatestProject = async () => {
      setInitialLoading(true)
      const projects = await IndexedDb.getProjects(db, STORE_INSTANCE_NAME);
      if (projects.length) {
        const lastAccessed = projects.sort(
          (f, s) => s.lastAccessed - f.lastAccessed
        )[0];
        switchActiveProject(lastAccessed);
      }
      setInitialLoading(false)
    };

    getLatestProject();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  if(initialLoading || loading || (activeProject && !appData) )
     return <Loading/>;

  if (!activeProject || fileError )
    return <Welcome fileError={fileError} onGetStarted={onGetStarted} />;




  return (
    <ProjectContext.Provider
      value={{
        activeProject,
        updateProjectData,
        getSampleNewProject,
        getProjects,
        switchActiveProject,
        updateProject,
        deleteProject,
        appData,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export default function useProject() {
  const context = useContext(ProjectContext);

  if (!context) {
    throw new Error("useProject must be used within a ProjectContextProvider");
  }

  return context;
}

export const WithActiveProjectData = ({
  children,
}: {
  children: (data: AppData) => React.ReactNode;
}) => {
  const { appData } = useProject();

  return children(appData);
};

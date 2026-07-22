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
import { defaultConfig } from "../../util/constants";
import { readFromStore, writeToStore, type FileError } from "../../util/syncStore";
import { getId } from "../../util/common";
import db from "../../util/db";
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
  getSampleNewMemoryProject: (name?: string) => Project;
  getProjects: () => Promise<Project[]>;
  switchActiveProject: (project: Project) => void;
  updateProject: (project: Project) => Promise<string>;
  deleteProject: (id: string) => Promise<void>;
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

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

  const updateProjectData = async (
    project: Project,
    tasks: Task[],
    config: TodoConfig
  ) => {
    await writeToStore(tasks, config, project);
  };

  const getSampleNewProject = (fileHandle: FileSystemFileHandle): Project => {
    const id = getId(4);
    return {
      id,
      name: `Todo-${id}`,
      type: fileHandle.name.includes(".md") ? "md" : "json",
      fileHandle,
      env: "LOCAL",
      lastAccessed: new Date().getTime() - 1,
    };
  };

  const getSampleNewMemoryProject = (name?: string): Project => {
    const id = getId(4);
    return {
      id,
      name: name || `Todo-${id}`,
      env: "MEMORY",
      lastAccessed: new Date().getTime() - 1,
    };
  };

  const getProjects = async () => db.projects.orderBy("lastAccessed").toArray();

  const updateProject = async (project: Project) => db.projects.put(project);

  const deleteProject = async (id: string) => {
    await db.taskData.delete(id);
    await db.projects.delete(id);
  };

  const readProjectData = async (project: Project) => readFromStore(project);

  const onNewProjectSelect = async (fileHandle: FileSystemFileHandle) => {
    const project: Project = getSampleNewProject(fileHandle);
    await db.projects.add(project);
    setActiveProject(project);
  };

  const onNewMemoryProjectSelect = async () => {
    const project: Project = getSampleNewMemoryProject();
    await db.projects.add(project);
    await db.taskData.put({ projectId: project.id, tasks: [], config: defaultConfig });
    setActiveProject(project);
  };

  const onProjectFileError = useCallback(
    async (error?: FileError, project?: Project) => {
      setFileError(error);
      if (
        project &&
        (error?.name === "NotFoundError" || error?.name === "NotAllowedError")
      ) {
        await deleteProject(project.id);
      }
    },
    []
  );

  const switchActiveProject = async (project: Project) => {
    project.lastAccessed = new Date().getTime();
    setActiveProject((pre) => ({ ...pre, ...project }));
    await updateProject(project);
  };

  const onGetStarted = (fileHandleResult: FileHandleResult) => {
    setFileError(undefined);
    if ("handle" in fileHandleResult)
      onNewProjectSelect(fileHandleResult.handle);
    else onProjectFileError(fileHandleResult.error);
  };

  const onUseMemory = () => {
    setFileError(undefined);
    onNewMemoryProjectSelect();
  };

  useEffect(() => {
    const syncState = async (project: Project) => {
      setLoading(true);
      const result = await readProjectData(project);
      if ("data" in result) {
        setAppData(result.data);
      } else {
        onProjectFileError(result.error, project);
      }
      setLoading(false);
    };
    if (activeProject) syncState(activeProject);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProject]);

  useLayoutEffect(() => {
    const getLatestProject = async () => {
      setInitialLoading(true);
      const projects = await getProjects();
      if (projects.length) {
        const lastAccessed = projects.sort(
          (f, s) => s.lastAccessed - f.lastAccessed
        )[0];
        switchActiveProject(lastAccessed);
      }
      setInitialLoading(false);
    };

    getLatestProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (initialLoading || loading || (activeProject && !fileError && !appData))
    return <Loading />;

  if (!activeProject || fileError || !appData)
    return (
      <Welcome
        fileError={fileError}
        onGetStarted={onGetStarted}
        onUseMemory={onUseMemory}
      />
    );

  return (
    <ProjectContext.Provider
      value={{
        activeProject,
        updateProjectData,
        getSampleNewProject,
        getSampleNewMemoryProject,
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
  children: (data: AppData, activeProject: Project) => React.ReactNode;
}) => {
  const { appData, activeProject } = useProject();

  return children(appData, activeProject);
};

import KanbanDashboard from "./components/KanbanDashboard";
import { AppContextProvider } from "./hooks/state-hooks/useAppContext";
import {
  ProjectContextProvider,
  WithActiveProjectData,
} from "./hooks/state-hooks/useProject";

export default function App() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-background text-foreground backdrop-blur overflow-hidden">
      <ProjectContextProvider>
        <WithActiveProjectData>
          {({ tasks, config }, activeProject) => (
            <AppContextProvider
              key={activeProject.id}
              defauleTasks={tasks}
              defaultConfig={config}
            >
              <KanbanDashboard />
            </AppContextProvider>
          )}
        </WithActiveProjectData>
      </ProjectContextProvider>
    </div>
  );
}

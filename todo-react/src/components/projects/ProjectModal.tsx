import { useLiveQuery } from "dexie-react-hooks";
import useProject from "../../hooks/state-hooks/useProject";
import db from "../../util/db";
import { CLOSE } from "../../util/icons";
import ProjectForm, { type ProjectFormData } from "./ProjectForm";

interface ProjectModalProps {
  onClose: () => void;
}

const ProjectModal = ({ onClose }: ProjectModalProps) => {
  const {
    activeProject,
    switchActiveProject: setActiveProject,
    updateProject: updateProejct,
  } = useProject();

  const projects = useLiveQuery(
    () => db.projects.orderBy("lastAccessed").toArray(),
    [],
    []
  );

  const handleClose = () => {
    onClose();
  };

  const onSave = async (data: ProjectFormData) => {
    for (const project of data.projects) {
      await updateProejct(project);
    }

    if (data.activeProjectId !== activeProject.id) {
      const newActiveProject = data.projects.find(
        (p) => p.id === data.activeProjectId
      );
      setActiveProject(newActiveProject!);
    } else {
      const isNameChanged = data.projects.findIndex(
        (old) => old.id === activeProject.id && old.name !== activeProject.name
      );

      if (isNameChanged >= 0) {
        setActiveProject(data.projects[isNameChanged]);
      }
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-400/30 backdrop-blur flex items-center justify-center p-4 z-50">
      <div className="flex flex-col bg-secondary rounded-lg w-full h-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            Manage Projects
          </h2>
          <button
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground focus:outline-none"
          >
            {CLOSE}
          </button>
        </div>

        <div className="grow">
          <ProjectForm
            onSave={onSave}
            data={{ activeProjectId: activeProject.id, projects: projects ?? [] }}
            onCancel={handleClose}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;

import { useEffect, useState } from "react";
import useProject, { type Project } from "../../hooks/state-hooks/useProject";
import { CLOSE } from "../../util/icons";
import ProjectForm, { type ProjectFormData } from "./ProjectForm";

interface ProjectModalProps {
  onClose: () => void;
}

const ProjectModal = ({ onClose }: ProjectModalProps) => {
  const { activeProject, getProjects, switchActiveProject: setActiveProject, updateProject: updateProejct } =
    useProject();

  const [projects, setProjects] = useState<Project[]>([]);

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
    }
    onClose();
  };

  useEffect(() => {
    const syncProjects = async () => {
      const projects = await getProjects();
      setProjects(projects);
    };
    syncProjects();
  }, [getProjects]);

  return (
    <div className="fixed inset-0 bg-gray-400/30 backdrop-blur flex items-center justify-center p-4 z-50">
      <div className="flex flex-col bg-white rounded-lg w-full h-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">
            Manage Projects
          </h2>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 focus:outline-none"
          >
            {CLOSE}
          </button>
        </div>

        <div className="grow">
          <ProjectForm
            onSave={onSave}
            data={{ activeProjectId: activeProject.id, projects }}
            onCancel={handleClose}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;

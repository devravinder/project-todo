import React from "react";
import useProject from "../hooks/state-hooks/useProject";
import { ADD, ARCHIVE, FOLDER, SETTINGS } from "../util/icons";

interface HeaderProps {
  onNewTask: () => void;
  onSettings: () => void;
  onArchive: () => void;
  onProject : ()=>void
}

const Header: React.FC<HeaderProps> = ({
  onNewTask,
  onSettings,
  onArchive,
  onProject
}) => {
  const { activeProject } = useProject();
  return (
    <header className="w-full bg-white border-b shadow border-slate-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              <img src="./favicon.png" />
            </span>
          </div>
          <h1 className="text-xl font-semibold text-slate-800">{activeProject.name}</h1>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onNewTask}
            className=" cursor-pointerinline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-none transition-colors"
          >
            {ADD} New Task
          </button>
          <button
            onClick={onProject}
            className=" cursor-pointer inline-flex items-center px-3 py-2 bg-slate-100 text-sm font-medium rounded-lg hover:bg-slate-200 "
          >
            {FOLDER}
          </button>
          <button
            onClick={onArchive}
            className=" cursor-pointer inline-flex items-center px-3 py-2 bg-slate-100 text-sm font-medium rounded-lg hover:bg-slate-200 "
          >
            {ARCHIVE}
          </button>
          <button
            onClick={onSettings}
            className=" cursor-pointer inline-flex items-center px-3 py-2 bg-slate-100 text-sm font-medium rounded-lg hover:bg-slate-200 "
          >
            {SETTINGS}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

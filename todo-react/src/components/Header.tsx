import React from "react";
import useProject from "../hooks/state-hooks/useProject";
import useTheme from "../hooks/useTheme";
import { ADD, ARCHIVE, FOLDER, MOON, SETTINGS, SUN } from "../util/icons";

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
  const { theme, toggleTheme } = useTheme();
  return (
    <header className="w-full bg-secondary border-b shadow border-border px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center">
            <span className="text-foreground font-bold text-sm">
              <img src="./favicon.png" />
            </span>
          </div>
          <h1 className="text-xl font-semibold text-foreground">{activeProject.name}</h1>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onNewTask}
            className=" cursor-pointer inline-flex items-center px-3 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-none transition-colors"
          >
            {ADD} New Task
          </button>
          <button
            onClick={onProject}
            className=" cursor-pointer inline-flex items-center px-3 py-2 bg-secondary-dark text-sm font-medium rounded-lg hover:bg-secondary-darker "
          >
            {FOLDER}
          </button>
          <button
            onClick={onArchive}
            className=" cursor-pointer inline-flex items-center px-3 py-2 bg-secondary-dark text-sm font-medium rounded-lg hover:bg-secondary-darker "
          >
            {ARCHIVE}
          </button>
          <button
            onClick={onSettings}
            className=" cursor-pointer inline-flex items-center px-3 py-2 bg-secondary-dark text-sm font-medium rounded-lg hover:bg-secondary-darker "
          >
            {SETTINGS}
          </button>
          <button
            onClick={toggleTheme}
            className=" cursor-pointer inline-flex items-center px-3 py-2 bg-secondary-dark text-sm font-medium rounded-lg hover:bg-secondary-darker "
          >
            {theme === "dark" ? SUN : MOON}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

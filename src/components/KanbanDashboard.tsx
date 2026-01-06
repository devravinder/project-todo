import React, { useState } from "react";
import useAppContext from "../hooks/state-hooks/useAppContext";
import ArchiveModel from "./ArchiveModel";
import Header from "./Header";
import KanbanColumn from "./KanbanColumn";
import SettingsModal from "./settings/SettingsModal";
import TaskModal from "./task/TaskModal";
import ProjectModal from "./projects/ProjectModal";

export default function KanbanDashboard() {
  const {
    activeModal,
    config,
    tasks,
    statuses,
    changeStatus,
    setActiveModal,
    getSampleNewTask,
  } = useAppContext();

  const [editingTask, setEditingTask] = useState<Task>(() =>
    getSampleNewTask()
  );

  const handleNewTask = (status: string) => {
    setEditingTask(getSampleNewTask(status));
    setActiveModal("TASK");
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setActiveModal("TASK");
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.setData("text/plain", task.Id!);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");

    changeStatus(taskId, targetStatus);
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.Status === status);
  };

  return (
    <div className="w-full h-screen flex flex-col">
      <Header
        onNewTask={() => handleNewTask(config.Statuses[0])}
        onSettings={() => setActiveModal("SETTINGS")}
        onArchive={() => setActiveModal("ARCHIVE")}
        onProject={() => setActiveModal("PROJECT")}
      />
      <main className="w-full max-w-8xl mx-auto flex-1 flex flex-col overflow-hidden">
        <div className="w-full h-full overflow-auto flex justify-around gap-4 p-8">
          {statuses.map((status) => (
            <KanbanColumn
              key={status}
              title={status}
              tasks={getTasksByStatus(status)}
              onNewTask={() => handleNewTask(status)}
              onEditTask={handleEditTask}
              onDrop={(e) => handleDrop(e, status)}
              onDragOver={handleDragOver}
              onDragStart={handleDragStart}
            />
          ))}
        </div>

        <ArchiveModel
          isOpen={activeModal === "ARCHIVE"}
          onClose={() => setActiveModal(undefined)}
        >
          <KanbanColumn
            title={config["Workflow Statuses"]["ARCHIVE_STATUS"]}
            tasks={getTasksByStatus(
              config["Workflow Statuses"]["ARCHIVE_STATUS"]
            )}
            onNewTask={() =>
              handleNewTask(config["Workflow Statuses"]["ARCHIVE_STATUS"])
            }
            onEditTask={handleEditTask}
            onDrop={(e) =>
              handleDrop(e, config["Workflow Statuses"]["ARCHIVE_STATUS"])
            }
            onDragOver={handleDragOver}
            onDragStart={handleDragStart}
            allowCreation={false}
          />
        </ArchiveModel>

        <TaskModal
          isOpen={activeModal === "TASK"}
          onClose={() => {
            setActiveModal(undefined);
            setEditingTask(getSampleNewTask());
          }}
          task={editingTask}
        />

        <SettingsModal
          isOpen={activeModal === "SETTINGS"}
          onClose={() => setActiveModal(undefined)}
        />
        {/* renders new compenent on activeModal === "PROJECT" is true  */}
        {activeModal === "PROJECT" ? <ProjectModal
          onClose={() => setActiveModal(undefined)}
        /> : undefined }
        
      </main>
    </div>
  );
}

import React from "react";
import TaskCard from "./task/TaskCard";
import { ADD } from "../util/icons";
import { sortDsc as sortDesc } from "../util/converter";

interface KanbanColumnProps {
  title: string;
  tasks: Task[];
  onNewTask: () => void;
  onEditTask: (task: Task) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragStart: (e: React.DragEvent, task: Task) => void;
  allowCreation?: boolean;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  tasks,
  allowCreation = true,
  onNewTask,
  onEditTask,
  onDrop,
  onDragOver,
  onDragStart,
}) => {
  return (
    <div className="flex flex-col h-fit shrink-0 w-80 rounded-lg border border-slate-300">
      <div className="sticky flex items-center justify-between bg-white rounded-t-lg p-4 border-b border-slate-300">
        <div className="flex items-center space-x-2">
          <h2 className="font-semibold text-slate-800">{title}</h2>
          <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full">
            {tasks.length}
          </span>
        </div>
        {allowCreation && (
          <button
            onClick={onNewTask}
            className="text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            {ADD}
          </button>
        )}
      </div>

      <div
        className="grow p-4 space-y-3"
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        {tasks.sort(sortDesc).map((task) => (
          <div
            key={task.Id}
            draggable
            onDragStart={(e) => onDragStart(e, task)}
          >
            <TaskCard task={task} onEdit={onEditTask} />
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            <p className="text-sm">No tasks yet</p>
            <button
              onClick={onNewTask}
              className="text-blue-600 hover:text-blue-700 text-sm mt-1"
            >
              Add your first task
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;

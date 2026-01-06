import React from "react";
import { CALENDER, CLOCK, EDIT, USER } from "../../util/icons";
import useAppContext from "../../hooks/state-hooks/useAppContext";
import dayjs from "dayjs";
import { DATE_FORMAT } from "../../util/constants";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  isDragging?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, isDragging }) => {
  const { config } = useAppContext();
  const completedSubtasks = task.Subtasks.filter((st) =>
    st.includes("[x] ")
  ).length;
  const totalSubtasks = task.Subtasks.length;

  const onTaskClick = (
    e:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    onEdit(task);
  };

  return (
    <div
      onClick={onTaskClick}
      className={`cursor-pointer flex flex-col gap-6 bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow ${
        isDragging ? "opacity-50 rotate-2" : ""
      }`}
    >
      <div className="flex flex-col gap-1">
        <div className="flex flex-row justify-between">
          <span className="text-xs text-slate-500 line-clamp-1">
            #{task.Id}
          </span>
          <button onClick={onTaskClick} className="cursor-pointer text-xs">
            {EDIT}
          </button>
        </div>
        <h3 className="font-medium text-slate-800 text-md leading-tight line-clamp-1 flex-1">
          {task.Title}
        </h3>
      </div>

      {task.Description && (
        <p className="text-sm text-slate-500 line-clamp-3">
          {task.Description}
        </p>
      )}

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-1">
          <span
            className="text-xs py-1 px-2 rounded-md bg-emerald-100"
            style={{
              backgroundColor:
                config["Priority Colors"][task.Priority]?.["bg-color"],
              color: config["Priority Colors"][task.Priority]?.["text-color"],
            }}
          >
            {task.Priority}
          </span>
          {task.AssignedTo && (
            <span className="text-xs py-1 px-2 rounded-md bg-purple-200  text-purple-600">
              {USER}@{task.AssignedTo}
            </span>
          )}
          {task.Category && (
            <span className="text-xs py-1 px-2 rounded-md bg-sky-200  text-sky-600">
              {task.Category}
            </span>
          )}
          {task.Tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded"
            >
              {tag}
            </span>
          ))}
          {task.Tags.length > 3 && (
            <span className="text-xs text-slate-500">
              +{task.Tags.length - 3}
            </span>
          )}
        </div>

        {totalSubtasks > 0 && (
          <div className="flex flex-row items-center gap-2">
            <div className="flex-1 bg-slate-200 rounded-full h-1">
              <div
                className="bg-blue-600 h-full rounded-full transition-all"
                style={{
                  width: `${
                    totalSubtasks > 0
                      ? (completedSubtasks / totalSubtasks) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
            <span className="text-xs text-slate-600">
              {completedSubtasks}/{totalSubtasks}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center">
            {CALENDER} {dayjs(task.createdDate).format(DATE_FORMAT)}
          </div>
          {task.dueDate && (
            <div className="flex items-center text-orange-600">
              {CLOCK} {dayjs(task.dueDate).format(DATE_FORMAT)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;

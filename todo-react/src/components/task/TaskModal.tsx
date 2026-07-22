import useAppContext from "../../hooks/state-hooks/useAppContext";
import { CLOSE } from "../../util/icons";
import TaskForm, { toData, toFormData } from "./TaskForm";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
}

const TaskModal = ({ isOpen, onClose, task }: TaskModalProps) => {
  const { addTask, deleteTask, editTask } = useAppContext();

  const handleSaveTask = (task: Task) => {
    if (task.Id) {
      editTask(task.Id, task);
    } else {
      addTask(task);
    }
  };

  const handleClose = () => {
    onClose();
  };
  const onSubmit = (taskData: Task) => {
    handleSaveTask(taskData);
    handleClose();
  };

  const onDelete=(taskId: string)=>{
    deleteTask(taskId)
    handleClose()
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-400/30 backdrop-blur flex items-center justify-center p-4 z-50">
      <div className="bg-secondary rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            {task.Id ? "Edit Task" : "New Task"}
          </h2>
          <button
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground focus:outline-none"
          >
            {CLOSE}
          </button>
        </div>

        <TaskForm
          onCancel={handleClose}
          onDelete={()=>onDelete(task.Id!)}
          data={toFormData(task)}
          onSubmit={(data) => onSubmit(toData(data))}
        />
      </div>
    </div>
  );
};

export default TaskModal;

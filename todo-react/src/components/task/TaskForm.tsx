import { useForm, useStore } from "@tanstack/react-form";
import { ADD, CLOCK, USER, CHECK, CLOSE, DELETE } from "../../util/icons";
import useAppContext from "../../hooks/state-hooks/useAppContext";
import dayjs from "dayjs";
import { FORM_DATE_FORMAT } from "../../util/constants";

interface SubTask {
  text: string;
  completed: boolean;
}
type FormData = Omit<Task, "Subtasks" | "dueDate"> & {
  Subtasks: SubTask[];
  dueDate: string;
};

const parseSubtasksFromMarkdown = (subtasks: string[]): SubTask[] => {
  return subtasks?.length ? subtasks.map((task) => {
    const completed = task.startsWith("[x]");
    const text = task.replace(/^\[[ x]\]\s*/, "");
    return { text, completed };
  }) : [];
};

// eslint-disable-next-line react-refresh/only-export-components
export const toFormData = (task: Task): FormData => {
  const { Subtasks, dueDate, Tags, ...rest } = task;
  return {
    ...rest,
    Tags: Tags?.length ? Tags : [],
    dueDate: dueDate ? dayjs(dueDate).format(FORM_DATE_FORMAT) : dueDate,
    Subtasks: parseSubtasksFromMarkdown(Subtasks),
  };
};

// eslint-disable-next-line react-refresh/only-export-components
export const toData = (formData: FormData): Task => {
  const { Subtasks, dueDate, ...rest } = formData;
  return {
    ...rest,
    dueDate: new Date(dueDate),
    Subtasks: convertSubtasksToMarkdown(Subtasks),
  };
};

const convertSubtasksToMarkdown = (subTasks: SubTask[]): string[] => {
  return subTasks?.length ? subTasks.map((task) => `[${task.completed ? "x" : " "}] ${task.text}`) : [];
};

type FormProps = {
  data: FormData;
  onSubmit: (data: FormData) => void;
  onCancel: VoidFunction;
  onDelete: VoidFunction;
};
const TaskForm = ({ data, onSubmit, onCancel, onDelete }: FormProps) => {
  const { config } = useAppContext();
  const form = useForm({
    defaultValues: data,
    onSubmit: async ({ value }) => {
      try {
        onSubmit(value);
      } catch (error) {
        console.error("Failed to save task", error);
      }
    },
  });

  const tags = useStore(form.store, (state) => state.values.Tags);
  const subtasks = useStore(form.store, (state) => state.values.Subtasks);

  const addSubTask = () => {
    const currentSubTasks = form.getFieldValue("Subtasks");
    form.setFieldValue("Subtasks", [
      ...currentSubTasks,
      { text: "", completed: false },
    ]);
  };

  const removeSubTask = (index: number) => {
    const currentSubTasks = form.getFieldValue("Subtasks");
    form.setFieldValue(
      "Subtasks",
      currentSubTasks.filter((_, i) => i !== index)
    );
  };
  const toggleSubTask = (index: number) => {
    const currentSubTasks = form.getFieldValue("Subtasks");
    const updatedSubTasks = [...currentSubTasks];
    updatedSubTasks[index] = {
      ...updatedSubTasks[index],
      completed: !updatedSubTasks[index].completed,
    };
    form.setFieldValue("Subtasks", updatedSubTasks);
  };

  const toggleTag = (tag: string) => {
    const currentTags = form.getFieldValue("Tags");
    form.setFieldValue(
      "Tags",
      currentTags.includes(tag)
        ? currentTags.filter((t) => t !== tag)
        : [...currentTags, tag]
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-6"
      >
        <form.Field
          name="Title"
          validators={{
            onChange: ({ value }) =>
              !value?.trim() ? "Title is required" : undefined,
          }}
        >
          {(field) => (
            <div>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-foreground/80 mb-2"
              >
                Title
              </label>
              <input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-transparent"
                placeholder="e.g., Documentation Update"
              />
              {field.state.meta.errors && (
                <p className="mt-1 text-sm text-red-600">
                  {field.state.meta.errors[0]}
                </p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field name="Description">
          {(field) => (
            <div>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-foreground/80 mb-2"
              >
                Description
              </label>
              <textarea
                id={field.name}
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-transparent"
                placeholder="Describe the task..."
              />
            </div>
          )}
        </form.Field>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <form.Field name="Priority">
            {(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-foreground/80 mb-2"
                >
                  Priority
                </label>
                <select
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-transparent"
                >
                  {config.Priorities.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </form.Field>

          <form.Field name="Category">
            {(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-foreground/80 mb-2"
                >
                  Category
                </label>
                <select
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-transparent"
                >
                  <option value="">Unassigned</option>
                  {config.Categories.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </form.Field>

          <form.Field name="AssignedTo">
            {(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-foreground/80 mb-2"
                >
                  {USER} Assigned To
                </label>
                <select
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-transparent"
                >
                  <option value="">Unassigned</option>

                  {config.Users.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </form.Field>

          <form.Field name="dueDate">
            {(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-foreground/80 mb-2"
                >
                  {CLOCK} Due Date
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type="date"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-transparent"
                />
              </div>
            )}
          </form.Field>
        </div>

        <form.Field name="Status">
          {(field) => (
            <div>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-foreground/80 mb-2"
              >
                Status
              </label>
              <select
                id={field.name}
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-transparent"
              >
                {config.Statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          )}
        </form.Field>

        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {config.Tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  tags.includes(tag)
                    ? "bg-indigo-100 border-indigo-300 text-indigo-700"
                    : "bg-secondary border-border text-muted-foreground hover:bg-secondary-dark"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-foreground/80">
              Subtasks
            </label>
            <button
              type="button"
              onClick={addSubTask}
              className="inline-flex items-center px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/70"
            >
              {ADD} Add Subtask
            </button>
          </div>
          <div className="space-y-2">
            {subtasks.map((subtask, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 rounded-md"
              >
                <button
                  type="button"
                  onClick={() => toggleSubTask(index)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center border-border ${
                    subtask.completed
                      ? " text-primary"
                      : " hover:border-primary"
                  }`}
                >
                  {subtask.completed && CHECK}
                </button>
                <input
                  type="text"
                  value={subtask.text}
                  onChange={(e) => {
                    const currentSubTasks = form.getFieldValue("Subtasks");
                    const updatedSubTasks = [...currentSubTasks];
                    updatedSubTasks[index] = {
                      ...updatedSubTasks[index],
                      text: e.target.value,
                    };
                    form.setFieldValue("Subtasks", updatedSubTasks);
                  }}
                  placeholder="Enter subtask..."
                  className="flex-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => removeSubTask(index)}
                  className="text-muted-foreground hover:text-red-600"
                >
                  {CLOSE}
                </button>
              </div>
            ))}
          </div>
        </div>

        <form.Field name="Notes">
          {(field) => (
            <div>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-foreground/80 mb-2"
              >
                Notes
              </label>
              <textarea
                id={field.name}
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-transparent"
                placeholder="Additional notes..."
              />
            </div>
          )}
        </form.Field>

        <div className="flex gap-4 pt-6 items-end justify-between">
          <div className="flex flex-row gap-4">
            {data.Id && (
              <button
                type="button"
                onClick={onDelete}
                className="px-4 py-2px-4 py-2  text-red-500 bg-red-100 rounded-lg hover:bg-red-200 "
              >
                {DELETE} Delete
              </button>
            )}
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-secondary-dark text-muted-foreground rounded-md hover:bg-secondary-darker"
            >
              Cancel
            </button>
          </div>
          <div className="flex flex-row gap-4">
            <button
              type="button"
              onClick={() => form.reset()}
              className="px-4 py-2 bg-secondary-dark text-muted-foreground rounded-md hover:bg-secondary-darker"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary-dark"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;

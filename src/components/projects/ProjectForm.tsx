import { useState } from "react";
import type { Project } from "../../hooks/state-hooks/useProject";
import useProject from "../../hooks/state-hooks/useProject";
import { useAppForm } from "../../hooks/useAppForm";
import useFileHandle from "../../hooks/useFileHandler";
import { ADD, MINUS } from "../../util/icons";

export type ProjectFormData = {
  activeProjectId: string;
  projects: Project[];
};

type FormProps = {
  onCancel: VoidFunction;
  data: ProjectFormData;
  onSave:(data:ProjectFormData)=>void
};

export default function ProjectForm({ onCancel, data, onSave }: FormProps) {
  const { getSampleNewProject, deleteProject } = useProject();
  const [error, setError] = useState("");

  const form = useAppForm({
    defaultValues: data,
    onSubmit: async ({ value }) => {
      try {
        onSave(value)
      } catch (error) {
        console.error("Failed to save project", error);
      }
    },
  });

  const { isOpening, openFolder } = useFileHandle();
  const onNewProjectClick = async () => {
    setError("");
    const fileHandleResult = await openFolder();

    if ("handle" in fileHandleResult) {
      const previous = form.state.values.projects;

      let isExists = false;

      for (const item of previous) {
        if (await item.fileHandle.isSameEntry(fileHandleResult.handle)) {
          isExists = true;
          break;
        }
      }

      if (isExists) {
        setError("Already exists");
        return;
      }

      form.setFieldValue("projects", (prev) => [
        ...prev,
        getSampleNewProject(fileHandleResult.handle),
      ]);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <form
      className="h-full flex flex-col justify-between"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div className="flex">
        <div className="flex-1 min-w-sm overflow-auto flex flex-col gap-4">
          <div className="p-4 flex flex-col gap-4">
            <div className="flex">
              <form.Subscribe
                selector={(state) => state.values.projects}
                children={(projects) => (
                  <form.Field name="activeProjectId">
                    {(field) => (
                      <div className="w-full flex flex-col gap-4 px-2">
                        <label
                          htmlFor={field.name}
                          className="block text-sm font-medium text-slate-700"
                        >
                          Active Project
                        </label>
                        <div className="w-full flex flex-row gap-2 pr-2">
                          <select
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="grow px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                          >
                            {projects.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                          </select>

                          <button
                            onClick={onNewProjectClick}
                            disabled={isOpening}
                            type="button"
                            className="px-4 py-2 bg-blue-600 cursor-pointer disabled:cursor-not-allowed text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-none"
                          >
                            {isOpening ? (
                              <span className="animate-spin inline-block">
                                {ADD}
                              </span>
                            ) : (
                              <span>{ADD}</span>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </form.Field>
                )}
              />
            </div>

            <div className="flex flex-row justify-center items-center">
              {error ? (
                <span className="text-red-500 text-sm w-fit px-4">{error}</span>
              ) : (
                <span>{"   "}</span>
              )}
            </div>

            <div>
              <label
                htmlFor={"projects[0]"}
                className="block text-sm font-medium text-slate-700 p-2"
              >
                Projects
              </label>
              <form.Field name={"projects"} mode="array">
                {(field) => {
                  return (
                    <div className="w-full flex flex-col gap-4 max-h-72 overflow-y-auto">
                      {field.state.value.map((_, i) => {
                        return (
                          <form.Field key={i} name={`${field.name}[${i}]`}>
                            {(subField) => {
                              const project = subField.state.value;
                              return (
                                <div className="flex flex-row gap-2 p-2">
                                  <input
                                    name={subField.name}
                                    type="text"
                                    value={project.name}
                                    onChange={(e) =>
                                      subField.handleChange({
                                        ...project,
                                        name: e.target.value,
                                      })
                                    }
                                    onKeyDown={onKeyDown}
                                    className="grow px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                  <button
                                    type="button"
                                    disabled={
                                      data.activeProjectId === project.id
                                    }
                                    onClick={async() => {
                                      await deleteProject(project.id)
                                      field.removeValue(i);
                                    }}
                                    className="cursor-pointer px-4 py-2 text-red-500 disabled:cursor-not-allowed disabled:bg-gray-300 bg-red-100 hover:bg-red-200 rounded-lg"
                                  >
                                    {MINUS}
                                  </button>
                                </div>
                              );
                            }}
                          </form.Field>
                        );
                      })}
                      {field.state.value.length === 0 && (
                        <div className="text-center py-8 text-slate-400">
                          <p className="text-sm">
                            No {field.name.toLowerCase()} configured
                          </p>
                        </div>
                      )}
                    </div>
                  );
                }}
              </form.Field>
            </div>

            
          </div>
        </div>
      </div>

      <div className="flex gap-4 py-4 px-4 items-end justify-between border-t border-slate-200">
        <div className="flex flex-row gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer px-4 py-2 bg-slate-200 te-600xt-slate-700 rounded-md hover:bg-slate-300"
          >
            Cancel
          </button>
        </div>
        <div className="flex flex-row gap-4">
          <button
            type="button"
            onClick={() => form.reset()}
            className="cursor-pointer px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300"
          >
            Reset
          </button>
          <button
            type="submit"
            className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
}

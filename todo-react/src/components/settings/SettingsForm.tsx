import { useRef, useState } from "react";
import ArrayFields, { type TodoArrayField } from "./ArrayFields";
import { useAppForm } from "../../hooks/useAppForm";
import { PriorityColors } from "./PriorityColors";
import WordFlowStatuses from "./WordFlowStatuses";

type FormData = TodoConfig;

type FormProps = {
  data: FormData;
  onConfigChange: (value: TodoConfig, sideEffects: Change[]) => void;
  onCancel: VoidFunction;
};

export default function SettingsForm({
  data,
  onConfigChange,
  onCancel,
}: FormProps) {
  const sideEffects = useRef<Change[]>([]);

  const form = useAppForm({
    defaultValues: data,
    onSubmit: async ({ value }) => {
      try {
        onConfigChange(value, sideEffects.current);
      } catch (error) {
        console.error("Failed to save task", error);
      }
    },
  });

  const [tabs] = useState(() => Object.keys(data) as (keyof TodoConfig)[]);

  const [activeTab, setActiveTab] = useState<{
    name: keyof TodoConfig;
    isArray: boolean;
  }>(() => ({ name: tabs[0], isArray: Array.isArray(data[tabs[0]]) }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div className="flex">
        <div className="w-48 border-r border-slate-200">
          <nav className="p-4 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() =>
                  setActiveTab({ name: tab, isArray: Array.isArray(data[tab]) })
                }
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab.name === tab
                    ? "bg-blue-100 text-blue-700"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <form.AppField
          name={activeTab.name}
          children={() =>
            activeTab.isArray ? (
              <ArrayFields
                form={form}
                label={activeTab.name as TodoArrayField}
                onSideEffect={(change) => sideEffects.current.push(change)}
              />
            ) : undefined
          }
        />

        {activeTab.name === "Priority Colors" && (
          <PriorityColors form={form} fields="Priority Colors" />
        )}

        {activeTab.name === "Workflow Statuses" && (
          <WordFlowStatuses form={form} fields="Workflow Statuses" />
        )}
      </div>

      <div className="flex gap-4 py-4 px-4 items-end justify-between border-t border-slate-200">
        <div className="flex flex-row gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-slate-200 te-600xt-slate-700 rounded-md hover:bg-slate-300"
          >
            Cancel
          </button>
        </div>
        <div className="flex flex-row gap-4">
          <button
            type="button"
            onClick={() => form.reset()}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300"
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
}

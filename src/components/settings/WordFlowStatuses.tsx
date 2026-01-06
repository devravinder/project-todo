import useAppContext from "../../hooks/state-hooks/useAppContext";
import { withFieldGroup } from "../../hooks/useAppForm";

export const WordFlowStatuses = withFieldGroup({
  defaultValues: {} as TodoConfig["Workflow Statuses"], // to solve type issue
  render: function Render({ group }) {
      const { config } = useAppContext();
    
    return (
      <div className="pl-6 pr-8 py-4 flex-1 min-w-sm overflow-auto flex flex-col gap-2">
        <h3 className="px-2 text-lg font-medium text-slate-800">
          Manage Workflow
        </h3>
        <div className="flex flex-col gap-4 max-h-72 p-4 overflow-y-auto">
          {Object.keys(group.state.values).map((key) => (
            <div
              key={key}
              className="rounded-lg"
            >
              <group.Field name={key}>
                {(field) => (
                  <div>
                    <label
                      htmlFor={field.name}
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      {key}
                    </label>
                    <select
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    >
                      <option value="">Unassigned</option>
                      {config.Statuses.map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </group.Field>
            </div>
          ))}
        </div>
      </div>
    );
  },
});

export default WordFlowStatuses;

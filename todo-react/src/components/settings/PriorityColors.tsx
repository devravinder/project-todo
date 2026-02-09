/* eslint-disable @typescript-eslint/no-empty-object-type */
import { withFieldGroup } from "../../hooks/useAppForm";
import ColorInputGroup from "./ColorInputGroup";

export type Color = { "text-color": string; "bg-color": string };

export const PriorityColors = withFieldGroup({
  defaultValues: {} as TodoConfig["Priority Colors"], // to solve type issue
  render: function Render({ group }) {
    return (
      <div className="pl-6 pr-8 py-4 flex-1 min-w-md overflow-auto flex flex-col gap-2">
        <h3 className="px-2 text-lg font-medium text-slate-800">
          Manage Colors
        </h3>
        <div className="flex flex-col gap-4 min-w-lg max-h-72 overflow-auto p-4 overflow-y-auto">
          {Object.keys(group.state.values).map((key) => (
            <div key={key} className="py-4 px-4 rounded-lg border border-slate-200 shadow-md ">
              <group.Field name={key}>
                {(field) => (
                  <ColorInputGroup
                    label={key}
                    color={field.state.value}
                    onChange={field.handleChange}
                  />
                )}
              </group.Field>
            </div>
          ))}
        </div>
      </div>
    );
  },
});

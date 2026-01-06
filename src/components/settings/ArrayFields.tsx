import NewTextInput from "./NewTextInput";
import { MINUS } from "../../util/icons";
import { settingsFormOpts, withForm } from "../../hooks/useAppForm";
import { useRef } from "react";

export type TodoArrayField = ArrayKeys<TodoConfig>;

type ArrayFieldsProps = {
  label: TodoArrayField;
  onSideEffect?: (change: Change) => void;
};

const ArrayFields = withForm({
  ...settingsFormOpts,
  props: {} as ArrayFieldsProps,
  render: ({ form, label, onSideEffect }) => {
    const oldValue = useRef("");

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
      }
    };
    return (
      <div className="pl-6 pr-8 py-4 flex-1 min-w-sm overflow-auto flex flex-col gap-2">
        <h3 className="px-2 text-lg font-medium text-slate-800">
          Manage {label}
        </h3>

        <form.Field name={label} mode="array">
          {(field) => {
            return (
              <div className="flex flex-col gap-4 max-h-72 p-4 overflow-y-auto">
                <NewTextInput
                  label={label}
                  onAdd={(item) => field.pushValue(item)}
                />
                {field.state.value.map((_, i) => {
                  return (
                    <form.Field key={i} name={`${label}[${i}]`}>
                      {(subField) => {
                        return (
                          <div className="flex space-x-4">
                            <input
                              name={subField.name}
                              type="text"
                              value={subField.state.value}
                              onFocus={() => {
                                oldValue.current = subField.state.value;
                              }}
                              onBlur={() => {
                                onSideEffect?.({
                                  key: label,
                                  oldValue: oldValue.current,
                                  newValue: subField.state.value,
                                  type: "UPDATE",
                                });
                                oldValue.current = "";
                              }}
                              onChange={(e) =>
                                subField.handleChange(e.target.value)
                              }
                              onKeyDown={onKeyDown}
                              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                onSideEffect?.({
                                  key: label,
                                  oldValue: subField.state.value,
                                  type: "DELETE",
                                });

                                field.removeValue(i);
                              }}
                              className="cursor-pointer px-4 py-2 text-red-500 bg-red-100 hover:bg-red-200 rounded-lg"
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
    );
  },
});

export default ArrayFields;

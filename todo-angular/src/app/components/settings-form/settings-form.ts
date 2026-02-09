import { NgClass } from '@angular/common';
import { Component, computed, effect, input, linkedSignal, output, signal } from '@angular/core';
import { form } from '@angular/forms/signals';
import { ADD, MINUS } from '../../util/icons';
import { List, StringArrayInput } from '../string-array-input/string-array-input';
import { WorkflowStatusInput } from '../workflow-status-input/workflow-status-input';
import { PriorityColorsInput } from '../priority-colors-input/priority-colors-input';
import { getId } from '../../util/common';

type StringArrayKey = ArrayKeys<TodoConfig>;

// converts List[] value to object
const listToMap = (list: List[]) =>
  list.reduce(
    (pre, cur) => {
      pre[cur.id] = cur;
      return pre;
    },
    {} as Record<string, List>,
  );

const toMap = (input: Record<string, List[]>) => {
  return Object.keys(input).reduce(
    (map, key) => {
      map[key] = listToMap(input[key]);
      return map;
    },
    {} as Record<string, Record<string, List>>,
  );
};

const toList = (values: string[]) => values.map((value) => ({ id: getId(), value }));
const toString = (values: List[]) => values.map((ele) => ele.value);

const arrayKeys = <T extends object>(obj: T) =>
  Object.keys(obj).filter((key) => Array.isArray(obj[key as keyof T])) as ArrayKeys<T>[];

const nonArrayKeys = <T extends object>(obj: T) =>
  Object.keys(obj).filter((key) => !Array.isArray(obj[key as keyof T]));

const toListMap = (obj: TodoConfig) => {
  const keys = arrayKeys(obj);

  const res = {} as Record<StringArrayKey, List[]>;

  for (const key of keys) {
    res[key] = toList(obj[key]);
  }

  return res;
};

const revertListMap = (obj: Record<StringArrayKey, List[]>) => {
  const res = {} as Record<StringArrayKey, string[]>;

  for (const key in obj) {
    res[key as StringArrayKey] = toString(obj[key as StringArrayKey]);
  }

  return res;
};

@Component({
  selector: 'app-settings-form',
  imports: [NgClass, StringArrayInput, WorkflowStatusInput, PriorityColorsInput],
  template: `
    <div class="w-full flex-1 flex flex-col">
      <div class="flex-1 flex flex-row w-full">
        <div class="w-48 border-r border-border">
          <nav class="p-4 space-y-1 w-full">
            @for (tab of tabs(); track tab) {
              <button
                type="button"
                (click)="onTabClick(tab)"
                class="w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                [ngClass]="
                  activeTab() == tab
                    ? 'bg-primary/15 text-primary'
                    : 'text-muted-foreground hover:bg-secondary-darker'
                "
              >
                {{ tab }}
              </button>
            }
          </nav>
        </div>
        <div class="flex-1 flex flex-col gap-2 p-4 overflow-auto">
          <h3 class="text-lg font-medium text-foreground px-2">Manage {{ activeTab() }}</h3>
          <div class="flex flex-col gap-4 overflow-auto max-h-92 p-2">
            @if (activeItems().length) {
              <app-string-array-input
                [items]="activeItems()"
                (onChange)="onStringArrayChange(activeTab(), $event)"
              />
            }
            @if (activeTab() === 'Workflow Statuses') {
              <app-workflow-status-input
                [workFlow]="formData()['Workflow Statuses']"
                [statuses]="formData()['Statuses']"
                (onChange)="onWorkFlowChange($event)"
              />
            }

            @if (activeTab() === 'Priority Colors') {
              <app-priority-colors-input
                [priorityColors]="formData()['Priority Colors']"
                (onChange)="onPriorityColorChange($event)"
              />
            }
          </div>
        </div>
      </div>
      <!-- Form Actions -->
      <div class="flex w-full gap-4 p-4 px-6 items-end justify-between border-t border-border">
        <div class="flex flex-row gap-4">
          <button
            type="button"
            (click)="handleCancel()"
            class="cursor-pointer px-4 py-2 bg-secondary-dark text-muted-foreground rounded-md hover:bg-secondary-darker"
          >
            Cancel
          </button>
        </div>
        <div class="flex flex-row gap-4">
          <button
            type="button"
            (click)="handleReset()"
            class="cursor-pointer px-4 py-2 bg-secondary-dark text-muted-foreground rounded-md hover:bg-secondary-darker"
          >
            Reset
          </button>
          <button
            type="button"
            (click)="handleSubmit()"
            class="cursor-pointer px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export class SettingsForm {
  Array = Array;
  ADD = ADD;
  MINUS = MINUS;
  onCancel = output<void>();
  onSave = output<{ value: TodoConfig; changes: Change[] }>();
  data = input.required<TodoConfig>();
  readonly formData = linkedSignal(() => this.data());
  protected readonly form = form<TodoConfig>(this.formData);

  tabs = computed(() => {
    const tabs: string[] = arrayKeys(this.data());

    tabs.push(...nonArrayKeys(this.data()));

    return tabs as (keyof TodoConfig)[];
  });
  activeTab = linkedSignal<keyof TodoConfig>(() => this.tabs()[0] as keyof TodoConfig);

  // for string[]
  initialListValues = computed(() => toListMap(this.data()));

  currentListValues = linkedSignal(() => structuredClone(this.initialListValues())); // deep clone

  activeItems = computed(() => this.currentListValues()[this.activeTab() as StringArrayKey] || []);

  handleCancel() {
    this.onCancel.emit();
  }

  handleReset() {
    this.form().reset(this.data());
    this.currentListValues.set(this.initialListValues());
  }

  getChageEffects() {
    const initialMap = toMap(this.initialListValues());
    const currentMap = toMap(this.currentListValues());

    const changes: Change[] = [];

    for (let [key, obj] of Object.entries(initialMap)) {
      for (let [id, value] of Object.entries(obj)) {
        const oldValue = value.value;
        const newValue = currentMap[key][id]?.value;

        if (oldValue !== newValue) {
          if (!newValue) {
            changes.push({
              key,
              oldValue: value.value,
              type: 'DELETE',
            });
          } else {
            changes.push({
              key,
              oldValue,
              newValue,
              type: 'UPDATE',
            });
          }
        }
      }
    }

    // new

    for (let [key, obj] of Object.entries(currentMap)) {
      for (let [id, value] of Object.entries(obj)) {
        const newValue = value.value;
        const initial = initialMap[key][id];

        if (newValue && !initial) {
          changes.push({
            key,
            newValue,
            type: 'ADD',
          });
        }
      }
    }

    return changes;
  }

  handleSubmit() {
    const changes = this.getChageEffects();
    const formData = this.formData();
    const stringValues = revertListMap(this.currentListValues());
    const value = { ...formData, ...stringValues };

    this.onSave.emit({ value, changes });
  }
  onTabClick = (tab: keyof TodoConfig) => {
    this.activeTab.set(tab as StringArrayKey);
  };

  handleDependents(key: keyof TodoConfig, values: List[]) {
    // if priority Low is changed to Low-1 then 'Priority Colors' should be chaanged accordingly

    const initialListValues = this.initialListValues();
    switch (key) {
      case 'Priorities': {
        const map = listToMap(initialListValues[key]);
        for (const item of values) {
          const newValue = item.value;
          const oldValue = map[item.id]?.value;
          if (oldValue && newValue !== oldValue) {
            this.form['Priority Colors']().value.update((pre) => {
              pre[newValue] = pre[oldValue];
              delete pre[oldValue];
              return pre;
            });
          }
        }

        break;
      }
      case 'Statuses': {
        const map = listToMap(initialListValues[key]);
        for (const item of values) {
          const newValue = item.value;
          const oldValue = map[item.id]?.value;

          if (oldValue && newValue !== oldValue) {
            this.form['Workflow Statuses']().value.update((pre) => {
              for (const key in pre) {
                // work around for Type issue
                if (pre[key as 'CREATE_STATUS'] === oldValue) {
                  pre[key as 'CREATE_STATUS'] = newValue;
                }
              }

              return pre;
            });
          }
        }

        break;
      }
    }
  }

  onStringArrayChange(key: keyof TodoConfig, values: List[]) {
    this.currentListValues()[key as unknown as StringArrayKey] = values;

    // dependents
    this.handleDependents(key, values);
  }

  onWorkFlowChange(data: TodoConfig['Workflow Statuses']) {
    this.form['Workflow Statuses']().value.set(data);
  }
  onPriorityColorChange(data: TodoConfig['Priority Colors']) {
    this.form['Priority Colors']().value.set(data);
  }
}

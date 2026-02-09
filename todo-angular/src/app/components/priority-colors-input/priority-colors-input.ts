import { Component, computed, effect, input, linkedSignal, output } from '@angular/core';
import { form } from '@angular/forms/signals';
import { ColorInputGroup } from '../color-input-group/color-input-group';
type PriorityColors = TodoConfig['Priority Colors'];

@Component({
  selector: 'app-priority-colors-input',
  imports: [ColorInputGroup],
  template: `
     @for (key of keys(); track key) {
      <app-color-input-group
        [label]="key"
        [color]="formData()[key]"
        (onChange)="onInputChange(key, $event)"
      />
    }
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export class PriorityColorsInput {
  priorityColors = input.required<PriorityColors>();

  onChange = output<PriorityColors>();

  formData = linkedSignal(() => this.priorityColors());
  form = form<PriorityColors>(this.formData);

  keys = computed(() => Object.keys(this.formData()));

  onInputChange(key: keyof PriorityColors, value: Color) {
    this.form[key]().value.set(value);
    this.form().markAsDirty();
  }

  onDataChange(data: PriorityColors) {
    if (this.form().dirty()) {
      this.onChange.emit(data);
    }
  }

  constructor() {
    effect(() => {
      this.onDataChange(this.formData());
    });
  }
}

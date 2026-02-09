import { Component, effect, input, linkedSignal, output } from '@angular/core';
import { ColorPicker } from '../color-picker/color-picker';
import { ColorPreview } from '../color-preview/color-preview';
import { form } from '@angular/forms/signals';

@Component({
  selector: 'app-color-input-group',
  imports: [ColorPicker, ColorPreview],
  template: `<div class="min-w-0 flex flex-row items-start gap-4 p-4 bg-card dark:bg-secondary-darker rounded-lg border border-border shadow dark:shadow-muted-foreground/50">
    <app-color-preview [label]="label()" [color]="formData()" />
    <app-color-picker
      label="Text Color"
      [value]="formData()['text-color']"
      (onChange)="onInputChange('text-color', $event)"
    />
    <app-color-picker
      label="Bg Color"
      [value]="formData()['bg-color']"
      (onChange)="onInputChange('bg-color', $event)"
    />
  </div> `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export class ColorInputGroup {
  color = input<Color>({ 'text-color': '#ffffff', 'bg-color': '#3b82f6' });
  label = input<string>('Label');
  onChange = output<Color>();

  formData = linkedSignal(() => this.color());
  form = form(this.formData);

  onInputChange(key: keyof Color, value: string) {
    this.form[key]().value.set(value);
    this.form().markAsDirty();
  }

  onDataChange(color: Color) {
    if (this.form().dirty()) {
      this.onChange.emit(color);
    }
  }

  constructor() {
    effect(() => {
      this.onDataChange(this.formData());
    });
  }
}

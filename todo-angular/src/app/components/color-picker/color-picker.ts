// color-picker.component.ts
import { Component, effect, input, linkedSignal, output } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-color-picker',
  standalone: true,
  imports: [FormField],
  template: `
    <div class="min-w-0 flex flex-col gap-2">
      <label class="text-sm font-medium text-foreground">
        {{ label() }}
      </label>

      <div
        class="flex flex-row gap-2 items-center justify-between 
                  px-4 py-2 rounded-md border border-border 
                  focus-within:ring-2 focus-within:ring-primary/70 
                  focus-within:border-primary/50 transition-all"
      >
        <!-- Color swatch picker -->
        <input
          type="color"
          [formField]="form"
          class="appearance-none w-7 h-7 shrink-0 rounded-md border border-muted cursor-pointer p-0"
        />

        <!-- Hex input -->
        <input
          type="text"
          [value]="text()"
          (change)="onHexChange($event)"
          placeholder="#000000"
          maxlength="7"
          class="min-w-24 flex-1 px-3 py-1.5 text-sm bg-transparent focus:outline-none"
        />
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
export class ColorPicker {
  value = input.required<string>();
  label = input.required<string>();
  onChange = output<string>();

  text = linkedSignal(() => this.value());
  form = form<string>(this.text);

  onHexChange(event: Event) {
    const value = (event.target as HTMLInputElement).value.trim().toUpperCase();

    let val = value.trim();

    // Auto-add # if missing
    if (!val.startsWith('#')) {
      val = '#' + val;
    }

    // Only accept valid hex (0–6 chars after #)
    if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
      this.text.set(val);
    }
  }

  onInputChange(data: string) {
    if (this.form().dirty()) {
      this.onChange.emit(data);
    }
  }
  constructor() {
    effect(() => this.onInputChange(this.text()));
  }
}

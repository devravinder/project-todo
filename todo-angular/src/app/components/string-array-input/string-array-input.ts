import { Component, effect, input, linkedSignal, output, signal } from '@angular/core';
import { ADD, MINUS } from '../../util/icons';
import { form, FormField } from '@angular/forms/signals';
import { getId } from '../../util/common';
export type List = { id: string; value: string };

@Component({
  selector: 'app-string-array-input',
  imports: [FormField],
  template: `
    <div class="w-full flex flex-row gap-2">
      <input
        type="text"
        [formField]="textForm"
        (keyup.enter)="onNewTextAdd()"
        class="w-full px-3 py-2 border border-muted-foreground/30 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-transparent"
      />
      <button
        type="button"
        (click)="onNewTextAdd()"
        class="px-4 py-2 bg-primary cursor-pointer disabled:cursor-not-allowed text-accent-foreground rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-none"
      >
        {{ ADD }}
      </button>
    </div>

    @for (item of formData(); track item.id; let index = $index) {
      <div class="w-full flex flex-row gap-2">
        <input
          type="text"
          [value]="item.value"
          (blur)="updateItem(index, $event)"
          class="w-full px-3 py-2 border border-muted-foreground/30 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-transparent"
        />
        <button
          type="button"
          (click)="onArrayItemDelete(index)"
          class="cursor-pointer px-4 py-2 text-red-500 disabled:cursor-not-allowed disabled:bg-muted-foreground bg-red-200 hover:bg-red-300 rounded-lg"
        >
          {{ MINUS }}
        </button>
      </div>
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
export class StringArrayInput {
  ADD = ADD;
  MINUS = MINUS;
  onChange = output<List[]>();

  items = input.required<List[]>();

  formData = linkedSignal(() => this.items());
  form = form<List[]>(this.formData);

  text = signal('');
  textForm = form<string>(this.text);

  onArrayItemDelete(index: number) {
    this.form().value.update((pre) => pre.filter((_, i) => i !== index));
    this.form().markAsDirty();
  }
  onNewTextAdd() {
    const value = this.text();
    if (!value) return;
    this.formData.update((pre) => [{ id: getId(), value }, ...pre]);

    this.form().markAsDirty();

    this.text.set('');
  }

  updateItem(index: number, event: Event){
    const value = (event.target as HTMLInputElement).value.trim()
    this.form[index]().value.update( pre=> {
      pre.value = value
      return pre
    } )
    this.form().markAsDirty();
  }
  onDataChange(items: List[]) {
    if (this.form().dirty()) this.onChange.emit(items);
  }

  constructor() {
    effect(() => {
      this.onDataChange(this.formData());
    });
  }
}

import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button-primary',
  imports: [],
  template: `<button
    (click)="onClick.emit()"
    class="cursor-pointer inline-flex items-center px-3 py-2 bg-primary text-sm font-medium rounded-lg text-accent hover:bg-primary-dark focus:outline-none focus:ring-none transition-colors"
  >
    {{ label() }}
  </button>`,
  styles: ``,
})
export class ButtonPrimary {
  label = input('Button');
  onClick = output();
}

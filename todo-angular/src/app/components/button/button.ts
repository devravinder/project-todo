import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  template: `<button
    (click)="onClick.emit()"
    class="cursor-pointer inline-flex items-center px-3 py-2 bg-secondary hover:bg-secondary-dark text-sm font-medium rounded-lg focus:outline-none focus:ring-none transition-colors"
  >
    {{ label() }}
  </button>`,
  styles: ``,
})
export class Button {
  label = input('Button');
  onClick = output();
}

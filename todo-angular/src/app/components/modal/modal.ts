import { Component, input, output } from '@angular/core';
import { CLOSE } from '../../util/icons';

@Component({
  selector: 'app-modal',
  imports: [],
  template: `
    @if (isOpen()) {
      <div
        class="fixed inset-0 bg-gray-400/30 backdrop-blur flex items-center justify-center p-4 z-50"
      >
        <div
          class="relative flex flex-col justify-start items-center bg-secondary rounded-lg w-full h-full max-w-3xl max-h-[90vh] overflow-y-auto"
        >
          @if (title()) {
            <div
              class="flex items-center justify-between p-6 border-b border-border w-full"
            >
              <h2 class="text-lg font-semibold">
                {{ title() }}
              </h2>
            </div>
          }

          <button
            (click)="onClose.emit()"
            class="absolute top-4 right-8 px-3 py-1 rounded-full cursor-pointer text-xl text-muted-foreground/80 hover:text-muted-foreground hover:bg-secondary-dark focus:outline-none"
          >
            {{ CLOSE }}
          </button>

          <ng-content />
        </div>
      </div>
    }
  `,
  styles: ``,
})
export class Modal {
  CLOSE = CLOSE;
  title = input<string>();
  isOpen = input.required<boolean>();

  onClose = output();
}

import { Component, input } from '@angular/core';
import { NgStyle } from '@angular/common';

type Color = {
  'bg-color': string; // e.g. '#3b82f6'
  'text-color': string; // e.g. '#ffffff'
};

@Component({
  selector: 'app-color-preview',
  standalone: true,
  imports: [NgStyle],
  template: `
    <div class="min-w-0 flex flex-col gap-2 items-center shrink-0">
      <span class="text-sm font-medium text-foreground">{{ label() }}</span>

      <div
        class="inline-flex text-xs flex-row gap-2 items-center justify-between 
                  px-4 py-2.5 rounded-md border border-border "
      >
        <span
          class="text-xs leading-4 py-1 px-2 rounded-md whitespace-nowrap"
          [ngStyle]="{
            'background-color': color()['bg-color'],
            color: color()['text-color'],
          }"
        >
          {{ label() }}
        </span>
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
export class ColorPreview {
  label = input.required<string>();
  color = input.required<Color>();
}

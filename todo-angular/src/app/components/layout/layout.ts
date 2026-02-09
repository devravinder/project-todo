import { Component } from '@angular/core';
import { Header } from '../header/header';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [Header, RouterOutlet],
  template: `
    <div class="w-full h-screen flex flex-col">
      <app-header class="w-full border-b shadow border-border px-4 py-3" />
      <main class="w-full max-w-8xl mx-auto flex-1 flex flex-col overflow-hidden">
        <div class="w-full h-full overflow-auto flex justify-around gap-4 p-8">
          <router-outlet />
        </div>
      </main>
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
export class Layout {}

export default Layout;

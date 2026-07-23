import { Component, inject, signal } from '@angular/core';
import { ProjectService } from '../../services/project/project.service';
import { FileHandleService } from '../../services/util/file-handle/file-handle.service';
import { fileErrorMessages, welcomeData } from '../../util/constants';
import { FOLDER, LOADING, STORE } from '../../util/icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  template: `
    <div class="flex-1 flex items-center justify-center bg-background">
      <div
        class="rounded-lg w-full h-full sm:h-10/12 sm:w-10/12 md:w-8/12 md:h-10/12 p-6 sm:p-10 md:p-16 lg:p-20 overflow-y-auto flex flex-col gap-8 items-center"
      >
        <h2 class="text-4xl font-serif font-semibold text-foreground">
          {{ welcomeData.header }}
        </h2>

        <div class="flex flex-col gap-4 w-full">
          <div class="flex flex-wrap justify-center gap-4">
            <button
              (click)="onClick()"
              [disabled]="isOpening() || !isFileSystemSupported"
              [title]="
                isFileSystemSupported ? '' : 'Your browser does not support local folder storage'
              "
              class="cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 rounded-lg w-56 px-12 py-3 bg-primary text-accent"
            >
              @if (isOpening()) {
                <span class="inline-block animate-spin">{{ LOADING }}</span>
              } @else {
                <span>{{ FOLDER }}</span>
              }
              Use Local Folder
            </button>

            <button
              (click)="onMemoryClick()"
              [disabled]="isOpening()"
              class="cursor-pointer disabled:cursor-not-allowed rounded-lg w-56 px-12 py-3 bg-secondary-dark text-foreground"
            >
              <span>{{ STORE }}</span>
              Use Browser Storage
            </button>
          </div>

          <div class="flex justify-center">
            @if (fileError()) {
              <span class="text-red-500 text-sm w-fit px-4">
                {{ fileErrorMessages[fileError()!.name] || fileError()!.message }}
              </span>
            }
          </div>
        </div>

        <div class="text-muted-foreground">
          {{ welcomeData.subTitle }}
        </div>

        <div class="w-full xl:w-8/12 rounded-xl p-8 flex flex-col gap-8">
          <div class="text-xl font-semibold text-foreground">
            {{ welcomeData.notes.header }}
          </div>

          <ol class="list-decimal list-inside flex flex-col gap-1">
            @for (item of welcomeData.notes.items; track item) {
              <li class="text-sm text-accent-foreground/60">
                {{ item }}
              </li>
            }
          </ol>

          <div class="text-md font-semibold text-accent-foreground/70">
            {{ welcomeData.notes.footer }}
          </div>
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
export class Welcome {
  private fileService = inject(FileHandleService);
  private projectService = inject(ProjectService);
  router = inject(Router);

  fileError = signal<FileError | undefined>(undefined);

  isOpening = this.fileService.isOpening;

  welcomeData = welcomeData;
  fileErrorMessages = fileErrorMessages;

  FOLDER = FOLDER;
  LOADING = LOADING;
  STORE = STORE;

  isFileSystemSupported = 'showDirectoryPicker' in window;

  async onClick() {
    this.fileError.set(undefined);
    const result = await this.fileService.openFolder();
    if ('handle' in result) {
      this.projectService.onNewProjectSelect(result.handle, result.path);
      this.router.navigate(['', '']);
    } else {
      this.fileError.set(result.error);
      this.projectService.onProjectFileError(result.error);
    }
  }

  async onMemoryClick() {
    this.fileError.set(undefined);
    await this.projectService.onNewMemoryProjectSelect();
    this.router.navigate(['', '']);
  }
}

export default Welcome;

import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ThemeService } from '../../services/theme/theme.service';
import { NEW } from '../../util/constants';
import { ADD, ARCHIVE, FOLDER, MOON, SETTINGS, SUN } from '../../util/icons';
import { ButtonPrimary } from '../button-primary/button-primary';
import { Button } from '../button/button';
import { ProjectService } from '../../services/project/project.service';
@Component({
  selector: 'app-header',
  imports: [Button, ButtonPrimary, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto flex flex-row items-center justify-between">
      <div (click)="navigateToHome()" class="flex items-center space-x-3 cursor-pointer">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-sm">
            <img src="./favicon.png" />
          </span>
        </div>
        <h1 class="text-xl font-semibold text-foreground">{{projectName()}}</h1>
      </div>

      <div class="flex items-center space-x-2">
        <app-button-primary [routerLink]="['', NEW]" [label]="ADD + ' New Task'" />
        <app-button [routerLink]="['', 'projects']" [label]="FOLDER" />
        <app-button [routerLink]="['', 'archive']" [label]="ARCHIVE" />
        <app-button [routerLink]="['', 'settings']" [label]="SETTINGS" />
        <app-button
          (onClick)="themeService.toggleTheme()"
          [label]="themeService.theme() == 'dark' ? SUN : MOON"
        />
      </div>
    </div>
  `,
  styles: ``,
})
export class Header {
  ADD = ADD;
  FOLDER = FOLDER;
  ARCHIVE = ARCHIVE;
  SETTINGS = SETTINGS;
  SUN = SUN;
  MOON = MOON;
  NEW = NEW

  private router = inject(Router);

  themeService = inject(ThemeService);
  projectService = inject(ProjectService)
  projectName = computed(()=> this.projectService.activeProject()?.name!)

  navigateToHome() {
    this.router.navigate(['/']);
  }
}

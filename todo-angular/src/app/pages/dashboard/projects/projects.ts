import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  ResolveFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Modal } from '../../../components/modal/modal';
import { ProjectForm, ProjectFormData } from '../../../components/project-form/project-form';
import { ProjectService } from '../../../services/project/project.service';

export const projectResolver: ResolveFn<ProjectFormData> = async(
  route: ActivatedRouteSnapshot,
  _: RouterStateSnapshot, // state
) => {
  const projectService = inject(ProjectService);

  const projects = await projectService.getProjects();

  const activeProjectId = projectService.activeProject()?.id!;

  return { activeProjectId, projects };
};

@Component({
  selector: 'app-projects',
  imports: [ProjectForm, Modal],
  template: `
    <app-modal [isOpen]="true" (onClose)="goToParent()" title="Manage Projects" class="absolute">
      <app-project-form [data]="formData()" (onCancel)="goToParent()" (onSave)="onSubmit($event)" />
    </app-modal>
  `,
  styles: ``,
})
export class Projects {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  projectService = inject(ProjectService);

  data = toSignal(this.route.data);
  formData = computed(() => this.data()!['formData'] as ProjectFormData);


  goToParent() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  async onSubmit(data: ProjectFormData) {

    const activeProject = this.projectService.activeProject()!

    for (const project of data.projects) {
      await this.projectService.updateProject(project);
    }

    if (data.activeProjectId !== activeProject.id) {
      const newActiveProject = data.projects.find(
        (p) => p.id === data.activeProjectId
      );
      this.projectService.switchActiveProject(newActiveProject!);
    } else {
      const isNameChanged = data.projects.findIndex(
        (old) => old.id === activeProject.id && old.name !== activeProject.name
      );
      if (isNameChanged >= 0) {
        this.projectService.switchActiveProject(data.projects[isNameChanged]);
      }
    }

    this.goToParent();
  }
}

export default Projects;
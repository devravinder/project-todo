import { inject, Injectable, signal } from '@angular/core';
import db from '../../util/db';
import { getId } from '../../util/common';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  activeProject = signal<Project | undefined>(undefined);
  router = inject(Router)

  getSampleNewProject = (fileHandle: FileSystemFileHandle, path: string) => {
    const id = getId(4);
    const project: Project = {
      id,
      path,
      name: `Todo-${id}`,
      type: fileHandle.name.includes('.md') ? 'md' : 'json',
      fileHandle,
      env: 'LOCAL',
      lastAccessed: new Date().getTime() - 1,
    };
    return project;
  };

  onNewProjectSelect = async (fileHandle: FileSystemFileHandle, path: string) => {
    const project: Project = this.getSampleNewProject(fileHandle, path);
    this.addProject(project);
    this.activeProject.set(project);
  };

  async addProject(project: Project) {
    return db.projects.add(project);
  }

  async deleteProject(id: string) {
    return db.projects.delete(id);
  }
  updateProject = async (project: Project) => db.projects.put(project);

  async getLatestProject() {
    return db.projects.orderBy('lastAccessed').reverse().first();
  }

  async getProjects(){
    return db.projects.orderBy('lastAccessed').toArray()
  }

  switchActiveProject = async (project: Project) => {
    project.lastAccessed = new Date().getTime();
    this.activeProject.set(project);
    await this.updateProject(project);
  };

  onProjectFileError = async (error: FileError, project?: Project) => {
    console.log('error while reading ', error);
    if (project && (error?.name === 'NotFoundError' || error?.name === 'NotAllowedError')) {
      await this.deleteProject(project.id);
      this.router.navigate(['welcome'])
    }
  };

  async getActiveProject() {
    if (this.activeProject()) return this.activeProject();
    const project = await this.getLatestProject();
    if (project) {
      this.activeProject.set(project);
    }

    return this.activeProject();
  }
}
